// Mock Users
export const mockUsers = {
  seller: {
    id: 'seller1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'seller',
    company: 'Acme Corp',
    gstin: '18AABCT1234H1Z0',
    phone: '+91 9876543210',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  },
  client: {
    id: 'client1',
    name: 'Jane Smith',
    email: 'jane@client.com',
    role: 'client',
    company: 'Tech Solutions Ltd',
    gstin: '27AABCT5678H1Z0',
    phone: '+91 9123456789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
  },
};

// Mock Customers
export const mockCustomers = [
  {
    id: 'cust1',
    name: 'ABC Trading Co.',
    gstin: '27AABCT1234H1Z0',
    email: 'contact@abc.com',
    phone: '+91 8765432109',
    address: '123 Market Street, Mumbai, Maharashtra 400001',
    city: 'Mumbai',
    state: 'Maharashtra',
    totalPurchases: 45000,
    invoiceCount: 12,
    createdAt: '2024-01-15',
  },
  {
    id: 'cust2',
    name: 'XYZ Enterprises',
    gstin: '18AABCT5678H1Z0',
    email: 'info@xyz.com',
    phone: '+91 9876543210',
    address: '456 Business Park, Bangalore, Karnataka 560001',
    city: 'Bangalore',
    state: 'Karnataka',
    totalPurchases: 82000,
    invoiceCount: 28,
    createdAt: '2023-06-20',
  },
  {
    id: 'cust3',
    name: 'Global Tech Solutions',
    gstin: '07AABCT9012H1Z0',
    email: 'hello@globaltech.com',
    phone: '+91 8765432109',
    address: '789 Tech Avenue, Hyderabad, Telangana 500001',
    city: 'Hyderabad',
    state: 'Telangana',
    totalPurchases: 156000,
    invoiceCount: 45,
    createdAt: '2022-11-10',
  },
  {
    id: 'cust4',
    name: 'Innovation Labs',
    gstin: '06AABCT3456H1Z0',
    email: 'admin@innovlab.com',
    phone: '+91 9123456789',
    address: '321 Innovation Drive, Pune, Maharashtra 411001',
    city: 'Pune',
    state: 'Maharashtra',
    totalPurchases: 95000,
    invoiceCount: 18,
    createdAt: '2023-03-05',
  },
];

// Mock Vendors (for client portal)
export const mockVendors = [
  {
    id: 'vendor1',
    name: 'Acme Corp',
    gstin: '18AABCT1234H1Z0',
    contactPerson: 'John Doe',
    phone: '+91 9876543210',
    email: 'john@company.com',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AC',
    totalSpent: 125000,
  },
  {
    id: 'vendor2',
    name: 'Global Supplies Inc',
    gstin: '27AABCT5678H1Z0',
    contactPerson: 'Mike Johnson',
    phone: '+91 8765432109',
    email: 'mike@supplies.com',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GS',
    totalSpent: 89000,
  },
  {
    id: 'vendor3',
    name: 'Premium Materials Ltd',
    gstin: '07AABCT9012H1Z0',
    contactPerson: 'Sarah Williams',
    phone: '+91 9123456789',
    email: 'sarah@premium.com',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=PM',
    totalSpent: 156000,
  },
];

// Mock Products
export const mockProducts = [
  {
    id: 'prod1',
    name: 'Premium Office Chair',
    category: 'Furniture',
    price: 12000,
    gst: 18,
    stock: 45,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop',
  },
  {
    id: 'prod2',
    name: 'Laptop Stand',
    category: 'Accessories',
    price: 2500,
    gst: 5,
    stock: 128,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  },
  {
    id: 'prod3',
    name: 'LED Desk Lamp',
    category: 'Lighting',
    price: 3500,
    gst: 12,
    stock: 0,
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1565182999555-2142eadeb5b4?w=400&h=300&fit=crop',
  },
  {
    id: 'prod4',
    name: 'Mechanical Keyboard',
    category: 'Peripherals',
    price: 8000,
    gst: 18,
    stock: 67,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1587829191301-95d6a3fb3d3f?w=400&h=300&fit=crop',
  },
  {
    id: 'prod5',
    name: 'Wireless Mouse',
    category: 'Peripherals',
    price: 1800,
    gst: 12,
    stock: 156,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop',
  },
  {
    id: 'prod6',
    name: 'Monitor Stand',
    category: 'Accessories',
    price: 4500,
    gst: 18,
    stock: 89,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1595225476933-018acacc7d7d?w=400&h=300&fit=crop',
  },
];

