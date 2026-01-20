import { Message } from '../types';

export const initialMessages: Message[] = [
  {
    id: 'msg-1',
    userId: 'user-1',
    userName: 'Samuel Tadesse',
    content: 'I am having trouble understanding the second lesson on faith.',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: true,
    reply: 'Hi Samuel, try reading the supplementary verses in Romans. Let me know if that helps!',
    replyTimestamp: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'msg-2',
    userId: 'user-2',
    userName: 'Martha Bekele',
    content: 'Is there a way to download the audio lessons for offline listening?',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: false,
  }
];
