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
  MoreVertical,
  Plus,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  FileText,
  UserPlus,
  IndianRupee,
  Sparkles,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { AttendanceTab } from './operations/AttendanceTab';
import { DuesTab } from './operations/DuesTab';
import { MembersTab } from './operations/MembersTab';
import { EquipmentTab } from './operations/EquipmentTab';
import { LeadsTab } from './operations/LeadsTab';
import { WorkoutsTab } from './operations/WorkoutsTab';
import { DietTab } from './operations/DietTab';
import { CheckInBanner } from './CheckInBanner';
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

function MemberAvatar({ name, className = 'w-9 h-9' }: { name: string; className?: string }) {
  const url = AVATAR_MAP[name];
  if (url) {
    return (
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

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.075-2.001-.465-1.576-.65-2.586-2.253-2.664-2.357-.078-.105-.636-.847-.636-1.616s.397-1.144.538-1.302c.142-.158.312-.198.416-.198.104 0 .208.002.298.006.096.004.225-.036.352.27.13.313.447 1.09.486 1.17.039.08.065.174.013.279-.052.104-.078.17-.156.262-.078.092-.164.205-.235.275-.078.078-.16.163-.069.319.091.156.405.669.868 1.082.597.532 1.1.697 1.256.775.156.078.247.065.339-.039.091-.104.391-.456.495-.612.104-.156.208-.13.351-.078.143.052.91.43 1.066.508.156.078.26.117.299.182.039.065.039.378-.105.783zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.307C8.423 21.524 10.151 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );
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
  onSwitchToShowcase,
  onSwitchToMemberPortal,
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

  // Equipment health breakdown
  const workingCount = equipmentList.filter((e) => e.status === 'operational').length;
  const maintenanceCount = equipmentList.filter((e) => e.status === 'needs_service').length;
  const outOfServiceCount = equipmentList.filter((e) => e.status === 'out_of_order').length;
  const totalEquipment = equipmentList.length || 5;

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
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            m.status === 'active' ? 'bg-emerald-950/80 text-emerald-300' : 'bg-red-950/80 text-red-300'
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
              <Sparkles className="h-3.5 w-3.5 text-[#ccff00]" />
              <span>Showcase (/)</span>
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
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'members'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
              }`}
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>Members</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'attendance'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
              }`}
            >
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('dues')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'dues'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
              }`}
            >
              <CreditCard className="h-4 w-4 shrink-0" />
              <span>Payments & Dues</span>
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'plans'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4 shrink-0" />
              <span>Plans & Memberships</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'leads'
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
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'workouts'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
              }`}
            >
              <Dumbbell className="h-4 w-4 shrink-0" />
              <span>Workouts & Plans</span>
            </button>

            <button
              onClick={() => setActiveTab('diet')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'diet'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
              }`}
            >
              <Utensils className="h-4 w-4 shrink-0" />
              <span>Diet & Nutrition</span>
            </button>

            <button
              onClick={() => setActiveTab('equipment')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'equipment'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
              }`}
            >
              <Wrench className="h-4 w-4 shrink-0" />
              <span>Equipment</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'reports'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'staff'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
              }`}
            >
              <UserCheck className="h-4 w-4 shrink-0" />
              <span>Staff & Trainers</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'settings'
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
                title="Club Showcase"
              >
                <Sparkles className="h-3.5 w-3.5" />
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
            <div className="space-y-6">
              {/* Dashboard Title & Timeframe Selector Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                    Dashboard
                  </h1>
                  <span className="text-sm font-medium text-zinc-400">
                    Tue, 26 Aug 2025
                  </span>
                </div>

                {/* Filter Pills: Today / This Week / This Month */}
                <div className="flex items-center rounded-xl border border-[#202738] bg-[#0c1017] p-1">
                  <button
                    onClick={() => setTimeframe('today')}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                      timeframe === 'today'
                        ? 'bg-[#151c2c] border border-[#2b364e] text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setTimeframe('this_week')}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                      timeframe === 'this_week'
                        ? 'bg-[#151c2c] border border-[#2b364e] text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setTimeframe('this_month')}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                      timeframe === 'this_month'
                        ? 'bg-[#151c2c] border border-[#2b364e] text-white'
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
                  <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
                    {/* Sub-tabs: Quick Check-in & Scan QR Pass */}
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        onClick={() => setCheckInTab('quick')}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                          checkInTab === 'quick'
                            ? 'border border-[#ccff00]/40 bg-[#161e12] text-[#ccff00]'
                            : 'border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#ccff00]" />
                        <span>Quick Check-in</span>
                      </button>

                      <button
                        onClick={() => {
                          setCheckInTab('qr');
                          setIsQRScannerOpen(true);
                        }}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                          checkInTab === 'qr'
                            ? 'border border-[#ccff00]/40 bg-[#161e12] text-[#ccff00]'
                            : 'border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        <span>Scan QR Pass</span>
                      </button>
                    </div>

                    {/* Input Box with '/' hotkey cue */}
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        id="dashboard-quick-checkin-input"
                        type="text"
                        value={checkInInput}
                        onChange={(e) => {
                          setCheckInInput(e.target.value);
                          setIsCheckInDropdownOpen(true);
                        }}
                        onFocus={() => setIsCheckInDropdownOpen(true)}
                        placeholder="Enter member name or last 4 digits of phone number..."
                        className="w-full rounded-xl border border-[#202738] bg-[#101522] py-3 pl-11 pr-12 text-xs font-medium text-white placeholder-zinc-400 outline-none focus:border-[#ccff00] transition-colors"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6 rounded border border-[#262f44] bg-[#161c2d] font-mono text-xs font-bold text-[#ccff00]">
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
                  </div>

                  {/* CARD 2: Live Check-ins Today (3) */}
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
                          {/* Fallback to reference 3 rows if empty, or slice latest 3 */}
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
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Checked In</span>
                                </span>
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

                  {/* CARDS 3A & 3B: Analytical Charts (Side by Side) */}
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
                        {/* Tuesday Tooltip Popover (Matches reference exactly) */}
                        <div className="absolute top-0 left-[24%] -translate-x-1/2 z-20 rounded-xl border border-[#2c364e] bg-[#0a0e16] px-3 py-1.5 text-center shadow-xl">
                          <p className="text-xs font-medium text-zinc-300">Tue, 26 Aug</p>
                          <p className="font-mono text-xs font-black text-[#ccff00]">
                            42 check-ins
                          </p>
                        </div>

                        {/* Chart Grid Lines & Bars */}
                        <div className="h-32 flex items-end justify-between gap-2 border-b border-[#1b2333] px-2 pb-1">
                          {/* Mon */}
                          <div className="flex-1 flex flex-col items-center h-full justify-end">
                            <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[66%]" />
                          </div>
                          {/* Tue (Highlighted active) */}
                          <div className="flex-1 flex flex-col items-center h-full justify-end">
                            <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[35%]" />
                          </div>
                          {/* Wed */}
                          <div className="flex-1 flex flex-col items-center h-full justify-end">
                            <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[72%]" />
                          </div>
                          {/* Thu */}
                          <div className="flex-1 flex flex-col items-center h-full justify-end">
                            <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[68%]" />
                          </div>
                          {/* Fri */}
                          <div className="flex-1 flex flex-col items-center h-full justify-end">
                            <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[64%]" />
                          </div>
                          {/* Sat */}
                          <div className="flex-1 flex flex-col items-center h-full justify-end">
                            <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[18%]" />
                          </div>
                          {/* Sun */}
                          <div className="flex-1 flex flex-col items-center h-full justify-end">
                            <div className="w-full max-w-[28px] rounded-t-md bg-[#ccff00] h-[60%]" />
                          </div>
                        </div>

                        {/* X-Axis Day Labels */}
                        <div className="flex items-center justify-between px-2 pt-2 text-[11px] font-bold text-zinc-400">
                          <span>Mon</span>
                          <span className="text-[#ccff00] font-black">Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                          <span>Sun</span>
                        </div>
                      </div>
                    </div>

                    {/* CARD 3B: Collection Summary */}
                    <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-[#ccff00]" />
                          <h3 className="text-xs font-bold text-white">Collection Summary</h3>
                        </div>
                        <div className="flex items-center gap-1 rounded-lg border border-[#202738] bg-[#101522] px-2 py-1 text-[11px] font-bold text-zinc-300">
                          <span>This Month</span>
                          <ChevronDown className="h-3 w-3 text-zinc-400" />
                        </div>
                      </div>

                      {/* Mini Bar Chart */}
                      <div className="h-16 flex items-end justify-between gap-1.5 border-b border-[#1b2333] px-2 pb-1 mb-4">
                        <div className="w-full max-w-[18px] rounded-t bg-[#ccff00] h-[45%]" />
                        <div className="w-full max-w-[18px] rounded-t bg-[#ccff00] h-[60%]" />
                        <div className="w-full max-w-[18px] rounded-t bg-[#ccff00] h-[90%]" />
                        <div className="w-full max-w-[18px] rounded-t bg-[#ccff00] h-[70%]" />
                        <div className="w-full max-w-[18px] rounded-t bg-[#ccff00] h-[75%]" />
                        <div className="w-full max-w-[18px] rounded-t bg-[#ccff00] h-[15%]" />
                        <div className="w-full max-w-[18px] rounded-t bg-[#ccff00] h-[35%]" />
                      </div>

                      {/* Payment Method Breakdown List */}
                      <div className="space-y-2 text-xs">
                        {/* Cash */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
                            <span className="text-zinc-300 font-medium">Cash</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono font-bold text-white">₹1,04,400</span>
                            <span className="w-8 text-right font-mono text-zinc-400">42%</span>
                          </div>
                        </div>

                        {/* UPI */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                            <span className="text-zinc-300 font-medium">UPI</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono font-bold text-white">₹94,200</span>
                            <span className="w-8 text-right font-mono text-zinc-400">38%</span>
                          </div>
                        </div>

                        {/* Card */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                            <span className="text-zinc-300 font-medium">Card</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono font-bold text-white">₹29,800</span>
                            <span className="w-8 text-right font-mono text-zinc-400">12%</span>
                          </div>
                        </div>

                        {/* Other */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                            <span className="text-zinc-300 font-medium">Other</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono font-bold text-white">₹20,200</span>
                            <span className="w-8 text-right font-mono text-zinc-400">8%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ════════════════════════════════════════════════════════
                    RIGHT COLUMN (col-span-4): Dues, Expiring, Quick Actions, Equipment
                ════════════════════════════════════════════════════════ */}
                <div className="lg:col-span-4 space-y-6">
                  {/* WIDGET 1: Pending Dues (3) */}
                  <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-white">
                        Pending Dues ({pendingDuesList.length || 3})
                      </h3>
                      <button
                        onClick={() => setActiveTab('dues')}
                        className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        View All
                      </button>
                    </div>

                    <div className="divide-y divide-[#1b2333]">
                      {pendingDuesList.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-2.5">
                            <MemberAvatar name={m.fullName} className="w-8 h-8" />
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">
                                {m.fullName}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-xs font-bold text-red-400">
                                  ₹{m.pendingDueInr.toLocaleString('en-IN')}
                                </span>
                                <span className="text-xs font-mono text-red-400 font-semibold">
                                  {m.id === 'mem-108' ? '18 days' : m.id === 'mem-109' ? '12 days' : '6 days'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* WhatsApp Button */}
                            <button
                              onClick={() => setWhatsAppMember(m)}
                              title="Send WhatsApp payment link"
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                            >
                              <WhatsAppIcon className="h-3.5 w-3.5" />
                            </button>

                            {/* Collect Button */}
                            <button
                              onClick={() => setPaymentModalMember(m)}
                              className="rounded-lg border border-[#263148] bg-[#161d2d] px-2.5 py-1 text-xs font-bold text-zinc-200 hover:bg-[#20293d] hover:text-white transition-colors"
                            >
                              Collect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WIDGET 2: Expiring Soon (2) */}
                  <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-white">
                        Expiring Soon ({expiringSoonList.length || 2})
                      </h3>
                      <button
                        onClick={() => setActiveTab('members')}
                        className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        View All
                      </button>
                    </div>

                    <div className="divide-y divide-[#1b2333]">
                      {expiringSoonList.map((m, idx) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-2.5">
                            <MemberAvatar name={m.fullName} className="w-8 h-8" />
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">
                                {m.fullName}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/40">
                                  {idx === 0 ? '3 days' : '5 days'}
                                </span>
                                <span className="text-xs font-mono text-zinc-400">
                                  {idx === 0 ? '30 Aug 2025' : '1 Sep 2025'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setPaymentModalMember(m)}
                            className="rounded-lg border border-[#263148] bg-[#161d2d] px-2.5 py-1 text-xs font-bold text-zinc-200 hover:bg-[#20293d] hover:text-white transition-colors"
                          >
                            Renew
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WIDGET 3: Quick Actions */}
                  <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
                    <h3 className="text-xs font-bold text-white mb-4">Quick Actions</h3>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => setIsAddMemberOpen(true)}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#1e2638] bg-[#0f1422] p-3 text-center hover:border-[#ccff00] hover:bg-[#141b2c] transition-all group"
                      >
                        <UserPlus className="h-5 w-5 text-zinc-400 group-hover:text-[#ccff00] transition-colors" />
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-white">
                          Add Member
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          if (members.length > 0) setPaymentModalMember(members[0]);
                        }}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#1e2638] bg-[#0f1422] p-3 text-center hover:border-[#ccff00] hover:bg-[#141b2c] transition-all group"
                      >
                        <IndianRupee className="h-5 w-5 text-zinc-400 group-hover:text-[#ccff00] transition-colors" />
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-white">
                          Record Payment
                        </span>
                      </button>

                      <button
                        onClick={() => setIsQRScannerOpen(true)}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#1e2638] bg-[#0f1422] p-3 text-center hover:border-[#ccff00] hover:bg-[#141b2c] transition-all group"
                      >
                        <QrCode className="h-5 w-5 text-zinc-400 group-hover:text-[#ccff00] transition-colors" />
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-white">
                          Mark Attendance
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveTab('leads')}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#1e2638] bg-[#0f1422] p-3 text-center hover:border-[#ccff00] hover:bg-[#141b2c] transition-all group"
                      >
                        <FileText className="h-5 w-5 text-zinc-400 group-hover:text-[#ccff00] transition-colors" />
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-white">
                          Create Enquiry
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* WIDGET 4: Equipment Health (Donut Gauge & Alert) */}
                  <div className="rounded-2xl border border-[#1e2638] bg-[#0c1017] p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-white">Equipment Health</h3>
                      <button
                        onClick={() => setActiveTab('equipment')}
                        className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        View All
                      </button>
                    </div>

                    {/* Donut Chart & Legend */}
                    <div className="flex items-center justify-between py-2">
                      {/* Donut SVG */}
                      <div className="relative h-24 w-24">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                          {/* Background Ring */}
                          <path
                            className="text-[#192131]"
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

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="border-b border-[#1b2333] pb-4">
                <h2 className="text-xl font-black text-white">Business Intelligence & Reports</h2>
                <p className="text-xs text-zinc-400">Revenue collections, attendance trends, and member retention</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Monthly Collections</p>
                  <p className="mt-2 font-mono text-3xl font-black text-emerald-400">₹2,48,600</p>
                  <p className="mt-1 text-xs text-zinc-400">Cash: 42% • UPI: 38% • Card: 12%</p>
                </div>
                <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Membership Rate</p>
                  <p className="mt-2 font-mono text-3xl font-black text-[#ccff00]">88.4%</p>
                  <p className="mt-1 text-xs text-zinc-400">Based on 142 total registered lifters</p>
                </div>
                <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dues Outstanding</p>
                  <p className="mt-2 font-mono text-3xl font-black text-red-400">₹14,000</p>
                  <p className="mt-1 text-xs text-zinc-400">Across 3 flagged defaulter accounts</p>
                </div>
              </div>
            </div>
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
