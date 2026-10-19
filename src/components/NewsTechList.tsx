import React from 'react';
import { Lightbulb, Sparkles, Clock, ArrowRight, User } from 'lucide-react';
import { BlogPost } from '../types/blog.ts';

interface NewsTechListProps {
  posts: BlogPost[];
  onReadPost: (post: BlogPost) => void;
  onSummarizePost: (post: BlogPost) => void;
}

export const NewsTechList: React.FC<NewsTechListProps> = ({
  posts,
  onReadPost,
  onSummarizePost,
}) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#00529C] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00529C] flex items-center justify-center border border-blue-200">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif font-extrabold text-lg sm:text-xl text-[#003366] tracking-tight">
              TIN TỨC, CÔNG NGHỆ & ĐỔI MỚI SÁNG TẠO
            </h2>
            <p className="text-[11px] text-slate-500">
              Nghiên cứu khoa học, xe tự hành Phenikaa-X, Chip bán dẫn và học thuật
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#00529C] hover:underline cursor-pointer flex items-center gap-1">
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* List layout: Left image, Right text */}
      <div className="divide-y divide-slate-100 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-4 items-start group cursor-pointer"
            onClick={() => onReadPost(post)}
          >
            {/* Left Image */}
            <div className="relative w-full sm:w-52 h-36 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-sm">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#003366]/90 text-white">
                {post.category}
              </span>
            </div>

            {/* Right Content */}
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#00529C]" />
                  {post.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
                <span>•</span>
                <span>{post.publishedAt}</span>
              </div>

              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#00529C] transition-colors leading-snug line-clamp-2">
                {post.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Action tags & button */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSummarizePost(post);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Tóm tắt bài này bằng AI</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
