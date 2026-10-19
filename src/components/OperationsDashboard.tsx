'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  PhoneCall,
  Dumbbell,
  Utensils,
  Wrench,
  BarChart3,
  UserCheck,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  QrCode,
  UserPlus,
  Home,
  MessageSquare,
  Globe,
  Menu,
  X,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthGuard';
import { AttendanceTab } from './operations/AttendanceTab';
import { DuesTab } from './operations/DuesTab';
import { MembersTab } from './operations/MembersTab';
import { EquipmentTab } from './operations/EquipmentTab';
import { LeadsTab } from './operations/LeadsTab';
import { DietTab } from './operations/DietTab';
import { OverviewTab, MemberAvatar, WhatsAppIcon } from './operations/OverviewTab';
import { TrainersTab } from './operations/TrainersTab';
import { GymCmsManager } from './operations/GymCmsManager';
import { AdminInvoicesDesk } from './operations/AdminInvoicesDesk';
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
  | 'overview'
  | 'members'
  | 'attendance'
  | 'dues'
  | 'renewal_bot'
  | 'leads'
  | 'workouts'
  | 'diet'
  | 'equipment'
  | 'reports'
  | 'staff'
  | 'landing_cms';

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
  initialGymSlug?: string;
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
  onUpdateRoutines,
  initialGymSlug
}: OperationsDashboardProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [currentGymName, setCurrentGymName] = useState<string>('Alpha Fitness Gym');
  const [currentGymCity, setCurrentGymCity] = useState<string>('Bengaluru');

  useEffect(() => {
    if (initialGymSlug) {
      import('@/client/api/gymApiClient').then(({ gymApiClient }) => {
        gymApiClient.getGymBySlug(initialGymSlug).then((profile) => {
          if (profile) {
            setCurrentGymName(profile.gymName);
            setCurrentGymCity(profile.city || 'Main Facility');
          }
        }).catch(() => {
          import('@/lib/mockGyms').then(({ INITIAL_GYM_PROFILES }) => {
            const found = INITIAL_GYM_PROFILES.find((g) => g.slug === initialGymSlug);
            if (found) {
              setCurrentGymName(found.gymName);
              setCurrentGymCity(found.city || 'Main Facility');
            }
          });
        });
      });
    }
  }, [initialGymSlug]);
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

  // Admin Auth Context & Menus State
  const { handleLogout } = useAdminAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global hotkeys ('/' to focus global member search, 'Cmd+K' to focus global search, 'Escape' to dismiss)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        const topSearch = document.getElementById('top-global-search-input');
        if (topSearch) topSearch.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const topSearch = document.getElementById('top-global-search-input');
        if (topSearch) topSearch.focus();
      }
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
        setSearchQuery('');
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
      {/* ─────────────────────────────────────────────────────────────
          1. REFACTORED TOP NAVIGATION BAR
          - Compact logo & single-line brand name
          - Standard navigation (Dashboard, Members, Home Screen)
          - Clearly labeled global member search with "/" shortcut
          - Compact Neon DB live indicator
          - Simplified Date/Time presentation
          - Grouped notifications, WhatsApp, and profile controls
          - Profile menu with "Lock Console"
          - Responsive mobile navigation drawer
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1b2333] bg-[#090d16]/95 backdrop-blur-md">
        <div className="flex h-14 md:h-16 items-center justify-between px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4">
          {/* Left: Compact Logo + Single-Line Brand & Gym Identity */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              onClick={(e) => {
                if (onSwitchToShowcase) {
                  e.preventDefault();
                  onSwitchToShowcase();
                }
              }}
              className="flex items-center gap-2.5 group focus:outline-none"
              title="Return to Home Screen"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ccff00] text-black shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Dumbbell className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-center">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  Gym<span className="text-[#ccff00]">PRO</span>
                </span>
                <span className="text-zinc-600 font-light mx-2 hidden sm:inline">/</span>
                <span
                  className="text-xs font-semibold text-zinc-300 truncate max-w-[110px] md:max-w-[150px] lg:max-w-[190px] hidden sm:inline"
                  title={currentGymName}
                >
                  {currentGymName}
                </span>
                <span className="ml-2 rounded border border-[#ccff00]/40 bg-[#ccff00]/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#ccff00] hidden md:inline">
                  ADMIN
                </span>
              </div>
            </Link>

            {/* Salesforce Style Header Pills (Shown only on Invoices Desk where they belong) */}
            {activeTab === 'dashboard' && (
              <nav className="hidden xl:flex items-center gap-1 bg-[#121620] rounded-full px-2 py-1 border border-white/5 shrink-0 ml-2">
                <button
                  onClick={() => setActiveTab('leads')}
                  className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap text-zinc-400 hover:text-white transition-colors"
                >
                  Estimates
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap transition-all bg-[#ccff00] text-black shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  <span>Invoices</span>
                </button>

                <button
                  onClick={() => setActiveTab('dues')}
                  className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap text-zinc-400 hover:text-white transition-colors"
                >
                  Payments
                </button>

                <button
                  onClick={() => setActiveTab('members')}
                  className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap text-zinc-400 hover:text-white transition-colors"
                >
                  Recurring
                </button>

                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap text-zinc-400 hover:text-white transition-colors"
                >
                  Checkouts
                </button>

                <button
                  onClick={() => {
                    if (onSwitchToShowcase) {
                      onSwitchToShowcase();
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
                  title="Return to Home Screen"
                >
                  <Home className="h-3 w-3 text-zinc-400 shrink-0" />
                  <span>Home</span>
                </button>
              </nav>
            )}

            {/* When on Operations & Reception desk */}
            {activeTab === 'overview' && (
              <div className="hidden xl:flex items-center gap-2 bg-[#121620] rounded-full px-3 py-1 border border-white/5 shrink-0 ml-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00]"></span>
                </span>
                <span className="text-xs font-bold text-white">Operations & Reception Desk</span>
              </div>
            )}
          </div>

          {/* Center: Full-width Global Member Search with "/" shortcut */}
          <div className="flex-1 min-w-[200px] max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-2 sm:mx-4 lg:mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              <input
                id="top-global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member name, phone or ID..."
                className="w-full h-9 rounded-xl border border-[#202738] bg-[#101522] py-1.5 pl-9 pr-9 text-xs font-medium text-white placeholder-zinc-500 outline-none focus:border-[#ccff00] transition-colors"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <kbd className="flex h-5 w-5 items-center justify-center rounded border border-[#262f44] bg-[#161c2d] font-mono text-[11px] font-bold text-zinc-400 shadow-sm">
                  /
                </kbd>
              </div>

              {/* Quick Search Results Dropdown */}
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
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e2638] text-xs font-black text-[#ccff00] shrink-0">
                            {m.fullName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-white truncate">{m.fullName}</p>
                            <p className="text-[11px] text-zinc-400 font-mono truncate">+91 {m.phone} • {m.planName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              m.status === 'active'
                                ? 'bg-emerald-950/80 text-emerald-300'
                                : 'bg-red-950/80 text-red-300'
                            }`}
                          >
                            {m.status}
                          </span>
                          <span className="text-[11px] font-bold text-[#ccff00] hidden sm:inline">
                            View Dossier →
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Grouped Controls (consistent h-9 controls) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Compact Database Indicator */}
            <div
              className="hidden lg:flex items-center gap-1.5 h-9 px-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-[11px] font-mono text-emerald-400 shrink-0"
              title="Neon Database Connected & Live"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden xl:inline">DB Live</span>
            </div>

            {/* Notification Bell (Lead follow-up) */}
            <button
              onClick={() => setActiveTab('leads')}
              title="3 Enquiries pending follow-up"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#202738] bg-[#101522] text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors shrink-0"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-950 border border-red-500/50 text-[10px] font-bold text-red-200">
                3
              </span>
            </button>

            {/* WhatsApp Quick Launcher */}
            <button
              onClick={() => {
                if (pendingDuesList[0]) setWhatsAppMember(pendingDuesList[0]);
              }}
              title="Open WhatsApp dues messenger"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#202738] bg-[#101522] text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-colors shrink-0"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </button>

            {/* Profile Dropdown Trigger (with Lock Console inside) */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex h-9 items-center gap-2 rounded-xl border border-[#202738] bg-[#101522] px-2 sm:px-2.5 text-left hover:border-zinc-500 transition-colors ${
                  isProfileMenuOpen ? 'border-[#ccff00]/50 ring-1 ring-[#ccff00]/30' : ''
                }`}
                title="Admin Account & Security"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1e2638] border border-[#2f3a52] text-[10px] font-black text-white shrink-0">
                  RS
                </div>
                <div className="hidden md:block text-left leading-tight truncate">
                  <p className="text-xs font-bold text-white truncate max-w-[90px]">Rahul Sharma</p>
                  <p className="text-[10px] text-zinc-400">Owner</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 hidden sm:block shrink-0" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#232b3d] bg-[#0c1017] p-2 shadow-2xl z-50 text-xs">
                  {/* Account Info */}
                  <div className="p-2.5 border-b border-[#1b2333] mb-1">
                    <p className="font-bold text-white text-sm">Rahul Sharma</p>
                    <p className="text-[11px] text-zinc-400 font-medium">Owner & Administrator</p>
                    <p className="text-[11px] text-[#ccff00] font-mono mt-0.5">
                      {currentGymName} • {currentGymCity}
                    </p>
                  </div>

                  {/* Navigation Links inside Menu */}
                  <div className="space-y-0.5 py-1 border-b border-[#1b2333]">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onSwitchToShowcase) onSwitchToShowcase();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-[#151b2b] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Home className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Home Screen</span>
                      </div>
                      <ExternalLink className="h-3 w-3 text-zinc-500" />
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onSwitchToMemberPortal) onSwitchToMemberPortal();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-[#151b2b] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-3.5 w-3.5 text-[#ccff00]" />
                        <span>Member Portal (/member)</span>
                      </div>
                      <ExternalLink className="h-3 w-3 text-zinc-500" />
                    </button>
                  </div>

                  {/* Security Action: Lock Console */}
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 font-semibold transition-colors"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Lock Console (Sign Out)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger (Visible < 768px) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#202738] bg-[#101522] text-zinc-300 hover:text-white md:hidden shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Visible on < 768px when opened) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#1b2333] bg-[#0c1017] p-3 space-y-2">
            <div className="flex items-center justify-between px-2 py-1 text-xs text-zinc-400 border-b border-[#1f283a] pb-2">
              <span className="font-semibold text-white">{currentGymName}</span>
              <span className="font-mono text-[#ccff00]">{timeStr} • Open</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold ${
                  activeTab === 'dashboard'
                    ? 'bg-[#ccff00] text-black'
                    : 'bg-[#121724] text-zinc-300'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('members');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold ${
                  activeTab === 'members'
                    ? 'bg-[#ccff00] text-black'
                    : 'bg-[#121724] text-zinc-300'
                }`}
              >
                <Users className="h-4 w-4 shrink-0" />
                <span>Members</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('attendance');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold ${
                  activeTab === 'attendance'
                    ? 'bg-[#ccff00] text-black'
                    : 'bg-[#121724] text-zinc-300'
                }`}
              >
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>Attendance</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('dues');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold ${
                  activeTab === 'dues' ? 'bg-[#ccff00] text-black' : 'bg-[#121724] text-zinc-300'
                }`}
              >
                <CreditCard className="h-4 w-4 shrink-0" />
                <span>Payments</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('leads');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold ${
                  activeTab === 'leads' ? 'bg-[#ccff00] text-black' : 'bg-[#121724] text-zinc-300'
                }`}
              >
                <PhoneCall className="h-4 w-4 shrink-0" />
                <span>Enquiries</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('equipment');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold ${
                  activeTab === 'equipment'
                    ? 'bg-[#ccff00] text-black'
                    : 'bg-[#121724] text-zinc-300'
                }`}
              >
                <Wrench className="h-4 w-4 shrink-0" />
                <span>Equipment</span>
              </button>
            </div>

            {/* Quick Portals & Lock Console in Mobile Drawer */}
            <div className="pt-2 border-t border-[#1f283a] flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onSwitchToShowcase) onSwitchToShowcase();
                }}
                className="flex items-center justify-between p-2 rounded-lg bg-[#121724] text-xs font-medium text-zinc-300"
              >
                <span className="flex items-center gap-2">
                  <Home className="h-3.5 w-3.5 text-[#ccff00]" />
                  <span>Home Screen</span>
                </span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-2 p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-bold text-red-400"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Lock Console</span>
              </button>
            </div>
          </div>
        )}
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
              <CreditCard className="h-4 w-4 shrink-0" />
              <span>Invoices Desk</span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'overview'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Operations & Reception</span>
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
              onClick={() => setActiveTab('landing_cms')}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${activeTab === 'landing_cms'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-zinc-400 hover:bg-[#121724] hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 shrink-0" />
                <span>Gym Landing CMS</span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  activeTab === 'landing_cms'
                    ? 'bg-black text-[#ccff00]'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                BRAND
              </span>
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
                    alt={currentGymName}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{currentGymName}</p>
                  <p className="text-xs text-zinc-400 leading-tight">{currentGymCity} • Active</p>
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
              VIEW: DASHBOARD (Salesforce Invoices Desk - Exact Image 2)
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <AdminInvoicesDesk
              members={members}
              payments={payments}
              onOpenPaymentModal={(m) => setPaymentModalMember(m || members[0])}
              onOpenAddMember={() => setIsAddMemberOpen(true)}
              onBackToOverview={() => setActiveTab('overview')}
            />
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW: OVERVIEW (Full Operations & Reception Desk)
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
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
              onOpenAddMember={() => setIsAddMemberOpen(true)}
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
              <AdminInvoicesDesk
                members={members}
                payments={payments}
                onOpenPaymentModal={(m) => setPaymentModalMember(m || members[0])}
                onOpenAddMember={() => setIsAddMemberOpen(true)}
                onBackToOverview={() => setActiveTab('overview')}
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

          {activeTab === 'diet' && (
            <DietTab members={members} />
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
            <TrainersTab members={members} />
          )}

          {activeTab === 'landing_cms' && (
            <GymCmsManager />
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
