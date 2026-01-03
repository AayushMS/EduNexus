'use client';

import { useState, useRef } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  Camera,
  Video,
  Image,
  X,
  Send,
  Users,
  Tag,
  MapPin,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  nameNe: string;
}

interface RecentPost {
  id: string;
  caption: string;
  mediaCount: number;
  taggedCount: number;
  time: string;
  likes: number;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Aarav Sharma', nameNe: 'आरव शर्मा' },
  { id: '2', name: 'Sita Thapa', nameNe: 'सीता थापा' },
  { id: '3', name: 'Ram Gurung', nameNe: 'राम गुरुङ' },
  { id: '4', name: 'Priya Rai', nameNe: 'प्रिया राई' },
  { id: '5', name: 'Kiran Tamang', nameNe: 'किरण तामाङ' },
  { id: '6', name: 'Maya Shrestha', nameNe: 'माया श्रेष्ठ' },
  { id: '7', name: 'Bikash Magar', nameNe: 'बिकास मगर' },
  { id: '8', name: 'Anita Limbu', nameNe: 'अनिता लिम्बु' },
];

const activityTypes = [
  { value: 'science', label: 'Science Lab', labelNe: 'विज्ञान प्रयोगशाला', icon: '🔬' },
  { value: 'art', label: 'Art Class', labelNe: 'कला कक्षा', icon: '🎨' },
  { value: 'sports', label: 'Sports', labelNe: 'खेलकुद', icon: '⚽' },
  { value: 'music', label: 'Music', labelNe: 'संगीत', icon: '🎵' },
  { value: 'reading', label: 'Reading', labelNe: 'पढाइ', icon: '📚' },
  { value: 'group', label: 'Group Work', labelNe: 'समूह कार्य', icon: '👥' },
  { value: 'celebration', label: 'Celebration', labelNe: 'उत्सव', icon: '🎉' },
  { value: 'field', label: 'Field Trip', labelNe: 'शैक्षिक भ्रमण', icon: '🚌' },
];

const moodOptions = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🤩', label: 'Excited' },
  { emoji: '🤔', label: 'Curious' },
  { emoji: '💪', label: 'Determined' },
  { emoji: '🎉', label: 'Celebrating' },
];

const recentPosts: RecentPost[] = [
  { id: '1', caption: 'Science experiment day! Students learned about chemical reactions...', mediaCount: 3, taggedCount: 15, time: '2 hours ago', likes: 24 },
  { id: '2', caption: 'Art class creativity on display today...', mediaCount: 5, taggedCount: 20, time: 'Yesterday', likes: 45 },
  { id: '3', caption: 'Sports day preparation in full swing...', mediaCount: 2, taggedCount: 32, time: '2 days ago', likes: 67 },
];

