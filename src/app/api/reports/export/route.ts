import { NextResponse } from 'next/server';
import { getMembersFromDb } from '@/lib/db';
import { generateMembersAccountingCsv } from '@/lib/analytics';

export async function GET() {
  try {
    const members = await getMembersFromDb();
    const csvContent = generateMembersAccountingCsv(members);

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `gympro-accounts-report-${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache'
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to export accounting report';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
