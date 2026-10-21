import express, { type Request, type Response } from 'express';
import { Post, type IPost } from '../models/Post.ts';
import { authenticate, requireRole, type AuthenticatedRequest } from '../middleware/auth.ts';

const router = express.Router();

/**
 * GET /api/posts
 * Query: category, search, tag, limit, page
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, tag, limit = '50', page = '1' } = req.query;

    const filter: any = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ];
    }

    const pageSize = Math.min(parseInt(limit as string, 10) || 50, 100);
    const currentPage = Math.max(parseInt(page as string, 10) || 1, 1);
    const skip = (currentPage - 1) * pageSize;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Post.countDocuments(filter),
    ]);

    // Format post id for client compatibility (_id -> id)
    const formatted = posts.map((p: any) => ({
      ...p,
      id: p._id.toString(),
    }));

    return res.status(200).json({
      success: true,
      total,
      page: currentPage,
      limit: pageSize,
      data: formatted,
    });
  } catch (error: any) {
    console.error('Fetch posts error:', error);
    return res.status(500).json({
      success: false,
      error: 'Lỗi máy chủ khi tải danh sách bài viết: ' + error.message,
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * GET /api/posts/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy bài viết.',
        code: 'POST_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...post,
        id: post._id.toString(),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Lỗi truy xuất bài viết: ' + error.message,
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * POST /api/posts
 * Requires authentication and role 'admin' or 'editor'
 */
router.post(
  '/',
  authenticate,
  requireRole('admin', 'editor'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const {
        title,
        category,
        author,
        authorRole,
        excerpt,
        content,
        coverImage,
        tags,
        isFeatured,
        isSubFeatured,
      } = req.body;

      if (!title || !category || !content) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu thông tin bắt buộc: title, category và content.',
          code: 'VALIDATION_ERROR',
        });
      }

      const newPost = await Post.create({
        title: title.trim(),
        category,
        author: author?.trim() || req.user?.fullName || 'Biên Tập Viên Phenikaa',
        authorRole: authorRole?.trim() || (req.user?.role === 'admin' ? 'Quản Trị Viên' : 'Biên Tập Viên'),
        authorId: req.user?.id,
        publishedAt: 'Vừa xong',
        readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} phút đọc`,
        excerpt: excerpt?.trim() || content.slice(0, 150) + '...',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        content,
        tags: Array.isArray(tags) ? tags : [],
        isFeatured: Boolean(isFeatured),
        isSubFeatured: Boolean(isSubFeatured),
        status: 'published',
        reactions: { like: 0, heart: 0, haha: 0, wow: 0, sad: 0 },
        comments: [],
        viewsCount: 1,
      });

      return res.status(201).json({
        success: true,
        message: 'Đăng bài viết mới thành công.',
        data: {
          ...newPost.toObject(),
          id: newPost._id.toString(),
        },
      });
    } catch (error: any) {
      console.error('Create post error:', error);
      return res.status(500).json({
        success: false,
        error: 'Lỗi máy chủ khi tạo bài viết: ' + error.message,
        code: 'SERVER_ERROR',
      });
    }
  }
);

/**
 * DELETE /api/posts/:id
 * Requires authentication and role 'admin'
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('admin'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const deleted = await Post.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Bài viết không tồn tại hoặc đã bị xóa.',
          code: 'POST_NOT_FOUND',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Đã xóa bài viết thành công.',
        deletedId: id,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'Lỗi xóa bài viết: ' + error.message,
        code: 'SERVER_ERROR',
      });
    }
  }
);

/**
 * POST /api/posts/:id/comments
 */
router.post('/:id/comments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userName, userRole, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nội dung bình luận không được để trống.',
        code: 'VALIDATION_ERROR',
      });
    }

    const newComment = {
      id: `cmt-${Date.now()}`,
      userName: userName?.trim() || 'Bạn đọc ẩn danh',
      userRole: userRole || 'Độc giả Phenikaa',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName || 'reader')}`,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    const updated = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: { $each: [newComment], $position: 0 } } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy bài viết để bình luận.',
        code: 'POST_NOT_FOUND',
      });
    }

    return res.status(201).json({
      success: true,
      data: newComment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Lỗi gửi bình luận: ' + error.message,
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * POST /api/posts/:id/reactions
 * Body: { type: 'like' | 'heart' | 'haha' | 'wow' | 'sad' }
 */
router.post('/:id/reactions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const validTypes = ['like', 'heart', 'haha', 'wow', 'sad'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Loại cảm xúc không hợp lệ. Phải là một trong: ${validTypes.join(', ')}`,
        code: 'VALIDATION_ERROR',
      });
    }

    const updated = await Post.findByIdAndUpdate(
      id,
      { $inc: { [`reactions.${type}`]: 1 } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy bài viết.',
        code: 'POST_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      reactions: updated.reactions,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Lỗi cập nhật cảm xúc: ' + error.message,
      code: 'SERVER_ERROR',
    });
  }
});

export const postRoutes = router;
