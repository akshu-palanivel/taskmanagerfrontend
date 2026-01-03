import { useDispatch, useSelector } from 'react-redux';
import { setPage, fetchTasks } from '../store/tasksSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => {
  const dispatch = useDispatch();
  const { pagination } = useSelector((state) => state.tasks);
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchTasks({ page: newPage }));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t border-dark-800">
      <p className="text-sm text-dark-400">
        Showing page {page} of {totalPages} ({total} tasks)
      </p>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
              pageNum === page
                ? 'bg-primary-500 text-white'
                : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800'
            }`}
          >
            {pageNum}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
