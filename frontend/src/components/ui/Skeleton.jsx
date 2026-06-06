import clsx from 'clsx';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700/50',
        className
      )}
      {...props}
    />
  );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="w-full">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-4 px-6 border-b border-gray-100 dark:border-gray-800">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className={`h-4 ${j === 0 ? 'w-1/3' : 'w-1/4'}`} />
          ))}
        </div>
      ))}
    </div>
  );
};
