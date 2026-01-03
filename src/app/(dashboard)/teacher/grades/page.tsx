'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Save,
  MessageSquare,
  Calculator,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  nameNe: string;
  rollNo: number;
  score: string;
  grade: string;
  status: 'entered' | 'pending' | 'absent';
}

const mockStudents: Student[] = [
  { id: '1', name: 'Aarav Sharma', nameNe: 'आरव शर्मा', rollNo: 1, score: '', grade: '', status: 'pending' },
  { id: '2', name: 'Sita Thapa', nameNe: 'सीता थापा', rollNo: 2, score: '', grade: '', status: 'pending' },
  { id: '3', name: 'Ram Gurung', nameNe: 'राम गुरुङ', rollNo: 3, score: '', grade: '', status: 'pending' },
  { id: '4', name: 'Priya Rai', nameNe: 'प्रिया राई', rollNo: 4, score: '', grade: '', status: 'pending' },
  { id: '5', name: 'Kiran Tamang', nameNe: 'किरण तामाङ', rollNo: 5, score: '', grade: '', status: 'pending' },
  { id: '6', name: 'Maya Shrestha', nameNe: 'माया श्रेष्ठ', rollNo: 6, score: '', grade: '', status: 'pending' },
  { id: '7', name: 'Bikash Magar', nameNe: 'बिकास मगर', rollNo: 7, score: '', grade: '', status: 'pending' },
  { id: '8', name: 'Anita Limbu', nameNe: 'अनिता लिम्बु', rollNo: 8, score: '', grade: '', status: 'pending' },
];

const classOptions = [
  { value: '7A', label: 'Grade 7A', labelNe: 'कक्षा ७A' },
  { value: '7B', label: 'Grade 7B', labelNe: 'कक्षा ७B' },
  { value: '8A', label: 'Grade 8A', labelNe: 'कक्षा ८A' },
  { value: '8B', label: 'Grade 8B', labelNe: 'कक्षा ८B' },
];

const assessmentOptions = [
  { value: 'unit1', label: 'Unit 1 Test', labelNe: 'एकाई १ परीक्षा', maxScore: 100 },
  { value: 'unit2', label: 'Unit 2 Test', labelNe: 'एकाई २ परीक्षा', maxScore: 100 },
  { value: 'midterm', label: 'Mid-Term Exam', labelNe: 'मध्यावधि परीक्षा', maxScore: 100 },
  { value: 'project', label: 'Project', labelNe: 'परियोजना', maxScore: 50 },
  { value: 'homework', label: 'Homework', labelNe: 'गृहकार्य', maxScore: 20 },
];

function calculateGrade(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 32) return 'D';
  return 'NG';
}

