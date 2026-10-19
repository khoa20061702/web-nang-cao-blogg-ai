import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Sparkles,
  Loader2,
  ArrowLeft,
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
} from 'lucide-react';
import { BlogPost, CommentItem } from '../types/blog.ts';

interface FullArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSummarize: (post: BlogPost) => void;
  isSummarizing: boolean;
  onAddComment: (postId: string, comment: CommentItem) => void;
  onReact: (postId: string, reactionType: 'like' | 'heart' | 'haha' | 'wow' | 'sad') => void;
}

export const FullArticleModal: React.FC<FullArticleModalProps> = ({
  post,
  onClose,
  onSummarize,
  isSummarizing,
  onAddComment,
  onReact,
}) => {
  const [commentName, setCommentName] = useState('');
  const [commentRole, setCommentRole] = useState('Sinh viên Phenikaa');
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  if (!post) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment: CommentItem = {
      id: `comment-${Date.now()}`,
      author: commentName.trim(),
      role: commentRole.trim(),
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

  const handleSocialShare = (platform: 'Facebook' | 'Zalo') => {
    setShareToast(`Đã mở liên kết chia sẻ lên ${platform}!`);
    setTimeout(() => setShareToast(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-800 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-[#003366] text-white">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quay lại trang chính</span>
            <span className="sm:hidden">Quay lại</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSummarize(post)}
              disabled={isSummarizing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm transition-all disabled:opacity-50"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang tóm tắt...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tóm tắt bài này bằng AI</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#004080] transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Body Container */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          {/* Share Toast */}
          {shareToast && (
            <div className="fixed top-16 right-6 z-50 bg-[#003366] text-white text-xs px-4 py-2 rounded-xl shadow-lg border border-slate-700 animate-in fade-in">
              {shareToast}
            </div>
          )}

          {/* Article Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#ff6b00] text-white">
                {post.category}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">{post.publishedAt}</span>
            </div>

            <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-y border-slate-100 py-2.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#00529C]">{post.author}</span>
                {post.authorRole && (
                  <>
                    <span>-</span>
                    <span className="text-slate-400">{post.authorRole}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {post.readTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                  {post.comments.length} bình luận
                </span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden max-h-96 w-full bg-slate-100 shadow-md">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sapo / Excerpt */}
          <p className="font-serif text-base sm:text-lg font-bold text-slate-800 leading-relaxed italic bg-slate-50 p-4 rounded-xl border-l-4 border-[#ff6b00]">
            "{post.excerpt}"
          </p>

          {/* Full Paragraphs */}
          <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base font-sans">
            {post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-1.5">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* INTERACTIVE REACTIONS & SOCIAL SHARE BAR */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Reaction buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1">Cảm xúc:</span>

              <button
                onClick={() => onReact(post.id, 'like')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-xs transition-colors shadow-xs"
                title="Thích"
              >
                <span>👍</span>
                <span className="font-semibold">{post.reactions.like}</span>
              </button>

              <button
                onClick={() => onReact(post.id, 'heart')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-400 hover:text-rose-600 text-xs transition-colors shadow-xs"
                title="Yêu thích"
              >
                <span>❤️</span>
                <span className="font-semibold">{post.reactions.heart}</span>
              </button>

              <button
                onClick={() => onReact(post.id, 'haha')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 text-xs transition-colors shadow-xs"
                title="Haha"
              >
                <span>😂</span>
                <span className="font-semibold">{post.reactions.haha}</span>
              </button>

              <button
                onClick={() => onReact(post.id, 'wow')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-purple-400 hover:text-purple-600 text-xs transition-colors shadow-xs"
                title="Wow"
              >
                <span>😮</span>
                <span className="font-semibold">{post.reactions.wow}</span>
              </button>

              <button
                onClick={() => onReact(post.id, 'sad')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-400 text-xs transition-colors shadow-xs"
                title="Buồn"
              >
                <span>😢</span>
                <span className="font-semibold">{post.reactions.sad}</span>
              </button>
            </div>

            {/* Quick Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Chia sẻ:</span>

              <button
                onClick={() => handleSocialShare('Facebook')}
                className="px-2.5 py-1 rounded-lg bg-[#1877F2] text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
              >
                Facebook
              </button>

              <button
                onClick={() => handleSocialShare('Zalo')}
                className="px-2.5 py-1 rounded-lg bg-[#0068FF] text-white text-xs font-semibold hover:bg-blue-600 transition-colors shadow-xs"
              >
                Zalo
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs font-medium transition-colors"
                title="Sao chép liên kết bài viết"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Đã copy' : 'Copy link'}</span>
              </button>
            </div>
          </div>

          {/* Bottom AI Summarize Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#ff6b00]" />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Bạn bận rộn? Hãy để Google Gemini 3.8 Flash tóm tắt bài này!
                </p>
                <p className="text-[11px] text-slate-500">
                  Chỉ mất 2 giây để nhận 3 gạch đầu dòng then chốt và kết luận trọng tâm.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSummarize(post)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#ff6b00] hover:bg-[#e05e00] text-white transition-colors shrink-0 shadow-xs"
            >
              Tóm tắt ngay
            </button>
          </div>

          {/* COMMENT SECTION */}
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#00529C]" />
                <span>Ý Kiến Độc Giả & Sinh Viên ({post.comments.length})</span>
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSendComment} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Họ và tên của bạn..."
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#00529C] bg-white"
                />
                <input
                  type="text"
                  value={commentRole}
                  onChange={(e) => setCommentRole(e.target.value)}
                  placeholder="Khóa / Khoa hoặc Đơn vị..."
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#00529C] bg-white"
                />
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Chia sẻ ý kiến hoặc bình luận của bạn về bài viết này..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#00529C] bg-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#00529C] hover:bg-[#00386b] text-white transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi bình luận</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {post.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ của bạn!
                </p>
              ) : (
                post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{comment.author}</span>
                        {comment.role && (
                          <span className="text-[10px] text-[#00529C] font-semibold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            {comment.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
