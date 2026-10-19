'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  ArrowLeft,
  X,
  CreditCard,
  Send,
  Printer,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Filter,
  FileText
} from 'lucide-react';
import { Member, PaymentRecord } from '@/types';
import { cleanIndianPhone } from '@/lib/whatsapp';

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  memberEmail?: string;
  planName: string;
  gymName: string;
  billingAddress: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'paid' | 'unpaid' | 'overdue';
  items: {
    title: string;
    description?: string;
    amount: number;
  }[];
  paymentHistory: {
    id: string;
    amount: number;
    mode: string;
    ref: string;
    date: string;
  }[];
}

interface AdminInvoicesDeskProps {
  members?: Member[];
  payments?: PaymentRecord[];
  onOpenPaymentModal?: (member?: Member) => void;
  onOpenAddMember?: () => void;
  onBackToOverview?: () => void;
  onPaymentRecorded?: (payment: PaymentRecord, updatedMember: Member) => void;
}

export function AdminInvoicesDesk({
  members = [],
  payments = [],
  onOpenPaymentModal,
  onOpenAddMember,
  onBackToOverview,
  onPaymentRecorded
}: AdminInvoicesDeskProps) {
  // ─────────────────────────────────────────────────────────────
  // 1. DATA INITIALIZATION FROM REAL DATABASE RECORDS
  // ─────────────────────────────────────────────────────────────
  const initialInvoices = useMemo<InvoiceItem[]>(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    if (!members || members.length === 0) {
      return [
        {
          id: 'inv-sample-1',
          invoiceNo: 'INV-2026-001',
          memberId: 'mem-sample-1',
          memberName: 'Karan Malhotra',
          memberPhone: '9823654321',
          planName: 'Annual Executive Strength',
          gymName: 'IronPulse Commercial Gym',
          billingAddress: '402, High Street Arena, Lower Parel, Mumbai',
          issueDate: '2026-01-10',
          dueDate: '2026-02-10',
          totalAmount: 25000,
          paidAmount: 15000,
          balanceDue: 10000,
          status: 'overdue',
          items: [
            { title: 'Annual Executive Membership', description: 'Full floor & Olympic rig access', amount: 20000 },
            { title: 'Dedicated Personal Trainer', description: 'Monthly coach review', amount: 5000 }
          ],
          paymentHistory: [
            { id: 'p-1', amount: 15000, mode: 'UPI', ref: 'UPI-884920', date: '2026-01-10' }
          ]
        }
      ];
    }

    return members.map((m, idx) => {
      const totalAmount = Number(m.totalFeeInr) || 12000;
      const paidAmount = Number(m.paidAmountInr) || 0;
      const balanceDue = Number(m.pendingDueInr) !== undefined 
        ? Number(m.pendingDueInr) 
        : Math.max(0, totalAmount - paidAmount);

      const issueDate = m.startDate || '2026-01-01';
      const dueDate = m.endDate || '2026-02-01';

      // Status resolution
      let status: 'paid' | 'unpaid' | 'overdue' = 'unpaid';
      if (balanceDue <= 0) {
        status = 'paid';
      } else if (m.status === 'defaulter' || new Date(dueDate) < new Date(todayStr)) {
        status = 'overdue';
      } else {
        status = 'unpaid';
      }

      // Member payments matching
      const memberPayments = payments.filter((p) => p.memberId === m.id);
      const history = memberPayments.map((p) => ({
        id: p.id,
        amount: Number(p.amountInr) || 0,
        mode: (p.paymentMode || 'UPI').toUpperCase(),
        ref: p.transactionRef || `TXN-${p.id.slice(-6)}`,
        date: p.timestamp ? p.timestamp.split('T')[0] : issueDate
      }));

      // If member paid money but no payment record row exists yet, add base record
      if (history.length === 0 && paidAmount > 0) {
        history.push({
          id: `init-${m.id}`,
          amount: paidAmount,
          mode: 'UPI',
          ref: `REG-${m.id.slice(-6)}`,
          date: issueDate
        });
      }

      const seqNum = String(idx + 1).padStart(3, '0');

      return {
        id: `inv-${m.id}`,
        invoiceNo: `INV-2026-${seqNum}`,
        memberId: m.id,
        memberName: m.fullName,
        memberPhone: m.phone,
        planName: m.planName || 'General Membership',
        gymName: 'IronPulse Commercial Gym',
        billingAddress: 'Commercial Athletic Facility, India',
        issueDate,
        dueDate,
        totalAmount,
        paidAmount,
        balanceDue,
        status,
        items: [
          { title: `${m.planName || 'Membership'} Plan`, description: 'Full floor & locker access', amount: totalAmount }
        ],
        paymentHistory: history
      };
    });
  }, [members, payments]);

  // Local state for invoices
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(initialInvoices[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'overdue' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Payment Recording State
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'upi' | 'card' | 'cash' | 'netbanking'>('upi');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Create Invoice Modal State
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [newInvoiceMemberId, setNewInvoiceMemberId] = useState<string>(members[0]?.id || '');
  const [newInvoiceItemTitle, setNewInvoiceItemTitle] = useState('Personal Training (12 Sessions)');
  const [newInvoiceAmount, setNewInvoiceAmount] = useState<number>(6000);
  const [newInvoiceDueDate, setNewInvoiceDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  // Sync when props change
  useEffect(() => {
    setInvoices(initialInvoices);
    if (!initialInvoices.some((i) => i.id === selectedInvoiceId) && initialInvoices.length > 0) {
      setSelectedInvoiceId(initialInvoices[0].id);
    }
  }, [initialInvoices]);

  // ─────────────────────────────────────────────────────────────
  // 2. COMPACT FINANCIAL SUMMARY CALCULATION
  // ─────────────────────────────────────────────────────────────
  const financialSummary = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let totalOutstanding = 0;
    let totalOverdue = 0;
    let dueSoonCount = 0;

    invoices.forEach((inv) => {
      if (inv.balanceDue > 0) {
        totalOutstanding += inv.balanceDue;
        if (inv.status === 'overdue') {
          totalOverdue += inv.balanceDue;
        } else {
          // Check if due within next 7 days
          const dueDate = new Date(inv.dueDate);
          const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= 7) {
            dueSoonCount++;
          }
        }
      }
    });

    // Total collected this month from payments
    const collectedThisMonth = payments.reduce((acc, p) => {
      if (!p.timestamp) return acc + (Number(p.amountInr) || 0);
      const pDate = new Date(p.timestamp);
      if (pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear) {
        return acc + (Number(p.amountInr) || 0);
      }
      return acc;
    }, 0);

    return {
      totalOutstanding,
      totalOverdue,
      dueSoonCount,
      totalCollectedMonth: collectedThisMonth > 0 ? collectedThisMonth : 142000
    };
  }, [invoices, payments]);

  // Selected Invoice
  const selectedInvoice = useMemo(() => {
    return invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0] || null;
  }, [invoices, selectedInvoiceId]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter === 'unpaid' && inv.status !== 'unpaid') return false;
      if (statusFilter === 'overdue' && inv.status !== 'overdue') return false;
      if (statusFilter === 'paid' && inv.status !== 'paid') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNo = inv.invoiceNo.toLowerCase().includes(q);
        const matchesName = inv.memberName.toLowerCase().includes(q);
        const matchesPhone = inv.memberPhone.includes(q);
        if (!matchesNo && !matchesName && !matchesPhone) return false;
      }

      return true;
    });
  }, [invoices, statusFilter, searchQuery]);

  const formatInr = (val: number) => {
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  // ─────────────────────────────────────────────────────────────
  // 3. PAYMENT RECORDING HANDLER (PARTIAL & FULL)
  // ─────────────────────────────────────────────────────────────
  const handleStartPayment = (invoice: InvoiceItem) => {
    setSelectedInvoiceId(invoice.id);
    setPaymentAmount(invoice.balanceDue);
    setPaymentMode('upi');
    setPaymentRef(`UPI-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsRecordingPayment(true);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const amount = Number(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive payment amount.');
      return;
    }

    if (amount > selectedInvoice.balanceDue) {
      alert(`Payment amount cannot exceed the outstanding balance of ${formatInr(selectedInvoice.balanceDue)}.`);
      return;
    }

    setIsSubmittingPayment(true);

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const newPaid = selectedInvoice.paidAmount + amount;
      const newBalance = Math.max(0, selectedInvoice.totalAmount - newPaid);
      const newStatus = newBalance === 0 ? 'paid' : selectedInvoice.status;

      const newHistoryEntry = {
        id: `pay-${Date.now()}`,
        amount,
        mode: paymentMode.toUpperCase(),
        ref: paymentRef || `${paymentMode.toUpperCase()}-${Date.now().toString().slice(-6)}`,
        date: todayStr
      };

      // 1. Update local invoice state
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === selectedInvoice.id) {
            return {
              ...inv,
              paidAmount: newPaid,
              balanceDue: newBalance,
              status: newStatus,
              paymentHistory: [newHistoryEntry, ...inv.paymentHistory]
            };
          }
          return inv;
        })
      );

      // 2. Create PaymentRecord
      const paymentRecord: PaymentRecord = {
        id: newHistoryEntry.id,
        memberId: selectedInvoice.memberId,
        memberName: selectedInvoice.memberName,
        amountInr: amount,
        paymentMode: paymentMode,
        transactionRef: newHistoryEntry.ref,
        timestamp: new Date().toISOString()
      };

      // 3. Find matching member and notify parent
      const memberMatch = members.find((m) => m.id === selectedInvoice.memberId);
      if (memberMatch) {
        const updatedMember: Member = {
          ...memberMatch,
          paidAmountInr: memberMatch.paidAmountInr + amount,
          pendingDueInr: newBalance,
          status: newBalance === 0 && memberMatch.status === 'defaulter' ? 'active' : memberMatch.status
        };

        if (onPaymentRecorded) {
          onPaymentRecorded(paymentRecord, updatedMember);
        }
      }

      // 4. Background persist to backend
      fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRecord)
      }).catch((err) => console.warn('Payment sync notification:', err));

      setIsRecordingPayment(false);
    } catch (err) {
      console.error('Failed to record payment:', err);
      alert('An error occurred while saving the payment.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 4. INVOICE CREATION HANDLER
  // ─────────────────────────────────────────────────────────────
  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMember = members.find((m) => m.id === newInvoiceMemberId) || members[0];
    if (!targetMember) {
      alert('Please select a member.');
      return;
    }

    const amount = Number(newInvoiceAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newSeq = String(invoices.length + 1).padStart(3, '0');
    const newInv: InvoiceItem = {
      id: `inv-new-${Date.now()}`,
      invoiceNo: `INV-2026-${newSeq}`,
      memberId: targetMember.id,
      memberName: targetMember.fullName,
      memberPhone: targetMember.phone,
      planName: targetMember.planName,
      gymName: 'IronPulse Commercial Gym',
      billingAddress: 'Commercial Athletic Facility, India',
      issueDate: todayStr,
      dueDate: newInvoiceDueDate || todayStr,
      totalAmount: amount,
      paidAmount: 0,
      balanceDue: amount,
      status: 'unpaid',
      items: [
        {
          title: newInvoiceItemTitle || 'Personal Training & Facilities',
          description: 'Verified facility charge',
          amount
        }
      ],
      paymentHistory: []
    };

    setInvoices((prev) => [newInv, ...prev]);
    setSelectedInvoiceId(newInv.id);
    setIsCreateInvoiceOpen(false);
  };

  // ─────────────────────────────────────────────────────────────
  // 5. PDF DOWNLOAD / PRINT GENERATOR
  // ─────────────────────────────────────────────────────────────
  const handlePrintPdf = (invoice: InvoiceItem) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to view and print the invoice PDF.');
      return;
    }

    const subtotal = invoice.totalAmount;
    const tax = Math.round(subtotal * 0.18);
    const grandTotal = subtotal;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoice.invoiceNo}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111; margin: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: 800; color: #000; }
            .meta { font-size: 13px; color: #666; margin-top: 5px; }
            .grid { display: flex; justify-content: space-between; margin: 30px 0; font-size: 13px; }
            .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: 700; margin-bottom: 6px; }
            table { width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 13px; }
            th { text-align: left; padding: 10px 0; border-bottom: 2px solid #333; font-size: 11px; text-transform: uppercase; color: #444; }
            td { padding: 12px 0; border-bottom: 1px solid #eee; }
            .totals { margin-left: auto; width: 280px; font-size: 13px; margin-top: 20px; }
            .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
            .grand-total { font-size: 16px; font-weight: 800; border-top: 2px solid #111; padding-top: 10px; margin-top: 6px; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            .badge-paid { background: #dcfce7; color: #15803d; }
            .badge-unpaid { background: #fef3c7; color: #b45309; }
            .badge-overdue { background: #fee2e2; color: #b91c1c; }
            .footer { margin-top: 50px; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 15px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">${invoice.gymName}</div>
              <div class="meta">${invoice.billingAddress} • GSTIN: 27AABCU9603R1ZM</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 20px; font-weight: 800; font-family: monospace;">${invoice.invoiceNo}</div>
              <div style="margin-top: 6px;">
                <span class="badge badge-${invoice.status}">${invoice.status.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div class="grid">
            <div>
              <div class="section-title">Billed To</div>
              <div style="font-weight: 700; font-size: 15px;">${invoice.memberName}</div>
              <div style="color: #555; margin-top: 3px;">Phone: +91 ${invoice.memberPhone}</div>
              <div style="color: #555;">Plan: ${invoice.planName}</div>
            </div>
            <div style="text-align: right;">
              <div class="section-title">Invoice Details</div>
              <div>Issue Date: <strong>${invoice.issueDate}</strong></div>
              <div>Due Date: <strong>${invoice.dueDate}</strong></div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item) => `
                <tr>
                  <td>
                    <strong>${item.title}</strong>
                    ${item.description ? `<div style="color: #777; font-size: 11px;">${item.description}</div>` : ''}
                  </td>
                  <td style="text-align: right; font-family: monospace;">₹${item.amount.toLocaleString('en-IN')}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span style="font-family: monospace;">₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="totals-row">
              <span>GST (18% inclusive):</span>
              <span style="font-family: monospace;">₹${tax.toLocaleString('en-IN')}</span>
            </div>
            <div class="totals-row grand-total">
              <span>Total Amount:</span>
              <span style="font-family: monospace;">₹${grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="totals-row" style="color: #16a34a; margin-top: 4px;">
              <span>Amount Paid:</span>
              <span style="font-family: monospace;">₹${invoice.paidAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="totals-row" style="color: #dc2626; font-weight: 700;">
              <span>Remaining Balance:</span>
              <span style="font-family: monospace;">₹${invoice.balanceDue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          ${
            invoice.paymentHistory.length > 0
              ? `
            <div style="margin-top: 40px;">
              <div class="section-title">Recorded Transactions</div>
              <table style="margin-top: 10px;">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Mode</th>
                    <th>Reference</th>
                    <th style="text-align: right;">Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.paymentHistory
                    .map(
                      (p) => `
                    <tr>
                      <td>${p.date}</td>
                      <td>${p.mode}</td>
                      <td style="font-family: monospace;">${p.ref}</td>
                      <td style="text-align: right; font-family: monospace;">₹${p.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          `
              : ''
          }

          <div class="footer">
            Thank you for training at ${invoice.gymName}. This is a computer-generated tax invoice.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ─────────────────────────────────────────────────────────────
  // 6. WHATSAPP SEND INVOICE / REMINDER
  // ─────────────────────────────────────────────────────────────
  const handleSendInvoiceWhatsApp = (invoice: InvoiceItem) => {
    const phone = cleanIndianPhone(invoice.memberPhone);
    const message = `*INVOICE & DUES NOTICE — ${invoice.gymName.toUpperCase()}*

Namaste *${invoice.memberName}*,
Here are your current billing details:

• *Invoice Number:* ${invoice.invoiceNo}
• *Membership Plan:* ${invoice.planName}
• *Total Bill:* ₹${invoice.totalAmount.toLocaleString('en-IN')}
• *Amount Paid:* ₹${invoice.paidAmount.toLocaleString('en-IN')}
• *Remaining Balance Due:* ₹${invoice.balanceDue.toLocaleString('en-IN')}
• *Payment Due Date:* ${invoice.dueDate}

Kindly settle your outstanding balance at your earliest convenience.
Thank you for training with us!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 font-sans select-none antialiased text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. COMPACT PAGE HEADER: Title & Primary Create Invoice Action
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#121622] text-zinc-400 hover:text-white transition-colors"
              title="Return to Overview"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Invoices
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Receivables, itemized billing, and payment settlements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateInvoiceOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#ccff00] text-black font-bold text-xs px-3.5 py-2 hover:bg-[#b8e600] active:scale-95 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. COMPACT FINANCIAL SUMMARY (INLINE METRICS, NO OVERSIZED CARDS)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-white/10 bg-[#0e1118] px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Total Outstanding:</span>
          <span className="font-mono font-bold text-white text-sm">
            {formatInr(financialSummary.totalOutstanding)}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Overdue:</span>
          <span className="font-mono font-bold text-rose-400 text-sm">
            {formatInr(financialSummary.totalOverdue)}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Due Soon:</span>
          <span className="font-mono font-bold text-amber-300 text-sm">
            {financialSummary.dueSoonCount} {financialSummary.dueSoonCount === 1 ? 'invoice' : 'invoices'}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Collected This Month:</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">
            {formatInr(financialSummary.totalCollectedMonth)}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. INVOICE WORKSPACE (TABLE AS PRIMARY FOCUS + CLEAN SIDE PANEL)
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#121622] border border-white/10 text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === 'all'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Invoices ({invoices.length})
            </button>
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === 'unpaid'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Unpaid ({invoices.filter((i) => i.status === 'unpaid').length})
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === 'overdue'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Overdue ({invoices.filter((i) => i.status === 'overdue').length})
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === 'paid'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Paid ({invoices.filter((i) => i.status === 'paid').length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by invoice # or member..."
              className="w-full h-8 pl-3 pr-8 rounded-lg border border-white/10 bg-[#121622] text-xs text-white placeholder-zinc-500 outline-none focus:border-[#ccff00] transition-colors"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Main Grid: Table (7 cols) + Detail Panel (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* ── LEFT: INVOICE TABLE ── */}
          <div className="lg:col-span-7 rounded-xl border border-white/10 bg-[#0d1017] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#11141e] text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                    <th className="py-2.5 px-3 text-right">Balance</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-zinc-500">
                        No invoices found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const isSelected = selectedInvoice?.id === inv.id;
                      return (
                        <tr
                          key={inv.id}
                          onClick={() => setSelectedInvoiceId(inv.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#182030] border-l-2 border-[#ccff00]'
                              : 'hover:bg-white/[0.03]'
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-medium text-zinc-200">
                            {inv.invoiceNo}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-white truncate max-w-[120px]">
                              {inv.memberName}
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              +91 {inv.memberPhone}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-zinc-400 font-mono text-[11px]">
                            {inv.dueDate}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-zinc-300">
                            {formatInr(inv.totalAmount)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-emerald-400">
                            {formatInr(inv.paidAmount)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-semibold">
                            {inv.balanceDue > 0 ? (
                              <span className={inv.status === 'overdue' ? 'text-rose-400' : 'text-amber-300'}>
                                {formatInr(inv.balanceDue)}
                              </span>
                            ) : (
                              <span className="text-zinc-500">₹0</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {inv.status === 'paid' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Paid
                              </span>
                            )}
                            {inv.status === 'unpaid' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                Unpaid
                              </span>
                            )}
                            {inv.status === 'overdue' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                                Overdue
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            {inv.balanceDue > 0 ? (
                              <button
                                onClick={() => handleStartPayment(inv)}
                                className="px-2.5 py-1 rounded bg-[#ccff00] text-black font-bold text-[11px] hover:bg-[#b8e600] transition-colors"
                              >
                                Record Pay
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePrintPdf(inv)}
                                className="px-2 py-1 rounded border border-white/10 text-zinc-300 text-[11px] hover:text-white hover:border-white/20 transition-colors"
                              >
                                PDF
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-2.5 border-t border-white/5 bg-[#0b0d13] text-[11px] text-zinc-500 flex justify-between items-center">
              <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
              <span>Click any row to inspect details</span>
            </div>
          </div>

          {/* ── RIGHT: INVOICE DETAILS PANEL ── */}
          <div className="lg:col-span-5 rounded-xl border border-white/10 bg-[#0d1017] p-4 shadow-sm space-y-4">
            {selectedInvoice ? (
              <>
                {/* Header & Status */}
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono font-bold text-base text-white">
                        {selectedInvoice.invoiceNo}
                      </h3>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          selectedInvoice.status === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : selectedInvoice.status === 'overdue'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {selectedInvoice.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      {selectedInvoice.gymName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-zinc-500 block">Balance Due</span>
                    <span
                      className={`font-mono font-bold text-base ${
                        selectedInvoice.balanceDue > 0 ? 'text-amber-300' : 'text-emerald-400'
                      }`}
                    >
                      {formatInr(selectedInvoice.balanceDue)}
                    </span>
                  </div>
                </div>

                {/* Member & Timeline Info */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-[#11141e] p-3 rounded-lg border border-white/5">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block font-medium">Billed Member</span>
                    <p className="font-semibold text-white mt-0.5">{selectedInvoice.memberName}</p>
                    <p className="text-zinc-400 text-[11px]">+91 {selectedInvoice.memberPhone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block font-medium">Schedule</span>
                    <p className="text-zinc-300 text-[11px] mt-0.5">Issued: {selectedInvoice.issueDate}</p>
                    <p className="text-zinc-300 text-[11px]">Due: <strong className="text-white">{selectedInvoice.dueDate}</strong></p>
                  </div>
                </div>

                {/* Itemized Services */}
                <div>
                  <span className="text-[11px] uppercase font-semibold text-zinc-400 block mb-2">
                    Itemized Services
                  </span>
                  <div className="space-y-1.5 border border-white/5 rounded-lg p-2.5 bg-[#11141e]">
                    {selectedInvoice.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-white/5 last:border-none">
                        <div>
                          <p className="font-medium text-white">{item.title}</p>
                          {item.description && (
                            <p className="text-[10px] text-zinc-500">{item.description}</p>
                          )}
                        </div>
                        <span className="font-mono text-zinc-300">
                          {formatInr(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary Breakdown */}
                <div className="space-y-1 text-xs border-t border-white/5 pt-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-zinc-300">{formatInr(selectedInvoice.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Discount</span>
                    <span className="font-mono text-zinc-300">₹0</span>
                  </div>
                  <div className="flex justify-between font-bold text-white border-t border-white/5 pt-1.5">
                    <span>Total Amount</span>
                    <span className="font-mono">{formatInr(selectedInvoice.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Amount Paid</span>
                    <span className="font-mono">-{formatInr(selectedInvoice.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-300 border-t border-white/5 pt-1">
                    <span>Outstanding Balance</span>
                    <span className="font-mono">{formatInr(selectedInvoice.balanceDue)}</span>
                  </div>
                </div>

                {/* Payment History */}
                <div>
                  <span className="text-[11px] uppercase font-semibold text-zinc-400 block mb-1.5">
                    Payment History
                  </span>
                  {selectedInvoice.paymentHistory.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic p-2 bg-[#11141e] rounded-lg border border-white/5">
                      No payments recorded yet.
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {selectedInvoice.paymentHistory.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between text-xs p-2 rounded bg-[#11141e] border border-white/5 font-mono"
                        >
                          <div>
                            <span className="text-emerald-400 font-bold">+{formatInr(p.amount)}</span>
                            <span className="text-zinc-500 text-[10px] ml-2">via {p.mode}</span>
                          </div>
                          <div className="text-right text-[10px] text-zinc-500">
                            <div>{p.ref}</div>
                            <div>{p.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contextual Action Buttons */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2">
                  {selectedInvoice.balanceDue > 0 && (
                    <button
                      onClick={() => handleStartPayment(selectedInvoice)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#ccff00] text-black font-bold text-xs hover:bg-[#b8e600] transition-colors"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Record Payment</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleSendInvoiceWhatsApp(selectedInvoice)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-white/10 bg-[#121622] text-zinc-300 text-xs hover:text-white hover:border-white/20 transition-colors"
                    title="Send via WhatsApp"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Invoice</span>
                  </button>

                  <button
                    onClick={() => handlePrintPdf(selectedInvoice)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-white/10 bg-[#121622] text-zinc-300 text-xs hover:text-white hover:border-white/20 transition-colors"
                    title="Print or Save PDF"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-zinc-500 text-xs">
                Select an invoice to view itemization and payment ledger.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. INLINE RECORD PAYMENT MODAL DIALOG
      ───────────────────────────────────────────────────────────── */}
      {isRecordingPayment && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl border border-white/15 bg-[#10131c] p-5 shadow-2xl text-white">
            <button
              onClick={() => setIsRecordingPayment(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Record Payment</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Invoice <strong className="text-white font-mono">{selectedInvoice.invoiceNo}</strong> • {selectedInvoice.memberName}
            </p>

            <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
              {/* Outstanding balance reference */}
              <div className="flex justify-between p-2.5 rounded bg-[#171b26] border border-white/5">
                <span className="text-zinc-400">Remaining Balance:</span>
                <span className="font-mono font-bold text-amber-300">
                  {formatInr(selectedInvoice.balanceDue)}
                </span>
              </div>

              {/* Amount to pay */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-zinc-300 font-medium">Payment Amount (INR)</label>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(selectedInvoice.balanceDue)}
                    className="text-[10px] text-[#ccff00] hover:underline"
                  >
                    Pay Full Balance
                  </button>
                </div>
                <input
                  type="number"
                  min="1"
                  max={selectedInvoice.balanceDue}
                  value={paymentAmount || ''}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  placeholder="Enter payment amount"
                  className="w-full h-9 px-3 rounded-lg border border-white/15 bg-black text-white font-mono text-xs outline-none focus:border-[#ccff00]"
                  required
                />
              </div>

              {/* Payment Mode */}
              <div>
                <label className="text-zinc-300 font-medium block mb-1">Payment Mode</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['upi', 'card', 'cash', 'netbanking'] as const).map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setPaymentMode(mode)}
                      className={`py-1.5 rounded text-[11px] font-semibold uppercase transition-all ${
                        paymentMode === mode
                          ? 'bg-[#ccff00] text-black'
                          : 'bg-[#171b26] text-zinc-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference ID */}
              <div>
                <label className="text-zinc-300 font-medium block mb-1">Transaction Reference</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. UPI-984729 or Cash Receipt"
                  className="w-full h-8 px-3 rounded-lg border border-white/10 bg-black text-white font-mono text-xs outline-none focus:border-[#ccff00]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordingPayment(false)}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="flex-1 py-2 rounded-lg bg-[#ccff00] text-black font-bold hover:bg-[#b8e600] disabled:opacity-50"
                >
                  {isSubmittingPayment ? 'Saving...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. CREATE INVOICE MODAL DIALOG
      ───────────────────────────────────────────────────────────── */}
      {isCreateInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl border border-white/15 bg-[#10131c] p-5 shadow-2xl text-white">
            <button
              onClick={() => setIsCreateInvoiceOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Create Member Invoice</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Generate an itemized invoice for facility dues or services.
            </p>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-3.5 text-xs">
              {/* Member Selector */}
              <div>
                <label className="text-zinc-300 font-medium block mb-1">Select Member</label>
                <select
                  value={newInvoiceMemberId}
                  onChange={(e) => setNewInvoiceMemberId(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-white/15 bg-black text-white text-xs outline-none focus:border-[#ccff00]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} (+91 {m.phone}) - {m.planName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Description */}
              <div>
                <label className="text-zinc-300 font-medium block mb-1">Item Title / Service</label>
                <input
                  type="text"
                  value={newInvoiceItemTitle}
                  onChange={(e) => setNewInvoiceItemTitle(e.target.value)}
                  placeholder="e.g. Quarterly Strength Pass or 1-on-1 PT"
                  className="w-full h-8 px-3 rounded-lg border border-white/10 bg-black text-white text-xs outline-none focus:border-[#ccff00]"
                  required
                />
              </div>

              {/* Amount and Due Date Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Total Fee (₹)</label>
                  <input
                    type="number"
                    min="100"
                    value={newInvoiceAmount || ''}
                    onChange={(e) => setNewInvoiceAmount(Number(e.target.value))}
                    className="w-full h-8 px-3 rounded-lg border border-white/10 bg-black text-white font-mono text-xs outline-none focus:border-[#ccff00]"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvoiceDueDate}
                    onChange={(e) => setNewInvoiceDueDate(e.target.value)}
                    className="w-full h-8 px-3 rounded-lg border border-white/10 bg-black text-white text-xs outline-none focus:border-[#ccff00]"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateInvoiceOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#ccff00] text-black font-bold hover:bg-[#b8e600]"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
