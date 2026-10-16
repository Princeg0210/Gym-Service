/**
 * Formats a numeric amount to Indian Rupee standard format (e.g., ₹12,500)
 */
export function formatInr(amount: number | string): string {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
}

/**
 * Formats ISO date to readable string (e.g., "15 Oct 2026")
 */
export function formatDate(isoDateString?: string): string {
  if (!isoDateString) return '—';
  try {
    const d = new Date(isoDateString);
    if (isNaN(d.getTime())) return isoDateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return isoDateString;
  }
}

/**
 * Standardizes a 10-digit Indian phone number
 */
export function formatPhoneNumber(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return phone;
}
