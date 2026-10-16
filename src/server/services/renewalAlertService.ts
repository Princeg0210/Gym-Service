import { memberRepository } from '../repositories/memberRepository';
import { buildExpiringAlerts } from '@/lib/whatsapp';
import { ExpiringAlertItem } from '@/types';

export interface RenewalAlertsSummary {
  totalExpiringOrDue: number;
  today: number;
  urgent: number;
  upcoming: number;
  expired: number;
}

export interface RenewalAlertsResult {
  timestamp: string;
  counts: RenewalAlertsSummary;
  alerts: ExpiringAlertItem[];
}

export const renewalAlertService = {
  async getExpiringAlerts(): Promise<RenewalAlertsResult> {
    const members = await memberRepository.getAll();
    const alerts = buildExpiringAlerts(members);

    const counts: RenewalAlertsSummary = {
      totalExpiringOrDue: alerts.length,
      today: alerts.filter((a) => a.urgency === 'today').length,
      urgent: alerts.filter((a) => a.urgency === 'urgent').length,
      upcoming: alerts.filter((a) => a.urgency === 'upcoming').length,
      expired: alerts.filter((a) => a.urgency === 'expired').length
    };

    return {
      timestamp: new Date().toISOString(),
      counts,
      alerts
    };
  }
};
