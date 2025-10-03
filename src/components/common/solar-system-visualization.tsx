'use client';

import { Line, OrbitControls, Sphere, Stars, Text } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// Astronomical constants
const AU = 1; // 1 Astronomical Unit as base unit
const EARTH_RADIUS = 0.02;
const SUN_RADIUS = 0.1;

// Planet data with realistic orbital parameters
interface PlanetData {
  name: string;
  radius: number;
  orbitRadius: number; // in AU
  orbitSpeed: number; // degrees per day
  color: string;
  texture?: string;
  moons?: MoonData[];
  inclination: number; // orbital inclination in degrees
  eccentricity: number;
}

interface MoonData {
  name: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  color: string;
}

interface AsteroidData {
  id: string;
  name: string;
  orbitRadius: number; // semi-major axis in AU
  eccentricity: number;
  inclination: number; // degrees
  orbitSpeed: number; // degrees per day
  size: number;
  hazardLevel: 'low' | 'medium' | 'high' | 'critical';
  closeApproachDate?: Date;
  closeApproachDistance?: number; // in AU
  velocity: number; // km/s
  absoluteMagnitude: number;
  description: string;
}

interface CometData {
  id: string;
  name: string;
  orbitRadius: number;
  eccentricity: number;
  inclination: number;
  orbitSpeed: number;
  size: number;
  nextPerihelion?: Date;
  orbitalPeriod: number; // years
  tailLength: number;
  description: string;
}

const PLANETS: PlanetData[] = [
  {
    name: 'Mercury',
    radius: 0.015,
    orbitRadius: 0.39 * AU,
    orbitSpeed: 4.15, // degrees per day
    color: '#8c7853',
    inclination: 7.0,
    eccentricity: 0.206
  },
  {
    name: 'Venus',
    radius: 0.018,
    orbitRadius: 0.72 * AU,
    orbitSpeed: 1.62,
    color: '#ffc649',
    inclination: 3.4,
    eccentricity: 0.007
  },
  {
    name: 'Earth',
    radius: EARTH_RADIUS,
    orbitRadius: 1.0 * AU,
    orbitSpeed: 0.986,
    color: '#6b93d6',
    inclination: 0.0,
    eccentricity: 0.017,
    moons: [{
      name: 'Moon',
      radius: 0.005,
      orbitRadius: 0.08,
      orbitSpeed: 13.2,
      color: '#c8c8c8'
    }]
  },
  {
    name: 'Mars',
    radius: 0.012,
    orbitRadius: 1.52 * AU,
    orbitSpeed: 0.524,
    color: '#cd5c5c',
    inclination: 1.9,
    eccentricity: 0.094
  },
  {
    name: 'Jupiter',
    radius: 0.08,
    orbitRadius: 5.20 * AU,
    orbitSpeed: 0.083,
    color: '#d8ca9d',
    inclination: 1.3,
    eccentricity: 0.049
  },
  {
    name: 'Saturn',
    radius: 0.07,
    orbitRadius: 9.58 * AU,
    orbitSpeed: 0.034,
    color: '#fad5a5',
    inclination: 2.5,
    eccentricity: 0.057
  }
];

