'use client';

import { useState, useMemo } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Search, Plus, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ChatView, Message, Conversation } from '@/components/shared/ChatView';

// Mock conversation data
const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'TCH-001',
    participantName: 'Ram Kumar Sharma',
    participantNameNe: 'राम कुमार शर्मा',
    participantRole: 'Mathematics Teacher',
    participantRoleNe: 'गणित शिक्षक',
    participantInitials: 'RK',
    isOnline: true,
  },
  {
    id: '2',
    participantId: 'TCH-002',
    participantName: 'Sita Devi Thapa',
    participantNameNe: 'सीता देवी थापा',
    participantRole: 'Science Teacher',
    participantRoleNe: 'विज्ञान शिक्षक',
    participantInitials: 'SD',
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '3',
    participantId: 'TCH-003',
    participantName: 'Hari Prasad Poudel',
    participantNameNe: 'हरि प्रसाद पौडेल',
    participantRole: 'Class Teacher',
    participantRoleNe: 'कक्षा शिक्षक',
    participantInitials: 'HP',
    isOnline: false,
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '4',
    participantId: 'ADM-001',
    participantName: 'School Admin',
    participantNameNe: 'विद्यालय प्रशासन',
    participantRole: 'Administration',
    participantRoleNe: 'प्रशासन',
    participantInitials: 'SA',
    isOnline: true,
  },
];

