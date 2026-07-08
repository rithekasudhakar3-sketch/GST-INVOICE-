import React from 'react';

export const CustomerCard = ({ data = {} }) => {
  const {
    name = '',
    gstin = '',
    billingAddress = '',
    shippingAddress = '',
    contactPerson = '',
    email = '',
    phone = '',
    state = '',
    stateCode = '',
    pincode = '',
    isUnregistered = false,
  } = data;

  return (
    <div className="w-full text-gray-800 text-[10px] grid grid-cols-2 border-b border-gray-400 font-sans">
      {/* Left Box: Bill To */}
      <div className="p-3 border-r border-gray-400">
        <h3 className="text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-1 bg-gray-50 border border-gray-250 px-1 py-0.5 inline-block rounded">
          Bill To (Buyer)
        </h3>
        
        <div className="mt-1 space-y-0.5">
          <p className="text-xs font-extrabold text-gray-950">{name || 'Customer Name'}</p>
          
          {!isUnregistered && gstin && (
            <p className="font-mono text-[9px] mt-0.5">
              GSTIN: <span className="font-bold text-gray-900">{gstin}</span>
            </p>
          )}

          <div className="text-gray-600 text-[9px] mt-1.5 leading-relaxed">
            <p>{billingAddress || 'Billing Address Details'}</p>
            <p>
              {state && `${state}`} {pincode && `- ${pincode}`} {stateCode && `(State Code: ${stateCode})`}
            </p>
          </div>

          <div className="mt-2 text-[8px] text-gray-500 grid grid-cols-2 gap-1 border-t border-gray-100 pt-1.5">
            {contactPerson && <p>Attn: <span className="text-gray-700 font-semibold">{contactPerson}</span></p>}
            {phone && <p>Ph: <span className="text-gray-700 font-mono font-medium">{phone}</span></p>}
            {email && <p className="col-span-2">Email: <span className="text-gray-700 font-medium">{email}</span></p>}
          </div>
        </div>
      </div>

      {/* Right Box: Ship To */}
      <div className="p-3">
        <h3 className="text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-1 bg-gray-50 border border-gray-250 px-1 py-0.5 inline-block rounded">
          Ship To (Consignee)
        </h3>

        <div className="mt-1 space-y-0.5">
          {isUnregistered ? (
            <div className="space-y-0.5 text-gray-600 leading-relaxed">
              <p className="text-xs font-extrabold text-gray-950">{name || 'Recipient Name'}</p>
              <p>{billingAddress || 'Delivery Address Details'}</p>
              <p>
                {state && `${state}`} {pincode && `- ${pincode}`} {stateCode && `(State Code: ${stateCode})`}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5 text-gray-600 leading-relaxed">
              <p className="text-xs font-extrabold text-gray-950">{name || 'Customer Name'}</p>
              <p>{shippingAddress || billingAddress || 'Shipping Address Details'}</p>
              <p>
                {state && `${state}`} {pincode && `- ${pincode}`} {stateCode && `(State Code: ${stateCode})`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
