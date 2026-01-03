'use client';

import { useState, useMemo } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/shared';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Upload,
  Camera,
  FileText,
  Mic,
  Video,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, differenceInDays, isPast } from 'date-fns';

type FilterType = 'all' | 'pending' | 'submitted' | 'late' | 'graded';
type SortType = 'dueDate' | 'subject' | 'xp';

interface Assignment {
  id: string;
  title: string;
  titleNe: string;
  subject: string;
  subjectNe: string;
  dueDate: string;
  xpReward: number;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  grade?: string;
  icon: string;
}

// Mock assignments
const mockAssignments: Assignment[] = [
  { id: '1', title: 'Math Chapter 5 Problems', titleNe: 'गणित अध्याय ५ समस्याहरू', subject: 'Mathematics', subjectNe: 'गणित', dueDate: '2026-01-05', xpReward: 50, status: 'pending', icon: '🧮' },
  { id: '2', title: 'Science Lab Report', titleNe: 'विज्ञान प्रयोगशाला रिपोर्ट', subject: 'Science', subjectNe: 'विज्ञान', dueDate: '2026-01-04', xpReward: 75, status: 'pending', icon: '🔬' },
  { id: '3', title: 'English Essay: My Holiday', titleNe: 'अंग्रेजी निबन्ध: मेरो बिदा', subject: 'English', subjectNe: 'अंग्रेजी', dueDate: '2026-01-06', xpReward: 60, status: 'pending', icon: '📝' },
  { id: '4', title: 'Nepali Poem Analysis', titleNe: 'नेपाली कविता विश्लेषण', subject: 'Nepali', subjectNe: 'नेपाली', dueDate: '2026-01-08', xpReward: 50, status: 'pending', icon: '📚' },
  { id: '5', title: 'Social Studies Map Work', titleNe: 'सामाजिक अध्ययन नक्सा कार्य', subject: 'Social Studies', subjectNe: 'सामाजिक अध्ययन', dueDate: '2026-01-10', xpReward: 40, status: 'pending', icon: '🗺️' },
  { id: '6', title: 'Computer Programming Exercise', titleNe: 'कम्प्युटर प्रोग्रामिङ अभ्यास', subject: 'Computer', subjectNe: 'कम्प्युटर', dueDate: '2025-12-30', xpReward: 100, status: 'submitted', icon: '💻' },
  { id: '7', title: 'Math Quiz Corrections', titleNe: 'गणित क्विज सुधार', subject: 'Mathematics', subjectNe: 'गणित', dueDate: '2025-12-28', xpReward: 30, status: 'graded', grade: 'A', icon: '🧮' },
  { id: '8', title: 'Science Project Presentation', titleNe: 'विज्ञान परियोजना प्रस्तुति', subject: 'Science', subjectNe: 'विज्ञान', dueDate: '2025-12-25', xpReward: 80, status: 'late', icon: '🔬' },
  { id: '9', title: 'Art Portfolio', titleNe: 'कला पोर्टफोलियो', subject: 'Art', subjectNe: 'कला', dueDate: '2025-12-20', xpReward: 60, status: 'graded', grade: 'A+', icon: '🎨' },
];

function getUrgencyColor(dueDate: string, status: string) {
  if (status !== 'pending') return '';
  const daysLeft = differenceInDays(new Date(dueDate), new Date());
  if (daysLeft < 0) return 'border-red-500 bg-red-50 dark:bg-red-900/20';
  if (daysLeft <= 2) return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
  return '';
}

function getStatusBadge(status: string, grade?: string, locale?: string) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <Clock className="h-3 w-3 mr-1" />
          {locale === 'en' ? 'Pending' : 'पेन्डिङ'}
        </Badge>
      );
    case 'submitted':
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          {locale === 'en' ? 'Submitted' : 'जम्मा गरियो'}
        </Badge>
      );
    case 'late':
      return (
        <Badge variant="outline" className="text-red-600 border-red-600">
          <AlertCircle className="h-3 w-3 mr-1" />
          {locale === 'en' ? 'Late' : 'ढिलो'}
        </Badge>
      );
    case 'graded':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <Star className="h-3 w-3 mr-1" />
          {grade}
        </Badge>
      );
    default:
      return null;
  }
}

