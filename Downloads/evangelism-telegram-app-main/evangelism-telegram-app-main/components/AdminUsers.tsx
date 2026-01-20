import { useState } from 'react';
import { Search, UserPlus, Mail, MoreVertical, Copy, Check, Shield, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { InviteCodeModal } from './InviteCodeModal';

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const mockUsers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      language: 'English',
      assignedTopics: 3,
      completedTopics: 2,
      progress: 67,
      joinedDate: '2024-11-01',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      language: 'English',
      assignedTopics: 5,
      completedTopics: 1,
      progress: 20,
      joinedDate: '2024-11-10',
      lastActive: '5 hours ago'
    },
    {
      id: '3',
      name: 'Emma Williams',
      email: 'emma@example.com',
      language: 'Amharic',
      assignedTopics: 4,
      completedTopics: 3,
      progress: 75,
      joinedDate: '2024-10-25',
      lastActive: '1 day ago'
    }
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900">Users</h1>
          <p className="text-gray-600 text-sm mt-1">Manage team members and invites</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Generate Invite Code
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6">
          <p className="text-gray-600 text-sm">Active Users</p>
          <p className="text-3xl text-gray-900 mt-2">24</p>
          <p className="text-xs text-gray-500 mt-1">+3 this week</p>
        </div>
        <div className="bg-white rounded-xl p-6">
          <p className="text-gray-600 text-sm">Pending Invites</p>
          <p className="text-3xl text-gray-900 mt-2">5</p>
          <p className="text-xs text-gray-500 mt-1">Not yet used</p>
        </div>
        <div className="bg-white rounded-xl p-6">
          <p className="text-gray-600 text-sm">Avg. Completion</p>
          <p className="text-3xl text-gray-900 mt-2">54%</p>
          <p className="text-xs text-gray-500 mt-1">Across all users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
        />
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {filteredUsers.map(user => (
            <div key={user.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.language}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Progress</p>
                  <p className="text-gray-900">{user.progress}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Completed</p>
                  <p className="text-gray-900">{user.completedTopics}/{user.assignedTopics}</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${user.progress}%` }}
                />
              </div>

              <p className="text-xs text-gray-500">Last active: {user.lastActive}</p>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Language</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Topics</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {user.language}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px] bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${user.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{user.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {user.completedTopics} / {user.assignedTopics}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toast.success(`Promoted ${user.name} to Admin`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Promote to Admin"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Code Modal */}
      {showInviteModal && (
        <InviteCodeModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}
