// ==========================================
// UNIFIED MOCK DATA LAYER
// ==========================================
// All data is sourced from the canonical JSON files in /data/.
// This module re-exports them and derives listing/dashboard datasets
// so that Customers, Products, Invoices, and Payments all reference
// the exact same names, prices, and IDs everywhere in the app.
// ==========================================

import customersJson from '../data/Customers.json';
import productsJson from '../data/Products.json';
import companiesJson from '../data/Companies.json';
import banksJson from '../data/Banks.json';

// ------------------------------------------
// Re-export canonical records directly
// ------------------------------------------
export const mockCustomers = customersJson.map(c => ({
  ...c,
  // Ensure the listing-page fields exist (address string for cards)
  address: `${c.billingAddress}, ${c.city}, ${c.state} ${c.pincode}`,
}));

export const mockProducts = productsJson.map(p => ({
  ...p,
  // Map `gstRate` to `gst` for backward-compat with the listing cards
  gst: p.gstRate,
}));

// ------------------------------------------
// Mock Users
// ------------------------------------------
const supplier = companiesJson[0] || {};

export const mockUsers = {
  seller: {
    id: 'seller1',
    name: supplier.name || 'Seller',
    email: supplier.email || 'seller@company.com',
    role: 'seller',
    company: supplier.name || 'Acme Corp',
    gstin: supplier.gstin || '',
    phone: supplier.phone || '',
    avatar: supplier.logo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller',
  },
  client: {
    id: 'client1',
    name: customersJson[0]?.contactPerson || 'Client',
    email: customersJson[0]?.email || 'client@company.com',
    role: 'client',
    company: customersJson[0]?.name || 'Client Corp',
    gstin: customersJson[0]?.gstin || '',
    phone: customersJson[0]?.phone || '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client',
  },
};

// ------------------------------------------
// Mock Vendors (for client portal)
// ------------------------------------------
export const mockVendors = companiesJson.map((comp, idx) => ({
  id: `vendor${idx + 1}`,
  name: comp.name,
  gstin: comp.gstin,
  contactPerson: comp.name,
  phone: comp.phone,
  email: comp.email,
  logo: comp.logo,
  totalSpent: [125000, 89000][idx] || 50000,
}));

// ------------------------------------------
// Mock Invoices (derived from unified customers & products)
// ------------------------------------------
const prod = (id) => productsJson.find(p => p.id === id);
const cust = (id) => customersJson.find(c => c.id === id);

const buildInvoice = (id, custId, itemDefs, status, date, dueDate, discount, notes, terms) => {
  const customer = cust(custId);
  const items = itemDefs.map((def, i) => {
    const p = prod(def.prodId);
    return {
      id: i + 1,
      name: p?.name || def.name,
      quantity: def.qty,
      price: p?.price || def.price,
      gst: p?.gstRate || def.gst,
    };
  });
  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.price, 0);
  const gstAmount = items.reduce((sum, it) => sum + it.quantity * it.price * (it.gst / 100), 0);
  const total = subtotal + gstAmount - (discount || 0);

  return {
    id,
    invoiceNumber: id,
    customerName: customer?.name || 'Unknown Customer',
    customerId: custId,
    invoiceDate: date,
    dueDate,
    items,
    subtotal: Math.round(subtotal),
    gstAmount: Math.round(gstAmount),
    discount: discount || 0,
    total: Math.round(total),
    status,
    notes: notes || 'Thank you for your business!',
    terms: terms || 'Net 15 days',
    createdAt: date,
  };
};

export const mockInvoices = [
  buildInvoice(
    'INV-2026-001', 'cust1',
    [
      { prodId: 'prod1', qty: 2 },
      { prodId: 'prod4', qty: 1 },
    ],
    'paid', '2026-06-25', '2026-07-10', 0,
    'Thank you for your business!', 'Net 15 days'
  ),
  buildInvoice(
    'INV-2026-002', 'cust2',
    [
      { prodId: 'prod3', qty: 5 },
      { prodId: 'prod6', qty: 3 },
    ],
    'pending', '2026-06-20', '2026-07-05', 0,
    'Please confirm receipt', 'Net 30 days'
  ),
  buildInvoice(
    'INV-2026-003', 'cust3',
    [
      { prodId: 'prod1', qty: 10 },
      { prodId: 'prod2', qty: 8 },
    ],
    'overdue', '2026-06-15', '2026-06-30', 5000,
    'Bulk order', 'Net 15 days'
  ),
  buildInvoice(
    'INV-2026-004', 'cust4',
    [
      { prodId: 'prod5', qty: 15 },
    ],
    'partial', '2026-06-10', '2026-06-25', 0,
    'Partial payment received', 'Net 20 days'
  ),
];

