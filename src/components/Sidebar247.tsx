import React from 'react';
import { Clock, TrendingUp, Eye } from 'lucide-react';
import { TimelineNewsItem } from '../types/blog.ts';

interface Sidebar247Props {
  timelineNews: TimelineNewsItem[];
  trendingList: { rank: string; id: string; title: string; category: string; views: string }[];
  onSelectPostById: (postId: string) => void;
}

export const Sidebar247: React.FC<Sidebar247Props> = ({
  timelineNews,
  trendingList,
  onSelectPostById,
}) => {
  return (
    <aside className="space-y-6">
      {/* 1. KHỐI MỚI NHẤT 24/7 (TIMELINE) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b-2 border-[#ff6b00] pb-2.5 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <h3 className="font-serif font-black text-base text-[#003366] tracking-tight">
              MỚI NHẤT 24/7
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Live Updates</span>
        </div>

        <div className="space-y-3 divide-y divide-slate-100">
          {timelineNews.slice(0, 7).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPostById(item.id)}
              className="pt-2.5 first:pt-0 group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-[11px] mb-1">
                <span className="font-mono font-bold text-[#ff6b00] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 font-medium truncate">{item.category}</span>
                {item.badge && (
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-600">
                    {item.badge}
                  </span>
                )}
              </div>
              <h4 className="font-serif text-xs font-semibold text-slate-800 group-hover:text-[#00529C] transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* 2. KHỐI ĐỌC NHIỀU NHẤT (TRENDING LIST) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b-2 border-[#003366] pb-2.5 mb-3.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00529C]" />
            <h3 className="font-serif font-black text-base text-[#003366] tracking-tight">
              ĐỌC NHIỀU NHẤT
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Top Viral</span>
        </div>

        <div className="space-y-3.5">
          {trendingList.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPostById(item.id)}
              className="flex items-start gap-3 group cursor-pointer"
            >
              <span
                className={`font-serif font-black text-lg sm:text-xl w-6 shrink-0 leading-none ${
                  item.rank === '01'
                    ? 'text-rose-500'
                    : item.rank === '02'
                    ? 'text-orange-500'
                    : item.rank === '03'
                    ? 'text-amber-500'
                    : 'text-slate-300'
                }`}
              >
                {item.rank}
              </span>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#ff6b00] uppercase tracking-wider block">
                  {item.category}
                </span>
                <h4 className="font-serif text-xs font-bold text-slate-800 group-hover:text-[#00529C] transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <Eye className="w-3 h-3" />
                  <span>{item.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
