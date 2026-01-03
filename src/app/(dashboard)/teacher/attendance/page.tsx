'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  RotateCcw,
  CheckCheck,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Student {
  id: string;
  name: string;
  nameNe: string;
  rollNo: number;
  status: 'present' | 'absent' | 'late' | 'unmarked';
  hasLeaveRequest?: boolean;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Aarav Sharma', nameNe: 'आरव शर्मा', rollNo: 1, status: 'unmarked' },
  { id: '2', name: 'Sita Thapa', nameNe: 'सीता थापा', rollNo: 2, status: 'unmarked' },
  { id: '3', name: 'Ram Gurung', nameNe: 'राम गुरुङ', rollNo: 3, status: 'unmarked', hasLeaveRequest: true },
  { id: '4', name: 'Priya Rai', nameNe: 'प्रिया राई', rollNo: 4, status: 'unmarked' },
  { id: '5', name: 'Kiran Tamang', nameNe: 'किरण तामाङ', rollNo: 5, status: 'unmarked' },
  { id: '6', name: 'Maya Shrestha', nameNe: 'माया श्रेष्ठ', rollNo: 6, status: 'unmarked' },
  { id: '7', name: 'Bikash Magar', nameNe: 'बिकास मगर', rollNo: 7, status: 'unmarked' },
  { id: '8', name: 'Anita Limbu', nameNe: 'अनिता लिम्बु', rollNo: 8, status: 'unmarked' },
  { id: '9', name: 'Suresh KC', nameNe: 'सुरेश केसी', rollNo: 9, status: 'unmarked' },
  { id: '10', name: 'Gita Adhikari', nameNe: 'गीता अधिकारी', rollNo: 10, status: 'unmarked' },
];

const classOptions = [
  { value: '7A', label: 'Grade 7A', labelNe: 'कक्षा ७A' },
  { value: '7B', label: 'Grade 7B', labelNe: 'कक्षा ७B' },
  { value: '8A', label: 'Grade 8A', labelNe: 'कक्षा ८A' },
  { value: '8B', label: 'Grade 8B', labelNe: 'कक्षा ८B' },
];

type ViewMode = 'list' | 'grid';

