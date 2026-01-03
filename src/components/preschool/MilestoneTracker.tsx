'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2,
  Circle,
  Clock,
  Camera,
  ChevronRight,
  Trophy,
  Target,
} from 'lucide-react';
import { DEVELOPMENT_DOMAINS, type DevelopmentDomain } from '@/types/preschool.types';

interface Milestone {
  id: string;
  domain: DevelopmentDomain;
  subArea: string;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  status: 'not_started' | 'in_progress' | 'achieved';
  achievedDate?: string;
  evidenceCount: number;
}

interface MilestoneTrackerProps {
  childName: string;
  childNameNe: string;
  milestones: Milestone[];
  onMarkMilestone?: (milestoneId: string, status: 'not_started' | 'in_progress' | 'achieved') => void;
  onAddEvidence?: (milestoneId: string) => void;
}

export function MilestoneTracker({
  childName,
  childNameNe,
  milestones,
  onMarkMilestone,
  onAddEvidence,
}: MilestoneTrackerProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();
  const [selectedDomain, setSelectedDomain] = useState<DevelopmentDomain | 'all'>('all');

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  const domains: DevelopmentDomain[] = ['physical', 'cognitive', 'social', 'emotional', 'language'];

  const filteredMilestones = selectedDomain === 'all'
    ? milestones
    : milestones.filter((m) => m.domain === selectedDomain);

  const stats = {
    total: milestones.length,
    achieved: milestones.filter((m) => m.status === 'achieved').length,
    inProgress: milestones.filter((m) => m.status === 'in_progress').length,
    notStarted: milestones.filter((m) => m.status === 'not_started').length,
  };

  const completionPercent = Math.round((stats.achieved / stats.total) * 100) || 0;

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'achieved':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
            {locale === 'en' ? 'Achieved' : 'प्राप्त'}
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
            {locale === 'en' ? 'In Progress' : 'प्रगतिमा'}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            {locale === 'en' ? 'Not Started' : 'सुरु भएको छैन'}
          </Badge>
        );
    }
  };

  const cycleStatus = (currentStatus: Milestone['status']): Milestone['status'] => {
    switch (currentStatus) {
      case 'not_started':
        return 'in_progress';
      case 'in_progress':
        return 'achieved';
      default:
        return 'not_started';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {locale === 'en' ? 'Milestone Tracker' : 'माइलस्टोन ट्र्याकर'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === 'en' ? childName : childNameNe}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold text-amber-500">
                {formatNumber(stats.achieved)}/{formatNumber(stats.total)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Milestones achieved' : 'माइलस्टोनहरू प्राप्त'}
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {locale === 'en' ? 'Overall Progress' : 'समग्र प्रगति'}
            </span>
            <span className="font-medium">{formatNumber(completionPercent)}%</span>
          </div>
          <Progress value={completionPercent} className="h-2" />
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              {locale === 'en' ? 'Achieved' : 'प्राप्त'}: {formatNumber(stats.achieved)}
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              {locale === 'en' ? 'In Progress' : 'प्रगतिमा'}: {formatNumber(stats.inProgress)}
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-muted-foreground" />
              {locale === 'en' ? 'Not Started' : 'सुरु भएको छैन'}: {formatNumber(stats.notStarted)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Domain Filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          <Button
            variant={selectedDomain === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDomain('all')}
            className="shrink-0"
          >
            {locale === 'en' ? 'All' : 'सबै'}
          </Button>
          {domains.map((domain) => {
            const domainInfo = DEVELOPMENT_DOMAINS[domain];
            const domainMilestones = milestones.filter((m) => m.domain === domain);
            const achievedCount = domainMilestones.filter((m) => m.status === 'achieved').length;
            return (
              <Button
                key={domain}
                variant={selectedDomain === domain ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDomain(domain)}
                className="shrink-0"
              >
                <span className="mr-1">{domainInfo.icon}</span>
                {formatNumber(achievedCount)}/{formatNumber(domainMilestones.length)}
              </Button>
            );
          })}
        </div>

        {/* Milestone List */}
        <div className="space-y-2 mt-4 max-h-[400px] overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredMilestones.map((milestone, index) => {
              const domainInfo = DEVELOPMENT_DOMAINS[milestone.domain];
              return (
                <motion.div
                  key={milestone.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    p-3 rounded-lg border transition-all
                    ${milestone.status === 'achieved'
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800'
                      : milestone.status === 'in_progress'
                      ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800'
                      : 'bg-card border-border hover:bg-secondary/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Toggle */}
                    <button
                      onClick={() => onMarkMilestone?.(milestone.id, cycleStatus(milestone.status))}
                      className="mt-0.5 hover:scale-110 transition-transform"
                    >
                      {getStatusIcon(milestone.status)}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-sm">
                            {locale === 'en' ? milestone.title : milestone.titleNe}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {locale === 'en' ? milestone.description : milestone.descriptionNe}
                          </p>
                        </div>
                        {getStatusBadge(milestone.status)}
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs flex items-center gap-1 text-muted-foreground">
                          <span>{domainInfo.icon}</span>
                          {locale === 'en' ? domainInfo.name : domainInfo.nameNe}
                        </span>
                        {milestone.evidenceCount > 0 && (
                          <span className="text-xs flex items-center gap-1 text-blue-500">
                            <Camera className="h-3 w-3" />
                            {formatNumber(milestone.evidenceCount)} {locale === 'en' ? 'evidence' : 'प्रमाण'}
                          </span>
                        )}
                        {milestone.achievedDate && (
                          <span className="text-xs text-green-600 dark:text-green-400">
                            ✓ {milestone.achievedDate}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add Evidence Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      onClick={() => onAddEvidence?.(milestone.id)}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredMilestones.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{locale === 'en' ? 'No milestones found' : 'कुनै माइलस्टोन फेला परेन'}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
