'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Star,
  Calendar,
  TrendingUp,
  Heart,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MoodOption {
  emoji: string;
  label: string;
  labelNe: string;
  color: string;
  xp: number;
}

interface MoodEntry {
  date: string;
  mood: string;
  note?: string;
}

const moodOptions: MoodOption[] = [
  { emoji: '😊', label: 'Happy', labelNe: 'खुशी', color: 'bg-green-500', xp: 10 },
  { emoji: '😐', label: 'Okay', labelNe: 'ठीक', color: 'bg-yellow-500', xp: 10 },
  { emoji: '😔', label: 'Sad', labelNe: 'उदास', color: 'bg-blue-500', xp: 10 },
  { emoji: '😴', label: 'Tired', labelNe: 'थकित', color: 'bg-purple-500', xp: 10 },
  { emoji: '🤯', label: 'Stressed', labelNe: 'तनावग्रस्त', color: 'bg-red-500', xp: 10 },
];

const reasonOptions = [
  { emoji: '📚', label: 'School', labelNe: 'विद्यालय' },
  { emoji: '👨‍👩‍👧', label: 'Family', labelNe: 'परिवार' },
  { emoji: '👫', label: 'Friends', labelNe: 'साथीहरू' },
  { emoji: '🎮', label: 'Fun', labelNe: 'रमाइलो' },
  { emoji: '💪', label: 'Health', labelNe: 'स्वास्थ्य' },
  { emoji: '🌤️', label: 'Weather', labelNe: 'मौसम' },
];

// Mock mood history (last 7 days)
const mockMoodHistory: MoodEntry[] = [
  { date: '2026-01-02', mood: '😊', note: 'Great day at school!' },
  { date: '2026-01-01', mood: '😐' },
  { date: '2025-12-31', mood: '😊', note: 'New Year celebration!' },
  { date: '2025-12-30', mood: '😴', note: 'Stayed up late' },
  { date: '2025-12-29', mood: '😊' },
  { date: '2025-12-28', mood: '😔', note: 'Missing friends' },
  { date: '2025-12-27', mood: '😊' },
];

