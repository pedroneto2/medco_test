export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  expiration_date: string;
  createdAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: Pagination;
}

export interface EditTaskData {
  title: string;
  description: string;
  status: string;
  expiration_date: string;
}

export interface TaskFilters {
  status: string;
  orderBy: string;
  order: 'asc' | 'desc';
  page: number;
} 