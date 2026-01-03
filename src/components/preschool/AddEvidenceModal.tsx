'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLocaleStore } from '@/store/localeStore';
import {
  Camera,
  Upload,
  Video,
  CheckCircle2,
  Loader2,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

interface AddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneTitle?: string;
  milestoneTitleNe?: string;
  onSubmit?: (data: EvidenceData) => void;
}

interface EvidenceData {
  type: 'photo' | 'video' | 'file';
  caption: string;
  date: string;
}

type UploadMethod = 'camera' | 'upload' | 'video' | null;

export function AddEvidenceModal({
  isOpen,
  onClose,
  milestoneTitle,
  milestoneTitleNe,
  onSubmit,
}: AddEvidenceModalProps) {
  const { locale } = useLocaleStore();
  const [step, setStep] = useState<'select' | 'preview' | 'details' | 'success'>('select');
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const resetForm = () => {
    setStep('select');
    setUploadMethod(null);
    setCaption('');
    setPreviewImage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleMethodSelect = (method: UploadMethod) => {
    setUploadMethod(method);
    // Simulate image capture/selection with a placeholder
    setPreviewImage('/placeholder-evidence.jpg');
    setStep('preview');
  };

  const handleConfirmPreview = () => {
    setStep('details');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const data: EvidenceData = {
      type: uploadMethod === 'video' ? 'video' : 'photo',
      caption,
      date: new Date().toISOString(),
    };

    onSubmit?.(data);
    setIsSubmitting(false);
    setStep('success');
  };

  const uploadMethods = [
    {
      id: 'camera' as const,
      icon: Camera,
      label: { en: 'Take Photo', ne: 'फोटो खिच्नुहोस्' },
      description: { en: 'Capture using camera', ne: 'क्यामेराबाट खिच्नुहोस्' },
      color: 'bg-blue-500',
    },
    {
      id: 'upload' as const,
      icon: Upload,
      label: { en: 'Upload File', ne: 'फाइल अपलोड गर्नुहोस्' },
      description: { en: 'From device gallery', ne: 'ग्यालरीबाट' },
      color: 'bg-green-500',
    },
    {
      id: 'video' as const,
      icon: Video,
      label: { en: 'Record Video', ne: 'भिडियो रेकर्ड गर्नुहोस्' },
      description: { en: 'Short video clip', ne: 'छोटो भिडियो क्लिप' },
      color: 'bg-purple-500',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {locale === 'en' ? 'Add Evidence' : 'प्रमाण थप्नुहोस्'}
          </DialogTitle>
          {(milestoneTitle || milestoneTitleNe) && (
            <p className="text-sm text-muted-foreground mt-1">
              {locale === 'en' ? milestoneTitle : milestoneTitleNe}
            </p>
          )}
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Select upload method */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Label>
                {locale === 'en' ? 'Choose capture method' : 'क्याप्चर विधि छान्नुहोस्'}
              </Label>

              <div className="grid grid-cols-3 gap-3">
                {uploadMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed hover:border-primary hover:bg-secondary/50 transition-all"
                    >
                      <div className={`${method.color} p-3 rounded-full text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-center">
                        {method.label[locale]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Preview captured media */}
          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Preview area */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {uploadMethod === 'video' ? (
                  <div className="text-center">
                    <Video className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {locale === 'en' ? 'Video preview' : 'भिडियो प्रिभ्यू'}
                    </p>
                    <p className="text-xs text-muted-foreground">0:15</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {locale === 'en' ? 'Photo captured' : 'फोटो खिचियो'}
                    </p>
                  </div>
                )}

                {/* Retake button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setStep('select')}
                >
                  <X className="h-4 w-4 mr-1" />
                  {locale === 'en' ? 'Retake' : 'पुन: लिनुहोस्'}
                </Button>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('select')}>
                  {locale === 'en' ? 'Back' : 'पछाडि'}
                </Button>
                <Button className="flex-1" onClick={handleConfirmPreview}>
                  {locale === 'en' ? 'Use This' : 'यो प्रयोग गर्नुहोस्'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Add details */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Thumbnail preview */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center">
                  {uploadMethod === 'video' ? (
                    <Video className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {uploadMethod === 'video'
                      ? locale === 'en' ? 'Video Recording' : 'भिडियो रेकर्डिङ'
                      : locale === 'en' ? 'Photo' : 'फोटो'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'ne-NP', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Caption input */}
              <div className="space-y-2">
                <Label>
                  {locale === 'en' ? 'Caption (Optional)' : 'क्याप्शन (ऐच्छिक)'}
                </Label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={
                    locale === 'en'
                      ? 'Describe this evidence...'
                      : 'यो प्रमाण वर्णन गर्नुहोस्...'
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('preview')}>
                  {locale === 'en' ? 'Back' : 'पछाडि'}
                </Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {locale === 'en' ? 'Saving...' : 'सेभ गर्दै...'}
                    </>
                  ) : locale === 'en' ? (
                    'Save Evidence'
                  ) : (
                    'प्रमाण सेभ गर्नुहोस्'
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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
                {locale === 'en' ? 'Evidence Added!' : 'प्रमाण थपियो!'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {locale === 'en'
                  ? 'The evidence has been saved to this milestone.'
                  : 'प्रमाण यस माइलस्टोनमा सेभ गरियो।'}
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
