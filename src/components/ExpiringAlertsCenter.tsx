'use client';

import React, { useState, useMemo } from 'react';
import {
  BellRing,
  Send,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  RefreshCw,
  Search,
  ExternalLink,
  Sparkles,
  X
} from 'lucide-react';
import { Member } from '@/types';
import { buildExpiringAlerts } from '@/lib/whatsapp';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface ExpiringAlertsCenterProps {
  members: Member[];
  onRefreshData?: () => void;
}

export function ExpiringAlertsCenter({ members, onRefreshData }: ExpiringAlertsCenterProps) {
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'today' | 'urgent' | 'upcoming' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sentMemberIds, setSentMemberIds] = useState<Record<string, string>>({});
  const [previewAlert, setPreviewAlert] = useState<{
    member: Member;
    messageText: string;
    whatsappUrl: string;
  } | null>(null);

  // Compute live alerts from active members list
  const allAlerts = useMemo(() => {
    return buildExpiringAlerts(members);
  }, [members]);

  const counts = useMemo(() => {
    return {
      all: allAlerts.length,
      today: allAlerts.filter((a) => a.urgency === 'today').length,
      urgent: allAlerts.filter((a) => a.urgency === 'urgent').length,
      upcoming: allAlerts.filter((a) => a.urgency === 'upcoming').length,
      expired: allAlerts.filter((a) => a.urgency === 'expired').length
    };
  }, [allAlerts]);

  const filteredAlerts = useMemo(() => {
    return allAlerts.filter((alert) => {
      if (filterUrgency !== 'all' && alert.urgency !== filterUrgency) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          alert.member.fullName.toLowerCase().includes(query) ||
          alert.member.phone.includes(query) ||
          alert.member.planName.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [allAlerts, filterUrgency, searchQuery]);

  const handleSendWhatsApp = (memberId: string, whatsappUrl: string) => {
    setSentMemberIds((prev) => ({
      ...prev,
      [memberId]: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const openPreview = (alert: (typeof allAlerts)[0]) => {
    const rawUrl = alert.whatsappUrl;
    const textParam = new URL(rawUrl).searchParams.get('text') || '';
    setPreviewAlert({
      member: alert.member,
      messageText: textParam,
      whatsappUrl: alert.whatsappUrl
    });
  };

  const getUrgencyBadge = (urgency: string, daysRemaining: number) => {
    switch (urgency) {
      case 'today':
        return (
          <Badge variant="destructive" className="flex items-center gap-1 font-bold">
            <AlertTriangle className="h-3 w-3" />
            Expires Today
          </Badge>
        );
      case 'urgent':
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
            <Clock className="h-3 w-3" />
            {daysRemaining} Day{daysRemaining > 1 ? 's' : ''} Left
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge className="bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 flex items-center gap-1 font-bold">
            <Calendar className="h-3 w-3" />
            In {daysRemaining} Days
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="secondary" className="text-zinc-400 border border-[#232b3d] flex items-center gap-1 font-bold">
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b2333] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25d366]/10 text-[#25d366] border border-[#25d366]/30">
              <MessageSquare className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-black text-white">Automated WhatsApp Renewal Bot</h2>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Detects expiring memberships & pending dues. Sends personalized 1-tap WhatsApp renewal alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRefreshData && (
            <Button variant="outline" size="sm" onClick={onRefreshData} className="gap-1.5 text-xs text-zinc-300">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </Button>
          )}
          <Badge variant="outline" className="text-xs font-mono border-emerald-500/30 text-emerald-400 bg-emerald-950/30 px-2.5 py-1">
            WhatsApp Web Ready
          </Badge>
        </div>
      </div>

      {/* Urgency Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterUrgency('today')}
          className={`text-left rounded-xl p-3.5 border transition-all ${
            filterUrgency === 'today'
              ? 'border-red-500/50 bg-red-950/30 ring-1 ring-red-500/30'
              : 'border-[#202738] bg-[#0c1017] hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400">Expiring Today</span>
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-red-400 font-mono">{counts.today}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Critical renewal</p>
        </button>

        <button
          onClick={() => setFilterUrgency('urgent')}
          className={`text-left rounded-xl p-3.5 border transition-all ${
            filterUrgency === 'urgent'
              ? 'border-amber-500/50 bg-amber-950/30 ring-1 ring-amber-500/30'
              : 'border-[#202738] bg-[#0c1017] hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Next 1-3 Days</span>
            <Clock className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-400 font-mono">{counts.urgent}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Urgent reminder</p>
        </button>

        <button
          onClick={() => setFilterUrgency('upcoming')}
          className={`text-left rounded-xl p-3.5 border transition-all ${
            filterUrgency === 'upcoming'
              ? 'border-[#ccff00]/50 bg-[#ccff00]/10 ring-1 ring-[#ccff00]/30'
              : 'border-[#202738] bg-[#0c1017] hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Next 4-7 Days</span>
            <Calendar className="h-3.5 w-3.5 text-[#ccff00]" />
          </div>
          <p className="mt-2 text-2xl font-black text-[#ccff00] font-mono">{counts.upcoming}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Friendly notice</p>
        </button>

        <button
          onClick={() => setFilterUrgency('expired')}
          className={`text-left rounded-xl p-3.5 border transition-all ${
            filterUrgency === 'expired'
              ? 'border-zinc-500/50 bg-zinc-900/60 ring-1 ring-zinc-500/30'
              : 'border-[#202738] bg-[#0c1017] hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Expired / Dues</span>
            <BellRing className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-zinc-300 font-mono">{counts.expired}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Comeback offer</p>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0c1017] p-2.5 rounded-xl border border-[#202738]">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'today', 'urgent', 'upcoming', 'expired'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterUrgency(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filterUrgency === tab
                  ? 'bg-[#1b2333] text-white shadow-sm border border-[#2e3b56]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab === 'all' ? `All Alerts (${counts.all})` : `${tab} (${counts[tab]})`}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member, phone..."
            className="h-9 pl-9 text-xs bg-[#121724] border-[#232b3d]"
          />
        </div>
      </div>

      {/* Alert Cards List */}
      {filteredAlerts.length === 0 ? (
        <div className="rounded-2xl border border-[#202738] bg-[#0c1017] p-10 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400/80 mb-3" />
          <h3 className="text-base font-bold text-white">All Clear! No Pending Expiries</h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
            {filterUrgency === 'all'
              ? 'No active members are due for expiry in the next 7 days. Your membership retention is looking solid!'
              : `No members found matching the "${filterUrgency}" filter.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isSent = Boolean(sentMemberIds[alert.member.id]);
            const sentTime = sentMemberIds[alert.member.id];

            return (
              <div
                key={alert.member.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-[#202738] bg-[#0c1017] p-4 hover:border-[#2d374f] transition-all"
              >
                {/* Member Info */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#121724] border border-[#232b3d] text-sm font-black text-white">
                    {alert.member.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{alert.member.fullName}</h4>
                      {getUrgencyBadge(alert.urgency, alert.daysRemaining)}
                      {isSent && (
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-950/40 text-xs py-0">
                          Sent today ({sentTime})
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                      <span>Phone: <span className="font-mono text-zinc-300">{alert.member.phone}</span></span>
                      <span>•</span>
                      <span>Plan: <span className="text-zinc-200 font-medium">{alert.member.planName}</span></span>
                      <span>•</span>
                      <span>End Date: <span className="text-zinc-300 font-mono">{alert.member.endDate}</span></span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
                  {alert.member.pendingDueInr > 0 && (
                    <div className="text-right mr-2 hidden sm:block">
                      <p className="text-xs text-zinc-400 uppercase font-semibold">Pending Due</p>
                      <p className="text-xs font-mono font-bold text-red-400">
                        ₹{alert.member.pendingDueInr.toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPreview(alert)}
                    className="h-8 text-xs text-zinc-300 border-[#232b3d] hover:bg-[#121724]"
                  >
                    Preview
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleSendWhatsApp(alert.member.id, alert.whatsappUrl)}
                    className="h-8 bg-[#25d366] text-black font-bold hover:bg-[#20b858] gap-1.5 shadow-sm"
                  >
                    <Send className="h-3 w-3" />
                    <span>Send WhatsApp</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Preview Modal */}
      {previewAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#232b3d] bg-[#0c1017] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1b2333] pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#ccff00]" />
                  WhatsApp Renewal Message Preview
                </h3>
                <p className="text-xs text-zinc-400">
                  Recipient: <span className="text-white font-semibold">{previewAlert.member.fullName}</span> ({previewAlert.member.phone})
                </p>
              </div>
              <button
                onClick={() => setPreviewAlert(null)}
                className="rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-[#1a2130]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Formatted Message Payload:
              </label>
              <textarea
                value={previewAlert.messageText}
                onChange={(e) =>
                  setPreviewAlert((prev) =>
                    prev
                      ? {
                          ...prev,
                          messageText: e.target.value,
                          whatsappUrl: `https://wa.me/91${prev.member.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(e.target.value)}`
                        }
                      : null
                  )
                }
                rows={9}
                className="w-full rounded-xl border border-[#232b3d] bg-[#121724] p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Tip: You can customize the discount or UPI VPA before hitting Send.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#1b2333] pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewAlert(null)}
                className="text-xs text-zinc-300"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleSendWhatsApp(previewAlert.member.id, previewAlert.whatsappUrl);
                  setPreviewAlert(null);
                }}
                className="bg-[#25d366] text-black font-bold hover:bg-[#20b858] gap-1.5"
              >
                <Send className="h-3 w-3" />
                <span>Launch in WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
