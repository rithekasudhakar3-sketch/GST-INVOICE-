import React from 'react';

export const SecondaryButton = ({ children, className = '', icon: Icon, ...props }) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-250 font-medium py-1.5 px-4 rounded-lg shadow-sm transition-all duration-200 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};
