/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TopBar } from './components/TopBar.tsx';
import { Header } from './components/Header.tsx';
import { Navbar } from './components/Navbar.tsx';
import { FeaturedHotNews } from './components/FeaturedHotNews.tsx';
import { EntertainmentSection } from './components/EntertainmentSection.tsx';
import { NewsTechList } from './components/NewsTechList.tsx';
import { Sidebar247 } from './components/Sidebar247.tsx';
import { AdminCMSModal } from './components/AdminCMSModal.tsx';
import { ArticleDetailPage } from './components/ArticleDetailPage.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal, UserProfile } from './components/AuthModal.tsx';
import { INITIAL_POSTS } from './data/mockPosts.ts';
import {
  BlogPost,
  CategoryType,
  SummaryData,
  CommentItem,
  TimelineNewsItem,
} from './types/blog.ts';

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('phenikaa_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('phenikaa_auth_token') || null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modals state - chỉ mở CMS cho Admin
  const [isCMSOpen, setIsCMSOpen] = useState(false);

  // Load real posts from MongoDB on initial mount
  useEffect(() => {
    const fetchMongoPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPosts(json.data);
          console.log(`[Frontend] Đã tải ${json.data.length} bài viết từ MongoDB.`);
        }
      } catch (err) {
        console.warn('[Frontend] Chưa thể kết nối tới MongoDB, sử dụng mock posts làm fallback:', err);
      }
    };
    fetchMongoPosts();
  }, []);

  const handleLoginSuccess = (user: UserProfile, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('phenikaa_auth_user', JSON.stringify(user));
    localStorage.setItem('phenikaa_auth_token', token);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('phenikaa_auth_user');
    localStorage.removeItem('phenikaa_auth_token');
    alert('Đã đăng xuất tài khoản.');
  };

  // Article reading & Summarization state
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [summarizingPostId, setSummarizingPostId] = useState<string | null>(null);
  const [summaryCache, setSummaryCache] = useState<Record<string, SummaryData>>({});

  // SYNC URL ROUTING: Quản lý URL /post/:id và quay lại /
  useEffect(() => {
    const syncRouteWithState = async () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/post/')) {
        const postId = pathname.replace('/post/', '').trim();
        if (postId) {
          // 1. Tìm trong danh sách posts hiện tại
          const found = posts.find((p) => p.id === postId || (p as any)._id === postId);
          if (found) {
            setReadingPost(found);
            return;
          }

          // 2. Nếu chưa có trong state (ví dụ F5 tải lại trực tiếp từ URL /post/:id), fetch từ API
          try {
            const res = await fetch(`/api/posts/${postId}`);
            const json = await res.json();
            if (res.ok && json.success && json.data) {
              setReadingPost(json.data);
            }
          } catch (err) {
            console.warn('[Routing] Lỗi khi tải bài viết từ URL:', err);
          }
        }
      } else {
        setReadingPost(null);
      }
    };

    syncRouteWithState();

    const handlePopState = () => {
      syncRouteWithState();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [posts]);

  // Timeline: tự động generate từ posts thật, mới nhất lên trước
  const timelineNews: TimelineNewsItem[] = React.useMemo(() => {
    const published = posts.filter((p) => !p.status || p.status === 'published');
    const sorted = [...published].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return sorted.slice(0, 10).map((p) => {
      const date = new Date(p.publishedAt);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeLabel: string;
      if (diffMins < 1) timeLabel = 'Vừa xong';
      else if (diffMins < 60) timeLabel = `${diffMins} phút trước`;
      else if (diffHours < 24) timeLabel = `${diffHours} giờ trước`;
      else if (diffDays < 7) timeLabel = `${diffDays} ngày trước`;
      else timeLabel = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

      return {
        id: p.id,
        time: timeLabel,
        title: p.title,
        category: p.category,
        badge: diffDays < 1 ? 'MỚI' : undefined,
      };
    });
  }, [posts]);

  // ĐỌC NHIỀU NHẤT: tự động tính từ viewsCount thật, sắp xếp giảm dần
  const trendingList = React.useMemo(() => {
    const published = posts.filter((p) => !p.status || p.status === 'published');
    return [...published]
      .sort((a, b) => (b.viewsCount ?? 0) - (a.viewsCount ?? 0))
      .slice(0, 5)
      .map((p, i) => ({
        rank: String(i + 1).padStart(2, '0'),
        id: p.id,
        title: p.title,
        category: p.category,
        views: ((p.viewsCount ?? 0) >= 1000
          ? `${((p.viewsCount ?? 0) / 1000).toFixed(1)}k`
          : String(p.viewsCount ?? 0)) + ' lượt đọc',
      }));
  }, [posts]);
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Tiêu điểm hôm nay: Luôn xuất hiện những bài báo đã đăng mới nhất
  const mainFeatured = posts[0];
  const subFeatured = posts.slice(1);
  const entertainmentPosts = posts.filter((p) => p.category === 'Giải Trí & Đời Sống');
  const techPosts = posts.filter(
    (p) => p.category === 'Công Nghệ & Đổi Mới' || p.category === 'Tin Phenikaa'
  );

  // Handle summarize for any blog post (HIỂN THỊ INLINE NGAY TRÊN TRANG, KHÔNG MỞ POPUP)
  const handleSummarizePost = async (post: BlogPost) => {
    if (summaryCache[post.id]) {
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
    } catch (err: any) {
      alert(`Không thể tạo tóm tắt AI: ${err.message || 'Lỗi kết nối'}`);
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

  // Handle Add Post to MongoDB
  const handleAddPost = async (newPost: BlogPost) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(newPost),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(`[Lỗi ${response.status} ${result.code || ''}]: ${result.error || 'Không thể tạo bài viết.'}`);
        return;
      }

      const createdPost = result.data;
      setPosts((prev) => [createdPost, ...prev]);
      alert('✅ Đã lưu bài viết thành công vào MongoDB!');
    } catch (err: any) {
      alert('Lỗi kết nối khi gửi bài: ' + err.message);
    }
  };

  // Handle Edit Post in MongoDB
  const handleEditPost = async (postId: string, updates: Partial<BlogPost>) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        alert(`[Lỗi ${response.status} ${result.code || ''}]: ${result.error || 'Không thể cập nhật bài viết.'}`);
        return;
      }

      const updatedPost = result.data;
      setPosts((prev) =>
        prev.map((p) => (p.id === postId || (p as any)._id === postId ? { ...p, ...updatedPost } : p))
      );
      if (readingPost && (readingPost.id === postId || (readingPost as any)._id === postId)) {
        setReadingPost((prev) => (prev ? { ...prev, ...updatedPost } : null));
      }
      alert('✅ Cập nhật bài viết thành công trên MongoDB!');
    } catch (err: any) {
      alert('Lỗi cập nhật bài: ' + err.message);
    }
  };

  // Handle Delete Post from MongoDB
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này khỏi MongoDB?')) return;
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        alert(`[Lỗi ${response.status} ${result.code || ''}]: ${result.error}`);
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== postId && (p as any)._id !== postId));
      if (readingPost && (readingPost.id === postId || (readingPost as any)._id === postId)) {
        setReadingPost(null);
      }
      alert('✅ Đã xóa bài viết khỏi MongoDB!');
    } catch (err: any) {
      alert('Lỗi xóa bài: ' + err.message);
    }
  };

  // Handle Add Comment to MongoDB
  const handleAddComment = async (postId: string, comment: CommentItem) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: currentUser ? currentUser.fullName : (comment.userName || comment.author || 'Độc giả ẩn danh'),
          userRole: currentUser
            ? (currentUser.role === 'admin' ? 'Ban Quản Trị' : 'Độc Giả Phenikaa')
            : (comment.role || 'Độc Giả Phenikaa'),
          content: comment.text || (comment as any).content,
        }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        const saved = result.data;
        const mappedComment: CommentItem = {
          id: saved.id || `c-${Date.now()}`,
          author: saved.userName,
          role: saved.userRole,
          text: saved.content,
          createdAt: 'Vừa xong',
          likes: 0,
        };
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId || (p as any)._id === postId
              ? { ...p, comments: [mappedComment, ...(p.comments || [])] } : p
          )
        );
        if (readingPost && (readingPost.id === postId || (readingPost as any)._id === postId)) {
          setReadingPost((prev) => prev ? { ...prev, comments: [mappedComment, ...(prev.comments || [])] } : null);
        }
        return;
      }
    } catch (err) {
      console.warn('Comment sync failed, local update:', err);
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId || (p as any)._id === postId
          ? { ...p, comments: [comment, ...(p.comments || [])] } : p
      )
    );
    if (readingPost && (readingPost.id === postId || (readingPost as any)._id === postId)) {
      setReadingPost((prev) => prev ? { ...prev, comments: [comment, ...(prev.comments || [])] } : null);
    }
  };

  // Handle Reaction Click (optimistic + background MongoDB sync)
  const handleReact = (postId: string, reactionType: 'like' | 'heart' | 'haha' | 'wow' | 'sad') => {
    fetch(`/api/posts/${postId}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: reactionType }),
    }).catch((e) => console.warn('Sync reaction failed:', e));

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId || (p as any)._id === postId) {
          return {
            ...p,
            reactions: { ...p.reactions, [reactionType]: ((p.reactions?.[reactionType]) || 0) + 1 },
          };
        }
        return p;
      })
    );
    if (readingPost && (readingPost.id === postId || (readingPost as any)._id === postId)) {
      setReadingPost((prev) =>
        prev
          ? { ...prev, reactions: { ...prev.reactions, [reactionType]: ((prev.reactions?.[reactionType]) || 0) + 1 } }
          : null
      );
    }
  };

  const handleOpenPost = (post: BlogPost) => {
    const targetId = post.id || (post as any)._id;
    // Tăng lượt đọc thật trên MongoDB và cập nhật local state
    fetch(`/api/posts/${targetId}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.success && result.data) {
          const updated = { ...result.data, id: targetId };
          setPosts((prev) =>
            prev.map((p) => (p.id === targetId || (p as any)._id === targetId ? updated : p))
          );
          setReadingPost(updated);
        }
      })
      .catch(() => {/* fallback: vẫn hiển thị bài bình thường */});

    setReadingPost(post);
    if (window.location.pathname !== `/post/${targetId}`) {
      window.history.pushState(null, '', `/post/${targetId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setReadingPost(null);
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CHỈ ADMIN MỚI ĐƯỢC THẤY NÚT ĐĂNG BÀI & QUẢN TRỊ CMS
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#ff6b00] selection:text-white">
      {/* 1. TOP BAR */}
      <TopBar
        onOpenCMS={() => setIsCMSOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. HEADER */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 3. STICKY PHENIKAA NAVIGATION MENU */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          if (readingPost) {
            handleBackToHome();
          }
        }}
        onOpenCMS={() => setIsCMSOpen(true)}
        canManageCMS={isAdmin}
      />

      {/* 4. MAIN CONTENT AREA: CHUYỂN ĐỔI GIỮA TRANG CHI TIẾT BÀI BÁO VÀ TRANG CHỦ */}
      {readingPost ? (
        /* TRANG CHI TIẾT BÀI BÁO (DEDICATED FULL PAGE VIEW) */
        <ArticleDetailPage
          post={readingPost}
          onBackToHome={handleBackToHome}
          onSelectPost={handleOpenPost}
          relatedPosts={posts.filter((p) => p.category === readingPost.category && p.id !== readingPost.id)}
          summaryData={summaryCache[readingPost.id]}
          isSummarizing={summarizingPostId === readingPost.id}
          onSummarize={handleSummarizePost}
          onAddComment={handleAddComment}
          onReact={handleReact}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      ) : (
        /* TRANG CHỦ DANH SÁCH BÀI BÁO (LƯỚI 3 CỘT: 2/3 NỘI DUNG CHÍNH + 1/3 SIDEBAR) */
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
                className="text-xs font-semibold text-[#00529C] hover:text-[#ff6b00] flex items-center gap-1 cursor-pointer"
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
                    onReadPost={handleOpenPost}
                    onSummarizePost={handleOpenPost}
                    summarizingPostId={summarizingPostId}
                    summaryCache={summaryCache}
                  />

                  {/* B. Khối Chuyên Mục "Giải Trí Phenikaa" (Card View) */}
                  <EntertainmentSection
                    posts={entertainmentPosts.slice(0, 3)}
                    onReadPost={handleOpenPost}
                    onSummarizePost={handleOpenPost}
                  />

                  {/* C. Khối Chuyên Mục "Tin Tức & Công Nghệ" (Media List View) */}
                  <NewsTechList
                    posts={techPosts.slice(0, 4)}
                    onReadPost={handleOpenPost}
                    onSummarizePost={handleOpenPost}
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
                      onReadPost={handleOpenPost}
                      onSummarizePost={handleOpenPost}
                    />
                  )}
                </div>
              )}
            </div>

            {/* CỘT PHẢI - SIDEBAR (CHIẾM 1/3 CHIỀU RỘNG - 4 CỘT) */}
            <div className="lg:col-span-4">
              <Sidebar247
                timelineNews={timelineNews}
                trendingList={trendingList}
                onSelectPostById={(id) => {
                  const found = posts.find((p) => p.id === id || (p as any)._id === id);
                  if (found) handleOpenPost(found);
                }}
              />
            </div>
          </div>
        </main>
      )}

      {/* 5. FOOTER */}
      <Footer
        onOpenCMS={() => setIsCMSOpen(true)}
        isAdmin={isAdmin}
      />

      {/* MODAL 1: Admin CMS Panel - CHỈ DÀNH CHO ADMIN */}
      <AdminCMSModal
        isOpen={isCMSOpen}
        onClose={() => setIsCMSOpen(false)}
        posts={posts}
        onAddPost={handleAddPost}
        onDeletePost={handleDeletePost}
        onEditPost={handleEditPost}
        onSummarizeText={handleSummarizeTextOnly}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* MODAL 2: Authentication - Đăng nhập / Đăng ký */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
