# GymPRO India - Comprehensive Engineering Context & System Architecture

> **Notice for AI Coding Agents:** This file is the single, complete source of truth for GymPRO India. When starting a new conversation session, analyze this file to immediately gain 100% technical and domain context without needing to inspect multiple files.

---

## 1. Executive Product Overview

- **Product Name:** **GymPRO India**
- **Domain:** Multi-Tenant Commercial Gym Operating System, Front-Desk Reception Engine, and Member/Trainer Enablement SaaS.
- **Target Market:** Commercial strength arenas, neighborhood fitness clubs, powerlifting gyms, and multi-branch franchises across Tier 1, 2, and 3 Indian cities.
- **Primary Problem Solved:** Eliminates chaotic paper registers, untracked cash collections, and revenue leakage during crowded peak hours (6:30 AM - 9:30 AM & 6:30 PM - 10:00 PM). Provides sub-10ms attendance check-in, 1-click WhatsApp payment receipts, automated UPI dues recovery, and Indian diet/workout taxonomy.
- **Repository Path:** `/Users/princegupta/Downloads/GymPRO`
- **Active Git Branch:** `main`

---

## 2. Technology Stack & Key Dependencies

```json
{
  "framework": "Next.js 16.4.0 (App Router, Turbopack, Partial Prerendering)",
  "language": "TypeScript 5 (Strict Mode)",
  "runtime": "React 19.3.0 & React-DOM 19.3.0",
  "styling": "Tailwind CSS v4 (@tailwindcss/turbopack), PostCSS, CSS Variables",
  "icons": "lucide-react (Zero unicode emoji icons in UI)",
  "animation": "framer-motion 14.1.1 (Tactile spring transitions, no cursor effects)",
  "database": "Supabase PostgreSQL (@supabase/supabase-js, @supabase/ssr)",
  "offline_persistence": "LocalStorage (AppStorage fallback engine in src/lib/storage.ts)",
  "audio": "Web Audio API synthesized sound cues (src/lib/audio.ts)"
}
```

---

## 3. Database Schema & Multi-Tenant SQL Architecture

The complete database is defined in `supabase_setup.sql`. The system employs **Multi-Tenant Scoping** using `gym_id` on all operational tables with Row Level Security (RLS) enabled.

### 3.1. Tables & Column Specifications

#### 1. `members` Table
```sql
CREATE TABLE IF NOT EXISTS members (
  id                 VARCHAR PRIMARY KEY,
  gym_id             VARCHAR DEFAULT 'gym-ironpulse',
  full_name          VARCHAR NOT NULL,
  phone              VARCHAR NOT NULL,               -- 10-digit Indian mobile number
  gender             VARCHAR NOT NULL,               -- 'male' | 'female' | 'other'
  age                INTEGER NOT NULL,
  plan_id            VARCHAR NOT NULL,               -- e.g. 'plan-1m', 'plan-3m', 'plan-6m', 'plan-1y'
  plan_name          VARCHAR NOT NULL,               -- e.g. 'Monthly General', 'Annual Elite All-Access'
  start_date         VARCHAR NOT NULL,               -- YYYY-MM-DD
  end_date           VARCHAR NOT NULL,               -- YYYY-MM-DD
  total_fee_inr      NUMERIC NOT NULL DEFAULT 0,
  paid_amount_inr    NUMERIC NOT NULL DEFAULT 0,
  pending_due_inr    NUMERIC NOT NULL DEFAULT 0,
  status             VARCHAR NOT NULL DEFAULT 'active', -- 'active' | 'expired' | 'defaulter' | 'trial'
  emergency_contact  VARCHAR,
  fitness_goal       VARCHAR NOT NULL DEFAULT 'general_fitness', -- 'muscle_gain' | 'fat_loss' | 'strength' | 'general_fitness'
  dietary_preference VARCHAR NOT NULL DEFAULT 'vegetarian',      -- 'vegetarian' | 'eggetarian' | 'non_veg'
  avatar_seed        VARCHAR,
  created_at         TIMESTAMPTZ DEFAULT now()
);
```

