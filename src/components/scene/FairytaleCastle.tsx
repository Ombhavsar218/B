import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPBRTextureSet } from '../../utils/pbrMaterials';

interface FairytaleCastleProps {
  position?: [number, number, number];
  scale?: number;
  onSelect?: () => void;
}

interface TowerProps {
  position: [number, number, number];
  radius: number;
  height: number;
  roofHeight: number;
  roofColor: string;
  wallColor?: string;
  hasWindow?: boolean;
  flagOffset?: number;
}

function CastleTower({
  position,
  radius,
  height,
  roofHeight,
  roofColor,
  wallColor = '#FFF3EA',
  hasWindow = true,
  flagOffset = 0,
}: TowerProps) {
  const flagRef = useRef<THREE.Mesh>(null);
  const brick = useMemo(() => getPBRTextureSet('castle_brick_02_white', 2, 3), []);
  const marble = useMemo(() => getPBRTextureSet('marble_01', 2, 1), []);

  useFrame((state) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2.2 + flagOffset) * 0.28;
    }
  });

  return (
    <group position={position}>
      {/* Stone base plinth */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 1.12, radius * 1.18, 0.5, 20]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#EFE0D9"
          roughness={0.72}
        />
      </mesh>

      {/* Main cylindrical masonry tower */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.04, height, 24]} />
        <meshStandardMaterial
          map={brick.map}
          normalMap={brick.normalMap}
          roughnessMap={brick.roughnessMap}
          color={wallColor}
          roughness={0.74}
        />
      </mesh>

      {/* Corbelled upper collar */}
      <mesh position={[0, height - 0.12, 0]} castShadow>
        <cylinderGeometry args={[radius * 1.18, radius * 1.02, 0.36, 20]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#F7C6D9"
          roughness={0.54}
        />
      </mesh>

      {/* Gold trim band */}
      <mesh position={[0, height + 0.08, 0]}>
        <torusGeometry args={[radius * 1.14, 0.055, 8, 28]} />
        <meshStandardMaterial color="#F6BE65" metalness={0.74} roughness={0.24} />
      </mesh>

      {/* Conical fairytale roof */}
      <mesh position={[0, height + roofHeight / 2 + 0.08, 0]} castShadow>
        <coneGeometry args={[radius * 1.24, roofHeight, 24]} />
        <meshStandardMaterial color={roofColor} roughness={0.44} metalness={0.12} />
      </mesh>

      {/* Finial spire pole */}
      <mesh position={[0, height + roofHeight + 0.45, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.85, 8]} />
        <meshStandardMaterial color="#F6BE65" metalness={0.75} roughness={0.22} />
      </mesh>

      {/* Golden orb finial */}
      <mesh position={[0, height + roofHeight + 0.88, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color="#FFD98E"
          emissive="#F6BE65"
          emissiveIntensity={0.4}
          metalness={0.78}
          roughness={0.2}
        />
      </mesh>

      {/* Fluttering pennant */}
      <mesh ref={flagRef} position={[0.24, height + roofHeight + 0.68, 0]}>
        <coneGeometry args={[0.14, 0.46, 3]} />
        <meshStandardMaterial color="#F7C6D9" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Warm arched glowing windows */}
      {hasWindow && (
        <>
          <mesh position={[0, height * 0.62, radius * 0.96]}>
            <capsuleGeometry args={[radius * 0.18, radius * 0.34, 6, 12]} />
            <meshStandardMaterial
              color="#FFE7A8"
              emissive="#FFD178"
              emissiveIntensity={0.72}
              roughness={0.28}
            />
          </mesh>
          <mesh position={[0, height * 0.62, radius * 0.93]}>
            <torusGeometry args={[radius * 0.22, 0.035, 8, 16]} />
            <meshStandardMaterial color="#E6B86A" metalness={0.68} roughness={0.26} />
          </mesh>
        </>
      )}
    </group>
  );
}

