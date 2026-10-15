import React from 'react';
import { RouteLoadingScreen } from '@/components/PortalLoadingScreen';

export default function Loading() {
  return (
    <RouteLoadingScreen
      title="GymPRO Commercial Showcase"
      badge="COMMERCIAL SHOWCASE"
      subtitle="Loading interactive gym operating demo, metrics & reception scanner..."
      icon="showcase"
    />
  );
}
