# FLOW: End-to-End Execution Paths

This document maps how data travels through GymPRO for the three most critical operations.

---

### Flow 1: Optical QR Check-In & Live Presence Update

```
1. User presents physical/mobile QR Code
   │
   ▼
2. QRScanModal.tsx (Camera viewport / Sim Scan triggered)
   │ calls onCheckIn(member)
   ▼
3. OperationsDashboard.tsx -> handleCheckIn(member, 'qr_scan')
   │ calls gymApiClient.logAttendance({ memberId, memberName, checkInMethod: 'qr_scan', ... })
   ▼
4. src/client/api/gymApiClient.ts -> POST /api/attendance
   │
   ▼
5. src/app/api/attendance/route.ts
   │ invokes attendanceRepository.create(record)
   ▼
6. src/server/repositories/attendanceRepository.ts
   │ executes supabase.from('attendance').insert([row])
   ▼
7. Supabase Cloud PostgreSQL records attendance entry
   │ returns inserted AttendanceRow
   ▼
8. Response 201 Created returns to client
   │
   ▼
9. useGymData.ts / OperationsDashboard.tsx:
   - Appends record to attendanceLogs state
   - Updates in-gym presence count
   - Triggers audio cue ('success' chime via Web Audio API)
   - Displays CheckInBanner toast confirmation
```

---

### Flow 2: Fee Collection & Dues Settlement

```
1. Front-desk staff opens Member payment modal
   │ Inputs: Amount Collected (e.g. ₹1,500), Payment Mode ('upi' | 'cash')
   ▼
2. OperationsDashboard.tsx -> handleRecordPayment(...)
   │ calls gymApiClient.recordPayment(...) & gymApiClient.updateMember(...)
   ▼
3. POST /api/payments & PATCH /api/members/[id]
   │
   ▼
4. src/server/validators/paymentValidator.ts
   │ Validates: amount > 0, mode in ['cash', 'upi', 'card', 'netbanking', 'other']
   ▼
5. src/server/repositories/paymentRepository.ts & memberRepository.ts
   │
   ├─► 1. Writes row to 'payments' table (append-only ledger)
   │
   └─► 2. Updates 'members' table:
          paid_amount_inr = paid_amount_inr + new_payment
          pending_due_inr = total_fee_inr - paid_amount_inr
          status = (pending_due_inr === 0 ? 'active' : status)
   ▼
6. Both queries succeed
   │ Returns updated Member and PaymentRecord
   ▼
7. Client UI:
   - Updates DuesTab ledger row
   - Updates Executive KPI Card (Total Revenue & Pending Collections)
   - Generates WhatsApp Payment Receipt link ready to send to member's phone
```

---

### Flow 3: Automated WhatsApp Renewal Alert

```
1. Admin opens "Renewal Bot" tab or Background Cron triggers
   │
   ▼
2. GET /api/alerts/expiring
   │
   ▼
3. src/server/services/renewalAlertService.ts
   │ invokes memberRepository.getAll()
   ▼
4. Database returns member roster
   │
   ▼
5. renewalAlertService calculates daysRemaining = (endDate - today)
   │ Filters members where:
   │ - daysRemaining === 0  -> urgency: 'today' (Critical renewal)
   │ - daysRemaining <= 3  -> urgency: 'urgent' (Urgent reminder)
   │ - daysRemaining <= 7  -> urgency: 'upcoming' (Friendly notice)
   │ - daysRemaining < 0   -> urgency: 'expired' (Comeback offer)
   ▼
6. For each qualifying member, calls generateWhatsAppDuesReminder():
   │ Crafts personalized message in Hindi/English with gym UPI VPA
   │ Formats deep-link: https://wa.me/91{phone}?text={encodedMsg}
   ▼
7. Returns structured JSON:
   { success: true, counts: { today, urgent, upcoming, expired }, data: alerts }
   ▼
8. ExpiringAlertsCenter.tsx renders alert cards:
   - Staff clicks "Send WhatsApp" -> launches WhatsApp Web with pre-filled message
   - Staff clicks "Preview" -> inspects rendered message template
```
