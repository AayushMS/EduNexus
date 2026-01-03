import { useLocaleStore } from '@/store/localeStore';

// Translation dictionaries
const translations = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Try again',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search...',
      noResults: 'No results found',
      showMore: 'Show more',
      showLess: 'Show less',
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This week',
      thisMonth: 'This month',
      all: 'All',
    },
    auth: {
      selectRole: 'Select your role',
      welcome: 'Welcome to EduNexus',
      tagline: 'Experience Education, Reimagined',
      exploreDemo: 'Explore Demo',
      switchRole: 'Switch Role',
      logout: 'Logout',
    },
    roles: {
      parent: 'Parent',
      student: 'Student',
      teacher: 'Teacher',
      preschool: 'Pre-school',
    },
    dashboard: {
      overview: 'Overview',
      quickActions: 'Quick Actions',
      recentActivity: 'Recent Activity',
      upcomingEvents: 'Upcoming Events',
    },
    gamification: {
      xp: 'XP',
      level: 'Level',
      badges: 'Badges',
      streak: 'Streak',
      leaderboard: 'Leaderboard',
      achievements: 'Achievements',
    },
  },
  ne: {
    common: {
      loading: 'लोड हुँदैछ...',
      error: 'केही गलत भयो',
      retry: 'फेरि प्रयास गर्नुहोस्',
      cancel: 'रद्द गर्नुहोस्',
      save: 'सेभ गर्नुहोस्',
      delete: 'मेटाउनुहोस्',
      edit: 'सम्पादन',
      view: 'हेर्नुहोस्',
      search: 'खोज्नुहोस्...',
      noResults: 'कुनै परिणाम फेला परेन',
      showMore: 'थप देखाउनुहोस्',
      showLess: 'कम देखाउनुहोस्',
      today: 'आज',
      yesterday: 'हिजो',
      thisWeek: 'यो हप्ता',
      thisMonth: 'यो महिना',
      all: 'सबै',
    },
    auth: {
      selectRole: 'आफ्नो भूमिका छान्नुहोस्',
      welcome: 'EduNexus मा स्वागत छ',
      tagline: 'शिक्षा, नयाँ तरिकाले',
      exploreDemo: 'डेमो अन्वेषण गर्नुहोस्',
      switchRole: 'भूमिका बदल्नुहोस्',
      logout: 'लग आउट',
    },
    roles: {
      parent: 'अभिभावक',
      student: 'विद्यार्थी',
      teacher: 'शिक्षक',
      preschool: 'पूर्व-विद्यालय',
    },
    dashboard: {
      overview: 'सिंहावलोकन',
      quickActions: 'द्रुत कार्यहरू',
      recentActivity: 'हालैको गतिविधि',
      upcomingEvents: 'आगामी कार्यक्रमहरू',
    },
    gamification: {
      xp: 'XP',
      level: 'स्तर',
      badges: 'ब्याजहरू',
      streak: 'स्ट्रिक',
      leaderboard: 'लीडरबोर्ड',
      achievements: 'उपलब्धिहरू',
    },
  },
} as const;

type TranslationKeys = typeof translations.en;
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationKeys>;

// Get nested value from object using dot notation
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) return path;
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === 'string' ? current : path;
}

// Hook for translations
export function useTranslation() {
  const { locale } = useLocaleStore();

  const t = (key: string): string => {
    return getNestedValue(translations[locale] as Record<string, unknown>, key);
  };

  return { t, locale };
}

// Bilingual text component helper
export function getBilingualText(en: string, ne: string, locale: 'en' | 'ne'): string {
  return locale === 'en' ? en : ne;
}

export { translations };
