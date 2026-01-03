'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  FileText,
  Download,
  Share2,
  Eye,
  Printer,
  Image,
  BarChart3,
  MessageSquare,
  Sparkles,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { DevelopmentRadarChart } from './DevelopmentRadarChart';
import { DEVELOPMENT_DOMAINS, type DevelopmentDomain } from '@/types/preschool.types';

interface ReportChild {
  id: string;
  name: string;
  nameNe: string;
  className: string;
  classNameNe: string;
  avatarUrl?: string;
  developmentScores: {
    physical: number;
    cognitive: number;
    social: number;
    emotional: number;
    language: number;
    overall: number;
  };
  previousScores?: {
    physical: number;
    cognitive: number;
    social: number;
    emotional: number;
    language: number;
    overall: number;
  };
  activitiesCount: number;
  attendanceRate: number;
}

interface ReportGeneratorProps {
  children: ReportChild[];
  onGenerate?: (config: ReportConfig) => void;
}

interface ReportConfig {
  childIds: string[];
  period: 'term1' | 'term2' | 'term3' | 'annual';
  language: 'en' | 'ne' | 'both';
  format: 'pdf' | 'web' | 'both';
  includeRadarChart: boolean;
  includePhotos: boolean;
  includeNarratives: boolean;
  includeAttendance: boolean;
  includeComparison: boolean;
  teacherNote: string;
  teacherNoteNe: string;
}

