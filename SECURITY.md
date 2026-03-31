# Security Report — Bodega Inventory App

## What's Already Working Well

- **SQL injection protected** — parameterized queries throughout (`$1, $2...` syntax)
- **XSS protected** — EJS auto-escapes output with `<%=`
- **Input validation** — `express-validator` covers name, size, price, stock, and category on add/edit
- **Secrets in `.env`** — not committed to git
- **ORDER BY whitelist** — sort column validated against an allowed list before interpolating

---

## Current Vulnerabilities

### High Priority

| Issue | Risk | Fix |
|---|---|---|
| **No CSRF protection** | Anyone can send a forged POST from another site (delete items, add fake data) | Add `csurf` or `csrf-csrf` middleware |
| **Plaintext password compare** | Timing attacks possible; password exposed in comparison | Use `bcrypt.compare()` |
| **No rate limiting on DELETE password** | Brute-forceable with no lockout | Add `express-rate-limit` |
| **Add/Edit is completely open** | Anyone can add or edit items with no auth | Extend password check to mutations |

### Lower Priority

| Issue | Notes |
|---|---|
| No `helmet` (security headers) | Easy one-liner that adds CSP, X-Frame-Options, etc. |
| No client-side validation | HTML `required`, `maxlength`, `min` attrs would improve UX |
| No HTTPS enforcement | Matters in production, not local dev |

---

## Recommended Improvements

### 1. `helmet` — one line, big win

```bash
npm install helmet
```

```js
// app.js
import helmet from 'helmet';
app.use(helmet());
```

### 2. `express-rate-limit` on the delete route

```bash
npm install express-rate-limit
```

```js
// routes/itemsRouter.js
import rateLimit from 'express-rate-limit';
const deleteLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
router.post('/:id/deleteItem', deleteLimiter, deleteItem);
```

### 3. Session-based admin login (the real upgrade)

Instead of checking a password on every POST, add `express-session` + a simple `/admin/login` route. One password prompt logs you in for the session. This is how real apps work.

```bash
npm install express-session bcrypt
```

- Store a hashed password in `.env` (generate with `bcrypt.hash()`)
- Login route sets `req.session.isAdmin = true`
- Middleware checks `req.session.isAdmin` before any mutating route (POST/PUT/DELETE)
- Logout clears the session

---

## Known Bug

In `controllers/itemsController.js` line 106, the variable `newItemErrors` is referenced but the variable is named `formErrors`. This crashes on form validation failure for the add item route.

```js
// Change:
if (!newItemErrors.isEmpty()) {
// To:
if (!formErrors.isEmpty()) {
```

---

## Summary Table

| Feature | Status | Details |
|---|---|---|
| **Authentication** | Missing | No login/logout, no users |
| **Authorization** | Minimal | Password on DELETE only |
| **Input Validation** | Server-side only | `express-validator` on add/edit; no client-side HTML constraints |
| **SQL Injection** | Protected | Parameterized queries; whitelist on ORDER BY |
| **XSS** | Protected | EJS auto-escapes output |
| **CSRF** | Missing | No tokens, no protection |
| **Sessions** | Missing | No session management |
| **Password Hashing** | Missing | Plaintext comparison only |
| **Rate Limiting** | Missing | None |
| **Security Headers** | Missing | No helmet or CSP |
