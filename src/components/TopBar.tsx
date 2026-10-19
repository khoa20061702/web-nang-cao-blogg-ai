import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ExternalLink, Radio, Users, Mail, Sparkles, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  onOpenCMS: () => void;
  onOpenStudentVoice: () => void;
  onOpenCodeGuide: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCMS,
  onOpenStudentVoice,
  onOpenCodeGuide,
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

  return (
    <div className="bg-[#00284d] text-slate-200 text-xs py-1.5 px-4 border-b border-[#00386b]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Real-time Clock & Date */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{currentDateTime || 'Đang cập nhật thời gian...'}</span>
        </div>

        {/* Center: Quick Links */}
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-300">
          <a
            href="https://phenikaa-uni.edu.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>Cổng TT Phenikaa</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <span>•</span>
          <a
            href="#multimedia"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <Radio className="w-3 h-3 text-rose-400" />
            <span>Radio / Podcast</span>
          </a>
          <span>•</span>
          <button
            onClick={onOpenStudentVoice}
            className="hover:text-amber-400 transition-colors flex items-center gap-1 text-left"
          >
            <Users className="w-3 h-3 text-cyan-400" />
            <span>Góc Sinh Viên / Hiến Kế</span>
          </button>
          <span>•</span>
          <a
            href="#footer-contact"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <Mail className="w-3 h-3 text-emerald-400" />
            <span>Liên hệ Tòa soạn</span>
          </a>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCodeGuide}
            className="bg-[#003b70] hover:bg-[#00488a] text-amber-300 hover:text-white px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 border border-[#00488a]"
            title="Xem mã nguồn Node.js & API Doc cho đồ án"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Mã Nguồn Node.js API</span>
            <span className="sm:hidden">API Code</span>
          </button>

          <button
            onClick={onOpenCMS}
            className="bg-[#ff6b00] hover:bg-[#e05e00] text-white px-2 py-0.5 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-sm"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Quản Trị CMS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