// ------------------------------------------
// Mock Payments (derived from invoices)
// ------------------------------------------
export const mockPayments = mockInvoices.map((inv, idx) => ({
  id: `pay${idx + 1}`,
  invoiceId: inv.id,
  customerName: inv.customerName,
  amount: idx === 3 ? Math.round(inv.total / 2) : inv.total,
  status: inv.status === 'paid' ? 'completed' : inv.status === 'partial' ? 'completed' : 'pending',
  method: ['Bank Transfer', 'Cheque', 'Bank Transfer', 'Credit Card'][idx],
  date: inv.invoiceDate,
  reference: `TXN${100000 + idx}`,
}));

// ------------------------------------------
// Mock Notifications (derived from invoices)
// ------------------------------------------
export const mockNotifications = [
  {
    id: 'notif1',
    title: 'Payment Received',
    message: `${mockInvoices[0].id} has been paid by ${mockInvoices[0].customerName}.`,
    type: 'success',
    read: false,
    date: mockInvoices[0].invoiceDate,
  },
  {
    id: 'notif2',
    title: 'Invoice Overdue',
    message: `${mockInvoices[2].id} is overdue by 5 days.`,
    type: 'warning',
    read: false,
    date: mockInvoices[2].dueDate,
  },
  {
    id: 'notif3',
    title: 'New Invoice Created',
    message: `${mockInvoices[3].id} has been created for ${mockInvoices[3].customerName}.`,
    type: 'info',
    read: true,
    date: mockInvoices[3].invoiceDate,
  },
  {
    id: 'notif4',
    title: 'Low Stock Alert',
    message: `${productsJson.find(p => p.stock === 0)?.name || 'An item'} is out of stock.`,
    type: 'error',
    read: true,
    date: '2026-06-05',
  },
];

// ------------------------------------------
// Dashboard Stats (derived from invoices)
// ------------------------------------------
export const getDashboardStats = (role) => {
  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidTotal = mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const pendingTotal = mockInvoices.filter(i => ['pending', 'partial'].includes(i.status)).reduce((sum, i) => sum + i.total, 0);
  const overdueTotal = mockInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);

  if (role === 'seller') {
    return {
      revenue: totalRevenue,
      revenueChange: 12.5,
      customers: customersJson.length,
      customersChange: 2,
      pendingPayments: pendingTotal,
      pendingChange: -5.2,
      paidInvoices: paidTotal,
      paidChange: 8.3,
      overdueInvoices: overdueTotal,
      overdueChange: 15.0,
    };
  } else {
    return {
      totalBills: mockInvoices.length,
      paidBills: mockInvoices.filter(i => i.status === 'paid').length,
      pendingBills: mockInvoices.filter(i => ['pending', 'partial'].includes(i.status)).length,
      overdueBills: mockInvoices.filter(i => i.status === 'overdue').length,
      totalSpent: totalRevenue,
      spentChange: 22.5,
    };
  }
};

// ------------------------------------------
// Chart Data
// ------------------------------------------
export const revenueChartData = [
  { month: 'Jan', revenue: 45000, expenses: 28000 },
  { month: 'Feb', revenue: 52000, expenses: 31000 },
  { month: 'Mar', revenue: 48000, expenses: 29000 },
  { month: 'Apr', revenue: 61000, expenses: 35000 },
  { month: 'May', revenue: 55000, expenses: 32000 },
  { month: 'Jun', revenue: 67000, expenses: 38000 },
];

export const invoiceStatusData = (() => {
  const paid = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const pending = mockInvoices.filter(i => ['pending', 'partial'].includes(i.status)).reduce((s, i) => s + i.total, 0);
  const overdue = mockInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0);
  const total = paid + pending + overdue || 1;
  return [
    { name: 'Paid', value: paid, percentage: Math.round(paid / total * 100) },
    { name: 'Pending', value: pending, percentage: Math.round(pending / total * 100) },
    { name: 'Overdue', value: overdue, percentage: Math.round(overdue / total * 100) },
  ];
})();

export const monthlyPaymentsData = [
  { month: 'Jul', payments: 45000 },
  { month: 'Aug', payments: 52000 },
  { month: 'Sep', payments: 48000 },
  { month: 'Oct', payments: 61000 },
  { month: 'Nov', payments: 67000 },
  { month: 'Dec', payments: 75000 },
];
