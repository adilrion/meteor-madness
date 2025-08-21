'use client';

import { useEffect, useState } from 'react';

interface MeteorAnimation {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
  color: string;
  size: number;
  intensity: number;
  route: { x: number; y: number }[];
  altitude: number;
  velocity: number;
  angle: number;
}

const GlobeSimulation = ({ isPlaying = true }: { isPlaying?: boolean }) => {
  const [meteors, setMeteors] = useState<MeteorAnimation[]>([]);
  const [globeRotation, setGlobeRotation] = useState(0);

  // Rotate the globe more slowly
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setGlobeRotation(prev => (prev + 0.1) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Generate meteors with realistic physics
  useEffect(() => {
    if (!isPlaying) return;

    const generateMeteorRoute = (startX: number, startY: number, endX: number, endY: number): { x: number; y: number }[] => {
      const route = [];
      const steps = 20; // Number of points in the trajectory

      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;

        // Realistic atmospheric entry curve (parabolic trajectory)
        const x = startX + (endX - startX) * progress;
        const y = startY + (endY - startY) * progress * progress; // Quadratic curve for gravity effect

        // Add slight wind resistance wobble
        const wobbleX = Math.sin(progress * Math.PI * 3) * 2;
        const wobbleY = Math.cos(progress * Math.PI * 2) * 1;

        route.push({
          x: x + wobbleX,
          y: y + wobbleY
        });
      }

      return route;
    };

    const generateMeteor = (): MeteorAnimation => {
      const meteorTypes = [
        { color: '#ffffff', name: 'Iron', intensity: 1.0, velocity: 15 },
        { color: '#ffff00', name: 'Sodium', intensity: 0.8, velocity: 12 },
        { color: '#00ffff', name: 'Magnesium', intensity: 0.9, velocity: 18 },
        { color: '#ff6600', name: 'Calcium', intensity: 0.7, velocity: 10 },
        { color: '#00ff88', name: 'Copper', intensity: 0.6, velocity: 8 },
        { color: '#ff00ff', name: 'Lithium', intensity: 0.8, velocity: 14 },
      ];

      const meteorType = meteorTypes[Math.floor(Math.random() * meteorTypes.length)];

      // More realistic entry points (higher altitude, steeper angles)
      const startX = Math.random() * 100;
      const startY = Math.random() * 20; // Start much higher in atmosphere
      const angle = 15 + Math.random() * 60; // 15-75 degree entry angle

      // Calculate realistic trajectory based on angle and velocity
      const horizontalDistance = 20 + Math.random() * 40;
      const verticalDistance = 40 + Math.random() * 30;

      const endX = startX + (Math.random() > 0.5 ? 1 : -1) * horizontalDistance;
      const endY = startY + verticalDistance;

      const route = generateMeteorRoute(startX, startY, endX, endY);

      return {
        id: `meteor-${Date.now()}-${Math.random()}`,
        startX,
        startY,
        endX,
        endY,
        duration: 4 + Math.random() * 6, // Much slower: 4-10 seconds
        delay: 0,
        color: meteorType.color,
        size: 1 + Math.random() * 3, // Smaller, more realistic
        intensity: meteorType.intensity,
        route,
        altitude: 80 + Math.random() * 40, // 80-120km altitude
        velocity: meteorType.velocity,
        angle
      };
    };

    const interval = setInterval(() => {
      const meteorCount = Math.floor(Math.random() * 2) + 1; // 1-2 meteors (less frequent)
      for (let i = 0; i < meteorCount; i++) {
        setTimeout(() => {
          const newMeteor = generateMeteor();
          setMeteors(prev => [...prev, newMeteor]);

          // Remove old meteors
          setTimeout(() => {
            setMeteors(prev => prev.filter(m => m.id !== newMeteor.id));
          }, (newMeteor.duration + 2) * 1000);
        }, i * 500); // More staggered meteors
      }
    }, 3000 + Math.random() * 4000); // Every 3-7 seconds (much less frequent)

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Dark Space Background - GitHub style */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-slate-900 to-black"></div>

      {/* Subtle nebula effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>      {/* Enhanced Animated Globe */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative w-[500px] h-[500px] rounded-full transition-transform duration-75"
          style={{
            background: `radial-gradient(circle at 30% 30%, 
              #1a365d 0%, 
              #2d3748 25%, 
              #1a202c 50%, 
              #000000 100%)`,
            transform: `rotate(${globeRotation}deg)`,
            boxShadow: `
              inset -40px -40px 100px rgba(0,0,0,0.8), 
              inset 30px 30px 60px rgba(255,255,255,0.05),
              0 0 80px rgba(59, 130, 246, 0.2),
              0 0 160px rgba(59, 130, 246, 0.1)
            `,
            filter: 'brightness(0.9) contrast(1.1)'
          }}
        >
          {/* Continent patterns - subtle and realistic */}
          <div className="absolute inset-8 rounded-full">
            {/* North America */}
            <div className="absolute top-[30%] left-[20%] w-16 h-12 bg-green-900/30 rounded-lg transform -rotate-12"></div>
            {/* Europe */}
            <div className="absolute top-[25%] left-[45%] w-8 h-8 bg-green-800/20 rounded"></div>
            {/* Asia */}
            <div className="absolute top-[20%] left-[55%] w-20 h-16 bg-green-900/25 rounded-2xl transform rotate-12"></div>
            {/* Africa */}
            <div className="absolute top-[40%] left-[45%] w-10 h-18 bg-yellow-900/20 rounded-lg"></div>
            {/* Australia */}
            <div className="absolute top-[65%] left-[70%] w-8 h-6 bg-orange-900/20 rounded"></div>
            {/* South America */}
            <div className="absolute top-[50%] left-[25%] w-8 h-20 bg-green-800/25 rounded-lg transform rotate-12"></div>
          </div>

          {/* Latitude/Longitude Grid - very subtle */}
          <div className="absolute inset-0 rounded-full border border-gray-600/20">
            {/* Equator */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-500/30 transform -translate-y-px"></div>
            {/* Prime Meridian */}
            <div className="absolute left-1/2 top-0 h-full w-px bg-gray-500/30 transform -translate-x-px"></div>
            {/* Additional latitude lines */}
            <div className="absolute top-1/3 left-0 w-full h-px bg-gray-600/20 transform -translate-y-px"></div>
            <div className="absolute bottom-1/3 left-0 w-full h-px bg-gray-600/20 transform translate-y-px"></div>
            {/* Additional longitude lines */}
            <div className="absolute left-1/4 top-0 h-full w-px bg-gray-600/15 transform -translate-x-px"></div>
            <div className="absolute right-1/4 top-0 h-full w-px bg-gray-600/15 transform translate-x-px"></div>
          </div>

          {/* City Lights (Night Side) - very subtle */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-200/60 rounded-full animate-pulse"
                style={{
                  left: `${25 + Math.random() * 50}%`,
                  top: `${25 + Math.random() * 50}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  boxShadow: '0 0 2px rgba(254, 240, 138, 0.5)'
                }}
              ></div>
            ))}
          </div>

          {/* Atmospheric Layers - very subtle */}
          <div className="absolute -inset-6 rounded-full bg-gradient-radial from-transparent via-blue-400/10 to-transparent animate-pulse"></div>
          <div className="absolute -inset-8 rounded-full bg-gradient-radial from-transparent via-cyan-400/5 to-transparent animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Realistic Meteor Route Simulation */}
      {meteors.map((meteor) => (
        <div key={meteor.id} className="absolute pointer-events-none">
          {/* Route Trail Visualization */}
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            style={{ pointerEvents: 'none' }}
          >
            {/* Predicted Route Path */}
            <path
              d={`M ${meteor.route[0].x}% ${meteor.route[0].y}% ${meteor.route.map(point => `L ${point.x}% ${point.y}%`).join(' ')}`}
              stroke={meteor.color}
              strokeWidth="1"
              fill="none"
              opacity="0.3"
              strokeDasharray="2,3"
              className="animate-pulse"
            />

            {/* Route Points */}
            {meteor.route.map((point, index) => (
              <circle
                key={index}
                cx={`${point.x}%`}
                cy={`${point.y}%`}
                r="0.5"
                fill={meteor.color}
                opacity={0.1 + (index / meteor.route.length) * 0.4}
                className="animate-pulse"
                style={{
                  animationDelay: `${(index / meteor.route.length) * 2}s`
                }}
              />
            ))}
          </svg>

          {/* Moving Meteor with Realistic Physics */}
          <div
            className="absolute"
            style={{
              left: `${meteor.startX}%`,
              top: `${meteor.startY}%`,
              animation: `meteor-physics ${meteor.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
              transform: `rotate(${meteor.angle}deg)`
            }}
          >
            {/* Atmospheric Entry Glow */}
            <div
              className="absolute rounded-full"
              style={{
                width: `${meteor.size * 4}px`,
                height: `${meteor.size * 4}px`,
                background: `radial-gradient(circle, ${meteor.color}40 0%, transparent 70%)`,
                transform: 'translate(-50%, -50%)',
                animation: `glow-pulse ${meteor.duration}s ease-out forwards`
              }}
            ></div>

            {/* Meteor Core */}
            <div
              className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${meteor.size}px`,
                height: `${meteor.size}px`,
                backgroundColor: meteor.color,
                boxShadow: `
                  0 0 ${meteor.size * 2}px ${meteor.color}, 
                  0 0 ${meteor.size * 4}px ${meteor.color}88,
                  0 0 ${meteor.size * 8}px ${meteor.color}44
                `,
                filter: `brightness(${meteor.intensity + 0.8})`,
              }}
            ></div>

            {/* Dynamic Trail */}
            <div
              className="absolute"
              style={{
                width: '2px',
                height: `${20 + meteor.velocity}px`,
                background: `linear-gradient(to bottom, ${meteor.color}, ${meteor.color}88, transparent)`,
                transform: 'translate(-50%, -100%)',
                filter: `blur(0.5px)`,
                boxShadow: `0 0 ${meteor.size}px ${meteor.color}66`
              }}
            ></div>

            {/* Ionization Trail */}
            <div
              className="absolute"
              style={{
                width: '1px',
                height: `${40 + meteor.velocity * 2}px`,
                background: `linear-gradient(to bottom, ${meteor.color}aa, ${meteor.color}44, transparent)`,
                transform: 'translate(-50%, -100%)',
                filter: 'blur(1px)'
              }}
            ></div>

            {/* Particle Debris */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-px h-px rounded-full"
                style={{
                  backgroundColor: meteor.color,
                  transform: `translate(${-50 + Math.random() * 100}%, ${i * 10}px)`,
                  animation: `debris ${meteor.duration}s linear forwards`,
                  animationDelay: `${meteor.duration * 0.3}s`
                }}
              ></div>
            ))}
          </div>

          {/* Altitude Information Display */}
          <div
            className="absolute text-xs text-gray-400 opacity-60 font-mono"
            style={{
              left: `${meteor.startX + 5}%`,
              top: `${meteor.startY - 3}%`,
              animation: `fade-out ${meteor.duration}s ease-out forwards`
            }}
          >
            {meteor.altitude.toFixed(0)}km • {meteor.velocity}km/s
          </div>
        </div>
      ))}

      {/* Subtle Stars background - GitHub style */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => {
          const size = Math.random() > 0.9 ? 1.5 : 1;
          const opacity = Math.random() > 0.8 ? 0.8 : 0.4;
          return (
            <div
              key={i}
              className="absolute bg-gray-300 rounded-full animate-pulse"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
                opacity: opacity
              }}
            ></div>
          );
        })}
      </div>

      {/* Very subtle shooting stars */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-px h-20 bg-gradient-to-b from-gray-300 to-transparent transform rotate-12 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-px h-16 bg-gradient-to-b from-gray-300 to-transparent transform -rotate-12 animate-pulse delay-2000"></div>
      </div>
    </div>
  );
};

export default GlobeSimulation;
