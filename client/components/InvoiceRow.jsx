import React from 'react';
import { Trash2, Copy, Tag } from 'lucide-react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';

export const InvoiceRow = ({
  index,
  register,
  remove,
  watch,
  setValue,
  productsData = [],
  gstRatesData = [],
  errors = {}
}) => {
  const handleProductSelectionLocal = (prodId) => {
    const prod = productsData.find(p => p.id === prodId);
    if (prod) {
      setValue(`items.${index}.product_id`, prod.id);
      setValue(`items.${index}.name`, prod.name);
      setValue(`items.${index}.description`, prod.description || '');
      setValue(`items.${index}.hsnCode`, prod.hsnCode || '');
      setValue(`items.${index}.unit`, prod.unit || 'PCS');
      setValue(`items.${index}.unitPrice`, prod.price || 0);
      setValue(`items.${index}.gstRate`, prod.gstRate || 18);
    }
  };

  const handleDuplicateItemLocal = () => {
    // Parent duplicates, we just trigger duplicate event by copying fields
    const currentItem = watch(`items.${index}`);
    // In our implementation, parent handles insert, so we don't duplicate ourselves,
    // instead the parent handles the click. But let's export a duplicate action.
  };

  const currentItem = watch(`items.${index}`) || {};
  const rowSubtotal = (Number(currentItem.quantity) || 0) * (Number(currentItem.unitPrice) || 0);
  const rowTaxable = Math.max(0, rowSubtotal - (Number(currentItem.discount) || 0));

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-gray-50/50 dark:bg-gray-900/50 space-y-3 relative transition-all hover:border-gray-300 dark:hover:border-gray-700">
      {/* Remove Row Button */}
      <button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
        title="Delete Item"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Row Header: Selection & HSN */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pr-6">
        <div className="sm:col-span-8">
          <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 block uppercase tracking-wider">
            Select Product/Service Preset
          </label>
          <select
            onChange={(e) => handleProductSelectionLocal(e.target.value)}
            defaultValue=""
            className="text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-1.5 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Choose item from catalog...</option>
            {productsData.map(p => (
              <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
            ))}
          </select>
        </div>
        
        <div className="sm:col-span-4">
          <InputField 
            label="HSN/SAC Code" 
            placeholder="e.g. 8471"
            {...register(`items.${index}.hsnCode`)} 
          />
        </div>
      </div>

      {/* Item Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField 
          label="Item/Service Description" 
          placeholder="Display Name on Invoice"
          {...register(`items.${index}.name`, { required: 'Description is required' })} 
          error={errors?.items?.[index]?.name}
        />
        <InputField 
          label="Detailed Notes / Specifications" 
          placeholder="Specifications, Serial numbers, etc."
          {...register(`items.${index}.description`)} 
        />
      </div>

      {/* Row Calculations */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
        <InputField 
          label="Qty" 
          type="number"
          placeholder="0"
          {...register(`items.${index}.quantity`, { valueAsNumber: true })} 
        />
        <InputField 
          label="Unit" 
          placeholder="e.g. PCS, NOS"
          {...register(`items.${index}.unit`)} 
        />
        <InputField 
          label="Rate (Unit Price)" 
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} 
        />
        <InputField 
          label="Discount (Flat)" 
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register(`items.${index}.discount`, { valueAsNumber: true })} 
        />
        <SelectField 
          label="GST Rate %" 
          options={gstRatesData.map(g => ({ value: g.rate, label: g.label }))}
          {...register(`items.${index}.gstRate`, { valueAsNumber: true })} 
        />
      </div>

      {/* Row Totals Summary Bar */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-950 p-2 rounded border border-gray-150 dark:border-gray-800/80 text-[10px] font-mono text-gray-500">
        <span>Taxable Value: <strong className="text-gray-900 dark:text-white font-semibold">₹ {rowTaxable.toFixed(2)}</strong></span>
        <span>
          Computed Row Total (Incl. GST):{' '}
          <strong className="text-blue-600 dark:text-blue-400 font-bold">
            ₹ {(rowTaxable * (1 + (Number(currentItem.gstRate) || 0) / 100)).toFixed(2)}
          </strong>
        </span>
      </div>
    </div>
  );
};
export default InvoiceRow;
