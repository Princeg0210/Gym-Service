'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Menu,
  X,
  LayoutDashboard,
  Dumbbell,
  ArrowUpRight
} from 'lucide-react';
import { GymProfile } from '@/types';

interface HeaderProps {
  currentMode?: 'showcase' | 'operations' | 'member_portal';
  onModeChange?: (mode: 'showcase' | 'operations' | 'member_portal') => void;
  onResetData?: () => void;
  gymProfile?: GymProfile;
  onBookFreeTrial?: () => void;
}

export function Header({ gymProfile, onBookFreeTrial }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const primaryColor = gymProfile?.primaryColor || '#ccff00';
  const gymName = gymProfile?.gymName || 'Alpha Fitness Gym';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0a0a0c]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo: GymPRO with Sleek Neon Accents */}
        <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-black font-black transition-transform group-hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            <Dumbbell className="h-4.5 w-4.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight text-white">
              Gym<span style={{ color: primaryColor }}>PRO</span>
            </span>
            <span className="text-zinc-600 font-light mx-1 hidden sm:inline">/</span>
            <span className="text-xs font-semibold text-zinc-400 hidden sm:inline max-w-[150px] md:max-w-[200px] truncate">
              {gymName}
            </span>
          </div>
        </Link>

        {/* Right Utilities: Member Portal, Admin Console, and Free Trial CTA */}
        <div className="flex items-center gap-2 sm:gap-3 text-zinc-300">
          {/* Member Portal Link */}
          <Link
            href="/member"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 px-3.5 py-1.5 text-xs font-bold text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-all"
            title="Athlete Member Portal"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Member Portal</span>
            <span className="sm:hidden">Portal</span>
          </Link>

          {/* Admin Operations Console Link */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:border-white/20 transition-all"
            title="Admin Operations Console"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Admin Desk</span>
          </Link>

          {/* Primary CTA: Free Trial Inquiry */}
          {onBookFreeTrial ? (
            <button
              onClick={onBookFreeTrial}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Free Trial</span>
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          ) : (
            <a
              href="#pricing"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Free Trial</span>
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </a>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden h-8 w-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0c] px-5 py-4 space-y-3 shadow-2xl">
          <div className="flex flex-col gap-2">
            <Link
              href="/member"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-black shadow-md transition-all active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              <Dumbbell className="h-4 w-4" />
              <span>Athlete Member Portal</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-zinc-200 border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin Operations Desk</span>
            </Link>

            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-black shadow-md transition-all active:scale-95 bg-[#ccff00]"
            >
              <span>Book Free Trial</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
