'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Camera,
  ChevronRight,
  Activity,
  Brain,
  Heart,
  Users,
  MessageSquare,
  Plus,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Milestone {
  id: string;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  domain: string;
  status: 'achieved' | 'in_progress' | 'not_started';
  achievedDate?: string;
  evidenceCount: number;
}

const domainIcons: Record<string, React.ReactNode> = {
  physical: <Activity className="h-4 w-4" />,
  cognitive: <Brain className="h-4 w-4" />,
  social: <Users className="h-4 w-4" />,
  emotional: <Heart className="h-4 w-4" />,
  language: <MessageSquare className="h-4 w-4" />,
};

const domainColors: Record<string, string> = {
  physical: 'bg-blue-500',
  cognitive: 'bg-purple-500',
  social: 'bg-green-500',
  emotional: 'bg-pink-500',
  language: 'bg-orange-500',
};

const mockMilestones: Milestone[] = [
  { id: '1', title: 'Holds pencil correctly', titleNe: 'पेन्सिल सही तरिकाले समात्छ', description: 'Can hold a pencil using tripod grip', descriptionNe: 'ट्राइपोड ग्रिप प्रयोग गरी पेन्सिल समात्न सक्छ', domain: 'physical', status: 'achieved', achievedDate: '2025-10-15', evidenceCount: 3 },
  { id: '2', title: 'Counts to 20', titleNe: '२० सम्म गन्छ', description: 'Can count objects from 1 to 20', descriptionNe: '१ देखि २० सम्म वस्तुहरू गन्न सक्छ', domain: 'cognitive', status: 'achieved', achievedDate: '2025-11-20', evidenceCount: 2 },
  { id: '3', title: 'Shares toys', titleNe: 'खेलौना साझा गर्छ', description: 'Willingly shares toys with peers', descriptionNe: 'साथीहरूसँग इच्छापूर्वक खेलौना साझा गर्छ', domain: 'social', status: 'in_progress', evidenceCount: 1 },
  { id: '4', title: 'Expresses emotions', titleNe: 'भावना व्यक्त गर्छ', description: 'Can name and express basic emotions', descriptionNe: 'आधारभूत भावनाहरू नाम र व्यक्त गर्न सक्छ', domain: 'emotional', status: 'in_progress', evidenceCount: 0 },
  { id: '5', title: 'Speaks in sentences', titleNe: 'वाक्यमा बोल्छ', description: 'Uses 4-5 word sentences', descriptionNe: '४-५ शब्दको वाक्य प्रयोग गर्छ', domain: 'language', status: 'achieved', achievedDate: '2025-09-10', evidenceCount: 5 },
  { id: '6', title: 'Hops on one foot', titleNe: 'एक खुट्टामा उफ्रन्छ', description: 'Can hop on one foot for 5 seconds', descriptionNe: '५ सेकेन्ड एक खुट्टामा उफ्रन सक्छ', domain: 'physical', status: 'not_started', evidenceCount: 0 },
  { id: '7', title: 'Recognizes patterns', titleNe: 'ढाँचा चिन्छ', description: 'Can identify and continue simple patterns', descriptionNe: 'सरल ढाँचाहरू पहिचान र जारी राख्न सक्छ', domain: 'cognitive', status: 'in_progress', evidenceCount: 2 },
  { id: '8', title: 'Takes turns', titleNe: 'पालो लिन्छ', description: 'Waits for turn during group activities', descriptionNe: 'समूह गतिविधिहरूमा आफ्नो पालोको लागि पर्खन्छ', domain: 'social', status: 'achieved', achievedDate: '2025-12-01', evidenceCount: 4 },
];

const childOptions = [
  { value: 'aarav', label: 'Aarav Sharma', labelNe: 'आरव शर्मा' },
  { value: 'sita', label: 'Sita Thapa', labelNe: 'सीता थापा' },
  { value: 'ram', label: 'Ram Gurung', labelNe: 'राम गुरुङ' },
];

