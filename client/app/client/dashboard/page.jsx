'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default function ClientDashboard() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role) {
      router.replace(`/client/dashboard/${user.role.toLowerCase()}`);
    } else {
      router.replace('/client/login');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 shadow-2xl backdrop-blur-xl">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        <span className="text-sm font-medium">Redirecting to your dashboard…</span>
      </div>
    </div>
  );
}
