import React from 'react';
import { X, Calendar, Clock, User, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { BlogPost } from '../types/blog.ts';

interface FullArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSummarize: (post: BlogPost) => void;
  isSummarizing: boolean;
}

export const FullArticleModal: React.FC<FullArticleModalProps> = ({
  post,
  onClose,
  onSummarize,
  isSummarizing,
}) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-stone-100 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSummarize(post)}
              disabled={isSummarizing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 transition-all disabled:opacity-50"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang tóm tắt...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tóm tắt bài viết này</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-800 text-amber-400 border border-stone-700">
              {post.category}
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-100 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden max-h-72 w-full bg-stone-950">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Excerpt Lead */}
          <p className="font-serif text-base sm:text-lg text-stone-300 font-medium leading-relaxed italic border-l-2 border-amber-500 pl-4 py-1">
            "{post.excerpt}"
          </p>

          {/* Full content paragraphs */}
          <div className="space-y-4 text-stone-300 leading-relaxed text-sm sm:text-base font-sans">
            {post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-stone-800 flex flex-wrap gap-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-stone-400 bg-stone-950 px-2.5 py-1 rounded-md border border-stone-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
