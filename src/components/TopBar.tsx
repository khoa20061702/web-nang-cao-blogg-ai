import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, ShieldCheck, LogOut, LogIn } from 'lucide-react';
import { UserProfile } from './AuthModal.tsx';

interface TopBarProps {
  onOpenCMS: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCMS,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const dateStr = now.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentDateTime(`${dayName}, ${dateStr} • ${timeStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded text-[10px] font-bold">
          👑 Admin
        </span>
      );
    }
    return (
      <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded text-[10px] font-bold">
        👤 Người Dùng
      </span>
    );
  };

  return (
    <div className="bg-[#00284d] text-slate-200 text-xs py-1.5 px-4 border-b border-[#00386b]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Real-time Clock & Date */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{currentDateTime || 'Đang cập nhật thời gian...'}</span>
        </div>

        {/* Center: Quick Link to University */}
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-300">
          <a
            href="https://phenikaa-uni.edu.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>Cổng Thông Tin Đại Học Phenikaa</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        {/* Right: Quick actions & User Auth */}
        <div className="flex items-center gap-2">
          {/* Nút Quản trị CMS - CHỈ ADMIN MỚI THẤY */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={onOpenCMS}
              className="bg-[#ff6b00] hover:bg-[#e05e00] text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Đăng Bài & Quản Trị CMS</span>
            </button>
          )}

          {/* User Profile / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-600/70">
              <span className="text-[11px] font-medium text-slate-200 hidden sm:inline">
                {currentUser.fullName}
              </span>
              {getRoleBadge(currentUser.role)}
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 border border-white/20 cursor-pointer"
            >
              <LogIn className="w-3 h-3 text-amber-300" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
