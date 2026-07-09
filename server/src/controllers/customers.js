import { query } from '../services/db.js';

export const getCustomers = async (req, res, next) => {
  try {
    const { search, seller_id } = req.query;
    const resolvedSellerId = seller_id || req.headers['x-seller-id'] || null;

    let sql = `SELECT id, seller_id, 
                      COALESCE(customer_name, name) as name, 
                      COALESCE(tax_registration_number, gstin) as gstin, 
                      COALESCE(billing_email, email) as email, 
                      COALESCE(contact_phone, phone) as phone, 
                      COALESCE(street, billing_address) as address, 
                      city, state, 
                      COALESCE(postal_code, pincode) as pincode, 
                      customer_type, customer_account_number, payment_terms_default, currency, po_reference,
                      total_purchases as "totalPurchases", invoice_count as "invoiceCount", created_at as "createdAt"
               FROM public.customers WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (resolvedSellerId) {
      sql += ` AND seller_id = $${paramIndex++}`;
      params.push(resolvedSellerId);
    }

    if (search) {
      const searchPattern = `%${search}%`;
      sql += ` AND (customer_name ILIKE $${paramIndex} OR name ILIKE $${paramIndex} OR billing_email ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR city ILIKE $${paramIndex})`;
      params.push(searchPattern);
    }

    const { rows } = await query(sql, params);
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      `SELECT id, seller_id, 
              COALESCE(customer_name, name) as name, 
              COALESCE(tax_registration_number, gstin) as gstin, 
              COALESCE(billing_email, email) as email, 
              COALESCE(contact_phone, phone) as phone, 
              COALESCE(street, billing_address) as address, 
              city, state, 
              COALESCE(postal_code, pincode) as pincode, 
              customer_type, customer_account_number, payment_terms_default, currency, po_reference,
              total_purchases as "totalPurchases", invoice_count as "invoiceCount", created_at as "createdAt"
       FROM public.customers WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    const { 
      name, customer_name,
      email, billing_email,
      phone, contact_phone,
      address, street,
      city, state,
      pincode, postal_code,
      country,
      customer_type,
      customer_account_number,
      payment_terms_default,
      currency,
      gstin, tax_registration_number,
      po_reference,
      seller_id 
    } = req.body;

    const finalName = customer_name || name;
    const finalEmail = billing_email || email;

    if (!finalName || !finalEmail) {
      return res.status(400).json({ success: false, message: 'Name and Email are required' });
    }

    let resolvedSellerId = seller_id || req.headers['x-seller-id'];
    if (!resolvedSellerId) {
      const profileResult = await query('SELECT id FROM public.profiles LIMIT 1');
      if (profileResult.rows.length > 0) {
        resolvedSellerId = profileResult.rows[0].id;
      } else {
        return res.status(400).json({ success: false, message: 'No seller profile found. Please register a seller first.' });
      }
    }

    const finalType = customer_type || 'B2B';
    const finalAccount = customer_account_number || `ACC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const finalTax = finalType === 'B2B' ? (tax_registration_number || gstin || '') : null;
    const finalPo = finalType === 'B2B' ? (po_reference || null) : null;

    const { rows } = await query(
      `INSERT INTO public.customers (
        seller_id, customer_name, billing_email, customer_type, 
        street, city, state, postal_code, country,
        customer_account_number, contact_phone, payment_terms_default, currency,
        tax_registration_number, po_reference, total_purchases, invoice_count
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 0, 0)
      RETURNING id, seller_id, 
                customer_name as name, billing_email as email, customer_type,
                street as address, city, state, postal_code as pincode, country,
                customer_account_number, contact_phone as phone, payment_terms_default, currency,
                tax_registration_number as gstin, po_reference,
                total_purchases as "totalPurchases", invoice_count as "invoiceCount", created_at as "createdAt"`,
      [
        resolvedSellerId,
        finalName,
        finalEmail,
        finalType,
        street || address || '',
        city || '',
        state || '',
        postal_code || pincode || '',
        country || '',
        finalAccount,
        contact_phone || phone || '',
        payment_terms_default || 'Due on Receipt',
        currency || 'USD',
        finalTax,
        finalPo
      ]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      name, customer_name,
      email, billing_email,
      phone, contact_phone,
      address, street,
      city, state,
      pincode, postal_code,
      country,
      customer_type,
      customer_account_number,
      payment_terms_default,
      currency,
      gstin, tax_registration_number,
      po_reference,
      totalPurchases, total_purchases,
      invoiceCount, invoice_count
    } = req.body;

    const checkResult = await query('SELECT id FROM public.customers WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const fields = [];
    const values = [];
    let valIndex = 1;

    const mapping = {
      customer_name: customer_name || name,
      billing_email: billing_email || email,
      customer_type: customer_type,
      street: street || address,
      city: city,
      state: state,
      postal_code: postal_code || pincode,
      country: country,
      customer_account_number: customer_account_number,
      contact_phone: contact_phone || phone,
      payment_terms_default: payment_terms_default,
      currency: currency,
      tax_registration_number: tax_registration_number || gstin,
      po_reference: po_reference,
      total_purchases: total_purchases !== undefined ? total_purchases : totalPurchases,
      invoice_count: invoice_count !== undefined ? invoice_count : invoiceCount
    };

    for (const [col, val] of Object.entries(mapping)) {
      if (val !== undefined) {
        fields.push(`${col} = $${valIndex++}`);
        values.push(val);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    const updateSql = `UPDATE public.customers SET ${fields.join(', ')} WHERE id = $${valIndex}
                       RETURNING id, seller_id, 
                                 customer_name as name, billing_email as email, customer_type,
                                 street as address, city, state, postal_code as pincode, country,
                                 customer_account_number, contact_phone as phone, payment_terms_default, currency,
                                 tax_registration_number as gstin, po_reference,
                                 total_purchases as "totalPurchases", invoice_count as "invoiceCount", created_at as "createdAt"`;

    const { rows } = await query(updateSql, values);
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      `DELETE FROM public.customers WHERE id = $1 
       RETURNING id, seller_id, 
                 customer_name as name, billing_email as email, customer_type,
                 street as address, city, state, postal_code as pincode, country,
                 customer_account_number, contact_phone as phone, payment_terms_default, currency,
                 tax_registration_number as gstin, po_reference,
                 total_purchases as "totalPurchases", invoice_count as "invoiceCount", created_at as "createdAt"`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};
