import mongoose from 'mongoose';
import { User } from '../models/User.ts';
import { Post } from '../models/Post.ts';
import { INITIAL_POSTS } from '../../src/data/mockPosts.ts';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/phenikaa_news';

export async function connectDB(): Promise<boolean> {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] ✅ Kết nối thành công tới database: ${mongoose.connection.name}`);

    // Tự động seed dữ liệu mẫu ban đầu nếu database trống
    await seedInitialData();
    return true;
  } catch (error: any) {
    console.warn(`[MongoDB Warning] ⚠️ Không thể kết nối tới MongoDB (${MONGODB_URI}): ${error.message}`);
    console.warn(`[MongoDB Notice] Bạn có thể chạy 'docker compose up -d mongo' hoặc cấu hình MONGODB_URI trong .env.`);
    return false;
  }
}

async function seedInitialData() {
  try {
    // 1. Seed tài khoản mẫu nếu chưa có
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB Seed] 🚀 Đang khởi tạo tài khoản mẫu (Admin & Sinh viên)...');

      await User.create([
        {
          username: 'admin',
          email: 'admin@phenikaa.edu.vn',
          password: 'admin123', // Sẽ được tự động băm qua bcrypt pre-save hook
          fullName: 'Ban Quản Trị Tòa Soạn',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
        {
          username: 'editor',
          email: 'editor@phenikaa.edu.vn',
          password: 'editor123',
          fullName: 'Biên Tập Viên Phenikaa',
          role: 'editor',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        },
        {
          username: 'sinhvien',
          email: 'sinhvien@st.phenikaa-uni.edu.vn',
          password: 'sinhvien123',
          fullName: 'Nguyễn Đăng Khoa',
          role: 'student',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        },
      ]);
      console.log('[MongoDB Seed] ✅ Đã tạo 3 tài khoản: admin, editor, sinhvien.');
    }

    // 2. Seed bài viết mẫu nếu chưa có
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      console.log('[MongoDB Seed] 🚀 Đang khởi tạo bài viết mẫu ban đầu...');
      const postsToInsert = INITIAL_POSTS.map((p) => ({
        title: p.title,
        category: p.category,
        author: p.author,
        authorRole: p.authorRole,
        publishedAt: p.publishedAt,
        readTime: p.readTime,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        content: p.content,
        tags: p.tags,
        viewsCount: p.viewsCount || 100,
        comments: (p.comments || []).map((c: any) => ({
          id: c.id || `c-${Date.now()}-${Math.random()}`,
          author: c.author || c.userName || 'Độc giả',
          userName: c.userName || c.author || 'Độc giả',
          role: c.role || c.userRole || 'Độc giả Phenikaa',
          userRole: c.userRole || c.role || 'Độc giả Phenikaa',
          text: c.text || c.content || '',
          content: c.content || c.text || '',
          createdAt: c.createdAt || new Date().toISOString(),
          likes: c.likes || 0,
        })),
        isFeatured: Boolean(p.isFeatured),
        isSubFeatured: Boolean(p.isSubFeatured),
        status: 'published',
      }));

      await Post.insertMany(postsToInsert);
      console.log(`[MongoDB Seed] ✅ Đã chèn ${postsToInsert.length} bài viết vào MongoDB collection 'posts'.`);
    }
  } catch (seedErr: any) {
    console.error('[MongoDB Seed Error]:', seedErr.message);
  }
}
