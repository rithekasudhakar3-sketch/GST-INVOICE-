'use client';

import { useMemo } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileText, QrCode, Signature, BadgeCheck } from 'lucide-react';

export function InvoicePreview({ invoice, company, customer, items, discount, notes, terms, isDark }) {
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const gst = items.reduce((sum, item) => sum + item.quantity * item.price * (item.gst / 100), 0);
    const roundedTotal = subtotal + gst - discount;
    return {
      subtotal,
      gst,
      discount,
      total: roundedTotal,
      roundedTotal: Math.round(roundedTotal),
    };
  }, [items, discount]);

  const amountInWords = useMemo(() => {
    return `${formatCurrency(totals.roundedTotal)} only`;
  }, [totals.roundedTotal]);

  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${isDark ? 'border-gray-800 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'}`}>
      <div className="mb-6 flex flex-col gap-4 border-b border-dashed pb-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Tax Invoice</p>
            <h3 className="text-xl font-semibold">{company.companyName || 'Acme Corp'}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{company.gstin || '18AABCT1234H1Z0'}</p>
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold text-gray-900 dark:text-white">Invoice #{invoice.invoiceNumber || 'INV-0001'}</p>
          <p>Date: {formatDate(invoice.invoiceDate || new Date().toISOString().split('T')[0])}</p>
          <p>Due: {formatDate(invoice.dueDate || new Date().toISOString().split('T')[0])}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.7fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">From</p>
            <p className="font-semibold">{company.companyName || 'Acme Corp'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{company.address || '123 Market Street, Mumbai'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{company.phone || '+91 9876543210'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Bill To</p>
            <p className="font-semibold">{customer?.name || 'Customer Name'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{customer?.address || 'Customer Address'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{customer?.gstin || 'GSTIN'}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Payment QR</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">UPI / Bank transfer</p>
            </div>
            <div className="rounded-lg border border-dashed border-gray-300 p-2 dark:border-gray-700">
              <QrCode className="h-8 w-8 text-gray-500" />
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <p className="text-sm font-semibold">Authorized Signature</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Signature className="h-4 w-4" />
              <span>{company.authorizedName || 'Authorized Signatory'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/70">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Item</th>
              <th className="px-4 py-3 text-left font-semibold">Qty</th>
              <th className="px-4 py-3 text-left font-semibold">Rate</th>
              <th className="px-4 py-3 text-left font-semibold">GST</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">{item.name || item.productName || 'Item'}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">{formatCurrency(item.price)}</td>
                <td className="px-4 py-3">{item.gst}%</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(item.quantity * item.price * (1 + item.gst / 100))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-sm font-semibold">Notes</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{notes || 'Thank you for your business.'}</p>
          <p className="mt-4 text-sm font-semibold">Terms & Conditions</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{terms || 'Payment due within 30 days.'}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span>GST</span><span>{formatCurrency(totals.gst)}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span>Discount</span><span>-{formatCurrency(totals.discount)}</span></div>
          <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-base font-semibold dark:border-gray-700"><span>Total</span><span>{formatCurrency(totals.roundedTotal)}</span></div>
          <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
            <div className="flex items-center gap-2 font-semibold"><BadgeCheck className="h-4 w-4" /> Amount in words</div>
            <p className="mt-1">{amountInWords}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
