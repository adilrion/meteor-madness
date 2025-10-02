'use client';

import { OrbitControls, Sphere } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// Simplified types
interface AsteroidData {
  id: string;
  name: string;
  size: number;
  speed: number;
  impactLocation: { lat: number; lng: number; name: string };
  riskProbability: number;
  energyMT: number;
}

// Minimal asteroid data
const asteroids: AsteroidData[] = [
  {
    id: '1',
    name: 'Apophis',
    size: 370,
    speed: 7.4,
    impactLocation: { lat: 40.7, lng: -74.0, name: 'New York' },
    riskProbability: 0.000038,
    energyMT: 1150
  },
  {
    id: '2',
    name: 'Tunguska',
    size: 60,
    speed: 27,
    impactLocation: { lat: 51.5, lng: -0.1, name: 'London' },
    riskProbability: 0.01,
    energyMT: 12
  },
  {
    id: '3',
    name: 'City-Killer',
    size: 150,
    speed: 15,
    impactLocation: { lat: 37.7, lng: -122.4, name: 'San Francisco' },
    riskProbability: 0.001,
    energyMT: 85
  }
];

// Simple Earth component
function Earth({ impactLocation }: { impactLocation?: { lat: number; lng: number } }) {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.005;
    }
  });

  const getPosition = (lat: number, lng: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    );
  };

  return (
    <group>
      <Sphere ref={earthRef} args={[1, 32, 32]}>
        <meshStandardMaterial color="#4a90e2" />
      </Sphere>
      {impactLocation && (
        <Sphere position={getPosition(impactLocation.lat, impactLocation.lng)} args={[0.03, 8, 8]}>
          <meshBasicMaterial color="#ff0000" />
        </Sphere>
      )}
    </group>
  );
}

function AsteroidThreat() {
  const [selected, setSelected] = useState<AsteroidData>(asteroids[0]);

  const getRisk = (prob: number) => {
    if (prob >= 0.01) return { level: 'HIGH', color: '#ff0000' };
    if (prob >= 0.001) return { level: 'MEDIUM', color: '#ff6600' };
    return { level: 'LOW', color: '#00ff00' };
  };

  const risk = getRisk(selected.riskProbability);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <h1 className="text-3xl font-light text-center mb-8 text-gray-200">
          Asteroid Threat Assessment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Visualization */}
          <div className="bg-black rounded-lg h-96">
            <Canvas camera={{ position: [0, 0, 3] }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[5, 5, 5]} />
              <Earth impactLocation={selected.impactLocation} />
              <OrbitControls enableZoom enablePan enableRotate />
            </Canvas>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Asteroid Selection */}
            <div>
              <h2 className="text-lg font-medium mb-3 text-gray-300">Select Asteroid</h2>
              <div className="grid grid-cols-3 gap-2">
                {asteroids.map((asteroid) => (
                  <button
                    key={asteroid.id}
                    onClick={() => setSelected(asteroid)}
                    className={`p-3 rounded border text-sm transition-all ${selected.id === asteroid.id
                      ? 'border-blue-400 bg-blue-900/30'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                      }`}
                  >
                    <div className="font-medium">{asteroid.name}</div>
                    <div className="text-xs text-gray-400">{asteroid.size}m</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Key Stats */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Size</div>
                  <div className="text-xl font-light">{selected.size}m</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Speed</div>
                  <div className="text-xl font-light">{selected.speed} km/s</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Energy</div>
                  <div className="text-xl font-light">{selected.energyMT} MT</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Target</div>
                  <div className="text-xl font-light">{selected.impactLocation.name}</div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Risk Level</div>
              <div
                className="inline-block px-4 py-2 rounded text-black font-medium"
                style={{ backgroundColor: risk.color }}
              >
                {risk.level}
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-400">Impact Probability</div>
                <div className="text-lg">{(selected.riskProbability * 100).toExponential(2)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-8 bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-medium text-gray-300">Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Energy</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Risk</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Target</th>
                </tr>
              </thead>
              <tbody>
                {asteroids.map((asteroid) => {
                  const riskLevel = getRisk(asteroid.riskProbability);
                  return (
                    <tr
                      key={asteroid.id}
                      className={`border-t border-gray-700 hover:bg-gray-700/50 cursor-pointer ${selected.id === asteroid.id ? 'bg-blue-900/20' : ''
                        }`}
                      onClick={() => setSelected(asteroid)}
                    >
                      <td className="px-4 py-3 font-medium">{asteroid.name}</td>
                      <td className="px-4 py-3 text-gray-300">{asteroid.size}m</td>
                      <td className="px-4 py-3 text-gray-300">{asteroid.energyMT} MT</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-black"
                          style={{ backgroundColor: riskLevel.color }}
                        >
                          {riskLevel.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{asteroid.impactLocation.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AsteroidThreat;