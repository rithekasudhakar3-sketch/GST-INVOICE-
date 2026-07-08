'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatusBadge } from '@/components/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import { mockProducts } from '@/lib/mockData';
import { ArrowLeft, Edit2 } from 'lucide-react';

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id || '';
  const [isDark, setIsDark] = useState(false);

  const product = mockProducts.find(p => p.id === productId || p.id === Number(productId));

  if (!product) {
    return (
      <div className={`${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50'} min-h-screen`}>
        <Navbar user="seller" role="seller" onThemeToggle={() => setIsDark(!isDark)} isDark={isDark} />
        <div className="flex">
          <Sidebar role="seller" isDark={isDark} />
          <main className="flex-1 lg:ml-64 p-8">
            <p className="text-red-500 font-medium">Product not found.</p>
          </main>
        </div>
      </div>
    );
  }

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
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </button>

            {/* Layout Grid */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6`}>
              {/* Product Image */}
              <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {product.category}
                  </span>
                  <h1 className={`text-3xl font-bold mt-1 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {product.name}
                  </h1>

                  <div className="flex gap-4 mb-6">
                    <StatusBadge status={product.status} />
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between border-b pb-2 border-gray-100 dark:border-gray-800">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Price</span>
                      <span className="font-bold">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 border-gray-100 dark:border-gray-800">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>GST Rate</span>
                      <span className="font-medium">{product.gst}%</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 border-gray-100 dark:border-gray-800">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Stock Status</span>
                      <span className="font-medium">{product.stock} units available</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => router.push(`/seller/products/edit/${product.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
