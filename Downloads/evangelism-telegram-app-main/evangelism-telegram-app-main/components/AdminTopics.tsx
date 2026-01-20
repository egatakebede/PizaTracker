import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { mockTopics } from '../data/mockTopics';
import { TopicEditor } from './TopicEditor';

export function AdminTopics() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const filteredTopics = mockTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showEditor) {
    const topic = selectedTopicId ? mockTopics.find(t => t.id === selectedTopicId) : undefined;
    return (
      <TopicEditor
        topic={topic}
        onClose={() => {
          setShowEditor(false);
          setSelectedTopicId(null);
        }}
      />
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900">Topics</h1>
          <p className="text-gray-600 text-sm mt-1">Manage your learning content</p>
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Topic
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
        />
      </div>

      {/* Topics Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {filteredTopics.map(topic => (
            <div key={topic.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-gray-900">{topic.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{topic.summary}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
                  topic.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {topic.published ? 'Published' : 'Draft'}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded">{topic.category}</span>
                <span className="px-2 py-1 bg-gray-100 rounded capitalize">{topic.difficulty}</span>
                <span>{topic.quiz.length} questions</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setShowEditor(true);
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Topic</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Questions</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTopics.map(topic => (
                <tr key={topic.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{topic.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{topic.summary}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {topic.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm capitalize ${
                      topic.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {topic.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {topic.published ? (
                        <>
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="text-green-700">Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">Draft</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {topic.quiz.length}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTopicId(topic.id);
                          setShowEditor(true);
                        }}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredTopics.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No topics found</h3>
          <p className="text-gray-600 text-sm">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}
