
export const Skeleton = ({ className = '', count = 1 }) => {
  const skeletons = Array(count).fill(0).map((_, i) => (
    <div
      key={i}
      className={`bg-slate-300 dark:bg-slate-700 rounded-lg animate-pulse ${className}`}
    />
  ));

  return count === 1 ? skeletons[0] : <div className="space-y-4">{skeletons}</div>;
};

export const CardSkeleton = () => (
  <div className="glass rounded-xl p-6 space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="pt-4 space-y-2">
      <Skeleton className="h-6 w-2/4" />
      <Skeleton className="h-6 w-3/4" />
    </div>
  </div>
);

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[size];

  return (
    <div className={`${sizeClass} border-4 border-slate-300 dark:border-slate-600 border-t-blue-500 rounded-full animate-spin`} />
  );
};
