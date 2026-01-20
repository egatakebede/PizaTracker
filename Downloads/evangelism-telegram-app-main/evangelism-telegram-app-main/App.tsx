import { useState, useEffect } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { UserApp } from './components/UserApp';
import { AdminLogin } from './components/AdminLogin';
import { User, Message } from './types';
import { mockTopics } from './data/mockTopics';
import { initialMessages } from './data/mockMessages';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const socket = io(API_URL);

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'admin-login' | 'user-app' | 'admin-app'>('landing');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Set theme
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
    }
    
    // Check for stored auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Verify token with backend
      // verifyToken(token); // Temporarily disabled
    } else {
      setIsLoading(false);
    }
    
    // Socket listeners
    socket.on('new_message', (message) => {
      setMessages(prev => [message, ...prev]);
    });
    
    socket.on('message_reply', (message) => {
      setMessages(prev => prev.map(msg => msg.id === message.id ? message : msg));
    });
    
    return () => {
      socket.off('new_message');
      socket.off('message_reply');
    };
  }, []);
  
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData.user);
        setView(userData.user.role === 'admin' ? 'admin-app' : 'user-app');
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      setCurrentUser(data.user);
      setView('admin-app');
    } catch (error) {
      throw error;
    }
  };

  const handleUserLogin = async (name: string, language: 'en' | 'am' | 'om' | 'ti', inviteCode: string) => {
    try {
      const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, language, inviteCode, telegramId })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      
      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      setCurrentUser(data.user);
      setView('user-app');
      
      // Notify Telegram bot
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify({
          type: 'user_registered',
          name: data.user.name
        }));
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
  };

  const handleSendMessage = async (content: string) => {
    if (!currentUser) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [message, ...prev]);
        
        // Notify Telegram bot
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.sendData(JSON.stringify({
            type: 'message_sent'
          }));
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleReplyMessage = (messageId: string, replyContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, reply: replyContent, replyTimestamp: new Date().toISOString(), read: true }
        : msg
    ));
  };

  const handleMarkRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-orange-600 font-bold text-4xl mb-2">Evangelism Onboarding</h1>
            <p className="text-gray-600 text-lg">Welcome to your spiritual growth journey</p>
          </div>
          
          <div className="space-y-4 pt-8">
            <button
              onClick={() => setView('user-app')}
              className="w-full bg-orange-600 text-white py-4 px-6 rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200 transform hover:-translate-y-1 font-semibold text-lg"
            >
              Start Learning
            </button>
            
            <button
              onClick={() => setView('admin-login')}
              className="w-full bg-white text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 transition-all shadow-sm border border-gray-200 font-medium"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} onBack={() => setView('landing')} />;
  }

  if (view === 'admin-app' && currentUser?.role === 'admin') {
    return (
      <AdminDashboard 
        user={currentUser} 
        onLogout={handleLogout}
        messages={messages}
        onReply={handleReplyMessage}
        onMarkRead={handleMarkRead}
      />
    );
  }

  if (view === 'user-app') {
    return (
      <UserApp
        user={currentUser}
        onUserCreate={handleUserLogin}
        onLogout={handleLogout}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    );
  }

  return null;
}

export default App;
