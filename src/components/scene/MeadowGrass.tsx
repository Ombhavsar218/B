import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GRASS_COLORS = ['#7FC27E', '#8DCE8A', '#73B874', '#98D693', '#A1DF9A'];

export function MeadowGrass() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const bladeGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.065, 0.36, 4);
    geo.translate(0, 0.18, 0);
    return geo;
  }, []);

  const seeds = useMemo(() => {
    let s = 2026;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };

    const items: Array<{
      x: number;
      z: number;
      scaleY: number;
      scaleXZ: number;
      rotY: number;
      phase: number;
      color: THREE.Color;
    }> = [];

    for (let i = 0; i < 2400; i++) {
      const angle = rand() * Math.PI * 2;
      const r = 9.5 + Math.sqrt(rand()) * 67;
      const x = Math.cos(angle) * r;
      const z = -2 + Math.sin(angle) * r;

      // Skip canal ring, central promenade, Frozen Kingdom snow, and Galaxy dark platform
      const canalR = Math.hypot(x, z + 2);
      if (canalR > 16.8 && canalR < 23.2) continue;
      if (Math.abs(x) < 3.4 && z > -24 && z < 40) continue;
      if (Math.hypot(x + 46, z + 33) < 25) continue; // Frozen snow
      if (Math.hypot(x - 46, z + 34) < 24) continue; // Galaxy platform
      if (Math.hypot(x - 48, z + 2) < 6.8) continue; // Celebration stage
      if (Math.hypot(x, z + 33.6) < 8.5) continue; // Castle terrace
      if (Math.hypot(x + 36, z - 22.5) < 5.8) continue; // Tulip pond

      items.push({
        x,
        z,
        scaleY: 0.7 + rand() * 0.9,
        scaleXZ: 0.8 + rand() * 0.65,
        rotY: rand() * Math.PI * 2,
        phase: rand() * Math.PI * 2,
        color: new THREE.Color(GRASS_COLORS[Math.floor(rand() * GRASS_COLORS.length)]),
      });
    }

    return items;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    seeds.forEach((b, idx) => {
      dummy.position.set(b.x, 0.04, b.z);
      dummy.rotation.set(0, b.rotY, 0);
      dummy.scale.set(b.scaleXZ, b.scaleY, b.scaleXZ);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(idx, dummy.matrix);
      meshRef.current!.setColorAt(idx, b.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [seeds, dummy]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // Animate gentle wind waves across a sliding subset each frame for silky 60fps mobile perf
    for (let i = 0; i < seeds.length; i += 2) {
      const b = seeds[i];
      const sway = Math.sin(t * 1.9 + b.phase + b.x * 0.15) * 0.14;
      dummy.position.set(b.x, 0.04, b.z);
      dummy.rotation.set(sway * 0.5, b.rotY, sway);
      dummy.scale.set(b.scaleXZ, b.scaleY, b.scaleXZ);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[bladeGeometry, undefined, seeds.length]}
      frustumCulled={false}
      receiveShadow
    >
      <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
    </instancedMesh>
  );
}
