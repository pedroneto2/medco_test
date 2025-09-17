import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '.';
import { generateToken } from './src/auth';

const publicRouter = Router();

const SECURE_COOKIE = false; // ⚠️ set to true in production with HTTPS

// Health check
publicRouter.get('/', (req, res) => {
  res.json({ status: 'online' });
});

// Register User
publicRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing name, email or password' });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, hashedPassword },
  });
  
  res.json({ user: user.name, email: user.email })
});

// Login
publicRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.hashedPassword);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  const { token, expirationMinutes } = generateToken(user.id, user.name, user.email);

  res.cookie("token", token, {
    httpOnly: true,
    secure: SECURE_COOKIE,
    sameSite: "strict",
    maxAge: expirationMinutes * 60 * 1000,
  });

  res.json({ success: true })
});

// Logout
publicRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: SECURE_COOKIE,
    sameSite: "strict",
  });
  res.json({ message: "Logged out" });
});

export default publicRouter;