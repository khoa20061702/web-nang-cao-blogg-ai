import React, { useState } from 'react';
import {
  Home,
  Newspaper,
  Film,
  Trophy,
  Lightbulb,
  PenTool,
  PlusCircle,
  Menu,
  X,
} from 'lucide-react';
import { CategoryType } from '../types/blog.ts';

interface NavbarProps {
  activeCategory: CategoryType | 'all';
  setActiveCategory: (category: CategoryType | 'all') => void;
  onOpenCMS: () => void;
  canManageCMS?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  setActiveCategory,
  onOpenCMS,
  canManageCMS = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; category: CategoryType | 'all'; icon: any }[] = [
    { label: 'Trang chủ', category: 'all', icon: Home },
    { label: 'Tin Phenikaa', category: 'Tin Phenikaa', icon: Newspaper },
    { label: 'Giải Trí & Đời Sống', category: 'Giải Trí & Đời Sống', icon: Film },
    { label: 'Thể Thao & Bứt Phá', category: 'Thể Thao & Bứt Phá', icon: Trophy },
    { label: 'Công Nghệ & Đổi Mới', category: 'Công Nghệ & Đổi Mới', icon: Lightbulb },
    { label: 'Góc Sinh Viên', category: 'Góc Sinh Viên', icon: PenTool },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#00529C] text-white shadow-md border-b-2 border-[#ff6b00]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
        {/* Mobile Hamburger Button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md hover:bg-[#004080] text-slate-100 transition-colors"
            aria-label="Mở menu điều hướng"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Desktop Category Navigation */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.category;
            return (
              <button
                key={item.category}
                onClick={() => {
                  setActiveCategory(item.category);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
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

        {/* Right Action Button: Đăng bài CMS - CHỈ ADMIN MỚI THẤY */}
        <div className="flex items-center gap-2">
          {canManageCMS && (
            <button
              onClick={onOpenCMS}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-white text-[#00529C] hover:bg-slate-100 transition-all shadow-sm cursor-pointer"
              title="Đăng bài viết mới & Quản lý nội dung (Dành riêng cho Admin)"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span className="hidden sm:inline">Đăng Bài (Admin)</span>
            </button>
          )}
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
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors cursor-pointer ${
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

          {canManageCMS && (
            <div className="pt-2 border-t border-[#00488a]">
              <button
                onClick={() => {
                  onOpenCMS();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-[#ff6b00] text-white"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Mở Bảng Quản Trị CMS (Admin)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
