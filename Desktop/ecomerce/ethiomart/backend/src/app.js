const express = require('express');
const cors = require('cors');
const routes = require('../routes');

const app = express();

app.use(cors());
app.use(express.json());

// Basic health route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Mount API routes (routes/index.js should export a router)
if (routes && typeof routes === 'function') {
  app.use('/api', routes());
}

module.exports = app;
