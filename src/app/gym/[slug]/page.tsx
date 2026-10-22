'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useGymData } from '@/lib/useGymData';
import { Header } from '@/components/Header';
import { ClubShowcase } from '@/components/ClubShowcase';
import { AddMemberModal } from '@/components/modals/AddMemberModal';
import { usePortalLoading, RouteLoadingScreen } from '@/components/PortalLoadingScreen';
import { GymProfile } from '@/types';
import { gymApiClient } from '@/client/api/gymApiClient';
import { INITIAL_GYM_PROFILES } from '@/lib/mockGyms';
import { Dumbbell, ArrowLeft, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GymPageProps {
  params: Promise<{ slug: string }>;
}

function DynamicGymLandingContent({ params }: GymPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { openPortal, notifyPageReady } = usePortalLoading();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [gymProfile, setGymProfile] = useState<GymProfile | null>(null);
  const [isLoadingGym, setIsLoadingGym] = useState(true);
  const [gymNotFound, setGymNotFound] = useState(false);

  const {
    isLoaded,
    members,
    attendanceLogs,
    handleMemberCreated,
    handleResetData
  } = useGymData();

  useEffect(() => {
    async function fetchProfile() {
      setIsLoadingGym(true);
      try {
        const profile = await gymApiClient.getGymBySlug(slug);
        if (profile) {
          setGymProfile(profile);
          setGymNotFound(false);
        } else {
          // Check local seeds
          const local = INITIAL_GYM_PROFILES.find((g) => g.slug === slug);
          if (local) {
            setGymProfile(local);
            setGymNotFound(false);
          } else {
            setGymNotFound(true);
          }
        }
      } catch (err) {
        console.warn(`Gym profile lookup for "${slug}" failed on API, checking initial seeds:`, err);
        const local = INITIAL_GYM_PROFILES.find((g) => g.slug === slug);
        if (local) {
          setGymProfile(local);
          setGymNotFound(false);
        } else {
          setGymNotFound(true);
        }
      } finally {
        setIsLoadingGym(false);
      }
    }

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  useEffect(() => {
    if (isLoaded && !isLoadingGym) {
      notifyPageReady(`/gym/${slug}`);
    }
  }, [isLoaded, isLoadingGym, notifyPageReady, slug]);

  if (!isLoaded || isLoadingGym) {
    return (
      <RouteLoadingScreen
        title={`Loading ${slug.toUpperCase()}...`}
        badge="GYM SHOWCASE"
        subtitle="Loading custom brand palette, membership plans & facility details..."
        icon="showcase"
      />
    );
  }

  // 404: Gym Not Found
  if (gymNotFound || !gymProfile) {
    return (
      <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-5 rounded-2xl border border-[#1e2433] bg-[#0c1017] p-8 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Gym Branch Not Found</h1>
            <p className="text-xs text-zinc-400">
              No registered gym landing page corresponds to <span className="font-mono text-[#ccff00]">/gym/{slug}</span>.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link href="/">
              <Button variant="volt" className="w-full text-xs font-black">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Return to GymPRO Main Hub
              </Button>
            </Link>

            <Link href="/admin">
              <Button variant="outline" className="w-full text-xs font-bold border-[#202738]">
                <ShieldCheck className="h-4 w-4 mr-1.5 text-[#ccff00]" />
                Create Gym in CMS Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Draft / Unpublished Mode: Coming Soon
  if (!gymProfile.isPublished) {
    return (
      <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-lg space-y-6 rounded-3xl border border-[#1e2433] bg-[#0c1017] p-10 shadow-2xl">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black shadow-lg"
            style={{ backgroundColor: gymProfile.primaryColor }}
          >
            <Dumbbell className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span
              className="text-[10px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-lg"
              style={{
                backgroundColor: `${gymProfile.primaryColor}20`,
                color: gymProfile.primaryColor
              }}
            >
              LAUNCHING SOON • {gymProfile.city.toUpperCase()}
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              {gymProfile.gymName}
            </h1>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {gymProfile.tagline}
            </p>
          </div>

          <div className="rounded-2xl border border-[#1e2433] bg-[#121724] p-4 text-xs text-zinc-300 space-y-1.5 text-left">
            <p className="font-bold text-white">Facility Coordinates:</p>
            <p className="text-zinc-400">{gymProfile.address}</p>
            <p className="text-zinc-400">Front Desk: +{gymProfile.phone}</p>
            <p className="text-zinc-400">WhatsApp: +{gymProfile.whatsappNumber}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full text-xs font-bold border-[#202738]">
                GymPRO Hub
              </Button>
            </Link>
            <Link href="/admin" className="w-full">
              <Button
                variant="volt"
                className="w-full text-xs font-black text-black"
                style={{ backgroundColor: gymProfile.primaryColor }}
              >
                Admin CMS Preview
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter tenant-specific metrics if gymId matches, or overall fallback
  const tenantMembers = members.filter((m) => !m.gymId || m.gymId === gymProfile.id);
  const activeMembersCount = tenantMembers.filter((m) => m.status === 'active').length;
  const unpaidDuesCount = tenantMembers.filter((m) => m.pendingDueInr > 0).length;

  const handleSwitchMode = (mode: 'showcase' | 'operations' | 'member_portal') => {
    if (mode === 'operations') {
      openPortal(`/admin?gym=${slug}`);
    } else if (mode === 'member_portal') {
      openPortal(`/member?gym=${slug}`);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#060709] text-zinc-100 antialiased selection:bg-[#ccff00] selection:text-black"
      style={
        {
          '--brand-primary': gymProfile.primaryColor,
          '--brand-accent': gymProfile.accentColor
        } as React.CSSProperties
      }
    >
      {/* Universal Tenant Header with Gym Specific Name & Theme */}
      <Header
        currentMode="showcase"
        onModeChange={handleSwitchMode}
        onResetData={handleResetData}
        gymProfile={gymProfile}
      />

      <main className="pb-16">
        <ClubShowcase
          onSwitchMode={handleSwitchMode}
          onOpenAddMember={() => setIsAddMemberOpen(true)}
          activeMembersCount={activeMembersCount}
          todayCheckInsCount={attendanceLogs.length}
          unpaidDuesCount={unpaidDuesCount}
          gymProfile={gymProfile}
        />
      </main>

      {/* Global Add Member Modal (auto-associating with gymId) */}
      {isAddMemberOpen && (
        <AddMemberModal
          onClose={() => setIsAddMemberOpen(false)}
          onMemberCreated={(newMem, initPay) => {
            const tenantMember = {
              ...newMem,
              gymId: gymProfile.id
            };
            handleMemberCreated(tenantMember, initPay);
          }}
        />
      )}
    </div>
  );
}

export default function DynamicGymLandingPage(props: GymPageProps) {
  return (
    <Suspense
      fallback={
        <RouteLoadingScreen
          title="Loading Gym Showcase..."
          badge="GYM SHOWCASE"
          subtitle="Loading custom brand palette, membership plans & facility details..."
          icon="showcase"
        />
      }
    >
      <DynamicGymLandingContent {...props} />
    </Suspense>
  );
}
