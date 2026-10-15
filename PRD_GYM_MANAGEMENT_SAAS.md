# Product Requirements Document (PRD)
## Gym Management SaaS — MVP (Indian Gyms Edition)

| **Document Version** | 1.0 (MVP Implementation-Ready) |
| **Target Market** | Indian Commercial, Neighborhood & Franchise Gyms |
| **Tech Stack** | Next.js (TypeScript), Tailwind CSS, shadcn/ui, Supabase (PostgreSQL, Auth, RLS) |
| **Deliverable Type** | Complete MVP PRD for Immediate Engineering & UI/UX Sprint |

---

## 1. Product Overview & MVP Feature List

### 1.1. Product Vision & Problem Statement
Over 80% of gyms in India still manage member records, fee dues, and attendance using paper registers, WhatsApp spreadsheets, or outdated desktop software. This causes severe revenue leakage (forgotten membership renewals, untracked cash collections), poor member retention (lack of guided workouts), and chaotic front-desk operations during morning and evening rush hours.

**GymPRO SaaS** is an agile, multi-tenant B2B2C gym management and member enablement platform built specifically for Indian gyms. It equips gym owners and receptionists with a fast, high-density operations dashboard while providing gym members with an accessible web-based portal for attendance history, workout logging, and practical diet recommendations.

### 1.2. MVP Feature Scope Matrix

| Module | Core Features in MVP (Must-Have) | Excluded from MVP (Post-MVP / Phase 2) |
| :--- | :--- | :--- |
| **A. Gym Management Dashboard** | • Real-time operational dashboard (active count, daily check-ins, monthly collections, overdue fees)<br>• Member registration & profile management (ID proof, health note)<br>• Flexible membership plans (1, 3, 6, 12 months)<br>• Payment recording (Cash, UPI via QR, Net Banking)<br>• 1-Click WhatsApp payment receipts & due reminders<br>• Attendance logging (Quick 4-digit phone search or QR scan)<br>• Enquiry & prospect follow-up pipeline<br>• Equipment maintenance log & status register<br>• Dues recovery and daily collection reports | • Biometric hardware TCP/IP direct bridge<br>• Multi-branch consolidated franchise accounting<br>• Automated recurring bank e-mandates / auto-debit<br>• Payroll & commission calculator for trainers |
| **B. Member Portal** | • Mobile-first web app view (PWA capable)<br>• Active membership validity badge & remaining days<br>• Digital gym ID & QR pass for check-in<br>• Daily workout routine viewer with exercise cues & set/rep logger<br>• Equipment swap button for busy peak hours<br>• Personal attendance streak & monthly calendar<br>• Fee transaction history & downloadable receipts | • In-app social feed & community leaderboards<br>• Live video trainer coaching<br>• In-app supplement e-commerce store |
| **C. AI Fitness Features** | • Goal-based workout plan generator (Hypertrophy, Fat Loss, General Fitness)<br>• Indian diet meal suggestions (Vegetarian, Eggetarian, Non-Veg with regional food items: paneer, dal, soya chunks, eggs, curd)<br>• Deterministic offline fallback engine (100% uptime when LLM is offline) | • Real-time computer vision camera rep counting<br>• Continuous wearable device sync (Apple Health, Fitbit) |

---

## 2. Main Screens & Sitemap

```
GymPRO SaaS Application Structure
├── 🌐 Public Routes
│   ├── /login                     (Supabase Auth: Email/Password & Phone OTP)
│   ├── /signup                    (Gym Owner Onboarding & Organization Setup)
│   └── /verify-member             (Public QR verification for gym entrance)
│
├── 🏢 Gym Owner / Staff Dashboard (`/dashboard`)
│   ├── /dashboard                 (Operations Command Center: Check-in, Dues Strip)
│   ├── /members                   (Member Roster, Filter by Active/Expired/Dues)
│   │   ├── /members/new           (Fast Registration Form)
│   │   └── /members/[id]          (Member 360 View: Plan, Attendance, Ledger)
│   ├── /billing                   (Revenue Register & Collections)
│   │   ├── /billing/dues          (Overdue Recovery & WhatsApp Reminders)
│   │   └── /billing/plans         (Membership Tier Pricing: Monthly, Quarterly, Annual)
│   ├── /attendance                (Daily Front-Desk Scanner & Manual Fast Check-in)
│   ├── /leads                     (Enquiries & Trial Conversions Pipeline)
│   ├── /equipment                 (Asset Register, Service Dates, Downtime Status)
│   └── /settings                  (Gym Info, UPI VPA Configuration, Staff Roles)
│
└── 📱 Member Web Portal (`/portal`)
    ├── /portal/home               (Membership Validity, Digital Pass, Quick Actions)
    ├── /portal/workouts           (Assigned Plan, Weekly Split)
    │   └── /portal/workouts/today (Live Set/Rep Logger, Rest Timer, Machine Swap)
    ├── /portal/diet               (Nutrition Targets & Indian Meal Suggestions)
    ├── /portal/history            (Attendance Calendar & Payment Invoices)
    └── /portal/profile            (Emergency Contact, Fitness Goals)
```

