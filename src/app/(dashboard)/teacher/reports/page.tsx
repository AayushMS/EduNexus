'use client';

import { useState, useMemo } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Download,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isSameDay } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock attendance data
interface AttendanceRecord {
  date: string;
  present: number;
  absent: number;
  late: number;
  total: number;
}

interface StudentAttendance {
  id: string;
  name: string;
  nameNe: string;
  rollNo: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalDays: number;
  attendancePercentage: number;
}

const classOptions = [
  { value: '7A', label: 'Grade 7A', labelNe: 'कक्षा ७A' },
  { value: '7B', label: 'Grade 7B', labelNe: 'कक्षा ७B' },
  { value: '8A', label: 'Grade 8A', labelNe: 'कक्षा ८A' },
  { value: '8B', label: 'Grade 8B', labelNe: 'कक्षा ८B' },
];

const monthOptions = [
  { value: '2026-01', label: 'January 2026', labelNe: 'जनवरी २०२६' },
  { value: '2025-12', label: 'December 2025', labelNe: 'डिसेम्बर २०२५' },
  { value: '2025-11', label: 'November 2025', labelNe: 'नोभेम्बर २०२५' },
  { value: '2025-10', label: 'October 2025', labelNe: 'अक्टोबर २०२५' },
];

// Generate mock attendance trend data
const generateTrendData = (): AttendanceRecord[] => {
  const data: AttendanceRecord[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    if (!isWeekend(date)) {
      const total = 32;
      const present = Math.floor(Math.random() * 4) + 28; // 28-31
      const late = Math.floor(Math.random() * 3); // 0-2
      const absent = total - present;
      data.push({
        date: format(date, 'MMM d'),
        present,
        absent,
        late,
        total,
      });
    }
  }
  return data;
};

// Generate mock student attendance data
const generateStudentData = (): StudentAttendance[] => {
  const names = [
    { name: 'Aarav Sharma', nameNe: 'आरव शर्मा' },
    { name: 'Sita Thapa', nameNe: 'सीता थापा' },
    { name: 'Ram Gurung', nameNe: 'राम गुरुङ' },
    { name: 'Priya Rai', nameNe: 'प्रिया राई' },
    { name: 'Kiran Tamang', nameNe: 'किरण तामाङ' },
    { name: 'Maya Shrestha', nameNe: 'माया श्रेष्ठ' },
    { name: 'Bikash Magar', nameNe: 'बिकास मगर' },
    { name: 'Anita Limbu', nameNe: 'अनिता लिम्बु' },
    { name: 'Suresh KC', nameNe: 'सुरेश केसी' },
    { name: 'Gita Adhikari', nameNe: 'गीता अधिकारी' },
  ];

  return names.map((n, index) => {
    const totalDays = 22;
    const presentDays = Math.floor(Math.random() * 5) + 18; // 18-22
    const lateDays = Math.floor(Math.random() * 3); // 0-2
    const absentDays = totalDays - presentDays;
    return {
      id: `STU-${index + 1}`,
      name: n.name,
      nameNe: n.nameNe,
      rollNo: index + 1,
      presentDays,
      absentDays,
      lateDays,
      totalDays,
      attendancePercentage: Math.round((presentDays / totalDays) * 100),
    };
  });
};

const trendData = generateTrendData();
const studentData = generateStudentData();

// Summary stats
const summaryStats = {
  averageAttendance: 94,
  totalWorkingDays: 22,
  totalStudents: 32,
  presentToday: 30,
  absentToday: 2,
  lateToday: 1,
};

// Pie chart colors
const COLORS = ['#22C55E', '#EF4444', '#F59E0B'];