#### 2. `attendance` Table
```sql
CREATE TABLE IF NOT EXISTS attendance (
  id              VARCHAR PRIMARY KEY,
  gym_id          VARCHAR DEFAULT 'gym-ironpulse',
  member_id       VARCHAR NOT NULL,
  member_name     VARCHAR NOT NULL,
  phone           VARCHAR NOT NULL,
  check_in_time   VARCHAR NOT NULL,                 -- ISO timestamp with +05:30 TZ
  check_in_method VARCHAR NOT NULL,                 -- 'phone_search' | 'qr_scan'
  plan_status     VARCHAR NOT NULL,                 -- 'active' | 'expired' | 'defaulter'
  pending_due_inr NUMERIC NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

#### 3. `payments` Table
```sql
CREATE TABLE IF NOT EXISTS payments (
  id              VARCHAR PRIMARY KEY,
  gym_id          VARCHAR DEFAULT 'gym-ironpulse',
  member_id       VARCHAR NOT NULL,
  member_name     VARCHAR NOT NULL,
  amount_inr      NUMERIC NOT NULL,
  payment_mode    VARCHAR NOT NULL,                 -- 'cash' | 'upi' | 'card' | 'netbanking' | 'other'
  transaction_ref VARCHAR,                          -- UPI reference or bank txn ID
  timestamp       VARCHAR NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

#### 4. `equipment` Table
```sql
CREATE TABLE IF NOT EXISTS equipment (
  id                    VARCHAR PRIMARY KEY,
  gym_id                VARCHAR DEFAULT 'gym-ironpulse',
  name                  VARCHAR NOT NULL,
  category              VARCHAR NOT NULL,          -- 'strength_machine' | 'free_weights' | 'cardio' | 'cable_station'
  tier                  VARCHAR NOT NULL,          -- 'tier_a' | 'tier_b' | 'tier_c'
  status                VARCHAR NOT NULL DEFAULT 'operational', -- 'operational' | 'needs_service' | 'out_of_order'
  last_serviced_date    VARCHAR NOT NULL,
  next_service_due_date VARCHAR NOT NULL,
  notes                 TEXT
);
```

#### 5. `leads` Table
```sql
CREATE TABLE IF NOT EXISTS leads (
  id              VARCHAR PRIMARY KEY,
  gym_id          VARCHAR DEFAULT 'gym-ironpulse',
  full_name       VARCHAR NOT NULL,
  phone           VARCHAR NOT NULL,
  interest        VARCHAR NOT NULL,                 -- e.g. 'Muscle Gain', 'Fat Loss', 'Strength'
  status          VARCHAR NOT NULL DEFAULT 'new',   -- 'new' | 'contacted' | 'trial_scheduled' | 'trial_completed' | 'converted'
  created_at      VARCHAR NOT NULL,
  follow_up_date  VARCHAR NOT NULL
);
```

#### 6. `gym_profiles` Table (Central Multi-Tenant CMS)
```sql
CREATE TABLE IF NOT EXISTS gym_profiles (
  id                VARCHAR PRIMARY KEY,
  slug              VARCHAR UNIQUE NOT NULL,        -- Used in URL: /gym/[slug]
  gym_name          VARCHAR NOT NULL,
  tagline           TEXT,
  hero_headline     TEXT,
  hero_highlight    TEXT,
  hero_subtitle     TEXT,
  hero_image_url    TEXT,
  logo_url          TEXT,
  primary_color     VARCHAR DEFAULT '#ccff00',      -- Brand Volt Green
  accent_color      VARCHAR DEFAULT '#b8e600',
  secondary_color   VARCHAR DEFAULT '#121724',
  phone             VARCHAR,
  email             VARCHAR,
  whatsapp_number   VARCHAR,
  upi_vpa           VARCHAR,                        -- e.g. 'ironpulse@oksbi'
  address           TEXT,
  city              VARCHAR,
  state             VARCHAR,
  pincode           VARCHAR,
  operating_hours   TEXT,
  features          JSONB DEFAULT '[]'::jsonb,
  programs          JSONB DEFAULT '[]'::jsonb,
  membership_plans  JSONB DEFAULT '[]'::jsonb,
  trainers          JSONB DEFAULT '[]'::jsonb,
  transformations   JSONB DEFAULT '[]'::jsonb,
  is_published      BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
```

### 3.2. Performance Indexes (Sub-10ms Scan Target)
- `idx_members_phone` on `members(phone)`
- `idx_members_status` on `members(status)`
- `idx_members_gym_id` on `members(gym_id)`
- `idx_attendance_member_id` on `attendance(member_id)`
- `idx_attendance_check_in_time` on `attendance(check_in_time DESC)`
- `idx_payments_member_id` on `payments(member_id)`
- `idx_gym_profiles_slug` on `gym_profiles(slug)`

### 3.3. Row Level Security (RLS) Policies
- All tables have RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
- Insert guards validate phone format (`length(phone) >= 10`), names, and non-negative payment values (`amount_inr > 0`).

---

## 4. Server Layer & Clean Architecture

The server codebase (`src/server/`) follows a decoupled Clean Architecture pattern:

```
src/server/
├── db/
│   └── supabase.ts           # Supabase client instantiation with isDbConnected() check
├── repositories/             # Direct DB abstraction with fallback guards
│   ├── memberRepository.ts   # CRUD operations, status normalization, row-to-model mapping
│   ├── attendanceRepository.ts # Check-in logging, daily attendance aggregation
│   ├── paymentRepository.ts  # Financial payment recording
│   ├── equipmentRepository.ts# Asset maintenance tracking
│   ├── leadRepository.ts     # Prospect pipeline management
│   └── gymRepository.ts      # Multi-tenant branch profile management
├── services/                 # Pure business logic and domain aggregations
│   ├── analyticsService.ts   # Calculates MRR, churn rate, retention, payment mode breakdown
│   ├── renewalAlertService.ts# Evaluates expiration urgency (0-30 days) and alert generation
│   └── accountingExportService.ts # Generates Tally/CSV structured transaction exports
└── controllers/              # HTTP request parsing and response structuring
    ├── memberController.ts   # REST handlers for /api/members
    └── gymController.ts      # REST handlers for /api/gyms
```

### 4.1. Dual-Mode Persistence & Offline Fallback Model
1. **Cloud Mode:** If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided and valid, repositories query Supabase PostgreSQL.
2. **Offline / Standalone Mode:** If Supabase is unconfigured or offline, `isDbConnected()` returns `false`. Client modules gracefully read and write to `AppStorage` (`src/lib/storage.ts`) using browser `localStorage` seeded with pre-loaded realistic Indian gym data from `src/lib/mockData.ts`.
3. **Cross-Tab Reactivity:** `src/lib/useGymData.ts` listens for `storage` events so changes in the Admin Dashboard (e.g. adding a member, recording a payment) instantly reflect in the Member and Trainer portals.

---

## 5. Application Routes & Sitemap

| Route Path | Type | Role / Function | Key Files |
| :--- | :--- | :--- | :--- |
| `/` | Static | Public landing page, product hero, operational metrics, architecture diagram, pricing grid, and equipment ticker. | `src/app/page.tsx`, `MoveShowcase.tsx`, `Pricing02.tsx` |
| `/admin` | Static / Client | Master Front-Desk Operations Center containing 11 integrated operational management tabs. | `src/app/admin/page.tsx`, `OperationsDashboard.tsx` |
| `/member` | Static / Client | Mobile-first athlete web portal for digital ID pass, attendance streak, routine logger, and diet plan. | `src/app/member/page.tsx`, `MemberPortal.tsx` |
| `/trainer` | Static / Client | Coach command desk for athlete roster, routine assignment, coaching sessions, and diet customization. | `src/app/trainer/page.tsx`, `TrainerPortal.tsx` |
| `/gym/[slug]` | Dynamic / Prerender | Multi-tenant custom landing page for registered gym branches (custom branding, fees, amenities). | `src/app/gym/[slug]/page.tsx` |
| `/privacy` | Static | DPDP Act (India) and GDPR compliant operational data privacy policy. | `src/app/privacy/page.tsx` |
| `/terms` | Static | Commercial SaaS operating terms, UPI payment regulations, and member access agreements. | `src/app/terms/page.tsx` |
| `/api/...` | Dynamic | REST endpoints for members, attendance, equipment, payments, leads, and analytics reports. | `src/app/api/*` |

---

## 6. The 11 Operations Command Center Tabs (`/admin`)

Located in `src/components/operations/`:

1. **`OverviewTab.tsx`**: High-density front-desk command strip. Instant 4-digit phone search check-in, real-time checked-in roster, quick member stats, urgent dues ticker, and audio sound triggers.
2. **`MembersTab.tsx`**: Complete membership roster. Filter by Active, Expired, Defaulter, or Trial. Add new member modal trigger with auto-calculated end dates and payment ledger.
3. **`AttendanceTab.tsx`**: Daily check-in audit log with timestamp, check-in method (QR vs Search), plan status, and pending balance badge.
4. **`DuesTab.tsx`**: Overdue fee recovery matrix. Direct 1-click WhatsApp due reminder generator with pre-filled UPI VPA and amount.
5. **`LeadsTab.tsx`**: Walk-in enquiry and trial booking pipeline (New, Contacted, Trial Scheduled, Trial Completed, Converted).
6. **`EquipmentTab.tsx`**: Asset maintenance register. Categorized by free weights, strength machines, cardio, and cable stations. Tracking service intervals and out-of-order downtime.
7. **`AdminInvoicesDesk.tsx`**: Detailed invoice generator, receipt ledger, and PDF/WhatsApp invoice dispatch desk.
8. **`WorkoutsTab.tsx`**: Workout routine builder and assignment engine. Displays sets, target reps, RPE, rest timers, and exercise cues.
9. **`DietTab.tsx`**: Nutrition plan manager with Indian macros (Protein, Carbs, Fats, Calories) and meal splits tailored for Indian diets.
10. **`TrainersTab.tsx`**: Staff trainer roster, specializations, coach-to-member assignment, and session schedules.
11. **`GymCmsManager.tsx`**: Full multi-tenant landing page customizer. Real-time visual preview of branch landing pages with color scheme presets (Volt Green, Cyber Cyan, Crimson Fury, Electric Amber, Emerald Peak, Steel Slate).

---

## 7. Strict UI/UX Finish Gate & Aesthetic Rules (Zero Tolerance)

All engineering additions or modifications **MUST** strictly follow these rules:

1. **Strictly NO Purple / Violet / Fuchsia:**
   - Never use purple gradients or tones (`#a855f7`, `#c084fc`, `#9333ea`, `#8b5cf6`, `#7c3aed`).
   - Approved Primary Accent: Neon Volt Green (`#ccff00`).
   - Approved Secondary Accents: Cyber Cyan (`#06b6d4`), Amber (`#f59e0b`), Rose (`#f43f5e`), Emerald (`#10b981`), Steel Slate (`#94a3b8`).
   - Backgrounds: Dark tactical slate (`#060709`, `#0d1117`, `#121622`).

2. **Strictly NO Pill-Shaped Buttons:**
   - Do **NOT** use `rounded-full` or `rounded-[53px]` for action buttons, modals, or CTAs.
   - Standard button styling: `rounded-xl` or `rounded-lg` with tactile active states.
   - Small badges and tags: `rounded-md` or `rounded-lg`.
   - Circular avatars and live status dots may use `rounded-full`.

3. **Strictly NO Unicode Emoji Icons:**
   - Do **NOT** use unicode emojis (`🏋️‍♂️`, `💪`, `🔥`, `📞`, `🎯`, `🥗`, `💳`) in public UI, admin dashboards, or automated WhatsApp templates.
   - Always use official vector icons from `lucide-react` (e.g. `<Dumbbell>`, `<Phone>`, `<Target>`, `<Utensils>`, `<CreditCard>`).

4. **Strictly NO Em Dashes (`—`) or En Dashes (`–`):**
   - Standardize entirely on clean standard ASCII hyphens (`-`).

5. **Strictly NO "Vibe-Product" AI Slop or Vague Slogans:**
   - Reject generic slogans like *"Unleash Your Limits"* or *"Empower Your Soul"*.
   - Use concrete, verifiable commercial capabilities:
     - `SUB-10MS RECEPTION SCAN`
     - `AUTOMATED UPI RECOVERY`
     - `BIOMETRIC TURNSTILE SYNC`
     - `COMMERCIAL STRENGTH ARENA. OPERATIONAL PRECISION.`

6. **Strictly NO Fake Reviews, Fake Counters, or Particle Slop:**
   - No mock 5-star customer review carousels, fake client counters, or drifting canvas particle animations reacting to mouse proximity.

---

## 8. Indian Commercial Gym Context & Domain Rules

1. **Phone Numbers & Country Code:**
   - Indian phone numbers are 10 digits. The system utility `cleanIndianPhone()` in `src/lib/whatsapp.ts` guarantees phone numbers format to `91XXXXXXXXXX` for WhatsApp click-to-chat links.

2. **Currency & Fee Calculations:**
   - Currency is Indian Rupee (`₹` / `INR`).
   - Standard duration plans: 1 Month, 3 Months (Quarterly), 6 Months (Half-Yearly), 12 Months (Annual).
   - Defaulter definition: `pendingDueInr > 0` or membership expired.

3. **Peak Rush-Hour Equipment Substitution Engine:**
   - Indian gyms experience severe equipment congestion during morning (6:30 AM - 9:30 AM) and evening (6:30 PM - 10:00 PM) slots.
   - `WORKOUT_EXERCISES_AND_TAXONOMY.md` establishes automatic equipment substitution rules:
     - Flat Barbell Bench Press occupied -> Swap to Dumbbell Flat Press / Push-ups.
     - Lat Pulldown occupied -> Swap to Seated Cable Row / Dumbbell Single-Arm Row.
     - 45° Leg Press occupied -> Swap to Barbell Front Squat / Bulgarian Split Squats.
     - Cable Crossover occupied -> Swap to Dumbbell Flyes / Pec Deck Machine.

4. **Regional Indian Nutrition Engine:**
   - Nutrition models support three primary dietary preferences:
     - `vegetarian`: High-protein Indian staples (Paneer, Soya Chunks with 52% dry protein density, Sprouted Moong, Dal, Greek Curd, Roasted Chana, Whey).
     - `eggetarian`: Boiled eggs, egg-white bhurji, plus vegetarian staples.
     - `non_veg`: Chicken breast, egg whites, fish, mutton, plus vegetarian staples.

---

## 9. WhatsApp Integration & Automated Templates

Located in `src/lib/whatsapp.ts`:

- **Payment Receipt Dispatch:**
  Generates direct `https://wa.me/91XXXXXXXXXX?text=...` link with formatted receipt details:
  Amount Paid, Payment Mode (UPI/Cash/Card), Reference ID, Plan Validity End Date, and Remaining Pending Due.
- **Overdue Fee Renewal Reminder:**
  Includes Member Name, Plan Name, Due Amount, Due Date, and the Gym's Direct UPI VPA (`gymname@oksbi`) for instant GPay / PhonePe / Paytm settlement.
- **Expiry Warning Messages:**
  Triggered at 3 days before expiry, day of expiry, and post-expiry with renewal pricing incentives.

---

## 10. Financial Analytics Computation (`src/lib/analytics.ts`)

- **Total Revenue (INR):** Sum of all recorded payments in the payments ledger.
- **Total Pending Dues (INR):** Sum of `pendingDueInr` across all active and defaulter members.
- **Monthly Run Rate (MRR):** Normalized monthly revenue computed as `totalFeeInr / durationInMonths` for each active member.
- **Retention Rate:** `(activeMembers / totalMembers) * 100`.
- **Churn Rate:** `(expiredMembers / totalMembers) * 100`.
- **Projected Renewals:** Revenue expected from members expiring within the next 30 days.

---

## 11. Engineering Workflows & Verification Protocol

### Terminal Commands

```bash
# Start Next.js local development server with Turbopack
npm run dev

# Run full TypeScript validation & Next.js production build (Must pass with 0 errors)
npm run build

# Run ESLint validation
npm run lint
```

### Pre-Commit Checklist
- [x] `npm run build` succeeds with zero errors.
- [x] Zero purple colors or gradients across code and CSS.
- [x] Zero pill-shaped buttons (`rounded-full` replaced with `rounded-xl` or `rounded-lg`).
- [x] Zero unicode emoji characters in UI and WhatsApp templates.
- [x] Zero em dashes (`—`) or en dashes (`–`) (standard hyphens `-` only).
- [x] Favicon verified at `/icon.svg`.
- [x] Privacy Policy (`/privacy`) and Terms (`/terms`) accessible and linked in footer.
