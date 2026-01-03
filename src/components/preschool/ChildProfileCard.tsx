'use client';

import { motion } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Camera,
  Eye,
  TrendingUp,
  Heart,
  Users,
} from 'lucide-react';
import { DEVELOPMENT_DOMAINS, PRESCHOOL_CLASSES, type DevelopmentDomain, type PreschoolClassName } from '@/types/preschool.types';

interface ChildProfileCardProps {
  child: {
    id: string;
    name: string;
    nameNe: string;
    age: number; // in months
    gender: 'male' | 'female';
    avatarUrl?: string;
    className: PreschoolClassName;
    developmentScores: {
      physical: number;
      cognitive: number;
      social: number;
      emotional: number;
      language: number;
      overall: number;
    };
    activitiesCount: number;
    observationsCount: number;
    lastActivityDate?: string;
  };
  onViewProfile?: () => void;
  onLogActivity?: () => void;
}

export function ChildProfileCard({ child, onViewProfile, onLogActivity }: ChildProfileCardProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  const getAgeText = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (locale === 'en') {
      if (years > 0 && remainingMonths > 0) {
        return `${years}y ${remainingMonths}m`;
      } else if (years > 0) {
        return `${years} years`;
      }
      return `${remainingMonths} months`;
    } else {
      if (years > 0 && remainingMonths > 0) {
        return `${formatNumber(years)} वर्ष ${formatNumber(remainingMonths)} महिना`;
      } else if (years > 0) {
        return `${formatNumber(years)} वर्ष`;
      }
      return `${formatNumber(remainingMonths)} महिना`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 60) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    if (score >= 40) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  const classInfo = PRESCHOOL_CLASSES[child.className];
  const domains: DevelopmentDomain[] = ['physical', 'cognitive', 'social', 'emotional', 'language'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                <AvatarImage src={child.avatarUrl} />
                <AvatarFallback className="bg-purple-500 text-white text-lg">
                  {child.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {locale === 'en' ? child.name : child.nameNe}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {locale === 'en' ? classInfo.en : classInfo.ne}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {getAgeText(child.age)}
                  </span>
                </div>
              </div>
              <Badge className={`${getScoreBadgeColor(child.developmentScores.overall)} border-0`}>
                {formatNumber(child.developmentScores.overall)}%
              </Badge>
            </div>
          </div>

          {/* Development Mini Bars */}
          <div className="px-4 py-3 border-b">
            <p className="text-xs text-muted-foreground mb-2">
              {locale === 'en' ? 'Development Overview' : 'विकास सिंहावलोकन'}
            </p>
            <div className="space-y-1.5">
              {domains.map((domain) => {
                const score = child.developmentScores[domain];
                const domainInfo = DEVELOPMENT_DOMAINS[domain];
                return (
                  <div key={domain} className="flex items-center gap-2">
                    <span className="text-xs w-4">{domainInfo.icon}</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${getScoreColor(score)} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">
                      {formatNumber(score)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-px bg-border">
            <div className="bg-card p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-500">
                <Camera className="h-4 w-4" />
                <span className="text-lg font-bold">{formatNumber(child.activitiesCount)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {locale === 'en' ? 'Activities' : 'गतिविधिहरू'}
              </p>
            </div>
            <div className="bg-card p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-500">
                <Eye className="h-4 w-4" />
                <span className="text-lg font-bold">{formatNumber(child.observationsCount)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {locale === 'en' ? 'Observations' : 'अवलोकनहरू'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onViewProfile}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              {locale === 'en' ? 'Profile' : 'प्रोफाइल'}
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={onLogActivity}
            >
              <Camera className="h-4 w-4 mr-1" />
              {locale === 'en' ? 'Log' : 'लग'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
