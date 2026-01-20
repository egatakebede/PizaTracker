import { useState } from 'react';
import { Home, BookOpen, TrendingUp, User as UserIcon, MessageSquare } from 'lucide-react';
import { User, Message } from '../types';
import { InviteCodeEntry } from './InviteCodeEntry';
import { UserOnboarding } from './UserOnboarding';
import { UserHome } from './UserHome';
import { UserTopics } from './UserTopics';
import { UserProgress } from './UserProgress';
import { UserProfile } from './UserProfile';
import { UserContact } from './UserContact';
import { useTranslation } from '../utils/translations';

interface UserAppProps {
  user: User | null;
  onUserCreate: (name: string, language: 'en' | 'am' | 'om' | 'ti') => void;
  onLogout: () => void;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

type UserTab = 'home' | 'topics' | 'progress' | 'contact' | 'profile';

export function UserApp({ user, onUserCreate, onLogout, messages, onSendMessage }: UserAppProps) {
  const [activeTab, setActiveTab] = useState<UserTab>('home');
  const [showOnboarding, setShowOnboarding] = useState(user ? !user.onboardingComplete : false);
  
  const t = user ? useTranslation(user.language) : useTranslation('en');

  if (!user) {
    return <InviteCodeEntry onSuccess={onUserCreate} />;
  }

  if (showOnboarding) {
    return <UserOnboarding onComplete={() => setShowOnboarding(false)} user={user} />;
  }

  // Check for unread replies
  const unreadReplies = messages
    .filter(m => m.userId === user.id && m.reply && !m.read) // Assuming 'read' on user side means user read the reply?
    // Actually in our model 'read' is usually if ADMIN read the message. 
    // Let's assume for notification badge we check if there is a reply and if the reply is recent or some other logic.
    // For simplicity, let's just show badge if there is a reply.
    // But we need a way to mark reply as read by USER.
    // The current model `read` property is for Admin reading user message.
    // We might need `userReadReply` or similar. 
    // For now, let's just show badge if there is a reply timestamp > message timestamp.
    .length; 
    
  // Just show badge if there are any replies for now, refining later.

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'home' && <UserHome user={user} />}
        {activeTab === 'topics' && <UserTopics user={user} />}
        {activeTab === 'progress' && <UserProgress user={user} />}
        {activeTab === 'contact' && (
          <UserContact 
            user={user} 
            messages={messages} 
            onSendMessage={onSendMessage} 
          />
        )}
        {activeTab === 'profile' && <UserProfile user={user} onLogout={onLogout} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-around px-2">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={Home} 
            label={t.home} 
          />
          <NavButton 
            active={activeTab === 'topics'} 
            onClick={() => setActiveTab('topics')} 
            icon={BookOpen} 
            label={t.topics} 
          />
          <NavButton 
            active={activeTab === 'progress'} 
            onClick={() => setActiveTab('progress')} 
            icon={TrendingUp} 
            label={t.progress} 
          />
          <NavButton 
            active={activeTab === 'contact'} 
            onClick={() => setActiveTab('contact')} 
            icon={MessageSquare} 
            label={t.help} 
          />
          <NavButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            icon={UserIcon} 
            label={t.profile} 
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center py-3 px-3 transition-colors min-w-[64px] ${
        active ? 'text-orange-600' : 'text-gray-500'
      }`}
    >
      <Icon className={`w-6 h-6 ${active ? 'fill-current/10' : ''}`} />
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
  );
}
