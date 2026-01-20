import { useState, useEffect } from 'react';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { User, Topic } from '../types';
import { api } from '../services/api';

interface UserProgressProps {
  user: User;
}

export function UserProgress({ user }: UserProgressProps) {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    api.getTopics().then(setTopics).catch(console.error);
  }, []);

  const assignedTopics = topics.filter(t => user.assignedTopics.includes(t.id));
  const completedCount = Object.keys(user.progress).filter(id => user.progress[id] === 100).length;
  const inProgressCount = Object.keys(user.progress).filter(id => user.progress[id] > 0 && user.progress[id] < 100).length;
  const totalAssigned = assignedTopics.length;
  const overallProgress = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0;

  const stats = [
    {
      icon: Award,
      label: 'Completed',
      value: completedCount,
      color: 'green'
    },
    {
      icon: TrendingUp,
      label: 'In Progress',
      value: inProgressCount,
      color: 'orange'
    },
    {
      icon: Target,
      label: 'Total Assigned',
      value: totalAssigned,
      color: 'blue'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'orange':
        return { bg: 'bg-orange-100', text: 'text-orange-600' };
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6">
        <h1 className="text-white mb-4">Your Progress</h1>
        
        {/* Overall Progress */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-2">{overallProgress}%</div>
            <p className="text-sm opacity-90">Overall Completion</p>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = getColorClasses(stat.color);
            return (
              <div key={index} className="bg-white rounded-xl p-4 text-center space-y-2">
                <div className={`${colorClasses.bg} rounded-full flex items-center justify-center mx-auto`}>
                  <Icon className={`${colorClasses.text} w-5 h-5`} />
                </div>
                <div className="text-2xl text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Topics Progress */}
        <section className="space-y-3">
          <h2 className="text-gray-900">Topic Progress</h2>
          
          {assignedTopics.length > 0 ? (
            <div className="space-y-3">
              {assignedTopics.map(topic => {
                const progress = user.progress[topic.id] || 0;
                const isCompleted = progress === 100;
                
                return (
                  <div key={topic.id} className="bg-white rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-gray-900">{topic.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{topic.category}</p>
                      </div>
                      {isCompleted && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isCompleted ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center space-y-3">
              <Target className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-gray-900">No assigned topics yet</h3>
              <p className="text-gray-600 text-sm">
                Your progress will appear here once topics are assigned
              </p>
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="space-y-3">
          <h2 className="text-gray-900">Recent Activity</h2>
          <div className="bg-white rounded-xl divide-y divide-gray-100">
            <div className="p-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div className="flex-1">
                <p className="text-gray-900 text-sm">Completed quiz</p>
                <p className="text-xs text-gray-500">Introduction to Faith Sharing</p>
              </div>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
            
            <div className="p-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <div className="flex-1">
                <p className="text-gray-900 text-sm">Started topic</p>
                <p className="text-xs text-gray-500">The Power of Personal Testimony</p>
              </div>
              <span className="text-xs text-gray-500">5 days ago</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}