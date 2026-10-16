# ARCHITECTURE: GymPRO System Map

GymPRO is a commercial gym operating engine built as a high-velocity, offline-resilient full-stack SaaS.

---

### High-Level Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TRUST BOUNDARY: CLIENT BROWSER                    │
│                                                                             │
│   Front Desk Operator / Admin                    Member Portal              │
│       (Desktop / Tablet)                        (Mobile PWA)                │
│               │                                       │                     │
│               ▼                                       ▼                     │
│      src/components/                          src/components/MemberPortal   │
│   (OperationsDashboard, Showcase)                     │                     │
│               │                                       │                     │
│               └───────────────────┬───────────────────┘                     │
│                                   │                                         │
│                                   ▼                                         │
│                       src/client/api/gymApiClient                           │
│                                   │                                         │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │ HTTPS / REST JSON
┌───────────────────────────────────┼─────────────────────────────────────────┐
│                                   ▼  TRUST BOUNDARY: API ENTRY              │
│                           src/app/api/ (Route Dispatchers)                  │
│                                   │                                         │
│                       src/server/middlewares/                               │
│                   (authMiddleware, errorMiddleware)                         │
│                                   │                                         │
│                        src/server/validators/                               │
│                    (memberValidator, paymentValidator)                      │
│                                   │                                         │
│                        src/server/controllers/                              │
│                                   │                                         │
│               ┌───────────────────┴───────────────────┐                     │
│               ▼                                       ▼                     │
│      src/server/services/                   src/server/repositories/        │
│   (RenewalAlert, Analytics, Export)       (Members, Attendance, Payments,   │
│                                            Equipment, Leads)                │
│                                                       │                     │
└───────────────────────────────────────────────────────┼─────────────────────┘
                                                        │ Supabase SDK
                                                        ▼
                                    ┌──────────────────────────────────────┐
                                    │     Cloud PostgreSQL (Supabase)      │
                                    │   Tables: members, attendance,       │
                                    │           payments, equipment, leads │
                                    └──────────────────────────────────────┘
```

---

### Core System Modules

1. **Frontend Presentation Layer (`src/components/`, `src/client/`)**
   - **Operations Desk (`OperationsDashboard.tsx`):** Tabbed interface managing live attendance, members, fees/dues, walk-in leads, equipment status, and renewal bot.
   - **Public & Showcase (`ClubShowcase.tsx`):** Gym marketing showcase, membership tier selector, and facility tour.
   - **Member Portal (`MemberPortal.tsx`):** Member self-service view: personal QR pass, active plan validity, and workout routine tracking.
   - **Offline Storage Engine (`src/lib/storage.ts`):** In-memory and `localStorage` snapshot cache ensuring the gym operations never crash during internet drops.

2. **Server Controllers & Middlewares (`src/server/`)**
   - **Validators (`src/server/validators/`):** Guard incoming request bodies (phone format, payment amounts, required fields) before hitting database.
   - **Controllers (`src/server/controllers/`):** Orchestrate request lifecycle, format standardized responses, and handle errors.
   - **Middlewares (`src/server/middlewares/`):** Admin passkey validation (`verifyAdminAccess`) and centralized error response builder.

3. **Domain Services & Analytics (`src/server/services/`)**
   - **Renewal Alert Engine (`renewalAlertService.ts`):** Daily evaluation of memberships expiring in 1–7 days, calculates urgency tiers, and formats personalized WhatsApp payment requests with UPI handles.
   - **Financial Analytics Service (`analyticsService.ts`):** Calculates MRR (Monthly Run-Rate), total collection efficiency, overdue balances, and membership retention rates.
   - **Accounting Export Service (`accountingExportService.ts`):** Streams RFC-4180 compliant CSV exports for CA auditing and Tally ingestion.

4. **Data Access Layer (`src/server/repositories/`)**
   - Isolate raw Supabase table interactions for `members`, `attendance`, `payments`, `equipment`, and `leads`.
   - Maps database `snake_case` records to type-safe TypeScript `camelCase` domain objects.

5. **Standalone API Runtime (`backend/`)**
   - An independent Node.js server (`backend/server.mjs`) on port `5000` with full CORS support for future React Native or Flutter mobile apps.
