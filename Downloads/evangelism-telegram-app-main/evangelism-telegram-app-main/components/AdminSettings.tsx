import { LogOut, Bell, Globe, Shield, Download } from 'lucide-react';
import { User } from '../types';

interface AdminSettingsProps {
  user: User;
  onLogout: () => void;
}

export function AdminSettings({ user, onLogout }: AdminSettingsProps) {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Settings</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Account Info */}
      <section className="bg-white rounded-xl p-6 space-y-4">
        <h2 className="text-gray-900">Account Information</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={user.name}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={user.email || 'admin@example.com'}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <input
              type="text"
              value="Administrator"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
            />
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white rounded-xl divide-y divide-gray-100">
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-gray-900">Notifications</p>
            <p className="text-xs text-gray-500">Manage notification preferences</p>
          </div>
        </button>

        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-gray-900">Language Settings</p>
            <p className="text-xs text-gray-500">Set default language for content</p>
          </div>
        </button>

        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-gray-900">Security</p>
            <p className="text-xs text-gray-500">Password and two-factor authentication</p>
          </div>
        </button>
      </section>

      {/* Data Management */}
      <section className="bg-white rounded-xl p-6 space-y-4">
        <h2 className="text-gray-900">Data Management</h2>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Export All Topics (CSV)
          </button>
          <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Export User Data (CSV)
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Export your data in CSV format for backup or analysis
        </p>
      </section>

      {/* Audit Log Preview */}
      <section className="bg-white rounded-xl p-6 space-y-4">
        <h2 className="text-gray-900">Recent Admin Actions</h2>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-900">Created topic: "Introduction to Faith Sharing"</p>
            <p className="text-xs text-gray-500 mt-1">2 days ago</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-900">Generated invite code: WELCOME2024</p>
            <p className="text-xs text-gray-500 mt-1">5 days ago</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-900">Assigned 3 topics to Sarah Johnson</p>
            <p className="text-xs text-gray-500 mt-1">1 week ago</p>
          </div>
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
  );
}
