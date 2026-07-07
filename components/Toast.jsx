'use client';

import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconClasses = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  return (
    <div className={`fixed bottom-4 right-4 border rounded-lg p-4 flex items-center gap-3 max-w-sm z-50 ${typeClasses[type]}`}>
      {iconClasses[type]}
      <p className="flex-1">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
