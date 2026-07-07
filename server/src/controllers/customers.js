import { customers } from '../services/db.js';

export const getCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let results = [...customers];

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.city.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customer = customers.find((c) => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    const { name, gstin, email, phone, address, city, state } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and Email are required' });
    }

    const newCustomer = {
      id: `cust${customers.length + 1}`,
      name,
      gstin: gstin || '',
      email,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      totalPurchases: 0,
      invoiceCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    customers.push(newCustomer);
    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const index = customers.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    customers[index] = {
      ...customers[index],
      ...req.body,
      id: req.params.id, // Prevent ID overwrite
    };

    res.status(200).json({ success: true, data: customers[index] });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const index = customers.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const deleted = customers.splice(index, 1);
    res.status(200).json({ success: true, data: deleted[0] });
  } catch (error) {
    next(error);
  }
};
