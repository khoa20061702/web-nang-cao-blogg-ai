import app from '../server.ts';
import { connectDB } from '../server/config/db.ts';

export default async function handler(req: any, res: any) {
  const isConnected = await connectDB();
  if (!isConnected) {
    return res.status(503).json({
      success: false,
      error: 'Không thể kết nối tới cơ sở dữ liệu MongoDB trên Vercel. Vui lòng kiểm tra biến môi trường MONGODB_URI và cài đặt Network Access (0.0.0.0/0) trên MongoDB Atlas.',
      code: 'DATABASE_CONNECTION_ERROR',
    });
  }

  return app(req, res);
}
