import { query, pool } from '../services/db.js';

const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getInvoices = async (req, res, next) => {
  try {
    const { customerId, status, search, seller_id } = req.query;
    const resolvedSellerId = seller_id || req.headers['x-seller-id'] || null;

    let sql = `SELECT inv.id, inv.seller_id, inv.customer_id as "customerId", cust.name as "customerName", 
                      inv.invoice_number as "invoiceNumber", inv.invoice_date as "invoiceDate", inv.due_date as "dueDate", 
                      inv.subtotal, inv.gst_amount as "gstAmount", inv.discount, inv.total, inv.status, inv.notes, inv.terms, inv.created_at
               FROM public.invoices inv
               LEFT JOIN public.customers cust ON inv.customer_id = cust.id
               WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (resolvedSellerId && isUuid.test(resolvedSellerId)) {
      sql += ` AND inv.seller_id = $${paramIndex++}`;
      params.push(resolvedSellerId);
    }

    if (customerId && isUuid.test(customerId)) {
      sql += ` AND inv.customer_id = $${paramIndex++}`;
      params.push(customerId);
    }

    if (status) {
      sql += ` AND inv.status = $${paramIndex++}`;
      params.push(status.toLowerCase());
    }

    if (search) {
      const searchPattern = `%${search}%`;
      sql += ` AND (inv.invoice_number ILIKE $${paramIndex} OR cust.name ILIKE $${paramIndex})`;
      params.push(searchPattern);
    }

    const { rows: invoiceRows } = await query(sql, params);

    const invoicesWithItems = await Promise.all(
      invoiceRows.map(async (inv) => {
        const { rows: itemRows } = await query(
          `SELECT id, product_id as "productId", name, quantity, price, gst_rate as gst
           FROM public.invoice_items
           WHERE invoice_id = $1`,
          [inv.id]
        );
        return {
          ...inv,
          items: itemRows
        };
      })
    );

    res.status(200).json({ success: true, count: invoicesWithItems.length, data: invoicesWithItems });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isUuid.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const { rows: invoiceRows } = await query(
      `SELECT inv.id, inv.seller_id, inv.customer_id as "customerId", cust.name as "customerName", 
              inv.invoice_number as "invoiceNumber", inv.invoice_date as "invoiceDate", inv.due_date as "dueDate", 
              inv.subtotal, inv.gst_amount as "gstAmount", inv.discount, inv.total, inv.status, inv.notes, inv.terms, inv.created_at
       FROM public.invoices inv
       LEFT JOIN public.customers cust ON inv.customer_id = cust.id
       WHERE inv.id = $1`,
      [id]
    );

    if (invoiceRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const invoice = invoiceRows[0];
    const { rows: itemRows } = await query(
      `SELECT id, product_id as "productId", name, quantity, price, gst_rate as gst
       FROM public.invoice_items
       WHERE invoice_id = $1`,
      [id]
    );

    invoice.items = itemRows;
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  const client = await pool.connect();
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
      seller_id
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required',
      });
    }

    let resolvedCustomerId = customerId;
    if (!resolvedCustomerId || !isUuid.test(resolvedCustomerId)) {
      const custResult = await client.query('SELECT id FROM public.customers LIMIT 1');
      if (custResult.rows.length > 0) {
        resolvedCustomerId = custResult.rows[0].id;
      } else {
        return res.status(400).json({ success: false, message: 'No valid customer found. Please create a customer first.' });
      }
    }

    let resolvedSellerId = seller_id || req.headers['x-seller-id'];
    if (!resolvedSellerId || !isUuid.test(resolvedSellerId)) {
      const profileResult = await client.query('SELECT id FROM public.profiles LIMIT 1');
      if (profileResult.rows.length > 0) {
        resolvedSellerId = profileResult.rows[0].id;
      } else {
        return res.status(400).json({ success: false, message: 'No seller profile found. Please register a seller first.' });
      }
    }

    let subtotal = 0;
    let gstAmount = 0;

    items.forEach((item) => {
      const qty = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      const gstPercent = Number(item.gst || 18);
      subtotal += qty * price;
      gstAmount += qty * price * (gstPercent / 100);
    });

    const discountAmount = Number(discount || 0);
    const total = subtotal + gstAmount - discountAmount;
    const invNum = invoiceNumber || `INV-${Date.now()}`;

    await client.query('BEGIN');

    const invoiceInsertSql = `
      INSERT INTO public.invoices (seller_id, customer_id, invoice_number, invoice_date, due_date, subtotal, gst_amount, discount, total, status, notes, terms)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, seller_id, customer_id as "customerId", invoice_number as "invoiceNumber", invoice_date as "invoiceDate", due_date as "dueDate", 
                subtotal, gst_amount as "gstAmount", discount, total, status, notes, terms, created_at`;
    
    const { rows: [invoiceRow] } = await client.query(invoiceInsertSql, [
      resolvedSellerId,
      resolvedCustomerId,
      invNum,
      invoiceDate || new Date(),
      dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      subtotal,
      gstAmount,
      discountAmount,
      total,
      'pending',
      notes || '',
      terms || 'Net 15 days'
    ]);

    const formattedItems = [];
    for (const item of items) {
      const qty = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      const gstPercent = Number(item.gst || 18);
      
      let productId = item.productId || item.product_id;
      if (!productId || !isUuid.test(productId)) {
        const prodResult = await client.query('SELECT id FROM public.products LIMIT 1');
        productId = prodResult.rows.length > 0 ? prodResult.rows[0].id : null;
      }

      const itemInsertSql = `
        INSERT INTO public.invoice_items (invoice_id, product_id, name, quantity, price, gst_rate)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, product_id as "productId", name, quantity, price, gst_rate as gst`;
      
      const { rows: [itemRow] } = await client.query(itemInsertSql, [
        invoiceRow.id,
        productId,
        item.name || 'General Product',
        qty,
        price,
        gstPercent
      ]);
      formattedItems.push(itemRow);
    }

    await client.query('COMMIT');

    const customerInfo = await query('SELECT name FROM public.customers WHERE id = $1', [resolvedCustomerId]);
    invoiceRow.customerName = customerInfo.rows[0]?.name || 'Unknown Customer';
    invoiceRow.items = formattedItems;

    res.status(201).json({ success: true, data: invoiceRow });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const updateInvoice = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    if (!isUuid.test(id)) {
      client.release();
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const { items, discount, status, notes, terms, dueDate, invoiceDate } = req.body;

    const checkResult = await client.query('SELECT * FROM public.invoices WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    const currentInvoice = checkResult.rows[0];

    await client.query('BEGIN');

    let subtotal = Number(currentInvoice.subtotal);
    let gstAmount = Number(currentInvoice.gst_amount);
    let discountAmount = discount !== undefined ? Number(discount) : Number(currentInvoice.discount);

    let updatedItems = null;

    if (items) {
      await client.query('DELETE FROM public.invoice_items WHERE invoice_id = $1', [id]);

      subtotal = 0;
      gstAmount = 0;
      updatedItems = [];

      for (const item of items) {
        const qty = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        const gstPercent = Number(item.gst || 18);
        subtotal += qty * price;
        gstAmount += qty * price * (gstPercent / 100);

        let productId = item.productId || item.product_id;
        if (!productId || !isUuid.test(productId)) {
          const prodResult = await client.query('SELECT id FROM public.products LIMIT 1');
          productId = prodResult.rows.length > 0 ? prodResult.rows[0].id : null;
        }

        const itemInsertSql = `
          INSERT INTO public.invoice_items (invoice_id, product_id, name, quantity, price, gst_rate)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, product_id as "productId", name, quantity, price, gst_rate as gst`;
        
        const { rows: [itemRow] } = await client.query(itemInsertSql, [
          id,
          productId,
          item.name || 'General Product',
          qty,
          price,
          gstPercent
        ]);
        updatedItems.push(itemRow);
      }
    }

    const total = subtotal + gstAmount - discountAmount;

    const fields = [];
    const values = [];
    let valIndex = 1;

    if (items) {
      fields.push(`subtotal = $${valIndex++}`);
      values.push(subtotal);
      fields.push(`gst_amount = $${valIndex++}`);
      values.push(gstAmount);
    }
    if (discount !== undefined) {
      fields.push(`discount = $${valIndex++}`);
      values.push(discountAmount);
    }
    if (items || discount !== undefined) {
      fields.push(`total = $${valIndex++}`);
      values.push(total);
    }
    if (status !== undefined) {
      fields.push(`status = $${valIndex++}`);
      values.push(status.toLowerCase());
    }
    if (notes !== undefined) {
      fields.push(`notes = $${valIndex++}`);
      values.push(notes);
    }
    if (terms !== undefined) {
      fields.push(`terms = $${valIndex++}`);
      values.push(terms);
    }
    if (dueDate !== undefined) {
      fields.push(`due_date = $${valIndex++}`);
      values.push(dueDate);
    }
    if (invoiceDate !== undefined) {
      fields.push(`invoice_date = $${valIndex++}`);
      values.push(invoiceDate);
    }

    let invoiceRow = null;
    if (fields.length > 0) {
      values.push(id);
      const updateSql = `
        UPDATE public.invoices SET ${fields.join(', ')} WHERE id = $${valIndex}
        RETURNING id, seller_id, customer_id as "customerId", invoice_number as "invoiceNumber", invoice_date as "invoiceDate", due_date as "dueDate", 
                  subtotal, gst_amount as "gstAmount", discount, total, status, notes, terms, created_at`;
      const { rows } = await client.query(updateSql, values);
      invoiceRow = rows[0];
    } else {
      const { rows } = await client.query(`
        SELECT id, seller_id, customer_id as "customerId", invoice_number as "invoiceNumber", invoice_date as "invoiceDate", due_date as "dueDate", 
               subtotal, gst_amount as "gstAmount", discount, total, status, notes, terms, created_at
        FROM public.invoices WHERE id = $1`, [id]);
      invoiceRow = rows[0];
    }

    await client.query('COMMIT');

    const customerInfo = await client.query('SELECT name FROM public.customers WHERE id = $1', [invoiceRow.customerId]);
    invoiceRow.customerName = customerInfo.rows[0]?.name || 'Unknown Customer';

    if (updatedItems) {
      invoiceRow.items = updatedItems;
    } else {
      const { rows: currentItems } = await client.query(
        `SELECT id, product_id as "productId", name, quantity, price, gst_rate as gst
         FROM public.invoice_items WHERE invoice_id = $1`,
        [id]
      );
      invoiceRow.items = currentItems;
    }

    res.status(200).json({ success: true, data: invoiceRow });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const deleteInvoice = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    if (!isUuid.test(id)) {
      client.release();
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    await client.query('BEGIN');

    const check = await client.query('SELECT * FROM public.invoices WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      client.release();
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    await client.query('DELETE FROM public.invoice_items WHERE invoice_id = $1', [id]);

    const { rows } = await client.query(
      `DELETE FROM public.invoices WHERE id = $1 
       RETURNING id, seller_id, customer_id as "customerId", invoice_number as "invoiceNumber", invoice_date as "invoiceDate", due_date as "dueDate", 
                 subtotal, gst_amount as "gstAmount", discount, total, status, notes, terms, created_at`,
      [id]
    );

    await client.query('COMMIT');
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};
