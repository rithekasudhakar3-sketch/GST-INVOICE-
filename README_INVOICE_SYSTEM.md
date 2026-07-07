# InvoiceHub - Modern Invoice Management System

A comprehensive frontend application for managing invoices with two distinct portals: **Seller Portal** and **Client Portal**.

## 🎯 Overview

InvoiceHub is a professional invoice management system built with React, Next.js, and Tailwind CSS. It provides complete functionality for:
- Creating and managing invoices
- Tracking payments
- Managing customers and products
- Generating business reports
- Real-time notifications

## 📁 Project Structure

```
src/
├── app/
│   ├── page.jsx                 # Home page with role selection
│   ├── seller/
│   │   ├── dashboard/           # Seller dashboard with KPIs
│   │   ├── customers/           # Customer management
│   │   ├── products/            # Product catalog
│   │   ├── invoices/            # Invoice list and creation
│   │   ├── invoices/create/     # Invoice builder
│   │   ├── payments/            # Payment tracking
│   │   ├── reports/             # Business analytics
│   │   ├── notifications/       # Notifications
│   │   └── settings/            # Settings
│   └── client/
│       ├── dashboard/           # Client dashboard
│       ├── invoices/            # Received invoices
│       ├── vendors/             # Vendor management
│       ├── payments/            # Payment history
│       ├── reports/             # Expense analytics
│       ├── notifications/       # Notifications
│       └── settings/            # Settings
├── components/
│   ├── Navbar.jsx               # Top navigation
│   ├── Sidebar.jsx              # Left sidebar navigation
│   ├── StatCard.jsx             # Statistics card
│   ├── StatusBadge.jsx          # Status badge component
│   ├── SearchBar.jsx            # Search input
│   ├── Pagination.jsx           # Pagination controls
│   ├── Modal.jsx                # Modal dialog
│   ├── Tabs.jsx                 # Tab component
│   ├── Toast.jsx                # Toast notifications
│   ├── Avatar.jsx               # User avatar
│   └── ...
├── lib/
│   ├── mockData.js              # Mock data for all pages
│   ├── utils.js                 # Utility functions
│   └── cn.ts                    # Class name utilities
└── globals.css                  # Global styles
```

## 🚀 Features

### Seller Portal

#### Dashboard
- Revenue overview with trend analysis
- Customer count with growth metrics
- Pending and paid invoice tracking
- Monthly revenue chart
- Invoice status pie chart
- Recent invoices table

#### Customers Management
- Browse all customers with pagination
- Add/edit/delete customers
- Search and filter customers
- Sort by name or purchase amount
- View customer details and purchase history

#### Products Management
- Product catalog with grid view
- Filter by category
- Search products
- View stock status
- Manage product details
- Add/edit/delete products

#### Invoice Creation
- Professional invoice builder
- Select customers from dropdown
- Add invoice items dynamically
- Calculate subtotal and GST automatically
- Apply discounts
- Save as draft or create directly
- Preview and download functionality

#### Invoices Management
- View all invoices with filters
- Filter by invoice status
- Search invoices by number or customer
- View invoice details
- Download invoice as PDF (UI)
- Send invoice to customer (UI)
- Track invoice status

#### Payments Tracking
- Payment timeline view
- Filter by payment status
- View payment details
- Track payment methods
- Payment reference tracking

#### Reports & Analytics
- Revenue trend chart
- Customer sales analysis
- GST summary
- Invoice status distribution
- Collection rate metrics
- Monthly revenue comparison

### Client Portal

#### Dashboard
- Total bills overview
- Paid and pending bills count
- Total spending with trends
- Monthly spending chart
- Vendor-wise spending breakdown
- Recent bills table

#### Received Invoices
- View all received bills
- Filter by status (Paid, Pending, Overdue)
- Search bills
- View, download, and print functionality
- Pagination support

#### Vendors Management
- View all vendors
- Vendor contact information
- Total spending per vendor
- Average spending metrics
- Vendor details

#### Payments Tracking
- Payment history
- Payment status tracking
- Amount tracking
- Date information

#### Reports
- Expense vs budget comparison
- Top vendors chart
- Total YTD expense
- Average monthly expense
- Budget variance

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach, works seamlessly on all devices
- **Dark/Light Mode**: Theme toggle on all pages
- **Modern Components**: Professional UI components with smooth animations
- **Intuitive Navigation**: Easy-to-use sidebar and navbar
- **Charts & Graphs**: Interactive charts using Recharts
- **Status Indicators**: Color-coded status badges
- **Loading States**: Skeleton loaders and loading indicators
- **Empty States**: Helpful empty state messages

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: React Icons & Lucide React
- **State Management**: React Hooks
- **Routing**: Next.js App Router
- **Mock Data**: JavaScript objects (no backend required)

## 📊 Mock Data Included

The application comes with comprehensive mock data for:
- Users (Seller & Client)
- Customers (4 samples)
- Vendors (3 samples)
- Products (6 samples with categories)
- Invoices (4 samples with various statuses)
- Payments (4 samples)
- Notifications (4 samples)

All data is stored in `/lib/mockData.js`

## 🎯 Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Access Different Portals

- **Home Page**: `http://localhost:3000`
- **Seller Portal**: Click on "Seller Portal" or go to `http://localhost:3000/seller/dashboard`
- **Client Portal**: Click on "Client Portal" or go to `http://localhost:3000/client/dashboard`

## 💡 Key Components

### StatCard
Displays statistics with trend indicators
```jsx
<StatCard
  title="Revenue"
  value={273920}
  change={12.5}
  color="blue"
  icon={TrendingUp}
/>
```

### SearchBar
Input field with search icon
```jsx
<SearchBar
  placeholder="Search..."
  value={searchValue}
  onChange={handleChange}
/>
```

### StatusBadge
Status display with color coding
```jsx
<StatusBadge status="paid" label="Paid" />
```

### Pagination
Navigation for multi-page data
```jsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

## 🎨 Color Scheme

- **Primary**: Blue (#2563EB)
- **Secondary**: Purple (#8B5CF6)
- **Success**: Green (#22C55E)
- **Warning**: Orange (#F59E0B)
- **Danger**: Red (#EF4444)
- **Background**: Light Gray (#F8FAFC)

## 🔄 Utility Functions

Located in `/lib/utils.js`:
- `formatCurrency()` - Format numbers as INR currency
- `formatDate()` - Format dates in Indian locale
- `getStatusColor()` - Get color classes for status
- `calculateInvoiceTotal()` - Calculate totals with GST
- `getDaysOverdue()` - Calculate overdue days

## 📱 Responsive Breakpoints

- **Mobile**: Base styles
- **MD (768px)**: Medium screens
- **LG (1024px)**: Large screens
- **Sidebar**: Collapsible on mobile, sticky on desktop

## 🌙 Theme Support

All pages support dark mode. Toggle with the theme button in the navbar.

## 🚀 Future Enhancements

Possible additions for production:
1. Backend API integration
2. User authentication
3. Database integration
4. PDF generation
5. Email notifications
6. Payment gateway integration
7. Multi-currency support
8. Bulk import/export
9. Custom branding
10. Role-based access control

## 📝 Notes

- All data is mock data and resets on page refresh
- Forms don't submit to a backend
- PDF generation buttons are UI placeholders
- Email functionality is UI placeholder
- Payment methods are for display only

## 📄 License

This project is created for demonstration purposes.

---

**InvoiceHub** - Streamline your billing process ✨
