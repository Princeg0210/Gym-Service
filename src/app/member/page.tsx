'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MemberPortal } from '@/components/MemberPortal';
import { useGymData } from '@/lib/useGymData';
import { usePortalLoading, RouteLoadingScreen } from '@/components/PortalLoadingScreen';
import { Dumbbell, Home } from 'lucide-react';
import { INITIAL_GYM_PROFILES } from '@/lib/mockGyms';
import { GymProfile } from '@/types';
import { gymApiClient } from '@/client/api/gymApiClient';

function MemberPageContent() {
  const { notifyPageReady } = usePortalLoading();
  const searchParams = useSearchParams();
  const gymSlug = searchParams.get('gym') || '';

  const [activeGym, setActiveGym] = useState<GymProfile | null>(null);

  const {
    isLoaded,
    members,
    routines,
    exercises,
    handleUpdateRoutines
  } = useGymData();

  useEffect(() => {
    async function loadGym() {
      if (gymSlug) {
        try {
          const fetched = await gymApiClient.getGymBySlug(gymSlug);
          if (fetched) {
            setActiveGym(fetched);
            return;
          }
        } catch {
          const match = INITIAL_GYM_PROFILES.find((g) => g.slug === gymSlug);
          if (match) setActiveGym(match);
        }
      } else {
        // Fallback default
        setActiveGym(INITIAL_GYM_PROFILES[0]);
      }
    }
    loadGym();
  }, [gymSlug]);

  useEffect(() => {
    if (isLoaded) {
      notifyPageReady('/member');
    }
  }, [isLoaded, notifyPageReady]);

  if (!isLoaded) {
    return (
      <RouteLoadingScreen
        title="Athlete Member Portal"
        badge="ATHLETE ARENA"
        subtitle="Loading personalized workout routines, high-protein diet charts & digital pass..."
        icon="member"
      />
    );
  }

  const primaryColor = activeGym?.primaryColor || '#ccff00';
  const gymName = activeGym?.gymName || 'Commercial Gym';
  const gymTagline = activeGym?.tagline || 'Athlete Training Arena & Nutrition Desk';
  const homeHref = activeGym ? `/gym/${activeGym.slug}` : '/';

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100">
      {/* Member Portal Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1e2330] bg-[#07090d]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href={homeHref} className="flex items-center gap-3 group">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-black shadow-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: primaryColor }}
            >
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-white text-lg">
                  {gymName}
                </span>
                <span
                  className="rounded-full border px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
                  style={{
                    borderColor: `${primaryColor}60`,
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor
                  }}
                >
                  MEMBER PORTAL
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium leading-none">
                {gymTagline}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={homeHref}
              className="flex items-center gap-1.5 rounded-xl border border-[#232b3d] bg-[#121724] px-3.5 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
            >
              <Home className="h-3.5 w-3.5" style={{ color: primaryColor }} />
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
          gymName={gymName}
        />
      </main>
    </div>
  );
}

export default function MemberPage() {
  return (
    <Suspense
      fallback={
        <RouteLoadingScreen
          title="Athlete Member Portal"
          badge="ATHLETE ARENA"
          subtitle="Loading personalized workout routines, high-protein diet charts & digital pass..."
          icon="member"
        />
      }
    >
      <MemberPageContent />
    </Suspense>
  );
}
