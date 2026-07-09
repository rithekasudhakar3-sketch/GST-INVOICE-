'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import CreateCustomerForm from '@/components/CreateCustomerForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ArrowLeft } from 'lucide-react';

export default function AddCustomerPage() {
  const router = useRouter();
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

  const handleSuccess = (customer) => {
    // Redirect back to customers page after success
    router.push('/seller/customers');
  };

  const handleCancel = () => {
    // Redirect back to customers list
    router.push('/seller/customers');
  };

  return (
    <ProtectedRoute role="seller">
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
            <div className="max-w-4xl mx-auto">
              
              {/* Back Button */}
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Customers
              </button>

              {/* Form Component */}
              <CreateCustomerForm 
                onSuccess={handleSuccess} 
                onCancel={handleCancel} 
              />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
