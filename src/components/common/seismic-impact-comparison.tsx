"use client";

import { OrbitalMechanics } from "@/lib/orbital-mechanics";
import { SeismicImpactService } from "@/lib/seismic-impact-service";
import { Activity, AlertCircle, MapPin, TrendingUp, Users, Waves } from "lucide-react";
import { useState } from "react";

interface ImpactScenario {
  name: string;
  diameter: number; // km
  velocity: number; // km/s
  density: number; // kg/m³
  location: string;
  populationDensity: number; // people per km²
  isOcean: boolean;
}

const SCENARIOS: ImpactScenario[] = [
  {
    name: "Small City Threat",
    diameter: 0.05,
    velocity: 18,
    density: 2500,
    location: "Small City",
    populationDensity: 1000,
    isOcean: false
  },
  {
    name: "Tunguska-Class",
    diameter: 0.06,
    velocity: 27,
    density: 2000,
    location: "Rural Area",
    populationDensity: 10,
    isOcean: false
  },
  {
    name: "Chelyabinsk-Class",
    diameter: 0.02,
    velocity: 19,
    density: 3300,
    location: "Urban Area",
    populationDensity: 2500,
    isOcean: false
  },
  {
    name: "Metropolitan Threat",
    diameter: 0.2,
    velocity: 20,
    density: 2800,
    location: "Major City",
    populationDensity: 5000,
    isOcean: false
  },
  {
    name: "Regional Catastrophe",
    diameter: 0.5,
    velocity: 25,
    density: 2600,
    location: "Metropolitan Area",
    populationDensity: 3500,
    isOcean: false
  },
  {
    name: "Ocean Impact",
    diameter: 0.3,
    velocity: 22,
    density: 2500,
    location: "Pacific Ocean",
    populationDensity: 0,
    isOcean: true
  }
];

