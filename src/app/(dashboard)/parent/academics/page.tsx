'use client';

import { useState, useMemo } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { useMockData } from '@/hooks/useMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, TrendingUp, TrendingDown, Download, BookOpen } from 'lucide-react';
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
} from 'recharts';

// Mock grade data
const mockGrades = {
  gpa: 3.7,
  gpaTrend: 'up' as const,
  subjects: [
    { name: 'Mathematics', nameNe: 'गणित', grade: 'A', score: 92, trend: 'up' },
    { name: 'Science', nameNe: 'विज्ञान', grade: 'A-', score: 88, trend: 'up' },
    { name: 'English', nameNe: 'अंग्रेजी', grade: 'B+', score: 85, trend: 'stable' },
    { name: 'Nepali', nameNe: 'नेपाली', grade: 'A', score: 90, trend: 'up' },
    { name: 'Social Studies', nameNe: 'सामाजिक अध्ययन', grade: 'B+', score: 84, trend: 'down' },
    { name: 'Computer', nameNe: 'कम्प्युटर', grade: 'A+', score: 96, trend: 'up' },
  ],
  recentAssessments: [
    { name: 'Math Unit Test 3', date: '2026-01-02', score: 45, total: 50 },
    { name: 'Science Lab Report', date: '2025-12-28', score: 18, total: 20 },
    { name: 'English Essay', date: '2025-12-25', score: 42, total: 50 },
    { name: 'Nepali Comprehension', date: '2025-12-20', score: 28, total: 30 },
  ],
  trendData: [
    { month: 'Aug', gpa: 3.4 },
    { month: 'Sep', gpa: 3.5 },
    { month: 'Oct', gpa: 3.5 },
    { month: 'Nov', gpa: 3.6 },
    { month: 'Dec', gpa: 3.7 },
    { month: 'Jan', gpa: 3.7 },
  ],
};

function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  if (grade.startsWith('B')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  if (grade.startsWith('C')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
}

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
              {locale === 'en' ? 'Academic Performance' : 'शैक्षिक प्रदर्शन'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? 'Track grades and academic progress'
                : 'ग्रेड र शैक्षिक प्रगति ट्र्याक गर्नुहोस्'}
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

      {/* GPA Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Current GPA' : 'हालको GPA'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-4xl font-bold">{mockGrades.gpa}</span>
                {mockGrades.gpaTrend === 'up' ? (
                  <TrendingUp className="h-6 w-6 text-green-500" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {locale === 'en' ? 'out of 4.0' : '४.० मध्ये'}
              </p>
            </div>
            <Button onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Download Report' : 'रिपोर्ट डाउनलोड'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subject Grades Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {locale === 'en' ? 'Subject Grades' : 'विषय ग्रेडहरू'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockGrades.subjects.map((subject) => (
            <Card key={subject.name} className="text-center">
              <CardContent className="pt-4 pb-4">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">
                  {locale === 'en' ? subject.name : subject.nameNe}
                </p>
                <Badge className={`mt-2 ${getGradeColor(subject.grade)}`}>
                  {subject.grade}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{subject.score}%</p>
                <div className="flex items-center justify-center mt-1">
                  {subject.trend === 'up' && (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  )}
                  {subject.trend === 'down' && (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Grade Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'GPA Trend' : 'GPA प्रवृत्ति'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockGrades.trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis domain={[3, 4]} className="text-xs" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="gpa"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
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
            {mockGrades.recentAssessments.map((assessment, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{assessment.name}</p>
                  <p className="text-xs text-muted-foreground">{assessment.date}</p>
                </div>
                <Badge variant="outline">
                  {assessment.score}/{assessment.total}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