---

## 3. Core User Flows

### Flow 1: Member Registration & Fee Collection
```
[Front Desk clicks "Add Member" or presses 'N']
                      │
                      ▼
[Enter Name, Phone Number (10-digit Indian), Age, Gender, Emergency Contact]
                      │
                      ▼
[Select Membership Plan (e.g. 3-Month General Fitness @ ₹4,500)]
                      │
                      ▼
[Record Payment Method: Cash / UPI (Auto-shows Gym UPI QR code)]
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[Payment Full (₹4,500)]    [Partial Payment (e.g. ₹2,000 paid, ₹2,500 due)]
        │                           │
        └─────────────┬─────────────┘
                      ▼
[System activates Member in Supabase & triggers WhatsApp Welcome + Receipt link]
```

### Flow 2: Attendance Check-In (Peak Hour Fast Flow)
```
[Member arrives at reception]
         │
         ├── Option A: Member shows QR Pass on Phone -> Staff scans via webcam
         └── Option B: Staff types last 4 digits of phone number in search box
         │
         ▼
[System checks Supabase database in <200ms]
         │
    ┌────┴──────────────────────────────┐
    ▼                                   ▼
[Membership Active & No Dues]    [Membership Expired OR Overdue Fees]
    │                                   │
    ▼                                   ▼
• Green "Checked-In" sound/banner   • Yellow/Red Warning Banner
• Logged to attendance table        • Displays pending balance (e.g. "Dues: ₹1,500")
                                    • One-click: "Collect Dues" or "Allow with Note"
```

### Flow 3: WhatsApp Dues Recovery Follow-up
```
[Gym Owner opens `/billing/dues`]
         │
         ▼
[List sorted by days overdue (>7 days, >15 days, >30 days)]
         │
         ▼
[Click "Remind via WhatsApp" button on member row]
         │
         ▼
[Opens WhatsApp Web / Mobile with templated text]:
"Namaste [Member Name], gentle reminder from [Gym Name]. 
Your gym fee of ₹[Amount] was due on [Due Date]. 
Kindly pay via UPI to [Gym UPI ID] to keep your access uninterrupted. Thank you!"
```

### Flow 4: Personalized Workout Recommendation & Fallback Flow
```
[Member opens Member Portal -> "Generate My Workout"]
         │
         ▼
[Inputs: Goal (Fat Loss/Muscle Gain), Days (3-6), Experience Level, Injuries]
         │
         ▼
[Next.js Server Route checks LLM Edge API status]
    ┌────┴──────────────────────────────────────┐
    ▼                                           ▼
(LLM API Online & Valid)             (LLM API Offline / Rate Limited)
    │                                           │
AI generates tailored workout plan    Deterministic Engine pulls verified template
    │                                 from `workout_templates` table
    └─────────────────────┬─────────────────────┘
                          ▼
             [Schema Validation Passed]
                          ▼
[Saves to `member_workout_plans` table; Member begins logging sets today]
```

---

## 4. Short User Stories & Acceptance Criteria

### US-01: Front-Desk Quick Attendance Check-in
- **As a** gym receptionist,  
- **I want to** check in members by typing their phone number or scanning their QR code in under 2 seconds,  
- **So that** there is no crowd or delay at the reception counter during peak rush.  
- **Acceptance Criteria:**
  1. Input field automatically retains focus after each submission.
  2. Searching by 4 digits shows matching members with active photo and fee status.
  3. Valid check-in creates an entry in `attendance_logs` and displays a green confirmation.
  4. If membership is expired or has unpaid dues, a high-visibility warning badge is displayed with the exact overdue amount in ₹.

### US-02: Payment Recording & WhatsApp Receipt
- **As a** gym owner,  
- **I want to** log partial or full payments via UPI and Cash and send instant receipts,  
- **So that** I eliminate cash mismanagement and disputes with members.  
- **Acceptance Criteria:**
  1. Supports splitting transactions into Paid Amount and Pending Due.
  2. Generates an instant WhatsApp deep-link with transaction ID, amount, and renewal validity date.
  3. Automatically updates the member's `membership_status` and ledger in PostgreSQL.

