import React from 'react';

export const InputField = React.forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300 flex items-center">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={`px-3 py-1.5 text-sm rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all
          ${error 
            ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
          } focus:outline-none`}
        {...props}
      />
      {error && (
        <span className="text-red-500 text-[10px] mt-0.5 font-medium">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';
