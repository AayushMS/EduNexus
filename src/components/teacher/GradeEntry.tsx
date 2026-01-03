'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  nameNe: string;
  rollNumber: number;
}

interface GradeData {
  studentId: string;
  score: number | null;
  status: 'entered' | 'pending' | 'absent';
}

interface GradeEntryProps {
  assignmentTitle: string;
  assignmentTitleNe: string;
  maxScore: number;
  students: Student[];
  existingGrades?: Record<string, number | null>;
  onSave?: (grades: GradeData[]) => void;
}

const getLetterGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 30) return 'D';
  return 'E';
};

const getGradeColor = (letterGrade: string): string => {
  if (letterGrade.startsWith('A')) return 'text-green-600 dark:text-green-400';
  if (letterGrade.startsWith('B')) return 'text-blue-600 dark:text-blue-400';
  if (letterGrade.startsWith('C')) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

export function GradeEntry({
  assignmentTitle,
  assignmentTitleNe,
  maxScore,
  students,
  existingGrades = {},
  onSave,
}: GradeEntryProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();
  const [grades, setGrades] = useState<Record<string, string>>(
    () => Object.fromEntries(
      students.map((s) => [s.id, existingGrades[s.id]?.toString() ?? ''])
    )
  );
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  const handleScoreChange = (studentId: string, value: string) => {
    // Allow empty string or valid numbers
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= maxScore)) {
      setGrades((prev) => ({ ...prev, [studentId]: value }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, studentId: string, index: number) => {
    const studentIds = students.map((s) => s.id);
    let nextIndex = index;

    switch (e.key) {
      case 'Enter':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = Math.min(index + 1, studentIds.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = Math.max(index - 1, 0);
        break;
      case 'Tab':
        if (!e.shiftKey) {
          e.preventDefault();
          nextIndex = Math.min(index + 1, studentIds.length - 1);
        } else {
          e.preventDefault();
          nextIndex = Math.max(index - 1, 0);
        }
        break;
      default:
        return;
    }

    if (nextIndex !== index) {
      const nextStudentId = studentIds[nextIndex];
      inputRefs.current[nextStudentId]?.focus();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const gradeData: GradeData[] = students.map((student) => ({
      studentId: student.id,
      score: grades[student.id] ? parseFloat(grades[student.id]) : null,
      status: grades[student.id] ? 'entered' : 'pending',
    }));

    onSave?.(gradeData);
    setIsSaving(false);
    toast.success(
      locale === 'en' ? 'Grades saved successfully!' : 'ग्रेडहरू सफलतापूर्वक सुरक्षित गरियो!'
    );
  };

  // Calculate stats
  const enteredScores = Object.values(grades)
    .filter((g) => g !== '')
    .map((g) => parseFloat(g));

  const stats = {
    entered: enteredScores.length,
    pending: students.length - enteredScores.length,
    average: enteredScores.length > 0
      ? enteredScores.reduce((a, b) => a + b, 0) / enteredScores.length
      : 0,
    highest: enteredScores.length > 0 ? Math.max(...enteredScores) : 0,
    lowest: enteredScores.length > 0 ? Math.min(...enteredScores) : 0,
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              {locale === 'en' ? assignmentTitle : assignmentTitleNe}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === 'en' ? 'Max Score:' : 'अधिकतम स्कोर:'} {formatNumber(maxScore)}
            </p>
          </div>
          <Badge variant="outline">
            {formatNumber(stats.entered)}/{formatNumber(students.length)}{' '}
            {locale === 'en' ? 'entered' : 'प्रविष्ट'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-lg bg-secondary/50">
            <p className="text-lg font-bold text-green-600">
              {formatNumber(Math.round(stats.highest))}
            </p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Highest' : 'उच्चतम'}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-secondary/50">
            <p className="text-lg font-bold text-blue-600">
              {formatNumber(Math.round(stats.average * 10) / 10)}
            </p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Average' : 'औसत'}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-secondary/50">
            <p className="text-lg font-bold text-red-600">
              {formatNumber(Math.round(stats.lowest))}
            </p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Lowest' : 'न्यूनतम'}
            </p>
          </div>
        </div>

        {/* Grade Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-secondary/50 px-3 py-2 grid grid-cols-12 gap-2 text-xs font-medium">
            <div className="col-span-1">#</div>
            <div className="col-span-5">
              {locale === 'en' ? 'Student' : 'विद्यार्थी'}
            </div>
            <div className="col-span-3 text-center">
              {locale === 'en' ? 'Score' : 'स्कोर'}
            </div>
            <div className="col-span-2 text-center">
              {locale === 'en' ? 'Grade' : 'ग्रेड'}
            </div>
            <div className="col-span-1"></div>
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y">
            {students.map((student, index) => {
              const score = grades[student.id];
              const numScore = score ? parseFloat(score) : null;
              const percentage = numScore !== null ? (numScore / maxScore) * 100 : null;
              const letterGrade = percentage !== null ? getLetterGrade(percentage) : null;
              const isValid = score === '' || (numScore !== null && numScore >= 0 && numScore <= maxScore);

              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`
                    px-3 py-2 grid grid-cols-12 gap-2 items-center
                    ${focusedCell === student.id ? 'bg-primary/5' : 'hover:bg-secondary/30'}
                  `}
                >
                  <div className="col-span-1 text-sm text-muted-foreground">
                    {formatNumber(student.rollNumber)}
                  </div>
                  <div className="col-span-5 text-sm font-medium truncate">
                    {locale === 'en' ? student.name : student.nameNe}
                  </div>
                  <div className="col-span-3">
                    <Input
                      ref={(el) => {
                        inputRefs.current[student.id] = el;
                      }}
                      type="text"
                      inputMode="decimal"
                      value={score}
                      onChange={(e) => handleScoreChange(student.id, e.target.value)}
                      onFocus={() => setFocusedCell(student.id)}
                      onBlur={() => setFocusedCell(null)}
                      onKeyDown={(e) => handleKeyDown(e, student.id, index)}
                      placeholder="-"
                      className={`
                        h-8 text-center text-sm
                        ${!isValid ? 'border-red-500 focus:ring-red-500' : ''}
                      `}
                    />
                  </div>
                  <div className="col-span-2 text-center">
                    {letterGrade ? (
                      <Badge
                        variant="outline"
                        className={getGradeColor(letterGrade)}
                      >
                        {letterGrade}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {numScore !== null && (
                      numScore >= maxScore * 0.6 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : numScore < maxScore * 0.4 ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : null
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {locale === 'en' ? 'Saving...' : 'सुरक्षित गर्दै...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Save Grades' : 'ग्रेडहरू सुरक्षित गर्नुहोस्'}
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {locale === 'en'
            ? 'Use Tab, Enter, or Arrow keys to navigate between cells'
            : 'सेलहरू बीच नेभिगेट गर्न Tab, Enter, वा Arrow कुञ्जीहरू प्रयोग गर्नुहोस्'}
        </p>
      </CardContent>
    </Card>
  );
}
