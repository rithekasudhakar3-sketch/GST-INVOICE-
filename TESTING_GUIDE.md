# Quick Start Guide - Authentication Testing

## Prerequisites
- Node.js installed
- Project dependencies installed (npm install already done)

## Start Dev Server

```bash
cd client
npm run dev
```

Server will start on `http://localhost:3000`

## Test Flows

### 1️⃣ Seller Registration + Login

**Step 1: Register**
- Go to: `http://localhost:3000/seller/register`
- Fill form:
  - Full name: `Raj Kumar`
  - Email: `raj@invoicehub.com`
  - Password: `Raj@2024`
- Click "Create account"
- ✅ See success toast: "Account created successfully. Redirecting to login..."
- ✅ Auto-redirected to `/seller/login`

**Step 2: Login**
- Email: `raj@invoicehub.com`
- Password: `Raj@2024`
- Click "Login"
- ✅ See success toast: "Signed in successfully."
- ✅ Auto-redirected to `/seller/dashboard`
- ✅ Navbar displays: "Raj Kumar" (your registered name)
- ✅ Navbar shows: "raj@invoicehub.com" (your registered email)

**Step 3: Verify Protected Route**
- Open browser DevTools > Application > LocalStorage
- Find `invoicehub-auth` key
- ✅ Contains: `{"role":"seller","user":{"name":"Raj Kumar","email":"raj@invoicehub.com",...}}`

**Step 4: Logout**
- Click avatar in top-right corner
- Click "Logout"
- ✅ Redirected to `/seller/login`
- ✅ localStorage `invoicehub-auth` is cleared

**Step 5: Test Protected Route Access**
- Try accessing `/seller/dashboard` directly in address bar
- ✅ Redirected to `/seller/login` (because not authenticated)

---

### 2️⃣ Client Registration + Login

**Same flow as seller, but with:**
- Start at: `http://localhost:3000/client/register`
- Register form color: Fuchsia/Purple (instead of blue/indigo)
- Login page: `http://localhost:3000/client/login`
- Dashboard: `/client/dashboard`

**Example:**
- Name: `Priya Singh`
- Email: `priya@client.com`
- Password: `Priya@2024`

---

### 3️⃣ Error Scenarios

**Scenario A: Duplicate Email Registration**
- Register seller with: `test@invoicehub.com` / `Test@123`
- Try registering again with same email
- ✅ See error toast: "Email already registered as seller"
- ✅ Account not created

**Scenario B: Invalid Login - Wrong Password**
- Register with: `john@test.com` / `John@123`
- Go to login page
- Enter: `john@test.com` / `WrongPassword`
- Click "Login"
- ✅ See error toast: "Invalid password"
- ✅ Stay on login page

**Scenario C: Invalid Login - Non-existent Email**
- Go to login page
- Enter: `nonexistent@test.com` / `Test@123`
- Click "Login"
- ✅ See error toast: "Seller account not found"

**Scenario D: Cross-Role Email**
- Register seller with: `multi@test.com`
- Register client with: `multi@test.com` (same email)
- ✅ Both registrations succeed (separate storage by role)
- ✅ Seller can login to seller dashboard
- ✅ Client can login to client dashboard

---

### 4️⃣ Advanced Tests

**Test A: Session Persistence**
1. Register and login as seller
2. Refresh page (F5)
3. ✅ Still authenticated (navbar shows your name)
4. Close and reopen browser
5. ✅ Still authenticated (localStorage persists)

**Test B: Multiple Users**
1. Register seller: `alice@test.com`
2. Logout
3. Register seller: `bob@test.com`
4. Logout
5. Login as `alice@test.com`
6. ✅ Navbar shows "Alice" (not Bob)
7. Logout
8. Login as `bob@test.com`
9. ✅ Navbar shows "Bob"

**Test C: Role Separation**
1. Register seller: `user@test.com`
2. Logout
3. Try registering same email as client
4. ✅ Registration succeeds (different role)
5. Login as client with `user@test.com`
6. ✅ Client dashboard works
7. Logout
8. Login as seller with `user@test.com`
9. ✅ Seller dashboard works

---

## LocalStorage Structure

### Current Authentication
**Key:** `invoicehub-auth`
```json
{
  "role": "seller",
  "user": {
    "name": "Raj Kumar",
    "email": "raj@invoicehub.com",
    "id": "seller-1705311234567"
  }
}
```

### All Users Registry
**Key:** `invoicehub-users`
```json
[
  {
    "id": "seller-1705311234567",
    "role": "seller",
    "name": "Raj Kumar",
    "email": "raj@invoicehub.com",
    "password": "UmFqQDIwMjQ=",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "client-1705311234568",
    "role": "client",
    "name": "Priya Singh",
    "email": "priya@client.com",
    "password": "UHJpeWFAMjAyNA==",
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
]
```

---

## Troubleshooting

### Problem: Dev server shows "Port 3000 in use"
**Solution:**
```bash
# Kill existing process (Windows)
taskkill /IM node.exe /F

# Then restart
npm run dev
```

### Problem: Changes not reflecting
**Solution:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache: DevTools > Application > Clear storage > Clear site data
3. Restart dev server

### Problem: localStorage shows old data
**Solution:**
- Open DevTools > Application > LocalStorage
- Find `invoicehub-auth` and `invoicehub-users` keys
- Right-click > Delete
- Refresh page
- Logout/Login again to regenerate

### Problem: Getting "account not found"
**Solution:**
- Verify you're using the EXACT email you registered with
- Check localStorage `invoicehub-users` to see registered users
- Email is case-sensitive for the current validation

---

## Expected vs Actual

### ✅ EXPECTED BEHAVIOR (NOW IMPLEMENTED)

| Feature | Before | After |
|---------|--------|-------|
| **Registration** | Auto-login to dashboard | Show success → Redirect to login |
| **Login** | Auto-login without validation | Validate password → Login if match |
| **Dashboard User Name** | "John Doe" (hardcoded) | "Your Registered Name" (real) |
| **Dashboard User Email** | "john@example.com" (hardcoded) | "your@email.com" (real) |
| **Logout Button** | Non-functional | Clear auth → Redirect to login |
| **Protected Routes** | Not checking auth | Redirect if not authenticated |
| **Error Messages** | Generic/none | Specific toast notifications |
| **Password Security** | Not checked | Validated against stored hash |

---

## Build & Deploy

### Run Production Build
```bash
cd client
npm run build
```

Expected output:
```
✓ Compiled successfully
✓ Generating static pages (23/23)
Finished in ~3 seconds
```

### Test Production Build Locally
```bash
npm run build
npm start
```

Server runs on `http://localhost:3000` with production optimizations.

---

## Notes for Production

⚠️ **Before deploying to production, implement:**

1. **Backend Authentication**
   - Replace localStorage with HTTP-only cookies
   - Implement server-side session management
   - Use bcrypt/argon2 for password hashing

2. **HTTPS/TLS**
   - All authentication endpoints must use HTTPS
   - Prevent man-in-the-middle attacks

3. **CSRF Protection**
   - Implement CSRF tokens
   - Validate on all state-changing operations

4. **Rate Limiting**
   - Limit login attempts per IP/email
   - Prevent brute force attacks

5. **Audit Logging**
   - Log all authentication events
   - Track failed login attempts

6. **2FA/MFA**
   - Implement Two-Factor Authentication
   - Support TOTP or SMS codes

---

## Support

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review AUTHENTICATION_IMPROVEMENTS.md for technical details
3. Check browser console for error messages
4. Verify localStorage using DevTools
