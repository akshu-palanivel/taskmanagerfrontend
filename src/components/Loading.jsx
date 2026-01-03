import { Loader2 } from 'lucide-react';

const Loading = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} text-primary-500 animate-spin`} />
      {text && <p className="text-dark-400 text-sm">{text}</p>}
    </div>
  );
};

export const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loading size="large" />
  </div>
);

export const ButtonLoading = () => (
  <Loader2 className="w-5 h-5 animate-spin" />
);

export default Loading;
