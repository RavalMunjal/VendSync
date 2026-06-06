import clsx from 'clsx';
import { Skeleton } from './Skeleton';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, loading, glowColor, trend }) => {
  if (loading) {
    return (
      <div className={clsx("glass-card p-6", glowColor)}>
        <div className="flex items-center">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="ml-4 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("glass-card p-6 relative overflow-hidden group", glowColor)}>
      {/* Background glow effect on hover */}
      <div className={clsx(
        "absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500",
        color.bg.replace('/10', '').replace('bg-', 'bg-') // Keep simple logic
      )} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={clsx("flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110", color.bg, color.text)}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-0.5">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={clsx(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full",
            trend.isPositive 
              ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" 
              : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-500/10"
          )}>
            {trend.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trend.value}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
