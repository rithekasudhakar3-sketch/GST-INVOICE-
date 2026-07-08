import React from 'react';

export const SignatureCard = ({
  companyName = '',
  signatoryName = '',
  designation = '',
}) => {
  const formattedDate = new Date().toLocaleString('en-IN');

  return (
    <div className="w-full text-gray-800 text-[9px] font-sans flex flex-col justify-between h-full min-h-[90px]">
      {/* Declaration */}
      <div className="text-[7.5px] text-gray-500 italic leading-snug border-b border-gray-150 pb-1.5 mb-2">
        <span className="font-bold uppercase not-italic text-[6.5px] text-gray-600 block mb-0.5">Declaration:</span>
        I/We hereby certify that the particulars given above are true and correct.
      </div>

      {/* Signature and Seal Area */}
      <div className="flex justify-between items-end">
        {/* Seal Placeholder */}
        <div className="w-16 h-12 border border-dashed border-gray-300 rounded flex items-center justify-center text-[7px] text-gray-400 text-center uppercase p-1">
          Company Seal
        </div>

        {/* Digital Signature Stamp */}
        <div className="border border-green-600/30 bg-green-50/50 rounded p-1.5 flex flex-col items-center justify-center w-28 text-center shrink-0">
          <div className="flex items-center gap-1 text-green-700 font-extrabold text-[7px] uppercase tracking-wider">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Digitally Signed
          </div>
          <span className="text-[6px] text-gray-400 font-mono mt-0.5 leading-none">
            {formattedDate}
          </span>
        </div>

        {/* Signatory Name */}
        <div className="text-right w-[40%] flex flex-col items-end">
          <span className="text-[7px] font-bold text-gray-500 uppercase tracking-wider mb-8 block">
            For {companyName || 'the Supplier'}
          </span>
          <div className="border-t border-gray-400 w-full max-w-[120px] pt-1">
            <p className="font-bold text-gray-900 text-[9px] truncate">{signatoryName || 'Authorized Signatory'}</p>
            {designation && <p className="text-[7.5px] text-gray-500 font-semibold">{designation}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignatureCard;
