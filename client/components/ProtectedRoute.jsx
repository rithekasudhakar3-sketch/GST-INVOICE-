'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';

export function ProtectedRoute({ role, children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const allowed = await isAuthenticated(role);
      if (!allowed) {
        // Clean session to avoid cross-tenant overlaps
        await logout(role).catch(() => {});
        router.replace(role === 'seller' ? '/seller/login' : '/client/login');
        return;
      }
      setReady(true);
    }
    checkAccess();
  }, [role, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 shadow-2xl backdrop-blur-xl">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <span className="text-sm font-medium">Checking access…</span>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
