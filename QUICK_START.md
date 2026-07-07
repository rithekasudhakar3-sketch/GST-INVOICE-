# 🚀 InvoiceHub - Quick Start Guide

## Welcome to InvoiceHub!

A modern, fully-featured Invoice Management System with separate portals for sellers and clients.

## ⚡ Get Running in 30 Seconds

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open in browser
# http://localhost:3000
```

## 🎯 Explore the App

### 1. **Home Page** (`/`)
- Overview of InvoiceHub
- Choose your role: **Seller** or **Client**

### 2. **Seller Portal** (`/seller/dashboard`)
Create invoices, manage customers, track payments

**Key Pages:**
- 📊 Dashboard - Sales overview & KPIs
- 👥 Customers - Manage customer database
- 📦 Products - Product catalog
- 📄 Invoices - Create & manage invoices
- 💰 Payments - Track payment status
- 📈 Reports - Business analytics
- 🔔 Notifications - Alerts & updates
- ⚙️ Settings - Account settings

### 3. **Client Portal** (`/client/dashboard`)
Receive invoices, manage vendors, track expenses

**Key Pages:**
- 📊 Dashboard - Expense overview
- 📥 Invoices - Received bills
- 🏢 Vendors - Vendor relationships
- 💳 Payments - Payment history
- 📊 Reports - Expense analytics
- 🔔 Notifications - Alerts
- ⚙️ Settings - Account settings

## 🎨 Features to Try

### Seller Features
1. **Create Invoice**
   - Go to Invoices → Create Invoice
   - Select customer
   - Add items (select from products)
   - GST calculates automatically
   - Save or preview

2. **Manage Customers**
   - View customer grid
   - Search by name/email
   - View purchase history
   - Sort by purchases

3. **View Reports**
   - Revenue trends
   - Top customers
   - GST summary
   - Invoice status breakdown

### Client Features
1. **View Bills**
   - Filter by status (Paid/Pending/Overdue)
   - Search bills
   - Download invoices

2. **Vendor Management**
   - View all vendors
   - See spending per vendor
   - Contact information

3. **Track Spending**
   - Monthly expense chart
   - Budget comparison
   - Top vendors report

## 🎨 Try Dark Mode!

Click the moon icon (🌙) in the navbar on any page to toggle dark mode.

## 📊 Mock Data Included

The app comes with realistic sample data:
- ✅ 4 Customers
- ✅ 3 Vendors
- ✅ 6 Products
- ✅ 4 Invoices
- ✅ 4 Payments
- ✅ Multiple Notifications

All data resets on page refresh (currently frontend-only).

## 🎮 Interactive Elements

Try these on any page:
- 🔍 **Search** - Find invoices, customers, products
- 🔽 **Filter** - Sort by status, category, etc.
- 📄 **Pagination** - Navigate through results
- 🔔 **Notifications** - Click the bell icon
- 👤 **Profile** - Click avatar for menu
- 📱 **Responsive** - Resize browser to test mobile

## 💡 Key Features

| Feature | Seller | Client |
|---------|--------|--------|
| Dashboard | ✅ Revenue view | ✅ Expense view |
| Invoices | ✅ Create & manage | ✅ View & download |
| Customers/Vendors | ✅ Manage customers | ✅ View vendors |
| Payments | ✅ Track status | ✅ Track payments |
| Reports | ✅ Sales analytics | ✅ Expense analytics |
| Dark Mode | ✅ Yes | ✅ Yes |
| Search | ✅ Yes | ✅ Yes |
| Charts | ✅ Yes | ✅ Yes |

## 🛠️ Technology Stack

- **Frontend (client/)**: React 19 + Next.js 16 (Turbopack)
- **Backend (server/)**: Express.js + Node.js (ES Modules)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: React Icons + Lucide React
- **Database**: Mock in-memory database service (ready for MongoDB / PostgreSQL)

## 📁 Project Structure

```
invoice-management-system/
├── client/                     # Next.js Frontend
│   ├── app/                    # Next.js App Router (client, seller pages)
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Client libraries and mock data
│   ├── public/                 # Static assets (images, icons)
│   └── package.json            # Frontend config
├── server/                     # Express.js Backend API
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/             # Route configurations
│   │   ├── services/           # DB Service (in-memory mock database)
│   │   ├── app.js              # Express app initialization
│   │   └── server.js           # Server port listener entry point
│   └── package.json            # Backend config
├── pnpm-workspace.yaml         # Workspace monorepo declaration
└── package.json                # Monorepo runner scripts
```

## 🎓 Learning Path

1. **Start**: Visit home page (`/`)
2. **Explore Seller**: Click "Seller Portal"
   - Check dashboard
   - View customers
   - Look at products
   - Try creating an invoice
   - Check reports
3. **Explore Client**: Go back to `/` and click "Client Portal"
   - Check dashboard
   - View received invoices
   - See vendors
   - Check expense reports

## ⚙️ Customization

### Change Colors
Edit `globals.css` in the theme section

### Modify Mock Data
Edit `lib/mockData.js`

### Add New Pages
Create files in `app/seller/` or `app/client/`

### Customize Components
Edit files in `components/`

## 🚀 Production Ready

This system is ready for:
- ✅ Backend API integration
- ✅ Database connection
- ✅ Authentication
- ✅ Payment processing
- ✅ Email notifications
- ✅ PDF generation
- ✅ Deployment to Vercel

## 📖 Documentation

- **README_INVOICE_SYSTEM.md** - Full feature documentation
- **PROJECT_SUMMARY.md** - Technical overview
- **This file** - Quick start guide

## 🐛 Troubleshooting

**Page not loading?**
- Clear browser cache
- Restart dev server: `pnpm dev`

**Styling issues?**
- Tailwind CSS is building in dev mode
- Wait for compilation to complete

**Data not showing?**
- Refresh the page
- Mock data resets on refresh

## 💬 What's Next?

To make this production-ready:
1. Set up backend API
2. Add authentication
3. Connect to database
4. Implement PDF generation
5. Add email notifications
6. Deploy to Vercel

## 📞 File Reference

Key files to understand:
- `lib/mockData.js` - All sample data
- `lib/utils.ts` - Helper functions
- `components/Navbar.jsx` - Top navigation
- `components/Sidebar.jsx` - Left navigation
- `app/seller/dashboard/page.jsx` - Example seller page
- `app/client/dashboard/page.jsx` - Example client page

## ✨ Pro Tips

1. **Search works everywhere** - Try searching on any list page
2. **Responsive design** - Works on mobile, tablet, desktop
3. **Dark mode persists** - Toggle per session
4. **Sort & filter** - Try different sort options
5. **Hover effects** - Cards and buttons have smooth animations
6. **Charts are interactive** - Hover over data points for details

## 🎉 You're Ready!

Your Invoice Management System is fully functional and ready to use. Start by visiting:

```
http://localhost:3000
```

Enjoy exploring InvoiceHub! 🚀

---

**Questions?** Check the other documentation files or explore the source code!
