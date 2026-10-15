'use client';

import React from 'react';
import { LeadItem } from '@/types';
import { UserCheck, PhoneCall, Calendar } from 'lucide-react';

interface LeadsTabProps {
  leads: LeadItem[];
  onConvertLead: (lead: LeadItem) => void;
}

export function LeadsTab({ leads, onConvertLead }: LeadsTabProps) {
  return (
    <div className="space-y-4">
      {/* Leads Header info */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-xs overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Enquiry & Trial Members Pipeline ({leads.length})
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Track walk-in visitors, trial sessions, and follow-up callbacks
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <PhoneCall className="h-3.5 w-3.5" />
            Lead Roster
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300">
              <tr>
                <th className="py-2.5 px-4">Visitor Name</th>
                <th className="py-2.5 px-4">Phone Number</th>
                <th className="py-2.5 px-4">Fitness Goal</th>
                <th className="py-2.5 px-4">Inquiry Date</th>
                <th className="py-2.5 px-4">Follow-Up Date</th>
                <th className="py-2.5 px-4">Trial Status</th>
                <th className="py-2.5 px-4">Notes</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                  style={{ height: '44px' }}
                >
                  <td className="py-2.5 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    {lead.fullName}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                    +91 {lead.phone}
                  </td>
                  <td className="py-2.5 px-4 capitalize text-zinc-700 dark:text-zinc-300">
                    {lead.goal.replace('_', ' ')}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-zinc-600 dark:text-zinc-400">
                    {lead.inquiryDate}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                      {lead.nextFollowUpDate}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`inline-flex rounded px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        lead.trialStatus === 'converted'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : lead.trialStatus === 'trial_booked'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {lead.trialStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-zinc-700 dark:text-zinc-300 max-w-xs truncate">
                    {lead.notes}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => onConvertLead(lead)}
                      className="inline-flex items-center gap-1 rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-2xs"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Convert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
