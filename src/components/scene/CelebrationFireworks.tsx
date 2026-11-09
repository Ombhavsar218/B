import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BURST_COLORS = ['#F7C6D9', '#8ECDF2', '#FFD98E', '#C9ADEF', '#FF99BC', '#A2F5C6'];

export function CelebrationFireworks({ active }: { active: boolean }) {
  const sparkRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    let s = 888;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };

    const items: Array<{
      burstOrigin: [number, number, number];
      dir: [number, number, number];
      speed: number;
      phaseOffset: number;
      color: THREE.Color;
    }> = [];

    const origins: [number, number, number][] = [
      [-6, 13.5, -5],
      [6, 15, -3],
      [0, 17, -6],
    ];

    for (let b = 0; b < origins.length; b++) {
      const origin = origins[b];
      const baseColor = BURST_COLORS[(b * 2) % BURST_COLORS.length];
      const altColor = BURST_COLORS[(b * 2 + 1) % BURST_COLORS.length];
      for (let i = 0; i < 42; i++) {
        const theta = rand() * Math.PI * 2;
        const phi = Math.acos(2 * rand() - 1);
        items.push({
          burstOrigin: origin,
          dir: [
            Math.sin(phi) * Math.cos(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta),
          ],
          speed: 3.2 + rand() * 3.0,
          phaseOffset: b * 0.85,
          color: new THREE.Color(i % 2 === 0 ? baseColor : altColor),
        });
      }
    }
    return items;
  }, []);

  useFrame((state) => {
    if (!sparkRef.current) return;
    if (!active) {
      for (let i = 0; i < particles.length; i++) {
        dummy.scale.setScalar(0.0001);
        dummy.updateMatrix();
        sparkRef.current.setMatrixAt(i, dummy.matrix);
      }
      sparkRef.current.instanceMatrix.needsUpdate = true;
      return;
    }

    const t = state.clock.elapsedTime;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const cycle = ((t * 0.48 + p.phaseOffset) % 2.4) / 2.4;
      const spread = Math.pow(cycle, 0.55) * p.speed * 1.9;
      const x = p.burstOrigin[0] + p.dir[0] * spread;
      const y = p.burstOrigin[1] + p.dir[1] * spread - cycle * cycle * 4.2;
      const z = p.burstOrigin[2] + p.dir[2] * spread;
      const size = (1 - cycle) * 0.24;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(Math.max(0.001, size));
      dummy.updateMatrix();
      sparkRef.current.setMatrixAt(i, dummy.matrix);
      sparkRef.current.setColorAt(i, p.color);
    }
    sparkRef.current.instanceMatrix.needsUpdate = true;
    if (sparkRef.current.instanceColor) {
      sparkRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={sparkRef}
      args={[undefined, undefined, particles.length]}
      frustumCulled={false}
    >
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#FFFFFF"
        emissive="#FFF2C2"
        emissiveIntensity={1.5}
        roughness={0.1}
      />
    </instancedMesh>
  );
}
