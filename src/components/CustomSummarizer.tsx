import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Send,
  Loader2,
  Trash2,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { SummaryData } from '../types/blog.ts';

interface CustomSummarizerProps {
  onSummarizeCustom: (params: {
    content: string;
    title?: string;
    bulletsCount: number;
    tone: 'engaging' | 'formal' | 'quick-take' | 'technical';
    language: 'auto' | 'vi' | 'en';
  }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const SAMPLE_TEXTS = [
  {
    label: '🇻🇳 Bài báo Công nghệ (Việt Nam)',
    title: 'Hạ tầng mạng 5G và Điện toán đám mây thúc đẩy kinh tế số',
    content: `Trong quý 3 năm 2026, Bộ Thông tin và Truyền thông Việt Nam ghi nhận tốc độ phủ sóng mạng 5G thương mại đạt hơn 85% dân số tại các đô thị lớn như Hà Nội, TP.HCM, Đà Nẵng và Hải Phòng. Hạ tầng kết nối siêu tốc này đã tạo bệ phóng vững chắc cho sự bùng nổ của các giải pháp sản xuất thông minh (Smart Manufacturing), xe tự hành trong các khu công nghiệp công nghệ cao và hệ sinh thái IoT y tế từ xa.

Hơn 120 doanh nghiệp FDI hàng đầu đã ký kết hợp tác triển khai mạng 5G dùng riêng (Private 5G), giúp nâng cao năng suất dây chuyền lắp ráp tự động lên 32% và giảm thiểu 40% lỗi kỹ thuật trong sản xuất vi mạch bán dẫn. Song song đó, các trung tâm dữ liệu (Data Center) đạt chuẩn quốc tế Tier 3 và Tier 4 được khánh thành tại Bình Dương và Hòa Lạc, đảm bảo chủ quyền dữ liệu quốc gia và đáp ứng nhu cầu điện toán đám mây ngày càng cao của khối ngân hàng tài chính.

Các chuyên gia kinh tế dự báo, đóng góp của kinh tế số vào GDP Việt Nam sẽ đạt mốc 30% vào năm 2030, trong đó công nghệ mạng thế hệ mới và trí tuệ nhân tạo biên (Edge AI) đóng vai trò nòng cốt.`,
  },
  {
    label: '🇺🇸 English Tech Article (Global)',
    title: 'Autonomous AI Agents and the Future of Cloud Architecture',
    content: `The software engineering landscape in 2026 is undergoing a paradigm shift towards autonomous multi-agent systems. Rather than treating artificial intelligence merely as single-turn question-answering bots, modern enterprise software architectures now orchestrate coordinated swarms of specialized agents running on distributed cloud clusters.

These agents handle real-time code auditing, database migration verification, and automated vulnerability remediation without requiring constant human intervention. According to recent developer surveys, teams utilizing deterministic agent workflows have observed a 45% reduction in production incident recovery time (MTTR) and a 3x acceleration in feature deployment cadence.

However, operational security remains a major concern. Developers must enforce strict permission boundaries, client-isolated execution environments, and zero-trust credential pipelines to prevent autonomous agents from triggering unintended infrastructure modifications.`,
  },
];

export const CustomSummarizer: React.FC<CustomSummarizerProps> = ({
  onSummarizeCustom,
  isLoading,
  error,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bulletsCount, setBulletsCount] = useState<number>(3);
  const [tone, setTone] = useState<'engaging' | 'formal' | 'quick-take' | 'technical'>('engaging');
  const [language, setLanguage] = useState<'auto' | 'vi' | 'en'>('auto');

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isTooShort = charCount > 0 && charCount < 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (charCount < 50) return;
    onSummarizeCustom({
      content,
      title: title.trim() || undefined,
      bulletsCount,
      tone,
      language,
    });
  };

  const loadSample = (sample: typeof SAMPLE_TEXTS[0]) => {
    setTitle(sample.title);
    setContent(sample.content);
  };

  const handleClear = () => {
    setTitle('');
    setContent('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-100">
              Studio Tóm Tắt Tự Do (AI Sandbox)
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Nhập hoặc dán bất kỳ nội dung bài viết/tin tức nào để kiểm thử trực tiếp endpoint{' '}
              <code className="text-amber-400 font-mono bg-stone-950 px-1.5 py-0.5 rounded">
                POST /api/ai/summarize
              </code>
            </p>
          </div>
        </div>

        {/* Quick Sample Fillers */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-stone-800 text-xs">
          <span className="text-stone-400">Dán bài mẫu nhanh:</span>
          {SAMPLE_TEXTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadSample(sample)}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 transition-colors"
            >
              {sample.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1 rounded-lg bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-rose-400 transition-colors ml-auto flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Làm trống
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Title input */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
            Tiêu đề bài viết (Tùy chọn)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Làn sóng AI tại Việt Nam năm 2026..."
            className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
          />
        </div>

        {/* Content textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              Nội dung bài viết (Bắt buộc - Tối thiểu 50 ký tự)
            </label>
            <span
              className={`text-xs font-mono ${
                isTooShort
                  ? 'text-rose-400 font-semibold'
                  : charCount > 50000
                  ? 'text-amber-400'
                  : 'text-stone-400'
              }`}
            >
              {wordCount} từ | {charCount} ký tự {isTooShort && '(Cần tối thiểu 50 ký tự)'}
            </span>
          </div>

          <textarea
            rows={9}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dán nội dung toàn văn bài báo, bài viết blog, hoặc phân tích kỹ thuật của bạn vào đây..."
            className={`w-full px-4 py-3 rounded-xl bg-stone-950 border text-stone-100 placeholder-stone-500 focus:outline-none transition-colors text-sm font-sans leading-relaxed ${
              isTooShort ? 'border-rose-700/60 focus:border-rose-500' : 'border-stone-800 focus:border-amber-500'
            }`}
          />
        </div>

        {/* Parameter Tuning Bar */}
        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Bullets count */}
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5 flex items-center justify-between">
              <span>Số lượng điểm tin (Bullets):</span>
              <span className="text-amber-400 font-mono font-bold text-sm">{bulletsCount}</span>
            </label>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={bulletsCount}
              onChange={(e) => setBulletsCount(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>1 (Tối giản)</span>
              <span>3 (Khuyên dùng)</span>
              <span>7 (Chi tiết)</span>
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5">
              Văn phong (Tone):
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="engaging">Hấp dẫn, báo chí (Engaging)</option>
              <option value="formal">Trang trọng, học thuật (Formal)</option>
              <option value="quick-take">Tốc ký, con số cốt lõi (Quick-take)</option>
              <option value="technical">Kỹ thuật, kiến trúc (Technical)</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5">
              Quy tắc ngôn ngữ (Language):
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="auto">Tự động phát hiện (Match source text)</option>
              <option value="vi">Bắt buộc Tiếng Việt (Vietnamese)</option>
              <option value="en">Bắt buộc Tiếng Anh (English)</option>
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Không thể thực hiện yêu cầu:</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-stone-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Gọi trực tiếp <code className="text-amber-400 font-mono">POST /api/ai/summarize</code>
          </div>

          <button
            type="submit"
            disabled={isLoading || isTooShort || charCount === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý với Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Tạo Tóm Tắt Bằng AI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
