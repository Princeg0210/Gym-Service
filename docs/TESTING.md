# TESTING: Verification Checklist & Manual Test Scripts

> *An AI claiming success and code actually working are two different facts. This file is how you stop confusing them.*

---

### 1. Automated Verification Commands

Run these exact commands in terminal:

```bash
# Step 1: Static Type & Next.js Lint Check
npm run lint
# Expected: Exit code 0, "No errors found."

# Step 2: Next.js Production Build Compilation
npm run build
# Expected: Exit code 0, 14 routes compiled (static & dynamic).

# Step 3: Frontend Quality & Anti-Pattern Audit
npx -y impeccable detect src/
# Expected: "0 anti-patterns found."
```

---

### 2. Manual End-to-End Customer Paths

#### Test Path A: Front-Desk Check-In via QR / Phone
1. Open `http://localhost:3000/admin`.
2. Enter managerial passkey: `2026`.
3. Press keyboard hotkey `/` or click **"Quick Check-In"**.
4. In `QRScanModal`, click **"Test Optical Scan"** (or type phone `9876543210`).
5. **Expected Result:**
   - Audio chime plays.
   - Confirmation toast appears: `Member Checked In Successfully`.
   - "In-Gym Today" counter increments by 1.
   - Attendance record appears at top of Live Logs table.

#### Test Path B: New Member Enrollment & Fee Due
1. Click **"+ Add Member"** in the top navigation.
2. Enter Name: `Test Athlete`, Phone: `9899001122`, Plan: `Monthly Standard (₹1,500)`.
3. Click **"Confirm Enrollment"**.
4. **Expected Result:**
   - Member appears in the Members Tab.
   - Pending due is automatically set to `₹1,500` (zero payment collected at enrollment).
   - Click Member -> Collect Payment -> Select `UPI` -> enter `₹1,500`.
   - Pending due becomes `₹0` and status changes to `Active`.

#### Test Path C: WhatsApp Expiry Alert Trigger
1. In Admin Dashboard, navigate to the **"Renewal Bot"** tab.
2. Filter by **"Next 1–3 Days"** or **"Expiring Today"**.
3. Click **"Preview"** on an alert card.
4. **Expected Result:**
   - Modal renders personalized Hindi/English reminder with member name and gym UPI handle.
   - Click **"Send WhatsApp"** -> opens `https://wa.me/91...` in browser with pre-filled message.

#### Test Path D: CA Accounting Export
1. Navigate to the **"BI Reports"** tab.
2. Click **"Export to Excel (CSV)"**.
3. **Expected Result:**
   - Browser immediately downloads `gympro-accounts-report-YYYY-MM-DD.csv`.
   - Open CSV in Excel / TextEdit -> verify headers (`Member ID`, `Full Name`, `Phone`, `Plan`, `Total Fee`, `Paid Amount`, `Pending Due`, `Status`).
