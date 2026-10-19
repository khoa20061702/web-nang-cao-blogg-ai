import React from 'react';
import { Search, Sun, CloudSun, CalendarDays, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAICustom: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenAICustom,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 py-3.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          {/* Logo Mark */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#003366] via-[#00529C] to-[#0070cc] flex items-center justify-center text-white shadow-md relative overflow-hidden shrink-0 group">
            <span className="font-serif font-black text-2xl tracking-tighter">P</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff6b00] rounded-full blur-[1px]"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-extrabold text-2xl sm:text-3xl tracking-tight text-[#003366]">
                PHENIKAA
              </span>
              <span className="font-sans font-bold text-base sm:text-lg text-[#ff6b00] tracking-wide uppercase px-1.5 py-0.5 rounded bg-orange-50 border border-orange-200">
                News & Entertainment
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Báo Tin Tức & Giải Trí • Tiếng nói Tri thức & Nhịp sống Trẻ ĐH Phenikaa
            </p>
          </div>
        </div>

        {/* Right: Weather Widget & Search Bar */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Weather & Event Widget */}
          <div className="hidden lg:flex items-center gap-3 text-xs bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-slate-700">
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">Hà Đông, HN:</span>
              <span>26°C, Nắng nhẹ</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-600">
              <CalendarDays className="w-3.5 h-3.5 text-[#00529C]" />
              <span className="text-[#00529C] font-semibold">Sự kiện:</span>
              <span className="truncate max-w-[140px]" title="Khai mạc Phenikaa Cup 2026">
                Khai mạc Phenikaa Cup
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết, CLB, sự kiện..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00529C] focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* AI Summarize Quick CTA */}
          <button
            onClick={onOpenAICustom}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm transition-all shrink-0"
            title="Thử nghiệm tóm tắt nội dung bất kỳ bằng Google Gemini API"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Summarizer</span>
          </button>
        </div>
      </div>
    </header>
  );
};
