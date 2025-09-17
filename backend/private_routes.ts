import { Router, Request, Response } from 'express';
import { Task } from '@prisma/client';
import { prisma } from '.';
import { authenticateJWT } from './src/auth';

const privateRouter = Router();

privateRouter.use(authenticateJWT);

// GET /me - get user info
privateRouter.get("/me", (req, res) => {
  res.json({ userId: (req as any).user.userId, name: (req as any).user.name, email: (req as any).user.email });
});

// GET /tasks - fetch all tasks
privateRouter.get('/tasks', async (req: Request, res: Response) => {
  try {
    const tasks: Task[] = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

export default privateRouter;