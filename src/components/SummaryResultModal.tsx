import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Clock,
  FileText,
  TrendingDown,
  Gauge,
  Code,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { SummaryData } from '../types/blog.ts';

interface SummaryResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: SummaryData | null;
  articleTitle?: string;
  requestPayload?: any;
}

export const SummaryResultModal: React.FC<SummaryResultModalProps> = ({
  isOpen,
  onClose,
  summary,
  articleTitle,
  requestPayload,
}) => {
  const [copied, setCopied] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

  if (!isOpen || !summary) return null;

  const handleCopy = () => {
    const formattedText = `📰 ${summary.headline}\n\n📌 Các điểm tin cốt lõi:\n${summary.bulletPoints
      .map((b, i) => `${i + 1}. ${b}`)
      .join('\n')}\n\n💡 Kết luận / Key Takeaway:\n${summary.keyTakeaway}\n\n(Tóm tắt tự động bởi Google Gemini 3.8 Flash - VietNews AI)`;

    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sentimentColors: Record<string, string> = {
    positive: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50',
    neutral: 'bg-stone-800 text-stone-300 border-stone-700',
    urgent: 'bg-amber-950/60 text-amber-300 border-amber-700/50',
    critical: 'bg-rose-950/60 text-rose-300 border-rose-700/50',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-stone-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Bản Tóm Tắt Tin Tức AI (AI Summary)
              </h3>
              <p className="text-xs text-stone-400 truncate max-w-md">
                {articleTitle || 'Bài viết được xử lý từ API POST /api/ai/summarize'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInspector(!showInspector)}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                showInspector
                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750'
              }`}
              title="Xem payload JSON & HTTP details"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON Inspector</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Telemetry Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-stone-400 shrink-0" />
              <div>
                <p className="text-[11px] text-stone-400">Độ dài gốc → Tóm tắt</p>
                <p className="text-xs sm:text-sm font-semibold text-stone-200">
                  {summary.metrics.originalWordCount} → {summary.metrics.summaryWordCount} từ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[11px] text-stone-400">Tỷ lệ cô đọng</p>
                <p className="text-xs sm:text-sm font-semibold text-emerald-400">
                  Giảm {summary.metrics.compressionRatio}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-[11px] text-stone-400">Thời gian tiết kiệm</p>
                <p className="text-xs sm:text-sm font-semibold text-amber-300">
                  ~{summary.metrics.estimatedReadTimeSavedMin} phút đọc
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Gauge className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-[11px] text-stone-400">Thời gian phản hồi</p>
                <p className="text-xs sm:text-sm font-semibold text-cyan-300">
                  {summary.metrics.latencyMs} ms
                </p>
              </div>
            </div>
          </div>

          {/* Headline & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                  sentimentColors[summary.sentiment] || sentimentColors.neutral
                }`}
              >
                Sắc thái: {summary.sentiment.toUpperCase()}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700">
                Ngôn ngữ: {summary.detectedLanguage}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Model: {summary.metrics.model}
              </span>
            </div>

            <h4 className="font-serif text-lg sm:text-xl font-bold text-amber-400 leading-snug">
              {summary.headline}
            </h4>
          </div>

          {/* Bullet Points */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              📌 {summary.bulletPoints.length} Điểm Tin Cốt Lõi (Key Bullet Points)
            </h5>
            <div className="space-y-2.5">
              {summary.bulletPoints.map((bullet, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-stone-950/40 border border-stone-800/80 hover:border-stone-700 transition-colors"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-stone-200 leading-relaxed">{bullet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Takeaway */}
          {summary.keyTakeaway && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-stone-900 to-amber-950/20 border border-amber-900/40">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Kết luận quan trọng (Key Takeaway)
              </h5>
              <p className="text-sm text-stone-300 leading-relaxed italic">
                "{summary.keyTakeaway}"
              </p>
            </div>
          )}

          {/* Raw JSON Inspector Modal View (for developer verification) */}
          {showInspector && (
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2">
                <span className="font-mono text-amber-400">HTTP POST /api/ai/summarize</span>
                <span>Response Status: 200 OK</span>
              </div>

              {requestPayload && (
                <div>
                  <p className="text-[11px] text-stone-400 font-mono mb-1">// Request Body</p>
                  <pre className="text-xs font-mono bg-stone-900 p-2.5 rounded-lg overflow-x-auto text-cyan-300 max-h-36">
                    {JSON.stringify(requestPayload, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <p className="text-[11px] text-stone-400 font-mono mb-1">// Response JSON</p>
                <pre className="text-xs font-mono bg-stone-900 p-2.5 rounded-lg overflow-x-auto text-emerald-300 max-h-48">
                  {JSON.stringify(summary, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950 flex items-center justify-between">
          <p className="text-xs text-stone-400 hidden sm:block">
            Xử lý an toàn phía server (Server-side Gemini API)
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Đã sao chép!' : 'Sao chép tóm tắt'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-stone-800 hover:bg-stone-750 text-stone-300 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
