'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { useMockData } from '@/hooks/useMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeacherSchedule } from '@/components/teacher/TeacherSchedule';
import { ClassOverview } from '@/components/teacher/ClassOverview';
import { AttendanceMarker } from '@/components/teacher/AttendanceMarker';
import { GradeEntry } from '@/components/teacher/GradeEntry';
import { QuickMomentPost } from '@/components/teacher/QuickMomentPost';
import { toast } from 'sonner';
import {
  Users,
  BookOpen,
  ClipboardList,
  Camera,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react';

// Demo teacher ID
const DEMO_TEACHER_ID = 'teacher-1';

export default function TeacherDashboard() {
  const { locale, useDevanagariNumerals } = useLocaleStore();
  const { teachers, students } = useMockData();

  const [activeTab, setActiveTab] = useState('overview');
  const [showMomentPost, setShowMomentPost] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  // Get demo teacher
  const demoTeacher = teachers.find((t) => t.id === DEMO_TEACHER_ID) || teachers[0];

  // Demo schedule data
  const todaySchedule = [
    {
      id: 'sch-1',
      subject: 'Mathematics',
      subjectNe: 'गणित',
      className: 'Grade 5A',
      classNameNe: 'कक्षा ५क',
      startTime: '08:00',
      endTime: '08:45',
      room: 'Room 101',
    },
    {
      id: 'sch-2',
      subject: 'Mathematics',
      subjectNe: 'गणित',
      className: 'Grade 6B',
      classNameNe: 'कक्षा ६ख',
      startTime: '09:00',
      endTime: '09:45',
      room: 'Room 102',
      isCurrent: true,
    },
    {
      id: 'sch-3',
      subject: 'Mathematics',
      subjectNe: 'गणित',
      className: 'Grade 7A',
      classNameNe: 'कक्षा ७क',
      startTime: '10:00',
      endTime: '10:45',
      room: 'Room 103',
      isNext: true,
    },
    {
      id: 'sch-4',
      subject: 'Science',
      subjectNe: 'विज्ञान',
      className: 'Grade 5B',
      classNameNe: 'कक्षा ५ख',
      startTime: '11:15',
      endTime: '12:00',
      room: 'Lab 1',
    },
    {
      id: 'sch-5',
      subject: 'Mathematics',
      subjectNe: 'गणित',
      className: 'Grade 8A',
      classNameNe: 'कक्षा ८क',
      startTime: '14:00',
      endTime: '14:45',
      room: 'Room 201',
    },
  ];

  // Demo classes data
  const demoClasses = [
    {
      id: 'class-5a',
      name: 'Grade 5A',
      nameNe: 'कक्षा ५क',
      grade: 5,
      section: 'A',
      studentCount: 32,
      attendanceRate: 94,
      homeworkCompletion: 87,
      averageGrade: 78,
      recentActivity: '2 hours ago',
    },
    {
      id: 'class-6b',
      name: 'Grade 6B',
      nameNe: 'कक्षा ६ख',
      grade: 6,
      section: 'B',
      studentCount: 28,
      attendanceRate: 91,
      homeworkCompletion: 82,
      averageGrade: 73,
      recentActivity: '4 hours ago',
    },
    {
      id: 'class-7a',
      name: 'Grade 7A',
      nameNe: 'कक्षा ७क',
      grade: 7,
      section: 'A',
      studentCount: 30,
      attendanceRate: 96,
      homeworkCompletion: 90,
      averageGrade: 82,
      recentActivity: 'Yesterday',
    },
    {
      id: 'class-8a',
      name: 'Grade 8A',
      nameNe: 'कक्षा ८क',
      grade: 8,
      section: 'A',
      studentCount: 25,
      attendanceRate: 89,
      homeworkCompletion: 78,
      averageGrade: 71,
      recentActivity: 'Yesterday',
    },
  ];

  // Demo students for attendance/grading
  const demoStudents = Array.from({ length: 25 }, (_, i) => ({
    id: `student-${i + 1}`,
    name: `Student ${i + 1}`,
    nameNe: `विद्यार्थी ${formatNumber(i + 1)}`,
    rollNumber: i + 1,
    avatarUrl: undefined,
  }));

  // Activity types for moment posting
  const activityTypes = [
    { id: 'science_lab', name: 'Science Lab', nameNe: 'विज्ञान प्रयोगशाला', icon: '🔬' },
    { id: 'art', name: 'Art Class', nameNe: 'कला कक्षा', icon: '🎨' },
    { id: 'sports', name: 'Sports', nameNe: 'खेलकुद', icon: '⚽' },
    { id: 'cultural', name: 'Cultural', nameNe: 'सांस्कृतिक', icon: '🎭' },
    { id: 'field_trip', name: 'Field Trip', nameNe: 'फिल्ड ट्रिप', icon: '🚌' },
    { id: 'celebration', name: 'Celebration', nameNe: 'उत्सव', icon: '🎉' },
  ];

  // Quick stats
  const quickStats = [
    {
      icon: <Users className="h-5 w-5" />,
      label: { en: 'Total Students', ne: 'कुल विद्यार्थीहरू' },
      value: formatNumber(115),
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: { en: 'Classes Today', ne: 'आज कक्षाहरू' },
      value: formatNumber(5),
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: { en: 'Pending Grades', ne: 'बाँकी ग्रेडहरू' },
      value: formatNumber(12),
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: { en: 'Leave Requests', ne: 'बिदा अनुरोधहरू' },
      value: formatNumber(4),
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setActiveTab('attendance');
  };

  const handleMomentPost = (data: unknown) => {
    console.log('Moment posted:', data);
    toast.success(
      locale === 'en'
        ? 'Moment posted to parent feeds!'
        : 'पल अभिभावक फिडहरूमा पोस्ट गरियो!'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {locale === 'en'
              ? `Welcome, ${demoTeacher?.name?.split(' ')[0] || 'Teacher'}!`
              : `स्वागत छ, ${demoTeacher?.nameNe?.split(' ')[0] || 'शिक्षक'}!`}
          </h1>
          <p className="text-muted-foreground mt-1">
            {locale === 'en'
              ? 'Manage your classes and track student progress.'
              : 'आफ्नो कक्षाहरू व्यवस्थापन गर्नुहोस् र विद्यार्थी प्रगति ट्र्याक गर्नुहोस्।'}
          </p>
        </div>
        <Button onClick={() => setShowMomentPost(true)}>
          <Camera className="h-4 w-4 mr-2" />
          {locale === 'en' ? 'Post Moment' : 'पल पोस्ट गर्नुहोस्'}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label.en}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label[locale]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Schedule - Takes 1 column */}
        <div>
          <TeacherSchedule schedule={todaySchedule} />
        </div>

        {/* Tabs - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="overview">
                {locale === 'en' ? 'Classes' : 'कक्षाहरू'}
              </TabsTrigger>
              <TabsTrigger value="attendance">
                {locale === 'en' ? 'Attendance' : 'उपस्थिति'}
              </TabsTrigger>
              <TabsTrigger value="grades">
                {locale === 'en' ? 'Grades' : 'ग्रेडहरू'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <ClassOverview classes={demoClasses} onSelectClass={handleClassSelect} />
            </TabsContent>

            <TabsContent value="attendance" className="mt-4">
              <AttendanceMarker
                className={selectedClassId ? demoClasses.find(c => c.id === selectedClassId)?.name || 'Grade 5A' : 'Grade 5A'}
                classNameNe={selectedClassId ? demoClasses.find(c => c.id === selectedClassId)?.nameNe || 'कक्षा ५क' : 'कक्षा ५क'}
                students={demoStudents}
                onSubmit={(attendance) => {
                  console.log('Attendance:', attendance);
                  toast.success(
                    locale === 'en'
                      ? 'Attendance submitted successfully!'
                      : 'उपस्थिति सफलतापूर्वक पेश गरियो!'
                  );
                }}
              />
            </TabsContent>

            <TabsContent value="grades" className="mt-4">
              <GradeEntry
                assignmentTitle="Unit Test - Chapter 4"
                assignmentTitleNe="एकाइ परीक्षा - अध्याय ४"
                maxScore={50}
                students={demoStudents}
                onSave={(grades) => {
                  console.log('Grades:', grades);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Moment Post Modal */}
      <QuickMomentPost
        isOpen={showMomentPost}
        onClose={() => setShowMomentPost(false)}
        classes={demoClasses.map((c) => ({
          id: c.id,
          name: c.name,
          nameNe: c.nameNe,
        }))}
        activityTypes={activityTypes}
        onPost={handleMomentPost}
      />
    </div>
  );
}
