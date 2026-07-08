'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { WorkflowInfo } from '@/components/WorkflowInfo';
import { Toast } from '@/components/Toast';
import { getWorkflowRequests, updateRequestStatus } from '@/lib/workflow';
import { getCurrentUser } from '@/lib/auth';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Check, X, ShieldAlert, Award, FileText, CheckCircle, ShieldCheck, Heart } from 'lucide-react';

export default function HRDashboard() {
  const [isDark, setIsDark] = useState(false);
  const [viewedWorkflow, setViewedWorkflow] = useState(false);
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState(null);

  // Load context
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('seen_workflow_hr');
    if (hasSeen === 'true') {
      setViewedWorkflow(true);
    }
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setRequests(getWorkflowRequests());
  }, []);

  const handleAction = (id, action) => {
    const newStatus = action === 'approve' ? 'approved' : 'back_to_draft';
    const res = updateRequestStatus(id, newStatus);
    if (res.success) {
      setToast({
        type: action === 'approve' ? 'success' : 'warning',
        message: action === 'approve' ? 'Compliance approved! Funds released for accountant payment.' : 'Request rejected and returned to draft.'
      });
      setRequests(getWorkflowRequests());
    } else {
      setToast({ type: 'error', message: res.error });
    }
  };

  // Derive HR Stats
  const complianceQueue = requests.filter(r => r.status === 'pending_hr');
  
  // Pending Payroll / HR Department requests
  const payrollQueue = complianceQueue.filter(r => 
    r.department.toLowerCase() === 'hr' || 
    r.title.toLowerCase().includes('payroll') ||
    r.title.toLowerCase().includes('salary') ||
    r.title.toLowerCase().includes('training')
  );

  const completedAudits = requests.filter(r => ['approved', 'paid'].includes(r.status));

  if (!viewedWorkflow) {
    return (
      <WorkflowInfo 
        isDark={isDark} 
        onProceed={() => {
          setViewedWorkflow(true);
          sessionStorage.setItem('seen_workflow_hr', 'true');
        }} 
      />
    );
  }

  return (
    <ProtectedRoute role="hr">
      <div className={`${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-300`}>
        <Navbar 
          user="client" 
          role="hr"
          onThemeToggle={() => setIsDark(!isDark)}
          isDark={isDark}
        />

        <div className="flex">
          <Sidebar role="hr" isDark={isDark} />

          <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Header Profile Panel */}
              <div className={`mb-8 p-6 rounded-3xl border shadow-xl backdrop-blur-xl bg-gradient-to-br ${
                isDark ? 'from-slate-900/80 via-slate-900/60 to-pink-950/20 border-white/10' : 'from-white/90 via-white/80 to-pink-50/30 border-white/60'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-pink-500">Corporate HR & Compliance Portal</span>
                    <h1 className="text-3xl font-extrabold tracking-tight mt-1">
                      Welcome, {user?.name || 'HR Executive'}
                    </h1>
                    <p className={`text-sm mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Audit payroll expenses, enforce company expenditure guidelines, and execute final compliance sign-off.
                    </p>
                  </div>
                  
                  {/* Meta ID & Dept */}
                  <div className={`flex flex-wrap items-center gap-3 p-3 rounded-2xl border text-sm ${
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

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Pending Compliance"
                  value={complianceQueue.length}
                  isCurrency={false}
                  color="pink"
                  icon={ShieldAlert}
                />
                <StatCard
                  title="Payroll Requests"
                  value={payrollQueue.length}
                  isCurrency={false}
                  color="blue"
                  icon={FileText}
                />
                <StatCard
                  title="Completed Audits"
                  value={completedAudits.length}
                  isCurrency={false}
                  color="green"
                  icon={CheckCircle}
                />
                <StatCard
                  title="Active Employees"
                  value={18}
                  isCurrency={false}
                  color="purple"
                  icon={Heart}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Queue Card */}
                <div className={`lg:col-span-2 rounded-3xl border shadow-xl p-6 ${
                  isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-lg font-bold tracking-wide mb-6">
                    Pending Compliance & Payroll Review Queue ({complianceQueue.length})
                  </h3>

                  {complianceQueue.length > 0 ? (
                    <div className="space-y-4">
                      {complianceQueue.map((req) => (
                        <div 
                          key={req.id} 
                          className={`rounded-2xl border p-5 transition-all hover:scale-[1.01] ${
                            isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold ${
                                  isDark ? 'bg-pink-950/50 text-pink-400 border border-pink-800/30' : 'bg-pink-100 text-pink-800'
                                }`}>
                                  {req.id}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">{formatDate(req.createdAt)}</span>
                              </div>
                              <h4 className="text-base font-bold mt-1 text-slate-100">{req.title}</h4>
                              <p className="text-xs text-slate-400 mt-1">Creator: {req.accountantName} • Dept: {req.department}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-extrabold text-pink-400 block">{formatCurrency(req.total)}</span>
                              <span className="text-xs text-slate-500">GST: {formatCurrency(req.gstAmount)} ({req.gstRate}%)</span>
                            </div>
                          </div>

                          {req.notes && (
                            <p className={`text-xs rounded-xl p-3 mb-4 italic ${
                              isDark ? 'bg-slate-900/60 text-slate-300' : 'bg-white text-slate-600'
                            }`}>
                              <strong>Notes:</strong> {req.notes}
                            </p>
                          )}

                          <div className="flex justify-end gap-3 border-t border-slate-800/30 pt-3">
                            <button
                              onClick={() => handleAction(req.id, 'reject')}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 active:scale-95 transition cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                              Reject & Return
                            </button>
                            <button
                              onClick={() => handleAction(req.id, 'approve')}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Approve & Release
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-3">
                        <Check className="h-6 w-6 text-pink-400 animate-pulse" />
                      </div>
                      <p className="text-sm font-semibold">Compliance queue empty!</p>
                      <p className="text-xs text-slate-500 mt-1">No requests are currently awaiting HR compliance sign-off.</p>
                    </div>
                  )}
                </div>

                {/* Tracked Employee Requests Panel */}
                <div className={`rounded-3xl border shadow-xl p-6 ${
                  isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-lg font-bold tracking-wide mb-6">
                    Tracked Employee Requests
                  </h3>
                  
                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    {requests.length > 0 ? (
                      requests.map((req) => (
                        <div key={req.id} className="flex justify-between items-center text-xs pb-3 border-b border-slate-800/30">
                          <div>
                            <p className="font-semibold text-slate-200 truncate max-w-[150px]">{req.title}</p>
                            <p className="text-slate-500">{req.department} • {req.id}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-300 block">{formatCurrency(req.total)}</span>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${
                              req.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400' :
                              req.status === 'approved' ? 'bg-blue-500/15 text-blue-400' :
                              req.status === 'pending_hr' ? 'bg-pink-500/15 text-pink-400' :
                              req.status === 'pending_manager' ? 'bg-purple-500/15 text-purple-400' :
                              'bg-slate-500/15 text-slate-400'
                            }`}>
                              {req.status === 'pending_manager' ? 'Pending Mgr' : 
                               req.status === 'pending_hr' ? 'Pending HR' : 
                               req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-center py-6 text-xs">No records available.</p>
                    )}
                  </div>

                  <div className="mt-6 border-t border-slate-800/30 pt-4 text-xs text-slate-500 leading-relaxed">
                    🚨 <strong>Audit Note:</strong> Any rejected items return to Accountant drafts. Approved items are forwarded to the Accountant to initiate final payment processing.
                  </div>
                </div>

              </div>

            </div>
          </main>
        </div>
        {toast ? <Toast message={toast.message} type={toast.type} duration={2000} onClose={() => setToast(null)} /> : null}
      </div>
    </ProtectedRoute>
  );
}
