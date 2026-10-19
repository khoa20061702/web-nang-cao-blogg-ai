import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Shield,
  FileText,
  ExternalLink,
  Sparkles,
  Heart,
} from 'lucide-react';

interface FooterProps {
  onOpenCodeGuide: () => void;
  onOpenStudentVoice: () => void;
  onOpenCMS: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCodeGuide,
  onOpenStudentVoice,
  onOpenCMS,
}) => {
  return (
    <footer id="footer-contact" className="bg-[#001f3f] text-slate-300 border-t-4 border-[#ff6b00]">
      {/* Top Banner inside Footer */}
      <div className="bg-[#001730] py-6 px-4 border-b border-[#002b54]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 p-1 rounded-xl bg-white flex items-center justify-center shadow-md shrink-0">
              <img
                src="/logo-phenikaa.png"
                alt="Logo Phenikaa"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg text-white tracking-wide">
                BÁO TIN TỨC & GIẢI TRÍ PHENIKAA
              </h3>
              <p className="text-xs text-slate-400">
                Phenikaa News & Entertainment • Cơ quan ngôn luận & truyền thông Đại học Phenikaa
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={onOpenStudentVoice}
              className="px-3 py-1.5 rounded-lg bg-[#003366] hover:bg-[#004080] text-white font-medium transition-colors border border-[#004080]"
            >
              ✍️ Gửi bài viết / Hiến kế
            </button>
            <button
              onClick={onOpenCMS}
              className="px-3 py-1.5 rounded-lg bg-[#ff6b00] hover:bg-[#e05e00] text-white font-semibold transition-colors shadow-sm"
            >
              ⚙️ Cổng Quản Trị CMS
            </button>
            <button
              onClick={onOpenCodeGuide}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium transition-colors border border-amber-500/30"
            >
              ⚡ Mã Nguồn Node.js API
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs leading-relaxed">
        {/* Col 1: Giới thiệu & Bản quyền */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider border-b border-[#00386b] pb-2">
            Về Tòa Soạn
          </h4>
          <p className="text-slate-400">
            Báo Tin Tức & Giải Trí Phenikaa là cổng thông tin điện tử đa phương tiện, phản ánh nhịp sống học đường, các công trình nghiên cứu khoa học, đổi mới sáng tạo và văn hóa giải trí của cộng đồng sinh viên, giảng viên Phenikaa Group.
          </p>
          <div className="text-[11px] text-slate-400 space-y-1 pt-1">
            <p><strong>Cơ quan chủ quản:</strong> </p>
            <p><strong>Tổng biên tập:</strong> </p>
            <p><strong>Giấy phép xuất bản:</strong> </p>
          </div>
        </div>

        {/* Col 2: Địa chỉ & Liên hệ */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider border-b border-[#00386b] pb-2">
            Địa Chỉ & Liên Hệ
          </h4>
          <ul className="space-y-2.5 text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
              <span>Đường Tố Hữu, P. Yên Nghĩa, Q. Hà Đông, TP. Hà Nội</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hotline tòa soạn: chưa có</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Email: 24100476@st.phenikaa-uni.edu.vn</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Đường dây :chưa có </span>
            </li>
          </ul>
        </div>

        {/* Col 3: Chuyên mục chính */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider border-b border-[#00386b] pb-2">
            Chuyên Mục Nổi Bật
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li><a href="#featured" className="hover:text-amber-400 transition-colors">📰 Tin Tập Đoàn & Đại Học Phenikaa</a></li>
            <li><a href="#entertainment" className="hover:text-amber-400 transition-colors">🎭 Giải Trí & Đời Sống Giới Trẻ</a></li>
            <li><a href="#sports" className="hover:text-amber-400 transition-colors">⚽ Thể Thao & Giải Đấu Phenikaa Cup</a></li>
            <li><a href="#tech" className="hover:text-amber-400 transition-colors">💡 Công Nghệ & Khởi Nghiệp AI</a></li>
            <li><a href="#multimedia" className="hover:text-amber-400 transition-colors">🎙️ Phenikaa Radio & Podcast 4K</a></li>
            <li><a href="#student-voice" className="hover:text-amber-400 transition-colors">✍️ Góc Sinh Viên & Hiến Kế</a></li>
          </ul>
        </div>

        {/* Col 4: Mạng xã hội & AI Tech */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider border-b border-[#00386b] pb-2">
            Kết Nối & Công Nghệ
          </h4>
          <p className="text-slate-400 text-xs">
            Theo dõi các kênh mạng xã hội chính thức của Đại học Phenikaa:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href="https://facebook.com/phenikaa-uni"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded bg-[#1877f2] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Facebook
            </a>
            <a
              href="https://tiktok.com/@phenikaa_uni"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded bg-black text-white font-semibold hover:opacity-90 transition-opacity border border-slate-700"
            >
              TikTok
            </a>
            <a
              href="https://youtube.com/@phenikaa_uni"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded bg-[#ff0000] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              YouTube
            </a>
          </div>

          <div className="p-3 rounded-xl bg-[#001730] border border-[#002f5a] space-y-1 mt-3">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Summarizer Powered</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Tích hợp Google Gemini 3.8 Flash qua endpoint <code>POST /api/ai/summarize</code> của Node.js Express.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-[#001224] py-4 px-4 text-center text-[11px] text-slate-400 border-t border-[#002244]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Báo Tin Tức & Giải Trí Phenikaa (Phenikaa News & Entertainment). All rights reserved.
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span>Trang web được tạo bởi sinh viên Phenikaa Nguyễn Đăng Khoa-24100476 cho bài tập lớn web nâng cao</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          </span>
        </div>
      </div>
    </footer>
  );
};
