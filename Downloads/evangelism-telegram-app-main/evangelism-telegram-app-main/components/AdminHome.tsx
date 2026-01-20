import { Users, BookOpen, TrendingUp, UserPlus, Clock } from 'lucide-react';
import { User } from '../types';

interface AdminHomeProps {
  user: User;
}

export function AdminHome({ user }: AdminHomeProps) {
  const stats = [
    {
      label: 'Active Users',
      value: '24',
      change: '+3 this week',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Published Topics',
      value: '8',
      change: '2 drafts',
      icon: BookOpen,
      color: 'orange'
    },
    {
      label: 'Avg. Completion',
      value: '76%',
      change: '+5% from last month',
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Pending Invites',
      value: '5',
      change: '12 sent total',
      icon: UserPlus,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'orange':
        return { bg: 'bg-orange-100', text: 'text-orange-600' };
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'purple':
        return { bg: 'bg-purple-100', text: 'text-purple-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const recentActivity = [
    {
      user: 'Sarah Johnson',
      action: 'Completed topic',
      topic: 'Introduction to Faith Sharing',
      time: '2 hours ago',
      type: 'completion'
    },
    {
      user: 'Michael Chen',
      action: 'Started topic',
      topic: 'The Power of Personal Testimony',
      time: '5 hours ago',
      type: 'start'
    },
    {
      user: 'Emma Williams',
      action: 'Scored 90% on quiz',
      topic: 'Handling Difficult Questions',
      time: '1 day ago',
      type: 'quiz'
    },
    {
      user: 'New User',
      action: 'Signed up with invite code',
      topic: 'WELCOME2024',
      time: '2 days ago',
      type: 'signup'
    }
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your team</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = getColorClasses(stat.color);
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${colorClasses.bg} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className={`${colorClasses.text} w-6 h-6`} />
                </div>
              </div>
              <div className="text-3xl text-gray-900 mb-1">{stat.value}</div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors">
            Create New Topic
          </button>
          <button className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
            Generate Invite Code
          </button>
          <button className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
            View All Users
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Recent Activity</h2>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                activity.type === 'completion' ? 'bg-green-500' :
                activity.type === 'start' ? 'bg-orange-500' :
                activity.type === 'quiz' ? 'bg-blue-500' :
                'bg-purple-500'
              }`} />
              
              <div className="flex-1 min-w-0">
                <p className="text-gray-900">
                  <span>{activity.user}</span>
                  <span className="text-gray-600"> {activity.action}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">{activity.topic}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-gray-900 mb-4">This Week's Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl text-gray-900 mb-1">142</div>
            <p className="text-sm text-gray-600">Lessons Viewed</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl text-gray-900 mb-1">87</div>
            <p className="text-sm text-gray-600">Quizzes Completed</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl text-gray-900 mb-1">18</div>
            <p className="text-sm text-gray-600">Topics Completed</p>
          </div>
        </div>
      </section>
    </div>
  );
}