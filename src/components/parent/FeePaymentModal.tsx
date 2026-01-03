'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLocaleStore } from '@/store/localeStore';
import {
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle,
  Wallet,
} from 'lucide-react';

interface Child {
  id: string;
  name: string;
  nameNe: string;
}

interface FeeItem {
  id: string;
  type: string;
  typeNe: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue';
}

interface FeePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: Child[];
}

// Mock fee data
const getMockFees = (childId: string): FeeItem[] => [
  {
    id: `${childId}-tuition`,
    type: 'Monthly Tuition',
    typeNe: 'मासिक शुल्क',
    amount: 5000,
    dueDate: '2026-01-15',
    status: 'pending',
  },
  {
    id: `${childId}-transport`,
    type: 'Transport (Jan)',
    typeNe: 'यातायात (जनवरी)',
    amount: 2000,
    dueDate: '2026-01-10',
    status: 'overdue',
  },
  {
    id: `${childId}-books`,
    type: 'Books & Stationery',
    typeNe: 'किताब र स्टेशनरी',
    amount: 3500,
    dueDate: '2026-01-20',
    status: 'pending',
  },
  {
    id: `${childId}-activity`,
    type: 'Activity Fee',
    typeNe: 'गतिविधि शुल्क',
    amount: 1500,
    dueDate: '2026-01-25',
    status: 'pending',
  },
];

