-- Create database schema for Evangelism Onboarding System

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telegram_id BIGINT UNIQUE,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'am', 'om', 'ti')),
    onboarding_complete BOOLEAN DEFAULT false,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Invite codes table
CREATE TABLE invite_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('user', 'admin')),
    usage_type VARCHAR(20) DEFAULT 'single' CHECK (usage_type IN ('single', 'multi')),
    max_uses INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Topics table
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content_html TEXT,
    verses JSONB DEFAULT '[]',
    media JSONB DEFAULT '[]',
    quiz JSONB DEFAULT '[]',
    difficulty VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    languages VARCHAR(20)[] DEFAULT ARRAY['en'],
    category VARCHAR(100),
    published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User topic assignments and progress
CREATE TABLE user_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed BOOLEAN DEFAULT false,
    assigned_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    UNIQUE(user_id, topic_id)
);

-- Messages between users and admins
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    reply TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    reply_at TIMESTAMP
);

-- Admin activity logs
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_active ON invite_codes(is_active);
CREATE INDEX idx_topics_published ON topics(published);
CREATE INDEX idx_user_topics_user_id ON user_topics(user_id);
CREATE INDEX idx_user_topics_topic_id ON user_topics(topic_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_read ON messages(read);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);

-- Insert seed data
INSERT INTO users (id, name, email, role, onboarding_complete) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin@example.com', 'admin', true);

INSERT INTO invite_codes (code, type, usage_type, max_uses, created_by) VALUES 
('ADMIN2024', 'admin', 'single', 1, '550e8400-e29b-41d4-a716-446655440000'),
('WELCOME2024', 'user', 'multi', 100, '550e8400-e29b-41d4-a716-446655440000');

INSERT INTO topics (id, title, summary, content_html, verses, quiz, published, created_by) VALUES 
('660e8400-e29b-41d4-a716-446655440000', 'Introduction to Faith', 'Basic principles of Christian faith', '<h1>Welcome to Faith</h1><p>This lesson covers the fundamentals...</p>', 
'[{"book": "John", "chapter": 3, "verse": "16", "text": "For God so loved the world..."}]',
'[{"q": "What is faith?", "options": ["Belief", "Hope", "Love", "All of the above"], "answerIndex": 3, "explanation": "Faith encompasses belief, hope, and love."}]',
true, '550e8400-e29b-41d4-a716-446655440000');