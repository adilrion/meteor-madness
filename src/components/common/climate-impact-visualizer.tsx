"use client";

import { ClimateImpactService, type ClimateImpactData } from "@/lib/climate-impact-service";
import { AlertTriangle, Cloud, CloudRain, Snowflake, Sun, ThermometerSnowflake, TrendingDown } from "lucide-react";
import { useState } from "react";

export default function ClimateImpactVisualizer() {
  const scenarios = [
    { name: "Small (50m)", diameter: 0.05, energy: 2 },
    { name: "Medium (200m)", diameter: 0.2, energy: 50 },
    { name: "Large (500m)", diameter: 0.5, energy: 500 },
    { name: "Very Large (1km)", diameter: 1, energy: 5000 },
    { name: "Extinction (10km)", diameter: 10, energy: 100000000 },
  ];

  const [selectedScenario, setSelectedScenario] = useState(scenarios[2]);
  const [climateData, setClimateData] = useState<ClimateImpactData>(
    ClimateImpactService.calculateClimateImpact(
      selectedScenario.diameter,
      selectedScenario.energy
    )
  );

  const handleScenarioChange = (scenario: typeof scenarios[0]) => {
    setSelectedScenario(scenario);
    setClimateData(
      ClimateImpactService.calculateClimateImpact(
        scenario.diameter,
        scenario.energy
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minimal":
        return "text-green-400 bg-green-500/20 border-green-500/50";
      case "moderate":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
      case "severe":
        return "text-orange-400 bg-orange-500/20 border-orange-500/50";
      case "catastrophic":
        return "text-red-400 bg-red-500/20 border-red-500/50";
      case "extinction":
        return "text-purple-400 bg-purple-500/20 border-purple-500/50";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 rounded-3xl border border-purple-500/30">
      <div className="flex items-center gap-3 mb-6">
        <Cloud className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">
            Climate Chain Reaction Model
          </h2>
          <p className="text-gray-400 text-sm">
            Predict atmospheric and climate effects from asteroid
            impacts
          </p>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {scenarios.map((scenario) => (
          <button
            key={scenario.name}
            onClick={() => handleScenarioChange(scenario)}
            className={`p-4 rounded-xl border-2 transition ${selectedScenario.name === scenario.name
              ? "border-purple-500 bg-purple-500/20"
              : "border-gray-700 bg-gray-800 hover:border-gray-600"
              }`}
          >
            <div className="text-white font-bold text-sm">
              {scenario.name}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {scenario.energy < 1000
                ? `${scenario.energy} MT`
                : `${(scenario.energy / 1000000).toFixed(0)}M MT`}
            </div>
          </button>
        ))}
      </div>

      {/* Severity Badge */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${getSeverityColor(climateData.severity)}`}
      >
        <AlertTriangle className="w-5 h-5" />
        <span className="font-bold uppercase">
          {climateData.severity} IMPACT
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <ThermometerSnowflake className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">
              Temperature Drop
            </span>
          </div>
          <div className="text-3xl font-bold text-blue-400">
            -{climateData.temperatureDrop.toFixed(1)}°C
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">
              Sunlight Reduction
            </span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">
            {climateData.sunlightReduction.toFixed(0)}%
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Snowflake className="w-5 h-5 text-cyan-400" />
            <span className="text-gray-400 text-sm">
              Duration
            </span>
          </div>
          <div className="text-3xl font-bold text-cyan-400">
            {climateData.atmosphericDuration < 12
              ? `${climateData.atmosphericDuration.toFixed(0)} mo`
              : `${(climateData.atmosphericDuration / 12).toFixed(1)} yr`}
          </div>
        </div>
      </div>

      {/* Agricultural Impact */}
      <div className="bg-gradient-to-r from-amber-900/30 to-red-900/30 p-4 rounded-xl border border-amber-500/30 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="w-5 h-5 text-amber-400" />
          <h3 className="text-amber-400 font-bold">
            Agricultural Impact
          </h3>
        </div>
        <p className="text-white">{climateData.agriculturalImpact}</p>
      </div>

      {/* Global Effects */}
      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 mb-6">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-purple-400" />
          Global Environmental Effects
        </h3>
        <ul className="space-y-2">
          {climateData.globalEffects.map((effect, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-gray-300"
            >
              <span className="text-purple-400 mt-1">•</span>
              <span>{effect}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="text-white font-bold text-lg mb-4">
          Impact Timeline
        </h3>
        {climateData.timelinePhases.map((phase, idx) => (
          <div
            key={idx}
            className="relative pl-8 pb-6 border-l-2 border-purple-500/50 last:border-transparent"
          >
            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-500"></div>
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-purple-400 font-bold">
                  {phase.phase}
                </h4>
                <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">
                  {phase.timeframe}
                </span>
              </div>
              <ul className="space-y-1">
                {phase.effects.map((effect, effIdx) => (
                  <li
                    key={effIdx}
                    className="text-sm text-gray-400"
                  >
                    • {effect}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Comparison */}
      <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-xl border border-blue-500/30">
        <h3 className="text-blue-400 font-bold mb-2">
          Historical Comparison
        </h3>
        <p className="text-white">
          {ClimateImpactService.getHistoricalComparison(
            climateData.asteroidDiameter
          )}
        </p>
      </div>
    </div>
  );
}

