import React from 'react';
import { RouteLoadingScreen } from '@/components/PortalLoadingScreen';

export default function Loading() {
  return (
    <RouteLoadingScreen
      title="GymPRO Home"
      badge="GYMPRO HOME"
      subtitle="Loading interactive gym operating demo, metrics & reception scanner..."
      icon="showcase"
    />
  );
}
