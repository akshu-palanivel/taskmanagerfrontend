import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/tasksSlice';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { PageLoading } from '../components/Loading';
import { Plus, Inbox } from 'lucide-react';

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, pagination } = useSelector((state) => state.tasks);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks({ page: 1 }));
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-dark-100">
              My Tasks
            </h1>
            <p className="text-dark-400 mt-1">
              {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center gap-2 w-fit"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFilters />
        </div>

        {/* Tasks List */}
        {isLoading && tasks.length === 0 ? (
          <PageLoading />
        ) : tasks.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TaskCard task={task} />
                </div>
              ))}
            </div>
            <Pagination />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
              <Inbox className="w-10 h-10 text-dark-500" />
            </div>
            <h3 className="text-xl font-display font-semibold text-dark-200 mb-2">
              No tasks found
            </h3>
            <p className="text-dark-400 mb-6 max-w-md">
              {pagination.total === 0
                ? "You haven't created any tasks yet. Start by creating your first task!"
                : "No tasks match your current filters. Try adjusting your search or filters."}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Task
            </button>
          </div>
        )}

        {/* Create Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Task"
        >
          <TaskForm onClose={() => setIsCreateModalOpen(false)} />
        </Modal>
      </main>
    </>
  );
};

export default Tasks;
