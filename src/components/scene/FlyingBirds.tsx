import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface BirdInstanceProps {
  url: string;
  center: [number, number, number];
  radiusX: number;
  radiusZ: number;
  speed: number;
  phase: number;
  tint?: string;
}

function GlidingBird({
  url,
  center,
  radiusX,
  radiusZ,
  speed,
  phase,
  tint,
}: BirdInstanceProps) {
  const { scene, animations } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  const { cloned, mixer } = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        m.castShadow = true;
        if (m.material) {
          const mat = (m.material as THREE.MeshStandardMaterial).clone();
          if (tint && mat.color) {
            mat.color.lerp(new THREE.Color(tint), 0.3);
          }
          mat.envMapIntensity = 0.85;
          m.material = mat;
        }
      }
    });
    const mix = new THREE.AnimationMixer(copy);
    if (animations.length > 0) {
      const action = mix.clipAction(animations[0]);
      action.timeScale = 1.15;
      action.play();
    }
    return { cloned: copy, mixer: mix };
  }, [scene, animations, tint]);

  useEffect(() => {
    mixer.setTime(phase * 2.5);
    return () => {
      mixer.stopAllAction();
    };
  }, [mixer, phase]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.08);
    mixer.update(dt);

    if (groupRef.current) {
      const t = state.clock.elapsedTime * speed + phase;
      const x = center[0] + Math.cos(t) * radiusX;
      const z = center[2] + Math.sin(t) * radiusZ;
      const y = center[1] + Math.sin(t * 2.0) * 1.1;

      const nx = center[0] + Math.cos(t + 0.04) * radiusX;
      const nz = center[2] + Math.sin(t + 0.04) * radiusZ;
      groupRef.current.position.set(x, y, z);
      groupRef.current.lookAt(nx, y, nz);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={cloned} scale={0.015} />
    </group>
  );
}

export function FlyingBirds() {
  return (
    <group>
      <GlidingBird
        url="/models/Stork.glb"
        center={[0, 18, -12]}
        radiusX={34}
        radiusZ={24}
        speed={0.18}
        phase={0.2}
      />
      <GlidingBird
        url="/models/Stork.glb"
        center={[4, 19.5, -10]}
        radiusX={31}
        radiusZ={22}
        speed={0.18}
        phase={0.55}
      />
      <GlidingBird
        url="/models/Flamingo.glb"
        center={[-22, 14.5, 10]}
        radiusX={22}
        radiusZ={18}
        speed={0.22}
        phase={1.8}
        tint="#FADAE6"
      />
      <GlidingBird
        url="/models/Flamingo.glb"
        center={[-20, 15.8, 12]}
        radiusX={20}
        radiusZ={16}
        speed={0.22}
        phase={2.1}
        tint="#FFD4E4"
      />
      <GlidingBird
        url="/models/Stork.glb"
        center={[28, 17, 14]}
        radiusX={24}
        radiusZ={20}
        speed={0.16}
        phase={4.1}
      />
    </group>
  );
}
