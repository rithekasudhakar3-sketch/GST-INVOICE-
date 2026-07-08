'use client';

import { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
import { Modal } from '@/components/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockInvoices, mockVendors } from '@/lib/mockData';
import { Eye, Download, Printer, Check, Receipt, Calendar, User, FileText } from 'lucide-react';

export default function ClientInvoicesPage() {
  const [isDark, setIsDark] = useState(false);

  // Sync dark mode class to root HTML
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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

  const handleViewInvoice = (invoice) => {
    // Find vendor info if available
    const vendorObj = mockVendors.find(v => v.name.toLowerCase() === invoice.customerName.toLowerCase()) || mockVendors[0];
    const enrichedInvoice = {
      ...invoice,
      vendorName: vendorObj?.name || invoice.customerName,
      vendorEmail: vendorObj?.email || 'sales@vendor.com',
      vendorGstin: vendorObj?.gstin || 'N/A',
      vendorPhone: vendorObj?.phone || 'N/A',
      vendorAddress: vendorObj?.address || 'N/A'
    };
    setSelectedInvoice(enrichedInvoice);
    setIsDetailsOpen(true);
  };

  return (
    <div className={`${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-300`}>
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
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4 transition-colors`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Bills</p>
                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>4</p>
              </div>
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4 transition-colors`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Paid</p>
                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>2</p>
              </div>
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4 transition-colors`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>1</p>
              </div>
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-4 transition-colors`}>
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
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden shadow-sm`}>
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
                        <td className={`py-4 px-6 font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
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
                        <td className={`py-4 px-6 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
                            <button 
                              onClick={() => handleViewInvoice(invoice)}
                              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors" 
                              title="View"
                            >
                              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors" title="Print">
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
                <div className={`text-center py-12 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl`}>
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

      {/* Invoice Details Dialog */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Invoice Details"
        size="2xl"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <Receipt className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedInvoice.invoiceNumber}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Received: {formatDate(selectedInvoice.invoiceDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedInvoice.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : selectedInvoice.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : selectedInvoice.status === 'partial'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedInvoice.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Billed To / From */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed From (Vendor)</p>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{selectedInvoice.vendorName}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">GSTIN: {selectedInvoice.vendorGstin}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email: {selectedInvoice.vendorEmail}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone: {selectedInvoice.vendorPhone}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To (You)</p>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Tech Solutions Ltd</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">GSTIN: 27AABCT5678H1Z0</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">jane@client.com</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Issue Date</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{formatDate(selectedInvoice.invoiceDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{formatDate(selectedInvoice.dueDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Payment Term</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{selectedInvoice.terms || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Invoice Type</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">GST B2B</p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Invoice Items</p>
              <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                      <th className="text-left py-2.5 px-4 font-semibold">Product Name</th>
                      <th className="text-right py-2.5 px-4 font-semibold">Qty</th>
                      <th className="text-right py-2.5 px-4 font-semibold">Unit Price</th>
                      <th className="text-right py-2.5 px-4 font-semibold">GST %</th>
                      <th className="text-right py-2.5 px-4 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0 text-gray-700 dark:text-gray-300">
                        <td className="py-2.5 px-4">{item.name}</td>
                        <td className="text-right py-2.5 px-4">{item.quantity}</td>
                        <td className="text-right py-2.5 px-4">{formatCurrency(item.price)}</td>
                        <td className="text-right py-2.5 px-4">{item.gst}%</td>
                        <td className="text-right py-2.5 px-4 font-semibold">{formatCurrency(item.quantity * item.price * (1 + item.gst / 100))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals and Summary */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex-1">
                {selectedInvoice.notes && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>
              <div className="w-full sm:w-64 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Amount:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedInvoice.gstAmount)}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedInvoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-2 text-base font-bold text-gray-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span className="text-blue-600 dark:text-blue-400">{formatCurrency(selectedInvoice.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-5 py-2 rounded-lg font-semibold transition-colors cursor-pointer text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