export default function AssignmentsPage() {
  const { locale } = useLocaleStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const filteredAssignments = useMemo(() => {
    let filtered = [...mockAssignments];

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter((a) => a.status === filter);
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'xp':
          return b.xpReward - a.xpReward;
        default:
          return 0;
      }
    });

    return filtered;
  }, [filter, sortBy]);

  const handleSubmit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  const handleSubmissionMethod = (method: string) => {
    setIsSubmitModalOpen(false);
    toast.success(
      locale === 'en'
        ? `Homework submitted via ${method}! +${selectedAssignment?.xpReward} XP`
        : `${method} मार्फत गृहकार्य जम्मा गरियो! +${selectedAssignment?.xpReward} XP`
    );
  };

  const filterLabels: Record<FilterType, { en: string; ne: string }> = {
    all: { en: 'All', ne: 'सबै' },
    pending: { en: 'Pending', ne: 'पेन्डिङ' },
    submitted: { en: 'Submitted', ne: 'जम्मा गरियो' },
    late: { en: 'Late', ne: 'ढिलो' },
    graded: { en: 'Graded', ne: 'ग्रेड गरियो' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/student">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {locale === 'en' ? 'Assignments' : 'गृहकार्यहरू'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Complete assignments to earn XP'
              : 'XP कमाउन गृहकार्य पूरा गर्नुहोस्'}
          </p>
        </div>
      </div>

      {/* Filter and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
          <TabsList className="flex-wrap h-auto">
            {(Object.keys(filterLabels) as FilterType[]).map((key) => (
              <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
                {locale === 'en' ? filterLabels[key].en : filterLabels[key].ne}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortType)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">{locale === 'en' ? 'Due Date' : 'म्याद'}</SelectItem>
            <SelectItem value="subject">{locale === 'en' ? 'Subject' : 'विषय'}</SelectItem>
            <SelectItem value="xp">{locale === 'en' ? 'XP Reward' : 'XP पुरस्कार'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length > 0 ? (
        <div className="space-y-3">
          {filteredAssignments.map((assignment) => (
            <Card
              key={assignment.id}
              className={cn(
                'transition-all',
                getUrgencyColor(assignment.dueDate, assignment.status)
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{assignment.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {locale === 'en' ? assignment.title : assignment.titleNe}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {locale === 'en' ? assignment.subject : assignment.subjectNe}
                        </p>
                      </div>
                      {getStatusBadge(assignment.status, assignment.grade, locale)}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(assignment.dueDate), 'MMM d')}
                        </span>
                        <Badge variant="outline" className="text-primary border-primary">
                          +{assignment.xpReward} XP
                        </Badge>
                      </div>
                      {assignment.status === 'pending' && (
                        <Button size="sm" onClick={() => handleSubmit(assignment)}>
                          <Upload className="h-4 w-4 mr-2" />
                          {locale === 'en' ? 'Submit' : 'जम्मा गर्नुहोस्'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          type="homework"
          title={locale === 'en' ? 'No assignments found' : 'कुनै गृहकार्य फेला परेन'}
          description={
            locale === 'en'
              ? 'Try changing your filter'
              : 'आफ्नो फिल्टर परिवर्तन गर्ने प्रयास गर्नुहोस्'
          }
        />
      )}

      {/* Submit Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {locale === 'en' ? 'Submit Homework' : 'गृहकार्य जम्मा गर्नुहोस्'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => handleSubmissionMethod('Photo')}
            >
              <Camera className="h-6 w-6" />
              <span>{locale === 'en' ? 'Take Photo' : 'फोटो खिच्नुहोस्'}</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => handleSubmissionMethod('File')}
            >
              <FileText className="h-6 w-6" />
              <span>{locale === 'en' ? 'Upload File' : 'फाइल अपलोड'}</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => handleSubmissionMethod('Audio')}
            >
              <Mic className="h-6 w-6" />
              <span>{locale === 'en' ? 'Record Audio' : 'अडियो रेकर्ड'}</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => handleSubmissionMethod('Video')}
            >
              <Video className="h-6 w-6" />
              <span>{locale === 'en' ? 'Record Video' : 'भिडियो रेकर्ड'}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
