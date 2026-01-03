'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarGenerator, EmptyState } from '@/components/shared';
import {
  ArrowLeft,
  Users,
  Plus,
  MessageCircle,
  Search,
  Globe,
  Lock,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Squad {
  id: string;
  name: string;
  nameNe: string;
  subject: string;
  subjectNe: string;
  memberCount: number;
  onlineCount: number;
  isPrivate: boolean;
  isJoined: boolean;
  members: { name: string; initials: string }[];
}

// Mock squad data
const mockSquads: Squad[] = [
  {
    id: '1',
    name: 'Math Masters',
    nameNe: 'गणित मास्टर्स',
    subject: 'Mathematics',
    subjectNe: 'गणित',
    memberCount: 12,
    onlineCount: 5,
    isPrivate: false,
    isJoined: true,
    members: [
      { name: 'Aarav', initials: 'AA' },
      { name: 'Priya', initials: 'PR' },
      { name: 'Rohan', initials: 'RO' },
    ],
  },
  {
    id: '2',
    name: 'Science Stars',
    nameNe: 'विज्ञान तारा',
    subject: 'Science',
    subjectNe: 'विज्ञान',
    memberCount: 8,
    onlineCount: 3,
    isPrivate: false,
    isJoined: true,
    members: [
      { name: 'Anita', initials: 'AN' },
      { name: 'Bikash', initials: 'BI' },
    ],
  },
  {
    id: '3',
    name: 'English Experts',
    nameNe: 'अंग्रेजी विशेषज्ञ',
    subject: 'English',
    subjectNe: 'अंग्रेजी',
    memberCount: 15,
    onlineCount: 7,
    isPrivate: false,
    isJoined: false,
    members: [
      { name: 'Sita', initials: 'SI' },
      { name: 'Ram', initials: 'RA' },
      { name: 'Maya', initials: 'MA' },
    ],
  },
  {
    id: '4',
    name: 'Code Warriors',
    nameNe: 'कोड योद्धाहरू',
    subject: 'Computer',
    subjectNe: 'कम्प्युटर',
    memberCount: 6,
    onlineCount: 2,
    isPrivate: true,
    isJoined: false,
    members: [
      { name: 'Dev', initials: 'DE' },
      { name: 'Nisha', initials: 'NI' },
    ],
  },
  {
    id: '5',
    name: 'History Buffs',
    nameNe: 'इतिहास प्रेमी',
    subject: 'Social Studies',
    subjectNe: 'सामाजिक अध्ययन',
    memberCount: 10,
    onlineCount: 4,
    isPrivate: false,
    isJoined: false,
    members: [
      { name: 'Sunil', initials: 'SU' },
      { name: 'Gita', initials: 'GI' },
    ],
  },
];

export default function SquadsPage() {
  const { locale } = useLocaleStore();
  const [squads, setSquads] = useState(mockSquads);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSquad, setNewSquad] = useState({
    name: '',
    subject: '',
    description: '',
    isPrivate: false,
  });

  const mySquads = squads.filter((s) => s.isJoined);
  const discoverSquads = squads.filter(
    (s) =>
      !s.isJoined &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleJoinSquad = (squadId: string) => {
    setSquads((prev) =>
      prev.map((s) =>
        s.id === squadId ? { ...s, isJoined: true, memberCount: s.memberCount + 1 } : s
      )
    );
    toast.success(
      locale === 'en' ? 'Joined squad successfully! +25 XP' : 'समूहमा सफलतापूर्वक सामेल भयो! +25 XP'
    );
  };

  const handleLeaveSquad = (squadId: string) => {
    setSquads((prev) =>
      prev.map((s) =>
        s.id === squadId ? { ...s, isJoined: false, memberCount: s.memberCount - 1 } : s
      )
    );
    toast.info(locale === 'en' ? 'Left squad' : 'समूह छोडियो');
  };

  const handleCreateSquad = () => {
    if (!newSquad.name || !newSquad.subject) {
      toast.error(
        locale === 'en' ? 'Please fill all required fields' : 'कृपया सबै आवश्यक फिल्ड भर्नुहोस्'
      );
      return;
    }

    const newSquadData: Squad = {
      id: Date.now().toString(),
      name: newSquad.name,
      nameNe: newSquad.name,
      subject: newSquad.subject,
      subjectNe: newSquad.subject,
      memberCount: 1,
      onlineCount: 1,
      isPrivate: newSquad.isPrivate,
      isJoined: true,
      members: [{ name: 'You', initials: 'YO' }],
    };

    setSquads((prev) => [newSquadData, ...prev]);
    setNewSquad({ name: '', subject: '', description: '', isPrivate: false });
    toast.success(
      locale === 'en' ? 'Squad created! +50 XP' : 'समूह सिर्जना गरियो! +50 XP'
    );
  };

  const handleEnterSquad = (squadName: string) => {
    toast.info(
      locale === 'en'
        ? `Chat for "${squadName}" coming soon!`
        : `"${squadName}" को लागि च्याट छिट्टै आउँदैछ!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/student">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {locale === 'en' ? 'Study Squads' : 'अध्ययन समूहहरू'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Learn together with your classmates'
              : 'आफ्ना साथीहरूसँग मिलेर सिक्नुहोस्'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="my-squads">
        <TabsList className="w-full">
          <TabsTrigger value="my-squads" className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'My Squads' : 'मेरो समूह'}
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Discover' : 'खोज्नुहोस्'}
          </TabsTrigger>
          <TabsTrigger value="create" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Create' : 'बनाउनुहोस्'}
          </TabsTrigger>
        </TabsList>

        {/* My Squads Tab */}
        <TabsContent value="my-squads" className="space-y-4 mt-4">
          {mySquads.length > 0 ? (
            mySquads.map((squad) => (
              <Card key={squad.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {locale === 'en' ? squad.name : squad.nameNe}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {locale === 'en' ? squad.subject : squad.subjectNe}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{squad.memberCount} {locale === 'en' ? 'members' : 'सदस्यहरू'}</span>
                          <span className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            {squad.onlineCount} {locale === 'en' ? 'online' : 'अनलाइन'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {squad.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-2">
                      {squad.members.slice(0, 3).map((member, i) => (
                        <Avatar key={i} className="h-8 w-8 border-2 border-background">
                          <AvatarFallback className="text-xs bg-primary/10">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {squad.memberCount > 3 && (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                          +{squad.memberCount - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeaveSquad(squad.id)}
                      >
                        {locale === 'en' ? 'Leave' : 'छोड्नुहोस्'}
                      </Button>
                      <Button size="sm" onClick={() => handleEnterSquad(squad.name)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {locale === 'en' ? 'Chat' : 'च्याट'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              type="squad"
              title={locale === 'en' ? 'No squads joined' : 'कुनै समूहमा सामेल भएको छैन'}
              description={
                locale === 'en'
                  ? 'Discover and join study squads'
                  : 'अध्ययन समूहहरू खोज्नुहोस् र सामेल हुनुहोस्'
              }
            />
          )}
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={locale === 'en' ? 'Search squads...' : 'समूहहरू खोज्नुहोस्...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {discoverSquads.length > 0 ? (
            discoverSquads.map((squad) => (
              <Card key={squad.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {locale === 'en' ? squad.name : squad.nameNe}
                          </p>
                          {squad.isPrivate ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Globe className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {locale === 'en' ? squad.subject : squad.subjectNe}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {squad.memberCount} {locale === 'en' ? 'members' : 'सदस्यहरू'}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleJoinSquad(squad.id)}
                      disabled={squad.isPrivate}
                    >
                      {squad.isPrivate
                        ? locale === 'en'
                          ? 'Request'
                          : 'अनुरोध'
                        : locale === 'en'
                        ? 'Join'
                        : 'सामेल'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              type="search"
              title={locale === 'en' ? 'No squads found' : 'कुनै समूह फेला परेन'}
              description={
                locale === 'en'
                  ? 'Try a different search term or create your own squad'
                  : 'फरक खोज शब्द प्रयास गर्नुहोस् वा आफ्नै समूह बनाउनुहोस्'
              }
            />
          )}
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {locale === 'en' ? 'Create New Squad' : 'नयाँ समूह बनाउनुहोस्'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Squad Name' : 'समूहको नाम'} *</Label>
                <Input
                  placeholder={locale === 'en' ? 'e.g., Math Masters' : 'जस्तै, गणित मास्टर्स'}
                  value={newSquad.name}
                  onChange={(e) => setNewSquad((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Subject Focus' : 'विषय फोकस'} *</Label>
                <Select
                  value={newSquad.subject}
                  onValueChange={(v) => setNewSquad((prev) => ({ ...prev, subject: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={locale === 'en' ? 'Select subject' : 'विषय छान्नुहोस्'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">{locale === 'en' ? 'Mathematics' : 'गणित'}</SelectItem>
                    <SelectItem value="Science">{locale === 'en' ? 'Science' : 'विज्ञान'}</SelectItem>
                    <SelectItem value="English">{locale === 'en' ? 'English' : 'अंग्रेजी'}</SelectItem>
                    <SelectItem value="Nepali">{locale === 'en' ? 'Nepali' : 'नेपाली'}</SelectItem>
                    <SelectItem value="Social Studies">{locale === 'en' ? 'Social Studies' : 'सामाजिक अध्ययन'}</SelectItem>
                    <SelectItem value="Computer">{locale === 'en' ? 'Computer' : 'कम्प्युटर'}</SelectItem>
                    <SelectItem value="General">{locale === 'en' ? 'General' : 'सामान्य'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Description' : 'विवरण'}</Label>
                <Textarea
                  placeholder={locale === 'en' ? 'What is this squad about?' : 'यो समूह के बारेमा हो?'}
                  value={newSquad.description}
                  onChange={(e) => setNewSquad((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Label>{locale === 'en' ? 'Private Squad' : 'निजी समूह'}</Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewSquad((prev) => ({ ...prev, isPrivate: !prev.isPrivate }))}
                >
                  {newSquad.isPrivate
                    ? locale === 'en'
                      ? 'Private'
                      : 'निजी'
                    : locale === 'en'
                    ? 'Public'
                    : 'सार्वजनिक'}
                </Button>
              </div>
              <Button className="w-full" onClick={handleCreateSquad}>
                <Plus className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Create Squad' : 'समूह बनाउनुहोस्'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
