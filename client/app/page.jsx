'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, FileText, Users, CreditCard } from 'lucide-react';

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`${isDark ? 'bg-gray-950 text-white' : 'bg-white'} min-h-screen`}>
      {/* Navigation */}
      <nav className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b backdrop-blur-sm sticky top-0 z-40`}>
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📄</span>
            </div>
            <span className={`font-bold text-lg hidden sm:inline ${isDark ? 'text-white' : 'text-gray-900'}`}>
              InvoiceHub
            </span>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`px-4 py-2 rounded-lg font-medium ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} py-20 sm:py-32`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-4xl sm:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Modern Invoice Management System
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-12 max-w-2xl mx-auto`}>
            Streamline your billing process with InvoiceHub. Create, manage, and track invoices with ease.
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
            {/* Seller Portal */}
            <Link
              href="/seller/login"
              className={`group p-8 rounded-xl border-2 transition-all hover:shadow-lg ${isDark ? 'bg-gray-900 border-gray-800 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500'}`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4 mx-auto">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Seller Portal
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                Create and manage invoices, track payments, and grow your business
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                Enter <ArrowRight className="w-5 h-5" />
              </div>
            </Link>

            {/* Client Portal */}
            <Link
              href="/client/login"
              className={`group p-8 rounded-xl border-2 transition-all hover:shadow-lg ${isDark ? 'bg-gray-900 border-gray-800 hover:border-purple-500' : 'bg-white border-gray-200 hover:border-purple-500'}`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4 mx-auto">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Client Portal
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                Receive invoices, manage expenses, and pay your vendors
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                Enter <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50'} border-t py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Powerful Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FileText,
                title: 'Easy Invoice Creation',
                description: 'Create professional invoices in minutes with our intuitive builder',
              },
              {
                icon: Users,
                title: 'Customer Management',
                description: 'Organize and manage your customer database efficiently',
              },
              {
                icon: CreditCard,
                title: 'Payment Tracking',
                description: 'Monitor payment status and track outstanding invoices',
              },
              {
                icon: BarChart3,
                title: 'Analytics & Reports',
                description: 'Get insights into your business with detailed reports',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}
                >
                  <Icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} border-t py-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            © 2026 InvoiceHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