// Mock Invoices
export const mockInvoices = [
  {
    id: 'INV001',
    customerName: 'ABC Trading Co.',
    customerId: 'cust1',
    invoiceNumber: 'INV001',
    invoiceDate: '2026-11-25',
    dueDate: '2026-12-10',
    items: [
      { id: 1, name: 'Premium Office Chair', quantity: 2, price: 12000, gst: 18 },
      { id: 2, name: 'Mechanical Keyboard', quantity: 1, price: 8000, gst: 18 },
    ],
    subtotal: 32000,
    gstAmount: 5760,
    discount: 0,
    total: 37760,
    status: 'paid',
    notes: 'Thank you for your business!',
    terms: 'Net 15 days',
    createdAt: '2026-11-25',
  },
  {
    id: 'INV002',
    customerName: 'XYZ Enterprises',
    customerId: 'cust2',
    invoiceNumber: 'INV002',
    invoiceDate: '2024-11-20',
    dueDate: '2024-12-05',
    items: [
      { id: 1, name: 'LED Desk Lamp', quantity: 5, price: 3500, gst: 12 },
      { id: 2, name: 'Laptop Stand', quantity: 3, price: 2500, gst: 5 },
    ],
    subtotal: 24500,
    gstAmount: 2340,
    discount: 0,
    total: 26840,
    status: 'pending',
    notes: 'Please confirm receipt',
    terms: 'Net 30 days',
    createdAt: '2026-11-20',
  },
  {
    id: 'INV003',
    customerName: 'Global Tech Solutions',
    customerId: 'cust3',
    invoiceNumber: 'INV003',
    invoiceDate: '2026-11-15',
    dueDate: '2026-11-30',
    items: [
      { id: 1, name: 'Premium Office Chair', quantity: 10, price: 12000, gst: 18 },
      { id: 2, name: 'Monitor Stand', quantity: 8, price: 4500, gst: 18 },
    ],
    subtotal: 156000,
    gstAmount: 28080,
    discount: 5000,
    total: 179080,
    status: 'overdue',
    notes: 'Bulk order',
    terms: 'Net 15 days',
    createdAt: '2026-11-15',
  },
  {
    id: 'INV004',
    customerName: 'Innovation Labs',
    customerId: 'cust4',
    invoiceNumber: 'INV004',
    invoiceDate: '2026-11-10',
    dueDate: '2026  -11-25',
    items: [
      { id: 1, name: 'Wireless Mouse', quantity: 15, price: 1800, gst: 12 },
    ],
    subtotal: 27000,
    gstAmount: 3240,
    discount: 0,
    total: 30240,
    status: 'partial',
    notes: 'Partial payment received',
    terms: 'Net 20 days',
    createdAt: '2026-11-10',
  },
];

// Mock Payments
export const mockPayments = [
  {
    id: 'pay1',
    invoiceId: 'INV001',
    customerName: 'ABC Trading Co.',
    amount: 37760,
    status: 'completed',
    method: 'Bank Transfer',
    date: '2024-11-27',
    reference: 'TXN123456',
  },
  {
    id: 'pay2',
    invoiceId: 'INV002',
    customerName: 'XYZ Enterprises',
    amount: 26840,
    status: 'pending',
    method: 'Cheque',
    date: '2026-12-05',
    reference: 'CHQ789012',
  },
  {
    id: 'pay3',
    invoiceId: 'INV003',
    customerName: 'Global Tech Solutions',
    amount: 89540,
    status: 'completed',
    method: 'Bank Transfer',
    date: '2024-11-18',
    reference: 'TXN345678',
  },
  {
    id: 'pay4',
    invoiceId: 'INV004',
    customerName: 'Innovation Labs',
    amount: 15000,
    status: 'completed',
    method: 'Credit Card',
    date: '2024-11-12',
    reference: 'CARD901234',
  },
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 'notif1',
    title: 'Payment Received',
    message: 'INV001 has been paid by ABC Trading Co.',
    type: 'success',
    read: false,
    date: '2024-11-27',
  },
  {
    id: 'notif2',
    title: 'Invoice Overdue',
    message: 'INV003 is overdue by 5 days',
    type: 'warning',
    read: false,
    date: '2024-11-20',
  },
  {
    id: 'notif3',
    title: 'New Invoice Created',
    message: 'INV004 has been created for Innovation Labs',
    type: 'info',
    read: true,
    date: '2024-11-10',
  },
  {
    id: 'notif4',
    title: 'Low Stock Alert',
    message: 'LED Desk Lamp is out of stock',
    type: 'error',
    read: true,
    date: '2024-11-05',
  },
];

// Dashboard Data
export const getDashboardStats = (role) => {
  if (role === 'seller') {
    return {
      revenue: 273920,
      revenueChange: 12.5,
      customers: 4,
      customersChange: 2,
      pendingPayments: 57080,
      pendingChange: -5.2,
      paidInvoices: 216840,
      paidChange: 8.3,
      overdueInvoices: 179080,
      overdueChange: 15.0,
    };
  } else {
    return {
      totalBills: 4,
      paidBills: 2,
      pendingBills: 1,
      overdueBills: 1,
      totalSpent: 450960,
      spentChange: 22.5,
    };
  }
};

// Revenue Chart Data
export const revenueChartData = [
  { month: 'Jan', revenue: 45000, expenses: 28000 },
  { month: 'Feb', revenue: 52000, expenses: 31000 },
  { month: 'Mar', revenue: 48000, expenses: 29000 },
  { month: 'Apr', revenue: 61000, expenses: 35000 },
  { month: 'May', revenue: 55000, expenses: 32000 },
  { month: 'Jun', revenue: 67000, expenses: 38000 },
];

// Invoice Status Data
export const invoiceStatusData = [
  { name: 'Paid', value: 216840, percentage: 79 },
  { name: 'Pending', value: 57080, percentage: 21 },
  { name: 'Overdue', value: 179080, percentage: 65 },
];

// Monthly Payments Data
export const monthlyPaymentsData = [
  { month: 'Jul', payments: 45000 },
  { month: 'Aug', payments: 52000 },
  { month: 'Sep', payments: 48000 },
  { month: 'Oct', payments: 61000 },
  { month: 'Nov', payments: 67000 },
  { month: 'Dec', payments: 75000 },
];
