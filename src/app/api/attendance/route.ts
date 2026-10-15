import { NextRequest, NextResponse } from 'next/server';
import { getAttendanceFromDb, logAttendanceInDb } from '@/lib/db';
import { AttendanceRecord } from '@/types';

export async function GET() {
  try {
    const records = await getAttendanceFromDb();
    return NextResponse.json({ success: true, data: records });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRecord: AttendanceRecord = {
      id: body.id || `att-${Date.now()}`,
      memberId: body.memberId,
      memberName: body.memberName,
      phone: body.phone,
      checkInTime: body.checkInTime || new Date().toISOString(),
      checkInMethod: body.checkInMethod || 'phone_search',
      planStatus: body.planStatus || 'active',
      pendingDueInr: Number(body.pendingDueInr) || 0
    };

    const saved = await logAttendanceInDb(newRecord);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
