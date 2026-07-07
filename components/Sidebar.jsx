'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

const sellerMenuItems = [
  { name: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
  { name: 'Customers', href: '/seller/customers', icon: Users },
  { name: 'Products', href: '/seller/products', icon: Package },
  { name: 'Invoices', href: '/seller/invoices', icon: FileText },
  { name: 'Payments', href: '/seller/payments', icon: CreditCard },
  { name: 'Reports', href: '/seller/reports', icon: BarChart3 },
  { name: 'Notifications', href: '/seller/notifications', icon: Bell },
  { name: 'Settings', href: '/seller/settings', icon: Settings },
];

const clientMenuItems = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Received Invoices', href: '/client/invoices', icon: FileText },
  { name: 'Vendors', href: '/client/vendors', icon: Users },
  { name: 'Payments', href: '/client/payments', icon: CreditCard },
  { name: 'Reports', href: '/client/reports', icon: BarChart3 },
  { name: 'Notifications', href: '/client/notifications', icon: Bell },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export function Sidebar({ role, isDark }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const menuItems = role === 'seller' ? sellerMenuItems : clientMenuItems;
  const baseHref = role === 'seller' ? '/seller' : '/client';

  const isActiveLink = (href) => pathname === href;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-20 left-4 z-30 lg:hidden p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 transition-all ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r overflow-y-auto z-20`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? `${isDark ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`
                    : `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-50'}`
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