const ASTEROIDS: AsteroidData[] = [
  {
    id: 'apophis',
    name: '99942 Apophis',
    orbitRadius: 0.92,
    eccentricity: 0.191,
    inclination: 3.33,
    orbitSpeed: 1.1,
    size: 0.003,
    hazardLevel: 'high',
    closeApproachDate: new Date('2029-04-13'),
    closeApproachDistance: 0.00025, // ~37,000 km
    velocity: 30.7,
    absoluteMagnitude: 19.7,
    description: 'Potentially hazardous asteroid with close approach in 2029'
  },
  {
    id: 'bennu',
    name: '101955 Bennu',
    orbitRadius: 1.13,
    eccentricity: 0.204,
    inclination: 6.03,
    orbitSpeed: 0.93,
    size: 0.002,
    hazardLevel: 'medium',
    closeApproachDate: new Date('2135-09-25'),
    closeApproachDistance: 0.002,
    velocity: 28.0,
    absoluteMagnitude: 20.9,
    description: 'OSIRIS-REx target asteroid with potential Earth impact risk in 22nd century'
  },
  {
    id: 'ryugu',
    name: '162173 Ryugu',
    orbitRadius: 1.19,
    eccentricity: 0.190,
    inclination: 5.88,
    orbitSpeed: 0.85,
    size: 0.001,
    hazardLevel: 'low',
    velocity: 26.3,
    absoluteMagnitude: 21.1,
    description: 'Hayabusa2 target asteroid, diamond-shaped near-Earth object'
  },
  {
    id: 'didymos',
    name: '65803 Didymos',
    orbitRadius: 1.64,
    eccentricity: 0.384,
    inclination: 3.41,
    orbitSpeed: 0.61,
    size: 0.0015,
    hazardLevel: 'medium',
    velocity: 23.8,
    absoluteMagnitude: 18.1,
    description: 'Binary asteroid system, target of DART mission'
  },
  {
    id: 'eros',
    name: '433 Eros',
    orbitRadius: 1.46,
    eccentricity: 0.223,
    inclination: 10.83,
    orbitSpeed: 0.69,
    size: 0.004,
    hazardLevel: 'low',
    velocity: 24.4,
    absoluteMagnitude: 11.2,
    description: 'Large near-Earth asteroid, first to be orbited by spacecraft'
  }
];

const COMETS: CometData[] = [
  {
    id: 'halley',
    name: '1P/Halley',
    orbitRadius: 17.8,
    eccentricity: 0.967,
    inclination: 162.3,
    orbitSpeed: 0.01,
    size: 0.008,
    nextPerihelion: new Date('2061-07-28'),
    orbitalPeriod: 75,
    tailLength: 2.0,
    description: 'Most famous periodic comet, visible from Earth every 75-76 years'
  },
  {
    id: 'encke',
    name: '2P/Encke',
    orbitRadius: 2.21,
    eccentricity: 0.848,
    inclination: 11.8,
    orbitSpeed: 0.2,
    size: 0.002,
    nextPerihelion: new Date('2024-10-22'),
    orbitalPeriod: 3.3,
    tailLength: 0.5,
    description: 'Short-period comet with shortest known orbital period'
  },
  {
    id: 'machholz',
    name: '96P/Machholz',
    orbitRadius: 3.0,
    eccentricity: 0.959,
    inclination: 60.0,
    orbitSpeed: 0.15,
    size: 0.003,
    nextPerihelion: new Date('2027-01-31'),
    orbitalPeriod: 5.3,
    tailLength: 1.2,
    description: 'Highly inclined comet with unusual chemical composition'
  }
];

interface ViewPreset {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
  description: string;
}

const VIEW_PRESETS: ViewPreset[] = [
  {
    name: 'Overview',
    position: [0, 10, 10],
    target: [0, 0, 0],
    description: 'Complete solar system overview'
  },
  {
    name: 'Inner System',
    position: [0, 3, 3],
    target: [0, 0, 0],
    description: 'Focus on inner planets'
  },
  {
    name: 'Earth View',
    position: [1.5, 0.5, 1.5],
    target: [1, 0, 0],
    description: 'View from Earth perspective'
  },
  {
    name: 'Asteroid Belt',
    position: [0, 5, 8],
    target: [2, 0, 0],
    description: 'Asteroid belt and Mars orbit'
  },
  {
    name: 'Top Down',
    position: [0, 15, 0],
    target: [0, 0, 0],
    description: 'Solar system plane view'
  }
];

