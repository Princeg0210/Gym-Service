'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Member,
  AttendanceRecord,
  PaymentRecord,
  EquipmentItem,
  LeadItem,
  WorkoutRoutine,
  Exercise
} from '@/types';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  Layers,
  PhoneCall,
  Dumbbell,
  Utensils,
  Wrench,
  BarChart3,
  UserCheck,
  Settings,
  Search,
  Bell,
  Clock,
  ChevronDown,
  ChevronRight,
  QrCode,
  UserPlus,
  Home,
  MessageSquare
} from 'lucide-react';
import { AttendanceTab } from './operations/AttendanceTab';
import { DuesTab } from './operations/DuesTab';
import { MembersTab } from './operations/MembersTab';
import { EquipmentTab } from './operations/EquipmentTab';
import { LeadsTab } from './operations/LeadsTab';
import { WorkoutsTab } from './operations/WorkoutsTab';
import { DietTab } from './operations/DietTab';
import { OverviewTab, MemberAvatar, WhatsAppIcon } from './operations/OverviewTab';
import { CheckInBanner } from './CheckInBanner';
import { ExpiringAlertsCenter } from './ExpiringAlertsCenter';
import { BusinessIntelligenceReports } from './BusinessIntelligenceReports';
import { RecordPaymentModal } from './modals/RecordPaymentModal';
import { AddMemberModal } from './modals/AddMemberModal';
import { MemberDetailsModal } from './modals/MemberDetailsModal';
import { QRScanModal } from './modals/QRScanModal';
import { WhatsAppReminderModal } from './modals/WhatsAppReminderModal';
import { sounds } from '@/lib/audio';

export type SidebarTab =
  | 'dashboard'
  | 'members'
  | 'attendance'
  | 'dues'
  | 'renewal_bot'
  | 'plans'
  | 'leads'
  | 'workouts'
  | 'diet'
  | 'equipment'
  | 'reports'
  | 'staff'
  | 'settings';

interface OperationsDashboardProps {
  members: Member[];
  attendanceLogs: AttendanceRecord[];
  payments: PaymentRecord[];
  equipmentList: EquipmentItem[];
  leads: LeadItem[];
  routines?: WorkoutRoutine[];
  exercises?: Exercise[];
  onCheckInMember: (member: Member, method: 'phone_search' | 'qr_scan') => void;
  onPaymentSuccess: (payment: PaymentRecord, updatedMember: Member) => void;
  onMemberCreated: (member: Member, initialPayment?: PaymentRecord) => void;
  onToggleEquipmentStatus: (id: string, status: EquipmentItem['status']) => void;
  checkedInBannerMember: Member | null;
  onDismissBanner: () => void;
  onSwitchToShowcase?: () => void;
  onSwitchToMemberPortal?: () => void;
  onUpdateRoutines?: (routines: WorkoutRoutine[]) => void;
}

