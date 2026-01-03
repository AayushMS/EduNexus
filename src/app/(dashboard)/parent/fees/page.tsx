'use client';

import { useState, useMemo } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { useMockData } from '@/hooks/useMockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Wallet,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Receipt,
  Calendar,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { FeePaymentModal } from '@/components/parent/FeePaymentModal';

// Mock fee data
interface FeeItem {
  id: string;
  type: string;
  typeNe: string;
  description: string;
  descriptionNe: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  transactionId?: string;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  month: string;
  monthNe: string;
  items: { name: string; nameNe: string; amount: number }[];
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  transactionId?: string;
}

const mockFees: FeeItem[] = [
  {
    id: 'fee-1',
    type: 'Monthly Tuition',
    typeNe: 'मासिक शुल्क',
    description: 'January 2026 Tuition Fee',
    descriptionNe: 'जनवरी २०२६ शुल्क',
    amount: 5000,
    dueDate: '2026-01-15',
    status: 'pending',
  },
  {
    id: 'fee-2',
    type: 'Transport',
    typeNe: 'यातायात',
    description: 'January 2026 Transport Fee',
    descriptionNe: 'जनवरी २०२६ यातायात शुल्क',
    amount: 2000,
    dueDate: '2026-01-10',
    status: 'overdue',
  },
  {
    id: 'fee-3',
    type: 'Activity Fee',
    typeNe: 'गतिविधि शुल्क',
    description: 'Term 2 Activity Fee',
    descriptionNe: 'टर्म २ गतिविधि शुल्क',
    amount: 1500,
    dueDate: '2026-01-20',
    status: 'pending',
  },
  {
    id: 'fee-4',
    type: 'Monthly Tuition',
    typeNe: 'मासिक शुल्क',
    description: 'December 2025 Tuition Fee',
    descriptionNe: 'डिसेम्बर २०२५ शुल्क',
    amount: 5000,
    dueDate: '2025-12-15',
    status: 'paid',
    paidDate: '2025-12-12',
    transactionId: 'ESEWA12345678',
  },
  {
    id: 'fee-5',
    type: 'Transport',
    typeNe: 'यातायात',
    description: 'December 2025 Transport Fee',
    descriptionNe: 'डिसेम्बर २०२५ यातायात शुल्क',
    amount: 2000,
    dueDate: '2025-12-10',
    status: 'paid',
    paidDate: '2025-12-08',
    transactionId: 'ESEWA12345679',
  },
  {
    id: 'fee-6',
    type: 'Books',
    typeNe: 'किताब',
    description: 'Term 2 Books & Stationery',
    descriptionNe: 'टर्म २ किताब र स्टेशनरी',
    amount: 3500,
    dueDate: '2025-12-01',
    status: 'paid',
    paidDate: '2025-11-28',
    transactionId: 'ESEWA12345680',
  },
];

const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNo: 'INV-2026-001',
    month: 'January 2026',
    monthNe: 'जनवरी २०२६',
    items: [
      { name: 'Tuition Fee', nameNe: 'शुल्क', amount: 5000 },
      { name: 'Transport Fee', nameNe: 'यातायात शुल्क', amount: 2000 },
      { name: 'Activity Fee', nameNe: 'गतिविधि शुल्क', amount: 1500 },
    ],
    total: 8500,
    status: 'pending',
    dueDate: '2026-01-15',
  },
  {
    id: 'inv-2',
    invoiceNo: 'INV-2025-012',
    month: 'December 2025',
    monthNe: 'डिसेम्बर २०२५',
    items: [
      { name: 'Tuition Fee', nameNe: 'शुल्क', amount: 5000 },
      { name: 'Transport Fee', nameNe: 'यातायात शुल्क', amount: 2000 },
      { name: 'Books & Stationery', nameNe: 'किताब र स्टेशनरी', amount: 3500 },
    ],
    total: 10500,
    status: 'paid',
    dueDate: '2025-12-15',
    paidDate: '2025-12-12',
    transactionId: 'ESEWA12345678',
  },
  {
    id: 'inv-3',
    invoiceNo: 'INV-2025-011',
    month: 'November 2025',
    monthNe: 'नोभेम्बर २०२५',
    items: [
      { name: 'Tuition Fee', nameNe: 'शुल्क', amount: 5000 },
      { name: 'Transport Fee', nameNe: 'यातायात शुल्क', amount: 2000 },
    ],
    total: 7000,
    status: 'paid',
    dueDate: '2025-11-15',
    paidDate: '2025-11-14',
    transactionId: 'ESEWA12345670',
  },
];

