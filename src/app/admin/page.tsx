'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { OperationsDashboard } from '@/components/OperationsDashboard';
import { useGymData } from '@/lib/useGymData';

export default function AdminPage() {
  const router = useRouter();
  const {
    isLoaded,
    members,
    attendanceLogs,
    payments,
    equipmentList,
    leads,
    routines,
    exercises,
    checkedInBannerMember,
    setCheckedInBannerMember,
    handleCheckInMember,
    handlePaymentSuccess,
    handleMemberCreated,
    handleToggleEquipmentStatus,
    handleUpdateRoutines
  } = useGymData();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#060709]">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ccff00] border-t-transparent" />
          <span>Loading GymPRO Admin Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <OperationsDashboard
      members={members}
      attendanceLogs={attendanceLogs}
      payments={payments}
      equipmentList={equipmentList}
      leads={leads}
      routines={routines}
      exercises={exercises}
      onCheckInMember={handleCheckInMember}
      onPaymentSuccess={handlePaymentSuccess}
      onMemberCreated={handleMemberCreated}
      onToggleEquipmentStatus={handleToggleEquipmentStatus}
      onUpdateRoutines={handleUpdateRoutines}
      checkedInBannerMember={checkedInBannerMember}
      onDismissBanner={() => setCheckedInBannerMember(null)}
      onSwitchToShowcase={() => router.push('/')}
      onSwitchToMemberPortal={() => router.push('/member')}
    />
  );
}
