import { invoices } from '../services/db.js';

export const getInvoices = async (req, res, next) => {
  try {
    const { customerId, status, search } = req.query;
    let results = [...invoices];

    if (customerId) {
      results = results.filter((inv) => inv.customerId === customerId);
    }

    if (status) {
      results = results.filter((inv) => inv.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(searchLower) ||
          inv.customerName.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = invoices.find((inv) => inv.id === req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const {
      customerId,
      customerName,
      invoiceNumber,
      invoiceDate,
      dueDate,
      items,
      discount,
      notes,
      terms,
    } = req.body;

    if (!customerName || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and at least one item are required',
      });
    }

    // Auto-calculate billing figures
    let subtotal = 0;
    let gstAmount = 0;

    const formattedItems = items.map((item, idx) => {
      const qty = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      const gstPercent = Number(item.gst || 18);
      const itemSubtotal = qty * price;
      const itemGst = itemSubtotal * (gstPercent / 100);

      subtotal += itemSubtotal;
      gstAmount += itemGst;

      return {
        id: item.id || idx + 1,
        name: item.name,
        quantity: qty,
        price,
        gst: gstPercent,
      };
    });

    const discountAmount = Number(discount || 0);
    const total = subtotal + gstAmount - discountAmount;
    const invNum = invoiceNumber || `INV${String(invoices.length + 1).padStart(3, '0')}`;

    const newInvoice = {
      id: invNum,
      customerName,
      customerId: customerId || 'cust-generic',
      invoiceNumber: invNum,
      invoiceDate: invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
      items: formattedItems,
      subtotal,
      gstAmount,
      discount: discountAmount,
      total,
      status: 'pending',
      notes: notes || '',
      terms: terms || 'Net 15 days',
      createdAt: new Date().toISOString().split('T')[0],
    };

    invoices.push(newInvoice);
    res.status(201).json({ success: true, data: newInvoice });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (req, res, next) => {
  try {
    const index = invoices.findIndex((inv) => inv.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Update individual attributes, handling recalculations if items/discounts are updated
    const data = { ...req.body };
    const current = invoices[index];

    if (data.items) {
      let subtotal = 0;
      let gstAmount = 0;

      data.items = data.items.map((item, idx) => {
        const qty = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        const gstPercent = Number(item.gst || 18);
        const itemSubtotal = qty * price;
        const itemGst = itemSubtotal * (gstPercent / 100);

        subtotal += itemSubtotal;
        gstAmount += itemGst;

        return {
          id: item.id || idx + 1,
          name: item.name,
          quantity: qty,
          price,
          gst: gstPercent,
        };
      });

      data.subtotal = subtotal;
      data.gstAmount = gstAmount;
      const discount = data.discount !== undefined ? Number(data.discount) : current.discount;
      data.total = subtotal + gstAmount - discount;
    } else if (data.discount !== undefined) {
      data.discount = Number(data.discount);
      data.total = current.subtotal + current.gstAmount - data.discount;
    }

    invoices[index] = {
      ...current,
      ...data,
      id: req.params.id, // Prevent ID overwrite
    };

    res.status(200).json({ success: true, data: invoices[index] });
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    const index = invoices.findIndex((inv) => inv.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const deleted = invoices.splice(index, 1);
    res.status(200).json({ success: true, data: deleted[0] });
  } catch (error) {
    next(error);
  }
};
