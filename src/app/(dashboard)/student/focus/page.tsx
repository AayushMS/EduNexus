'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw, Flame, Clock, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type SessionState = 'idle' | 'active' | 'paused' | 'completed';

interface FocusStats {
  sessionsToday: number;
  totalMinutesToday: number;
  streak: number;
}

const DURATION_OPTIONS = [
  { value: 25, label: '25 min', xp: 50 },
  { value: 45, label: '45 min', xp: 100 },
  { value: 60, label: '60 min', xp: 150 },
];

const ACTIVITY_OPTIONS = [
  { value: 'math', label: 'Mathematics', labelNe: 'गणित', icon: '🧮' },
  { value: 'science', label: 'Science', labelNe: 'विज्ञान', icon: '🔬' },
  { value: 'english', label: 'English', labelNe: 'अंग्रेजी', icon: '📝' },
  { value: 'nepali', label: 'Nepali', labelNe: 'नेपाली', icon: '📚' },
  { value: 'reading', label: 'Reading', labelNe: 'पढाइ', icon: '📖' },
  { value: 'homework', label: 'Homework', labelNe: 'गृहकार्य', icon: '✏️' },
  { value: 'revision', label: 'Revision', labelNe: 'पुनरावलोकन', icon: '🔄' },
];

export default function FocusPage() {
  const { locale } = useLocaleStore();
  const [state, setState] = useState<SessionState>('idle');
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [stats, setStats] = useState<FocusStats>({
    sessionsToday: 2,
    totalMinutesToday: 50,
    streak: 5,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedDuration = DURATION_OPTIONS.find((d) => d.value === duration);
  const selectedActivity = ACTIVITY_OPTIONS.find((a) => a.value === activity);
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  useEffect(() => {
    if (state === 'active' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && state === 'active') {
      setState('completed');
      toast.success(
        locale === 'en'
          ? `Session complete! +${selectedDuration?.xp} XP earned!`
          : `सत्र पूरा भयो! +${selectedDuration?.xp} XP कमाइयो!`
      );
      setStats((prev) => ({
        sessionsToday: prev.sessionsToday + 1,
        totalMinutesToday: prev.totalMinutesToday + duration,
        streak: prev.streak,
      }));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, timeLeft, duration, selectedDuration?.xp, locale]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!activity) {
      toast.error(
        locale === 'en' ? 'Please select an activity' : 'कृपया गतिविधि छान्नुहोस्'
      );
      return;
    }
    setTimeLeft(duration * 60);
    setState('active');
  };

  const handlePause = () => {
    setState('paused');
  };

  const handleResume = () => {
    setState('active');
  };

  const handleReset = () => {
    setState('idle');
    setTimeLeft(duration * 60);
  };

  const handleStartAnother = () => {
    setState('idle');
    setTimeLeft(duration * 60);
  };

  // Render different states
  if (state === 'completed') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-6 p-4">
        <div className="relative">
          <div className="text-8xl animate-bounce">🎉</div>
          <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-yellow-500 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold">
          {locale === 'en' ? 'Great Job!' : 'शाबाश!'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'en'
            ? `You completed a ${duration} minute focus session`
            : `तपाईंले ${duration} मिनेटको फोकस सत्र पूरा गर्नुभयो`}
        </p>
        <Badge className="text-lg px-4 py-2 bg-primary">
          +{selectedDuration?.xp} XP
        </Badge>
        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={handleStartAnother}>
            {locale === 'en' ? 'Take a Break' : 'आराम गर्नुहोस्'}
          </Button>
          <Button onClick={handleStartAnother}>
            <Play className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Start Another' : 'अर्को सुरु गर्नुहोस्'}
          </Button>
        </div>
      </div>
    );
  }

  if (state === 'active' || state === 'paused') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        {/* Activity Label */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-3xl">{selectedActivity?.icon}</span>
          <span className="text-lg font-medium">
            {locale === 'en' ? selectedActivity?.label : selectedActivity?.labelNe}
          </span>
        </div>

        {/* Timer Circle */}
        <div className="relative w-64 h-64 mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              className="stroke-muted fill-none"
              strokeWidth="8"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              className="stroke-primary fill-none transition-all duration-1000"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-bold">{formatTime(timeLeft)}</span>
            <span className="text-sm text-muted-foreground mt-2">
              {state === 'paused'
                ? locale === 'en'
                  ? 'Paused'
                  : 'रोकिएको'
                : locale === 'en'
                ? 'Focus Time'
                : 'फोकस समय'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="h-5 w-5" />
          </Button>
          {state === 'active' ? (
            <Button size="lg" className="px-8" onClick={handlePause}>
              <Pause className="h-5 w-5 mr-2" />
              {locale === 'en' ? 'Pause' : 'रोक्नुहोस्'}
            </Button>
          ) : (
            <Button size="lg" className="px-8" onClick={handleResume}>
              <Play className="h-5 w-5 mr-2" />
              {locale === 'en' ? 'Resume' : 'जारी राख्नुहोस्'}
            </Button>
          )}
        </div>

        {/* XP Reward */}
        <Badge variant="outline" className="mt-8">
          <Target className="h-4 w-4 mr-2" />
          +{selectedDuration?.xp} XP {locale === 'en' ? 'on completion' : 'पूरा गर्दा'}
        </Badge>
      </div>
    );
  }

  // Idle State
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
            {locale === 'en' ? 'Focus Mode' : 'फोकस मोड'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Distraction-free study sessions'
              : 'ध्यान केन्द्रित अध्ययन सत्र'}
          </p>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <Target className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{stats.sessionsToday}</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Sessions Today' : 'आजको सत्र'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{stats.totalMinutesToday}</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Minutes Today' : 'आजको मिनेट'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Flame className="h-6 w-6 mx-auto text-orange-500 mb-2" />
            <p className="text-2xl font-bold">{stats.streak}</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Day Streak' : 'दिन स्ट्रिक'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Start Session Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="h-5 w-5" />
            {locale === 'en' ? 'Start Focus Session' : 'फोकस सत्र सुरु गर्नुहोस्'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Activity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {locale === 'en' ? 'What are you studying?' : 'तपाईं के पढ्दै हुनुहुन्छ?'}
            </label>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger>
                <SelectValue
                  placeholder={locale === 'en' ? 'Select activity' : 'गतिविधि छान्नुहोस्'}
                />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="flex items-center gap-2">
                      <span>{opt.icon}</span>
                      <span>{locale === 'en' ? opt.label : opt.labelNe}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {locale === 'en' ? 'Session Duration' : 'सत्र अवधि'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DURATION_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={duration === opt.value ? 'default' : 'outline'}
                  className="flex-col h-auto py-4"
                  onClick={() => {
                    setDuration(opt.value);
                    setTimeLeft(opt.value * 60);
                  }}
                >
                  <span className="text-lg font-bold">{opt.label}</span>
                  <span className="text-xs opacity-70">+{opt.xp} XP</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button className="w-full h-14 text-lg" onClick={handleStart}>
            <Play className="h-6 w-6 mr-2" />
            {locale === 'en' ? 'Start Focus Session' : 'फोकस सत्र सुरु गर्नुहोस्'}
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Focus Tips' : 'फोकस सुझावहरू'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span>💡</span>
              <span>
                {locale === 'en'
                  ? 'Find a quiet place without distractions'
                  : 'ध्यान भंग नहुने शान्त ठाउँ खोज्नुहोस्'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>📱</span>
              <span>
                {locale === 'en'
                  ? 'Put your phone on silent or in another room'
                  : 'आफ्नो फोन साइलेन्टमा राख्नुहोस् वा अर्को कोठामा राख्नुहोस्'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>💧</span>
              <span>
                {locale === 'en'
                  ? 'Keep water nearby to stay hydrated'
                  : 'हाइड्रेटेड रहन नजिकै पानी राख्नुहोस्'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>🎯</span>
              <span>
                {locale === 'en'
                  ? 'Take short breaks between sessions'
                  : 'सत्रहरू बीचमा छोटो आराम लिनुहोस्'}
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
