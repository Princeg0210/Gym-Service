'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGymData } from '@/lib/useGymData';
import { Header } from '@/components/Header';
import { ClubShowcase } from '@/components/ClubShowcase';
import { AddMemberModal } from '@/components/modals/AddMemberModal';
import { RouteLoadingScreen } from '@/components/PortalLoadingScreen';
import { GymProfile } from '@/types';
import { gymApiClient } from '@/client/api/gymApiClient';
import { INITIAL_GYM_PROFILES } from '@/lib/mockGyms';
import {
  Dumbbell,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  ShieldAlert,
  ArrowLeft,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GymPageProps {
  params: Promise<{ slug: string }>;
}

function GymPageContent({ slug }: { slug: string }) {
  const router = useRouter();
  const [gymProfile, setGymProfile] = useState<GymProfile | null>(null);
  const [gymLoading, setGymLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const {
    isLoaded: isDataLoaded,
    members,
    attendanceLogs,
    handleMemberCreated,
    handleResetData
  } = useGymData();

  useEffect(() => {
    async function loadGym() {
      setGymLoading(true);
      try {
        const fetched = await gymApiClient.getGymBySlug(slug);
        if (fetched) {
          setGymProfile(fetched);
          setIsNotFound(false);
        } else {
          setIsNotFound(true);
        }
      } catch (err) {
        console.warn('API lookup failed, checking static seed profiles:', err);
        const fallback = INITIAL_GYM_PROFILES.find(
          (g) => g.slug.toLowerCase() === slug.toLowerCase() || g.id === slug
        );
        if (fallback) {
          setGymProfile(fallback);
          setIsNotFound(false);
        } else {
          setIsNotFound(true);
        }
      } finally {
        setGymLoading(false);
      }
    }
    loadGym();
  }, [slug]);

  if (gymLoading || !isDataLoaded) {
    return (
      <RouteLoadingScreen
        title={`GymPRO • ${slug.toUpperCase()}`}
        badge="TENANT SHOWCASE"
        subtitle="Loading customized gym branding, plans, biomechanics & front desk telemetry..."
        icon="showcase"
      />
    );
  }

  // 404: Gym Profile Not Found
  if (isNotFound || !gymProfile) {
    return (
      <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Gym Profile Not Found</h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-md">
          The gym landing page for <span className="font-mono text-[#ccff00]">/gym/{slug}</span> does not exist or has been removed.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button variant="volt" size="sm" className="font-bold">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Return to GymPRO Main</span>
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="font-bold">
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              <span>Open Admin CMS</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Unpublished / Draft State (Notice for visitors)
  if (!gymProfile.isPublished) {
    return (
      <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl mb-4"
          style={{ backgroundColor: gymProfile.primaryColor }}
        >
          <Dumbbell className="h-8 w-8 text-black" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400 mb-3">
          <Clock className="h-3.5 w-3.5" />
          <span>LAUNCHING SOON • CMS DRAFT MODE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">{gymProfile.gymName}</h1>
        <p className="mt-2 text-sm text-zinc-300 max-w-lg">{gymProfile.tagline}</p>
        
        <div className="mt-6 rounded-2xl border border-[#1e2433] bg-[#0c1017] p-6 max-w-md w-full space-y-3 text-xs text-left">
          <div className="flex items-start gap-2.5 text-zinc-300">
            <MapPin className="h-4 w-4 shrink-0 text-[#ccff00] mt-0.5" />
            <span>{gymProfile.address}, {gymProfile.city}, {gymProfile.state} - {gymProfile.pincode}</span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-300">
            <Phone className="h-4 w-4 shrink-0 text-[#ccff00]" />
            <span>+{gymProfile.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-300">
            <MessageCircle className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>WhatsApp: +{gymProfile.whatsappNumber}</span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-300">
            <Clock className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>{gymProfile.operatingHours}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/admin?gym=${encodeURIComponent(gymProfile.slug)}`}>
            <Button
              variant="volt"
              size="sm"
              className="font-bold text-black"
              style={{ backgroundColor: gymProfile.primaryColor }}
            >
              <Globe className="h-4 w-4 mr-1.5" />
              <span>Admin Preview / Edit CMS</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="font-bold border-[#202738]">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>All Gyms</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Active Live Published Gym Landing Page
  const activeMembersCount = members.filter((m) => m.status === 'active').length;
  const unpaidDuesCount = members.filter((m) => m.pendingDueInr > 0).length;

  const handleSwitchMode = (mode: 'showcase' | 'operations' | 'member_portal') => {
    if (mode === 'operations') {
      router.push(`/admin?gym=${encodeURIComponent(gymProfile.slug)}`);
    } else if (mode === 'member_portal') {
      router.push(`/member?gym=${encodeURIComponent(gymProfile.slug)}`);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#060709] text-zinc-100 antialiased selection:bg-[#ccff00] selection:text-black"
      style={
        {
          '--gym-primary': gymProfile.primaryColor,
          '--gym-accent': gymProfile.accentColor,
          '--gym-secondary': gymProfile.secondaryColor
        } as React.CSSProperties
      }
    >
      {/* Dynamic Header with Gym Name and Branding */}
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

      {/* Global Add Member Modal */}
      {isAddMemberOpen && (
        <AddMemberModal
          onClose={() => setIsAddMemberOpen(false)}
          onMemberCreated={(newMember, initialPayment) => {
            handleMemberCreated(
              {
                ...newMember,
                gymId: gymProfile.id
              },
              initialPayment
            );
          }}
        />
      )}
    </div>
  );
}

export default function PersonalizedGymPage({ params }: GymPageProps) {
  const unwrappedParams = React.use(params);
  return (
    <Suspense
      fallback={
        <RouteLoadingScreen
          title="GymPRO Commercial Showcase"
          badge="TENANT SHOWCASE"
          subtitle="Loading customized gym branding..."
          icon="showcase"
        />
      }
    >
      <GymPageContent slug={unwrappedParams.slug} />
    </Suspense>
  );
}
