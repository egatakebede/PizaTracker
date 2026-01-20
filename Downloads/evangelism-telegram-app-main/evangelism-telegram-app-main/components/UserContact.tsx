import { useState } from 'react';
import { Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { User, Message } from '../types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface UserContactProps {
  user: User;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function UserContact({ user, messages, onSendMessage }: UserContactProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      onSendMessage(content);
      setContent('');
      setIsSubmitting(false);
      toast.success('Message sent to admin');
    }, 1000);
  };

  // Filter messages for this user and sort by date (newest first)
  const userMessages = messages
    .filter(m => m.userId === user.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600">Contact your mentor or admin for guidance.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            Send a Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Type your question or feedback here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">Sending...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Message History</h2>
        
        {userMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userMessages.map((msg) => (
              <Card key={msg.id} className="overflow-hidden">
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-800">{msg.content}</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {new Date(msg.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {msg.reply ? (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mt-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="bg-orange-200 text-orange-800 text-[10px] hover:bg-orange-200">
                          Admin Reply
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {msg.replyTimestamp && new Date(msg.replyTimestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{msg.reply}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      Waiting for reply
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
