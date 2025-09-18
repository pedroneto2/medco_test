import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const result = await this.taskService.getTasks(userId, req.query);
      res.json(result);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const task = await this.taskService.createTask(userId, req.body);
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const taskId = parseInt(req.params.id, 10);
      const task = await this.taskService.updateTask(userId, taskId, req.body);
      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      const statusCode = (error as Error).message === 'Task not found' ? 404 : 400;
      res.status(statusCode).json({ error: (error as Error).message });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const taskId = parseInt(req.params.id, 10);
      const result = await this.taskService.deleteTask(userId, taskId);
      res.json(result);
    } catch (error) {
      console.error('Error deleting task:', error);
      const statusCode = (error as Error).message === 'Task not found' ? 404 : 400;
      res.status(statusCode).json({ error: (error as Error).message });
    }
  }
} 