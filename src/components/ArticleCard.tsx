import React from 'react';
import { Clock, User, Calendar, Sparkles, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { BlogPost, SummaryData } from '../types/blog.ts';

interface ArticleCardProps {
  post: BlogPost;
  onSummarize: (post: BlogPost) => void;
  onReadFull: (post: BlogPost) => void;
  isSummarizing: boolean;
  cachedSummary?: SummaryData;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  post,
  onSummarize,
  onReadFull,
  isSummarizing,
  cachedSummary,
}) => {
  const categoryColors: Record<string, string> = {
    'Công nghệ': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Kinh tế': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Đời sống': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Global Tech': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <article className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg hover:border-stone-700 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Cover Image & Category Badge */}
        <div className="relative h-48 w-full overflow-hidden bg-stone-950">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80" />
          <div className="absolute top-3 left-3">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md border backdrop-blur-md ${
                categoryColors[post.category] || 'bg-stone-800 text-stone-300 border-stone-700'
              }`}
            >
              {post.category}
            </span>
          </div>
          {cachedSummary && (
            <div className="absolute top-3 right-3 bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Đã tóm tắt AI
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 text-xs text-stone-400">
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

          <h3
            onClick={() => onReadFull(post)}
            className="font-serif font-bold text-lg text-stone-100 hover:text-amber-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {post.title}
          </h3>

          <p className="text-sm text-stone-400 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] text-stone-400 bg-stone-800/60 px-2 py-0.5 rounded border border-stone-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-5 pt-0 mt-2 flex items-center gap-2 border-t border-stone-800/80 pt-4">
        <button
          onClick={() => onSummarize(post)}
          disabled={isSummarizing}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow transition-all disabled:opacity-50"
        >
          {isSummarizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang tóm tắt...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Tóm tắt bằng AI</span>
            </>
          )}
        </button>

        <button
          onClick={() => onReadFull(post)}
          className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-stone-800 hover:bg-stone-750 text-stone-300 transition-colors flex items-center gap-1"
        >
          <span>Đọc</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
