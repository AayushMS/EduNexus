'use client';

import { motion } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Users, BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface ClassOverviewProps {
  classes: {
    id: string;
    name: string;
    nameNe: string;
    grade: number;
    section: string;
    studentCount: number;
    attendanceRate: number;
    homeworkCompletion: number;
    averageGrade: number;
    recentActivity?: string;
  }[];
  onSelectClass?: (classId: string) => void;
}

export function ClassOverview({ classes, onSelectClass }: ClassOverviewProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  const formatPercent = (num: number) => {
    const rounded = Math.round(num);
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(rounded) + '%';
    }
    return rounded + '%';
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {classes.map((cls, index) => (
        <motion.div
          key={cls.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectClass?.(cls.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {locale === 'en' ? cls.name : cls.nameNe}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {formatNumber(cls.studentCount)}{' '}
                    {locale === 'en' ? 'students' : 'विद्यार्थीहरू'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">
                    {locale === 'en' ? `${cls.grade}${cls.section}` : `${formatNumber(cls.grade)}${cls.section}`}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-4 w-4 mx-auto mb-1 text-green-600" />
                  <p className="text-sm font-semibold text-green-600">
                    {formatPercent(cls.attendanceRate)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {locale === 'en' ? 'Attendance' : 'उपस्थिति'}
                  </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-blue-500/10">
                  <BookOpen className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-600">
                    {formatPercent(cls.homeworkCompletion)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {locale === 'en' ? 'Homework' : 'गृहकार्य'}
                  </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-purple-500/10">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                  <p className="text-sm font-semibold text-purple-600">
                    {formatPercent(cls.averageGrade)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {locale === 'en' ? 'Avg Grade' : 'औसत ग्रेड'}
                  </p>
                </div>
              </div>

              {/* Overall Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Overall Performance' : 'समग्र प्रदर्शन'}
                  </span>
                  <span className="font-medium">
                    {formatPercent((cls.attendanceRate + cls.homeworkCompletion + cls.averageGrade) / 3)}
                  </span>
                </div>
                <Progress
                  value={(cls.attendanceRate + cls.homeworkCompletion + cls.averageGrade) / 3}
                  className="h-2"
                />
              </div>

              {cls.recentActivity && (
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {cls.recentActivity}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
