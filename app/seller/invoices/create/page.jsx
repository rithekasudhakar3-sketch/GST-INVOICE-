'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { formatCurrency } from '@/lib/utils';
import { mockCustomers, mockProducts } from '@/lib/mockData';
import { Plus, X, Download } from 'lucide-react';

export default function CreateInvoicePage() {
  const [isDark, setIsDark] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('Net 30 days');

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', quantity: 1, price: 0, gst: 18 }]);
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: field === 'quantity' || field === 'price' || field === 'gst' ? Number(value) : value } : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const gstAmount = items.reduce((sum, item) => sum + item.quantity * item.price * (item.gst / 100), 0);
  const total = subtotal + gstAmount - discount;

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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create Invoice
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Create a new invoice for your customer
              </p>
            </div>

            {/* Form */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6 mb-6`}>
              {/* Customer Section */}
              <div className="mb-8">
                <label className={`block font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Select Customer
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Choose a customer...</option>
                  {mockCustomers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.gstin}
                    </option>
                  ))}
                </select>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Invoice Items
                  </h3>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                {items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th className={`text-left py-3 px-3 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Product</th>
                          <th className={`text-left py-3 px-3 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Qty</th>
                          <th className={`text-left py-3 px-3 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Price</th>
                          <th className={`text-left py-3 px-3 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>GST %</th>
                          <th className={`text-left py-3 px-3 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total</th>
                          <th className={`text-left py-3 px-3 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} className={`${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} border-b`}>
                            <td className="py-3 px-3">
                              <select
                                value={item.product}
                                onChange={(e) => {
                                  const prod = mockProducts.find(p => p.id === e.target.value);
                                  if (prod) {
                                    updateItem(item.id, 'product', e.target.value);
                                    updateItem(item.id, 'price', prod.price);
                                    updateItem(item.id, 'gst', prod.gst);
                                  }
                                }}
                                className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              >
                                <option value="">Select...</option>
                                {mockProducts.map(prod => (
                                  <option key={prod.id} value={prod.id}>{prod.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-3">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                className={`w-16 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              />
                            </td>
                            <td className="py-3 px-3">
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                className={`w-20 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              />
                            </td>
                            <td className="py-3 px-3">
                              <input
                                type="number"
                                value={item.gst}
                                onChange={(e) => updateItem(item.id, 'gst', e.target.value)}
                                className={`w-16 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              />
                            </td>
                            <td className={`py-3 px-3 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {formatCurrency(item.quantity * item.price * (1 + item.gst / 100))}
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-1 hover:bg-red-100 rounded text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-8 text-center`}>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No items added yet</p>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Invoice notes..."
                    rows="4"
                    className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div>
                  <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 space-y-3`}>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>GST:</span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(gstAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Discount:</span>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className={`w-24 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div className={`${isDark ? 'border-gray-700' : 'border-gray-300'} border-t pt-3`}>
                      <div className="flex justify-between">
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Total:</span>
                        <span className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <button className={`${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300'} px-6 py-2 rounded-lg font-medium transition-colors`}>
                  Save Draft
                </button>
                <button className={`${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300'} flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors`}>
                  <Download className="w-4 h-4" />
                  Preview
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
