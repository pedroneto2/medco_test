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

export class AuthValidator {
  private static readonly MIN_PASSWORD_LENGTH = 6;

  static validateRegistrationData(data: { name?: string; email?: string; password?: string }): { isValid: boolean; error?: string } {
    const { name, email, password } = data;
    
    if (!name || !email || !password) {
      return {
        isValid: false,
        error: 'Missing name, email or password'
      };
    }

    if (typeof name !== 'string' || name.trim().length === 0) {
      return {
        isValid: false,
        error: 'Name must be a non-empty string'
      };
    }

    if (typeof email !== 'string' || !this.isValidEmail(email)) {
      return {
        isValid: false,
        error: 'Invalid email format'
      };
    }

    if (typeof password !== 'string' || password.length < this.MIN_PASSWORD_LENGTH) {
      return {
        isValid: false,
        error: `Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long`
      };
    }

    return { isValid: true };
  }

  static validateLoginData(data: { email?: string; password?: string }): { isValid: boolean; error?: string } {
    const { email, password } = data;
    
    if (!email || !password) {
      return {
        isValid: false,
        error: 'Missing email or password'
      };
    }

    if (typeof email !== 'string' || !this.isValidEmail(email)) {
      return {
        isValid: false,
        error: 'Invalid email format'
      };
    }

    if (typeof password !== 'string' || password.length === 0) {
      return {
        isValid: false,
        error: 'Password is required'
      };
    }

    return { isValid: true };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