// Mock messages for each conversation
const mockMessagesMap: Record<string, { messages: Message[]; unread: number; lastMessage: { en: string; ne: string }; timestamp: string; timestampNe: string }> = {
  '1': {
    unread: 2,
    lastMessage: {
      en: 'Your child did excellent in the math test!',
      ne: 'तपाईंको बच्चाले गणित परीक्षामा उत्कृष्ट गर्यो!',
    },
    timestamp: '2 hours ago',
    timestampNe: '२ घण्टा पहिले',
    messages: [
      {
        id: 'm1',
        content: 'Hello, I wanted to discuss Aarav\'s progress in mathematics.',
        contentNe: 'नमस्ते, म आरवको गणितमा प्रगतिको बारेमा छलफल गर्न चाहन्थें।',
        senderId: 'PAR-001',
        senderName: 'You',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm2',
        content: 'Hello! Aarav has been doing very well in class. His attention to detail has improved significantly.',
        contentNe: 'नमस्ते! आरव कक्षामा धेरै राम्रो गरिरहेको छ। उनको विस्तारमा ध्यान धेरै सुधार भएको छ।',
        senderId: 'TCH-001',
        senderName: 'Ram Kumar Sharma',
        senderNameNe: 'राम कुमार शर्मा',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm3',
        content: 'That\'s great to hear! How did he perform in the recent unit test?',
        contentNe: 'यो सुन्न राम्रो लाग्यो! हालको एकाइ परीक्षामा उनले कस्तो प्रदर्शन गरे?',
        senderId: 'PAR-001',
        senderName: 'You',
        timestamp: new Date(Date.now() - 2.2 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm4',
        content: 'Your child did excellent in the math test! He scored 45 out of 50. Top 5 in the class!',
        contentNe: 'तपाईंको बच्चाले गणित परीक्षामा उत्कृष्ट गर्यो! उसले ५० मध्ये ४५ अंक ल्यायो। कक्षामा शीर्ष ५ मा!',
        senderId: 'TCH-001',
        senderName: 'Ram Kumar Sharma',
        senderNameNe: 'राम कुमार शर्मा',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'delivered',
        type: 'text',
      },
      {
        id: 'm5',
        content: 'I\'ve attached his answer sheet for your reference.',
        contentNe: 'मैले तपाईंको सन्दर्भको लागि उनको उत्तर पत्र संलग्न गरेको छु।',
        senderId: 'TCH-001',
        senderName: 'Ram Kumar Sharma',
        senderNameNe: 'राम कुमार शर्मा',
        timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
        status: 'delivered',
        type: 'text',
      },
    ],
  },
  '2': {
    unread: 0,
    lastMessage: {
      en: 'Please send the science project materials.',
      ne: 'कृपया विज्ञान परियोजना सामग्री पठाउनुहोस्।',
    },
    timestamp: 'Yesterday',
    timestampNe: 'हिजो',
    messages: [
      {
        id: 'm6',
        content: 'Good morning! The science fair project is due next week.',
        contentNe: 'शुभ प्रभात! विज्ञान मेला परियोजना अर्को हप्ता समाप्त हुन्छ।',
        senderId: 'TCH-002',
        senderName: 'Sita Devi Thapa',
        senderNameNe: 'सीता देवी थापा',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm7',
        content: 'Thank you for the reminder. What materials do we need?',
        contentNe: 'सम्झनाको लागि धन्यवाद। हामीलाई के सामग्री चाहिन्छ?',
        senderId: 'PAR-001',
        senderName: 'You',
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm8',
        content: 'Please send the science project materials. I\'ve sent the list to Aarav\'s school diary.',
        contentNe: 'कृपया विज्ञान परियोजना सामग्री पठाउनुहोस्। मैले आरवको विद्यालय डायरीमा सूची पठाएको छु।',
        senderId: 'TCH-002',
        senderName: 'Sita Devi Thapa',
        senderNameNe: 'सीता देवी थापा',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
    ],
  },
  '3': {
    unread: 0,
    lastMessage: {
      en: 'PTM reminder for next week.',
      ne: 'अर्को हप्ताको लागि PTM रिमाइन्डर।',
    },
    timestamp: '2 days ago',
    timestampNe: '२ दिन पहिले',
    messages: [
      {
        id: 'm9',
        content: 'Dear parent, this is a reminder that Parent-Teacher Meeting is scheduled for next Friday.',
        contentNe: 'प्रिय अभिभावक, यो एक सम्झना हो कि अभिभावक-शिक्षक बैठक अर्को शुक्रबारको लागि तय गरिएको छ।',
        senderId: 'TCH-003',
        senderName: 'Hari Prasad Poudel',
        senderNameNe: 'हरि प्रसाद पौडेल',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm10',
        content: 'Thank you. I will be there at 10 AM.',
        contentNe: 'धन्यवाद। म बिहान १० बजे त्यहाँ हुनेछु।',
        senderId: 'PAR-001',
        senderName: 'You',
        timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
    ],
  },
  '4': {
    unread: 1,
    lastMessage: {
      en: 'Fee payment reminder for January.',
      ne: 'जनवरीको लागि शुल्क भुक्तानी रिमाइन्डर।',
    },
    timestamp: '3 days ago',
    timestampNe: '३ दिन पहिले',
    messages: [
      {
        id: 'm11',
        content: 'Dear parent, this is a reminder that the January fee payment is due by the 15th.',
        contentNe: 'प्रिय अभिभावक, यो एक सम्झना हो कि जनवरीको शुल्क भुक्तानी १५ गतेसम्म हुनुपर्छ।',
        senderId: 'ADM-001',
        senderName: 'School Admin',
        senderNameNe: 'विद्यालय प्रशासन',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
        status: 'delivered',
        type: 'text',
      },
    ],
  },
};

const CURRENT_USER_ID = 'PAR-001';

export default function MessagesPage() {
  const { locale } = useLocaleStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState(mockMessagesMap);

  const filteredConversations = mockConversations.filter((conv) => {
    const query = searchQuery.toLowerCase();
    return (
      conv.participantName.toLowerCase().includes(query) ||
      conv.participantNameNe.includes(searchQuery) ||
      conv.participantRole.toLowerCase().includes(query)
    );
  });

  const selectedConversation = mockConversations.find(
    (c) => c.id === selectedConversationId
  );

  const handleCompose = () => {
    toast.info(
      locale === 'en'
        ? 'Select a teacher or admin to start messaging'
        : 'सन्देश पठाउन शिक्षक वा प्रशासन छान्नुहोस्'
    );
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    // Mark messages as read
    if (conversationMessages[id]) {
      setConversationMessages((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          unread: 0,
          messages: prev[id].messages.map((m) =>
            m.senderId !== CURRENT_USER_ID ? { ...m, status: 'read' as const } : m
          ),
        },
      }));
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      content,
      senderId: CURRENT_USER_ID,
      senderName: 'You',
      timestamp: new Date(),
      status: 'sending',
      type: 'text',
    };

    setConversationMessages((prev) => ({
      ...prev,
      [selectedConversationId]: {
        ...prev[selectedConversationId],
        messages: [...prev[selectedConversationId].messages, newMessage],
        lastMessage: { en: content, ne: content },
        timestamp: 'Just now',
        timestampNe: 'भर्खरै',
      },
    }));

    // Simulate message sent after 500ms
    setTimeout(() => {
      setConversationMessages((prev) => ({
        ...prev,
        [selectedConversationId]: {
          ...prev[selectedConversationId],
          messages: prev[selectedConversationId].messages.map((m) =>
            m.id === newMessage.id ? { ...m, status: 'sent' as const } : m
          ),
        },
      }));
    }, 500);

    // Simulate message delivered after 1s
    setTimeout(() => {
      setConversationMessages((prev) => ({
        ...prev,
        [selectedConversationId]: {
          ...prev[selectedConversationId],
          messages: prev[selectedConversationId].messages.map((m) =>
            m.id === newMessage.id ? { ...m, status: 'delivered' as const } : m
          ),
        },
      }));
    }, 1000);
  };

  const handleBack = () => {
    setSelectedConversationId(null);
  };

  const totalUnread = Object.values(conversationMessages).reduce(
    (sum, conv) => sum + conv.unread,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header - Only show when not in chat view on mobile */}
      <div className={cn('flex items-center justify-between', selectedConversationId && 'hidden md:flex')}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/parent">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {locale === 'en' ? 'Messages' : 'सन्देशहरू'}
              </h1>
              {totalUnread > 0 && (
                <Badge className="h-6 px-2">
                  {totalUnread}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? 'Communicate with teachers and school'
                : 'शिक्षक र विद्यालयसँग सम्पर्क गर्नुहोस्'}
            </p>
          </div>
        </div>
        <Button onClick={handleCompose}>
          <Plus className="h-4 w-4 mr-2" />
          {locale === 'en' ? 'Compose' : 'लेख्नुहोस्'}
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-[350px_1fr] gap-6">
        {/* Conversations List */}
        <div className={cn('space-y-4', selectedConversationId && 'hidden md:block')}>
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

          {/* Conversations */}
          <div className="space-y-2">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const convData = conversationMessages[conversation.id];
                return (
                  <Card
                    key={conversation.id}
                    className={cn(
                      'cursor-pointer transition-colors hover:bg-accent',
                      selectedConversationId === conversation.id && 'bg-accent border-primary'
                    )}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {conversation.participantInitials}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                {locale === 'en'
                                  ? conversation.participantName
                                  : conversation.participantNameNe}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {locale === 'en'
                                  ? conversation.participantRole
                                  : conversation.participantRoleNe}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {locale === 'en' ? convData?.timestamp : convData?.timestampNe}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {locale === 'en'
                                ? convData?.lastMessage.en
                                : convData?.lastMessage.ne}
                            </p>
                            {convData?.unread > 0 && (
                              <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {convData.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">
                  {locale === 'en' ? 'No conversations found' : 'कुनै कुराकानी फेला परेन'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === 'en'
                    ? 'Try a different search term'
                    : 'फरक खोज शब्द प्रयास गर्नुहोस्'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat View or Empty State */}
        <div className={cn(!selectedConversationId && 'hidden md:block')}>
          {selectedConversation && conversationMessages[selectedConversation.id] ? (
            <ChatView
              conversation={selectedConversation}
              messages={conversationMessages[selectedConversation.id].messages}
              currentUserId={CURRENT_USER_ID}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
            />
          ) : (
            <div className="hidden md:flex items-center justify-center h-[calc(100vh-12rem)] bg-muted/30 rounded-lg border">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">
                  {locale === 'en'
                    ? 'Select a conversation'
                    : 'कुराकानी छान्नुहोस्'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  {locale === 'en'
                    ? 'Choose a conversation from the list to start messaging'
                    : 'सन्देश पठाउन सूचीबाट कुराकानी छान्नुहोस्'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
