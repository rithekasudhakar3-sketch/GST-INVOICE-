import React from 'react';

export const NotesCard = ({ notes = '', terms = '' }) => {
  // Split terms by newlines to allow multiple listed items
  const termsList = terms ? terms.split('\n').filter(t => t.trim()) : [];

  return (
    <div className="w-full text-gray-800 text-[9px] font-sans space-y-2">
      {/* Notes / Remarks */}
      {notes && (
        <div>
          <span className="font-bold text-gray-500 uppercase block text-[7.5px] mb-0.5 tracking-wider">
            Remarks / Special Notes:
          </span>
          <p className="text-gray-700 bg-gray-50/50 p-1.5 border border-gray-200 rounded leading-relaxed">
            {notes}
          </p>
        </div>
      )}

      {/* Terms & Conditions */}
      {termsList.length > 0 && (
        <div>
          <span className="font-bold text-gray-500 uppercase block text-[7.5px] mb-0.5 tracking-wider">
            Terms & Conditions:
          </span>
          <ul className="list-decimal list-inside space-y-0.5 text-gray-600 bg-gray-50/50 p-1.5 border border-gray-200 rounded">
            {termsList.map((term, index) => (
              <li key={index} className="leading-relaxed">
                {term.replace(/^\d+\.\s*/, '')} {/* Remove existing numbering if entered by user */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default NotesCard;
