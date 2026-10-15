'use client';

import React, { useState } from 'react';
import { Member, AttendanceRecord, PaymentRecord } from '@/types';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  IndianRupee,
  QrCode,
  Dumbbell,
  User,
  ArrowRight
} from 'lucide-react';
import { generateDuesReminderWhatsAppUrl } from '@/lib/whatsapp';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MemberDetailsModalProps {
  member: Member | null;
  attendanceLogs?: AttendanceRecord[];
  payments?: PaymentRecord[];
  onClose: () => void;
  onOpenPaymentModal: (member: Member) => void;
  onRenewMembership?: (member: Member) => void;
}

export function MemberDetailsModal({
  member,
  attendanceLogs = [],
  payments = [],
  onClose,
  onOpenPaymentModal,
  onRenewMembership
}: MemberDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'payments' | 'qr'>('overview');

  if (!member) return null;

  const memberAttendance = attendanceLogs.filter((a) => a.memberId === member.id);
  const memberPayments = payments.filter((p) => p.memberId === member.id);

  const hasDues = member.pendingDueInr > 0;

  // Calculate days left
  const end = new Date(member.endDate).getTime();
  const now = new Date().getTime();
  const daysDiff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#232b3d] bg-[#0c1017] shadow-2xl text-zinc-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#1b2333] px-6 py-4 bg-[#0e131d]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#ccff00] to-[#88b300] text-black font-black text-base shadow-md">
              {member.avatarSeed || member.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{member.fullName}</h3>
                <Badge
                  variant={
                    member.status === 'active'
                      ? 'success'
                      : member.status === 'defaulter'
                      ? 'warning'
                      : 'destructive'
                  }
                >
                  {member.status}
                </Badge>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                ID: {member.id} • Registered Member
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#1b2333] bg-[#090d16] px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#ccff00] text-[#ccff00]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Profile & Dues
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'attendance'
                ? 'border-[#ccff00] text-[#ccff00]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Attendance History ({memberAttendance.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'payments'
                ? 'border-[#ccff00] text-[#ccff00]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Payment Receipts ({memberPayments.length})
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'qr'
                ? 'border-[#ccff00] text-[#ccff00]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Digital QR Pass
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Alert Dues / Expiry Banner if relevant */}
              {hasDues && (
                <div className="flex items-center justify-between rounded-xl border border-red-500/40 bg-red-950/30 p-3.5 text-xs text-red-200">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                    <span>
                      Pending Dues: <strong className="font-mono text-white">₹{member.pendingDueInr.toLocaleString('en-IN')}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={generateDuesReminderWhatsAppUrl(member)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
                    >
                      WhatsApp Notice
                    </a>
                    <button
                      onClick={() => onOpenPaymentModal(member)}
                      className="rounded-lg bg-[#ccff00] px-3 py-1.5 text-xs font-bold text-black hover:bg-[#b5e600] transition-colors"
                    >
                      Collect Now
                    </button>
                  </div>
                </div>
              )}

              {/* Membership Plan Card */}
              <div className="rounded-xl border border-[#1e2638] bg-[#111724] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
                    Current Membership
                  </span>
                  <span className={`text-xs font-mono font-bold ${daysDiff <= 7 ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {daysDiff > 0 ? `${daysDiff} days remaining` : 'Expired'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1f283a] pb-3">
                  <div>
                    <h4 className="text-base font-black text-white">{member.planName}</h4>
                    <p className="text-xs text-zinc-400 font-mono">
                      Validity: {member.startDate} → {member.endDate}
                    </p>
                  </div>
                  {onRenewMembership && (
                    <button
                      onClick={() => onRenewMembership(member)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#ccff00]/40 bg-[#ccff00]/10 px-3 py-1.5 text-xs font-bold text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-colors"
                    >
                      <span>Renew Plan</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Financial Ledger */}
                <div className="grid grid-cols-3 gap-3 pt-1 text-center font-mono">
                  <div className="rounded-lg bg-[#0c1017] p-2.5 border border-[#1b2333]">
                    <span className="block text-xs text-zinc-400">Total Fee</span>
                    <span className="text-sm font-bold text-white">
                      ₹{member.totalFeeInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="rounded-lg bg-[#0c1017] p-2.5 border border-[#1b2333]">
                    <span className="block text-xs text-zinc-400">Paid Amount</span>
                    <span className="text-sm font-bold text-emerald-400">
                      ₹{member.paidAmountInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="rounded-lg bg-[#0c1017] p-2.5 border border-[#1b2333]">
                    <span className="block text-xs text-zinc-400">Pending Due</span>
                    <span className={`text-sm font-bold ${member.pendingDueInr > 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                      ₹{member.pendingDueInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal & Fitness Attributes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#1e2638] bg-[#111724] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                    <User className="h-3.5 w-3.5 text-[#ccff00]" />
                    <span>Personal Profile</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Age & Gender:</span>
                      <span className="capitalize font-medium text-white">{member.age} yrs • {member.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Phone:</span>
                      <span className="font-mono text-white">+91 {member.phone}</span>
                    </div>
                    {member.emergencyContact && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Emergency:</span>
                        <span className="font-mono text-zinc-300">+91 {member.emergencyContact}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-[#1e2638] bg-[#111724] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                    <Dumbbell className="h-3.5 w-3.5 text-[#ccff00]" />
                    <span>Athletic Goals</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Goal:</span>
                      <span className="capitalize font-medium text-[#ccff00]">
                        {member.fitnessGoal.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Dietary Diet:</span>
                      <span className="capitalize font-medium text-white">
                        {member.dietaryPreference.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Database Sync:</span>
                      <span className="text-emerald-400 font-bold">Neon PostgreSQL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-300">Recent Check-In Timestamp Logs</h4>
              {memberAttendance.length > 0 ? (
                <div className="divide-y divide-[#1b2333] rounded-xl border border-[#1e2638] bg-[#111724] overflow-hidden">
                  {memberAttendance.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <div>
                          <span className="font-medium text-white">Checked in at gym desk</span>
                          <p className="text-zinc-400 text-xs">Method: {log.checkInMethod === 'qr_scan' ? 'Digital QR Scan' : 'Phone Search'}</p>
                        </div>
                      </div>
                      <span className="font-mono text-zinc-400 text-xs">
                        {new Date(log.checkInTime).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-[#1e2638] bg-[#111724] p-6 text-center text-xs text-zinc-400">
                  No attendance records logged yet for this member.
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-300">Fee Payment History</h4>
              {memberPayments.length > 0 ? (
                <div className="divide-y divide-[#1b2333] rounded-xl border border-[#1e2638] bg-[#111724] overflow-hidden">
                  {memberPayments.map((pay) => (
                    <div key={pay.id} className="flex items-center justify-between p-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <IndianRupee className="h-4 w-4 text-[#ccff00]" />
                        <div>
                          <span className="font-bold text-white">₹{pay.amountInr.toLocaleString('en-IN')}</span>
                          <p className="text-zinc-400 text-xs font-mono">
                            Ref: {pay.transactionRef} • Mode: {pay.paymentMode.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-zinc-400 text-xs">
                        {new Date(pay.timestamp).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-[#1e2638] bg-[#111724] p-6 text-center text-xs text-zinc-400">
                  No separate payment receipts recorded yet for this member.
                </div>
              )}
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
              <div className="rounded-2xl border-2 border-[#ccff00] bg-white p-6 shadow-xl">
                {/* SVG QR Code Simulation */}
                <div className="flex flex-col items-center justify-center h-48 w-48 text-black">
                  <QrCode className="h-36 w-36" />
                  <span className="mt-2 font-mono text-xs font-black tracking-widest text-zinc-800">
                    {member.id.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">GymPRO Member Access Pass</p>
                <p className="text-xs text-zinc-400 max-w-sm">
                  Athlete scans this QR code at the turnstile or front desk camera for instant zero-contact check-in.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#1b2333] bg-[#0e131d] px-6 py-3.5 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            Status: <span className="text-white font-bold capitalize">{member.status}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="volt"
              size="sm"
              onClick={() => onOpenPaymentModal(member)}
            >
              <IndianRupee className="h-3.5 w-3.5" />
              <span>Record Fee / Payment</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
