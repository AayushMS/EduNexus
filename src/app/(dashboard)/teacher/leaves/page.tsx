'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  FileText,
  Thermometer,
  Plane,
  Building2,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface LeaveRequest {
  id: string;
  studentName: string;
  studentNameNe: string;
  parentName: string;
  parentNameNe: string;
  grade: string;
  section: string;
  type: 'sick' | 'travel' | 'family' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  reasonNe: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    studentName: 'Aarav Sharma',
    studentNameNe: 'आरव शर्मा',
    parentName: 'Mr. Sharma',
    parentNameNe: 'श्री शर्मा',
    grade: '7',
    section: 'A',
    type: 'sick',
    startDate: '2026-01-05',
    endDate: '2026-01-06',
    reason: 'Having fever and cold. Doctor advised rest for 2 days.',
    reasonNe: 'ज्वरो र रुघा भएकोले। डाक्टरले २ दिन आराम गर्न सल्लाह दिनुभयो।',
    status: 'pending',
    submittedAt: '2026-01-03T08:30:00',
  },
  {
    id: '2',
    studentName: 'Sita Thapa',
    studentNameNe: 'सीता थापा',
    parentName: 'Mrs. Thapa',
    parentNameNe: 'श्रीमती थापा',
    grade: '7',
    section: 'A',
    type: 'travel',
    startDate: '2026-01-10',
    endDate: '2026-01-15',
    reason: 'Family trip to Pokhara for wedding.',
    reasonNe: 'बिहेको लागि पोखरा पारिवारिक भ्रमण।',
    status: 'pending',
    submittedAt: '2026-01-02T15:45:00',
  },
  {
    id: '3',
    studentName: 'Ram Gurung',
    studentNameNe: 'राम गुरुङ',
    parentName: 'Mr. Gurung',
    parentNameNe: 'श्री गुरुङ',
    grade: '7',
    section: 'B',
    type: 'family',
    startDate: '2026-01-04',
    endDate: '2026-01-04',
    reason: 'Family emergency - need to attend funeral.',
    reasonNe: 'पारिवारिक आपतकालीन - अन्त्येष्टिमा सहभागी हुनुपर्ने।',
    status: 'approved',
    submittedAt: '2026-01-03T06:00:00',
  },
  {
    id: '4',
    studentName: 'Priya Rai',
    studentNameNe: 'प्रिया राई',
    parentName: 'Mrs. Rai',
    parentNameNe: 'श्रीमती राई',
    grade: '8',
    section: 'A',
    type: 'other',
    startDate: '2025-12-28',
    endDate: '2025-12-28',
    reason: 'Participating in district level dance competition.',
    reasonNe: 'जिल्ला स्तरीय नृत्य प्रतियोगितामा भाग लिँदै।',
    status: 'approved',
    submittedAt: '2025-12-25T10:00:00',
  },
  {
    id: '5',
    studentName: 'Kiran Tamang',
    studentNameNe: 'किरण तामाङ',
    parentName: 'Mr. Tamang',
    parentNameNe: 'श्री तामाङ',
    grade: '7',
    section: 'A',
    type: 'sick',
    startDate: '2025-12-20',
    endDate: '2025-12-22',
    reason: 'Chickenpox, needs isolation.',
    reasonNe: 'चिकनपक्स, अलगाव आवश्यक।',
    status: 'approved',
    submittedAt: '2025-12-19T11:30:00',
  },
];

function getLeaveTypeIcon(type: string) {
  switch (type) {
    case 'sick':
      return <Thermometer className="h-4 w-4 text-red-500" />;
    case 'travel':
      return <Plane className="h-4 w-4 text-blue-500" />;
    case 'family':
      return <Building2 className="h-4 w-4 text-purple-500" />;
    default:
      return <MoreHorizontal className="h-4 w-4 text-gray-500" />;
  }
}