export default function SeismicImpactComparison() {
  const [selectedScenario, setSelectedScenario] = useState<ImpactScenario>(SCENARIOS[0]);

  // Calculate impact parameters
  const mass = OrbitalMechanics.calculateMass(selectedScenario.diameter, selectedScenario.density);
  const energyMT = OrbitalMechanics.calculateImpactEnergy(mass, selectedScenario.velocity);
  const craterDiameter = OrbitalMechanics.calculateCraterDiameter(
    selectedScenario.diameter,
    selectedScenario.velocity,
    selectedScenario.density
  );

  // Get seismic comparison
  const seismicData = SeismicImpactService.getSeismicComparison(
    energyMT,
    selectedScenario.diameter,
    selectedScenario.isOcean
  );

  // Get historical comparisons
  const historicalImpact = SeismicImpactService.compareToHistoricalImpact(energyMT);
  const historicalEQ = SeismicImpactService.findSimilarEarthquake(seismicData.equivalentMagnitude);

  // Calculate casualties
  const casualties = SeismicImpactService.estimateCasualties(
    energyMT,
    selectedScenario.populationDensity
  );

  // Get shockwave radii
  const shockwave = SeismicImpactService.estimateShockwaveRadius(energyMT);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Activity className="w-10 h-10 text-orange-400" />
          Seismic Impact Analysis
        </h2>
        <p className="text-gray-400">Compare asteroid impacts to earthquake magnitudes</p>
      </div>

      {/* Scenario Selection */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Select Impact Scenario</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => setSelectedScenario(scenario)}
              className={`p-4 rounded-lg border transition-all ${selectedScenario.name === scenario.name
                  ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/50'
                  : 'bg-slate-800 border-slate-600 hover:border-slate-500'
                }`}
            >
              <div className="text-sm font-bold text-white mb-1">{scenario.name}</div>
              <div className="text-xs text-gray-400">{(scenario.diameter * 1000).toFixed(0)}m</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Energy */}
        <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border border-orange-500/30 rounded-xl p-6">
          <AlertCircle className="w-8 h-8 text-orange-400 mb-3" />
          <h3 className="text-gray-400 text-sm font-medium mb-2">Impact Energy</h3>
          <p className="text-3xl font-bold text-white">{energyMT.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Megatons TNT</p>
        </div>

        {/* Magnitude */}
        <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-500/30 rounded-xl p-6">
          <Activity className="w-8 h-8 text-red-400 mb-3" />
          <h3 className="text-gray-400 text-sm font-medium mb-2">Seismic Magnitude</h3>
          <p className="text-3xl font-bold text-white">{seismicData.equivalentMagnitude.toFixed(1)}</p>
          <p className="text-xs text-gray-400 mt-1">Moment Magnitude</p>
        </div>

        {/* Crater */}
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-xl p-6">
          <MapPin className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-gray-400 text-sm font-medium mb-2">Crater Diameter</h3>
          <p className="text-3xl font-bold text-white">{craterDiameter.toFixed(1)}</p>
          <p className="text-xs text-gray-400 mt-1">Kilometers</p>
        </div>

        {/* Casualties */}
        <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-500/30 rounded-xl p-6">
          <Users className="w-8 h-8 text-red-400 mb-3" />
          <h3 className="text-gray-400 text-sm font-medium mb-2">Est. Casualties</h3>
          <p className="text-3xl font-bold text-white">
            {casualties.deaths.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Deaths</p>
        </div>
      </div>

      {/* Seismic Description */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-orange-400" />
          Seismic Effects
        </h3>
        <p className="text-gray-300 text-lg mb-4">{seismicData.description}</p>
        <p className="text-gray-400">{casualties.description}</p>
      </div>

      {/* Shockwave Zones */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          Destruction Zones
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 text-right">
              <span className="text-white font-bold">{shockwave.totalDestruction.toFixed(1)} km</span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-400 mb-1">Total Destruction (95% fatality)</div>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div className="bg-red-600 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 text-right">
              <span className="text-white font-bold">{shockwave.severeDestruction.toFixed(1)} km</span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-400 mb-1">Severe Destruction (15% fatality)</div>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div className="bg-orange-600 h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 text-right">
              <span className="text-white font-bold">{shockwave.moderateDestruction.toFixed(1)} km</span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-400 mb-1">Moderate Destruction (2% fatality)</div>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div className="bg-yellow-600 h-full rounded-full" style={{ width: '50%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 text-right">
              <span className="text-white font-bold">{shockwave.glassBreakage.toFixed(1)} km</span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-400 mb-1">Glass Breakage</div>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earthquake Comparison */}
        {historicalEQ && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-yellow-400" />
              Similar Earthquake
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Event:</span>
                <span className="text-white ml-2 font-bold">{historicalEQ.name}</span>
              </div>
              <div>
                <span className="text-gray-400">Year:</span>
                <span className="text-white ml-2">{historicalEQ.year}</span>
              </div>
              <div>
                <span className="text-gray-400">Location:</span>
                <span className="text-white ml-2">{historicalEQ.location}</span>
              </div>
              <div>
                <span className="text-gray-400">Magnitude:</span>
                <span className="text-white ml-2 font-bold">{historicalEQ.magnitude.toFixed(1)}</span>
              </div>
              <p className="text-sm text-gray-400 mt-3">{historicalEQ.description}</p>
            </div>
          </div>
        )}

        {/* Impact Comparison */}
        {historicalImpact && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-400" />
              Similar Impact Event
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Event:</span>
                <span className="text-white ml-2 font-bold">{historicalImpact.name}</span>
              </div>
              <div>
                <span className="text-gray-400">Year:</span>
                <span className="text-white ml-2">
                  {historicalImpact.year < 0
                    ? `${Math.abs(historicalImpact.year).toLocaleString()} years ago`
                    : historicalImpact.year}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Location:</span>
                <span className="text-white ml-2">{historicalImpact.location}</span>
              </div>
              <div>
                <span className="text-gray-400">Energy:</span>
                <span className="text-white ml-2 font-bold">{historicalImpact.energyMT.toLocaleString()} MT</span>
              </div>
              <p className="text-sm text-gray-400 mt-3">{historicalImpact.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tsunami Risk */}
      {selectedScenario.isOcean && (
        <div className={`border rounded-xl p-6 ${seismicData.tsunamiRisk === 'extreme' ? 'bg-red-900/30 border-red-500' :
            seismicData.tsunamiRisk === 'high' ? 'bg-orange-900/30 border-orange-500' :
              seismicData.tsunamiRisk === 'moderate' ? 'bg-yellow-900/30 border-yellow-500' :
                'bg-blue-900/30 border-blue-500'
          }`}>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Waves className="w-6 h-6" />
            Tsunami Risk Assessment
          </h3>
          <div className="flex items-center gap-4">
            <div className={`px-6 py-3 rounded-lg font-bold text-xl ${seismicData.tsunamiRisk === 'extreme' ? 'bg-red-600' :
                seismicData.tsunamiRisk === 'high' ? 'bg-orange-600' :
                  seismicData.tsunamiRisk === 'moderate' ? 'bg-yellow-600' :
                    'bg-blue-600'
              }`}>
              {seismicData.tsunamiRisk.toUpperCase()}
            </div>
            <p className="text-gray-300">
              Ocean impact could generate devastating tsunami waves affecting coastal regions thousands of kilometers away.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

