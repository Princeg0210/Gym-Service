import { Member, PaymentRecord, FinancialAnalytics } from '@/types';
import { calculateDaysRemaining } from './whatsapp';

export function computeFinancialAnalytics(
  members: Member[],
  payments: PaymentRecord[]
): FinancialAnalytics {
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const expiredMembers = members.filter((m) => m.status === 'expired').length;
  const defaulterMembers = members.filter((m) => m.status === 'defaulter' || m.pendingDueInr > 0).length;

  const retentionRate = totalMembers > 0
    ? Math.round((activeMembers / totalMembers) * 1000) / 10
    : 0;

  const churnRate = totalMembers > 0
    ? Math.round((expiredMembers / totalMembers) * 1000) / 10
    : 0;

  // Real payment total from payments table
  const totalRevenueInr = payments.reduce((acc, p) => acc + (Number(p.amountInr) || 0), 0);

  // Total pending dues from members
  const totalPendingDuesInr = members.reduce((acc, m) => acc + (Number(m.pendingDueInr) || 0), 0);

  // Projected renewals: members expiring in the next 30 days (daysRemaining between 0 and 30)
  const projectedRenewalInr = members
    .filter((m) => {
      const days = calculateDaysRemaining(m.endDate);
      return days >= 0 && days <= 30;
    })
    .reduce((acc, m) => acc + (Number(m.totalFeeInr) || 0), 0);

  // MRR: Normalized monthly run rate
  // For each active member, monthly equivalent = totalFeeInr / (months approx)
  const monthlyRunRateInr = Math.round(
    members
      .filter((m) => m.status === 'active')
      .reduce((acc, m) => {
        let months = 1;
        if (m.planId.includes('1y') || m.planName.toLowerCase().includes('annual')) months = 12;
        else if (m.planId.includes('6m')) months = 6;
        else if (m.planId.includes('3m')) months = 3;
        return acc + (m.totalFeeInr / months);
      }, 0)
  );

  // Payment methods breakdown
  const paymentMethods = {
    cash: 0,
    upi: 0,
    card: 0,
    other: 0
  };

  for (const p of payments) {
    const mode = (p.paymentMode || 'cash').toLowerCase();
    if (mode === 'cash') paymentMethods.cash += Number(p.amountInr) || 0;
    else if (mode === 'upi') paymentMethods.upi += Number(p.amountInr) || 0;
    else if (mode === 'card') paymentMethods.card += Number(p.amountInr) || 0;
    else paymentMethods.other += Number(p.amountInr) || 0;
  }

  // Dues recovery rate: paid / (paid + pending)
  const totalBilled = totalRevenueInr + totalPendingDuesInr;
  const duesRecoveryRate = totalBilled > 0
    ? Math.round((totalRevenueInr / totalBilled) * 1000) / 10
    : 100;

  return {
    totalMembers,
    activeMembers,
    expiredMembers,
    defaulterMembers,
    retentionRate,
    churnRate,
    totalRevenueInr,
    totalPendingDuesInr,
    projectedRenewalInr,
    monthlyRunRateInr,
    paymentMethods,
    duesRecoveryRate
  };
}

/**
 * Generate formatted CSV string for accounting export (Excel, Google Sheets)
 */
export function generateMembersAccountingCsv(members: Member[]): string {
  const headers = [
    'Member ID',
    'Full Name',
    'Phone',
    'Status',
    'Membership Plan',
    'Start Date',
    'End Date',
    'Base Amount (INR)',
    'GST 18% (INR)',
    'Total Fee (INR)',
    'Paid Amount (INR)',
    'Pending Due (INR)',
    'Fitness Goal',
    'Emergency Contact'
  ];

  const escapeCsv = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = members.map((m) => {
    const total = Number(m.totalFeeInr) || 0;
    // Calculate base vs 18% GST
    const base = Math.round(total / 1.18);
    const gst = total - base;

    return [
      escapeCsv(m.id),
      escapeCsv(m.fullName),
      escapeCsv(m.phone),
      escapeCsv(m.status.toUpperCase()),
      escapeCsv(m.planName),
      escapeCsv(m.startDate),
      escapeCsv(m.endDate),
      base,
      gst,
      total,
      Number(m.paidAmountInr) || 0,
      Number(m.pendingDueInr) || 0,
      escapeCsv(m.fitnessGoal),
      escapeCsv(m.emergencyContact || 'N/A')
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}
