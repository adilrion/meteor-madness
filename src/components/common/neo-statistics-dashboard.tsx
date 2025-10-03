"use client";

import { NASANEOService } from "@/lib/nasa-neo-api";
import { Activity, AlertTriangle, BarChart3, Database, Globe, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface NEOStats {
  total_neo_count: number;
  potentially_hazardous_count: number;
  size_categories: {
    small: number;
    medium: number;
    large: number;
    very_large: number;
  };
}

export default function NEOStatisticsDashboard() {
  const [stats, setStats] = useState<NEOStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentNEOs, setRecentNEOs] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statisticsData, upcomingNEOs] = await Promise.all([
        NASANEOService.getNEOStatistics(),
        NASANEOService.getUpcomingNEOs(7)
      ]);

      setStats(statisticsData);
      setRecentNEOs(upcomingNEOs.slice(0, 5));
    } catch (error) {
      console.error("Error loading NEO data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading NEO Statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl">
        <p className="text-gray-400">Failed to load NEO statistics</p>
      </div>
    );
  }

  const phaPercentage = ((stats.potentially_hazardous_count / stats.total_neo_count) * 100).toFixed(1);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Database className="w-10 h-10 text-blue-400" />
          NASA NEO Database Statistics
        </h2>
        <p className="text-gray-400">Real-time data from NASA's Near-Earth Object Web Service</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total NEOs */}
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <Globe className="w-8 h-8 text-blue-400" />
            <TrendingUp className="w-6 h-6 text-blue-300" />
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Catalogued NEOs</h3>
          <p className="text-4xl font-bold text-white mb-1">
            {stats.total_neo_count.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">And counting...</p>
        </div>

        {/* Potentially Hazardous */}
        <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div className="text-red-300 text-sm font-bold">{phaPercentage}%</div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">Potentially Hazardous</h3>
          <p className="text-4xl font-bold text-white mb-1">
            {stats.potentially_hazardous_count.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">PHAs monitored</p>
        </div>

        {/* Today's Activity */}
        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">Next 7 Days</h3>
          <p className="text-4xl font-bold text-white mb-1">
            {recentNEOs.length}
          </p>
          <p className="text-xs text-gray-500">Close approaches</p>
        </div>

        {/* Size Distribution */}
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">Large Objects</h3>
          <p className="text-4xl font-bold text-white mb-1">
            {(stats.size_categories.large + stats.size_categories.very_large).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">&gt; 300m diameter</p>
        </div>
      </div>

      {/* Size Distribution Chart */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          Size Distribution
        </h3>
        <div className="space-y-4">
          {/* Small */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Small (&lt; 50m)</span>
              <span className="text-white font-bold">{stats.size_categories.small.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(stats.size_categories.small / stats.total_neo_count) * 100}%` }}
              />
            </div>
          </div>

          {/* Medium */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Medium (50m - 300m)</span>
              <span className="text-white font-bold">{stats.size_categories.medium.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(stats.size_categories.medium / stats.total_neo_count) * 100}%` }}
              />
            </div>
          </div>

          {/* Large */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Large (300m - 1km)</span>
              <span className="text-white font-bold">{stats.size_categories.large.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(stats.size_categories.large / stats.total_neo_count) * 100}%` }}
              />
            </div>
          </div>

          {/* Very Large */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Very Large (&gt; 1km)</span>
              <span className="text-white font-bold">{stats.size_categories.very_large.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(stats.size_categories.very_large / stats.total_neo_count) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Close Approaches */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-400" />
          Upcoming Close Approaches (Next 7 Days)
        </h3>
        {recentNEOs.length > 0 ? (
          <div className="space-y-3">
            {recentNEOs.map((neo, index) => {
              const approach = neo.close_approach_data?.[0];
              const diameter = neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
              const isPHA = neo.is_potentially_hazardous_asteroid;

              return (
                <div
                  key={neo.id || index}
                  className={`p-4 rounded-lg border ${isPHA
                      ? 'bg-red-900/20 border-red-500/30'
                      : 'bg-slate-800/50 border-slate-600/30'
                    } hover:bg-slate-700/50 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-white">{neo.name}</h4>
                        {isPHA && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                            PHA
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="text-white ml-2 font-medium">
                            {(diameter * 1000).toFixed(0)}m
                          </span>
                        </div>
                        {approach && (
                          <>
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="text-white ml-2 font-medium">
                                {new Date(approach.close_approach_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Distance:</span>
                              <span className="text-white ml-2 font-medium">
                                {parseFloat(approach.miss_distance.lunar).toFixed(2)} LD
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Velocity:</span>
                              <span className="text-white ml-2 font-medium">
                                {parseFloat(approach.relative_velocity.kilometers_per_second).toFixed(1)} km/s
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No close approaches in the next 7 days</p>
        )}
      </div>

      {/* Info Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>Data provided by NASA&apos;s Near-Earth Object Web Service (NeoWs)</p>
        <p className="mt-1">LD = Lunar Distance (1 LD ≈ 384,400 km) | PHA = Potentially Hazardous Asteroid</p>
      </div>
    </div>
  );
}

