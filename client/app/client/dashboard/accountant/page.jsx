'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { WorkflowInfo } from '@/components/WorkflowInfo';
import { Toast } from '@/components/Toast';
import { getWorkflowRequests, createRequest, updateRequestStatus, saveWorkflowRequests } from '@/lib/workflow';
import { getCurrentUser } from '@/lib/auth';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Plus, Send, CreditCard, Percent, FileText, CheckCircle, 
  HelpCircle, Settings, ClipboardList, Database, Landmark 
} from 'lucide-react';

export default function AccountantDashboard() {
  const [isDark, setIsDark] = useState(false);
  const [viewedWorkflow, setViewedWorkflow] = useState(false);
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState(null);

  // New Draft Request form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDept, setFormDept] = useState('IT');
  const [formGstRate, setFormGstRate] = useState(18);
  const [formVendor, setFormVendor] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Tab state: 'drafts' | 'approved' | 'paid'
  const [activeTab, setActiveTab] = useState('drafts');

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('seen_workflow_accountant');
    if (hasSeen === 'true') {
      setViewedWorkflow(true);
    }
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setRequests(getWorkflowRequests());
  }, []);

  const handleCreateDraft = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formTitle.trim()) errors.title = 'Title is required.';
    if (!formAmount || isNaN(formAmount) || parseFloat(formAmount) <= 0) errors.amount = 'Enter a valid base amount.';
    if (!formVendor.trim()) errors.vendor = 'Vendor name is required.';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const base = parseFloat(formAmount);
    const rate = parseInt(formGstRate);
    const gstAmt = Math.round(base * (rate / 100));
    const totalAmt = base + gstAmt;

    const newRequest = createRequest({
      title: formTitle,
      amount: base,
      department: formDept,
      gstRate: rate,
      gstAmount: gstAmt,
      total: totalAmt,
      vendorName: formVendor,
      accountantName: user?.name || 'Accountant',
      notes: formNotes
    });

    setRequests(getWorkflowRequests());
    setShowCreateModal(false);
    
    // Clear form
    setFormTitle('');
    setFormAmount('');
    setFormDept('IT');
    setFormGstRate(18);
    setFormVendor('');
    setFormNotes('');
    setFormErrors({});

    setToast({ type: 'success', message: `Draft request ${newRequest.id} created successfully.` });
  };

  const handleSendForApproval = (id) => {
    const res = updateRequestStatus(id, 'pending_manager');
    if (res.success) {
      setToast({ type: 'success', message: 'Draft submitted for Manager approval.' });
      setRequests(getWorkflowRequests());
    } else {
      setToast({ type: 'error', message: res.error });
    }
  };

  const handleProcessPayment = (id) => {
    const res = updateRequestStatus(id, 'paid');
    if (res.success) {
      setToast({ type: 'success', message: 'Payment processed successfully. Request status set to Paid.' });
      setRequests(getWorkflowRequests());
    } else {
      setToast({ type: 'error', message: res.error });
    }
  };

  const handleLogItc = (id) => {
    const allReqs = getWorkflowRequests();
    const idx = allReqs.findIndex(r => r.id === id);
    if (idx !== -1) {
      allReqs[idx].itcLogged = true;
      saveWorkflowRequests(allReqs);
      setToast({ type: 'success', message: 'Input Tax Credit logged in corporate tax records.' });
      setRequests(getWorkflowRequests());
    }
  };

  // Derive stats & lists
  const drafts = requests.filter(r => r.status === 'draft' || r.status === 'back_to_draft');
  const approved = requests.filter(r => r.status === 'approved');
  const paidRequests = requests.filter(r => r.status === 'paid');

  // GST calculations
  const OUTPUT_GST_BASELINE = 45000;
  const inputGstItc = paidRequests
    .filter(r => r.itcLogged)
    .reduce((sum, r) => sum + r.gstAmount, 0);
  const netGstPayable = Math.max(OUTPUT_GST_BASELINE - inputGstItc, 0);

  if (!viewedWorkflow) {
    return (
      <WorkflowInfo 
        isDark={isDark} 
        onProceed={() => {
          setViewedWorkflow(true);
          sessionStorage.setItem('seen_workflow_accountant', 'true');
        }} 
      />
    );
  }

  return (
    <ProtectedRoute role="accountant">
      <div className={`${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-300`}>
        <Navbar 
          user="client" 
          role="accountant"
          onThemeToggle={() => setIsDark(!isDark)}
          isDark={isDark}
        />

        <div className="flex">
          <Sidebar role="accountant" isDark={isDark} />

          <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Header profile card */}
              <div className={`mb-8 p-6 rounded-3xl border shadow-xl backdrop-blur-xl bg-gradient-to-br ${
                isDark ? 'from-slate-900/80 via-slate-900/60 to-cyan-950/20 border-white/10' : 'from-white/90 via-white/80 to-cyan-50/30 border-white/60'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-500 font-mono">Corporate Accounting Division</span>
                    <h1 className="text-3xl font-extrabold tracking-tight mt-1">
                      Welcome, {user?.name || 'Accountant'}
                    </h1>
                    <p className={`text-sm mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Generate operational expense drafts, process vendor payments, and optimize Input Tax Credit logs.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-cyan-500/10 hover:scale-[1.03] active:scale-95 transition cursor-pointer"
                    >
                      <Plus className="h-4.5 w-4.5" />
                      Create Request Draft
                    </button>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-2xl border text-sm ${
                      isDark ? 'bg-slate-950/50 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <span className="text-xs block text-slate-500 font-semibold uppercase tracking-wider">Employee ID</span>
                        <span className="font-semibold text-xs sm:text-sm">{user?.employeeId || 'N/A'}</span>
                      </div>
                      <div className="w-[1px] h-6 bg-slate-700/30" />
                      <div>
                        <span className="text-xs block text-slate-500 font-semibold uppercase tracking-wider">Department</span>
                        <span className="font-semibold text-xs sm:text-sm">{user?.department || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Drafts & Pending"
                  value={drafts.length}
                  isCurrency={false}
                  color="cyan"
                  icon={ClipboardList}
                />
                <StatCard
                  title="Approved for Payment"
                  value={approved.length}
                  isCurrency={false}
                  color="purple"
                  icon={Landmark}
                />
                <StatCard
                  title="Input GST (ITC)"
                  value={inputGstItc}
                  isCurrency={true}
                  color="green"
                  icon={Database}
                />
                <StatCard
                  title="Net GST Payable"
                  value={netGstPayable}
                  isCurrency={true}
                  color="orange"
                  icon={Percent}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Work queues */}
                <div className={`lg:col-span-2 rounded-3xl border shadow-xl p-6 flex flex-col justify-between ${
                  isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <div>
                    {/* Navigation tabs inside Accountant dashboard */}
                    <div className="flex border-b border-slate-800/30 pb-4 mb-6 gap-6 text-sm font-semibold tracking-wide">
                      <button
                        onClick={() => setActiveTab('drafts')}
                        className={`pb-2 border-b-2 transition-all cursor-pointer ${
                          activeTab === 'drafts' 
                            ? 'border-cyan-500 text-cyan-400' 
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Drafts & Rejections ({drafts.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('approved')}
                        className={`pb-2 border-b-2 transition-all cursor-pointer ${
                          activeTab === 'approved' 
                            ? 'border-purple-500 text-purple-400' 
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Vendor Payments ({approved.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('paid')}
                        className={`pb-2 border-b-2 transition-all cursor-pointer ${
                          activeTab === 'paid' 
                            ? 'border-emerald-500 text-emerald-400' 
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Log Input Tax Credit ({paidRequests.length})
                      </button>
                    </div>

                    {/* Tab contents */}
                    {activeTab === 'drafts' && (
                      <div className="space-y-4">
                        {drafts.length > 0 ? (
                          drafts.map((req) => (
                            <div key={req.id} className={`rounded-2xl border p-5 ${
                              isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <div className="flex justify-between items-start gap-4 mb-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-semibold text-cyan-400">{req.id}</span>
                                    {req.status === 'back_to_draft' && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/20">
                                        Rejected
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-base font-bold mt-1 text-slate-200">{req.title}</h4>
                                  <p className="text-xs text-slate-400">Vendor: {req.vendorName} • Dept: {req.department}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-base font-extrabold text-slate-100">{formatCurrency(req.total)}</span>
                                  <span className="text-xs block text-slate-500">GST: {formatCurrency(req.gstAmount)} ({req.gstRate}%)</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-4 border-t border-slate-800/30 pt-3">
                                <span className="text-xs text-slate-500 italic">Created {formatDate(req.createdAt)}</span>
                                <button
                                  onClick={() => handleSendForApproval(req.id)}
                                  className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow hover:scale-105 active:scale-95 transition cursor-pointer"
                                >
                                  <Send className="h-3 w-3" />
                                  Submit for Approval
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 text-slate-500">
                            <p className="text-sm font-semibold">No drafts or rejected requests.</p>
                            <p className="text-xs mt-1">Click &quot;Create Request Draft&quot; to start a new expense.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'approved' && (
                      <div className="space-y-4">
                        {approved.length > 0 ? (
                          approved.map((req) => (
                            <div key={req.id} className={`rounded-2xl border p-5 ${
                              isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <div className="flex justify-between items-start gap-4 mb-3">
                                <div>
                                  <span className="text-xs font-mono font-semibold text-purple-400">{req.id}</span>
                                  <h4 className="text-base font-bold mt-1 text-slate-200">{req.title}</h4>
                                  <p className="text-xs text-slate-400">Vendor: {req.vendorName} • Dept: {req.department}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-base font-extrabold text-purple-400">{formatCurrency(req.total)}</span>
                                  <span className="text-xs block text-slate-500">Tax: {formatCurrency(req.gstAmount)}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-4 border-t border-slate-800/30 pt-3">
                                <span className="text-xs text-slate-500 italic">Approved by HR compliance audit</span>
                                <button
                                  onClick={() => handleProcessPayment(req.id)}
                                  className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow hover:scale-105 active:scale-95 transition cursor-pointer"
                                >
                                  <CreditCard className="h-3.5 w-3.5" />
                                  Process Vendor Payment
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 text-slate-500">
                            <p className="text-sm font-semibold">No approved requests waiting for payment.</p>
                            <p className="text-xs mt-1">Once HR releases requests, they will arrive here.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'paid' && (
                      <div className="space-y-4">
                        {paidRequests.length > 0 ? (
                          paidRequests.map((req) => (
                            <div key={req.id} className={`rounded-2xl border p-5 ${
                              isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <div className="flex justify-between items-start gap-4 mb-3">
                                <div>
                                  <span className="text-xs font-mono font-semibold text-emerald-400">{req.id}</span>
                                  <h4 className="text-base font-bold mt-1 text-slate-200">{req.title}</h4>
                                  <p className="text-xs text-slate-400">Vendor: {req.vendorName} • Dept: {req.department}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-base font-extrabold text-slate-100">{formatCurrency(req.total)}</span>
                                  <span className="text-xs block text-slate-500">GST: {formatCurrency(req.gstAmount)} ({req.gstRate}%)</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-4 border-t border-slate-800/30 pt-3">
                                <span className={`text-xs font-semibold ${req.itcLogged ? 'text-emerald-400' : 'text-amber-400'}`}>
                                  {req.itcLogged ? '✓ Input Tax Credit Logged' : '⚠ ITC Awaiting Registration'}
                                </span>
                                {!req.itcLogged && (
                                  <button
                                    onClick={() => handleLogItc(req.id)}
                                    className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow hover:scale-105 active:scale-95 transition cursor-pointer"
                                  >
                                    <Database className="h-3.5 w-3.5" />
                                    Log Input Tax Credit
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 text-slate-500">
                            <p className="text-sm font-semibold">No paid requests yet.</p>
                            <p className="text-xs mt-1">Processed vendor bills will appear here to claim ITC tax offsets.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: GST summary panels */}
                <div className="space-y-6">
                  
                  {/* GST Ledger Card */}
                  <div className={`rounded-3xl border shadow-xl p-6 ${
                    isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className="text-lg font-bold tracking-wide mb-6">
                      GST Reconciliation Summary
                    </h3>
                    
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          <span>Output GST (Liability)</span>
                          <span className="text-slate-300 font-mono">{formatCurrency(OUTPUT_GST_BASELINE)}</span>
                        </div>
                        <p className="text-xs text-slate-500">Fixed static baseline representing client output sales tax liabilities.</p>
                      </div>

                      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          <span>Input GST (Credit Claimed)</span>
                          <span className="text-emerald-400 font-mono font-extrabold">{formatCurrency(inputGstItc)}</span>
                        </div>
                        <p className="text-xs text-slate-500">Accumulated claimable offsets logged from paid vendor invoices.</p>
                      </div>

                      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          <span>Net GST Payable</span>
                          <span className="text-orange-400 font-mono font-extrabold">{formatCurrency(netGstPayable)}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-3">
                          <div 
                            className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-full transition-all"
                            style={{ width: `${Math.max(100 - Math.round((inputGstItc / OUTPUT_GST_BASELINE) * 100), 0)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Tax Credit Ledger logs */}
                  <div className={`rounded-3xl border shadow-xl p-6 ${
                    isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className="text-lg font-bold tracking-wide mb-4">
                      Input Tax Credit Ledger
                    </h3>
                    
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {paidRequests.filter(r => r.itcLogged).length > 0 ? (
                        paidRequests.filter(r => r.itcLogged).map((req) => (
                          <div key={req.id} className="flex justify-between items-center text-xs pb-2.5 border-b border-slate-800/30">
                            <div>
                              <p className="font-semibold text-slate-300 truncate max-w-[150px]">{req.title}</p>
                              <p className="text-slate-500">{req.vendorName}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-emerald-400 block">+{formatCurrency(req.gstAmount)}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{req.id}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-center py-6 text-xs">No Input Tax Credit records logged yet.</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </main>
        </div>

        {/* Create Request Draft Drawer/Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-xl rounded-3xl border p-6 shadow-2xl relative ${
              isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold tracking-tight mb-2">Create Request Draft</h2>
              <p className="text-xs text-slate-500 mb-6">Initialize a purchase draft item. Standard validation audits apply prior to release.</p>

              <form onSubmit={handleCreateDraft} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Request Title</label>
                  <input 
                    type="text" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Office Laptops Purchase"
                    className={`w-full text-sm rounded-xl border px-3 py-2.5 outline-none transition ${
                      isDark ? 'bg-slate-950 border-white/10 focus:border-cyan-500' : 'bg-slate-50 border-slate-200 focus:border-cyan-500'
                    }`}
                  />
                  {formErrors.title && <p className="text-xs text-rose-500 mt-1">{formErrors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Base Amount (₹)</label>
                    <input 
                      type="number" 
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      placeholder="85000"
                      className={`w-full text-sm rounded-xl border px-3 py-2.5 outline-none transition ${
                        isDark ? 'bg-slate-950 border-white/10 focus:border-cyan-500' : 'bg-slate-50 border-slate-200 focus:border-cyan-500'
                      }`}
                    />
                    {formErrors.amount && <p className="text-xs text-rose-500 mt-1">{formErrors.amount}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Department</label>
                    <select
                      value={formDept}
                      onChange={(e) => setFormDept(e.target.value)}
                      className={`w-full text-sm rounded-xl border px-3 py-2.5 outline-none transition ${
                        isDark ? 'bg-slate-950 border-white/10 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-500'
                      }`}
                    >
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Admin">Admin</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">GST Rate (%)</label>
                    <select
                      value={formGstRate}
                      onChange={(e) => setFormGstRate(parseInt(e.target.value))}
                      className={`w-full text-sm rounded-xl border px-3 py-2.5 outline-none transition ${
                        isDark ? 'bg-slate-950 border-white/10 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-500'
                      }`}
                    >
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Vendor Name</label>
                    <input 
                      type="text" 
                      value={formVendor}
                      onChange={(e) => setFormVendor(e.target.value)}
                      placeholder="Acme Corp Solutions"
                      className={`w-full text-sm rounded-xl border px-3 py-2.5 outline-none transition ${
                        isDark ? 'bg-slate-950 border-white/10 focus:border-cyan-500' : 'bg-slate-50 border-slate-200 focus:border-cyan-500'
                      }`}
                    />
                    {formErrors.vendor && <p className="text-xs text-rose-500 mt-1">{formErrors.vendor}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Internal Notes</label>
                  <textarea 
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Detail the operational requirement context..."
                    rows={2}
                    className={`w-full text-sm rounded-xl border px-3 py-2 outline-none transition ${
                      isDark ? 'bg-slate-950 border-white/10 focus:border-cyan-500' : 'bg-slate-50 border-slate-200 focus:border-cyan-500'
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800/20 active:scale-95 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    Save Draft Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toast ? <Toast message={toast.message} type={toast.type} duration={2000} onClose={() => setToast(null)} /> : null}
      </div>
    </ProtectedRoute>
  );
}
