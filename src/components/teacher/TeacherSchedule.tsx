'use client';

import { motion } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, BookOpen } from 'lucide-react';

interface ScheduleItem {
  id: string;
  subject: string;
  subjectNe: string;
  className: string;
  classNameNe: string;
  startTime: string;
  endTime: string;
  room?: string;
  isCurrent?: boolean;
  isNext?: boolean;
}

interface TeacherScheduleProps {
  schedule: ScheduleItem[];
  date?: Date;
}

export function TeacherSchedule({ schedule, date = new Date() }: TeacherScheduleProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedHour = useDevanagariNumerals && locale === 'ne'
      ? toDevanagariNumerals(hour12)
      : hour12;
    const formattedMinutes = useDevanagariNumerals && locale === 'ne'
      ? toDevanagariNumerals(minutes)
      : minutes;
    return `${formattedHour}:${formattedMinutes} ${ampm}`;
  };

  const subjectColors: Record<string, string> = {
    nepali: 'bg-red-500',
    english: 'bg-blue-500',
    math: 'bg-purple-500',
    mathematics: 'bg-purple-500',
    science: 'bg-green-500',
    social: 'bg-amber-500',
    'social studies': 'bg-amber-500',
    computer: 'bg-cyan-500',
    default: 'bg-gray-500',
  };

  const getSubjectColor = (subject: string) => {
    const key = subject.toLowerCase();
    return subjectColors[key] || subjectColors.default;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {locale === 'en' ? "Today's Schedule" : 'आजको तालिका'}
          </CardTitle>
          <Badge variant="outline">
            {date.toLocaleDateString(locale === 'en' ? 'en-US' : 'ne-NP', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedule.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>
              {locale === 'en'
                ? 'No classes scheduled for today'
                : 'आजको लागि कुनै कक्षा तालिकाबद्ध छैन'}
            </p>
          </div>
        ) : (
          schedule.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                relative flex items-center gap-3 p-3 rounded-lg border transition-all
                ${item.isCurrent
                  ? 'bg-primary/10 border-primary shadow-md'
                  : item.isNext
                  ? 'bg-secondary/80 border-secondary'
                  : 'bg-card border-border hover:bg-secondary/50'
                }
              `}
            >
              {/* Current indicator */}
              {item.isCurrent && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"
                  layoutId="currentClass"
                />
              )}

              {/* Time */}
              <div className="text-center min-w-[70px]">
                <p className="text-sm font-semibold">{formatTime(item.startTime)}</p>
                <p className="text-xs text-muted-foreground">{formatTime(item.endTime)}</p>
              </div>

              {/* Subject indicator */}
              <div className={`${getSubjectColor(item.subject)} rounded-lg p-2 text-white shrink-0`}>
                <BookOpen className="h-5 w-5" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">
                    {locale === 'en' ? item.subject : item.subjectNe}
                  </h4>
                  {item.isCurrent && (
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                      {locale === 'en' ? 'Now' : 'अहिले'}
                    </Badge>
                  )}
                  {item.isNext && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {locale === 'en' ? 'Next' : 'अर्को'}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {locale === 'en' ? item.className : item.classNameNe}
                  </span>
                  {item.room && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.room}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
