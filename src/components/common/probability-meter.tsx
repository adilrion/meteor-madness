'use client';

import React, { useEffect, useState } from 'react';

interface ProbabilityMeterProps {
  baseProbability: number;
  timeframe: number;
  onTimeframeChange: (value: number) => void;
}

export const ProbabilityMeter: React.FC<ProbabilityMeterProps> = ({
  baseProbability,
  timeframe,
  onTimeframeChange
}) => {
  const [animatedProbability, setAnimatedProbability] = useState(0);

  const adjustedProbability = baseProbability * (timeframe / 100);
  const probabilityPercent = adjustedProbability * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProbability(adjustedProbability);
    }, 100);
    return () => clearTimeout(timer);
  }, [adjustedProbability]);

  const getRiskColor = (prob: number) => {
    if (prob >= 0.01) return '#ff0000';
    if (prob >= 0.001) return '#ff6600';
    if (prob >= 0.0001) return '#ffaa00';
    if (prob >= 0.00001) return '#ffff00';
    return '#00ff00';
  };

  const riskColor = getRiskColor(adjustedProbability);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Impact Probability Calculator</h3>

      {/* Time Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Time Period: {timeframe} years
        </label>
        <input
          type="range"
          min="1"
          max="1000"
          value={timeframe}
          onChange={(e) => onTimeframeChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 year</span>
          <span>500 years</span>
          <span>1000 years</span>
        </div>
      </div>

      {/* Probability Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-2" style={{ color: riskColor }}>
          {probabilityPercent < 0.001
            ? adjustedProbability.toExponential(2)
            : probabilityPercent.toFixed(4)
          }%
        </div>
        <div className="text-gray-300">
          Chance of impact in next {timeframe} years
        </div>
      </div>

      {/* Visual Meter */}
      <div className="relative">
        <div className="w-full h-8 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-out rounded-full"
            style={{
              width: `${Math.min(animatedProbability * 100000, 100)}%`,
              backgroundColor: riskColor,
              boxShadow: `0 0 10px ${riskColor}`
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>0%</span>
          <span>Extremely Low</span>
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="mt-4 p-3 rounded" style={{ backgroundColor: `${riskColor}20` }}>
        <div className="flex items-center justify-center">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: riskColor }}
          />
          <span className="font-semibold" style={{ color: riskColor }}>
            {adjustedProbability >= 0.01 ? 'CRITICAL RISK' :
              adjustedProbability >= 0.001 ? 'HIGH RISK' :
                adjustedProbability >= 0.0001 ? 'MODERATE RISK' :
                  adjustedProbability >= 0.00001 ? 'LOW RISK' : 'MINIMAL RISK'}
          </span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 text-sm text-gray-400">
        <p>
          • 1 in {Math.round(1 / adjustedProbability).toLocaleString()} chance
        </p>
        <p>
          • Base annual probability: {(baseProbability * 100).toExponential(2)}%
        </p>
      </div>
    </div>
  );
};

export default ProbabilityMeter;
