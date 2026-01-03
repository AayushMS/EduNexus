'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLocaleStore } from '@/store/localeStore';
import {
  CheckCircle2,
  Loader2,
  Video,
  Users,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react';

interface PTMBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Teacher {
  id: string;
  name: string;
  nameNe: string;
  subject: string;
  subjectNe: string;
  avatar?: string;
}

const mockTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    name: 'Ram Sharma',
    nameNe: 'राम शर्मा',
    subject: 'Mathematics',
    subjectNe: 'गणित',
  },
  {
    id: 'teacher-2',
    name: 'Sita Thapa',
    nameNe: 'सीता थापा',
    subject: 'Science',
    subjectNe: 'विज्ञान',
  },
  {
    id: 'teacher-3',
    name: 'Hari Prasad',
    nameNe: 'हरि प्रसाद',
    subject: 'English',
    subjectNe: 'अंग्रेजी',
  },
  {
    id: 'teacher-4',
    name: 'Gita Karki',
    nameNe: 'गीता कार्की',
    subject: 'Nepali',
    subjectNe: 'नेपाली',
  },
  {
    id: 'teacher-5',
    name: 'Class Teacher',
    nameNe: 'कक्षा शिक्षक',
    subject: 'General Discussion',
    subjectNe: 'सामान्य छलफल',
  },
];

const timeSlots = [
  { id: '09:00', time: '9:00 AM', timeNe: 'बिहान ९:००' },
  { id: '09:30', time: '9:30 AM', timeNe: 'बिहान ९:३०' },
  { id: '10:00', time: '10:00 AM', timeNe: 'बिहान १०:००' },
  { id: '10:30', time: '10:30 AM', timeNe: 'बिहान १०:३०' },
  { id: '11:00', time: '11:00 AM', timeNe: 'बिहान ११:००' },
  { id: '14:00', time: '2:00 PM', timeNe: 'दिउँसो २:००' },
  { id: '14:30', time: '2:30 PM', timeNe: 'दिउँसो २:३०' },
  { id: '15:00', time: '3:00 PM', timeNe: 'दिउँसो ३:००' },
  { id: '15:30', time: '3:30 PM', timeNe: 'दिउँसो ३:३०' },
];

// Simulate some booked slots
const bookedSlots: Record<string, string[]> = {
  '2026-01-06': ['09:00', '10:30', '14:00'],
  '2026-01-07': ['09:30', '11:00'],
  '2026-01-08': ['14:30', '15:00'],
};

