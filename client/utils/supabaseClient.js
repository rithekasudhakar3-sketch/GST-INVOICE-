import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let sellerInstance;
let clientInstance;

if (typeof window !== 'undefined') {
  if (!window.__supabaseSeller) {
    window.__supabaseSeller = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: 'invoicehub-supabase-seller',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  if (!window.__supabaseClientObj) {
    window.__supabaseClientObj = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: 'invoicehub-supabase-client',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  sellerInstance = window.__supabaseSeller;
  clientInstance = window.__supabaseClientObj;
} else {
  if (!global.__supabaseSeller) {
    global.__supabaseSeller = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: 'invoicehub-supabase-seller',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  if (!global.__supabaseClientObj) {
    global.__supabaseClientObj = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: 'invoicehub-supabase-client',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  sellerInstance = global.__supabaseSeller;
  clientInstance = global.__supabaseClientObj;
}

export const supabaseSeller = sellerInstance;
export const supabaseClientObj = clientInstance;
export const supabase = sellerInstance; // Default generic export for backward-compatibility