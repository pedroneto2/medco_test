import { Status } from "@prisma/client";

export class TaskValidator {
  private static readonly VALID_STATUSES = Object.values(Status) as string[];
  private static readonly VALID_ORDER_FIELDS = ['createdAt', 'expiration_date', 'title', 'status'];
  private static readonly VALID_ORDERS = ['asc', 'desc'];
  private static readonly MAX_PAGE_LIMIT = 100;

  static validateStatus(status: string): boolean {
    return this.VALID_STATUSES.includes(status);
  }

  static validateOrderBy(orderBy: string): boolean {
    return this.VALID_ORDER_FIELDS.includes(orderBy);
  }

  static validateOrder(order: string): boolean {
    return this.VALID_ORDERS.includes(order);
  }

  static validateExpirationDate(expirationDate: string): { isValid: boolean; date?: Date; error?: string } {
    const date = new Date(expirationDate);
    
    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        error: 'Invalid expiration_date format. Use ISO 8601 format (e.g., 2024-12-31T23:59:59.000Z)'
      };
    }

    if (date <= new Date()) {
      return {
        isValid: false,
        error: 'Expiration date must be in the future'
      };
    }

    return { isValid: true, date };
  }

  static validatePagination(page: string, limit: string): { isValid: boolean; pageNum?: number; limitNum?: number; error?: string } {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (pageNum < 1 || limitNum < 1 || limitNum > this.MAX_PAGE_LIMIT) {
      return {
        isValid: false,
        error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100'
      };
    }

    return { isValid: true, pageNum, limitNum };
  }

  static validateTaskId(taskId: string): { isValid: boolean; id?: number; error?: string } {
    const id = parseInt(taskId, 10);
    
    if (isNaN(id)) {
      return {
        isValid: false,
        error: 'Invalid task ID'
      };
    }

    return { isValid: true, id };
  }

  static getValidStatuses(): string[] {
    return [...(this.VALID_STATUSES as string[])];
  }

  static getValidOrderFields(): string[] {
    return [...(this.VALID_ORDER_FIELDS as string[])];
  }
}