export function PTMBookingModal({ isOpen, onClose }: PTMBookingModalProps) {
  const { locale } = useLocaleStore();
  const [step, setStep] = useState<'teacher' | 'datetime' | 'confirm' | 'success'>('teacher');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [meetingMode, setMeetingMode] = useState<'in-person' | 'virtual'>('in-person');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const teacher = mockTeachers.find((t) => t.id === selectedTeacher);

  const resetForm = () => {
    setStep('teacher');
    setSelectedTeacher('');
    setSelectedDate(undefined);
    setSelectedTime('');
    setMeetingMode('in-person');
    setNotes('');
    setBookingId('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getAvailableSlots = () => {
    if (!selectedDate) return timeSlots;
    const dateKey = selectedDate.toISOString().split('T')[0];
    const booked = bookedSlots[dateKey] || [];
    return timeSlots.filter((slot) => !booked.includes(slot.id));
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const id = `PTM${Date.now().toString().slice(-6)}`;
    setBookingId(id);
    setIsSubmitting(false);
    setStep('success');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'ne-NP', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Disable past dates and weekends
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = date.getDay();
    return date < today || day === 0 || day === 6; // Disable past dates and weekends
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {locale === 'en' ? 'Book PTM Slot' : 'PTM समय बुक गर्नुहोस्'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Teacher */}
          {step === 'teacher' && (
            <motion.div
              key="teacher"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Step indicators */}
              <div className="flex justify-center gap-2 mb-4">
                {['teacher', 'datetime', 'confirm'].map((s, i) => (
                  <div
                    key={s}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      ['teacher', 'datetime', 'confirm'].indexOf(step) >= i
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Label>{locale === 'en' ? 'Select Teacher' : 'शिक्षक छान्नुहोस्'}</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      locale === 'en' ? 'Choose a teacher' : 'शिक्षक छान्नुहोस्'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {mockTeachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-2">
                        <span>{locale === 'en' ? t.name : t.nameNe}</span>
                        <span className="text-muted-foreground text-sm">
                          ({locale === 'en' ? t.subject : t.subjectNe})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep('datetime')} disabled={!selectedTeacher}>
                  {locale === 'en' ? 'Next' : 'अर्को'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 'datetime' && (
            <motion.div
              key="datetime"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Step indicators */}
              <div className="flex justify-center gap-2 mb-4">
                {['teacher', 'datetime', 'confirm'].map((s, i) => (
                  <div
                    key={s}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      ['teacher', 'datetime', 'confirm'].indexOf(step) >= i
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Label>{locale === 'en' ? 'Select Date' : 'मिति छान्नुहोस्'}</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={disabledDays}
                  className="rounded-md border"
                />
              </div>

              {selectedDate && (
                <div className="space-y-2">
                  <Label>{locale === 'en' ? 'Available Time Slots' : 'उपलब्ध समय'}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {getAvailableSlots().map((slot) => (
                      <Button
                        key={slot.id}
                        type="button"
                        variant={selectedTime === slot.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTime(slot.id)}
                      >
                        {locale === 'en' ? slot.time : slot.timeNe}
                      </Button>
                    ))}
                  </div>
                  {getAvailableSlots().length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {locale === 'en'
                        ? 'No slots available on this date'
                        : 'यो मितिमा कुनै समय उपलब्ध छैन'}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep('teacher')}>
                  {locale === 'en' ? 'Back' : 'पछाडि'}
                </Button>
                <Button
                  onClick={() => setStep('confirm')}
                  disabled={!selectedDate || !selectedTime}
                >
                  {locale === 'en' ? 'Next' : 'अर्को'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Step indicators */}
              <div className="flex justify-center gap-2 mb-4">
                {['teacher', 'datetime', 'confirm'].map((s, i) => (
                  <div
                    key={s}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      ['teacher', 'datetime', 'confirm'].indexOf(step) >= i
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Teacher:' : 'शिक्षक:'}
                  </span>
                  <span className="font-medium">
                    {teacher && (locale === 'en' ? teacher.name : teacher.nameNe)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Date:' : 'मिति:'}
                  </span>
                  <span className="font-medium">
                    {selectedDate && formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Time:' : 'समय:'}
                  </span>
                  <span className="font-medium">
                    {timeSlots.find((s) => s.id === selectedTime)?.[
                      locale === 'en' ? 'time' : 'timeNe'
                    ]}
                  </span>
                </div>
              </div>

              {/* Meeting Mode */}
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Meeting Mode' : 'भेटघाटको मोड'}</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={meetingMode === 'in-person' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setMeetingMode('in-person')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'In-Person' : 'प्रत्यक्ष'}
                  </Button>
                  <Button
                    type="button"
                    variant={meetingMode === 'virtual' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setMeetingMode('virtual')}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Virtual' : 'भर्चुअल'}
                  </Button>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>
                  {locale === 'en' ? 'Notes (Optional)' : 'टिप्पणी (ऐच्छिक)'}
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    locale === 'en'
                      ? 'Any specific topics you want to discuss...'
                      : 'छलफल गर्न चाहेका विषयहरू...'
                  }
                  rows={3}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep('datetime')}>
                  {locale === 'en' ? 'Back' : 'पछाडि'}
                </Button>
                <Button onClick={handleConfirmBooking} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {locale === 'en' ? 'Booking...' : 'बुक गर्दै...'}
                    </>
                  ) : locale === 'en' ? (
                    'Confirm Booking'
                  ) : (
                    'बुकिङ पुष्टि गर्नुहोस्'
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              >
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === 'en' ? 'PTM Slot Booked!' : 'PTM समय बुक भयो!'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {locale === 'en'
                  ? 'Your meeting has been scheduled successfully.'
                  : 'तपाईंको भेटघाट सफलतापूर्वक तय गरियो।'}
              </p>

              {/* Booking Details */}
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2 mb-6 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Booking ID' : 'बुकिङ आईडी'}
                  </span>
                  <span className="font-mono font-semibold">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Teacher' : 'शिक्षक'}
                  </span>
                  <span className="font-semibold">
                    {teacher && (locale === 'en' ? teacher.name : teacher.nameNe)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Date & Time' : 'मिति र समय'}
                  </span>
                  <span className="font-semibold">
                    {selectedDate?.toLocaleDateString(locale === 'en' ? 'en-US' : 'ne-NP', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    @{' '}
                    {timeSlots.find((s) => s.id === selectedTime)?.[
                      locale === 'en' ? 'time' : 'timeNe'
                    ]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Mode' : 'मोड'}
                  </span>
                  <Badge variant={meetingMode === 'virtual' ? 'secondary' : 'default'}>
                    {meetingMode === 'in-person'
                      ? locale === 'en'
                        ? 'In-Person'
                        : 'प्रत्यक्ष'
                      : locale === 'en'
                      ? 'Virtual'
                      : 'भर्चुअल'}
                  </Badge>
                </div>
              </div>

              <Button onClick={handleClose}>
                {locale === 'en' ? 'Done' : 'सम्पन्न'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
