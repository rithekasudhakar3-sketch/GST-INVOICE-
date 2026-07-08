'use client';

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { formatCurrency } from '@/lib/utils';
import { mockCustomers, mockProducts } from '@/lib/mockData';
import { InvoicePreview } from '@/components/InvoicePreview';
import { Plus, X, Download, Sparkles, FileText, BadgePercent } from 'lucide-react';

export default function CreateInvoicePage() {
  const [isDark, setIsDark] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('Thank you for your business.');
  const [terms, setTerms] = useState('Payment due within 30 days.');
  const [roundOff, setRoundOff] = useState(0);
  const [companyLogo, setCompanyLogo] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', quantity: 1, price: 0, gst: 18 }]);
import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Plus, X, Copy, Download, Printer, Share2, 
  Mail, RotateCcw, ChevronDown, Save, Eye
} from 'lucide-react';

import { Navbar } from '../../../../components/Navbar';
import { Sidebar } from '../../../../components/Sidebar';
import { InputField } from '../../../../components/InputField';
import { SelectField } from '../../../../components/SelectField';
import { DatePicker } from '../../../../components/DatePicker';
import { InvoiceRow } from '../../../../components/InvoiceRow';
import { InvoicePreview } from '../../../../components/InvoicePreview';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { SecondaryButton } from '../../../../components/SecondaryButton';
import { Toast } from '../../../../components/Toast';
import { Modal } from '../../../../components/Modal';

import { downloadInvoicePDF } from '../../../../utils/pdfGenerator';

// Load local mock presets
import companiesData from '../../../../data/Companies.json';
import customersData from '../../../../data/Customers.json';
import productsData from '../../../../data/Products.json';
import gstRatesData from '../../../../data/GSTRates.json';
import banksData from '../../../../data/Banks.json';

