'use client';

import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Printer,
  AlertCircle,
  CreditCard,
  Calendar,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { Member, PaymentRecord } from '@/types';
import { computeFinancialAnalytics, generateMembersAccountingCsv } from '@/lib/analytics';
import { Button } from '@/components/ui/button';

interface BusinessIntelligenceReportsProps {
  members: Member[];
  payments: PaymentRecord[];
}

export function BusinessIntelligenceReports({ members, payments }: BusinessIntelligenceReportsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const analytics = useMemo(() => {
    return computeFinancialAnalytics(members, payments);
  }, [members, payments]);

  const handleDownloadCsv = () => {
    setIsExporting(true);
    try {
      const csvData = generateMembersAccountingCsv(members);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.setAttribute('download', `GymPRO-Financial-Ledger-${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintStatement = () => {
    window.print();
  };

  const paymentTotal =
    analytics.paymentMethods.cash +
    analytics.paymentMethods.upi +
    analytics.paymentMethods.card +
    analytics.paymentMethods.other || 1;

  const upiPercent = Math.round((analytics.paymentMethods.upi / paymentTotal) * 100);
  const cashPercent = Math.round((analytics.paymentMethods.cash / paymentTotal) * 100);
  const cardPercent = Math.round((analytics.paymentMethods.card / paymentTotal) * 100);

  return (
    <div className="space-y-6">
      {/* Header & 1-Click Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b2333] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-black text-white">Business Intelligence & Financial Reports</h2>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Real-time MRR, projected renewals, churn analytics, and accounting ledger exports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintStatement}
            className="gap-1.5 text-xs text-zinc-300 border-[#232b3d] hover:bg-[#121724]"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print Statement</span>
          </Button>

          <Button
            size="sm"
            onClick={handleDownloadCsv}
            disabled={isExporting}
            className="bg-[#ccff00] text-black font-bold hover:bg-[#b8e600] gap-1.5 shadow-[0_2px_10px_rgba(204,255,0,0.2)]"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export to Excel (CSV)</span>
          </Button>
        </div>
      </div>

      {/* Top 4 Real-time Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR Card */}
        <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Monthly Run-Rate (MRR)</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-3xl font-black font-mono text-emerald-400">
            ₹{analytics.monthlyRunRateInr.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            Annualized: ~₹{(analytics.monthlyRunRateInr * 12).toLocaleString('en-IN')}
          </p>
        </div>

        {/* Projected Renewals */}
        <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Projected Renewals (30D)</span>
            <Calendar className="h-4 w-4 text-[#ccff00]" />
          </div>
          <p className="mt-2 text-3xl font-black font-mono text-[#ccff00]">
            ₹{analytics.projectedRenewalInr.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            Pipeline from expiring cohorts
          </p>
        </div>

        {/* Retention vs Churn */}
        <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Active Retention Rate</span>
            <ShieldCheck className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 text-3xl font-black font-mono text-white">
            {analytics.retentionRate}%
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
            <span>{analytics.activeMembers} Active</span>
            <span className="text-red-400">{analytics.churnRate}% Churn</span>
          </div>
        </div>

        {/* Dues Recovery */}
        <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Outstanding Dues</span>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </div>
          <p className="mt-2 text-3xl font-black font-mono text-red-400">
            ₹{analytics.totalPendingDuesInr.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            Recovery Rate: <span className="text-emerald-400 font-semibold">{analytics.duesRecoveryRate}%</span>
          </p>
        </div>
      </div>

      {/* Financial Split & Accounting Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Channels (UPI / Cash / Card) */}
        <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1b2333] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Payment Method Distribution</h3>
              <p className="text-xs text-zinc-400">Real collections from completed transactions</p>
            </div>
            <CreditCard className="h-4 w-4 text-[#ccff00]" />
          </div>

          <div className="space-y-3 pt-1">
            {/* UPI */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-300">UPI (GPay / PhonePe / Paytm)</span>
                <span className="font-mono text-[#ccff00]">
                  ₹{analytics.paymentMethods.upi.toLocaleString('en-IN')} ({upiPercent}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#1b2333] overflow-hidden">
                <div
                  className="h-full bg-[#ccff00] transition-all duration-500"
                  style={{ width: `${upiPercent}%` }}
                />
              </div>
            </div>

            {/* Cash */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-300">Cash Desk Receipts</span>
                <span className="font-mono text-emerald-400">
                  ₹{analytics.paymentMethods.cash.toLocaleString('en-IN')} ({cashPercent}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#1b2333] overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${cashPercent}%` }}
                />
              </div>
            </div>

            {/* Card */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-300">Debit / Credit Card POS</span>
                <span className="font-mono text-blue-400">
                  ₹{analytics.paymentMethods.card.toLocaleString('en-IN')} ({cardPercent}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#1b2333] overflow-hidden">
                <div
                  className="h-full bg-blue-400 transition-all duration-500"
                  style={{ width: `${cardPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#1e273a] bg-[#121724]/60 p-3 text-xs text-zinc-400 flex items-center justify-between">
            <span>Total Verified Collections:</span>
            <span className="font-mono font-bold text-white text-sm">
              ₹{analytics.totalRevenueInr.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* GST & Tax Audit Summary */}
        <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1b2333] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Tax & Accounting Ledger (18% GST Model)</h3>
              <p className="text-xs text-zinc-400">Indian fitness club compliance split</p>
            </div>
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
          </div>

          {(() => {
            const baseAmount = Math.round(analytics.totalRevenueInr / 1.18);
            const gstAmount = analytics.totalRevenueInr - baseAmount;
            const cgst = Math.round(gstAmount / 2);
            const sgst = gstAmount - cgst;

            return (
              <div className="space-y-3 pt-1 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-[#1b2333]">
                  <span className="text-zinc-400">Net Taxable Services Turnover:</span>
                  <span className="font-mono text-white font-bold">₹{baseAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#1b2333]">
                  <span className="text-zinc-400">CGST @ 9%:</span>
                  <span className="font-mono text-zinc-300">₹{cgst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#1b2333]">
                  <span className="text-zinc-400">SGST @ 9%:</span>
                  <span className="font-mono text-zinc-300">₹{sgst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center py-2 bg-[#121724] px-3 rounded-xl border border-[#232b3d]">
                  <span className="font-bold text-zinc-200">Gross Billed Receipts:</span>
                  <span className="font-mono font-black text-[#ccff00] text-sm">
                    ₹{analytics.totalRevenueInr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })()}

          <div className="pt-2 flex items-center justify-between text-xs text-zinc-400">
            <span>Registered Members Audited: <strong className="text-white">{analytics.totalMembers}</strong></span>
            <Button
              variant="link"
              onClick={handleDownloadCsv}
              className="text-xs text-[#ccff00] p-0 h-auto font-bold"
            >
              Download Detailed Ledger CSV →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
