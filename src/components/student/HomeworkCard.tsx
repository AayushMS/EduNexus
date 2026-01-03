'use client';

import { motion } from 'framer-motion';
import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  FileText,
  Camera,
  Upload,
  Star,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
// Generic assignment interface for flexible usage
interface AssignmentLike {
  id: string;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  subjectId: string;
  dueDate: string | Date;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  xpReward: number;
  grade?: {
    letterGrade: string;
    percentage: number;
  };
}

interface HomeworkCardProps {
  assignment: AssignmentLike;
  onSubmit?: (assignmentId: string) => void;
}

const subjectColors: Record<string, string> = {
  nepali: 'bg-red-500',
  english: 'bg-blue-500',
  math: 'bg-purple-500',
  science: 'bg-green-500',
  social: 'bg-amber-500',
  computer: 'bg-cyan-500',
  default: 'bg-gray-500',
};

export function HomeworkCard({ assignment, onSubmit }: HomeworkCardProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  const dueDate = new Date(assignment.dueDate);
  const isOverdue = isPast(dueDate) && assignment.status !== 'submitted' && assignment.status !== 'graded';
  const isDueToday = isToday(dueDate);

  const getStatusColor = () => {
    switch (assignment.status) {
      case 'submitted':
      case 'graded':
        return 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400';
      case 'late':
        return 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400';
      default:
        if (isOverdue) return 'bg-red-500/10 border-red-500/30';
        if (isDueToday) return 'bg-amber-500/10 border-amber-500/30';
        return 'bg-card border-border';
    }
  };

  const getUrgencyBadge = () => {
    if (assignment.status === 'submitted' || assignment.status === 'graded') {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {locale === 'en' ? 'Submitted' : 'पेश गरिएको'}
        </Badge>
      );
    }
    if (isOverdue) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          {locale === 'en' ? 'Overdue' : 'म्याद सकियो'}
        </Badge>
      );
    }
    if (isDueToday) {
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600">
          <Clock className="h-3 w-3 mr-1" />
          {locale === 'en' ? 'Due Today' : 'आज म्याद'}
        </Badge>
      );
    }
    return null;
  };

  const subjectColor = subjectColors[assignment.subjectId.toLowerCase()] || subjectColors.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card className={`transition-all ${getStatusColor()}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Subject indicator */}
            <div className={`${subjectColor} rounded-lg p-2 text-white shrink-0`}>
              <FileText className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm line-clamp-1">
                  {locale === 'en' ? assignment.title : assignment.titleNe}
                </h3>
                {getUrgencyBadge()}
              </div>

              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {locale === 'en' ? assignment.description : assignment.descriptionNe}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(dueDate, 'MMM d, h:mm a')}
                  </span>
                  <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                    <Star className="h-3 w-3" />
                    +{formatNumber(assignment.xpReward)} XP
                  </span>
                </div>

                {assignment.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => onSubmit?.(assignment.id)}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    {locale === 'en' ? 'Submit' : 'पेश गर्नुहोस्'}
                  </Button>
                )}

                {assignment.status === 'graded' && assignment.grade && (
                  <Badge variant="outline" className="bg-primary/10">
                    {assignment.grade.letterGrade} ({formatNumber(assignment.grade.percentage)}%)
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
