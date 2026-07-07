'use client';

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { formatCurrency } from '@/lib/utils';
import { mockVendors } from '@/lib/mockData';
import { Mail, Phone } from 'lucide-react';

export default function VendorsPage() {
  const [isDark, setIsDark] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredVendors = useMemo(() => {
    return mockVendors.filter((vendor) =>
      vendor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

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
                Vendors
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Manage your vendor relationships
              </p>
            </div>

            {/* Vendor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                  Total Vendors
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {mockVendors.length}
                </p>
              </div>

              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                  Total Spent
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(mockVendors.reduce((sum, v) => sum + v.totalSpent, 0))}
                </p>
              </div>

              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                  Average Spend
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(mockVendors.reduce((sum, v) => sum + v.totalSpent, 0) / mockVendors.length)}
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
                  className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                >
                  {/* Logo */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg">
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
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-300">
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

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
