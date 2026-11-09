import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { DestinationConfig } from '../../config/birthdayConfig';

interface DestinationMarkerProps {
  destination: DestinationConfig;
  active: boolean;
  onSelect: () => void;
}

export function DestinationMarker({
  destination,
  active,
  onSelect,
}: DestinationMarkerProps) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (crystalRef.current) {
      const t = state.clock.elapsedTime;
      crystalRef.current.position.y = Math.sin(t * 2.1 + destination.landmarkPosition[0]) * 0.16;
      crystalRef.current.rotation.y = t * 0.9;
    }
  });

  return (
    <group position={destination.landmarkPosition}>
      {/* Floating Fairytale Crystal Marker */}
      <mesh
        ref={crystalRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        scale={hovered || active ? 1.2 : 1}
      >
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color={destination.accentColor}
          emissive={destination.accentColor}
          emissiveIntensity={hovered || active ? 0.85 : 0.45}
          roughness={0.2}
          metalness={0.2}
        />
      </mesh>

      {/* Subtle Floating Label Pill */}
      <Html
        position={[0, 0.72, 0]}
        center
        distanceFactor={20}
        zIndexRange={[10, 0]}
      >
        <button
          type="button"
          onClick={onSelect}
          className={`cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide shadow-sm transition-all ${
            active
              ? 'border-[#D99B38] bg-[#3B2B4B] text-[#FFF9F2] scale-105'
              : hovered
              ? 'border-[#D99B38] bg-[#FFF9F2] text-[#3B2B4B] scale-105'
              : 'border-[#E2B362]/60 bg-[#FFF9F2]/90 text-[#4B3860]'
          }`}
        >
          {destination.label}
        </button>
      </Html>
    </group>
  );
}
