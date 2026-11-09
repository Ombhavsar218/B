import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getWaterNormalTexture } from '../../utils/pbrMaterials';

interface WaterSurfaceProps {
  geometry: THREE.BufferGeometry;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
  speed?: number;
  repeat?: number;
  opacity?: number;
}

export function WaterSurface({
  geometry,
  position = [0, 0.02, 0],
  rotation = [-Math.PI / 2, 0, 0],
  color = '#7FD4FA',
  emissive = '#4CBBE8',
  emissiveIntensity = 0.16,
  speed = 0.03,
  repeat = 8,
  opacity = 0.92,
}: WaterSurfaceProps) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  const normalTex = useMemo(() => {
    const base = getWaterNormalTexture(repeat, repeat).clone();
    base.repeat.set(repeat, repeat);
    base.needsUpdate = true;
    return base;
  }, [repeat]);

  useFrame((_, delta) => {
    normalTex.offset.x = (normalTex.offset.x + delta * speed) % 1;
    normalTex.offset.y = (normalTex.offset.y + delta * speed * 0.7) % 1;
  });

  return (
    <mesh geometry={geometry} position={position} rotation={rotation} receiveShadow>
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        normalMap={normalTex}
        normalScale={new THREE.Vector2(0.45, 0.45)}
        roughness={0.14}
        metalness={0.22}
        envMapIntensity={1.25}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}
