import { NextResponse } from 'next/server';
import { getLeadsFromDb } from '@/lib/db';

export async function GET() {
  try {
    const list = await getLeadsFromDb();
    return NextResponse.json({ success: true, data: list });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
