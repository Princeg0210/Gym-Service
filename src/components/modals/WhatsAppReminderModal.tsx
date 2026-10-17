'use client';

import React, { useState } from 'react';
import { Member } from '@/types';
import { X, Send, Copy, Check, MessageSquare } from 'lucide-react';
import { generateWhatsAppDuesReminder, getWhatsAppWebLink } from '@/lib/whatsapp';
import { sounds } from '@/lib/audio';

interface WhatsAppReminderModalProps {
  member: Member;
  onClose: () => void;
}

export function WhatsAppReminderModal({ member, onClose }: WhatsAppReminderModalProps) {
  const [copied, setCopied] = useState(false);
  const message = generateWhatsAppDuesReminder(member);
  const webLink = getWhatsAppWebLink(member.phone, message);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    sounds.playSuccess();
    window.open(webLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 apple-glass-card p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f2637] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Send WhatsApp Fee Reminder</h3>
              <p className="text-xs text-zinc-400">
                To: {member.fullName} (+91 {member.phone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#161c2b] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message Preview */}
        <div className="my-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Message Preview with UPI Deep-Link:</span>
            <span className="font-mono text-red-400 font-bold">
              Due: ₹{member.pendingDueInr.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="rounded-2xl border border-[#222738] bg-[#080b11] p-4 text-xs font-mono leading-relaxed text-zinc-200 whitespace-pre-line select-all">
            {message}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end border-t border-[#1f2637] pt-4">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#2b354c] bg-[#121724] px-4 py-2.5 text-xs font-bold text-zinc-200 hover:bg-[#1a2133] transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Message Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-black text-black hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-950/40"
          >
            <Send className="h-4 w-4" />
            <span>Open in WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
