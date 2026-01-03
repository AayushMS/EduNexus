'use client';

import { useState, useRef } from 'react';
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
import { Progress } from '@/components/ui/progress';
import {
  Camera,
  Upload,
  Mic,
  Video,
  FileText,
  Link2,
  X,
  CheckCircle2,
  Loader2,
  Star,
  Image as ImageIcon,
} from 'lucide-react';

interface HomeworkSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: {
    id: string;
    title: { en: string; ne: string };
    xpReward: number;
  };
  onSubmit?: (data: SubmissionData) => void;
}

interface SubmissionData {
  assignmentId: string;
  files: File[];
  note: string;
  submissionType: 'photo' | 'file' | 'audio' | 'video' | 'text' | 'link';
}

const submissionTypes = [
  { id: 'photo', icon: Camera, label: { en: 'Take Photo', ne: 'फोटो खिच्नुहोस्' }, color: 'bg-blue-500' },
  { id: 'file', icon: Upload, label: { en: 'Upload File', ne: 'फाइल अपलोड' }, color: 'bg-green-500' },
  { id: 'audio', icon: Mic, label: { en: 'Record Audio', ne: 'अडियो रेकर्ड' }, color: 'bg-purple-500' },
  { id: 'video', icon: Video, label: { en: 'Record Video', ne: 'भिडियो रेकर्ड' }, color: 'bg-pink-500' },
  { id: 'text', icon: FileText, label: { en: 'Type Text', ne: 'टेक्स्ट लेख्नुहोस्' }, color: 'bg-amber-500' },
  { id: 'link', icon: Link2, label: { en: 'Attach Link', ne: 'लिंक जोड्नुहोस्' }, color: 'bg-cyan-500' },
] as const;

export function HomeworkSubmissionModal({
  isOpen,
  onClose,
  assignment,
  onSubmit,
}: HomeworkSubmissionModalProps) {
  const { locale } = useLocaleStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'select' | 'upload' | 'success'>('select');
  const [selectedType, setSelectedType] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [note, setNote] = useState('');
  const [textContent, setTextContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    setStep('select');
    setSelectedType('');
    setFiles([]);
    setNote('');
    setTextContent('');
    setLinkUrl('');
    setUploadProgress(0);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    if (typeId === 'file' || typeId === 'photo') {
      fileInputRef.current?.click();
    } else {
      setStep('upload');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setStep('upload');
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    onSubmit?.({
      assignmentId: assignment.id,
      files,
      note,
      submissionType: selectedType as SubmissionData['submissionType'],
    });

    setStep('success');
    setIsSubmitting(false);
  };

  const canSubmit = () => {
    if (selectedType === 'text') return textContent.trim().length > 0;
    if (selectedType === 'link') return linkUrl.trim().length > 0;
    if (['photo', 'file', 'audio', 'video'].includes(selectedType)) return files.length > 0;
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'success'
              ? locale === 'en'
                ? 'Submitted!'
                : 'पेश गरियो!'
              : locale === 'en'
              ? 'Submit Homework'
              : 'गृहकार्य पेश गर्नुहोस्'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step: Select Type */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? assignment.title.en : assignment.title.ne}
              </p>

              <div className="grid grid-cols-3 gap-3">
                {submissionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTypeSelect(type.id)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <div className={`${type.color} rounded-full p-3 text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-center">
                        {type.label[locale]}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={selectedType === 'photo' ? 'image/*' : '*/*'}
                multiple
                onChange={handleFileChange}
              />
            </motion.div>
          )}

          {/* Step: Upload/Input */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* File preview */}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
                    >
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Add More' : 'थप गर्नुहोस्'}
                  </Button>
                </div>
              )}

              {/* Text input */}
              {selectedType === 'text' && (
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder={
                    locale === 'en'
                      ? 'Type your answer here...'
                      : 'यहाँ आफ्नो जवाफ लेख्नुहोस्...'
                  }
                  rows={6}
                />
              )}

              {/* Link input */}
              {selectedType === 'link' && (
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              )}

              {/* Recording placeholder */}
              {(selectedType === 'audio' || selectedType === 'video') && files.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center text-white animate-pulse">
                    {selectedType === 'audio' ? (
                      <Mic className="h-8 w-8" />
                    ) : (
                      <Video className="h-8 w-8" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en'
                      ? 'Recording feature coming soon!'
                      : 'रेकर्डिङ सुविधा छिट्टै आउँदैछ!'}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Upload Instead' : 'बरु अपलोड गर्नुहोस्'}
                  </Button>
                </div>
              )}

              {/* Optional note */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {locale === 'en' ? 'Add a note (optional)' : 'नोट थप्नुहोस् (ऐच्छिक)'}
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    locale === 'en'
                      ? 'Any message for your teacher...'
                      : 'शिक्षकको लागि कुनै सन्देश...'
                  }
                  rows={2}
                />
              </div>

              {/* Upload progress */}
              {isSubmitting && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-xs text-center text-muted-foreground">
                    {locale === 'en' ? 'Uploading...' : 'अपलोड हुँदैछ...'} {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('select')}
                  disabled={isSubmitting}
                >
                  {locale === 'en' ? 'Back' : 'पछाडि'}
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={!canSubmit() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {locale === 'en' ? 'Submitting...' : 'पेश गर्दै...'}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {locale === 'en' ? 'Submit' : 'पेश गर्नुहोस्'}
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
                {locale === 'en' ? 'Homework Submitted!' : 'गृहकार्य पेश गरियो!'}
              </h3>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full mb-4"
              >
                <Star className="h-5 w-5" />
                <span className="font-semibold">+{assignment.xpReward} XP</span>
              </motion.div>

              <p className="text-sm text-muted-foreground mb-6">
                {locale === 'en'
                  ? 'Your teacher will review your submission soon.'
                  : 'तपाईंको शिक्षकले छिट्टै तपाईंको पेशी समीक्षा गर्नुहुनेछ।'}
              </p>

              <Button onClick={handleClose}>
                {locale === 'en' ? 'Done' : 'सम्पन्न'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={selectedType === 'photo' ? 'image/*' : selectedType === 'video' ? 'video/*' : selectedType === 'audio' ? 'audio/*' : '*/*'}
          multiple
          onChange={handleFileChange}
        />
      </DialogContent>
    </Dialog>
  );
}
