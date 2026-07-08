import React from 'react';

export const DeclarationCard = ({ className = '' }) => {
  return (
    <div className={`text-[7.5px] text-gray-500 italic leading-snug ${className}`}>
      <span className="font-bold uppercase not-italic text-[6.5px] text-gray-600 block mb-0.5 tracking-wider">
        Declaration:
      </span>
      I/We hereby certify that the particulars given above are true and correct.
    </div>
  );
};
export default DeclarationCard;
