---
name: GymPRO India
description: High-velocity gym management SaaS & member portal for Indian commercial and neighborhood fitness centers
colors:
  primary: "#18181b"
  primary-hover: "#27272a"
  surface: "#ffffff"
  surface-muted: "#f4f4f5"
  surface-subtle: "#fafafa"
  border: "#e4e4e7"
  text-primary: "#09090b"
  text-secondary: "#71717a"
  text-muted: "#a1a1aa"
  dues-urgent: "#dc2626"
  dues-urgent-bg: "#fef2f2"
  dues-pending: "#d97706"
  dues-pending-bg: "#fffbeb"
  attendance-active: "#16a34a"
  attendance-active-bg: "#f0fdf4"
typography:
  display:
    fontFamily: "Geist Sans, Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Geist Sans, Inter, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist Sans, Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  caption:
    fontFamily: "Geist Sans, Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  micro:
    fontFamily: "Geist Sans, Inter, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  badge:
    fontFamily: "Geist Sans, Inter, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
  tabular:
    fontFamily: "Geist Mono, JetBrains Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  stat-strip:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  button-whatsapp:
    backgroundColor: "#25D366"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  data-table-row:
    height: "44px"
    borderColor: "{colors.border}"
    hoverBackground: "{colors.surface-muted}"
---

# GymPRO India Design System

## 1. System Vision & Aesthetic Tenets
GymPRO India is a high-utility B2B2C operational platform built specifically for Indian gym owners, receptionists, and active gym members.

* **High Information Density (`/distill`, `/layout`):** Operating a busy Indian reception during morning (6:30–9:00 AM) and evening (6:30–9:30 PM) peak hours requires seeing 12–15 member rows and urgent fee statuses without scrolling.
* **Radical Contrast Over Decorative Blur (`/colorize`, `/quieter`):** Zero GPU-draining glassmorphism or pastel gradients. Interfaces use high-contrast opaque surfaces (`#ffffff`, `#18181b`) that render smoothly on modest Windows PCs and budget mobile phones.
* **Instant Keyboard Telemetry:** Global hotkey `/` focuses search; `Enter` logs attendance; `Esc` clears modals.
* **Tabular Monospace Precision (`/typeset`):** Monospace font applied strictly to all currency figures (`₹4,500`), telephone numbers (`+91 98765-XXXXX`), set/rep counters, and timestamps.

## 2. Color Palette & Semantic Mapping
* **Critical Urgent (`dues-urgent: #dc2626`):** Reserved exclusively for unpaid overdue fees (>7 days) and expired memberships attempting check-in.
* **Warning Pending (`dues-pending: #d97706`):** Memberships expiring within 7 days.
* **Operational Success (`attendance-active: #16a34a`):** Successful member check-in validation.
* **WhatsApp Brand Accent (`#25D366`):** Direct trigger for `https://wa.me/` receipts and dues reminders.

## 3. Anti-AI Polish & Hardening Rules (`/harden`, `/polish`)
1. **Forbidden Defaults:**
   - No 4-card generic dashboard grids with pastel gradient icon backgrounds.
   - No generic motivational copy ("Empower your fitness journey", "Unlock next-level potential").
   - No multi-step wizard modals for routine one-click daily fee entries.
2. **Hardening for Real Indian Gym Operations:**
   - **Network Tolerance:** Offline-first optimistic UI for logging workout sets and attendance.
   - **Sweaty-Finger Mobile Targets:** In the mobile workout logger, touch targets for `kg` and `rep` steppers are strictly `≥ 48px`.
   - **Busy-Hour Machine Swaps:** Every exercise includes a 1-tap biomechanically equivalent free-weight substitution.
