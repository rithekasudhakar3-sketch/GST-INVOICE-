import React from 'react';

export const BankDetails = ({ bank = {} }) => {
  const {
    bankName = '',
    accountHolder = '',
    accountNumber = '',
    ifscCode = '',
    branch = '',
    upiId = '',
  } = bank;

  return (
    <div className="w-full text-gray-800 text-[9px] font-sans flex items-stretch gap-4 justify-between">
      {/* Left: Bank Details Table */}
      <div className="flex-1">
        <h4 className="text-[7.5px] font-bold text-gray-500 uppercase tracking-wider mb-1">
          Settlement Bank Account Details
        </h4>
        <table className="w-full border border-gray-300 text-[8px] leading-relaxed">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="bg-gray-50 border-r border-gray-200 font-bold px-2 py-0.5 w-[30%]">Bank Name</td>
              <td className="px-2 py-0.5 text-gray-900 font-bold">{bankName || '-'}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="bg-gray-50 border-r border-gray-200 font-bold px-2 py-0.5">Account Name</td>
              <td className="px-2 py-0.5 text-gray-800 font-medium">{accountHolder || '-'}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="bg-gray-50 border-r border-gray-200 font-bold px-2 py-0.5">Account No.</td>
              <td className="px-2 py-0.5 font-mono font-bold text-gray-900">{accountNumber || '-'}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="bg-gray-50 border-r border-gray-200 font-bold px-2 py-0.5">IFSC Code</td>
              <td className="px-2 py-0.5 font-mono font-bold text-blue-900">{ifscCode || '-'}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="bg-gray-50 border-r border-gray-200 font-bold px-2 py-0.5">Branch</td>
              <td className="px-2 py-0.5 text-gray-700">{branch || '-'}</td>
            </tr>
            <tr>
              <td className="bg-gray-50 border-r border-gray-200 font-bold px-2 py-0.5">UPI ID</td>
              <td className="px-2 py-0.5 font-mono font-bold text-teal-800">{upiId || 'Not Setup'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Right: QR Code Placeholder */}
      {upiId && (
        <div className="shrink-0 flex flex-col items-center justify-center p-2 border border-gray-300 bg-white rounded w-20">
          <span className="text-[6px] font-bold text-gray-400 uppercase tracking-tight mb-1 text-center leading-none">
            Scan to Pay
          </span>
          {/* Vector SVG Mock QR Code */}
          <svg className="w-12 h-12 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h6v6H3V3zm1 1v4h4V4H4zm1 1h2v2H5V5zm6-2h2v2h-2V3zm3 0h4v4h-4V3zm1 1v2h2V4h-2zM3 15h6v6H3v-6zm1 1v4h4v-4H4zm1 1h2v2H5v-2zm9-3h2v2h-2v-2zm3 0h2v2h-2v-2zm-3 3h2v2h-2v-2zm3 0h2v4h-2v-4zm-3 3h2v2h-2v-2zm-6-8h2v2h-2V9zm3 0h2v2h-2V9zm-3 3h2v2h-2v-2zm6 0h2v2h-2v-2zm3-3h2v2h-2V9zm-3 9h2v2h-2v-2z" />
          </svg>
          <span className="text-[6px] text-gray-500 font-mono mt-1 font-semibold leading-none truncate w-full text-center">
            {upiId}
          </span>
        </div>
      )}
    </div>
  );
};
