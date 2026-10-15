import React from 'react';
import { RouteLoadingScreen } from '@/components/PortalLoadingScreen';

export default function AdminLoading() {
  return (
    <RouteLoadingScreen
      title="Admin Operations Console"
      badge="STAFF & MANAGEMENT"
      subtitle="Connecting real-time reception desk, UPI dues ledger & equipment monitors..."
      icon="admin"
    />
  );
}
