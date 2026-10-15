import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dumbbell, RefreshCw, Clock, ShieldCheck, UserCheck } from 'lucide-react';

interface HeaderProps {
  currentMode?: 'showcase' | 'operations' | 'member_portal';
  onModeChange?: (mode: 'showcase' | 'operations' | 'member_portal') => void;
  onResetData: () => void;
}

export function Header({ currentMode = 'showcase', onModeChange, onResetData }: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1e2330] bg-[#07090d]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Branch */}
        <Link
          href="/"
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccff00] text-black shadow-md transition-transform group-hover:scale-105">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-white text-lg">
                Gym<span className="text-[#ccff00]">PRO</span>
              </span>
              <span className="rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[#ccff00]">
                INDIA
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium leading-none">
              Commercial & Neighborhood Athlete SaaS
            </p>
          </div>
        </Link>

        {/* Quick Check-in hotkey cue & Live Clock */}
        <div className="hidden lg:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 rounded-full border border-[#262c3d] bg-[#10131a] px-3 py-1 text-zinc-300">
            <span className="text-zinc-400">Quick Check-in:</span>
            <kbd className="rounded border border-[#373f55] bg-[#1a1f2c] px-1.5 py-0.5 font-mono text-xs font-bold text-[#ccff00]">
              /
            </kbd>
          </div>
          <div className="flex items-center gap-1 text-zinc-400 tabular-nums font-mono text-xs">
            <Clock className="h-3.5 w-3.5 text-[#ccff00]" />
            <span>{timeStr || 'Loading...'} IST</span>
          </div>
        </div>

        {/* Dedicated Portals Links & Reset */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-xl border border-[#ccff00]/40 bg-[#ccff00]/10 px-3.5 py-2 text-xs font-bold text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-all shadow-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Admin Portal</span>
            <span className="sm:hidden">Admin</span>
          </Link>

          <Link
            href="/member"
            className="flex items-center gap-1.5 rounded-xl border border-[#232b3d] bg-[#121724] px-3.5 py-2 text-xs font-bold text-zinc-200 hover:border-zinc-500 hover:text-white transition-all shadow-sm"
          >
            <UserCheck className="h-3.5 w-3.5 text-[#ccff00]" />
            <span className="hidden sm:inline">Member Portal</span>
            <span className="sm:hidden">Member</span>
          </Link>

          <button
            onClick={onResetData}
            title="Reset Mock Seed Data"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#222738] bg-[#0e1219] text-zinc-400 hover:border-[#ccff00]/40 hover:text-[#ccff00] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
