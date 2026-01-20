# Deployment Guide - Telegram Mini-App

## Prerequisites
- Node.js 18+
- PostgreSQL database
- Telegram Bot Token
- Domain with HTTPS

## 1. Database Setup (Railway/Render)

### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway init
railway add postgresql

# Get database URL
railway variables
```

### Apply Database Schema
```bash
# Connect to your database and run:
psql $DATABASE_URL -f database.sql
```

## 2. Backend Deployment (Render)

### Create render.yaml
```yaml
services:
  - type: web
    name: evangelism-backend
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: evangelism-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: BOT_TOKEN
        sync: false
      - key: WEBAPP_URL
        sync: false
```

### Environment Variables
```bash
# Set in Render dashboard:
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
BOT_TOKEN=your-telegram-bot-token
WEBAPP_URL=https://your-frontend.vercel.app
ADMIN_TELEGRAM_IDS=123456789,987654321
```

## 3. Frontend Deployment (Vercel)

### Install Vercel CLI
```bash
npm i -g vercel
```

### Deploy
```bash
# In frontend directory
vercel --prod
```

### Environment Variables
```bash
# Set in Vercel dashboard:
VITE_API_URL=https://your-backend.render.com
```

## 4. Bot Deployment

### Create separate bot service on Render
```yaml
services:
  - type: web
    name: evangelism-bot
    env: node
    buildCommand: npm install
    startCommand: node bot.js
    envVars:
      - key: BOT_TOKEN
        sync: false
      - key: API_URL
        value: https://your-backend.render.com
      - key: WEBAPP_URL
        value: https://your-frontend.vercel.app
```

## 5. Telegram Bot Setup

### Create Bot
1. Message @BotFather on Telegram
2. Use `/newbot` command
3. Get bot token
4. Set webhook: `/setwebhook`

### Configure Mini-App
```bash
# Set bot commands
/setcommands
start - Start the bot
verify - Verify invite code
admin - Admin panel (for admins only)

# Set Mini-App URL
/newapp
# Follow prompts to set your Vercel URL
```

## 6. Security Configuration

### CORS Setup
```javascript
// In server.js
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://web.telegram.org'
  ],
  credentials: true
}));
```

### CSP Headers
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://telegram.org"],
      connectSrc: ["'self'", "wss:", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

## 7. Monitoring & Health Checks

### Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### Set up monitoring
- UptimeRobot for uptime monitoring
- Sentry for error tracking
- Railway/Render built-in metrics

## 8. Backup Strategy

### Database Backups
```bash
# Daily backup script
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Upload to cloud storage (AWS S3, Google Cloud, etc.)
```

## 9. CI/CD with GitHub Actions

### .github/workflows/deploy.yml
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

## 10. Testing Checklist

### Manual Testing
- [ ] Bot responds to /start
- [ ] Mini-App opens from Telegram
- [ ] User registration with invite code works
- [ ] Admin login works
- [ ] Topic creation and assignment
- [ ] Real-time messaging
- [ ] Progress tracking
- [ ] Mobile responsiveness

### Load Testing
```bash
# Install k6
npm install -g k6

# Run load test
k6 run loadtest.js
```

## 11. Scaling Considerations

### Free Tier Limits
- Render: 750 hours/month
- Vercel: 100GB bandwidth
- Railway: $5 credit/month

### Upgrade Path
- Database: Increase connection pool
- Backend: Add Redis for sessions
- Frontend: CDN for static assets
- Bot: Use webhooks instead of polling

## 12. Troubleshooting

### Common Issues
1. **CORS errors**: Check origin configuration
2. **Bot not responding**: Verify webhook URL
3. **Database connection**: Check connection string
4. **Mini-App not loading**: Verify HTTPS and CSP headers

### Debug Commands
```bash
# Check bot webhook
curl https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo

# Test API endpoints
curl https://your-backend.render.com/health

# Check database connection
psql $DATABASE_URL -c "SELECT version();"
```

## Environment Variables Summary

### Backend (.env)
```
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
BOT_TOKEN=your-telegram-bot-token
WEBAPP_URL=https://your-frontend.vercel.app
ADMIN_TELEGRAM_IDS=123456789,987654321
PORT=3000
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.render.com
```

### Bot (.env)
```
BOT_TOKEN=your-telegram-bot-token
API_URL=https://your-backend.render.com
WEBAPP_URL=https://your-frontend.vercel.app
WEBHOOK_URL=https://your-backend.render.com
ADMIN_TELEGRAM_IDS=123456789,987654321
```