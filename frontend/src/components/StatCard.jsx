import React from 'react';
import clsx from 'clsx';

const StatCard = ({ title, value, icon: Icon, color, loading }) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 animate-pulse border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="ml-4 space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={clsx("flex h-12 w-12 items-center justify-center rounded-lg", color.bg, color.text)}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
