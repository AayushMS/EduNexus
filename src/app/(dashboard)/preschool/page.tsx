'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  DevelopmentRadarChart,
  ActivityLogger,
  ChildProfileCard,
  MilestoneTracker,
  ReportGenerator,
} from '@/components/preschool';
import {
  Users,
  Camera,
  Eye,
  FileText,
  Target,
  TrendingUp,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { DEVELOPMENT_DOMAINS, PRESCHOOL_CLASSES, type DevelopmentDomain, type PreschoolClassName } from '@/types/preschool.types';

// Demo data
const demoChildren = [
  {
    id: 'child-1',
    name: 'Aarav Sharma',
    nameNe: 'आरव शर्मा',
    age: 42, // months
    gender: 'male' as const,
    className: 'ukg' as PreschoolClassName,
    classNameNe: 'यू.के.जी.',
    developmentScores: { physical: 82, cognitive: 78, social: 85, emotional: 72, language: 88, overall: 81 },
    previousScores: { physical: 75, cognitive: 72, social: 80, emotional: 68, language: 82, overall: 75 },
    activitiesCount: 48,
    observationsCount: 24,
    attendanceRate: 94,
  },
  {
    id: 'child-2',
    name: 'Siya Patel',
    nameNe: 'सिया पटेल',
    age: 38,
    gender: 'female' as const,
    className: 'lkg' as PreschoolClassName,
    classNameNe: 'एल.के.जी.',
    developmentScores: { physical: 75, cognitive: 88, social: 70, emotional: 82, language: 85, overall: 80 },
    previousScores: { physical: 70, cognitive: 82, social: 65, emotional: 78, language: 80, overall: 75 },
    activitiesCount: 42,
    observationsCount: 18,
    attendanceRate: 98,
  },
  {
    id: 'child-3',
    name: 'Rohan Gurung',
    nameNe: 'रोहन गुरुङ',
    age: 48,
    gender: 'male' as const,
    className: 'ukg' as PreschoolClassName,
    classNameNe: 'यू.के.जी.',
    developmentScores: { physical: 90, cognitive: 72, social: 88, emotional: 78, language: 70, overall: 80 },
    previousScores: { physical: 85, cognitive: 68, social: 82, emotional: 72, language: 65, overall: 74 },
    activitiesCount: 52,
    observationsCount: 30,
    attendanceRate: 92,
  },
  {
    id: 'child-4',
    name: 'Ananya Thapa',
    nameNe: 'अनन्या थापा',
    age: 36,
    gender: 'female' as const,
    className: 'lkg' as PreschoolClassName,
    classNameNe: 'एल.के.जी.',
    developmentScores: { physical: 68, cognitive: 75, social: 82, emotional: 88, language: 78, overall: 78 },
    previousScores: { physical: 62, cognitive: 70, social: 78, emotional: 82, language: 72, overall: 73 },
    activitiesCount: 38,
    observationsCount: 20,
    attendanceRate: 96,
  },
  {
    id: 'child-5',
    name: 'Dev Rai',
    nameNe: 'देव राई',
    age: 30,
    gender: 'male' as const,
    className: 'nursery' as PreschoolClassName,
    classNameNe: 'नर्सरी',
    developmentScores: { physical: 72, cognitive: 65, social: 60, emotional: 70, language: 62, overall: 66 },
    previousScores: { physical: 65, cognitive: 58, social: 52, emotional: 62, language: 55, overall: 58 },
    activitiesCount: 28,
    observationsCount: 15,
    attendanceRate: 88,
  },
  {
    id: 'child-6',
    name: 'Priya Tamang',
    nameNe: 'प्रिया तामाङ',
    age: 32,
    gender: 'female' as const,
    className: 'nursery' as PreschoolClassName,
    classNameNe: 'नर्सरी',
    developmentScores: { physical: 78, cognitive: 70, social: 75, emotional: 72, language: 68, overall: 73 },
    previousScores: { physical: 72, cognitive: 65, social: 70, emotional: 68, language: 62, overall: 67 },
    activitiesCount: 32,
    observationsCount: 18,
    attendanceRate: 90,
  },
];

const demoMilestones = [
  { id: 'm1', domain: 'physical' as DevelopmentDomain, subArea: 'gross_motor', title: 'Can hop on one foot', titleNe: 'एउटा खुट्टामा हाम फाल्न सक्छ', description: 'Balances and hops 5+ times', descriptionNe: '५+ पटक सन्तुलन र हाम फाल्छ', status: 'achieved' as const, achievedDate: '2024-01-15', evidenceCount: 3 },
  { id: 'm2', domain: 'physical' as DevelopmentDomain, subArea: 'fine_motor', title: 'Holds pencil correctly', titleNe: 'पेन्सिल सही तरिकाले समात्छ', description: 'Uses tripod grip', descriptionNe: 'ट्राइपड ग्रिप प्रयोग गर्छ', status: 'achieved' as const, achievedDate: '2024-01-10', evidenceCount: 2 },
  { id: 'm3', domain: 'cognitive' as DevelopmentDomain, subArea: 'problem_solving', title: 'Completes 12-piece puzzle', titleNe: '१२ टुक्रा पजल पूरा गर्छ', description: 'Independently completes puzzles', descriptionNe: 'स्वतन्त्र रूपमा पजल पूरा गर्छ', status: 'in_progress' as const, evidenceCount: 1 },
  { id: 'm4', domain: 'cognitive' as DevelopmentDomain, subArea: 'memory', title: 'Counts to 20', titleNe: '२० सम्म गन्छ', description: 'Can count objects to 20', descriptionNe: '२० सम्म वस्तुहरू गन्न सक्छ', status: 'achieved' as const, achievedDate: '2024-02-01', evidenceCount: 2 },
  { id: 'm5', domain: 'social' as DevelopmentDomain, subArea: 'peer_interaction', title: 'Plays cooperatively', titleNe: 'सहकारी रूपमा खेल्छ', description: 'Engages in group play', descriptionNe: 'समूह खेलमा संलग्न हुन्छ', status: 'achieved' as const, achievedDate: '2024-01-20', evidenceCount: 4 },
  { id: 'm6', domain: 'social' as DevelopmentDomain, subArea: 'sharing', title: 'Shares toys willingly', titleNe: 'स्वेच्छाले खेलौना साझा गर्छ', description: 'Takes turns and shares', descriptionNe: 'पालो लिन्छ र साझा गर्छ', status: 'in_progress' as const, evidenceCount: 2 },
  { id: 'm7', domain: 'emotional' as DevelopmentDomain, subArea: 'self_awareness', title: 'Names own emotions', titleNe: 'आफ्नो भावनाहरूको नाम भन्छ', description: 'Identifies happy, sad, angry', descriptionNe: 'खुशी, दुखी, रिसाएको पहिचान गर्छ', status: 'achieved' as const, achievedDate: '2024-01-25', evidenceCount: 3 },
  { id: 'm8', domain: 'emotional' as DevelopmentDomain, subArea: 'emotion_regulation', title: 'Calms down with help', titleNe: 'मद्दतले शान्त हुन्छ', description: 'Uses calming strategies', descriptionNe: 'शान्त गर्ने रणनीतिहरू प्रयोग गर्छ', status: 'in_progress' as const, evidenceCount: 1 },
  { id: 'm9', domain: 'language' as DevelopmentDomain, subArea: 'vocabulary', title: 'Uses 500+ words', titleNe: '५०० भन्दा बढी शब्दहरू प्रयोग गर्छ', description: 'Expanded vocabulary', descriptionNe: 'विस्तारित शब्दावली', status: 'achieved' as const, achievedDate: '2024-02-05', evidenceCount: 5 },
  { id: 'm10', domain: 'language' as DevelopmentDomain, subArea: 'expression', title: 'Speaks in sentences', titleNe: 'वाक्यमा बोल्छ', description: '4-5 word sentences', descriptionNe: '४-५ शब्दको वाक्य', status: 'achieved' as const, achievedDate: '2024-01-18', evidenceCount: 3 },
  { id: 'm11', domain: 'language' as DevelopmentDomain, subArea: 'early_literacy', title: 'Recognizes letters', titleNe: 'अक्षरहरू चिन्छ', description: 'Identifies most letters', descriptionNe: 'अधिकांश अक्षरहरू पहिचान गर्छ', status: 'in_progress' as const, evidenceCount: 2 },
  { id: 'm12', domain: 'physical' as DevelopmentDomain, subArea: 'self_care', title: 'Dresses independently', titleNe: 'स्वतन्त्र रूपमा लुगा लगाउँछ', description: 'Buttons and zips clothes', descriptionNe: 'बटन र जिप लगाउँछ', status: 'not_started' as const, evidenceCount: 0 },
];

export default function PreschoolDashboard() {
  const { locale, useDevanagariNumerals } = useLocaleStore();
  const [activeTab, setActiveTab] = useState('children');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [showActivityLogger, setShowActivityLogger] = useState(false);

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  const selectedChild = selectedChildId
    ? demoChildren.find((c) => c.id === selectedChildId)
    : null;

  // Calculate class averages
  const classAverage = {
    physical: Math.round(demoChildren.reduce((sum, c) => sum + c.developmentScores.physical, 0) / demoChildren.length),
    cognitive: Math.round(demoChildren.reduce((sum, c) => sum + c.developmentScores.cognitive, 0) / demoChildren.length),
    social: Math.round(demoChildren.reduce((sum, c) => sum + c.developmentScores.social, 0) / demoChildren.length),
    emotional: Math.round(demoChildren.reduce((sum, c) => sum + c.developmentScores.emotional, 0) / demoChildren.length),
    language: Math.round(demoChildren.reduce((sum, c) => sum + c.developmentScores.language, 0) / demoChildren.length),
    overall: Math.round(demoChildren.reduce((sum, c) => sum + c.developmentScores.overall, 0) / demoChildren.length),
  };

  // Quick stats
  const quickStats = [
    {
      icon: <Users className="h-5 w-5" />,
      label: { en: 'Children', ne: 'बालबालिकाहरू' },
      value: formatNumber(demoChildren.length),
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: <Camera className="h-5 w-5" />,
      label: { en: 'Activities Today', ne: 'आज गतिविधिहरू' },
      value: formatNumber(8),
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: <Eye className="h-5 w-5" />,
      label: { en: 'Observations', ne: 'अवलोकनहरू' },
      value: formatNumber(156),
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: { en: 'Milestones Achieved', ne: 'माइलस्टोनहरू प्राप्त' },
      value: formatNumber(42),
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  const handleViewProfile = (childId: string) => {
    setSelectedChildId(childId);
    setActiveTab('progress');
  };

  const handleLogActivity = (childId?: string) => {
    if (childId) {
      setSelectedChildId(childId);
    }
    setShowActivityLogger(true);
  };

  const handleActivitySubmit = (activity: unknown) => {
    console.log('Activity logged:', activity);
    setShowActivityLogger(false);
    toast.success(
      locale === 'en'
        ? 'Activity logged successfully!'
        : 'गतिविधि सफलतापूर्वक लग गरियो!'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {locale === 'en' ? 'Pre-school Dashboard' : 'पूर्व-विद्यालय ड्यासबोर्ड'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {locale === 'en'
              ? 'Track development milestones and log activities.'
              : 'विकास माइलस्टोनहरू ट्र्याक गर्नुहोस् र गतिविधिहरू लग गर्नुहोस्।'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleLogActivity()}>
            <Camera className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Log Activity' : 'गतिविधि लग गर्नुहोस्'}
          </Button>
          <ReportGenerator
            children={demoChildren}
            onGenerate={(config) => {
              console.log('Generating reports:', config);
              toast.success(
                locale === 'en'
                  ? 'Reports generated successfully!'
                  : 'रिपोर्टहरू सफलतापूर्वक उत्पन्न भयो!'
              );
            }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label.en}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label[locale]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Development Areas Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {locale === 'en' ? 'Class Development Overview' : 'कक्षा विकास सिंहावलोकन'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {(['physical', 'cognitive', 'social', 'emotional', 'language'] as DevelopmentDomain[]).map((domain) => {
              const domainInfo = DEVELOPMENT_DOMAINS[domain];
              const score = classAverage[domain];
              return (
                <div key={domain} className="text-center">
                  <div
                    className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2"
                    style={{ backgroundColor: `${domainInfo.color}20` }}
                  >
                    {domainInfo.icon}
                  </div>
                  <p className="font-bold text-lg" style={{ color: domainInfo.color }}>
                    {formatNumber(score)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'en' ? domainInfo.name.split(' ')[0] : domainInfo.nameNe.split(' ')[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="children">
            <Users className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Children' : 'बालबालिकाहरू'}
          </TabsTrigger>
          <TabsTrigger value="progress">
            <TrendingUp className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Progress' : 'प्रगति'}
          </TabsTrigger>
          <TabsTrigger value="milestones">
            <Target className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Milestones' : 'माइलस्टोनहरू'}
          </TabsTrigger>
        </TabsList>

        {/* Children Grid */}
        <TabsContent value="children" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demoChildren.map((child) => (
              <ChildProfileCard
                key={child.id}
                child={child}
                onViewProfile={() => handleViewProfile(child.id)}
                onLogActivity={() => handleLogActivity(child.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Progress View with Radar Chart */}
        <TabsContent value="progress" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Child Selector */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {demoChildren.map((child) => (
                  <Button
                    key={child.id}
                    variant={selectedChildId === child.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedChildId(child.id)}
                  >
                    {locale === 'en' ? child.name.split(' ')[0] : child.nameNe.split(' ')[0]}
                  </Button>
                ))}
              </div>

              {selectedChild && (
                <DevelopmentRadarChart
                  scores={[
                    { domain: 'physical', score: selectedChild.developmentScores.physical, previousScore: selectedChild.previousScores?.physical },
                    { domain: 'cognitive', score: selectedChild.developmentScores.cognitive, previousScore: selectedChild.previousScores?.cognitive },
                    { domain: 'social', score: selectedChild.developmentScores.social, previousScore: selectedChild.previousScores?.social },
                    { domain: 'emotional', score: selectedChild.developmentScores.emotional, previousScore: selectedChild.previousScores?.emotional },
                    { domain: 'language', score: selectedChild.developmentScores.language, previousScore: selectedChild.previousScores?.language },
                  ]}
                  childName={selectedChild.name}
                  childNameNe={selectedChild.nameNe}
                  showComparison={true}
                  comparisonLabel={{ en: 'Previous Term', ne: 'अघिल्लो सत्र' }}
                />
              )}

              {!selectedChild && (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>
                      {locale === 'en'
                        ? 'Select a child to view their development profile'
                        : 'उनीहरूको विकास प्रोफाइल हेर्न बालबालिका छान्नुहोस्'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Class Average Comparison */}
            <DevelopmentRadarChart
              scores={[
                { domain: 'physical', score: classAverage.physical },
                { domain: 'cognitive', score: classAverage.cognitive },
                { domain: 'social', score: classAverage.social },
                { domain: 'emotional', score: classAverage.emotional },
                { domain: 'language', score: classAverage.language },
              ]}
              childName="Class Average"
              childNameNe="कक्षा औसत"
            />
          </div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Child Selector for Milestones */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {demoChildren.map((child) => (
                  <Button
                    key={child.id}
                    variant={selectedChildId === child.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedChildId(child.id)}
                  >
                    {locale === 'en' ? child.name.split(' ')[0] : child.nameNe.split(' ')[0]}
                  </Button>
                ))}
              </div>

              {selectedChild ? (
                <MilestoneTracker
                  childName={selectedChild.name}
                  childNameNe={selectedChild.nameNe}
                  milestones={demoMilestones}
                  onMarkMilestone={(id, status) => {
                    console.log('Mark milestone:', id, status);
                    toast.success(
                      locale === 'en'
                        ? 'Milestone updated!'
                        : 'माइलस्टोन अपडेट भयो!'
                    );
                  }}
                  onAddEvidence={(id) => {
                    console.log('Add evidence for:', id);
                    toast.info(
                      locale === 'en'
                        ? 'Add evidence modal would open here'
                        : 'प्रमाण थप्ने मोडल यहाँ खुल्नेछ'
                    );
                  }}
                />
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>
                      {locale === 'en'
                        ? 'Select a child to view their milestones'
                        : 'उनीहरूको माइलस्टोनहरू हेर्न बालबालिका छान्नुहोस्'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Milestone Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  {locale === 'en' ? 'Class Milestone Summary' : 'कक्षा माइलस्टोन सारांश'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(['physical', 'cognitive', 'social', 'emotional', 'language'] as DevelopmentDomain[]).map((domain) => {
                    const domainInfo = DEVELOPMENT_DOMAINS[domain];
                    const domainMilestones = demoMilestones.filter((m) => m.domain === domain);
                    const achieved = domainMilestones.filter((m) => m.status === 'achieved').length;
                    const total = domainMilestones.length;
                    const percent = Math.round((achieved / total) * 100) || 0;

                    return (
                      <div key={domain} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span>{domainInfo.icon}</span>
                            {locale === 'en' ? domainInfo.name : domainInfo.nameNe}
                          </span>
                          <span className="text-muted-foreground">
                            {formatNumber(achieved)}/{formatNumber(total)}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: domainInfo.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Activity Logger Modal */}
      <ActivityLogger
        isOpen={showActivityLogger}
        onClose={() => setShowActivityLogger(false)}
        children={demoChildren.map((c) => ({
          id: c.id,
          name: c.name,
          nameNe: c.nameNe,
          avatarUrl: undefined,
        }))}
        onSubmit={handleActivitySubmit}
        preSelectedChildId={selectedChildId || undefined}
      />
    </div>
  );
}
