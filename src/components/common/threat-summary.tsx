'use client';

import React from 'react';

interface ThreatSummaryProps {
  selectedAsteroid: {
    name: string;
    size: number;
    mass: number;
    speed: number;
    riskProbability: number;
    impactLocation: { name: string };
  };
  scenario: {
    energyRelease: number;
    deaths: number;
    economicLoss: number;
  };
}

export const ThreatSummary: React.FC<ThreatSummaryProps> = ({ selectedAsteroid, scenario }) => {
  const getImpactFrequency = (size: number) => {
    if (size >= 10000) return "Every 100+ million years";
    if (size >= 1000) return "Every 500,000 - 1 million years";
    if (size >= 500) return "Every 100,000 - 500,000 years";
    if (size >= 100) return "Every 1,000 - 10,000 years";
    if (size >= 50) return "Every 100 - 1,000 years";
    return "Every 10 - 100 years";
  };

  const getThreatLevel = () => {
    if (selectedAsteroid.riskProbability >= 0.01) return { level: "EXTINCTION EVENT", color: "#ff0000", icon: "☠️" };
    if (selectedAsteroid.riskProbability >= 0.001) return { level: "GLOBAL CATASTROPHE", color: "#ff3300", icon: "🌍" };
    if (selectedAsteroid.riskProbability >= 0.0001) return { level: "REGIONAL DEVASTATION", color: "#ff6600", icon: "🏙️" };
    if (selectedAsteroid.riskProbability >= 0.00001) return { level: "LOCAL DISASTER", color: "#ffaa00", icon: "🏢" };
    return { level: "MINIMAL THREAT", color: "#00ff00", icon: "✅" };
  };

  const threat = getThreatLevel();

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Threat Assessment Summary</h2>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{threat.icon}</span>
          <span
            className="px-3 py-1 rounded-full text-sm font-bold text-black"
            style={{ backgroundColor: threat.color }}
          >
            {threat.level}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-400">{selectedAsteroid.size}m</div>
          <div className="text-sm text-gray-400">Diameter</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-400">{selectedAsteroid.speed}</div>
          <div className="text-sm text-gray-400">km/s</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-yellow-400">{scenario.energyRelease.toFixed(1)}</div>
          <div className="text-sm text-gray-400">Megatons TNT</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-red-400">{(scenario.deaths / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-gray-400">Potential Deaths</div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-bold text-white mb-3">Key Facts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-blue-400">🎯</span>
            <div>
              <div className="font-semibold">Impact Location</div>
              <div className="text-gray-300">{selectedAsteroid.impactLocation.name}</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-400">📊</span>
            <div>
              <div className="font-semibold">Historical Frequency</div>
              <div className="text-gray-300">{getImpactFrequency(selectedAsteroid.size)}</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-400">⚡</span>
            <div>
              <div className="font-semibold">Kinetic Energy</div>
              <div className="text-gray-300">{(selectedAsteroid.mass * Math.pow(selectedAsteroid.speed, 2) / 2 / 1e12).toFixed(1)} TJ</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-red-400">💰</span>
            <div>
              <div className="font-semibold">Economic Impact</div>
              <div className="text-gray-300">${scenario.economicLoss.toFixed(0)}B+ USD</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
        <h4 className="font-bold text-yellow-400 mb-2">⚠️ Important Notes</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• These are theoretical calculations based on current scientific models</li>
          <li>• Actual impact effects depend on many variables including atmospheric entry angle, composition, and local geography</li>
          <li>• Modern detection systems provide early warning for most potentially hazardous objects</li>
          <li>• International space agencies actively monitor and track near-Earth objects</li>
        </ul>
      </div>
    </div>
  );
};

export default ThreatSummary;
