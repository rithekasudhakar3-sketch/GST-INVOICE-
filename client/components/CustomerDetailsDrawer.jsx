'use client';

import { X, Building2, Phone, Mail, MapPin, BadgeCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function CustomerDetailsDrawer({ customer, isOpen, onClose }) {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="h-full w-full max-w-xl bg-white shadow-2xl dark:bg-gray-950">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <p className="text-sm font-medium text-blue-600">Customer profile</p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{customer.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close customer details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-6">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 font-semibold text-white">
                {customer.name.split(' ').slice(0, 2).map((word) => word[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{customer.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{customer.city}, {customer.state}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> {customer.email}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> {customer.phone}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> {customer.address}</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">GSTIN</p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white">{customer.gstin}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Purchases</p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white">{formatCurrency(customer.totalPurchases)}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Invoices</p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white">{customer.invoiceCount}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Relationship</p>
              <p className="mt-1 flex items-center gap-2 font-semibold text-green-600">
                <BadgeCheck className="h-4 w-4" /> Active
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Building2 className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold">Recent activity</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">Last invoice raised for {formatCurrency(customer.totalPurchases / 2)}</li>
              <li className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">Preferred payment mode: Bank transfer</li>
              <li className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">Credit terms: Net 30 days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
