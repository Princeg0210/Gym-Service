'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Check,
  Trash2,
  Calendar,
  Grid,
  List,
  MoreHorizontal,
  ChevronDown,
  Copy,
  Layers,
  FileText,
  DollarSign
} from 'lucide-react';
import { Member, PaymentRecord } from '@/types';

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerRole: string;
  companyName: string;
  avatarUrl: string;
  dueText: string;
  status: 'Unsent' | 'Viewed' | 'Paid' | 'Draft';
  amount: number;
  subItems: {
    title: string;
    amount: number;
  }[];
}

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: 'inv-1',
    invoiceNo: '#404-002',
    customerName: 'Karan Malhotra',
    customerRole: 'Senior Partner • Apex Growth',
    companyName: 'Apex Capital Mumbai',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    dueText: 'In 2 days',
    status: 'Unsent',
    amount: 80770.0,
    subItems: [
      { title: 'Annual Executive Membership', amount: 25000.0 },
      { title: 'Dedicated Personal Trainer (36 Sessions)', amount: 45000.0 },
      { title: 'High-Performance Nutrition Protocol', amount: 10770.0 }
    ]
  },
  {
    id: 'inv-2',
    invoiceNo: '#426-001',
    customerName: 'Amit Singh',
    customerRole: 'Director • Zenith Tech',
    companyName: 'Zenith Labs Bengaluru',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    dueText: 'In 4 days',
    status: 'Viewed',
    amount: 27114.0,
    subItems: [
      { title: 'Quarterly Strength Pass', amount: 15000.0 },
      { title: 'Bio-Marker & Body Composition Scan', amount: 6500.0 },
      { title: 'Recovery Suite Access (Sauna & Ice Bath)', amount: 5614.0 }
    ]
  },
  {
    id: 'inv-3',
    invoiceNo: '#427-012',
    customerName: 'Priya Patel',
    customerRole: 'CEO BlueRock India Pvt Ltd',
    companyName: 'BlueRock India',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    dueText: 'In 5 days',
    status: 'Unsent',
    amount: 53154.0,
    subItems: [
      { title: 'Corporate Wellness Pass', amount: 10630.8 },
      { title: 'Executive Strength Conditioning', amount: 31892.4 },
      { title: 'Sports Dietitian & Recovery Protocol', amount: 10630.8 }
    ]
  },
  {
    id: 'inv-4',
    invoiceNo: '#424-112',
    customerName: 'Vikram Sharma',
    customerRole: 'Founder • Pulse Dynamics',
    companyName: 'Pulse Systems Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    dueText: 'In 16 days',
    status: 'Viewed',
    amount: 61223.0,
    subItems: [
      { title: 'Corporate Wellness Program (Tier 1)', amount: 38000.0 },
      { title: 'Bi-Weekly Coach Consultations', amount: 14500.0 },
      { title: 'Hydration & Supplement Station Locker', amount: 8723.0 }
    ]
  },
  {
    id: 'inv-5',
    invoiceNo: '#417-020',
    customerName: 'Sneha Nair',
    customerRole: 'VP Product • Stride Digital',
    companyName: 'Stride HQ Bengaluru',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    dueText: 'In 19 days',
    status: 'Viewed',
    amount: 7311.0,
    subItems: [
      { title: 'Monthly Flex Pass', amount: 4500.0 },
      { title: 'Locker Rental & Towel Service', amount: 1800.0 },
      { title: 'Smoothie Bar Subscription', amount: 1011.0 }
    ]
  }
];

const TIMELINE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&h=80&q=80'
];

interface AdminInvoicesDeskProps {
  members?: Member[];
  payments?: PaymentRecord[];
  onOpenPaymentModal?: (member?: Member) => void;
  onOpenAddMember?: () => void;
  onBackToOverview?: () => void;
}

