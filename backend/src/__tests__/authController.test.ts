import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { AuthController } from '../controllers/authController';

const mockAuthService = {
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  getCookieOptions: vi.fn()
};

vi.mock('../services/authService', () => ({
  AuthService: vi.fn().mockImplementation(() => mockAuthService)
}));

describe('AuthController', () => {
  let authController: AuthController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    authController = new AuthController();
    mockReq = { body: {} };
    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
      cookie: vi.fn(),
      clearCookie: vi.fn()
    };
    vi.clearAllMocks();
  });

  describe('register', () => {
    const registrationData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    it('should register user successfully', async () => {
      const expectedResult = {
        user: { name: 'John Doe', email: 'john@example.com' }
      };

      mockReq.body = registrationData;
      mockAuthService.registerUser.mockResolvedValue(expectedResult);

      await authController.register(mockReq as Request, mockRes as Response);

      expect(mockAuthService.registerUser).toHaveBeenCalledWith(registrationData);
      expect(mockRes.json).toHaveBeenCalledWith(expectedResult);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should handle registration errors', async () => {
      const errorMessage = 'User already exists';
      mockReq.body = registrationData;
      mockAuthService.registerUser.mockRejectedValue(new Error(errorMessage));

      await authController.register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123'
    };

    it('should login user successfully and set cookie', async () => {
      const tokenResult = {
        token: 'mock-jwt-token',
        expirationMinutes: 60
      };
      const cookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'strict' as const,
        maxAge: 3600000
      };

      mockReq.body = loginData;
      mockAuthService.loginUser.mockResolvedValue(tokenResult);
      mockAuthService.getCookieOptions.mockReturnValue(cookieOptions);

      await authController.login(mockReq as Request, mockRes as Response);

      expect(mockAuthService.loginUser).toHaveBeenCalledWith(loginData);
      expect(mockAuthService.getCookieOptions).toHaveBeenCalledWith(60);
      expect(mockRes.cookie).toHaveBeenCalledWith('token', 'mock-jwt-token', cookieOptions);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle login errors', async () => {
      const errorMessage = 'Invalid credentials';
      mockReq.body = loginData;
      mockAuthService.loginUser.mockRejectedValue(new Error(errorMessage));

      await authController.login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
      expect(mockRes.cookie).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout user and clear cookie', async () => {
      const cookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'strict' as const
      };

      mockAuthService.getCookieOptions.mockReturnValue(cookieOptions);

      await authController.logout(mockReq as Request, mockRes as Response);

      expect(mockAuthService.getCookieOptions).toHaveBeenCalled();
      expect(mockRes.clearCookie).toHaveBeenCalledWith('token', cookieOptions);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Logged out' });
    });

    it('should handle logout errors', async () => {
      mockAuthService.getCookieOptions.mockImplementation(() => {
        throw new Error('Service error');
      });

      await authController.logout(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to logout' });
    });
  });

  describe('healthCheck', () => {
    it('should return health status', async () => {
      await authController.healthCheck(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({ status: 'online' });
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors in register', async () => {
      mockAuthService.registerUser.mockRejectedValue(new Error('Database error'));

      await authController.register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should handle service errors in login', async () => {
      mockAuthService.loginUser.mockRejectedValue(new Error('Service error'));

      await authController.login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});