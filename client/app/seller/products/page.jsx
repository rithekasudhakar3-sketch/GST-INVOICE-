'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { StatusBadge } from '@/components/StatusBadge';
import { formatCurrency, downloadCsv } from '@/lib/utils';
import { mockProducts } from '@/lib/mockData';
import { Plus, Edit2, Trash2, Barcode, PackageSearch, AlertTriangle, Tag, DollarSign, Percent, Layers, Activity, Eye, Copy, Package, IndianRupee, Share2, Star } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Toast } from '@/components/Toast';

export default function ProductsPage() {
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

  const [products, setProducts] = useState(mockProducts);
  const [searchValue, setSearchValue] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modals & Details State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [newStock, setNewStock] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    gst: '18',
    stock: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);

  const categories = useMemo(() => {
    return ['all', ...new Set(products.map(p => p.category))];
  }, [products]);

  const filtered = useMemo(() => {
    let result = products.filter(product =>
      product.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }

    return result;
  }, [products, searchValue, filterCategory]);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleQuickPreview = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleCopyProductId = (product) => {
    navigator.clipboard.writeText(product.id)
      .then(() => {
        setToast({
          message: `Product ID copied to clipboard: ${product.id}`,
          type: 'success'
        });
      })
      .catch(() => {
        setToast({
          message: 'Failed to copy product ID',
          type: 'error'
        });
      });
  };

  const handleUpdateStock = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock !== null ? String(product.stock) : '0');
    setIsStockOpen(true);
  };

  const handleUpdatePrice = (product) => {
    setSelectedProduct(product);
    setNewPrice(String(product.price));
    setIsPriceOpen(true);
  };

  const handleShareProduct = (product) => {
    const shareText = `Product: ${product.name} (ID: ${product.id}) - Price: ${formatCurrency(product.price)}`;
    navigator.clipboard.writeText(shareText)
      .then(() => {
        setToast({
          message: 'Product details copied to clipboard!',
          type: 'success'
        });
      })
      .catch(() => {
        setToast({
          message: 'Failed to copy product details',
          type: 'error'
        });
      });
  };

  const handleToggleFeatured = (product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, featured: !p.featured } : p));
    const isFeaturedNow = !product.featured;
    setToast({
      message: isFeaturedNow ? `${product.name} marked as Featured!` : `${product.name} removed from Featured!`,
      type: 'success'
    });
  };

  const handleStockSubmit = (e) => {
    e.preventDefault();
    const stockNum = Number(newStock);
    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      setToast({
        message: 'Stock must be a non-negative integer',
        type: 'error'
      });
      return;
    }
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, stock: stockNum } : p));
    setIsStockOpen(false);
    setToast({
      message: `Stock updated successfully for ${selectedProduct.name}!`,
      type: 'success'
    });
  };

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    const priceNum = Number(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setToast({
        message: 'Price must be a number greater than 0',
        type: 'error'
      });
      return;
    }
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, price: priceNum } : p));
    setIsPriceOpen(false);
    setToast({
      message: `Price updated successfully for ${selectedProduct.name}!`,
      type: 'success'
    });
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
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    
    const priceNum = Number(formData.price);
    if (!formData.price.trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be a number greater than 0';
    }

    const stockNum = Number(formData.stock);
    if (!formData.stock.trim()) {
      errors.stock = 'Stock is required';
    } else if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      errors.stock = 'Stock must be a non-negative integer';
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

    const newProduct = {
      id: `PROD${String(products.length + 1).padStart(3, '0')}`,
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      gst: Number(formData.gst),
      stock: Number(formData.stock),
      status: formData.status,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' // Placeholder
    };

    setProducts([newProduct, ...products]);
    setIsAddOpen(false);

    // Reset Form
    setFormData({
      name: '',
      category: '',
      price: '',
      gst: '18',
      stock: '',
      status: 'active'
    });
    setFormErrors({});

    setToast({
      message: 'Product added successfully!',
      type: 'success'
    });
  };

  const handleExport = () => {
    const headers = ['Name', 'Category', 'Price', 'GST', 'Stock', 'Status'];
    const rows = filtered.map((product) => [product.name, product.category, String(product.price), String(product.gst), String(product.stock), product.status]);
    downloadCsv('products.csv', headers, rows);
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
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
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
                  className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden hover:shadow-lg transition-all`}
                >
                  {/* Product Image */}
                  <div className="relative w-full h-40 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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
                          Stock: {product.stock != null ? product.stock : 'N/A'}
                        </span>
                        <StatusBadge status={product.status} />
                      </div>
                    </div>

                    {product.stock < 10 && (
                      <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
                        <AlertTriangle className="h-4 w-4" /> Low stock alert
                      </div>
                    )}

                    {/* Quick action icons */}
                    <div className="flex items-center justify-between gap-1.5 mt-3 mb-4">
                      <button
                        onClick={() => handleQuickPreview(product)}
                        title="Quick Preview"
                        className="p-1.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <Eye className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400" />
                      </button>

                      <button
                        onClick={() => handleCopyProductId(product)}
                        title="Copy Product ID"
                        className="p-1.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <Copy className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400" />
                      </button>

                      <button
                        onClick={() => handleUpdateStock(product)}
                        title="Update Stock"
                        className="p-1.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <Package className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400" />
                      </button>

                      <button
                        onClick={() => handleUpdatePrice(product)}
                        title="Update Price"
                        className="p-1.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <IndianRupee className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400" />
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(product)}
                        title="Mark as Featured"
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          product.featured
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-500 fill-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Star className="w-[18px] h-[18px]" />
                      </button>

                      <button
                        onClick={() => handleShareProduct(product)}
                        title="Share Product"
                        className="p-1.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <Share2 className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>

                    <button 
                      onClick={() => handleViewDetails(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer text-sm"
                    >
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

      {/* Product Details Dialog */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Product Details"
        size="md"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-1.5">
                  {selectedProduct.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedProduct.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {selectedProduct.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Unit Price</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">{formatCurrency(selectedProduct.price)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Percent className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">GST Slab Rate</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedProduct.gst}%</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Layers className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available Stock</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedProduct.stock} units</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedProduct.status} />
                  </div>
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

      {/* Add Product Form Dialog */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setFormErrors({});
        }}
        title="Add New Product"
        size="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 ${formErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white`}
              placeholder="e.g. Wireless Mouse"
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 ${formErrors.category ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white`}
                placeholder="e.g. Accessories"
              />
              {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">GST Slab (%)</label>
              <select
                name="gst"
                value={formData.gst}
                onChange={handleInputChange}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Price (INR) *</label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 ${formErrors.price ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white`}
                placeholder="0.00"
              />
              {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Initial Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 ${formErrors.stock ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white`}
                placeholder="0"
              />
              {formErrors.stock && <p className="text-red-500 text-xs mt-1">{formErrors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              Save Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Stock Modal */}
      <Modal
        isOpen={isStockOpen}
        onClose={() => setIsStockOpen(false)}
        title="Update Stock"
        size="sm"
      >
        {selectedProduct && (
          <form onSubmit={handleStockSubmit} className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Product: <span className="font-semibold text-gray-900 dark:text-white">{selectedProduct.name}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Current Stock: <span className="font-semibold text-gray-900 dark:text-white">{selectedProduct.stock !== null ? selectedProduct.stock : 'N/A'}</span>
              </p>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                New Stock Quantity *
              </label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="0"
                min="0"
                step="1"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsStockOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-5 py-2 rounded-lg font-semibold transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors cursor-pointer text-sm"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Update Price Modal */}
      <Modal
        isOpen={isPriceOpen}
        onClose={() => setIsPriceOpen(false)}
        title="Update Price"
        size="sm"
      >
        {selectedProduct && (
          <form onSubmit={handlePriceSubmit} className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Product: <span className="font-semibold text-gray-900 dark:text-white">{selectedProduct.name}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Current Price: <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedProduct.price)}</span>
              </p>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                New Price (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-gray-500 text-sm">₹</span>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg pl-8 pr-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsPriceOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-5 py-2 rounded-lg font-semibold transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors cursor-pointer text-sm"
              >
                Save
              </button>
            </div>
          </form>
        )}
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
