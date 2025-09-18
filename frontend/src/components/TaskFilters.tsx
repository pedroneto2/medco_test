import type { TaskFilters as TaskFiltersType } from '../types/task';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFilterChange: (filters: Partial<TaskFiltersType>) => void;
}

export default function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  const handleStatusChange = (status: string) => {
    onFilterChange({ status, page: 1 });
  };

  const handleOrderChange = (orderBy: string) => {
    if (filters.orderBy === orderBy) {
      onFilterChange({ order: filters.order === 'asc' ? 'desc' : 'asc', page: 1 });
    } else {
      onFilterChange({ orderBy, order: 'asc', page: 1 });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order by
          </label>
          <select
            value={filters.orderBy}
            onChange={(e) => handleOrderChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="expiration_date">Expiration Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => onFilterChange({ order: filters.order === 'asc' ? 'desc' : 'asc' })}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md transition-colors"
            title={`Sort ${filters.order === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {filters.order === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
} 