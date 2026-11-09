import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPBRTextureSet } from '../../utils/pbrMaterials';
import { WaterSurface } from './WaterSurface';

export function WishingFountain({
  position = [0, 0.08, 6.0],
  scale = 1,
  onClick,
}: {
  position?: [number, number, number];
  scale?: number;
  onClick?: () => void;
}) {
  const dropletsRef = useRef<THREE.InstancedMesh>(null);
  const rippleRef = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const marble = useMemo(() => getPBRTextureSet('marble_01', 2, 2), []);
  const poolGeo = useMemo(() => new THREE.CircleGeometry(1.85, 32), []);

  const dropletSeeds = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        angle: (i / 24) * Math.PI * 2,
        phase: (i % 6) / 6,
        radius: 0.42 + (i % 4) * 0.22,
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (rippleRef.current) {
      const pulse = (t * 0.65) % 1;
      const s = 0.65 + pulse * 0.72;
      rippleRef.current.scale.set(s, s, 1);
      const mat = rippleRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - pulse) * 0.42;
    }

    if (dropletsRef.current) {
      dropletSeeds.forEach((seed, idx) => {
        const life = (t * 0.95 + seed.phase) % 1;
        const r = seed.radius * life;
        const x = Math.cos(seed.angle + t * 0.15) * r;
        const z = Math.sin(seed.angle + t * 0.15) * r;
        const y = 2.35 + Math.sin(life * Math.PI) * 0.68 - life * life * 1.95;

        dummy.position.set(x, y, z);
        const s = 0.046 * (1 - life * 0.35);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        dropletsRef.current!.setMatrixAt(idx, dummy.matrix);
      });
      dropletsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group
      position={position}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* Outer Marble Basin Wall */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.18, 0.44, 32]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          roughnessMap={marble.roughnessMap}
          color="#FFF7EE"
          roughness={0.55}
        />
      </mesh>
      <mesh position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.95, 0.12, 10, 36]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#F7DFEB"
          roughness={0.48}
        />
      </mesh>

      {/* Live Normal-Map Shimmering Pool Water */}
      <WaterSurface
        geometry={poolGeo}
        position={[0, 0.37, 0]}
        color="#8EDCFC"
        emissive="#4AC2F2"
        emissiveIntensity={0.2}
        repeat={4}
        speed={0.04}
      />

      {/* Animated Expanding Water Ripple */}
      <mesh ref={rippleRef} position={[0, 0.385, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.92, 1.0, 32]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
      </mesh>

      {/* Central Carved Marble Pedestal */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.54, 1.1, 20]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#FFF6EC"
          roughness={0.52}
        />
      </mesh>

      {/* Upper Bowl */}
      <mesh position={[0, 1.48, 0]} castShadow>
        <cylinderGeometry args={[1.05, 0.48, 0.34, 24]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#FDF0F5"
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 1.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.96, 24]} />
        <meshStandardMaterial color="#A8E1FC" roughness={0.14} metalness={0.18} />
      </mesh>

      {/* Top Spire & Golden Wishing Bud */}
      <mesh position={[0, 1.96, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.24, 0.65, 16]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#FFF6EC"
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 2.38, 0]}>
        <octahedronGeometry args={[0.23, 1]} />
        <meshStandardMaterial
          color="#FFD98E"
          emissive="#F6BE65"
          emissiveIntensity={0.5}
          metalness={0.72}
          roughness={0.22}
        />
      </mesh>

      {/* Animated Water Droplets */}
      <instancedMesh
        ref={dropletsRef}
        args={[undefined, undefined, dropletSeeds.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#E7F7FF"
          emissive="#BCE3FA"
          emissiveIntensity={0.35}
          roughness={0.1}
        />
      </instancedMesh>
    </group>
  );
}
