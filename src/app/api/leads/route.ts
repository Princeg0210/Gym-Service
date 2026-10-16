import { NextRequest, NextResponse } from 'next/server';
import { getLeadsFromDb, createLeadInDb } from '@/lib/db';
import { LeadItem } from '@/types';

export async function GET() {
  try {
    const list = await getLeadsFromDb();
    return NextResponse.json({ success: true, data: list });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.fullName || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Full name and phone are required' },
        { status: 400 }
      );
    }

    const newLead: LeadItem = {
      id: body.id || `lead-${Date.now()}`,
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      goal: body.goal || 'general_fitness',
      inquiryDate: body.inquiryDate || new Date().toISOString().split('T')[0],
      trialStatus: body.trialStatus || 'trial_booked',
      nextFollowUpDate:
        body.nextFollowUpDate ||
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: body.notes || 'Inquired online via GymPRO Showcase'
    };

    const saved = await createLeadInDb(newLead);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
