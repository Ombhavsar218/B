import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ButterflyConfig {
  center: [number, number, number];
  radius: number;
  speed: number;
  phase: number;
  color: string;
  scale?: number;
}

function Butterfly({ center, radius, speed, phase, color, scale = 1 }: ButterflyConfig) {
  const groupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    if (groupRef.current) {
      const x = center[0] + Math.sin(t) * radius;
      const z = center[2] + Math.sin(t * 2) * (radius * 0.55);
      const y = center[1] + Math.sin(t * 2.7) * 0.45;
      groupRef.current.position.set(x, y, z);

      const dx = Math.cos(t) * radius;
      const dz = Math.cos(t * 2) * radius * 1.1;
      groupRef.current.rotation.y = Math.atan2(dx, dz);
    }

    const flap = Math.sin(state.clock.elapsedTime * 12 + phase) * 0.85;
    if (leftWingRef.current) leftWingRef.current.rotation.z = flap;
    if (rightWingRef.current) rightWingRef.current.rotation.z = -flap;
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.028, 0.14, 4, 6]} />
        <meshStandardMaterial color="#4D375E" roughness={0.6} />
      </mesh>
      {/* Left Wing */}
      <mesh ref={leftWingRef} position={[-0.1, 0, 0]}>
        <circleGeometry args={[0.14, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
          roughness={0.4}
        />
      </mesh>
      {/* Right Wing */}
      <mesh ref={rightWingRef} position={[0.1, 0, 0]}>
        <circleGeometry args={[0.14, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

export function Butterflies({
  areaCenter = [-45, 2.2, 13] as [number, number, number],
  count = 12,
  spread = 8,
}: {
  areaCenter?: [number, number, number];
  count?: number;
  spread?: number;
}) {
  const seeds = useMemo(() => {
    const colors = ['#F7A8C8', '#C9ADEF', '#BCE3FA', '#FFE39C', '#FFD0DE'];
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const dist = (0.3 + ((i * 7) % 10) / 14) * spread;
      return {
        center: [
          areaCenter[0] + Math.cos(angle) * dist,
          areaCenter[1] + (i % 3) * 0.55,
          areaCenter[2] + Math.sin(angle) * dist,
        ] as [number, number, number],
        radius: 1.4 + (i % 4) * 0.55,
        speed: 0.65 + (i % 3) * 0.22,
        phase: i * 1.15,
        color: colors[i % colors.length],
        scale: 0.85 + (i % 3) * 0.2,
      };
    });
  }, [areaCenter, count, spread]);

  return (
    <group>
      {seeds.map((s, idx) => (
        <Butterfly key={idx} {...s} />
      ))}
    </group>
  );
}
