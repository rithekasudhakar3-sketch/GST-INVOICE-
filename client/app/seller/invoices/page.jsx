'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
import { formatCurrency, formatDate, downloadCsv } from '@/lib/utils';
import { mockInvoices } from '@/lib/mockData';
import { Plus, Eye, Download, Send, Trash2, Copy } from 'lucide-react';

export default function InvoicesPage() {
  const [isDark, setIsDark] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [invoiceData, setInvoiceData] = useState(mockInvoices);
  const [feedback, setFeedback] = useState('');
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    let result = invoiceData.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (filterStatus !== 'all') {
      result = result.filter(i => i.status === filterStatus);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'amount') return b.total - a.total;
      return new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime();
    });

    return result;
  }, [searchValue, filterStatus, sortBy, invoiceData]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleDuplicate = (id) => {
    const invoice = invoiceData.find((item) => item.id === id);
    if (!invoice) return;
    const duplicated = { ...invoice, id: `${invoice.id}-copy-${Date.now()}`, invoiceNumber: `${invoice.invoiceNumber}-COPY`, createdAt: new Date().toISOString().split('T')[0] };
    setInvoiceData([duplicated, ...invoiceData]);
    setFeedback('Invoice duplicated successfully.');
  };

  const handleDelete = (id) => {
    setInvoiceData(invoiceData.filter((invoice) => invoice.id !== id));
    setFeedback('Invoice removed from history.');
  };

  const handlePrint = (id) => {
    setFeedback(`Preparing print for invoice ${id}.`);
    window.print();
  };

  const handleExport = () => {
    const headers = ['Invoice', 'Customer', 'Date', 'Amount', 'Status'];
    const rows = filtered.map((invoice) => [invoice.invoiceNumber, invoice.customerName, invoice.invoiceDate, String(invoice.total), invoice.status]);
    downloadCsv('sales.csv', headers, rows);
  };
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Invoices
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  Manage and track your invoices
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Export CSV
                </button>
                <Link
                  href="/seller/invoices/create"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create Invoice
                </Link>
              </div>
            </div>

            {feedback && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400">
                {feedback}
              </div>
            )}

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="partial">Partial</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
              </select>
            </div>

            {/* Invoices Table */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Invoice
                      </th>
                      <th className={`text-left py-4 px-6 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Customer
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
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="Duplicate" onClick={() => handleDuplicate(invoice.id)}>
                              <Copy className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="Print" onClick={() => handlePrint(invoice.id)}>
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="Send">
                              <Send className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-200 rounded-lg text-red-600" title="Delete" onClick={() => handleDelete(invoice.id)}>
                              <Trash2 className="w-4 h-4" />
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
