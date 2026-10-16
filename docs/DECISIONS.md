# DECISIONS: Architecture Decision Record (ADR)

> *Code shows what changed. DECISIONS.md shows why.*

---

## D-001: Use Supabase PostgreSQL as Primary Database
- **Date:** 2026-10-13
- **Context:** GymPRO needed a persistent cloud database capable of handling relational tables (`members`, `attendance`, `payments`, `equipment`, `leads`), indexed lookups, and real-time syncing.
- **Options Considered:**
  1. *Local SQLite / File DB:* Zero cloud cost, but cannot sync between front-desk desktop and owner's mobile.
  2. *Firebase Firestore:* Good real-time, but poor for complex relational queries (e.g. JOIN-like financial aggregations and MRR).
  3. *Supabase PostgreSQL:* Relational schema, standard SQL, built-in connection pooling, instant REST SDK.
- **Chosen:** Option 3 (Supabase PostgreSQL).
- **Why:** Real-time multi-device support, strict table constraints, and standard SQL foreign keys for billing accuracy.
- **Trade-off:** Requires network connectivity and management of environment keys.
- **Revisit If:** Gyms demand completely self-hosted local installations without any internet connection.

---

## D-002: Clean Layered Architecture (`src/server/` + `src/client/`) inside Next.js
- **Date:** 2026-10-16
- **Context:** Deciding how to separate frontend from backend code.
- **Options Considered:**
  1. *Physical split into two independent repos/folders (`backend/` + `frontend/`):* Required running dual servers, configuring cross-origin CORS headers, and doubled hosting/deploy costs.
  2. *Next.js Layered Architecture:* Isolate pure backend logic in `src/server/` (controllers, repositories, services, validators) and client code in `src/client/`, while offering a standalone runtime in `backend/`.
- **Chosen:** Option 2.
- **Why:** 100% type sharing with zero schema drift, single-click deployment on Vercel, zero CORS friction for the main app, while still keeping a standalone `backend/server.mjs` available for mobile apps.
- **Trade-off:** Frontend and backend share the same repository.
- **Revisit If:** Dedicated mobile team requires a completely isolated API repository with independent CI/CD cycles.

---

## D-003: Direct WhatsApp Deep-Links (`wa.me`) over Cloud API
- **Date:** 2026-10-14
- **Context:** Building the WhatsApp Renewal Alert Bot for gym owners.
- **Options Considered:**
  1. *Meta WhatsApp Cloud Business API:* Fully automated background delivery, but requires Meta Business Manager verification, credit card billing ($0.04 - $0.08 per template message in India), and strict 24-hr messaging window rules.
  2. *Direct WhatsApp URI Deep-Links (`https://wa.me/`):* One-click trigger from desktop/mobile, opens native WhatsApp or WhatsApp Web with pre-formatted message, zero per-message cost, zero Meta verification barrier for gym owners.
- **Chosen:** Option 2.
- **Why:** Gym owners in India prefer sending reminders from their personal/gym phone number so members can reply directly. Zero operational cost.
- **Trade-off:** Requires a human staff member to click "Send WhatsApp" instead of running purely unattended in the background.
- **Revisit If:** Gym size exceeds 1,500 active members and manual clicking becomes a staff bottleneck.

---

## D-004: Dual-Layer Persistence Fallback (`AppStorage` + Supabase)
- **Date:** 2026-10-15
- **Context:** Commercial gyms experience intermittent broadband drops during peak hours.
- **Options Considered:**
  1. *Pure Online Mode:* Show blocking error spinner when internet goes down.
  2. *Dual-Layer Storage:* Optimistically read from local cache (`AppStorage`), perform server sync, and maintain local state if network drops.
- **Chosen:** Option 2.
- **Why:** Front-desk entry gates cannot halt members during peak morning/evening rush hours because of a network stutter.
- **Trade-off:** Potential data drift if multiple devices write simultaneously while offline.
- **Revisit If:** We implement full CRDT-based multi-master conflict resolution.

---

## D-005: Decouple Payment Collection from "Add Member" Enrollment
- **Date:** 2026-10-15
- **Context:** The "Add Member" modal previously asked for "Amount Paid Now" and "Payment Rail (UPI/Cash)".
- **Options Considered:**
  1. *Force immediate payment collection at enrollment.*
  2. *Decouple enrollment from billing:* Add Member only captures identity & membership plan; payment collection happens in the Member Portal or Dues Tab ledger.
- **Chosen:** Option 2.
- **Why:** Prevents accounting confusion. Admin enrolls the member; the member can then self-pay via UPI in their Member Portal or settle at the desk with an official receipt.
- **Trade-off:** Members start with `pendingDueInr = totalFeeInr` until payment is recorded.
- **Revisit If:** Gym owner requests mandatory upfront payment collection before issuing member ID pass.