export function FeePaymentModal({
  isOpen,
  onClose,
  children,
}: FeePaymentModalProps) {
  const { locale } = useLocaleStore();
  const [step, setStep] = useState<'select' | 'payment' | 'processing' | 'success'>('select');
  const [selectedChild, setSelectedChild] = useState<string>(children[0]?.id || '');
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [transactionId, setTransactionId] = useState<string>('');

  const fees = getMockFees(selectedChild);
  const selectedFeeItems = fees.filter((f) => selectedFees.includes(f.id));
  const totalAmount = selectedFeeItems.reduce((sum, f) => sum + f.amount, 0);

  const resetForm = () => {
    setStep('select');
    setSelectedChild(children[0]?.id || '');
    setSelectedFees([]);
    setTransactionId('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFeeToggle = (feeId: string) => {
    setSelectedFees((prev) =>
      prev.includes(feeId) ? prev.filter((id) => id !== feeId) : [...prev, feeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFees.length === fees.length) {
      setSelectedFees([]);
    } else {
      setSelectedFees(fees.map((f) => f.id));
    }
  };

  const handlePayWithEsewa = async () => {
    setStep('processing');

    // Simulate eSewa redirect and processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generate mock transaction ID
    const mockTxnId = `ESEWA${Date.now().toString().slice(-8)}`;
    setTransactionId(mockTxnId);
    setStep('success');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-NP' : 'ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'ne-NP', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {locale === 'en' ? 'Fee Payment' : 'शुल्क भुक्तानी'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Select fees */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Child Selector */}
              {children.length > 1 && (
                <div className="space-y-2">
                  <Label>{locale === 'en' ? 'Select Child' : 'बच्चा छान्नुहोस्'}</Label>
                  <Select
                    value={selectedChild}
                    onValueChange={(value) => {
                      setSelectedChild(value);
                      setSelectedFees([]);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {children.map((child) => (
                        <SelectItem key={child.id} value={child.id}>
                          {locale === 'en' ? child.name : child.nameNe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Fee List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{locale === 'en' ? 'Pending Fees' : 'बाँकी शुल्कहरू'}</Label>
                  <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                    {selectedFees.length === fees.length
                      ? locale === 'en'
                        ? 'Deselect All'
                        : 'सबै हटाउनुहोस्'
                      : locale === 'en'
                      ? 'Select All'
                      : 'सबै छान्नुहोस्'}
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {fees.map((fee) => (
                    <div
                      key={fee.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        selectedFees.includes(fee.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleFeeToggle(fee.id)}
                    >
                      <Checkbox
                        checked={selectedFees.includes(fee.id)}
                        onCheckedChange={() => handleFeeToggle(fee.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {locale === 'en' ? fee.type : fee.typeNe}
                          </span>
                          {fee.status === 'overdue' && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {locale === 'en' ? 'Overdue' : 'म्याद सकियो'}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {locale === 'en' ? 'Due:' : 'म्याद:'} {formatDate(fee.dueDate)}
                        </span>
                      </div>
                      <span className="font-semibold">{formatCurrency(fee.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between py-2">
                <span className="font-semibold">
                  {locale === 'en' ? 'Total Amount' : 'कुल रकम'}
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              {/* Proceed to Payment */}
              <Button
                className="w-full"
                size="lg"
                onClick={() => setStep('payment')}
                disabled={selectedFees.length === 0}
              >
                {locale === 'en' ? 'Proceed to Payment' : 'भुक्तानीमा जानुहोस्'}
              </Button>
            </motion.div>
          )}

          {/* Step 2: Payment method (eSewa) */}
          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Amount Summary */}
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {locale === 'en' ? 'Amount to Pay' : 'भुक्तानी गर्ने रकम'}
                </p>
                <p className="text-3xl font-bold">{formatCurrency(totalAmount)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedFees.length} {locale === 'en' ? 'items selected' : 'वस्तुहरू छानिएको'}
                </p>
              </div>

              {/* eSewa Payment Button */}
              <div className="space-y-3">
                <Label className="text-center block">
                  {locale === 'en' ? 'Payment Method' : 'भुक्तानी विधि'}
                </Label>

                <button
                  onClick={handlePayWithEsewa}
                  className="w-full p-4 rounded-xl border-2 border-[#60BB46] bg-gradient-to-r from-[#60BB46]/10 to-[#60BB46]/5 hover:from-[#60BB46]/20 hover:to-[#60BB46]/10 transition-all flex items-center justify-center gap-3"
                >
                  {/* eSewa Logo (stylized) */}
                  <div className="bg-[#60BB46] text-white px-3 py-1.5 rounded-lg font-bold text-xl">
                    e<span className="text-[#8BC34A]">S</span>ewa
                  </div>
                  <span className="font-semibold text-[#60BB46]">
                    {locale === 'en' ? 'Pay with eSewa' : 'eSewa बाट भुक्तानी गर्नुहोस्'}
                  </span>
                </button>

                {/* eSewa Benefits */}
                <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#60BB46]" />
                    {locale === 'en' ? 'Fast' : 'छिटो'}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#60BB46]" />
                    {locale === 'en' ? 'Secure' : 'सुरक्षित'}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#60BB46]" />
                    {locale === 'en' ? 'Cashback' : 'क्यासब्याक'}
                  </span>
                </div>
              </div>

              <Separator />

              <Button variant="outline" className="w-full" onClick={() => setStep('select')}>
                {locale === 'en' ? 'Back' : 'पछाडि'}
              </Button>
            </motion.div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 text-center space-y-4"
            >
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-[#60BB46]/20 rounded-full animate-ping" />
                <div className="relative flex items-center justify-center w-20 h-20 bg-[#60BB46] rounded-full">
                  <Loader2 className="h-10 w-10 text-white animate-spin" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {locale === 'en' ? 'Redirecting to eSewa...' : 'eSewa मा जाँदैछ...'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === 'en'
                    ? 'Please wait while we process your payment'
                    : 'कृपया भुक्तानी प्रशोधन हुँदा पर्खनुहोस्'}
                </p>
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
              className="py-8 text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              >
                <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              </motion.div>

              <div>
                <h3 className="text-xl font-bold text-green-600">
                  {locale === 'en' ? 'Payment Successful!' : 'भुक्तानी सफल!'}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {locale === 'en'
                    ? 'Your fee payment has been processed.'
                    : 'तपाईंको शुल्क भुक्तानी प्रशोधन गरियो।'}
                </p>
              </div>

              {/* Receipt Details */}
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Transaction ID' : 'लेनदेन आईडी'}
                  </span>
                  <span className="font-mono font-semibold">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Amount Paid' : 'भुक्तानी गरिएको रकम'}
                  </span>
                  <span className="font-semibold">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Payment Method' : 'भुक्तानी विधि'}
                  </span>
                  <span className="font-semibold text-[#60BB46]">eSewa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Date' : 'मिति'}
                  </span>
                  <span className="font-semibold">
                    {new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'ne-NP')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // Simulate download
                    const link = document.createElement('a');
                    link.href = '#';
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Download Receipt' : 'रसिद डाउनलोड'}
                </Button>
                <Button className="flex-1" onClick={handleClose}>
                  {locale === 'en' ? 'Done' : 'सम्पन्न'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
