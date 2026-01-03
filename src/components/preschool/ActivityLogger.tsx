'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Camera,
  Video,
  Mic,
  X,
  Users,
  Tag,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { DEVELOPMENT_DOMAINS, type DevelopmentDomain } from '@/types/preschool.types';

interface Child {
  id: string;
  name: string;
  nameNe: string;
  avatarUrl?: string;
}

interface ActivityLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  children: Child[];
  onSubmit?: (data: ActivityLogData) => void;
  preSelectedChildId?: string;
}

interface ActivityLogData {
  activityType: string;
  domains: DevelopmentDomain[];
  taggedChildren: { childId: string; note: string; mood: string }[];
  media: File[];
  description: string;
}

const activityTypes = [
  { id: 'art', icon: '🎨', name: 'Art & Craft', nameNe: 'कला र शिल्प' },
  { id: 'music', icon: '🎵', name: 'Music & Dance', nameNe: 'संगीत र नृत्य' },
  { id: 'story', icon: '📚', name: 'Story Time', nameNe: 'कथा समय' },
  { id: 'play', icon: '🏃', name: 'Outdoor Play', nameNe: 'बाहिरी खेल' },
  { id: 'blocks', icon: '🧱', name: 'Block Building', nameNe: 'ब्लक निर्माण' },
  { id: 'sensory', icon: '🖐️', name: 'Sensory Play', nameNe: 'संवेदी खेल' },
  { id: 'numbers', icon: '🔢', name: 'Numbers & Math', nameNe: 'संख्या र गणित' },
  { id: 'circle', icon: '⭕', name: 'Circle Time', nameNe: 'सर्कल समय' },
];

const childMoods = [
  { id: 'excited', emoji: '🤩', label: { en: 'Excited', ne: 'उत्साहित' } },
  { id: 'happy', emoji: '😊', label: { en: 'Happy', ne: 'खुशी' } },
  { id: 'focused', emoji: '🧐', label: { en: 'Focused', ne: 'केन्द्रित' } },
  { id: 'calm', emoji: '😌', label: { en: 'Calm', ne: 'शान्त' } },
  { id: 'tired', emoji: '😴', label: { en: 'Tired', ne: 'थकित' } },
];

