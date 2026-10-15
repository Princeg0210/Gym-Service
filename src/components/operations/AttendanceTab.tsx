'use client';

import React, { useState } from 'react';
import { Member, AttendanceRecord } from '@/types';
import { Search, QrCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { sounds } from '@/lib/audio';

interface AttendanceTabProps {
  members: Member[];
  attendanceLogs: AttendanceRecord[];
  onCheckInMember: (member: Member, method: 'phone_search' | 'qr_scan') => void;
  onOpenPaymentModal: (member: Member) => void;
}

export function AttendanceTab({
  members,
  attendanceLogs,
  onCheckInMember,
  onOpenPaymentModal
}: AttendanceTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isQrScanning, setIsQrScanning] = useState(false);

  // Search matching members
  const query = searchQuery.trim().toLowerCase();
  const matchedMembers = query.length >= 2
    ? members.filter(
        (m) =>
          m.phone.includes(query) ||
          m.fullName.toLowerCase().includes(query)
      )
    : [];

  const handleManualCheckIn = (member: Member) => {
    onCheckInMember(member, 'phone_search');
    if (member.pendingDueInr > 0 || member.status === 'expired') {
      sounds.playWarning();
    } else {
      sounds.playSuccess();
    }
    setSearchQuery('');
  };

  const handleSimulateQrScan = () => {
    setIsQrScanning(true);
    setTimeout(() => {
      const randomMember = members[Math.floor(Math.random() * members.length)];
      onCheckInMember(randomMember, 'qr_scan');
      if (randomMember.pendingDueInr > 0 || randomMember.status === 'expired') {
        sounds.playWarning();
      } else {
        sounds.playSuccess();
      }
      setIsQrScanning(false);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* Search & Scanner Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#222738] bg-[#0c0f16] p-4 shadow-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            id="global-checkin-search"
            type="text"
            placeholder="Type member name or last 4 digits of phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#262c3e] bg-[#121622] py-2.5 pl-9 pr-4 text-xs font-medium text-white outline-none focus:border-[#ccff00] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateQrScan}
            disabled={isQrScanning}
            className="flex items-center gap-2 rounded-xl border border-[#2e374e] bg-[#161a25] px-4 py-2.5 text-xs font-bold text-zinc-200 hover:border-[#ccff00]/50 hover:text-white transition-all shadow-xs"
          >
            <QrCode className="h-4 w-4 text-[#ccff00]" />
            <span>{isQrScanning ? 'Scanning...' : 'Scan Member QR Pass'}</span>
          </button>
        </div>
      </div>

      {/* Instant Search Results Dropdown/Box if user types */}
      {searchQuery.length >= 2 && (
        <div className="rounded-xl border border-zinc-300 bg-white p-3 shadow-md dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Matching Members ({matchedMembers.length})
          </div>
          {matchedMembers.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {matchedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-2.5 px-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 font-semibold text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                      {member.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                          {member.fullName}
                        </span>
                        <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                          +91 {member.phone}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${
                            member.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {member.planName} • Valid till {member.endDate}
                        {member.pendingDueInr > 0 && (
                          <span className="ml-2 font-bold text-red-600 dark:text-red-400">
                            • Dues: ₹{member.pendingDueInr.toLocaleString('en-IN')}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {member.pendingDueInr > 0 && (
                      <button
                        onClick={() => onOpenPaymentModal(member)}
                        className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                      >
                        Collect Due
                      </button>
                    )}
                    <button
                      onClick={() => handleManualCheckIn(member)}
                      className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-xs"
                    >
                      Check-In
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-zinc-500">
              No member found matching &quot;{searchQuery}&quot;. Check the phone number or register as new member.
            </div>
          )}
        </div>
      )}

      {/* Live Attendance Table */}
      <div className="rounded-2xl border border-[#222738] bg-[#0c0f16] shadow-md overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#222738] px-4 py-3 bg-[#0f131d]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Live Check-In Register Today ({attendanceLogs.length})
            </h3>
            <p className="text-xs text-zinc-400">
              Sorted by latest entry • Attendance logs retained for member reporting
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Live Stream Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#222738] bg-[#121622] font-bold text-zinc-300">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Time (IST)</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Membership Status</th>
                <th className="py-3 px-4 text-right">Fee Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {attendanceLogs.length > 0 ? (
                attendanceLogs.map((log) => {
                  const checkInDate = new Date(log.checkInTime);
                  const timeFormatted = checkInDate.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                      style={{ height: '44px' }}
                    >
                      <td className="py-2.5 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                        {log.memberName}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                        +91 {log.phone}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                        {timeFormatted}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          {log.checkInMethod === 'qr_scan' ? (
                            <>
                              <QrCode className="h-3.5 w-3.5 text-zinc-500" /> QR Pass
                            </>
                          ) : (
                            <>
                              <Search className="h-3.5 w-3.5 text-zinc-500" /> Front Desk
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold uppercase ${
                            log.planStatus === 'active'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          }`}
                        >
                          {log.planStatus === 'active' ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5" />
                          )}
                          {log.planStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-medium">
                        {log.pendingDueInr > 0 ? (
                          <span className="font-bold text-red-600 dark:text-red-400">
                            ₹{log.pendingDueInr.toLocaleString('en-IN')} Due
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">Clear</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No attendance records for today yet. Use the search box above to check in members.
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