export default function MilestonesPage() {
  const { locale } = useLocaleStore();
  const [selectedChild, setSelectedChild] = useState('aarav');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [milestones, setMilestones] = useState(mockMilestones);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [notes, setNotes] = useState('');

  const filteredMilestones = selectedDomain
    ? milestones.filter((m) => m.domain === selectedDomain)
    : milestones;

  const achievedCount = milestones.filter((m) => m.status === 'achieved').length;
  const inProgressCount = milestones.filter((m) => m.status === 'in_progress').length;
  const totalCount = milestones.length;
  const progressPercent = Math.round((achievedCount / totalCount) * 100);

  const domains = [
    { id: 'physical', name: 'Physical', nameNe: 'शारीरिक' },
    { id: 'cognitive', name: 'Cognitive', nameNe: 'संज्ञानात्मक' },
    { id: 'social', name: 'Social', nameNe: 'सामाजिक' },
    { id: 'emotional', name: 'Emotional', nameNe: 'भावनात्मक' },
    { id: 'language', name: 'Language', nameNe: 'भाषा' },
  ];

  const handleMarkAchieved = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: 'achieved' as const, achievedDate: new Date().toISOString().split('T')[0] }
          : m
      )
    );
    setSelectedMilestone(null);
    toast.success(
      locale === 'en' ? 'Milestone marked as achieved!' : 'माइलस्टोन हासिल भएको चिन्ह लगाइयो!'
    );
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
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
            {locale === 'en' ? 'Milestones' : 'माइलस्टोनहरू'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Track developmental milestones'
              : 'विकासात्मक माइलस्टोनहरू ट्र्याक गर्नुहोस्'}
          </p>
        </div>
      </div>

      {/* Child Selector */}
      <Select value={selectedChild} onValueChange={setSelectedChild}>
        <SelectTrigger className="w-full sm:w-[200px]">
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

      {/* Progress Overview */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Overall Progress' : 'समग्र प्रगति'}
              </p>
              <p className="text-3xl font-bold">{progressPercent}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {achievedCount} / {totalCount} {locale === 'en' ? 'achieved' : 'हासिल'}
              </p>
              <p className="text-sm text-yellow-600">
                {inProgressCount} {locale === 'en' ? 'in progress' : 'प्रगतिमा'}
              </p>
            </div>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </CardContent>
      </Card>

      {/* Domain Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedDomain === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedDomain(null)}
        >
          {locale === 'en' ? 'All' : 'सबै'}
        </Button>
        {domains.map((domain) => (
          <Button
            key={domain.id}
            variant={selectedDomain === domain.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDomain(domain.id)}
            className="gap-1"
          >
            {domainIcons[domain.id]}
            {locale === 'en' ? domain.name : domain.nameNe}
          </Button>
        ))}
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {filteredMilestones.map((milestone) => (
          <Card
            key={milestone.id}
            className={cn(
              'cursor-pointer hover:bg-muted/50 transition-colors',
              milestone.status === 'achieved' && 'border-green-200 bg-green-50/50 dark:bg-green-900/10'
            )}
            onClick={() => setSelectedMilestone(milestone)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {getStatusIcon(milestone.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {locale === 'en' ? milestone.title : milestone.titleNe}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn('text-xs text-white', domainColors[milestone.domain])}
                    >
                      {locale === 'en'
                        ? milestone.domain.charAt(0).toUpperCase() + milestone.domain.slice(1)
                        : domains.find((d) => d.id === milestone.domain)?.nameNe}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {locale === 'en' ? milestone.description : milestone.descriptionNe}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {milestone.achievedDate && (
                      <span>{locale === 'en' ? 'Achieved:' : 'हासिल:'} {milestone.achievedDate}</span>
                    )}
                    {milestone.evidenceCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        {milestone.evidenceCount} {locale === 'en' ? 'evidence' : 'प्रमाण'}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Milestone Detail Dialog */}
      <Dialog open={!!selectedMilestone} onOpenChange={() => setSelectedMilestone(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMilestone && domainIcons[selectedMilestone.domain]}
              {locale === 'en' ? selectedMilestone?.title : selectedMilestone?.titleNe}
            </DialogTitle>
          </DialogHeader>
          {selectedMilestone && (
            <div className="space-y-4 mt-4">
              <p className="text-muted-foreground">
                {locale === 'en' ? selectedMilestone.description : selectedMilestone.descriptionNe}
              </p>

              {/* Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">
                  {locale === 'en' ? 'Status' : 'स्थिति'}
                </span>
                <Badge
                  variant={selectedMilestone.status === 'achieved' ? 'default' : 'secondary'}
                  className={cn(
                    selectedMilestone.status === 'achieved' && 'bg-green-500'
                  )}
                >
                  {selectedMilestone.status === 'achieved'
                    ? locale === 'en' ? 'Achieved' : 'हासिल'
                    : selectedMilestone.status === 'in_progress'
                    ? locale === 'en' ? 'In Progress' : 'प्रगतिमा'
                    : locale === 'en' ? 'Not Started' : 'सुरु भएको छैन'}
                </Badge>
              </div>

              {/* Evidence Count */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  {locale === 'en' ? 'Evidence' : 'प्रमाण'}
                </span>
                <span className="text-sm font-medium">
                  {selectedMilestone.evidenceCount} {locale === 'en' ? 'items' : 'आइटमहरू'}
                </span>
              </div>

              {/* Add Note */}
              {selectedMilestone.status !== 'achieved' && (
                <>
                  <div className="space-y-2">
                    <Label>{locale === 'en' ? 'Add Note' : 'नोट थप्नुहोस्'}</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        locale === 'en'
                          ? 'Add observation notes...'
                          : 'अवलोकन नोटहरू थप्नुहोस्...'
                      }
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => toast.info(locale === 'en' ? 'Add evidence coming soon!' : 'प्रमाण थप्ने छिट्टै आउँदैछ!')}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {locale === 'en' ? 'Add Evidence' : 'प्रमाण थप्नुहोस्'}
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleMarkAchieved(selectedMilestone.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {locale === 'en' ? 'Mark Achieved' : 'हासिल चिन्ह'}
                    </Button>
                  </div>
                </>
              )}

              {selectedMilestone.status === 'achieved' && (
                <div className="text-center py-4">
                  <Star className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                  <p className="font-medium text-green-600">
                    {locale === 'en' ? 'Milestone Achieved!' : 'माइलस्टोन हासिल!'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMilestone.achievedDate}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
