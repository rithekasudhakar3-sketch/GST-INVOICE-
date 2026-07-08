'use client';

import { useState, useMemo } from 'react';
import { CustomerDetailsDrawer } from '@/components/CustomerDetailsDrawer';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
import { formatCurrency, formatDate, downloadCsv } from '@/lib/utils';
import { Modal } from '@/components/Modal';
import { Toast } from '@/components/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockCustomers } from '@/lib/mockData';
import { Plus, Edit2, Trash2, Phone, Mail, MapPin, Building, FileText, CheckCircle } from 'lucide-react';

export default function CustomersPage() {
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

  const [customers, setCustomers] = useState(mockCustomers);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const itemsPerPage = 8;

  // Modals & Details State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    gstin: '',
    city: '',
    state: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);

  const filteredAndSorted = useMemo(() => {
    let filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      customer.gstin.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (activeFilter !== 'all') {
      filtered = filtered.filter((customer) => customer.city.toLowerCase() === activeFilter.toLowerCase());
    }

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'purchases') {
      filtered.sort((a, b) => b.totalPurchases - a.totalPurchases);
    }

    return filtered;
  }, [searchValue, sortBy, activeFilter]);
  }, [customers, searchValue, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const filterOptions = ['all', ...new Set(mockCustomers.map((customer) => customer.city))];

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'GSTIN', 'City', 'Total Purchases'];
    const rows = filteredAndSorted.map((customer) => [customer.name, customer.email, customer.phone, customer.gstin, customer.city, String(customer.totalPurchases)]);
    downloadCsv('customers.csv', headers, rows);
  };
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Invalid phone number';
    }
    if (!formData.gstin.trim()) {
      errors.gstin = 'GSTIN is required';
    } else if (formData.gstin.trim().length !== 15) {
      errors.gstin = 'GSTIN must be exactly 15 characters';
    }
    return errors;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Add new customer
    const newCustomer = {
      id: `CUST${String(customers.length + 1).padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || formData.name,
      gstin: formData.gstin.toUpperCase(),
      city: formData.city || 'N/A',
      state: formData.state || 'N/A',
      address: formData.address || '',
      totalPurchases: 0,
      invoiceCount: 0,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };

    setCustomers([newCustomer, ...customers]);
    setIsAddOpen(false);
    
    // Reset Form
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      gstin: '',
      city: '',
      state: '',
      address: ''
    });
    setFormErrors({});

    // Toast
    setToast({
      message: 'Customer added successfully!',
      type: 'success'
    });
  };

  return (
    <div className={`${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-300`}>
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
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Export CSV
                </button>
                <Link
                  href="/seller/customers/add"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Customer
                </Link>
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Add Customer
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <SearchBar
                placeholder="Search customers..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <select
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option}>{option === 'all' ? 'All Cities' : option}</option>
                ))}
              </select>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.map(customer => (
                <div
                  key={customer.id}
                  className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex gap-2">
                      <button className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
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

                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                  <button 
                    onClick={() => handleViewDetails(customer)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer text-sm"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {filteredAndSorted.length === 0 && (
              <div className={`text-center py-12 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl`}>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No customers found</p>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            <CustomerDetailsDrawer
              customer={selectedCustomer}
              isOpen={Boolean(selectedCustomer)}
              onClose={() => setSelectedCustomer(null)}
            />
          </div>
        </main>
      </div>

      {/* View Details Dialog */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Customer Details"
        size="md"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-2xl">
                {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCustomer.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {selectedCustomer.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Company Name</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedCustomer.company}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">GSTIN</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedCustomer.gstin}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedCustomer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedCustomer.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Billing Address</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedCustomer.address ? `${selectedCustomer.address}, ` : ''}{selectedCustomer.city}, {selectedCustomer.state}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Purchase Value</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(selectedCustomer.totalPurchases)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Invoices Issued</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{selectedCustomer.invoiceCount}</p>
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

      {/* Add Customer Form Dialog */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setFormErrors({});
        }}
        title="Add New Customer"
        size="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 ${formErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white`}
                placeholder="e.g. John Doe"
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Company Name</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="e.g. Acme Corporation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 ${formErrors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white`}
                placeholder="e.g. john@example.com"
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 ${formErrors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white`}
                placeholder="e.g. 9876543210"
              />
              {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">GSTIN *</label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 ${formErrors.gstin ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white`}
                placeholder="15-character GST number"
              />
              {formErrors.gstin && <p className="text-red-500 text-xs mt-1">{formErrors.gstin}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Maharashtra"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Billing Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Full billing address..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => {
                setIsAddOpen(false);
                setFormErrors({});
              }}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-5 py-2 rounded-lg font-semibold transition-colors cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors cursor-pointer text-sm"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Success Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
