import { useState } from 'react';
import { Heart, Users, BookOpen, Check, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface UserOnboardingProps {
  onComplete: () => void;
  user: User;
}

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to the Team!',
    description: 'We\'re glad to have you join us in spreading the Good News. This journey will equip you with tools and knowledge to share your faith confidently.',
    icon: Heart,
    color: 'orange'
  },
  {
    id: 'values',
    title: 'Our Core Values',
    description: 'Love, compassion, and respect guide everything we do. We approach every conversation with humility and genuine care for others.',
    icon: Users,
    color: 'blue'
  },
  {
    id: 'conduct',
    title: 'Code of Conduct',
    description: 'Always be respectful, listen actively, and never force beliefs. Share with love, pray before each interaction, and honor personal boundaries.',
    icon: BookOpen,
    color: 'green',
    checklist: [
      'I will approach every person with respect and love',
      'I will pray before starting any outreach',
      'I will listen actively and honor personal boundaries',
      'I will never force my beliefs on others'
    ]
  }
];

export function UserOnboarding({ onComplete, user }: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [checklistAgreed, setChecklistAgreed] = useState<Record<number, boolean>>({});

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const hasChecklist = Boolean(step.checklist);
  const allChecklistItemsAgreed = hasChecklist
    ? step.checklist!.every((_, i) => checklistAgreed[i])
    : true;

  // Get color classes based on step
  const getColorClasses = () => {
    switch (step.color) {
      case 'orange':
        return { bg: 'bg-orange-100', text: 'text-orange-600' };
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      default:
        return { bg: 'bg-orange-100', text: 'text-orange-600' };
    }
  };

  const colors = getColorClasses();

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
      setChecklistAgreed({});
    }
  };

  const toggleChecklistItem = (index: number) => {
    setChecklistAgreed(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Progress indicators */}
        <div className="flex gap-2 justify-center">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-orange-500'
                  : index < currentStep
                  ? 'w-2 bg-orange-300'
                  : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center mx-auto`}>
            <Icon className={`w-10 h-10 ${colors.text}`} />
          </div>

          <div className="space-y-2">
            <h2 className="text-gray-900">{step.title}</h2>
            <p className="text-gray-600">{step.description}</p>
          </div>
        </div>

        {/* Checklist if present */}
        {hasChecklist && (
          <div className="space-y-3 pt-4">
            {step.checklist!.map((item, index) => (
              <label
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checklistAgreed[index] || false}
                  onChange={() => toggleChecklistItem(index)}
                  className="mt-1 w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 flex-1">{item}</span>
              </label>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!allChecklistItemsAgreed}
            className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLastStep ? (
              <>
                <Check className="w-5 h-5" />
                Get Started
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}