# Security Report — Bodega Inventory App

_Last updated: 2026-04-01_

---

## What's Working Well

| Protection | Status | Details |
|---|---|---|
| **SQL injection** | Protected | Parameterized queries throughout; ORDER BY uses whitelist |
| **XSS** | Protected | EJS auto-escapes all output with `<%=` |
| **Input validation** | Server-side | `express-validator` covers name, size, price, stock, category on add/edit |
| **Auth middleware** | Implemented | `middleware/auth.js` gates all mutating routes |
| **Session management** | Implemented | `express-session` with `SESSION_SECRET` env var; `saveUninitialized: false` |
| **Password hashing** | Implemented | `bcrypt.compare()` against `ADMIN_PASSWORD_HASH` env var |
| **Security headers** | Implemented | `helmet` with custom `imgSrc: ["'self'"]` CSP |
| **Rate limiting** | Partial | `express-rate-limit` on DELETE (10 req / 15 min) |
| **Logout** | Implemented | `req.session.destroy()` fully clears the session |
| **Secrets in `.env`** | Not committed | `.gitignore` covers it |

**All mutating routes require authentication:**
- `POST /items/new` — `checkAuth`
- `GET /items/:id/confirmDeleteItem` — `checkAuth`
- `POST /items/:id/deleteItem` — `checkAuth` + rate limiter
- `POST /items/:id/edit` — `checkAuth`

---

## Remaining Issues

### High Priority

**1. Password logged to console (`indexController.js:22`)**

```js
console.log(password); // ← plaintext password written to stdout on every login attempt
```

Remove both `console.log` lines in `loginPost`. Logging credentials is a serious issue if
the app ever runs on a shared server or has log aggregation.

**2. No rate limiting on the login route**

The delete route is rate-limited, but `POST /login` is not. An attacker can brute-force
the login form at full speed. Add a limiter to the login route the same way you did for delete:

```js
// routes/indexRouter.js
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
indexRouter.post("/login", loginLimiter, loginPost);
```

**3. `?from=` open redirect**

The `from` query parameter is used to redirect after login/logout without validation:

```js
res.redirect(req.query.from || "/"); // ← can redirect to any URL
```

An attacker could craft `?from=https://evil.com` and phish users via your login page.
Fix by validating the redirect is a relative path:

```js
const from = req.query.from || "/";
const safeTo = from.startsWith("/") && !from.startsWith("//") ? from : "/";
res.redirect(safeTo);
```

### Medium Priority

**4. No CSRF protection**

Forms (login, add, edit, delete, logout) have no CSRF tokens. A malicious page could
submit a forged POST as a logged-in user. Add the `csrf-csrf` package:

```bash
npm install csrf-csrf
```

Then generate a token per request and include `<input type="hidden" name="_csrf" value="<%= csrfToken %>">` in every form.

**5. Username field is cosmetic only**

Any username + the correct password grants admin access. The username is stored in the
session and displayed in the UI but never verified. This is fine for a single-admin app —
just worth understanding: the only real credential is the password.

### Low Priority

**6. Session cookie not hardened for production**

`express-session` defaults are fine for local dev, but for a deployed app add:

```js
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,    // already default, but explicit is better
    sameSite: "lax",   // prevents CSRF via cross-site requests
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  }
}));
```

**7. No client-side form validation**

Forms have no HTML `required`, `maxlength`, or `min`/`max` attributes. Server-side
validation catches everything, so this is a UX issue not a security one — but it's a
quick win.

---

## Summary Table

| Feature | Status |
|---|---|
| SQL Injection | Protected |
| XSS | Protected |
| Input Validation | Server-side only |
| Authentication | Session-based login/logout |
| Authorization | `checkAuth` middleware on all mutations |
| Password Hashing | bcrypt |
| Security Headers | helmet (with CSP) |
| Rate Limiting | DELETE only — login route unprotected |
| CSRF | Not implemented |
| Open Redirect | Unvalidated `?from=` parameter |
| Credential Logging | Password logged to console (bug) |
| Session Cookie Hardening | Not configured for production |
