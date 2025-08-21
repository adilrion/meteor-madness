'use client';

import { MeteorUtils } from '@/lib/meteor-utils';
import {
  Activity,
  AlertTriangle,
  Clock,
  MapPin,
  Radar,
  Target,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface MeteorMadnessData {
  riskLevel: 'Low' | 'Medium' | 'High';
  predictedPath: { lat: number; lon: number }[];
  detectingStations: string[];
  spectralData?: string;
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  mass: number;
  timestamp: Date;
  shower?: string;
}

const MeteorMadnessDashboard = () => {
  const [meteorData, setMeteorData] = useState<MeteorMadnessData[]>([]);
  const [currentActivity, setCurrentActivity] = useState<{
    level: 'Quiet' | 'Normal' | 'Active' | 'High' | 'Extreme';
    meteorsPerHour: number;
    description: string;
    color: string;
  } | null>(null);
  const [selectedMeteor, setSelectedMeteor] = useState<MeteorMadnessData | null>(null);

  useEffect(() => {
    // Load meteor madness data
    const data = MeteorUtils.getMeteorMadnessData();
    setMeteorData(data);

    // Load current activity
    const activity = MeteorUtils.getCurrentActivityLevel();
    setCurrentActivity(activity);

    // Update activity every 30 seconds
    const interval = setInterval(() => {
      const newActivity = MeteorUtils.getCurrentActivityLevel();
      setCurrentActivity(newActivity);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white p-6 rounded-xl border border-purple-500/20">
      <div className="flex items-center space-x-2 mb-6">
        <Radar className="w-6 h-6 text-purple-400 animate-spin" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Meteor Madness Live Dashboard
        </h2>
      </div>

      {/* Current Activity Status */}
      {currentActivity && (
        <div className="bg-black/30 rounded-lg p-4 mb-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity className={`w-5 h-5 ${currentActivity.color}`} />
              <span className="font-semibold">Global Activity Level: {currentActivity.level}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentActivity.meteorsPerHour}</div>
              <div className="text-xs text-gray-400">meteors/hour</div>
            </div>
          </div>
          <p className="text-gray-300 text-sm">{currentActivity.description}</p>
        </div>
      )}

      {/* Meteor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {meteorData.slice(0, 6).map((meteor) => (
          <div
            key={meteor.id}
            className={`bg-black/30 rounded-lg p-4 border cursor-pointer transition-all duration-300 hover:scale-105 ${selectedMeteor?.id === meteor.id ? 'border-purple-400 bg-purple-500/10' : 'border-gray-700/50'
              }`}
            onClick={() => setSelectedMeteor(meteor)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">{meteor.name}</span>
              <div className={`px-2 py-1 rounded text-xs border ${getRiskColor(meteor.riskLevel)}`}>
                {meteor.riskLevel}
              </div>
            </div>

            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{meteor.latitude.toFixed(1)}°, {meteor.longitude.toFixed(1)}°</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>{meteor.velocity.toFixed(1)} km/s</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3" />
                <span>{(meteor.altitude / 1000).toFixed(0)} km alt</span>
              </div>
              {meteor.shower && (
                <div className="text-purple-300 font-medium">{meteor.shower}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Meteor Details */}
      {selectedMeteor && (
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-6 border border-purple-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold">Detailed Analysis: {selectedMeteor.name}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Physical Properties</h4>
              <div className="space-y-2 text-sm">
                <div>Velocity: <span className="text-white font-mono">{selectedMeteor.velocity.toFixed(1)} km/s</span></div>
                <div>Mass: <span className="text-white font-mono">{selectedMeteor.mass > 0.001 ? `${(selectedMeteor.mass * 1000).toFixed(0)}g` : `${(selectedMeteor.mass * 1000000).toFixed(1)}mg`}</span></div>
                <div>Altitude: <span className="text-white font-mono">{(selectedMeteor.altitude / 1000).toFixed(0)} km</span></div>
                <div>Risk Level: <span className={`font-semibold ${selectedMeteor.riskLevel === 'High' ? 'text-red-400' :
                    selectedMeteor.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                  }`}>{selectedMeteor.riskLevel}</span></div>
                {selectedMeteor.spectralData && (
                  <div>Composition: <span className="text-cyan-400">{selectedMeteor.spectralData}</span></div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Detection Network</h4>
              <div className="space-y-1">
                {selectedMeteor.detectingStations.map((station, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">{station}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h4 className="text-purple-400 font-semibold mb-2">Detection Time</h4>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{selectedMeteor.timestamp.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-purple-500/20">
            <h4 className="text-purple-400 font-semibold mb-2">Predicted Trajectory</h4>
            <div className="text-sm text-gray-300">
              Path: {selectedMeteor.predictedPath.length} waypoints tracked from entry to burnup
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-6 text-xs text-gray-400">
        Click on any meteor above to view detailed analysis • Data updates every 30 seconds
      </div>
    </div>
  );
};

export default MeteorMadnessDashboard;