export function OperationsDashboard({
  members,
  attendanceLogs,
  payments,
  equipmentList,
  leads,
  routines = [],
  exercises = [],
  onCheckInMember,
  onPaymentSuccess,
  onMemberCreated,
  onToggleEquipmentStatus,
  checkedInBannerMember,
  onDismissBanner,
  onUpdateRoutines
}: OperationsDashboardProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [timeframe, setTimeframe] = useState<'today' | 'this_week' | 'this_month'>('today');
  const [checkInTab, setCheckInTab] = useState<'quick' | 'qr'>('quick');

  // Search & Typeahead
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInInput, setCheckInInput] = useState('');
  const [isCheckInDropdownOpen, setIsCheckInDropdownOpen] = useState(false);

  // Modals State
  const [paymentModalMember, setPaymentModalMember] = useState<Member | null>(null);
  const [whatsAppMember, setWhatsAppMember] = useState<Member | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [selectedMemberDossier, setSelectedMemberDossier] = useState<Member | null>(null);

  // Live time string (matches reference format)
  const [timeStr, setTimeStr] = useState('07:11 PM');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  // Global hotkeys ('/' to focus check-in, 'Cmd+K' to focus top search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        const input = document.getElementById('dashboard-quick-checkin-input');
        if (input) input.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const topSearch = document.getElementById('top-global-search-input');
        if (topSearch) topSearch.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered members for the Quick Check-in input
  const quickFilteredMembers = useMemo(() => {
    const q = checkInInput.trim().toLowerCase();
    if (q.length < 1) return [];
    return members.filter(
      (m) =>
        m.phone.includes(q) ||
        m.fullName.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    );
  }, [checkInInput, members]);

  // Handle Quick Check-In Select
  const handlePerformCheckIn = (member: Member) => {
    onCheckInMember(member, 'phone_search');
    if (member.pendingDueInr > 0 || member.status === 'expired') {
      sounds.playWarning();
    } else {
      sounds.playSuccess();
    }
    setCheckInInput('');
    setIsCheckInDropdownOpen(false);
  };

  // Pending dues list (matches reference members: Neha Sharma, Karan Malhotra, Rohit Mehta)
  const pendingDuesList = useMemo(() => {
    return members.filter((m) => m.pendingDueInr > 0).slice(0, 3);
  }, [members]);

  // Expiring soon list (matches reference members: Aditya Kulkarni, Pooja Sharma)
  const expiringSoonList = useMemo(() => {
    const today = new Date('2026-10-13');
    return members
      .filter((m) => {
        if (m.status !== 'active') return false;
        const end = new Date(m.endDate);
        const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      })
      .slice(0, 2);
  }, [members]);

  // The Out of Service equipment item for the alert card
  const outOfServiceItem = equipmentList.find((e) => e.status === 'out_of_order') || {
    name: 'Leg Press Machine',
    notes: 'Reported 2 days ago'
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-zinc-100 flex flex-col font-sans antialiased selection:bg-[#ccff00] selection:text-black">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR (Exact reference reproduction)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1b2333] bg-[#090d16]/95 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left: GymPRO ADMIN PORTAL Logo + Branch */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccff00] text-black shadow-md">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  Gym<span className="text-[#ccff00]">PRO</span>
                </span>
                <span className="rounded-full border border-[#ccff00]/60 bg-[#ccff00]/10 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-[#ccff00]">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium leading-none">
                Operations & Management Console • Alpha Fitness
              </p>
            </div>
          </div>

          {/* Center: Global Search Bar with ⌘ K */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                id="top-global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member by name, phone or member ID..."
                className="w-full rounded-xl border border-[#202738] bg-[#101522] py-2 pl-10 pr-12 text-xs font-medium text-white placeholder-zinc-400 outline-none focus:border-[#ccff00] transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded border border-[#262f44] bg-[#161c2d] px-1.5 py-0.5 font-mono text-xs font-bold text-zinc-400">
                <span>⌘</span>
                <span>K</span>
              </div>

              {/* Quick Search Dropdown */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-[#232b3d] bg-[#0c1017] p-2 shadow-2xl z-50 max-h-80 overflow-y-auto">
                  {members
                    .filter(
                      (m) =>
                        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.phone.includes(searchQuery) ||
                        m.id.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 6)
                    .map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMemberDossier(m);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#151b2b] text-left transition-colors border-b border-[#1b2333] last:border-b-0"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e2638] text-xs font-black text-[#ccff00]">
                            {m.fullName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{m.fullName}</p>
                            <p className="text-xs text-zinc-400 font-mono">+91 {m.phone} • {m.planName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${m.status === 'active' ? 'bg-emerald-950/80 text-emerald-300' : 'bg-red-950/80 text-red-300'
                            }`}>
                            {m.status}
                          </span>
                          <span className="text-xs font-bold text-[#ccff00]">View Dossier →</span>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Date/Time Badge, Notifications, WhatsApp, Profile & Showcase Switcher */}
          <div className="flex items-center gap-3">
            {/* Live Database Sync Indicator */}
            <div className="hidden 2xl:flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/20 px-3 py-1.5 text-xs font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Neon DB Live</span>
            </div>

            {/* Live Date, Time & Open Status Pill */}
            <div className="hidden xl:flex items-center gap-2.5 rounded-xl border border-[#202738] bg-[#101522] px-3.5 py-1.5 text-xs text-zinc-300">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              <span className="font-medium text-zinc-300">Tue, 26 Aug 2025</span>
              <span className="font-mono text-zinc-400 font-bold">{timeStr}</span>
              <span className="flex items-center gap-1.5 font-bold text-[#ccff00]">
                <span className="h-2 w-2 rounded-full bg-[#ccff00]" />
                <span>Open Now</span>
              </span>
            </div>

            {/* Notification Bell with Badge '3' */}
            <button
              onClick={() => setActiveTab('leads')}
              title="3 Enquiries pending follow-up"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#202738] bg-[#101522] text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-950 border border-red-500/50 text-xs font-bold text-red-200">
                3
              </span>
            </button>

            {/* WhatsApp Quick Launcher */}
            <button
              onClick={() => {
                if (pendingDuesList[0]) setWhatsAppMember(pendingDuesList[0]);
              }}
              title="Open WhatsApp dues messenger"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#202738] bg-[#101522] text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-colors"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </button>

            {/* Profile Avatar Card: RS Rahul Sharma Owner */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#1f283a]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2638] border border-[#2f3a52] text-xs font-black text-white">
                RS
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-bold text-white">Rahul Sharma</p>
                <p className="text-xs text-zinc-400">Owner</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 hidden sm:block" />
            </div>

            {/* Dedicated Portals Navigation */}
            <Link
              href="/"
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-[#232b3d] bg-[#121724] px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-[#ccff00]" />
              <span>Home Screen</span>
            </Link>

            <Link
              href="/member"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#ccff00]/40 bg-[#ccff00]/10 px-3 py-1.5 text-xs font-bold text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-all shadow-sm"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Member Portal (/member)</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN BODY: LEFT SIDEBAR + MAIN CONTENT WORKSPACE
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1">
        {/* ── LEFT SIDEBAR NAVIGATION ── */}
        <aside className="w-60 shrink-0 border-r border-[#1b2333] bg-[#090d16] p-4 flex flex-col justify-between hidden md:flex">
          {/* Quick Action Button */}
          <div className="mb-4">
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ccff00] py-2.5 px-3 text-xs font-black text-black hover:bg-[#b5e600] transition-all shadow-md active:scale-95"
            >
              <UserPlus className="h-4 w-4" />
              <span>+ Add Member</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'dashboard'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'members'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>Members</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'attendance'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('dues')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'dues'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <CreditCard className="h-4 w-4 shrink-0" />
              <span>Payments & Dues</span>
            </button>

            <button
              onClick={() => setActiveTab('renewal_bot')}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'renewal_bot'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span>Renewal Bot</span>
              </div>
              <span
                className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === 'renewal_bot'
                    ? 'bg-black text-[#ccff00]'
                    : 'bg-[#25d366]/20 text-[#25d366] border border-[#25d366]/30'
                }`}
              >
                AUTO
              </span>
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'plans'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <Layers className="h-4 w-4 shrink-0" />
              <span>Plans & Memberships</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'leads'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <PhoneCall className="h-4 w-4 shrink-0" />
                <span>Enquiries & Trials</span>
              </div>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-950 border border-red-500/50 text-xs font-bold text-red-200">
                3
              </span>
            </button>

            <button
              onClick={() => setActiveTab('workouts')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'workouts'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <Dumbbell className="h-4 w-4 shrink-0" />
              <span>Workouts & Plans</span>
            </button>

            <button
              onClick={() => setActiveTab('diet')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'diet'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <Utensils className="h-4 w-4 shrink-0" />
              <span>Diet & Nutrition</span>
            </button>

            <button
              onClick={() => setActiveTab('equipment')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'equipment'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <Wrench className="h-4 w-4 shrink-0" />
              <span>Equipment</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'reports'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'staff'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <UserCheck className="h-4 w-4 shrink-0" />
              <span>Staff & Trainers</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'settings'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Bottom Sidebar Cards: Branch & User */}
          <div className="pt-4 space-y-2 border-t border-[#1b2333]">
            {/* Gym Branch Card */}
            <div className="flex items-center justify-between rounded-2xl border border-[#1f283a] bg-[#101522] p-2.5 hover:border-zinc-500 cursor-pointer transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-zinc-800">
                  <Image
                    src="/images/gym_equipment_modern.jpg"
                    alt="Alpha Fitness Gym"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Alpha Fitness Gym</p>
                  <p className="text-xs text-zinc-400 leading-tight">Koramangala, Bengaluru</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-400" />
            </div>

            {/* Rahul Sharma Profile Card */}
            <div className="flex items-center justify-between rounded-2xl border border-[#1f283a] bg-[#101522] p-2.5 hover:border-zinc-500 cursor-pointer transition-colors">
              <div className="flex items-center gap-2.5">
                <MemberAvatar name="Rahul Sharma" className="w-8 h-8" />
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Rahul Sharma</p>
                  <p className="text-xs text-zinc-400 leading-tight">Owner</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-400" />
            </div>

            {/* Direct Navigation to Member Portal & Showcase */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <Link
                href="/member"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#232b3d] bg-[#0c1018] py-2 font-semibold text-zinc-300 hover:border-[#ccff00]/40 hover:text-[#ccff00] transition-colors"
              >
                <Dumbbell className="h-3.5 w-3.5" />
                <span>Member Arena</span>
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center rounded-xl border border-[#232b3d] bg-[#0c1018] p-2 text-zinc-300 hover:text-white transition-colors"
                title="Home Screen"
              >
                <Home className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT WORKSPACE ── */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* Check-In Result Banner */}
          <CheckInBanner
            member={checkedInBannerMember}
            onDismiss={onDismissBanner}
            onOpenPaymentModal={(m) => setPaymentModalMember(m)}
          />

          {/* ─────────────────────────────────────────────────────────────
              VIEW: DASHBOARD (Exact reference screenshot match)
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <OverviewTab
              members={members}
              attendanceLogs={attendanceLogs}
              payments={payments}
              equipmentList={equipmentList}
              leads={leads}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              checkInTab={checkInTab}
              setCheckInTab={setCheckInTab}
              checkInInput={checkInInput}
              setCheckInInput={setCheckInInput}
              isCheckInDropdownOpen={isCheckInDropdownOpen}
              setIsCheckInDropdownOpen={setIsCheckInDropdownOpen}
              quickFilteredMembers={quickFilteredMembers}
              handlePerformCheckIn={handlePerformCheckIn}
              pendingDuesList={pendingDuesList}
              expiringSoonList={expiringSoonList}
              outOfServiceItem={outOfServiceItem}
              setActiveTab={setActiveTab}
              setIsQRScannerOpen={setIsQRScannerOpen}
              setPaymentModalMember={setPaymentModalMember}
              setWhatsAppMember={setWhatsAppMember}
              setSelectedMemberDossier={setSelectedMemberDossier}
            />
          )}

          {/* ─────────────────────────────────────────────────────────────
              SUB-VIEWS TRIGGERED VIA SIDEBAR NAVIGATION
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2333] pb-4">
                <div>
                  <h2 className="text-xl font-black text-white">Members Directory</h2>
                  <p className="text-xs text-zinc-400">
                    Manage {members.length} athlete records, memberships, and billing
                  </p>
                </div>
                <button
                  onClick={() => setIsAddMemberOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#ccff00] px-4 py-2 text-xs font-black text-black hover:bg-[#b5e600] transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Member</span>
                </button>
              </div>
              <MembersTab
                members={members}
                onOpenAddMember={() => setIsAddMemberOpen(true)}
                onOpenPaymentModal={(m: Member) => setPaymentModalMember(m)}
                onSelectMember={(m: Member) => setSelectedMemberDossier(m)}
              />
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2333] pb-4">
                <div>
                  <h2 className="text-xl font-black text-white">Attendance Register</h2>
                  <p className="text-xs text-zinc-400">
                    Real-time front desk check-in, search & QR code validation
                  </p>
                </div>
                <button
                  onClick={() => setIsQRScannerOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#ccff00] px-4 py-2 text-xs font-black text-black hover:bg-[#b5e600] transition-colors"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Scan QR Pass</span>
                </button>
              </div>
              <AttendanceTab
                members={members}
                attendanceLogs={attendanceLogs}
                onCheckInMember={onCheckInMember}
                onOpenPaymentModal={(m) => setPaymentModalMember(m)}
              />
            </div>
          )}

          {activeTab === 'dues' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2333] pb-4">
                <div>
                  <h2 className="text-xl font-black text-white">Payments & Dues Recovery</h2>
                  <p className="text-xs text-zinc-400">
                    1-Click WhatsApp payment links with pre-filled UPI VPA reminders
                  </p>
                </div>
              </div>
              <DuesTab
                members={members}
                onOpenPaymentModal={(m) => setPaymentModalMember(m)}
              />
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2333] pb-4">
                <div>
                  <h2 className="text-xl font-black text-white">Equipment & Maintenance Logs</h2>
                  <p className="text-xs text-zinc-400">
                    Keep machines calibrated and track scheduled maintenance (AMC)
                  </p>
                </div>
              </div>
              <EquipmentTab
                equipmentList={equipmentList}
                onToggleStatus={onToggleEquipmentStatus}
              />
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2333] pb-4">
                <div>
                  <h2 className="text-xl font-black text-white">Enquiries & Trial Management</h2>
                  <p className="text-xs text-zinc-400">
                    Convert prospects into paid members with structured follow-ups
                  </p>
                </div>
                <button
                  onClick={() => setIsAddMemberOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#ccff00] px-4 py-2 text-xs font-black text-black hover:bg-[#b5e600] transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Convert to Member</span>
                </button>
              </div>
              <LeadsTab
                leads={leads}
                onConvertLead={() => setIsAddMemberOpen(true)}
              />
            </div>
          )}

          {activeTab === 'workouts' && (
            <WorkoutsTab
              members={members}
              routines={routines}
              exercises={exercises}
              onUpdateRoutines={onUpdateRoutines}
            />
          )}

          {activeTab === 'diet' && (
            <DietTab members={members} />
          )}

          {/* Fallback panels for other tabs */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="border-b border-[#1b2333] pb-4">
                <h2 className="text-xl font-black text-white">Membership Plans & Tiers</h2>
                <p className="text-xs text-zinc-400">Commercial pricing, duration, and access privileges</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-6 space-y-4">
                  <span className="rounded-full bg-[#161d2d] px-3 py-1 text-xs font-bold text-zinc-300">Starter</span>
                  <h3 className="text-2xl font-black text-white">₹1,499<span className="text-xs text-zinc-400">/mo</span></h3>
                  <p className="text-xs text-zinc-400">General floor gym access, locker, cardio arena.</p>
                </div>
                <div className="rounded-2xl border-2 border-[#ccff00] bg-[#0c1017] p-6 space-y-4 shadow-xl">
                  <span className="rounded-full bg-[#ccff00] px-3 py-1 text-xs font-black text-black">Most Popular • Pro</span>
                  <h3 className="text-2xl font-black text-white">₹1,999<span className="text-xs text-zinc-400">/mo</span></h3>
                  <p className="text-xs text-zinc-400">Full facility access, bio-mechanical free weights, diet plan.</p>
                </div>
                <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-6 space-y-4">
                  <span className="rounded-full bg-[#161d2d] px-3 py-1 text-xs font-bold text-zinc-300">Annual VIP</span>
                  <h3 className="text-2xl font-black text-white">₹14,000<span className="text-xs text-zinc-400">/yr</span></h3>
                  <p className="text-xs text-zinc-400">Everything in Pro + 12 Personal training sessions & recovery zone.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'renewal_bot' && (
            <ExpiringAlertsCenter
              members={members}
              onRefreshData={() => window.location.reload()}
            />
          )}

          {activeTab === 'reports' && (
            <BusinessIntelligenceReports
              members={members}
              payments={payments}
            />
          )}

          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="border-b border-[#1b2333] pb-4">
                <h2 className="text-xl font-black text-white">Staff & Coaching Roster</h2>
                <p className="text-xs text-zinc-400">Certified strength coaches, physiotherapists, and floor trainers</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5 flex items-center gap-4">
                  <MemberAvatar name="Vikram Sharma" className="w-12 h-12" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Vikram Singh</h3>
                    <p className="text-xs text-[#ccff00]">Head Strength Coach</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Powerlifting • 6 Yrs Exp</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5 flex items-center gap-4">
                  <MemberAvatar name="Amit Singh" className="w-12 h-12" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Rajesh Sharma</h3>
                    <p className="text-xs text-[#ccff00]">Senior Hypertrophy Coach</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Biomechanics • 8 Yrs Exp</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5 flex items-center gap-4">
                  <MemberAvatar name="Sneha Nair" className="w-12 h-12" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Priya Nair</h3>
                    <p className="text-xs text-[#ccff00]">Dietetics & Mobility</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Indian Macros • 5 Yrs Exp</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-[#1b2333] pb-4">
                <h2 className="text-xl font-black text-white">Facility & Billing Settings</h2>
                <p className="text-xs text-zinc-400">Branch address, tax GSTIN, UPI VPAs, and timings</p>
              </div>
              <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-6 space-y-4 max-w-2xl">
                <div>
                  <label className="text-xs font-bold text-zinc-400">Gym Branch Name</label>
                  <input
                    type="text"
                    defaultValue="Alpha Fitness Gym"
                    className="mt-1 w-full rounded-xl border border-[#202738] bg-[#101522] px-3.5 py-2 text-xs font-bold text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400">Address</label>
                  <input
                    type="text"
                    defaultValue="4th Block, 100ft Road, Koramangala, Bengaluru, Karnataka 560034"
                    className="mt-1 w-full rounded-xl border border-[#202738] bg-[#101522] px-3.5 py-2 text-xs font-bold text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400">Business UPI VPA</label>
                  <input
                    type="text"
                    defaultValue="alphafitness@okhdfcbank"
                    className="mt-1 w-full rounded-xl border border-[#202738] bg-[#101522] px-3.5 py-2 text-xs font-mono font-bold text-[#ccff00] outline-none"
                  />
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      sounds.playSuccess();
                      alert('Settings saved successfully!');
                    }}
                    className="rounded-xl bg-[#ccff00] px-5 py-2.5 text-xs font-black text-black hover:bg-[#b5e600] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODALS
      ───────────────────────────────────────────────────────────── */}
      {/* 1. Add Member Modal */}
      {isAddMemberOpen && (
        <AddMemberModal
          onClose={() => setIsAddMemberOpen(false)}
          onMemberCreated={(newMem, initPay) => {
            onMemberCreated(newMem, initPay);
            setIsAddMemberOpen(false);
          }}
        />
      )}

      {/* 2. Record Payment Modal */}
      {paymentModalMember && (
        <RecordPaymentModal
          member={paymentModalMember}
          onClose={() => setPaymentModalMember(null)}
          onPaymentSuccess={(pay, updatedMem) => {
            onPaymentSuccess(pay, updatedMem);
            setPaymentModalMember(null);
          }}
        />
      )}

      {/* 3. Optical QR Scan Modal */}
      {isQRScannerOpen && (
        <QRScanModal
          members={members}
          onClose={() => setIsQRScannerOpen(false)}
          onCheckIn={(mem, method) => {
            onCheckInMember(mem, method);
          }}
        />
      )}

      {/* 4. WhatsApp Dues Reminder Modal */}
      {whatsAppMember && (
        <WhatsAppReminderModal
          member={whatsAppMember}
          onClose={() => setWhatsAppMember(null)}
        />
      )}

      {/* 5. Member Details Dossier Modal */}
      {selectedMemberDossier && (
        <MemberDetailsModal
          member={selectedMemberDossier}
          attendanceLogs={attendanceLogs}
          payments={payments}
          onClose={() => setSelectedMemberDossier(null)}
          onOpenPaymentModal={(m) => {
            setSelectedMemberDossier(null);
            setPaymentModalMember(m);
          }}
        />
      )}
    </div>
  );
}
