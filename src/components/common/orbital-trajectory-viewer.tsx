"use client";

import { OrbitalMechanics, type KeplerianElements, type TrajectoryPoint } from "@/lib/orbital-mechanics";
import { Html, Line, OrbitControls, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Info, Pause, Play, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import * as THREE from "three";

interface OrbitProps {
  trajectory: TrajectoryPoint[];
  color: string;
  name: string;
}

function OrbitPath({ trajectory, color, name }: OrbitProps) {
  const points = trajectory.map(
    (point) => new THREE.Vector3(point.position.x, point.position.z, point.position.y)
  );

  return (
    <>
      <Line
        points={points}
        color={color}
        lineWidth={2}
        opacity={0.6}
        transparent
      />
      <Html position={[points[0].x, points[0].y, points[0].z]}>
        <div className="bg-black/80 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
          {name}
        </div>
      </Html>
    </>
  );
}

interface AnimatedAsteroidProps {
  trajectory: TrajectoryPoint[];
  color: string;
  speed: number;
  isPlaying: boolean;
}

function AnimatedAsteroid({ trajectory, color, speed, isPlaying }: AnimatedAsteroidProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useFrame(() => {
    if (!isPlaying || trajectory.length === 0) return;

    setCurrentIndex((prev) => (prev + speed) % trajectory.length);
  });

  const index = Math.floor(currentIndex);
  const point = trajectory[index]?.position || { x: 0, y: 0, z: 0 };

  return (
    <Sphere ref={ref} args={[0.02, 16, 16]} position={[point.x, point.z, point.y]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </Sphere>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={ref} args={[0.1, 32, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#FDB813" emissive="#FDB813" emissiveIntensity={2} />
      <pointLight color="#FDB813" intensity={2} distance={10} />
    </Sphere>
  );
}

function Earth() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={ref} args={[0.05, 32, 32]} position={[1, 0, 0]}>
      <meshStandardMaterial color="#4A90E2" />
    </Sphere>
  );
}

interface AsteroidData {
  name: string;
  elements: KeplerianElements;
  color: string;
  isPHA: boolean;
}

const SAMPLE_ASTEROIDS: AsteroidData[] = [
  {
    name: "Apophis",
    elements: {
      semiMajorAxis: 0.9224,
      eccentricity: 0.191,
      inclination: 3.33,
      longitudeOfAscendingNode: 204.44,
      argumentOfPerihelion: 126.40,
      meanAnomaly: 21.28,
      epoch: 2460000.5
    },
    color: "#ff0000",
    isPHA: true
  },
  {
    name: "Bennu",
    elements: {
      semiMajorAxis: 1.126,
      eccentricity: 0.204,
      inclination: 6.03,
      longitudeOfAscendingNode: 2.06,
      argumentOfPerihelion: 66.22,
      meanAnomaly: 101.70,
      epoch: 2460000.5
    },
    color: "#ff6600",
    isPHA: true
  },
  {
    name: "Eros",
    elements: {
      semiMajorAxis: 1.458,
      eccentricity: 0.223,
      inclination: 10.83,
      longitudeOfAscendingNode: 304.40,
      argumentOfPerihelion: 178.81,
      meanAnomaly: 320.23,
      epoch: 2460000.5
    },
    color: "#00ff00",
    isPHA: false
  }
];

export default function OrbitalTrajectoryViewer() {
  const [selectedAsteroid, setSelectedAsteroid] = useState<AsteroidData>(SAMPLE_ASTEROIDS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(0.5);
  const [showInfo, setShowInfo] = useState(true);

  const trajectory = OrbitalMechanics.calculateTrajectory(
    selectedAsteroid.elements,
    selectedAsteroid.elements.epoch,
    selectedAsteroid.elements.semiMajorAxis * 365.25, // One orbital period
    200
  );

  const closeApproaches = OrbitalMechanics.findCloseApproaches(trajectory, 0.1);
  const { perihelion, aphelion } = OrbitalMechanics.calculateApsides(
    selectedAsteroid.elements.semiMajorAxis,
    selectedAsteroid.elements.eccentricity
  );
  const period = OrbitalMechanics.calculateOrbitalPeriod(selectedAsteroid.elements.semiMajorAxis);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Orbital Trajectory Simulator
        </h2>
        <p className="text-gray-400">Real-time Keplerian orbital mechanics visualization</p>
      </div>

      {/* 3D Visualization */}
      <div className="bg-black rounded-xl overflow-hidden border border-slate-700" style={{ height: "600px" }}>
        <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={1.5} />

          <Sun />
          <Earth />

          {SAMPLE_ASTEROIDS.map((asteroid) => {
            const traj = OrbitalMechanics.calculateTrajectory(
              asteroid.elements,
              asteroid.elements.epoch,
              asteroid.elements.semiMajorAxis * 365.25,
              200
            );

            return (
              <group key={asteroid.name}>
                <OrbitPath
                  trajectory={traj}
                  color={asteroid.color}
                  name={asteroid.name}
                />
                {asteroid.name === selectedAsteroid.name && (
                  <AnimatedAsteroid
                    trajectory={traj}
                    color={asteroid.color}
                    speed={animationSpeed}
                    isPlaying={isPlaying}
                  />
                )}
              </group>
            );
          })}

          {/* Earth's orbit */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.98, 1.02, 64]} />
            <meshBasicMaterial color="#4A90E2" transparent opacity={0.1} side={THREE.DoubleSide} />
          </mesh>

          <OrbitControls enablePan enableZoom enableRotate />

          {/* Grid */}
          <gridHelper args={[10, 20, "#333333", "#1a1a1a"]} />
        </Canvas>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            onClick={() => setAnimationSpeed(0.5)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Speed
          </button>

          <div className="flex items-center gap-3">
            <label className="text-gray-400 text-sm">Speed:</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="text-white font-mono">{animationSpeed.toFixed(1)}x</span>
          </div>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showInfo ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-700 hover:bg-slate-600'
              } text-white`}
          >
            <Info className="w-5 h-5" />
            Info
          </button>
        </div>
      </div>

      {/* Asteroid Selection */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Select Asteroid</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_ASTEROIDS.map((asteroid) => (
            <button
              key={asteroid.name}
              onClick={() => setSelectedAsteroid(asteroid)}
              className={`p-4 rounded-lg border transition-all ${selectedAsteroid.name === asteroid.name
                  ? 'border-purple-400 bg-purple-900/30 shadow-lg'
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-lg">{asteroid.name}</span>
                {asteroid.isPHA && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                    PHA
                  </span>
                )}
              </div>
              <div
                className="h-1 w-full rounded-full mb-3"
                style={{ backgroundColor: asteroid.color }}
              />
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>
                  <span>a:</span>
                  <span className="text-white ml-1">{asteroid.elements.semiMajorAxis.toFixed(3)} AU</span>
                </div>
                <div>
                  <span>e:</span>
                  <span className="text-white ml-1">{asteroid.elements.eccentricity.toFixed(3)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Orbital Information */}
      {showInfo && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Orbital Parameters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Semi-Major Axis</div>
              <div className="text-white font-bold text-xl">
                {selectedAsteroid.elements.semiMajorAxis.toFixed(4)} AU
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Eccentricity</div>
              <div className="text-white font-bold text-xl">
                {selectedAsteroid.elements.eccentricity.toFixed(4)}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Inclination</div>
              <div className="text-white font-bold text-xl">
                {selectedAsteroid.elements.inclination.toFixed(2)}°
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Perihelion Distance</div>
              <div className="text-white font-bold text-xl">
                {perihelion.toFixed(4)} AU
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Aphelion Distance</div>
              <div className="text-white font-bold text-xl">
                {aphelion.toFixed(4)} AU
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Orbital Period</div>
              <div className="text-white font-bold text-xl">
                {(period / 365.25).toFixed(2)} years
              </div>
            </div>
          </div>

          {closeApproaches.length > 0 && (
            <div className="mt-6 p-4 bg-orange-900/30 border border-orange-500/30 rounded-lg">
              <h4 className="text-orange-400 font-bold mb-2">
                ⚠️ Close Approaches Detected
              </h4>
              <p className="text-gray-300">
                This asteroid has {closeApproaches.length} predicted close approaches
                within 0.1 AU of Earth in the simulated time period.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

