import { Member, PaymentRecord, ExpiringAlertItem } from '@/types';

export const GYM_DEFAULT_INFO = {
  name: 'GymPRO Fitness Club',
  phone: '9876543210',
  upiVpa: 'gymprofitness@oksbi',
  address: 'Shop 12-14, 2nd Floor, Main Market, Sector 15'
};

export function cleanIndianPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return `91${digits.slice(-10)}`;
}

export function generatePaymentReceiptWhatsAppUrl(
  member: Member,
  payment: PaymentRecord,
  gymName = GYM_DEFAULT_INFO.name
): string {
  const phone = cleanIndianPhone(member.phone);
  const message = `*PAYMENT RECEIPT - ${gymName.toUpperCase()}*

Namaste *${member.fullName}*,
We have received your payment:

• *Amount Paid:* ₹${payment.amountInr.toLocaleString('en-IN')}
• *Payment Mode:* ${payment.paymentMode.toUpperCase()}
• *Reference ID:* ${payment.transactionRef}
• *Plan Validity:* Active till ${member.endDate}
• *Pending Dues:* ₹${member.pendingDueInr.toLocaleString('en-IN')}

Thank you for training with us!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppDuesReminder(
  member: Member,
  gymName = GYM_DEFAULT_INFO.name,
  upiVpa = GYM_DEFAULT_INFO.upiVpa
): string {
  return `*FEE RENEWAL REMINDER - ${gymName.toUpperCase()}*

Namaste *${member.fullName}*,
This is a gentle reminder regarding your gym membership:

• *Plan:* ${member.planName}
• *Pending Amount Due:* ₹${member.pendingDueInr.toLocaleString('en-IN')}
• *Expiry/Due Date:* ${member.endDate}

Kindly clear the balance to avoid interruption in your access pass.

*Pay via UPI:* \`${upiVpa}\` (GPay / PhonePe / Paytm)
Or visit the reception desk.

Warm regards,
${gymName}`;
}

export function getWhatsAppWebLink(rawPhone: string, message: string): string {
  const phone = cleanIndianPhone(rawPhone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateDuesReminderWhatsAppUrl(
  member: Member,
  gymName = GYM_DEFAULT_INFO.name,
  upiVpa = GYM_DEFAULT_INFO.upiVpa
): string {
  const message = generateWhatsAppDuesReminder(member, gymName, upiVpa);
  return getWhatsAppWebLink(member.phone, message);
}

export function generateWelcomeWhatsAppUrl(
  member: Member,
  gymName = GYM_DEFAULT_INFO.name
): string {
  const phone = cleanIndianPhone(member.phone);
  const message = `*WELCOME TO ${gymName.toUpperCase()}*

Namaste *${member.fullName}*!
Welcome to our fitness family. Your membership is now active:

• *Member ID:* ${member.id}
• *Membership Plan:* ${member.planName}
• *Valid From:* ${member.startDate} to ${member.endDate}
• *Target Goal:* ${member.fitnessGoal.replace('_', ' ').toUpperCase()}

You can check in at the reception using the last 4 digits of your phone (*${member.phone.slice(-4)}*) or by scanning your digital QR code.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateExpiringSoonWhatsAppUrl(
  member: Member,
  daysLeft: number,
  gymName = GYM_DEFAULT_INFO.name,
  upiVpa = GYM_DEFAULT_INFO.upiVpa
): string {
  const urgencyText = daysLeft === 0
    ? 'expires *TODAY*'
    : daysLeft === 1
      ? 'expires *TOMORROW*'
      : `expires in *${daysLeft} days* (on ${member.endDate})`;

  const message = `*MEMBERSHIP EXPIRY NOTICE - ${gymName.toUpperCase()}*

Namaste *${member.fullName}*,
Your gym membership ${urgencyText}!

• *Current Plan:* ${member.planName}
• *Valid Until:* ${member.endDate}
• *Renewal Offer:* Renew today at the desk or via UPI to lock in your active member rate with 0 re-joining fee!

*Instant Renewal UPI:* \`${upiVpa}\`
Or speak with our front desk team during your next session.`;

  return getWhatsAppWebLink(member.phone, message);
}

export function generateExpiredMembershipWhatsAppUrl(
  member: Member,
  gymName = GYM_DEFAULT_INFO.name,
  upiVpa = GYM_DEFAULT_INFO.upiVpa
): string {
  const message = `*MEMBERSHIP EXPIRED - WE MISS YOU AT ${gymName.toUpperCase()}*

Namaste *${member.fullName}*,
Your membership for *${member.planName}* has expired.

We would love to welcome you back on the floor!
• *Special Comeback Benefit:* 10% discount on 3-month or 6-month plans this week.
• *Zero Registration Fee* on immediate renewal.

*Pay via UPI:* \`${upiVpa}\`
Or drop by the gym today for your next workout!

Best regards,
${gymName} Team`;

  return getWhatsAppWebLink(member.phone, message);
}

export function calculateDaysRemaining(endDateStr: string): number {
  try {
    const end = new Date(endDateStr);
    const now = new Date();
    // Normalize to date-only without time
    const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const diffMs = endUtc - nowUtc;
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export function buildExpiringAlerts(
  members: Member[],
  gymName = GYM_DEFAULT_INFO.name,
  upiVpa = GYM_DEFAULT_INFO.upiVpa
): ExpiringAlertItem[] {
  const alerts: ExpiringAlertItem[] = [];

  for (const m of members) {
    const days = calculateDaysRemaining(m.endDate);

    if (days < 0 || m.status === 'expired') {
      alerts.push({
        member: m,
        daysRemaining: days,
        urgency: 'expired',
        suggestedAction: 'Send Comeback Discount (Expired)',
        whatsappUrl: generateExpiredMembershipWhatsAppUrl(m, gymName, upiVpa)
      });
    } else if (days === 0) {
      alerts.push({
        member: m,
        daysRemaining: 0,
        urgency: 'today',
        suggestedAction: 'Expires Today - Send Last Chance Alert',
        whatsappUrl: generateExpiringSoonWhatsAppUrl(m, 0, gymName, upiVpa)
      });
    } else if (days >= 1 && days <= 3) {
      alerts.push({
        member: m,
        daysRemaining: days,
        urgency: 'urgent',
        suggestedAction: `Expires in ${days} days - Send Urgent Renewal`,
        whatsappUrl: generateExpiringSoonWhatsAppUrl(m, days, gymName, upiVpa)
      });
    } else if (days >= 4 && days <= 7) {
      alerts.push({
        member: m,
        daysRemaining: days,
        urgency: 'upcoming',
        suggestedAction: `Expires in ${days} days - Send Friendly Reminder`,
        whatsappUrl: generateExpiringSoonWhatsAppUrl(m, days, gymName, upiVpa)
      });
    } else if (m.pendingDueInr > 0 && m.status === 'defaulter') {
      alerts.push({
        member: m,
        daysRemaining: days,
        urgency: 'urgent',
        suggestedAction: `Pending dues ₹${m.pendingDueInr} - Send Fee Notice`,
        whatsappUrl: generateDuesReminderWhatsAppUrl(m, gymName, upiVpa)
      });
    }
  }

  // Sort: today > urgent > upcoming > expired
  const priorityMap: Record<ExpiringAlertItem['urgency'], number> = {
    today: 0,
    urgent: 1,
    upcoming: 2,
    expired: 3
  };

  return alerts.sort((a, b) => priorityMap[a.urgency] - priorityMap[b.urgency]);
}