export default function GradesPage() {
  const { locale } = useLocaleStore();
  const [selectedClass, setSelectedClass] = useState('7A');
  const [selectedAssessment, setSelectedAssessment] = useState('unit1');
  const [students, setStudents] = useState(mockStudents);
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  const [feedbackStudent, setFeedbackStudent] = useState<Student | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const currentAssessment = assessmentOptions.find((a) => a.value === selectedAssessment);
  const maxScore = currentAssessment?.maxScore || 100;

  const enteredCount = students.filter((s) => s.status === 'entered').length;
  const pendingCount = students.filter((s) => s.status === 'pending').length;

  const handleScoreChange = (studentId: string, value: string) => {
    const numValue = parseInt(value, 10);

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;

        if (value === '' || value === 'AB') {
          return {
            ...s,
            score: value,
            grade: value === 'AB' ? 'AB' : '',
            status: value === 'AB' ? 'absent' as const : 'pending' as const,
          };
        }

        if (isNaN(numValue) || numValue < 0 || numValue > maxScore) {
          return s;
        }

        return {
          ...s,
          score: value,
          grade: calculateGrade(numValue, maxScore),
          status: 'entered' as const,
        };
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (index < students.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = () => {
    if (pendingCount > 0) {
      toast.error(
        locale === 'en'
          ? `${pendingCount} students still need grades`
          : `${pendingCount} विद्यार्थीहरूको ग्रेड अझै बाँकी छ`
      );
      return;
    }

    toast.success(
      locale === 'en' ? 'Grades saved successfully!' : 'ग्रेडहरू सफलतापूर्वक सुरक्षित गरियो!'
    );
  };

  const handleSendFeedback = () => {
    toast.success(
      locale === 'en'
        ? `Feedback sent to ${feedbackStudent?.name}'s parents`
        : `${feedbackStudent?.nameNe}को अभिभावकलाई प्रतिक्रिया पठाइयो`
    );
    setFeedbackStudent(null);
    setFeedbackText('');
  };

  // Calculate stats
  const scores = students
    .filter((s) => s.status === 'entered')
    .map((s) => parseInt(s.score, 10));
  const avgScore = scores.length > 0
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : '-';
  const highestScore = scores.length > 0 ? Math.max(...scores) : '-';
  const lowestScore = scores.length > 0 ? Math.min(...scores) : '-';

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
            {locale === 'en' ? 'Grade Entry' : 'ग्रेड प्रविष्टि'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Enter scores using keyboard navigation'
              : 'किबोर्ड नेभिगेसन प्रयोग गरी स्कोर प्रविष्ट गर्नुहोस्'}
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-[180px]">
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

        <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {assessmentOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {locale === 'en' ? opt.label : opt.labelNe} ({opt.maxScore})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-2xl font-bold text-green-600">{enteredCount}</span>
                <span className="text-muted-foreground text-sm ml-1">
                  / {students.length} {locale === 'en' ? 'entered' : 'प्रविष्ट'}
                </span>
              </div>
              {pendingCount > 0 && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-400">
                  {pendingCount} {locale === 'en' ? 'pending' : 'बाँकी'}
                </Badge>
              )}
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>
                {locale === 'en' ? 'Avg' : 'औसत'}: <strong>{avgScore}</strong>
              </span>
              <span>
                {locale === 'en' ? 'High' : 'उच्च'}: <strong>{highestScore}</strong>
              </span>
              <span>
                {locale === 'en' ? 'Low' : 'न्यून'}: <strong>{lowestScore}</strong>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Hints */}
      <div className="text-xs text-muted-foreground flex items-center gap-4">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↑</kbd>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↓</kbd>
          {locale === 'en' ? 'Navigate' : 'नेभिगेट'}
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd>
          {locale === 'en' ? 'Next' : 'अर्को'}
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">AB</kbd>
          {locale === 'en' ? '= Absent' : '= अनुपस्थित'}
        </span>
      </div>

      {/* Grade Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  {locale === 'en' ? 'Roll' : 'रोल'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  {locale === 'en' ? 'Name' : 'नाम'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  {locale === 'en' ? 'Score' : 'स्कोर'} (/{maxScore})
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  {locale === 'en' ? 'Grade' : 'ग्रेड'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  {locale === 'en' ? 'Status' : 'स्थिति'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  {locale === 'en' ? 'Action' : 'कार्य'}
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className={cn(
                    'border-t transition-colors',
                    focusedRow === index && 'bg-primary/5'
                  )}
                >
                  <td className="px-4 py-3 text-sm">{student.rollNo}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {locale === 'en' ? student.name : student.nameNe}
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      value={student.score}
                      onChange={(e) => handleScoreChange(student.id, e.target.value.toUpperCase())}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={() => setFocusedRow(index)}
                      onBlur={() => setFocusedRow(null)}
                      className={cn(
                        'w-20 text-center mx-auto',
                        student.status === 'entered' && 'border-green-400',
                        student.status === 'absent' && 'border-red-400 text-red-500'
                      )}
                      placeholder="-"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        student.grade === 'A+' && 'border-green-500 text-green-600 bg-green-50',
                        student.grade === 'A' && 'border-green-400 text-green-500',
                        student.grade === 'B+' && 'border-blue-400 text-blue-500',
                        student.grade === 'B' && 'border-blue-300 text-blue-400',
                        student.grade === 'C+' && 'border-yellow-400 text-yellow-600',
                        student.grade === 'C' && 'border-yellow-300 text-yellow-500',
                        student.grade === 'D' && 'border-orange-400 text-orange-500',
                        student.grade === 'NG' && 'border-red-500 text-red-600',
                        student.grade === 'AB' && 'border-gray-400 text-gray-500'
                      )}
                    >
                      {student.grade || '-'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {student.status === 'entered' && (
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    )}
                    {student.status === 'pending' && (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                    {student.status === 'absent' && (
                      <Badge variant="outline" className="text-xs text-red-500 border-red-300">
                        AB
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setFeedbackStudent(student)}
                      disabled={student.status !== 'entered'}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Submit Button */}
      <Button className="w-full h-12" onClick={handleSubmit}>
        <Save className="h-5 w-5 mr-2" />
        {locale === 'en' ? 'Save Grades' : 'ग्रेडहरू सुरक्षित गर्नुहोस्'}
      </Button>

      {/* Feedback Dialog */}
      <Dialog open={!!feedbackStudent} onOpenChange={() => setFeedbackStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {locale === 'en' ? 'Send Feedback' : 'प्रतिक्रिया पठाउनुहोस्'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <p className="font-medium">
                {locale === 'en' ? feedbackStudent?.name : feedbackStudent?.nameNe}
              </p>
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Score' : 'स्कोर'}: {feedbackStudent?.score}/{maxScore} ({feedbackStudent?.grade})
              </p>
            </div>

            <div className="space-y-2">
              <Label>
                {locale === 'en' ? 'Quick Feedback' : 'द्रुत प्रतिक्रिया'}
              </Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Excellent work!', labelNe: 'उत्कृष्ट काम!' },
                  { label: 'Good effort', labelNe: 'राम्रो प्रयास' },
                  { label: 'Needs improvement', labelNe: 'सुधार आवश्यक' },
                  { label: 'Please revise', labelNe: 'कृपया पुनरावलोकन गर्नुहोस्' },
                ].map((opt) => (
                  <Button
                    key={opt.label}
                    size="sm"
                    variant="outline"
                    onClick={() => setFeedbackText(locale === 'en' ? opt.label : opt.labelNe)}
                  >
                    {locale === 'en' ? opt.label : opt.labelNe}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Custom Message' : 'कस्टम सन्देश'}</Label>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={
                  locale === 'en'
                    ? 'Type your feedback...'
                    : 'आफ्नो प्रतिक्रिया टाइप गर्नुहोस्...'
                }
                rows={3}
              />
            </div>

            <Button className="w-full" onClick={handleSendFeedback}>
              <MessageSquare className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Send to Parents' : 'अभिभावकलाई पठाउनुहोस्'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
