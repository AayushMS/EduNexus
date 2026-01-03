/**
 * Activity Feed Generator for EduNexus Demo
 * Generates realistic classroom moments and activity feed items
 */

import { faker } from '@faker-js/faker';
import type {
  ActivityFeedItem,
  MediaItem,
  ReactionCounts,
  ClassroomMoment,
  MomentType,
  Comment,
} from '@/types/activity.types';
import activitiesData from '../seeds/activities.json';

const activityTemplates = activitiesData.activityTemplates;
const moodEmojis = activitiesData.moodEmojis;
const activityTags = activitiesData.activityTags;

// Local sample photos organized by category
// These should be placed in /public/images/moments/
const LOCAL_PHOTOS = {
  science_lab: [
    '/images/moments/science-lab-1.jpg',
    '/images/moments/science-lab-2.jpg',
  ],
  art_class: [
    '/images/moments/art-class-1.jpg',
    '/images/moments/art-class-2.jpg',
  ],
  sports: [
    '/images/moments/football-1.jpg',
    '/images/moments/sports-day-1.jpg',
    '/images/moments/morning-exercise-1.jpg',
  ],
  cultural: [
    '/images/moments/traditional-dance-1.jpg',
    '/images/moments/festival-1.jpg',
  ],
  music: [
    '/images/moments/music-class-1.jpg',
  ],
  library: [
    '/images/moments/reading-time-1.jpg',
  ],
  assembly: [
    '/images/moments/assembly-1.jpg',
  ],
  general: [
    '/images/moments/math-class-1.jpg',
    '/images/moments/computer-class-1.jpg',
    '/images/moments/classroom-1.jpg',
  ],
  field_trip: [
    '/images/moments/field-trip-1.jpg',
  ],
  celebration: [
    '/images/moments/festival-1.jpg',
    '/images/moments/celebration-1.jpg',
  ],
  preschool: [
    '/images/moments/preschool-play-1.jpg',
    '/images/moments/preschool-outdoor-1.jpg',
    '/images/moments/preschool-story-1.jpg',
    '/images/moments/preschool-abc-1.jpg',
  ],
};

// Fallback to placeholder if local images don't exist
const PLACEHOLDER_PHOTOS = [
  '/images/moments/classroom-1.jpg',
  '/images/moments/math-class-1.jpg',
  '/images/moments/computer-class-1.jpg',
];

// Get photos for a specific moment type
function getPhotosForMomentType(momentType: string): string[] {
  const photos = LOCAL_PHOTOS[momentType as keyof typeof LOCAL_PHOTOS] || LOCAL_PHOTOS.general;
  return photos.length > 0 ? photos : PLACEHOLDER_PHOTOS;
}

function generateMediaItems(momentType: string = 'general'): MediaItem[] {
  const numItems = 1 + Math.floor(Math.random() * 3); // 1-3 media items
  const items: MediaItem[] = [];
  const photos = getPhotosForMomentType(momentType);

  for (let i = 0; i < numItems; i++) {
    const isVideo = Math.random() > 0.9; // 10% videos
    const photoUrl = photos[Math.floor(Math.random() * photos.length)];

    items.push({
      id: faker.string.uuid(),
      type: isVideo ? 'video' : 'image',
      url: photoUrl,
      thumbnailUrl: photoUrl,
      caption: Math.random() > 0.5 ? 'Learning is fun!' : undefined,
      captionNe: Math.random() > 0.5 ? 'सिक्नु रमाइलो छ!' : undefined,
      width: 800,
      height: 600,
      duration: isVideo ? 15 + Math.floor(Math.random() * 45) : undefined,
    });
  }

  return items;
}

function generateReactionCounts(): ReactionCounts {
  const heart = Math.floor(Math.random() * 30);
  const clap = Math.floor(Math.random() * 20);
  const smile = Math.floor(Math.random() * 15);
  const celebrate = Math.floor(Math.random() * 10);
  const fire = Math.floor(Math.random() * 5);

  return {
    heart,
    clap,
    smile,
    celebrate,
    fire,
    total: heart + clap + smile + celebrate + fire,
  };
}

