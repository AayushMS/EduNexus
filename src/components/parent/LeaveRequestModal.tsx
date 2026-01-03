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
import { useLocaleStore } from '@/store/localeStore';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  nameNe: string;
}

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: Child[];
  onSubmit?: (data: LeaveRequestData) => void;
}

interface LeaveRequestData {
  childId: string;
  startDate: Date;
  endDate: Date;
  duration: 'half' | 'full';
  reason: string;
  customReason?: string;
}

const leaveReasons = [
  { id: 'sick', icon: '🤒', en: 'Sick', ne: 'बिरामी' },
  { id: 'trip', icon: '✈️', en: 'Family Trip', ne: 'पारिवारिक यात्रा' },
  { id: 'doctor', icon: '🏥', en: 'Doctor Appointment', ne: 'डाक्टरको भेट' },
  { id: 'festival', icon: '🎉', en: 'Festival', ne: 'चाड' },
  { id: 'other', icon: '📝', en: 'Other', ne: 'अन्य' },
];

export function LeaveRequestModal({
  isOpen,
  onClose,
  children,
  onSubmit,
}: LeaveRequestModalProps) {
  const { locale } = useLocaleStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [selectedChild, setSelectedChild] = useState<string>('');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [duration, setDuration] = useState<'half' | 'full'>('full');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');

  const resetForm = () => {
    setStep(1);
    setSelectedChild('');
    setDateRange({ from: undefined, to: undefined });
    setDuration('full');
    setSelectedReason('');
    setCustomReason('');
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedChild || !dateRange.from || !selectedReason) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const data: LeaveRequestData = {
      childId: selectedChild,
      startDate: dateRange.from,
      endDate: dateRange.to || dateRange.from,
      duration,
      reason: selectedReason,
      customReason: selectedReason === 'other' ? customReason : undefined,
    };

    onSubmit?.(data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const canProceedStep1 = selectedChild !== '';
  const canProceedStep2 = dateRange.from !== undefined;
  const canSubmit = selectedReason !== '' && (selectedReason !== 'other' || customReason !== '');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {locale === 'en' ? 'Request Leave' : 'बिदा अनुरोध'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
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
                {locale === 'en' ? 'Leave Request Submitted!' : 'बिदा अनुरोध पेश गरियो!'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {locale === 'en'
                  ? "You'll receive a notification once it's approved."
                  : 'स्वीकृत भएपछि तपाईंले सूचना प्राप्त गर्नुहुनेछ।'}
              </p>
              <Button onClick={handleClose}>
                {locale === 'en' ? 'Done' : 'सम्पन्न'}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step indicators */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      s <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Step 1: Select Child */}
              {step === 1 && (
                <div className="space-y-4">
                  <Label>
                    {locale === 'en' ? 'Select Child' : 'बच्चा छान्नुहोस्'}
                  </Label>
                  <Select value={selectedChild} onValueChange={setSelectedChild}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          locale === 'en' ? 'Choose a child' : 'बच्चा छान्नुहोस्'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {children.map((child) => (
                        <SelectItem key={child.id} value={child.id}>
                          {locale === 'en' ? child.name : child.nameNe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                      {locale === 'en' ? 'Next' : 'अर्को'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Select Dates */}
              {step === 2 && (
                <div className="space-y-4">
                  <Label>
                    {locale === 'en' ? 'Select Dates' : 'मिति छान्नुहोस्'}
                  </Label>
                  <div className="flex justify-center">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) =>
                        setDateRange({ from: range?.from, to: range?.to })
                      }
                      numberOfMonths={1}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{locale === 'en' ? 'Duration' : 'अवधि'}</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={duration === 'half' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => setDuration('half')}
                      >
                        {locale === 'en' ? 'Half Day' : 'आधा दिन'}
                      </Button>
                      <Button
                        type="button"
                        variant={duration === 'full' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => setDuration('full')}
                      >
                        {locale === 'en' ? 'Full Day' : 'पूरा दिन'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      {locale === 'en' ? 'Back' : 'पछाडि'}
                    </Button>
                    <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
                      {locale === 'en' ? 'Next' : 'अर्को'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Select Reason */}
              {step === 3 && (
                <div className="space-y-4">
                  <Label>{locale === 'en' ? 'Reason' : 'कारण'}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {leaveReasons.map((reason) => (
                      <Button
                        key={reason.id}
                        type="button"
                        variant={selectedReason === reason.id ? 'default' : 'outline'}
                        className="flex flex-col items-center gap-1 h-auto py-3"
                        onClick={() => setSelectedReason(reason.id)}
                      >
                        <span className="text-xl">{reason.icon}</span>
                        <span className="text-xs">
                          {locale === 'en' ? reason.en : reason.ne}
                        </span>
                      </Button>
                    ))}
                  </div>

                  {selectedReason === 'other' && (
                    <div className="space-y-2">
                      <Label>
                        {locale === 'en' ? 'Please specify' : 'कृपया निर्दिष्ट गर्नुहोस्'}
                      </Label>
                      <Textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder={
                          locale === 'en'
                            ? 'Enter reason for leave...'
                            : 'बिदाको कारण लेख्नुहोस्...'
                        }
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      {locale === 'en' ? 'Back' : 'पछाडि'}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!canSubmit || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {locale === 'en' ? 'Submitting...' : 'पेश गर्दै...'}
                        </>
                      ) : locale === 'en' ? (
                        'Submit Request'
                      ) : (
                        'अनुरोध पेश गर्नुहोस्'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
