import { NextRequest, NextResponse } from 'next/server';
import { getPaymentsFromDb, recordPaymentInDb, getMembersFromDb, updateMemberInDb } from '@/lib/db';
import { PaymentRecord } from '@/types';

export async function GET() {
  try {
    const payments = await getPaymentsFromDb();
    return NextResponse.json({ success: true, data: payments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newPayment: PaymentRecord = {
      id: body.id || `pay-${Date.now()}`,
      memberId: body.memberId,
      memberName: body.memberName,
      amountInr: Number(body.amountInr) || 0,
      paymentMode: body.paymentMode || 'upi',
      transactionRef: body.transactionRef || `TXN-${Date.now()}`,
      timestamp: body.timestamp || new Date().toISOString()
    };

    const savedPayment = await recordPaymentInDb(newPayment);

    // Update member's dues in DB
    const members = await getMembersFromDb();
    const targetMember = members.find((m) => m.id === body.memberId);
    let updatedMember = null;

    if (targetMember) {
      const newPaid = targetMember.paidAmountInr + newPayment.amountInr;
      const newDue = Math.max(0, targetMember.pendingDueInr - newPayment.amountInr);
      const newStatus = newDue === 0 && targetMember.status === 'defaulter' ? 'active' : targetMember.status;

      updatedMember = await updateMemberInDb(targetMember.id, {
        paidAmountInr: newPaid,
        pendingDueInr: newDue,
        status: newStatus
      });
    }

    return NextResponse.json(
      { success: true, data: { payment: savedPayment, member: updatedMember } },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
