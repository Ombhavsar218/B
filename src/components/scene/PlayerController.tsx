import { useEffect, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  getGroundHeight,
  getNearestWaterDistance,
  getSurfaceKind,
  getZoneForPosition,
  resolvePlayerCollisions,
} from '../../utils/parkPhysics';
import { findNearestInteractable, type ParkInteractable } from '../../config/parkInteractables';
import { soundEngine } from '../../utils/soundEngine';
import type { ParkDestinationId } from '../../config/birthdayConfig';

export interface PlayerHUDState {
  x: number;
  z: number;
  yaw: number;
  zoneId: ParkDestinationId;
  zoneName: string;
  nearbyInteractable: ParkInteractable | null;
  pointerLocked: boolean;
  sprinting: boolean;
}

export interface PlayerTeleportRequest {
  x: number;
  z: number;
  yaw: number;
  nonce: number;
}

interface PlayerControllerProps {
  isIntro: boolean;
  isModalOpen: boolean;
  isPaused: boolean;
  viewMode: 'first' | 'third';
  sensitivity: number;
  teleportRequest: PlayerTeleportRequest | null;
  joystickRef: MutableRefObject<{ x: number; y: number }>;
  touchLookDeltaRef: MutableRefObject<{ dx: number; dy: number }>;
  jumpRequestRef: MutableRefObject<boolean>;
  sprintToggleRef: MutableRefObject<boolean>;
  onHudUpdate: (hud: PlayerHUDState) => void;
  onInteract: (item: ParkInteractable) => void;
  onZoneDiscovered: (id: ParkDestinationId) => void;
  onTogglePause: () => void;
  onToggleMap: () => void;
  onToggleView: () => void;
}

const EYE_HEIGHT = 1.72;
const WALK_SPEED = 6.2;
const SPRINT_SPEED = 10.6;
const JUMP_VELOCITY = 7.4;
const GRAVITY = 20.0;

