import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dumbbell, RefreshCw, Clock, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GymProfile } from '@/types';

interface HeaderProps {
  currentMode?: 'showcase' | 'operations' | 'member_portal';
  onModeChange?: (mode: 'showcase' | 'operations' | 'member_portal') => void;
  onResetData: () => void;
  gymProfile?: GymProfile;
}

export function Header({ onResetData, gymProfile }: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>('');
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1e2330] bg-[#07090d]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Branch */}
        <Link
          href={gymProfile ? `/gym/${gymProfile.slug}` : '/'}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-black shadow-md transition-transform group-hover:scale-105"
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
              <Badge variant="default" className="text-xs font-semibold py-0.5 px-2">
                {gymProfile ? gymProfile.city.toUpperCase() : 'INDIA'}
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 font-medium leading-none">
              {gymProfile ? gymProfile.tagline : 'Commercial Gym Operating Engine'}
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
          <Link href={adminLink}>
            <Button
              variant="volt"
              size="sm"
              className="font-black tracking-wide text-black"
              style={{ backgroundColor: primaryColor }}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin Portal</span>
              <span className="sm:hidden">Admin</span>
            </Button>
          </Link>

          <Link href={memberLink}>
            <Button variant="secondary" size="sm" className="font-semibold text-zinc-200">
              <UserCheck className="h-3.5 w-3.5" style={{ color: primaryColor }} />
              <span className="hidden sm:inline">Member Portal</span>
              <span className="sm:hidden">Member</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="icon"
            onClick={onResetData}
            title="Reset Mock Seed Data"
            className="h-8 w-8 text-zinc-400 hover:text-[#ccff00]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
