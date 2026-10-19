export interface BlogPost {
  id: string;
  title: string;
  category: 'Công nghệ' | 'Kinh tế' | 'Đời sống' | 'Global Tech';
  author: string;
  publishedAt: string;
  readTime: string;
  excerpt: string;
  coverImage: string;
  content: string;
  tags: string[];
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
