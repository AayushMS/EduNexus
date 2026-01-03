'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  Clock,
  Users,
  Grid3X3,
  List,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  nameNe: string;
  rollNumber: number;
  avatarUrl?: string;
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'unmarked';

interface AttendanceMarkerProps {
  className: string;
  classNameNe: string;
  students: Student[];
  date?: Date;
  onSubmit?: (attendance: Record<string, AttendanceStatus>) => void;
}

export function AttendanceMarker({
  className,
  classNameNe,
  students,
  date = new Date(),
  onSubmit,
}: AttendanceMarkerProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    () => Object.fromEntries(students.map((s) => [s.id, 'unmarked']))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  const statusConfig = {
    present: { icon: Check, color: 'bg-green-500 text-white', label: { en: 'P', ne: 'उ' } },
    absent: { icon: X, color: 'bg-red-500 text-white', label: { en: 'A', ne: 'अ' } },
    late: { icon: Clock, color: 'bg-amber-500 text-white', label: { en: 'L', ne: 'ढि' } },
    unmarked: { icon: null, color: 'bg-secondary text-muted-foreground', label: { en: '-', ne: '-' } },
  };

  const cycleStatus = (studentId: string) => {
    const currentStatus = attendance[studentId];
    const statusOrder: AttendanceStatus[] = ['unmarked', 'present', 'absent', 'late'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    setAttendance((prev) => ({ ...prev, [studentId]: nextStatus }));
  };

  const setAllStatus = (status: AttendanceStatus) => {
    setAttendance(Object.fromEntries(students.map((s) => [s.id, status])));
  };

  const handleSubmit = async () => {
    const unmarkedCount = Object.values(attendance).filter((s) => s === 'unmarked').length;
    if (unmarkedCount > 0) {
      toast.error(
        locale === 'en'
          ? `Please mark attendance for all ${unmarkedCount} remaining students`
          : `कृपया बाँकी ${unmarkedCount} विद्यार्थीहरूको उपस्थिति चिन्ह लगाउनुहोस्`
      );
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSubmit?.(attendance);
    setIsSubmitting(false);
    toast.success(
      locale === 'en' ? 'Attendance submitted successfully!' : 'उपस्थिति सफलतापूर्वक पेश गरियो!'
    );
  };

  const stats = {
    present: Object.values(attendance).filter((s) => s === 'present').length,
    absent: Object.values(attendance).filter((s) => s === 'absent').length,
    late: Object.values(attendance).filter((s) => s === 'late').length,
    unmarked: Object.values(attendance).filter((s) => s === 'unmarked').length,
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              {locale === 'en' ? className : classNameNe}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {date.toLocaleDateString(locale === 'en' ? 'en-US' : 'ne-NP', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setAllStatus('present')}>
            <Check className="h-3 w-3 mr-1" />
            {locale === 'en' ? 'Mark All Present' : 'सबैलाई उपस्थित'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAllStatus('unmarked')}>
            {locale === 'en' ? 'Reset All' : 'सबै रिसेट'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(stats).map(([status, count]) => {
            const config = statusConfig[status as AttendanceStatus];
            return (
              <div
                key={status}
                className="text-center p-2 rounded-lg bg-secondary/50"
              >
                <p className="text-lg font-bold">{formatNumber(count)}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {locale === 'en' ? status : (status === 'present' ? 'उपस्थित' : status === 'absent' ? 'अनुपस्थित' : status === 'late' ? 'ढिलो' : 'बाँकी')}
                </p>
              </div>
            );
          })}
        </div>

        {/* Student List/Grid */}
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2 max-h-[400px] overflow-y-auto"
            >
              {students.map((student, index) => {
                const status = attendance[student.id];
                const config = statusConfig[status];

                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-8">
                        {formatNumber(student.rollNumber)}
                      </span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {locale === 'en' ? student.name : student.nameNe}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {(['present', 'absent', 'late'] as const).map((s) => {
                        const sConfig = statusConfig[s];
                        const Icon = sConfig.icon;
                        return (
                          <Button
                            key={s}
                            variant={status === s ? 'default' : 'outline'}
                            size="icon"
                            className={`h-8 w-8 ${status === s ? sConfig.color : ''}`}
                            onClick={() =>
                              setAttendance((prev) => ({ ...prev, [student.id]: s }))
                            }
                          >
                            {Icon && <Icon className="h-4 w-4" />}
                          </Button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2"
            >
              {students.map((student) => {
                const status = attendance[student.id];
                const config = statusConfig[status];

                return (
                  <motion.button
                    key={student.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => cycleStatus(student.id)}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center gap-1
                      transition-colors border-2
                      ${config.color}
                      ${status === 'unmarked' ? 'border-dashed' : 'border-transparent'}
                    `}
                  >
                    <span className="text-xs font-bold">{formatNumber(student.rollNumber)}</span>
                    <span className="text-[10px]">{config.label[locale]}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting || stats.unmarked > 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {locale === 'en' ? 'Submitting...' : 'पेश गर्दै...'}
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Submit Attendance' : 'उपस्थिति पेश गर्नुहोस्'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
