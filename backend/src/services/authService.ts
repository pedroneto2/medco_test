import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../..';
import { AuthValidator } from '../validators/authValidator';

export interface UserData {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
}

export interface TokenResult {
  token: string;
  expirationMinutes: number;
}

export class AuthService {
  private readonly SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';
  private readonly EXPIRATION_MINUTES = Number(process.env.JWT_EXPIRATION_MINUTES) || 60;
  private readonly SECURE_COOKIE = false; // ⚠️ set to true in production with HTTPS
  private readonly DUMMY_HASH = '$2a$10$dummy.hash.to.prevent.timing.attacks.abcdefghijklmnopqrstuvwxyz';

  generateToken(userId: string, name: string, email: string): TokenResult {
    const expiresIn: number = this.EXPIRATION_MINUTES * 60;

    return {
      token: jwt.sign({ userId, name, email }, this.SECRET_KEY, { expiresIn }),
      expirationMinutes: this.EXPIRATION_MINUTES
    };
  }

  async registerUser(data: RegistrationData): Promise<{ user: { name: string; email: string } }> {
    const validation = AuthValidator.validateRegistrationData(data);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const { name, email, password } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, hashedPassword },
    });

    return { user: { name: user.name, email: user.email } };
  }

  async loginUser(credentials: LoginCredentials): Promise<TokenResult> {
    const validation = AuthValidator.validateLoginData(credentials);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const { email, password } = credentials;

    const user = await prisma.user.findUnique({ where: { email } });

    const hashToCompare = user?.hashedPassword || this.DUMMY_HASH;
    const valid = await bcrypt.compare(password, hashToCompare);

    if (!user || !valid) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user.id, user.name, user.email);
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const payload = jwt.verify(token, this.SECRET_KEY) as TokenPayload;
      
      const user = await prisma.user.findUnique({ where: { email: payload.email } });
      if (!user) {
        throw new Error('Unauthorized');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  getCookieOptions(expirationMinutes?: number) {
    const options: any = {
      httpOnly: true,
      secure: this.SECURE_COOKIE,
      sameSite: "strict" as const,
    };

    if (expirationMinutes) {
      options.maxAge = expirationMinutes * 60 * 1000;
    }

    return options;
  }
}