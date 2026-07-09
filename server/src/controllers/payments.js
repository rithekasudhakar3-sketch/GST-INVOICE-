import { query, pool } from '../services/db.js';

const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getPayments = async (req, res, next) => {
  try {
    const { invoiceId } = req.query;
    let sql = `SELECT pay.id, pay.invoice_id as "invoiceId", cust.name as "customerName", 
                      pay.amount, pay.status, pay.method, pay.payment_date as "date", 
                      pay.reference_number as "reference", pay.created_at
               FROM public.payments pay
               LEFT JOIN public.invoices inv ON pay.invoice_id = inv.id
               LEFT JOIN public.customers cust ON inv.customer_id = cust.id
               WHERE 1=1`;
    const params = [];

    if (invoiceId && isUuid.test(invoiceId)) {
      sql += ` AND pay.invoice_id = $1`;
      params.push(invoiceId);
    }

    const { rows } = await query(sql, params);
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isUuid.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const { rows } = await query(
      `SELECT pay.id, pay.invoice_id as "invoiceId", cust.name as "customerName", 
              pay.amount, pay.status, pay.method, pay.payment_date as "date", 
              pay.reference_number as "reference", pay.created_at
       FROM public.payments pay
       LEFT JOIN public.invoices inv ON pay.invoice_id = inv.id
       LEFT JOIN public.customers cust ON inv.customer_id = cust.id
       WHERE pay.id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { invoiceId, amount, method, reference, date, status } = req.body;

    if (!invoiceId || !amount) {
      client.release();
      return res.status(400).json({ success: false, message: 'Invoice ID and Amount are required' });
    }

    let resolvedInvoiceId = invoiceId;
    if (!resolvedInvoiceId || !isUuid.test(resolvedInvoiceId)) {
      const invResult = await client.query('SELECT id FROM public.invoices LIMIT 1');
      if (invResult.rows.length > 0) {
        resolvedInvoiceId = invResult.rows[0].id;
      } else {
        client.release();
        return res.status(400).json({ success: false, message: 'No valid invoice found. Please create an invoice first.' });
      }
    }

    await client.query('BEGIN');

    const refNum = reference || `TXN${Math.floor(100000 + Math.random() * 900000)}`;
    const pDate = date || new Date().toISOString().split('T')[0];

    const insertSql = `
      INSERT INTO public.payments (invoice_id, amount, status, method, payment_date, reference_number)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, invoice_id as "invoiceId", amount, status, method, payment_date as date, reference_number as reference, created_at`;
    
    const { rows: [newPayment] } = await client.query(insertSql, [
      resolvedInvoiceId,
      Number(amount),
      status || 'completed',
      method || 'Bank Transfer',
      pDate,
      refNum
    ]);

    const invQuery = await client.query('SELECT total FROM public.invoices WHERE id = $1', [resolvedInvoiceId]);
    if (invQuery.rows.length > 0) {
      const invoice = invQuery.rows[0];
      const sumQuery = await client.query('SELECT SUM(amount) as paid_sum FROM public.payments WHERE invoice_id = $1', [resolvedInvoiceId]);
      const totalPaid = Number(sumQuery.rows[0].paid_sum || 0);

      let newStatus = 'pending';
      if (totalPaid >= Number(invoice.total)) {
        newStatus = 'paid';
      } else if (totalPaid > 0) {
        newStatus = 'partial';
      }

      await client.query('UPDATE public.invoices SET status = $1 WHERE id = $2', [newStatus, resolvedInvoiceId]);
    }

    await client.query('COMMIT');

    const customerQuery = await query(
      `SELECT cust.name FROM public.invoices inv
       LEFT JOIN public.customers cust ON inv.customer_id = cust.id
       WHERE inv.id = $1`,
      [resolvedInvoiceId]
    );
    newPayment.customerName = customerQuery.rows[0]?.name || 'Unknown Customer';

    res.status(201).json({ success: true, data: newPayment });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isUuid.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const { amount, method, reference, date, status } = req.body;

    const checkResult = await query('SELECT id FROM public.payments WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const fields = [];
    const values = [];
    let valIndex = 1;

    if (amount !== undefined) {
      fields.push(`amount = $${valIndex++}`);
      values.push(Number(amount));
    }
    if (method !== undefined) {
      fields.push(`method = $${valIndex++}`);
      values.push(method);
    }
    if (reference !== undefined) {
      fields.push(`reference_number = $${valIndex++}`);
      values.push(reference);
    }
    if (date !== undefined) {
      fields.push(`payment_date = $${valIndex++}`);
      values.push(date);
    }
    if (status !== undefined) {
      fields.push(`status = $${valIndex++}`);
      values.push(status);
    }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    const updateSql = `
      UPDATE public.payments SET ${fields.join(', ')} WHERE id = $${valIndex}
      RETURNING id, invoice_id as "invoiceId", amount, status, method, payment_date as date, reference_number as reference, created_at`;

    const { rows } = await query(updateSql, values);
    const updatedPayment = rows[0];

    const customerQuery = await query(
      `SELECT cust.name FROM public.invoices inv
       LEFT JOIN public.customers cust ON inv.customer_id = cust.id
       WHERE inv.id = $1`,
      [updatedPayment.invoiceId]
    );
    updatedPayment.customerName = customerQuery.rows[0]?.name || 'Unknown Customer';

    res.status(200).json({ success: true, data: updatedPayment });
  } catch (error) {
    next(error);
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isUuid.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const { rows } = await query(
      `DELETE FROM public.payments WHERE id = $1 
       RETURNING id, invoice_id as "invoiceId", amount, status, method, payment_date as date, reference_number as reference, created_at`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    const deletedPayment = rows[0];
    res.status(200).json({ success: true, data: deletedPayment });
  } catch (error) {
    next(error);
  }
};
