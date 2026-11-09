import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function WishingFountain({
  position = [0, 0.07, 2.0],
}: {
  position?: [number, number, number];
}) {
  const dropletsRef = useRef<THREE.InstancedMesh>(null);
  const rippleRef = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const dropletSeeds = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        angle: (i / 18) * Math.PI * 2,
        phase: (i % 6) / 6,
        radius: 0.42 + (i % 3) * 0.24,
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (rippleRef.current) {
      const pulse = (t * 0.65) % 1;
      const scale = 0.65 + pulse * 0.72;
      rippleRef.current.scale.set(scale, scale, 1);
      const mat = rippleRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - pulse) * 0.45;
    }

    if (dropletsRef.current) {
      dropletSeeds.forEach((seed, idx) => {
        const life = (t * 0.95 + seed.phase) % 1;
        const r = seed.radius * life;
        const x = Math.cos(seed.angle + t * 0.15) * r;
        const z = Math.sin(seed.angle + t * 0.15) * r;
        // Parabolic fountain arc from finial (y=2.35) down into basin (y=0.4)
        const y = 2.35 + Math.sin(life * Math.PI) * 0.65 - life * life * 1.95;

        dummy.position.set(x, y, z);
        const s = 0.045 * (1 - life * 0.4);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        dropletsRef.current!.setMatrixAt(idx, dummy.matrix);
      });
      dropletsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Outer Marble Basin Wall */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.15, 0.44, 32]} />
        <meshStandardMaterial color="#FFF6EC" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.95, 0.11, 10, 36]} />
        <meshStandardMaterial color="#F7DFEB" roughness={0.55} />
      </mesh>

      {/* Shimmering Sky-Blue Pool Water */}
      <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.85, 32]} />
        <meshStandardMaterial
          color="#9FDDFB"
          roughness={0.18}
          metalness={0.1}
          emissive="#BCE3FA"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Animated Expanding Water Ripple */}
      <mesh ref={rippleRef} position={[0, 0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.92, 1.0, 32]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
      </mesh>

      {/* Central Pedestal */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.54, 1.1, 20]} />
        <meshStandardMaterial color="#FFF6EC" roughness={0.6} />
      </mesh>

      {/* Upper Bowl */}
      <mesh position={[0, 1.48, 0]} castShadow>
        <cylinderGeometry args={[1.05, 0.48, 0.34, 24]} />
        <meshStandardMaterial color="#FDF0F5" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.96, 24]} />
        <meshStandardMaterial color="#A8E1FC" roughness={0.2} />
      </mesh>

      {/* Top Spire & Golden Wishing Bud */}
      <mesh position={[0, 1.96, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.24, 0.65, 16]} />
        <meshStandardMaterial color="#FFF6EC" roughness={0.55} />
      </mesh>
      <mesh position={[0, 2.38, 0]}>
        <octahedronGeometry args={[0.22, 1]} />
        <meshStandardMaterial
          color="#FFD98E"
          emissive="#F6BE65"
          emissiveIntensity={0.45}
          metalness={0.45}
          roughness={0.25}
        />
      </mesh>

      {/* Animated Water Droplets */}
      <instancedMesh ref={dropletsRef} args={[undefined, undefined, dropletSeeds.length]}>
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
