import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPBRTextureSet } from '../../utils/pbrMaterials';

export function CurvedPath({
  points,
  radius = 1.4,
  color = '#FAF0E6',
}: {
  points: [number, number, number][];
  radius?: number;
  color?: string;
}) {
  const cobble = useMemo(() => getPBRTextureSet('cobblestone_floor_02', 2, 12), []);

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(p[0], 0, p[2]))
    );
    return new THREE.TubeGeometry(curve, 36, radius, 8, false);
  }, [points, radius]);

  return (
    <mesh geometry={geometry} position={[0, 0.025, 0]} scale={[1, 0.06, 1]} receiveShadow>
      <meshStandardMaterial
        map={cobble.map}
        normalMap={cobble.normalMap}
        roughnessMap={cobble.roughnessMap}
        color={color}
        roughness={0.86}
      />
    </mesh>
  );
}

export function StorybookTree({
  position,
  canopyColor = '#F7C2D5',
  trunkColor = '#8E6D5B',
  scale = 1,
  swayOffset = 0,
}: {
  position: [number, number, number];
  canopyColor?: string;
  trunkColor?: string;
  scale?: number;
  swayOffset?: number;
}) {
  const canopyRef = useRef<THREE.Group>(null);
  const wood = useMemo(() => getPBRTextureSet('oak_wood_planks', 2, 3), []);

  useFrame((state) => {
    if (canopyRef.current) {
      const t = state.clock.elapsedTime;
      canopyRef.current.rotation.z = Math.sin(t * 1.1 + swayOffset) * 0.032;
      canopyRef.current.rotation.x = Math.cos(t * 0.9 + swayOffset) * 0.022;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Tapered Root Collar */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.38, 0.34, 10]} />
        <meshStandardMaterial
          map={wood.map}
          normalMap={wood.normalMap}
          color={trunkColor}
          roughness={0.92}
        />
      </mesh>
      <mesh position={[0, 0.98, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 1.9, 10]} />
        <meshStandardMaterial
          map={wood.map}
          normalMap={wood.normalMap}
          color={trunkColor}
          roughness={0.9}
        />
      </mesh>
      <group ref={canopyRef} position={[0, 2.25, 0]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <dodecahedronGeometry args={[1.18, 1]} />
          <meshStandardMaterial color={canopyColor} roughness={0.78} />
        </mesh>
        <mesh position={[-0.72, -0.14, 0.36]} castShadow>
          <dodecahedronGeometry args={[0.82, 1]} />
          <meshStandardMaterial color={canopyColor} roughness={0.78} />
        </mesh>
        <mesh position={[0.72, -0.1, -0.32]} castShadow>
          <dodecahedronGeometry args={[0.85, 1]} />
          <meshStandardMaterial color={canopyColor} roughness={0.78} />
        </mesh>
        <mesh position={[0.05, 0.65, -0.15]} castShadow>
          <dodecahedronGeometry args={[0.74, 1]} />
          <meshStandardMaterial color={canopyColor} roughness={0.76} />
        </mesh>
      </group>
    </group>
  );
}

export function ArchedBridge({
  position,
  rotationY = 0,
  deckColor = '#FFF5EA',
  railColor = '#F7C6D9',
  length = 6.2,
  width = 3.1,
  surface = 'stone',
}: {
  position: [number, number, number];
  rotationY?: number;
  deckColor?: string;
  railColor?: string;
  length?: number;
  width?: number;
  surface?: 'wood' | 'stone';
}) {
  const tex = useMemo(
    () =>
      getPBRTextureSet(
        surface === 'wood' ? 'oak_wood_planks' : 'marble_01',
        2,
        4
      ),
    [surface]
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Main Bridge Deck */}
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.26, length]} />
        <meshStandardMaterial
          map={tex.map}
          normalMap={tex.normalMap}
          roughnessMap={tex.roughnessMap}
          color={deckColor}
          roughness={surface === 'wood' ? 0.78 : 0.64}
        />
      </mesh>
      {/* Stone Curb Trim Along Bridge Sides */}
      {[-width / 2 + 0.08, width / 2 - 0.08].map((cx) => (
        <mesh key={cx} position={[cx, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.1, length]} />
          <meshStandardMaterial color={railColor} roughness={0.58} />
        </mesh>
      ))}
      {/* Entry & Exit Ramps */}
      {[-1, 1].map((dir) => (
        <mesh
          key={dir}
          position={[0, 0.14, dir * (length / 2 + 0.55)]}
          rotation={[dir * 0.22, 0, 0]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[width, 0.22, 1.4]} />
          <meshStandardMaterial
            map={tex.map}
            normalMap={tex.normalMap}
            roughnessMap={tex.roughnessMap}
            color={deckColor}
            roughness={surface === 'wood' ? 0.8 : 0.68}
          />
        </mesh>
      ))}
      {/* Side Railings + Lantern Posts */}
      {[-width / 2 + 0.14, width / 2 - 0.14].map((rx) => (
        <group key={rx}>
          <mesh position={[rx, 0.82, 0]} castShadow>
            <boxGeometry args={[0.14, 0.12, length]} />
            <meshStandardMaterial color={railColor} roughness={0.52} />
          </mesh>
          {[-length * 0.42, -length * 0.14, length * 0.14, length * 0.42].map((pz, idx) => (
            <group key={pz} position={[rx, 0.62, pz]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.1, 0.65, 8]} />
                <meshStandardMaterial color={deckColor} roughness={0.62} />
              </mesh>
              {(idx === 0 || idx === 3) && (
                <mesh position={[0, 0.42, 0]}>
                  <sphereGeometry args={[0.12, 10, 10]} />
                  <meshStandardMaterial
                    color="#FFD98E"
                    emissive="#F6BE65"
                    emissiveIntensity={0.65}
                  />
                </mesh>
              )}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

export function ParkLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cast-iron base plinth */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.2, 0.24, 10]} />
        <meshStandardMaterial color="#4B3E5E" metalness={0.55} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.095, 1.56, 8]} />
        <meshStandardMaterial color="#4F4264" metalness={0.58} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#FFF0BF" emissive="#FFD47D" emissiveIntensity={1.05} />
      </mesh>
      <mesh position={[0, 1.94, 0]}>
        <coneGeometry args={[0.24, 0.18, 8]} />
        <meshStandardMaterial color="#6D5783" metalness={0.48} roughness={0.38} />
      </mesh>
    </group>
  );
}