// Planet component
const Planet: React.FC<{
  data: PlanetData;
  time: number;
  selected: boolean;
  onSelect: () => void;
  showOrbit: boolean;
}> = ({ data, time, selected, onSelect, showOrbit }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Calculate orbital position
  const angle = (time * data.orbitSpeed * Math.PI) / 180;
  const x = data.orbitRadius * Math.cos(angle);
  const z = data.orbitRadius * Math.sin(angle);
  const y = Math.sin(angle) * Math.sin(data.inclination * Math.PI / 180) * 0.1;

  // Create orbit path points
  const orbitPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const ox = data.orbitRadius * Math.cos(a);
      const oz = data.orbitRadius * Math.sin(a);
      const oy = Math.sin(a) * Math.sin(data.inclination * Math.PI / 180) * 0.1;
      points.push(new THREE.Vector3(ox, oy, oz));
    }
    return points;
  }, [data.orbitRadius, data.inclination]);

  return (
    <group>
      {/* Orbit line */}
      {showOrbit && (
        <Line
          points={orbitPoints}
          color={selected ? '#ffff00' : data.color}
          lineWidth={selected ? 3 : 1}
          transparent
          opacity={0.6}
        />
      )}

      {/* Planet */}
      <Sphere
        ref={meshRef}
        position={[x, y, z]}
        args={[data.radius, 32, 32]}
        onClick={onSelect}
      >
        <meshStandardMaterial
          color={data.color}
          emissive={data.name === 'Sun' ? data.color : '#000000'}
          emissiveIntensity={data.name === 'Sun' ? 0.3 : 0}
        />
      </Sphere>

      {/* Planet label */}
      <Text
        position={[x, y + data.radius + 0.1, z]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {data.name}
      </Text>

      {/* Moons */}
      {data.moons?.map((moon, index) => {
        const moonAngle = (time * moon.orbitSpeed * Math.PI) / 180;
        const moonX = x + moon.orbitRadius * Math.cos(moonAngle);
        const moonZ = z + moon.orbitRadius * Math.sin(moonAngle);

        return (
          <Sphere
            key={index}
            position={[moonX, y, moonZ]}
            args={[moon.radius, 16, 16]}
          >
            <meshStandardMaterial color={moon.color} />
          </Sphere>
        );
      })}
    </group>
  );
};

// Asteroid component
const Asteroid: React.FC<{
  data: AsteroidData;
  time: number;
  selected: boolean;
  onSelect: () => void;
  showOrbit: boolean;
}> = ({ data, time, selected, onSelect, showOrbit }) => {
  const angle = (time * data.orbitSpeed * Math.PI) / 180;
  const x = data.orbitRadius * Math.cos(angle);
  const z = data.orbitRadius * Math.sin(angle);

  const hazardColors = {
    low: '#00ff00',
    medium: '#ffff00',
    high: '#ff8800',
    critical: '#ff0000'
  };

  const orbitPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const ox = data.orbitRadius * Math.cos(a);
      const oz = data.orbitRadius * Math.sin(a);
      points.push(new THREE.Vector3(ox, 0, oz));
    }
    return points;
  }, [data.orbitRadius]);

  return (
    <group>
      {showOrbit && (
        <Line
          points={orbitPoints}
          color={hazardColors[data.hazardLevel]}
          lineWidth={selected ? 2 : 1}
          transparent
          opacity={0.4}
        />
      )}

      <Sphere
        position={[x, 0, z]}
        args={[data.size, 8, 8]}
        onClick={onSelect}
      >
        <meshStandardMaterial
          color={hazardColors[data.hazardLevel]}
          emissive={hazardColors[data.hazardLevel]}
          emissiveIntensity={selected ? 0.3 : 0.1}
        />
      </Sphere>

      {selected && (
        <Text
          position={[x, data.size + 0.05, z]}
          fontSize={0.05}
          color="white"
          anchorX="center"
        >
          {data.name}
        </Text>
      )}
    </group>
  );
};

