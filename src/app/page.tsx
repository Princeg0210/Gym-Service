'use client';

import React, { useState, useEffect } from 'react';
import { useGymData } from '@/lib/useGymData';
import { Header } from '@/components/Header';
import { ClubShowcase } from '@/components/ClubShowcase';
import { AddMemberModal } from '@/components/modals/AddMemberModal';
import { usePortalLoading, RouteLoadingScreen } from '@/components/PortalLoadingScreen';

export default function Home() {
  const { openPortal, notifyPageReady } = usePortalLoading();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const {
    isLoaded,
    members,
    attendanceLogs,
    handleMemberCreated,
    handleResetData
  } = useGymData();

  useEffect(() => {
    if (isLoaded) {
      notifyPageReady('/');
    }
  }, [isLoaded, notifyPageReady]);

  if (!isLoaded) {
    return (
      <RouteLoadingScreen
        title="GymPRO Commercial Showcase"
        badge="COMMERCIAL SHOWCASE"
        subtitle="Loading interactive gym operating demo, metrics & reception scanner..."
        icon="showcase"
      />
    );
  }

  const activeMembersCount = members.filter((m) => m.status === 'active').length;
  const unpaidDuesCount = members.filter((m) => m.pendingDueInr > 0).length;

  const handleSwitchMode = (mode: 'showcase' | 'operations' | 'member_portal') => {
    if (mode === 'operations') {
      openPortal('/admin');
    } else if (mode === 'member_portal') {
      openPortal('/member');
    }
  };

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 antialiased selection:bg-[#ccff00] selection:text-black">
      {/* Universal Header with direct links to /admin and /member */}
      <Header
        currentMode="showcase"
        onModeChange={handleSwitchMode}
        onResetData={handleResetData}
      />

      <main className="pb-16">
        <ClubShowcase
          onSwitchMode={handleSwitchMode}
          onOpenAddMember={() => setIsAddMemberOpen(true)}
          activeMembersCount={activeMembersCount}
          todayCheckInsCount={attendanceLogs.length}
          unpaidDuesCount={unpaidDuesCount}
        />
      </main>

      {/* Global Add Member Modal from Showcase Trial Buttons */}
      {isAddMemberOpen && (
        <AddMemberModal
          onClose={() => setIsAddMemberOpen(false)}
          onMemberCreated={handleMemberCreated}
        />
      )}
    </div>
  );
}
