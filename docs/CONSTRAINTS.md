# CONSTRAINTS & HARD GUARDRAILS: GymPRO

> **Notice to AI Assistants:**
> These are hard constraints. Under no circumstance should you bypass or loosen these rules without explicit user consent.

---

### 1. Security & Secrets (NEVER)
- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` or any administrative backend credentials to the browser bundle or client components.
- **NEVER** commit `.env`, `.env.local`, or raw credentials to the Git repository.
- **NEVER** loosen authorization checks in `AdminAuthGuard.tsx` or `authMiddleware.ts` to "make tests pass" or bypass a screen.
- **ONLY** use `NEXT_PUBLIC_` prefixed environment variables for public, read-safe client configuration.

---

### 2. Financial & Accounting Ledger Integrity (ALWAYS)
- **ALWAYS** treat payments as an append-only ledger in `payments` table.
- **NEVER** silently mutate or delete historical payment records.
- **ALWAYS** compute `pending_due_inr` using strict arithmetic: `total_fee_inr - paid_amount_inr`. Negative dues are strictly forbidden.
- **NEVER** allow the client-side browser to arbitrarily dictate `paid_amount_inr` without recording a corresponding transaction row.

---

### 3. Architecture & Data Flow Boundaries (ALWAYS / ONLY)
- **ALWAYS** route database queries through `src/server/repositories/`. Client components must **NEVER** import or execute direct Supabase queries.
- **ALWAYS** use `src/client/api/gymApiClient.ts` for frontend HTTP calls rather than scattered raw `fetch()` calls.
- **ALWAYS** maintain the offline-first resilience fallback (`AppStorage`) so that front-desk operations (check-in, roster lookup) never halt during local internet outages.

---

### 4. UI Design & Aesthetic Quality (ALWAYS)
- **ALWAYS** respect the design contract defined in `FRONTEND_DESIGN_CONTRACT.md` and `DESIGN.md`.
- **NEVER** use colored glow shadows (`shadow-[...rgba(204,255,0,...)]`). Use neutral elevation shadows (`shadow-sm`, `shadow-md shadow-black/40`).
- **NEVER** introduce functional UI text smaller than 11px (`text-[10px]` is forbidden by Impeccable guidelines).
- **NEVER** introduce bouncy, cartoony CSS animations (`animate-bounce`). Use subtle pulses or linear transitions.

---

### 5. Verification Gate (MUST PASS)
- Every single pull request or merged AI change **MUST** pass:
  1. `npm run lint` (0 errors, 0 warnings)
  2. `npm run build` (Clean production compilation)
  3. `npx impeccable detect src/` (0 anti-patterns)
