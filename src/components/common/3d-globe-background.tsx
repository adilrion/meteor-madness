'use client';

import { Cartesian3, Color, JulianDate, SampledPositionProperty } from 'cesium';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamic imports to avoid SSR issues
const Viewer = dynamic(() => import('resium').then(mod => mod.Viewer), { ssr: false });
const Entity = dynamic(() => import('resium').then(mod => mod.Entity), { ssr: false });
const Clock = dynamic(() => import('resium').then(mod => mod.Clock), { ssr: false });

interface MeteorTrail {
  id: string;
  startPosition: Cartesian3;
  endPosition: Cartesian3;
  color: Color;
  duration: number;
  startTime: JulianDate;
}

const GlobeBackground = ({ isPlaying = true }: { isPlaying?: boolean }) => {
  const [meteorTrails, setMeteorTrails] = useState<MeteorTrail[]>([]);
  const [currentTime, setCurrentTime] = useState(JulianDate.now());

  // Generate random meteor trails in multiple areas
  const generateMeteorTrail = (): MeteorTrail => {
    const meteorAreas = [
      { lat: 40, lon: -100, name: 'North America' }, // North America
      { lat: 50, lon: 10, name: 'Europe' },         // Europe
      { lat: -25, lon: 135, name: 'Australia' },    // Australia
      { lat: 35, lon: 105, name: 'Asia' },          // Asia
      { lat: -10, lon: -55, name: 'South America' }, // South America
      { lat: 0, lon: 20, name: 'Africa' },          // Africa
    ];

    const area = meteorAreas[Math.floor(Math.random() * meteorAreas.length)];

    // Create atmospheric entry height (100-120 km) and ground impact
    const entryHeight = 100000 + Math.random() * 20000; // 100-120 km
    const impactHeight = Math.random() * 10000; // 0-10 km (most burn up before reaching ground)

    // Random offset from area center
    const latOffset = (Math.random() - 0.5) * 20; // ±10 degrees
    const lonOffset = (Math.random() - 0.5) * 20; // ±10 degrees

    const startLat = area.lat + latOffset;
    const startLon = area.lon + lonOffset;
    const endLat = startLat + (Math.random() - 0.5) * 5; // Slight trajectory change
    const endLon = startLon + (Math.random() - 0.5) * 5;

    const startPosition = Cartesian3.fromDegrees(startLon, startLat, entryHeight);
    const endPosition = Cartesian3.fromDegrees(endLon, endLat, impactHeight);

    // Different colors for different meteor types
    const colors = [
      Color.WHITE,           // Iron meteors
      Color.YELLOW,          // Sodium-rich meteors
      Color.GREEN,           // Magnesium-rich meteors
      Color.ORANGE,          // Calcium-rich meteors
      Color.CYAN,            // Rare metal meteors
    ];

    return {
      id: `meteor-${Date.now()}-${Math.random()}`,
      startPosition,
      endPosition,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 2 + Math.random() * 3, // 2-5 seconds
      startTime: JulianDate.now(),
    };
  };

  // Create animated position property for meteor trail
  const createMeteorPositionProperty = (trail: MeteorTrail) => {
    const property = new SampledPositionProperty();
    const endTime = JulianDate.addSeconds(trail.startTime, trail.duration, new JulianDate());

    property.addSample(trail.startTime, trail.startPosition);
    property.addSample(endTime, trail.endPosition);

    return property;
  };

  // Generate meteors periodically
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // Add new meteor (1-3 meteors every 2-4 seconds)
      const newMeteorCount = Math.floor(Math.random() * 3) + 1;
      const newMeteors: MeteorTrail[] = [];

      for (let i = 0; i < newMeteorCount; i++) {
        // Stagger the start times slightly
        setTimeout(() => {
          newMeteors.push(generateMeteorTrail());
        }, i * 200);
      }

      setTimeout(() => {
        setMeteorTrails(prev => [...prev, ...newMeteors]);
      }, 200);

      // Clean up old meteors
      setMeteorTrails(prev => {
        const now = JulianDate.now();
        return prev.filter(meteor => {
          const meteorEndTime = JulianDate.addSeconds(meteor.startTime, meteor.duration + 1, new JulianDate());
          return JulianDate.lessThan(now, meteorEndTime);
        });
      });

    }, 2000 + Math.random() * 2000); // Every 2-4 seconds

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update time for animations
  useEffect(() => {
    if (!isPlaying) return;

    const timeInterval = setInterval(() => {
      setCurrentTime(JulianDate.now());
    }, 100);

    return () => clearInterval(timeInterval);
  }, [isPlaying]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Viewer
        full
        timeline={false}
        animation={false}
        homeButton={false}
        sceneModePicker={false}
        baseLayerPicker={false}
        navigationHelpButton={false}
        geocoder={false}
        fullscreenButton={false}
        vrButton={false}
        infoBox={false}
        selectionIndicator={false}
        creditContainer=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <Clock
          currentTime={currentTime}
          multiplier={isPlaying ? 1 : 0}
        />

        {meteorTrails.map((trail) => (
          <Entity
            key={trail.id}
            position={createMeteorPositionProperty(trail)}
            point={{
              pixelSize: 8,
              color: trail.color,
              outlineColor: Color.WHITE,
              outlineWidth: 1,
            }}
            path={{
              show: true,
              leadTime: 0,
              trailTime: trail.duration,
              width: 3,
              resolution: 1,
              material: trail.color.withAlpha(0.8),
            }}
            billboard={{
              image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOSIvPgo8Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iMiIgZmlsbD0iI2ZmZjAwMCIvPgo8L3N2Zz4K',
              scale: 0.5,
              color: trail.color,
            }}
          />
        ))}
      </Viewer>
    </div>
  );
};

export default GlobeBackground;