// Comet component
const Comet: React.FC<{
  data: CometData;
  time: number;
  selected: boolean;
  onSelect: () => void;
  showOrbit: boolean;
}> = ({ data, time, selected, onSelect, showOrbit }) => {
  const angle = (time * data.orbitSpeed * Math.PI) / 180;
  const x = data.orbitRadius * Math.cos(angle);
  const z = data.orbitRadius * Math.sin(angle);

  const orbitPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const ox = data.orbitRadius * Math.cos(a);
      const oz = data.orbitRadius * Math.sin(a);
      points.push(new THREE.Vector3(ox, 0, oz));
    }
    return points;
  }, [data.orbitRadius]);

  return (
    <group>
      {showOrbit && (
        <Line
          points={orbitPoints}
          color="#00ffff"
          lineWidth={selected ? 2 : 1}
          transparent
          opacity={0.3}
        />
      )}

      {/* Comet nucleus */}
      <Sphere
        position={[x, 0, z]}
        args={[data.size, 8, 8]}
        onClick={onSelect}
      >
        <meshStandardMaterial
          color="#ffffff"
          emissive="#0088ff"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Comet tail */}
      <Line
        points={[
          new THREE.Vector3(x, 0, z),
          new THREE.Vector3(x - data.tailLength * 0.5, 0, z - data.tailLength * 0.3)
        ]}
        color="#88ccff"
        lineWidth={3}
        transparent
        opacity={0.6}
      />

      {selected && (
        <Text
          position={[x, data.size + 0.05, z]}
          fontSize={0.05}
          color="white"
          anchorX="center"
        >
          {data.name}
        </Text>
      )}
    </group>
  );
};

interface SolarSystemProps {
  selectedObject: string | null;
  onObjectSelect: (id: string, type: 'planet' | 'asteroid' | 'comet') => void;
  showOrbits: boolean;
  showAsteroids: boolean;
  showComets: boolean;
  animationSpeed: number;
  currentTime: number;
}

