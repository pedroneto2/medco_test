import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

const EXPIRATION_MINUTES = process.env.JWT_EXPIRATION_MINUTES || 60

export const generateToken = (userId: string, name: string, email: string) => {
  const expiresIn: number = Number(EXPIRATION_MINUTES) * 60;

  return { 
    token: jwt.sign({ userId, name, email }, SECRET_KEY, { expiresIn }),
    expirationMinutes: EXPIRATION_MINUTES
  } as { token: string, expirationMinutes: number};
};

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(token, SECRET_KEY) as { userId: string, name: string, email: string };;
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