export function PlayerController({
  isIntro,
  isModalOpen,
  isPaused,
  viewMode,
  sensitivity,
  teleportRequest,
  joystickRef,
  touchLookDeltaRef,
  jumpRequestRef,
  sprintToggleRef,
  onHudUpdate,
  onInteract,
  onZoneDiscovered,
  onTogglePause,
  onToggleMap,
  onToggleView,
}: PlayerControllerProps) {
  const { camera, gl } = useThree();
  const avatarRef = useRef<THREE.Group>(null);

  // Start outside Main Entrance Gates facing North down the Promenade toward the Castle
  const posRef = useRef(new THREE.Vector3(0, getGroundHeight(0, 50.5) + EYE_HEIGHT, 50.5));
  const velYRef = useRef(0);
  const groundedRef = useRef(true);
  const smoothVelRef = useRef(new THREE.Vector2(0, 0));
  const yawRef = useRef(0);
  const pitchRef = useRef(0.06);
  const headBobRef = useRef(0);
  const keysRef = useRef<Record<string, boolean>>({});
  const pointerDownDragRef = useRef(false);
  const lastDragPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastHudEmitRef = useRef(0);
  const lastNearbyRef = useRef<ParkInteractable | null>(null);
  const pointerLockedRef = useRef(false);

  // Sync camera pose immediately on mount (Outside the Gates entrance view)
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 58;
    cam.updateProjectionMatrix();
    cam.position.set(0, 2.35, 51.5);
    cam.lookAt(0, 5.2, -20);
  }, [camera]);

  // Apply teleport requests ("Enter Park" -> step inside entrance gates, or optional Map travel)
  useEffect(() => {
    if (!teleportRequest) return;
    const groundY = getGroundHeight(teleportRequest.x, teleportRequest.z);
    posRef.current.set(teleportRequest.x, groundY + EYE_HEIGHT, teleportRequest.z);
    velYRef.current = 0;
    groundedRef.current = true;
    smoothVelRef.current.set(0, 0);
    yawRef.current = teleportRequest.yaw;
    pitchRef.current = 0.02;

    const zone = getZoneForPosition(teleportRequest.x, teleportRequest.z);
    onZoneDiscovered(zone.id);
    onHudUpdate({
      x: teleportRequest.x,
      z: teleportRequest.z,
      yaw: teleportRequest.yaw,
      zoneId: zone.id,
      zoneName: zone.name,
      nearbyInteractable: findNearestInteractable(teleportRequest.x, teleportRequest.z, teleportRequest.yaw),
      pointerLocked: pointerLockedRef.current,
      sprinting: false,
    });
  }, [teleportRequest, onHudUpdate, onZoneDiscovered]);

  // Release pointer lock automatically whenever opening a modal / pause / intro
  useEffect(() => {
    if ((isIntro || isModalOpen || isPaused) && document.pointerLockElement === gl.domElement) {
      document.exitPointerLock?.();
    }
  }, [isIntro, isModalOpen, isPaused, gl]);

  // Keyboard, Pointer Lock & Desktop Fallback Drag Listeners
  useEffect(() => {
    const dom = gl.domElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isIntro) return;

      if (e.code === 'Escape') {
        if (!isModalOpen) {
          onTogglePause();
        }
        return;
      }

      if (isModalOpen || isPaused) return;

      keysRef.current[e.code] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        jumpRequestRef.current = true;
      } else if (e.code === 'KeyE') {
        e.preventDefault();
        if (lastNearbyRef.current) {
          onInteract(lastNearbyRef.current);
        }
      } else if (e.code === 'KeyV') {
        e.preventDefault();
        onToggleView();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        onToggleMap();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isIntro || isModalOpen || isPaused) return;
      const mult = 0.0022 * sensitivity;
      if (document.pointerLockElement === dom) {
        yawRef.current -= e.movementX * mult;
        pitchRef.current = Math.max(-1.15, Math.min(1.05, pitchRef.current - e.movementY * mult));
      } else if (pointerDownDragRef.current) {
        const dx = e.clientX - lastDragPosRef.current.x;
        const dy = e.clientY - lastDragPosRef.current.y;
        lastDragPosRef.current = { x: e.clientX, y: e.clientY };
        yawRef.current -= dx * mult * 1.4;
        pitchRef.current = Math.max(-1.15, Math.min(1.05, pitchRef.current - dy * mult * 1.4));
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (isIntro || isModalOpen || isPaused) return;
      soundEngine.startAmbience();
      if (e.pointerType === 'mouse') {
        pointerDownDragRef.current = true;
        lastDragPosRef.current = { x: e.clientX, y: e.clientY };
        if (document.pointerLockElement !== dom) {
          try {
            const p = dom.requestPointerLock?.() as unknown as Promise<void> | undefined;
            if (p && typeof p.catch === 'function') p.catch(() => {});
          } catch {
            // Pointer lock may not be permitted in embedded iframes; drag look works seamlessly
          }
        }
      }
    };

    const handlePointerUp = () => {
      pointerDownDragRef.current = false;
    };

    const handlePointerLockChange = () => {
      pointerLockedRef.current = document.pointerLockElement === dom;
    };

    const handleBlur = () => {
      keysRef.current = {};
      pointerDownDragRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [
    gl,
    isIntro,
    isModalOpen,
    isPaused,
    sensitivity,
    jumpRequestRef,
    onInteract,
    onToggleMap,
    onTogglePause,
    onToggleView,
  ]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.08);
    const cam = camera;

    if (isIntro) {
      // Outside the Main Entrance Gates gently breathing architectural view looking toward the Castle
      const t = state.clock.elapsedTime;
      cam.position.set(Math.sin(t * 0.28) * 0.85, 2.5 + Math.sin(t * 0.42) * 0.14, 51.8);
      cam.lookAt(0, 5.2, -18);
      return;
    }

    // Apply mobile touch look deltas
    if (!isModalOpen && !isPaused) {
      const look = touchLookDeltaRef.current;
      if (Math.abs(look.dx) > 0.001 || Math.abs(look.dy) > 0.001) {
        const mult = 0.0042 * sensitivity;
        yawRef.current -= look.dx * mult;
        pitchRef.current = Math.max(-1.15, Math.min(1.05, pitchRef.current - look.dy * mult));
        look.dx = 0;
        look.dy = 0;
      }
    }

    // Movement Input
    let inputForward = 0;
    let inputRight = 0;
    const keys = keysRef.current;

    if (!isModalOpen && !isPaused) {
      if (keys.KeyW || keys.ArrowUp) inputForward += 1;
      if (keys.KeyS || keys.ArrowDown) inputForward -= 1;
      if (keys.KeyD || keys.ArrowRight) inputRight += 1;
      if (keys.KeyA || keys.ArrowLeft) inputRight -= 1;

      const joy = joystickRef.current;
      if (Math.abs(joy.x) > 0.04 || Math.abs(joy.y) > 0.04) {
        inputRight += joy.x;
        inputForward += joy.y;
      }
    }

    const mag = Math.hypot(inputForward, inputRight);
    if (mag > 1) {
      inputForward /= mag;
      inputRight /= mag;
    }

    const sprinting = Boolean(keys.ShiftLeft || keys.ShiftRight || sprintToggleRef.current) && mag > 0.1;
    const maxSpeed = sprinting ? SPRINT_SPEED : WALK_SPEED;

    const yaw = yawRef.current;
    const fwdX = -Math.sin(yaw);
    const fwdZ = -Math.cos(yaw);
    const rightX = Math.cos(yaw);
    const rightZ = -Math.sin(yaw);

    const targetVx = (fwdX * inputForward + rightX * inputRight) * maxSpeed;
    const targetVz = (fwdZ * inputForward + rightZ * inputRight) * maxSpeed;

    const accel = 1 - Math.exp(-12 * dt);
    smoothVelRef.current.x = THREE.MathUtils.lerp(smoothVelRef.current.x, targetVx, accel);
    smoothVelRef.current.y = THREE.MathUtils.lerp(smoothVelRef.current.y, targetVz, accel);

    const nextX = posRef.current.x + smoothVelRef.current.x * dt;
    const nextZ = posRef.current.z + smoothVelRef.current.y * dt;

    const resolved = resolvePlayerCollisions(nextX, nextZ, posRef.current.x, posRef.current.z);
    posRef.current.x = resolved.x;
    posRef.current.z = resolved.z;

    const groundY = getGroundHeight(posRef.current.x, posRef.current.z);
    const targetEyeY = groundY + EYE_HEIGHT;

    // Jump & Gravity
    if (jumpRequestRef.current) {
      jumpRequestRef.current = false;
      if (groundedRef.current && !isModalOpen && !isPaused) {
        velYRef.current = JUMP_VELOCITY;
        groundedRef.current = false;
      }
    }

    if (!groundedRef.current || posRef.current.y > targetEyeY + 0.02) {
      velYRef.current -= GRAVITY * dt;
      posRef.current.y += velYRef.current * dt;
      if (posRef.current.y <= targetEyeY) {
        posRef.current.y = targetEyeY;
        velYRef.current = 0;
        groundedRef.current = true;
      }
    } else {
      // Smoothly step up ramps & stairs
      posRef.current.y = THREE.MathUtils.lerp(posRef.current.y, targetEyeY, Math.min(1, dt * 16));
      groundedRef.current = true;
    }

    // Subtle Head Bob & Context Footsteps
    const horizSpeed = Math.hypot(smoothVelRef.current.x, smoothVelRef.current.y);
    if (groundedRef.current && horizSpeed > 1.2) {
      headBobRef.current += dt * (sprinting ? 13 : 9.5);
      const surface = getSurfaceKind(posRef.current.x, posRef.current.z);
      soundEngine.playFootstep(surface, sprinting);
    }
    const bobOffset = viewMode === 'first' && horizSpeed > 1.2 ? Math.sin(headBobRef.current) * 0.045 : 0;

    // Water Proximity Sound
    soundEngine.setWaterProximity(getNearestWaterDistance(posRef.current.x, posRef.current.z));

    // Apply Camera Transform (1st-person eye OR 3rd-person shoulder follow)
    const euler = new THREE.Euler(pitchRef.current, yawRef.current, 0, 'YXZ');
    if (viewMode === 'first') {
      cam.position.set(posRef.current.x, posRef.current.y + bobOffset, posRef.current.z);
      cam.quaternion.setFromEuler(euler);
    } else {
      const camDir = new THREE.Vector3(0, 0, 1).applyEuler(euler);
      const thirdPos = new THREE.Vector3(
        posRef.current.x + camDir.x * 4.4,
        Math.max(groundY + 0.8, posRef.current.y + 0.55 + camDir.y * 4.4),
        posRef.current.z + camDir.z * 4.4
      );
      cam.position.lerp(thirdPos, Math.min(1, dt * 14));
      cam.lookAt(posRef.current.x, posRef.current.y - 0.1, posRef.current.z);
    }

    // Update Optional Third-Person Explorer Avatar
    if (avatarRef.current) {
      avatarRef.current.visible = viewMode === 'third';
      avatarRef.current.position.set(posRef.current.x, posRef.current.y - EYE_HEIGHT, posRef.current.z);
      avatarRef.current.rotation.y = yawRef.current;
    }

    // Throttled HUD updates (~12 Hz)
    const now = state.clock.elapsedTime;
    if (now - lastHudEmitRef.current > 0.085) {
      lastHudEmitRef.current = now;
      const nearby = findNearestInteractable(posRef.current.x, posRef.current.z, yawRef.current);
      lastNearbyRef.current = nearby;
      const zone = getZoneForPosition(posRef.current.x, posRef.current.z);
      if (zone.id !== 'intro' && zone.id !== 'hub') {
        onZoneDiscovered(zone.id);
      }
      onHudUpdate({
        x: posRef.current.x,
        z: posRef.current.z,
        yaw: yawRef.current,
        zoneId: zone.id,
        zoneName: zone.name,
        nearbyInteractable: nearby,
        pointerLocked: pointerLockedRef.current,
        sprinting,
      });
    }
  });

  // Optional 3rd-person stylized pastel explorer avatar (hidden in default 1st-person mode!)
  return (
    <group ref={avatarRef} visible={viewMode === 'third'}>
      {/* Boots / Legs */}
      <mesh position={[-0.12, 0.36, 0]} castShadow>
        <capsuleGeometry args={[0.075, 0.45, 6, 8]} />
        <meshStandardMaterial color="#5E467A" roughness={0.65} />
      </mesh>
      <mesh position={[0.12, 0.36, 0]} castShadow>
        <capsuleGeometry args={[0.075, 0.45, 6, 8]} />
        <meshStandardMaterial color="#5E467A" roughness={0.65} />
      </mesh>
      {/* Coat & Cloak */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 0.72, 12]} />
        <meshStandardMaterial color="#FADAE6" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.96, 0.22]} rotation={[0.18, 0, 0]} castShadow>
        <coneGeometry args={[0.32, 0.9, 10, 1, true, -Math.PI * 0.45, Math.PI * 0.9]} />
        <meshStandardMaterial color="#B89CEB" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Head & Explorer Crown Cap */}
      <mesh position={[0, 1.56, 0]} castShadow>
        <sphereGeometry args={[0.19, 14, 12]} />
        <meshStandardMaterial color="#FFE3D4" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.72, 0]}>
        <coneGeometry args={[0.16, 0.18, 8]} />
        <meshStandardMaterial color="#F6BE65" metalness={0.35} roughness={0.35} />
      </mesh>
    </group>
  );
}
