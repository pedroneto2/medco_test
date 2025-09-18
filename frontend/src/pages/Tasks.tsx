import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Task, Pagination, TasksResponse, EditTaskData, TaskFilters } from '../types/task';
import TableComponent from '../components/TableComponent.tsx';
import PaginatorComponent from '../components/PaginatorComponent.tsx';
import TaskDetails from '../components/TaskDetails.tsx';
import TaskFiltersComponent from '../components/TaskFilters.tsx';
import TaskDetailsModal from '../components/TaskDetailsModal.tsx';
import { useAuth } from '../AuthContext.tsx';

const PAGINATION_LIMIT = '3';

export default function Tasks() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<TaskFilters>({
    status: '',
    orderBy: 'expiration_date',
    order: 'asc',
    page: 1
  });
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: PAGINATION_LIMIT,
        orderBy: filters.orderBy,
        order: filters.order
      });
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      const res = await api.get(`/user/tasks?${params}`);
      const data: TasksResponse = res.data;
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await api.delete(`/user/tasks/${taskId}`);
      await fetchTasks();
    } catch (error: any) {
      console.error('Error deleting task:', error);
      setError(error.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
    setShowDetailsModal(false)
  };

  const handleUpdateTask = async (taskData: EditTaskData) => {
    if (!editingTask) return;
    
    try {
      await api.put(`/user/tasks/${editingTask.id}`, taskData);
      setShowEditModal(false);
      setEditingTask(null);
      await fetchTasks();
    } catch (error: any) {
      console.error('Error updating task:', error);
      setError(error.response?.data?.error || 'Failed to update task');
    }
  };

  const handleTaskClick = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowDetailsModal(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleFilterChange = (newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingTask(null);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTask(null);
  };
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          {user && (
            <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/tasks/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create New Task
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <TaskFiltersComponent 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      <TableComponent
        tasks={tasks}
        loading={loading}
        onTaskClick={handleTaskClick}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      {pagination && (
        <PaginatorComponent 
          pagination={pagination} 
          onPageChange={handlePageChange} 
        />
      )}

      <TaskDetails
        task={editingTask}
        showModal={showEditModal}
        onClose={handleCloseModal}
        onUpdate={handleUpdateTask}
      />

      <TaskDetailsModal
        task={selectedTask}
        showModal={showDetailsModal}
        onClose={handleCloseDetailsModal}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
