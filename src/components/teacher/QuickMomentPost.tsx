'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Camera,
  Video,
  Image as ImageIcon,
  X,
  Users,
  Tag,
  Send,
  Loader2,
  CheckCircle2,
  Smile,
} from 'lucide-react';
import { toast } from 'sonner';

interface QuickMomentPostProps {
  isOpen: boolean;
  onClose: () => void;
  classes: { id: string; name: string; nameNe: string }[];
  activityTypes: { id: string; name: string; nameNe: string; icon: string }[];
  onPost?: (data: MomentPostData) => void;
}

interface MomentPostData {
  classIds: string[];
  caption: string;
  captionNe: string;
  activityType: string;
  media: File[];
  mood: string;
}

const moods = [
  { id: 'happy', emoji: '😊', label: { en: 'Happy', ne: 'खुशी' } },
  { id: 'excited', emoji: '🎉', label: { en: 'Excited', ne: 'उत्साहित' } },
  { id: 'proud', emoji: '🌟', label: { en: 'Proud', ne: 'गर्विलो' } },
  { id: 'curious', emoji: '🤔', label: { en: 'Curious', ne: 'जिज्ञासु' } },
  { id: 'creative', emoji: '🎨', label: { en: 'Creative', ne: 'सिर्जनशील' } },
];

export function QuickMomentPost({
  isOpen,
  onClose,
  classes,
  activityTypes,
  onPost,
}: QuickMomentPostProps) {
  const { locale } = useLocaleStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'capture' | 'details' | 'success'>('capture');
  const [media, setMedia] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('happy');
  const [caption, setCaption] = useState('');
  const [captionNe, setCaptionNe] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const resetState = () => {
    setStep('capture');
    setMedia([]);
    setPreviews([]);
    setSelectedClasses([]);
    setSelectedActivity('');
    setSelectedMood('happy');
    setCaption('');
    setCaptionNe('');
  };

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
      setStep('details');
    }
  };

  const handleRemoveMedia = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setMedia((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (media.length === 1) {
      setStep('capture');
    }
  };

  const toggleClass = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const handlePost = async () => {
    if (media.length === 0 || selectedClasses.length === 0) {
      toast.error(
        locale === 'en'
          ? 'Please add at least one photo and select a class'
          : 'कृपया कम्तिमा एउटा फोटो थप्नुहोस् र कक्षा छान्नुहोस्'
      );
      return;
    }

    setIsPosting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onPost?.({
      classIds: selectedClasses,
      caption,
      captionNe,
      activityType: selectedActivity,
      media,
      mood: selectedMood,
    });

    setIsPosting(false);
    setStep('success');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'success'
              ? locale === 'en'
                ? 'Posted!'
                : 'पोस्ट भयो!'
              : locale === 'en'
              ? 'Post a Moment'
              : 'पल पोस्ट गर्नुहोस्'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step: Capture */}
          {step === 'capture' && (
            <motion.div
              key="capture"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="font-medium">
                  {locale === 'en' ? 'Capture a Moment' : 'पल कैद गर्नुहोस्'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === 'en'
                    ? 'Take a photo or upload from gallery'
                    : 'फोटो खिच्नुहोस् वा ग्यालरीबाट अपलोड गर्नुहोस्'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Photo' : 'फोटो'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Video className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Video' : 'भिडियो'}
                </Button>
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

          {/* Step: Details */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Media Preview */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative shrink-0">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 w-20 shrink-0 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Camera className="h-6 w-6" />
                  </button>
                )}
              </div>

              {/* Activity Type */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {locale === 'en' ? 'Activity Type' : 'गतिविधि प्रकार'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {activityTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={selectedActivity === type.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedActivity(type.id)}
                    >
                      <span className="mr-1">{type.icon}</span>
                      {locale === 'en' ? type.name : type.nameNe}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Select Classes */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {locale === 'en' ? 'Tag Classes' : 'कक्षाहरू ट्याग गर्नुहोस्'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {classes.map((cls) => (
                    <Badge
                      key={cls.id}
                      variant={selectedClasses.includes(cls.id) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleClass(cls.id)}
                    >
                      {locale === 'en' ? cls.name : cls.nameNe}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Smile className="h-4 w-4" />
                  {locale === 'en' ? 'Class Mood' : 'कक्षाको मूड'}
                </label>
                <div className="flex gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`
                        text-2xl p-2 rounded-lg transition-all
                        ${selectedMood === mood.id
                          ? 'bg-primary/10 scale-110'
                          : 'hover:bg-secondary'
                        }
                      `}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={
                    locale === 'en'
                      ? 'Write a caption...'
                      : 'क्याप्शन लेख्नुहोस्...'
                  }
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('capture')}>
                  {locale === 'en' ? 'Back' : 'पछाडि'}
                </Button>
                <Button
                  className="flex-1"
                  onClick={handlePost}
                  disabled={isPosting || selectedClasses.length === 0}
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {locale === 'en' ? 'Posting...' : 'पोस्ट गर्दै...'}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {locale === 'en' ? 'Post to Parents' : 'अभिभावकहरूलाई पोस्ट गर्नुहोस्'}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
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
                {locale === 'en' ? 'Moment Posted!' : 'पल पोस्ट भयो!'}
              </h3>

              <p className="text-sm text-muted-foreground mb-6">
                {locale === 'en'
                  ? `${selectedClasses.length} class(es) notified`
                  : `${selectedClasses.length} कक्षा(हरू) लाई सूचित गरियो`}
              </p>

              <Button onClick={handleClose}>
                {locale === 'en' ? 'Done' : 'सम्पन्न'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
