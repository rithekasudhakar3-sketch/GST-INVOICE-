import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a high-quality A4 PDF of the invoice preview.
 *
 * @param {string} elementId - The ID of the preview DOM element
 * @param {string} invoiceNumber - The dynamic invoice number for the filename
 */
export const downloadInvoicePDF = async (elementId, invoiceNumber = 'DRAFT') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return;
  }

  try {
    // Save original styles/classes
    const originalShadow = element.style.boxShadow;
    const originalBorder = element.style.border;
    
    // Temporarily clean up shadow/border for PDF rendering
    element.style.boxShadow = 'none';
    element.style.border = 'none';

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true, // Allow external assets (dicebear avatars, unsplash)
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794, // Standard A4 width in pixels at 72 DPI (scale 2 makes it sharper)
    });

    // Restore original styles
    element.style.boxShadow = originalShadow;
    element.style.border = originalBorder;

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Create jsPDF instance (A4 size: 210mm x 297mm)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Calculate image height relative to PDF width
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Handle multi-page PDF output
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    // Format filename
    const cleanInvNum = invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `GST_Invoice_${cleanInvNum}.pdf`;

    // Trigger save
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
