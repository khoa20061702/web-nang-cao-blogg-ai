import app from '../server.ts';
import { connectDB } from '../server/config/db.ts';

let isDbConnected = false;

export default async function handler(req: any, res: any) {
  if (!isDbConnected) {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (err) {
      console.error('[Vercel Serverless] Lỗi kết nối MongoDB:', err);
    }
  }

  return app(req, res);
}
