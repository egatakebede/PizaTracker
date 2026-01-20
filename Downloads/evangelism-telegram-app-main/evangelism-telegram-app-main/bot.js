import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const API_URL = process.env.API_URL || 'http://localhost:3000';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://your-app.vercel.app';

// Store user sessions
const userSessions = new Map();

// Start command with deep link to Mini-App
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.first_name || ctx.from.username;
  
  userSessions.set(userId, { username, chatId: ctx.chat.id });
  
  const keyboard = {
    inline_keyboard: [[
      { text: '🚀 Open Mini-App', web_app: { url: WEBAPP_URL } }
    ]]
  };
  
  await ctx.reply(
    `Welcome ${username}! 🙏\n\n` +
    `This is the Evangelism Onboarding Bot. Use the Mini-App to:\n` +
    `• Complete spiritual lessons\n` +
    `• Track your progress\n` +
    `• Chat with mentors\n\n` +
    `Click the button below to get started:`,
    { reply_markup: keyboard }
  );
});

// Verify invite code command
bot.command('verify', async (ctx) => {
  const args = ctx.message.text.split(' ');
  if (args.length < 2) {
    return ctx.reply('Please provide an invite code: /verify YOUR_CODE');
  }
  
  const inviteCode = args[1];
  
  try {
    const response = await fetch(`${API_URL}/auth/verify-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: inviteCode })
    });
    
    const result = await response.json();
    
    if (result.valid) {
      ctx.reply(`✅ Valid ${result.type} invite code! You can now register in the Mini-App.`);
    } else {
      ctx.reply('❌ Invalid or expired invite code.');
    }
  } catch (error) {
    ctx.reply('❌ Error verifying invite code. Please try again.');
  }
});

// Admin commands
bot.command('admin', async (ctx) => {
  const userId = ctx.from.id;
  const adminIds = process.env.ADMIN_TELEGRAM_IDS?.split(',').map(id => parseInt(id)) || [];
  
  if (!adminIds.includes(userId)) {
    return ctx.reply('❌ You are not authorized to use admin commands.');
  }
  
  const keyboard = {
    inline_keyboard: [
      [{ text: '👥 View Users', callback_data: 'admin_users' }],
      [{ text: '📝 Generate Invite', callback_data: 'admin_invite' }],
      [{ text: '💬 View Messages', callback_data: 'admin_messages' }],
      [{ text: '🚀 Open Admin Panel', web_app: { url: `${WEBAPP_URL}?admin=true` } }]
    ]
  };
  
  ctx.reply('🔧 Admin Panel:', { reply_markup: keyboard });
});

// Handle callback queries
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;
  const userId = ctx.from.id;
  const adminIds = process.env.ADMIN_TELEGRAM_IDS?.split(',').map(id => parseInt(id)) || [];
  
  if (!adminIds.includes(userId)) {
    return ctx.answerCbQuery('❌ Not authorized');
  }
  
  try {
    switch (data) {
      case 'admin_users':
        // Fetch users from API (would need admin token)
        ctx.answerCbQuery();
        ctx.reply('👥 Use the Mini-App admin panel to view detailed user information.');
        break;
        
      case 'admin_invite':
        // Generate invite code
        const inviteCode = Math.random().toString(36).substring(2, 15).toUpperCase();
        ctx.answerCbQuery();
        ctx.reply(`🎫 New invite code generated: \`${inviteCode}\`\n\nShare this with new users!`, { parse_mode: 'Markdown' });
        break;
        
      case 'admin_messages':
        ctx.answerCbQuery();
        ctx.reply('💬 Use the Mini-App admin panel to view and reply to messages.');
        break;
    }
  } catch (error) {
    ctx.answerCbQuery('❌ Error processing request');
  }
});

// Handle Mini-App data
bot.on('web_app_data', async (ctx) => {
  const data = JSON.parse(ctx.webAppData.data);
  
  switch (data.type) {
    case 'user_registered':
      ctx.reply(`🎉 Welcome to the community, ${data.name}! Your spiritual journey begins now.`);
      break;
      
    case 'topic_completed':
      ctx.reply(`✅ Congratulations! You completed "${data.topicTitle}". Keep up the great work! 🙏`);
      break;
      
    case 'message_sent':
      ctx.reply(`📨 Your message has been sent to the mentors. They will reply soon!`);
      break;
  }
});

// Broadcast function for admins
export const broadcastToUsers = async (message, userIds = []) => {
  for (const [userId, session] of userSessions) {
    if (userIds.length === 0 || userIds.includes(userId)) {
      try {
        await bot.telegram.sendMessage(session.chatId, message);
      } catch (error) {
        console.error(`Failed to send message to ${userId}:`, error);
      }
    }
  }
};

// Notify user of new topic assignment
export const notifyTopicAssignment = async (telegramId, topicTitle) => {
  const session = userSessions.get(telegramId);
  if (session) {
    const keyboard = {
      inline_keyboard: [[
        { text: '📖 Open Lesson', web_app: { url: `${WEBAPP_URL}/topics` } }
      ]]
    };
    
    try {
      await bot.telegram.sendMessage(
        session.chatId,
        `📚 New lesson assigned: "${topicTitle}"\n\nClick below to start learning!`,
        { reply_markup: keyboard }
      );
    } catch (error) {
      console.error('Failed to notify user:', error);
    }
  }
};

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('❌ Something went wrong. Please try again.');
});

// Start bot
if (process.env.NODE_ENV === 'production') {
  // Webhook mode for production
  const webhookUrl = `${process.env.WEBHOOK_URL}/webhook/${process.env.BOT_TOKEN}`;
  bot.telegram.setWebhook(webhookUrl);
  
  // Express webhook handler would go here
} else {
  // Polling mode for development
  bot.launch();
  console.log('Bot started in polling mode');
}

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));