import clsx from 'clsx';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className 
}) => {
  return (
    <div className={clsx("text-center py-16 px-4", className)}>
      {Icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800/50 mb-4">
          <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 shadow-sm transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
