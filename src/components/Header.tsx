import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Dumbbell,
  RefreshCw,
  Clock,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GymProfile } from '@/types';
import { INITIAL_GYM_PROFILES } from '@/lib/mockGyms';

interface HeaderProps {
  currentMode?: 'showcase' | 'operations' | 'member_portal';
  onModeChange?: (mode: 'showcase' | 'operations' | 'member_portal') => void;
  onResetData: () => void;
  gymProfile?: GymProfile;
  onBookFreeTrial?: () => void;
}

export function Header({ onResetData, gymProfile, onBookFreeTrial }: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const primaryColor = gymProfile?.primaryColor || '#ccff00';

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

  const adminLink = gymProfile ? `/admin?gym=${gymProfile.slug}` : '/admin';
  const memberLink = gymProfile ? `/member?gym=${gymProfile.slug}` : '/member';

  const navLinks = [
    { label: 'Facilities', href: '#facilities' },
    { label: 'Programs', href: '#programs' },
    { label: 'Coaches', href: '#trainers' },
    { label: 'Transformations', href: '#results' },
    { label: 'Memberships', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#07090d]/85 backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Branch */}
        <div className="flex items-center gap-4">
          <Link
            href={gymProfile ? `/gym/${gymProfile.slug}` : '/'}
            className="flex items-center gap-3 text-left group focus:outline-none apple-press"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-black shadow-md transition-transform group-hover:scale-105 active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-white text-lg">
                  {gymProfile ? (
                    gymProfile.gymName
                  ) : (
                    <>
                      Gym<span style={{ color: primaryColor }}>PRO</span>
                    </>
                  )}
                </span>
                <Badge variant="default" className="hidden sm:inline-flex text-[10px] font-semibold py-0.5 px-2">
                  {gymProfile ? gymProfile.city.toUpperCase() : 'INDIA'}
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium leading-none hidden sm:block">
                {gymProfile ? gymProfile.tagline : 'Strength, Free Weights & Real Results'}
              </p>
            </div>
          </Link>

          {/* Branch Switcher Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-[#222738] bg-[#0e121a] px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:border-zinc-500 transition-colors"
            >
              <MapPin className="h-3 w-3 text-[#ccff00]" />
              <span className="max-w-[110px] truncate">
                {gymProfile?.city || 'HSR Layout'}
              </span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {isBranchDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-[#222738] bg-[#0e121a]/95 backdrop-blur-xl p-2 shadow-2xl z-50">
                <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  Select Gym Branch
                </div>
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setIsBranchDropdownOpen(false)}
                    className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold text-zinc-200 hover:bg-[#1a2130] hover:text-[#ccff00] transition-colors"
                  >
                    <span>IronPulse HSR (Flagship)</span>
                    <span className="text-[10px] font-mono text-zinc-400">BLR</span>
                  </Link>
                  {INITIAL_GYM_PROFILES.map((gym) => (
                    <Link
                      key={gym.id}
                      href={`/gym/${gym.slug}`}
                      onClick={() => setIsBranchDropdownOpen(false)}
                      className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold text-zinc-200 hover:bg-[#1a2130] hover:text-[#ccff00] transition-colors"
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
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-zinc-300">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-white transition-colors hover:scale-105 transform duration-150"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions: Book Free Trial CTA + Portals */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Check-in hotkey & Clock */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-zinc-400 tabular-nums font-mono">
            <Clock className="h-3.5 w-3.5 text-[#ccff00]" />
            <span>{timeStr || 'Loading...'} IST</span>
          </div>

          {/* Primary High-Converting CTA: Book Free Trial */}
          {onBookFreeTrial ? (
            <button
              onClick={onBookFreeTrial}
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-lg transition-transform apple-press"
              style={{ backgroundColor: primaryColor }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Free Trial Pass</span>
            </button>
          ) : (
            <a
              href="#pricing"
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-lg transition-transform apple-press"
              style={{ backgroundColor: primaryColor }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Free Trial Pass</span>
            </a>
          )}

          {/* Admin link */}
          <Link href={adminLink} className="hidden sm:inline-flex">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold border-[#222738] bg-[#0c1017] hover:border-zinc-600 text-zinc-200"
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1 text-[#ccff00]" />
              <span>Admin</span>
            </Button>
          </Link>

          {/* Member portal link */}
          <Link href={memberLink} className="hidden sm:inline-flex">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs font-semibold bg-[#121724] hover:bg-[#1a2130] text-zinc-200"
            >
              <UserCheck className="h-3.5 w-3.5 mr-1 text-[#ccff00]" />
              <span>Portal</span>
            </Button>
          </Link>

          {/* Reset Demo Data Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onResetData}
            title="Reset Mock Seed Data"
            className="h-8 w-8 text-zinc-400 hover:text-[#ccff00] border-[#222738] bg-[#0c1017]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-[#222738] bg-[#0e121a] text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1e2434] bg-[#07090d]/95 backdrop-blur-2xl px-5 py-4 space-y-4">
          <nav className="grid grid-cols-2 gap-2 text-xs font-bold text-zinc-300">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl border border-[#1f2638] bg-[#0e121a] px-3.5 py-2.5 hover:text-[#ccff00] hover:border-[#ccff00]/50 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 pt-2 border-t border-[#1e2434]">
            <Link href={adminLink} className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full text-xs font-bold border-[#222738]">
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-[#ccff00]" />
                Admin Portal
              </Button>
            </Link>
            <Link href={memberLink} className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="secondary" size="sm" className="w-full text-xs font-semibold">
                <UserCheck className="h-3.5 w-3.5 mr-1 text-[#ccff00]" />
                Member Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
