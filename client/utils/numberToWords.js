/**
 * Utility to convert numbers into Indian Rupees and Paise in words.
 */

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

const convertLessThanThousand = (num) => {
  if (num === 0) return '';
  
  let str = '';
  
  if (num >= 100) {
    str += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  
  if (num >= 20) {
    str += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  }
  
  if (num > 0) {
    str += ones[num] + ' ';
  }
  
  return str.trim();
};

/**
 * Converts a number to Indian system words (Lakhs, Crores, etc.)
 *
 * @param {number} num - The number to convert
 * @returns {string} The text representation
 */
export const numberToWordsIndian = (num) => {
  if (num === 0) return 'Zero';
  
  // Split into Rupees and Paise
  const rounded = Number(num).toFixed(2);
  const parts = rounded.split('.');
  let rupees = parseInt(parts[0], 10);
  const paise = parseInt(parts[1], 10);
  
  let rupeeStr = '';
  
  if (rupees === 0) {
    rupeeStr = 'Zero';
  } else {
    // Crores
    if (rupees >= 10000000) {
      rupeeStr += convertLessThanThousand(Math.floor(rupees / 10000000)) + ' Crore ';
      rupees %= 10000000;
    }
    
    // Lakhs
    if (rupees >= 100000) {
      rupeeStr += convertLessThanThousand(Math.floor(rupees / 100000)) + ' Lakh ';
      rupees %= 100000;
    }
    
    // Thousands
    if (rupees >= 1000) {
      rupeeStr += convertLessThanThousand(Math.floor(rupees / 1000)) + ' Thousand ';
      rupees %= 1000;
    }
    
    // Remaining Hundreds, Tens, Ones
    if (rupees > 0) {
      rupeeStr += convertLessThanThousand(rupees) + ' ';
    }
  }
  
  let wordResult = 'Rupees ' + rupeeStr.trim();
  
  if (paise > 0) {
    const paiseStr = convertLessThanThousand(paise);
    wordResult += ' and ' + paiseStr.trim() + ' Paise';
  }
  
  wordResult += ' Only';
  
  // Clean up double spaces
  return wordResult.replace(/\s+/g, ' ');
};
