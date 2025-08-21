'use client';

import {
  Cartesian3,
  Viewer as CesiumViewer,
  ClockRange,
  ClockStep,
  Color,
  JulianDate,
  PolylineGlowMaterialProperty,
  SampledPositionProperty,
  TimeInterval,
  TimeIntervalCollection
} from 'cesium';
import { useEffect, useRef, useState } from 'react';
import { CesiumComponentRef, Clock, Entity, Globe, Viewer } from 'resium';

interface MeteorData {
  id: string;
  name: string;
  startPosition: Cartesian3;
  endPosition: Cartesian3;
  color: Color;
  startTime: JulianDate;
  endTime: JulianDate;
}

export default function AdvancedMeteorViewer() {
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null);
  const [meteors, setMeteors] = useState<MeteorData[]>([]);
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    // Load Cesium CSS dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/cesium/Widgets/widgets.css';
    link.onload = () => setCssLoaded(true);
    document.head.appendChild(link);

    // Set Cesium base URL for loading assets
    if (typeof window !== 'undefined') {
      (window as unknown as { CESIUM_BASE_URL: string }).CESIUM_BASE_URL = '/cesium/';
    }

    return () => {
      // Cleanup
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    // Use realistic meteor data
    import('@/lib/meteor-utils').then(({ MeteorUtils }) => {
      const meteorEvents = MeteorUtils.getRealisticMeteorData();
      const currentTime = JulianDate.now();

      const sampleMeteors: MeteorData[] = meteorEvents.map((event, index) => {
        const trajectory = MeteorUtils.createTrajectory(
          event.latitude + 5, // Start 5 degrees higher for entry effect
          event.longitude - 2, // Start 2 degrees west
          event.altitude + 50000, // Start 50km higher
          event.latitude,
          event.longitude,
          10000, // End at 10km altitude (typical burnup)
          8 + index * 2 // Stagger durations
        );

        return {
          id: event.id,
          name: event.name,
          startPosition: trajectory.startPosition,
          endPosition: trajectory.endPosition,
          color: event.shower
            ? MeteorUtils.getShowerColor(event.shower)
            : MeteorUtils.getVelocityColor(event.velocity),
          startTime: JulianDate.addSeconds(currentTime, index * 3, new JulianDate()),
          endTime: JulianDate.addSeconds(currentTime, (index * 3) + 8, new JulianDate()),
        };
      });

      setMeteors(sampleMeteors);
    });
  }, []);

  useEffect(() => {
    if (viewerRef.current?.cesiumElement && meteors.length > 0) {
      const viewer = viewerRef.current.cesiumElement;

      // Set the initial camera position to show Earth
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(-74.0, 40.7, 20000000),
      });

      // Enable terrain and water effects
      viewer.scene.globe.enableLighting = true;

      // Configure the clock for animation
      const startTime = meteors[0].startTime;
      const endTime = JulianDate.addSeconds(meteors[meteors.length - 1].endTime, 10, new JulianDate());

      viewer.clock.startTime = startTime.clone();
      viewer.clock.stopTime = endTime.clone();
      viewer.clock.currentTime = startTime.clone();
      viewer.clock.clockRange = ClockRange.LOOP_STOP;
      viewer.clock.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;
      viewer.clock.multiplier = 2;
    }
  }, [meteors]);

  const createMeteorTrajectory = (meteor: MeteorData) => {
    const property = new SampledPositionProperty();
    property.addSample(meteor.startTime, meteor.startPosition);
    property.addSample(meteor.endTime, meteor.endPosition);

    const availability = new TimeIntervalCollection([
      new TimeInterval({
        start: meteor.startTime,
        stop: meteor.endTime,
      }),
    ]);

    return { property, availability };
  };

  if (!cssLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Cesium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-75 text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-bold mb-2">Meteor Tracking</h3>
        <div className="space-y-2 text-sm">
          {meteors.map((meteor) => (
            <div key={meteor.id} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: meteor.color.toCssColorString() }}
              />
              <span>{meteor.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs opacity-75">
          <p>🖱️ Mouse: Rotate view</p>
          <p>🔄 Scroll: Zoom in/out</p>
          <p>⏸️ Space: Pause/Play</p>
        </div>
      </div>

      <Viewer
        ref={viewerRef}
        full
        timeline={true}
        animation={true}
        homeButton={true}
        sceneModePicker={false}
        baseLayerPicker={false}
        navigationHelpButton={false}
        geocoder={false}
        fullscreenButton={true}
        vrButton={false}
        infoBox={true}
        selectionIndicator={true}
      >
        <Globe enableLighting />

        {meteors.map((meteor) => {
          const { property, availability } = createMeteorTrajectory(meteor);

          return (
            <Entity
              key={meteor.id}
              name={meteor.name}
              availability={availability}
              position={property}
              point={{
                pixelSize: 8,
                color: meteor.color,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
                heightReference: 0,
              }}
              path={{
                show: true,
                leadTime: 0,
                trailTime: 10,
                width: 3,
                resolution: 1,
                material: new PolylineGlowMaterialProperty({
                  glowPower: 0.1,
                  color: meteor.color,
                }),
              }}
              label={{
                text: meteor.name,
                font: "12pt sans-serif",
                style: 0,
                fillColor: Color.WHITE,
                outlineColor: Color.BLACK,
                outlineWidth: 2,
                verticalOrigin: 1,
                pixelOffset: new Cartesian3(0, -20, 0),
                showBackground: true,
                backgroundColor: Color.BLACK.withAlpha(0.7),
              }}
            />
          );
        })}

        {/* Add atmospheric entry effects */}
        {meteors.map((meteor) => (
          <Entity
            key={`atmosphere-${meteor.id}`}
            name={`${meteor.name} Atmosphere Entry`}
            position={meteor.startPosition}
            point={{
              pixelSize: 15,
              color: meteor.color.withAlpha(0.3),
              outlineColor: meteor.color,
              outlineWidth: 1,
              heightReference: 0,
            }}
            label={{
              text: "Entry Point",
              font: "10pt sans-serif",
              style: 0,
              fillColor: Color.YELLOW,
              verticalOrigin: 1,
              pixelOffset: new Cartesian3(0, -30, 0),
            }}
          />
        ))}

        <Clock shouldAnimate />
      </Viewer>
    </div>
  );
}