function getLeaveTypeLabel(type: string, locale: string) {
  const labels: Record<string, { en: string; ne: string }> = {
    sick: { en: 'Sick Leave', ne: 'बिरामी बिदा' },
    travel: { en: 'Travel', ne: 'यात्रा' },
    family: { en: 'Family', ne: 'पारिवारिक' },
    other: { en: 'Other', ne: 'अन्य' },
  };
  return locale === 'en' ? labels[type]?.en : labels[type]?.ne;
}

export default function LeavesPage() {
  const { locale } = useLocaleStore();
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [leaves, setLeaves] = useState(mockLeaveRequests);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredLeaves = leaves.filter((leave) => {
    if (filter === 'all') return true;
    return leave.status === filter;
  });

  const pendingCount = leaves.filter((l) => l.status === 'pending').length;

  const handleApprove = (id: string) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'approved' as const } : l))
    );
    setSelectedLeave(null);
    toast.success(
      locale === 'en'
        ? 'Leave request approved. Parent notified.'
        : 'बिदा अनुरोध स्वीकृत भयो। अभिभावकलाई सूचित गरियो।'
    );
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) {
      toast.error(
        locale === 'en'
          ? 'Please provide a reason for rejection'
          : 'कृपया अस्वीकारको कारण दिनुहोस्'
      );
      return;
    }

    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'rejected' as const } : l))
    );
    setSelectedLeave(null);
    setRejectReason('');
    toast.success(
      locale === 'en'
        ? 'Leave request rejected. Parent notified.'
        : 'बिदा अनुरोध अस्वीकृत भयो। अभिभावकलाई सूचित गरियो।'
    );
  };

  const getDaysDiff = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
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
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {locale === 'en' ? 'Leave Requests' : 'बिदा अनुरोधहरू'}
            {pendingCount > 0 && (
              <Badge variant="destructive">{pendingCount}</Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Manage student leave requests'
              : 'विद्यार्थी बिदा अनुरोधहरू व्यवस्थापन गर्नुहोस्'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
          <CardContent className="p-3 text-center">
            <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-xl font-bold text-yellow-600">
              {leaves.filter((l) => l.status === 'pending').length}
            </p>
            <p className="text-xs text-yellow-600/70">
              {locale === 'en' ? 'Pending' : 'पेन्डिङ'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-xl font-bold text-green-600">
              {leaves.filter((l) => l.status === 'approved').length}
            </p>
            <p className="text-xs text-green-600/70">
              {locale === 'en' ? 'Approved' : 'स्वीकृत'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200">
          <CardContent className="p-3 text-center">
            <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-xl font-bold text-red-600">
              {leaves.filter((l) => l.status === 'rejected').length}
            </p>
            <p className="text-xs text-red-600/70">
              {locale === 'en' ? 'Rejected' : 'अस्वीकृत'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="w-full">
          <TabsTrigger value="pending" className="flex-1">
            {locale === 'en' ? 'Pending' : 'पेन्डिङ'}
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex-1">
            {locale === 'en' ? 'Approved' : 'स्वीकृत'}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex-1">
            {locale === 'en' ? 'Rejected' : 'अस्वीकृत'}
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1">
            {locale === 'en' ? 'All' : 'सबै'}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Leave Requests List */}
      <div className="space-y-3">
        {filteredLeaves.length > 0 ? (
          filteredLeaves.map((leave) => (
            <Card
              key={leave.id}
              className={cn(
                'cursor-pointer hover:bg-muted/50 transition-colors',
                leave.status === 'pending' && 'border-yellow-400'
              )}
              onClick={() => setSelectedLeave(leave)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {leave.studentName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {locale === 'en' ? leave.studentName : leave.studentNameNe}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          leave.status === 'pending' && 'border-yellow-500 text-yellow-600',
                          leave.status === 'approved' && 'border-green-500 text-green-600',
                          leave.status === 'rejected' && 'border-red-500 text-red-600'
                        )}
                      >
                        {leave.status === 'pending'
                          ? locale === 'en' ? 'Pending' : 'पेन्डिङ'
                          : leave.status === 'approved'
                          ? locale === 'en' ? 'Approved' : 'स्वीकृत'
                          : locale === 'en' ? 'Rejected' : 'अस्वीकृत'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'en' ? 'Grade' : 'कक्षा'} {leave.grade}{leave.section} •{' '}
                      {locale === 'en' ? leave.parentName : leave.parentNameNe}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        {getLeaveTypeIcon(leave.type)}
                        {getLeaveTypeLabel(leave.type, locale)}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d')}
                        ({getDaysDiff(leave.startDate, leave.endDate)} {locale === 'en' ? 'days' : 'दिन'})
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">
              {locale === 'en' ? 'No leave requests' : 'कुनै बिदा अनुरोध छैन'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? 'All caught up!'
                : 'सबै पूरा भयो!'}
            </p>
          </div>
        )}
      </div>

      {/* Leave Detail Dialog */}
      <Dialog open={!!selectedLeave} onOpenChange={() => setSelectedLeave(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {locale === 'en' ? 'Leave Request Details' : 'बिदा अनुरोध विवरण'}
            </DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4 mt-4">
              {/* Student Info */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedLeave.studentName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">
                    {locale === 'en' ? selectedLeave.studentName : selectedLeave.studentNameNe}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Grade' : 'कक्षा'} {selectedLeave.grade}{selectedLeave.section}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Parent:' : 'अभिभावक:'}{' '}
                    {locale === 'en' ? selectedLeave.parentName : selectedLeave.parentNameNe}
                  </p>
                </div>
              </div>

              {/* Leave Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Type' : 'प्रकार'}
                  </span>
                  <span className="flex items-center gap-2">
                    {getLeaveTypeIcon(selectedLeave.type)}
                    {getLeaveTypeLabel(selectedLeave.type, locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Duration' : 'अवधि'}
                  </span>
                  <span>
                    {format(new Date(selectedLeave.startDate), 'MMM d')} - {format(new Date(selectedLeave.endDate), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Days' : 'दिनहरू'}
                  </span>
                  <Badge variant="outline">
                    {getDaysDiff(selectedLeave.startDate, selectedLeave.endDate)} {locale === 'en' ? 'days' : 'दिन'}
                  </Badge>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Reason' : 'कारण'}
                </Label>
                <p className="p-3 rounded-lg bg-muted text-sm">
                  {locale === 'en' ? selectedLeave.reason : selectedLeave.reasonNe}
                </p>
              </div>

              {/* Actions for Pending */}
              {selectedLeave.status === 'pending' && (
                <>
                  {/* Reject Reason Input */}
                  <div className="space-y-2">
                    <Label>
                      {locale === 'en' ? 'Rejection reason (if rejecting)' : 'अस्वीकारको कारण (अस्वीकार गर्दा)'}
                    </Label>
                    <Textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder={
                        locale === 'en'
                          ? 'Provide reason for rejection...'
                          : 'अस्वीकारको कारण दिनुहोस्...'
                      }
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleReject(selectedLeave.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {locale === 'en' ? 'Reject' : 'अस्वीकार'}
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(selectedLeave.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {locale === 'en' ? 'Approve' : 'स्वीकृत'}
                    </Button>
                  </div>
                </>
              )}

              {/* Status Badge for Non-Pending */}
              {selectedLeave.status !== 'pending' && (
                <div className="text-center">
                  <Badge
                    className={cn(
                      'text-lg px-4 py-2',
                      selectedLeave.status === 'approved' && 'bg-green-500',
                      selectedLeave.status === 'rejected' && 'bg-red-500'
                    )}
                  >
                    {selectedLeave.status === 'approved'
                      ? locale === 'en' ? '✓ Approved' : '✓ स्वीकृत'
                      : locale === 'en' ? '✗ Rejected' : '✗ अस्वीकृत'}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
