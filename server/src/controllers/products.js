import { query } from '../services/db.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, seller_id } = req.query;
    const resolvedSellerId = seller_id || req.headers['x-seller-id'] || null;

    let sql = 'SELECT id, seller_id, name, category, price, gst_rate as gst, stock, status, image_url as image, created_at FROM public.products WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (resolvedSellerId) {
      sql += ` AND seller_id = $${paramIndex++}`;
      params.push(resolvedSellerId);
    }

    if (category && category !== 'all') {
      sql += ` AND category ILIKE $${paramIndex++}`;
      params.push(category);
    }

    if (search) {
      sql += ` AND (name ILIKE $${paramIndex} OR category ILIKE $${paramIndex})`;
      paramIndex++;
      params.push(`%${search}%`);
    }

    const { rows } = await query(sql, params);
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      'SELECT id, seller_id, name, category, price, gst_rate as gst, stock, status, image_url as image, created_at FROM public.products WHERE id = $1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, gst, stock, status, image, seller_id } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and Price are required' });
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

    const { rows } = await query(
      `INSERT INTO public.products (seller_id, name, category, price, gst_rate, stock, status, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, seller_id, name, category, price, gst_rate as gst, stock, status, image_url as image, created_at`,
      [
        resolvedSellerId,
        name,
        category || 'General',
        Number(price),
        gst !== undefined ? Number(gst) : 18.00,
        stock !== undefined ? Number(stock) : 0,
        status || 'active',
        image || 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'
      ]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, price, gst, stock, status, image } = req.body;

    const checkResult = await query('SELECT id FROM public.products WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const fields = [];
    const values = [];
    let valIndex = 1;

    if (name !== undefined) {
      fields.push(`name = $${valIndex++}`);
      values.push(name);
    }
    if (category !== undefined) {
      fields.push(`category = $${valIndex++}`);
      values.push(category);
    }
    if (price !== undefined) {
      fields.push(`price = $${valIndex++}`);
      values.push(Number(price));
    }
    if (gst !== undefined) {
      fields.push(`gst_rate = $${valIndex++}`);
      values.push(Number(gst));
    }
    if (stock !== undefined) {
      fields.push(`stock = $${valIndex++}`);
      values.push(Number(stock));
    }
    if (status !== undefined) {
      fields.push(`status = $${valIndex++}`);
      values.push(status);
    }
    if (image !== undefined) {
      fields.push(`image_url = $${valIndex++}`);
      values.push(image);
    }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    const updateSql = `UPDATE public.products SET ${fields.join(', ')} WHERE id = $${valIndex}
                       RETURNING id, seller_id, name, category, price, gst_rate as gst, stock, status, image_url as image, created_at`;

    const { rows } = await query(updateSql, values);
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      'DELETE FROM public.products WHERE id = $1 RETURNING id, seller_id, name, category, price, gst_rate as gst, stock, status, image_url as image, created_at',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};
