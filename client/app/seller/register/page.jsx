'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, Mail, User, ShieldCheck, Sparkles, AlertTriangle, X } from 'lucide-react';
import { registerSeller } from '@/lib/auth';
import { Toast } from '@/components/Toast';

export default function SellerRegisterPage() {
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [signupError, setSignupError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const validateForm = () => {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Name is required.';
    if (!email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email.';
    if (!password || password.length < 6) nextErrors.password = 'Password must be 6+ chars.';
    if (!companyName.trim()) nextErrors.companyName = 'Company name is required.';
    if (!gstin.trim()) nextErrors.gstin = 'GSTIN is required.';
    if (!phone.trim()) nextErrors.phone = 'Phone number is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setSignupError(null);
    if (!validateForm()) return;
    setLoading(true);
    setToast(null);
    
    try {
      const result = await registerSeller({
        name,
        email,
        password,
        companyName,
        gstin,
        phone,
        bankName,
        bankAccountNo,
        bankIfsc
      });
      setLoading(false);
      
      if (result.success) {
        setToast({ type: 'success', message: 'Account created successfully. Redirecting to login...' });
        setTimeout(() => {
          router.replace('/seller/login');
        }, 1400);
      } else {
        const errorObj = typeof result.error === 'object' ? result.error : { message: result.error || 'Registration failed' };
        setSignupError(errorObj);
        setToast({ type: 'error', message: errorObj.message || 'Registration failed' });
      }
    } catch (err) {
      setLoading(false);
      const errorObj = { message: err.message || 'An unexpected execution error occurred.' };
      setSignupError(errorObj);
      setToast({ type: 'error', message: errorObj.message });
    }
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
                  <Sparkles className="h-4 w-4" /> Create Seller Account
                </div>
                <h1 className="max-w-md text-4xl font-semibold leading-tight text-white">Start invoicing smarter in minutes.</h1>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/80">Set up your business workspace and access all seller modules instantly.</p>
              </div>
              <div className="relative rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/90 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" /> Quick onboarding</div>
                <p className="mt-2">A secure sign-up flow with route protection and smooth transitions for every new seller.</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Seller Sign Up</p>
                  <h2 className="mt-2 text-3xl font-semibold">Create account</h2>
                </div>
                <button onClick={() => setIsDark(!isDark)} className={`rounded-full px-3 py-2 text-sm ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'} cursor-pointer`}>
                  {isDark ? '☀️' : '🌙'}
                </button>
              </div>

              {/* Portal Switcher Tab Control */}
              <div className="mb-6">
                <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    I am a Seller
                  </span>
                  <Link
                    href="/client/register"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    I am a Client
                  </Link>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {signupError && (
                  <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-200 animate-in fade-in slide-in-from-top-2 duration-200">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-rose-900 dark:text-rose-100">Registration Failed</h3>
                      <p className="mt-1 text-xs font-medium">
                        {signupError.message || signupError.description || String(signupError)}
                      </p>
                      {signupError.details && (
                        <p className="mt-1.5 text-xs text-rose-700 dark:text-rose-300 font-mono break-all bg-rose-100/50 dark:bg-rose-900/30 p-2 rounded-lg">
                          <strong>Details:</strong> {signupError.details}
                        </p>
                      )}
                      {signupError.hint && (
                        <p className="mt-1.5 text-xs text-rose-700 dark:text-rose-300 font-mono break-all">
                          <strong>Hint:</strong> {signupError.hint}
                        </p>
                      )}
                      {signupError.code && (
                        <p className="mt-1 text-[10px] text-rose-600/70 dark:text-rose-400/70 font-mono">
                          <strong>Error Code:</strong> {signupError.code}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSignupError(null)}
                      className="rounded-lg p-1 text-rose-500 hover:bg-rose-100 dark:text-rose-400 dark:hover:bg-rose-900/40 transition-colors"
                      aria-label="Dismiss error banner"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  {/* Part 1: Personal Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40 col-span-2">
                      <label className="mb-2 block text-sm font-medium">Full name *</label>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                        <User className="h-4 w-4 text-slate-400" />
                        <input 
                          name="name"
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="w-full border-none bg-transparent outline-none text-sm text-gray-900 dark:text-white" 
                          placeholder="Aarav Sharma" 
                          type="text" 
                          required 
                        />
                      </div>
                      {errors.name ? <p className="mt-1 text-xs text-rose-500">{errors.name}</p> : null}
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                      <label className="mb-2 block text-sm font-medium">Email address *</label>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <input 
                          name="email"
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="w-full border-none bg-transparent outline-none text-sm text-gray-900 dark:text-white" 
                          placeholder="you@company.com" 
                          type="email" 
                          required 
                        />
                      </div>
                      {errors.email ? <p className="mt-1 text-xs text-rose-500">{errors.email}</p> : null}
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                      <label className="mb-2 block text-sm font-medium">Password *</label>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <input 
                          name="password"
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          className="w-full border-none bg-transparent outline-none text-sm text-gray-900 dark:text-white" 
                          placeholder="••••••••" 
                          type={showPassword ? 'text' : 'password'} 
                          required 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 transition hover:text-slate-700 cursor-pointer">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password ? <p className="mt-1 text-xs text-rose-500">{errors.password}</p> : null}
                    </div>
                  </div>

                  {/* Part 2: Business Info */}
                  <div className="border-t border-slate-200 dark:border-slate-800 my-4 pt-4">
                    <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3 uppercase tracking-wider">Business Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                        <label className="mb-2 block text-sm font-medium">Company Name *</label>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                          <input 
                            name="companyName"
                            value={companyName} 
                            onChange={(e) => setCompanyName(e.target.value)} 
                            className="w-full border-none bg-transparent outline-none text-sm text-gray-900 dark:text-white" 
                            placeholder="Acme Corp" 
                            type="text" 
                            required 
                          />
                        </div>
                        {errors.companyName ? <p className="mt-1 text-xs text-rose-500">{errors.companyName}</p> : null}
                      </div>

                      <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                        <label className="mb-2 block text-sm font-medium">GSTIN *</label>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                          <input 
                            name="gstin"
                            value={gstin} 
                            onChange={(e) => setGstin(e.target.value)} 
                            className="w-full border-none bg-transparent outline-none text-sm text-gray-900 dark:text-white" 
                            placeholder="27AABCT1234H1Z0" 
                            type="text" 
                            required 
                          />
                        </div>
                        {errors.gstin ? <p className="mt-1 text-xs text-rose-500">{errors.gstin}</p> : null}
                      </div>

                      <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40 col-span-2">
                        <label className="mb-2 block text-sm font-medium">Contact Phone *</label>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                          <input 
                            name="phone"
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            className="w-full border-none bg-transparent outline-none text-sm text-gray-900 dark:text-white" 
                            placeholder="+91 99999 99999" 
                            type="text" 
                            required 
                          />
                        </div>
                        {errors.phone ? <p className="mt-1 text-xs text-rose-500">{errors.phone}</p> : null}
                      </div>
                    </div>
                  </div>

                  {/* Part 3: Settlement Bank Details (Optional) */}
                  <div className="border-t border-slate-200 dark:border-slate-800 my-4 pt-4">
                    <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3 uppercase tracking-wider">Settlement Bank (Optional)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                        <label className="mb-2 block text-sm font-medium text-xs">Bank Name</label>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                          <input 
                            name="bankName"
                            value={bankName} 
                            onChange={(e) => setBankName(e.target.value)} 
                            className="w-full border-none bg-transparent outline-none text-xs text-gray-900 dark:text-white" 
                            placeholder="e.g. SBI" 
                            type="text" 
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                        <label className="mb-2 block text-sm font-medium text-xs">Account Number</label>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                          <input 
                            name="bankAccountNo"
                            value={bankAccountNo} 
                            onChange={(e) => setBankAccountNo(e.target.value)} 
                            className="w-full border-none bg-transparent outline-none text-xs text-gray-900 dark:text-white" 
                            placeholder="1000234567" 
                            type="text" 
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                        <label className="mb-2 block text-sm font-medium text-xs">Bank IFSC</label>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                          <input 
                            name="bankIfsc"
                            value={bankIfsc} 
                            onChange={(e) => setBankIfsc(e.target.value)} 
                            className="w-full border-none bg-transparent outline-none text-xs text-gray-900 dark:text-white" 
                            placeholder="SBIN0001234" 
                            type="text" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01] disabled:opacity-70">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {loading ? 'Processing Registration...' : 'Create account'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                Already have an account?{' '}
                <Link href="/seller/login" className="font-semibold text-indigo-600">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {toast ? <Toast message={toast.message} type={toast.type} duration={1400} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