function generateComments(activityId: string): Comment[] {
  const numComments = Math.floor(Math.random() * 5);
  const comments: Comment[] = [];

  const commentTexts = [
    { en: 'My child loved this activity!', ne: 'मेरो बच्चाले यो गतिविधि मन पराए!' },
    { en: 'Great work by the teachers!', ne: 'शिक्षकहरूको उत्कृष्ट काम!' },
    { en: 'Thank you for sharing these moments.', ne: 'यी पलहरू साझा गर्नुभएकोमा धन्यवाद।' },
    { en: 'Looking forward to more such activities.', ne: 'थप यस्ता गतिविधिहरूको प्रतीक्षामा।' },
    { en: 'Amazing progress!', ne: 'अद्भुत प्रगति!' },
  ];

  for (let i = 0; i < numComments; i++) {
    const text = commentTexts[Math.floor(Math.random() * commentTexts.length)];
    const daysAgo = Math.floor(Math.random() * 7);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    comments.push({
      id: `${activityId}-comment-${i}`,
      activityId,
      authorId: `PAR-${faker.string.alphanumeric(8)}`,
      authorName: faker.person.fullName(),
      authorNameNe: 'अभिभावक',
      authorRole: 'parent',
      content: text.en,
      createdAt: date,
      updatedAt: date,
      likes: Math.floor(Math.random() * 10),
      likedByUserIds: [],
    });
  }

  return comments;
}

function generateActivityTags(): { en: string[]; ne: string[] } {
  const numTags = 1 + Math.floor(Math.random() * 3);
  const shuffled = [...activityTags].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numTags);

  return {
    en: selected.map(t => t.en),
    ne: selected.map(t => t.ne),
  };
}

export function generateClassroomMoment(
  index: number,
  daysAgo: number = 0
): ClassroomMoment {
  const momentTypes: MomentType[] = [
    'science_lab', 'art_class', 'sports', 'cultural', 'general',
    'music', 'library', 'assembly', 'field_trip'
  ];

  const momentType = momentTypes[Math.floor(Math.random() * momentTypes.length)];

  // Find matching template
  const templateGroup = activityTemplates.find(
    t => t.type === 'classroom_moment' && t.momentType === momentType
  );

  let title = 'Classroom Activity';
  let titleNe = 'कक्षा गतिविधि';
  let content = 'Students enjoyed learning today!';
  let contentNe = 'विद्यार्थीहरूले आज सिक्न रमाइलो गरे!';

  if (templateGroup && templateGroup.templates && templateGroup.templates.length > 0) {
    const template = templateGroup.templates[0] as {
      title: string;
      titleNe: string;
      content: string;
      contentNe: string;
      topics?: { en: string; ne: string }[];
    };
    const topics = template.topics || [];
    const topic = topics.length > 0
      ? topics[Math.floor(Math.random() * topics.length)]
      : { en: 'learning', ne: 'सिकाइ' };

    title = template.title.replace('{topic}', topic.en);
    titleNe = template.titleNe.replace('{topic}', topic.ne);
    content = template.content.replace('{topic}', topic.en);
    contentNe = template.contentNe.replace('{topic}', topic.ne);
  }

  const id = `ACT-${String(index).padStart(4, '0')}`;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(8 + Math.floor(Math.random() * 8)); // School hours

  const tags = generateActivityTags();
  const moodKeys = Object.keys(moodEmojis) as Array<keyof typeof moodEmojis>;
  const mood = moodEmojis[moodKeys[Math.floor(Math.random() * moodKeys.length)]];

  const moment: ClassroomMoment = {
    id,
    type: 'classroom_moment',
    momentType,

    authorId: `TCH-${String(1 + Math.floor(Math.random() * 20)).padStart(3, '0')}`,
    authorName: faker.person.fullName(),
    authorNameNe: 'शिक्षक',
    authorRole: 'teacher',
    authorAvatarUrl: undefined,

    title,
    titleNe,
    content,
    contentNe,

    media: generateMediaItems(momentType),
    mediaLayout: Math.random() > 0.5 ? 'grid' : 'single',

    taggedStudentIds: [],
    taggedClassIds: [`CLS-${1 + Math.floor(Math.random() * 10)}A`],
    activityTags: tags.en,
    activityTagsNe: tags.ne,

    reactions: [],
    reactionCounts: generateReactionCounts(),
    comments: [],
    commentCount: 0,

    visibility: 'class',
    isPinned: Math.random() > 0.95,
    createdAt: date,
    updatedAt: date,

    // Moment-specific
    subjectId: undefined,
    subjectName: undefined,
    subjectNameNe: undefined,
    moodEmoji: mood,
  };

  // Add comments
  moment.comments = generateComments(id);
  moment.commentCount = moment.comments.length;

  return moment;
}

export function generateActivityFeed(count: number = 100): ActivityFeedItem[] {
  const activities: ActivityFeedItem[] = [];

  for (let i = 0; i < count; i++) {
    // Spread activities over past 90 days
    const daysAgo = Math.floor(Math.random() * 90);
    activities.push(generateClassroomMoment(i + 1, daysAgo));
  }

  // Sort by date (newest first)
  activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return activities;
}

// Generate sample activity feed for demo
export const demoActivityFeed = generateActivityFeed(50);
