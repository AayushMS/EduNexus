'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Search,
  Send,
  MessageSquare,
  ChevronRight,
  Megaphone,
  Image,
  Paperclip,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  parentName: string;
  parentNameNe: string;
  childName: string;
  childNameNe: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

const mockConversations: Conversation[] = [
  { id: '1', parentName: 'Mrs. Sharma', parentNameNe: 'श्रीमती शर्मा', childName: 'Aarav', childNameNe: 'आरव', lastMessage: 'Thank you for sharing the photos!', time: '10 min ago', unread: true },
  { id: '2', parentName: 'Mr. Thapa', parentNameNe: 'श्री थापा', childName: 'Sita', childNameNe: 'सीता', lastMessage: 'She loved the art activity today.', time: '1 hour ago', unread: false },
  { id: '3', parentName: 'Mrs. Gurung', parentNameNe: 'श्रीमती गुरुङ', childName: 'Ram', childNameNe: 'राम', lastMessage: 'Is he eating well during snack time?', time: '2 hours ago', unread: true },
  { id: '4', parentName: 'Mr. Rai', parentNameNe: 'श्री राई', childName: 'Priya', childNameNe: 'प्रिया', lastMessage: 'Great progress on counting!', time: 'Yesterday', unread: false },
  { id: '5', parentName: 'Mrs. Tamang', parentNameNe: 'श्रीमती तामाङ', childName: 'Kiran', childNameNe: 'किरण', lastMessage: 'Will there be outdoor play tomorrow?', time: 'Yesterday', unread: false },
];

const quickMessages = [
  { en: 'Had a wonderful day! 🌟', ne: 'अद्भुत दिन बितायो! 🌟' },
  { en: 'Participated well in activities today!', ne: 'आज गतिविधिहरूमा राम्रो भाग लियो!' },
  { en: 'Made great progress in class!', ne: 'कक्षामा उत्कृष्ट प्रगति गर्यो!' },
  { en: 'Enjoyed playing with friends! 👫', ne: 'साथीहरूसँग खेल्न रमाइलो गर्यो! 👫' },
];

export default function MessagesPage() {
  const { locale } = useLocaleStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastClass, setBroadcastClass] = useState('all');

  const filteredConversations = mockConversations.filter((conv) =>
    conv.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.parentNameNe.includes(searchQuery) ||
    conv.childNameNe.includes(searchQuery)
  );

  const unreadCount = mockConversations.filter((c) => c.unread).length;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    toast.success(locale === 'en' ? 'Message sent!' : 'सन्देश पठाइयो!');
    setNewMessage('');
  };

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    toast.success(
      locale === 'en'
        ? 'Message broadcast to all parents!'
        : 'सबै अभिभावकहरूलाई सन्देश प्रसारण गरियो!'
    );
    setIsBroadcastOpen(false);
    setBroadcastMessage('');
  };

  if (selectedConversation) {
    return (
      <div className="space-y-4 h-[calc(100vh-12rem)] flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setSelectedConversation(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {selectedConversation.parentName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {locale === 'en' ? selectedConversation.parentName : selectedConversation.parentNameNe}
            </p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? `Parent of ${selectedConversation.childName}` : `${selectedConversation.childNameNe}को अभिभावक`}
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
              <p className="text-sm">How is my child doing in class?</p>
              <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
              <p className="text-sm">Your child is doing wonderfully! They participated actively in all activities today.</p>
              <p className="text-xs opacity-70 mt-1">Yesterday</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
              <p className="text-sm">{selectedConversation.lastMessage}</p>
              <p className="text-xs text-muted-foreground mt-1">{selectedConversation.time}</p>
            </div>
          </div>
        </div>

        {/* Quick Messages */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickMessages.map((msg, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setNewMessage(locale === 'en' ? msg.en : msg.ne)}
            >
              {locale === 'en' ? msg.en : msg.ne}
            </Button>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="ghost" size="icon">
            <Image className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={locale === 'en' ? 'Type a message...' : 'सन्देश टाइप गर्नुहोस्...'}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/preschool">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {locale === 'en' ? 'Messages' : 'सन्देशहरू'}
            {unreadCount > 0 && (
              <Badge className="h-6 px-2">{unreadCount}</Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Communicate with parents'
              : 'अभिभावकहरूसँग सम्पर्क गर्नुहोस्'}
          </p>
        </div>
        <Button onClick={() => setIsBroadcastOpen(true)}>
          <Megaphone className="h-4 w-4 mr-2" />
          {locale === 'en' ? 'Broadcast' : 'प्रसारण'}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={locale === 'en' ? 'Search conversations...' : 'कुराकानी खोज्नुहोस्...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Conversations List */}
      <div className="space-y-2">
        {filteredConversations.map((conv) => (
          <Card
            key={conv.id}
            className={cn(
              'cursor-pointer hover:bg-muted/50 transition-colors',
              conv.unread && 'border-primary/50 bg-primary/5'
            )}
            onClick={() => setSelectedConversation(conv)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {conv.childName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn('font-medium', conv.unread && 'font-semibold')}>
                      {locale === 'en' ? conv.parentName : conv.parentNameNe}
                    </p>
                    <div className="flex items-center gap-2">
                      {conv.unread && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'en' ? `Parent of ${conv.childName}` : `${conv.childNameNe}को अभिभावक`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {conv.lastMessage}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Broadcast Dialog */}
      <Dialog open={isBroadcastOpen} onOpenChange={setIsBroadcastOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              {locale === 'en' ? 'Broadcast Message' : 'प्रसारण सन्देश'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Send to' : 'पठाउनुहोस्'}</Label>
              <Select value={broadcastClass} onValueChange={setBroadcastClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {locale === 'en' ? 'All Parents' : 'सबै अभिभावकहरू'}
                  </SelectItem>
                  <SelectItem value="butterfly">
                    {locale === 'en' ? 'Butterfly Class' : 'पुतली कक्षा'}
                  </SelectItem>
                  <SelectItem value="sunshine">
                    {locale === 'en' ? 'Sunshine Class' : 'घाम कक्षा'}
                  </SelectItem>
                  <SelectItem value="rainbow">
                    {locale === 'en' ? 'Rainbow Class' : 'इन्द्रेणी कक्षा'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Quick Messages' : 'द्रुत सन्देशहरू'}</Label>
              <div className="flex flex-wrap gap-2">
                {quickMessages.slice(0, 2).map((msg, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setBroadcastMessage(locale === 'en' ? msg.en : msg.ne)}
                  >
                    {locale === 'en' ? msg.en : msg.ne}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Message' : 'सन्देश'}</Label>
              <Textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder={
                  locale === 'en'
                    ? 'Type your message...'
                    : 'आफ्नो सन्देश टाइप गर्नुहोस्...'
                }
                rows={4}
              />
            </div>

            <Button className="w-full" onClick={handleBroadcast}>
              <Send className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Send Broadcast' : 'प्रसारण पठाउनुहोस्'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
