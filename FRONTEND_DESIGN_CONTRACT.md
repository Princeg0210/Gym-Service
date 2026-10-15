# Frontend Design Contract & Anti-"AI Slop" UI Specification
**Project:** Gym Management SaaS (GymPRO India)  
**Methodology:** UI Finish-Gate Reviewer & High-Utility B2B Operational Standards  
**Target Stack:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Radix UI

---

## 1. Core Mission: Eradicating "AI-Generated Frontend" Patterns

Most AI coding assistants generate interfaces that look like interchangeable marketing mockups rather than production software. This document codifies the **Forbidden Defaults** and the **High-Utility Indian Gym Operational Patterns** that must govern all frontend code in this repository.

### 1.1. Prohibited AI Patterns ("Forbidden Defaults")

| Prohibited Pattern | Why It Fails in Indian Gym Operations | Mandatory Engineering Replacement |
| :--- | :--- | :--- |
| **Pastel Gradient Stat Cards** (e.g. 4 cards with purple-to-pink gradients and floating Lucide icons in colored bubbles) | Makes every metric feel equally urgent; wastes vertical space; looks like a generic template. | **Asymmetric High-Signal Metric Ribbon**: Compact, high-contrast numbers. High-urgency metrics (Pending Dues, Inactive Members) visually prioritized over vanity totals. |
| **Glassmorphism & Blurs** (`backdrop-blur-xl`, `bg-white/10`, translucent borders) | GPU-heavy; lags on low-end front-desk Windows 10 PCs and budget Android phones used by gym staff. | **Opaque High-Contrast Surface Layers**: Solid borders (`border-zinc-200 dark:border-zinc-800`), explicit surface hierarchy (`bg-zinc-50`, `bg-white`, `bg-zinc-900`), zero render latency. |
| **Generic Marketing / AI Copy** ("Empower your fitness journey", "Unlock next-level performance") | Frustrates gym owners looking for operational clarity. | **Domain-Specific Operational Microcopy**: "₹45,200 Pending from 18 Members", "12 Expiring in next 7 days", "Attendance recorded for Vikram (Phone: 98765-XXXXX)". |
| **Multi-Step Modal Wizards for Daily Tasks** | Taking 5 clicks to record a cash payment causes queues at the front desk at 7:00 PM. | **Inline / Single-Modal Quick Actions**: Fast dialog with autofocus on amount, one-key submit, and 1-tap WhatsApp receipt trigger. |
| **Slow Decorative Animations & Transitions** (`transition-all duration-500 ease-in-out` on everything) | Slows down data entry; feels sluggish. | **Snappy Micro-interactions**: Strict `<= 150ms` transitions only for meaningful state changes (collapsing trays, focus rings, toast dismissal). |

---

## 2. Product Lens & Primary Personas

### Persona A: Front-Desk Operator / Gym Owner (Desktop / Tablet View)
- **Primary Job:** Process walk-ins, log quick fees (Cash/UPI), detect pending fee defaulters at the entrance, send WhatsApp payment reminders.
- **First-Read Object:** Today’s Pending Dues & Today’s Attendance status.
- **Physical Environment:** Distracted, busy reception counter with 10 members entering simultaneously during evening rush.
- **Keyboard Priority:** Full keyboard accessibility. Press `/` to focus global member search; press `Enter` to check-in.

### Persona B: Gym Member (Mobile View)
- **Primary Job:** Open workout plan, log set weights & reps with sweaty thumbs, swap occupied machines, view membership validity.
- **First-Read Object:** Today's planned workout split and the first exercise set.
- **Physical Environment:** Mobile device held with one hand between sets in a loud, crowded gym floor.

---

## 3. Screen-by-Screen Design Contracts

### Screen 1: Gym Management Dashboard (`/dashboard`)

```markdown
# Front-Desk Operations Dashboard Design Contract

**User + Job:** Gym Owner / Receptionist managing daily traffic and fee collection.
**First-Read Object:** Operational Alert Strip: "₹38,500 pending across 14 members | 6 memberships expiring this week".
**Primary Action:** Quick Member Check-in / Search (Keyboard shortcut: `/`).
**Density Decision:** Compact (High Information Density). A front-desk desk clerk needs to view 15 members on one screen without scrolling.
**Hierarchy:**
  1. Top Alert Strip: High-urgency dues & expirations.
  2. Quick Action Bar: [Check-in by Phone/ID] [Record Payment] [Add Member].
  3. Live Attendance Feed vs Overdue Collections split table.
  4. Secondary stats: Monthly collection summary (compact text, not giant graphs).
**Forbidden Defaults:**
  - No 4-card equal-sized stat grid at the top.
  - No decorative full-bleed charts taking up 60% of the viewport.
  - No generic greeting: "Welcome back, Admin! 👋 Let's crush today's goals!"
```

