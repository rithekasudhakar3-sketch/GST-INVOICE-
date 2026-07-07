'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/StatCard';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockInvoices, getDashboardStats } from '@/lib/mockData';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FileText, CreditCard, TrendingUp, Calendar } from 'lucide-react';

export default function ClientDashboard() {
  const [isDark, setIsDark] = useState(false);
  const stats = getDashboardStats('client');

  const expenseData = [
    { month: 'Jul', spent: 35000 },
    { month: 'Aug', spent: 42000 },
    { month: 'Sep', spent: 38000 },
    { month: 'Oct', spent: 48000 },
    { month: 'Nov', spent: 54000 },
    { month: 'Dec', spent: 62000 },
  ];

  const vendorData = [
    { vendor: 'Acme Corp', spent: 45000 },
    { vendor: 'Global Supplies', spent: 89000 },
    { vendor: 'Premium Materials', spent: 156000 },
  ];

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

        <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 lg:pl-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Dashboard
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Welcome! Here&apos;s your expense overview.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Bills"
                value={stats.totalBills}
                isCurrency={false}
                color="blue"
                icon={FileText}
              />
              <StatCard
                title="Paid Bills"
                value={stats.paidBills}
                isCurrency={false}
                color="green"
              />
              <StatCard
                title="Pending Bills"
                value={stats.pendingBills}
                isCurrency={false}
                color="orange"
              />
              <StatCard
                title="Total Spent"
                value={stats.totalSpent}
                change={stats.spentChange}
                color="purple"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Expense Trend */}
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Monthly Spending
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: isDark ? '#fff' : '#000' }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Bar dataKey="spent" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Vendor Spending */}
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Vendor-wise Spending
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vendorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis type="number" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <YAxis dataKey="vendor" type="category" width={120} stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: isDark ? '#fff' : '#000' }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Bar dataKey="spent" fill="#06b6d4" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Bills */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recent Bills
                </h3>
                <Link href="/client/invoices" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDark ? 'border-gray-800' : 'border-gray-200'} border-b`}>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Bill Number
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Vendor
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Date
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Amount
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockInvoices.slice(0, 5).map((invoice) => (
                      <tr key={invoice.id} className={`${isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} border-b transition-colors`}>
                        <td className={`py-3 px-4 font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          {invoice.invoiceNumber}
                        </td>
                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {invoice.customerName}
                        </td>
                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {formatDate(invoice.invoiceDate)}
                        </td>
                        <td className={`py-3 px-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(invoice.total)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
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
