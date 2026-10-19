import React, { useState } from 'react';
import {
  Clock,
  TrendingUp,
  Play,
  Headphones,
  Images,
  Radio,
  Eye,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { TimelineNewsItem, MultimediaItem, BlogPost } from '../types/blog.ts';

interface Sidebar247Props {
  timelineNews: TimelineNewsItem[];
  trendingList: { rank: string; id: string; title: string; category: string; views: string }[];
  multimediaItems: MultimediaItem[];
  onSelectPostById: (postId: string) => void;
  onOpenCodeGuide: () => void;
}

export const Sidebar247: React.FC<Sidebar247Props> = ({
  timelineNews,
  trendingList,
  multimediaItems,
  onSelectPostById,
  onOpenCodeGuide,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'podcast' | 'album'>('video');
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredMedia = multimediaItems.find((m) => m.type === activeMediaTab) || multimediaItems[0];

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

        {/* Timeline list */}
        <div className="relative border-l-2 border-slate-100 ml-2.5 space-y-4 py-1">
          {timelineNews.map((item) => (
            <div key={item.id} className="relative pl-5 group cursor-pointer">
              {/* Dot icon */}
              <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#00529C] group-hover:border-[#ff6b00] transition-colors" />

              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-mono font-bold text-[#ff6b00]">
                  {item.time}
                </span>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-600 uppercase">
                    {item.badge}
                  </span>
                )}
                <span className="text-[10px] text-slate-400 truncate">
                  {item.category}
                </span>
              </div>

              <p className="text-xs font-medium text-slate-700 group-hover:text-[#00529C] leading-snug">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. KHỐI TRENDING / XEM NHIỀU NHẤT */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b-2 border-[#00529C] pb-2.5 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00529C]" />
            <h3 className="font-serif font-black text-base text-[#003366] tracking-tight">
              XEM NHIỀU NHẤT
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Top 5 Tuần</span>
        </div>

        <div className="space-y-3.5 divide-y divide-slate-100">
          {trendingList.map((item) => (
            <div
              key={item.rank}
              onClick={() => onSelectPostById(item.id)}
              className="pt-3 first:pt-0 flex items-start gap-3.5 group cursor-pointer"
            >
              <span
                className={`font-serif font-black text-xl leading-none shrink-0 ${
                  item.rank === '01'
                    ? 'text-[#ff6b00]'
                    : item.rank === '02'
                    ? 'text-amber-500'
                    : item.rank === '03'
                    ? 'text-orange-400'
                    : 'text-slate-300'
                }`}
              >
                {item.rank}
              </span>

              <div className="space-y-1">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-800 group-hover:text-[#00529C] transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="text-[#00529C] font-medium">{item.category}</span>
                  <span>•</span>
                  <span>{item.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. KHỐI PHENIKAA MULTIMEDIA (DARK THEME) */}
      <div
        id="multimedia"
        className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-[#001f3f] to-slate-900 border border-slate-800 text-white p-5 shadow-lg space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#ff6b00] animate-pulse" />
            <h3 className="font-serif font-bold text-sm tracking-wide uppercase text-white">
              PHENIKAA MULTIMEDIA
            </h3>
          </div>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
            4K / Hi-Res
          </span>
        </div>

        {/* Media Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-[11px] font-medium">
          <button
            onClick={() => {
              setActiveMediaTab('video');
              setIsPlaying(false);
            }}
            className={`py-1 rounded-lg flex items-center justify-center gap-1 transition-colors ${
              activeMediaTab === 'video' ? 'bg-[#00529C] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>Video</span>
          </button>
          <button
            onClick={() => {
              setActiveMediaTab('podcast');
              setIsPlaying(false);
            }}
            className={`py-1 rounded-lg flex items-center justify-center gap-1 transition-colors ${
              activeMediaTab === 'podcast' ? 'bg-[#00529C] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-3 h-3" />
            <span>Podcast</span>
          </button>
          <button
            onClick={() => {
              setActiveMediaTab('album');
              setIsPlaying(false);
            }}
            className={`py-1 rounded-lg flex items-center justify-center gap-1 transition-colors ${
              activeMediaTab === 'album' ? 'bg-[#00529C] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Images className="w-3 h-3" />
            <span>Ảnh đẹp</span>
          </button>
        </div>

        {/* Media Player Card */}
        {filteredMedia && (
          <div className="space-y-3">
            <div className="relative h-44 rounded-xl overflow-hidden bg-black/60 group">
              <img
                src={filteredMedia.cover}
                alt={filteredMedia.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

              {/* Play Button Overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center focus:outline-none"
                aria-label="Phát đa phương tiện"
              >
                <div className="w-12 h-12 rounded-full bg-[#ff6b00]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className={`w-5 h-5 ml-0.5 ${isPlaying ? 'fill-white' : ''}`} />
                </div>
              </button>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200">
                <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  {filteredMedia.duration}
                </span>
                <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  {filteredMedia.views}
                </span>
              </div>
            </div>

            {/* Audio waveform / player status if playing */}
            {isPlaying && (
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-700 flex items-center justify-between text-xs text-amber-400 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-mono">Đang phát trực tiếp...</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-amber-400 animate-bounce"></span>
                  <span className="w-1 h-5 bg-amber-400 animate-bounce delay-75"></span>
                  <span className="w-1 h-2 bg-amber-400 animate-bounce delay-150"></span>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-serif font-bold text-sm text-slate-100 leading-snug line-clamp-2">
                {filteredMedia.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {filteredMedia.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
