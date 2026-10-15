import { NextRequest, NextResponse } from 'next/server';
import { getPaymentsFromDb, recordPaymentInDb, getMemberByIdFromDb, updateMemberInDb } from '@/lib/db';
import { PaymentRecord } from '@/types';

export async function GET() {
  try {
    const payments = await getPaymentsFromDb();
    return NextResponse.json({ success: true, data: payments });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amountInr = Number(body.amountInr);

    // Strict positive amount validation
    if (!amountInr || isNaN(amountInr) || amountInr <= 0) {
      return NextResponse.json(
        { success: false, error: 'Payment amount must be a valid positive number greater than 0' },
        { status: 400 }
      );
    }

    if (!body.memberId || typeof body.memberId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'memberId is required' },
        { status: 400 }
      );
    }

    // Targeted single record query
    const targetMember = await getMemberByIdFromDb(body.memberId);
    if (!targetMember) {
      return NextResponse.json(
        { success: false, error: 'Member not found for the given memberId' },
        { status: 404 }
      );
    }

    const newPayment: PaymentRecord = {
      id: body.id || `pay-${Date.now()}`,
      memberId: targetMember.id,
      memberName: targetMember.fullName,
      amountInr: amountInr,
      paymentMode: body.paymentMode || 'upi',
      transactionRef: body.transactionRef || `TXN-${Date.now()}`,
      timestamp: body.timestamp || new Date().toISOString()
    };

    const savedPayment = await recordPaymentInDb(newPayment);

    // Single source of truth: atomic dues calculation
    const newPaid = targetMember.paidAmountInr + amountInr;
    const newDue = Math.max(0, targetMember.pendingDueInr - amountInr);
    const newStatus = newDue === 0 && targetMember.status === 'defaulter' ? 'active' : targetMember.status;

    const updatedMember = await updateMemberInDb(targetMember.id, {
      paidAmountInr: newPaid,
      pendingDueInr: newDue,
      status: newStatus
    });

    return NextResponse.json(
      { success: true, data: { payment: savedPayment, member: updatedMember || targetMember } },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
