import { useEffect, useRef, type ComponentRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { birthdayConfig } from '../../config/birthdayConfig';
import type { ParkDestinationId } from '../ui/FloatingNav';

interface CameraRigProps {
  destinationId: ParkDestinationId;
  focusNonce: number;
  isIntro: boolean;
}

export function CameraRig({ destinationId, focusNonce, isIntro }: CameraRigProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera } = useThree();

  const isTransitioning = useRef(false);
  const desiredPosition = useRef(new THREE.Vector3(...birthdayConfig.destinations.intro.cameraPosition));
  const desiredTarget = useRef(new THREE.Vector3(...birthdayConfig.destinations.intro.cameraTarget));
  const initialized = useRef(false);

  useEffect(() => {
    const dest = birthdayConfig.destinations[destinationId];
    desiredPosition.current.set(...dest.cameraPosition);
    desiredTarget.current.set(...dest.cameraTarget);

    if (!initialized.current) {
      camera.position.copy(desiredPosition.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(desiredTarget.current);
        controlsRef.current.update();
      }
      initialized.current = true;
      isTransitioning.current = false;
      return;
    }

    isTransitioning.current = true;
  }, [destinationId, focusNonce, camera]);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const clampedDelta = Math.min(delta, 0.05);

    if (isIntro && !isTransitioning.current) {
      // Gentle cinematic breath while viewing the intro castle vista
      const t = state.clock.elapsedTime;
      const basePos = birthdayConfig.destinations.intro.cameraPosition;
      state.camera.position.x = basePos[0] + Math.sin(t * 0.28) * 0.65;
      state.camera.position.y = basePos[1] + Math.sin(t * 0.4) * 0.22;
      controls.target.set(
        birthdayConfig.destinations.intro.cameraTarget[0],
        birthdayConfig.destinations.intro.cameraTarget[1],
        birthdayConfig.destinations.intro.cameraTarget[2]
      );
      controls.update();
      return;
    }

    if (isTransitioning.current) {
      const alpha = 1 - Math.exp(-3.5 * clampedDelta);
      state.camera.position.lerp(desiredPosition.current, alpha);
      controls.target.lerp(desiredTarget.current, alpha);
      controls.update();

      const posDist = state.camera.position.distanceTo(desiredPosition.current);
      const targetDist = controls.target.distanceTo(desiredTarget.current);

      if (posDist < 0.06 && targetDist < 0.06) {
        state.camera.position.copy(desiredPosition.current);
        controls.target.copy(desiredTarget.current);
        controls.update();
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      enablePan={!isIntro}
      enableZoom={!isIntro}
      enableRotate={!isIntro}
      minDistance={6.5}
      maxDistance={46}
      minPolarAngle={0.22}
      maxPolarAngle={Math.PI * 0.455}
      panSpeed={0.75}
      rotateSpeed={0.75}
      zoomSpeed={0.85}
      onStart={() => {
        if (!isIntro) {
          isTransitioning.current = false;
        }
      }}
    />
  );
}