export default function MoodPage() {
  const { locale } = useLocaleStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [moodHistory, setMoodHistory] = useState(mockMoodHistory);

  const todayDate = new Date().toISOString().split('T')[0];
  const alreadyCheckedIn = moodHistory.some((m) => m.date === todayDate);

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) {
      toast.error(
        locale === 'en' ? 'Please select a mood' : 'कृपया मूड छान्नुहोस्'
      );
      return;
    }

    const newEntry: MoodEntry = {
      date: todayDate,
      mood: selectedMood,
      note: note || undefined,
    };

    setMoodHistory([newEntry, ...moodHistory]);
    setHasCheckedInToday(true);

    toast.success(
      locale === 'en'
        ? `Mood logged! +10 XP earned!`
        : `मूड लग गरियो! +१० XP कमाइयो!`
    );

    // Reset form
    setSelectedMood(null);
    setSelectedReasons([]);
    setNote('');
  };

  // Calculate mood stats
  const moodCounts = moodHistory.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const happyDays = moodCounts['😊'] || 0;
  const checkInStreak = 7; // Mock streak

  if (hasCheckedInToday || alreadyCheckedIn) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/student">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {locale === 'en' ? 'Mood Check-in' : 'मूड चेक-इन'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {locale === 'en' ? 'Track how you feel' : 'तपाईं कस्तो महसुस गर्नुहुन्छ ट्र्याक गर्नुहोस्'}
            </p>
          </div>
        </div>

        {/* Already Checked In */}
        <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold">
              {locale === 'en' ? "You've checked in today!" : 'आज तपाईंले चेक-इन गर्नुभयो!'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {locale === 'en'
                ? 'Come back tomorrow to log your mood'
                : 'भोलि आफ्नो मूड लग गर्न फर्कनुहोस्'}
            </p>
            <Badge className="mt-4 bg-green-500">+10 XP</Badge>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl mb-1">🔥</div>
              <p className="text-lg font-bold">{checkInStreak}</p>
              <p className="text-xs text-muted-foreground">
                {locale === 'en' ? 'Day Streak' : 'दिन स्ट्रिक'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl mb-1">{mostCommonMood}</div>
              <p className="text-lg font-bold">
                {locale === 'en' ? 'Most Common' : 'सबैभन्दा सामान्य'}
              </p>
              <p className="text-xs text-muted-foreground">
                {locale === 'en' ? 'This Week' : 'यो हप्ता'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl mb-1">😊</div>
              <p className="text-lg font-bold">{happyDays}</p>
              <p className="text-xs text-muted-foreground">
                {locale === 'en' ? 'Happy Days' : 'खुशी दिनहरू'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mood History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {locale === 'en' ? '7-Day History' : '७ दिनको इतिहास'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              {moodHistory.slice(0, 7).reverse().map((entry, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl mb-1">{entry.mood}</div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('en', { weekday: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {locale === 'en' ? 'Insights' : 'अन्तर्दृष्टि'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Heart className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">
                  {locale === 'en' ? 'Great week!' : 'राम्रो हप्ता!'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en'
                    ? `You felt happy on ${happyDays} out of 7 days`
                    : `तपाईं ७ दिनमध्ये ${happyDays} दिन खुशी हुनुभयो`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Sparkles className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">
                  {locale === 'en' ? 'Keep it up!' : 'जारी राख्नुहोस्!'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en'
                    ? `${checkInStreak} day check-in streak!`
                    : `${checkInStreak} दिनको चेक-इन स्ट्रिक!`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/student">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {locale === 'en' ? 'Mood Check-in' : 'मूड चेक-इन'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en' ? 'How are you feeling today?' : 'आज तपाईं कस्तो महसुस गर्दै हुनुहुन्छ?'}
          </p>
        </div>
      </div>

      {/* XP Reward Banner */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {locale === 'en' ? 'Daily Check-in Reward' : 'दैनिक चेक-इन पुरस्कार'}
              </span>
            </div>
            <Badge className="bg-primary">+10 XP</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Mood Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Select your mood' : 'आफ्नो मूड छान्नुहोस्'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {moodOptions.map((mood) => (
              <Button
                key={mood.emoji}
                variant="outline"
                className={cn(
                  'h-20 flex-col gap-1 transition-all',
                  selectedMood === mood.emoji && 'ring-2 ring-primary border-primary scale-105'
                )}
                onClick={() => setSelectedMood(mood.emoji)}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-xs">
                  {locale === 'en' ? mood.label : mood.labelNe}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reason Selection (Optional) */}
      {selectedMood && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {locale === 'en' ? 'What influenced your mood?' : 'तपाईंको मूडमा के प्रभाव पार्यो?'}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({locale === 'en' ? 'Optional' : 'वैकल्पिक'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {reasonOptions.map((reason) => (
                <Button
                  key={reason.label}
                  variant={selectedReasons.includes(reason.label) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleReason(reason.label)}
                >
                  <span className="mr-1">{reason.emoji}</span>
                  {locale === 'en' ? reason.label : reason.labelNe}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Note (Optional) */}
      {selectedMood && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {locale === 'en' ? 'Add a note' : 'नोट थप्नुहोस्'}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({locale === 'en' ? 'Optional' : 'वैकल्पिक'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                locale === 'en'
                  ? "What's on your mind?"
                  : 'तपाईंको मनमा के छ?'
              }
              rows={3}
            />
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        className="w-full h-14 text-lg"
        onClick={handleSubmit}
        disabled={!selectedMood}
      >
        <CheckCircle className="h-5 w-5 mr-2" />
        {locale === 'en' ? 'Check In' : 'चेक इन गर्नुहोस्'}
      </Button>

      {/* Streak Info */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                🔥
              </div>
              <div>
                <p className="font-medium">
                  {locale === 'en' ? 'Check-in Streak' : 'चेक-इन स्ट्रिक'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en' ? `${checkInStreak} days` : `${checkInStreak} दिन`}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-orange-500 border-orange-500">
              {locale === 'en' ? 'Keep going!' : 'जारी राख्नुहोस्!'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
