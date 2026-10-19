'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OperationsDashboard } from '@/components/OperationsDashboard';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { useGymData } from '@/lib/useGymData';
import { usePortalLoading, RouteLoadingScreen } from '@/components/PortalLoadingScreen';

function AdminPageContent() {
  const { openPortal, notifyPageReady } = usePortalLoading();
  const searchParams = useSearchParams();
  const gymSlug = searchParams.get('gym') || '';

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
    handleDeleteMember,
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

  const showcaseUrl = gymSlug ? `/gym/${gymSlug}` : '/';
  const memberPortalUrl = gymSlug ? `/member?gym=${gymSlug}` : '/member';

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
        onDeleteMember={handleDeleteMember}
        onToggleEquipmentStatus={handleToggleEquipmentStatus}
        onUpdateRoutines={handleUpdateRoutines}
        checkedInBannerMember={checkedInBannerMember}
        onDismissBanner={() => setCheckedInBannerMember(null)}
        onSwitchToShowcase={() => openPortal(showcaseUrl)}
        onSwitchToMemberPortal={() => openPortal(memberPortalUrl)}
        initialGymSlug={gymSlug}
      />
    </AdminAuthGuard>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <RouteLoadingScreen
          title="Admin Operations Console"
          badge="STAFF & MANAGEMENT"
          subtitle="Connecting real-time reception desk, UPI dues & equipment monitors..."
          icon="admin"
        />
      }
    >
      <AdminPageContent />
    </Suspense>
  );
}
