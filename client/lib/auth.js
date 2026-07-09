import { supabaseSeller, supabaseClientObj } from '../utils/supabaseClient';

const AUTH_STORAGE_KEY_PREFIX = 'invoicehub-auth-';

function formatAuthError(error) {
  if (!error) return { message: 'An unknown authentication error occurred.' };
  
  if (typeof error === 'string') {
    return { message: error };
  }
  
  return {
    message: error.message || error.description || error.error_description || 'An authentication error occurred.',
    details: error.details || null,
    hint: error.hint || null,
    code: error.code || error.status || null,
    raw: typeof error === 'object' ? { ...error } : error
  };
}

// ============ Contextual LocalStorage Sessions ============

export function getStoredAuth(role) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`${AUTH_STORAGE_KEY_PREFIX}${role || 'seller'}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(role, user) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`${AUTH_STORAGE_KEY_PREFIX}${role || 'seller'}`, JSON.stringify({ role, user }));
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(`${AUTH_STORAGE_KEY_PREFIX}seller`);
  window.localStorage.removeItem(`${AUTH_STORAGE_KEY_PREFIX}client`);
}

// ============ Email Aliasing for Option B ============

export function formatEmailWithContext(email, role) {
  const cleanEmail = email.trim().toLowerCase();
  const parts = cleanEmail.split('@');
  if (parts.length !== 2) return cleanEmail;
  
  const [username, domain] = parts;
  // Clean up any existing +seller or +client sub-addressing
  const baseUsername = username.split('+')[0];
  
  return `${baseUsername}+${role}@${domain}`;
}

export function stripEmailSuffix(email) {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [username, domain] = parts;
  const cleanUsername = username.split('+')[0];
  return `${cleanUsername}@${domain}`;
}

// ============ Supabase Authentication SDK ============

export async function signUpUser(
  emailOrObj,
  passwordParam,
  nameParam,
  companyNameParam = '',
  gstinParam = '',
  phoneParam = '',
  bankNameParam = '',
  bankAccountNoParam = '',
  bankIfscParam = ''
) {
  let email = emailOrObj;
  let password = passwordParam;
  let name = nameParam;
  let companyName = companyNameParam;
  let gstin = gstinParam;
  let phone = phoneParam;
  let bankName = bankNameParam;
  let bankAccountNo = bankAccountNoParam;
  let bankIfsc = bankIfscParam;

  if (emailOrObj && typeof emailOrObj === 'object') {
    email = emailOrObj.email;
    password = emailOrObj.password;
    name = emailOrObj.name;
    companyName = emailOrObj.companyName || '';
    gstin = emailOrObj.gstin || '';
    phone = emailOrObj.phone || '';
    bankName = emailOrObj.bankName || '';
    bankAccountNo = emailOrObj.bankAccountNo || '';
    bankIfsc = emailOrObj.bankIfsc || '';
  }

  try {
    // Clean up active seller session before signing up
    await supabaseSeller.auth.signOut().catch(() => {});
    
    // Alias the email transparently for the Seller database context
    const contextualEmail = formatEmailWithContext(email, 'seller');

    const { data: signUpData, error: signUpError } = await supabaseSeller.auth.signUp({
      email: contextualEmail,
      password,
      options: {
        data: {
          role: 'seller',
          name,
          companyName,
          gstin,
          phone,
          bankName,
          bankAccountNo,
          bankIfsc
        }
      }
    });

    if (signUpError) throw signUpError;

    // 1. Insert/upsert into public.profiles table (using clean email address)
    let profileData = {
      id: signUpData.user.id,
      role: 'seller',
      name: name,
      email: stripEmailSuffix(email),
      company_name: companyName,
      companyName: companyName,
      gstin: gstin,
      phone: phone,
      bank_name: bankName,
      bankName: bankName,
      bank_account_no: bankAccountNo,
      bankAccountNo: bankAccountNo,
      bank_ifsc: bankIfsc,
      bankIfsc: bankIfsc
    };

    let profileRetries = 15;
    while (profileRetries > 0) {
      const { error: profileError } = await supabaseSeller
        .from('profiles')
        .upsert([profileData]);

      if (profileError) {
        const isColumnError = profileError.code === '42703' || 
                             profileError.code === 'PGRST204' || 
                             (profileError.message && (profileError.message.includes('column') || profileError.message.includes('schema cache')));
        if (isColumnError) {
          const match = profileError.message.match(/column ["']([^"']+)["']/i) || 
                        profileError.message.match(/find the ["']([^"']+)["'] column/i);
          const colName = match && match[1];
          if (colName && profileData.hasOwnProperty(colName)) {
            console.log(`Auto-recovery: stripping column "${colName}" from profiles payload`);
            delete profileData[colName];
            profileRetries--;
            continue;
          }
        }
        console.error("Profiles Table Upsert Error:", profileError);
        break;
      } else {
        break;
      }
    }

    let formData = {
      id: signUpData.user.id,
      company_name: companyName,
      companyName: companyName,
      gstin: gstin,
      phone: phone,
      bank_name: bankName,
      bankName: bankName,
      bank_account_no: bankAccountNo,
      bankAccountNo: bankAccountNo,
      bank_ifsc: bankIfsc,
      bankIfsc: bankIfsc
    };

    console.log("Submitting seller profile...");

    let insertResult = null;
    let insertError = null;
    let retries = 15;
    
    while (retries > 0) {
      const { data: resData, error: resError } = await supabaseSeller
        .from('seller_profiles')
        .upsert([formData])
        .select();
      
      if (resError) {
        insertError = resError;
        const isColumnError = resError.code === '42703' || 
                             resError.code === 'PGRST204' || 
                             (resError.message && (resError.message.includes('column') || resError.message.includes('schema cache')));
        if (isColumnError) {
          const match = resError.message.match(/column ["']([^"']+)["']/i) || 
                        resError.message.match(/find the ["']([^"']+)["'] column/i);
          const colName = match && match[1];
          if (colName && formData.hasOwnProperty(colName)) {
            console.log(`Auto-recovery: stripping column "${colName}" from seller_profiles payload`);
            delete formData[colName];
            retries--;
            continue;
          }
        }
        console.error("Seller Profiles Table Upsert Error:", resError);
        break;
      } else {
        insertResult = resData;
        insertError = null;
        break;
      }
    }

    return { success: true, user: signUpData.user };
  } catch (error) {
    return { success: false, error: formatAuthError(error) };
  }
}

export async function signInUser(email, password) {
  try {
    // 1. Clean up active seller session before signing in
    await supabaseSeller.auth.signOut().catch(() => {});
    
    // Alias the email transparently for the Seller database context
    const contextualEmail = formatEmailWithContext(email, 'seller');

    // 2. Authenticate
    const { data, error } = await supabaseSeller.auth.signInWithPassword({
      email: contextualEmail,
      password
    });

    if (error) throw error;
    
    const user = data.user;

    // Retrieve definitive role and profile information from the database profiles table
    const { data: dbProfile, error: profileErr } = await supabaseSeller
      .from('profiles')
      .select('role, name, company_name, gstin, phone')
      .eq('id', user.id)
      .single();

    if (profileErr) throw profileErr;
    const userRole = dbProfile?.role || user.user_metadata?.role || 'seller';

    // 3. Strict Seller Role Check
    if (userRole !== 'seller') {
      await supabaseSeller.auth.signOut().catch(() => {});
      throw new Error('Access Denied: This account is registered as a Client. Please log in through the Client portal.');
    }

    const profile = {
      id: user.id,
      email: stripEmailSuffix(user.email),
      name: dbProfile?.name || user.user_metadata?.name || user.email,
      role: userRole,
      company: dbProfile?.company_name || user.user_metadata?.companyName || '',
      gstin: dbProfile?.gstin || user.user_metadata?.gstin || '',
      phone: dbProfile?.phone || user.user_metadata?.phone || ''
    };

    // Store in localStorage under Seller-specific key
    setStoredAuth('seller', profile);

    return { success: true, user: profile };
  } catch (error) {
    return { success: false, error: formatAuthError(error) };
  }
}

export async function signOutUser(role) {
  try {
    if (role === 'seller') {
      await supabaseSeller.auth.signOut().catch(() => {});
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(`${AUTH_STORAGE_KEY_PREFIX}seller`);
      }
    } else if (role === 'client') {
      await supabaseClientObj.auth.signOut().catch(() => {});
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(`${AUTH_STORAGE_KEY_PREFIX}client`);
      }
    } else {
      await Promise.all([
        supabaseSeller.auth.signOut().catch(() => {}),
        supabaseClientObj.auth.signOut().catch(() => {})
      ]);
      clearStoredAuth();
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: formatAuthError(error) };
  }
}

export async function getCurrentUser(role = 'seller') {
  try {
    const client = role === 'seller' ? supabaseSeller : supabaseClientObj;
    const { data: { session }, error } = await client.auth.getSession();
    if (error || !session) {
      return null;
    }
    
    const user = session.user;
    
    // Query public.profiles
    const { data: dbProfile } = await client
      .from('profiles')
      .select('role, name, company_name, gstin, phone')
      .eq('id', user.id)
      .single();
      
    const userRole = dbProfile?.role || user.user_metadata?.role || role;
    
    const profile = {
      id: user.id,
      email: stripEmailSuffix(user.email),
      name: dbProfile?.name || user.user_metadata?.name || user.email,
      role: userRole,
      company: dbProfile?.company_name || user.user_metadata?.companyName || '',
      gstin: dbProfile?.gstin || user.user_metadata?.gstin || '',
      phone: dbProfile?.phone || user.user_metadata?.phone || ''
    };

    setStoredAuth(userRole, profile);
    return profile;
  } catch {
    return null;
  }
}

// ============ Backward Compatibility Wrappers ============

export async function registerSeller(
  nameOrObj,
  emailParam,
  passwordParam,
  companyNameParam = '',
  gstinParam = '',
  phoneParam = '',
  bankNameParam = '',
  bankAccountNoParam = '',
  bankIfscParam = ''
) {
  let name = nameOrObj;
  let email = emailParam;
  let password = passwordParam;
  let companyName = companyNameParam;
  let gstin = gstinParam;
  let phone = phoneParam;
  let bankName = bankNameParam;
  let bankAccountNo = bankAccountNoParam;
  let bankIfsc = bankIfscParam;

  if (nameOrObj && typeof nameOrObj === 'object') {
    name = nameOrObj.name;
    email = nameOrObj.email;
    password = nameOrObj.password;
    companyName = nameOrObj.companyName || '';
    gstin = nameOrObj.gstin || '';
    phone = nameOrObj.phone || '';
    bankName = nameOrObj.bankName || '';
    bankAccountNo = nameOrObj.bankAccountNo || '';
    bankIfsc = nameOrObj.bankIfsc || '';
  }

  return signUpUser({
    email,
    password,
    name,
    companyName,
    gstin,
    phone,
    bankName,
    bankAccountNo,
    bankIfsc
  });
}

export async function loginSeller(email, password) {
  return signInUser(email, password);
}

// Client routes triggers (compatible structures)
export async function registerClient(name, email, password) {
  try {
    // Clean up active client session before signing up
    await supabaseClientObj.auth.signOut().catch(() => {});

    // Alias the email transparently for the Client database context
    const contextualEmail = formatEmailWithContext(email, 'client');

    const { data, error } = await supabaseClientObj.auth.signUp({
      email: contextualEmail,
      password,
      options: {
        data: {
          role: 'client',
          name
        }
      }
    });
    if (error) throw error;

    // 1. Insert/upsert into public.profiles table for client (using clean email)
    let profileData = {
      id: data.user.id,
      role: 'client',
      name: name,
      email: stripEmailSuffix(email)
    };

    let profileRetries = 15;
    while (profileRetries > 0) {
      const { error: profileError } = await supabaseClientObj
        .from('profiles')
        .upsert([profileData]);

      if (profileError) {
        const isColumnError = profileError.code === '42703' || 
                             profileError.code === 'PGRST204' || 
                             (profileError.message && (profileError.message.includes('column') || profileError.message.includes('schema cache')));
        if (isColumnError) {
          const match = profileError.message.match(/column ["']([^"']+)["']/i) || 
                        profileError.message.match(/find the ["']([^"']+)["'] column/i);
          const colName = match && match[1];
          if (colName && profileData.hasOwnProperty(colName)) {
            console.log(`Auto-recovery: stripping column "${colName}" from profiles payload`);
            delete profileData[colName];
            profileRetries--;
            continue;
          }
        }
        console.error("Profiles Table Upsert Error:", profileError);
        break;
      } else {
        break;
      }
    }

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: formatAuthError(error) };
  }
}

export async function loginClient(email, password) {
  try {
    // 1. Clean up active client session before signing in
    await supabaseClientObj.auth.signOut().catch(() => {});

    // Alias the email transparently for the Client database context
    const contextualEmail = formatEmailWithContext(email, 'client');

    // 2. Authenticate
    const { data, error } = await supabaseClientObj.auth.signInWithPassword({
      email: contextualEmail,
      password
    });
    if (error) throw error;
    
    const user = data.user;

    // Retrieve definitive role and profile information from the database profiles table
    const { data: dbProfile, error: profileErr } = await supabaseClientObj
      .from('profiles')
      .select('role, name')
      .eq('id', user.id)
      .single();

    if (profileErr) throw profileErr;
    const userRole = dbProfile?.role || user.user_metadata?.role || 'client';

    // 3. Strict Client Role Check
    if (userRole !== 'client') {
      await supabaseClientObj.auth.signOut().catch(() => {});
      throw new Error('Access Denied: This account is registered as a Seller. Please log in through the Seller portal.');
    }

    const profile = {
      id: user.id,
      email: stripEmailSuffix(user.email),
      name: dbProfile?.name || user.user_metadata?.name || user.email,
      role: userRole
    };

    setStoredAuth('client', profile);
    return { success: true, user: profile };
  } catch (error) {
    return { success: false, error: formatAuthError(error) };
  }
}

export async function isAuthenticated(role) {
  try {
    const client = role === 'seller' ? supabaseSeller : supabaseClientObj;
    // 1. Check active Supabase session
    const { data: { session } } = await client.auth.getSession();
    if (session) {
      const user = session.user;
      
      // Retrieve definitive role and profile information from the database profiles table
      const { data: dbProfile } = await client
        .from('profiles')
        .select('role, name, company_name, gstin, phone')
        .eq('id', user.id)
        .single();

      const userRole = dbProfile?.role || user.user_metadata?.role || role;
      if (userRole === role) {
        // Sync to localStorage
        const profile = {
          id: user.id,
          email: stripEmailSuffix(user.email),
          name: dbProfile?.name || user.user_metadata?.name || user.email,
          role: userRole,
          company: dbProfile?.company_name || user.user_metadata?.companyName || '',
          gstin: dbProfile?.gstin || user.user_metadata?.gstin || '',
          phone: dbProfile?.phone || user.user_metadata?.phone || ''
        };
        setStoredAuth(userRole, profile);
        return true;
      }
      return false;
    }
    
    // 2. Fallback to localStorage for instant synchronous route checks during hydration
    const stored = getStoredAuth(role);
    if (stored && stored.user && stored.role === role) {
      return true;
    }
    
    return false;
  } catch (err) {
    console.error("isAuthenticated verification error:", err);
    return false;
  }
}

export async function getAuthUser(role) {
  const user = await getCurrentUser(role);
  if (!user || user.role !== role) return null;
  return user;
}

export async function logout(role) {
  return signOutUser(role);
}
