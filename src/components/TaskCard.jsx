import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle,
  AlertCircle
} from 'lucide-react';
import { updateTask, deleteTask } from '../store/tasksSlice';
import Modal from './Modal';
import TaskForm from './TaskForm';
import toast from 'react-hot-toast';

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusClasses = {
    'Todo': 'status-todo',
    'In Progress': 'status-in-progress',
    'Completed': 'status-completed',
  };

  const priorityClasses = {
    'Low': 'priority-low',
    'Medium': 'priority-medium',
    'High': 'priority-high',
  };

  const statusIcons = {
    'Todo': <Circle className="w-4 h-4" />,
    'In Progress': <Clock className="w-4 h-4" />,
    'Completed': <CheckCircle2 className="w-4 h-4" />,
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'Completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await dispatch(updateTask({ id: task.id, data: { status: newStatus } })).unwrap();
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(task.id)).unwrap();
      toast.success('Task deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getNextStatus = () => {
    if (task.status === 'Todo') return 'In Progress';
    if (task.status === 'In Progress') return 'Completed';
    return 'Todo';
  };

  return (
    <>
      <div className={`glass-card-hover p-5 group ${task.status === 'Completed' ? 'opacity-70' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => handleStatusChange(getNextStatus())}
              disabled={isUpdating}
              className={`mt-0.5 flex-shrink-0 transition-colors ${
                task.status === 'Completed' 
                  ? 'text-emerald-500' 
                  : 'text-dark-500 hover:text-primary-500'
              }`}
            >
              {statusIcons[task.status]}
            </button>
            <div className="min-w-0">
              <h3 className={`font-medium text-dark-100 truncate ${
                task.status === 'Completed' ? 'line-through text-dark-400' : ''
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-dark-400 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 rounded-lg text-dark-400 hover:text-primary-500 hover:bg-dark-800 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 rounded-lg text-dark-400 hover:text-rose-500 hover:bg-dark-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-dark-800">
          <div className="flex items-center gap-2">
            <span className={statusClasses[task.status]}>
              {task.status}
            </span>
            <span className={priorityClasses[task.priority]}>
              {task.priority}
            </span>
          </div>
          
          {task.dueDate && (
            <div className={`flex items-center gap-1.5 text-xs ${
              isOverdue() ? 'text-rose-400' : 'text-dark-400'
            }`}>
              {isOverdue() ? (
                <AlertCircle className="w-3.5 h-3.5" />
              ) : (
                <Calendar className="w-3.5 h-3.5" />
              )}
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
      >
        <TaskForm task={task} onClose={() => setIsEditModalOpen(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Task"
        size="small"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-rose-500" />
          </div>
          <p className="text-dark-300 mb-6">
            Are you sure you want to delete <span className="text-dark-100 font-medium">"{task.title}"</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-6 py-3 bg-rose-600 text-white font-medium rounded-xl transition-all duration-300 hover:bg-rose-700 active:scale-[0.98]"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaskCard;
