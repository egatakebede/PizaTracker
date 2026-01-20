// Test Suite for Evangelism Onboarding System

import { test, expect } from '@playwright/test';

// API Base URL
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Test Data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  language: 'en',
  inviteCode: 'WELCOME2024'
};

const adminCredentials = {
  email: 'admin@example.com',
  password: 'admin123'
};

// Unit Tests for Backend API
describe('Backend API Tests', () => {
  
  test('Health check endpoint', async () => {
    const response = await fetch(`${API_URL}/health`);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  test('Verify invite code', async () => {
    const response = await fetch(`${API_URL}/auth/verify-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'WELCOME2024' })
    });
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.valid).toBe(true);
    expect(data.type).toBe('user');
  });

  test('Admin login', async () => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminCredentials)
    });
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.token).toBeDefined();
    expect(data.user.role).toBe('admin');
  });

  test('User registration with invite code', async () => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.token).toBeDefined();
    expect(data.user.name).toBe(testUser.name);
    expect(data.user.role).toBe('user');
  });

  test('Protected route without token', async () => {
    const response = await fetch(`${API_URL}/topics`);
    expect(response.status).toBe(401);
  });

  test('Admin-only route with user token', async () => {
    // First register a user
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...testUser, email: 'user2@example.com' })
    });
    
    const { token } = await registerResponse.json();
    
    // Try to access admin route
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    expect(response.status).toBe(403);
  });

});

// Integration Tests
describe('Integration Tests', () => {
  
  let adminToken;
  let userToken;
  let userId;
  let topicId;

  beforeAll(async () => {
    // Get admin token
    const adminResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminCredentials)
    });
    const adminData = await adminResponse.json();
    adminToken = adminData.token;

    // Register test user
    const userResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...testUser, email: 'integration@example.com' })
    });
    const userData = await userResponse.json();
    userToken = userData.token;
    userId = userData.user.id;
  });

  test('Complete user journey: Register → Assign Topic → Complete → Message', async () => {
    // 1. Admin creates a topic
    const topicResponse = await fetch(`${API_URL}/admin/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Test Topic',
        summary: 'A test topic for integration testing',
        contentHtml: '<p>Test content</p>',
        verses: [{ book: 'John', chapter: 1, verse: '1', text: 'In the beginning...' }],
        quiz: [{ q: 'Test question?', options: ['A', 'B'], answerIndex: 0, explanation: 'Test' }],
        difficulty: 'beginner',
        category: 'test'
      })
    });
    
    expect(topicResponse.status).toBe(200);
    const topic = await topicResponse.json();
    topicId = topic.id;

    // 2. Admin assigns topic to user
    const assignResponse = await fetch(`${API_URL}/admin/assign-topic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        userId: userId,
        topicId: topicId
      })
    });
    
    expect(assignResponse.status).toBe(200);

    // 3. User views assigned topics
    const topicsResponse = await fetch(`${API_URL}/topics`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    expect(topicsResponse.status).toBe(200);
    const topics = await topicsResponse.json();
    expect(topics.some(t => t.id === topicId)).toBe(true);

    // 4. User sends message to admin
    const messageResponse = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        content: 'I have a question about the lesson'
      })
    });
    
    expect(messageResponse.status).toBe(200);
    const message = await messageResponse.json();

    // 5. Admin views messages
    const messagesResponse = await fetch(`${API_URL}/admin/messages`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    expect(messagesResponse.status).toBe(200);
    const messages = await messagesResponse.json();
    expect(messages.some(m => m.id === message.id)).toBe(true);

    // 6. Admin replies to message
    const replyResponse = await fetch(`${API_URL}/admin/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        messageId: message.id,
        reply: 'Great question! Here is the answer...'
      })
    });
    
    expect(replyResponse.status).toBe(200);
  });

});

// End-to-End Tests with Playwright
describe('E2E Tests', () => {

  test('User can complete onboarding flow', async ({ page }) => {
    // Navigate to app
    await page.goto('/');
    
    // Click "Start Learning" button
    await page.click('text=Start Learning');
    
    // Fill registration form
    await page.fill('input[placeholder*="name"]', 'E2E Test User');
    await page.selectOption('select', 'en');
    await page.fill('input[placeholder*="invite"]', 'WELCOME2024');
    await page.click('button[type="submit"]');
    
    // Should redirect to user dashboard
    await expect(page).toHaveURL(/.*user-app/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('Admin can manage topics', async ({ page }) => {
    // Navigate to admin login
    await page.goto('/');
    await page.click('text=Admin Login');
    
    // Login as admin
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/.*admin-app/);
    
    // Navigate to topics management
    await page.click('text=Topics');
    
    // Create new topic
    await page.click('text=Add Topic');
    await page.fill('input[placeholder*="title"]', 'E2E Test Topic');
    await page.fill('textarea[placeholder*="summary"]', 'Test summary');
    await page.click('button[type="submit"]');
    
    // Topic should appear in list
    await expect(page.locator('text=E2E Test Topic')).toBeVisible();
  });

  test('Real-time messaging works', async ({ page, context }) => {
    // Open two pages - one for user, one for admin
    const userPage = page;
    const adminPage = await context.newPage();
    
    // Login user
    await userPage.goto('/');
    await userPage.click('text=Start Learning');
    // ... complete user login
    
    // Login admin
    await adminPage.goto('/');
    await adminPage.click('text=Admin Login');
    // ... complete admin login
    
    // User sends message
    await userPage.click('text=Contact');
    await userPage.fill('textarea', 'Test real-time message');
    await userPage.click('button[type="submit"]');
    
    // Admin should see message in real-time
    await adminPage.click('text=Messages');
    await expect(adminPage.locator('text=Test real-time message')).toBeVisible();
  });

});

// Load Testing with k6
export const loadTestScript = `
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 50 }, // Ramp up to 50 users
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
};

const BASE_URL = '${API_URL}';

export default function() {
  // Test health endpoint
  let response = http.get(\`\${BASE_URL}/health\`);
  check(response, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Test invite verification
  response = http.post(\`\${BASE_URL}/auth/verify-invite\`, 
    JSON.stringify({ code: 'WELCOME2024' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(response, {
    'invite verification status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
`;

// Performance Monitoring
export const performanceTest = {
  // Lighthouse CI configuration
  lighthouse: {
    ci: {
      collect: {
        url: ['http://localhost:3000'],
        numberOfRuns: 3
      },
      assert: {
        assertions: {
          'categories:performance': ['warn', { minScore: 0.8 }],
          'categories:accessibility': ['error', { minScore: 0.9 }],
          'categories:best-practices': ['warn', { minScore: 0.8 }],
          'categories:seo': ['warn', { minScore: 0.8 }]
        }
      }
    }
  }
};

// Test Utilities
export const testUtils = {
  // Generate test data
  generateUser: (overrides = {}) => ({
    name: 'Test User',
    email: \`test\${Date.now()}@example.com\`,
    language: 'en',
    inviteCode: 'WELCOME2024',
    ...overrides
  }),

  // API helpers
  async loginAdmin() {
    const response = await fetch(\`\${API_URL}/auth/login\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminCredentials)
    });
    const data = await response.json();
    return data.token;
  },

  async createTestTopic(token) {
    const response = await fetch(\`\${API_URL}/admin/topics\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      },
      body: JSON.stringify({
        title: 'Test Topic',
        summary: 'Test summary',
        contentHtml: '<p>Test content</p>',
        verses: [],
        quiz: [],
        difficulty: 'beginner'
      })
    });
    return response.json();
  }
};

console.log('Test suite ready. Run with: npm test');