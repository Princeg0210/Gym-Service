# GymPRO India - Project Context & Engineering Architecture

> **Purpose:** This file provides complete, unambiguous context for AI pair programmers and engineering agents working on GymPRO. When starting a new conversation, instruct the agent to **"Analyze CONTEXT.md"** to immediately synchronize on the product state, technical stack, architecture, design constraints, and active conventions.

---

## 1. Executive Summary

- **Product:** **GymPRO India**
- **Domain:** Multi-tenant B2B2C Commercial Gym Operating System, Front-Desk Reception Engine, and Member/Trainer Enablement Platform.
- **Target Market:** Indian commercial gyms, neighborhood fitness centers, strength arenas, and multi-branch franchises.
- **Key Pain Point Solved:** Replaces chaotic paper registers, Excel sheets, and revenue leakage with sub-10ms attendance check-in, automated UPI overdue recovery via WhatsApp, biometric turnstile synchronization, and localized Indian workout/diet taxonomy.
- **Repository Root:** `/Users/princegupta/Downloads/GymPRO`
- **Current Git Branch:** `main`

---

## 2. Technology Stack & Key Dependencies

- **Framework:** Next.js **16.4.0** (App Router, Turbopack, Partial Prerendering enabled, React 19.3.0).
- **Language:** TypeScript 5 (Strict mode).
- **Styling:** Tailwind CSS v4 (`@tailwindcss/turbopack`), PostCSS, custom design tokens.
- **Icons:** `lucide-react` (Strictly NO unicode emojis in UI).
- **Animation:** `framer-motion` (Micro-interactions, modal spring transitions only; no intrusive cursor animations).
- **Database / Backend:**
  - **Cloud:** Supabase PostgreSQL with Row Level Security (RLS) via `@supabase/supabase-js` and `@supabase/ssr`.
  - **Offline Fallback / Hybrid Storage:** `src/lib/storage.ts` (`AppStorage`) and `src/lib/db.ts` providing 100% offline uptime when internet or Supabase credentials are unavailable.
- **Audio Feedback:** Synthesized web audio feedback (`src/lib/audio.ts`) for successful check-ins, error states, and payment alerts.

---

## 3. Application Routes & Sitemap

| Route | Type | Description | Primary Component / File |
| :--- | :--- | :--- | :--- |
| `/` | Static | Public landing page, product showcase, facility architecture, pricing tiers, and equipment ticker. | `src/app/page.tsx`, `MoveShowcase.tsx`, `Pricing02.tsx` |
| `/admin` | Static / Client | Unified Front-Desk Operations Dashboard (11 sub-tabs: Overview, Members, Attendance, Dues, Leads, Equipment, Invoices, Workouts, Diet, Trainers, CMS). | `src/app/admin/page.tsx`, `OperationsDashboard.tsx` |
| `/member` | Static / Client | Mobile-first athlete portal (attendance streak, active validity pass, daily workout logging, meal targets). | `src/app/member/page.tsx`, `MemberPortal.tsx` |
| `/trainer` | Static / Client | Coach portal for athlete roster management, session scheduling, routine assignment, and progress tracking. | `src/app/trainer/page.tsx`, `TrainerPortal.tsx` |
| `/gym/[slug]` | Dynamic / Prerender | Multi-tenant branded landing pages for individual gym branches with customizable color palettes, pricing, and amenities. | `src/app/gym/[slug]/page.tsx` |
| `/privacy` | Static | DPDP (Digital Personal Data Protection Act India) and GDPR compliant operational privacy policy. | `src/app/privacy/page.tsx` |
| `/terms` | Static | Commercial gym SaaS membership terms, UPI payment terms, and operating standards. | `src/app/terms/page.tsx` |
| `/api/...` | Server Routes | REST endpoints for members, attendance, equipment, dues, analytics, exports, and multi-tenant gym profiles. | `src/app/api/*` |

---

## 4. Directory Structure

```
GymPRO/
├── .agents/                      # Custom AI agent skill configurations
├── docs/                         # Additional architecture documentation
├── public/                       # Static public assets (images, sound assets, manifest)
├── src/
│   ├── app/                      # Next.js App Router pages and API routes
│   │   ├── admin/                # Receptionist & owner dashboard route
│   │   ├── api/                  # Backend REST API routes
│   │   ├── gym/[slug]/           # Tenant-specific public landing pages
│   │   ├── member/               # Athlete web portal route
│   │   ├── privacy/              # Privacy Policy page
│   │   ├── terms/                # Terms and Conditions page
│   │   ├── trainer/              # Trainer/Coach portal route
│   │   ├── globals.css           # Global Tailwind v4 CSS and utility classes
│   │   ├── icon.svg              # GymPRO kinetic dual-slash mark favicon
│   │   └── layout.tsx            # Root layout with font definitions and metadata
│   ├── client/                   # Client-side helpers, formatters, and custom hooks
│   ├── components/               # UI components
│   │   ├── modals/               # AddMemberModal, QRScanModal, RecordPaymentModal, etc.
│   │   ├── operations/           # 11 Operations tabs (OverviewTab, MembersTab, AttendanceTab, etc.)
│   │   ├── ClubShowcase.tsx      # Feature showcase & operational comparison
│   │   ├── Footer.tsx            # Global site footer with verified operational links
│   │   ├── GymProLogo.tsx        # High-res SVG kinetic power mark
│   │   ├── Header.tsx            # Sticky desktop/mobile header navigation
│   │   ├── MoveShowcase.tsx      # Operational hero showcase with metrics
│   │   ├── OperationsDashboard.tsx # Master admin command center
│   │   └── Pricing02.tsx         # Commercial pricing tier grid
│   ├── lib/
│   │   ├── audio.ts              # Web Audio API sound synthesis
│   │   ├── mockData.ts           # Pre-loaded mock Indian members, workouts, and diet items
│   │   ├── mockGyms.ts           # Multi-tenant gym demo branches
│   │   ├── storage.ts            # LocalStorage persistence layer
│   │   └── whatsapp.ts           # 1-Click WhatsApp template generator (Due alerts, Receipts)
│   ├── server/                   # Clean-architecture server layer (controllers, repos, services)
│   └── types/                    # Central TypeScript interfaces (Member, Plan, Attendance, etc.)
├── CONTEXT.md                    # THIS FILE (Master engineering context)
├── DESIGN.md                     # High-density design tokens and system specification
├── FRONTEND_DESIGN_CONTRACT.md   # Hard UI/UX finish gate rules
├── PRD_GYM_MANAGEMENT_SAAS.md    # Product requirements document
├── WORKOUT_EXERCISES_AND_TAXONOMY.md # Indian commercial gym exercise taxonomy & swaps
└── supabase_setup.sql            # PostgreSQL schema and RLS policies
```

