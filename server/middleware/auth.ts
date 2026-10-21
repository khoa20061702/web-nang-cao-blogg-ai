import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'phenikaa_jwt_secret_key_2026';

export interface AuthUserPayload {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'student';
  fullName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export function generateToken(user: AuthUserPayload): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Vui lòng đăng nhập để tiếp tục (Thiếu hoặc sai định dạng Token).',
      code: 'UNAUTHORIZED',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      error: 'Phiên đăng nhập đã hết hạn hoặc token không hợp lệ.',
      code: 'TOKEN_INVALID',
    });
  }
}

export function requireRole(...allowedRoles: Array<'admin' | 'editor' | 'student'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Chưa xác thực danh tính.',
        code: 'UNAUTHORIZED',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Bạn không đủ quyền thực hiện hành động này. Yêu cầu quyền: [${allowedRoles.join(', ')}], quyền hiện tại: [${req.user.role}].`,
        code: 'FORBIDDEN',
      });
    }

    next();
  };
}
