import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async authenticateJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const payload = await this.authService.verifyToken(token);
      (req as any).user = payload;
      next();
    } catch (error) {
      const cookieOptions = this.authService.getCookieOptions();

      console.error('Authentication error:', error);
      res.clearCookie("token", cookieOptions);
      res.status(403).json({ error: "Invalid token" });
    }
  }
} 