'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TrainerPortal } from '@/components/TrainerPortal';
import { INITIAL_GYM_PROFILES } from '@/lib/mockGyms';
import { gymApiClient } from '@/client/api/gymApiClient';
import { GymProfile } from '@/types';

// ponytail: minimal page content wrapper with gym branding lookup
function TrainerPageContent() {
  const searchParams = useSearchParams();
  const gymSlug = searchParams.get('gym') || '';
  const [activeGym, setActiveGym] = useState<GymProfile | null>(null);

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
        setActiveGym(INITIAL_GYM_PROFILES[0]);
      }
    }
    loadGym();
  }, [gymSlug]);

  return (
    <TrainerPortal
      initialGymSlug={gymSlug}
      gymName={activeGym?.gymName || 'IronPulse Fitness Club'}
      primaryColor={activeGym?.primaryColor || '#ccff00'}
    />
  );
}

export default function TrainerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-zinc-400 text-sm">
          Loading Coach Portal...
        </div>
      }
    >
      <TrainerPageContent />
    </Suspense>
  );
}
