'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowRight,
  Check,
  Trash2,
  Calendar,
  Grid,
  List,
  MoreHorizontal,
  ChevronDown,
  Sparkles,
  Star,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Zap,
  ExternalLink
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
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=140&h=140&q=80',
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
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=140&h=140&q=80',
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
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=140&h=140&q=80',
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
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&h=140&q=80',
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
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=140&h=140&q=80',
    dueText: 'In 19 days',
    status: 'Viewed',
    amount: 7311.0,
    subItems: [
      { title: 'Monthly Flex Pass', amount: 4500.0 },
      { title: 'Locker Rental & Towel Service', amount: 1800.0 },
      { title: 'Smoothie Bar Subscription', amount: 1011.0 }
    ]
  },
  {
    id: 'inv-6',
    invoiceNo: '#429-033',
    customerName: 'Neha Sharma',
    customerRole: 'Creative Director • Studio Apex',
    companyName: 'Apex Studio Mumbai',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=140&h=140&q=80',
    dueText: 'In 3 days',
    status: 'Unsent',
    amount: 32450.0,
    subItems: [
      { title: 'Semi-Private Hypertrophy Pass', amount: 18500.0 },
      { title: 'Weekly Biometric Form Audit', amount: 8450.0 },
      { title: 'Premium Recovery Suite Locker', amount: 5500.0 }
    ]
  }
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
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickPhoneInput, setQuickPhoneInput] = useState<string>('');

  React.useEffect(() => {
    setInvoices(activeDbInvoices);
  }, [activeDbInvoices]);

  // Real Database Numbers in INR (₹)
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

  const formatCurrency = (val: number) => {
    return `₹ ${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

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

  const selectedInvoice =
    invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[2] || invoices[0] || INITIAL_INVOICES[2];

  const invoiceCategories = [
    {
      num: '01',
      title: 'Annual VIP & Executive Passes',
      desc: 'Concierge memberships, all-arena access, biomarker tracking'
    },
    {
      num: '02',
      title: 'Personal Training & Nutrition Invoices',
      desc: '1-on-1 coach retainer, weekly check-ins, custom diet blueprint'
    },
    {
      num: '03',
      title: 'Monthly & Quarterly Auto-Renewals',
      desc: 'Automated recurring gym subscriptions with UPI mandate'
    },
    {
      num: '04',
      title: 'Corporate Wellness & Group Packages',
      desc: 'Bulk B2B fitness packages with consolidated company invoicing'
    }
  ];

  return (
    <div className="w-full bg-[#0a0c10] text-white selection:bg-[#ccff00] selection:text-black font-sans min-h-screen pb-16 space-y-12">
      {/* ─────────────────────────────────────────────────────────────
          1. CREATIX-STYLE WHITE ROUNDED HERO SECTION ("Smile" Curve)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full rounded-b-[40px] sm:rounded-b-[56px] bg-white text-zinc-950 p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
        {/* Top Floating Pill Menu (Matching Reference Image) */}
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 mb-10">
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3.5 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          )}

          {/* Centered Capsule Nav Pill */}
          <div className="mx-auto flex items-center gap-1 sm:gap-2 rounded-full bg-zinc-950 px-3.5 sm:px-5 py-2 text-xs font-bold text-zinc-300 shadow-xl border border-white/10">
            <span className="hidden sm:inline hover:text-white cursor-pointer px-2">About Us</span>
            <span className="hidden sm:inline hover:text-white cursor-pointer px-2">Services</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccff00] text-black font-black">
              {/* Green Starburst Icon */}
              <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                <path d="M12 2l2.4 6.6L21 11l-5.6 4.4L17 22l-5-4-5 4 1.6-6.6L3 11l6.6-2.4L12 2z" />
              </svg>
              <span>Creatix Billing</span>
            </div>
            <span className="hover:text-white cursor-pointer px-2">Invoices</span>
            <span className="hidden sm:inline hover:text-white cursor-pointer px-2">Reviews</span>
          </div>

          <button
            onClick={onOpenAddMember}
            className="flex items-center gap-2 rounded-full bg-[#ccff00] text-black font-extrabold text-xs px-4 py-2 hover:bg-[#b8e600] active:scale-95 transition-all shadow-md shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Create an invoice</span>
          </button>
        </div>

        {/* Hero Content: Starburst + Empowering Brands Headline + Executive Photo */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left copy & mini CTA */}
          <div className="lg:col-span-3 space-y-4">
            {/* Top Starburst Decorative Element */}
            <div className="w-12 h-12 flex items-center justify-center text-[#22c55e]">
              <svg className="w-12 h-12 stroke-[1.5] stroke-[#22c55e] fill-none" viewBox="0 0 24 24">
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
              </svg>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
              From automated membership dues to corporate fitness billing, we deliver innovative
              ledger strategies that elevate your gym cashflow. Let&apos;s create financial discipline
              together.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('invoices-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-bold text-zinc-800 hover:bg-zinc-50 shadow-sm"
            >
              Explore Invoices
            </button>
          </div>

          {/* Center Column: Big Headline + Smiling Female Executive Cutout */}
          <div className="lg:col-span-6 text-center flex flex-col items-center">
            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-zinc-950 uppercase leading-tight max-w-lg">
              Empowering Gyms
              <br />
              Through Creative
              <br />
              Billing Solutions
            </h1>

            {/* Central Executive Cutout with Celebratory Pose */}
            <div className="relative mt-6 w-56 h-64 sm:w-64 sm:h-72">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ccff00]/30 to-transparent blur-2xl -z-10" />
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=700&q=85"
                alt="Creatix Billing Executive"
                className="w-full h-full object-cover rounded-3xl shadow-xl border-2 border-white"
              />

              {/* Floating Buttons overlapping bottom of image */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap z-10">
                <button
                  onClick={onOpenAddMember}
                  className="rounded-full bg-[#ccff00] text-black font-extrabold text-xs px-4 py-2 hover:bg-[#b8e600] active:scale-95 transition-all shadow-lg"
                >
                  Start Your Invoice
                </button>
                <button
                  onClick={() => {
                    if (onOpenPaymentModal) onOpenPaymentModal(members[0]);
                  }}
                  className="rounded-full bg-zinc-900 text-white font-bold text-xs px-4 py-2 hover:bg-zinc-800 active:scale-95 transition-all shadow-lg"
                >
                  Let&apos;s Reconcile
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 5-Star Rating & 10 Years Experience */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center space-y-2">
            <div className="flex items-center gap-1 text-[#22c55e]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <div className="text-center lg:text-right">
              <p className="text-3xl font-black text-zinc-950">10 Years</p>
              <p className="text-xs text-zinc-500 font-medium">Verified Dues Recovery</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. 4-COLUMN STAT COUNTER BAR: 2000+, 10+, 800+, 150M+
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#11141c] border border-white/10 shadow-xl">
          <div className="text-center p-3 border-r border-white/5 last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">2000+</p>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">Active Members</p>
          </div>

          <div className="text-center p-3 border-r border-white/5 last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">10+</p>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">Years Exp.</p>
          </div>

          <div className="text-center p-3 border-r border-white/5 last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-[#ccff00] tracking-tight">800+</p>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">Invoices Settled</p>
          </div>

          <div className="text-center p-3">
            <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formatCurrency(availablePayoutInr)}
            </p>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">Tracked Revenue</p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. "TURNING IDEAS INTO MASTERPIECES" BENTO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            {/* Green starburst accent */}
            <div className="text-[#ccff00] mb-2">✦</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight max-w-md leading-tight">
              Turning Dues Into
              <br />
              Guaranteed Cashflow
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
            We automate smart invoice generation, one-click WhatsApp fee reminders, and real-time
            UPI reconciliation so your gym cashflow stays predictable and healthy every single month.
          </p>
        </div>

        {/* Bento Grid: Team Photo + Executive Review */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Wide Team Photo Card with Neon Banner */}
          <div className="md:col-span-7 relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-white/10 group">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="Gym Billing Operations Team"
              className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {/* Neon Green Banner across bottom */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="rounded-xl bg-[#ccff00] text-black font-black uppercase text-xs sm:text-sm px-4 py-3 shadow-xl inline-block tracking-wider">
                A CREATIVE BILLING & RECOVERY DESK
              </div>
            </div>
          </div>

          {/* Tall Portrait Card */}
          <div className="md:col-span-5 relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-white/10 group">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
              alt="Financial Controller"
              className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm font-bold text-white">Smart Automated Reconciliation</p>
              <p className="text-xs text-zinc-400 mt-0.5">Real-time ledger updates with instant UPI webhooks</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. "OUR SERVICES" / INVOICE CATEGORIES BENTO BOX
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-[#11141d] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
          {/* Vertical Green Tab Badge on Left */}
          <div className="hidden lg:block absolute left-0 top-12 -translate-y-1/2 -rotate-90 origin-left">
            <span className="bg-[#ccff00] text-black font-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-t-lg">
              WHAT WE DO
            </span>
          </div>

          {/* Section Heading with Neon Rounded Box */}
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span>Our</span>
              <span className="rounded-xl bg-[#ccff00] text-black px-3.5 py-0.5 font-black">
                Services
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-2 max-w-md">
              We offer a range of automated billing and digital recovery services designed to help
              your gym maintain zero overdue dues.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: 4 Interactive Numbered Categories */}
            <div className="lg:col-span-5 space-y-3">
              {invoiceCategories.map((cat, idx) => {
                const isActive = activeCategoryIndex === idx;
                return (
                  <button
                    key={cat.num}
                    onClick={() => setActiveCategoryIndex(idx)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'border-[#ccff00] bg-black text-white shadow-lg ring-1 ring-[#ccff00]/40'
                        : 'border-white/10 bg-[#161a25] text-zinc-300 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#ccff00]">{cat.num}</span>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-wide">{cat.title}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{cat.desc}</p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? 'text-[#ccff00] translate-x-1' : 'text-zinc-500'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Center: Photo of Specialist Working */}
            <div className="lg:col-span-4 relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=750&q=80"
                alt="Billing Specialist"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono text-[#ccff00] uppercase font-bold">
                  Live Operations
                </span>
                <p className="text-xs font-bold text-white mt-0.5">Automated Invoice Dispatch</p>
              </div>
            </div>

            {/* Right: Two Stacked Cards (Dark + Neon Filled) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Card 1: Dark Card */}
              <div className="rounded-2xl border border-white/10 bg-[#151924] p-5 flex flex-col justify-between h-36">
                <p className="text-xs text-zinc-300 font-medium leading-snug">
                  Ever wondered how instant dues recovery works?
                </p>
                <button
                  onClick={() => {
                    const el = document.getElementById('invoices-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-between text-xs font-bold text-white hover:text-[#ccff00] transition-colors pt-2 border-t border-white/5"
                >
                  <span>See how we work</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 2: Neon Green Filled Card (Matching Reference) */}
              <div className="rounded-2xl bg-[#ccff00] text-black p-5 flex flex-col justify-between h-36 shadow-xl">
                <p className="text-xs font-extrabold leading-snug">
                  Looking for billing experts who can recover dues with 1 click?
                </p>
                <button
                  onClick={() => {
                    if (onOpenPaymentModal) onOpenPaymentModal(members[0]);
                  }}
                  className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black pt-2 border-t border-black/20 hover:opacity-80 transition-opacity"
                >
                  <span>Meet our expert</span>
                  <div className="w-6 h-6 rounded-full bg-black text-[#ccff00] flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. TYPOGRAPHIC DISPLAY BANNER: Innovate + Inspire + Create
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-6 border-y border-white/10 overflow-hidden text-center bg-black">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-white flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
          <span>INNOVATE</span>
          <span className="text-[#ccff00]">+</span>
          <span>INSPIRE</span>
          <span className="text-[#ccff00]">+</span>
          <span>CREATE</span>
        </h2>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. "MEET THE TEAM" STYLE 6-CARD INVOICE DIRECTORY
      ───────────────────────────────────────────────────────────── */}
      <section id="invoices-grid" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span>Meet</span>
              <span className="rounded-xl bg-[#ccff00] text-black px-3.5 py-0.5 font-black">
                the Invoices
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Live database records with pending dues, Indian recipient profiles, and WhatsApp receipts.
            </p>
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTabPill('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTabPill === 'all'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'border border-white/10 bg-[#161a25] text-zinc-400 hover:text-white'
              }`}
            >
              All Invoices
            </button>

            <button
              onClick={() => setActiveTabPill('draft')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTabPill === 'draft'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'border border-white/10 bg-[#161a25] text-zinc-400 hover:text-white'
              }`}
            >
              Draft <span className="opacity-75">3</span>
            </button>

            <button
              onClick={() => setActiveTabPill('unpaid')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTabPill === 'unpaid'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'border border-white/10 bg-[#161a25] text-zinc-400 hover:text-white'
              }`}
            >
              Unpaid <span className="opacity-75">{filteredInvoices.length}</span>
            </button>
          </div>
        </div>

        {/* 6 White Cards Grid (Matching "Meet the Team" in Reference Image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInvoices.slice(0, 6).map((inv) => (
            <div
              key={inv.id}
              className="rounded-3xl bg-white text-zinc-950 p-6 shadow-xl border border-zinc-200 flex flex-col justify-between space-y-4 hover:shadow-2xl transition-all group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#ccff00]/30 flex items-center justify-center text-zinc-900">
                      <Sparkles className="w-3.5 h-3.5 fill-[#22c55e] text-[#22c55e]" />
                    </div>
                    <span className="font-mono text-xs font-extrabold text-zinc-900">
                      {inv.invoiceNo}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      inv.status === 'Unsent'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                {/* Customer Details */}
                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={inv.avatarUrl}
                    alt={inv.customerName}
                    className="h-12 w-12 rounded-full object-cover border-2 border-[#ccff00] shrink-0"
                  />
                  <div>
                    <h4 className="text-base font-extrabold text-zinc-950 leading-tight">
                      {inv.customerName}
                    </h4>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5 truncate max-w-[180px]">
                      {inv.customerRole}
                    </p>
                    <p className="text-[11px] font-semibold text-zinc-400 mt-0.5">
                      {inv.companyName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Due & 1-Click Pay Action */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Balance Due
                  </p>
                  <p className="text-lg font-black font-mono text-zinc-950">
                    {formatCurrency(inv.amount)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/919876543210?text=Hi%20${encodeURIComponent(inv.customerName)},%20here%20is%20your%20GymPRO%20invoice%20${inv.invoiceNo}%20for%20${formatCurrency(inv.amount)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-[#25d366] hover:text-white transition-colors"
                    title="Send WhatsApp Notice"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => {
                      if (onOpenPaymentModal) {
                        const m = members.find((mem) => mem.fullName === inv.customerName);
                        onOpenPaymentModal(m || members[0]);
                      } else {
                        alert(`Recorded payment of ${formatCurrency(inv.amount)} for ${inv.customerName}`);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ccff00] text-black font-extrabold text-xs hover:bg-[#b8e600] active:scale-95 transition-all shadow-sm"
                  >
                    <span>Pay</span>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. INFINITE TICKER TAPE MARQUEE RIBBON
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-3 bg-[#ccff00] text-black font-black uppercase text-xs tracking-widest overflow-hidden whitespace-nowrap shadow-md">
        <div className="inline-flex items-center gap-8 animate-marquee">
          <span>• INSTANT UPI INVOICES</span>
          <span>• WHATSAPP FEE NOTICES</span>
          <span>• RAZORPAY FAST PAYOUTS</span>
          <span>• GST COMPLIANT RECEIPTS</span>
          <span>• REAL-TIME LEDGER RECONCILIATION</span>
          <span>• ZERO UNPAID DUES GUARANTEE</span>
          <span>• INSTANT UPI INVOICES</span>
          <span>• WHATSAPP FEE NOTICES</span>
          <span>• RAZORPAY FAST PAYOUTS</span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. "GET IN TOUCH TODAY!" CTA SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-[#11141c] border border-white/10 p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg space-y-3">
            <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
              Get in Touch Today!
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Let&apos;s transform your gym cashflow with automated WhatsApp fee notices, instant UPI
              settlements, and zero paperwork.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Quick invoice request received for ${quickPhoneInput}!`);
                setQuickPhoneInput('');
              }}
              className="flex items-center gap-2 pt-2 max-w-md"
            >
              <input
                type="text"
                value={quickPhoneInput}
                onChange={(e) => setQuickPhoneInput(e.target.value)}
                placeholder="Enter member phone or email..."
                className="flex-1 h-11 px-4 rounded-full border border-white/15 bg-black text-xs text-white placeholder-zinc-500 outline-none focus:border-[#ccff00] transition-colors"
                required
              />
              <button
                type="submit"
                className="h-11 px-6 rounded-full bg-[#ccff00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#b8e600] active:scale-95 transition-all shadow-md shrink-0"
              >
                Send
              </button>
            </form>
          </div>

          {/* Right Cutout Image holding tablet */}
          <div className="w-52 h-64 sm:w-60 sm:h-72 relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=700&q=80"
              alt="Creatix Specialist"
              className="w-full h-full object-cover rounded-3xl border-2 border-white/10 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. VIBRANT NEON-GREEN FOOTER (Matching Reference Image)
      ───────────────────────────────────────────────────────────── */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-[#ccff00] text-black p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-black/15 pb-8">
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7 fill-black" viewBox="0 0 24 24">
                <path d="M12 2l2.4 6.6L21 11l-5.6 4.4L17 22l-5-4-5 4 1.6-6.6L3 11l6.6-2.4L12 2z" />
              </svg>
              <span className="text-2xl font-black tracking-tight uppercase">Creatix Billing</span>
            </div>

            <p className="text-xs font-extrabold max-w-md text-black/80">
              The intelligent financial operating system for multi-tenant gyms, studios & wellness centers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-bold text-black/80">
            <div>
              <p className="font-black text-black uppercase mb-2">SERVICES</p>
              <ul className="space-y-1.5 font-medium">
                <li>UPI Dues Recovery</li>
                <li>WhatsApp Invoices</li>
                <li>Instant Payouts</li>
                <li>GST Ledger</li>
              </ul>
            </div>

            <div>
              <p className="font-black text-black uppercase mb-2">INVOICES</p>
              <ul className="space-y-1.5 font-medium">
                <li>Annual VIP Passes</li>
                <li>Personal Training</li>
                <li>Diet Consultations</li>
                <li>Corporate Plans</li>
              </ul>
            </div>

            <div>
              <p className="font-black text-black uppercase mb-2">INTEGRATIONS</p>
              <ul className="space-y-1.5 font-medium">
                <li>Razorpay UPI</li>
                <li>WhatsApp Cloud API</li>
                <li>HDFC SmartHub</li>
                <li>Paytm Business</li>
              </ul>
            </div>

            <div>
              <p className="font-black text-black uppercase mb-2">CONNECT</p>
              <p className="text-[11px] font-medium leading-relaxed">
                Need immediate help with dues reconciliation?
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 rounded-full bg-black text-[#ccff00] font-black text-xs uppercase"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-black/15 flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-black/70 gap-2">
            <p>© 2026 Creatix Billing • GymPRO Service. All rights reserved.</p>
            <p>100% Secure Encrypted UPI Settlements</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