### US-03: Member Set Logging & Busy-Machine Swap
- **As a** gym member,  
- **I want to** log my weights and reps on my phone and swap exercises if a machine is occupied,  
- **So that** my workout flow is never interrupted during peak gym hours.  
- **Acceptance Criteria:**
  1. Set inputs (reps, kg) are pre-populated with values from the previous completed workout.
  2. Clicking "Swap Machine" suggests exercises with the same muscle biomechanics that require accessible equipment (e.g. Barbells/Dumbbells).
  3. Starting rest timer plays a subtle audio cue upon completing the countdown.
  4. Data syncs to Supabase with optimistic UI (works seamlessly on poor 4G reception).

### US-04: Equipment Downtime & Maintenance Tracking
- **As a** gym manager,  
- **I want to** track broken cables, torn bench upholstery, and machine maintenance schedules,  
- **So that** equipment is repaired before it causes member dissatisfaction or safety hazards.  
- **Acceptance Criteria:**
  1. Displays equipment status: `Operational`, `Needs Maintenance`, `Under Repair`.
  2. Tracks vendor contact info and repair expenditure per item.
  3. Sends an alert badge on dashboard 7 days before scheduled quarterly servicing.

---

## 5. Supabase PostgreSQL Database Schema & Security (RLS)

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. GYMS (Multi-tenant Root Organization)
CREATE TABLE public.gyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    upi_vpa VARCHAR(80), -- e.g., 'fitnessgym@oksbi' for direct QR generation
    address TEXT,
    tier_rating VARCHAR(10) DEFAULT 'tier_b', -- 'tier_a', 'tier_b', 'tier_c'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STAFF & ROLES
CREATE TABLE public.gym_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'receptionist', -- 'owner', 'manager', 'trainer', 'receptionist'
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(gym_id, user_id)
);

-- 3. MEMBERSHIP PLANS
CREATE TABLE public.membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL, -- e.g., '3 Months General', 'Annual VIP'
    duration_months INT NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEMBERS
CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional portal account
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE,
    emergency_contact VARCHAR(15),
    fitness_goal VARCHAR(50) DEFAULT 'general_fitness', -- 'muscle_gain', 'fat_loss', 'strength'
    dietary_preference VARCHAR(30) DEFAULT 'vegetarian', -- 'veg', 'non_veg', 'eggetarian'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'defaulter', 'inactive'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(gym_id, phone)
);

