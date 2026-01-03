'use client';

import { useState, useRef } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ArrowLeft,
  Camera,
  Video,
  Mic,
  Image,
  X,
  Send,
  Users,
  CheckCircle,
  Sparkles,
  Palette,
  Music,
  BookOpen,
  Bike,
  Utensils,
  Brain,
  Heart,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Child {
  id: string;
  name: string;
  nameNe: string;
}

interface ActivityType {
  id: string;
  name: string;
  nameNe: string;
  icon: React.ReactNode;
  domains: string[];
}

const mockChildren: Child[] = [
  { id: '1', name: 'Aarav Sharma', nameNe: 'आरव शर्मा' },
  { id: '2', name: 'Sita Thapa', nameNe: 'सीता थापा' },
  { id: '3', name: 'Ram Gurung', nameNe: 'राम गुरुङ' },
  { id: '4', name: 'Priya Rai', nameNe: 'प्रिया राई' },
  { id: '5', name: 'Kiran Tamang', nameNe: 'किरण तामाङ' },
  { id: '6', name: 'Maya Shrestha', nameNe: 'माया श्रेष्ठ' },
];

const activityTypes: ActivityType[] = [
  { id: 'art', name: 'Art & Craft', nameNe: 'कला र शिल्प', icon: <Palette className="h-5 w-5" />, domains: ['cognitive', 'physical'] },
  { id: 'music', name: 'Music & Dance', nameNe: 'संगीत र नृत्य', icon: <Music className="h-5 w-5" />, domains: ['physical', 'social'] },
  { id: 'reading', name: 'Story Time', nameNe: 'कथा समय', icon: <BookOpen className="h-5 w-5" />, domains: ['language', 'cognitive'] },
  { id: 'outdoor', name: 'Outdoor Play', nameNe: 'बाहिरी खेल', icon: <Bike className="h-5 w-5" />, domains: ['physical', 'social'] },
  { id: 'snack', name: 'Snack Time', nameNe: 'खाजा समय', icon: <Utensils className="h-5 w-5" />, domains: ['physical', 'social'] },
  { id: 'puzzle', name: 'Puzzles & Games', nameNe: 'पजल र खेलहरू', icon: <Brain className="h-5 w-5" />, domains: ['cognitive', 'physical'] },
  { id: 'sharing', name: 'Circle Time', nameNe: 'वृत्त समय', icon: <Heart className="h-5 w-5" />, domains: ['social', 'emotional'] },
  { id: 'free', name: 'Free Play', nameNe: 'स्वतन्त्र खेल', icon: <Sparkles className="h-5 w-5" />, domains: ['all'] },
];

const domainColors: Record<string, string> = {
  physical: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30',
  cognitive: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30',
  social: 'bg-green-100 text-green-700 dark:bg-green-900/30',
  emotional: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30',
  language: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30',
};

const moodOptions = [
  { emoji: '😊', label: 'Happy', labelNe: 'खुशी' },
  { emoji: '🤩', label: 'Excited', labelNe: 'उत्साहित' },
  { emoji: '😌', label: 'Calm', labelNe: 'शान्त' },
  { emoji: '🤔', label: 'Curious', labelNe: 'जिज्ञासु' },
  { emoji: '😴', label: 'Tired', labelNe: 'थकित' },
];

