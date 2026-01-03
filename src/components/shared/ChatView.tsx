'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  Clock,
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  content: string;
  contentNe?: string;
  senderId: string;
  senderName: string;
  senderNameNe?: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantNameNe: string;
  participantRole: string;
  participantRoleNe: string;
  participantAvatar?: string;
  participantInitials: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

interface ChatViewProps {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack: () => void;
}

function formatMessageTime(date: Date, locale: string): string {
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return locale === 'en' ? 'Yesterday' : 'हिजो';
  }
  return format(date, 'MMM d');
}

function formatDateDivider(date: Date, locale: string): string {
  if (isToday(date)) {
    return locale === 'en' ? 'Today' : 'आज';
  }
  if (isYesterday(date)) {
    return locale === 'en' ? 'Yesterday' : 'हिजो';
  }
  return format(date, 'MMMM d, yyyy');
}

function MessageStatusIcon({ status }: { status: Message['status'] }) {
  switch (status) {
    case 'sending':
      return <Clock className="h-3 w-3 text-muted-foreground" />;
    case 'sent':
      return <Check className="h-3 w-3 text-muted-foreground" />;
    case 'delivered':
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    case 'read':
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    default:
      return null;
  }
}

export function ChatView({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
}: ChatViewProps) {
  const { locale } = useLocaleStore();
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const groupedMessages: { date: Date; messages: Message[] }[] = [];
  messages.forEach((message) => {
    const messageDate = new Date(message.timestamp);
    messageDate.setHours(0, 0, 0, 0);

    const existingGroup = groupedMessages.find(
      (g) => g.date.getTime() === messageDate.getTime()
    );

    if (existingGroup) {
      existingGroup.messages.push(message);
    } else {
      groupedMessages.push({ date: messageDate, messages: [message] });
    }
  });

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-background rounded-lg border">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            {conversation.participantAvatar ? (
              <AvatarImage src={conversation.participantAvatar} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {conversation.participantInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">
                {locale === 'en'
                  ? conversation.participantName
                  : conversation.participantNameNe}
              </h3>
              {conversation.isOnline && (
                <span className="w-2 h-2 rounded-full bg-green-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en'
                ? conversation.participantRole
                : conversation.participantRoleNe}
              {!conversation.isOnline && conversation.lastSeen && (
                <> • {locale === 'en' ? 'Last seen' : 'अन्तिम पटक देखिएको'} {formatMessageTime(conversation.lastSeen, locale)}</>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date Divider */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-muted px-3 py-1 rounded-full">
                  <span className="text-xs text-muted-foreground">
                    {formatDateDivider(group.date, locale)}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-3">
                <AnimatePresence>
                  {group.messages.map((message, index) => {
                    const isOwn = message.senderId === currentUserId;
                    const showAvatar =
                      !isOwn &&
                      (index === 0 ||
                        group.messages[index - 1]?.senderId !== message.senderId);

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          'flex items-end gap-2',
                          isOwn ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {!isOwn && (
                          <div className="w-8">
                            {showAvatar && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {conversation.participantInitials}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        )}
                        <div
                          className={cn(
                            'max-w-[70%] rounded-2xl px-4 py-2',
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-muted rounded-bl-md'
                          )}
                        >
                          {message.type === 'image' && message.attachmentUrl && (
                            <img
                              src={message.attachmentUrl}
                              alt="Attachment"
                              className="rounded-lg mb-2 max-w-full"
                            />
                          )}
                          {message.type === 'file' && message.attachmentName && (
                            <div className="flex items-center gap-2 mb-2 p-2 bg-background/10 rounded">
                              <Paperclip className="h-4 w-4" />
                              <span className="text-sm">{message.attachmentName}</span>
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap">
                            {locale === 'en' || !message.contentNe
                              ? message.content
                              : message.contentNe}
                          </p>
                          <div
                            className={cn(
                              'flex items-center gap-1 mt-1',
                              isOwn ? 'justify-end' : 'justify-start'
                            )}
                          >
                            <span
                              className={cn(
                                'text-[10px]',
                                isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              )}
                            >
                              {format(message.timestamp, 'h:mm a')}
                            </span>
                            {isOwn && <MessageStatusIcon status={message.status} />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={locale === 'en' ? 'Type a message...' : 'सन्देश लेख्नुहोस्...'}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
