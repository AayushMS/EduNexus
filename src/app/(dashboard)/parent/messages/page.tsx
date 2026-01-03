'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Search, Plus, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mock conversation data
const mockConversations = [
  {
    id: '1',
    teacherName: 'Ram Kumar Sharma',
    teacherNameNe: 'राम कुमार शर्मा',
    subject: 'Mathematics',
    subjectNe: 'गणित',
    lastMessage: 'Your child did excellent in the math test!',
    lastMessageNe: 'तपाईंको बच्चाले गणित परीक्षामा उत्कृष्ट गर्यो!',
    timestamp: '2 hours ago',
    timestampNe: '२ घण्टा पहिले',
    unread: 2,
    initials: 'RK',
  },
  {
    id: '2',
    teacherName: 'Sita Devi Thapa',
    teacherNameNe: 'सीता देवी थापा',
    subject: 'Science',
    subjectNe: 'विज्ञान',
    lastMessage: 'Please send the science project materials.',
    lastMessageNe: 'कृपया विज्ञान परियोजना सामग्री पठाउनुहोस्।',
    timestamp: 'Yesterday',
    timestampNe: 'हिजो',
    unread: 0,
    initials: 'SD',
  },
  {
    id: '3',
    teacherName: 'Hari Prasad Poudel',
    teacherNameNe: 'हरि प्रसाद पौडेल',
    subject: 'Class Teacher',
    subjectNe: 'कक्षा शिक्षक',
    lastMessage: 'PTM reminder for next week.',
    lastMessageNe: 'अर्को हप्ताको लागि PTM रिमाइन्डर।',
    timestamp: '2 days ago',
    timestampNe: '२ दिन पहिले',
    unread: 0,
    initials: 'HP',
  },
  {
    id: '4',
    teacherName: 'School Admin',
    teacherNameNe: 'विद्यालय प्रशासन',
    subject: 'Administration',
    subjectNe: 'प्रशासन',
    lastMessage: 'Fee payment reminder for January.',
    lastMessageNe: 'जनवरीको लागि शुल्क भुक्तानी रिमाइन्डर।',
    timestamp: '3 days ago',
    timestampNe: '३ दिन पहिले',
    unread: 1,
    initials: 'SA',
  },
];

export default function MessagesPage() {
  const { locale } = useLocaleStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const filteredConversations = mockConversations.filter((conv) => {
    const query = searchQuery.toLowerCase();
    return (
      conv.teacherName.toLowerCase().includes(query) ||
      conv.teacherNameNe.includes(searchQuery) ||
      conv.subject.toLowerCase().includes(query)
    );
  });

  const handleCompose = () => {
    toast.info(
      locale === 'en'
        ? 'Compose message feature coming soon!'
        : 'सन्देश लेख्ने सुविधा छिट्टै आउँदैछ!'
    );
  };

  const handleConversationClick = (id: string) => {
    setSelectedConversation(id);
    toast.info(
      locale === 'en'
        ? 'Chat view coming soon!'
        : 'च्याट दृश्य छिट्टै आउँदैछ!'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/parent">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {locale === 'en' ? 'Messages' : 'सन्देशहरू'}
            </h1>
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
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={cn(
                'cursor-pointer transition-colors hover:bg-accent',
                selectedConversation === conversation.id && 'bg-accent'
              )}
              onClick={() => handleConversationClick(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {conversation.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {locale === 'en'
                            ? conversation.teacherName
                            : conversation.teacherNameNe}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {locale === 'en' ? conversation.subject : conversation.subjectNe}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {locale === 'en' ? conversation.timestamp : conversation.timestampNe}
                        </span>
                        {conversation.unread > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {locale === 'en' ? conversation.lastMessage : conversation.lastMessageNe}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
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
  );
}