export default function ActivitiesPage() {
  const { locale } = useLocaleStore();
  const [step, setStep] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<Record<string, string>>({});
  const [isChildSelectorOpen, setIsChildSelectorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 10 - selectedMedia.length);
      setSelectedMedia((prev) => [...prev, ...newFiles]);
    }
  };

  const removeMedia = (index: number) => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleChild = (childId: string) => {
    setSelectedChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  const selectAll = () => {
    setSelectedChildren(mockChildren.map((c) => c.id));
  };

  const setChildMood = (childId: string, mood: string) => {
    setSelectedMoods((prev) => ({ ...prev, [childId]: mood }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(
      locale === 'en'
        ? `Activity logged for ${selectedChildren.length} children!`
        : `${selectedChildren.length} बालबालिकाको लागि गतिविधि लग गरियो!`
    );

    // Reset form
    setStep(1);
    setSelectedActivity(null);
    setSelectedMedia([]);
    setSelectedChildren([]);
    setNotes('');
    setSelectedMoods({});
    setIsSubmitting(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedActivity !== null;
      case 2:
        return selectedMedia.length > 0;
      case 3:
        return selectedChildren.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step > 1 ? setStep(step - 1) : null)}
          asChild={step === 1}
        >
          {step === 1 ? (
            <Link href="/preschool">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          ) : (
            <ArrowLeft className="h-5 w-5" />
          )}
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {locale === 'en' ? 'Log Activity' : 'गतिविधि लग गर्नुहोस्'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en' ? `Step ${step} of 4` : `चरण ${step} / ४`}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              s <= step ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Step 1: Select Activity Type */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-medium">
            {locale === 'en' ? 'What activity did you do?' : 'तपाईंले के गतिविधि गर्नुभयो?'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {activityTypes.map((activity) => (
              <Card
                key={activity.id}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary',
                  selectedActivity?.id === activity.id && 'border-primary bg-primary/5'
                )}
                onClick={() => setSelectedActivity(activity)}
              >
                <CardContent className="p-4 text-center">
                  <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    {activity.icon}
                  </div>
                  <p className="font-medium text-sm">
                    {locale === 'en' ? activity.name : activity.nameNe}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {activity.domains.slice(0, 2).map((domain) => (
                      <Badge
                        key={domain}
                        variant="secondary"
                        className={cn('text-xs', domainColors[domain])}
                      >
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Capture Evidence */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-medium">
            {locale === 'en' ? 'Capture evidence' : 'प्रमाण खिच्नुहोस्'}
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedMedia.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {selectedMedia.map((file, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {selectedMedia.length < 10 && (
                  <Button
                    variant="outline"
                    className="aspect-square flex-col gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="h-6 w-6" />
                    <span className="text-xs">{locale === 'en' ? 'Add' : 'थप्नुहोस्'}</span>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Card
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="p-6 text-center">
                  <Camera className="h-10 w-10 mx-auto text-primary mb-2" />
                  <p className="font-medium">
                    {locale === 'en' ? 'Take Photo' : 'फोटो खिच्नुहोस्'}
                  </p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="p-6 text-center">
                  <Video className="h-10 w-10 mx-auto text-blue-500 mb-2" />
                  <p className="font-medium">
                    {locale === 'en' ? 'Record Video' : 'भिडियो रेकर्ड'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => toast.info(locale === 'en' ? 'Voice note recording coming soon!' : 'भ्वाइस नोट रेकर्डिङ छिट्टै आउँदैछ!')}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <Mic className="h-8 w-8 text-purple-500" />
              <div>
                <p className="font-medium">
                  {locale === 'en' ? 'Voice Note' : 'भ्वाइस नोट'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Record audio observation' : 'अडियो अवलोकन रेकर्ड गर्नुहोस्'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Tag Children */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">
              {locale === 'en' ? 'Tag children' : 'बालबालिका ट्याग गर्नुहोस्'}
            </h2>
            <Button variant="outline" size="sm" onClick={selectAll}>
              {locale === 'en' ? 'Select All' : 'सबै छान्नुहोस्'}
            </Button>
          </div>

          <Badge variant="outline" className="mb-2">
            {selectedChildren.length} {locale === 'en' ? 'selected' : 'छानिएको'}
          </Badge>

          <div className="space-y-2">
            {mockChildren.map((child) => (
              <Card
                key={child.id}
                className={cn(
                  'cursor-pointer transition-all',
                  selectedChildren.includes(child.id) && 'border-primary bg-primary/5'
                )}
                onClick={() => toggleChild(child.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedChildren.includes(child.id)}
                        onCheckedChange={() => toggleChild(child.id)}
                      />
                      <span className="font-medium">
                        {locale === 'en' ? child.name : child.nameNe}
                      </span>
                    </div>
                    {selectedChildren.includes(child.id) && (
                      <div className="flex gap-1">
                        {moodOptions.map((mood) => (
                          <Button
                            key={mood.emoji}
                            variant={selectedMoods[child.id] === mood.emoji ? 'default' : 'ghost'}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setChildMood(child.id, mood.emoji);
                            }}
                          >
                            {mood.emoji}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Add Notes & Submit */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="font-medium">
            {locale === 'en' ? 'Add notes' : 'नोटहरू थप्नुहोस्'}
          </h2>

          {/* Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                {selectedActivity?.icon}
                <span className="font-medium">
                  {locale === 'en' ? selectedActivity?.name : selectedActivity?.nameNe}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedMedia.length} {locale === 'en' ? 'media files' : 'मिडिया फाइलहरू'} •{' '}
                {selectedChildren.length} {locale === 'en' ? 'children tagged' : 'बालबालिका ट्याग'}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label>{locale === 'en' ? 'Observation Notes' : 'अवलोकन नोटहरू'}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                locale === 'en'
                  ? 'Add any observations about the activity...'
                  : 'गतिविधिको बारेमा कुनै अवलोकन थप्नुहोस्...'
              }
              rows={4}
            />
          </div>

          {/* Development Domains */}
          <div className="space-y-2">
            <Label>{locale === 'en' ? 'Development Areas' : 'विकास क्षेत्रहरू'}</Label>
            <div className="flex flex-wrap gap-2">
              {selectedActivity?.domains.map((domain) => (
                <Badge key={domain} className={domainColors[domain]}>
                  {domain.charAt(0).toUpperCase() + domain.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        {step > 1 && (
          <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
            {locale === 'en' ? 'Back' : 'पछाडि'}
          </Button>
        )}
        {step < 4 ? (
          <Button
            className="flex-1"
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
          >
            {locale === 'en' ? 'Continue' : 'जारी राख्नुहोस्'}
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {locale === 'en' ? 'Saving...' : 'सेभ गर्दै...'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Log Activity' : 'गतिविधि लग गर्नुहोस्'}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
