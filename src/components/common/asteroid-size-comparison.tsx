'use client';

import React from 'react';

interface AsteroidSizeComparisonProps {
  selectedAsteroid: {
    name: string;
    size: number;
  };
  asteroids: Array<{
    id: string;
    name: string;
    size: number;
  }>;
}

export const AsteroidSizeComparison: React.FC<AsteroidSizeComparisonProps> = ({
  selectedAsteroid,
  asteroids
}) => {
  // Reference objects for scale comparison
  const referenceObjects = [
    { name: 'Human', size: 2, color: '#00ff00' },
    { name: 'Car', size: 5, color: '#0066ff' },
    { name: 'House', size: 15, color: '#ff6600' },
    { name: 'Football Field', size: 100, color: '#ffaa00' },
    { name: 'Empire State Building', size: 380, color: '#ff0066' },
    { name: 'Mount Everest', size: 8848, color: '#8800ff' }
  ];

  const allObjects = [...referenceObjects, ...asteroids.map(a => ({
    name: a.name,
    size: a.size,
    color: a.name === selectedAsteroid.name ? '#ff0000' : '#888888'
  }))];

  // Sort by size
  allObjects.sort((a, b) => a.size - b.size);

  const maxSize = Math.max(...allObjects.map(obj => obj.size));

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold text-white mb-4">Size Comparison</h3>
      <div className="space-y-3">
        {allObjects.map((obj, index) => {
          const widthPercent = Math.max((obj.size / maxSize) * 100, 2); // Minimum 2% visibility
          const isSelected = obj.name === selectedAsteroid.name;

          return (
            <div key={index} className={`space-y-1 ${isSelected ? 'ring-2 ring-yellow-400 p-2 rounded' : ''}`}>
              <div className="flex justify-between text-sm">
                <span className={`${isSelected ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}>
                  {obj.name}
                </span>
                <span className="text-white font-semibold">
                  {obj.size >= 1000 ? `${(obj.size / 1000).toFixed(1)}km` : `${obj.size}m`}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-1000 ease-out flex items-center justify-center"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: obj.color,
                    boxShadow: isSelected ? `0 0 10px ${obj.color}` : 'none'
                  }}
                >
                  {isSelected && (
                    <span className="text-xs font-bold text-black px-1">
                      {selectedAsteroid.name}
                    </span>
                  )}
                </div>
              </div>
              {obj.size >= 1000 && (
                <div className="text-xs text-gray-500">
                  Scale: {(obj.size / maxSize * 100).toFixed(1)}% of largest object
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-gray-700 rounded text-sm">
        <p className="text-gray-300">
          <strong className="text-yellow-400">{selectedAsteroid.name}</strong> is{' '}
          {selectedAsteroid.size > 380 ?
            `${Math.round(selectedAsteroid.size / 380)} times larger than the Empire State Building` :
            selectedAsteroid.size > 100 ?
              `${Math.round(selectedAsteroid.size / 100)} times larger than a football field` :
              selectedAsteroid.size > 15 ?
                `${Math.round(selectedAsteroid.size / 15)} times larger than a house` :
                'smaller than typical buildings'
          }
        </p>
      </div>
    </div>
  );
};

export default AsteroidSizeComparison;
