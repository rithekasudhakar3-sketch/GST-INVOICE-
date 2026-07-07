import { products } from '../services/db.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let results = [...products];

    if (category) {
      results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, gst, stock, status, image } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and Price are required' });
    }

    const newProduct = {
      id: `prod${products.length + 1}`,
      name,
      category: category || 'General',
      price: Number(price),
      gst: gst !== undefined ? Number(gst) : 18,
      stock: stock !== undefined ? Number(stock) : 0,
      status: status || 'active',
      image: image || 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    };

    products.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updatedData = { ...req.body };
    if (updatedData.price !== undefined) updatedData.price = Number(updatedData.price);
    if (updatedData.gst !== undefined) updatedData.gst = Number(updatedData.gst);
    if (updatedData.stock !== undefined) updatedData.stock = Number(updatedData.stock);

    products[index] = {
      ...products[index],
      ...updatedData,
      id: req.params.id, // Prevent ID overwrite
    };

    res.status(200).json({ success: true, data: products[index] });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const deleted = products.splice(index, 1);
    res.status(200).json({ success: true, data: deleted[0] });
  } catch (error) {
    next(error);
  }
};