export function FairytaleCastle({
  position = [0, 0, -11.5],
  scale = 1,
  onSelect,
}: FairytaleCastleProps) {
  const brick = useMemo(() => getPBRTextureSet('castle_brick_02_white', 3, 2), []);
  const marble = useMemo(() => getPBRTextureSet('marble_01', 4, 4), []);

  return (
    <group
      position={position}
      scale={scale}
      onClick={(e) => {
        if (onSelect) {
          e.stopPropagation();
          onSelect();
        }
      }}
    >
      {/* Elevated Royal Stone Terrace */}
      <mesh position={[0, 0.22, 0.4]} receiveShadow castShadow>
        <cylinderGeometry args={[7.4, 7.9, 0.44, 32]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          roughnessMap={marble.roughnessMap}
          color="#F6EBE3"
          roughness={0.66}
        />
      </mesh>
      <mesh position={[0, 0.44, 0.4]} receiveShadow>
        <cylinderGeometry args={[7.15, 7.15, 0.08, 32]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#FFF7EE"
          roughness={0.62}
        />
      </mesh>

      {/* Grand Front Steps leading down toward Plaza (+Z) */}
      {[0, 1, 2].map((step) => (
        <mesh
          key={step}
          position={[0, 0.08 + step * 0.12, 7.45 - step * 0.52]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[3.8 - step * 0.2, 0.14, 0.62]} />
          <meshStandardMaterial
            map={marble.map}
            normalMap={marble.normalMap}
            color="#FAF0E8"
            roughness={0.64}
          />
        </mesh>
      ))}

      {/* Main Castle Keep Structure (y starts at terrace top 0.46) */}
      <group position={[0, 0.46, 0]}>
        {/* Lower Fortress Body */}
        <mesh position={[0, 1.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.4, 3.7, 5.8]} />
          <meshStandardMaterial
            map={brick.map}
            normalMap={brick.normalMap}
            roughnessMap={brick.roughnessMap}
            color="#FFF3EB"
            roughness={0.72}
          />
        </mesh>

        {/* Blush stone trim band around lower keep */}
        <mesh position={[0, 3.72, 0]} castShadow>
          <boxGeometry args={[8.7, 0.28, 6.1]} />
          <meshStandardMaterial color="#F7C6D9" roughness={0.55} />
        </mesh>

        {/* Battlement Crenellations along front parapet */}
        {[-3.4, -2.2, -1.1, 1.1, 2.2, 3.4].map((x) => (
          <mesh key={x} position={[x, 4.02, 2.86]} castShadow>
            <boxGeometry args={[0.55, 0.4, 0.35]} />
            <meshStandardMaterial
              map={marble.map}
              normalMap={marble.normalMap}
              color="#FFF6EE"
              roughness={0.66}
            />
          </mesh>
        ))}

        {/* Upper Central Keep */}
        <mesh position={[0, 4.9, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 3.2, 4.0]} />
          <meshStandardMaterial
            map={brick.map}
            normalMap={brick.normalMap}
            roughnessMap={brick.roughnessMap}
            color="#FDF0F5"
            roughness={0.68}
          />
        </mesh>

        {/* Central Grand Spire Tower */}
        <CastleTower
          position={[0, 4.2, -0.35]}
          radius={1.42}
          height={5.2}
          roofHeight={4.2}
          roofColor="#9A7BC8"
          wallColor="#FFF5F8"
          hasWindow={true}
          flagOffset={0.5}
        />

        {/* Inner Slender Lavender & Sky-Blue Fairytale Turrets */}
        <CastleTower
          position={[-2.1, 3.6, 1.15]}
          radius={0.78}
          height={4.2}
          roofHeight={2.9}
          roofColor="#8ECDF2"
          wallColor="#FFF4EE"
          flagOffset={1.3}
        />
        <CastleTower
          position={[2.1, 3.6, 1.15]}
          radius={0.78}
          height={4.2}
          roofHeight={2.9}
          roofColor="#8ECDF2"
          wallColor="#FFF4EE"
          flagOffset={2.1}
        />

        {/* Front Flanking Corner Towers */}
        <CastleTower
          position={[-4.2, 0, 2.75]}
          radius={1.08}
          height={5.1}
          roofHeight={2.85}
          roofColor="#F2A9C5"
          wallColor="#FFF4EB"
          flagOffset={0.2}
        />
        <CastleTower
          position={[4.2, 0, 2.75]}
          radius={1.08}
          height={5.1}
          roofHeight={2.85}
          roofColor="#F2A9C5"
          wallColor="#FFF4EB"
          flagOffset={1.8}
        />

        {/* Rear Tall Towers */}
        <CastleTower
          position={[-3.9, 0, -2.7]}
          radius={1.15}
          height={6.3}
          roofHeight={3.2}
          roofColor="#B89CEB"
          wallColor="#FFF2EE"
          hasWindow={false}
          flagOffset={2.9}
        />
        <CastleTower
          position={[3.9, 0, -2.7]}
          radius={1.15}
          height={6.3}
          roofHeight={3.2}
          roofColor="#B89CEB"
          wallColor="#FFF2EE"
          hasWindow={false}
          flagOffset={3.6}
        />

        {/* Grand Fairytale Entrance Archway */}
        <group position={[0, 0, 2.92]}>
          <mesh position={[0, 1.45, 0.14]} castShadow>
            <boxGeometry args={[2.65, 2.9, 0.45]} />
            <meshStandardMaterial
              map={marble.map}
              normalMap={marble.normalMap}
              color="#F7DFE8"
              roughness={0.6}
            />
          </mesh>
          <mesh position={[0, 3.25, 0.18]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.65, 1.25, 4]} />
            <meshStandardMaterial color="#B89CEB" roughness={0.48} />
          </mesh>
          {/* Recessed Oak & Iron Royal Doors */}
          <mesh position={[0, 1.2, 0.36]}>
            <capsuleGeometry args={[0.85, 1.0, 8, 16]} />
            <meshStandardMaterial color="#5E407C" roughness={0.45} metalness={0.22} />
          </mesh>
          <mesh position={[0, 1.65, 0.38]}>
            <torusGeometry args={[0.92, 0.08, 10, 24, Math.PI]} />
            <meshStandardMaterial color="#F6BE65" metalness={0.72} roughness={0.24} />
          </mesh>
          {/* Warm Entrance Lanterns */}
          {[-1.55, 1.55].map((lx) => (
            <group key={lx} position={[lx, 2.0, 0.45]}>
              <mesh>
                <sphereGeometry args={[0.16, 12, 12]} />
                <meshStandardMaterial
                  color="#FFE8AE"
                  emissive="#FFD175"
                  emissiveIntensity={0.95}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* Royal Gold Birthday Medallion above front balcony */}
        <group position={[0, 5.65, 1.72]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.62, 0.62, 0.12, 24]} />
            <meshStandardMaterial color="#FFF9F2" roughness={0.4} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.64, 0.07, 10, 28]} />
            <meshStandardMaterial color="#F6BE65" metalness={0.74} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <octahedronGeometry args={[0.24, 0]} />
            <meshStandardMaterial
              color="#F7C6D9"
              emissive="#F59BB9"
              emissiveIntensity={0.45}
              roughness={0.22}
            />
          </mesh>
        </group>

        {/* Front Balcony overlooking Plaza */}
        <mesh position={[0, 3.88, 2.35]} castShadow>
          <boxGeometry args={[2.9, 0.2, 1.1]} />
          <meshStandardMaterial
            map={marble.map}
            normalMap={marble.normalMap}
            color="#FFF8F0"
            roughness={0.62}
          />
        </mesh>
      </group>
    </group>
  );
}
