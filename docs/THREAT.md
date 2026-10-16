# THREAT: Security & Abuse Modeling

> *AI writes code for the happy path. Attackers live on every other path.*

---

### Actor Matrix

| Actor | Access Level | Primary Attack Surfaces |
| :--- | :--- | :--- |
| **Anonymous Visitor** | Public Web | Public showcase, `/member` portal lookup, `/api/` endpoints |
| **Enrolled Member** | Authenticated (QR / Phone) | Personal workout tracker, profile view, QR pass |
| **Front Desk Staff** | Local Console / Desktop | Member enrollment, check-in logger, fee collection |
| **Admin / Owner** | Full Management | Financial reports, CA exports, plan pricing, equipment |

---

### Realistic Threat Scenarios & Mitigations

#### 1. Anonymous User Scraping Member List or Phone Numbers
- **Threat:** An attacker queries `GET /api/members` to download names, phone numbers, and emergency contacts of gym members.
- **Mitigation:**
  - `authMiddleware.ts` requires admin authorization tokens on administrative endpoints.
  - Future production hardening: Enable Supabase Row Level Security (RLS) restricting public `SELECT` on `members` to authenticated role.
- **Known Gap:** In local development mode, `authMiddleware` permits calls without strict bearer validation for dev velocity. Must be gated before live production URL exposure.

#### 2. Member Tampering with Payment Dues
- **Threat:** A member inspects the browser DevTools in `/member` portal and submits a payload to set `pendingDueInr = 0` or change their `endDate`.
- **Mitigation:**
  - Members cannot write directly to the `payments` or `members` tables.
  - `paymentValidator.ts` validates that payments are recorded with a positive amount.
  - Due balance is recomputed strictly on the server: `pendingDueInr = totalFeeInr - paidAmountInr`.
- **Known Gap:** Client-side updates currently must be backed by a verified webhook from the payment gateway (e.g. Razorpay / Cashfree) in production.

#### 3. Replay Attack on QR Check-in Pass
- **Threat:** An expired member takes a screenshot of an active friend's QR code and scans it at the turnstile.
- **Mitigation:**
  - The optical scanner validates the decoded member ID against the server. If the member has expired or has pending dues, the system displays a red `DEFAULTER / EXPIRED` warning banner and emits an error chime.
  - Future improvement: Dynamic TOTP-based expiring QR tokens (refreshed every 30 seconds).

#### 4. Malicious Walk-in Lead Spamming
- **Threat:** An automated bot spams `POST /api/leads` to flood the database with bogus leads.
- **Mitigation:**
  - `leadRepository` and input validation require a valid 10-digit Indian phone number.
  - Rate limiting should be enforced via Edge middleware (Upstash / Cloudflare Turnstile).

#### 5. Malicious Supply Chain Dependency
- **Threat:** An npm package compromised with malware steals environment secrets (`SUPABASE_KEY`).
- **Mitigation:**
  - We strictly pin dependencies in `package.json`.
  - Next.js server environment secrets are not exposed to the client bundle (`NEXT_PUBLIC_` isolation).
  - Regular `npm audit` scans.
