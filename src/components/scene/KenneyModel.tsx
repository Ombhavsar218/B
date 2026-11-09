import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface KenneyModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  tintColor?: string;
  roughness?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export function KenneyModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  tintColor,
  roughness = 0.72,
  castShadow = true,
  receiveShadow = true,
}: KenneyModelProps) {
  const { scene } = useGLTF(url);

  const cloned = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;
        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          if (tintColor && mat.color) {
            mat.color.lerp(new THREE.Color(tintColor), 0.25);
          }
          if (typeof mat.roughness === 'number') {
            mat.roughness = Math.max(roughness * 0.8, mat.roughness);
          }
          mat.envMapIntensity = 0.85;
          mesh.material = mat;
        }
      }
    });
    return copy;
  }, [scene, castShadow, receiveShadow, tintColor, roughness]);

  return (
    <primitive
      object={cloned}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}
