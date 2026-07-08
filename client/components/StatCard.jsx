'use client';

import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ title, value, change, icon: Icon, isCurrency = true, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/40 dark:to-blue-900/40 dark:border-blue-800/60',
    green: 'from-green-50 to-green-100 border-green-200 dark:from-green-950/40 dark:to-green-900/40 dark:border-green-800/60',
    purple: 'from-purple-50 to-purple-100 border-purple-200 dark:from-purple-950/40 dark:to-purple-900/40 dark:border-purple-800/60',
    orange: 'from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950/40 dark:to-orange-900/40 dark:border-orange-800/60',
  };

  const iconColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {isCurrency ? formatCurrency(value) : value}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-3 gap-1">
              {change >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400 text-sm font-semibold">{change}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-red-600 dark:text-red-400 text-sm font-semibold">{Math.abs(change)}%</span>
                </>
              )}
              <span className="text-gray-500 dark:text-gray-400 text-sm">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${iconColorClasses[color]} bg-white dark:bg-gray-800 rounded-lg p-3 transition-colors`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
