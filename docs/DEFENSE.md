# DEFENSE: GymPRO Commercial Operating Engine

> **The Whiteboard Cheat Sheet**  
> *If you can explain this page without notes, you pass the benchmark. If you cannot, you are not ready to ship.*

---

### 1. What It Does (2 Sentences)
GymPRO is an offline-resilient, commercial gym operating engine built for Indian fitness center owners and staff. It unifies high-speed QR check-ins, member roster management, fee collection ledgers, automated WhatsApp renewal alerts, and CA-compliant accounting exports into a single zero-latency dashboard.

---

### 2. How It Works (The Core Flow)
1. **At the Desk:** Front-desk staff authenticate via `AdminAuthGuard`. When an athlete scans their QR pass, `QRScanModal` dispatches an attendance payload via `gymApiClient`.
2. **On the Server:** Next.js API routes (`src/app/api/`) pass the payload through `src/server/validators/`, execute domain business logic in `src/server/services/`, and record immutable entries in Supabase PostgreSQL via `src/server/repositories/`.
3. **Resilience Loop:** If the local gym broadband drops, `src/lib/storage.ts` immediately serves cached snapshots from memory/localStorage, allowing check-ins to continue uninterrupted until network re-establishment.

---

### 3. Key Decisions & Why X Over Y
- **Supabase PostgreSQL over Firebase:** Chained financial calculations (MRR, dues, collection efficiency) require standard SQL relations, foreign keys, and atomic transactions that NoSQL document stores struggle with.
- **Layered Clean Architecture over Monorepo:** Separating code into `src/server/` and `src/client/` within Next.js avoids CORS misconfigurations, doubled hosting bills, and schema drift, while our standalone `backend/server.mjs` remains ready for mobile expansion.
- **Direct WhatsApp Deep-Links over Cloud API:** Commercial gyms in India reject paying $0.05/message to Meta. Deep-links allow owners to send personalized UPI payment reminders directly from their verified phone at zero marginal cost.

---

### 4. Data Structures & Why
- **`Member` (Flat Relational Entity):** Indexed by `id`, `phone`, and `status`. Stores `totalFeeInr`, `paidAmountInr`, and derived `pendingDueInr`. Stored in PostgreSQL table with `created_at DESC` indexing for sub-10ms roster queries.
- **`AttendanceRecord` (Append-Only Event Stream):** Captures timestamped check-in events with `checkInMethod ('qr_scan' | 'phone_search')`. Never updated or deleted, guaranteeing forensic auditability.
- **`PaymentRecord` (Immutable Financial Ledger):** Captures cash/UPI transaction receipts. Dues are computed from ledger sums, preventing phantom balance tampering.

---

### 5. How a Malicious Actor Could Abuse It
- **Abuse Attempt:** An expired member screenshots an active member's QR code.
- **Mitigation:** The scanner validates the ID in real-time against active subscription dates (`end_date < today`). If expired, it triggers a red warning modal, plays an alert tone, and blocks entry.
- **Abuse Attempt:** Tampering with dues payload in browser DevTools.
- **Mitigation:** `paymentValidator.ts` and server-side arithmetic strictly recompute `pendingDueInr = totalFeeInr - paidAmountInr` on the server before committing.

---

### 6. Where It Fails & How We Notice
- **First Failure Limit:** Supabase cloud connection loss during ISP outages.
- **Fallback:** Handled transparently by `AppStorage` fallback cache.
- **Detection:** Logged in browser console, visible via connection status indicator in header.
- **Scalability Ceiling:** Current in-memory active member filtering scales to ~5,000 members. Beyond that, server-side paginated queries (`limit/offset`) must be activated.

---

### 7. What I Would Change With More Time
1. Integrate hardware turnstile relay controller (ESP32 / Raspberry Pi GPIO triggers) for physical gate unlocking on valid QR scan.
2. Implement dynamic TOTP QR codes (regenerated every 30s) to mathematically eliminate screenshot sharing.
3. Hook Cashfree / Razorpay auto-reconciliation webhooks to update dues automatically upon UPI bank transfer.
