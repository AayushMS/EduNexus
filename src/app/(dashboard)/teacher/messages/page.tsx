'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Search,
  Send,
  Users,
  Megaphone,
  MessageSquare,
  ChevronRight,
  Clock,
  CheckCheck,
  FileText,
  Calendar,
  CreditCard,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  parentName: string;
  parentNameNe: string;
  studentName: string;
  studentNameNe: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface MessageTemplate {
  id: string;
  title: string;
  titleNe: string;
  content: string;
  contentNe: string;
  icon: React.ReactNode;
}

const mockConversations: Conversation[] = [
  { id: '1', parentName: 'Mr. Sharma', parentNameNe: 'श्री शर्मा', studentName: 'Aarav', studentNameNe: 'आरव', lastMessage: 'Thank you for the update!', time: '10 min ago', unread: true },
  { id: '2', parentName: 'Mrs. Thapa', parentNameNe: 'श्रीमती थापा', studentName: 'Sita', studentNameNe: 'सीता', lastMessage: 'She has been doing great in class.', time: '1 hour ago', unread: false },
  { id: '3', parentName: 'Mr. Gurung', parentNameNe: 'श्री गुरुङ', studentName: 'Ram', studentNameNe: 'राम', lastMessage: 'Will he be attending tomorrow?', time: '2 hours ago', unread: true },
  { id: '4', parentName: 'Mrs. Rai', parentNameNe: 'श्रीमती राई', studentName: 'Priya', studentNameNe: 'प्रिया', lastMessage: 'Understood, thank you.', time: 'Yesterday', unread: false },
  { id: '5', parentName: 'Mr. Tamang', parentNameNe: 'श्री तामाङ', studentName: 'Kiran', studentNameNe: 'किरण', lastMessage: 'I will send the materials tomorrow.', time: 'Yesterday', unread: false },
];

const messageTemplates: MessageTemplate[] = [
  {
    id: '1',
    title: 'PTM Reminder',
    titleNe: 'PTM रिमाइन्डर',
    content: 'Dear Parents, this is a reminder for the upcoming Parent-Teacher Meeting scheduled for [DATE]. Please confirm your attendance.',
    contentNe: 'प्रिय अभिभावकहरू, यो [DATE] मा निर्धारित अभिभावक-शिक्षक बैठकको लागि रिमाइन्डर हो। कृपया आफ्नो उपस्थिति पुष्टि गर्नुहोस्।',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    id: '2',
    title: 'Fee Reminder',
    titleNe: 'शुल्क रिमाइन्डर',
    content: 'Dear Parents, this is a reminder that the fee payment for [MONTH] is due. Please submit the fees at your earliest convenience.',
    contentNe: 'प्रिय अभिभावकहरू, [MONTH] को शुल्क भुक्तानी बाँकी छ भनी याद दिलाउँछौं। कृपया चाँडो भुक्तान गर्नुहोस्।',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: '3',
    title: 'Homework Reminder',
    titleNe: 'गृहकार्य रिमाइन्डर',
    content: 'Dear Parents, please ensure that your child completes the [SUBJECT] homework assigned today. Due date: [DATE].',
    contentNe: 'प्रिय अभिभावकहरू, कृपया तपाईंको बच्चाले आज दिइएको [SUBJECT] गृहकार्य पूरा गरेको सुनिश्चित गर्नुहोस्। म्याद: [DATE]।',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: '4',
    title: 'General Announcement',
    titleNe: 'सामान्य घोषणा',
    content: 'Dear Parents, we would like to inform you about [ANNOUNCEMENT]. Thank you for your cooperation.',
    contentNe: 'प्रिय अभिभावकहरू, हामी तपाईंलाई [ANNOUNCEMENT] बारेमा जानकारी दिन चाहन्छौं। तपाईंको सहयोगको लागि धन्यवाद।',
    icon: <Bell className="h-5 w-5" />,
  },
];

