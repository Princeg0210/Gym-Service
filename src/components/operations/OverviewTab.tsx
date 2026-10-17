'use client';

import React from 'react';
import {
  Member,
  AttendanceRecord,
  PaymentRecord,
  EquipmentItem,
  LeadItem
} from '@/types';
import {
  Search,
  CheckCircle2,
  QrCode,
  IndianRupee,
  ChevronDown,
  ChevronRight,
  BarChart3,
  AlertTriangle,
  Clock,
  Wrench,
  MoreVertical,
  Zap
} from 'lucide-react';
import { SidebarTab } from '../OperationsDashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Curated avatar mapping matching reference photos
const AVATAR_MAP: Record<string, string> = {
  'Vikram Sharma': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  'Amit Singh': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
  'Sneha Nair': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
  'Neha Sharma': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
  'Karan Malhotra': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
  'Rohit Mehta': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80',
  'Aditya Kulkarni': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&h=120&q=80',
  'Pooja Sharma': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
  'Rahul Sharma': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80'
};

export function MemberAvatar({ name, className = 'w-9 h-9' }: { name: string; className?: string }) {
  const url = AVATAR_MAP[name];
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        className={`${className} rounded-full object-cover border border-[#2b354b] shadow-sm`}
      />
    );
  }
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);
  return (
    <div
      className={`${className} rounded-full bg-gradient-to-br from-[#1c2438] to-[#121724] border border-[#2b354b] flex items-center justify-center text-xs font-bold text-zinc-200`}
    >
      {initials}
    </div>
  );
}

export function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.075-2.001-.465-1.576-.65-2.586-2.253-2.664-2.357-.078-.105-.636-.847-.636-1.616s.397-1.144.538-1.302c.142-.158.312-.198.416-.198.104 0 .208.002.298.006.096.004.225-.036.352.27.13.313.447 1.09.486 1.17.039.08.065.174.013.279-.052.104-.078.17-.156.262-.078.092-.164.205-.235.275-.078.078-.16.163-.069.319.091.156.405.669.868 1.082.597.532 1.1.697 1.256.775.156.078.247.065.339-.039.091-.104.391-.456.495-.612.104-.156.208-.13.351-.078.143.052.91.43 1.066.508.156.078.26.117.299.182.039.065.039.378-.105.783zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.307C8.423 21.524 10.151 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );
}

interface OverviewTabProps {
  members: Member[];
  attendanceLogs: AttendanceRecord[];
  payments: PaymentRecord[];
  equipmentList: EquipmentItem[];
  leads: LeadItem[];
  timeframe: 'today' | 'this_week' | 'this_month';
  setTimeframe: (t: 'today' | 'this_week' | 'this_month') => void;
  checkInTab: 'quick' | 'qr';
  setCheckInTab: (tab: 'quick' | 'qr') => void;
  checkInInput: string;
  setCheckInInput: (v: string) => void;
  isCheckInDropdownOpen: boolean;
  setIsCheckInDropdownOpen: (open: boolean) => void;
  quickFilteredMembers: Member[];
  handlePerformCheckIn: (m: Member) => void;
  pendingDuesList: Member[];
  expiringSoonList: Member[];
  outOfServiceItem: { name: string; notes?: string };
  setActiveTab: (tab: SidebarTab) => void;
  setIsQRScannerOpen: (open: boolean) => void;
  setPaymentModalMember: (m: Member) => void;
  setWhatsAppMember: (m: Member) => void;
  setSelectedMemberDossier: (m: Member) => void;
}