export default function FeesPage() {
  const { locale } = useLocaleStore();
  const { students, parents } = useMockData();
  const [selectedTab, setSelectedTab] = useState('pending');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const pendingFees = mockFees.filter((f) => f.status !== 'paid');
  const paidFees = mockFees.filter((f) => f.status === 'paid');
  const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0);
  const overdueCount = pendingFees.filter((f) => f.status === 'overdue').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-NP' : 'ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {locale === 'en' ? 'Paid' : 'भुक्तान'}
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            {locale === 'en' ? 'Overdue' : 'म्याद सकियो'}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-400">
            <Clock className="h-3 w-3 mr-1" />
            {locale === 'en' ? 'Pending' : 'बाँकी'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleDownloadInvoice = (invoiceNo: string) => {
    toast.success(
      locale === 'en'
        ? `Downloading invoice ${invoiceNo}...`
        : `बीजक ${invoiceNo} डाउनलोड हुँदैछ...`
    );
  };

  const handleDownloadReceipt = (transactionId: string) => {
    toast.success(
      locale === 'en'
        ? 'Downloading receipt...'
        : 'रसिद डाउनलोड हुँदैछ...'
    );
  };

  // Prepare children data for the modal
  const childrenForModal = children.map((c) => ({
    id: c?.id || '',
    name: c?.name || '',
    nameNe: c?.nameNe || '',
  }));

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
              {locale === 'en' ? 'Fees & Billing' : 'शुल्क र बिलिंग'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? 'Manage fee payments and view invoices'
                : 'शुल्क भुक्तानी व्यवस्थापन र बीजक हेर्नुहोस्'}
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
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Pending */}
        <Card className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Total Pending' : 'कुल बाँकी'}
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {formatCurrency(totalPending)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {pendingFees.length} {locale === 'en' ? 'items' : 'वस्तुहरू'}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card className={overdueCount > 0 ? 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-red-200 dark:border-red-800' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Overdue' : 'म्याद सकिएको'}
                </p>
                <p className={`text-3xl font-bold mt-1 ${overdueCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {overdueCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {locale === 'en' ? 'payments' : 'भुक्तानीहरू'}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${overdueCount > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                <AlertCircle className={`h-6 w-6 ${overdueCount > 0 ? 'text-red-600' : 'text-green-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Pay */}
        <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Quick Pay' : 'छिटो भुक्तानी'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {locale === 'en' ? 'Pay all pending fees with' : 'सबै बाँकी शुल्क तिर्नुहोस्'}
                </p>
              </div>
              <Button
                className="mt-4 w-full bg-[#60BB46] hover:bg-[#4fa038] text-white"
                onClick={() => setShowPaymentModal(true)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">e</span>
                  <span>Sewa</span>
                </div>
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="pending">
            {locale === 'en' ? 'Pending' : 'बाँकी'}
            {pendingFees.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {pendingFees.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="paid">{locale === 'en' ? 'Paid' : 'भुक्तान'}</TabsTrigger>
          <TabsTrigger value="invoices">{locale === 'en' ? 'Invoices' : 'बीजकहरू'}</TabsTrigger>
        </TabsList>

        {/* Pending Fees */}
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'en' ? 'Pending Payments' : 'बाँकी भुक्तानीहरू'}
              </CardTitle>
              <CardDescription>
                {locale === 'en'
                  ? 'Fees that need to be paid'
                  : 'भुक्तानी गर्नुपर्ने शुल्कहरू'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingFees.length > 0 ? (
                <div className="space-y-4">
                  {pendingFees.map((fee) => (
                    <div
                      key={fee.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          fee.status === 'overdue'
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : 'bg-yellow-100 dark:bg-yellow-900/30'
                        }`}>
                          <Receipt className={`h-5 w-5 ${
                            fee.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">
                            {locale === 'en' ? fee.type : fee.typeNe}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'en' ? fee.description : fee.descriptionNe}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {locale === 'en' ? 'Due:' : 'म्याद:'} {format(new Date(fee.dueDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(fee.amount)}</p>
                          {getStatusBadge(fee.status)}
                        </div>
                        <Button size="sm" onClick={() => setShowPaymentModal(true)}>
                          {locale === 'en' ? 'Pay' : 'भुक्तानी'}
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex items-center justify-between pt-4">
                    <span className="font-semibold">
                      {locale === 'en' ? 'Total Pending' : 'कुल बाँकी'}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(totalPending)}
                    </span>
                  </div>

                  <Button
                    className="w-full bg-[#60BB46] hover:bg-[#4fa038]"
                    size="lg"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {locale === 'en' ? 'Pay All with eSewa' : 'eSewa बाट सबै भुक्तानी गर्नुहोस्'}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">
                    {locale === 'en' ? 'All fees paid!' : 'सबै शुल्क भुक्तान भयो!'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {locale === 'en'
                      ? 'You have no pending payments'
                      : 'तपाईंसँग कुनै बाँकी भुक्तानी छैन'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paid Fees */}
        <TabsContent value="paid" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'en' ? 'Payment History' : 'भुक्तानी इतिहास'}
              </CardTitle>
              <CardDescription>
                {locale === 'en'
                  ? 'Your completed payments'
                  : 'तपाईंका पूरा भएका भुक्तानीहरू'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paidFees.map((fee) => (
                  <div
                    key={fee.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {locale === 'en' ? fee.type : fee.typeNe}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {locale === 'en' ? fee.description : fee.descriptionNe}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>
                            {locale === 'en' ? 'Paid:' : 'भुक्तान:'} {fee.paidDate && format(new Date(fee.paidDate), 'MMM d, yyyy')}
                          </span>
                          <span className="font-mono">{fee.transactionId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(fee.amount)}</p>
                        {getStatusBadge(fee.status)}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReceipt(fee.transactionId || '')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices */}
        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'en' ? 'Monthly Invoices' : 'मासिक बीजकहरू'}
              </CardTitle>
              <CardDescription>
                {locale === 'en'
                  ? 'Download and view your invoices'
                  : 'तपाईंका बीजकहरू डाउनलोड र हेर्नुहोस्'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{invoice.invoiceNo}</p>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'en' ? invoice.month : invoice.monthNe}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(invoice.total)}</p>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadInvoice(invoice.invoiceNo)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {locale === 'en' ? 'PDF' : 'PDF'}
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      {invoice.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {locale === 'en' ? item.name : item.nameNe}
                          </span>
                          <span>{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>{locale === 'en' ? 'Total' : 'कुल'}</span>
                        <span>{formatCurrency(invoice.total)}</span>
                      </div>
                      {invoice.status === 'paid' && invoice.transactionId && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>
                            {locale === 'en' ? 'Paid on' : 'भुक्तान मिति'} {invoice.paidDate && format(new Date(invoice.paidDate), 'MMM d, yyyy')}
                          </span>
                          <span className="font-mono">• {invoice.transactionId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fee Payment Modal */}
      <FeePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        children={childrenForModal}
      />
    </div>
  );
}
