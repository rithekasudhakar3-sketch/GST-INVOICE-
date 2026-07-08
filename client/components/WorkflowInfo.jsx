'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, ArrowRight, ArrowDown, Sparkles, 
  Briefcase, Percent, CreditCard, Database, UserCheck, Check
} from 'lucide-react';

export function WorkflowInfo({ onProceed, isDark }) {
  const [activeStep, setActiveStep] = useState(0);

  // Automatically cycle through the flowchart steps to create a dynamic animated flow
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 7);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const roles = [
    {
      title: 'Accountant',
      desc: 'Creates invoice or expense draft.',
      actions: ['Save Draft', 'Submit for Approval'],
      status: 'Pending Manager',
      color: 'from-blue-600/20 to-cyan-600/10 border-blue-500/30',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      glow: 'shadow-blue-500/10'
    },
    {
      title: 'Manager',
      desc: 'Reviews line items and departmental budget.',
      actions: ['Approve Request', 'Reject Request'],
      status: 'Pending HR',
      color: 'from-purple-600/20 to-pink-600/10 border-purple-500/30',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      glow: 'shadow-purple-500/10'
    },
    {
      title: 'HR',
      desc: 'Verifies payroll request & employee compliance.',
      actions: ['Final Compliance Review', 'Approve & Release'],
      status: 'Approved',
      color: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/30',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      glow: 'shadow-emerald-500/10'
    }
  ];

  const flowchartSteps = [
    { label: 'Employee / HR Request', icon: Briefcase, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Manager Approval', icon: UserCheck, color: 'text-purple-400 bg-purple-500/10' },
    { label: 'HR Approval', icon: CheckCircle, color: 'text-pink-400 bg-pink-500/10' },
    { label: 'Accountant Processing', icon: FileText, color: 'text-cyan-400 bg-cyan-500/10' },
    { label: 'GST Compliance', icon: Percent, color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Vendor Payment', icon: CreditCard, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Input Tax Credit Logged', icon: Database, color: 'text-indigo-400 bg-indigo-500/10' }
  ];

  return (
    <div className={`w-full min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-semibold text-fuchsia-400 tracking-wide uppercase mb-3 animate-pulse">
            <Sparkles className="h-3 w-3" /> System Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400">
            Role-Based Approval Workflow
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-slate-400">
            Understanding the structural compliance flow from initial draft requests to GST log updates.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {roles.map((r, i) => (
            <div 
              key={i} 
              className={`rounded-3xl border bg-gradient-to-b p-6 backdrop-blur-xl shadow-xl hover:scale-[1.02] transition-all duration-300 ${r.color} ${r.glow} flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold tracking-wide">{r.title}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${r.badgeColor}`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {r.desc}
                </p>
              </div>

              <div>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Key Permissions</p>
                  <ul className="space-y-1.5">
                    {r.actions.map((act, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Flowchart Section */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-10">
          <h2 className="text-lg font-semibold tracking-wider text-slate-300 mb-6 text-center uppercase">
            Internal Pipeline Flowchart
          </h2>

          {/* Desktop Flowchart (horizontal layout) */}
          <div className="hidden lg:flex items-center justify-between gap-1 overflow-x-auto py-4">
            {flowchartSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              return (
                <div key={index} className="flex items-center flex-1">
                  <div className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-500 w-full min-h-[140px] text-center justify-center ${
                    isActive 
                      ? 'bg-slate-800/80 border-fuchsia-500/50 shadow-lg shadow-fuchsia-500/5 scale-105' 
                      : 'bg-slate-900/20 border-white/5 opacity-60'
                  }`}>
                    <div className={`p-3 rounded-xl mb-2 transition-transform duration-500 ${step.color} ${isActive ? 'scale-110 rotate-3' : ''}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold tracking-tight">{step.label}</span>
                  </div>
                  {index < flowchartSteps.length - 1 && (
                    <div className="mx-2 text-slate-600 flex items-center">
                      <ArrowRight className={`h-5 w-5 ${isActive ? 'text-fuchsia-500 animate-ping' : 'opacity-40'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Flowchart (vertical layout) */}
          <div className="lg:hidden flex flex-col gap-2">
            {flowchartSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              return (
                <div key={index} className="flex flex-col items-center w-full">
                  <div className={`flex items-center gap-4 p-4 rounded-xl border w-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-slate-800 border-fuchsia-500/50 shadow-md scale-[1.01]' 
                      : 'bg-slate-950/20 border-white/5 opacity-75'
                  }`}>
                    <div className={`p-2.5 rounded-lg ${step.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold">{step.label}</span>
                  </div>
                  {index < flowchartSteps.length - 1 && (
                    <div className="my-1.5 text-slate-600">
                      <ArrowDown className={`h-4 w-4 ${isActive ? 'text-fuchsia-500 animate-bounce' : 'opacity-40'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={onProceed}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-8 py-4 font-bold text-white shadow-xl shadow-fuchsia-500/10 hover:scale-[1.02] active:scale-[0.98] transition duration-200 cursor-pointer"
          >
            <span>Proceed to Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
