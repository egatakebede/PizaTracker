import { useState } from 'react';
import { ArrowLeft, Copy, Play, Volume2, Video, Check, Share2 } from 'lucide-react';
import { Topic, User } from '../types';
import { QuizComponent } from './QuizComponent';

interface LessonViewerProps {
  topic: Topic;
  user: User;
  onClose: () => void;
}

export function LessonViewer({ topic, user, onClose }: LessonViewerProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null);

  const handleCopyVerse = (verse: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(verse)
        .then(() => {
          setCopiedVerse(verse);
          setTimeout(() => setCopiedVerse(null), 2000);
        })
        .catch(err => {
          console.error('Failed to copy verse: ', err);
          // Fallback for blocked permissions - just show alert for now or ignore
        });
    }
  };

  const handleShareTelegram = () => {
    const message = `Check out this topic: ${topic.title}\n\n${topic.summary}`;
    window.open(`https://t.me/share/url?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (showQuiz) {
    return (
      <QuizComponent
        topic={topic}
        user={user}
        onClose={() => setShowQuiz(false)}
        onComplete={onClose}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-gray-900">{topic.title}</h2>
            <p className="text-xs text-gray-500">{topic.category}</p>
          </div>
          <button
            onClick={handleShareTelegram}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6 pb-24">
        {/* Summary */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-orange-900">{topic.summary}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: topic.contentHtml }}
          />
        </div>

        {/* Bible Verses */}
        {topic.verses.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-gray-900">Related Bible Verses</h3>
            {topic.verses.map((verse, index) => (
              <div key={index} className="bg-white rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-orange-600">
                    {verse.book} {verse.chapter}:{verse.verse}
                  </span>
                  <button
                    onClick={() => handleCopyVerse(`${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copiedVerse === `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}` ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="text-gray-700 italic">"{verse.text}"</p>
              </div>
            ))}
          </section>
        )}

        {/* Media */}
        {topic.media.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-gray-900">Media Resources</h3>
            <div className="space-y-3">
              {topic.media.map((media, index) => (
                <div key={index} className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      media.type === 'video' ? 'bg-red-100' :
                      media.type === 'audio' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }`}>
                      {media.type === 'video' ? (
                        <Video className="w-6 h-6 text-red-600" />
                      ) : media.type === 'audio' ? (
                        <Volume2 className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Play className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{media.title || `${media.type} resource`}</p>
                      <p className="text-xs text-gray-500">
                        {media.type === 'video' ? '1-2 min video' : 'Audio clip'}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Practical Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <h4 className="text-blue-900">💡 Quick Practical Tip</h4>
          <p className="text-sm text-blue-800">
            Before your next conversation, take 1 minute to pray for the person you'll speak with. 
            Ask God to give you the right words and a loving heart.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-inset-bottom">
        <button
          onClick={() => setShowQuiz(true)}
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors"
        >
          Take Quiz ({topic.quiz.length} questions)
        </button>
      </div>
    </div>
  );
}
