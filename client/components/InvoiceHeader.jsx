import React from 'react';

export const InvoiceHeader = ({ data = {} }) => {
  const {
    invoiceNumber = '',
    invoiceDate = '',
    dueDate = '',
    referenceNumber = '',
    challanNumber = '',
    placeOfSupply = '',
    paymentTerms = '',
    reverseCharge = 'No',
    supplier = {}
  } = data;

  return (
    <div className="w-full text-gray-800 text-[10px] font-sans border-b border-gray-400">
      {/* Centered Large Tax Invoice Title */}
      <div className="text-center py-2.5 bg-gray-50 border-b border-gray-400">
        <h1 className="text-sm font-extrabold uppercase tracking-widest text-gray-900">
          Tax Invoice
        </h1>
      </div>

      {/* Header Grid */}
      <div className="grid grid-cols-12">
        {/* Left Side: Supplier Details (Span 7) */}
        <div className="col-span-7 p-3 border-r border-gray-400 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Logo and Name */}
            <div className="flex items-start gap-3">
              {supplier.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={supplier.logo}
                  alt="Logo"
                  className="w-11 h-11 object-contain rounded border border-gray-200 mt-0.5 print:h-9 print:w-9"
                />
              )}
              <div>
                <h2 className="text-sm font-extrabold text-gray-950 tracking-tight leading-tight">
                  {supplier.name || 'Company Name'}
                </h2>
                {supplier.tagline && (
                  <p className="text-[8px] text-gray-500 font-semibold italic">
                    {supplier.tagline}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-0.5 text-gray-600 text-[9px] leading-relaxed">
              <p>{supplier.address}</p>
              <p>{supplier.city}, {supplier.state} - {supplier.pincode}</p>
            </div>
          </div>

          {/* Registrations & Contacts */}
          <div className="mt-4 pt-2 border-t border-gray-200 grid grid-cols-2 gap-y-0.5 gap-x-2 text-[9px]">
            <p className="font-mono">GSTIN: <span className="font-bold text-gray-900">{supplier.gstin || 'N/A'}</span></p>
            <p className="font-mono">PAN: <span className="font-semibold text-gray-800">{supplier.pan || 'N/A'}</span></p>
            <p>Phone: <span className="text-gray-700 font-medium">{supplier.phone}</span></p>
            <p>Email: <span className="text-gray-700 font-medium">{supplier.email}</span></p>
            {supplier.website && (
              <p className="col-span-2">Website: <span className="text-gray-700 font-medium">{supplier.website}</span></p>
            )}
          </div>
        </div>

        {/* Right Side: Invoice Meta bordered table (Span 5) */}
        <div className="col-span-5 grid grid-cols-2 text-[9px] h-full">
          <div className="p-2 border-b border-r border-gray-300">
            <span className="text-[8px] text-gray-500 font-bold uppercase block">Invoice No.</span>
            <span className="font-bold text-gray-950 text-xs">{invoiceNumber || 'DRAFT'}</span>
          </div>
          <div className="p-2 border-b border-gray-300">
            <span className="text-[8px] text-gray-500 font-bold uppercase block">Dated</span>
            <span className="font-bold text-gray-900">{invoiceDate || 'dd-mm-yyyy'}</span>
          </div>

          <div className="p-2 border-b border-r border-gray-300">
            <span className="text-[8px] text-gray-500 font-bold uppercase block">Due Date</span>
            <span className="font-semibold text-gray-800">{dueDate || 'dd-mm-yyyy'}</span>
          </div>
          <div className="p-2 border-b border-gray-300">
            <span className="text-[8px] text-gray-500 font-bold uppercase block">Reference No.</span>
            <span className="font-semibold text-gray-800">{referenceNumber || '-'}</span>
          </div>

          <div className="p-2 border-b border-r border-gray-300">
            <span className="text-[8px] text-gray-500 font-bold uppercase block">Challan No.</span>
            <span className="font-semibold text-gray-800">{challanNumber || '-'}</span>
          </div>
          <div className="p-2 border-b border-gray-300">
            <span className="text-[8px] text-gray-500 font-bold uppercase block">Place of Supply</span>
            <span className="font-semibold text-gray-800">{placeOfSupply || 'N/A'}</span>
          </div>

          <div className="p-2 border-r border-gray-300">
            <span className="text-[8px] text-gray-500 font-bold uppercase block">Terms of Payment</span>
            <span className="text-gray-800 font-semibold">{paymentTerms || '-'}</span>
          </div>
          <div className="p-2">
            <span className="text-[8px] text-gray-500 font-bold uppercase block">Reverse Charge</span>
            <span className="text-gray-800 font-semibold">{reverseCharge || 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
