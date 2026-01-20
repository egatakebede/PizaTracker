import { User as UserIcon, Globe, HelpCircle, LogOut, MessageSquare, Mail } from 'lucide-react';
import { User } from '../types';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
  const languageNames = {
    en: 'English',
    am: 'Amharic (አማርኛ)',
    om: 'Afaan Oromo',
    ti: 'Tigrigna (ትግርኛ)'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
            <UserIcon className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-white mb-1">{user.name}</h1>
            {user.email && (
              <p className="text-sm opacity-90">{user.email}</p>
            )}
          </div>
        </div>
      </header>

      {/* Profile Info */}
      <div className="p-4 space-y-6">
        <section className="bg-white rounded-xl divide-y divide-gray-100">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Language</p>
              <p className="text-gray-900">{languageNames[user.language]}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>
          </div>
        </section>

        {/* Progress Summary */}
        <section className="bg-white rounded-xl p-4 space-y-3">
          <h2 className="text-gray-900">Progress Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl text-green-600">
                {Object.keys(user.progress).filter(id => user.progress[id] === 100).length}
              </div>
              <p className="text-xs text-green-700 mt-1">Completed</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-2xl text-orange-600">
                {user.assignedTopics.length}
              </div>
              <p className="text-xs text-orange-700 mt-1">Assigned</p>
            </div>
          </div>
        </section>

        {/* Help & Support */}
        <section className="space-y-3">
          <h2 className="text-gray-900">Help & Support</h2>
          <div className="bg-white rounded-xl divide-y divide-gray-100">
            <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900">Ask for Help</p>
                <p className="text-xs text-gray-500">Contact your admin</p>
              </div>
            </button>

            <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900">Send Feedback</p>
                <p className="text-xs text-gray-500">Share your thoughts</p>
              </div>
            </button>

            <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900">Report an Issue</p>
                <p className="text-xs text-gray-500">Something not working?</p>
              </div>
            </button>
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full bg-red-50 text-red-600 py-3 px-6 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
