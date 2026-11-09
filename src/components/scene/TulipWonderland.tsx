import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TulipSeed {
  x: number;
  y: number;
  z: number;
  scale: number;
  phase: number;
  rotY: number;
  color: THREE.Color;
}

const TULIP_PALETTE = [
  '#F596B6', // pastel rose pink
  '#F9C2D6', // soft blush
  '#C9ADEF', // lavender
  '#A584D6', // soft purple
  '#FFE6A3', // buttercream gold
  '#FFD4C4', // warm peach cream
  '#FF84AD', // vibrant tulip pink
];

function buildTulipCupGeometry(): THREE.LatheGeometry {
  // Creates a plump, curved tulip blossom profile
  const points = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.08, 0.03),
    new THREE.Vector2(0.145, 0.14),
    new THREE.Vector2(0.155, 0.28),
    new THREE.Vector2(0.125, 0.39),
    new THREE.Vector2(0.08, 0.43),
    new THREE.Vector2(0.02, 0.35),
  ];
  return new THREE.LatheGeometry(points, 12);
}

export function TulipWonderland({ onSelect }: { onSelect?: () => void }) {
  const stemRef = useRef<THREE.InstancedMesh>(null);
  const leafRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);

  const cupGeometry = useMemo(() => buildTulipCupGeometry(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const tulipSeeds: TulipSeed[] = useMemo(() => {
    const seeds: TulipSeed[] = [];

    // Helper for deterministic pseudo-random placement so SSR/re-renders stay stable
    let seedVal = 42;
    const rand = () => {
      seedVal = (seedVal * 1664525 + 1013904223) % 4294967296;
      return seedVal / 4294967296;
    };

    const addCluster = (
      cx: number,
      baseY: number,
      cz: number,
      rx: number,
      rz: number,
      count: number
    ) => {
      for (let i = 0; i < count; i++) {
        const angle = rand() * Math.PI * 2;
        const r = Math.sqrt(rand());
        const x = cx + Math.cos(angle) * r * rx;
        const z = cz + Math.sin(angle) * r * rz;
        seeds.push({
          x,
          y: baseY,
          z,
          scale: 0.78 + rand() * 0.42,
          phase: rand() * Math.PI * 2,
          rotY: rand() * Math.PI * 2,
          color: new THREE.Color(TULIP_PALETTE[Math.floor(rand() * TULIP_PALETTE.length)]),
        });
      }
    };

    // Main Tulip Wonderland Terraces (West side)
    addCluster(-11.5, 0.14, 3.5, 3.3, 2.7, 95);
    addCluster(-14.6, 0.32, 0.2, 2.6, 2.2, 65);
    addCluster(-10.2, 0.22, 7.8, 2.5, 2.0, 60);
    addCluster(-15.5, 0.16, 5.8, 2.1, 1.9, 45);

    // Grand Entrance Promenade Tulip Borders (visible on Intro screen!)
    for (let z = 9.0; z <= 19.5; z += 0.95) {
      for (const side of [-1, 1]) {
        const xBase = side * (2.65 + rand() * 0.75);
        seeds.push({
          x: xBase,
          y: 0.06,
          z: z + (rand() - 0.5) * 0.35,
          scale: 0.8 + rand() * 0.35,
          phase: rand() * Math.PI * 2,
          rotY: rand() * Math.PI * 2,
          color: new THREE.Color(TULIP_PALETTE[Math.floor(rand() * TULIP_PALETTE.length)]),
        });
        seeds.push({
          x: side * (3.4 + rand() * 0.7),
          y: 0.06,
          z: z + (rand() - 0.5) * 0.45,
          scale: 0.75 + rand() * 0.38,
          phase: rand() * Math.PI * 2,
          rotY: rand() * Math.PI * 2,
          color: new THREE.Color(TULIP_PALETTE[Math.floor(rand() * TULIP_PALETTE.length)]),
        });
      }
    }

    // Castle Front Accent Beds
    addCluster(-5.5, 0.08, -5.2, 1.4, 1.1, 20);
    addCluster(5.5, 0.08, -5.2, 1.4, 1.1, 20);

    return seeds;
  }, []);

  useEffect(() => {
    if (!stemRef.current || !leafRef.current || !headRef.current) return;

    tulipSeeds.forEach((seed, idx) => {
      // Initial stem placement
      dummy.position.set(seed.x, seed.y + 0.28 * seed.scale, seed.z);
      dummy.rotation.set(0, seed.rotY, 0);
      dummy.scale.set(seed.scale, seed.scale, seed.scale);
      dummy.updateMatrix();
      stemRef.current!.setMatrixAt(idx, dummy.matrix);

      // Leaf blade at stem base
      dummy.position.set(seed.x, seed.y + 0.16 * seed.scale, seed.z);
      dummy.rotation.set(0.35, seed.rotY + 0.4, 0.28);
      dummy.scale.set(seed.scale, seed.scale, seed.scale);
      dummy.updateMatrix();
      leafRef.current!.setMatrixAt(idx, dummy.matrix);

      // Blossom color
      headRef.current!.setColorAt(idx, seed.color);
    });

    stemRef.current.instanceMatrix.needsUpdate = true;
    leafRef.current.instanceMatrix.needsUpdate = true;
    if (headRef.current.instanceColor) {
      headRef.current.instanceColor.needsUpdate = true;
    }
  }, [tulipSeeds, dummy]);

  useFrame((state) => {
    if (!headRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < tulipSeeds.length; i++) {
      const seed = tulipSeeds[i];
      const swayX = Math.sin(t * 1.45 + seed.phase + seed.x * 0.25) * 0.09;
      const swayZ = Math.cos(t * 1.2 + seed.phase + seed.z * 0.25) * 0.07;

      dummy.position.set(
        seed.x + swayX * 0.3,
        seed.y + 0.54 * seed.scale,
        seed.z + swayZ * 0.3
      );
      dummy.rotation.set(swayZ, seed.rotY, -swayX);
      dummy.scale.setScalar(seed.scale);
      dummy.updateMatrix();
      headRef.current.setMatrixAt(i, dummy.matrix);
    }
    headRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group
      onClick={(e) => {
        if (onSelect) {
          e.stopPropagation();
          onSelect();
        }
      }}
    >
      {/* Terraced Flowerbed Mounds */}
      <group position={[-11.5, 0, 3.5]}>
        <mesh position={[0, 0.06, 0]} receiveShadow>
          <cylinderGeometry args={[3.9, 4.2, 0.16, 28]} />
          <meshStandardMaterial color="#8BBE8A" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4.05, 0.14, 8, 36]} />
          <meshStandardMaterial color="#F7EBDD" roughness={0.78} />
        </mesh>
      </group>

      <group position={[-14.6, 0, 0.2]}>
        <mesh position={[0, 0.15, 0]} receiveShadow>
          <cylinderGeometry args={[3.1, 3.5, 0.34, 24]} />
          <meshStandardMaterial color="#83B884" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.35, 0.13, 8, 32]} />
          <meshStandardMaterial color="#F4DDE5" roughness={0.75} />
        </mesh>
      </group>

      <group position={[-10.2, 0, 7.8]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <cylinderGeometry args={[2.9, 3.2, 0.24, 24]} />
          <meshStandardMaterial color="#8EC28E" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.05, 0.12, 8, 30]} />
          <meshStandardMaterial color="#E6DAF8" roughness={0.75} />
        </mesh>
      </group>

      <group position={[-15.5, 0, 5.8]}>
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <cylinderGeometry args={[2.4, 2.7, 0.18, 22]} />
          <meshStandardMaterial color="#8BC08B" roughness={0.9} />
        </mesh>
      </group>

      {/* Floral Entrance Trellis Archway into Tulip Wonderland */}
      <group position={[-7.5, 0, 3.1]} rotation={[0, -0.22, 0]}>
        {[-1.35, 1.35].map((zOff) => (
          <mesh key={zOff} position={[0, 1.35, zOff]} castShadow>
            <cylinderGeometry args={[0.09, 0.11, 2.7, 10]} />
            <meshStandardMaterial color="#FFF6EC" roughness={0.65} />
          </mesh>
        ))}
        <mesh position={[0, 2.68, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[1.35, 0.11, 10, 24, Math.PI]} />
          <meshStandardMaterial color="#F7C6D9" roughness={0.55} />
        </mesh>
        {/* Top Golden Sparkle Blossom */}
        <mesh position={[0, 4.08, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color="#FFD98E"
            emissive="#F6BE65"
            emissiveIntensity={0.45}
          />
        </mesh>
      </group>

      {/* Instanced Tulips (Stems, Leaves, Blossoms) */}
      <instancedMesh ref={stemRef} args={[undefined, undefined, tulipSeeds.length]}>
        <cylinderGeometry args={[0.025, 0.032, 0.56, 6]} />
        <meshStandardMaterial color="#68A874" roughness={0.75} />
      </instancedMesh>

      <instancedMesh ref={leafRef} args={[undefined, undefined, tulipSeeds.length]}>
        <coneGeometry args={[0.085, 0.34, 4]} />
        <meshStandardMaterial color="#7BC083" roughness={0.72} />
      </instancedMesh>

      <instancedMesh
        ref={headRef}
        args={[cupGeometry, undefined, tulipSeeds.length]}
        castShadow
      >
        <meshStandardMaterial color="#FFFFFF" roughness={0.42} />
      </instancedMesh>
    </group>
  );
}
