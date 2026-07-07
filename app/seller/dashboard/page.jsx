'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/StatCard';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockInvoices, getDashboardStats, revenueChartData } from '@/lib/mockData';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Plus,
} from 'lucide-react';

const colors = ['#22C55E', '#F59E0B', '#EF4444'];

export default function SellerDashboard() {
  const [isDark, setIsDark] = useState(false);
  const stats = getDashboardStats('seller');

  const invoiceStatusData = [
    { name: 'Paid', value: stats.paidInvoices, percentage: 79 },
    { name: 'Pending', value: stats.pendingPayments, percentage: 21 },
  ];

  const monthlyData = [
    { month: 'Jul', revenue: 45000 },
    { month: 'Aug', revenue: 52000 },
    { month: 'Sep', revenue: 48000 },
    { month: 'Oct', revenue: 61000 },
    { month: 'Nov', revenue: 67000 },
  ];

  return (
    <div className={`${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50'} min-h-screen`}>
      <Navbar 
        user="seller" 
        role="seller"
        onThemeToggle={() => setIsDark(!isDark)}
        isDark={isDark}
      />

      <div className="flex">
        <Sidebar role="seller" isDark={isDark} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 lg:pl-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Dashboard
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Welcome back! Here&apos;s your business performance.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Revenue"
                value={stats.revenue}
                change={stats.revenueChange}
                color="blue"
                icon={TrendingUp}
              />
              <StatCard
                title="Total Customers"
                value={stats.customers}
                change={stats.customersChange}
                color="purple"
                isCurrency={false}
              />
              <StatCard
                title="Pending Payments"
                value={stats.pendingPayments}
                change={stats.pendingChange}
                color="orange"
              />
              <StatCard
                title="Paid Invoices"
                value={stats.paidInvoices}
                change={stats.paidChange}
                color="green"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Monthly Revenue
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
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
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Invoice Status */}
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Invoice Status
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={invoiceStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recent Invoices
                </h3>
                <Link href="/seller/invoices" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDark ? 'border-gray-800' : 'border-gray-200'} border-b`}>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Invoice
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Customer
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
