'use client';

import { Line, OrbitControls, Sphere, Text } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';

interface TrajectorySimulatorProps {
  asteroid: {
    name: string;
    size: number;
    speed: number;
    angle: number;
    impactLocation: { lat: number; lng: number; name: string };
  };
  isPlaying: boolean;
}

const TrajectoryPath = ({ asteroid, isPlaying }: TrajectorySimulatorProps) => {
  const [progress, setProgress] = useState(0);
  const asteroidRef = useRef<THREE.Mesh>(null);

  // Convert lat/lng to 3D coordinates
  const getPositionFromLatLng = (lat: number, lng: number, radius: number = 1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  const impactPoint = getPositionFromLatLng(asteroid.impactLocation.lat, asteroid.impactLocation.lng);

  // Calculate entry point based on angle and speed
  const entryDistance = 3; // Start 3 units away
  const entryAngleRad = asteroid.angle * Math.PI / 180;
  const entryPoint = new THREE.Vector3(
    impactPoint.x - Math.cos(entryAngleRad) * entryDistance,
    impactPoint.y + Math.sin(entryAngleRad) * entryDistance,
    impactPoint.z
  );

  useFrame(() => {
    if (isPlaying && progress < 1) {
      setProgress(prev => Math.min(prev + 0.01, 1));
    } else if (!isPlaying) {
      setProgress(0);
    }

    if (asteroidRef.current) {
      // Interpolate position along trajectory
      const currentPos = entryPoint.clone().lerp(impactPoint, progress);
      asteroidRef.current.position.copy(currentPos);

      // Add rotation
      asteroidRef.current.rotation.x += 0.1;
      asteroidRef.current.rotation.y += 0.1;
    }
  });

  // Create trajectory line points
  const trajectoryPoints = [];
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const point = entryPoint.clone().lerp(impactPoint, t);
    trajectoryPoints.push(point);
  }

  const scale = Math.log(asteroid.size + 1) * 0.02;

  return (
    <group>
      {/* Earth */}
      <Sphere args={[1, 64, 64]} position={[0, 0, 0]}>
        <meshPhongMaterial color="#4a90e2" transparent={true} opacity={0.7} />
      </Sphere>

      {/* Impact point marker */}
      <Sphere args={[0.02, 8, 8]} position={impactPoint}>
        <meshBasicMaterial color="#ff0000" />
      </Sphere>

      {/* Trajectory line */}
      <Line
        points={trajectoryPoints}
        color="#ffaa00"
        lineWidth={2}
        transparent={true}
        opacity={0.6}
      />

      {/* Asteroid */}
      <Sphere
        ref={asteroidRef}
        args={[scale, 16, 16]}
        position={entryPoint}
      >
        <meshBasicMaterial color="#8B4513" />
      </Sphere>

      {/* Atmospheric entry effects */}
      {progress > 0.3 && (
        <Sphere
          position={asteroidRef.current?.position || entryPoint}
          args={[scale * 3, 16, 16]}
        >
          <meshBasicMaterial
            color="#ff6600"
            transparent={true}
            opacity={0.3 * progress}
          />
        </Sphere>
      )}

      {/* Location label */}
      <Text
        position={[impactPoint.x, impactPoint.y + 0.2, impactPoint.z]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {asteroid.impactLocation.name}
      </Text>
    </group>
  );
};

export const TrajectorySimulator: React.FC<TrajectorySimulatorProps> = ({ asteroid, isPlaying }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 h-80">
      <h3 className="text-lg font-bold text-white mb-2">3D Trajectory Simulation</h3>
      <Canvas camera={{ position: [2, 1, 2], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <TrajectoryPath asteroid={asteroid} isPlaying={isPlaying} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
      <div className="mt-2 text-sm text-gray-400">
        <p>Speed: {asteroid.speed} km/s | Angle: {asteroid.angle}° | Size: {asteroid.size}m</p>
      </div>
    </div>
  );
};

export default TrajectorySimulator;
