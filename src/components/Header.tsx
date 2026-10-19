'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Dumbbell,
  ChevronDown,
  ArrowUpRight,
  Menu,
  X,
  MapPin
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GymProfile } from '@/types';
import { INITIAL_GYM_PROFILES } from '@/lib/mockGyms';

interface HeaderProps {
  currentMode?: 'showcase' | 'operations' | 'member_portal';
  onModeChange?: (mode: 'showcase' | 'operations' | 'member_portal') => void;
  onResetData?: () => void;
  gymProfile?: GymProfile;
  onBookFreeTrial?: () => void;
}

export function Header({ gymProfile, onBookFreeTrial }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const primaryColor = gymProfile?.primaryColor || '#ccff00';

  const navLinks = [
    { label: 'Facilities', href: '#facilities' },
    { label: 'Programs', href: '#programs' },
    { label: 'Coaches', href: '#trainers' },
    { label: 'Transformations', href: '#results' },
    { label: 'Memberships', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#07090d]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 gap-4">
        
        {/* Brand & Branch Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={gymProfile ? `/gym/${gymProfile.slug}` : '/'}
            className="flex items-center gap-2.5 text-left group focus:outline-none apple-press"
          >
            {gymProfile?.logoUrl ? (
              <img
                src={gymProfile.logoUrl}
                alt={gymProfile.gymName}
                className="h-9 w-9 rounded-xl object-contain bg-white/5 p-1"
              />
            ) : (
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-black shadow-sm transition-transform group-hover:scale-105 active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                <Dumbbell className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-white text-base sm:text-lg whitespace-nowrap">
                  {gymProfile ? (
                    gymProfile.gymName
                  ) : (
                    <>
                      Gym<span style={{ color: primaryColor }}>PRO</span>
                    </>
                  )}
                </span>
                <Badge variant="default" className="hidden sm:inline-flex text-[10px] font-semibold py-0.5 px-2 bg-white/10 text-zinc-300 border-none">
                  {gymProfile ? gymProfile.city.toUpperCase() : 'INDIA'}
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium leading-none hidden md:block truncate max-w-[240px]">
                {gymProfile ? gymProfile.tagline : 'Strength, Free Weights & Real Results'}
              </p>
            </div>
          </Link>

          {/* Branch Switcher Dropdown */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <MapPin className="h-3.5 w-3.5" style={{ color: primaryColor }} />
              <span className="max-w-[120px] truncate">
                {gymProfile?.city || 'HSR Layout'}
              </span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {isBranchDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0e121a] p-2 shadow-2xl z-50">
                <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  Select Gym Branch
                </div>
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setIsBranchDropdownOpen(false)}
                    className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold text-zinc-200 hover:bg-white/10 transition-colors"
                  >
                    <span>IronPulse HSR (Flagship)</span>
                    <span className="text-[10px] font-mono text-zinc-400">BLR</span>
                  </Link>
                  {INITIAL_GYM_PROFILES.map((gym) => (
                    <Link
                      key={gym.id}
                      href={`/gym/${gym.slug}`}
                      onClick={() => setIsBranchDropdownOpen(false)}
                      className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold text-zinc-200 hover:bg-white/10 transition-colors"
                    >
                      <span className="truncate">{gym.gymName}</span>
                      <span className="text-[10px] font-mono text-zinc-400">{gym.city.slice(0, 3).toUpperCase()}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Anchor Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-zinc-300">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-white transition-colors duration-150"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Public Action CTA & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Primary CTA: Book Free Trial Pass */}
          {onBookFreeTrial ? (
            <button
              onClick={onBookFreeTrial}
              className="h-9 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-black uppercase tracking-wider text-black shadow-sm transition-all hover:brightness-110 active:scale-95 apple-press whitespace-nowrap"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Free Trial Pass</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <a
              href="#pricing"
              className="h-9 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-black uppercase tracking-wider text-black shadow-sm transition-all hover:brightness-110 active:scale-95 apple-press whitespace-nowrap"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Free Trial Pass</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#07090d] px-5 py-5 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-zinc-300">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 hover:text-white hover:bg-white/10 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-white/10">
            {onBookFreeTrial ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onBookFreeTrial();
                }}
                className="w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-black shadow-md transition-all active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                <span>Claim 1-Day Free Pass</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            ) : (
              <a
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-black shadow-md transition-all active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                <span>Claim 1-Day Free Pass</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
export default Header;
