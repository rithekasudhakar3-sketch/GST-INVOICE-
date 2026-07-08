const AUTH_STORAGE_KEY = 'invoicehub-auth';
const USERS_STORAGE_KEY = 'invoicehub-users';

// ============ Core Storage Functions ============

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

// ============ User Registration & Login ============

function getAllUsers() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAllUsers(users) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function hashPassword(password) {
  // Simple hash for client-side (NOT production-grade)
  return btoa(password);
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// ============ Seller Authentication ============

export function registerSeller(name, email, password) {
  if (typeof window === 'undefined') return { success: false, error: 'Server-side only' };

  const users = getAllUsers();
  
  // Check if user already exists
  if (users.some(u => u.email === email && u.role === 'seller')) {
    return { success: false, error: 'Email already registered as seller' };
  }

  const newUser = {
    id: `seller-${Date.now()}`,
    role: 'seller',
    name,
    email,
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveAllUsers(users);

  return { success: true, user: newUser };
}

export function loginSeller(email, password) {
  if (typeof window === 'undefined') return { success: false, error: 'Server-side only' };

  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.role === 'seller');

  if (!user) {
    return { success: false, error: 'Seller account not found' };
  }

  if (!verifyPassword(password, user.password)) {
    return { success: false, error: 'Invalid password' };
  }

  setStoredAuth('seller', { name: user.name, email: user.email, id: user.id });
  return { success: true, user: { name: user.name, email: user.email, id: user.id } };
}

// ============ Client Authentication ============

export function registerClient(name, email, password) {
  if (typeof window === 'undefined') return { success: false, error: 'Server-side only' };

  const users = getAllUsers();
  
  // Check if user already exists
  if (users.some(u => u.email === email && u.role === 'client')) {
    return { success: false, error: 'Email already registered as client' };
  }

  const newUser = {
    id: `client-${Date.now()}`,
    role: 'client',
    name,
    email,
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveAllUsers(users);

  return { success: true, user: newUser };
}

export function loginClient(email, password) {
  if (typeof window === 'undefined') return { success: false, error: 'Server-side only' };

  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.role === 'client');

  if (!user) {
    return { success: false, error: 'Client account not found' };
  }

  if (!verifyPassword(password, user.password)) {
    return { success: false, error: 'Invalid password' };
  }

  setStoredAuth('client', { name: user.name, email: user.email, id: user.id });
  return { success: true, user: { name: user.name, email: user.email, id: user.id } };
}

// ============ Session Management ============

export function getCurrentUser() {
  const auth = getStoredAuth();
  return auth?.user || null;
}

export function logout() {
  clearStoredAuth();
}
