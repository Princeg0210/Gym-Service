import { NextResponse } from 'next/server';
import { analyticsService } from '@/server';

export async function GET() {
  try {
    const analytics = await analyticsService.getFinancialAnalytics();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: analytics
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate financial analytics';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
