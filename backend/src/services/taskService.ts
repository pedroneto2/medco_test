import { prisma } from '../..';
import { TaskValidator } from '../validators/taskValidator';
import { Status } from "@prisma/client";

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
  expiration_date: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  expiration_date?: string;
}

export interface TaskQueryParams {
  status?: string;
  page?: string;
  limit?: string;
  orderBy?: string;
  order?: string;
}

export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class TaskService {
  private readonly PAGE_LIMIT = '10';
    
  async getTasks(userId: string, params: TaskQueryParams) {
    const { status, page = '1', limit = this.PAGE_LIMIT, orderBy = 'createdAt', order = 'desc' } = params;

    const paginationValidation = TaskValidator.validatePagination(page, limit);
    if (!paginationValidation.isValid) {
      throw new Error(paginationValidation.error);
    }

    if (status && !TaskValidator.validateStatus(status)) {
      throw new Error(`Invalid status. Must be one of: ${TaskValidator.getValidStatuses().join(', ')}`);
    }

    if (!TaskValidator.validateOrderBy(orderBy)) {
      throw new Error(`Invalid orderBy field. Must be one of: ${TaskValidator.getValidOrderFields().join(', ')}`);
    }

    if (!TaskValidator.validateOrder(order)) {
      throw new Error(`Invalid order. Must be one of: asc, desc`);
    }

    const { pageNum, limitNum } = paginationValidation;

    const whereClause: any = { userId };
    if (status) {
      whereClause.status = status;
    }

    if (typeof pageNum !== 'number' || typeof limitNum !== 'number') {
      throw new Error('Invalid pagination parameters.');
    }

    const offset = (pageNum - 1) * limitNum;
    const orderByClause: any = {};
    orderByClause[orderBy] = order;

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip: offset,
        take: limitNum,
      }),
      prisma.task.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);
    const pagination: PaginationResult = {
      currentPage: pageNum,
      totalPages,
      totalCount,
      limit: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    };

    return { tasks, pagination };
  }

  async createTask(userId: string, data: CreateTaskData) {
    const { title, description, status = 'PENDING', expiration_date } = data;

    if (!title || !description || !expiration_date) {
      throw new Error('Missing required fields: title, description and expiration_date are required');
    }

    if (status && !TaskValidator.validateStatus(status)) {
      throw new Error(`Invalid status. Must be one of: ${TaskValidator.getValidStatuses().join(', ')}`);
    }

    const expirationValidation = TaskValidator.validateExpirationDate(expiration_date);
    if (!expirationValidation.isValid) {
      throw new Error(expirationValidation.error);
    }

    return await prisma.task.create({
      data: {
        title,
        description: description,
        status: status as Status,
        expiration_date: expirationValidation.date!,
        userId,
      },
    });
  }

  async updateTask(userId: string, taskId: number, data: UpdateTaskData) {
    const taskIdValidation = TaskValidator.validateTaskId(taskId.toString());
    if (!taskIdValidation.isValid) {
      throw new Error(taskIdValidation.error);
    }

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    const { title, description, status, expiration_date } = data;

    if (status && !TaskValidator.validateStatus(status)) {
      throw new Error(`Invalid status. Must be one of: ${TaskValidator.getValidStatuses().join(', ')}`);
    }

    let expirationDate = existingTask.expiration_date;
    if (expiration_date) {
      const expirationValidation = TaskValidator.validateExpirationDate(expiration_date);
      if (!expirationValidation.isValid) {
        throw new Error(expirationValidation.error);
      }
      expirationDate = expirationValidation.date!;
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (expiration_date !== undefined) updateData.expiration_date = expirationDate;

    return await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });
  }

  async deleteTask(userId: string, taskId: number) {
    const taskIdValidation = TaskValidator.validateTaskId(taskId.toString());
    if (!taskIdValidation.isValid) {
      throw new Error(taskIdValidation.error);
    }

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return { message: 'Task deleted successfully' };
  }
} 