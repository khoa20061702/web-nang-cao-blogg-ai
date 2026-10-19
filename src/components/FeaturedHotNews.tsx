import React from 'react';
import { Sparkles, Clock, Calendar, ArrowRight, Eye, Flame, Loader2 } from 'lucide-react';
import { BlogPost, SummaryData } from '../types/blog.ts';

interface FeaturedHotNewsProps {
  mainFeatured: BlogPost;
  subFeaturedList: BlogPost[];
  onReadPost: (post: BlogPost) => void;
  onSummarizePost: (post: BlogPost) => void;
  summarizingPostId: string | null;
  summaryCache: Record<string, SummaryData>;
}

export const FeaturedHotNews: React.FC<FeaturedHotNewsProps> = ({
  mainFeatured,
  subFeaturedList,
  onReadPost,
  onSummarizePost,
  summarizingPostId,
  summaryCache,
}) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-[#ff6b00] rounded-sm"></div>
          <h2 className="font-serif font-extrabold text-xl sm:text-2xl text-[#003366] tracking-tight flex items-center gap-2">
            <span>TIÊU ĐIỂM HÔM NAY</span>
            <span className="flex items-center gap-1 text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
              <Flame className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
              HOT NEWS
            </span>
          </h2>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Cập nhật liên tục 24/7 từ Phenikaa Media
        </span>
      </div>

      {/* 01 BÀI VIẾT TIÊU ĐIỂM LỚN NHẤT */}
      {mainFeatured && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center group">
          {/* Large Image Banner */}
          <div
            onClick={() => onReadPost(mainFeatured)}
            className="lg:col-span-7 relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden cursor-pointer shadow-md bg-slate-100"
          >
            <img
              src={mainFeatured.coverImage}
              alt={mainFeatured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-[#ff6b00] text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide shadow-md">
                Tiêu Điểm
              </span>
              <span className="bg-[#00529C]/90 text-white text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">
                {mainFeatured.category}
              </span>
            </div>

            {summaryCache[mainFeatured.id] && (
              <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" />
                Đã có tóm tắt AI
              </div>
            )}
          </div>

          {/* Text & Content */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="font-semibold text-[#00529C]">{mainFeatured.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {mainFeatured.readTime}
              </span>
              {mainFeatured.viewsCount && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {mainFeatured.viewsCount.toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <h3
              onClick={() => onReadPost(mainFeatured)}
              className="font-serif font-black text-xl sm:text-2xl text-slate-900 hover:text-[#00529C] cursor-pointer transition-colors leading-tight"
            >
              {mainFeatured.title}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
              {mainFeatured.excerpt}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => onSummarizePost(mainFeatured)}
                disabled={summarizingPostId === mainFeatured.id}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm transition-all disabled:opacity-50"
              >
                {summarizingPostId === mainFeatured.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tóm tắt AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tóm tắt bài này bằng AI</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onReadPost(mainFeatured)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <span>Đọc bài viết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 04 BÀI VIẾT TIÊU ĐIỂM PHỤ (Grid 4 cột bên dưới) */}
      <div className="pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Tin Nổi Bật Khác
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subFeaturedList.slice(0, 4).map((post) => (
            <div
              key={post.id}
              className="group flex flex-col justify-between bg-slate-50 hover:bg-orange-50/40 p-3 rounded-xl border border-slate-200/80 hover:border-orange-200 transition-all cursor-pointer"
              onClick={() => onReadPost(post)}
            >
              <div>
                <div className="relative h-32 rounded-lg overflow-hidden mb-2.5 bg-slate-200">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#00529C]/90 text-white">
                    {post.category}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-800 group-hover:text-[#00529C] line-clamp-2 leading-snug">
                  {post.title}
                </h4>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-200/60">
                <span>{post.publishedAt.split(' ')[0]}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSummarizePost(post);
                  }}
                  className="text-[#ff6b00] hover:underline font-semibold flex items-center gap-0.5"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Tóm tắt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