const SolarSystem: React.FC<SolarSystemProps> = ({
  selectedObject,
  onObjectSelect,
  showOrbits,
  showAsteroids,
  showComets,
  animationSpeed,
  currentTime
}) => {
  const [time, setTime] = useState(currentTime);

  useFrame(() => {
    setTime(prev => prev + animationSpeed);
  });

  return (
    <group>
      {/* Sun */}
      <Sphere args={[SUN_RADIUS, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffdd00"
          emissive="#ffaa00"
          emissiveIntensity={0.5}
        />
      </Sphere>

      <Text
        position={[0, SUN_RADIUS + 0.1, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
      >
        Sun
      </Text>

      {/* Planets */}
      {PLANETS.map((planet) => (
        <Planet
          key={planet.name}
          data={planet}
          time={time}
          selected={selectedObject === planet.name}
          onSelect={() => onObjectSelect(planet.name, 'planet')}
          showOrbit={showOrbits}
        />
      ))}

      {/* Asteroids */}
      {showAsteroids && ASTEROIDS.map((asteroid) => (
        <Asteroid
          key={asteroid.id}
          data={asteroid}
          time={time}
          selected={selectedObject === asteroid.id}
          onSelect={() => onObjectSelect(asteroid.id, 'asteroid')}
          showOrbit={showOrbits}
        />
      ))}

      {/* Comets */}
      {showComets && COMETS.map((comet) => (
        <Comet
          key={comet.id}
          data={comet}
          time={time}
          selected={selectedObject === comet.id}
          onSelect={() => onObjectSelect(comet.id, 'comet')}
          showOrbit={showOrbits}
        />
      ))}

      {/* Background stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
    </group>
  );
};

interface TimeControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const TimeControls: React.FC<TimeControlsProps> = ({
  isPlaying,
  onPlayPause,
  speed,
  onSpeedChange,
  currentDate,
  onDateChange
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white p-4 rounded-xl border border-gray-600">
      <div className="flex items-center space-x-4">
        <button
          onClick={onPlayPause}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm">Speed:</span>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-24"
          />
          <span className="text-sm w-12">{speed}x</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm">Date:</span>
          <input
            type="date"
            value={currentDate.toISOString().split('T')[0]}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export const SolarSystemVisualization: React.FC = () => {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [selectedObjectType, setSelectedObjectType] = useState<'planet' | 'asteroid' | 'comet' | null>(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showAsteroids, setShowAsteroids] = useState(true);
  const [showComets, setShowComets] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('Overview');
  const [filterHazard, setFilterHazard] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const handleObjectSelect = useCallback((id: string, type: 'planet' | 'asteroid' | 'comet') => {
    setSelectedObject(id);
    setSelectedObjectType(type);
  }, []);

  const handleViewChange = (preset: ViewPreset) => {
    setCurrentView(preset.name);
    // In a real implementation, you'd animate the camera to the preset position
  };

  const getSelectedObjectData = () => {
    if (!selectedObject || !selectedObjectType) return null;

    switch (selectedObjectType) {
      case 'planet':
        return PLANETS.find(p => p.name === selectedObject);
      case 'asteroid':
        return ASTEROIDS.find(a => a.id === selectedObject);
      case 'comet':
        return COMETS.find(c => c.id === selectedObject);
      default:
        return null;
    }
  };

  const selectedData = getSelectedObjectData();

  const filteredAsteroids = ASTEROIDS.filter(asteroid => {
    if (filterHazard === 'all') return true;
    return asteroid.hazardLevel === filterHazard;
  });

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Main 3D View */}
      <Canvas camera={{ position: [0, 10, 10], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#4444ff" />

        <SolarSystem
          selectedObject={selectedObject}
          onObjectSelect={handleObjectSelect}
          showOrbits={showOrbits}
          showAsteroids={showAsteroids}
          showComets={showComets}
          animationSpeed={isPlaying ? animationSpeed : 0}
          currentTime={0}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxDistance={50}
          minDistance={0.5}
        />
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 bg-black/90 text-white p-4 rounded-xl border border-gray-600 max-w-sm z-10">
        <h2 className="text-xl font-bold mb-4 text-blue-300">Solar System Controls</h2>

        <div className="space-y-4">
          {/* View Presets */}
          <div>
            <label className="block text-sm font-semibold mb-2">Camera Views</label>
            <div className="grid grid-cols-2 gap-2">
              {VIEW_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleViewChange(preset)}
                  className={`text-xs px-3 py-1 rounded transition-colors ${currentView === preset.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div>
            <label className="block text-sm font-semibold mb-2">Display Options</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showOrbits}
                  onChange={(e) => setShowOrbits(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Orbits</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showAsteroids}
                  onChange={(e) => setShowAsteroids(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Asteroids</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showComets}
                  onChange={(e) => setShowComets(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Comets</span>
              </label>
            </div>
          </div>

          {/* Hazard Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2">Asteroid Filter</label>
            <select
              value={filterHazard}
              onChange={(e) => setFilterHazard(e.target.value as 'all' | 'high' | 'medium' | 'low')}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
            >
              <option value="all">All Asteroids</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-600">
          <h3 className="text-sm font-semibold mb-2">Legend</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Critical/High Risk Asteroid</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium Risk Asteroid</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Low Risk Asteroid</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <span>Comet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Object Details Panel */}
      {selectedData && (
        <div className="absolute top-4 right-4 bg-black/90 text-white p-6 rounded-xl border border-gray-600 max-w-sm z-10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-yellow-300">
              {'name' in selectedData ? selectedData.name : selectedObject}
            </h3>
            <button
              onClick={() => setSelectedObject(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-2">
            {selectedObjectType === 'planet' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-300">Type:</span>
                  <span>Planet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Orbit Radius:</span>
                  <span>{selectedData.orbitRadius.toFixed(2)} AU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Radius:</span>
                  <span>{(selectedData.radius * 6371).toFixed(0)} km</span>
                </div>
              </>
            )}

            {selectedObjectType === 'asteroid' && 'hazardLevel' in selectedData && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-300">Type:</span>
                  <span>Asteroid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Hazard Level:</span>
                  <span className={`capitalize font-bold ${selectedData.hazardLevel === 'critical' ? 'text-red-400' :
                      selectedData.hazardLevel === 'high' ? 'text-orange-400' :
                        selectedData.hazardLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                    {selectedData.hazardLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Velocity:</span>
                  <span>{selectedData.velocity} km/s</span>
                </div>
                {selectedData.closeApproachDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Next Close Approach:</span>
                    <span>{selectedData.closeApproachDate.toLocaleDateString()}</span>
                  </div>
                )}
              </>
            )}

            {selectedObjectType === 'comet' && 'orbitalPeriod' in selectedData && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-300">Type:</span>
                  <span>Comet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Orbital Period:</span>
                  <span>{selectedData.orbitalPeriod} years</span>
                </div>
                {selectedData.nextPerihelion && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Next Perihelion:</span>
                    <span>{selectedData.nextPerihelion.toLocaleDateString()}</span>
                  </div>
                )}
              </>
            )}

            {'description' in selectedData && (
              <div className="mt-3 pt-3 border-t border-gray-600">
                <p className="text-xs text-gray-400">{selectedData.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Object List Panel */}
      <div className="absolute bottom-4 right-4 bg-black/90 text-white p-4 rounded-xl border border-gray-600 max-w-xs z-10">
        <h3 className="text-lg font-bold mb-3 text-blue-300">Objects</h3>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {/* Planets */}
          <div>
            <h4 className="text-sm font-semibold text-yellow-300 mb-1">Planets</h4>
            {PLANETS.slice(0, 4).map((planet) => (
              <button
                key={planet.name}
                onClick={() => handleObjectSelect(planet.name, 'planet')}
                className={`block w-full text-left text-xs py-1 px-2 rounded transition-colors ${selectedObject === planet.name
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-700'
                  }`}
              >
                {planet.name}
              </button>
            ))}
          </div>

          {/* Asteroids */}
          <div>
            <h4 className="text-sm font-semibold text-orange-300 mb-1">Near-Earth Asteroids</h4>
            {filteredAsteroids.map((asteroid) => (
              <button
                key={asteroid.id}
                onClick={() => handleObjectSelect(asteroid.id, 'asteroid')}
                className={`block w-full text-left text-xs py-1 px-2 rounded transition-colors ${selectedObject === asteroid.id
                    ? 'bg-orange-600'
                    : 'hover:bg-gray-700'
                  }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${asteroid.hazardLevel === 'critical' ? 'bg-red-500' :
                    asteroid.hazardLevel === 'high' ? 'bg-orange-500' :
                      asteroid.hazardLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></span>
                {asteroid.name}
              </button>
            ))}
          </div>

          {/* Comets */}
          <div>
            <h4 className="text-sm font-semibold text-cyan-300 mb-1">Comets</h4>
            {COMETS.map((comet) => (
              <button
                key={comet.id}
                onClick={() => handleObjectSelect(comet.id, 'comet')}
                className={`block w-full text-left text-xs py-1 px-2 rounded transition-colors ${selectedObject === comet.id
                    ? 'bg-cyan-600'
                    : 'hover:bg-gray-700'
                  }`}
              >
                {comet.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time Controls */}
      <TimeControls
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        speed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />

      {/* Statistics */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/80 text-white p-3 rounded-xl border border-gray-600">
        <div className="text-center space-y-2">
          <div>
            <div className="text-lg font-bold text-blue-300">{PLANETS.length}</div>
            <div className="text-xs text-gray-300">Planets</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-300">{ASTEROIDS.length}</div>
            <div className="text-xs text-gray-300">Asteroids</div>
          </div>
          <div>
            <div className="text-lg font-bold text-cyan-300">{COMETS.length}</div>
            <div className="text-xs text-gray-300">Comets</div>
          </div>
        </div>
      </div>
    </div>
  );
};