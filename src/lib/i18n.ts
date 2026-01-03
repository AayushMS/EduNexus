import { useLocaleStore } from '@/store/localeStore';

// Comprehensive translation dictionaries for EduNexus
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
      submit: 'Submit',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      done: 'Done',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      welcome: 'Welcome',
      logout: 'Logout',
      settings: 'Settings',
      help: 'Help',
      notifications: 'Notifications',
      profile: 'Profile',
    },
    auth: {
      selectRole: 'Select your role',
      welcome: 'Welcome to EduNexus',
      tagline: 'Experience Education, Reimagined',
      exploreDemo: 'Explore Demo',
      switchRole: 'Switch Role',
      logout: 'Logout',
      demoMode: 'Demo Mode - All data is simulated',
    },
    roles: {
      parent: 'Parent',
      student: 'Student',
      teacher: 'Teacher',
      preschool: 'Pre-school',
      parentDesc: 'Stay connected with your child\'s education',
      studentDesc: 'Learn, earn XP, and level up',
      teacherDesc: 'Manage classes efficiently',
      preschoolDesc: 'Track development milestones',
    },
    dashboard: {
      overview: 'Overview',
      quickActions: 'Quick Actions',
      recentActivity: 'Recent Activity',
      upcomingEvents: 'Upcoming Events',
      schedule: 'Schedule',
      classes: 'Classes',
      students: 'Students',
      attendance: 'Attendance',
      grades: 'Grades',
      homework: 'Homework',
      assignments: 'Assignments',
    },
    gamification: {
      xp: 'XP',
      level: 'Level',
      badges: 'Badges',
      streak: 'Streak',
      leaderboard: 'Leaderboard',
      achievements: 'Achievements',
      points: 'Points',
      rank: 'Rank',
      levelUp: 'Level Up!',
      newBadge: 'New Badge Earned!',
      streakContinued: 'Streak Continued!',
      dailyChallenge: 'Daily Challenge',
      weeklyGoal: 'Weekly Goal',
    },
    parent: {
      activityFeed: 'Activity Feed',
      childSelector: 'Select Child',
      leaveRequest: 'Leave Request',
      feePayment: 'Fee Payment',
      ptmBooking: 'PTM Booking',
      reportCard: 'Report Card',
      moments: 'Moments',
      engagementScore: 'Engagement Score',
      superParent: 'Super Parent',
      milestones: 'Milestones',
      celebrate: 'Celebrate!',
    },
    student: {
      myDashboard: 'My Dashboard',
      avatar: 'Avatar',
      customize: 'Customize',
      studySquads: 'Study Squads',
      focusMode: 'Focus Mode',
      moodCheck: 'How are you feeling?',
      submitHomework: 'Submit Homework',
      pendingTasks: 'Pending Tasks',
      completed: 'Completed',
      dueToday: 'Due Today',
      dueThisWeek: 'Due This Week',
      takePhoto: 'Take Photo',
      uploadFile: 'Upload File',
      recordAudio: 'Record Audio',
      recordVideo: 'Record Video',
    },
    teacher: {
      todaysSchedule: 'Today\'s Schedule',
      markAttendance: 'Mark Attendance',
      enterGrades: 'Enter Grades',
      postMoment: 'Post Moment',
      classOverview: 'Class Overview',
      studentProgress: 'Student Progress',
      bulkActions: 'Bulk Actions',
      sendNotification: 'Send Notification',
      leaveApprovals: 'Leave Approvals',
      currentClass: 'Current Class',
      nextClass: 'Next Class',
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      excused: 'Excused',
    },
    preschool: {
      developmentAreas: 'Development Areas',
      physical: 'Physical',
      cognitive: 'Cognitive',
      social: 'Social',
      emotional: 'Emotional',
      language: 'Language',
      logActivity: 'Log Activity',
      milestoneTracker: 'Milestone Tracker',
      radarChart: 'Development Profile',
      hprc: 'Holistic Progress Report',
      generateReport: 'Generate Report',
      observations: 'Observations',
      evidence: 'Evidence',
      achieved: 'Achieved',
      inProgress: 'In Progress',
      notStarted: 'Not Started',
    },
    time: {
      hoursAgo: 'hours ago',
      minutesAgo: 'minutes ago',
      justNow: 'Just now',
      daysAgo: 'days ago',
      am: 'AM',
      pm: 'PM',
    },
    errors: {
      networkError: 'Network error. Please check your connection.',
      unauthorized: 'Please log in to continue.',
      notFound: 'Page not found.',
      serverError: 'Server error. Please try again later.',
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
      submit: 'पेश गर्नुहोस्',
      confirm: 'पुष्टि गर्नुहोस्',
      back: 'पछाडि',
      next: 'अर्को',
      done: 'सम्पन्न',
      close: 'बन्द गर्नुहोस्',
      yes: 'हो',
      no: 'होइन',
      welcome: 'स्वागत छ',
      logout: 'लग आउट',
      settings: 'सेटिङहरू',
      help: 'मद्दत',
      notifications: 'सूचनाहरू',
      profile: 'प्रोफाइल',
    },
    auth: {
      selectRole: 'आफ्नो भूमिका छान्नुहोस्',
      welcome: 'EduNexus मा स्वागत छ',
      tagline: 'शिक्षा, नयाँ तरिकाले',
      exploreDemo: 'डेमो अन्वेषण गर्नुहोस्',
      switchRole: 'भूमिका बदल्नुहोस्',
      logout: 'लग आउट',
      demoMode: 'डेमो मोड - सबै डाटा सिमुलेटेड हो',
    },
    roles: {
      parent: 'अभिभावक',
      student: 'विद्यार्थी',
      teacher: 'शिक्षक',
      preschool: 'पूर्व-विद्यालय',
      parentDesc: 'आफ्नो बच्चाको शिक्षासँग जोडिएको रहनुहोस्',
      studentDesc: 'सिक्नुहोस्, XP कमाउनुहोस्, लेभल अप गर्नुहोस्',
      teacherDesc: 'कक्षाहरू कुशलतापूर्वक व्यवस्थापन गर्नुहोस्',
      preschoolDesc: 'विकास माइलस्टोनहरू ट्र्याक गर्नुहोस्',
    },
    dashboard: {
      overview: 'सिंहावलोकन',
      quickActions: 'द्रुत कार्यहरू',
      recentActivity: 'हालैको गतिविधि',
      upcomingEvents: 'आगामी कार्यक्रमहरू',
      schedule: 'तालिका',
      classes: 'कक्षाहरू',
      students: 'विद्यार्थीहरू',
      attendance: 'उपस्थिति',
      grades: 'ग्रेडहरू',
      homework: 'गृहकार्य',
      assignments: 'असाइनमेन्टहरू',
    },
    gamification: {
      xp: 'XP',
      level: 'स्तर',
      badges: 'ब्याजहरू',
      streak: 'स्ट्रिक',
      leaderboard: 'लीडरबोर्ड',
      achievements: 'उपलब्धिहरू',
      points: 'अंकहरू',
      rank: 'रैंक',
      levelUp: 'लेभल अप!',
      newBadge: 'नयाँ ब्याज प्राप्त!',
      streakContinued: 'स्ट्रिक जारी!',
      dailyChallenge: 'दैनिक चुनौती',
      weeklyGoal: 'साप्ताहिक लक्ष्य',
    },
    parent: {
      activityFeed: 'गतिविधि फिड',
      childSelector: 'बच्चा छान्नुहोस्',
      leaveRequest: 'बिदा अनुरोध',
      feePayment: 'शुल्क भुक्तानी',
      ptmBooking: 'PTM बुकिङ',
      reportCard: 'रिपोर्ट कार्ड',
      moments: 'पलहरू',
      engagementScore: 'संलग्नता स्कोर',
      superParent: 'सुपर अभिभावक',
      milestones: 'माइलस्टोनहरू',
      celebrate: 'उत्सव मनाउनुहोस्!',
    },
    student: {
      myDashboard: 'मेरो ड्यासबोर्ड',
      avatar: 'अवतार',
      customize: 'अनुकूलन',
      studySquads: 'अध्ययन टोलीहरू',
      focusMode: 'फोकस मोड',
      moodCheck: 'तपाईं कस्तो महसुस गर्दै हुनुहुन्छ?',
      submitHomework: 'गृहकार्य पेश गर्नुहोस्',
      pendingTasks: 'बाँकी कार्यहरू',
      completed: 'पूरा भयो',
      dueToday: 'आज सम्म',
      dueThisWeek: 'यो हप्ता सम्म',
      takePhoto: 'फोटो लिनुहोस्',
      uploadFile: 'फाइल अपलोड गर्नुहोस्',
      recordAudio: 'अडियो रेकर्ड गर्नुहोस्',
      recordVideo: 'भिडियो रेकर्ड गर्नुहोस्',
    },
    teacher: {
      todaysSchedule: 'आजको तालिका',
      markAttendance: 'उपस्थिति चिन्ह लगाउनुहोस्',
      enterGrades: 'ग्रेडहरू प्रविष्ट गर्नुहोस्',
      postMoment: 'पल पोस्ट गर्नुहोस्',
      classOverview: 'कक्षा सिंहावलोकन',
      studentProgress: 'विद्यार्थी प्रगति',
      bulkActions: 'बल्क कार्यहरू',
      sendNotification: 'सूचना पठाउनुहोस्',
      leaveApprovals: 'बिदा स्वीकृतिहरू',
      currentClass: 'हालको कक्षा',
      nextClass: 'अर्को कक्षा',
      present: 'उपस्थित',
      absent: 'अनुपस्थित',
      late: 'ढिलो',
      excused: 'माफी',
    },
    preschool: {
      developmentAreas: 'विकास क्षेत्रहरू',
      physical: 'शारीरिक',
      cognitive: 'संज्ञानात्मक',
      social: 'सामाजिक',
      emotional: 'भावनात्मक',
      language: 'भाषा',
      logActivity: 'गतिविधि लग गर्नुहोस्',
      milestoneTracker: 'माइलस्टोन ट्र्याकर',
      radarChart: 'विकास प्रोफाइल',
      hprc: 'समग्र प्रगति रिपोर्ट',
      generateReport: 'रिपोर्ट उत्पन्न गर्नुहोस्',
      observations: 'अवलोकनहरू',
      evidence: 'प्रमाण',
      achieved: 'प्राप्त',
      inProgress: 'प्रगतिमा',
      notStarted: 'सुरु भएको छैन',
    },
    time: {
      hoursAgo: 'घण्टा अगाडि',
      minutesAgo: 'मिनेट अगाडि',
      justNow: 'भर्खरै',
      daysAgo: 'दिन अगाडि',
      am: 'बिहान',
      pm: 'बेलुका',
    },
    errors: {
      networkError: 'नेटवर्क त्रुटि। कृपया आफ्नो जडान जाँच गर्नुहोस्।',
      unauthorized: 'कृपया जारी राख्न लग इन गर्नुहोस्।',
      notFound: 'पृष्ठ फेला परेन।',
      serverError: 'सर्भर त्रुटि। कृपया पछि फेरि प्रयास गर्नुहोस्।',
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

// Nepali month names (Bikram Sambat)
export const NEPALI_MONTHS = [
  { en: 'Baishakh', ne: 'बैशाख' },
  { en: 'Jestha', ne: 'जेठ' },
  { en: 'Ashadh', ne: 'असार' },
  { en: 'Shrawan', ne: 'साउन' },
  { en: 'Bhadra', ne: 'भदौ' },
  { en: 'Ashwin', ne: 'असोज' },
  { en: 'Kartik', ne: 'कात्तिक' },
  { en: 'Mangsir', ne: 'मंसिर' },
  { en: 'Poush', ne: 'पुष' },
  { en: 'Magh', ne: 'माघ' },
  { en: 'Falgun', ne: 'फागुन' },
  { en: 'Chaitra', ne: 'चैत्र' },
];

// Nepali weekday names
export const NEPALI_WEEKDAYS = [
  { en: 'Sunday', ne: 'आइतबार', short: 'आइत' },
  { en: 'Monday', ne: 'सोमबार', short: 'सोम' },
  { en: 'Tuesday', ne: 'मंगलबार', short: 'मंगल' },
  { en: 'Wednesday', ne: 'बुधबार', short: 'बुध' },
  { en: 'Thursday', ne: 'बिहीबार', short: 'बिही' },
  { en: 'Friday', ne: 'शुक्रबार', short: 'शुक्र' },
  { en: 'Saturday', ne: 'शनिबार', short: 'शनि' },
];

// Major Nepali festivals for school calendar
export const NEPALI_FESTIVALS = [
  { en: 'Dashain', ne: 'दशैं', month: 'Ashwin', duration: 15 },
  { en: 'Tihar', ne: 'तिहार', month: 'Kartik', duration: 5 },
  { en: 'Holi', ne: 'होली', month: 'Falgun', duration: 2 },
  { en: 'Teej', ne: 'तीज', month: 'Bhadra', duration: 1 },
  { en: 'Chhath', ne: 'छठ', month: 'Kartik', duration: 4 },
  { en: 'Shivaratri', ne: 'शिवरात्रि', month: 'Falgun', duration: 1 },
  { en: 'Buddha Jayanti', ne: 'बुद्ध जयन्ती', month: 'Baishakh', duration: 1 },
  { en: 'Nepali New Year', ne: 'नयाँ वर्ष', month: 'Baishakh', duration: 1 },
  { en: 'Constitution Day', ne: 'संविधान दिवस', month: 'Ashwin', duration: 1 },
  { en: 'Republic Day', ne: 'गणतन्त्र दिवस', month: 'Jestha', duration: 1 },
];

// Format relative time in selected locale
export function formatRelativeTime(date: Date, locale: 'en' | 'ne'): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return translations[locale].time.justNow;
  } else if (minutes < 60) {
    return locale === 'en'
      ? `${minutes} ${translations[locale].time.minutesAgo}`
      : `${minutes} ${translations[locale].time.minutesAgo}`;
  } else if (hours < 24) {
    return locale === 'en'
      ? `${hours} ${translations[locale].time.hoursAgo}`
      : `${hours} ${translations[locale].time.hoursAgo}`;
  } else {
    return locale === 'en'
      ? `${days} ${translations[locale].time.daysAgo}`
      : `${days} ${translations[locale].time.daysAgo}`;
  }
}

// Format date in Nepali/English based on locale
export function formatDate(date: Date, locale: 'en' | 'ne', format: 'short' | 'long' = 'short'): string {
  const options: Intl.DateTimeFormatOptions = format === 'long'
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    : { month: 'short', day: 'numeric' };

  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'ne-NP', options);
}

export { translations };
