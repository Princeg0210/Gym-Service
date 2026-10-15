'use client';

import React, { useEffect } from 'react';
import { OperationsDashboard } from '@/components/OperationsDashboard';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { useGymData } from '@/lib/useGymData';
import { usePortalLoading, RouteLoadingScreen } from '@/components/PortalLoadingScreen';

export default function AdminPage() {
  const { openPortal, notifyPageReady } = usePortalLoading();
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

  useEffect(() => {
    if (isLoaded) {
      notifyPageReady('/admin');
    }
  }, [isLoaded, notifyPageReady]);

  if (!isLoaded) {
    return (
      <RouteLoadingScreen
        title="Admin Operations Console"
        badge="STAFF & MANAGEMENT"
        subtitle="Connecting real-time reception desk, UPI dues & equipment monitors..."
        icon="admin"
      />
    );
  }

  return (
    <AdminAuthGuard>
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
        onSwitchToShowcase={() => openPortal('/')}
        onSwitchToMemberPortal={() => openPortal('/member')}
      />
    </AdminAuthGuard>
  );
}
