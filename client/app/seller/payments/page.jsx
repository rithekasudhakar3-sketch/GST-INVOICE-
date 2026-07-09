'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { formatCurrency, formatDate } from '@/lib/utils';
import { supabase } from '@/utils/supabaseClient';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function PaymentsPage() {
  const [isDark, setIsDark] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          status,
          method,
          payment_date,
          reference_number,
          invoices!inner(
            seller_id,
            invoice_number,
            customers(name)
          )
        `)
        .eq('invoices.seller_id', session.user.id);

      if (error) throw error;

      const mapped = (data || []).map(pay => ({
        id: pay.id,
        invoiceNumber: pay.invoices?.invoice_number || 'N/A',
        customerName: pay.invoices?.customers?.name || 'Unknown Customer',
        amount: pay.amount,
        status: pay.status?.toLowerCase(),
        method: pay.method,
        date: pay.payment_date,
        reference: pay.reference_number
      }));

      setPayments(mapped);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = filterStatus === 'all' 
    ? payments 
    : payments.filter(p => p.status === filterStatus);

  const stats = {
    completed: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    total: payments.reduce((sum, p) => sum + p.amount, 0),
  };

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
                Payments
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Track and manage your payments
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Completed</p>
                    <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {formatCurrency(stats.completed)}
                    </p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Pending</p>
                    <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {formatCurrency(stats.pending)}
                    </p>
                  </div>
                  <Clock className="w-10 h-10 text-yellow-600" />
                </div>
              </div>

              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Total Processed</p>
                    <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {formatCurrency(stats.total)}
                    </p>
                  </div>
                  <AlertCircle className="w-10 h-10 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="mb-6">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Payments</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Payments Timeline */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
              <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Payment Timeline
              </h3>

              <div className="space-y-4">
                {filtered.map((payment, index) => (
                  <div key={payment.id} className="relative flex gap-4">
                    {/* Timeline Line */}
                    {index !== filtered.length - 1 && (
                      <div className={`absolute left-6 top-12 w-0.5 h-12 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    )}

                    {/* Timeline Dot */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      payment.status === 'completed'
                        ? 'bg-green-100'
                        : 'bg-yellow-100'
                    }`}>
                      {payment.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-600" />
                      )}
                    </div>

                    {/* Payment Details */}
                    <div className={`flex-1 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {payment.customerName}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Invoice: {payment.invoiceId}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {formatCurrency(payment.amount)}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold mt-1 ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Method</p>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{payment.method}</p>
                        </div>
                        <div>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Date</p>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatDate(payment.date)}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Reference: {payment.reference}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className={`text-center py-12 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No payments found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
