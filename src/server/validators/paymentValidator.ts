import { PaymentRecord } from '@/types';
import { ValidationResult } from './memberValidator';

export function validatePaymentInput(data: Partial<PaymentRecord>): ValidationResult {
  const errors: string[] = [];

  if (!data.memberId) {
    errors.push('Member ID is required for logging a payment.');
  }

  if (data.amountInr === undefined || Number(data.amountInr) <= 0) {
    errors.push('Payment amount must be greater than 0.');
  }

  const validModes: PaymentRecord['paymentMode'][] = ['cash', 'upi', 'card', 'netbanking', 'other'];
  if (data.paymentMode && !validModes.includes(data.paymentMode)) {
    errors.push(`Payment mode must be one of: ${validModes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
