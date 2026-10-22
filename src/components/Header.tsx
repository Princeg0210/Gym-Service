'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { GymProfile } from '@/types';
import { GymProMark } from './GymProLogo';

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

  const handleTrialClick = (e: React.MouseEvent) => {
    if (onBookFreeTrial) {
      e.preventDefault();
      onBookFreeTrial();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0a0a0c]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo: Minimalist GymPRO Mark */}
        <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
          <GymProMark
            className="h-6 w-6 text-white group-hover:scale-105 transition-transform"
            color={primaryColor}
          />
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

        {/* Right Action: Clean Free Trial Inquiry */}
        <div className="flex items-center gap-3">
          <a
            href={onBookFreeTrial ? '#free-trial' : '#facilities'}
            onClick={handleTrialClick}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            <span>Free Trial</span>
            <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden h-8 w-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-white/10 bg-[#0a0a0c] px-5 py-4 space-y-3 shadow-2xl">
          <div className="flex flex-col gap-2">
            <a
              href="#facilities"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full h-10 inline-flex items-center justify-center rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Facilities & Equipment
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full h-10 inline-flex items-center justify-center rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Location & Hours
            </a>
            <a
              href={onBookFreeTrial ? '#free-trial' : '#facilities'}
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleTrialClick(e);
              }}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-black shadow-md transition-all active:scale-95"
              style={{ backgroundColor: primaryColor }}
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
