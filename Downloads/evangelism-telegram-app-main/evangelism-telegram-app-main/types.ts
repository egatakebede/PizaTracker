export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  language: 'en' | 'am' | 'om' | 'ti';
  assignedTopics: string[];
  progress: Record<string, number>;
  onboardingComplete: boolean;
  points?: number;
  badges?: string[];
}

export interface Topic {
  id: string;
  title: string;
  summary: string;
  contentHtml: string;
  verses: Array<{ book: string; chapter: number; verse: string; text: string }>;
  media: Array<{ type: 'image' | 'audio' | 'video'; url: string; title?: string }>;
  quiz: Array<{ q: string; options: string[]; answerIndex: number; explanation: string }>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  languages: string[];
  category: string;
  published: boolean;
  createdAt: string;
  createdBy: string;
}

export interface InviteCode {
  code: string;
  type: 'single' | 'multi';
  expiresAt: string;
  issuedBy: string;
  usedBy?: string[];
  isActive: boolean;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  read: boolean;
  reply?: string;
  replyTimestamp?: string;
}
