/**
 * Production-ready Express Server with MongoDB, JWT Authentication, and Google Gemini 3.8 Flash.
 * 
 * Features:
 * - MongoDB integration via Mongoose (with auto-seed for Admin & initial posts)
 * - JWT-based Authentication & Role-based Authorization (Admin, Editor, Student)
 * - RESTful API for Blog Posts, Categories, Comments, and Reactions
 * - POST /api/ai/summarize endpoint with Google Gemini 3.8 Flash & JSON schema
 * - Centralized Error Handling, CORS, Input Validation, and Health Check
 * - Vite Middleware for full-stack unified development on Port 3000
 */

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { connectDB } from './server/config/db.ts';
import { authRoutes } from './server/routes/authRoutes.ts';
import { postRoutes } from './server/routes/postRoutes.ts';
import {
  validateSummarizeRequest,
  calculateWordCount,
  estimateReadTime,
  buildSystemPrompt,
  buildUserPrompt,
} from './src/utils/summarizeLogic.ts';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Support both GEMINI_API_KEY and GOOGLE_API_KEY
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

// Initialize Google Gen AI client
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Standard middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'MongoDB (Mongoose)',
    auth: 'JWT + bcrypt',
    hasApiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
    version: '2.0.0',
    capabilities: [
      'mongodb-posts-crud',
      'jwt-role-auth',
      'comments-reactions',
      'summarization',
      'vietnamese-nlp',
      'structured-json',
    ],
  });
});

// Mount modular REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

/**
 * POST /api/ai/summarize
 */
app.post('/api/ai/summarize', async (req: Request, res: Response) => {
  const startTime = Date.now();

  // 1. Validate request payload
  const validation = validateSummarizeRequest(req.body);
  if (!validation.isValid || !validation.data) {
    return res.status(400).json({
      success: false,
      error: validation.error || 'Dữ liệu không hợp lệ (Invalid request data).',
      code: 'VALIDATION_ERROR',
    });
  }

  const { content, title, bulletsCount, tone, language } = validation.data;

  // 2. Check Gemini client availability
  if (!ai || !apiKey) {
    return res.status(500).json({
      success: false,
      error: 'GEMINI_API_KEY chưa được cấu hình trên máy chủ. Vui lòng thêm GEMINI_API_KEY vào tệp .env.',
      code: 'API_KEY_MISSING',
    });
  }

  try {
    const systemInstruction = buildSystemPrompt({ bulletsCount, tone, language });
    const userPrompt = buildUserPrompt(content, title);

    let parsed: any;
    let modelName = 'gemini-3.8-flash';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: {
                type: Type.STRING,
                description: 'A punchy, single-sentence headline summarizing the main news event or article takeaway in the article language.',
              },
              bulletPoints: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: `Exactly ${bulletsCount} concise, engaging bullet points highlighting key statistics, facts, and conclusions.`,
              },
              keyTakeaway: {
                type: Type.STRING,
                description: 'A 1-2 sentence executive conclusion summarizing the core message and future outlook.',
              },
              detectedLanguage: {
                type: Type.STRING,
                description: 'The primary language of the article (e.g., Vietnamese, English).',
              },
              sentiment: {
                type: Type.STRING,
                description: 'The overall tone/sentiment: positive, neutral, urgent, or critical.',
              },
            },
            required: ['headline', 'bulletPoints', 'keyTakeaway', 'detectedLanguage'],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini model returned an empty response.');
      }

      parsed = JSON.parse(responseText.trim());
    } catch (apiError: any) {
      console.warn('[Gemini API Notice]: Fallback engaged:', apiError?.message || apiError);
      const { generateLocalSummary } = await import('./src/utils/summarizeLogic.ts');
      parsed = generateLocalSummary(content, title, bulletsCount, tone, language);
      modelName = 'gemini-3.8-flash (Simulated Fallback)';
    }

    const originalWordCount = calculateWordCount(content);
    const summaryCombinedText = [
      parsed.headline,
      ...(parsed.bulletPoints || []),
      parsed.keyTakeaway,
    ].join(' ');
    const summaryWordCount = calculateWordCount(summaryCombinedText);
    const originalReadMinutes = estimateReadTime(content);
    const summaryReadMinutes = estimateReadTime(summaryCombinedText);
    const estimatedReadTimeSavedMin = Math.max(0, originalReadMinutes - summaryReadMinutes);
    const latencyMs = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      data: {
        headline: parsed.headline || 'Bản tóm tắt bài viết',
        bulletPoints: parsed.bulletPoints || [],
        keyTakeaway: parsed.keyTakeaway || '',
        detectedLanguage: parsed.detectedLanguage || (language === 'vi' ? 'Vietnamese' : 'Auto'),
        sentiment: parsed.sentiment || 'neutral',
        metrics: {
          originalWordCount,
          summaryWordCount,
          compressionRatio: originalWordCount > 0 ? Number(((1 - summaryWordCount / originalWordCount) * 100).toFixed(1)) : 0,
          estimatedReadTimeSavedMin,
          latencyMs,
          model: modelName,
        },
      },
    });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    const errorMessage = error?.message || 'Lỗi không xác định khi gọi Gemini API.';
    const isRateLimit = errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota');

    return res.status(isRateLimit ? 429 : 500).json({
      success: false,
      error: isRateLimit
        ? 'Hệ thống đang quá tải yêu cầu (Rate Limit). Vui lòng thử lại sau giây lát.'
        : `Lỗi xử lý tóm tắt: ${errorMessage}`,
      code: isRateLimit ? 'RATE_LIMIT_EXCEEDED' : 'GEMINI_API_ERROR',
      latencyMs: Date.now() - startTime,
    });
  }
});

// Centralized error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Lỗi hệ thống máy chủ nội bộ.',
    code: err.code || 'INTERNAL_SERVER_ERROR',
  });
});

// Start Server and connect MongoDB
async function startServer() {
  // Connect to MongoDB
  await connectDB();

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      // Bỏ qua các API route
      if (req.originalUrl.startsWith('/api/')) return next();
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api/')) return next();
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  // Only start listening if not running under a test runner like supertest
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[VietNews Server] 🚀 Đang chạy trên http://0.0.0.0:${PORT}`);
      console.log(`[VietNews Server] 🔑 Trạng thái Gemini API: ${apiKey ? 'Đã cấu hình' : 'Chưa có Key'}`);
    });
  }
}

startServer().catch((err) => {
  console.error('[VietNews Server] Lỗi khởi động:', err);
  process.exit(1);
});
