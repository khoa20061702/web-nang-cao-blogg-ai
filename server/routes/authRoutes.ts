import express, { type Request, type Response } from 'express';
import { User } from '../models/User.ts';
import { generateToken, authenticate, type AuthenticatedRequest } from '../middleware/auth.ts';

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { username, email, password, fullName, role? }
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp đầy đủ: username, email, password và fullName.',
        code: 'VALIDATION_ERROR',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Mật khẩu phải chứa ít nhất 6 ký tự.',
        code: 'WEAK_PASSWORD',
      });
    }

    // Check duplicate
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });

    if (existingUser) {
      const isEmail = existingUser.email === email.toLowerCase();
      return res.status(409).json({
        success: false,
        error: isEmail ? 'Email này đã được sử dụng.' : 'Tên tài khoản này đã tồn tại.',
        code: 'USER_EXISTS',
      });
    }

    // Create user (password is automatically hashed via pre-save hook)
    const newUser = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
      fullName: fullName.trim(),
      role: role && ['admin', 'editor', 'student'].includes(role) ? role : 'student',
    });

    const token = generateToken({
      id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.fullName,
    });

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công.',
      data: {
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          avatar: newUser.avatar,
        },
      },
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Lỗi máy chủ khi đăng ký tài khoản: ' + error.message,
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * POST /api/auth/login
 * Body: { emailOrUsername, password }
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập tài khoản/email và mật khẩu.',
        code: 'VALIDATION_ERROR',
      });
    }

    // Find by email or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase().trim() },
        { username: emailOrUsername.trim() },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Tài khoản hoặc mật khẩu không chính xác.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Tài khoản hoặc mật khẩu không chính xác.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const token = generateToken({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công.',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Lỗi máy chủ khi đăng nhập: ' + error.message,
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 */
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy thông tin người dùng.',
        code: 'USER_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Lỗi truy xuất hồ sơ cá nhân: ' + error.message,
      code: 'SERVER_ERROR',
    });
  }
});

export const authRoutes = router;
