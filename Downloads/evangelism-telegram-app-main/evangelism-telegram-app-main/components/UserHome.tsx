import { useState, useEffect } from 'react';
import { BookOpen, Play, HelpCircle, Bell } from 'lucide-react';
import { User, Topic } from '../types';
import { api } from '../services/api';
import { TopicCard } from './TopicCard';
import { LessonViewer } from './LessonViewer';

interface UserHomeProps {
  user: User;
}

export function UserHome({ user }: UserHomeProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    api.getTopics().then(setTopics).catch(console.error);
  }, []);

  const assignedTopics = topics.filter(t => user.assignedTopics.includes(t.id));
  const recommendedTopics = topics.filter(t => !user.assignedTopics.includes(t.id) && t.published);

  const totalAssigned = assignedTopics.length;
  const completed = Object.keys(user.progress).filter(id => user.progress[id] === 100).length;
  const overallProgress = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0;

  const selectedTopic = topics.find(t => t.id === selectedTopicId);

  if (selectedTopic) {
    return (
      <LessonViewer
        topic={selectedTopic}
        user={user}
        onClose={() => setSelectedTopicId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Welcome back,</p>
            <h1 className="text-white">{user.name}</h1>
          </div>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <Bell className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Overall Progress</span>
            <span>{completed} of {totalAssigned} completed</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-gray-700">Continue Learning</span>
          </button>

          <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">Ask for Help</span>
          </button>
        </div>

        {/* Assigned Topics */}
        {assignedTopics.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900">Your Topics</h2>
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {assignedTopics.map(topic => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  progress={user.progress[topic.id] || 0}
                  onClick={() => setSelectedTopicId(topic.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Topics */}
        {recommendedTopics.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-gray-900">Recommended</h2>
            <div className="space-y-3">
              {recommendedTopics.slice(0, 3).map(topic => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  progress={0}
                  onClick={() => setSelectedTopicId(topic.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {assignedTopics.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900">No topics yet</h3>
            <p className="text-gray-600 text-sm">
              Your admin will assign topics to you soon. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
