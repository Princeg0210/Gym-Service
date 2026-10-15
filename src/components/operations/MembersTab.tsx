'use client';

import React, { useState } from 'react';
import { Member, MemberStatus } from '@/types';
import { Search, UserPlus, IndianRupee, Eye, Sparkles } from 'lucide-react';

interface MembersTabProps {
  members: Member[];
  onOpenAddMember: () => void;
  onOpenPaymentModal: (member: Member) => void;
  onSelectMember: (member: Member) => void;
}

export function MembersTab({
  members,
  onOpenAddMember,
  onOpenPaymentModal,
  onSelectMember
}: MembersTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MemberStatus>('all');

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search);
    const matchesStatus =
      statusFilter === 'all' ? true : m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search and Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#1e2638] bg-[#0c1017] p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search roster by member name, phone or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#232b3d] bg-[#121724] py-2 pl-9 pr-4 text-xs font-medium text-white outline-none focus:border-[#ccff00] transition-colors placeholder:text-zinc-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filters */}
          <div className="flex rounded-lg border border-[#232b3d] bg-[#121724] p-0.5">
            {(['all', 'active', 'defaulter', 'expired'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-[#ccff00] text-black shadow-xs font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAddMember}
            className="flex items-center gap-1.5 rounded-lg bg-[#ccff00] px-3.5 py-2 text-xs font-black text-black hover:bg-[#b5e600] transition-colors shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Member Table */}
      <div className="rounded-xl border border-[#1e2638] bg-[#0c1017] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#1b2333] bg-[#0e131d] font-bold text-zinc-300">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Plan & Validity</th>
                <th className="py-3 px-4">Goal / Diet</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Fee Ledger (Paid / Due)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182030]">
              {filtered.length > 0 ? (
                filtered.map((member) => (
                  <tr
                    key={member.id}
                    onClick={() => onSelectMember(member)}
                    className="hover:bg-[#121724] cursor-pointer transition-colors group"
                    style={{ height: '48px' }}
                  >
                    <td className="py-2.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1b2333] border border-[#2b354b] text-xs font-bold text-[#ccff00]">
                          {member.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span>{member.fullName}</span>
                          <span className="block text-xs font-normal text-zinc-400">
                            Age {member.age} • {member.gender}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-zinc-300">
                      +91 {member.phone}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-medium text-white">
                        {member.planName}
                      </span>
                      <span className="block font-mono text-xs text-zinc-400">
                        {member.startDate} → {member.endDate}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="capitalize text-zinc-200">
                        {member.fitnessGoal.replace('_', ' ')}
                      </span>
                      <span className="block text-xs text-zinc-400 capitalize">
                        {member.dietaryPreference.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-flex rounded px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                          member.status === 'active'
                            ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                            : member.status === 'defaulter'
                            ? 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
                            : 'bg-red-950/80 border border-red-500/50 text-red-300'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono">
                      <span className="text-emerald-400 font-bold">
                        ₹{member.paidAmountInr.toLocaleString('en-IN')}
                      </span>
                      <span className="text-zinc-400"> / </span>
                      {member.pendingDueInr > 0 ? (
                        <span className="font-bold text-red-400">
                          ₹{member.pendingDueInr.toLocaleString('en-IN')} due
                        </span>
                      ) : (
                        <span className="text-zinc-400">₹0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectMember(member)}
                          title="View Full Member Profile Dossier"
                          className="inline-flex items-center gap-1 rounded-lg border border-[#232b3d] bg-[#141926] px-2.5 py-1 text-xs font-bold text-zinc-300 hover:border-[#ccff00] hover:text-white transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#ccff00]" />
                          <span>Details</span>
                        </button>
                        <button
                          onClick={() => onOpenPaymentModal(member)}
                          title="Record Payment"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#ccff00] px-2 py-1 text-xs font-black text-black hover:bg-[#b5e600] transition-colors"
                        >
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span>Pay</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-zinc-400">
                    No members found matching your search.
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
