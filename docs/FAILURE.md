# FAILURE: Failure Modes, Outages & Limits

> *“Where does this fail?” is the question that separates people who understand a system from people who merely deployed it.*

---

### Dependency Failure Matrix

| Dependency | Failure Mode | Impact on Gym | System Fallback & Mitigation | How We Notice |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase (PostgreSQL)** | Completely Down (500/503) | Cannot fetch or save live data to cloud | App falls back to `AppStorage` (localStorage & memory). Check-ins and lookups continue locally without blocking members. | Console error log, Sentry exception, empty cloud sync badge. |
| **Supabase** | Slow Queries (>3,000ms latency) | Dashboard loading delays | Client uses cached data instantly; background revalidation updates asynchronously via `useGymData`. | Network tab latency alerts, Vercel analytics. |
| **Gym Local Internet** | Disconnected | No outbound internet access | PWA cached pages render from Service Worker / browser cache. Front desk can check members in against cached roster. | Browser `navigator.onLine` indicator. |
| **WhatsApp Service** | WhatsApp Web blocked / API down | Renewal messages cannot open | Staff can preview the message copy in `ExpiringAlertsCenter` and manually copy/paste into SMS or call directly. | Staff reporting error on click. |
| **Browser Storage** | LocalStorage Quota Exceeded (5MB limit) | Cannot cache large offline snapshots | `AppStorage` wraps `setItem` in try/catch and falls back to in-memory state; logs warning without throwing. | Browser console warning. |

---

### Expected System Limits

1. **Member Roster Scaling Limit:**
   - *Current Implementation:* Loads full active roster in memory (fast and snappy for up to ~3,000 members).
   - *Failure Point:* At >10,000 members, client bundle payload will exceed 2MB and initial load will stutter.
   - *Mitigation Plan:* Implement server-side pagination with virtualized scrolling (`limit=50&offset=0`) when gym size surpasses 2,000 members.

2. **CSV Export Concurrency:**
   - *Current Implementation:* Generates RFC-4180 CSV in server memory for download.
   - *Failure Point:* Exporting >50,000 transaction rows could exceed serverless function memory limit (128MB).
   - *Mitigation Plan:* Stream response via `ReadableStream` instead of accumulating string in memory.

3. **Camera QR Scan Hardware Compatibility:**
   - *Current Implementation:* Uses HTML5 WebRTC `navigator.mediaDevices.getUserMedia`.
   - *Failure Point:* Fails on unsecure HTTP connections (browsers block camera unless on `https://` or `localhost`).
   - *Mitigation Plan:* Manual phone number lookup is always available as the primary fallback right next to the scan button.
