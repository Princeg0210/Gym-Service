import { NextRequest, NextResponse } from 'next/server';
import { getMembersFromDb, createMemberInDb } from '@/lib/db';
import { Member } from '@/types';

export async function GET() {
  try {
    const members = await getMembersFromDb();
    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.fullName || !body.phone || !body.planName) {
      return NextResponse.json(
        { success: false, error: 'Full name, phone, and plan name are required' },
        { status: 400 }
      );
    }

    const newMember: Member = {
      id: body.id || `mem-${Date.now()}`,
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      gender: body.gender || 'male',
      age: Number(body.age) || 25,
      planId: body.planId || 'plan-1m',
      planName: body.planName,
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      endDate: body.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalFeeInr: Number(body.totalFeeInr) || 0,
      paidAmountInr: Number(body.paidAmountInr) || 0,
      pendingDueInr: Number(body.pendingDueInr) || 0,
      status: body.status || 'active',
      emergencyContact: body.emergencyContact || undefined,
      fitnessGoal: body.fitnessGoal || 'general_fitness',
      dietaryPreference: body.dietaryPreference || 'vegetarian',
      avatarSeed: body.avatarSeed || body.fullName.split(' ')[0]
    };

    const saved = await createMemberInDb(newMember);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
