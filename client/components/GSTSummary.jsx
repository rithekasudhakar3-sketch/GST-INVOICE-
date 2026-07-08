import React from 'react';

export const GSTSummary = ({ summary = {}, supplierStateCode, customerStateCode }) => {
  const intrastate = supplierStateCode === customerStateCode;
  const {
    subtotal = 0,
    discount = 0,
    taxableAmount = 0,
    cgst = 0,
    sgst = 0,
    igst = 0,
    roundOff = 0,
    grandTotal = 0,
  } = summary;

  return (
    <div className="w-full text-gray-800 text-[10px] font-sans">
      <div className="flex flex-col border-l border-gray-400">
        {/* Subtotal Row */}
        <div className="flex justify-between py-1 px-3 border-b border-gray-300">
          <span className="font-semibold text-gray-600">Subtotal:</span>
          <span className="font-mono">{subtotal.toFixed(2)}</span>
        </div>

        {/* Discount Row */}
        {discount > 0 && (
          <div className="flex justify-between py-1 px-3 border-b border-gray-300 text-green-700">
            <span className="font-semibold">Discount (-):</span>
            <span className="font-mono">-{discount.toFixed(2)}</span>
          </div>
        )}

        {/* Taxable Amount Row */}
        <div className="flex justify-between py-1 px-3 border-b border-gray-300 bg-gray-50/50">
          <span className="font-semibold text-gray-700">Taxable Value:</span>
          <span className="font-mono font-semibold">{taxableAmount.toFixed(2)}</span>
        </div>

        {/* Taxes */}
        {intrastate ? (
          <>
            <div className="flex justify-between py-1 px-3 border-b border-gray-300">
              <span className="font-semibold text-gray-600">Central Tax (CGST):</span>
              <span className="font-mono">{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 px-3 border-b border-gray-300">
              <span className="font-semibold text-gray-600">State Tax (SGST):</span>
              <span className="font-mono">{sgst.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between py-1 px-3 border-b border-gray-300">
            <span className="font-semibold text-gray-600">Integrated Tax (IGST):</span>
            <span className="font-mono">{igst.toFixed(2)}</span>
          </div>
        )}

        {/* Round Off */}
        {roundOff !== 0 && (
          <div className="flex justify-between py-1 px-3 border-b border-gray-300">
            <span className="font-semibold text-gray-600">Round Off:</span>
            <span className="font-mono">{roundOff > 0 ? `+${roundOff.toFixed(2)}` : roundOff.toFixed(2)}</span>
          </div>
        )}

        {/* Grand Total */}
        <div className="flex justify-between py-2 px-3 bg-blue-50 border-b border-gray-400 text-gray-900">
          <span className="font-bold text-xs uppercase text-blue-900">Grand Total:</span>
          <span className="font-mono font-bold text-xs text-blue-900">₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};
