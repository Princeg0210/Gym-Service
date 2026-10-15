import { NextResponse } from 'next/server';
import { getMembersFromDb, getPaymentsFromDb } from '@/lib/db';
import { computeFinancialAnalytics } from '@/lib/analytics';

export async function GET() {
  try {
    const [members, payments] = await Promise.all([
      getMembersFromDb(),
      getPaymentsFromDb()
    ]);

    const analytics = computeFinancialAnalytics(members, payments);

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
