'use client';

import { useState, useMemo } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { useMockData } from '@/hooks/useMockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Download, BookOpen, Award, Target, Calendar, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Legend,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Enhanced mock grade data
const mockGrades = {
  gpa: 3.7,
  gpaTrend: 'up' as const,
  previousGpa: 3.5,
  classRank: 5,
  totalStudents: 32,
  percentile: 85,
  subjects: [
    { name: 'Mathematics', nameNe: 'गणित', grade: 'A', score: 92, previousScore: 85, trend: 'up', color: '#3B82F6' },
    { name: 'Science', nameNe: 'विज्ञान', grade: 'A-', score: 88, previousScore: 82, trend: 'up', color: '#10B981' },
    { name: 'English', nameNe: 'अंग्रेजी', grade: 'B+', score: 85, previousScore: 85, trend: 'stable', color: '#8B5CF6' },
    { name: 'Nepali', nameNe: 'नेपाली', grade: 'A', score: 90, previousScore: 88, trend: 'up', color: '#F59E0B' },
    { name: 'Social Studies', nameNe: 'सामाजिक अध्ययन', grade: 'B+', score: 84, previousScore: 87, trend: 'down', color: '#EF4444' },
    { name: 'Computer', nameNe: 'कम्प्युटर', grade: 'A+', score: 96, previousScore: 92, trend: 'up', color: '#06B6D4' },
  ],
  recentAssessments: [
    { name: 'Math Unit Test 3', date: '2026-01-02', score: 45, total: 50, subject: 'Mathematics' },
    { name: 'Science Lab Report', date: '2025-12-28', score: 18, total: 20, subject: 'Science' },
    { name: 'English Essay', date: '2025-12-25', score: 42, total: 50, subject: 'English' },
    { name: 'Nepali Comprehension', date: '2025-12-20', score: 28, total: 30, subject: 'Nepali' },
    { name: 'Computer Project', date: '2025-12-18', score: 48, total: 50, subject: 'Computer' },
    { name: 'Social Studies Quiz', date: '2025-12-15', score: 17, total: 20, subject: 'Social Studies' },
  ],
  trendData: [
    { month: 'Aug', monthNe: 'भदौ', gpa: 3.4, classAvg: 3.2 },
    { month: 'Sep', monthNe: 'असोज', gpa: 3.5, classAvg: 3.25 },
    { month: 'Oct', monthNe: 'कार्तिक', gpa: 3.5, classAvg: 3.3 },
    { month: 'Nov', monthNe: 'मंसिर', gpa: 3.6, classAvg: 3.28 },
    { month: 'Dec', monthNe: 'पुष', gpa: 3.7, classAvg: 3.35 },
    { month: 'Jan', monthNe: 'माघ', gpa: 3.7, classAvg: 3.32 },
  ],
  termComparison: [
    { term: 'Term 1', termNe: 'पहिलो टर्म', score: 82 },
    { term: 'Term 2', termNe: 'दोस्रो टर्म', score: 88 },
    { term: 'Current', termNe: 'हालको', score: 91 },
  ],
};

