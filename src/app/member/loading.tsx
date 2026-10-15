import React from 'react';
import { RouteLoadingScreen } from '@/components/PortalLoadingScreen';

export default function MemberLoading() {
  return (
    <RouteLoadingScreen
      title="Athlete Member Portal"
      badge="ATHLETE ARENA"
      subtitle="Loading personalized workout routines, high-protein diet charts & digital pass..."
      icon="member"
    />
  );
}
