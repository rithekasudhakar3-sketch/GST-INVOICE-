'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { loginSeller } from '@/lib/auth';
import { Toast } from '@/components/Toast';

export default function SellerLoginPage() {
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const validateForm = () => {
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email.';
    if (!password) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setToast(null);
    setTimeout(() => {
      const result = loginSeller(email, password);
      setLoading(false);
      
      if (result.success) {
        setToast({ type: 'success', message: 'Signed in successfully.' });
        setTimeout(() => {
          router.replace('/seller/dashboard');
        }, 800);
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
            <div className={`relative hidden overflow-hidden p-8 lg:flex lg:flex-col lg:justify-between ${isDark ? 'bg-gradient-to-br from-indigo-600/80 to-violet-600/70' : 'bg-gradient-to-br from-indigo-600 to-violet-500'}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_35%)]" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-sm font-medium text-white/90">
                  <Sparkles className="h-4 w-4" /> Premium Seller Workspace
                </div>
                <h1 className="max-w-md text-4xl font-semibold leading-tight text-white">Modern GST invoicing with secure seller access.</h1>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/80">Create invoices, manage customers, and monitor reports from a polished, secure portal.</p>
              </div>
              <div className="relative rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/90 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" /> Secure by design</div>
                <p className="mt-2">Protected routes, encrypted local session storage, and a fast onboarding experience.</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Seller Login</p>
                  <h2 className="mt-2 text-3xl font-semibold">Welcome back</h2>
                </div>
                <button onClick={() => setIsDark(!isDark)} className={`rounded-full px-3 py-2 text-sm ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
                  {isDark ? '☀️' : '🌙'}
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                  <label className="mb-2 block text-sm font-medium">Email address</label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-none bg-transparent outline-none" placeholder="you@company.com" type="email" />
                  </div>
                  {errors.email ? <p className="mt-2 text-sm text-rose-500">{errors.email}</p> : null}
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                  <label className="mb-2 block text-sm font-medium">Password</label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                    <Lock className="h-4 w-4 text-slate-400" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-none bg-transparent outline-none" placeholder="••••••••" type={showPassword ? 'text' : 'password'} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 transition hover:text-slate-700">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password ? <p className="mt-2 text-sm text-rose-500">{errors.password}</p> : null}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="rounded border-slate-300" />
                    Remember me
                  </label>
                  <a href="#" className="font-medium text-indigo-600">Forgot password?</a>
                </div>

                <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01] disabled:opacity-70">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {loading ? 'Signing in…' : 'Login'}
                </button>

                <button type="button" className="flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  Continue with Google
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                Don&apos;t have an account?{' '}
                <Link href="/seller/register" className="font-semibold text-indigo-600">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {toast ? <Toast message={toast.message} type={toast.type} duration={1400} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
