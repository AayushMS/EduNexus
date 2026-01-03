'use client';

import { useState, useMemo } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { useMockData } from '@/hooks/useMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend } from 'date-fns';

// Mock attendance data
const mockAttendance = {
  stats: {
    present: 85,
    absent: 5,
    late: 3,
    total: 93,
  },
  records: [
    { date: '2026-01-02', status: 'present', mood: '😊' },
    { date: '2026-01-01', status: 'holiday', note: 'New Year' },
    { date: '2025-12-31', status: 'present', mood: '😊' },
    { date: '2025-12-30', status: 'present', mood: '😐' },
    { date: '2025-12-29', status: 'absent', reason: 'Sick' },
    { date: '2025-12-28', status: 'holiday', note: 'Saturday' },
    { date: '2025-12-27', status: 'late', mood: '😴', note: 'Arrived 10 min late' },
    { date: '2025-12-26', status: 'present', mood: '😊' },
    { date: '2025-12-25', status: 'present', mood: '😊' },
  ],
  leaveHistory: [
    { id: 1, startDate: '2025-12-29', endDate: '2025-12-29', reason: 'Sick', status: 'approved' },
    { id: 2, startDate: '2025-11-15', endDate: '2025-11-16', reason: 'Family Event', status: 'approved' },
    { id: 3, startDate: '2025-10-20', endDate: '2025-10-22', reason: 'Dashain', status: 'approved' },
  ],
};

type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday';

function getStatusIcon(status: AttendanceStatus) {
  switch (status) {
    case 'present':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'absent':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'late':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return null;
  }
}

function getStatusColor(status: AttendanceStatus): string {
  switch (status) {
    case 'present':
      return 'bg-green-500';
    case 'absent':
      return 'bg-red-500';
    case 'late':
      return 'bg-yellow-500';
    case 'holiday':
      return 'bg-gray-300';
    default:
      return 'bg-gray-200';
  }
}

export default function AttendancePage() {
  const { locale } = useLocaleStore();
  const { students, parents } = useMockData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Get children for selector
  const children = useMemo(() => {
    const parent = parents[0];
    if (!parent) return [];
    return parent.childrenIds
      .map((id) => students.find((s) => s.id === id))
      .filter(Boolean);
  }, [parents, students]);

  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || '');

  // Get attendance record for selected date
  const selectedRecord = selectedDate
    ? mockAttendance.records.find((r) => isSameDay(new Date(r.date), selectedDate))
    : null;

  const presentPercentage = Math.round(
    (mockAttendance.stats.present / mockAttendance.stats.total) * 100
  );

  // Custom day renderer for calendar
  const modifiers = {
    present: mockAttendance.records
      .filter((r) => r.status === 'present')
      .map((r) => new Date(r.date)),
    absent: mockAttendance.records
      .filter((r) => r.status === 'absent')
      .map((r) => new Date(r.date)),
    late: mockAttendance.records
      .filter((r) => r.status === 'late')
      .map((r) => new Date(r.date)),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/parent">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {locale === 'en' ? 'Attendance Records' : 'उपस्थिति रेकर्डहरू'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? 'View attendance history and statistics'
                : 'उपस्थिति इतिहास र तथ्याङ्क हेर्नुहोस्'}
            </p>
          </div>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child?.id} value={child?.id || ''}>
                  {locale === 'en' ? child?.name : child?.nameNe}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {mockAttendance.stats.present}
            </p>
            <p className="text-xs text-green-600 dark:text-green-500">
              {locale === 'en' ? 'Present' : 'उपस्थित'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-4 text-center">
            <XCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">
              {mockAttendance.stats.absent}
            </p>
            <p className="text-xs text-red-600 dark:text-red-500">
              {locale === 'en' ? 'Absent' : 'अनुपस्थित'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-4 text-center">
            <Clock className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
              {mockAttendance.stats.late}
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-500">
              {locale === 'en' ? 'Late' : 'ढिलो'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-4 text-center">
            <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">%</span>
            </div>
            <p className="text-2xl font-bold">{presentPercentage}%</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Attendance Rate' : 'उपस्थिति दर'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar and Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {locale === 'en' ? 'Calendar View' : 'क्यालेन्डर दृश्य'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={modifiers}
              modifiersStyles={{
                present: { backgroundColor: 'rgb(34 197 94 / 0.2)' },
                absent: { backgroundColor: 'rgb(239 68 68 / 0.2)' },
                late: { backgroundColor: 'rgb(234 179 8 / 0.2)' },
              }}
              className="rounded-md border"
            />
            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500/30" />
                <span>{locale === 'en' ? 'Present' : 'उपस्थित'}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500/30" />
                <span>{locale === 'en' ? 'Absent' : 'अनुपस्थित'}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <span>{locale === 'en' ? 'Late' : 'ढिलो'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate
                ? format(selectedDate, 'MMMM d, yyyy')
                : locale === 'en'
                ? 'Select a date'
                : 'मिति छान्नुहोस्'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRecord ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedRecord.status as AttendanceStatus)}
                  <span className="capitalize font-medium">{selectedRecord.status}</span>
                </div>
                {selectedRecord.mood && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'en' ? 'Mood:' : 'मूड:'}
                    </span>
                    <span className="text-2xl">{selectedRecord.mood}</span>
                  </div>
                )}
                {selectedRecord.note && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {locale === 'en' ? 'Note:' : 'नोट:'}
                    </span>
                    <p className="text-sm mt-1">{selectedRecord.note}</p>
                  </div>
                )}
                {selectedRecord.reason && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {locale === 'en' ? 'Reason:' : 'कारण:'}
                    </span>
                    <p className="text-sm mt-1">{selectedRecord.reason}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {locale === 'en'
                  ? 'Click on a date to view details'
                  : 'विवरण हेर्न मितिमा क्लिक गर्नुहोस्'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leave History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Leave History' : 'बिदा इतिहास'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAttendance.leaveHistory.map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{leave.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {leave.startDate === leave.endDate
                      ? leave.startDate
                      : `${leave.startDate} - ${leave.endDate}`}
                  </p>
                </div>
                <Badge
                  variant={leave.status === 'approved' ? 'default' : 'secondary'}
                  className={
                    leave.status === 'approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : ''
                  }
                >
                  {leave.status === 'approved'
                    ? locale === 'en'
                      ? 'Approved'
                      : 'स्वीकृत'
                    : locale === 'en'
                    ? 'Pending'
                    : 'पेन्डिङ'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
