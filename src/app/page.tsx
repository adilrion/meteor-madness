'use client';

import dynamic from "next/dynamic";

const GlobeSimulationBanner = dynamic(
  () => import('@/components/common/3d-globe-simulation-banner'),
  { ssr: false }
)

const AdvancedMeteorViewer = dynamic(
  () => import('@/components/common/advanced-meteor-viewer'),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="min-h-screen">
      <GlobeSimulationBanner />
      <div className="h-screen">
        <AdvancedMeteorViewer />
      </div>
    </div>
  );
}
