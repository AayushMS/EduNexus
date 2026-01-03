'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Send,
  Image,
  BarChart3,
  MessageSquare,
  Calendar,
  User,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ReportComponent {
  id: string;
  name: string;
  nameNe: string;
  icon: React.ReactNode;
  included: boolean;
}

const childOptions = [
  { value: 'aarav', label: 'Aarav Sharma', labelNe: 'आरव शर्मा' },
  { value: 'sita', label: 'Sita Thapa', labelNe: 'सीता थापा' },
  { value: 'ram', label: 'Ram Gurung', labelNe: 'राम गुरुङ' },
  { value: 'priya', label: 'Priya Rai', labelNe: 'प्रिया राई' },
  { value: 'all', label: 'All Students', labelNe: 'सबै विद्यार्थी' },
];

const periodOptions = [
  { value: 'term1', label: 'Term 1 (Apr-Aug)', labelNe: 'पहिलो सत्र (वैशाख-भाद्र)' },
  { value: 'term2', label: 'Term 2 (Sep-Dec)', labelNe: 'दोस्रो सत्र (असोज-पुस)' },
  { value: 'term3', label: 'Term 3 (Jan-Mar)', labelNe: 'तेस्रो सत्र (माघ-चैत)' },
  { value: 'year', label: 'Full Year', labelNe: 'पूर्ण वर्ष' },
];

const defaultComponents: ReportComponent[] = [
  { id: 'profile', name: 'Child Profile', nameNe: 'बालबालिका प्रोफाइल', icon: <User className="h-4 w-4" />, included: true },
  { id: 'radar', name: 'Development Radar', nameNe: 'विकास रडार', icon: <BarChart3 className="h-4 w-4" />, included: true },
  { id: 'domains', name: 'Domain Breakdown', nameNe: 'डोमेन विवरण', icon: <FileText className="h-4 w-4" />, included: true },
  { id: 'photos', name: 'Photo Gallery', nameNe: 'फोटो ग्यालेरी', icon: <Image className="h-4 w-4" />, included: true },
  { id: 'narrative', name: "Teacher's Narrative", nameNe: 'शिक्षकको कथा', icon: <MessageSquare className="h-4 w-4" />, included: true },
  { id: 'milestones', name: 'Milestones Achieved', nameNe: 'हासिल माइलस्टोनहरू', icon: <CheckCircle className="h-4 w-4" />, included: true },
];

const recentReports = [
  { id: '1', child: 'Aarav Sharma', period: 'Term 1', date: '2025-08-15', status: 'sent' },
  { id: '2', child: 'Sita Thapa', period: 'Term 1', date: '2025-08-15', status: 'sent' },
  { id: '3', child: 'All Students', period: 'Term 2', date: '2025-12-20', status: 'draft' },
];

export default function ReportsPage() {
  const { locale } = useLocaleStore();
  const [selectedChild, setSelectedChild] = useState('aarav');
  const [selectedPeriod, setSelectedPeriod] = useState('term2');
  const [components, setComponents] = useState(defaultComponents);
  const [narrative, setNarrative] = useState('');
  const [language, setLanguage] = useState<'en' | 'ne' | 'both'>('both');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const toggleComponent = (id: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, included: !c.included } : c))
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
    setShowPreview(true);
    toast.success(
      locale === 'en'
        ? 'Report generated successfully!'
        : 'रिपोर्ट सफलतापूर्वक बनाइयो!'
    );
  };

  const handleDownload = () => {
    toast.success(
      locale === 'en'
        ? 'Report downloaded as PDF'
        : 'रिपोर्ट PDF को रूपमा डाउनलोड गरियो'
    );
  };

  const handleSend = () => {
    toast.success(
      locale === 'en'
        ? 'Report sent to parents!'
        : 'रिपोर्ट अभिभावकलाई पठाइयो!'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/preschool">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {locale === 'en' ? 'Progress Reports' : 'प्रगति रिपोर्टहरू'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Generate holistic progress reports'
              : 'समग्र प्रगति रिपोर्टहरू बनाउनुहोस्'}
          </p>
        </div>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Recent Reports' : 'हालका रिपोर्टहरू'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium">{report.child}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.period} • {report.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={report.status === 'sent' ? 'default' : 'secondary'}
                  >
                    {report.status === 'sent'
                      ? locale === 'en' ? 'Sent' : 'पठाइएको'
                      : locale === 'en' ? 'Draft' : 'ड्राफ्ट'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate New Report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {locale === 'en' ? 'Generate New Report' : 'नयाँ रिपोर्ट बनाउनुहोस्'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Child' : 'बालबालिका'}</Label>
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {childOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {locale === 'en' ? opt.label : opt.labelNe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Period' : 'अवधि'}</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {locale === 'en' ? opt.label : opt.labelNe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Report Components */}
          <div className="space-y-3">
            <Label>{locale === 'en' ? 'Include in Report' : 'रिपोर्टमा समावेश गर्नुहोस्'}</Label>
            <div className="grid grid-cols-2 gap-3">
              {components.map((component) => (
                <div
                  key={component.id}
                  className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleComponent(component.id)}
                >
                  <Checkbox checked={component.included} />
                  <div className="flex items-center gap-2">
                    {component.icon}
                    <span className="text-sm">
                      {locale === 'en' ? component.name : component.nameNe}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Teacher Narrative */}
          <div className="space-y-2">
            <Label>{locale === 'en' ? "Teacher's Narrative" : 'शिक्षकको कथा'}</Label>
            <Textarea
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder={
                locale === 'en'
                  ? 'Write a personalized narrative about the child...'
                  : 'बालबालिकाको बारेमा व्यक्तिगत कथा लेख्नुहोस्...'
              }
              rows={4}
            />
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <Label>{locale === 'en' ? 'Report Language' : 'रिपोर्ट भाषा'}</Label>
            <div className="flex gap-2">
              {[
                { value: 'en', label: 'English', labelNe: 'अंग्रेजी' },
                { value: 'ne', label: 'नेपाली', labelNe: 'नेपाली' },
                { value: 'both', label: 'Both', labelNe: 'दुवै' },
              ].map((opt) => (
                <Button
                  key={opt.value}
                  variant={language === opt.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage(opt.value as typeof language)}
                >
                  {locale === 'en' ? opt.label : opt.labelNe}
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {locale === 'en' ? 'Generating...' : 'बनाउँदै...'}
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Generate Report' : 'रिपोर्ट बनाउनुहोस्'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Actions */}
      {showPreview && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
              <h3 className="font-medium text-lg">
                {locale === 'en' ? 'Report Ready!' : 'रिपोर्ट तयार!'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'en'
                  ? 'Your report has been generated successfully'
                  : 'तपाईंको रिपोर्ट सफलतापूर्वक बनाइएको छ'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowPreview(false)}>
                <Eye className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Preview' : 'पूर्वावलोकन'}
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Download' : 'डाउनलोड'}
              </Button>
              <Button className="flex-1" onClick={handleSend}>
                <Send className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Send' : 'पठाउनुहोस्'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
