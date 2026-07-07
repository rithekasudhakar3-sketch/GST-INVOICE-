'use client';

import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ title, value, change, icon: Icon, isCurrency = true, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    orange: 'from-orange-50 to-orange-100 border-orange-200',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {isCurrency ? formatCurrency(value) : value}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-3 gap-1">
              {change >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 text-sm font-semibold">{change}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 text-sm font-semibold">{Math.abs(change)}%</span>
                </>
              )}
              <span className="text-gray-500 text-sm">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${iconColorClasses[color]} bg-white rounded-lg p-3`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
