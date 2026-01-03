import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters, fetchTasks } from '../store/tasksSlice';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

const TaskFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.tasks);
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchValue !== filters.search) {
        dispatch(setFilters({ search: searchValue }));
        dispatch(fetchTasks({ page: 1 }));
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchValue, dispatch, filters.search]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
    dispatch(fetchTasks({ page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchValue('');
    dispatch(clearFilters());
    dispatch(fetchTasks({ page: 1 }));
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="space-y-4">
      {/* Search and Toggle */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search tasks..."
            className="input-field pl-12"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-dark-700 border-dark-600' : ''}`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary-500" />
          )}
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="glass-card p-4 animate-slide-down">
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="label-text">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="label-text">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="input-field"
              >
                <option value="">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-1 min-w-[150px]">
              <label className="label-text">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input-field"
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Order */}
            <div className="flex-1 min-w-[150px]">
              <label className="label-text">Order</label>
              <select
                value={filters.order}
                onChange={(e) => handleFilterChange('order', e.target.value)}
                className="input-field"
              >
                <option value="DESC">Newest First</option>
                <option value="ASC">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-4 text-sm text-primary-500 hover:text-primary-400 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
