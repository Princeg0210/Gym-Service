import { Member, PaymentRecord } from '@/types';

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
  const message = `*PAYMENT RECEIPT — ${gymName.toUpperCase()}* 🏋️‍♂️

Namaste *${member.fullName}*,
We have received your payment:

• *Amount Paid:* ₹${payment.amountInr.toLocaleString('en-IN')}
• *Payment Mode:* ${payment.paymentMode.toUpperCase()}
• *Reference ID:* ${payment.transactionRef}
• *Plan Validity:* Active till ${member.endDate}
• *Pending Dues:* ₹${member.pendingDueInr.toLocaleString('en-IN')}

Thank you for training with us! Keep crushing your goals. 💪`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppDuesReminder(
  member: Member,
  gymName = 'Alpha Fitness Gym',
  upiVpa = 'alphafitness@okhdfcbank'
): string {
  return `*FEE RENEWAL REMINDER — ${gymName.toUpperCase()}* ⚠️

Namaste *${member.fullName}*,
This is a gentle reminder regarding your gym membership:

• *Plan:* ${member.planName}
• *Pending Amount Due:* ₹${member.pendingDueInr.toLocaleString('en-IN')}
• *Expiry/Due Date:* ${member.endDate}

Kindly clear the balance to avoid interruption in your access pass.

💳 *Pay via UPI:* \`${upiVpa}\` (GPay / PhonePe / Paytm)
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
  const message = `*WELCOME TO ${gymName.toUpperCase()}* 🏆

Namaste *${member.fullName}*!
Welcome to our fitness family. Your membership is now active:

• *Member ID:* ${member.id}
• *Membership Plan:* ${member.planName}
• *Valid From:* ${member.startDate} to ${member.endDate}
• *Target Goal:* ${member.fitnessGoal.replace('_', ' ').toUpperCase()}

You can check in at the reception using the last 4 digits of your phone (*${member.phone.slice(-4)}*) or by scanning your digital QR code.

Let's achieve greatness together! 💥`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
