'use client';

import React, { useState } from 'react';
import { Member, PaymentRecord } from '@/types';
import { X, QrCode, Banknote, CreditCard, MessageSquare, CheckCircle } from 'lucide-react';
import { generatePaymentReceiptWhatsAppUrl, GYM_DEFAULT_INFO } from '@/lib/whatsapp';

interface RecordPaymentModalProps {
  member: Member;
  onClose: () => void;
  onPaymentSuccess: (payment: PaymentRecord, updatedMember: Member) => void;
}

export function RecordPaymentModal({
  member,
  onClose,
  onPaymentSuccess
}: RecordPaymentModalProps) {
  const [amount, setAmount] = useState<number>(member.pendingDueInr || 1500);
  const [mode, setMode] = useState<'cash' | 'upi' | 'card'>('upi');
  const [refId, setRefId] = useState<string>(() => `UPI-${Math.floor(100000 + Math.random() * 900000)}`);
  const [completedPayment, setCompletedPayment] = useState<{
    payment: PaymentRecord;
    updatedMember: Member;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      memberId: member.id,
      memberName: member.fullName,
      amountInr: amount,
      paymentMode: mode,
      transactionRef: refId || `${mode.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString()
    };

    // Consistent dues calculation (aligned with backend)
    const newPaidAmount = member.paidAmountInr + amount;
    const newPendingDue = Math.max(0, member.pendingDueInr - amount);
    const updatedMember: Member = {
      ...member,
      paidAmountInr: newPaidAmount,
      pendingDueInr: newPendingDue,
      status: newPendingDue === 0 && member.status === 'defaulter' ? 'active' : member.status
    };

    onPaymentSuccess(newPayment, updatedMember);
    setCompletedPayment({ payment: newPayment, updatedMember });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="relative w-full max-w-md rounded-2xl apple-glass-card p-6 shadow-2xl border border-white/10 text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white apple-press"
        >
          <X className="h-5 w-5" />
        </button>

        {!completedPayment ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                Record Fee Payment
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Member: <strong className="text-zinc-800 dark:text-zinc-200">{member.fullName}</strong> (+91 {member.phone})
              </p>
            </div>

            {/* Outstanding summary */}
            <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950/60">
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-500">Total Plan Fee:</span>
                <span className="font-mono font-medium">₹{member.totalFeeInr.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-500">Already Paid:</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                  ₹{member.paidAmountInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-1 mt-1 font-semibold dark:border-zinc-800">
                <span>Pending Balance:</span>
                <span className="font-mono text-red-600 dark:text-red-400">
                  ₹{member.pendingDueInr.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment Mode Selector */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('upi');
                      setRefId(`UPI-${Math.floor(100000 + Math.random() * 900000)}`);
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all ${
                      mode === 'upi'
                        ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    <QrCode className="h-4 w-4" />
                    <span>UPI (QR)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('cash');
                      setRefId(`CASH-${Date.now().toString().slice(-4)}`);
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all ${
                      mode === 'cash'
                        ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    <Banknote className="h-4 w-4" />
                    <span>Cash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('card');
                      setRefId(`CARD-${Date.now().toString().slice(-4)}`);
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all ${
                      mode === 'card'
                        ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>POS Card</span>
                  </button>
                </div>
              </div>

              {/* UPI QR Display if mode === upi */}
              {mode === 'upi' && (
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-2.5 dark:border-zinc-700 dark:bg-zinc-950/40">
                  <div className="flex h-16 w-16 items-center justify-center rounded bg-white p-1 shadow-sm dark:bg-zinc-800">
                    <QrCode className="h-12 w-12 text-zinc-800 dark:text-zinc-200" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">Scan via GPay / PhonePe</p>
                    <p className="font-mono text-zinc-600 dark:text-zinc-400 text-xs">
                      VPA: <strong className="text-zinc-800 dark:text-zinc-200">{GYM_DEFAULT_INFO.upiVpa}</strong>
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">Amount auto-updates after member confirmation</p>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Amount to Collect (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-sm text-zinc-500">₹</span>
                  <input
                    type="number"
                    autoFocus
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-8 pr-3 text-sm font-semibold tabular-nums text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-100"
                  />
                </div>
              </div>

              {/* Reference ID */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Reference Note / Transaction ID
                </label>
                <input
                  type="text"
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-zinc-900 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  Confirm & Record ₹{amount.toLocaleString('en-IN')}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Payment Recorded Successfully</h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              ₹{completedPayment.payment.amountInr.toLocaleString('en-IN')} received via{' '}
              {completedPayment.payment.paymentMode.toUpperCase()}
            </p>

            <div className="mt-5 space-y-2">
              <a
                href={generatePaymentReceiptWhatsAppUrl(
                  completedPayment.updatedMember,
                  completedPayment.payment
                )}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-xs font-semibold text-white hover:bg-[#20ba59] transition-colors shadow-sm"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Send WhatsApp Receipt to Member</span>
              </a>

              <button
                onClick={onClose}
                className="w-full rounded-lg border border-zinc-200 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Done / Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
