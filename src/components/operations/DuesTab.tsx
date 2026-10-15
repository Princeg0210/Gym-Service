'use client';

import React, { useState } from 'react';
import { Member } from '@/types';
import { MessageSquare, IndianRupee, AlertTriangle } from 'lucide-react';
import { generateDuesReminderWhatsAppUrl } from '@/lib/whatsapp';

interface DuesTabProps {
  members: Member[];
  onOpenPaymentModal: (member: Member) => void;
}

export function DuesTab({ members, onOpenPaymentModal }: DuesTabProps) {
  const [filter, setFilter] = useState<'all' | '7days' | '15days'>('all');

  // Filter members with pending fees
  const defaulters = members.filter((m) => m.pendingDueInr > 0);

  // Compute days overdue based on endDate vs current date (2026-10-13)
  const today = new Date('2026-10-13');
  const getDaysOverdue = (endDateStr: string): number => {
    const end = new Date(endDateStr);
    const diffTime = today.getTime() - end.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const filteredDefaulters = defaulters.filter((m) => {
    const overdueDays = getDaysOverdue(m.endDate);
    if (filter === '7days') return overdueDays >= 7;
    if (filter === '15days') return overdueDays >= 15;
    return true;
  });

  const totalOutstanding = defaulters.reduce((acc, m) => acc + m.pendingDueInr, 0);

  return (
    <div className="space-y-4">
      {/* Recovery Ribbon */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-red-500/30 bg-red-950/20 p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-100">
              Unpaid Fee Recovery Register
            </h3>
            <p className="text-xs text-red-300">
              <strong className="font-mono font-bold text-red-200">
                ₹{totalOutstanding.toLocaleString('en-IN')}
              </strong>{' '}
              pending recovery across {defaulters.length} gym members
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex rounded-xl border border-[#262c3e] bg-[#0c0f16] p-1">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              filter === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Dues ({defaulters.length})
          </button>
          <button
            onClick={() => setFilter('7days')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              filter === '7days'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            &gt; 7 Days Overdue
          </button>
          <button
            onClick={() => setFilter('15days')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              filter === '15days'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            &gt; 15 Days Overdue
          </button>
        </div>
      </div>

      {/* Dues Table */}
      <div className="rounded-2xl border border-[#222738] bg-[#0c0f16] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#222738] bg-[#121622] font-bold text-zinc-300">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Plan Name</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Overdue Days</th>
                <th className="py-3 px-4 text-right">Pending Amount</th>
                <th className="py-3 px-4 text-center">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2332]">
              {filteredDefaulters.length > 0 ? (
                filteredDefaulters.map((member) => {
                  const overdueDays = getDaysOverdue(member.endDate);
                  const isSevere = overdueDays >= 10;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                      style={{ height: '44px' }}
                    >
                      <td className="py-2.5 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                        {member.fullName}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-zinc-600 dark:text-zinc-400">
                        +91 {member.phone}
                      </td>
                      <td className="py-2.5 px-4 text-zinc-700 dark:text-zinc-300">
                        {member.planName}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-zinc-600 dark:text-zinc-400">
                        {member.endDate}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-xs font-bold ${
                            isSevere
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {overdueDays > 0 ? `${overdueDays} days late` : 'Due today'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-red-600 dark:text-red-400 text-sm">
                        ₹{member.pendingDueInr.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={generateDuesReminderWhatsAppUrl(member)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 rounded bg-[#25D366] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#20ba59] transition-colors shadow-2xs"
                            title="Send pre-filled WhatsApp reminder"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>
                          <button
                            onClick={() => onOpenPaymentModal(member)}
                            className="flex items-center gap-1 rounded bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-2xs"
                          >
                            <IndianRupee className="h-3.5 w-3.5" />
                            <span>Collect</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    No pending dues found under this filter. All fees up to date!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
