'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Save, Sparkles, AlertTriangle, Info, Copy, Check,
  Upload, ImagePlus, X 
} from 'lucide-react';

import { Navbar } from '../../../../components/Navbar';
import { Sidebar } from '../../../../components/Sidebar';
import { InputField } from '../../../../components/InputField';
import { SelectField } from '../../../../components/SelectField';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { SecondaryButton } from '../../../../components/SecondaryButton';
import { Toast } from '../../../../components/Toast';
import { Modal } from '../../../../components/Modal';

export default function AddProductPage() {
  const [isDark, setIsDark] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Data Payload Modal
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);
  const [payloadData, setPayloadData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Upload State
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    typeOfSupply: 'Goods', // Goods | Services
    hsnSac: '',
    uom: 'PCS-PIECES',
    gstSlab: 18, // GST rate (e.g. 0, 0.25, 3, 5, 18, 40)
    pricingMode: 'exclusive', // exclusive | inclusive
    unitPrice: ''
  });

  // Validation Errors state
  const [errors, setErrors] = useState({});

  // Trigger inline smart hints based on inputs
  const [showApparelHint, setShowApparelHint] = useState(false);
  const [showLuxuryBadge, setShowLuxuryBadge] = useState(false);

  // Run validation and calculations dynamically as the user types
  const priceVal = parseFloat(formData.unitPrice) || 0;
  const rateVal = parseFloat(formData.gstSlab) || 0;
  const isExclusive = formData.pricingMode === 'exclusive';

  // Math engine
  let taxableValue = 0;
  let gstAmount = 0;
  let finalMrp = 0;

  if (isExclusive) {
    taxableValue = priceVal;
    gstAmount = priceVal * (rateVal / 100);
    finalMrp = priceVal + gstAmount;
  } else {
    finalMrp = priceVal;
    taxableValue = priceVal / (1 + (rateVal / 100));
    gstAmount = priceVal - taxableValue;
  }

  // Round values to 2 decimals for display
  const roundedTaxable = Number(taxableValue.toFixed(2));
  const roundedGst = Number(gstAmount.toFixed(2));
  const roundedMrp = Number(finalMrp.toFixed(2));

  // Compute splits for the Live Invoicing preview card
  const cgstSplit = Number((roundedGst / 2).toFixed(2));
  const sgstSplit = Number((roundedGst / 2).toFixed(2));
  const igstSplit = roundedGst;

  // Watch inputs for hints
  useEffect(() => {
    // 1. Apparel Hint: Check name string for apparel words and price > 2500
    const nameLower = formData.name.toLowerCase();
    const hasApparelKeyword = ['apparel', 'jacket', 'dress', 'shirt', 'clothing', 'suit'].some(word => nameLower.includes(word));
    if (hasApparelKeyword && roundedMrp > 2500) {
      setShowApparelHint(true);
    } else {
      setShowApparelHint(false);
    }

    // 2. Luxury Badge: pick the 40% slab
    if (Number(formData.gstSlab) === 40) {
      setShowLuxuryBadge(true);
    } else {
      setShowLuxuryBadge(false);
    }
  }, [formData.name, formData.gstSlab, roundedMrp]);

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    // Clear validation error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // Image Upload Handlers
  const handleImageSelect = (file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      showToast('error', 'Invalid file type. Use JPG, PNG, WebP, or SVG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'File exceeds 5 MB limit.');
      return;
    }
    setProductImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    if (errors.image) setErrors(prev => ({ ...prev, image: null }));
  };

  const handleRemoveImage = () => {
    setProductImage(null);
    setImagePreview(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // Form Validation & FormData Submission
  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Item/Product Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Minimum 3 characters required';
    }

    // 2. HSN / SAC validation — allow 4, 6, or 8 digit HSN; exactly 6 digit SAC
    const hsnRegex = /^[0-9]+$/;
    if (!formData.hsnSac) {
      newErrors.hsnSac = `${formData.typeOfSupply === 'Goods' ? 'HSN' : 'SAC'} Code is required`;
    } else if (!hsnRegex.test(formData.hsnSac)) {
      newErrors.hsnSac = 'Code must be numeric digits only';
    } else {
      const len = formData.hsnSac.length;
      if (formData.typeOfSupply === 'Goods') {
        if (![4, 6, 8].includes(len)) {
          newErrors.hsnSac = 'HSN Code must be exactly 4, 6, or 8 digits';
        }
      } else {
        if (len !== 6) {
          newErrors.hsnSac = 'SAC Code must be exactly 6 digits';
        }
      }
    }

    // 3. Price validation
    if (!formData.unitPrice) {
      newErrors.unitPrice = 'Unit Price is required';
    } else if (parseFloat(formData.unitPrice) < 0) {
      newErrors.unitPrice = 'Price cannot be negative';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('error', 'Please correct the validation errors before saving.');
      return;
    }

    // Build FormData for multipart/form-data submission
    const generatedSku = formData.sku.trim() || `SKU-${Math.floor(100000 + Math.random() * 900000)}`;

    const multipartForm = new FormData();
    multipartForm.append('name', formData.name.trim());
    multipartForm.append('sku', generatedSku);
    multipartForm.append('type_of_supply', formData.typeOfSupply);
    multipartForm.append('hsn_sac_code', formData.hsnSac);
    multipartForm.append('uom', formData.uom);
    multipartForm.append('gst_rate', String(parseFloat(formData.gstSlab)));
    multipartForm.append('pricing_mode', formData.pricingMode);
    multipartForm.append('base_price', String(roundedTaxable));
    if (productImage) {
      multipartForm.append('product_image', productImage);
    }

    // Build JSON preview payload for the modal
    const finalPayload = {
      name: formData.name.trim(),
      sku: generatedSku,
      type_of_supply: formData.typeOfSupply,
      hsn_sac_code: formData.hsnSac,
      uom: formData.uom,
      gst_rate_percentage: parseFloat(formData.gstSlab),
      pricing_mode: formData.pricingMode,
      base_taxable_value: roundedTaxable,
      gst_amount: roundedGst,
      final_mrp: roundedMrp,
      product_image: productImage ? productImage.name : null
    };

    setIsSubmitting(true);

    try {
      // Simulate multipart POST (no backend available)
      // In production, replace with: await axios.post('/api/products', multipartForm, { headers: { 'Content-Type': 'multipart/form-data' } });
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('FormData entries:');
      for (const [key, value] of multipartForm.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `[File] ${value.name} (${(value.size / 1024).toFixed(1)} KB)` : value);
      }

      setPayloadData(finalPayload);
      setIsPayloadModalOpen(true);
      showToast('success', 'Product validated & FormData prepared for submission!');
    } catch (err) {
      console.error('Submission failed:', err.message);
      showToast('error', `Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
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
        <Sidebar role="seller" isDark={isDark} />

        <main className="flex-1 lg:ml-64 pt-16 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
          {/* Header Row */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Link 
                href="/seller/products"
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Add New Product</h1>
                <p className="text-xs text-gray-500">Register new catalog item with GST 2.0 compliance</p>
              </div>
            </div>

            {showLuxuryBadge && (
              <span className="bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Luxury / Sin Tax Slab Applied
              </span>
            )}
          </div>

          {/* Form Content Split Layout */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left: Input Form Panel */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 md:border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40">
              
              {/* SECTION A: BASIC INFORMATION */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                  Section A: Basic Product Info
                </h3>

                <InputField 
                  label="Product / Item Name"
                  required
                  placeholder="e.g. Premium Cotton Shirt, Lenovo ThinkPad L14"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField 
                    label="SKU / Item Code"
                    placeholder="Auto-generated if left blank"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                  />

                  {/* Supply Type Radio Toggle */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                      Type of Supply <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleInputChange('typeOfSupply', 'Goods');
                          handleInputChange('hsnSac', ''); // Reset code
                        }}
                        className={`flex-1 py-1.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer
                          ${formData.typeOfSupply === 'Goods'
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        Goods
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleInputChange('typeOfSupply', 'Services');
                          handleInputChange('hsnSac', ''); // Reset code
                        }}
                        className={`flex-1 py-1.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer
                          ${formData.typeOfSupply === 'Services'
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        Services
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Upload Dropzone */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Product Image
                  </label>
                  {!imagePreview ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                        ${isDragging
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                          : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                      <ImagePlus className={`w-8 h-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                      <p className="text-xs text-gray-500 text-center">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-[10px] text-gray-400">JPG, PNG, WebP, SVG — Max 5 MB</p>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        onChange={(e) => handleImageSelect(e.target.files?.[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div className="relative border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-36 object-contain bg-gray-50 dark:bg-gray-800 p-2"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg transition-colors"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="px-3 py-1.5 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <span className="text-[10px] text-gray-600 dark:text-gray-400 truncate max-w-[70%] font-mono">
                          {productImage?.name}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">
                          {productImage ? `${(productImage.size / 1024).toFixed(1)} KB` : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION B: STATUTORY & TAX CLASSIFICATION */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                  Section B: Statutory & Tax Classification
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputField 
                    label={formData.typeOfSupply === 'Goods' ? 'HSN Code' : 'SAC Code'}
                    required
                    placeholder={formData.typeOfSupply === 'Goods' ? '4, 6 or 8 digits' : '6 digits'}
                    value={formData.hsnSac}
                    onChange={(e) => handleInputChange('hsnSac', e.target.value.replace(/[^0-9]/g, ''))} // digit filter
                    error={errors.hsnSac}
                  />

                  <SelectField 
                    label="Unit of Measurement (UOM)"
                    options={[
                      { value: 'PCS-PIECES', label: 'PCS - PIECES' },
                      { value: 'KGS-KILOGRAMS', label: 'KGS - KILOGRAMS' },
                      { value: 'BOX-BOX', label: 'BOX - BOX' },
                      { value: 'NOS-NUMBERS', label: 'NOS - NUMBERS' },
                      { value: 'SET-SETS', label: 'SET - SETS' },
                      { value: 'HRS-HOURS', label: 'HRS - HOURS' }
                    ]}
                    value={formData.uom}
                    onChange={(e) => handleInputChange('uom', e.target.value)}
                  />

                  <SelectField 
                    label="GST Tax Slab (GST 2.0)"
                    options={[
                      { value: 0, label: '0% (Nil Rated / Exempt)' },
                      { value: 0.25, label: '0.25% (Uncut Gemstones)' },
                      { value: 3, label: '3% (Precious Metals)' },
                      { value: 5, label: '5% (Daily Essentials)' },
                      { value: 18, label: '18% (Standard Rate)' },
                      { value: 40, label: '40% (Luxury / Sin Goods)' }
                    ]}
                    value={formData.gstSlab}
                    onChange={(e) => handleInputChange('gstSlab', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              {/* SECTION C: PRICING CONTROLS */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                  Section C: Pricing Controls
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pricing Mode segment toggle */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                      Pricing Mode <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('pricingMode', 'exclusive')}
                        className={`flex-1 py-1.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer
                          ${formData.pricingMode === 'exclusive'
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        Tax Exclusive
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('pricingMode', 'inclusive')}
                        className={`flex-1 py-1.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer
                          ${formData.pricingMode === 'inclusive'
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        Tax Inclusive
                      </button>
                    </div>
                  </div>

                  <InputField 
                    label={isExclusive ? 'Base Price (Before Tax) (₹)' : 'Final Price (Inclusive of GST) (₹)'}
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.unitPrice}
                    onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                    error={errors.unitPrice}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-2">
                <Link href="/seller/products">
                  <SecondaryButton type="button">Cancel</SecondaryButton>
                </Link>
                <PrimaryButton type="submit" icon={isSubmitting ? undefined : Save} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Submitting...
                    </span>
                  ) : 'Save Product'}
                </PrimaryButton>
              </div>
            </form>

            {/* Right: Live Calculations Preview Card */}
            <div className="w-full md:w-5/12 bg-gray-50 dark:bg-gray-900/60 p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                {/* Header */}
                <div className="pb-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    GST 2.0 Live Calculator
                  </h3>
                  <p className="text-[10px] text-gray-500">View real-time taxable value and tax breakouts</p>
                </div>

                {/* Calculation Summary breakdown */}
                <div className="bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 rounded-xl p-4 space-y-3.5 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Pricing Model:</span>
                    <span className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded text-[10px]">
                      {formData.pricingMode}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Taxable Base Value:</span>
                      <span className="font-mono font-semibold">₹ {roundedTaxable.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">GST Rate Percentage:</span>
                      <span className="font-mono">{formData.gstSlab}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total GST Tax Amount:</span>
                      <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">₹ {roundedGst.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 dark:border-gray-800 pt-2.5 flex justify-between items-center">
                      <span className="font-bold text-gray-800 dark:text-gray-200">Final MRP Amount:</span>
                      <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                        ₹ {roundedMrp.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Invoicing split block */}
                <div className="bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 rounded-xl p-4 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block border-b border-gray-100 dark:border-gray-800 pb-1.5">
                    GST Split Analysis (Intra / Inter-State)
                  </span>

                  <div className="space-y-2.5 text-xs">
                    {/* Intra-State split */}
                    <div className="bg-gray-50 dark:bg-gray-850 p-2 rounded border border-gray-150 dark:border-gray-800/80">
                      <span className="text-[9px] font-bold text-teal-700 dark:text-teal-400 uppercase block mb-1">
                        Intra-State Sale (Same State)
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono leading-tight">
                        <div>CGST ({formData.gstSlab / 2}%): <span className="font-bold text-gray-800 dark:text-white">₹ {cgstSplit.toFixed(2)}</span></div>
                        <div>SGST ({formData.gstSlab / 2}%): <span className="font-bold text-gray-800 dark:text-white">₹ {sgstSplit.toFixed(2)}</span></div>
                      </div>
                    </div>

                    {/* Inter-State split */}
                    <div className="bg-gray-50 dark:bg-gray-850 p-2 rounded border border-gray-150 dark:border-gray-800/80">
                      <span className="text-[9px] font-bold text-indigo-700 dark:text-indigo-400 uppercase block mb-1">
                        Inter-State Sale (Outside State)
                      </span>
                      <div className="text-[10px] font-mono leading-tight">
                        IGST (Full {formData.gstSlab}%): <span className="font-bold text-gray-800 dark:text-white">₹ {igstSplit.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Hint trigger */}
              {showApparelHint && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed shadow-sm">
                  <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5" />
                  <p>
                    <strong>Note:</strong> Under GST 2.0, apparel priced above ₹2,500 falls strictly under the 18% slab. Please double-check your slab classification.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* JSON CONTRACT OUTPUT MODAL */}
      <Modal
        isOpen={isPayloadModalOpen}
        onClose={() => setIsPayloadModalOpen(false)}
        title="Save Product - Output Data Payload"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            FormData payload prepared for <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[11px] font-mono">multipart/form-data</code> submission. JSON preview below:
          </p>

          {payloadData?.product_image && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-2.5 text-xs text-green-800 dark:text-green-300">
              <Upload className="w-4 h-4 shrink-0" />
              <span>Image attached: <strong className="font-mono">{payloadData.product_image}</strong></span>
            </div>
          )}

          <div className="relative">
            <pre className="bg-gray-950 text-green-400 rounded-xl p-4 text-[10px] font-mono overflow-x-auto max-h-60 leading-tight">
              {JSON.stringify(payloadData, null, 2)}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(payloadData, null, 2));
                showToast('success', 'JSON payload copied to clipboard!');
              }}
              className="absolute top-2.5 right-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded p-1.5 transition-colors border border-gray-700"
              title="Copy JSON Payload"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton onClick={() => setIsPayloadModalOpen(false)}>Close</SecondaryButton>
            <PrimaryButton 
              onClick={() => {
                setIsPayloadModalOpen(false);
                showToast('success', 'Product saved successfully to database catalog!');
              }}
              icon={Check}
            >
              Confirm Save
            </PrimaryButton>
          </div>
        </div>
      </Modal>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