---

## 5. Strict Aesthetic & Design Rules (Zero Tolerance)

All code modifications **MUST** adhere to the following rules:

1. **NO Purple / Violet / Fuchsia:**
   - Never use purple gradients or accents (`#a855f7`, `#c084fc`, `#9333ea`, `#8b5cf6`, `#7c3aed`, etc.).
   - Primary Accent: Neon Volt Green (`#ccff00`).
   - Secondary Accents: Cyber Cyan (`#06b6d4`), Amber (`#f59e0b`), Rose (`#f43f5e`), Emerald (`#10b981`), Slate (`#94a3b8`).
   - Backgrounds: Dark tactical slate (`#060709`, `#0d1117`, `#121622`).

2. **NO Pill-Shaped Buttons:**
   - Do **NOT** use `rounded-full` or `rounded-[53px]` for action buttons or CTAs.
   - Standard button radius: `rounded-xl` or `rounded-lg`.
   - Small badges: `rounded-md` or `rounded-lg`.
   - Status dots and circular avatars may use `rounded-full`.

3. **NO Unicode Emoji Icons:**
   - Never use emojis (`🏋️‍♂️`, `💪`, `🔥`, `📞`, `🎯`, `🥗`, etc.) in the UI or in WhatsApp notification templates.
   - Always use corresponding icons from `lucide-react` (e.g., `<Dumbbell>`, `<Phone>`, `<Target>`, `<Utensils>`).

4. **NO Em Dashes (`—`) or En Dashes (`–`):**
   - Strictly standardize on standard ASCII hyphens (`-`).

5. **NO "Vibe-Product" AI Slop or Vague Hero Text:**
   - Avoid meaningless slogans ("Shift Your Limits", "Unleash Your Inner Beast").
   - Ground copy in verifiable commercial capabilities:
     - `SUB-10MS RECEPTION SCAN`
     - `AUTOMATED UPI RECOVERY`
     - `BIOMETRIC TURNSTILE SYNC`
     - `COMMERCIAL STRENGTH ARENA. OPERATIONAL PRECISION.`

6. **NO Fake Reviews, Fake Counters, or Over-the-Top Animations:**
   - No fake star ratings, stock photo reviews, or drifting canvas particle physics reacting to cursor proximity.
   - Keep animations focused on fast, responsive UI transitions and tactile micro-interactions.

---

## 6. Indian Gym Context & Domain Rules

1. **Phone Numbers & Country Code:**
   - All member searches and WhatsApp notifications default to the Indian dial code (`+91`). Phone numbers are typically 10 digits.
2. **Currency & Dues Recovery:**
   - Currency is Indian Rupee (`₹` / `INR`).
   - Automated UPI payment links generated for WhatsApp include VPA handling and instant fee receipt generation.
3. **Dietary Taxonomy:**
   - Indian fitness diets are classified into:
     - `vegetarian`: High-protein options like Paneer, Soya Chunks (52% protein), Dal, Curd, Roasted Chana, Whey.
     - `eggetarian`: Boiled eggs, egg-white omelette, plus vegetarian staples.
     - `non-vegetarian`: Chicken breast, fish, eggs, mutton.
4. **Workout Swaps for Busy Rush Hours:**
   - Indian gyms experience severe rush hours (6:30 AM - 9:30 AM & 6:30 PM - 10:00 PM).
   - The system features alternative equipment swaps (e.g., Dumbbell Press instead of occupied Barbell Bench Press; Cable Rows instead of occupied Lat Pulldown machine).

---

## 7. Storage & Architecture Flow

- **Dual-Mode Persistence:**
  - When Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are present, the app can sync to PostgreSQL tables defined in `supabase_setup.sql`.
  - In local development or standalone deployments, `AppStorage` (`src/lib/storage.ts`) automatically seeds initial data from `mockData.ts` and persists all additions, edits, check-ins, and payments in `localStorage`.
- **Zero Build Failures:**
  - All changes must pass `npm run build` without any TypeScript or lint warnings.

---

## 8. Quick Verification Commands

```bash
# Run local dev server
npm run dev

# Run TypeScript & Next.js production build verification
npm run build

# Check code formatting and lints
npm run lint
```
