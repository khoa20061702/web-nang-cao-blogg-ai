export type CategoryType =
  | 'Trang chủ'
  | 'Tin Phenikaa'
  | 'Giải Trí & Đời Sống'
  | 'Thể Thao & Bứt Phá'
  | 'Công Nghệ & Đổi Mới'
  | 'Multimedia'
  | 'Góc Sinh Viên';

export interface CommentItem {
  id: string;
  author: string;
  avatar?: string;
  role?: string;
  text: string;
  createdAt: string;
  likes?: number;
}

export interface ReactionsCount {
  like: number;
  heart: number;
  haha: number;
  wow: number;
  sad: number;
}

export interface BlogPost {
  id: string;
  title: string;
  category: CategoryType;
  author: string;
  authorRole?: string;
  publishedAt: string;
  readTime: string;
  excerpt: string;
  coverImage: string;
  content: string;
  tags: string[];
  isFeatured?: boolean;       // Tiêu điểm lớn nhất
  isSubFeatured?: boolean;    // Tiêu điểm phụ (4 bài)
  viewsCount?: number;
  status?: 'published' | 'scheduled' | 'draft';
  scheduledFor?: string;
  reactions: ReactionsCount;
  comments: CommentItem[];
}

export interface TimelineNewsItem {
  id: string;
  time: string;
  title: string;
  category: CategoryType;
  badge?: string;
}

export interface MultimediaItem {
  id: string;
  title: string;
  type: 'video' | 'podcast' | 'album';
  duration: string;
  cover: string;
  views: string;
  description: string;
}

export interface SummaryData {
  headline: string;
  bulletPoints: string[];
  keyTakeaway: string;
  detectedLanguage: string;
  sentiment: 'positive' | 'neutral' | 'urgent' | 'critical';
  metrics: {
    originalWordCount: number;
    summaryWordCount: number;
    compressionRatio: number;
    estimatedReadTimeSavedMin: number;
    latencyMs: number;
    model: string;
  };
}

export interface ApiHealthStatus {
  status: string;
  timestamp: string;
  hasApiKey: boolean;
  model: string;
  version: string;
}
