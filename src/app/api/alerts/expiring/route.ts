import { NextResponse } from 'next/server';
import { renewalAlertService } from '@/server';

export async function GET() {
  try {
    const result = await renewalAlertService.getExpiringAlerts();

    return NextResponse.json({
      success: true,
      timestamp: result.timestamp,
      counts: result.counts,
      data: result.alerts
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch expiring alerts';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
