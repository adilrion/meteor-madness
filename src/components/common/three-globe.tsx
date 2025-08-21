'use client';

import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

interface MeteorData {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  trail: THREE.Vector3[];
  temperature: number;
  altitude: number;
  mass: number;
  originCountry: string;
  targetCountry: string;
  routeColor: string;
  showerType: string;
}

const Globe = ({
  globeRef,
  hoverIntensity = 0,
  scrollOffset = 0,
  mousePosition = { x: 0, y: 0 }
}: {
  globeRef: React.RefObject<THREE.Mesh | null>;
  hoverIntensity?: number;
  scrollOffset?: number;
  mousePosition?: { x: number; y: number };
}) => {
  const earthTexture = useMemo(() => {
    // Create a detailed earth texture with country-wise coloring
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base deep ocean color
    ctx.fillStyle = '#001133'; // Very dark blue ocean
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Country color palette for different regions
    const countryColors = {
      northAmerica: '#1a4a1a', // Dark green
      southAmerica: '#2a3a1a', // Olive green
      europe: '#1a2a4a', // Dark blue-green
      africa: '#4a2a1a', // Brown
      asia: '#3a1a4a', // Purple-brown
      oceania: '#1a3a2a', // Teal
      antarctica: '#2a2a2a', // Gray
      russia: '#4a1a2a', // Dark red
      china: '#4a3a1a', // Yellow-brown
      india: '#3a4a1a', // Light brown
      middleEast: '#4a4a1a', // Sandy brown
    };

    // North America (USA, Canada, Mexico)
    ctx.fillStyle = countryColors.northAmerica;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.quadraticCurveTo(280, 150, 350, 180);
    ctx.quadraticCurveTo(380, 220, 320, 280);
    ctx.quadraticCurveTo(250, 320, 180, 290);
    ctx.quadraticCurveTo(150, 250, 200, 200);
    ctx.fill();

    // Mexico (separate color)
    ctx.fillStyle = '#2a4a2a';
    ctx.beginPath();
    ctx.moveTo(180, 320);
    ctx.quadraticCurveTo(220, 310, 240, 340);
    ctx.quadraticCurveTo(220, 360, 180, 350);
    ctx.quadraticCurveTo(160, 335, 180, 320);
    ctx.fill();

    // South America (Brazil, Argentina, etc.)
    ctx.fillStyle = countryColors.southAmerica;
    ctx.beginPath();
    ctx.moveTo(280, 400);
    ctx.quadraticCurveTo(320, 350, 300, 450);
    ctx.quadraticCurveTo(290, 550, 270, 650);
    ctx.quadraticCurveTo(250, 700, 230, 650);
    ctx.quadraticCurveTo(240, 550, 250, 450);
    ctx.quadraticCurveTo(260, 400, 280, 400);
    ctx.fill();

    // Europe (different from Africa)
    ctx.fillStyle = countryColors.europe;
    ctx.beginPath();
    ctx.moveTo(950, 180);
    ctx.quadraticCurveTo(1050, 160, 1100, 200);
    ctx.quadraticCurveTo(1080, 250, 1020, 280);
    ctx.quadraticCurveTo(970, 260, 950, 220);
    ctx.quadraticCurveTo(940, 200, 950, 180);
    ctx.fill();

    // Africa (separate from Europe)
    ctx.fillStyle = countryColors.africa;
    ctx.beginPath();
    ctx.moveTo(1000, 300);
    ctx.quadraticCurveTo(1120, 320, 1100, 400);
    ctx.quadraticCurveTo(1080, 500, 1020, 600);
    ctx.quadraticCurveTo(960, 650, 940, 550);
    ctx.quadraticCurveTo(920, 450, 960, 350);
    ctx.quadraticCurveTo(980, 300, 1000, 300);
    ctx.fill();

    // Russia (large northern landmass)
    ctx.fillStyle = countryColors.russia;
    ctx.beginPath();
    ctx.moveTo(1100, 120);
    ctx.quadraticCurveTo(1400, 100, 1700, 130);
    ctx.quadraticCurveTo(1750, 150, 1700, 180);
    ctx.quadraticCurveTo(1400, 200, 1100, 170);
    ctx.quadraticCurveTo(1080, 145, 1100, 120);
    ctx.fill();

    // China
    ctx.fillStyle = countryColors.china;
    ctx.beginPath();
    ctx.moveTo(1400, 220);
    ctx.quadraticCurveTo(1550, 200, 1600, 240);
    ctx.quadraticCurveTo(1580, 280, 1500, 300);
    ctx.quadraticCurveTo(1420, 280, 1400, 250);
    ctx.quadraticCurveTo(1390, 235, 1400, 220);
    ctx.fill();

    // India
    ctx.fillStyle = countryColors.india;
    ctx.beginPath();
    ctx.moveTo(1300, 300);
    ctx.quadraticCurveTo(1380, 280, 1400, 320);
    ctx.quadraticCurveTo(1390, 380, 1350, 400);
    ctx.quadraticCurveTo(1310, 380, 1300, 340);
    ctx.quadraticCurveTo(1290, 320, 1300, 300);
    ctx.fill();

    // Middle East
    ctx.fillStyle = countryColors.middleEast;
    ctx.beginPath();
    ctx.moveTo(1150, 280);
    ctx.quadraticCurveTo(1250, 260, 1300, 290);
    ctx.quadraticCurveTo(1280, 330, 1200, 340);
    ctx.quadraticCurveTo(1150, 320, 1150, 280);
    ctx.fill();

    // Australia
    ctx.fillStyle = countryColors.oceania;
    ctx.beginPath();
    ctx.ellipse(1500, 650, 80, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Japan (island chain)
    ctx.fillStyle = '#1a4a3a';
    ctx.beginPath();
    ctx.ellipse(1650, 280, 15, 30, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // UK/Ireland
    ctx.fillStyle = '#2a1a4a';
    ctx.beginPath();
    ctx.ellipse(920, 200, 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add mountain ranges with darker shades
    ctx.fillStyle = '#0a1a0a';
    // Rocky Mountains
    ctx.beginPath();
    ctx.ellipse(250, 240, 15, 40, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Andes
    ctx.beginPath();
    ctx.ellipse(270, 500, 8, 80, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Alps
    ctx.beginPath();
    ctx.ellipse(1000, 220, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Himalayas
    ctx.beginPath();
    ctx.ellipse(1350, 280, 40, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add country border lines
    ctx.strokeStyle = '#003355';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;

    // Major country borders
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Add coordinate grid with different opacity
    ctx.strokeStyle = '#002244';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;

    // Longitude lines (meridians)
    for (let i = 0; i <= 24; i++) {
      const x = (canvas.width / 24) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Latitude lines (parallels)
    for (let i = 0; i <= 12; i++) {
      const y = (canvas.height / 12) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Add major cities as bright points
    ctx.globalAlpha = 0.8;
    const cities = [
      { name: 'New York', x: 300, y: 240, color: '#ffdd44' },
      { name: 'Los Angeles', x: 180, y: 280, color: '#ffdd44' },
      { name: 'London', x: 920, y: 200, color: '#44ddff' },
      { name: 'Paris', x: 960, y: 210, color: '#44ddff' },
      { name: 'Tokyo', x: 1650, y: 280, color: '#ff44dd' },
      { name: 'Beijing', x: 1500, y: 240, color: '#ffaa44' },
      { name: 'Mumbai', x: 1320, y: 340, color: '#44ffaa' },
      { name: 'São Paulo', x: 270, y: 520, color: '#aaff44' },
      { name: 'Sydney', x: 1520, y: 640, color: '#44aaff' },
      { name: 'Cairo', x: 1050, y: 360, color: '#ffaa88' },
    ];

    cities.forEach(city => {
      ctx.fillStyle = city.color;
      ctx.beginPath();
      ctx.arc(city.x, city.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Add city glow
      ctx.shadowColor = city.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(city.x, city.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.globalAlpha = 1;
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Create normal map for surface detail
  const normalTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Create noise pattern for surface detail
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = 128 + (noise - 128) * 0.1;     // R
      data[i + 1] = 128 + (noise - 128) * 0.1; // G
      data[i + 2] = 255;                       // B (up direction)
      data[i + 3] = 255;                       // A
    }

    ctx.putImageData(imageData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useFrame((state) => {
    if (globeRef.current) {
      // Base rotation speed with scroll influence
      const baseRotationSpeed = 0.003;
      const scrollInfluence = Math.sin(scrollOffset * 0.01) * 0.002;
      globeRef.current.rotation.y += baseRotationSpeed + scrollInfluence;

      // Mouse-based tilt effect
      const targetRotationX = mousePosition.y * 0.1;
      const targetRotationZ = mousePosition.x * 0.05;

      globeRef.current.rotation.x += (targetRotationX - globeRef.current.rotation.x) * 0.05;
      globeRef.current.rotation.z += (targetRotationZ - globeRef.current.rotation.z) * 0.05;

      // Hover effect - scale and glow intensity
      const targetScale = 1 + hoverIntensity * 0.05;
      const currentScale = globeRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      globeRef.current.scale.setScalar(newScale);
 
    }
  });

  return (
    <Sphere ref={globeRef} args={[2, 128, 64]} castShadow receiveShadow>
      <meshPhongMaterial
        map={earthTexture}
        normalMap={normalTexture}
        normalScale={new THREE.Vector2(0.3, 0.3)}
        transparent
        opacity={0.95 + hoverIntensity * 0.05}
        shininess={10 + hoverIntensity * 20}
        specular={new THREE.Color('#004466').multiplyScalar(1 + hoverIntensity * 0.5)}
        emissive={new THREE.Color('#000811').multiplyScalar(1 + hoverIntensity * 2)}
        emissiveIntensity={0.05 + hoverIntensity * 0.1}
      />
    </Sphere>
  );
};

const MeteorParticles = ({
  meteors,
  hoverIntensity = 0,
  scrollOffset = 0
}: {
  meteors: MeteorData[];
  hoverIntensity?: number;
  scrollOffset?: number;
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const trailsGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    meteors.forEach((meteor, index) => {
      // Realistic atmospheric entry physics
      const distanceFromCenter = meteor.position.length();
      const atmosphereHeight = 2.1; // Earth radius + atmosphere

      // Calculate atmospheric density (higher closer to Earth)
      const atmosphereDensity = Math.max(0, (atmosphereHeight - distanceFromCenter) / 0.1);

      // Apply atmospheric drag
      const drag = meteor.velocity.clone().multiplyScalar(-atmosphereDensity * 0.5);
      meteor.velocity.add(drag.multiplyScalar(delta));

      // Apply gravity
      const gravity = meteor.position.clone().normalize().multiplyScalar(-2.0 * delta);
      meteor.velocity.add(gravity);

      // Update position
      meteor.position.add(meteor.velocity.clone().multiplyScalar(delta));
      meteor.life -= delta;

      // Update altitude
      meteor.altitude = (distanceFromCenter - 2.0) * 100; // Convert to km

      // Update trail
      meteor.trail.push(meteor.position.clone());
      if (meteor.trail.length > 20) {
        meteor.trail.shift();
      }

      // Calculate temperature based on atmospheric entry with hover effects
      if (atmosphereDensity > 0) {
        const speed = meteor.velocity.length();
        meteor.temperature = Math.min(3000, speed * atmosphereDensity * 1000 * (1 + hoverIntensity * 0.5));
      } else {
        meteor.temperature = Math.max(500, meteor.temperature * 0.95);
      }

      // Scroll-based meteor enhancement
      const scrollBoost = 1 + Math.sin(scrollOffset * 0.02) * 0.2;
      meteor.temperature *= scrollBoost;

      // Create transformation matrix
      const matrix = new THREE.Matrix4();
      matrix.setPosition(meteor.position);

      // Size varies with temperature and remaining life (enhanced with hover)
      const heatScale = 1 + (meteor.temperature / 3000) * 0.5;
      const lifeScale = meteor.life / meteor.maxLife;
      const hoverScale = 1 + hoverIntensity * 0.3;
      const scale = meteor.size * heatScale * lifeScale * hoverScale;
      matrix.scale(new THREE.Vector3(scale, scale, scale));

      // Apply to instance
      meshRef.current!.setMatrixAt(index, matrix);

      // Realistic color based on temperature and route (enhanced with hover)
      const color = new THREE.Color();
      const intensityMultiplier = 1 + hoverIntensity * 0.5;

      if (meteor.temperature > 2500) {
        color.setHex(0xffffff).multiplyScalar(intensityMultiplier); // White hot
      } else if (meteor.temperature > 2000) {
        color.setHex(0xffddaa).multiplyScalar(intensityMultiplier); // Yellow-white
      } else if (meteor.temperature > 1500) {
        color.copy(new THREE.Color(meteor.routeColor)).multiplyScalar(1.2 * intensityMultiplier); // Enhanced route color
      } else if (meteor.temperature > 1000) {
        color.copy(new THREE.Color(meteor.routeColor)).multiplyScalar(intensityMultiplier); // Pure route color
      } else {
        color.copy(new THREE.Color(meteor.routeColor)).multiplyScalar(0.8 * intensityMultiplier); // Dimmed route color
      }

      const opacity = lifeScale * (atmosphereDensity > 0 ? 1 : 0.3) * (1 + hoverIntensity * 0.2);
      color.multiplyScalar(opacity);
      meshRef.current!.setColorAt(index, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group ref={trailsGroupRef}>
      {/* Main meteor bodies */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, meteors.length]} castShadow>
        <sphereGeometry args={[0.02, 12, 8]} />
        <meshBasicMaterial />
      </instancedMesh>

      {/* Atmospheric glow effect with route colors (enhanced with hover) */}
      <instancedMesh args={[undefined, undefined, meteors.length]}>
        <sphereGeometry args={[0.08, 12, 8]} />
        <meshBasicMaterial
          transparent
          opacity={0.2 + hoverIntensity * 0.1}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Color-coded trails with route information */}
      {meteors.map((meteor) => (
        <group key={meteor.id}>
          {/* Trail particles with route colors (enhanced with scroll effects) */}
          {meteor.trail.map((trailPoint, trailIndex) => {
            const trailOpacity = (trailIndex / meteor.trail.length) * 0.8 * (1 + hoverIntensity * 0.3);
            const trailSize = 0.015 * (trailIndex / meteor.trail.length) * (1 + Math.sin(scrollOffset * 0.03) * 0.2);

            return (
              <mesh key={trailIndex} position={trailPoint}>
                <sphereGeometry args={[trailSize, 6, 4]} />
                <meshBasicMaterial
                  color={meteor.routeColor}
                  transparent
                  opacity={trailOpacity}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            );
          })}

          {/* Country route indicator */}
          {meteor.trail.length > 5 && (
            <mesh position={meteor.trail[Math.floor(meteor.trail.length / 2)]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial
                color={meteor.routeColor}
                transparent
                opacity={0.9}
              />
            </mesh>
          )}

          {/* Route connection visualization */}
          {meteor.trail.length > 10 && (
            <mesh position={meteor.trail[0]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial
                color={meteor.routeColor}
                transparent
                opacity={0.6}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Route Information Labels */}
      {meteors.map((meteor) => {
        if (meteor.trail.length < 3) return null;

        const labelPosition = meteor.position.clone().add(new THREE.Vector3(0.2, 0.2, 0));

        return (
          <group key={`label-${meteor.id}`} position={labelPosition}>
            <mesh>
              <planeGeometry args={[0.8, 0.3]} />
              <meshBasicMaterial
                color="#000000"
                transparent
                opacity={0.7}
              />
            </mesh>
            {/* Text would need a text geometry or HTML overlay for full implementation */}
          </group>
        );
      })}
    </group>
  );
};

const ThreeGlobe = ({ isPlaying = true }: { isPlaying?: boolean }) => {
  const globeRef = useRef<THREE.Mesh | null>(null);
  const [meteors, setMeteors] = useState<MeteorData[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoverIntensity, setHoverIntensity] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Add mouse tracking and scroll tracking effects
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrollOffset(scrollY);
    };

    const handleMouseEnter = () => {
      setHoverIntensity(1);
    };

    const handleMouseLeave = () => {
      setHoverIntensity(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Add hover listeners to the canvas container
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mouseenter', handleMouseEnter);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (canvas) {
        canvas.removeEventListener('mouseenter', handleMouseEnter);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Generate meteors with enhanced effects
  useEffect(() => {
    if (!isPlaying) return;

    const generateMeteor = (): MeteorData => {
      // Define meteor shower types with their characteristics
      const showerTypes = [
        { name: 'Perseids', color: '#ffaa44', speed: 4.5, origin: 'Perseus', target: 'Northern Hemisphere' },
        { name: 'Geminids', color: '#44aaff', speed: 3.8, origin: 'Gemini', target: 'Global' },
        { name: 'Leonids', color: '#ff6644', speed: 7.2, origin: 'Leo', target: 'Global' },
        { name: 'Quadrantids', color: '#aa44ff', speed: 4.1, origin: 'Boötes', target: 'Northern Hemisphere' },
        { name: 'Lyrids', color: '#44ff88', speed: 4.9, origin: 'Lyra', target: 'Northern Hemisphere' },
        { name: 'Eta Aquarids', color: '#ff8844', speed: 6.6, origin: 'Aquarius', target: 'Southern Hemisphere' },
      ];

      // Country/region coordinates for targeting
      const regions = {
        'North America': { lat: 45, lon: -100, color: '#1a4a1a' },
        'South America': { lat: -15, lon: -60, color: '#2a3a1a' },
        'Europe': { lat: 50, lon: 10, color: '#1a2a4a' },
        'Africa': { lat: 0, lon: 20, color: '#4a2a1a' },
        'Asia': { lat: 35, lon: 100, color: '#3a1a4a' },
        'Oceania': { lat: -25, lon: 140, color: '#1a3a2a' },
        'Russia': { lat: 60, lon: 100, color: '#4a1a2a' },
        'China': { lat: 35, lon: 105, color: '#4a3a1a' },
        'India': { lat: 20, lon: 77, color: '#3a4a1a' },
        'Middle East': { lat: 25, lon: 45, color: '#4a4a1a' },
      };

      // Select random shower and target region
      const shower = showerTypes[Math.floor(Math.random() * showerTypes.length)];
      const regionNames = Object.keys(regions);
      const targetRegion = regionNames[Math.floor(Math.random() * regionNames.length)];
      const originRegion = regionNames[Math.floor(Math.random() * regionNames.length)];

      // Convert lat/lon to 3D coordinates for targeting
      const targetCoords = regions[targetRegion as keyof typeof regions];
      const targetLat = (targetCoords.lat * Math.PI) / 180;
      const targetLon = (targetCoords.lon * Math.PI) / 180;

      // Spawn position (far from Earth)
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI * 0.8 + 0.1;
      const radius = 5 + Math.random() * 4;

      const position = new THREE.Vector3(
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.cos(theta),
        radius * Math.sin(theta) * Math.sin(phi)
      );

      // Target position on Earth surface
      const targetRadius = 2.0;
      const target = new THREE.Vector3(
        targetRadius * Math.cos(targetLat) * Math.cos(targetLon),
        targetRadius * Math.sin(targetLat),
        targetRadius * Math.cos(targetLat) * Math.sin(targetLon)
      );

      // Add some randomness to trajectory
      target.add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      ));

      const velocity = target.sub(position).normalize().multiplyScalar(shower.speed);

      // Create unique route color based on shower and target
      const routeColor = shower.color;
      const mass = 0.001 + Math.random() * 0.1;
      const size = Math.cbrt(mass) * 0.5;

      return {
        id: Math.random().toString(36).substr(2, 9),
        position,
        velocity,
        color: routeColor,
        size,
        life: 6 + Math.random() * 4,
        maxLife: 6 + Math.random() * 4,
        trail: [],
        temperature: 500,
        altitude: (position.length() - 2.0) * 100,
        mass,
        originCountry: originRegion,
        targetCountry: targetRegion,
        routeColor: routeColor,
        showerType: shower.name,
      };
    };

    const interval = setInterval(() => {
      setMeteors(prev => {
        // Remove dead meteors
        const alive = prev.filter(meteor => meteor.life > 0);

        // Add new meteor if we have room (more realistic frequency)
        if (alive.length < 6 && Math.random() > 0.7) {
          alive.push(generateMeteor());
        }

        return alive;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      className="w-full h-full relative"
      onMouseEnter={() => setHoverIntensity(1)}
      onMouseLeave={() => setHoverIntensity(0)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        setMousePosition({ x, y });
      }}
    >
     

      {/* Scroll Depth Indicator */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center">
          <div className="text-white text-xs mb-2 rotate-90 whitespace-nowrap">DEPTH</div>
          <div className="w-2 h-32 bg-gray-700 rounded-full relative overflow-hidden">
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-300"
              style={{
                height: `${Math.min(100, (scrollOffset / 1000) * 100)}%`
              }}
            ></div>
          </div>
          <div className="text-white text-xs mt-2 text-center">
            {Math.round((scrollOffset / 1000) * 100)}%
          </div>
        </div>
      </div>
      <div className="absolute top-4 left-4 z-10 space-y-2">
        {meteors.slice(0, 3).map((meteor) => (
          <div
            key={meteor.id}
            className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-sm border-l-4"
            style={{ borderLeftColor: meteor.routeColor }}
          >
            <div className="font-bold text-xs" style={{ color: meteor.routeColor }}>
              {meteor.showerType} Shower
            </div>
            <div className="text-xs opacity-75">
              Route: {meteor.originCountry} → {meteor.targetCountry}
            </div>
            <div className="text-xs opacity-60">
              Alt: {meteor.altitude.toFixed(0)}km | Temp: {meteor.temperature.toFixed(0)}K
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
          <div className="font-bold mb-2">Meteor Shower Types</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffaa44' }}></div>
              <span>Perseids</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#44aaff' }}></div>
              <span>Geminids</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff6644' }}></div>
              <span>Leonids</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#aa44ff' }}></div>
              <span>Quadrantids</span>
            </div>
          </div>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        {/* Enhanced Dynamic Lighting with scroll and hover effects */}
        <ambientLight intensity={0.1 + hoverIntensity * 0.05} color="#0a0a2e" />

        {/* Sun as main light source with interactive intensity */}
        <directionalLight
          position={[15, 10, 10]}
          intensity={1.2 + hoverIntensity * 0.3 + Math.sin(scrollOffset * 0.005) * 0.1}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Secondary light for Earth's reflected light (scroll-responsive) */}
        <pointLight
          position={[-8, -5, -8]}
          intensity={0.3 + Math.cos(scrollOffset * 0.008) * 0.1}
          color="#4a90e2"
          distance={20}
        />

        {/* Rim lighting for atmospheric effect (hover-enhanced) */}
        <pointLight
          position={[0, 0, -15]}
          intensity={0.2 + hoverIntensity * 0.15}
          color="#6699ff"
          distance={30}
        />

        {/* Additional dynamic lighting based on mouse position */}
        <pointLight
          position={[mousePosition.x * 10, mousePosition.y * 10, 5]}
          intensity={hoverIntensity * 0.4}
          color="#ffaa55"
          distance={15}
        />

        {/* Interactive Deep space starfield */}
        <Stars
          radius={150}
          depth={80}
          count={8000}
          factor={6 + hoverIntensity * 2}
          saturation={hoverIntensity * 0.3}
          fade
          speed={0.3 + scrollOffset * 0.0001}
        />

        {/* Main Earth globe with interactive effects */}
        <Globe
          globeRef={globeRef}
          hoverIntensity={hoverIntensity}
          scrollOffset={scrollOffset}
          mousePosition={mousePosition}
        />

       

        {/* Meteors with enhanced interactive physics */}
        {meteors.length > 0 && (
          <MeteorParticles
            meteors={meteors}
            hoverIntensity={hoverIntensity}
            scrollOffset={scrollOffset}
          />
        )}

        {/* Enhanced camera controls with hover responsiveness */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3 + hoverIntensity * 0.2}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
          maxDistance={15}
          minDistance={5}
          dampingFactor={0.05 - hoverIntensity * 0.02}
          enableDamping
        />
      </Canvas>
    </div>
  );
};

export default ThreeGlobe;
