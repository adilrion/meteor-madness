'use client';

import { Cartesian3, Viewer as CesiumViewer, Color } from 'cesium';
import { useEffect, useRef } from 'react';
import { CesiumComponentRef, Clock, Entity, Globe, Viewer } from 'resium';

export default function CesiumViewerComponent() {
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null);

  useEffect(() => {
    // Set Cesium base URL for loading assets
    if (typeof window !== 'undefined') {
      (window as unknown as { CESIUM_BASE_URL: string }).CESIUM_BASE_URL = '/cesium/';
    }
  }, []);

  useEffect(() => {
    if (viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;

      // Set the initial camera position to show Earth
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(-74.0, 40.7, 15000000), // New York area from space
      });

      // Enable terrain and water effects
      viewer.scene.globe.enableLighting = true;
    }
  }, []);

  return (
    <div className="w-full h-full">
      <Viewer
        ref={viewerRef}
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
      >
        <Globe enableLighting />

        {/* Example meteor entity */}
        <Entity
          name="Example Meteor"
          position={Cartesian3.fromDegrees(-75.0, 39.0, 500000)}
          point={{
            pixelSize: 10,
            color: Color.YELLOW,
            outlineColor: Color.BLACK,
            outlineWidth: 2,
            heightReference: 0, // relative to terrain
          }}
          label={{
            text: "Meteor Entry Point",
            font: "14pt monospace",
            style: 0, // fill
            fillColor: Color.WHITE,
            outlineColor: Color.BLACK,
            outlineWidth: 2,
            verticalOrigin: 1, // bottom
            pixelOffset: new Cartesian3(0, -10, 0),
          }}
        />

        {/* Add a clock for time-based animations */}
        <Clock shouldAnimate />
      </Viewer>
    </div>
  );
}
