import { NextResponse } from 'next/server';
import { getMembersFromDb } from '@/lib/db';
import { buildExpiringAlerts } from '@/lib/whatsapp';

export async function GET() {
  try {
    const members = await getMembersFromDb();
    const alerts = buildExpiringAlerts(members);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      counts: {
        totalExpiringOrDue: alerts.length,
        today: alerts.filter((a) => a.urgency === 'today').length,
        urgent: alerts.filter((a) => a.urgency === 'urgent').length,
        upcoming: alerts.filter((a) => a.urgency === 'upcoming').length,
        expired: alerts.filter((a) => a.urgency === 'expired').length
      },
      data: alerts
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch expiring alerts';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
