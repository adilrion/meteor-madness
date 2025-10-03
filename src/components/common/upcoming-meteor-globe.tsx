'use client';

import { UpcomingMeteorData, UpcomingMeteorService } from '@/lib/upcoming-meteor-service';
import { Html, Line, OrbitControls, Sphere, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

interface GlobeProps {
  meteors: UpcomingMeteorData[];
  selectedMeteor?: string;
  onMeteorSelect?: (meteorId: string) => void;
  showTrajectories?: boolean;
  animationSpeed?: number;
}

// Convert lat/lon to 3D sphere coordinates
const latLonToVector3 = (lat: number, lon: number, radius: number = 1): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};

const Globe = ({ meteors, selectedMeteor, onMeteorSelect, showTrajectories = true, animationSpeed = 1 }: GlobeProps) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const [hoveredMeteor, setHoveredMeteor] = useState<string | null>(null);
  const [time, setTime] = useState(0);

  // Create detailed earth texture with country mapping
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base ocean color
    ctx.fillStyle = '#0a1a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Country colors based on continent
    const countryColors = {
      northAmerica: '#2d5a2d',
      southAmerica: '#4a5a2d',
      europe: '#2d3a5a',
      africa: '#5a3a2d',
      asia: '#4a2d5a',
      oceania: '#2d4a3a',
      antarctica: '#3a3a3a',
      russia: '#5a2d3a',
      china: '#5a4a2d',
      india: '#4a5a2d',
      middleEast: '#5a5a2d',
    };

    // Draw continents with approximate shapes
    // North America
    ctx.fillStyle = countryColors.northAmerica;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.quadraticCurveTo(320, 150, 380, 200);
    ctx.quadraticCurveTo(400, 280, 320, 320);
    ctx.quadraticCurveTo(220, 340, 160, 300);
    ctx.quadraticCurveTo(140, 240, 200, 200);
    ctx.fill();

    // South America
    ctx.fillStyle = countryColors.southAmerica;
    ctx.beginPath();
    ctx.moveTo(300, 400);
    ctx.quadraticCurveTo(340, 380, 320, 480);
    ctx.quadraticCurveTo(300, 600, 280, 720);
    ctx.quadraticCurveTo(260, 740, 240, 720);
    ctx.quadraticCurveTo(250, 600, 270, 480);
    ctx.quadraticCurveTo(280, 400, 300, 400);
    ctx.fill();

    // Europe
    ctx.fillStyle = countryColors.europe;
    ctx.beginPath();
    ctx.moveTo(950, 180);
    ctx.quadraticCurveTo(1080, 160, 1120, 200);
    ctx.quadraticCurveTo(1100, 260, 1020, 280);
    ctx.quadraticCurveTo(960, 260, 950, 220);
    ctx.fill();

    // Africa
    ctx.fillStyle = countryColors.africa;
    ctx.beginPath();
    ctx.moveTo(1000, 300);
    ctx.quadraticCurveTo(1140, 320, 1120, 420);
    ctx.quadraticCurveTo(1080, 550, 1000, 650);
    ctx.quadraticCurveTo(940, 680, 920, 580);
    ctx.quadraticCurveTo(910, 450, 960, 350);
    ctx.fill();

    // Asia
    ctx.fillStyle = countryColors.asia;
    ctx.beginPath();
    ctx.moveTo(1200, 180);
    ctx.quadraticCurveTo(1500, 160, 1700, 200);
    ctx.quadraticCurveTo(1720, 280, 1600, 340);
    ctx.quadraticCurveTo(1400, 360, 1200, 300);
    ctx.fill();

    // Australia
    ctx.fillStyle = countryColors.oceania;
    ctx.beginPath();
    ctx.ellipse(1500, 650, 100, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add grid lines
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
    ctx.lineWidth = 1;

    // Longitude lines
    for (let i = 0; i <= 36; i++) {
      const x = (canvas.width / 36) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Latitude lines
    for (let i = 0; i <= 18; i++) {
      const y = (canvas.height / 18) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  // Create atmosphere shader material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
  }, []);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002 * animationSpeed;
    }
    setTime(state.clock.elapsedTime);
  });

  // Generate trajectory points for meteors
  const meteorTrajectories = useMemo(() => {
    return meteors.map(meteor => {
      const startPoint = latLonToVector3(meteor.latitude + 10, meteor.longitude, 2.5);
      const endPoint = latLonToVector3(meteor.latitude, meteor.longitude, 1.02);

      const points = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const point = startPoint.clone().lerp(endPoint, t);
        points.push(point);
      }

      return {
        meteorId: meteor.id,
        points,
        color: meteor.impactProbability > 0.7 ? '#ff4444' : meteor.impactProbability > 0.4 ? '#ffaa44' : '#44ff44'
      };
    });
  }, [meteors]);

  return (
    <group>
      {/* Main Earth Globe */}
      <Sphere ref={globeRef} args={[1, 64, 64]}>
        <meshPhongMaterial
          map={earthTexture}
          transparent
          opacity={0.9}
          shininess={100}
          specular={new THREE.Color(0x111111)}
        />
      </Sphere>

      {/* Atmosphere */}
      <Sphere args={[1.05, 32, 32]}>
        <primitive object={atmosphereMaterial} />
      </Sphere>

      {/* Meteor Points */}
      {meteors.map((meteor) => {
        const position = latLonToVector3(meteor.latitude, meteor.longitude, 1.05);
        const isSelected = selectedMeteor === meteor.id;
        const isHovered = hoveredMeteor === meteor.id;
        const scale = isSelected ? 1.5 : isHovered ? 1.2 : 1;

        return (
          <group key={meteor.id}>
            {/* Meteor marker */}
            <Sphere
              position={position}
              args={[0.02 * scale, 8, 8]}
              onClick={() => onMeteorSelect?.(meteor.id)}
              onPointerEnter={() => setHoveredMeteor(meteor.id)}
              onPointerLeave={() => setHoveredMeteor(null)}
            >
              <meshStandardMaterial
                color={meteor.impactProbability > 0.7 ? '#ff4444' : meteor.impactProbability > 0.4 ? '#ffaa44' : '#44ff44'}
                emissive={meteor.impactProbability > 0.7 ? '#ff2222' : meteor.impactProbability > 0.4 ? '#ff8822' : '#22ff22'}
                emissiveIntensity={0.3 + Math.sin(time * 3) * 0.2}
              />
            </Sphere>

            {/* Pulsing ring effect */}
            <Sphere position={position} args={[0.05 + Math.sin(time * 2) * 0.02, 16, 16]}>
              <meshBasicMaterial
                color={meteor.impactProbability > 0.7 ? '#ff4444' : '#44ff44'}
                transparent
                opacity={0.3 - Math.sin(time * 2) * 0.1}
                side={THREE.DoubleSide}
              />
            </Sphere>

            {/* Info tooltip for selected/hovered meteor */}
            {(isSelected || isHovered) && (
              <Html position={position} distanceFactor={10}>
                <div className="bg-black/80 text-white p-2 rounded-lg text-sm min-w-[200px] pointer-events-none">
                  <div className="font-bold text-yellow-300">{meteor.name}</div>
                  <div>Impact Probability: {(meteor.impactProbability * 100).toFixed(1)}%</div>
                  <div>Velocity: {meteor.velocity.toFixed(1)} km/s</div>
                  <div>Mass: {meteor.mass} kg</div>
                  <div>Estimated Impact: {meteor.estimatedImpactTime.toLocaleDateString()}</div>
                  <div>Visibility: <span className={`capitalize ${meteor.visibility === 'excellent' ? 'text-green-300' :
                      meteor.visibility === 'good' ? 'text-blue-300' :
                        meteor.visibility === 'fair' ? 'text-yellow-300' : 'text-red-300'
                    }`}>{meteor.visibility}</span></div>
                  {meteor.shower && (
                    <div>Shower: <span className="text-purple-300">{meteor.shower}</span></div>
                  )}
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Trajectory Lines */}
      {showTrajectories && meteorTrajectories.map((trajectory) => (
        <Line
          key={trajectory.meteorId}
          points={trajectory.points}
          color={trajectory.color}
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}

      {/* Stars background */}
      <Stars
        radius={50}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
    </group>
  );
};

interface MeteorInfoPanelProps {
  meteor: UpcomingMeteorData | null;
  onClose: () => void;
}

const MeteorInfoPanel = ({ meteor, onClose }: MeteorInfoPanelProps) => {
  if (!meteor) return null;

  const threatLevel = meteor.impactProbability > 0.7 ? 'HIGH' :
    meteor.impactProbability > 0.4 ? 'MEDIUM' : 'LOW';

  const threatColor = threatLevel === 'HIGH' ? 'text-red-400' :
    threatLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="absolute top-4 right-4 bg-black/90 text-white p-6 rounded-xl border border-gray-600 max-w-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-blue-300">{meteor.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-300">Threat Level:</span>
          <span className={`font-bold ${threatColor}`}>{threatLevel}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Impact Probability:</span>
          <span className="text-white">{(meteor.impactProbability * 100).toFixed(1)}%</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Velocity:</span>
          <span className="text-white">{meteor.velocity.toFixed(1)} km/s</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Mass:</span>
          <span className="text-white">{meteor.mass} kg</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Location:</span>
          <span className="text-white">{meteor.latitude.toFixed(2)}°, {meteor.longitude.toFixed(2)}°</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Estimated Impact:</span>
          <span className="text-white">{meteor.estimatedImpactTime.toLocaleDateString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Visibility:</span>
          <span className={`capitalize ${meteor.visibility === 'excellent' ? 'text-green-300' :
              meteor.visibility === 'good' ? 'text-blue-300' :
                meteor.visibility === 'fair' ? 'text-yellow-300' : 'text-red-300'
            }`}>{meteor.visibility}</span>
        </div>

        {meteor.shower && (
          <div className="flex justify-between">
            <span className="text-gray-300">Meteor Shower:</span>
            <span className="text-purple-300">{meteor.shower}</span>
          </div>
        )}

        {meteor.showerPeak && (
          <div className="flex justify-between">
            <span className="text-gray-300">Shower Peak:</span>
            <span className="text-white">{meteor.showerPeak.toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const UpcomingMeteorGlobe: React.FC = () => {
  const [selectedMeteor, setSelectedMeteor] = useState<string | null>(null);
  const [showTrajectories, setShowTrajectories] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Get upcoming meteor data from service
  const allUpcomingMeteors = UpcomingMeteorService.getUpcomingMeteors();

  const upcomingMeteors = useMemo(() => {
    switch (riskFilter) {
      case 'high':
        return UpcomingMeteorService.getMeteorsByRisk('high');
      case 'medium':
        return UpcomingMeteorService.getMeteorsByRisk('medium');
      case 'low':
        return UpcomingMeteorService.getMeteorsByRisk('low');
      default:
        return allUpcomingMeteors;
    }
  }, [riskFilter, allUpcomingMeteors]);

  const selectedMeteorData = selectedMeteor
    ? upcomingMeteors.find(m => m.id === selectedMeteor) || null
    : null;

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-xl border border-gray-600 z-10">
        <h2 className="text-lg font-bold mb-3 text-blue-300">Upcoming Meteors</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Risk Filter</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
            >
              <option value="all">All Meteors</option>
              <option value="high">High Risk (&gt;70%)</option>
              <option value="medium">Medium Risk (40-70%)</option>
              <option value="low">Low Risk (&lt;40%)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Animation Speed</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{animationSpeed}x</span>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showTrajectories}
                onChange={(e) => setShowTrajectories(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Trajectories</span>
            </label>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-600">
          <h3 className="text-sm font-semibold mb-2 text-yellow-300">Legend</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span>High Risk (&gt;70%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>Medium Risk (40-70%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Low Risk (&lt;40%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meteor Info Panel */}
      <MeteorInfoPanel
        meteor={selectedMeteorData}
        onClose={() => setSelectedMeteor(null)}
      />

      {/* 3D Globe */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4444ff" />

        <Globe
          meteors={upcomingMeteors}
          selectedMeteor={selectedMeteor || undefined}
          onMeteorSelect={setSelectedMeteor}
          showTrajectories={showTrajectories}
          animationSpeed={animationSpeed}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          maxDistance={6}
          minDistance={2}
          autoRotate={false}
        />
      </Canvas>

      {/* Statistics Footer */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-xl border border-gray-600">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-300">{riskFilter === 'all' ? allUpcomingMeteors.length : upcomingMeteors.length}</div>
            <div className="text-sm text-gray-300">{riskFilter === 'all' ? 'Total Events' : `${riskFilter.charAt(0).toUpperCase() + riskFilter.slice(1)} Risk Events`}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">
              {allUpcomingMeteors.filter(m => m.impactProbability > 0.7).length}
            </div>
            <div className="text-sm text-gray-300">High Risk</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {allUpcomingMeteors.filter(m => m.impactProbability > 0.4 && m.impactProbability <= 0.7).length}
            </div>
            <div className="text-sm text-gray-300">Medium Risk</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {allUpcomingMeteors.filter(m => m.impactProbability <= 0.4).length}
            </div>
            <div className="text-sm text-gray-300">Low Risk</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {new Set(allUpcomingMeteors.map(m => m.shower).filter(Boolean)).size}
            </div>
            <div className="text-sm text-gray-300">Active Showers</div>
          </div>
        </div>
      </div>
    </div>
  );
};