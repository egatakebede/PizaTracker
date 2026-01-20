import { useState } from 'react';
import { LayoutDashboard, BookOpen, Users, Settings, Menu, X, MessageSquare } from 'lucide-react';
import { User, Message } from '../types';
import { AdminHome } from './AdminHome';
import { AdminTopics } from './AdminTopics';
import { AdminUsers } from './AdminUsers';
import { AdminSettings } from './AdminSettings';
import { AdminInbox } from './AdminInbox';
import { Badge } from './ui/badge';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  messages: Message[];
  onReply: (messageId: string, replyContent: string) => void;
  onMarkRead: (messageId: string) => void;
}

type AdminTab = 'dashboard' | 'inbox' | 'topics' | 'users' | 'settings';

export function AdminDashboard({ user, onLogout, messages, onReply, onMarkRead }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Calculate unread messages for badge
  const unreadCount = messages.filter(m => !m.reply && !m.read).length; // Or logic as per requirement.

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'inbox' as AdminTab, 
      label: 'Inbox', 
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { id: 'topics' as AdminTab, label: 'Topics', icon: BookOpen },
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-gray-900 font-bold">Admin Panel</h1>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <Badge className="bg-orange-600 hover:bg-orange-700">{unreadCount}</Badge>
          )}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen p-4 sticky top-0 h-screen overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">{user.name}</p>
          </div>

          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200">
                      {tab.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-gray-900 font-bold">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200">
                        {tab.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto w-full pb-20 lg:pb-0">
          {activeTab === 'dashboard' && <AdminHome user={user} />}
          {activeTab === 'inbox' && (
            <AdminInbox 
              messages={messages} 
              onReply={onReply} 
              onMarkRead={onMarkRead} 
            />
          )}
          {activeTab === 'topics' && <AdminTopics />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'settings' && <AdminSettings user={user} onLogout={onLogout} />}
        </main>
      </div>
    </div>
  );
}
