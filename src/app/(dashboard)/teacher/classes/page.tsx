'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Users,
  Search,
  BookOpen,
  Clock,
  GraduationCap,
  ChevronRight,
  Mail,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ClassInfo {
  id: string;
  grade: string;
  section: string;
  subject: string;
  subjectNe: string;
  studentCount: number;
  schedule: string;
  scheduleNe: string;
}

interface Student {
  id: string;
  name: string;
  nameNe: string;
  rollNo: number;
  attendance: number;
  avgGrade: string;
  status: 'present' | 'absent' | 'late';
}

const mockClasses: ClassInfo[] = [
  { id: '1', grade: '7', section: 'A', subject: 'Mathematics', subjectNe: 'गणित', studentCount: 32, schedule: 'Mon, Wed, Fri - 9:00 AM', scheduleNe: 'सोम, बुध, शुक्र - ९:०० बिहान' },
  { id: '2', grade: '7', section: 'B', subject: 'Mathematics', subjectNe: 'गणित', studentCount: 30, schedule: 'Mon, Wed, Fri - 10:00 AM', scheduleNe: 'सोम, बुध, शुक्र - १०:०० बिहान' },
  { id: '3', grade: '8', section: 'A', subject: 'Mathematics', subjectNe: 'गणित', studentCount: 28, schedule: 'Tue, Thu - 9:00 AM', scheduleNe: 'मंगल, बिहि - ९:०० बिहान' },
  { id: '4', grade: '8', section: 'B', subject: 'Mathematics', subjectNe: 'गणित', studentCount: 31, schedule: 'Tue, Thu - 11:00 AM', scheduleNe: 'मंगल, बिहि - ११:०० बिहान' },
];

const mockStudents: Student[] = [
  { id: '1', name: 'Aarav Sharma', nameNe: 'आरव शर्मा', rollNo: 1, attendance: 95, avgGrade: 'A', status: 'present' },
  { id: '2', name: 'Sita Thapa', nameNe: 'सीता थापा', rollNo: 2, attendance: 92, avgGrade: 'A-', status: 'present' },
  { id: '3', name: 'Ram Gurung', nameNe: 'राम गुरुङ', rollNo: 3, attendance: 88, avgGrade: 'B+', status: 'absent' },
  { id: '4', name: 'Priya Rai', nameNe: 'प्रिया राई', rollNo: 4, attendance: 97, avgGrade: 'A+', status: 'present' },
  { id: '5', name: 'Kiran Tamang', nameNe: 'किरण तामाङ', rollNo: 5, attendance: 85, avgGrade: 'B', status: 'late' },
  { id: '6', name: 'Maya Shrestha', nameNe: 'माया श्रेष्ठ', rollNo: 6, attendance: 90, avgGrade: 'B+', status: 'present' },
  { id: '7', name: 'Bikash Magar', nameNe: 'बिकास मगर', rollNo: 7, attendance: 93, avgGrade: 'A-', status: 'present' },
  { id: '8', name: 'Anita Limbu', nameNe: 'अनिता लिम्बु', rollNo: 8, attendance: 91, avgGrade: 'B+', status: 'present' },
];

export default function ClassesPage() {
  const { locale } = useLocaleStore();
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('roster');

  const filteredStudents = mockStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.nameNe.includes(searchQuery)
  );

  if (selectedClass) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedClass(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {locale === 'en' ? 'Grade' : 'कक्षा'} {selectedClass.grade}
              {selectedClass.section}
            </h1>
            <p className="text-sm text-muted-foreground">
              {locale === 'en' ? selectedClass.subject : selectedClass.subjectNe} •{' '}
              {selectedClass.studentCount} {locale === 'en' ? 'students' : 'विद्यार्थीहरू'}
            </p>
          </div>
        </div>

        {/* Class Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <Users className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{selectedClass.studentCount}</p>
              <p className="text-xs text-muted-foreground">
                {locale === 'en' ? 'Students' : 'विद्यार्थी'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <GraduationCap className="h-6 w-6 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">B+</p>
              <p className="text-xs text-muted-foreground">
                {locale === 'en' ? 'Class Average' : 'कक्षा औसत'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Clock className="h-6 w-6 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold">91%</p>
              <p className="text-xs text-muted-foreground">
                {locale === 'en' ? 'Attendance' : 'उपस्थिति'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="roster" className="flex-1">
              {locale === 'en' ? 'Roster' : 'विद्यार्थी सूची'}
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex-1">
              {locale === 'en' ? 'Schedule' : 'तालिका'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roster" className="mt-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={locale === 'en' ? 'Search students...' : 'विद्यार्थी खोज्नुहोस्...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Student List */}
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm bg-primary/10 text-primary">
                            {student.rollNo}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {locale === 'en' ? student.name : student.nameNe}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>
                              {locale === 'en' ? 'Roll' : 'रोल'} #{student.rollNo}
                            </span>
                            <span>•</span>
                            <span>{student.attendance}% {locale === 'en' ? 'Att.' : 'उप.'}</span>
                            <span>•</span>
                            <span>{student.avgGrade}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          student.status === 'present' && 'border-green-500 text-green-600',
                          student.status === 'absent' && 'border-red-500 text-red-600',
                          student.status === 'late' && 'border-yellow-500 text-yellow-600'
                        )}
                      >
                        {student.status === 'present'
                          ? locale === 'en' ? 'Present' : 'उपस्थित'
                          : student.status === 'absent'
                          ? locale === 'en' ? 'Absent' : 'अनुपस्थित'
                          : locale === 'en' ? 'Late' : 'ढिलो'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {locale === 'en' ? 'Schedule' : 'तालिका'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'en' ? selectedClass.schedule : selectedClass.scheduleNe}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {locale === 'en' ? 'Subject' : 'विषय'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'en' ? selectedClass.subject : selectedClass.subjectNe}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" asChild>
            <Link href="/teacher/attendance">
              {locale === 'en' ? 'Mark Attendance' : 'उपस्थिति लगाउनुहोस्'}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/teacher/grades">
              {locale === 'en' ? 'Enter Grades' : 'ग्रेड प्रविष्ट गर्नुहोस्'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teacher">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {locale === 'en' ? 'My Classes' : 'मेरा कक्षाहरू'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Manage your classes and students'
              : 'आफ्ना कक्षा र विद्यार्थीहरू व्यवस्थापन गर्नुहोस्'}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{mockClasses.length}</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Classes' : 'कक्षाहरू'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Users className="h-6 w-6 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">
              {mockClasses.reduce((sum, c) => sum + c.studentCount, 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Total Students' : 'कुल विद्यार्थी'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Class List */}
      <div className="space-y-3">
        {mockClasses.map((cls) => (
          <Card
            key={cls.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setSelectedClass(cls)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">
                      {cls.grade}{cls.section}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {locale === 'en' ? 'Grade' : 'कक्षा'} {cls.grade}
                      {cls.section}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'en' ? cls.subject : cls.subjectNe}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {cls.studentCount}
                      </Badge>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
