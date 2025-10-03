"use client";

import dynamic from "next/dynamic";

const NEOStatisticsDashboard = dynamic(
  () => import("@/components/common/neo-statistics-dashboard"),
  { ssr: false }
);

const SeismicImpactComparison = dynamic(
  () => import("@/components/common/seismic-impact-comparison"),
  { ssr: false }
);

const OrbitalTrajectoryViewer = dynamic(
  () => import("@/components/common/orbital-trajectory-viewer"),
  { ssr: false }
);

export default function NEOExplorerPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-950 via-slate-900 to-black py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            NEO Explorer
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Explore Near-Earth Objects with Real-Time NASA Data
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Access comprehensive data on asteroids and comets that pass close to Earth.
            Analyze impact scenarios, compare seismic effects, and understand the threats from space.
          </p>
        </div>
      </div>

      {/* NEO Statistics Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NEOStatisticsDashboard />
      </div>

      {/* Seismic Impact Comparison */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SeismicImpactComparison />
      </div>

      {/* Orbital Trajectory Viewer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <OrbitalTrajectoryViewer />
      </div>

      {/* Educational Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Understanding Near-Earth Objects</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">What are NEOs?</h3>
              <p className="text-gray-300 mb-4">
                Near-Earth Objects (NEOs) are asteroids and comets with orbits that bring them within
                1.3 astronomical units (AU) of the Sun, which means they can pass close to Earth&apos;s orbit.
              </p>
              <p className="text-gray-300">
                NASA and other space agencies track these objects to assess potential impact threats
                and study the composition of our solar system.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-red-400 mb-3">Potentially Hazardous Asteroids</h3>
              <p className="text-gray-300 mb-4">
                A Potentially Hazardous Asteroid (PHA) is defined as an asteroid larger than 140 meters
                in diameter with an orbit that brings it within 0.05 AU (about 7.5 million km) of Earth&apos;s orbit.
              </p>
              <p className="text-gray-300">
                While &quot;hazardous&quot; sounds alarming, it doesn&apos;t mean an impact is imminent—it means
                we need to monitor these objects closely.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-green-400 mb-3">Detection & Tracking</h3>
              <p className="text-gray-300 mb-4">
                NASA&apos;s Center for Near Earth Object Studies (CNEOS) uses telescopes around the world
                to detect and track NEOs. Over 34,000 NEOs have been discovered so far.
              </p>
              <p className="text-gray-300">
                The discovery rate continues to increase as detection technology improves.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-purple-400 mb-3">Planetary Defense</h3>
              <p className="text-gray-300 mb-4">
                NASA&apos;s Planetary Defense Coordination Office is responsible for detecting and tracking
                NEOs and developing mitigation strategies, including the successful DART mission.
              </p>
              <p className="text-gray-300">
                The DART mission successfully demonstrated that we can change an asteroid&apos;s orbit,
                providing a potential defense against future threats.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Data Sources & Resources</h2>

          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-bold text-white mb-2">NASA APIs Used:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Near-Earth Object Web Service (NeoWs) - Real-time NEO data</li>
                <li>Small-Body Database (SBDB) - Orbital parameters and physical characteristics</li>
                <li>CNEOS - Close approach data and impact risk assessments</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-2">Scientific Resources:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>USGS Earthquake Catalog - Seismic magnitude comparisons</li>
                <li>Keplerian Orbital Mechanics - Trajectory calculations</li>
                <li>Holsapple-Schmidt Scaling - Crater diameter estimates</li>
                <li>Nuclear Weapons Effects - Shockwave modeling</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                All data is provided by NASA&apos;s open data portal and USGS. Impact scenarios are
                scientifically modeled but simplified for visualization purposes. Actual impact
                effects would depend on many additional factors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