export function ActivityLogger({
  isOpen,
  onClose,
  children,
  onSubmit,
  preSelectedChildId,
}: ActivityLoggerProps) {
  const { locale } = useLocaleStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedDomains, setSelectedDomains] = useState<DevelopmentDomain[]>([]);
  const [media, setMedia] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [taggedChildren, setTaggedChildren] = useState<
    { childId: string; note: string; mood: string }[]
  >([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    setStep(1);
    setSelectedActivity('');
    setSelectedDomains([]);
    setMedia([]);
    setPreviews([]);
    setTaggedChildren([]);
    setDescription('');
  };

  // Pre-select child when modal opens with a preSelectedChildId
  useEffect(() => {
    if (isOpen && preSelectedChildId && taggedChildren.length === 0) {
      setTaggedChildren([{ childId: preSelectedChildId, note: '', mood: 'happy' }]);
    }
  }, [isOpen, preSelectedChildId]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setMedia((prev) => [...prev, ...files].slice(0, 5));
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
    }
  };

  const handleRemoveMedia = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setMedia((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDomain = (domain: DevelopmentDomain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain]
    );
  };

  const toggleChild = (childId: string) => {
    setTaggedChildren((prev) => {
      const existing = prev.find((c) => c.childId === childId);
      if (existing) {
        return prev.filter((c) => c.childId !== childId);
      }
      return [...prev, { childId, note: '', mood: 'happy' }];
    });
  };

  const updateChildNote = (childId: string, note: string) => {
    setTaggedChildren((prev) =>
      prev.map((c) => (c.childId === childId ? { ...c, note } : c))
    );
  };

  const updateChildMood = (childId: string, mood: string) => {
    setTaggedChildren((prev) =>
      prev.map((c) => (c.childId === childId ? { ...c, mood } : c))
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onSubmit?.({
      activityType: selectedActivity,
      domains: selectedDomains,
      taggedChildren,
      media,
      description,
    });

    setIsSubmitting(false);
    setStep(5); // Success step
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedActivity !== '';
      case 2:
        return media.length > 0;
      case 3:
        return taggedChildren.length > 0;
      case 4:
        return selectedDomains.length > 0;
      default:
        return true;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 5
              ? locale === 'en'
                ? 'Activity Logged!'
                : 'गतिविधि लग गरियो!'
              : locale === 'en'
              ? 'Log Activity'
              : 'गतिविधि लग गर्नुहोस्'}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        {step < 5 && (
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Select Activity Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                {locale === 'en'
                  ? 'What activity did you do?'
                  : 'तपाईंले के गतिविधि गर्नुभयो?'}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {activityTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedActivity(type.id)}
                    className={`
                      flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all
                      ${selectedActivity === type.id
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent bg-secondary/50 hover:border-primary/50'
                      }
                    `}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-[10px] text-center line-clamp-2">
                      {locale === 'en' ? type.name : type.nameNe}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Capture Evidence */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                {locale === 'en'
                  ? 'Capture evidence (photos/videos)'
                  : 'प्रमाण क्याप्चर गर्नुहोस् (फोटो/भिडियो)'}
              </p>

              {/* Media Preview */}
              {previews.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative shrink-0">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveMedia(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Camera className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">
                  {locale === 'en'
                    ? 'Tap to add photos or videos'
                    : 'फोटो वा भिडियो थप्न ट्याप गर्नुहोस्'}
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </motion.div>
          )}

          {/* Step 3: Tag Children */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                {locale === 'en'
                  ? 'Tag children and add notes'
                  : 'बच्चाहरू ट्याग गर्नुहोस् र नोटहरू थप्नुहोस्'}
              </p>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {children.map((child) => {
                  const isTagged = taggedChildren.some((c) => c.childId === child.id);
                  const taggedChild = taggedChildren.find((c) => c.childId === child.id);

                  return (
                    <div
                      key={child.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isTagged ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isTagged}
                          onCheckedChange={() => toggleChild(child.id)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={child.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {child.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm flex-1">
                          {locale === 'en' ? child.name : child.nameNe}
                        </span>
                      </div>

                      {isTagged && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-3 pl-11 space-y-2"
                        >
                          <div className="flex gap-1">
                            {childMoods.map((mood) => (
                              <button
                                key={mood.id}
                                onClick={() => updateChildMood(child.id, mood.id)}
                                className={`
                                  text-lg p-1 rounded transition-all
                                  ${taggedChild?.mood === mood.id
                                    ? 'bg-primary/20 scale-110'
                                    : 'hover:bg-secondary'
                                  }
                                `}
                              >
                                {mood.emoji}
                              </button>
                            ))}
                          </div>
                          <Textarea
                            value={taggedChild?.note || ''}
                            onChange={(e) => updateChildNote(child.id, e.target.value)}
                            placeholder={
                              locale === 'en'
                                ? 'Add a note about this child...'
                                : 'यो बच्चाको बारेमा नोट थप्नुहोस्...'
                            }
                            rows={2}
                            className="text-sm"
                          />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (taggedChildren.length === children.length) {
                    setTaggedChildren([]);
                  } else {
                    setTaggedChildren(
                      children.map((c) => ({ childId: c.id, note: '', mood: 'happy' }))
                    );
                  }
                }}
              >
                {taggedChildren.length === children.length
                  ? locale === 'en'
                    ? 'Deselect All'
                    : 'सबै हटाउनुहोस्'
                  : locale === 'en'
                  ? 'Select All'
                  : 'सबै छान्नुहोस्'}
              </Button>
            </motion.div>
          )}

          {/* Step 4: Map to Domains */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                {locale === 'en'
                  ? 'Which development areas does this activity support?'
                  : 'यो गतिविधिले कुन विकास क्षेत्रहरूलाई समर्थन गर्छ?'}
              </p>

              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(DEVELOPMENT_DOMAINS) as DevelopmentDomain[]).map((domain) => {
                  const info = DEVELOPMENT_DOMAINS[domain];
                  const isSelected = selectedDomains.includes(domain);

                  return (
                    <button
                      key={domain}
                      onClick={() => toggleDomain(domain)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left
                        ${isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-transparent bg-secondary/50 hover:border-primary/50'
                        }
                      `}
                    >
                      <span className="text-2xl">{info.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {locale === 'en' ? info.name : info.nameNe}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {locale === 'en' ? info.description : info.descriptionNe}
                        </p>
                      </div>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>

              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  locale === 'en'
                    ? 'Add any additional notes about this activity...'
                    : 'यो गतिविधिको बारेमा कुनै थप नोटहरू थप्नुहोस्...'
                }
                rows={3}
              />
            </motion.div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              >
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              </motion.div>

              <h3 className="text-lg font-semibold mb-2">
                {locale === 'en' ? 'Activity Logged!' : 'गतिविधि लग गरियो!'}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                {locale === 'en'
                  ? `${taggedChildren.length} children tagged in ${selectedDomains.length} development areas`
                  : `${taggedChildren.length} बच्चाहरू ${selectedDomains.length} विकास क्षेत्रहरूमा ट्याग गरिएको`}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {selectedDomains.map((domain) => (
                  <Badge key={domain} variant="outline">
                    {DEVELOPMENT_DOMAINS[domain].icon}{' '}
                    {locale === 'en'
                      ? DEVELOPMENT_DOMAINS[domain].name
                      : DEVELOPMENT_DOMAINS[domain].nameNe}
                  </Badge>
                ))}
              </div>

              <Button onClick={handleClose}>
                {locale === 'en' ? 'Done' : 'सम्पन्न'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 5 && (
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {locale === 'en' ? 'Back' : 'पछाडि'}
            </Button>

            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
                {locale === 'en' ? 'Next' : 'अर्को'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {locale === 'en' ? 'Saving...' : 'सुरक्षित गर्दै...'}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Save Activity' : 'गतिविधि सुरक्षित गर्नुहोस्'}
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
