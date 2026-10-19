/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  X,
  FileCode,
  PenTool,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { TopBar } from './components/TopBar.tsx';
import { Header } from './components/Header.tsx';
import { Navbar } from './components/Navbar.tsx';
import { FeaturedHotNews } from './components/FeaturedHotNews.tsx';
import { EntertainmentSection } from './components/EntertainmentSection.tsx';
import { NewsTechList } from './components/NewsTechList.tsx';
import { Sidebar247 } from './components/Sidebar247.tsx';
import { AdminCMSModal } from './components/AdminCMSModal.tsx';
import { StudentVoiceModal } from './components/StudentVoiceModal.tsx';
import { FullArticleModal } from './components/FullArticleModal.tsx';
import { SummaryResultModal } from './components/SummaryResultModal.tsx';
import { CustomSummarizer } from './components/CustomSummarizer.tsx';
import { CodeGuideView } from './components/CodeGuideView.tsx';
import { Footer } from './components/Footer.tsx';
import {
  INITIAL_POSTS,
  TIMELINE_NEWS,
  TRENDING_POSTS,
  MULTIMEDIA_ITEMS,
} from './data/mockPosts.ts';
import {
  BlogPost,
  CategoryType,
  SummaryData,
  CommentItem,
  TimelineNewsItem,
  MultimediaItem,
} from './types/blog.ts';

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isStudentVoiceOpen, setIsStudentVoiceOpen] = useState(false);
  const [isCodeGuideOpen, setIsCodeGuideOpen] = useState(false);
  const [isAISandboxOpen, setIsAISandboxOpen] = useState(false);

  // Article reading & Summarization state
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [summarizingPostId, setSummarizingPostId] = useState<string | null>(null);
  const [activeSummary, setActiveSummary] = useState<SummaryData | null>(null);
  const [activeSummaryTitle, setActiveSummaryTitle] = useState<string | undefined>();
  const [lastRequestPayload, setLastRequestPayload] = useState<any>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryCache, setSummaryCache] = useState<Record<string, SummaryData>>({});

  // Timeline & Media
  const [timelineNews, setTimelineNews] = useState<TimelineNewsItem[]>(TIMELINE_NEWS);
  const [multimediaItems, setMultimediaItems] = useState<MultimediaItem[]>(MULTIMEDIA_ITEMS);

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Separate main featured and sub featured
  const mainFeatured = posts.find((p) => p.isFeatured) || posts[0];
  const subFeatured = posts.filter((p) => p.isSubFeatured || (p.id !== mainFeatured.id && !p.isFeatured));
  const entertainmentPosts = posts.filter((p) => p.category === 'Giải Trí & Đời Sống');
  const techPosts = posts.filter(
    (p) => p.category === 'Công Nghệ & Đổi Mới' || p.category === 'Tin Phenikaa'
  );

  // Handle summarize for any blog post
  const handleSummarizePost = async (post: BlogPost) => {
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
      const payload = {
        title: post.title,
        content: post.content,
        bulletsCount: 3,
        tone: 'engaging',
        language: 'vi',
      };
      setLastRequestPayload(payload);

      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || `Lỗi máy chủ (${response.status})`);
      }

      const summaryData = result.data as SummaryData;
      setSummaryCache((prev) => ({ ...prev, [post.id]: summaryData }));
      setActiveSummary(summaryData);
      setActiveSummaryTitle(post.title);
      setIsSummaryModalOpen(true);
    } catch (err: any) {
      alert(`Không thể tạo tóm tắt: ${err.message || 'Lỗi kết nối'}`);
    } finally {
      setSummarizingPostId(null);
    }
  };

  // Helper for CMS to generate excerpt
  const handleSummarizeTextOnly = async (text: string): Promise<string> => {
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, bulletsCount: 2 }),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data.headline + ' - ' + (result.data.bulletPoints?.[0] || '');
    }
    return text.slice(0, 150) + '...';
  };

  // Handle Add Post from CMS
  const handleAddPost = (newPost: BlogPost) => {
    setPosts((prev) => [newPost, ...prev]);

    // Also push to timeline
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newTimelineItem: TimelineNewsItem = {
      id: `tl-${Date.now()}`,
      time: timeStr,
      title: newPost.title,
      category: newPost.category,
      badge: 'MỚI ĐĂNG',
    };
    setTimelineNews((prev) => [newTimelineItem, ...prev]);
  };

  // Handle Delete Post
  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Handle Add Comment
  const handleAddComment = (postId: string, comment: CommentItem) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [comment, ...p.comments] } : p))
    );
    if (readingPost && readingPost.id === postId) {
      setReadingPost((prev) =>
        prev ? { ...prev, comments: [comment, ...prev.comments] } : null
      );
    }
  };

  // Handle Reaction Click
  const handleReact = (postId: string, reactionType: 'like' | 'heart' | 'haha' | 'wow' | 'sad') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            reactions: {
              ...p.reactions,
              [reactionType]: p.reactions[reactionType] + 1,
            },
          };
        }
        return p;
      })
    );

    if (readingPost && readingPost.id === postId) {
      setReadingPost((prev) =>
        prev
          ? {
              ...prev,
              reactions: {
                ...prev.reactions,
                [reactionType]: prev.reactions[reactionType] + 1,
              },
            }
          : null
      );
    }
  };

  // Handle Student Voice submission
  const handleSubmitStudentIdea = (data: {
    studentName: string;
    studentId: string;
    faculty: string;
    topic: string;
    content: string;
  }) => {
    const newPost: BlogPost = {
      id: `post-student-${Date.now()}`,
      title: `[Hiến Kế Sinh Viên] ${data.topic}`,
      category: 'Góc Sinh Viên',
      author: data.studentName,
      authorRole: `${data.faculty} (MSSV: ${data.studentId || 'N/A'})`,
      publishedAt: 'Vừa xong',
      readTime: '3 phút đọc',
      excerpt: data.content.slice(0, 160) + '...',
      coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
      content: data.content,
      tags: ['Hiến Kế', 'Góc Sinh Viên', 'Phenikaa Campus'],
      viewsCount: 1,
      reactions: { like: 1, heart: 1, haha: 0, wow: 0, sad: 0 },
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#ff6b00] selection:text-white">
      {/* 1. TOP BAR */}
      <TopBar
        onOpenCMS={() => setIsCMSOpen(true)}
        onOpenStudentVoice={() => setIsStudentVoiceOpen(true)}
        onOpenCodeGuide={() => setIsCodeGuideOpen(true)}
      />

      {/* 2. HEADER */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAICustom={() => setIsAISandboxOpen(true)}
      />

      {/* 3. STICKY PHENIKAA NAVIGATION MENU */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenCMS={() => setIsCMSOpen(true)}
        onOpenAICustom={() => setIsAISandboxOpen(true)}
        onOpenCodeGuide={() => setIsCodeGuideOpen(true)}
      />

      {/* 4. MAIN CONTENT AREA (LƯỚI 3 CỘT: 2/3 NỘI DUNG CHÍNH + 1/3 SIDEBAR) */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Category Filter Banner (if a specific category is selected) */}
        {activeCategory !== 'all' && (
          <div className="mb-6 p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-6 bg-[#ff6b00] rounded-sm"></span>
              <h2 className="font-serif font-black text-xl text-[#003366]">
                Chuyên mục: {activeCategory}
              </h2>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                {filteredPosts.length} bài viết
              </span>
            </div>
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs font-semibold text-[#00529C] hover:text-[#ff6b00] flex items-center gap-1"
            >
              <span>Xem tất cả chuyên mục</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI & TRUNG TÂM (CHIẾM 2/3 CHIỀU RỘNG - 8 CỘT) */}
          <div className="lg:col-span-8 space-y-8">
            {/* If Trang Chủ ('all'): Display Hot News -> Entertainment -> News Tech */}
            {activeCategory === 'all' && (
              <>
                {/* A. Khối Tiêu Điểm / Nổi Bật (Hot News) */}
                <FeaturedHotNews
                  mainFeatured={mainFeatured}
                  subFeaturedList={subFeatured}
                  onReadPost={(p) => setReadingPost(p)}
                  onSummarizePost={handleSummarizePost}
                  summarizingPostId={summarizingPostId}
                  summaryCache={summaryCache}
                />

                {/* B. Khối Chuyên Mục "Giải Trí Phenikaa" (Card View) */}
                <EntertainmentSection
                  posts={entertainmentPosts.slice(0, 3)}
                  onReadPost={(p) => setReadingPost(p)}
                  onSummarizePost={handleSummarizePost}
                />

                {/* C. Khối Chuyên Mục "Tin Tức & Công Nghệ" (Media List View) */}
                <NewsTechList
                  posts={techPosts.slice(0, 4)}
                  onReadPost={(p) => setReadingPost(p)}
                  onSummarizePost={handleSummarizePost}
                />
              </>
            )}

            {/* If Specific Category Selected: Display Filtered Grid */}
            {activeCategory !== 'all' && (
              <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                    <p className="text-slate-500 font-medium">
                      Chưa có bài viết nào trong chuyên mục này.
                    </p>
                  </div>
                ) : (
                  <NewsTechList
                    posts={filteredPosts}
                    onReadPost={(p) => setReadingPost(p)}
                    onSummarizePost={handleSummarizePost}
                  />
                )}
              </div>
            )}
          </div>

          {/* CỘT PHẢI - SIDEBAR (CHIẾM 1/3 CHIỀU RỘNG - 4 CỘT) */}
          <div className="lg:col-span-4">
            <Sidebar247
              timelineNews={timelineNews}
              trendingList={TRENDING_POSTS}
              multimediaItems={multimediaItems}
              onSelectPostById={(id) => {
                const found = posts.find((p) => p.id === id);
                if (found) setReadingPost(found);
              }}
              onOpenCodeGuide={() => setIsCodeGuideOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* 5. FOOTER */}
      <Footer
        onOpenCodeGuide={() => setIsCodeGuideOpen(true)}
        onOpenStudentVoice={() => setIsStudentVoiceOpen(true)}
        onOpenCMS={() => setIsCMSOpen(true)}
      />

      {/* MODAL 1: Full Article Reader with Comments & Reactions */}
      <FullArticleModal
        post={readingPost}
        onClose={() => setReadingPost(null)}
        onSummarize={(post) => {
          handleSummarizePost(post);
        }}
        isSummarizing={summarizingPostId === readingPost?.id}
        onAddComment={handleAddComment}
        onReact={handleReact}
      />

      {/* MODAL 2: AI Summary Result with 3 Bullets & JSON Inspector */}
      <SummaryResultModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summary={activeSummary}
        articleTitle={activeSummaryTitle}
        requestPayload={lastRequestPayload}
      />

      {/* MODAL 3: Admin CMS Panel */}
      <AdminCMSModal
        isOpen={isCMSOpen}
        onClose={() => setIsCMSOpen(false)}
        posts={posts}
        onAddPost={handleAddPost}
        onDeletePost={handleDeletePost}
        onSummarizeText={handleSummarizeTextOnly}
      />

      {/* MODAL 4: Student Voice / Hiến Kế */}
      <StudentVoiceModal
        isOpen={isStudentVoiceOpen}
        onClose={() => setIsStudentVoiceOpen(false)}
        onSubmitIdea={handleSubmitStudentIdea}
      />

      {/* MODAL 5: Custom AI Summarizer Sandbox */}
      {isAISandboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-lg text-white">
                  Studio Tóm Tắt Tự Do (AI Sandbox)
                </h3>
              </div>
              <button
                onClick={() => setIsAISandboxOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CustomSummarizer
              onSummarizeCustom={async (params) => {
                setLastRequestPayload(params);
                const res = await fetch('/api/ai/summarize', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(params),
                });
                const result = await res.json();
                if (!res.ok || !result.success) {
                  throw new Error(result.error || `HTTP error ${res.status}`);
                }
                setActiveSummary(result.data);
                setActiveSummaryTitle(params.title || 'Bài viết tùy chỉnh');
                setIsSummaryModalOpen(true);
              }}
              isLoading={false}
              error={null}
            />
          </div>
        </div>
      )}

      {/* MODAL 6: Full Node.js Express Code & Architecture Guide */}
      {isCodeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-lg text-white">
                  Tài Liệu & Mã Nguồn Node.js Express Chuẩn Đồ Án
                </h3>
              </div>
              <button
                onClick={() => setIsCodeGuideOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CodeGuideView />
          </div>
        </div>
      )}
    </div>
  );
}
