import React from 'react';
import { Film, Sparkles, Heart, MessageCircle, ArrowRight, Share2, Music } from 'lucide-react';
import { BlogPost } from '../types/blog.ts';

interface EntertainmentSectionProps {
  posts: BlogPost[];
  onReadPost: (post: BlogPost) => void;
  onSummarizePost: (post: BlogPost) => void;
}

export const EntertainmentSection: React.FC<EntertainmentSectionProps> = ({
  posts,
  onReadPost,
  onSummarizePost,
}) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-orange-500 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6b00] flex items-center justify-center border border-orange-200">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif font-extrabold text-lg sm:text-xl text-[#003366] tracking-tight">
              GIẢI TRÍ & ĐỜI SỐNG PHENIKAA
            </h2>
            <p className="text-[11px] text-slate-500">
              Sự kiện, CLB, âm nhạc, văn hóa giới trẻ và nhịp sống sinh viên
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#ff6b00] hover:underline cursor-pointer flex items-center gap-1">
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image Thumbnail */}
              <div
                onClick={() => onReadPost(post)}
                className="relative h-44 w-full overflow-hidden cursor-pointer bg-slate-200"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#ff6b00] text-white shadow-sm flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{post.publishedAt}</span>
                  <span>{post.readTime}</span>
                </div>

                <h3
                  onClick={() => onReadPost(post)}
                  className="font-serif font-bold text-sm sm:text-base text-slate-800 group-hover:text-[#00529C] line-clamp-2 leading-snug cursor-pointer"
                >
                  {post.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-0 border-t border-slate-200/60 mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-rose-500">
                  <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
                  {post.reactions.heart + post.reactions.like}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {post.comments.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onSummarizePost(post)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors flex items-center gap-1"
                  title="Tóm tắt nội dung bài này bằng AI"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Tóm tắt AI</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
