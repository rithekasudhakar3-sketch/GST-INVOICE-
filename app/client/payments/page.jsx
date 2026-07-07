'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockPayments } from '@/lib/mockData';

export default function ClientPaymentsPage() {
  const [isDark, setIsDark] = useState(false);

  const stats = {
    completed: mockPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pending: mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className={`${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50'} min-h-screen`}>
      <Navbar 
        user="client" 
        role="client"
        onThemeToggle={() => setIsDark(!isDark)}
        isDark={isDark}
      />

      <div className="flex">
        <Sidebar role="client" isDark={isDark} />

        <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Payments
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Track your bill payments
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Paid</p>
                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {formatCurrency(stats.completed)}
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Pending</p>
                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  {formatCurrency(stats.pending)}
                </p>
              </div>
            </div>

            {/* Payments Table */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Invoice
                      </th>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Amount
                      </th>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Date
                      </th>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPayments.map((payment) => (
                      <tr key={payment.id} className={`${isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} border-b transition-colors`}>
                        <td className={`py-4 px-6 font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          {payment.invoiceId}
                        </td>
                        <td className={`py-4 px-6 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className={`py-4 px-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {formatDate(payment.date)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
