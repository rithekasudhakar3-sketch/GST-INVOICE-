import React from 'react';

export const PrimaryButton = ({ children, className = '', icon: Icon, ...props }) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};