export function AdminInvoicesDesk({
  members = [],
  payments = [],
  onOpenPaymentModal,
  onOpenAddMember,
  onBackToOverview
}: AdminInvoicesDeskProps) {
  // Dynamically map real database members to invoices with Indian names & INR values
  const activeDbInvoices: InvoiceItem[] = useMemo(() => {
    if (!members || members.length === 0) return INITIAL_INVOICES;

    const duesMembers = members.filter((m) => m.pendingDueInr > 0);
    const activeMembers = members.filter((m) => m.pendingDueInr === 0);

    const generated: InvoiceItem[] = [];

    // Real members with pending dues from DB
    duesMembers.forEach((m, idx) => {
      generated.push({
        id: `inv-db-${m.id}`,
        invoiceNo: `#40${idx + 1}-0${m.id.replace('mem-', '')}`,
        customerName: m.fullName,
        customerRole: `${m.planName} • +91 ${m.phone}`,
        companyName: idx % 2 === 0 ? 'BlueRock India' : 'Apex Tech India',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.avatarSeed || m.fullName}`,
        dueText: m.status === 'defaulter' ? 'Payment Overdue' : `Due by ${m.endDate}`,
        status: idx === 0 ? 'Unsent' : 'Viewed',
        amount: m.pendingDueInr > 0 ? m.pendingDueInr : m.totalFeeInr,
        subItems: [
          { title: `${m.planName} Subscription`, amount: Math.round((m.pendingDueInr || m.totalFeeInr) * 0.7) },
          { title: 'Biomarker Assessment & Recovery Suite', amount: Math.round((m.pendingDueInr || m.totalFeeInr) * 0.2) },
          { title: 'High-Protein Indian Nutrition Protocol', amount: Math.round((m.pendingDueInr || m.totalFeeInr) * 0.1) }
        ]
      });
    });

    // Fill with active members or high-value executive corporate passes
    INITIAL_INVOICES.forEach((inv) => {
      if (!generated.some((g) => g.customerName.toLowerCase() === inv.customerName.toLowerCase())) {
        generated.push(inv);
      }
    });

    return generated;
  }, [members]);

  const [invoices, setInvoices] = useState<InvoiceItem[]>(activeDbInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    activeDbInvoices[2]?.id || activeDbInvoices[0]?.id || 'inv-3'
  );
  const [activeTabPill, setActiveTabPill] = useState<'all' | 'draft' | 'unpaid'>('unpaid');
  const [activeProviderPill, setActiveProviderPill] = useState<string>('stripe');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Keep invoices synchronized with dynamic DB props
  React.useEffect(() => {
    setInvoices(activeDbInvoices);
    if (!activeDbInvoices.some((i) => i.id === selectedInvoiceId)) {
      setSelectedInvoiceId(activeDbInvoices[0]?.id || 'inv-3');
    }
  }, [activeDbInvoices]);

  // Real Database Numbers Calculated in INR (₹)
  const totalOverdueInr = useMemo(() => {
    if (!members || members.length === 0) return 31211.0;
    const sum = members.reduce((acc, m) => acc + (Number(m.pendingDueInr) || 0), 0);
    return sum > 0 ? sum : 31211.0;
  }, [members]);

  const dueNextMonthInr = useMemo(() => {
    if (!members || members.length === 0) return 172560.0;
    const sum = members.reduce((acc, m) => acc + (Number(m.totalFeeInr) || 0), 0);
    return sum > 0 ? sum * 12 : 172560.0;
  }, [members]);

  const availablePayoutInr = useMemo(() => {
    if (!payments || payments.length === 0) return 214390.0;
    const sum = payments.reduce((acc, p) => acc + (Number(p.amountInr) || 0), 0);
    return sum > 0 ? sum : 214390.0;
  }, [payments]);

  const selectedInvoice =
    invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[2] || invoices[0] || INITIAL_INVOICES[2];

  const filteredInvoices = invoices.filter((inv) => {
    if (activeTabPill === 'draft' && inv.status !== 'Draft') return false;
    if (activeTabPill === 'unpaid' && inv.status !== 'Unsent' && inv.status !== 'Viewed') return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.companyName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatCurrency = (val: number) => {
    return `₹ ${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-sans select-none antialiased text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. SUB-HEADER: Back Button, Title, Filter & Create Invoice Button
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#232a3b] bg-[#121622] text-zinc-400 hover:text-white hover:border-[#ccff00]/40 transition-colors"
              title="Return to Overview"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Invoices
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#232a3b] bg-[#121622] text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            title="Filter Invoices"
          >
            <Filter className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenAddMember}
            className="flex items-center gap-2 rounded-xl bg-[#ccff00] text-black font-extrabold text-xs px-4 py-2 hover:bg-[#b8e600] active:scale-95 transition-all shadow-md"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create an invoice</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TOP BENTO METRICS CARD: Overdue, Due next month, Avg time, Instant Payout
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Overdue + Due Next Month + Timeline & Avatars */}
        <div className="lg:col-span-8 rounded-2xl border border-[#202738] bg-[#121724] p-5 flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Overdue */}
            <div>
              <p className="text-xs font-medium text-zinc-400">Overdue</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                {formatCurrency(totalOverdueInr)}
              </p>
            </div>

            {/* Due within next month */}
            <div>
              <p className="text-xs font-medium text-zinc-400">Due within next month</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                {formatCurrency(dueNextMonthInr)}
              </p>
            </div>

            {/* Average time to get paid */}
            <div>
              <p className="text-xs font-medium text-zinc-400">Average time to get paid</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                12 <span className="text-base font-normal text-zinc-400">days</span>
              </p>
            </div>
          </div>

          {/* Timeline Progress Bar & Member Avatars */}
          <div className="pt-2">
            {/* Months Timeline */}
            <div className="flex items-center justify-between text-xs font-medium text-zinc-400 mb-2 px-1">
              <span>Sep</span>
              <span>Oct</span>
              <span className="font-bold text-white">Nov</span>
              <span>Dec</span>
            </div>

            {/* Multi-segmented Progress Bar with Neon Highlight on Nov */}
            <div className="flex h-1.5 w-full gap-2 rounded-full overflow-hidden bg-zinc-800/40">
              <div className="w-1/4 rounded-full bg-zinc-700/60" />
              <div className="w-1/4 rounded-full bg-zinc-700/60" />
              <div className="w-1/4 rounded-full bg-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.6)]" />
              <div className="w-1/4 rounded-full bg-zinc-800/50" />
            </div>

            {/* Overlapping Avatars below Timeline */}
            <div className="flex items-center justify-between mt-4 px-1">
              <div className="flex -space-x-2 overflow-hidden">
                {TIMELINE_AVATARS.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt="Customer Avatar"
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0d121c] object-cover"
                  />
                ))}
              </div>

              <div className="flex -space-x-2 overflow-hidden">
                {TIMELINE_AVATARS.slice(0, 3).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt="Customer Avatar"
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0d121c] object-cover"
                  />
                ))}
              </div>

              <div className="flex -space-x-2 overflow-hidden">
                {TIMELINE_AVATARS.slice(2, 4).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt="Customer Avatar"
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0d121c] object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Available for Instant Payout Card */}
        <div className="lg:col-span-4 rounded-2xl border border-[#202738] bg-[#121724] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-medium">Available for Instant Payout</span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                Expects <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
              {formatCurrency(availablePayoutInr)}
            </p>
          </div>

          {/* Provider Selectors: UPI / Razorpay / HDFC */}
          <div className="my-5">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveProviderPill('visa')}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-mono transition-all ${
                  activeProviderPill === 'visa'
                    ? 'bg-[#ccff00] text-black font-bold'
                    : 'border border-[#242c3f] bg-[#0c1017] text-zinc-400 hover:text-white'
                }`}
              >
                <span className="text-[11px]">#4443</span>
                <span className="text-[10px] opacity-75 mt-0.5">UPI</span>
              </button>

              <button
                onClick={() => setActiveProviderPill('stripe')}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-mono transition-all ${
                  activeProviderPill === 'stripe'
                    ? 'bg-[#ccff00] text-black font-bold shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                    : 'border border-[#242c3f] bg-[#0c1017] text-zinc-400 hover:text-white'
                }`}
              >
                <span className="text-[11px]">#177210</span>
                <span className="text-[10px] opacity-75 mt-0.5">Razorpay</span>
              </button>

              <button
                onClick={() => setActiveProviderPill('paypal')}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-mono transition-all ${
                  activeProviderPill === 'paypal'
                    ? 'bg-[#ccff00] text-black font-bold'
                    : 'border border-[#242c3f] bg-[#0c1017] text-zinc-400 hover:text-white'
                }`}
              >
                <span className="text-[11px]">#711221</span>
                <span className="text-[10px] opacity-75 mt-0.5">Paytm</span>
              </button>
            </div>
          </div>

          {/* Pay out now button */}
          <button
            onClick={() => {
              if (onOpenPaymentModal) {
                const memberMatch = members.find((m) => m.fullName === selectedInvoice.customerName);
                onOpenPaymentModal(memberMatch || members[0]);
              } else {
                alert(`Instant payout of ${formatCurrency(availablePayoutInr)} initiated via Razorpay.`);
              }
            }}
            className="w-full py-3 rounded-full bg-white text-zinc-950 font-extrabold text-xs tracking-wider uppercase hover:bg-zinc-200 active:scale-95 transition-all shadow-md"
          >
            Pay out now
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ACTIVE FILTERS PILL ROW
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Active filters count badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-[#232b3d] bg-[#101522] px-3 py-1.5 text-xs text-zinc-300">
            <span className="font-medium">Active filters</span>
            <span className="h-4 w-4 rounded-full bg-zinc-800 text-[10px] font-bold text-white flex items-center justify-center">
              2
            </span>
          </div>

          {/* Filter dropdowns */}
          <button className="flex items-center gap-2 rounded-full border border-[#232b3d] bg-[#101522] px-3.5 py-1.5 text-xs text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors">
            <span>All customers</span>
            <ChevronDown className="h-3 w-3 text-zinc-400" />
          </button>

          <button className="flex items-center gap-2 rounded-full border border-[#232b3d] bg-[#101522] px-3.5 py-1.5 text-xs text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors">
            <span>All statuses</span>
            <ChevronDown className="h-3 w-3 text-zinc-400" />
          </button>

          {/* Date range pills */}
          <div className="flex items-center rounded-full border border-[#232b3d] bg-[#101522] px-3 py-1.5 text-xs text-zinc-300 gap-2">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-mono text-[11px]">November 2026</span>
          </div>

          <div className="flex items-center rounded-full border border-[#232b3d] bg-[#101522] px-3 py-1.5 text-xs text-zinc-300 gap-2">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-mono text-[11px]">December 2026</span>
          </div>
        </div>

        {/* Search input: Enter invoice # */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter invoice # or name..."
            className="w-full h-9 rounded-full border border-[#232b3d] bg-[#101522] pl-4 pr-10 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#ccff00] transition-colors"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MAIN SPLIT PANEL (Left: High-Contrast List | Right: Dark Inspector)
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Segmented Filter Pills (All Invoices, Draft, Unpaid) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTabPill('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTabPill === 'all'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'border border-[#232a3c] bg-[#101522] text-zinc-400 hover:text-white'
              }`}
            >
              All Invoices
            </button>

            <button
              onClick={() => setActiveTabPill('draft')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTabPill === 'draft'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'border border-[#232a3c] bg-[#101522] text-zinc-400 hover:text-white'
              }`}
            >
              Draft <span className="opacity-75">3</span>
            </button>

            <button
              onClick={() => setActiveTabPill('unpaid')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTabPill === 'unpaid'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'border border-[#232a3c] bg-[#101522] text-zinc-400 hover:text-white'
              }`}
            >
              Unpaid <span className="opacity-75">{filteredInvoices.length}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-zinc-400">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#121622] hover:text-white transition-colors">
              <Grid className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#121622] text-white">
              <List className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#121622] hover:text-white transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ── LEFT COLUMN: High-Contrast Card List (Exact match to screenshot) ── */}
          <div className="lg:col-span-5 rounded-3xl bg-white text-zinc-900 p-5 shadow-2xl">
            <h2 className="text-sm font-extrabold text-zinc-950 mb-4 tracking-tight">
              Unpaid Invoices
            </h2>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredInvoices.map((inv) => {
                const isSelected = inv.id === selectedInvoice.id;
                return (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInvoiceId(inv.id)}
                    className={`cursor-pointer rounded-2xl p-3 transition-all ${
                      isSelected
                        ? 'bg-[#0f1422] text-white shadow-lg ring-1 ring-[#ccff00]/40'
                        : 'hover:bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={inv.avatarUrl}
                          alt={inv.customerName}
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono">
                              {inv.invoiceNo}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-zinc-800 text-zinc-300'
                                  : 'bg-zinc-200 text-zinc-700'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] font-medium mt-0.5 ${
                              isSelected ? 'text-zinc-400' : 'text-zinc-500'
                            }`}
                          >
                            {inv.dueText}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-sm font-black font-mono ${
                            isSelected ? 'text-white' : 'text-zinc-950'
                          }`}
                        >
                          {formatCurrency(inv.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Dark Detailed Invoice Inspector Card ── */}
          <div className="lg:col-span-7 rounded-3xl border border-[#1b2234] bg-[#0d121c] p-6 shadow-2xl space-y-6">
            {/* Header: Invoice details, Company & Customer */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1b2234] pb-5">
              <div>
                <p className="text-xs text-zinc-400">Invoice details</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-black text-white font-mono">
                    {selectedInvoice.invoiceNo}
                  </span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-0.5 text-[10px] font-bold text-zinc-300">
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-400">Company</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-base font-bold text-white">
                    {selectedInvoice.companyName}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#ccff00]" />
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-400">Customer</p>
                <div className="flex items-center gap-2.5 mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedInvoice.avatarUrl}
                    alt={selectedInvoice.customerName}
                    className="h-8 w-8 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">
                      {selectedInvoice.customerName}
                    </p>
                    <p className="text-[10px] text-zinc-400 leading-tight">
                      {selectedInvoice.customerRole}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Item Breakdown Cards with Trend Arrow */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {selectedInvoice.subItems.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#202738] bg-[#121724] p-3.5 flex flex-col justify-between h-24 hover:border-zinc-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">
                      {formatCurrency(item.amount)}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                  <p className="text-[11px] font-medium text-zinc-400 leading-tight">
                    {item.title}
                  </p>
                </div>
              ))}

              {/* Plus add item card */}
              <button
                onClick={onOpenAddMember}
                className="rounded-2xl border border-dashed border-[#262f44] bg-[#0c1017]/60 hover:bg-[#121724] hover:border-[#ccff00]/50 flex items-center justify-center h-24 text-zinc-500 hover:text-[#ccff00] transition-colors"
                title="Add Line Item"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>

            {/* Bottom Summary Bar & Pay Out Button */}
            <div className="pt-4 border-t border-[#1b2234] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <p className="text-zinc-500 font-medium">Sub Total</p>
                  <p className="font-mono font-bold text-white text-sm mt-0.5">
                    {formatCurrency(selectedInvoice.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 font-medium">Total</p>
                  <p className="font-mono font-bold text-white text-sm mt-0.5">
                    {formatCurrency(selectedInvoice.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 font-medium">Balance Due</p>
                  <p className="font-mono font-bold text-white text-sm mt-0.5">
                    {formatCurrency(selectedInvoice.amount)}
                  </p>
                </div>
              </div>

              {/* Action Controls & Primary Neon Button */}
              <div className="flex items-center gap-2">
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#232a3b] bg-[#121622] text-zinc-400 hover:text-white transition-colors"
                  title="Mark Completed"
                >
                  <Check className="h-4 w-4" />
                </button>

                <button
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#232a3b] bg-[#121622] text-zinc-400 hover:text-red-400 transition-colors"
                  title="Delete Draft"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => {
                    if (onOpenPaymentModal) {
                      const memberMatch = members.find((m) => m.fullName === selectedInvoice.customerName);
                      onOpenPaymentModal(memberMatch || members[0]);
                    } else {
                      alert(`Payment of ${formatCurrency(selectedInvoice.amount)} marked paid for ${selectedInvoice.customerName}.`);
                    }
                  }}
                  className="rounded-full bg-[#ccff00] px-5 py-2.5 text-xs font-black text-black uppercase tracking-wider hover:bg-[#b8e600] active:scale-95 transition-all shadow-md ml-1"
                >
                  Pay out now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
