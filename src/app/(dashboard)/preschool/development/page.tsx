'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ArrowLeft,
  TrendingUp,
  Activity,
  Brain,
  Heart,
  Users,
  MessageSquare,
  ChevronRight,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface DevelopmentDomain {
  id: string;
  name: string;
  nameNe: string;
  score: number;
  classAvg: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  subAreas: { name: string; nameNe: string; score: number }[];
}

const mockDomains: DevelopmentDomain[] = [
  {
    id: 'physical',
    name: 'Physical',
    nameNe: 'शारीरिक',
    score: 78,
    classAvg: 72,
    trend: 'up',
    icon: <Activity className="h-5 w-5" />,
    color: '#3B82F6',
    subAreas: [
      { name: 'Gross Motor', nameNe: 'ठूलो मोटर', score: 80 },
      { name: 'Fine Motor', nameNe: 'सानो मोटर', score: 75 },
      { name: 'Coordination', nameNe: 'समन्वय', score: 78 },
    ],
  },
  {
    id: 'cognitive',
    name: 'Cognitive',
    nameNe: 'संज्ञानात्मक',
    score: 82,
    classAvg: 75,
    trend: 'up',
    icon: <Brain className="h-5 w-5" />,
    color: '#8B5CF6',
    subAreas: [
      { name: 'Problem Solving', nameNe: 'समस्या समाधान', score: 85 },
      { name: 'Memory', nameNe: 'स्मृति', score: 80 },
      { name: 'Attention', nameNe: 'ध्यान', score: 82 },
    ],
  },
  {
    id: 'social',
    name: 'Social',
    nameNe: 'सामाजिक',
    score: 75,
    classAvg: 70,
    trend: 'stable',
    icon: <Users className="h-5 w-5" />,
    color: '#22C55E',
    subAreas: [
      { name: 'Sharing', nameNe: 'साझेदारी', score: 72 },
      { name: 'Cooperation', nameNe: 'सहयोग', score: 78 },
      { name: 'Turn Taking', nameNe: 'पालो लिने', score: 75 },
    ],
  },
  {
    id: 'emotional',
    name: 'Emotional',
    nameNe: 'भावनात्मक',
    score: 70,
    classAvg: 68,
    trend: 'up',
    icon: <Heart className="h-5 w-5" />,
    color: '#EC4899',
    subAreas: [
      { name: 'Self-Regulation', nameNe: 'आत्म-नियमन', score: 68 },
      { name: 'Empathy', nameNe: 'समानुभूति', score: 72 },
      { name: 'Expression', nameNe: 'अभिव्यक्ति', score: 70 },
    ],
  },
  {
    id: 'language',
    name: 'Language',
    nameNe: 'भाषा',
    score: 85,
    classAvg: 78,
    trend: 'up',
    icon: <MessageSquare className="h-5 w-5" />,
    color: '#F97316',
    subAreas: [
      { name: 'Vocabulary', nameNe: 'शब्दावली', score: 88 },
      { name: 'Communication', nameNe: 'सञ्चार', score: 82 },
      { name: 'Listening', nameNe: 'सुन्ने', score: 85 },
    ],
  },
];

const childOptions = [
  { value: 'aarav', label: 'Aarav Sharma', labelNe: 'आरव शर्मा' },
  { value: 'sita', label: 'Sita Thapa', labelNe: 'सीता थापा' },
  { value: 'ram', label: 'Ram Gurung', labelNe: 'राम गुरुङ' },
  { value: 'priya', label: 'Priya Rai', labelNe: 'प्रिया राई' },
];

export default function DevelopmentPage() {
  const { locale } = useLocaleStore();
  const [selectedChild, setSelectedChild] = useState('aarav');
  const [selectedDomain, setSelectedDomain] = useState<DevelopmentDomain | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  const radarData = mockDomains.map((d) => ({
    domain: locale === 'en' ? d.name : d.nameNe,
    score: d.score,
    classAvg: d.classAvg,
    fullMark: 100,
  }));

  const overallScore = Math.round(
    mockDomains.reduce((sum, d) => sum + d.score, 0) / mockDomains.length
  );

  if (selectedDomain) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedDomain(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {selectedDomain.icon}
              {locale === 'en' ? selectedDomain.name : selectedDomain.nameNe}
            </h1>
            <p className="text-sm text-muted-foreground">
              {locale === 'en' ? 'Detailed breakdown' : 'विस्तृत विवरण'}
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <Card style={{ borderColor: selectedDomain.color }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">
                {locale === 'en' ? 'Overall Score' : 'समग्र स्कोर'}
              </span>
              <span className="text-3xl font-bold" style={{ color: selectedDomain.color }}>
                {selectedDomain.score}%
              </span>
            </div>
            <Progress value={selectedDomain.score} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {locale === 'en' ? 'Class Average:' : 'कक्षा औसत:'} {selectedDomain.classAvg}%
            </p>
          </CardContent>
        </Card>

        {/* Sub-Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {locale === 'en' ? 'Sub-Areas' : 'उप-क्षेत्रहरू'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDomain.subAreas.map((area) => (
              <div key={area.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {locale === 'en' ? area.name : area.nameNe}
                  </span>
                  <span className="text-sm font-medium">{area.score}%</span>
                </div>
                <Progress value={area.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activities Link */}
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">
                {locale === 'en' ? 'View Supporting Activities' : 'सहयोगी गतिविधिहरू हेर्नुहोस्'}
              </p>
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? '12 activities logged' : '१२ गतिविधिहरू लग गरिएको'}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

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
            {locale === 'en' ? 'Development Tracking' : 'विकास ट्र्याकिङ'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Monitor developmental progress'
              : 'विकासात्मक प्रगति निगरानी गर्नुहोस्'}
          </p>
        </div>
      </div>

      {/* Child Selector */}
      <div className="flex items-center gap-4">
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="w-[200px]">
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
        <Button
          variant={compareMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCompareMode(!compareMode)}
        >
          {locale === 'en' ? 'Compare to Class' : 'कक्षासँग तुलना'}
        </Button>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Overall Development Score' : 'समग्र विकास स्कोर'}
              </p>
              <p className="text-4xl font-bold text-primary">{overallScore}%</p>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">+5%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Development Radar' : 'विकास रडार'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.5}
                />
                {compareMode && (
                  <Radar
                    name="Class Avg"
                    dataKey="classAvg"
                    stroke="#9CA3AF"
                    fill="#9CA3AF"
                    fillOpacity={0.3}
                  />
                )}
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {compareMode && (
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
                <span>{locale === 'en' ? 'Child' : 'बालबालिका'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-400" />
                <span>{locale === 'en' ? 'Class Average' : 'कक्षा औसत'}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Domain Cards */}
      <div className="space-y-3">
        {mockDomains.map((domain) => (
          <Card
            key={domain.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setSelectedDomain(domain)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${domain.color}20`, color: domain.color }}
                >
                  {domain.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {locale === 'en' ? domain.name : domain.nameNe}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: domain.color }}>
                        {domain.score}%
                      </span>
                      {domain.trend === 'up' && (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={domain.score} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {locale === 'en' ? 'Class avg:' : 'कक्षा औसत:'} {domain.classAvg}%
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
