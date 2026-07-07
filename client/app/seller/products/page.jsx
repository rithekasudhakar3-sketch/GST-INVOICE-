'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { StatusBadge } from '@/components/StatusBadge';
import { formatCurrency, downloadCsv } from '@/lib/utils';
import { mockProducts } from '@/lib/mockData';
import { Plus, Edit2, Trash2, Barcode, PackageSearch, AlertTriangle } from 'lucide-react';

export default function ProductsPage() {
  const [isDark, setIsDark] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...new Set(mockProducts.map(p => p.category))];

  const filtered = useMemo(() => {
    let result = mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }

    return result;
  }, [searchValue, filterCategory]);

  const handleExport = () => {
    const headers = ['Name', 'Category', 'Price', 'GST', 'Stock', 'Status'];
    const rows = filtered.map((product) => [product.name, product.category, String(product.price), String(product.gst), String(product.stock), product.status]);
    downloadCsv('products.csv', headers, rows);
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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Products
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  Manage your product catalog
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
                  href="/seller/products/add"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <SearchBar
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(product => (
                <div
                  key={product.id}
                  className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden hover:shadow-lg transition-shadow`}
                >
                  {/* Product Image */}
                  <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button className={`p-2 rounded-lg bg-white hover:bg-gray-100`}>
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className={`p-2 rounded-lg bg-white hover:bg-gray-100`}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {product.category}
                      </p>
                      <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                      </h3>
                    </div>

                    <div className="mb-3">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <Barcode className="h-3.5 w-3.5" /> HSN {product.hsnCode || '9983'}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <PackageSearch className="h-3.5 w-3.5" /> {product.barcode || 'BAR-001'}
                  </span>
                </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(product.price)}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          GST: {product.gst}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Stock: {product.stock}
                        </span>
                        <StatusBadge status={product.status} />
                      </div>
                    </div>

                    {product.stock < 10 && (
                      <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
                        <AlertTriangle className="h-4 w-4" /> Low stock alert
                      </div>
                    )}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className={`text-center py-12 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl`}>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No products found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
