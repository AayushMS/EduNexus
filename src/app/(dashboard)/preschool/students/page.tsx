'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Search,
  Users,
  ChevronRight,
  Star,
  Activity,
  Camera,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Child {
  id: string;
  name: string;
  nameNe: string;
  age: string;
  class: string;
  classNe: string;
  activitiesLogged: number;
  developmentScore: number;
  photoCount: number;
  lastActive: string;
}

const mockChildren: Child[] = [
  { id: '1', name: 'Aarav Sharma', nameNe: 'आरव शर्मा', age: '4 years', class: 'Butterfly', classNe: 'पुतली', activitiesLogged: 45, developmentScore: 78, photoCount: 32, lastActive: 'Today' },
  { id: '2', name: 'Sita Thapa', nameNe: 'सीता थापा', age: '3 years', class: 'Sunshine', classNe: 'घाम', activitiesLogged: 38, developmentScore: 82, photoCount: 28, lastActive: 'Today' },
  { id: '3', name: 'Ram Gurung', nameNe: 'राम गुरुङ', age: '4 years', class: 'Butterfly', classNe: 'पुतली', activitiesLogged: 42, developmentScore: 75, photoCount: 25, lastActive: 'Yesterday' },
  { id: '4', name: 'Priya Rai', nameNe: 'प्रिया राई', age: '3 years', class: 'Sunshine', classNe: 'घाम', activitiesLogged: 50, developmentScore: 88, photoCount: 40, lastActive: 'Today' },
  { id: '5', name: 'Kiran Tamang', nameNe: 'किरण तामाङ', age: '5 years', class: 'Rainbow', classNe: 'इन्द्रेणी', activitiesLogged: 55, developmentScore: 85, photoCount: 35, lastActive: 'Today' },
  { id: '6', name: 'Maya Shrestha', nameNe: 'माया श्रेष्ठ', age: '4 years', class: 'Butterfly', classNe: 'पुतली', activitiesLogged: 35, developmentScore: 72, photoCount: 22, lastActive: '2 days ago' },
  { id: '7', name: 'Bikash Magar', nameNe: 'बिकास मगर', age: '5 years', class: 'Rainbow', classNe: 'इन्द्रेणी', activitiesLogged: 48, developmentScore: 80, photoCount: 30, lastActive: 'Today' },
  { id: '8', name: 'Anita Limbu', nameNe: 'अनिता लिम्बु', age: '3 years', class: 'Sunshine', classNe: 'घाम', activitiesLogged: 40, developmentScore: 76, photoCount: 26, lastActive: 'Yesterday' },
];

const classOptions = [
  { value: 'all', label: 'All Classes', labelNe: 'सबै कक्षाहरू' },
  { value: 'butterfly', label: 'Butterfly', labelNe: 'पुतली' },
  { value: 'sunshine', label: 'Sunshine', labelNe: 'घाम' },
  { value: 'rainbow', label: 'Rainbow', labelNe: 'इन्द्रेणी' },
];

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export default function StudentsPage() {
  const { locale } = useLocaleStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const filteredChildren = mockChildren.filter((child) => {
    const matchesSearch =
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.nameNe.includes(searchQuery);
    const matchesClass =
      selectedClass === 'all' ||
      child.class.toLowerCase() === selectedClass.toLowerCase();
    return matchesSearch && matchesClass;
  });

  const totalChildren = mockChildren.length;
  const totalActivities = mockChildren.reduce((sum, c) => sum + c.activitiesLogged, 0);
  const avgScore = Math.round(
    mockChildren.reduce((sum, c) => sum + c.developmentScore, 0) / mockChildren.length
  );

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
            {locale === 'en' ? 'Students' : 'विद्यार्थीहरू'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'View and manage pre-school children'
              : 'पूर्व-विद्यालय बालबालिकाहरू हेर्नुहोस्'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-xl font-bold">{totalChildren}</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Children' : 'बालबालिका'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Activity className="h-5 w-5 mx-auto text-blue-500 mb-1" />
            <p className="text-xl font-bold">{totalActivities}</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Activities' : 'गतिविधिहरू'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Star className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
            <p className="text-xl font-bold">{avgScore}%</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Avg Score' : 'औसत स्कोर'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={locale === 'en' ? 'Search children...' : 'बालबालिका खोज्नुहोस्...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {classOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {locale === 'en' ? opt.label : opt.labelNe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Children List */}
      <div className="space-y-3">
        {filteredChildren.map((child) => (
          <Card
            key={child.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {child.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {locale === 'en' ? child.name : child.nameNe}
                    </p>
                    <Badge variant="outline">
                      {locale === 'en' ? child.class : child.classNe}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {child.age} • {locale === 'en' ? 'Last active:' : 'अन्तिम सक्रिय:'} {child.lastActive}
                  </p>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <Progress value={child.developmentScore} className="h-2 flex-1" />
                    <span className={cn('text-sm font-medium', getScoreColor(child.developmentScore))}>
                      {child.developmentScore}%
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {child.activitiesLogged} {locale === 'en' ? 'activities' : 'गतिविधि'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      {child.photoCount} {locale === 'en' ? 'photos' : 'फोटो'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" asChild>
          <Link href="/preschool/activities">
            <Activity className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Log Activity' : 'गतिविधि लग'}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/preschool/reports">
            <FileText className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Generate Report' : 'रिपोर्ट बनाउनुहोस्'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
