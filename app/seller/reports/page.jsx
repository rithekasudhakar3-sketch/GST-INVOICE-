'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#22C55E', '#F59E0B', '#EF4444', '#3B82F6'];

export default function ReportsPage() {
  const [isDark, setIsDark] = useState(false);

  const revenueData = [
    { month: 'January', revenue: 45000, target: 50000 },
    { month: 'February', revenue: 52000, target: 50000 },
    { month: 'March', revenue: 48000, target: 50000 },
    { month: 'April', revenue: 61000, target: 55000 },
    { month: 'May', revenue: 55000, target: 55000 },
    { month: 'June', revenue: 67000, target: 60000 },
  ];

  const gstData = [
    { category: 'GST Collected', value: 52800 },
    { category: 'GST Payable', value: 48200 },
    { category: 'GST Pending', value: 8700 },
  ];

  const customerSalesData = [
    { name: 'ABC Trading', sales: 45000 },
    { name: 'XYZ Enterprises', sales: 82000 },
    { name: 'Global Tech', sales: 156000 },
    { name: 'Innovation Labs', sales: 95000 },
  ];

  const invoiceStatusData = [
    { name: 'Paid', value: 216840, color: '#22C55E' },
    { name: 'Pending', value: 57080, color: '#F59E0B' },
    { name: 'Overdue', value: 179080, color: '#EF4444' },
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

        <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Reports
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Comprehensive business analytics and insights
              </p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Revenue Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
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
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Customer Sales */}
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Top Customers
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#6b7280'} />
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
                    <Bar dataKey="sales" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* GST Summary */}
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  GST Summary
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gstData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category}: ${formatCurrency(value)}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gstData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Invoice Status */}
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Invoice Status Distribution
                </h3>
                <div className="space-y-4">
                  {invoiceStatusData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.name}
                        </span>
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                      <div className={`w-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2`}>
                        <div
                          style={{
                            width: `${(item.value / 453000) * 100}%`,
                            backgroundColor: item.color,
                          }}
                          className="h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                  Total Revenue (YTD)
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(328000)}
                </p>
              </div>

              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                  Average Invoice Value
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(68440)}
                </p>
              </div>

              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                  Collection Rate
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  79%
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
