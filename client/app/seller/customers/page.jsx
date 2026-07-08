'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Edit2, Trash2, Phone, Mail, MapPin } from 'lucide-react';

export default function CustomersPage() {
  const [isDark, setIsDark] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const router = useRouter();
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let filtered = customers.filter(customer =>
      (customer.name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
      (customer.email || '').toLowerCase().includes(searchValue.toLowerCase()) ||
      (customer.gstin || '').toLowerCase().includes(searchValue.toLowerCase())
    );

    if (sortBy === 'name') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'purchases') {
      filtered.sort((a, b) => (b.totalPurchases || 0) - (a.totalPurchases || 0));
    }

    return filtered;
  }, [customers, searchValue, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedData = filteredAndSorted.slice(
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
                  Customers
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  Manage your customer base
                </p>
              </div>
              <Link
                href="/seller/customers/add"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Customer
              </Link>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <SearchBar
                placeholder="Search customers..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="name">Sort by Name</option>
                <option value="purchases">Sort by Purchases</option>
              </select>
            </div>

            {/* Customers Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading customers...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedData.map(customer => (
                    <div
                      key={customer.id}
                      className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg">
                          {(customer.name || '').split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/seller/customers/add?id=${customer.id}`)}
                            className={`p-2 rounded-lg ${
                              isDark
                                ? 'bg-gray-800 hover:bg-gray-700'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} text-red-600`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {customer.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{customer.city}, {customer.state}</span>
                        </div>
                      </div>

                      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 mb-4`}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Purchases</p>
                            <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {formatCurrency(customer.totalPurchases)}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Invoices</p>
                            <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {customer.invoiceCount}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>

                {paginatedData.length === 0 && (
                  <div className={`text-center py-12 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl`}>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No customers found</p>
                  </div>
                )}
              </>
            )}

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
