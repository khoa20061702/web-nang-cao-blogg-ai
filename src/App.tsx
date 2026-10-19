/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Newspaper,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Github,
  Terminal,
  Cpu,
} from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { ArticleCard } from './components/ArticleCard.tsx';
import { CustomSummarizer } from './components/CustomSummarizer.tsx';
import { CodeGuideView } from './components/CodeGuideView.tsx';
import { SummaryResultModal } from './components/SummaryResultModal.tsx';
import { FullArticleModal } from './components/FullArticleModal.tsx';
import { INITIAL_POSTS } from './data/mockPosts.ts';
import { BlogPost, SummaryData, ApiHealthStatus } from './types/blog.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'reader' | 'editor' | 'code-guide'>('reader');
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  // Backend Health Status
  const [health, setHealth] = useState<ApiHealthStatus | null>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);

  // Active Summarization state
  const [summarizingPostId, setSummarizingPostId] = useState<string | null>(null);
  const [isSummarizingCustom, setIsSummarizingCustom] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Results & Modals
  const [activeSummary, setActiveSummary] = useState<SummaryData | null>(null);
  const [activeSummaryTitle, setActiveSummaryTitle] = useState<string | undefined>();
  const [lastRequestPayload, setLastRequestPayload] = useState<any>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  // Full article reader modal
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  // Cache summaries by post ID
  const [summaryCache, setSummaryCache] = useState<Record<string, SummaryData>>({});

  // Check backend health on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        setIsLoadingHealth(true);
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setHealth(data);
        }
      } catch (err) {
        console.warn('Backend health check error:', err);
      } finally {
        setIsLoadingHealth(false);
      }
    }
    checkHealth();
  }, []);

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ['Tất cả', 'Công nghệ', 'Kinh tế', 'Đời sống', 'Global Tech'];

  // Handle summarization for an existing blog post
  const handleSummarizePost = async (post: BlogPost) => {
    // If we already have a cached summary, open it immediately
    if (summaryCache[post.id]) {
      setActiveSummary(summaryCache[post.id]);
      setActiveSummaryTitle(post.title);
      setLastRequestPayload({
        title: post.title,
        contentLength: post.content.length,
        bulletsCount: 3,
        cached: true,
      });
      setIsSummaryModalOpen(true);
      return;
    }

    try {
      setSummarizingPostId(post.id);
      setSummaryError(null);

      const payload = {
        title: post.title,
        content: post.content,
        bulletsCount: 3,
        tone: 'engaging',
        language: 'auto',
      };
      setLastRequestPayload(payload);

      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `HTTP error ${response.status}`);
      }

      const summaryData = result.data as SummaryData;

      // Update cache
      setSummaryCache((prev) => ({ ...prev, [post.id]: summaryData }));
      setActiveSummary(summaryData);
      setActiveSummaryTitle(post.title);
      setIsSummaryModalOpen(true);
    } catch (err: any) {
      alert(`Lỗi khi tạo tóm tắt: ${err.message || 'Không thể kết nối đến máy chủ.'}`);
    } finally {
      setSummarizingPostId(null);
    }
  };

  // Handle summarization for custom text from the editor
  const handleSummarizeCustom = async (params: {
    content: string;
    title?: string;
    bulletsCount: number;
    tone: 'engaging' | 'formal' | 'quick-take' | 'technical';
    language: 'auto' | 'vi' | 'en';
  }) => {
    try {
      setIsSummarizingCustom(true);
      setSummaryError(null);

      setLastRequestPayload(params);

      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Lỗi máy chủ (${response.status})`);
      }

      const summaryData = result.data as SummaryData;
      setActiveSummary(summaryData);
      setActiveSummaryTitle(params.title || 'Bài viết tùy chỉnh');
      setIsSummaryModalOpen(true);
    } catch (err: any) {
      setSummaryError(err.message || 'Không thể tạo tóm tắt. Vui lòng thử lại.');
    } finally {
      setIsSummarizingCustom(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        isLoadingHealth={isLoadingHealth}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Tab 1: News Reader & AI Summarizer */}
        {activeTab === 'reader' && (
          <div className="space-y-8">
            {/* Hero / Intro Banner */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-5 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] sm:text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Google Gemini 3.8 Flash • POST /api/ai/summarize</span>
                </div>
                <h1 className="font-serif font-bold text-xl sm:text-3xl lg:text-4xl text-stone-100 leading-snug">
                  Khám phá tin tức nhanh gấp 3 lần với AI Summarizer
                </h1>
                <p className="text-xs sm:text-base text-stone-400 leading-relaxed">
                  Được thiết kế cho các nền tảng báo chí điện tử hiện đại. Nhấp vào bất kỳ bài viết nào để trải nghiệm tính năng tóm tắt thông minh thành 3 gạch đầu dòng cô đọng chuẩn ngữ cảnh tiếng Việt.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow"
                  >
                    Thử nghiệm bài viết của bạn
                  </button>
                  <button
                    onClick={() => setActiveTab('code-guide')}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 transition-colors"
                  >
                    Xem Code Snippet Node.js
                  </button>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800/80">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-stone-950 font-semibold'
                        : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài viết, hashtag..."
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Articles Grid */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-stone-900/40 rounded-2xl border border-stone-800">
                <Newspaper className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <p className="text-stone-300 font-semibold text-sm">Không tìm thấy bài viết phù hợp</p>
                <p className="text-xs text-stone-500 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <ArticleCard
                    key={post.id}
                    post={post}
                    onSummarize={handleSummarizePost}
                    onReadFull={(p) => setReadingPost(p)}
                    isSummarizing={summarizingPostId === post.id}
                    cachedSummary={summaryCache[post.id]}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Custom Text Summarizer Studio */}
        {activeTab === 'editor' && (
          <CustomSummarizer
            onSummarizeCustom={handleSummarizeCustom}
            isLoading={isSummarizingCustom}
            error={summaryError}
          />
        )}

        {/* Tab 3: Complete Node.js Express Code & Guide */}
        {activeTab === 'code-guide' && <CodeGuideView />}
      </main>

      {/* Summary Result Modal */}
      <SummaryResultModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summary={activeSummary}
        articleTitle={activeSummaryTitle}
        requestPayload={lastRequestPayload}
      />

      {/* Full Article Reader Modal */}
      <FullArticleModal
        post={readingPost}
        onClose={() => setReadingPost(null)}
        onSummarize={(post) => {
          setReadingPost(null);
          handleSummarizePost(post);
        }}
        isSummarizing={summarizingPostId === readingPost?.id}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800 bg-stone-900/80 py-6 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-200">VietNews AI Studio</span>
            <span>•</span>
            <span>Node.js, Express & Google Gemini Summarization API</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              API Endpoint: <code>POST /api/ai/summarize</code>
            </span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('code-guide')}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              Xem Mã Nguồn & Tài Liệu
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
