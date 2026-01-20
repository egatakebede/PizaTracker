import { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { User, Topic } from '../types';
import { api } from '../services/api';
import { TopicCard } from './TopicCard';
import { LessonViewer } from './LessonViewer';

interface UserTopicsProps {
  user: User;
}

export function UserTopics({ user }: UserTopicsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const data = await api.getTopics();
        setTopics(data);
      } catch (err) {
        console.error('Failed to load topics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTopics();
  }, []);

  const categories = ['all', ...Array.from(new Set(topics.map(t => t.category)))];
  
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory && topic.published;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 space-y-4">
        <h1 className="text-gray-900">All Topics</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </header>

      {/* Topics List */}
      <div className="p-4 space-y-3">
        {filteredTopics.length > 0 ? (
          filteredTopics.map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              progress={user.progress[topic.id] || 0}
              onClick={() => setSelectedTopicId(topic.id)}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 text-center space-y-3">
            <Filter className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-gray-900">No topics found</h3>
            <p className="text-gray-600 text-sm">
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
