import { useState } from 'react';
import { Search, Filter, CheckCircle2, Clock, Reply, User, Check } from 'lucide-react';
import { Message } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { toast } from 'sonner';

interface AdminInboxProps {
  messages: Message[];
  onReply: (messageId: string, replyContent: string) => void;
  onMarkRead: (messageId: string) => void;
}

export function AdminInbox({ messages, onReply, onMarkRead }: AdminInboxProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredMessages = messages
    .filter(m => {
      if (filter === 'unread') return !m.reply;
      if (filter === 'replied') return !!m.reply;
      return true;
    })
    .filter(m => 
      m.userName.toLowerCase().includes(search.toLowerCase()) || 
      m.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleReplySubmit = () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    onReply(selectedMessage.id, replyText);
    toast.success('Reply sent');
    setReplyText('');
    setIsDialogOpen(false);
  };

  const openReplyDialog = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      onMarkRead(msg.id);
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Message Inbox</h1>
          <p className="text-gray-500">Manage support requests from users</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search messages..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-4 overflow-x-auto">
        <Button 
          variant={filter === 'all' ? 'default' : 'ghost'} 
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-orange-600 hover:bg-orange-700' : ''}
        >
          All Messages
        </Button>
        <Button 
          variant={filter === 'unread' ? 'default' : 'ghost'} 
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? 'bg-orange-600 hover:bg-orange-700' : ''}
        >
          Unanswered
          {messages.filter(m => !m.reply).length > 0 && (
            <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
              {messages.filter(m => !m.reply).length}
            </Badge>
          )}
        </Button>
        <Button 
          variant={filter === 'replied' ? 'default' : 'ghost'} 
          onClick={() => setFilter('replied')}
          className={filter === 'replied' ? 'bg-orange-600 hover:bg-orange-700' : ''}
        >
          Replied
        </Button>
      </div>

      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <div className="text-gray-400 mb-2">No messages found</div>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <Card key={msg.id} className={`p-4 transition-all ${!msg.read ? 'bg-blue-50/30 border-blue-100' : 'bg-white'}`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{msg.userName}</h3>
                      {!msg.read && (
                        <Badge className="bg-blue-500 h-5 px-1.5 text-[10px]">New</Badge>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{msg.content}</p>
                    
                    {msg.reply && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                            <Check className="w-3 h-3 mr-1" /> Replied
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {msg.replyTimestamp && new Date(msg.replyTimestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{msg.reply}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  variant={msg.reply ? "outline" : "default"}
                  size="sm"
                  className={msg.reply ? "" : "bg-orange-600 hover:bg-orange-700"}
                  onClick={() => openReplyDialog(msg)}
                >
                  <Reply className="w-4 h-4 mr-2" />
                  {msg.reply ? 'View / Edit' : 'Reply'}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.userName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 border border-gray-200">
              {selectedMessage?.content}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Your Reply</label>
              <Textarea 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response..."
                className="min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReplySubmit} className="bg-orange-600 hover:bg-orange-700">Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
