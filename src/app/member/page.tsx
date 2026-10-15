'use client';

import React from 'react';
import Link from 'next/link';
import { MemberPortal } from '@/components/MemberPortal';
import { useGymData } from '@/lib/useGymData';
import { Dumbbell, Home } from 'lucide-react';

export default function MemberPage() {
  const {
    isLoaded,
    members,
    routines,
    exercises,
    handleUpdateRoutines
  } = useGymData();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#060709]">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ccff00] border-t-transparent" />
          <span>Loading Member Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100">
      {/* Member Portal Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1e2330] bg-[#07090d]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccff00] text-black shadow-md transition-transform group-hover:scale-105">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-white text-lg">
                  Gym<span className="text-[#ccff00]">PRO</span>
                </span>
                <span className="rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[#ccff00]">
                  MEMBER PORTAL
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium leading-none">
                Athlete Training Arena & Nutrition Desk
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-[#232b3d] bg-[#121724] px-3.5 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Showcase</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pb-16 pt-4">
        <MemberPortal
          members={members}
          routines={routines}
          exercises={exercises}
          onUpdateRoutines={handleUpdateRoutines}
        />
      </main>
    </div>
  );
}