export default function MessagesPage() {
  const { locale } = useLocaleStore();
  const [activeTab, setActiveTab] = useState('conversations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastRecipients, setBroadcastRecipients] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

  const filteredConversations = mockConversations.filter((conv) =>
    conv.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.parentNameNe.includes(searchQuery) ||
    conv.studentNameNe.includes(searchQuery)
  );

  const unreadCount = mockConversations.filter((c) => c.unread).length;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    toast.success(
      locale === 'en' ? 'Message sent!' : 'सन्देश पठाइयो!'
    );
    setNewMessage('');
  };

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;

    toast.success(
      locale === 'en'
        ? `Broadcast sent to ${broadcastRecipients === 'all' ? 'all parents' : broadcastRecipients}`
        : `${broadcastRecipients === 'all' ? 'सबै अभिभावकहरूलाई' : broadcastRecipients} प्रसारण पठाइयो`
    );
    setIsBroadcastOpen(false);
    setBroadcastMessage('');
  };

  const useTemplate = (template: MessageTemplate) => {
    setBroadcastMessage(locale === 'en' ? template.content : template.contentNe);
    setSelectedTemplate(template);
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
              {locale === 'en' ? `Parent of ${selectedConversation.studentName}` : `${selectedConversation.studentNameNe}को अभिभावक`}
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
              <p className="text-sm">Hello! I wanted to give you an update on your child's progress.</p>
              <p className="text-xs opacity-70 mt-1">10:30 AM</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
              <p className="text-sm">{selectedConversation.lastMessage}</p>
              <p className="text-xs text-muted-foreground mt-1">{selectedConversation.time}</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="flex gap-2 pt-4 border-t">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={locale === 'en' ? 'Type a message...' : 'सन्देश टाइप गर्नुहोस्...'}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
          <Link href="/teacher">
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="conversations" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Conversations' : 'कुराकानी'}
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Templates' : 'टेम्प्लेटहरू'}
          </TabsTrigger>
        </TabsList>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="mt-4 space-y-4">
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

          {/* Conversation List */}
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
                        {conv.parentName.slice(0, 2).toUpperCase()}
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
                        {locale === 'en' ? `Parent of ${conv.studentName}` : `${conv.studentNameNe}को अभिभावक`}
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
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-4">
          <div className="space-y-3">
            {messageTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  useTemplate(template);
                  setIsBroadcastOpen(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {locale === 'en' ? template.title : template.titleNe}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {locale === 'en' ? template.content : template.contentNe}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Broadcast Dialog */}
      <Dialog open={isBroadcastOpen} onOpenChange={setIsBroadcastOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              {locale === 'en' ? 'Broadcast Message' : 'प्रसारण सन्देश'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Recipients */}
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Send to' : 'पठाउनुहोस्'}</Label>
              <Select value={broadcastRecipients} onValueChange={setBroadcastRecipients}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {locale === 'en' ? 'All Parents' : 'सबै अभिभावकहरू'}
                  </SelectItem>
                  <SelectItem value="7A">
                    {locale === 'en' ? 'Grade 7A Parents' : 'कक्षा ७A अभिभावकहरू'}
                  </SelectItem>
                  <SelectItem value="7B">
                    {locale === 'en' ? 'Grade 7B Parents' : 'कक्षा ७B अभिभावकहरू'}
                  </SelectItem>
                  <SelectItem value="8A">
                    {locale === 'en' ? 'Grade 8A Parents' : 'कक्षा ८A अभिभावकहरू'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Templates */}
            {!selectedTemplate && (
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Quick Templates' : 'द्रुत टेम्प्लेटहरू'}</Label>
                <div className="flex flex-wrap gap-2">
                  {messageTemplates.slice(0, 3).map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      onClick={() => useTemplate(template)}
                    >
                      {locale === 'en' ? template.title : template.titleNe}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
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
                rows={5}
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
