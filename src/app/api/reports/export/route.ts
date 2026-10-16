import { NextResponse } from 'next/server';
import { accountingExportService } from '@/server';

export async function GET() {
  try {
    const { csvContent, filename } = await accountingExportService.exportMembersCsv();

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
