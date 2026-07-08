'use client';

import { useMemo, useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Modal } from '@/components/Modal';
import { Toast } from '@/components/Toast';
import { formatCurrency } from '@/lib/utils';
import { mockVendors } from '@/lib/mockData';
import { Mail, Phone, Plus, MapPin, Building, FileText, User } from 'lucide-react';

export default function VendorsPage() {
  const [isDark, setIsDark] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [vendors, setVendors] = useState(mockVendors);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) =>
      vendor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [vendors, searchValue]);

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
  
  // Modals & Details State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gstin: '',
    contactPerson: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
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
    if (!formData.name.trim()) errors.name = 'Vendor name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
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

    const newVendor = {
      id: `VND${String(vendors.length + 1).padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gstin: formData.gstin.toUpperCase(),
      contactPerson: formData.contactPerson || 'N/A',
      address: formData.address || 'N/A',
      totalSpent: 0
    };

    setVendors([newVendor, ...vendors]);
    setIsAddOpen(false);

    // Reset Form
    setFormData({
      name: '',
      email: '',
      phone: '',
      gstin: '',
      contactPerson: '',
      address: ''
    });
    setFormErrors({});

    setToast({
      message: 'Vendor added successfully!',
      type: 'success'
    });
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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Vendors
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  Manage your vendor relationships
                </p>
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Add Vendor
              </button>
            </div>

            {/* Vendor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                  Total Vendors
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {vendors.length}
                </p>
              </div>

              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                  Total Spent
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(vendors.reduce((sum, v) => sum + v.totalSpent, 0))}
                </p>
              </div>

              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                  Average Spend
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(vendors.length > 0 ? (vendors.reduce((sum, v) => sum + v.totalSpent, 0) / vendors.length) : 0)}
                </p>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search suppliers..."
                className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} w-full max-w-md rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Add Supplier
              </button>
            </div>

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-all`}
                >
                  {/* Logo */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                      {vendor.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {vendor.name}
                      </h3>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        GSTIN: {vendor.gstin}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {vendor.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {vendor.email}
                      </span>
                    </div>
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <strong>Contact:</strong> {vendor.contactPerson}
                      </p>
                    </div>
                  </div>

                  {/* Spending Info */}
                  <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 mb-4`}>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Total Spent
                    </p>
                    <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(vendor.totalSpent)}
                    </p>
                  </div>

                  <button 
                    onClick={() => handleViewDetails(vendor)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer text-sm"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Vendor Details Dialog */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Vendor Details"
        size="md"
      >
        {selectedVendor && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-2xl">
                {selectedVendor.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedVendor.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {selectedVendor.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Contact Person</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedVendor.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">GSTIN</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedVendor.gstin}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedVendor.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedVendor.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedVendor.address || 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Expenditure</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(selectedVendor.totalSpent)}</p>
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

      {/* Add Vendor Form Dialog */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setFormErrors({});
        }}
        title="Add New Vendor"
        size="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Vendor Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 ${formErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white`}
                placeholder="e.g. Dell India Pvt Ltd"
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="e.g. Sales Manager"
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
                placeholder="e.g. corporate@dell.com"
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
                placeholder="e.g. 1800-425-4026"
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Billing Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Full vendor address..."
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
              Save Vendor
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
