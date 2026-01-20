import { ChevronRight, Clock, BookOpen } from 'lucide-react';
import { Topic } from '../types';

interface TopicCardProps {
  topic: Topic;
  progress: number;
  onClick: () => void;
}

export function TopicCard({ topic, progress, onClick }: TopicCardProps) {
  const isStarted = progress > 0;
  const isCompleted = progress === 100;

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left group"
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isCompleted ? 'bg-green-100' : 'bg-orange-100'
        }`}>
          <BookOpen className={`w-6 h-6 ${
            isCompleted ? 'text-green-600' : 'text-orange-600'
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-gray-900 group-hover:text-orange-600 transition-colors">
              {topic.title}
            </h3>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-orange-600 transition-colors" />
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{topic.summary}</p>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {topic.quiz.length} questions
            </span>
            <span className={`px-2 py-1 rounded-full ${
              topic.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
              topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {topic.difficulty}
            </span>
          </div>

          {/* Progress bar */}
          {isStarted && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
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
          )}
        </div>
      </div>
    </button>
  );
}
