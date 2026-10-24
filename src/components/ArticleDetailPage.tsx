import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Sparkles,
  Loader2,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  ThumbsUp,
  Heart,
  Smile,
  Zap,
  Frown,
  BookOpen,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { BlogPost, CommentItem } from '../types/blog.ts';
import { SummaryData } from '../types/blog.ts';
import { UserProfile } from './AuthModal.tsx';

interface ArticleDetailPageProps {
  post: BlogPost;
  onBackToHome: () => void;
  onSelectPost: (post: BlogPost) => void;
  relatedPosts: BlogPost[];
  summaryData?: SummaryData | null;
  isSummarizing: boolean;
  onSummarize: (post: BlogPost) => void;
  onAddComment: (postId: string, comment: CommentItem) => void;
  onReact: (postId: string, reactionType: 'like' | 'heart' | 'haha' | 'wow' | 'sad') => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  post,
  onBackToHome,
  onSelectPost,
  relatedPosts,
  summaryData,
  isSummarizing,
  onSummarize,
  onAddComment,
  onReact,
  currentUser,
  onOpenAuth,
}) => {
  const [commentName, setCommentName] = useState(currentUser ? currentUser.fullName : '');
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    const authorName = currentUser ? currentUser.fullName : (commentName.trim() || 'Độc giả Phenikaa');
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `comment-${Date.now()}`,
      author: authorName,
      role: currentUser
        ? (currentUser.role === 'admin' ? 'Ban Quản Trị' : 'Người Dùng')
        : 'Độc giả Phenikaa',
      text: commentText.trim(),
      createdAt: 'Vừa xong',
      likes: 0,
    };

    onAddComment(post.id, newComment);
    setCommentText('');
  };

  const handleCopyLink = () => {
    const url = window.location.origin + `?post=${post.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySummary = () => {
    if (!summaryData) return;
    const text = `【TÓM TẮT BÀI BÁO BỞI AI】\n${summaryData.headline}\n\nÝ chính:\n${summaryData.bulletPoints.map((b: string, i: number) => `${i + 1}. ${b}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleSocialShare = (platform: 'Facebook' | 'Zalo') => {
    setShareToast(`Đã sao chép liên kết để chia sẻ lên ${platform}!`);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setShareToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20">
      {/* Toast thông báo */}
      {shareToast && (
        <div className="fixed top-16 right-6 z-50 bg-[#003366] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 animate-in fade-in flex items-center gap-2">
          <span>{shareToast}</span>
        </div>
      )}

      {/* TOP NAVIGATION / BREADCRUMBS BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00529C] hover:text-[#ff6b00] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại trang chủ</span>
          </button>

          {/* Breadcrumb rút gọn */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="cursor-pointer hover:text-slate-800" onClick={onBackToHome}>Trang chủ</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#ff6b00] font-medium">{post.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-700 font-medium truncate max-w-xs">{post.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Sao chép liên kết bài viết"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Đã chép link' : 'Chép link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* ARTICLE HEADER */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ff6b00] text-white uppercase tracking-wider shadow-xs">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {post.publishedAt}
            </span>
          </div>

          <h1 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-slate-900 leading-[1.25] tracking-tight">
            {post.title}
          </h1>

          {/* Author & Meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-3 pb-3 border-y border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#003366] to-[#00529C] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {post.author ? post.author.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <span className="font-bold text-[#00529C] block text-[13px]">{post.author}</span>
                {post.authorRole && (
                  <span className="text-slate-500 text-[11px] block">{post.authorRole}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1" title="Thời gian đọc ước tính">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {post.readTime || '3 phút đọc'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1" title="Lượt xem bài viết">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {Number((post.viewsCount ?? 1250)).toLocaleString('vi-VN')} lượt đọc
              </span>
              <span>•</span>
              <span className="flex items-center gap-1" title="Bình luận">
                <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                {post.comments ? post.comments.length : 0} thảo luận
              </span>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* KHỐI TÓM TẮT BẰNG AI (INLINE NGAY TRÊN TRANG, KHÔNG MỞ BẤT KỲ CỬA SỔ NÀO) */}
        {/* ========================================================================= */}
        <section
          id="ai-summary-box"
          className="relative rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-amber-100/40 border-2 border-amber-300/80 p-5 sm:p-6 shadow-sm overflow-hidden"
        >
          {/* Header khối AI */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200/70">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-black text-base text-[#003366] flex items-center gap-1.5">
                  <span>Tóm Tắt Bằng Trí Tuệ Nhân Tạo (Gemini AI)</span>
                  <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 border border-amber-400/40">
                    Gemini 2.5 Flash
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Trích xuất 3 ý chính cốt lõi trong 30 giây giúp bạn nắm trọn nội dung bài viết
                </p>
              </div>
            </div>

            {/* Nút kích hoạt tóm tắt hoặc tóm tắt lại */}
            <div className="flex items-center gap-2">
              {summaryData && (
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 border border-amber-300/60 transition-colors shadow-xs cursor-pointer font-medium"
                  title="Sao chép nội dung tóm tắt"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Đã sao chép' : 'Sao chép ý chính'}</span>
                </button>
              )}

              <button
                onClick={() => onSummarize(post)}
                disabled={isSummarizing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#ff6b00] to-[#e05e00] hover:from-[#e05e00] hover:to-[#c45200] text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSummarizing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI đang phân tích...</span>
                  </>
                ) : summaryData ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tóm tắt lại</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tóm tắt bài này bằng AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Vùng hiển thị kết quả tóm tắt trực tiếp trên trang */}
          <div className="pt-4">
            {isSummarizing ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3 text-center animate-in fade-in">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif font-bold text-slate-800 text-sm">
                    Gemini AI đang đọc hiểu toàn bộ nội dung bài báo...
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Đang phân tích cấu trúc câu và tổng hợp 3 luận điểm quan trọng nhất
                  </p>
                </div>
              </div>
            ) : summaryData ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Headline tóm tắt */}
                <div className="bg-white/85 p-3.5 rounded-xl border border-amber-200 shadow-xs">
                  <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    Thông điệp chủ đạo:
                  </p>
                  <p className="font-serif font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    "{summaryData.headline}"
                  </p>
                </div>

                {/* 3 ý chính bullet points */}
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    3 Điểm cốt lõi độc giả cần biết:
                  </p>
                  <div className="space-y-2">
                    {(summaryData.bulletPoints || []).map((point: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-white/70 hover:bg-white p-3 rounded-xl border border-amber-200/60 transition-colors shadow-2xs"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-tr from-[#ff6b00] to-amber-500 text-white font-bold text-xs flex items-center justify-center mt-0.5 shadow-xs">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thống kê tiết kiệm thời gian */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-amber-200/60 font-mono">
                  <div className="flex items-center gap-3">
                    <span>
                      Thời gian đọc tóm tắt: <strong className="text-amber-700">{(summaryData as any).estimatedReadTime || (summaryData.metrics?.estimatedReadTimeSavedMin ? `${summaryData.metrics.estimatedReadTimeSavedMin} phút` : '30 giây')}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Độ nén thông tin: <strong className="text-emerald-700">{(summaryData as any).compressionRate || (summaryData.metrics?.compressionRatio ? `${Math.round(summaryData.metrics.compressionRatio * 100)}%` : '78%')}</strong>
                    </span>
                  </div>
                  <span className="text-slate-400">Được tối ưu bởi Phenikaa Gemini AI API</span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs text-slate-600 mb-2">
                  Bạn bận rộn? Hãy để trí tuệ nhân tạo Gemini đọc nhanh và trích xuất 3 ý chính của bài viết này.
                </p>
                <button
                  onClick={() => onSummarize(post)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#003366] hover:bg-[#004080] text-white shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bấm vào đây để tóm tắt ngay</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ẢNH BÌA BÀI VIẾT */}
        {post.coverImage && (
          <figure className="space-y-2">
            <div className="rounded-2xl overflow-hidden max-h-[500px] w-full bg-slate-100 shadow-md">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="text-center text-xs text-slate-500 italic">
              Hình ảnh minh họa: {post.title} (Nguồn: Truyền thông Đại học Phenikaa)
            </figcaption>
          </figure>
        )}

        {/* SAPO / TRÍCH ĐOẠN ĐẦU BÀI */}
        {post.excerpt && (
          <div className="font-serif text-base sm:text-lg font-bold text-slate-800 leading-relaxed bg-white p-5 rounded-2xl border-l-4 border-[#ff6b00] shadow-xs">
            {post.excerpt}
          </div>
        )}

        {/* NỘI DUNG CHI TIẾT BÀI VIẾT */}
        <article className="space-y-5 text-slate-800 leading-[1.8] text-base sm:text-[17px] font-sans pt-2">
          {(post.content || '').split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="first-letter:text-xl font-normal text-justify sm:text-left">
              {paragraph}
            </p>
          ))}
        </article>

        {/* THẺ TAGS */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Chủ đề:</span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 px-3 py-1 rounded-full border border-slate-200 transition-colors shadow-2xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* KHU VỰC CẢM XÚC (REACTIONS) & CHIA SẺ */}
        <section className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 mr-1">Cảm xúc của bạn:</span>

            <button
              onClick={() => onReact(post.id, 'like')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-xs transition-all shadow-2xs cursor-pointer group"
              title="Thích"
            >
              <span className="group-hover:scale-125 transition-transform">👍</span>
              <span className="font-bold text-slate-700 group-hover:text-blue-600">{post.reactions?.like || 0}</span>
            </button>

            <button
              onClick={() => onReact(post.id, 'heart')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-400 text-xs transition-all shadow-2xs cursor-pointer group"
              title="Yêu thích"
            >
              <span className="group-hover:scale-125 transition-transform">❤️</span>
              <span className="font-bold text-slate-700 group-hover:text-rose-600">{post.reactions?.heart || 0}</span>
            </button>

            <button
              onClick={() => onReact(post.id, 'haha')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-xs transition-all shadow-2xs cursor-pointer group"
              title="Haha"
            >
              <span className="group-hover:scale-125 transition-transform">😂</span>
              <span className="font-bold text-slate-700 group-hover:text-amber-600">{post.reactions?.haha || 0}</span>
            </button>

            <button
              onClick={() => onReact(post.id, 'wow')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-400 text-xs transition-all shadow-2xs cursor-pointer group"
              title="Wow"
            >
              <span className="group-hover:scale-125 transition-transform">😮</span>
              <span className="font-bold text-slate-700 group-hover:text-purple-600">{post.reactions?.wow || 0}</span>
            </button>

            <button
              onClick={() => onReact(post.id, 'sad')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 text-xs transition-all shadow-2xs cursor-pointer group"
              title="Buồn"
            >
              <span className="group-hover:scale-125 transition-transform">😢</span>
              <span className="font-bold text-slate-700">{post.reactions?.sad || 0}</span>
            </button>
          </div>

          {/* Social share */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Chia sẻ:</span>
            <button
              onClick={() => handleSocialShare('Facebook')}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              Facebook
            </button>
            <button
              onClick={() => handleSocialShare('Zalo')}
              className="px-2.5 py-1 rounded-lg bg-[#0068ff] hover:bg-[#0057d6] text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              Zalo
            </button>
          </div>
        </section>

        {/* KHU VỰC BÌNH LUẬN & THẢO LUẬN */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-5 h-5 text-[#ff6b00]" />
              <h3 className="font-serif font-black text-lg text-[#003366]">
                Thảo Luận ({post.comments ? post.comments.length : 0})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:block">Văn minh • Tôn trọng • Xây dựng</span>
          </div>

          {/* Form gửi bình luận */}
          <form onSubmit={handleSendComment} className="space-y-4 bg-gradient-to-br from-slate-50 to-blue-50/30 p-5 rounded-2xl border border-slate-200">
            {/* Thông tin người gửi */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                {currentUser
                  ? currentUser.fullName.charAt(0).toUpperCase()
                  : (commentName.trim() ? commentName.charAt(0).toUpperCase() : '?')}
              </div>
              <div className="flex-1 min-w-0">
                {currentUser ? (
                  <div>
                    <p className="font-bold text-sm text-slate-800">{currentUser.fullName}</p>
                    <p className="text-[11px] text-[#00529C] font-semibold">
                      {currentUser.role === 'admin' ? 'Ban Quản Trị' : 'Người Dùng'}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder="Nhập tên của bạn..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00529C]/30 focus:border-[#00529C] transition-all"
                    />
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="shrink-0 px-3 py-2 rounded-xl bg-[#00529C] text-white text-xs font-bold hover:bg-[#003f7a] transition-colors cursor-pointer"
                    >
                      Đăng nhập
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Ô nhập nội dung */}
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Chia sẻ ý kiến của bạn về bài viết này..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#00529C]/30 focus:border-[#00529C] resize-none leading-relaxed placeholder:text-slate-400 transition-all"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{commentText.length}/500 ký tự</span>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#003366] hover:bg-[#004080] text-white shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Gửi bình luận</span>
              </button>
            </div>
          </form>

          {/* Danh sách bình luận */}
          <div className="space-y-3">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, idx) => {
                // Hỗ trợ cả 2 dạng field:
                // - MongoDB API trả về: userName, userRole, content
                // - Dữ liệu cũ/local: author, role, text
                const displayName = (comment as any).userName || comment.author || 'Độc giả Phenikaa';
                const displayRole = (comment as any).userRole || comment.role || '';
                const displayText = (comment as any).content || comment.text || '';
                const rawDate = comment.createdAt || '';

                // Format thời gian thật từ ISO date
                let displayTime = 'Vừa xong';
                if (rawDate && rawDate !== 'Vừa xong') {
                  try {
                    const d = new Date(rawDate);
                    const now = new Date();
                    const diffMs = now.getTime() - d.getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMins / 60);
                    const diffDays = Math.floor(diffHours / 24);
                    if (diffMins < 1) displayTime = 'Vừa xong';
                    else if (diffMins < 60) displayTime = `${diffMins} phút trước`;
                    else if (diffHours < 24) displayTime = `${diffHours} giờ trước`;
                    else if (diffDays < 7) displayTime = `${diffDays} ngày trước`;
                    else displayTime = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  } catch {
                    displayTime = rawDate;
                  }
                }

                const avatarColors = ['#003366', '#00529C', '#d97706', '#059669', '#7c3aed', '#dc2626'];
                const avatarBg = avatarColors[idx % avatarColors.length];

                return (
                  <div
                    key={comment.id || idx}
                    className="flex gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-white transition-all"
                  >
                    {/* Avatar chữ cái */}
                    <div
                      className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm"
                      style={{ backgroundColor: avatarBg }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>

                    {/* Nội dung bình luận */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1.5">
                        <span className="font-bold text-sm text-slate-800">{displayName}</span>
                        {displayRole && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-[#00529C] font-semibold">
                            {displayRole}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 ml-auto font-mono shrink-0">{displayTime}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{displayText}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">Chưa có bình luận nào.</p>
                <p className="text-xs text-slate-300 mt-1">Hãy là người đầu tiên để lại ý kiến!</p>
              </div>
            )}
          </div>
        </section>


        {/* BÀI VIẾT LIÊN QUAN / CÙNG CHUYÊN MỤC */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b-2 border-[#003366] pb-2">
              <h3 className="font-serif font-black text-lg text-[#003366]">
                Bài Viết Cùng Chuyên Mục
              </h3>
              <button
                onClick={onBackToHome}
                className="text-xs text-[#00529C] hover:text-[#ff6b00] font-semibold cursor-pointer"
              >
                Xem tất cả tin tức →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.slice(0, 3).map((relPost) => (
                <div
                  key={relPost.id}
                  onClick={() => {
                    onSelectPost(relPost);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-36 overflow-hidden bg-slate-100">
                      <img
                        src={relPost.coverImage}
                        alt={relPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5">
                      <span className="text-[10px] font-bold text-[#ff6b00] uppercase">
                        {relPost.category}
                      </span>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#00529C] transition-colors line-clamp-2 leading-snug">
                        {relPost.title}
                      </h4>
                    </div>
                  </div>
                  <div className="px-3.5 pb-3 pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                    <span>{relPost.publishedAt}</span>
                    <span className="text-[#00529C] font-semibold group-hover:translate-x-0.5 transition-transform">Đọc bài →</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
