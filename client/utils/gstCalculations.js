/**
 * Utility to calculate GST splits (CGST, SGST, IGST) and invoice subtotals.
 */

/**
 * Checks if the transaction is intrastate (CGST + SGST) or interstate (IGST)
 * based on supplier and customer state/state codes.
 *
 * @param {string} supplierStateCode
 * @param {string} customerStateCode
 * @returns {boolean} True if intrastate (same state), false if interstate (different states)
 */
export const isIntrastate = (supplierStateCode, customerStateCode) => {
  if (!supplierStateCode || !customerStateCode) return true;
  return supplierStateCode.trim() === customerStateCode.trim();
};

/**
 * Calculate row-level GST and values
 *
 * @param {number} qty
 * @param {number} price
 * @param {number} discountAmt - Flat discount amount on this row
 * @param {number} gstRate - Total GST percentage (e.g. 18, 12, etc.)
 * @param {boolean} intrastate - True to calculate CGST + SGST, false for IGST
 */
export const calculateRowValues = (qty, price, discountAmt, gstRate, intrastate) => {
  const quantity = Number(qty) || 0;
  const unitPrice = Number(price) || 0;
  const discount = Number(discountAmt) || 0;
  const gstPercent = Number(gstRate) || 0;

  const grossValue = quantity * unitPrice;
  const taxableValue = Math.max(0, grossValue - discount);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (intrastate) {
    const splitRate = gstPercent / 2;
    cgst = (taxableValue * splitRate) / 100;
    sgst = (taxableValue * splitRate) / 100;
    igst = 0;
  } else {
    cgst = 0;
    sgst = 0;
    igst = (taxableValue * gstPercent) / 100;
  }

  const rowTotal = taxableValue + cgst + sgst + igst;

  return {
    grossValue,
    taxableValue,
    cgst: Number(cgst.toFixed(2)),
    sgst: Number(sgst.toFixed(2)),
    igst: Number(igst.toFixed(2)),
    total: Number(rowTotal.toFixed(2)),
  };
};

/**
 * Calculate entire invoice summaries
 *
 * @param {Array} items - List of row items
 * @param {string} supplierStateCode
 * @param {string} customerStateCode
 * @param {number} overallDiscount - Overall invoice-level discount
 */
export const calculateInvoiceSummary = (items = [], supplierStateCode, customerStateCode, overallDiscount = 0) => {
  const intrastate = isIntrastate(supplierStateCode, customerStateCode);

  let subtotal = 0; // sum of gross values
  let totalDiscount = 0; // sum of row discounts + overall discount
  let taxableAmount = 0; // sum of taxable values
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;

  items.forEach((item) => {
    const row = calculateRowValues(
      item.quantity,
      item.unitPrice,
      item.discount || 0,
      item.gstRate || 0,
      intrastate
    );

    subtotal += row.grossValue;
    totalDiscount += Number(item.discount || 0);
    taxableAmount += row.taxableValue;
    cgstTotal += row.cgst;
    sgstTotal += row.sgst;
    igstTotal += row.igst;
  });

  // Apply overall discount
  const finalDiscount = totalDiscount + Number(overallDiscount);
  const adjustedTaxableAmount = Math.max(0, taxableAmount - Number(overallDiscount));

  // Recalculate tax if overall discount is applied (or keep simple row-based summation)
  // Standard practice is summing row taxes. If overall discount is applied, it reduces the taxable value.
  // For standard invoices, we will do a simple summation of row taxes.
  
  const rawGrandTotal = adjustedTaxableAmount + cgstTotal + sgstTotal + igstTotal;
  const roundedGrandTotal = Math.round(rawGrandTotal);
  const roundOff = Number((roundedGrandTotal - rawGrandTotal).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(finalDiscount.toFixed(2)),
    taxableAmount: Number(adjustedTaxableAmount.toFixed(2)),
    cgst: Number(cgstTotal.toFixed(2)),
    sgst: Number(sgstTotal.toFixed(2)),
    igst: Number(igstTotal.toFixed(2)),
    roundOff,
    grandTotal: roundedGrandTotal,
  };
};
