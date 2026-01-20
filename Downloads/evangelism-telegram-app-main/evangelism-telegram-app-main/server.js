import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pg from 'pg';
import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/evangelism'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
};

// Auth routes
app.post('/auth/verify-invite', async (req, res) => {
  const { code } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT * FROM invite_codes WHERE code = $1 AND is_active = true AND (expires_at IS NULL OR expires_at > NOW())',
      [code]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired invite code' });
    }
    
    const invite = result.rows[0];
    if (invite.used_count >= invite.max_uses) {
      return res.status(400).json({ error: 'Invite code has been fully used' });
    }
    
    res.json({ valid: true, type: invite.type });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/register', async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email(),
    telegramId: Joi.number(),
    language: Joi.string().valid('en', 'am', 'om', 'ti').default('en'),
    inviteCode: Joi.string().required()
  });
  
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  
  const { name, email, telegramId, language, inviteCode } = value;
  
  try {
    // Verify invite code
    const inviteResult = await pool.query(
      'SELECT * FROM invite_codes WHERE code = $1 AND is_active = true',
      [inviteCode]
    );
    
    if (inviteResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid invite code' });
    }
    
    const invite = inviteResult.rows[0];
    
    // Create user
    const userResult = await pool.query(
      'INSERT INTO users (name, email, telegram_id, role, language) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, telegramId, invite.type, language]
    );
    
    // Update invite usage
    await pool.query(
      'UPDATE invite_codes SET used_count = used_count + 1 WHERE id = $1',
      [invite.id]
    );
    
    const user = userResult.rows[0];
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Simple login for demo - in production use proper password hashing
  if (email === 'admin@example.com' && password === 'admin123') {
    const token = jwt.sign(
      { id: '550e8400-e29b-41d4-a716-446655440000', role: 'admin' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: '550e8400-e29b-41d4-a716-446655440000', 
        name: 'Admin User', 
        email: 'admin@example.com', 
        role: 'admin' 
      } 
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Topic routes
app.get('/topics', authenticateToken, async (req, res) => {
  try {
    let query = 'SELECT * FROM topics WHERE published = true';
    let params = [];
    
    if (req.user.role === 'user') {
      query = `
        SELECT t.* FROM topics t 
        JOIN user_topics ut ON t.id = ut.topic_id 
        WHERE ut.user_id = $1 AND t.published = true
      `;
      params = [req.user.id];
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

app.get('/topics/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM topics WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// Admin routes
app.post('/admin/topics', authenticateToken, requireAdmin, async (req, res) => {
  const { title, summary, contentHtml, verses, media, quiz, difficulty, category } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO topics (title, summary, content_html, verses, media, quiz, difficulty, category, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, summary, contentHtml, JSON.stringify(verses), JSON.stringify(media), JSON.stringify(quiz), difficulty, category, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

app.get('/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.*, 
        COUNT(ut.topic_id) as assigned_topics,
        COUNT(CASE WHEN ut.completed = true THEN 1 END) as completed_topics
      FROM users u 
      LEFT JOIN user_topics ut ON u.id = ut.user_id 
      GROUP BY u.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/admin/generate-invite', authenticateToken, requireAdmin, async (req, res) => {
  const { type, maxUses = 1, expiresIn } = req.body;
  const code = Math.random().toString(36).substring(2, 15).toUpperCase();
  
  try {
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000) : null;
    
    const result = await pool.query(
      'INSERT INTO invite_codes (code, type, max_uses, expires_at, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [code, type, maxUses, expiresAt, req.user.id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate invite code' });
  }
});

// Message routes
app.post('/messages', authenticateToken, async (req, res) => {
  const { content } = req.body;
  
  try {
    const userResult = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
    const userName = userResult.rows[0]?.name || 'Unknown User';
    
    const result = await pool.query(
      'INSERT INTO messages (user_id, user_name, content) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, userName, content]
    );
    
    io.emit('new_message', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/admin/messages', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/admin/reply', authenticateToken, requireAdmin, async (req, res) => {
  const { messageId, reply } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE messages SET reply = $1, reply_at = NOW(), read = true WHERE id = $2 RETURNING *',
      [reply, messageId]
    );
    
    io.emit('message_reply', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reply to message' });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});