### Screen 2: Fee Collection & Dues Register (`/billing/dues`)

```markdown
# Dues Collection Register Design Contract

**User + Job:** Recovering unpaid membership fees from existing members.
**First-Read Object:** Member Name + Overdue Days + Pending Amount in bold Indian Rupee format (e.g. ₹2,500, 14 days overdue).
**Primary Action:** "Remind via WhatsApp" (direct `https://wa.me/` deep-link with pre-formatted Hindi/English message).
**Secondary Action:** "Collect Fee" (opens single-stage drawer with UPI QR generator / Cash toggle).
**Density Decision:** Tabular Data Grid with sticky headers and column-level filters (Overdue 1-7 days, 8-15 days, 15+ days).
**Forbidden Defaults:**
  - No multi-page checkout cart flow.
  - No hidden action menus (Three dots menu) for primary tasks. The "WhatsApp" and "Collect" buttons must be visible in the row directly.
```

### Screen 3: Member Workout Logger (`/portal/workouts/today`)

```markdown
# Member Workout Logger Design Contract

**User + Job:** Gym member logging exercise weights and reps on a mobile smartphone while working out.
**First-Read Object:** Current Exercise Name, Target Muscle, and Set 1 input fields (Target: 10 reps @ 60kg).
**Primary Action:** "Log Set & Start 90s Rest Timer".
**Secondary Action:** "Swap Machine" (one-tap fallback if equipment is busy).
**Density Decision:** Mobile Balanced. Large touch targets (minimum 48px height) for weight and rep steppers to avoid mis-clicks with sweaty fingers.
**Hierarchy:**
  1. Exercise header with muscle tag and swap icon.
  2. Rep/Weight table with auto-filled values from the member's previous session.
  3. Floating sticky bottom rest-timer ticker.
**Forbidden Defaults:**
  - Tiny dropdown selectors for weight selection.
  - Autoplaying heavy exercise videos that burn mobile cellular data.
  - Blocking modals that freeze the UI when logging sets.
```

---

## 4. Typography, Palette & Component System Rules

### 4.1. Color System (Tailwind Token Mapping)
Avoid generic bright saturated blues or rainbow AI palettes. Use an athletic, precise, industrial dark/light system:

```css
/* Color Tokens tailored for Gym SaaS */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --border: 240 5.9% 90%;
  
  /* High-signal functional colors */
  --dues-overdue: 0 84.2% 60.2%;       /* Urgent Crimson for unpaid dues */
  --dues-pending: 38 92% 50%;          /* Amber for upcoming expiries */
  --attendance-active: 142.1 76.2% 36.3%; /* Precision Emerald for active checked-in */
  --brand-primary: 240 5.9% 10%;       /* Deep Slate / Carbon (Industrial, clean) */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 6.5%;                /* Charcoal slate card */
  --card-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
}
```

### 4.2. Typography Hierarchy
- **Font Stack:** Clean geometric sans (e.g. `Inter` or `Geist Sans` via `next/font`). Monospace font (`Geist Mono` or `JetBrains Mono`) for all currency amounts (₹), phone numbers, dates, and set/rep metrics to ensure perfect tabular alignment.
- **Indian Rupee Formatting:** Always formatted as `₹1,500` or `₹25,000` using standard Indian numbering format (`en-IN` locale: Lakhs/Crores grouping when applicable).

### 4.3. High-Density Table Standards
- Table row height: Compact `44px` on desktop, allowing 12–15 rows in view above the fold.
- Sticky table header on scroll.
- Zero empty white cards: When a table has 0 results, show an actionable empty state with a shortcut (e.g., `"No pending dues today. Press 'N' to register a new member."`).

---

## 5. UI Finish Gate Checklist (Shipment Verification)

Before any frontend page is merged or approved, it must pass this 6-point verification:

- [ ] **1. Product Legibility Test:** Within 2 seconds of looking at the screen, can a viewer tell this is an Indian gym operational tool (not a generic CRM or medical clinic)?
- [ ] **2. First-Read Object:** Is the most urgent operational signal (e.g. dues amount, today's attendance) immediately identifiable without scrolling?
- [ ] **3. No AI Slop Hallmarks:** Are there zero decorative rainbow gradients, zero glassmorphism blurs, zero non-functional icon bubbles, and zero generic marketing buzzwords?
- [ ] **4. WhatsApp Deep-Link Usability:** Do member dues and payment receipts have direct one-click WhatsApp action links that work with Indian 10-digit mobile numbers?
- [ ] **5. Mobile Touch Target Integrity:** On mobile viewports (375px - 414px), are all inputs, steppers, and check-in buttons at least 44px x 44px with 0px horizontal overflow?
- [ ] **6. Performance & Network Resilience:** Does the page load under 1 second on a 4G connection with zero layout shift (CLS < 0.05)?
