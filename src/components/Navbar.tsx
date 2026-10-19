import React from 'react';
import { Newspaper, Sparkles, Code2, PenLine, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApiHealthStatus } from '../types/blog.ts';

interface NavbarProps {
  activeTab: 'reader' | 'editor' | 'code-guide';
  setActiveTab: (tab: 'reader' | 'editor' | 'code-guide') => void;
  health: ApiHealthStatus | null;
  isLoadingHealth: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  health,
  isLoadingHealth,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-inner font-bold text-lg">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-tight text-stone-100">
                  VietNews <span className="text-amber-400 font-sans text-sm font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">AI</span>
                </span>
                <span className="hidden sm:inline-block text-xs text-stone-400 border-l border-stone-700 pl-2">
                  Nền Tảng Báo Chí & Tóm Tắt Tự Động
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Powered by Node.js, Express & Google Gemini API
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('reader')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors shrink-0 ${
                activeTab === 'reader'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Báo Chí & Tin Tức</span>
              <span className="sm:hidden">Tin Tức</span>
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors shrink-0 ${
                activeTab === 'editor'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <PenLine className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Studio Tóm Tắt</span>
              <span className="sm:hidden">Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('code-guide')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors shrink-0 ${
                activeTab === 'code-guide'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Mã Nguồn & Hướng Dẫn</span>
              <span className="md:hidden sm:inline">Mã Nguồn</span>
              <span className="sm:hidden">Code</span>
            </button>
          </nav>

          {/* API Health / Live Indicator */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-stone-300">Backend API:</span>
              {isLoadingHealth ? (
                <span className="text-stone-400 animate-pulse">Đang kết nối...</span>
              ) : health?.hasApiKey ? (
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  gemini-3.8-flash (Sẵn sàng)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-300 font-medium">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  Chưa nhận diện API Key
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
