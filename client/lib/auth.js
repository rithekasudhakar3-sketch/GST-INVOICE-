const AUTH_STORAGE_KEY = 'invoicehub-auth';

export function getStoredAuth() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(role, user) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role, user }));
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated(role) {
  const auth = getStoredAuth();
  return Boolean(auth && auth.role === role);
}

export function getAuthUser(role) {
  const auth = getStoredAuth();
  if (!auth || auth.role !== role) return null;
  return auth.user;
}