export function OverviewTab({
  attendanceLogs,
  timeframe,
  setTimeframe,
  checkInTab,
  setCheckInTab,
  checkInInput,
  setCheckInInput,
  isCheckInDropdownOpen,
  setIsCheckInDropdownOpen,
  quickFilteredMembers,
  handlePerformCheckIn,
  pendingDuesList,
  expiringSoonList,
  outOfServiceItem,
  setActiveTab,
  setIsQRScannerOpen,
  setPaymentModalMember,
  setWhatsAppMember,
  setSelectedMemberDossier
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Dashboard Title & Timeframe Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl lg:text-3xl font-black apple-headline tracking-[-0.02em] text-white">
            Dashboard
          </h1>
          <span className="text-sm font-medium text-zinc-400">
            {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Filter Pills: Today / This Week / This Month */}
        <div className="flex items-center rounded-xl border border-white/10 apple-glass p-1">
          <button
            onClick={() => setTimeframe('today')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all apple-press ${
              timeframe === 'today'
                ? 'bg-[#151c2c] border border-white/15 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeframe('this_week')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all apple-press ${
              timeframe === 'this_week'
                ? 'bg-[#151c2c] border border-white/15 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeframe('this_month')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all apple-press ${
              timeframe === 'this_month'
                ? 'bg-[#151c2c] border border-white/15 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* ── TWO COLUMN MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ════════════════════════════════════════════════════════
            LEFT COLUMN (col-span-8): Check-in, Live List, Charts
        ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 space-y-6">
          {/* CARD 1: Quick Check-In Widget */}
          <Card className="border-[#1e2638] bg-[#0c1017]">
            <CardContent className="p-5">
              {/* Sub-tabs: Quick Check-in & Scan QR Pass */}
              <div className="flex items-center gap-2 mb-4">
                <Button
                  size="sm"
                  variant={checkInTab === 'quick' ? 'volt' : 'secondary'}
                  onClick={() => setCheckInTab('quick')}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Quick Check-in</span>
                </Button>

                <Button
                  size="sm"
                  variant={checkInTab === 'qr' ? 'volt' : 'secondary'}
                  onClick={() => {
                    setCheckInTab('qr');
                    setIsQRScannerOpen(true);
                  }}
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span>Scan QR Pass</span>
                </Button>
              </div>

              {/* Input Box with '/' hotkey cue */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="dashboard-quick-checkin-input"
                  type="text"
                  value={checkInInput}
                  onChange={(e) => {
                    setCheckInInput(e.target.value);
                    setIsCheckInDropdownOpen(true);
                  }}
                  onFocus={() => setIsCheckInDropdownOpen(true)}
                  placeholder="Enter member name or last 4 digits of phone number..."
                  className="pl-10 pr-12 h-11"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6 rounded border border-[#262f44] bg-[#161c2d] font-mono text-xs font-bold text-[#ccff00]">
                  /
                </div>

              {/* Dropdown results */}
              {isCheckInDropdownOpen && quickFilteredMembers.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-[#262f44] bg-[#0c1017] p-2 shadow-2xl space-y-1">
                  {quickFilteredMembers.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handlePerformCheckIn(m)}
                      className="w-full flex items-center justify-between rounded-xl p-2.5 text-left hover:bg-[#161c2b] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <MemberAvatar name={m.fullName} className="w-8 h-8" />
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-[#ccff00]">
                            {m.fullName}
                          </p>
                          <p className="text-xs text-zinc-400">
                            +91 {m.phone} • {m.planName}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-lg bg-[#ccff00] px-3 py-1 text-xs font-black text-black">
                        Check In
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

          {/* CARD 2: Live Check-ins Today */}
          <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <h2 className="text-sm font-bold text-white">
                  Live Check-ins Today ({attendanceLogs.length || 3})
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
              >
                View All
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1b2333] text-zinc-400 font-semibold">
                    <th className="pb-3 w-8">#</th>
                    <th className="pb-3">Member</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161c28]">
                  {(attendanceLogs.length > 0 ? attendanceLogs.slice(0, 3) : [
                    {
                      id: 'att-1',
                      memberId: 'mem-101',
                      memberName: 'Vikram Sharma',
                      phone: '9876543210',
                      checkInTime: '2026-10-13T06:45:00',
                      checkInMethod: 'phone_search',
                      planStatus: 'active',
                      pendingDueInr: 0
                    },
                    {
                      id: 'att-2',
                      memberId: 'mem-105',
                      memberName: 'Amit Singh',
                      phone: '9810556677',
                      checkInTime: '2026-10-13T07:12:00',
                      checkInMethod: 'qr_scan',
                      planStatus: 'active',
                      pendingDueInr: 0
                    },
                    {
                      id: 'att-3',
                      memberId: 'mem-107',
                      memberName: 'Sneha Nair',
                      phone: '9940223344',
                      checkInTime: '2026-10-13T07:55:00',
                      checkInMethod: 'phone_search',
                      planStatus: 'active',
                      pendingDueInr: 0
                    }
                  ]).map((log, idx) => (
                    <tr key={log.id} className="group hover:bg-[#101522] transition-colors">
                      <td className="py-3 font-mono text-zinc-400 font-bold">{idx + 1}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <MemberAvatar name={log.memberName} className="w-7 h-7" />
                          <span className="font-bold text-white group-hover:text-[#ccff00] transition-colors">
                            {log.memberName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-zinc-300">
                        {log.phone.replace(/(\d{4})(\d{6})/, '$1 $2')}
                      </td>
                      <td className="py-3 font-mono text-zinc-300">
                        {new Date(log.checkInTime).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          {log.checkInMethod === 'qr_scan' ? (
                            <>
                              <QrCode className="h-3.5 w-3.5 text-zinc-400" />
                              <span>QR Pass</span>
                            </>
                          ) : (
                            <>
                              <Search className="h-3.5 w-3.5 text-zinc-400" />
                              <span>Front Desk</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant="success" className="text-xs">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Checked In</span>
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <button className="p-1 text-zinc-400 hover:text-white transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytical Charts (Side by Side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD 3A: Attendance Overview */}
            <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#ccff00]" />
                  <h3 className="text-xs font-bold text-white">Attendance Overview</h3>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-[#202738] bg-[#101522] px-2 py-1 text-[11px] font-bold text-zinc-300">
                  <span>This Week</span>
                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="relative pt-6 pb-2">
                <div className="absolute top-0 left-[24%] -translate-x-1/2 z-20 rounded-xl border border-[#2c364e] bg-[#0a0e16] px-3 py-1.5 text-center shadow-xl">
                  <p className="text-xs font-medium text-zinc-300">Tue, 26 Aug</p>
                  <p className="font-mono text-xs font-black text-[#ccff00]">
                    42 check-ins
                  </p>
                </div>

                <div className="h-32 flex items-end justify-between gap-2 border-b border-[#1b2333] px-2 pb-1">
                  <div className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[66%]" />
                  </div>
                  <div className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[35%]" />
                  </div>
                  <div className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[78%]" />
                  </div>
                  <div className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[82%]" />
                  </div>
                  <div className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[58%]" />
                  </div>
                  <div className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[70%]" />
                  </div>
                  <div className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[30%]" />
                  </div>
                </div>

                <div className="flex justify-between px-2 pt-2 text-[11px] font-mono text-zinc-400">
                  <span className="flex-1 text-center">Mon</span>
                  <span className="flex-1 text-center font-bold text-[#ccff00]">Tue</span>
                  <span className="flex-1 text-center">Wed</span>
                  <span className="flex-1 text-center">Thu</span>
                  <span className="flex-1 text-center">Fri</span>
                  <span className="flex-1 text-center">Sat</span>
                  <span className="flex-1 text-center">Sun</span>
                </div>
              </div>
            </div>

            {/* CARD 3B: Peak Hours Heatmap */}
            <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#ccff00]" />
                  <h3 className="text-xs font-bold text-white">Peak Hours Heatmap</h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#1b253a]" />
                    <span className="text-zinc-400">Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#ccff00]" />
                    <span className="text-zinc-400">Peak</span>
                  </div>
                </div>
              </div>

              {/* Time Blocks Grid */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1">
                    <span>Morning Peak (06:00 - 09:30 AM)</span>
                    <span className="font-mono text-[#ccff00]">88% Capacity</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#161c28] overflow-hidden">
                    <div className="h-full rounded-full bg-[#ccff00] w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1">
                    <span>Afternoon Steady (12:00 - 04:00 PM)</span>
                    <span className="font-mono text-zinc-400">32% Capacity</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#161c28] overflow-hidden">
                    <div className="h-full rounded-full bg-[#2a3854] w-[32%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1">
                    <span>Evening Rush (05:30 - 09:30 PM)</span>
                    <span className="font-mono text-[#ccff00]">94% Capacity</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#161c28] overflow-hidden">
                    <div className="h-full rounded-full bg-[#ccff00] w-[94%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            RIGHT COLUMN (col-span-4): Pending Dues, Expiring, Equipment
        ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 4: Pending Dues */}
          <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <h3 className="text-sm font-bold text-white">Pending Dues</h3>
              </div>
              <button
                onClick={() => setActiveTab('dues')}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {pendingDuesList.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-[#1d2436] bg-[#101522] p-3 hover:border-[#2b364e] transition-colors"
                >
                  <div
                    onClick={() => setSelectedMemberDossier(m)}
                    className="flex items-center gap-3 cursor-pointer group flex-1"
                  >
                    <MemberAvatar name={m.fullName} className="w-8 h-8" />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-[#ccff00] transition-colors">
                        {m.fullName}
                      </p>
                      <p className="text-xs font-mono font-bold text-red-400">
                        ₹{m.pendingDueInr.toLocaleString('en-IN')} pending
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setWhatsAppMember(m)}
                      title="Send WhatsApp Payment Reminder"
                      className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-1.5 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setPaymentModalMember(m)}
                      title="Collect Fee Payment"
                      className="flex items-center gap-1 rounded-lg bg-[#ccff00] px-2.5 py-1.5 text-xs font-black text-black hover:bg-[#b8e600] transition-colors"
                    >
                      <IndianRupee className="h-3 w-3" />
                      <span>Pay</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 5: Expiring Soon */}
          <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Expiring Soon (Next 7 Days)</h3>
              </div>
              <button
                onClick={() => setActiveTab('members')}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {expiringSoonList.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-[#1d2436] bg-[#101522] p-3 hover:border-[#2b364e] transition-colors"
                >
                  <div
                    onClick={() => setSelectedMemberDossier(m)}
                    className="flex items-center gap-3 cursor-pointer group flex-1"
                  >
                    <MemberAvatar name={m.fullName} className="w-8 h-8" />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-[#ccff00] transition-colors">
                        {m.fullName}
                      </p>
                      <p className="text-xs text-amber-400 font-medium">
                        Expires {m.endDate}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setWhatsAppMember(m)}
                    className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-950/40 px-2.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-400 hover:text-black transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Renew</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 6: Equipment Health Status (Donut Chart) */}
          <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-[#ccff00]" />
                <h3 className="text-sm font-bold text-white">Equipment Status</h3>
              </div>
              <button
                onClick={() => setActiveTab('equipment')}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
              >
                Manage
              </button>
            </div>

            <div className="flex items-center justify-around py-3">
              {/* Donut Chart SVG */}
              <div className="relative h-28 w-28">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-[#131926]"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Working: 60% (3/5) */}
                  <path
                    className="text-emerald-400"
                    strokeDasharray="60, 100"
                    strokeDashoffset="0"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Maintenance: 20% (1/5) */}
                  <path
                    className="text-amber-400"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-60"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Out of Service: 20% (1/5) */}
                  <path
                    className="text-red-500"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-80"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-base font-black text-white">3/5</span>
                  <span className="text-xs font-bold text-zinc-400 leading-none">
                    Stations OK
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-6 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-zinc-300">Working</span>
                  </div>
                  <span className="font-mono font-bold text-white">3</span>
                </div>
                <div className="flex items-center gap-6 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-zinc-300">Maintenance</span>
                  </div>
                  <span className="font-mono font-bold text-white">1</span>
                </div>
                <div className="flex items-center gap-6 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-zinc-300">Out of Service</span>
                  </div>
                  <span className="font-mono font-bold text-white">1</span>
                </div>
              </div>
            </div>

            {/* Bottom Alert Card */}
            <div
              onClick={() => setActiveTab('equipment')}
              className="mt-4 pt-3 border-t border-[#1b2333] flex items-center justify-between hover:bg-red-950/20 px-2 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{outOfServiceItem.name}</p>
                  <p className="text-xs text-zinc-400">Reported 2 days ago</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="rounded border border-red-500/40 bg-red-950/40 px-2 py-0.5 text-xs font-bold text-red-300">
                  Out of Service
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
