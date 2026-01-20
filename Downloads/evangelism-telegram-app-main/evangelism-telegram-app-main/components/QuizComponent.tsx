import { useState } from 'react';
import { ArrowLeft, Check, X, RefreshCw } from 'lucide-react';
import { Topic, User } from '../types';

interface QuizComponentProps {
  topic: Topic;
  user: User;
  onClose: () => void;
  onComplete: () => void;
}

export function QuizComponent({ topic, user, onClose, onComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const quiz = topic.quiz;
  const question = quiz[currentQuestion];
  const isCorrect = selectedAnswer === question.answerIndex;
  const totalQuestions = quiz.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setShowFeedback(true);
    
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnswers([]);
    setIsComplete(false);
  };

  const percentage = Math.round((score / totalQuestions) * 100);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
            percentage >= 70 ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            {percentage >= 70 ? (
              <Check className="w-12 h-12 text-green-600" />
            ) : (
              <RefreshCw className="w-12 h-12 text-orange-600" />
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-gray-900">Quiz Complete!</h2>
            <p className="text-gray-600">
              {percentage >= 70
                ? "Nice work — that's a great score! Here's what you learned:"
                : "Good effort! Review the material and try again."}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <div className="text-5xl text-orange-600">{percentage}%</div>
            <p className="text-gray-600">
              {score} out of {totalQuestions} correct
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onComplete}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors"
            >
              {percentage >= 70 ? 'Continue' : 'Review Lesson'}
            </button>
            
            <button
              onClick={handleRetake}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1">
              <h2 className="text-gray-900">Quiz Time</h2>
              <p className="text-xs text-gray-500">
                Question {currentQuestion + 1} of {totalQuestions}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question */}
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-gray-900 mb-6">{question.q}</h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.answerIndex;
              const showCorrect = showFeedback && isCorrectAnswer;
              const showIncorrect = showFeedback && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect
                      ? 'border-green-500 bg-green-50'
                      : showIncorrect
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      showCorrect
                        ? 'border-green-500 bg-green-500'
                        : showIncorrect
                        ? 'border-red-500 bg-red-500'
                        : isSelected
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300'
                    }`}>
                      {showCorrect && <Check className="w-4 h-4 text-white" />}
                      {showIncorrect && <X className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`flex-1 ${
                      showCorrect || showIncorrect ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`rounded-xl p-4 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
          }`}>
            <h4 className={`mb-2 ${isCorrect ? 'text-green-900' : 'text-orange-900'}`}>
              {isCorrect ? "Nice — that's right! Here's why..." : "Not quite. Here's the explanation:"}
            </h4>
            <p className={`text-sm ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-inset-bottom">
        {!showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors"
          >
            {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}
