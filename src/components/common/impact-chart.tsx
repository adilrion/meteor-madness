'use client';

import React from 'react';

interface ImpactData {
  name: string;
  value: number;
  color: string;
  unit: string;
}

interface ImpactChartProps {
  data: ImpactData[];
  title: string;
}

export const ImpactChart: React.FC<ImpactChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{item.name}</span>
                <span className="text-white font-semibold">
                  {item.value.toLocaleString()} {item.unit}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImpactChart;
