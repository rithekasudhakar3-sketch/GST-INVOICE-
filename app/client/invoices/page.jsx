'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockInvoices } from '@/lib/mockData';
import { Eye, Download, Printer, Check } from 'lucide-react';

export default function ClientInvoicesPage() {
  const [isDark, setIsDark] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = useMemo(() => {
    let result = mockInvoices.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (filterStatus !== 'all') {
      result = result.filter(i => i.status === filterStatus);
    }

    return result;
  }, [searchValue, filterStatus]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            {/* Header */}
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Received Invoices
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                View and manage invoices from your vendors
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Bills</p>
                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>4</p>
              </div>
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Paid</p>
                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>2</p>
              </div>
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>1</p>
              </div>
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Overdue</p>
                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>1</p>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <SearchBar
                placeholder="Search invoices..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Invoices Table */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Bill No.
                      </th>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Vendor
                      </th>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Date
                      </th>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Due Date
                      </th>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Amount
                      </th>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Status
                      </th>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((invoice) => (
                      <tr key={invoice.id} className={`${isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} border-b transition-colors`}>
                        <td className={`py-4 px-6 font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          {invoice.invoiceNumber}
                        </td>
                        <td className={`py-4 px-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {invoice.customerName}
                        </td>
                        <td className={`py-4 px-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {formatDate(invoice.invoiceDate)}
                        </td>
                        <td className={`py-4 px-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className={`py-4 px-6 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(invoice.total)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : invoice.status === 'partial'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {invoice.status === 'paid' && <Check className="w-3 h-3 mr-1" />}
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="Print">
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {paginatedData.length === 0 && (
                <div className={`text-center py-12 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No invoices found</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