export default function AttendancePage() {
  const { locale } = useLocaleStore();
  const [selectedClass, setSelectedClass] = useState('7A');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [students, setStudents] = useState(mockStudents);
  const [notifyParents, setNotifyParents] = useState(true);

  const today = new Date();
  const presentCount = students.filter((s) => s.status === 'present').length;
  const absentCount = students.filter((s) => s.status === 'absent').length;
  const lateCount = students.filter((s) => s.status === 'late').length;
  const unmarkedCount = students.filter((s) => s.status === 'unmarked').length;

  const cycleStatus = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const statusOrder: Student['status'][] = ['present', 'absent', 'late', 'unmarked'];
        const currentIndex = statusOrder.indexOf(s.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...s, status: statusOrder[nextIndex] };
      })
    );
  };

  const setStatus = (studentId: string, status: Student['status']) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, status: 'present' as const }))
    );
    toast.success(
      locale === 'en'
        ? 'All students marked present'
        : 'सबै विद्यार्थीहरू उपस्थित चिन्ह लगाइयो'
    );
  };

  const resetAll = () => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, status: 'unmarked' as const }))
    );
  };

  const handleSubmit = () => {
    if (unmarkedCount > 0) {
      toast.error(
        locale === 'en'
          ? `${unmarkedCount} students still unmarked`
          : `${unmarkedCount} विद्यार्थीहरू अझै चिन्ह लगाइएको छैन`
      );
      return;
    }

    toast.success(
      locale === 'en'
        ? `Attendance submitted! ${notifyParents ? 'Parents notified.' : ''}`
        : `उपस्थिति जम्मा गरियो! ${notifyParents ? 'अभिभावकहरूलाई सूचित गरियो।' : ''}`
    );
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'late':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teacher">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {locale === 'en' ? 'Attendance' : 'उपस्थिति'}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(today, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Class Selector & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {classOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {locale === 'en' ? opt.label : opt.labelNe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            {locale === 'en' ? 'List' : 'सूची'}
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            {locale === 'en' ? 'Grid' : 'ग्रिड'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-green-600">{presentCount}</p>
            <p className="text-xs text-green-600/70">
              {locale === 'en' ? 'Present' : 'उपस्थित'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-red-600">{absentCount}</p>
            <p className="text-xs text-red-600/70">
              {locale === 'en' ? 'Absent' : 'अनुपस्थित'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-yellow-600">{lateCount}</p>
            <p className="text-xs text-yellow-600/70">
              {locale === 'en' ? 'Late' : 'ढिलो'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-gray-600">{unmarkedCount}</p>
            <p className="text-xs text-gray-600/70">
              {locale === 'en' ? 'Unmarked' : 'चिन्ह नलाग्ने'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={markAllPresent}>
          <CheckCheck className="h-4 w-4 mr-2" />
          {locale === 'en' ? 'Mark All Present' : 'सबै उपस्थित'}
        </Button>
        <Button variant="outline" size="sm" onClick={resetAll}>
          <RotateCcw className="h-4 w-4 mr-2" />
          {locale === 'en' ? 'Reset' : 'रिसेट'}
        </Button>
      </div>

      {/* Student List/Grid */}
      {viewMode === 'list' ? (
        <div className="space-y-2">
          {students.map((student) => (
            <Card
              key={student.id}
              className={cn(
                'transition-colors',
                student.hasLeaveRequest && 'border-orange-300 bg-orange-50 dark:bg-orange-900/10'
              )}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-sm bg-primary/10 text-primary">
                        {student.rollNo}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {locale === 'en' ? student.name : student.nameNe}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          #{student.rollNo}
                        </span>
                        {student.hasLeaveRequest && (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-400">
                            {locale === 'en' ? 'Leave Request' : 'बिदा अनुरोध'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={student.status === 'present' ? 'default' : 'outline'}
                      className={cn(
                        'h-9 w-9 p-0',
                        student.status === 'present' && 'bg-green-500 hover:bg-green-600'
                      )}
                      onClick={() => setStatus(student.id, 'present')}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'absent' ? 'default' : 'outline'}
                      className={cn(
                        'h-9 w-9 p-0',
                        student.status === 'absent' && 'bg-red-500 hover:bg-red-600'
                      )}
                      onClick={() => setStatus(student.id, 'absent')}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'late' ? 'default' : 'outline'}
                      className={cn(
                        'h-9 w-9 p-0',
                        student.status === 'late' && 'bg-yellow-500 hover:bg-yellow-600'
                      )}
                      onClick={() => setStatus(student.id, 'late')}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-3">
          {students.map((student) => (
            <Card
              key={student.id}
              className={cn(
                'cursor-pointer transition-all hover:scale-105',
                student.status === 'present' && 'bg-green-100 border-green-400 dark:bg-green-900/30',
                student.status === 'absent' && 'bg-red-100 border-red-400 dark:bg-red-900/30',
                student.status === 'late' && 'bg-yellow-100 border-yellow-400 dark:bg-yellow-900/30'
              )}
              onClick={() => cycleStatus(student.id)}
            >
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold">{student.rollNo}</p>
                {getStatusIcon(student.status)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Notify Parents Toggle */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notify" className="text-sm">
              {locale === 'en'
                ? 'Notify parents of absent students'
                : 'अनुपस्थित विद्यार्थीहरूको अभिभावकलाई सूचित गर्नुहोस्'}
            </Label>
            <Switch
              id="notify"
              checked={notifyParents}
              onCheckedChange={setNotifyParents}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button className="w-full h-12" onClick={handleSubmit}>
        <Save className="h-5 w-5 mr-2" />
        {locale === 'en' ? 'Submit Attendance' : 'उपस्थिति जम्मा गर्नुहोस्'}
      </Button>
    </div>
  );
}