export function ReportGenerator({ children, onGenerate }: ReportGeneratorProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'config' | 'preview' | 'generating' | 'done'>('config');
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [config, setConfig] = useState<ReportConfig>({
    childIds: [],
    period: 'term1',
    language: 'both',
    format: 'pdf',
    includeRadarChart: true,
    includePhotos: true,
    includeNarratives: true,
    includeAttendance: true,
    includeComparison: true,
    teacherNote: '',
    teacherNoteNe: '',
  });

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  const periods = [
    { value: 'term1', en: 'Term 1', ne: 'पहिलो सत्र' },
    { value: 'term2', en: 'Term 2', ne: 'दोस्रो सत्र' },
    { value: 'term3', en: 'Term 3', ne: 'तेस्रो सत्र' },
    { value: 'annual', en: 'Annual', ne: 'वार्षिक' },
  ];

  const languages = [
    { value: 'en', en: 'English Only', ne: 'अंग्रेजी मात्र' },
    { value: 'ne', en: 'Nepali Only', ne: 'नेपाली मात्र' },
    { value: 'both', en: 'Bilingual', ne: 'द्विभाषी' },
  ];

  const formats = [
    { value: 'pdf', en: 'PDF Download', ne: 'PDF डाउनलोड', icon: Download },
    { value: 'web', en: 'Web View', ne: 'वेब दृश्य', icon: Eye },
    { value: 'both', en: 'Both', ne: 'दुवै', icon: FileText },
  ];

  const handleSelectAll = () => {
    if (selectedChildren.length === children.length) {
      setSelectedChildren([]);
    } else {
      setSelectedChildren(children.map((c) => c.id));
    }
  };

  const handleChildToggle = (childId: string) => {
    setSelectedChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  const handleGenerate = () => {
    setStep('generating');
    // Simulate generation
    setTimeout(() => {
      setStep('done');
      onGenerate?.({
        ...config,
        childIds: selectedChildren,
      });
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('config');
    setSelectedChildren([]);
  };

  const selectedChildrenData = children.filter((c) => selectedChildren.includes(c.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          {locale === 'en' ? 'Generate Reports' : 'रिपोर्टहरू उत्पन्न गर्नुहोस्'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {locale === 'en' ? 'Holistic Progress Report Card' : 'समग्र प्रगति रिपोर्ट कार्ड'}
          </DialogTitle>
          <DialogDescription>
            {locale === 'en'
              ? 'Generate developmental progress reports for children'
              : 'बालबालिकाहरूको लागि विकासात्मक प्रगति रिपोर्टहरू उत्पन्न गर्नुहोस्'}
          </DialogDescription>
        </DialogHeader>

        {step === 'config' && (
          <div className="space-y-6">
            {/* Child Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  {locale === 'en' ? 'Select Children' : 'बालबालिकाहरू छान्नुहोस्'}
                </Label>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedChildren.length === children.length
                    ? (locale === 'en' ? 'Deselect All' : 'सबै हटाउनुहोस्')
                    : (locale === 'en' ? 'Select All' : 'सबै छान्नुहोस्')}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-1">
                {children.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => handleChildToggle(child.id)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedChildren.includes(child.id)
                        ? 'bg-primary/10 border-primary'
                        : 'bg-card border-border hover:bg-secondary/50'
                      }
                    `}
                  >
                    <Checkbox
                      checked={selectedChildren.includes(child.id)}
                      onCheckedChange={() => handleChildToggle(child.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {locale === 'en' ? child.name : child.nameNe}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {locale === 'en' ? child.className : child.classNameNe}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {formatNumber(child.developmentScores.overall)}%
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(selectedChildren.length)} {locale === 'en' ? 'selected' : 'छानिएको'}
              </p>
            </div>

            {/* Report Settings */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Report Period' : 'रिपोर्ट अवधि'}</Label>
                <Select
                  value={config.period}
                  onValueChange={(value) => setConfig({ ...config, period: value as ReportConfig['period'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {locale === 'en' ? period.en : period.ne}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Language' : 'भाषा'}</Label>
                <Select
                  value={config.language}
                  onValueChange={(value) => setConfig({ ...config, language: value as ReportConfig['language'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {locale === 'en' ? lang.en : lang.ne}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Format' : 'ढाँचा'}</Label>
                <Select
                  value={config.format}
                  onValueChange={(value) => setConfig({ ...config, format: value as ReportConfig['format'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {locale === 'en' ? format.en : format.ne}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Include Options */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {locale === 'en' ? 'Report Components' : 'रिपोर्ट कम्पोनेन्टहरू'}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'includeRadarChart', icon: BarChart3, en: 'Radar Chart', ne: 'रडार चार्ट' },
                  { key: 'includePhotos', icon: Image, en: 'Photo Gallery', ne: 'फोटो ग्यालरी' },
                  { key: 'includeNarratives', icon: MessageSquare, en: 'Teacher Notes', ne: 'शिक्षक टिप्पणी' },
                  { key: 'includeAttendance', icon: CheckCircle, en: 'Attendance', ne: 'उपस्थिति' },
                  { key: 'includeComparison', icon: Sparkles, en: 'Progress Comparison', ne: 'प्रगति तुलना' },
                ].map((option) => (
                  <div
                    key={option.key}
                    onClick={() => setConfig({ ...config, [option.key]: !config[option.key as keyof ReportConfig] })}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${config[option.key as keyof ReportConfig]
                        ? 'bg-primary/10 border-primary'
                        : 'bg-card border-border hover:bg-secondary/50'
                      }
                    `}
                  >
                    <Checkbox
                      checked={config[option.key as keyof ReportConfig] as boolean}
                      onCheckedChange={(checked) => setConfig({ ...config, [option.key]: checked })}
                    />
                    <option.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {locale === 'en' ? option.en : option.ne}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher Note */}
            {config.includeNarratives && (
              <div className="space-y-3">
                <Label>{locale === 'en' ? 'Overall Teacher Note' : 'समग्र शिक्षक टिप्पणी'}</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Textarea
                    placeholder={locale === 'en' ? 'Note in English...' : 'अंग्रेजीमा टिप्पणी...'}
                    value={config.teacherNote}
                    onChange={(e) => setConfig({ ...config, teacherNote: e.target.value })}
                    rows={3}
                  />
                  <Textarea
                    placeholder={locale === 'en' ? 'Note in Nepali...' : 'नेपालीमा टिप्पणी...'}
                    value={config.teacherNoteNe}
                    onChange={(e) => setConfig({ ...config, teacherNoteNe: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'preview' && selectedChildrenData.length > 0 && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {locale === 'en' ? 'Report Preview' : 'रिपोर्ट पूर्वावलोकन'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center border-b pb-4 mb-4">
                  <h2 className="text-xl font-bold">EduNexus Pre-school</h2>
                  <p className="text-muted-foreground text-sm">
                    {locale === 'en' ? 'Holistic Progress Report Card' : 'समग्र प्रगति रिपोर्ट कार्ड'}
                  </p>
                  <Badge className="mt-2">
                    {periods.find((p) => p.value === config.period)?.[locale] || config.period}
                  </Badge>
                </div>

                {/* Sample child preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                      {selectedChildrenData[0].name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {locale === 'en' ? selectedChildrenData[0].name : selectedChildrenData[0].nameNe}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {locale === 'en' ? selectedChildrenData[0].className : selectedChildrenData[0].classNameNe}
                      </p>
                    </div>
                  </div>

                  {config.includeRadarChart && (
                    <DevelopmentRadarChart
                      scores={[
                        { domain: 'physical', score: selectedChildrenData[0].developmentScores.physical, previousScore: selectedChildrenData[0].previousScores?.physical },
                        { domain: 'cognitive', score: selectedChildrenData[0].developmentScores.cognitive, previousScore: selectedChildrenData[0].previousScores?.cognitive },
                        { domain: 'social', score: selectedChildrenData[0].developmentScores.social, previousScore: selectedChildrenData[0].previousScores?.social },
                        { domain: 'emotional', score: selectedChildrenData[0].developmentScores.emotional, previousScore: selectedChildrenData[0].previousScores?.emotional },
                        { domain: 'language', score: selectedChildrenData[0].developmentScores.language, previousScore: selectedChildrenData[0].previousScores?.language },
                      ]}
                      childName={selectedChildrenData[0].name}
                      childNameNe={selectedChildrenData[0].nameNe}
                      showComparison={config.includeComparison}
                      comparisonLabel={{ en: 'Previous Term', ne: 'अघिल्लो सत्र' }}
                    />
                  )}
                </div>

                {selectedChildren.length > 1 && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    + {formatNumber(selectedChildren.length - 1)} {locale === 'en' ? 'more reports' : 'थप रिपोर्टहरू'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'generating' && (
          <div className="py-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <Loader2 className="h-12 w-12 text-primary" />
            </motion.div>
            <h3 className="mt-4 font-semibold">
              {locale === 'en' ? 'Generating Reports...' : 'रिपोर्टहरू उत्पन्न गर्दै...'}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {locale === 'en'
                ? `Creating ${formatNumber(selectedChildren.length)} report(s)`
                : `${formatNumber(selectedChildren.length)} रिपोर्ट(हरू) सिर्जना गर्दै`}
            </p>
          </div>
        )}

        {step === 'done' && (
          <div className="py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </motion.div>
            <h3 className="mt-4 font-semibold text-lg">
              {locale === 'en' ? 'Reports Generated!' : 'रिपोर्टहरू उत्पन्न भयो!'}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {locale === 'en'
                ? `${formatNumber(selectedChildren.length)} report(s) are ready`
                : `${formatNumber(selectedChildren.length)} रिपोर्ट(हरू) तयार छ`}
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                {locale === 'en' ? 'View Reports' : 'रिपोर्टहरू हेर्नुहोस्'}
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                {locale === 'en' ? 'Download All' : 'सबै डाउनलोड गर्नुहोस्'}
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                {locale === 'en' ? 'Share with Parents' : 'अभिभावकहरूसँग साझा गर्नुहोस्'}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'config' && (
            <>
              <Button variant="outline" onClick={handleClose}>
                {locale === 'en' ? 'Cancel' : 'रद्द गर्नुहोस्'}
              </Button>
              <Button
                onClick={() => setStep('preview')}
                disabled={selectedChildren.length === 0}
              >
                {locale === 'en' ? 'Preview' : 'पूर्वावलोकन'}
              </Button>
            </>
          )}
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('config')}>
                {locale === 'en' ? 'Back' : 'पछाडि'}
              </Button>
              <Button onClick={handleGenerate}>
                <Sparkles className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Generate Reports' : 'रिपोर्टहरू उत्पन्न गर्नुहोस्'}
              </Button>
            </>
          )}
          {step === 'done' && (
            <Button onClick={handleClose}>
              {locale === 'en' ? 'Done' : 'सम्पन्न'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
