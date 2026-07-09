'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { InputField } from '@/components/InputField';
import { SelectField } from '@/components/SelectField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Briefcase,
  DollarSign
} from 'lucide-react';

export default function CreateCustomerForm({ onSuccess, onCancel }) {
  // 1. Core State
  const [customerType, setCustomerType] = useState('B2B'); // 'B2B' or 'B2C'
  const [formData, setFormData] = useState({
    customer_name: '',
    billing_email: '',
    contact_phone: '',
    customer_account_number: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    payment_terms_default: 'Due on Receipt',
    currency: 'USD',
    tax_registration_number: '',
    po_reference: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Clear business fields if user switches to B2C
  useEffect(() => {
    if (customerType === 'B2C') {
      setFormData(prev => ({
        ...prev,
        tax_registration_number: '',
        po_reference: ''
      }));
      // Clear errors related to business fields
      setFormErrors(prev => {
        const { tax_registration_number, po_reference, ...rest } = prev;
        return rest;
      });
    }
  }, [customerType]);

  // 3. Auto-generate Account Number helper
  const generateAccountNumber = () => {
    const prefix = customerType === 'B2B' ? 'ACC-B2B-' : 'ACC-B2C-';
    const randPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    const timePart = Date.now().toString().slice(-4);
    return `${prefix}${randPart}${timePart}`;
  };

  const handleGenerateAccount = (e) => {
    e.preventDefault();
    const newAccountNum = generateAccountNumber();
    setFormData(prev => ({ ...prev, customer_account_number: newAccountNum }));
    if (formErrors.customer_account_number) {
      setFormErrors(prev => ({ ...prev, customer_account_number: '' }));
    }
  };

  // 4. Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 5. Validation Logic
  const validateForm = (dataToValidate) => {
    const errors = {};
    
    // Core details validation
    if (!dataToValidate.customer_name.trim()) {
      errors.customer_name = 'Customer name is required';
    }
    
    if (!dataToValidate.billing_email.trim()) {
      errors.billing_email = 'Billing email is required';
    } else if (!/\S+@\S+\.\S+/.test(dataToValidate.billing_email)) {
      errors.billing_email = 'Invalid email address';
    }

    if (dataToValidate.contact_phone.trim() && !/^\+?[0-9\s-]{7,20}$/.test(dataToValidate.contact_phone.trim())) {
      errors.contact_phone = 'Invalid phone number format';
    }

    // Currency format constraint
    if (!dataToValidate.currency || dataToValidate.currency.length !== 3) {
      errors.currency = 'Currency must be a 3-letter code (e.g. USD)';
    }

    // Conditional field validation for B2B
    if (customerType === 'B2B') {
      if (!dataToValidate.tax_registration_number.trim()) {
        errors.tax_registration_number = 'Tax/Registration ID is strictly required for B2B clients';
      }
    }

    return errors;
  };

  // 6. Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(true);

    // Auto-generate Account Number if left blank
    let finalAccountNumber = formData.customer_account_number.trim();
    if (!finalAccountNumber) {
      finalAccountNumber = generateAccountNumber();
    }

    const payload = {
      ...formData,
      customer_type: customerType,
      customer_account_number: finalAccountNumber,
      // For B2C clients, explicitly force B2B-specific fields to null
      tax_registration_number: customerType === 'B2B' ? formData.tax_registration_number.trim() : null,
      po_reference: customerType === 'B2B' ? formData.po_reference.trim() : null,
    };

    const errors = validateForm(payload);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Retrieve active user session (seller_id)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        throw new Error('No authenticated user session found. Please log in first.');
      }
      
      payload.seller_id = session.user.id;

      // Insert record to Supabase customers table
      const { data, error } = await supabase
        .from('customers')
        .insert([payload])
        .select();

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData({
        customer_name: '',
        billing_email: '',
        contact_phone: '',
        customer_account_number: '',
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        payment_terms_default: 'Due on Receipt',
        currency: 'USD',
        tax_registration_number: '',
        po_reference: ''
      });

      if (onSuccess) {
        setTimeout(() => onSuccess(data[0]), 1500);
      }
    } catch (err) {
      console.error('Database Insertion Error:', err);
      // Detailed user-friendly database constraint matching
      let userFriendlyMsg = err.message || 'An unexpected database error occurred.';
      if (err.code === '23505') {
        if (err.message.includes('billing_email')) {
          userFriendlyMsg = 'A customer with this billing email already exists.';
        } else if (err.message.includes('customer_account_number')) {
          userFriendlyMsg = 'This account number is already in use by another customer.';
        }
      }
      setSubmitError(userFriendlyMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Payment Terms Options
  const paymentTermsOptions = [
    { value: 'Due on Receipt', label: 'Due on Receipt' },
    { value: 'Net 15', label: 'Net 15 Days' },
    { value: 'Net 30', label: 'Net 30 Days' },
    { value: 'Net 60', label: 'Net 60 Days' },
    { value: 'Net 90', label: 'Net 90 Days' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white relative">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4 scale-150">
          <Building2 className="w-48 h-48" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Create Customer profile</h2>
        <p className="text-blue-100 mt-2 text-sm max-w-xl">
          Register B2B companies or B2C individuals. Supabase will enforce Row Level Security, ensuring client isolation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        
        {/* Toggle Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
            Client Category
          </label>
          <div className="inline-flex rounded-xl p-1 bg-gray-100 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
            <button
              type="button"
              onClick={() => setCustomerType('B2B')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                customerType === 'B2B'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Building2 className="w-4 h-4" />
              B2B Enterprise
            </button>
            <button
              type="button"
              onClick={() => setCustomerType('B2C')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                customerType === 'B2C'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <User className="w-4 h-4" />
              B2C Individual
            </button>
          </div>
        </div>

        {/* SECTION 1: Core Identity */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
            1. Core Identity & Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={customerType === 'B2B' ? "Company / Legal Name" : "Customer Name"}
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              required
              error={formErrors.customer_name}
              placeholder={customerType === 'B2B' ? "Acme Corporation" : "John Doe"}
              icon={User}
            />

            <InputField
              label="Billing Email"
              name="billing_email"
              type="email"
              value={formData.billing_email}
              onChange={handleInputChange}
              required
              error={formErrors.billing_email}
              placeholder="billing@example.com"
              icon={Mail}
            />

            <InputField
              label="Contact Phone"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              error={formErrors.contact_phone}
              placeholder="+1 (555) 019-2834"
              icon={Phone}
            />

            <div className="flex flex-col w-full relative">
              <label className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300 flex items-center">
                Account Number
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="customer_account_number"
                    value={formData.customer_account_number}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.customer_account_number ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    }`}
                    placeholder="Leave blank to auto-generate"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAccount}
                  className="flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer"
                  title="Generate Account ID"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              {formErrors.customer_account_number && (
                <span className="text-red-500 text-[10px] mt-0.5 font-medium">
                  {formErrors.customer_account_number}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Billing Address */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
            2. Billing Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <InputField
                label="Street Address"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="123 Financial Blvd, Suite 400"
                icon={MapPin}
              />
            </div>
            
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="San Francisco"
            />

            <InputField
              label="State / Province"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="CA"
            />

            <InputField
              label="Postal / ZIP Code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              placeholder="94107"
            />

            <div className="md:col-span-3">
              <InputField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="United States"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: CRM Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
            3. CRM & Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Default Payment Terms"
              name="payment_terms_default"
              value={formData.payment_terms_default}
              onChange={handleInputChange}
              options={paymentTermsOptions}
            />

            <InputField
              label="Billing Currency (ISO Code)"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              required
              error={formErrors.currency}
              placeholder="USD"
              maxLength={3}
              icon={DollarSign}
            />
          </div>
        </div>

        {/* SECTION 4: Enterprise Details (B2B Only) */}
        {customerType === 'B2B' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              4. Enterprise Business Fields (Required for B2B)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Tax / Registration ID"
                name="tax_registration_number"
                value={formData.tax_registration_number}
                onChange={handleInputChange}
                required={customerType === 'B2B'}
                error={formErrors.tax_registration_number}
                placeholder="e.g. EU123456789 or GSTIN-987"
                icon={FileText}
              />

              <InputField
                label="PO Reference Code"
                name="po_reference"
                value={formData.po_reference}
                onChange={handleInputChange}
                error={formErrors.po_reference}
                placeholder="e.g. PO-874-902"
                icon={CreditCard}
              />
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {submitError && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-300 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div>
              <span className="font-semibold">Failed to save customer.</span>
              <p className="mt-1 text-xs opacity-90">{submitError}</p>
            </div>
          </div>
        )}

        {submitSuccess && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-xl text-green-700 dark:text-green-300 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0 text-green-500" />
            <div>
              <span className="font-semibold">Customer registered successfully!</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-lg font-semibold text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Registering...
              </span>
            ) : (
              'Save Customer'
            )}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