export default function AttendanceReportsPage() {
  const { locale } = useLocaleStore();
  const [selectedClass, setSelectedClass] = useState('7A');
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [selectedTab, setSelectedTab] = useState('overview');

  const pieData = [
    { name: locale === 'en' ? 'Present' : 'उपस्थित', value: summaryStats.presentToday },
    { name: locale === 'en' ? 'Absent' : 'अनुपस्थित', value: summaryStats.absentToday },
    { name: locale === 'en' ? 'Late' : 'ढिलो', value: summaryStats.lateToday },
  ];

  const handleExportReport = () => {
    toast.success(
      locale === 'en'
        ? 'Generating attendance report...'
        : 'उपस्थिति रिपोर्ट तयार हुँदैछ...'
    );
  };

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 90) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Excellent</Badge>;
    }
    if (percentage >= 75) {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Good</Badge>;
    }
    return <Badge variant="destructive">Needs Attention</Badge>;
  };

  // Sort students by attendance percentage (ascending for attention list)
  const studentsNeedingAttention = [...studentData]
    .filter((s) => s.attendancePercentage < 85)
    .sort((a, b) => a.attendancePercentage - b.attendancePercentage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/teacher">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {locale === 'en' ? 'Attendance Reports' : 'उपस्थिति रिपोर्टहरू'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? 'View historical attendance data and analytics'
                : 'ऐतिहासिक उपस्थिति डेटा र विश्लेषण हेर्नुहोस्'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[140px]">
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

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {locale === 'en' ? opt.label : opt.labelNe}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Export' : 'निर्यात'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Avg Attendance' : 'औसत उपस्थिति'}
              </p>
            </div>
            <p className="text-3xl font-bold">{summaryStats.averageAttendance}%</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+2% {locale === 'en' ? 'from last month' : 'गत महिनाबाट'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Total Students' : 'कुल विद्यार्थी'}
              </p>
            </div>
            <p className="text-3xl font-bold">{summaryStats.totalStudents}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === 'en' ? 'in' : ''} {selectedClass}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Present Today' : 'आज उपस्थित'}
              </p>
            </div>
            <p className="text-3xl font-bold text-green-600">{summaryStats.presentToday}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((summaryStats.presentToday / summaryStats.totalStudents) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Absent Today' : 'आज अनुपस्थित'}
              </p>
            </div>
            <p className="text-3xl font-bold text-red-600">{summaryStats.absentToday}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {summaryStats.lateToday} {locale === 'en' ? 'late' : 'ढिलो'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">
            {locale === 'en' ? 'Overview' : 'अवलोकन'}
          </TabsTrigger>
          <TabsTrigger value="trends">
            {locale === 'en' ? 'Trends' : 'प्रवृत्ति'}
          </TabsTrigger>
          <TabsTrigger value="students">
            {locale === 'en' ? 'By Student' : 'विद्यार्थी अनुसार'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Today's Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === 'en' ? "Today's Attendance" : 'आजको उपस्थिति'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Students Needing Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  {locale === 'en' ? 'Needs Attention' : 'ध्यान चाहिन्छ'}
                </CardTitle>
                <CardDescription>
                  {locale === 'en'
                    ? 'Students with attendance below 85%'
                    : '८५% भन्दा कम उपस्थिति भएका विद्यार्थी'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {studentsNeedingAttention.length > 0 ? (
                  <div className="space-y-4">
                    {studentsNeedingAttention.map((student) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-sm font-medium text-red-600">
                            {student.rollNo}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {locale === 'en' ? student.name : student.nameNe}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student.absentDays} {locale === 'en' ? 'days absent' : 'दिन अनुपस्थित'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">{student.attendancePercentage}%</p>
                          <Progress
                            value={student.attendancePercentage}
                            className="w-16 h-2 mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {locale === 'en'
                        ? 'All students have good attendance!'
                        : 'सबै विद्यार्थीको राम्रो उपस्थिति छ!'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'en' ? 'Attendance Trend (Last 30 Days)' : 'उपस्थिति प्रवृत्ति (पछिल्लो ३० दिन)'}
              </CardTitle>
              <CardDescription>
                {locale === 'en'
                  ? 'Daily attendance breakdown'
                  : 'दैनिक उपस्थिति विवरण'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="present" name={locale === 'en' ? 'Present' : 'उपस्थित'} fill="#22C55E" stackId="a" />
                    <Bar dataKey="late" name={locale === 'en' ? 'Late' : 'ढिलो'} fill="#F59E0B" stackId="a" />
                    <Bar dataKey="absent" name={locale === 'en' ? 'Absent' : 'अनुपस्थित'} fill="#EF4444" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Comparison */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'en' ? 'Monthly Comparison' : 'मासिक तुलना'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Oct', rate: 92 },
                      { month: 'Nov', rate: 94 },
                      { month: 'Dec', rate: 91 },
                      { month: 'Jan', rate: 94 },
                    ]}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[85, 100]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      name={locale === 'en' ? 'Attendance Rate' : 'उपस्थिति दर'}
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'en' ? 'Individual Student Attendance' : 'व्यक्तिगत विद्यार्थी उपस्थिति'}
              </CardTitle>
              <CardDescription>
                {locale === 'en'
                  ? `Attendance records for ${monthOptions.find((m) => m.value === selectedMonth)?.label}`
                  : `${monthOptions.find((m) => m.value === selectedMonth)?.labelNe} को उपस्थिति रेकर्ड`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                        {student.rollNo}
                      </div>
                      <div>
                        <p className="font-medium">
                          {locale === 'en' ? student.name : student.nameNe}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {student.presentDays} {locale === 'en' ? 'present' : 'उपस्थित'}
                          </span>
                          <span className="flex items-center gap-1">
                            <XCircle className="h-3 w-3 text-red-500" />
                            {student.absentDays} {locale === 'en' ? 'absent' : 'अनुपस्थित'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-yellow-500" />
                            {student.lateDays} {locale === 'en' ? 'late' : 'ढिलो'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          student.attendancePercentage >= 90
                            ? 'text-green-600'
                            : student.attendancePercentage >= 75
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>
                          {student.attendancePercentage}%
                        </p>
                        <Progress
                          value={student.attendancePercentage}
                          className="w-20 h-2 mt-1"
                        />
                      </div>
                      {getAttendanceBadge(student.attendancePercentage)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
