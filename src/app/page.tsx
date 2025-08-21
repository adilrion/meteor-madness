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

const MeteorMadnessDashboard = dynamic(
  () => import('@/components/common/meteor-madness-dashboard'),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <GlobeSimulationBanner />

      {/* Dashboard Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MeteorMadnessDashboard />
      </div>

      {/* 3D Globe Viewer */}
      <div className="h-screen">
        <AdvancedMeteorViewer />
      </div>
    </div>
  );
}
