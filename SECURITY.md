# Security Report — Bodega Inventory App

_Last updated: 2026-04-01_

---

## Current Security Posture

| Protection | Status | Details |
|---|---|---|
| **SQL injection** | Protected | Parameterized queries throughout; ORDER BY uses whitelist in all query functions |
| **XSS** | Protected | EJS auto-escapes all output with `<%=` |
| **Input validation** | Server-side | `express-validator` covers name, size, price, stock, category on add/edit |
| **Authentication** | Session-based | `express-session` with hashed password via `bcrypt` |
| **Authorization** | Middleware | `checkAuth` middleware gates all mutating routes |
| **Security headers** | Implemented | `helmet` with custom `imgSrc: ["'self'"]` CSP |
| **Rate limiting** | Login + Delete | 10 requests / 15 min on both `POST /login` and `POST /:id/deleteItem` |
| **Open redirect** | Protected | `?from=` validated to relative paths only in all redirect flows |
| **Logout** | Implemented | `req.session.destroy()` fully clears the session |
| **Secrets** | Not committed | `.env` in `.gitignore`; password stored as bcrypt hash |

**All mutating routes require authentication:**

| Route | Protection |
|---|---|
| `POST /items/new` | `checkAuth` |
| `GET /items/:id/confirmDeleteItem` | `checkAuth` |
| `POST /items/:id/deleteItem` | `checkAuth` + rate limiter |
| `POST /items/:id/edit` | `checkAuth` |

---

## Known Remaining Gaps

| Issue | Notes |
|---|---|
| **No CSRF protection** | Forms have no CSRF tokens. A logged-in user could be tricked into submitting a forged request from another site. Mitigated by `sameSite` session cookie behavior in modern browsers, but not fully addressed. |
| **Session cookie not hardened for production** | Add `secure: true` and `sameSite: "lax"` to session cookie config before deploying over HTTPS. |
| **No client-side form validation** | HTML `required`, `maxlength`, and `min`/`max` attributes are absent. Server-side validation catches everything — this is a UX gap, not a security one. |

---

## Production Checklist

Before deploying:

- [ ] Set `NODE_ENV=production` in your environment
- [ ] Add `secure: true` to session cookie config (requires HTTPS)
- [ ] Rotate `SESSION_SECRET` to a long random string
- [ ] Ensure `ADMIN_PASSWORD_HASH` is a bcrypt hash, not a plaintext password
- [ ] Confirm `.env` is not committed to the repository
