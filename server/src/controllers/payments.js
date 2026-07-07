import { payments, invoices } from '../services/db.js';

export const getPayments = async (req, res, next) => {
  try {
    const { invoiceId } = req.query;
    let results = [...payments];

    if (invoiceId) {
      results = results.filter((p) => p.invoiceId === invoiceId);
    }

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = payments.find((p) => p.id === req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const { invoiceId, customerName, amount, method, reference, date } = req.body;

    if (!invoiceId || !amount) {
      return res.status(400).json({ success: false, message: 'Invoice ID and Amount are required' });
    }

    const newPayment = {
      id: `pay${payments.length + 1}`,
      invoiceId,
      customerName: customerName || 'Unknown Customer',
      amount: Number(amount),
      status: 'completed',
      method: method || 'Bank Transfer',
      date: date || new Date().toISOString().split('T')[0],
      reference: reference || `TXN${Math.floor(100000 + Math.random() * 900000)}`,
    };

    payments.push(newPayment);

    // Side effect: update corresponding invoice status to 'paid' (or 'partial')
    const invoiceIndex = invoices.findIndex((inv) => inv.id === invoiceId);
    if (invoiceIndex !== -1) {
      const inv = invoices[invoiceIndex];
      if (newPayment.amount >= inv.total) {
        inv.status = 'paid';
      } else {
        inv.status = 'partial';
      }
    }

    res.status(201).json({ success: true, data: newPayment });
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (req, res, next) => {
  try {
    const index = payments.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const updatedData = { ...req.body };
    if (updatedData.amount !== undefined) updatedData.amount = Number(updatedData.amount);

    payments[index] = {
      ...payments[index],
      ...updatedData,
      id: req.params.id, // Prevent ID overwrite
    };

    res.status(200).json({ success: true, data: payments[index] });
  } catch (error) {
    next(error);
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    const index = payments.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const deleted = payments.splice(index, 1);
    res.status(200).json({ success: true, data: deleted[0] });
  } catch (error) {
    next(error);
  }
};