export default function CreateInvoicePage() {
  const [isDark, setIsDark] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ to: '', subject: '', message: '' });

  // Collapse sections state (ERP accordion look)
  const [collapsed, setCollapsed] = useState({
    supplier: false,
    customer: false,
    invoiceDetails: false,
    items: false,
    payment: false,
    signatory: false
  });

  const toggleCollapse = (sec) => {
    setCollapsed(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const previewRef = useRef(null);

  // Setup form default values
  const defaultInvoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`;
  const today = new Date().toISOString().split('T')[0];
  const nextFortnight = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const defaultValues = {
    invoiceNumber: defaultInvoiceNumber,
    invoiceDate: today,
    dueDate: nextFortnight,
    placeOfSupply: 'Maharashtra',
    reverseCharge: 'No',
    paymentTerms: 'Net 15 Days',
    paymentMode: 'Bank Transfer',
    vehicleNumber: '',
    deliveryNote: '',
    referenceNumber: '',
    challanNumber: `CH-${String(Math.floor(1000 + Math.random() * 9000))}`,
    paymentStatus: 'Pending',
    overallDiscount: 0,
    notes: 'Thank you for your business! Goods once sold will not be taken back.',
    terms: 'Goods once sold will not be taken back.\nInterest @18% on delayed payments.\nSubject to local jurisdiction.',
    signatoryName: 'Authorized Signatory',
    designation: 'Managing Director',
    
    // Preset Selections
    selectedSupplierId: companiesData[0]?.id || '',
    selectedCustomerId: customersData[0]?.id || '',
    selectedBankId: banksData[0]?.id || '',

    // Supplier Fields
    supplierName: companiesData[0]?.name || '',
    supplierTagline: companiesData[0]?.tagline || '',
    supplierGstin: companiesData[0]?.gstin || '',
    supplierPan: companiesData[0]?.pan || '',
    supplierAddress: companiesData[0]?.address || '',
    supplierCity: companiesData[0]?.city || '',
    supplierState: companiesData[0]?.state || '',
    supplierStateCode: companiesData[0]?.stateCode || '',
    supplierPincode: companiesData[0]?.pincode || '',
    supplierEmail: companiesData[0]?.email || '',
    supplierPhone: companiesData[0]?.phone || '',
    supplierWebsite: companiesData[0]?.website || '',
    supplierLogo: companiesData[0]?.logo || '',

    // Customer Fields
    isUnregistered: customersData[0]?.isUnregistered || false,
    customerName: customersData[0]?.name || '',
    customerGstin: customersData[0]?.gstin || '',
    customerBillingAddress: customersData[0]?.billingAddress || '',
    customerShippingAddress: customersData[0]?.shippingAddress || '',
    customerContactPerson: customersData[0]?.contactPerson || '',
    customerEmail: customersData[0]?.email || '',
    customerPhone: customersData[0]?.phone || '',
    customerState: customersData[0]?.state || '',
    customerStateCode: customersData[0]?.stateCode || '',
    customerPincode: customersData[0]?.pincode || '',

    // Bank details fields
    bankName: banksData[0]?.bankName || '',
    accountHolder: banksData[0]?.accountHolder || '',
    accountNumber: banksData[0]?.accountNumber || '',
    ifscCode: banksData[0]?.ifscCode || '',
    branch: banksData[0]?.branch || '',
    bankUpiId: banksData[0]?.upiId || '',

    // Line items
    items: [
      {
        id: Date.now().toString(),
        name: productsData[0]?.name || '',
        description: productsData[0]?.description || '',
        hsnCode: productsData[0]?.hsnCode || '',
        quantity: 2,
        unit: productsData[0]?.unit || 'PCS',
        unitPrice: productsData[0]?.price || 0,
        discount: 0,
        gstRate: productsData[0]?.gstRate || 18
      }
    ]
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange'
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'items'
  });

  // Watch fields in real-time
  const formValues = watch();

  // Load selected preset data helpers
  const handleSupplierPresetChange = (id) => {
    const comp = companiesData.find(c => c.id === id);
    if (comp) {
      setValue('supplierName', comp.name);
      setValue('supplierTagline', comp.tagline || '');
      setValue('supplierGstin', comp.gstin);
      setValue('supplierPan', comp.pan);
      setValue('supplierAddress', comp.address);
      setValue('supplierCity', comp.city);
      setValue('supplierState', comp.state);
      setValue('supplierStateCode', comp.stateCode);
      setValue('supplierPincode', comp.pincode);
      setValue('supplierEmail', comp.email);
      setValue('supplierPhone', comp.phone);
      setValue('supplierWebsite', comp.website);
      setValue('supplierLogo', comp.logo);
      showToast('success', `Supplier preset loaded: ${comp.name}`);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const gstAmount = items.reduce((sum, item) => sum + item.quantity * item.price * (item.gst / 100), 0);
  const total = subtotal + gstAmount - discount + roundOff;
  const invoiceNumber = useMemo(() => `INV-${String(new Date().getFullYear()).slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 9000) + 1000)}`, []);
  const handleCustomerPresetChange = (id) => {
    const cust = customersData.find(c => c.id === id);
    if (cust) {
      setValue('isUnregistered', cust.isUnregistered);
      setValue('customerName', cust.name);
      setValue('customerGstin', cust.gstin);
      setValue('customerBillingAddress', cust.billingAddress);
      setValue('customerShippingAddress', cust.shippingAddress || cust.billingAddress);
      setValue('customerContactPerson', cust.contactPerson || '');
      setValue('customerEmail', cust.email || '');
      setValue('customerPhone', cust.phone || '');
      setValue('customerState', cust.state);
      setValue('customerStateCode', cust.stateCode);
      setValue('customerPincode', cust.pincode);
      
      setValue('placeOfSupply', cust.state);
      showToast('success', `Customer preset loaded: ${cust.name}`);
    }
  };

  const handleBankPresetChange = (id) => {
    const bank = banksData.find(b => b.id === id);
    if (bank) {
      setValue('bankName', bank.bankName);
      setValue('accountHolder', bank.accountHolder);
      setValue('accountNumber', bank.accountNumber);
      setValue('ifscCode', bank.ifscCode);
      setValue('branch', bank.branch);
      setValue('bankUpiId', bank.upiId || '');
      showToast('success', `Bank account loaded: ${bank.bankName}`);
    }
  };

  // Helper to duplicate an item row
  const handleDuplicateItem = (index) => {
    const item = watch(`items.${index}`);
    insert(index + 1, {
      ...item,
      id: Date.now().toString() + Math.random().toString() // unique key
    });
    showToast('info', 'Item duplicated');
  };

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // Build the compiled data model for Preview component rendering
  const getCompiledData = () => {
    return {
      invoiceNumber: formValues.invoiceNumber,
      invoiceDate: formValues.invoiceDate,
      dueDate: formValues.dueDate,
      placeOfSupply: formValues.placeOfSupply,
      reverseCharge: formValues.reverseCharge,
      paymentTerms: formValues.paymentTerms,
      paymentMode: formValues.paymentMode,
      vehicleNumber: formValues.vehicleNumber,
      deliveryNote: formValues.deliveryNote,
      referenceNumber: formValues.referenceNumber,
      challanNumber: formValues.challanNumber,
      paymentStatus: formValues.paymentStatus,
      overallDiscount: formValues.overallDiscount,
      notes: formValues.notes,
      terms: formValues.terms,
      signatoryName: formValues.signatoryName,
      designation: formValues.designation,
      supplier: {
        name: formValues.supplierName,
        tagline: formValues.supplierTagline,
        gstin: formValues.supplierGstin,
        pan: formValues.supplierPan,
        address: formValues.supplierAddress,
        city: formValues.supplierCity,
        state: formValues.supplierState,
        stateCode: formValues.supplierStateCode,
        pincode: formValues.supplierPincode,
        email: formValues.supplierEmail,
        phone: formValues.supplierPhone,
        website: formValues.supplierWebsite,
        logo: formValues.supplierLogo
      },
      customer: {
        name: formValues.customerName,
        gstin: formValues.customerGstin,
        billingAddress: formValues.customerBillingAddress,
        shippingAddress: formValues.customerShippingAddress,
        contactPerson: formValues.customerContactPerson,
        email: formValues.customerEmail,
        phone: formValues.customerPhone,
        state: formValues.customerState,
        stateCode: formValues.customerStateCode,
        pincode: formValues.customerPincode,
        isUnregistered: formValues.isUnregistered
      },
      bank: {
        bankName: formValues.bankName,
        accountHolder: formValues.accountHolder,
        accountNumber: formValues.accountNumber,
        ifscCode: formValues.ifscCode,
        branch: formValues.branch,
        upiId: formValues.bankUpiId
      },
      items: formValues.items || []
    };
  };

  // Form Submit Handler
  const onFormSubmit = (data) => {
    console.log('Submitting Invoice Draft Data:', data);
    showToast('success', `Invoice ${data.invoiceNumber} saved as draft successfully!`);
  };

  // PDF Export Trigger
  const handleDownloadPDF = async () => {
    // Validate inputs
    if (!formValues.invoiceNumber) {
      showToast('error', 'Validation Error: Invoice Number is required.');
      return;
    }
    if (!formValues.supplierName || !formValues.supplierGstin) {
      showToast('error', 'Validation Error: Supplier Name and GSTIN are required.');
      return;
    }
    if (!formValues.customerName) {
      showToast('error', 'Validation Error: Customer Name is required.');
      return;
    }
    if (!formValues.items || formValues.items.length === 0) {
      showToast('error', 'Validation Error: Add at least one product row.');
      return;
    }

    showToast('info', 'Generating high-resolution PDF...');
    const result = await downloadInvoicePDF('invoice-print-area', formValues.invoiceNumber);
    if (result) {
      showToast('success', 'PDF downloaded successfully!');
    } else {
      showToast('error', 'Failed to generate PDF document.');
    }
  };

  // Share & Email mock handlers
  const handleShareSubmit = () => {
    setIsShareModalOpen(false);
    showToast('success', 'Invoice link copied to clipboard & shared!');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setIsEmailModalOpen(false);
    showToast('success', `Email sent successfully to ${emailForm.to}!`);
    setEmailForm({ to: '', subject: '', message: '' });
  };

  const handleResetForm = () => {
    reset(defaultValues);
    showToast('warning', 'Form reset to default presets.');
  };

  return (
    <div className={`${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-200`}>
      <Navbar 
        user="seller" 
        role="seller"
        onThemeToggle={() => setIsDark(!isDark)}
        isDark={isDark}
      />

      <div className="flex">
        {/* Collapsible Sidebar */}
        <Sidebar role="seller" isDark={isDark} />

        <main className="flex-1 lg:ml-64 pt-16 flex flex-col xl:flex-row h-[calc(100vh-64px)] overflow-hidden">
          
          {/* Left Panel: Invoice Generator Form */}
          <div className="w-full xl:w-7/12 p-4 sm:p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-800 space-y-6">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">GST Invoice Redesigner</h1>
                <p className="text-xs text-gray-500">Configure layout inputs matching GoGSTBill, Vyapar, and TallyPrime</p>
              </div>
              <div className="flex gap-2 self-start sm:self-auto">
                <SecondaryButton 
                  onClick={handleResetForm} 
                  icon={RotateCcw} 
                  className="!py-1.5 px-3 text-xs"
                >
                  Reset
                </SecondaryButton>
                <PrimaryButton 
                  onClick={handleSubmit(onFormSubmit)} 
                  icon={Save}
                  className="!py-1.5 px-3 text-xs"
                >
                  Save Draft
                </PrimaryButton>
              </div>
            </div>

            {/* Quick Load presets bar */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Load Supplier Preset</label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => {
                    setSelectedCustomer(e.target.value);
                    setSelectedCustomerData(mockCustomers.find((customer) => customer.id === e.target.value) || null);
                  }}
                  className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={formValues.selectedSupplierId}
                  onChange={(e) => {
                    setValue('selectedSupplierId', e.target.value);
                    handleSupplierPresetChange(e.target.value);
                  }}
                  className="text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1"
                >
                  {companiesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Invoice Number
                  </label>
                  <input
                    readOnly
                    value={invoiceNumber}
                    className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Load Customer Preset</label>
                <select
                  value={formValues.selectedCustomerId}
                  onChange={(e) => {
                    setValue('selectedCustomerId', e.target.value);
                    handleCustomerPresetChange(e.target.value);
                  }}
                  className="text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1"
                >
                  {customersData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Load Bank Account</label>
                <select
                  value={formValues.selectedBankId}
                  onChange={(e) => {
                    setValue('selectedBankId', e.target.value);
                    handleBankPresetChange(e.target.value);
                  }}
                  className="text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1"
                >
                  {banksData.map(b => <option key={b.id} value={b.id}>{b.bankName}</option>)}
                </select>
              </div>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              
              {/* SECTION 1: SUPPLIER DETAILS */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div 
                  onClick={() => toggleCollapse('supplier')}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-850 cursor-pointer border-b border-gray-200 dark:border-gray-800"
                >
                  <h3 className="font-bold text-sm tracking-wide text-gray-700 dark:text-gray-300">1. Supplier Details</h3>
                  <ChevronDown className={`w-4 h-4 transition-transform ${collapsed.supplier ? 'rotate-180' : ''}`} />
                </div>
                
                {!collapsed.supplier && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <InputField 
                      label="Company Name" 
                      required
                      {...register('supplierName', { required: 'Supplier Name is required' })}
                      error={errors.supplierName}
                    />
                    <InputField 
                      label="Business Tagline" 
                      placeholder="e.g. Engineering Excellence"
                      {...register('supplierTagline')}
                    />
                    <InputField 
                      label="GSTIN" 
                      required
                      {...register('supplierGstin', { 
                        required: 'Supplier GSTIN is required',
                        pattern: { value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: 'Invalid GSTIN format' }
                      })}
                      error={errors.supplierGstin}
                    />
                    <InputField label="PAN Number" {...register('supplierPan')} />
                    <InputField label="Address" {...register('supplierAddress')} className="sm:col-span-2" />
                    <InputField label="City" {...register('supplierCity')} />
                    <InputField label="State" {...register('supplierState')} />
                    <InputField label="State Code" {...register('supplierStateCode')} />
                    <InputField label="Pincode" {...register('supplierPincode')} />
                    <InputField label="Email" type="email" {...register('supplierEmail')} />
                    <InputField label="Phone" {...register('supplierPhone')} />
                    <InputField label="Website" {...register('supplierWebsite')} />
                  </div>
                )}
              </div>

              {/* SECTION 2: CUSTOMER DETAILS */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div 
                  onClick={() => toggleCollapse('customer')}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-850 cursor-pointer border-b border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-sm tracking-wide text-gray-700 dark:text-gray-300">2. Customer Details</h3>
                    <div className="flex items-center gap-1.5 ml-4">
                      <input 
                        type="checkbox" 
                        id="unregistered" 
                        {...register('isUnregistered')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-3 w-3 cursor-pointer"
                      />
                      <label htmlFor="unregistered" className="text-[10px] text-gray-500 font-bold uppercase cursor-pointer select-none">Unregistered</label>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${collapsed.customer ? 'rotate-180' : ''}`} />
                </div>
                
                {!collapsed.customer && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <InputField 
                      label={formValues.isUnregistered ? 'Recipient Name' : 'Customer Name'} 
                      required
                      {...register('customerName', { required: 'Customer name is required' })}
                      error={errors.customerName}
                    />
                    
                    {!formValues.isUnregistered && (
                      <InputField 
                        label="GSTIN" 
                        {...register('customerGstin')}
                        error={errors.customerGstin}
                      />
                    )}

                    <InputField 
                      label={formValues.isUnregistered ? 'Delivery Address' : 'Billing Address'} 
                      {...register('customerBillingAddress')} 
                      className="sm:col-span-2"
                    />

                    {!formValues.isUnregistered && (
                      <InputField 
                        label="Shipping Address" 
                        {...register('customerShippingAddress')} 
                        className="sm:col-span-2"
                      />
                    )}

                    {!formValues.isUnregistered && (
                      <InputField label="Contact Person" {...register('customerContactPerson')} />
                    )}

                    <InputField label="Email" type="email" {...register('customerEmail')} />
                    <InputField label="Phone Number" {...register('customerPhone')} />
                    <InputField label="State Name" {...register('customerState')} />
                    <InputField label="State Code" {...register('customerStateCode')} />
                    <InputField label="Pincode" {...register('customerPincode')} />
                  </div>
                )}
              </div>

              {/* SECTION 3: INVOICE DETAILS */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div 
                  onClick={() => toggleCollapse('invoiceDetails')}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-850 cursor-pointer border-b border-gray-200 dark:border-gray-800"
                >
                  <h3 className="font-bold text-sm tracking-wide text-gray-700 dark:text-gray-300">3. Invoice Details</h3>
                  <ChevronDown className={`w-4 h-4 transition-transform ${collapsed.invoiceDetails ? 'rotate-180' : ''}`} />
                </div>
                
                {!collapsed.invoiceDetails && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <InputField 
                      label="Invoice Number" 
                      required
                      {...register('invoiceNumber', { required: 'Invoice number is required' })}
                      error={errors.invoiceNumber}
                    />
                    <DatePicker 
                      label="Invoice Date" 
                      required
                      {...register('invoiceDate', { required: 'Date is required' })}
                      error={errors.invoiceDate}
                    />
                    <DatePicker label="Due Date" {...register('dueDate')} />
                    <InputField label="Place of Supply" {...register('placeOfSupply')} />
                    <SelectField 
                      label="Reverse Charge" 
                      options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]} 
                      {...register('reverseCharge')}
                    />
                    <InputField label="Payment Terms" {...register('paymentTerms')} />
                    <InputField label="Payment Mode" {...register('paymentMode')} />
                    <InputField label="Vehicle Number" placeholder="e.g. MH-12-PQ-4567" {...register('vehicleNumber')} />
                    <InputField label="Delivery Note" placeholder="Internal remarks" {...register('deliveryNote')} />
                    <InputField label="Reference Number" {...register('referenceNumber')} />
                    <InputField label="Challan Number" {...register('challanNumber')} />
                  </div>
                )}
              </div>

              <div className="mb-6 rounded-2xl border border-dashed border-blue-300 bg-blue-50/70 p-4 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                <div className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4" /> Live invoice preview is enabled</div>
                <p className="mt-1">Changes to items, discount, notes, and branding are reflected instantly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Invoice notes..."
                    rows="4"
                    className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
              {/* SECTION 4: PRODUCT ITEM TABLE */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div 
                  onClick={() => toggleCollapse('items')}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-850 cursor-pointer border-b border-gray-200 dark:border-gray-800"
                >
                  <h3 className="font-bold text-sm tracking-wide text-gray-700 dark:text-gray-300">4. Products & Service Table</h3>
                  <ChevronDown className={`w-4 h-4 transition-transform ${collapsed.items ? 'rotate-180' : ''}`} />
                </div>

                {!collapsed.items && (
                  <div className="p-4 space-y-4">
                    {fields.map((field, index) => (
                      <InvoiceRow
                        key={field.id}
                        index={index}
                        register={register}
                        remove={remove}
                        watch={watch}
                        setValue={setValue}
                        productsData={productsData}
                        gstRatesData={gstRatesData}
                        errors={errors}
                      />
                    ))}

                    <PrimaryButton
                      type="button"
                      onClick={() => append({ id: Date.now().toString(), name: '', description: '', hsnCode: '', quantity: 1, unit: 'PCS', unitPrice: 0, discount: 0, gstRate: 18 })}
                      icon={Plus}
                      className="w-full text-xs font-semibold uppercase tracking-wider py-2 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-dashed border-blue-200 dark:border-blue-900/60 shadow-none"
                    >
                      Add Row Item
                    </PrimaryButton>
                  </div>
                )}
              </div>

              {/* SECTION 5: BANK DETAILS & PAYMENT STATUS */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div 
                  onClick={() => toggleCollapse('payment')}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-850 cursor-pointer border-b border-gray-200 dark:border-gray-800"
                >
                  <h3 className="font-bold text-sm tracking-wide text-gray-700 dark:text-gray-300">5. Settlement Bank & Status</h3>
                  <ChevronDown className={`w-4 h-4 transition-transform ${collapsed.payment ? 'rotate-180' : ''}`} />
                </div>
                
                {!collapsed.payment && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <InputField label="Bank Name" {...register('bankName')} />
                    <InputField label="Account Holder" {...register('accountHolder')} />
                    <InputField label="Account Number" {...register('accountNumber')} />
                    <InputField label="IFSC Code" {...register('ifscCode')} />
                    <InputField label="Branch" {...register('branch')} />
                    <InputField label="UPI ID" placeholder="e.g. acme@sbi" {...register('bankUpiId')} />
                    <SelectField 
                      label="Invoice Status" 
                      options={[
                        { value: 'Draft', label: 'Draft' },
                        { value: 'Sent', label: 'Sent' },
                        { value: 'Paid', label: 'Paid' },
                        { value: 'Pending', label: 'Pending' },
                        { value: 'Overdue', label: 'Overdue' },
                        { value: 'Cancelled', label: 'Cancelled' }
                      ]} 
                      {...register('paymentStatus')}
                    />
                    <InputField 
                      label="Overall Invoice Discount (Flat)" 
                      type="number"
                      step="0.01"
                      {...register('overallDiscount', { valueAsNumber: true })}
                    />
                  </div>
                )}
              </div>

              {/* SECTION 6: TERMS, REMARKS & SIGNATURES */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div 
                  onClick={() => toggleCollapse('signatory')}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-850 cursor-pointer border-b border-gray-200 dark:border-gray-800"
                >
                  <h3 className="font-bold text-sm tracking-wide text-gray-700 dark:text-gray-300">6. Disclaimers & Signatures</h3>
                  <ChevronDown className={`w-4 h-4 transition-transform ${collapsed.signatory ? 'rotate-180' : ''}`} />
                </div>
                
                {!collapsed.signatory && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Remarks / Notes</label>
                        <textarea 
                          rows="3" 
                          {...register('notes')} 
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Terms & Conditions (Newline Split)</label>
                        <textarea 
                          rows="3" 
                          {...register('terms')} 
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="Authorized Signatory Name" {...register('signatoryName')} />
                      <InputField label="Designation" {...register('designation')} />
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

              {showPreview && (
                <div className="mb-8">
                  <InvoicePreview
                    invoice={{ invoiceNumber, invoiceDate: new Date().toISOString().split('T')[0], dueDate: new Date().toISOString().split('T')[0] }}
                    company={{ companyName: 'Acme Corp', gstin: '18AABCT1234H1Z0', address: '123 Market Street, Mumbai', phone: '+91 9876543210', authorizedName: 'John Doe', logo: companyLogo }}
                    customer={selectedCustomerData || { name: 'Customer Name', address: 'Customer Address', gstin: 'GSTIN' }}
                    items={items.map((item) => ({ ...item, name: mockProducts.find((product) => product.id === item.product)?.name || 'Item' }))}
                    discount={discount}
                    notes={notes}
                    terms={terms}
                    isDark={isDark}
                  />
                </div>
              )}

              <div className="flex gap-4 justify-end">
                <button className={`${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300'} px-6 py-2 rounded-lg font-medium transition-colors`}>
                  Save Draft
                </button>
                <button
                  onClick={() => setShowPreview((current) => !current)}
                  className={`${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300'} flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors`}
                >
                  <Download className="w-4 h-4" />
                  {showPreview ? 'Hide Preview' : 'Preview'}
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Create Invoice
                </button>
          {/* Right Panel: Live Invoice Preview Sheet */}
          <div className="w-full xl:w-5/12 h-[calc(100vh-64px)] bg-gray-150 dark:bg-gray-900 overflow-y-auto flex flex-col justify-between select-none border-t xl:border-t-0 border-gray-200 dark:border-gray-800">
            {/* Action Bar */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between gap-2 shrink-0 sticky top-0 z-10 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-500" />
                ERP Print Preview
              </span>
              <div className="flex gap-1.5">
                <SecondaryButton 
                  onClick={() => setIsEmailModalOpen(true)}
                  icon={Mail} 
                  className="!py-1 px-2.5 !text-[11px]"
                >
                  Email
                </SecondaryButton>
                <SecondaryButton 
                  onClick={() => setIsShareModalOpen(true)}
                  icon={Share2} 
                  className="!py-1 px-2.5 !text-[11px]"
                >
                  Share
                </SecondaryButton>
                <SecondaryButton 
                  onClick={() => window.print()} 
                  icon={Printer} 
                  className="!py-1 px-2.5 !text-[11px]"
                >
                  Print
                </SecondaryButton>
                <PrimaryButton 
                  onClick={handleDownloadPDF} 
                  icon={Download} 
                  className="!py-1 px-2.5 !text-[11px] bg-blue-600 hover:bg-blue-700"
                >
                  Download PDF
                </PrimaryButton>
              </div>
            </div>

            {/* Print Sheet */}
            <div className="flex-1 py-6">
              <InvoicePreview 
                ref={previewRef}
                id="invoice-print-area"
                data={getCompiledData()} 
              />
            </div>
          </div>
        </main>
      </div>

      {/* SHARE INVOICE MODAL */}
      <Modal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        title="Share GST Tax Invoice"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Copy the URL below to share this interactive draft invoice sheet with your client.</p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`https://invoicehub.in/preview/share/doc-${formValues.invoiceNumber}`}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs flex-1 outline-none text-gray-600"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://invoicehub.in/preview/share/doc-${formValues.invoiceNumber}`);
                showToast('success', 'Shared URL copied to clipboard!');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton onClick={() => setIsShareModalOpen(false)} className="text-xs">Cancel</SecondaryButton>
            <PrimaryButton onClick={handleShareSubmit} className="text-xs">Send Link</PrimaryButton>
          </div>
        </div>
      </Modal>

      {/* EMAIL INVOICE MODAL */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Email Invoice PDF (UI Demo)"
        size="md"
      >
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <p className="text-sm text-gray-500">Attach the high-resolution generated A4 PDF and email it directly.</p>
          <InputField
            label="Recipient Email"
            type="email"
            required
            value={emailForm.to}
            onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
            placeholder="client@company.com"
          />
          <InputField
            label="Subject"
            required
            value={emailForm.subject || `Tax Invoice ${formValues.invoiceNumber} from ${formValues.supplierName}`}
            onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
          />
          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-1 text-gray-700">Message Body</label>
            <textarea
              rows="4"
              value={emailForm.message || `Dear Customer,\n\nPlease find attached Tax Invoice ${formValues.invoiceNumber} for goods/services delivered.\n\nBest regards,\n${formValues.supplierName}`}
              onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-150 flex items-center justify-between text-xs text-gray-500">
            <span className="truncate">📎 GST_Invoice_{formValues.invoiceNumber}.pdf</span>
            <span className="font-mono text-[9px] shrink-0 text-blue-600 font-bold bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">Ready to Send</span>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton type="button" onClick={() => setIsEmailModalOpen(false)} className="text-xs">Cancel</SecondaryButton>
            <PrimaryButton type="submit" className="text-xs" icon={Mail}>Send Email</PrimaryButton>
          </div>
        </form>
      </Modal>

      {/* TOAST SYSTEM */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={4000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