export default function MomentsPage() {
  const { locale } = useLocaleStore();
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [captionNe, setCaptionNe] = useState('');
  const [activityType, setActivityType] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [tagAll, setTagAll] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
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

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleTagAll = () => {
    setTagAll(!tagAll);
    if (!tagAll) {
      setSelectedStudents(mockStudents.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handlePost = async () => {
    if (selectedMedia.length === 0) {
      toast.error(
        locale === 'en'
          ? 'Please add at least one photo or video'
          : 'कृपया कम्तिमा एउटा फोटो वा भिडियो थप्नुहोस्'
      );
      return;
    }

    if (!caption) {
      toast.error(
        locale === 'en'
          ? 'Please add a caption'
          : 'कृपया क्याप्शन थप्नुहोस्'
      );
      return;
    }

    setIsPosting(true);

    // Simulate posting
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(
      locale === 'en'
        ? `Moment posted! ${selectedStudents.length} parents notified.`
        : `मोमेन्ट पोस्ट भयो! ${selectedStudents.length} अभिभावकहरूलाई सूचित गरियो।`
    );

    // Reset form
    setSelectedMedia([]);
    setCaption('');
    setCaptionNe('');
    setActivityType('');
    setSelectedStudents([]);
    setTagAll(false);
    setSelectedMood('');
    setIsPosting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teacher">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {locale === 'en' ? 'Post Moment' : 'मोमेन्ट पोस्ट गर्नुहोस्'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Share classroom moments with parents'
              : 'अभिभावकहरूसँग कक्षाको क्षणहरू साझा गर्नुहोस्'}
          </p>
        </div>
      </div>

      {/* Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {locale === 'en' ? 'Add Photos/Videos' : 'फोटो/भिडियो थप्नुहोस्'}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                    <span className="text-xs">
                      {locale === 'en' ? 'Add More' : 'थप्नुहोस्'}
                    </span>
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {selectedMedia.length}/10 {locale === 'en' ? 'files selected' : 'फाइलहरू छानिएको'}
              </p>
            </div>
          ) : (
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium">
                {locale === 'en' ? 'Tap to capture or upload' : 'क्याप्चर वा अपलोड गर्न ट्याप गर्नुहोस्'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {locale === 'en' ? 'Up to 10 photos/videos' : '१० फोटो/भिडियो सम्म'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Caption */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Caption' : 'क्याप्शन'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">English</Label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for parents..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">नेपाली</Label>
            <Textarea
              value={captionNe}
              onChange={(e) => setCaptionNe(e.target.value)}
              placeholder="अभिभावकहरूको लागि क्याप्शन लेख्नुहोस्..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Activity Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {locale === 'en' ? 'Activity Type' : 'गतिविधि प्रकार'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {activityTypes.map((type) => (
              <Button
                key={type.value}
                variant={activityType === type.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActivityType(type.value)}
              >
                <span className="mr-1">{type.icon}</span>
                {locale === 'en' ? type.label : type.labelNe}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tag Students */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            {locale === 'en' ? 'Tag Students' : 'विद्यार्थीहरू ट्याग गर्नुहोस्'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="tag-all"
                checked={tagAll}
                onCheckedChange={() => handleTagAll()}
              />
              <Label htmlFor="tag-all">
                {locale === 'en' ? 'Tag entire class' : 'सम्पूर्ण कक्षा ट्याग गर्नुहोस्'}
              </Label>
            </div>
            <Badge variant="outline">
              {selectedStudents.length} {locale === 'en' ? 'selected' : 'छानिएको'}
            </Badge>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsStudentSelectorOpen(true)}
          >
            <Users className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Select Individual Students' : 'व्यक्तिगत विद्यार्थी छान्नुहोस्'}
          </Button>
        </CardContent>
      </Card>

      {/* Mood */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {locale === 'en' ? 'Class Mood' : 'कक्षाको मूड'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4">
            {moodOptions.map((mood) => (
              <Button
                key={mood.emoji}
                variant={selectedMood === mood.emoji ? 'default' : 'outline'}
                size="lg"
                className="h-14 w-14 text-2xl"
                onClick={() => setSelectedMood(mood.emoji)}
              >
                {mood.emoji}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Post Button */}
      <Button
        className="w-full h-14 text-lg"
        onClick={handlePost}
        disabled={isPosting}
      >
        {isPosting ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            {locale === 'en' ? 'Posting...' : 'पोस्ट गर्दै...'}
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            {locale === 'en' ? 'Post to Parent Feeds' : 'अभिभावक फिडमा पोस्ट गर्नुहोस्'}
          </>
        )}
      </Button>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Recent Posts' : 'हालका पोस्टहरू'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center shrink-0">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-2">{post.caption}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{post.mediaCount} 📷</span>
                  <span>{post.taggedCount} 👤</span>
                  <span>{post.likes} ❤️</span>
                  <span className="ml-auto">{post.time}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Student Selector Dialog */}
      <Dialog open={isStudentSelectorOpen} onOpenChange={setIsStudentSelectorOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {locale === 'en' ? 'Select Students' : 'विद्यार्थीहरू छान्नुहोस्'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {mockStudents.map((student) => (
              <div
                key={student.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors',
                  selectedStudents.includes(student.id) && 'border-primary bg-primary/5'
                )}
                onClick={() => toggleStudent(student.id)}
              >
                <span className="font-medium">
                  {locale === 'en' ? student.name : student.nameNe}
                </span>
                {selectedStudents.includes(student.id) && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
            ))}
          </div>
          <Button
            className="w-full mt-4"
            onClick={() => setIsStudentSelectorOpen(false)}
          >
            {locale === 'en' ? 'Done' : 'सम्पन्न'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
