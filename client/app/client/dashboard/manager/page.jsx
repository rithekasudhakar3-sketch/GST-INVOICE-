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
import { Check, X, AlertCircle, TrendingUp, DollarSign, Users, Award } from 'lucide-react';

export default function ManagerDashboard() {
  const [isDark, setIsDark] = useState(false);
  const [viewedWorkflow, setViewedWorkflow] = useState(false);
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState(null);

  // Load theme and user context
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('seen_workflow_manager');
    if (hasSeen === 'true') {
      setViewedWorkflow(true);
    }
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setRequests(getWorkflowRequests());
  }, []);

  const handleAction = (id, action) => {
    const newStatus = action === 'approve' ? 'pending_hr' : 'back_to_draft';
    const res = updateRequestStatus(id, newStatus);
    if (res.success) {
      setToast({
        type: action === 'approve' ? 'success' : 'warning',
        message: action === 'approve' ? 'Request approved and sent to HR.' : 'Request rejected and returned to Draft status.'
      });
      setRequests(getWorkflowRequests());
    } else {
      setToast({ type: 'error', message: res.error });
    }
  };

  // Derive manager stats
  const pendingQueue = requests.filter(r => r.status === 'pending_manager');
  const allPendingRequests = requests.filter(r => ['pending_manager', 'pending_hr'].includes(r.status));
  
  // Budget summary
  const BUDGET_LIMIT = 1000000; // 10 Lakhs
  const usedBudget = requests
    .filter(r => ['approved', 'paid'].includes(r.status))
    .reduce((sum, r) => sum + r.total, 0);
  const availableBudget = BUDGET_LIMIT - usedBudget;

  const budgetUsagePercent = Math.min(Math.round((usedBudget / BUDGET_LIMIT) * 100), 100);

  if (!viewedWorkflow) {
    return (
      <WorkflowInfo 
        isDark={isDark} 
        onProceed={() => {
          setViewedWorkflow(true);
          sessionStorage.setItem('seen_workflow_manager', 'true');
        }} 
      />
    );
  }

  return (
    <ProtectedRoute role="manager">
      <div className={`${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-300`}>
        <Navbar 
          user="client" 
          role="manager"
          onThemeToggle={() => setIsDark(!isDark)}
          isDark={isDark}
        />

        <div className="flex">
          <Sidebar role="manager" isDark={isDark} />

          <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Profile Card / Header */}
              <div className={`mb-8 p-6 rounded-3xl border shadow-xl backdrop-blur-xl bg-gradient-to-br ${
                isDark ? 'from-slate-900/80 via-slate-900/60 to-purple-950/20 border-white/10' : 'from-white/90 via-white/80 to-purple-50/30 border-white/60'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-500">Corporate Manager Portal</span>
                    <h1 className="text-3xl font-extrabold tracking-tight mt-1">
                      Welcome, {user?.name || 'Manager'}
                    </h1>
                    <p className={`text-sm mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Oversee operational expenditures, review compliance parameters, and release budget approvals.
                    </p>
                  </div>
                  
                  {/* Meta Details */}
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

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Approval Queue"
                  value={pendingQueue.length}
                  isCurrency={false}
                  color="purple"
                  icon={AlertCircle}
                />
                <StatCard
                  title="Total Budget Limit"
                  value={BUDGET_LIMIT}
                  isCurrency={true}
                  color="blue"
                  icon={DollarSign}
                />
                <StatCard
                  title="Approved Budget"
                  value={usedBudget}
                  isCurrency={true}
                  color="green"
                  icon={TrendingUp}
                />
                <StatCard
                  title="Available Budget"
                  value={availableBudget}
                  isCurrency={true}
                  color="orange"
                  icon={Award}
                />
              </div>

              {/* Budget Progress and Request Queue */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Approval Queue Section */}
                <div className={`lg:col-span-2 rounded-3xl border shadow-xl p-6 ${
                  isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-lg font-bold tracking-wide mb-6">
                    Operational Approval Queue ({pendingQueue.length})
                  </h3>

                  {pendingQueue.length > 0 ? (
                    <div className="space-y-4">
                      {pendingQueue.map((req) => (
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
                                  isDark ? 'bg-purple-950/50 text-purple-400 border border-purple-800/30' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {req.id}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">{formatDate(req.createdAt)}</span>
                              </div>
                              <h4 className="text-base font-bold mt-1 text-slate-100">{req.title}</h4>
                              <p className="text-xs text-slate-400 mt-1">Creator: {req.accountantName} • Dept: {req.department}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-extrabold text-purple-400 block">{formatCurrency(req.total)}</span>
                              <span className="text-xs text-slate-500">Base: {formatCurrency(req.amount)} + GST ({req.gstRate}%)</span>
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
                              Reject
                            </button>
                            <button
                              onClick={() => handleAction(req.id, 'approve')}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Approve Request
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-3">
                        <Check className="h-6 w-6 text-emerald-400 animate-pulse" />
                      </div>
                      <p className="text-sm font-semibold">All requests cleared!</p>
                      <p className="text-xs text-slate-500 mt-1">There are no operational requests pending your review.</p>
                    </div>
                  )}
                </div>

                {/* Budget Summary Card */}
                <div className={`rounded-3xl border shadow-xl p-6 ${
                  isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-lg font-bold tracking-wide mb-6">
                    Departmental Budget Status
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-400">Budget Limit Usage</span>
                        <span>{budgetUsagePercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${budgetUsagePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-3">Workflow Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Pipeline:</span>
                          <span className="font-semibold">{requests.length} Requests</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pending Manager:</span>
                          <span className="font-semibold text-purple-400">{pendingQueue.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pending HR Audit:</span>
                          <span className="font-semibold text-pink-400">
                            {requests.filter(r => r.status === 'pending_hr').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Paid Invoices:</span>
                          <span className="font-semibold text-emerald-400">
                            {requests.filter(r => r.status === 'paid').length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 leading-relaxed">
                      💡 <strong>Budget Guidelines:</strong> Expenditure authorization is bound by corporate limit parameters. Large requests exceeding standard margins require multiple audits.
                    </div>
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