-- 5. SUBSCRIPTIONS & ENROLLMENTS
CREATE TABLE public.member_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.membership_plans(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_fee_inr NUMERIC(10, 2) NOT NULL,
    discount_inr NUMERIC(10, 2) DEFAULT 0.00,
    final_amount_inr NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PAYMENTS & TRANSACTIONS
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES public.member_subscriptions(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    amount_paid_inr NUMERIC(10, 2) NOT NULL,
    payment_mode VARCHAR(20) NOT NULL, -- 'cash', 'upi', 'card', 'bank_transfer'
    transaction_ref VARCHAR(100), -- UPI reference ID or Cash Voucher No.
    received_by UUID REFERENCES public.gym_staff(id),
    payment_date TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ATTENDANCE LOGS
CREATE TABLE public.attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ DEFAULT NOW(),
    check_out_time TIMESTAMPTZ,
    method VARCHAR(20) DEFAULT 'manual_search' -- 'manual_search', 'qr_code', 'biometric'
);

-- 8. EQUIPMENT INVENTORY
CREATE TABLE public.equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'cardio', 'strength_machine', 'free_weights'
    purchase_date DATE,
    warranty_expiry DATE,
    last_serviced_date DATE,
    next_service_due DATE,
    status VARCHAR(30) DEFAULT 'operational', -- 'operational', 'needs_service', 'out_of_order'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- Helper Function: Get Gym ID for the authenticated staff user
CREATE OR REPLACE FUNCTION public.get_auth_gym_id()
RETURNS UUID AS $$
    SELECT gym_id FROM public.gym_staff WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Staff Policy: Can read and manage records belonging strictly to their Gym
CREATE POLICY gym_staff_isolation_policy ON public.members
    FOR ALL
    USING (gym_id = public.get_auth_gym_id())
    WITH CHECK (gym_id = public.get_auth_gym_id());

CREATE POLICY gym_staff_payments_policy ON public.payments
    FOR ALL
    USING (gym_id = public.get_auth_gym_id())
    WITH CHECK (gym_id = public.get_auth_gym_id());

CREATE POLICY gym_staff_attendance_policy ON public.attendance_logs
    FOR ALL
    USING (gym_id = public.get_auth_gym_id())
    WITH CHECK (gym_id = public.get_auth_gym_id());
```

---

## 6. Technical Architecture Overview

```
                          ┌───────────────────────────────────────┐
                          │   Client Browser / Mobile PWA (React)  │
                          │   Next.js 14 App Router, TypeScript   │
                          │   Tailwind CSS + shadcn/ui            │
                          └───────────────────┬───────────────────┘
                                              │ HTTPS / WSS
                                              ▼
                          ┌───────────────────────────────────────┐
                          │         Next.js Server Actions        │
                          │         & API Route Handlers          │
                          └───────────┬──────────────────────┬────┘
                                      │                      │
                   ┌──────────────────▼────┐      ┌──────────▼──────────────┐
                   │  Supabase Client SDK  │      │  AI Fitness Service     │
                   │  (Auth, DB, Realtime) │      │  (Gemini API / Fallback)│
                   └──────────┬────────────┘      └─────────────────────────┘
                              │
                              ▼
                   ┌───────────────────────────────────────┐
                   │       Supabase PostgreSQL 15          │
                   │  - Row Level Security (RLS)           │
                   │  - Attendance & Financial Ledgers     │
                   │  - Exercise Directory & Templates     │
                   └───────────────────────────────────────┘
```

### Architectural Key Points:
1. **Next.js Server Components & Server Actions:** Server-side execution keeps sensitive business rules away from client bundles and enables fast initial page loads even on 3G/4G networks.
2. **Supabase Auth & RLS Multi-Tenancy:** Multi-tenant boundaries are strictly enforced at the database layer using Postgres RLS and `get_auth_gym_id()`. Even a misconfigured API route cannot leak one gym's member or financial data to another.
3. **Resilient Offline-Tolerant Workout Fallback:** AI prompts call Google Gemini models with structured JSON schemas. If the API fails or times out (after 4.0 seconds), execution instantly switches to the deterministic template engine stored in PostgreSQL.

---

## 7. Prioritized Feature Roadmap (MVP vs. Phase 2)

| Priority | Feature / Module | Scope Detail | Target Milestone |
| :---: | :--- | :--- | :--- |
| **P0** | Multi-tenant Auth & Staff Roles | Gym Owner & Receptionist roles with isolated database RLS | MVP Day 1 |
| **P0** | Member Registration & Plan Assignment | Capture phone, photo, plan duration, calculate expiry | MVP Day 1 |
| **P0** | Cash & UPI Payment Recording | Record dues, partial payments, generate instant WhatsApp link | MVP Day 1 |
| **P0** | Fast Attendance Check-in | 4-digit search & QR scan with overdue alert banners | MVP Day 1 |
| **P0** | Exercise Library & Workout Logger | Top 50+ exercises, set/rep inputs, busy-machine swap button | MVP Day 1 |
| **P0** | Offline Deterministic Plan Fallback | Pre-compiled PPL / Full Body templates for zero downtime | MVP Day 1 |
| **P1** | Lead / Enquiry Management | Track visitor phone numbers and follow-up callbacks | Phase 2 (Month 2) |
| **P1** | Equipment Maintenance Logs | Downtime tracking and repair cost auditing | Phase 2 (Month 2) |
| **P1** | AI Diet Plan Generator | Vegetarian/Eggetarian macro breakdowns with Indian staples | Phase 2 (Month 2) |
| **P2** | Biometric Hardware SDK Bridge | Integration with eSSL / Realtime fingerprint/face scanners | Phase 3 |
| **P2** | Automated Payment Gateway (Razorpay) | In-app credit card / net banking renewal checkouts | Phase 3 |

---

## 8. Key Assumptions & Unresolved Questions

### 8.1. Operational Assumptions
1. **UPI Adoption:** Virtually 90%+ of non-cash transactions in Indian gyms occur over Dynamic/Static UPI VPAs (GPay, PhonePe, Paytm). The MVP relies on recording the UPI reference ID and displaying the gym's UPI QR code rather than forcing a 2% payment gateway processing fee on the gym owner.
2. **WhatsApp as Primary Notification Channel:** Indian gym members ignore SMS and emails. All communications (receipts, dues alerts, workout plan summaries) must be formatted for direct WhatsApp dispatch.
3. **Single Device Reception:** Reception counters typically have a single Windows desktop or tablet. The interface must support rapid keyboard shortcuts (`/` for search, `Enter` to confirm, `Esc` to close).

### 8.2. Unresolved Questions for Stakeholder Alignment
1. **Biometric Machine Protocols:** Which brand of biometric turnstiles/devices are most common in target gyms (e.g., eSSL, ZKTeco, Matrix)? Should we offer a lightweight local Node.js relay agent for push sync in Phase 2?
2. **Taxation & GST Compliance:** Do target gyms require GST calculation (18% Gym Membership GST) on invoices, or should GST be optional/toggleable per gym in settings? *(Recommendation: Configurable toggle in Gym Settings).*
3. **Diet Allergen & Medical Disclaimers:** What explicit legal disclaimer text is required on the AI diet suggestions to protect the SaaS platform from liability?
