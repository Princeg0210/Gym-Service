import { Member } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateMemberInput(data: Partial<Member>): ValidationResult {
  const errors: string[] = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long.');
  }

  if (!data.phone || data.phone.replace(/\D/g, '').length < 10) {
    errors.push('Valid 10-digit Indian phone number is required.');
  }

  if (!data.planName || data.planName.trim().length === 0) {
    errors.push('Plan name is required.');
  }

  if (data.totalFeeInr !== undefined && data.totalFeeInr < 0) {
    errors.push('Total fee cannot be negative.');
  }

  if (data.paidAmountInr !== undefined && data.paidAmountInr < 0) {
    errors.push('Paid amount cannot be negative.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
