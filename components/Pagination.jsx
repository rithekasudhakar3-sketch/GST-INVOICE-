'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(0, currentPage - 2);
    return start + i + 1;
  });

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {currentPage > 3 && totalPages > 5 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            1
          </button>
          <span className="px-2">...</span>
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages - 2 && totalPages > 5 && (
        <>
          <span className="px-2">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
