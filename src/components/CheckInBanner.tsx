'use client';

import React from 'react';
import { Member } from '@/types';
import { CheckCircle2, AlertTriangle, X, MessageSquare, IndianRupee } from 'lucide-react';
import { generateDuesReminderWhatsAppUrl } from '@/lib/whatsapp';

interface CheckInBannerProps {
  member: Member | null;
  onDismiss: () => void;
  onOpenPaymentModal: (member: Member) => void;
}

export function CheckInBanner({ member, onDismiss, onOpenPaymentModal }: CheckInBannerProps) {
  if (!member) return null;

  const hasDues = member.pendingDueInr > 0;
  const isExpired = member.status === 'expired';

  return (
    <div
      className={`mx-auto mb-4 max-w-7xl rounded-2xl border p-4 shadow-xl transition-all ${
        hasDues || isExpired
          ? 'border-red-500/40 bg-red-950/40 text-red-100 backdrop-blur-[20px] backdrop-saturate-[180%]'
          : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-100 backdrop-blur-[20px] backdrop-saturate-[180%]'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {hasDues || isExpired ? (
            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-base">{member.fullName}</span>
              <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                +91 {member.phone}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                  member.status === 'active'
                    ? 'bg-emerald-200 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-100'
                    : 'bg-red-200 text-red-950 dark:bg-red-900 dark:text-red-100'
                }`}
              >
                {member.status}
              </span>
            </div>

            <p className="mt-1 text-xs text-zinc-800 dark:text-zinc-200">
              Plan: <strong className="font-medium">{member.planName}</strong> (Valid till {member.endDate})
              {hasDues && (
                <span className="ml-2 font-bold text-red-700 dark:text-red-300">
                  • Pending Dues: ₹{member.pendingDueInr.toLocaleString('en-IN')}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {hasDues && (
            <>
              <a
                href={generateDuesReminderWhatsAppUrl(member)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#20ba59] transition-colors shadow-xs apple-press"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp Reminder</span>
              </a>

              <button
                onClick={() => onOpenPaymentModal(member)}
                className="flex items-center gap-1.5 rounded-xl bg-white text-black px-3.5 py-1.5 text-xs font-black hover:bg-zinc-200 transition-colors shadow-xs apple-press"
              >
                <IndianRupee className="h-3.5 w-3.5" />
                <span>Collect Due</span>
              </button>
            </>
          )}

          <button
            onClick={onDismiss}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors apple-press"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
