'use client';

import { useMemo } from 'react';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { DEVELOPMENT_DOMAINS, type DevelopmentDomain } from '@/types/preschool.types';

interface DomainScore {
  domain: DevelopmentDomain;
  score: number;
  previousScore?: number;
}

interface DevelopmentRadarChartProps {
  scores: DomainScore[];
  childName: string;
  childNameNe: string;
  showComparison?: boolean;
  comparisonLabel?: { en: string; ne: string };
}

export function DevelopmentRadarChart({
  scores,
  childName,
  childNameNe,
  showComparison = false,
  comparisonLabel = { en: 'Class Average', ne: 'कक्षा औसत' },
}: DevelopmentRadarChartProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  const chartData = useMemo(() => {
    return scores.map((item) => {
      const domainInfo = DEVELOPMENT_DOMAINS[item.domain];
      return {
        domain: item.domain,
        name: locale === 'en' ? domainInfo.name : domainInfo.nameNe,
        fullMark: 100,
        score: item.score,
        previous: item.previousScore || 0,
        icon: domainInfo.icon,
      };
    });
  }, [scores, locale]);

  const overallScore = useMemo(() => {
    const total = scores.reduce((sum, item) => sum + item.score, 0);
    return Math.round(total / scores.length);
  }, [scores]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { en: 'Excellent', ne: 'उत्कृष्ट' };
    if (score >= 60) return { en: 'Good', ne: 'राम्रो' };
    if (score >= 40) return { en: 'Developing', ne: 'विकासशील' };
    return { en: 'Needs Support', ne: 'सहयोग चाहिन्छ' };
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              {locale === 'en' ? 'Development Profile' : 'विकास प्रोफाइल'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === 'en' ? childName : childNameNe}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {locale === 'en' ? 'Overall' : 'समग्र'}
            </p>
            <p className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {formatNumber(overallScore)}%
            </p>
            <Badge variant="outline" className={getScoreColor(overallScore)}>
              {getScoreLabel(overallScore)[locale]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Radar Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-muted-foreground"
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                tickCount={5}
              />
              <Radar
                name={locale === 'en' ? 'Current' : 'हाल'}
                dataKey="score"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.5}
                strokeWidth={2}
              />
              {showComparison && (
                <Radar
                  name={comparisonLabel[locale]}
                  dataKey="previous"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.2}
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value) => [`${formatNumber(value as number)}%`, '']}
              />
              {showComparison && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Domain Breakdown */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {chartData.map((item) => (
            <div
              key={item.domain}
              className="text-center p-2 rounded-lg bg-secondary/50"
            >
              <span className="text-xl">{item.icon}</span>
              <p className={`text-sm font-bold ${getScoreColor(item.score)}`}>
                {formatNumber(item.score)}
              </p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
