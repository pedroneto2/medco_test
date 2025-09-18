import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authService.registerUser(req.body);
      res.json(result);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { token, expirationMinutes } = await this.authService.loginUser(req.body);
      
      const cookieOptions = this.authService.getCookieOptions(expirationMinutes);
      res.cookie("token", token, cookieOptions);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const cookieOptions = this.authService.getCookieOptions();
      res.clearCookie("token", cookieOptions);
      res.json({ message: "Logged out" });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Failed to logout' });
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({ status: 'online' });
  }
} 