function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  if (grade.startsWith('B')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  if (grade.startsWith('C')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

// Custom tooltip for the GPA chart
const CustomTooltip = ({ active, payload, label, locale }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string; locale: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">
              {entry.dataKey === 'gpa'
                ? (locale === 'en' ? 'Your GPA' : 'तपाईंको GPA')
                : (locale === 'en' ? 'Class Avg' : 'कक्षा औसत')}:
            </span>
            <span className="font-semibold">{entry.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AcademicsPage() {
  const { locale } = useLocaleStore();
  const { students, parents } = useMockData();

  // Get children for selector
  const children = useMemo(() => {
    const parent = parents[0];
    if (!parent) return [];
    return parent.childrenIds
      .map((id) => students.find((s) => s.id === id))
      .filter(Boolean);
  }, [parents, students]);

  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || '');
  const selectedChild = children.find((c) => c?.id === selectedChildId);

  const handleDownloadReport = () => {
    toast.success(
      locale === 'en'
        ? 'Downloading report card...'
        : 'रिपोर्ट कार्ड डाउनलोड हुँदैछ...'
    );
  };

  // Prepare radar chart data
  const radarData = mockGrades.subjects.map(subject => ({
    subject: locale === 'en' ? subject.name.split(' ')[0] : subject.nameNe,
    score: subject.score,
    fullMark: 100,
  }));

  const gpaChange = mockGrades.gpa - mockGrades.previousGpa;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/parent">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {locale === 'en' ? 'Academic Performance' : 'शैक्षिक प्रदर्शन'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? 'Track grades and academic progress'
                : 'ग्रेड र शैक्षिक प्रगति ट्र्याक गर्नुहोस्'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
          <Button onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Download' : 'डाउनलोड'}
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Current GPA Card */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Current GPA' : 'हालको GPA'}
              </p>
              <div className={`flex items-center gap-1 text-xs font-medium ${gpaChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {gpaChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {gpaChange >= 0 ? '+' : ''}{gpaChange.toFixed(1)}
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{mockGrades.gpa}</span>
              <span className="text-muted-foreground text-sm">/ 4.0</span>
            </div>
            <Progress value={(mockGrades.gpa / 4) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        {/* Class Rank Card */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Class Rank' : 'कक्षा र्‍याङ्क'}
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">#{mockGrades.classRank}</span>
              <span className="text-muted-foreground text-sm">/ {mockGrades.totalStudents}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === 'en' ? 'Top 16%' : 'शीर्ष १६%'}
            </p>
          </CardContent>
        </Card>

        {/* Percentile Card */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Percentile' : 'प्रतिशत'}
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{mockGrades.percentile}</span>
              <span className="text-muted-foreground text-sm">%</span>
            </div>
            <Progress value={mockGrades.percentile} className="mt-2 h-2" />
          </CardContent>
        </Card>

        {/* Average Score Card */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Avg Score' : 'औसत स्कोर'}
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">
                {Math.round(mockGrades.subjects.reduce((a, b) => a + b.score, 0) / mockGrades.subjects.length)}
              </span>
              <span className="text-muted-foreground text-sm">%</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              {locale === 'en' ? '+5% from last term' : 'गत टर्मबाट +५%'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* GPA Trend Chart - Enhanced */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {locale === 'en' ? 'GPA Trend Analysis' : 'GPA प्रवृत्ति विश्लेषण'}
              </CardTitle>
              <CardDescription>
                {locale === 'en'
                  ? 'Compare your performance with class average'
                  : 'आफ्नो प्रदर्शनलाई कक्षा औसतसँग तुलना गर्नुहोस्'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">{locale === 'en' ? 'Your GPA' : 'तपाईंको GPA'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
                <span className="text-muted-foreground">{locale === 'en' ? 'Class Avg' : 'कक्षा औसत'}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockGrades.trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis
                  dataKey={locale === 'en' ? 'month' : 'monthNe'}
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[2.8, 4]}
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[3.0, 3.2, 3.4, 3.6, 3.8, 4.0]}
                />
                <Tooltip content={<CustomTooltip locale={locale} />} />
                <ReferenceLine y={3.5} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeOpacity={0.5} />
                <Area
                  type="monotone"
                  dataKey="classAvg"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  fill="url(#avgGradient)"
                  strokeDasharray="5 5"
                />
                <Area
                  type="monotone"
                  dataKey="gpa"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#gpaGradient)"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Subject Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {locale === 'en' ? 'Subject Performance' : 'विषय प्रदर्शन'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockGrades.subjects.map((subject) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                    <span className="text-sm font-medium">
                      {locale === 'en' ? subject.name : subject.nameNe}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                    <span className={`text-sm font-semibold ${getScoreColor(subject.score)}`}>
                      {subject.score}%
                    </span>
                    {subject.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                    {subject.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                    {subject.trend === 'stable' && <Minus className="h-3 w-3 text-gray-500" />}
                  </div>
                </div>
                <div className="relative">
                  <Progress value={subject.score} className="h-2" />
                  <div
                    className="absolute top-0 h-2 w-0.5 bg-muted-foreground/50"
                    style={{ left: `${subject.previousScore}%` }}
                    title={`Previous: ${subject.previousScore}%`}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en'
                    ? `Previous: ${subject.previousScore}% (${subject.score >= subject.previousScore ? '+' : ''}${subject.score - subject.previousScore}%)`
                    : `पहिलेको: ${subject.previousScore}% (${subject.score >= subject.previousScore ? '+' : ''}${subject.score - subject.previousScore}%)`}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {locale === 'en' ? 'Skills Overview' : 'सीप अवलोकन'}
            </CardTitle>
            <CardDescription>
              {locale === 'en' ? 'Subject proficiency breakdown' : 'विषय दक्षता विवरण'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid className="stroke-muted" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Term Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Term Comparison' : 'टर्म तुलना'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockGrades.termComparison} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis
                  dataKey={locale === 'en' ? 'term' : 'termNe'}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Recent Assessments' : 'हालका मूल्याङ्कनहरू'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockGrades.recentAssessments.map((assessment, index) => {
              const percentage = Math.round((assessment.score / assessment.total) * 100);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      percentage >= 90 ? 'bg-green-100 dark:bg-green-900/30' :
                      percentage >= 80 ? 'bg-blue-100 dark:bg-blue-900/30' :
                      percentage >= 70 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      <span className={`font-bold text-sm ${getScoreColor(percentage)}`}>
                        {percentage}%
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{assessment.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {assessment.date}
                        <span className="text-primary">• {assessment.subject}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {assessment.score}/{assessment.total}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
