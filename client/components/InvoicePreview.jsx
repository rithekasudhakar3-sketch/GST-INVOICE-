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
});

InvoicePreview.displayName = 'InvoicePreview';
export default InvoicePreview;
