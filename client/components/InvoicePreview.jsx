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
import React from 'react';
import { InvoiceHeader } from './InvoiceHeader';
import { CustomerCard } from './CustomerCard';
import { InvoiceTable } from './InvoiceTable';
import { GSTSummary } from './GSTSummary';
import { BankDetails } from './BankDetails';
import { SignatureCard } from './SignatureCard';
import { NotesCard } from './NotesCard';
import { DeclarationCard } from './DeclarationCard';
import { calculateInvoiceSummary } from '../utils/gstCalculations';
import { numberToWordsIndian } from '../utils/numberToWords';

export const InvoicePreview = React.forwardRef(({ data = {}, id = 'invoice-print-area' }, ref) => {
  const {
    supplier = {},
    customer = {},
    items = [],
    overallDiscount = 0,
    notes = '',
    terms = '',
    paymentStatus = 'Pending',
    signatoryName = '',
    designation = '',
    bank = {},
    invoiceNumber = '',
    invoiceDate = '',
    dueDate = '',
    referenceNumber = '',
    challanNumber = '',
    placeOfSupply = '',
    paymentTerms = '',
    reverseCharge = 'No',
  } = data;

  // Compute final aggregates for the invoice sheet
  const summary = calculateInvoiceSummary(
    items,
    supplier.stateCode,
    customer.stateCode,
    overallDiscount
  );

  const amountInWords = numberToWordsIndian(summary.grandTotal);

  return (
    <div className="w-full overflow-x-auto p-4 flex justify-center bg-gray-100 dark:bg-gray-800/40 border-l border-gray-200 dark:border-gray-800">
      {/* Print Styles Override */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide all external application frames */
          body * {
            visibility: hidden !important;
            background: #ffffff !important;
          }
          #${id}, #${id} * {
            visibility: visible !important;
          }
          #${id} {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 8mm !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
          /* High-density traditional font settings for print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color: #111827 !important;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          }
          .print-bg-gray {
            background-color: #f9fafb !important;
          }
        }
      `}} />

      {/* A4 Sheet Border Box */}
      <div
        id={id}
        ref={ref}
        className="w-[794px] min-h-[1123px] bg-white text-gray-900 border-2 border-gray-400 p-6 flex flex-col justify-between select-none relative box-border font-sans"
        style={{
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 16px -6px rgba(0,0,0,0.05)',
        }}
      >
        {/* UPPER PORTION: HEADER, CUSTOMER & PRODUCT TABLE */}
        <div className="flex flex-col border border-gray-400">
          
          {/* Section 1: Supplier Info and Invoice Meta */}
          <InvoiceHeader 
            data={{
              invoiceNumber,
              invoiceDate,
              dueDate,
              referenceNumber,
              challanNumber,
              placeOfSupply,
              paymentTerms,
              reverseCharge,
              supplier
            }} 
          />

          {/* Section 2: Buyer Split Boxes */}
          <CustomerCard data={customer} />

          {/* Section 3: Product List 15-Column Table */}
          <InvoiceTable
            items={items}
            supplierStateCode={supplier.stateCode}
            customerStateCode={customer.stateCode}
          />
        </div>

        {/* LOWER PORTION: PAYMENTS, SUMS, BANK, DECLARATIONS & SIGNATURE */}
        <div className="mt-auto space-y-4">
          
          {/* Main summary split grid: Bank, Words & Notes on Left | Subtotal Math on Right */}
          <div className="grid grid-cols-12 border border-gray-400">
            
            {/* Left side: Bank, Verbal total, Notes (Span 7) */}
            <div className="col-span-7 p-3 border-r border-gray-400 flex flex-col justify-between gap-3">
              
              {/* Verbal Grand Total */}
              <div>
                <span className="text-[7px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                  Amount Chargeable (in words):
                </span>
                <p className="text-[8.5px] font-extrabold text-gray-950 capitalize leading-tight">
                  {amountInWords}
                </p>
              </div>

              {/* Settlement Bank Details */}
              <div className="border-t border-gray-200 pt-2">
                <BankDetails bank={bank} />
              </div>

              {/* Disclaimers, Remarks & T&C */}
              {(notes || terms) && (
                <div className="border-t border-gray-200 pt-2">
                  <NotesCard notes={notes} terms={terms} />
                </div>
              )}
            </div>

            {/* Right side: Arithmetic Summary Table (Span 5) */}
            <div className="col-span-5 bg-gray-50/20">
              <GSTSummary
                summary={summary}
                supplierStateCode={supplier.stateCode}
                customerStateCode={customer.stateCode}
              />
            </div>
          </div>

          {/* Declaration and Signature block */}
          <div className="grid grid-cols-12 border border-gray-400 p-3">
            <div className="col-span-12">
              <SignatureCard
                companyName={supplier.name}
                signatoryName={signatoryName}
                designation={designation}
              />
            </div>
          </div>

          {/* Proxima ERP Print Footer */}
          <div className="flex justify-between items-center text-[7.5px] text-gray-400 mt-2 border-t border-gray-200 pt-2 font-mono">
            <span>Generated by Proxima Invoice System</span>
            
            <div className="flex items-center gap-1">
              <span className="font-bold uppercase tracking-wider text-gray-500">Invoice Status:</span>
              <span className={`px-1.5 py-0.5 rounded text-[7px] font-extrabold uppercase border ${
                paymentStatus === 'Paid' ? 'bg-green-50 border-green-200 text-green-700' :
                paymentStatus === 'Pending' ? 'bg-yellow-50 border-yellow-250 text-yellow-700' :
                paymentStatus === 'Sent' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                paymentStatus === 'Partial' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                paymentStatus === 'Overdue' ? 'bg-red-50 border-red-200 text-red-750' :
                'bg-gray-50 border-gray-250 text-gray-700'
              }`}>
                {paymentStatus}
              </span>
            </div>
            
            <span className="font-semibold uppercase tracking-wider">E. & O.E.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
});

InvoicePreview.displayName = 'InvoicePreview';
export default InvoicePreview;
