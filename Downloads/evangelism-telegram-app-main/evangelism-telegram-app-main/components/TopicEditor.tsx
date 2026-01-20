import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Eye } from 'lucide-react';
import { Topic } from '../types';

interface TopicEditorProps {
  topic?: Topic;
  onClose: () => void;
}

export function TopicEditor({ topic, onClose }: TopicEditorProps) {
  const [formData, setFormData] = useState({
    title: topic?.title || '',
    summary: topic?.summary || '',
    contentHtml: topic?.contentHtml || '',
    category: topic?.category || 'Foundations',
    difficulty: topic?.difficulty || 'beginner',
    languages: topic?.languages || ['en'],
    published: topic?.published || false
  });

  const [verses, setVerses] = useState(topic?.verses || []);
  const [quiz, setQuiz] = useState(topic?.quiz || []);
  const [media, setMedia] = useState(topic?.media || []);

  const handleAddVerse = () => {
    setVerses([...verses, { book: '', chapter: 0, verse: '', text: '' }]);
  };

  const handleAddQuestion = () => {
    setQuiz([...quiz, { q: '', options: ['', '', '', ''], answerIndex: 0, explanation: '' }]);
  };

  const handleAddMedia = () => {
    setMedia([...media, { type: 'video', url: '', title: '' }]);
  };

  const handleSave = () => {
    console.log('Saving topic:', { ...formData, verses, quiz, media });
    // In real app, save to database
    onClose();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-gray-900">{topic ? 'Edit Topic' : 'Create New Topic'}</h1>
              <p className="text-xs text-gray-500">Fill in the details below</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-xl p-6 space-y-4">
          <h2 className="text-gray-900">Basic Information</h2>

          <div>
            <label htmlFor="title" className="block text-sm text-gray-700 mb-2">
              Topic Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Introduction to Faith Sharing"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm text-gray-700 mb-2">
              Short Summary (1-2 lines) *
            </label>
            <input
              id="summary"
              type="text"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief description of the topic"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Foundations">Foundations</option>
                <option value="Practical Skills">Practical Skills</option>
                <option value="Advanced Topics">Advanced Topics</option>
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Status
              </label>
              <label className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-gray-700">Published</span>
              </label>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="bg-white rounded-xl p-6 space-y-4">
          <h2 className="text-gray-900">Lesson Content</h2>
          <div>
            <label htmlFor="content" className="block text-sm text-gray-700 mb-2">
              Full Lesson Content (HTML supported)
            </label>
            <textarea
              id="content"
              value={formData.contentHtml}
              onChange={(e) => setFormData({ ...formData, contentHtml: e.target.value })}
              placeholder="<p>Your lesson content here...</p>"
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
            />
          </div>
        </section>

        {/* Bible Verses */}
        <section className="bg-white rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900">Bible Verses</h2>
            <button
              onClick={handleAddVerse}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Verse
            </button>
          </div>

          {verses.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No verses added yet</p>
          ) : (
            <div className="space-y-4">
              {verses.map((verse, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verse {index + 1}</span>
                    <button
                      onClick={() => setVerses(verses.filter((_, i) => i !== index))}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={verse.book}
                      onChange={(e) => {
                        const newVerses = [...verses];
                        newVerses[index].book = e.target.value;
                        setVerses(newVerses);
                      }}
                      placeholder="Book"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="number"
                      value={verse.chapter || ''}
                      onChange={(e) => {
                        const newVerses = [...verses];
                        newVerses[index].chapter = parseInt(e.target.value) || 0;
                        setVerses(newVerses);
                      }}
                      placeholder="Chapter"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="text"
                      value={verse.verse}
                      onChange={(e) => {
                        const newVerses = [...verses];
                        newVerses[index].verse = e.target.value;
                        setVerses(newVerses);
                      }}
                      placeholder="Verse"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <textarea
                    value={verse.text}
                    onChange={(e) => {
                      const newVerses = [...verses];
                      newVerses[index].text = e.target.value;
                      setVerses(newVerses);
                    }}
                    placeholder="Verse text"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quiz Questions */}
        <section className="bg-white rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900">Quiz Questions</h2>
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>

          {quiz.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No questions added yet</p>
          ) : (
            <div className="space-y-4">
              {quiz.map((question, qIndex) => (
                <div key={qIndex} className="p-4 border border-gray-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Question {qIndex + 1}</span>
                    <button
                      onClick={() => setQuiz(quiz.filter((_, i) => i !== qIndex))}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={question.q}
                    onChange={(e) => {
                      const newQuiz = [...quiz];
                      newQuiz[qIndex].q = e.target.value;
                      setQuiz(newQuiz);
                    }}
                    placeholder="Question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`answer-${qIndex}`}
                          checked={question.answerIndex === oIndex}
                          onChange={() => {
                            const newQuiz = [...quiz];
                            newQuiz[qIndex].answerIndex = oIndex;
                            setQuiz(newQuiz);
                          }}
                          className="w-4 h-4 text-orange-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newQuiz = [...quiz];
                            newQuiz[qIndex].options[oIndex] = e.target.value;
                            setQuiz(newQuiz);
                          }}
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    ))}
                  </div>

                  <textarea
                    value={question.explanation}
                    onChange={(e) => {
                      const newQuiz = [...quiz];
                      newQuiz[qIndex].explanation = e.target.value;
                      setQuiz(newQuiz);
                    }}
                    placeholder="Explanation for the correct answer"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Save Button (bottom) */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            {topic ? 'Update Topic' : 'Create Topic'}
          </button>
        </div>
      </div>
    </div>
  );
}
