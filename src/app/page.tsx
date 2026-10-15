'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGymData } from '@/lib/useGymData';
import { Header } from '@/components/Header';
import { ClubShowcase } from '@/components/ClubShowcase';
import { AddMemberModal } from '@/components/modals/AddMemberModal';

export default function Home() {
  const router = useRouter();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const {
    isLoaded,
    members,
    attendanceLogs,
    handleMemberCreated,
    handleResetData
  } = useGymData();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#060709]">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ccff00] border-t-transparent" />
          <span>Loading GymPRO Systems...</span>
        </div>
      </div>
    );
  }

  const activeMembersCount = members.filter((m) => m.status === 'active').length;
  const unpaidDuesCount = members.filter((m) => m.pendingDueInr > 0).length;

  const handleSwitchMode = (mode: 'showcase' | 'operations' | 'member_portal') => {
    if (mode === 'operations') {
      router.push('/admin');
    } else if (mode === 'member_portal') {
      router.push('/member');
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
