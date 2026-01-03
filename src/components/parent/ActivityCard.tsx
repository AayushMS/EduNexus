'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useLocaleStore } from '@/store/localeStore';
import type { ActivityFeedItem, ReactionType } from '@/types/activity.types';
import { REACTION_EMOJIS, MOMENT_TYPES } from '@/types/activity.types';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Share2, MoreHorizontal, Pin, Heart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActivityCardProps {
  activity: ActivityFeedItem;
  onReact?: (activityId: string, reaction: ReactionType) => void;
}

export function ActivityCard({ activity, onReact }: ActivityCardProps) {
  const { locale } = useLocaleStore();
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [showComments, setShowComments] = useState(false);

  const title = locale === 'en' ? activity.title : activity.titleNe;
  const content = locale === 'en' ? activity.content : activity.contentNe;
  const authorName = locale === 'en' ? activity.authorName : activity.authorNameNe;

  const momentType = activity.type === 'classroom_moment' && 'momentType' in activity
    ? MOMENT_TYPES[(activity as { momentType: keyof typeof MOMENT_TYPES }).momentType]
    : null;

  const handleReaction = (reaction: ReactionType) => {
    setUserReaction(reaction);
    setShowReactions(false);
    onReact?.(activity.id, reaction);
  };

  const timeAgo = formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true });

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activity.authorAvatarUrl} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{authorName}</p>
                {momentType && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {momentType.icon} {locale === 'en' ? momentType.en : momentType.ne}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {activity.isPinned && (
              <Pin className="h-4 w-4 text-primary" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  {locale === 'en' ? 'Save post' : 'पोस्ट सेभ गर्नुहोस्'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {locale === 'en' ? 'Hide post' : 'पोस्ट लुकाउनुहोस्'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Title and Content */}
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{content}</p>

        {/* Activity Tags */}
        {activity.activityTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(locale === 'en' ? activity.activityTags : activity.activityTagsNe).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Media */}
        {activity.media.length > 0 && (
          <div className={`grid gap-2 ${
            activity.media.length === 1 ? 'grid-cols-1' :
            activity.media.length === 2 ? 'grid-cols-2' :
            activity.media.length === 3 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {activity.media.slice(0, 4).map((media, index) => (
              <div
                key={media.id}
                className={`relative rounded-lg overflow-hidden ${
                  activity.media.length === 3 && index === 0 ? 'row-span-2' : ''
                } ${activity.media.length === 1 ? 'aspect-video' : 'aspect-square'}`}
              >
                <Image
                  src={media.url}
                  alt={media.caption || 'Activity photo'}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
                {activity.media.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      +{activity.media.length - 4}
                    </span>
                  </div>
                )}
                {media.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-3">
                      <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Reaction Summary */}
      <div className="px-4 py-2 border-t border-b flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          {activity.reactionCounts.total > 0 && (
            <>
              <div className="flex -space-x-1">
                {Object.entries(REACTION_EMOJIS)
                  .filter(([key]) => activity.reactionCounts[key as ReactionType] > 0)
                  .slice(0, 3)
                  .map(([key, emoji]) => (
                    <span key={key} className="text-sm">{emoji}</span>
                  ))}
              </div>
              <span className="ml-1">{activity.reactionCounts.total}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {activity.commentCount > 0 && (
            <span>
              {activity.commentCount} {locale === 'en' ? 'comments' : 'टिप्पणीहरू'}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <CardFooter className="p-2">
        <div className="flex w-full gap-1">
          {/* Reaction Button */}
          <div className="relative flex-1">
            <Button
              variant="ghost"
              className="w-full justify-center gap-2"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
              onClick={() => handleReaction('heart')}
            >
              {userReaction ? (
                <span className="text-lg">{REACTION_EMOJIS[userReaction]}</span>
              ) : (
                <Heart className="h-4 w-4" />
              )}
              <span className="text-sm">
                {userReaction
                  ? (locale === 'en' ? 'Reacted' : 'प्रतिक्रिया')
                  : (locale === 'en' ? 'React' : 'प्रतिक्रिया')}
              </span>
            </Button>

            {/* Reaction Picker */}
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute bottom-full left-0 mb-2 bg-card border rounded-full px-2 py-1 shadow-lg flex gap-1"
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                >
                  {Object.entries(REACTION_EMOJIS).map(([key, emoji]) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-2xl p-1 hover:bg-secondary rounded-full transition-colors"
                      onClick={() => handleReaction(key as ReactionType)}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Comment Button */}
          <Button
            variant="ghost"
            className="flex-1 justify-center gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{locale === 'en' ? 'Comment' : 'टिप्पणी'}</span>
          </Button>

          {/* Share Button */}
          <Button variant="ghost" className="flex-1 justify-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="text-sm">{locale === 'en' ? 'Share' : 'साझा'}</span>
          </Button>
        </div>
      </CardFooter>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && activity.comments.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t px-4 py-3 space-y-3"
          >
            {activity.comments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.authorAvatarUrl} />
                  <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-secondary rounded-lg px-3 py-2">
                  <p className="text-sm font-medium">{comment.authorName}</p>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
            {activity.comments.length > 3 && (
              <Button variant="ghost" className="w-full text-sm">
                {locale === 'en'
                  ? `View all ${activity.comments.length} comments`
                  : `सबै ${activity.comments.length} टिप्पणीहरू हेर्नुहोस्`}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
