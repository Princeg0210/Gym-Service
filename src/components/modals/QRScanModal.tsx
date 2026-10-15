'use client';

import React, { useState, useEffect } from 'react';
import { Member } from '@/types';
import { QrCode, X, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { sounds } from '@/lib/audio';

interface QRScanModalProps {
  members: Member[];
  onClose: () => void;
  onCheckIn: (member: Member, method: 'qr_scan') => void;
}

export function QRScanModal({ members, onClose, onCheckIn }: QRScanModalProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedMember, setScannedMember] = useState<Member | null>(null);

  useEffect(() => {
    // Simulate camera scanning delay then auto-detect member QR pass
    const timer = setTimeout(() => {
      const activeMembers = members.filter((m) => m.status === 'active');
      const target = activeMembers.length > 0
        ? activeMembers[Math.floor(Math.random() * activeMembers.length)]
        : members[0];

      setScannedMember(target);
      setIsScanning(false);
      onCheckIn(target, 'qr_scan');

      if (target.pendingDueInr > 0) {
        sounds.playWarning();
      } else {
        sounds.playSuccess();
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [members, onCheckIn]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#222738] bg-[#0c1017] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f2637] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ccff00]/10 text-[#ccff00]">
              <QrCode className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Scan Member QR Pass</h3>
              <p className="text-xs text-zinc-400">Front Desk Optical Scanner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#161c2b] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scanner Viewport */}
        <div className="my-6">
          <div className="relative mx-auto flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#ccff00]/40 bg-[#07090e]">
            {isScanning ? (
              <>
                {/* Laser animation bar */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#ccff00] to-transparent shadow-[0_0_15px_#ccff00] animate-bounce" />
                <div className="flex flex-col items-center gap-3 text-center p-4">
                  <div className="relative">
                    <QrCode className="h-24 w-24 text-zinc-600 animate-pulse" />
                    <div className="absolute inset-0 rounded-lg border-2 border-[#ccff00] opacity-30" />
                  </div>
                  <p className="text-xs font-bold text-zinc-300">
                    Position GymPRO QR pass in viewfinder...
                  </p>
                  <span className="rounded-full bg-[#161d2c] px-3 py-1 text-xs font-mono text-zinc-400">
                    Optical Feed Active • 60 FPS
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 p-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{scannedMember?.fullName}</h4>
                  <p className="text-xs font-mono text-[#ccff00]">
                    Pass #{scannedMember?.id.toUpperCase()}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {scannedMember?.planName} • Valid till {scannedMember?.endDate}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Message & Actions */}
        <div className="border-t border-[#1f2637] pt-4">
          {isScanning ? (
            <p className="text-center text-xs text-zinc-500">
              Hold device steady or type phone number manually in search.
            </p>
          ) : (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Attendance Logged Successfully</span>
              </span>
              <button
                onClick={onClose}
                className="rounded-xl bg-[#ccff00] px-4 py-2 text-xs font-black text-black hover:bg-[#b5e600] transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
