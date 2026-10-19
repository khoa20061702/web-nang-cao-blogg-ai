import React, { useState } from 'react';
import {
  Copy,
  Check,
  Terminal,
  FileCode,
  ShieldCheck,
  Send,
  Sparkles,
  BookOpen,
  Server,
  Layers,
} from 'lucide-react';

interface CodeBlockProps {
  title: string;
  code: string;
  language?: string;
  description?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ title, code, language = 'javascript', description }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-950 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900 border-b border-stone-800 text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-stone-200">{title}</span>
          <span className="text-[10px] text-stone-400 uppercase bg-stone-800 px-1.5 py-0.5 rounded font-mono">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white transition-colors"
          title="Sao chép toàn bộ mã nguồn"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-[11px]">{copied ? 'Đã sao chép' : 'Sao chép'}</span>
        </button>
      </div>

      {description && (
        <div className="px-4 py-2 bg-stone-900/40 border-b border-stone-800/60 text-xs text-stone-400">
          {description}
        </div>
      )}

      <pre className="p-4 text-xs font-mono text-stone-200 overflow-x-auto leading-relaxed max-h-[500px]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const CodeGuideView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'all' | 'server' | 'client' | 'env'>('all');

  const npmInstallCode = `# 1. Khởi tạo dự án Node.js (nếu chưa có)
npm init -y

# 2. Cài đặt các thư viện cốt lõi (Production Dependencies)
# Lưu ý: @google/genai là SDK chính thức thế hệ mới của Google Gemini
npm install express @google/genai dotenv

# 3. (Tùy chọn) Cài đặt CORS nếu frontend chạy trên port khác
npm install cors

# 4. (Khuyến nghị cho TypeScript/ESM) Dev dependencies
npm install -D tsx typescript @types/express @types/node`;

  const envSetupCode = `# ========================================================
# .env (ĐẶT Ở THƯ MỤC GỐC CỦA DỰ ÁN BACKEND)
# CẢNH BÁO: KHÔNG COMMIT FILE NÀY LÊN GITHUB!
# ========================================================

# Lấy khóa API miễn phí từ: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="AIzaSyYourSecretGeminiApiKeyHere"

# Bạn cũng có thể dùng biến GOOGLE_API_KEY (Server hỗ trợ cả hai)
# GOOGLE_API_KEY="AIzaSyYourSecretGeminiApiKeyHere"

# Cổng khởi chạy Express Server
PORT=3000
NODE_ENV=development`;

  const serverJsCode = `/**
 * ============================================================================
 * Production-Ready Node.js Express Server with Google Gemini API Summarization
 * Endpoint: POST /api/ai/summarize
 * Framework: Express.js
 * AI SDK: @google/genai (Google Gen AI Official SDK)
 * ============================================================================
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenAI, Type } from '@google/genai';

// 1. Tải các biến môi trường từ tệp .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Hỗ trợ cả 2 tên biến thông dụng để đảm bảo độ tương thích
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn('[CẢNH BÁO]: Chưa tìm thấy GEMINI_API_KEY trong .env! Vui lòng cấu hình.');
}

// 2. Khởi tạo Gemini AI Client
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build', // Telemetry header theo khuyến nghị Google
    },
  },
});

// 3. Cấu hình Middlewares
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json({ limit: '2mb' })); // Xử lý JSON body tối đa 2MB
app.use(express.urlencoded({ extended: true }));

/**
 * ============================================================================
 * POST /api/ai/summarize
 * @description Tóm tắt nội dung bài viết blog/báo chí thành 3 gạch đầu dòng cô đọng
 * @body {string} content - Nội dung bài viết cần tóm tắt (Bắt buộc, tối thiểu 50 ký tự)
 * @body {string} [title] - Tiêu đề bài viết (Tùy chọn)
 * @body {number} [bulletsCount] - Số lượng gạch đầu dòng (Mặc định: 3)
 * ============================================================================
 */
app.post('/api/ai/summarize', async (req, res) => {
  const startTime = Date.now();

  try {
    // ------------------------------------------------------------------------
    // BƯỚC 1: Kiểm tra và xác thực dữ liệu đầu vào (Input Validation)
    // ------------------------------------------------------------------------
    const { content, title, bulletsCount = 3 } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Trường "content" là bắt buộc và phải là chuỗi văn bản.',
        code: 'MISSING_CONTENT',
      });
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Nội dung bài viết quá ngắn để tóm tắt (cần tối thiểu 50 ký tự).',
        code: 'CONTENT_TOO_SHORT',
      });
    }

    if (trimmedContent.length > 80000) {
      return res.status(400).json({
        success: false,
        error: 'Nội dung bài viết vượt quá giới hạn 80.000 ký tự.',
        code: 'CONTENT_TOO_LONG',
      });
    }

    const targetBullets = Math.min(Math.max(Number(bulletsCount) || 3, 1), 7);

    // ------------------------------------------------------------------------
    // BƯỚC 2: Xây dựng SYSTEM PROMPT chuyên nghiệp
    // ------------------------------------------------------------------------
    const systemInstruction = \`Bạn là một biên tập viên tin tức và nhà báo số kỳ cựu.
Nhiệm vụ của bạn là đọc nội dung bài viết được cung cấp và tạo bản tóm tắt điều hành chính xác, sắc bén.

QUY TẮC BẮT BUỘC:
1. QUY TẮC NGÔN NGỮ: BẮT BUỘC viết bản tóm tắt bằng CHÍNH XÁC ngôn ngữ của bài viết gốc.
   Nếu bài viết là TIẾNG VIỆT, toàn bộ tiêu đề, gạch đầu dòng và kết luận PHẢI là tiếng Việt tự nhiên, chuẩn văn phong báo chí hiện đại.
2. SỐ LƯỢNG: Cung cấp đúng \${targetBullets} gạch đầu dòng ngắn gọn, súc tích trong mảng "bulletPoints".
3. NỘI DUNG: Tập trung trực tiếp vào số liệu thực tế, sự kiện mấu chốt, bài học hoặc tác động cốt lõi.
   TUYỆT ĐỐI KHÔNG dùng các câu mở đầu sáo rỗng như "Bài viết này nói về...", "Tác giả chia sẻ rằng...".
4. KẾT LUẬN: Đưa ra 1-2 câu kết luận then chốt trong "keyTakeaway".\`;

    const userPrompt = title
      ? \`[TIÊU ĐỀ BÀI VIẾT]: \${title}\\n\\n[NỘI DUNG TOÀN VĂN]:\\n\${trimmedContent}\`
      : \`[NỘI DUNG TOÀN VĂN]:\\n\${trimmedContent}\`;

    // ------------------------------------------------------------------------
    // BƯỚC 3: Gọi Google Gemini API với Structured JSON Schema
    // Model được khuyến nghị: gemini-3.8-flash (Tốc độ cao, chi phí tối ưu, hiểu tiếng Việt xuất sắc)
    // ------------------------------------------------------------------------
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Nhiệt độ thấp giúp giữ tính chính xác của dữ liệu
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: {
              type: Type.STRING,
              description: 'Tiêu đề tóm tắt 1 câu ngắn gọn, giật tít báo chí',
            },
            bulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: \`Đúng \${targetBullets} gạch đầu dòng chứa thông tin quan trọng nhất\`,
            },
            keyTakeaway: {
              type: Type.STRING,
              description: 'Kết luận điều hành hoặc thông điệp cốt lõi trong 1-2 câu',
            },
            detectedLanguage: {
              type: Type.STRING,
              description: 'Ngôn ngữ của bài viết (ví dụ: Vietnamese hoặc English)',
            },
          },
          required: ['headline', 'bulletPoints', 'keyTakeaway', 'detectedLanguage'],
        },
      },
    });

    const rawJsonText = response.text;
    if (!rawJsonText) {
      throw new Error('Mô hình Gemini không phản hồi nội dung.');
    }

    const summaryResult = JSON.parse(rawJsonText.trim());

    // ------------------------------------------------------------------------
    // BƯỚC 4: Trả về kết quả JSON chuẩn cho Client
    // ------------------------------------------------------------------------
    const latencyMs = Date.now() - startTime;
    const originalWordCount = trimmedContent.split(/\\s+/).length;

    return res.status(200).json({
      success: true,
      data: {
        headline: summaryResult.headline,
        bulletPoints: summaryResult.bulletPoints,
        keyTakeaway: summaryResult.keyTakeaway,
        detectedLanguage: summaryResult.detectedLanguage,
        metrics: {
          originalWordCount,
          bulletsCount: summaryResult.bulletPoints.length,
          latencyMs,
          model: 'gemini-3.8-flash',
        },
      },
    });
  } catch (error) {
    console.error('[LỖI API /api/ai/summarize]:', error);

    const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
    const isRateLimit = errorMessage.includes('429') || errorMessage.includes('quota');

    return res.status(isRateLimit ? 429 : 500).json({
      success: false,
      error: isRateLimit
        ? 'Hệ thống AI đang vượt quá lưu lượng (Rate Limit). Vui lòng thử lại sau 30 giây.'
        : \`Không thể tạo tóm tắt bài viết: \${errorMessage}\`,
      code: isRateLimit ? 'RATE_LIMIT_EXCEEDED' : 'INTERNAL_SERVER_ERROR',
    });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(\`🚀 Server đang chạy tại http://localhost:\${PORT}\`);
  console.log(\`✨ Endpoint sẵn sàng: POST http://localhost:\${PORT}/api/ai/summarize\`);
});`;

  const clientFetchCode = `/**
 * ============================================================================
 * Client-Side JavaScript Example: Consuming POST /api/ai/summarize via fetch()
 * Phù hợp cho Vanilla JavaScript, React, Vue, hoặc Next.js
 * ============================================================================
 */

async function summarizeArticle({ content, title = '', bulletsCount = 3 }) {
  const API_ENDPOINT = '/api/ai/summarize'; // Hoặc 'http://localhost:3000/api/ai/summarize'

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
        title: title,
        bulletsCount: bulletsCount,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || \`HTTP error! status: \${response.status}\`);
    }

    // Kết quả trả về thành công:
    console.log('📌 Tiêu đề tóm tắt:', result.data.headline);
    console.log('📝 Các điểm chính:', result.data.bulletPoints);
    console.log('💡 Kết luận:', result.data.keyTakeaway);
    console.log('⚡ Thời gian xử lý:', result.data.metrics.latencyMs, 'ms');

    return result.data;
  } catch (error) {
    console.error('❌ Lỗi khi gọi API tóm tắt:', error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// Ví dụ thực thi mẫu với bài báo tiếng Việt:
// ----------------------------------------------------------------------------
const sampleContent = \`
Việt Nam đang chứng kiến bước chuyển dịch mạnh mẽ sang năng lượng tái tạo với
hàng loạt dự án điện gió ngoài khơi tại Bình Thuận, Trà Vinh và Bến Tre.
Quy hoạch điện VIII xác định điện gió và điện mặt trời sẽ chiếm hơn 30% tổng
công suất nguồn điện toàn quốc vào năm 2030, hướng đến mục tiêu Net Zero 2050.
Tuy nhiên, thách thức lớn nhất là bài toán nâng cấp lưới truyền tải 500kV
và chi phí đầu tư hệ thống pin lưu trữ BESS quy mô lớn.
\`;

summarizeArticle({
  title: 'Chuyển dịch năng lượng tái tạo Việt Nam 2026',
  content: sampleContent,
  bulletsCount: 3,
})
  .then((summary) => {
    // Hiển thị ra giao diện người dùng
    alert('Tóm tắt thành công:\\n' + summary.bulletPoints.join('\\n- '));
  })
  .catch((err) => {
    alert('Thất bại: ' + err.message);
  });`;

  const curlTestCode = `# Kiểm tra trực tiếp endpoint bằng cURL trong Terminal
curl -X POST http://localhost:3000/api/ai/summarize \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Ứng dụng AI trong giáo dục đại học",
    "content": "Trí tuệ nhân tạo đang giúp cá nhân hóa lộ trình học tập cho sinh viên Việt Nam. Các trường đại học lớn như Bách Khoa, Phenikaa, Quốc Gia đã tích hợp trợ lý ảo học thuật để giải đáp thắc mắc và chấm bài tự động. Điều này giúp giảng viên tiết kiệm 40% thời gian hành chính và nâng cao tính tương tác trong giảng đường.",
    "bulletsCount": 3
  }'`;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-100">
              Kiến Trúc & Mã Nguồn Chuẩn Sản Phẩm (Full-stack Documentation)
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Tài liệu hoàn chỉnh cho đồ án tốt nghiệp: Backend Node.js Express + Google Gemini API
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-800 text-xs">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSection === 'all'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
            }`}
          >
            Tất cả các phần (Toàn bộ)
          </button>
          <button
            onClick={() => setActiveSection('server')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSection === 'server'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
            }`}
          >
            Server Code (server.js / app.js)
          </button>
          <button
            onClick={() => setActiveSection('client')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSection === 'client'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
            }`}
          >
            Client Fetch & cURL
          </button>
          <button
            onClick={() => setActiveSection('env')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSection === 'env'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
            }`}
          >
            Cài đặt & .env Setup
          </button>
        </div>
      </div>

      {/* Security & Architecture Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
              Bảo Mật API Key Tuyệt Đối
            </h4>
            <p className="text-xs text-stone-400 mt-1">
              API Key chỉ được lưu trữ trong <code>.env</code> phía Server. Tuyệt đối không bao giờ gửi khóa API về trình duyệt client.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
              Structured JSON Output
            </h4>
            <p className="text-xs text-stone-400 mt-1">
              Sử dụng <code>responseSchema</code> của Gemini 3.8 Flash, đảm bảo 100% trả về đúng định dạng JSON mà không sợ vỡ format.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex items-start gap-3">
          <Server className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
              Xử Lý Tiếng Việt Tự Nhiên
            </h4>
            <p className="text-xs text-stone-400 mt-1">
              System Prompt thông minh ép chặt quy tắc giữ nguyên ngôn ngữ gốc, cho ra văn phong báo chí tiếng Việt trau chuốt.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Prerequisites */}
      {(activeSection === 'all' || activeSection === 'env') && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-100">
              Yêu cầu tiên quyết & Cài đặt thư viện (Prerequisites)
            </h3>
          </div>
          <CodeBlock
            title="Terminal Commands"
            code={npmInstallCode}
            language="bash"
            description="Chạy các lệnh sau trong thư mục dự án Node.js của bạn để cài đặt các gói cần thiết."
          />
        </section>
      )}

      {/* 2. Environment Setup */}
      {(activeSection === 'all' || activeSection === 'env') && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-100">
              Cấu hình biến môi trường (.env & Bảo mật)
            </h3>
          </div>
          <CodeBlock
            title=".env"
            code={envSetupCode}
            language="properties"
            description="Tạo file .env ở thư mục gốc của backend. Đảm bảo thêm file này vào .gitignore để không bao giờ bị rò rỉ mã bí mật."
          />
        </section>
      )}

      {/* 3. Server Code */}
      {(activeSection === 'all' || activeSection === 'server') && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-100">
              Mã nguồn Server hoàn chỉnh (server.js / index.js)
            </h3>
          </div>
          <CodeBlock
            title="server.js"
            code={serverJsCode}
            language="javascript"
            description="Toàn bộ mã nguồn Express.js tích hợp Google Gemini API với endpoint POST /api/ai/summarize, validate dữ liệu, system prompt tiếng Việt, và xử lý lỗi chuyên nghiệp."
          />
        </section>
      )}

      {/* 4. Client-side Fetch Example */}
      {(activeSection === 'all' || activeSection === 'client') && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-100">
              Mã gọi API từ Frontend (Client-side fetch)
            </h3>
          </div>
          <CodeBlock
            title="client-summarize.js"
            code={clientFetchCode}
            language="javascript"
            description="Đoạn mã JavaScript phía trình duyệt để gửi yêu cầu POST đến endpoint /api/ai/summarize và hiển thị kết quả."
          />
        </section>
      )}

      {/* 5. cURL Testing */}
      {(activeSection === 'all' || activeSection === 'client') && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-bold flex items-center justify-center">
              5
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-100">
              Kiểm thử nhanh bằng cURL / Postman
            </h3>
          </div>
          <CodeBlock
            title="cURL Test Command"
            code={curlTestCode}
            language="bash"
            description="Sao chép và dán trực tiếp vào Terminal để kiểm thử endpoint mà không cần viết giao diện."
          />
        </section>
      )}
    </div>
  );
};
