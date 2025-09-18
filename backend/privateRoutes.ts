import { Router, Request, Response } from 'express';
import { AuthMiddleware } from './src/middleware/authMiddleware';
import { TaskController } from './src/controllers/taskController';

const privateRouter = Router();
const taskController = new TaskController();
const authMiddleware = new AuthMiddleware()

privateRouter.use((req: Request, res: Response, next) => 
  authMiddleware.authenticateJWT(req, res, next)
);

// GET /me - get user info
privateRouter.get("/me", (req: Request, res: Response) => {
  res.json({ 
    userId: (req as any).user.userId, 
    name: (req as any).user.name,
    email: (req as any).user.email 
  });
});

// Task routes
privateRouter.get('/tasks', (req: Request, res: Response) => taskController.getTasks(req, res));
privateRouter.post('/tasks', (req: Request, res: Response) => taskController.createTask(req, res));
privateRouter.put('/tasks/:id', (req: Request, res: Response) => taskController.updateTask(req, res));
privateRouter.delete('/tasks/:id', (req: Request, res: Response) => taskController.deleteTask(req, res));

export default privateRouter;