import React, { useState } from 'react';
import {
  Home,
  Newspaper,
  Film,
  Trophy,
  Lightbulb,
  Radio,
  PenTool,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  Code2,
} from 'lucide-react';
import { CategoryType } from '../types/blog.ts';

interface NavbarProps {
  activeCategory: CategoryType | 'all';
  setActiveCategory: (category: CategoryType | 'all') => void;
  onOpenCMS: () => void;
  onOpenAICustom: () => void;
  onOpenCodeGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  setActiveCategory,
  onOpenCMS,
  onOpenAICustom,
  onOpenCodeGuide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; category: CategoryType | 'all'; icon: any }[] = [
    { label: 'Trang chủ', category: 'all', icon: Home },
    { label: 'Tin Phenikaa', category: 'Tin Phenikaa', icon: Newspaper },
    { label: 'Giải Trí & Đời Sống', category: 'Giải Trí & Đời Sống', icon: Film },
    { label: 'Thể Thao & Bứt Phá', category: 'Thể Thao & Bứt Phá', icon: Trophy },
    { label: 'Công Nghệ & Đổi Mới', category: 'Công Nghệ & Đổi Mới', icon: Lightbulb },
    { label: 'Multimedia', category: 'Multimedia', icon: Radio },
    { label: 'Góc Sinh Viên', category: 'Góc Sinh Viên', icon: PenTool },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#00529C] text-white shadow-md border-b-2 border-[#ff6b00]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
        {/* Mobile Hamburger Button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-white hover:bg-[#004080] transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif font-bold text-sm ml-2 text-white">
            PHENIKAA MENU
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.category;
            return (
              <button
                key={item.category}
                onClick={() => {
                  setActiveCategory(item.category);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#ff6b00] text-white shadow-inner font-bold'
                    : 'text-slate-100 hover:bg-[#004080] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAICustom}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold bg-[#ff6b00] hover:bg-[#e05e00] text-white transition-all shadow-sm"
            title="Mở Studio tóm tắt văn bản bằng AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Studio</span>
          </button>

          <button
            onClick={onOpenCMS}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold bg-white text-[#00529C] hover:bg-slate-100 transition-all shadow-sm"
            title="Đăng bài viết mới & Quản lý nội dung"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#ff6b00]" />
            <span className="hidden sm:inline">Đăng Bài (CMS)</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#00386b] border-t border-[#00488a] px-4 py-3 space-y-1.5 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.category;
            return (
              <button
                key={item.category}
                onClick={() => {
                  setActiveCategory(item.category);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-[#ff6b00] text-white font-bold'
                    : 'text-slate-200 hover:bg-[#00488a] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#00488a] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAICustom();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            >
              <Sparkles className="w-4 h-4" />
              <span>Studio Tóm Tắt Tự Do (AI Sandbox)</span>
            </button>

            <button
              onClick={() => {
                onOpenCodeGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-[#00284d] text-amber-300"
            >
              <Code2 className="w-4 h-4" />
              <span>Xem Mã Nguồn Node.js Express</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
