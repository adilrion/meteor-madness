'use client';

import { NASANEOService, NEOData } from '@/lib/nasa-neo-api';
import { useCallback, useEffect, useState } from 'react';
import { SolarSystemVisualization } from './solar-system-visualization';

interface EnhancedSolarSystemProps {
  enableRealTimeData?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // minutes
}

export const EnhancedSolarSystemVisualization: React.FC<EnhancedSolarSystemProps> = ({
  enableRealTimeData = true,
  autoRefresh = true,
  refreshInterval = 60
}) => {
  const [neoData, setNeoData] = useState<NEOData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total_neo_count: 0,
    potentially_hazardous_count: 0,
    size_categories: {
      small: 0,
      medium: 0,
      large: 0,
      very_large: 0
    }
  });

  const fetchNEOData = useCallback(async () => {
    if (!enableRealTimeData) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch upcoming NEOs for the next 30 days
      const upcomingNEOs = await NASANEOService.getUpcomingNEOs(30);

      // Also get some general NEO data for browsing
      const { neos: browsedNEOs } = await NASANEOService.browseNEOs(0, 50);

      // Get statistics
      const stats = await NASANEOService.getNEOStatistics();

      // Combine and deduplicate
      const allNEOs = [...upcomingNEOs];
      browsedNEOs.forEach(neo => {
        if (!allNEOs.find(existing => existing.id === neo.id)) {
          allNEOs.push(neo);
        }
      });

      setNeoData(allNEOs);
      setStatistics(stats);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NEO data');
      console.error('Error fetching NASA NEO data:', err);
    } finally {
      setLoading(false);
    }
  }, [enableRealTimeData]);

  useEffect(() => {
    fetchNEOData();
  }, [fetchNEOData]);

  useEffect(() => {
    if (!autoRefresh || !enableRealTimeData) return;

    const interval = setInterval(() => {
      fetchNEOData();
    }, refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, enableRealTimeData, refreshInterval, fetchNEOData]);

  return (
    <div className="relative w-full h-screen">
      {/* NASA Data Status Panel */}
      {enableRealTimeData && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/90 text-white p-3 rounded-lg border border-gray-600 z-20">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' :
                  error ? 'bg-red-500' : 'bg-green-500'
                }`}></div>
              <span>
                {loading ? 'Fetching NASA Data...' :
                  error ? 'NASA API Error' : 'NASA Data Live'}
              </span>
            </div>

            {lastUpdated && (
              <span className="text-gray-400">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}

            <button
              onClick={fetchNEOData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-1 rounded text-xs transition-colors"
            >
              {loading ? '⟳' : '↻'} Refresh
            </button>

            {neoData.length > 0 && (
              <span className="text-green-300">
                {neoData.length} NEOs loaded
              </span>
            )}
          </div>

          {error && (
            <div className="mt-2 text-red-300 text-xs">
              {error}
            </div>
          )}
        </div>
      )}

      {/* NASA Statistics Panel */}
      {enableRealTimeData && statistics.total_neo_count > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 text-white p-4 rounded-xl border border-gray-600 z-20">
          <h3 className="text-lg font-bold text-center mb-3 text-blue-300">NASA NEO Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-blue-300">{statistics.total_neo_count.toLocaleString()}</div>
              <div className="text-xs text-gray-300">Total NEOs</div>
            </div>
            <div>
              <div className="text-xl font-bold text-red-400">{statistics.potentially_hazardous_count.toLocaleString()}</div>
              <div className="text-xs text-gray-300">Potentially Hazardous</div>
            </div>
            <div>
              <div className="text-xl font-bold text-yellow-400">{statistics.size_categories.large.toLocaleString()}</div>
              <div className="text-xs text-gray-300">Large (300m+)</div>
            </div>
            <div>
              <div className="text-xl font-bold text-orange-400">{statistics.size_categories.very_large.toLocaleString()}</div>
              <div className="text-xs text-gray-300">Very Large (1km+)</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Solar System Visualization */}
      <SolarSystemVisualization />

      {/* Help/Information Panel */}
      <div className="absolute bottom-4 right-4 bg-black/90 text-white p-4 rounded-xl border border-gray-600 max-w-sm z-10">
        <h3 className="text-lg font-bold mb-3 text-green-300">Navigation Help</h3>
        <div className="text-sm space-y-2">
          <div><strong>Mouse:</strong> Rotate view by dragging</div>
          <div><strong>Wheel:</strong> Zoom in/out</div>
          <div><strong>Right-click + drag:</strong> Pan view</div>
          <div><strong>Click objects:</strong> View details</div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-600">
          <h4 className="text-sm font-bold mb-2 text-yellow-300">Features</h4>
          <div className="text-xs space-y-1">
            <div>✓ Real-time NASA NEO data</div>
            <div>✓ 3D orbital mechanics</div>
            <div>✓ Interactive time controls</div>
            <div>✓ Hazard level visualization</div>
            <div>✓ Close approach predictions</div>
          </div>
        </div>

        {enableRealTimeData && (
          <div className="mt-4 pt-3 border-t border-gray-600">
            <h4 className="text-sm font-bold mb-2 text-cyan-300">Data Sources</h4>
            <div className="text-xs space-y-1">
              <div>• NASA NEO Web Service</div>
              <div>• JPL Small Bodies Database</div>
              <div>• Real-time orbital elements</div>
              <div>• Close approach calculations</div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
          <div className="bg-black/90 text-white p-6 rounded-xl border border-gray-600 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-lg font-bold">Loading NASA Data...</div>
            <div className="text-sm text-gray-400">Fetching latest NEO information</div>
          </div>
        </div>
      )}
    </div>
  );
};