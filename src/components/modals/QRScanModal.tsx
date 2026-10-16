'use client';

import React, { useState, useEffect } from 'react';
import { Member } from '@/types';
import { QrCode, X, CheckCircle2, Video, Check } from 'lucide-react';
import { sounds } from '@/lib/audio';

interface QRScanModalProps {
  members: Member[];
  onClose: () => void;
  onCheckIn: (member: Member, method: 'qr_scan') => void;
}

export function QRScanModal({ members, onClose, onCheckIn }: QRScanModalProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedMember, setScannedMember] = useState<Member | null>(null);
  const [selectedSimMemberId, setSelectedSimMemberId] = useState<string>('');

  useEffect(() => {
    // Front-desk scanner demo simulation
    const timer = setTimeout(() => {
      let target: Member;
      if (selectedSimMemberId) {
        target = members.find((m) => m.id === selectedSimMemberId) || members[0];
      } else {
        const activeMembers = members.filter((m) => m.status === 'active');
        target = activeMembers.length > 0
          ? activeMembers[Math.floor(Math.random() * activeMembers.length)]
          : members[0];
      }

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
  }, [members, onCheckIn, selectedSimMemberId]);

  const handleRescan = () => {
    setScannedMember(null);
    setIsScanning(true);
  };

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
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Scan Member QR Pass</h3>
                <span className="rounded-md border border-[#232b3d] bg-[#121724] px-1.5 py-0.5 text-xs font-mono text-zinc-400">
                  Demo Feed
                </span>
              </div>
              <p className="text-xs text-zinc-400">Optical Camera & Barcode Reader</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#161c2b] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Demo Simulation Notice Banner */}
        <div className="mt-4 rounded-xl border border-[#232b3d] bg-[#07090d] p-2.5 text-xs text-zinc-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5 text-[#ccff00]" />
            <span className="text-xs">Hardware Camera / Simulation Feed</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            READY
          </span>
        </div>

        {/* Scanner Viewport */}
        <div className="my-5">
          <div className="relative mx-auto flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#ccff00]/40 bg-[#07090e]">
            {isScanning ? (
              <>
                {/* Laser scan indicator bar */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#ccff00] to-transparent animate-pulse" />
                <div className="flex flex-col items-center gap-3 text-center p-4">
                  <div className="relative">
                    <QrCode className="h-24 w-24 text-zinc-600 animate-pulse" />
                    <div className="absolute inset-0 rounded-lg border-2 border-[#ccff00] opacity-30" />
                  </div>
                  <p className="text-xs font-bold text-zinc-300">
                    Position GymPRO QR pass in viewfinder...
                  </p>
                  <span className="rounded-full bg-[#161d2c] px-3 py-1 text-xs font-mono text-zinc-400">
                    Scanner Live • 60 FPS
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

        {/* Choose Target Member to Simulate Check-in */}
        {isScanning && (
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              Simulate Scan For Member:
            </label>
            <select
              value={selectedSimMemberId}
              onChange={(e) => setSelectedSimMemberId(e.target.value)}
              className="w-full rounded-xl border border-[#232b3d] bg-[#121724] px-3 py-1.5 text-xs text-zinc-200 focus:border-[#ccff00] focus:outline-hidden"
            >
              <option value="">Auto-Detect Active Member (Default)</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.status.toUpperCase()} • ₹{m.pendingDueInr} due)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Message & Actions */}
        <div className="border-t border-[#1f2637] pt-4">
          {isScanning ? (
            <p className="text-center text-xs text-zinc-500">
              Hold device steady or select member above for turnstile simulation.
            </p>
          ) : (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Check className="h-4 w-4" />
                <span>Attendance Logged</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRescan}
                  className="rounded-xl border border-[#232b3d] bg-[#121724] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  Scan Another
                </button>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-[#ccff00] px-4 py-1.5 text-xs font-black text-black hover:bg-[#b5e600] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
