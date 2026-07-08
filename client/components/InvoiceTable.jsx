import React from 'react';
import { calculateRowValues } from '../utils/gstCalculations';

export const InvoiceTable = ({ items = [], supplierStateCode, customerStateCode }) => {
  const intrastate = supplierStateCode === customerStateCode;

  return (
    <div className="w-full text-gray-800 text-[8.5px] font-sans">
      <table className="w-full border-collapse border-b border-gray-400">
        <thead>
          {/* Row 1 Header Groupings */}
          <tr className="bg-gray-50 border-b border-gray-400 text-center font-bold uppercase text-[7.5px] tracking-tight">
            <th rowSpan="2" className="border-r border-gray-450 py-2 w-[3%]">Sl</th>
            <th rowSpan="2" className="border-r border-gray-450 py-2 text-left pl-2 w-[23%]">Description of Goods</th>
            <th rowSpan="2" className="border-r border-gray-450 py-2 w-[7%]">HSN/SAC</th>
            <th rowSpan="2" className="border-r border-gray-450 py-2 w-[5%]">Qty</th>
            <th rowSpan="2" className="border-r border-gray-450 py-2 w-[4%]">Unit</th>
            <th rowSpan="2" className="border-r border-gray-450 py-2 w-[7%] text-right pr-1">Rate</th>
            <th rowSpan="2" className="border-r border-gray-450 py-2 w-[5%] text-right pr-1">Disc</th>
            <th rowSpan="2" className="border-r border-gray-450 py-2 w-[8%] text-right pr-2">Taxable Val</th>
            
            {/* CGST Group */}
            <th colSpan="2" className="border-r border-gray-450 py-0.5 w-[10%]">CGST</th>
            
            {/* SGST Group */}
            <th colSpan="2" className="border-r border-gray-450 py-0.5 w-[10%]">SGST</th>
            
            {/* IGST Group */}
            <th colSpan="2" className="border-r border-gray-450 py-0.5 w-[10%]">IGST</th>
            
            <th rowSpan="2" className="py-2 text-right pr-2 w-[10%]">Amount</th>
          </tr>
          {/* Row 2 Sub-Headers */}
          <tr className="bg-gray-50 border-b border-gray-400 text-center font-bold text-[7px] tracking-tight">
            <th className="border-r border-gray-400 py-1 w-[4%]">%</th>
            <th className="border-r border-gray-450 py-1 w-[6%]">Amt</th>
            <th className="border-r border-gray-400 py-1 w-[4%]">%</th>
            <th className="border-r border-gray-450 py-1 w-[6%]">Amt</th>
            <th className="border-r border-gray-400 py-1 w-[4%]">%</th>
            <th className="border-r border-gray-455 py-1 w-[6%]">Amt</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const rowValues = calculateRowValues(
              item.quantity,
              item.unitPrice,
              item.discount || 0,
              item.gstRate || 0,
              intrastate
            );

            return (
              <tr key={item.id || index} className="border-b border-gray-300 text-center font-medium">
                <td className="border-r border-gray-400 py-1.5 font-mono">{index + 1}</td>
                <td className="border-r border-gray-400 py-1.5 text-left pl-2 font-semibold text-gray-900 leading-tight">
                  <p>{item.name || 'Product Name'}</p>
                  {item.description && <p className="text-[7px] text-gray-500 font-normal italic leading-none mt-0.5">{item.description}</p>}
                </td>
                <td className="border-r border-gray-400 py-1.5 font-mono text-gray-600">{item.hsnCode || '-'}</td>
                <td className="border-r border-gray-400 py-1.5 font-mono">{item.quantity}</td>
                <td className="border-r border-gray-400 py-1.5 text-gray-600">{item.unit || 'PCS'}</td>
                <td className="border-r border-gray-400 py-1.5 text-right pr-1 font-mono">
                  {Number(item.unitPrice).toFixed(2)}
                </td>
                <td className="border-r border-gray-400 py-1.5 text-right pr-1 font-mono text-gray-600">
                  {item.discount ? Number(item.discount).toFixed(2) : '-'}
                </td>
                <td className="border-r border-gray-400 py-1.5 text-right pr-2 font-mono font-semibold text-gray-900">
                  {rowValues.taxableValue.toFixed(2)}
                </td>
                
                {/* CGST */}
                <td className="border-r border-gray-400 py-1.5 font-mono text-gray-500">
                  {intrastate ? `${item.gstRate / 2}%` : '-'}
                </td>
                <td className="border-r border-gray-400 py-1.5 text-right pr-1 font-mono text-gray-800">
                  {intrastate ? rowValues.cgst.toFixed(2) : '-'}
                </td>

                {/* SGST */}
                <td className="border-r border-gray-400 py-1.5 font-mono text-gray-500">
                  {intrastate ? `${item.gstRate / 2}%` : '-'}
                </td>
                <td className="border-r border-gray-400 py-1.5 text-right pr-1 font-mono text-gray-800">
                  {intrastate ? rowValues.sgst.toFixed(2) : '-'}
                </td>

                {/* IGST */}
                <td className="border-r border-gray-400 py-1.5 font-mono text-gray-500">
                  {!intrastate ? `${item.gstRate}%` : '-'}
                </td>
                <td className="border-r border-gray-400 py-1.5 text-right pr-1 font-mono text-gray-800">
                  {!intrastate ? rowValues.igst.toFixed(2) : '-'}
                </td>

                {/* Amount */}
                <td className="py-1.5 text-right pr-2 font-mono font-extrabold text-gray-950">
                  {rowValues.total.toFixed(2)}
                </td>
              </tr>
            );
          })}

          {/* Fill extra whitespace if table is short (for professional look) */}
          {items.length < 6 &&
            Array.from({ length: 6 - items.length }).map((_, i) => (
              <tr key={`empty-${i}`} className="border-b border-gray-150 text-center h-[22px] select-none opacity-0">
                <td className="border-r border-gray-400">-</td>
                <td className="border-r border-gray-400 text-left pl-2">-</td>
                <td className="border-r border-gray-400">-</td>
                <td className="border-r border-gray-400">-</td>
                <td className="border-r border-gray-400">-</td>
                <td className="border-r border-gray-400 text-right pr-1">-</td>
                <td className="border-r border-gray-400 text-right pr-1">-</td>
                <td className="border-r border-gray-400 text-right pr-2">-</td>
                <td className="border-r border-gray-400">-</td>
                <td className="border-r border-gray-400 text-right pr-1">-</td>
                <td className="border-r border-gray-400">-</td>
                <td className="border-r border-gray-400 text-right pr-1">-</td>
                <td className="border-r border-gray-400">-</td>
                <td className="border-r border-gray-400 text-right pr-1">-</td>
                <td className="text-right pr-2">-</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
