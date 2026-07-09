'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/StatCard';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { formatCurrency, formatDate } from '@/lib/utils';
import { supabase } from '@/utils/supabaseClient';
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    revenueChange: '+12%',
    customers: 0,
    customersChange: '+4%',
    invoices: 0,
    invoicesChange: '+8%',
    paidInvoices: 0,
    pendingPayments: 0,
    pendingPaymentsAmount: 0,
    recentInvoices: [],
    inventoryAlerts: []
  });

  const [gstSummary, setGstSummary] = useState({
    collected: 0,
    payable: 0,
    pending: 0
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const sellerId = session.user.id;

      // 1. Fetch all invoices for seller
      const { data: invoices, error: invError } = await supabase
        .from('invoices')
        .select('*, customers(name)')
        .eq('seller_id', sellerId);
      
      if (invError) throw invError;

      // 2. Fetch customers count for seller
      const { count: customersCount, error: custError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', sellerId);
      
      if (custError) throw custError;

      // 3. Fetch products catalog with low stock
      const { data: lowStockProducts, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId)
        .lt('stock', 10);
      
      if (prodError) throw prodError;

      // Calculations
      const totalInvoices = invoices?.length || 0;
      const paidInvoicesList = invoices?.filter(inv => inv.status === 'paid') || [];
      const pendingInvoicesList = invoices?.filter(inv => inv.status === 'pending' || inv.status === 'partial') || [];
      
      const totalRevenue = paidInvoicesList.reduce((sum, inv) => sum + (inv.total || 0), 0);
      const outstandingAmount = pendingInvoicesList.reduce((sum, inv) => sum + (inv.total || 0), 0);
      const totalGstCollected = invoices?.reduce((sum, inv) => sum + (inv.gst_amount || 0), 0) || 0;

      // Sort and get recent 5 invoices
      const sortedInvoices = [...(invoices || [])].sort((a, b) => new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime());
      const mappedRecentInvoices = sortedInvoices.slice(0, 5).map(inv => ({
        ...inv,
        invoiceNumber: inv.invoice_number,
        invoiceDate: inv.invoice_date,
        customerName: inv.customers?.name || 'Unknown Customer',
        total: inv.total,
        status: inv.status
      }));

      setStats({
        revenue: totalRevenue,
        revenueChange: '+12%',
        customers: customersCount || 0,
        customersChange: '+4%',
        invoices: totalInvoices,
        invoicesChange: '+8%',
        paidInvoices: paidInvoicesList.length,
        pendingPayments: pendingInvoicesList.length,
        pendingPaymentsAmount: outstandingAmount,
        recentInvoices: mappedRecentInvoices,
        inventoryAlerts: lowStockProducts || []
      });

      setGstSummary({
        collected: totalGstCollected,
        payable: Math.round(totalGstCollected * 0.7), // Dummy payload splits
        pending: Math.round(totalGstCollected * 0.15)
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const inventoryAlerts = stats.inventoryAlerts;

  const invoiceStatusData = [
    { name: 'Paid', value: stats.paidInvoices, percentage: stats.invoices ? Math.round((stats.paidInvoices / stats.invoices) * 100) : 100 },
    { name: 'Pending', value: stats.pendingPayments, percentage: stats.invoices ? Math.round((stats.pendingPayments / stats.invoices) * 100) : 0 },
  ];

  const monthlyData = [
    { month: 'Revenue', revenue: stats.revenue },
    { month: 'Pending', revenue: stats.pendingPaymentsAmount }
  ];

  return (
    <ProtectedRoute role="seller">
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>GST Collected</p>
                <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(gstSummary.collected)}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>GST Payable</p>
                <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(gstSummary.payable)}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Low Stock Items</p>
                <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{inventoryAlerts.length}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Quick Actions</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/seller/invoices/create" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white">Create Invoice</Link>
                  <Link href="/seller/products" className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">Check Stock</Link>
                </div>
              </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Inventory Alerts</h3>
                <div className="space-y-3">
                  {inventoryAlerts.map((product) => (
                    <div key={product.id} className={`flex items-center justify-between rounded-xl border px-3 py-3 ${isDark ? 'border-gray-800 bg-gray-800/60' : 'border-gray-200 bg-gray-50'}`}>
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Only {product.stock} left in stock</p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Low stock</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Sales Analytics</h3>
                <div className="space-y-4">
                  <div className={`rounded-xl border p-4 ${isDark ? 'border-gray-800 bg-gray-800/60' : 'border-gray-200 bg-gray-50'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Average order value</p>
                    <p className={`mt-1 text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(12840)}</p>
                  </div>
                  <div className={`rounded-xl border p-4 ${isDark ? 'border-gray-800 bg-gray-800/60' : 'border-gray-200 bg-gray-50'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Repeat customers</p>
                    <p className={`mt-1 text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>68%</p>
                  </div>
                </div>
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
                    {stats.recentInvoices.map((invoice) => (
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
    </ProtectedRoute>
  );
}
