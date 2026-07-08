'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, Mail, User, ShieldCheck, Sparkles, Briefcase, Hash } from 'lucide-react';
import { registerClient } from '@/lib/auth';
import { Toast } from '@/components/Toast';

export default function ClientRegisterPage() {
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('Manager');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const validateForm = () => {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Full name is required.';
    if (!email.trim()) nextErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (!employeeId.trim()) nextErrors.employeeId = 'Employee ID is required.';
    if (!department.trim()) nextErrors.department = 'Department is required.';
    if (!password || password.length < 6) nextErrors.password = 'Password should be at least 6 characters.';
    if (password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setToast(null);
    setTimeout(() => {
      const result = registerClient(name, email, password, employeeId, department, role);
      setLoading(false);
      
      if (result.success) {
        setToast({ type: 'success', message: 'Registration Successful. Redirecting to login...' });
        setTimeout(() => {
          router.replace('/client/login');
        }, 1400);
      } else {
        setToast({ type: 'error', message: result.error });
      }
    }, 800);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDark ? 'from-slate-950 via-slate-900 to-indigo-950 text-white' : 'from-slate-50 via-white to-indigo-50 text-slate-900'}`}>
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className={`w-full max-w-5xl overflow-hidden rounded-[32px] border shadow-2xl backdrop-blur-xl ${isDark ? 'border-white/10 bg-slate-900/70' : 'border-white/70 bg-white/70'}`}>
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className={`relative hidden overflow-hidden p-8 lg:flex lg:flex-col lg:justify-between ${isDark ? 'bg-gradient-to-br from-fuchsia-600/80 to-purple-600/70' : 'bg-gradient-to-br from-fuchsia-600 to-purple-500'}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_35%)]" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-sm font-medium text-white/90">
                  <Sparkles className="h-4 w-4" /> Internal Portal Registration
                </div>
                <h1 className="max-w-md text-4xl font-semibold leading-tight text-white">Access the company workflow engine.</h1>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/80">Register as internal staff to create and approve invoices, compliance requests, and vendor bills.</p>
              </div>
              <div className="relative rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/90 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" /> Role-Based Access Control</div>
                <p className="mt-2">Secure access points tailored for Managers, HR Staff, and Accounting Professionals.</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-600">Staff Sign Up</p>
                  <h2 className="mt-2 text-3xl font-semibold">Register Account</h2>
                </div>
                <button onClick={() => setIsDark(!isDark)} className={`rounded-full px-3 py-2 text-sm ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
                  {isDark ? '☀️' : '🌙'}
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                    <label className="mb-1 block text-xs font-medium">Full Name</label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                      <User className="h-4 w-4 text-slate-400" />
                      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border-none bg-transparent outline-none text-sm" placeholder="Aarav Sharma" type="text" />
                    </div>
                    {errors.name ? <p className="mt-1 text-xs text-rose-500">{errors.name}</p> : null}
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                    <label className="mb-1 block text-xs font-medium">Email Address</label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-none bg-transparent outline-none text-sm" placeholder="you@company.com" type="email" />
                    </div>
                    {errors.email ? <p className="mt-1 text-xs text-rose-500">{errors.email}</p> : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                    <label className="mb-1 block text-xs font-medium">Employee ID</label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                      <Hash className="h-4 w-4 text-slate-400" />
                      <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="w-full border-none bg-transparent outline-none text-sm" placeholder="EMP-10023" type="text" />
                    </div>
                    {errors.employeeId ? <p className="mt-1 text-xs text-rose-500">{errors.employeeId}</p> : null}
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                    <label className="mb-1 block text-xs font-medium">Department</label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                      <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border-none bg-transparent outline-none text-sm" placeholder="Finance" type="text" />
                    </div>
                    {errors.department ? <p className="mt-1 text-xs text-rose-500">{errors.department}</p> : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                  <label className="mb-1 block text-xs font-medium">Role</label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border-none bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200">
                      <option value="Manager">Manager</option>
                      <option value="HR">HR</option>
                      <option value="Accountant">Accountant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                    <label className="mb-1 block text-xs font-medium">Password</label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                      <Lock className="h-4 w-4 text-slate-400" />
                      <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-none bg-transparent outline-none text-sm" placeholder="••••••••" type={showPassword ? 'text' : 'password'} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 transition hover:text-slate-700">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password ? <p className="mt-1 text-xs text-rose-500">{errors.password}</p> : null}
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                    <label className="mb-1 block text-xs font-medium">Confirm Password</label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                      <Lock className="h-4 w-4 text-slate-400" />
                      <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border-none bg-transparent outline-none text-sm" placeholder="••••••••" type={showConfirmPassword ? 'text' : 'password'} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-400 transition hover:text-slate-700">
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword ? <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword}</p> : null}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg shadow-fuchsia-200 transition hover:scale-[1.01] disabled:opacity-70 cursor-pointer">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {loading ? 'Creating account…' : 'Register'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                Already have an account?{' '}
                <Link href="/client/login" className="font-semibold text-fuchsia-600">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {toast ? <Toast message={toast.message} type={toast.type} duration={1400} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
