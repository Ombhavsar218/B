import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { birthdayConfig } from '../../config/birthdayConfig';
import { ArchedBridge } from './SharedParkParts';
import { KenneyModel } from './KenneyModel';
import { WaterSurface } from './WaterSurface';
import { getPBRTextureSet } from '../../utils/pbrMaterials';

function TreasureChest({
  position,
  opened,
  label,
  onClick,
}: {
  position: [number, number, number];
  opened: boolean;
  label: string;
  onClick: () => void;
}) {
  const lidRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const wood = useMemo(() => getPBRTextureSet('oak_wood_planks', 1, 1), []);

  useFrame(() => {
    if (lidRef.current) {
      const target = opened ? -1.05 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, target, 0.12);
    }
  });

  return (
    <group
      position={position}
      rotation={[0, -0.5, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Chest Base */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.62, 0.78]} />
        <meshStandardMaterial
          map={wood.map}
          normalMap={wood.normalMap}
          color="#9E6A49"
          roughness={0.7}
        />
      </mesh>
      {/* Gold Trim Band */}
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.82]} />
        <meshStandardMaterial color="#F6BE65" metalness={0.72} roughness={0.25} />
      </mesh>
      {/* Hinged Lid */}
      <mesh ref={lidRef} position={[0, 0.66, -0.35]} castShadow>
        <boxGeometry args={[1.15, 0.32, 0.78]} />
        <meshStandardMaterial
          map={wood.map}
          normalMap={wood.normalMap}
          color="#B57A54"
          roughness={0.68}
        />
      </mesh>
      {/* Glowing Treasure Gem Inside */}
      <mesh position={[0, 0.68, 0]}>
        <octahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial
          color="#7AE5AA"
          emissive="#4CD48B"
          emissiveIntensity={opened ? 1.1 : 0.45}
        />
      </mesh>
      {hovered && (
        <Html position={[0, 1.35, 0]} center distanceFactor={18} zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-full border border-[#E2B362] bg-[#FFF9F2] px-2.5 py-0.5 text-[10px] font-semibold text-[#3B2B4B] shadow">
            {opened ? `Opened: ${label}` : `Open ${label}`}
          </div>
        </Html>
      )}
    </group>
  );
}

function WaterfallCascade() {
  const dropsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const poolGeo = useMemo(() => new THREE.CircleGeometry(3.6, 24), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        xOff: ((i % 7) - 3) * 0.38,
        phase: (i * 0.17) % 1,
      })),
    []
  );

  useFrame((state) => {
    if (!dropsRef.current) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((s, idx) => {
      const life = (t * 0.9 + s.phase) % 1;
      const y = 6.2 - life * 5.8;
      const z = -life * 1.4;
      dummy.position.set(s.xOff, y, z);
      dummy.scale.setScalar(0.16 + Math.sin(life * Math.PI) * 0.14);
      dummy.updateMatrix();
      dropsRef.current!.setMatrixAt(idx, dummy.matrix);
    });
    dropsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[57, 0, 32.5]} rotation={[0, 1.15, 0]}>
      {/* Cliff Rock Peak */}
      <mesh position={[0, 3.6, 1.5]} castShadow>
        <coneGeometry args={[5.5, 7.6, 8]} />
        <meshStandardMaterial color="#8E9B8F" roughness={0.92} />
      </mesh>
      <KenneyModel url="/models/rock_largeA.glb" position={[3.2, 0.1, 0.8]} scale={3.6} />
      <KenneyModel url="/models/rock_largeA.glb" position={[-3.4, 0.1, 0.5]} rotation={[0, 1.5, 0]} scale={3.2} />
      {/* Waterfall Sheet */}
      <mesh position={[0, 3.2, -0.8]} rotation={[-0.18, 0, 0]}>
        <boxGeometry args={[2.8, 6.2, 0.25]} />
        <meshStandardMaterial
          color="#86E3FC"
          emissive="#54C9EE"
          emissiveIntensity={0.35}
          transparent
          opacity={0.82}
          roughness={0.14}
        />
      </mesh>
      {/* Splash Foam Pool */}
      <WaterSurface
        geometry={poolGeo}
        position={[0, 0.15, -1.6]}
        color="#8CE3FC"
        emissive="#5ACDF2"
        emissiveIntensity={0.22}
        repeat={4}
        speed={0.05}
      />
      <instancedMesh
        ref={dropsRef}
        args={[undefined, undefined, seeds.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#E5FAFF" emissive="#A3ECFF" emissiveIntensity={0.5} />
      </instancedMesh>
    </group>
  );
}

export function AdventureKingdom({
  isDetailed,
  openedChests,
  onSelectKingdom,
  onOpenTreasure,
}: {
  isDetailed: boolean;
  openedChests: number[];
  onSelectKingdom: () => void;
  onOpenTreasure: (index: number, message: string) => void;
}) {
  const grass = useMemo(() => getPBRTextureSet('leafy_grass', 10, 10), []);
  const brick = useMemo(() => getPBRTextureSet('castle_brick_02_white', 3, 2), []);
  const riverGeo = useMemo(() => new THREE.PlaneGeometry(24, 4.2), []);

  const palms: Array<{ pos: [number, number, number]; scale: number; rot: number }> = useMemo(
    () => [
      { pos: [34, 0, 21], scale: 3.6, rot: 0.4 },
      { pos: [38, 0, 35], scale: 4.1, rot: 1.5 },
      { pos: [54, 0, 17], scale: 3.8, rot: 2.3 },
      { pos: [60, 0, 27], scale: 3.9, rot: 0.8 },
      { pos: [44, 0, 38], scale: 3.5, rot: 2.9 },
    ],
    []
  );

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelectKingdom();
      }}
    >
      {/* Tropical Jungle Terrain with PBR Grass */}
      <mesh position={[48, 0.03, 28]} receiveShadow>
        <cylinderGeometry args={[22, 23, 0.14, 36]} />
        <meshStandardMaterial
          map={grass.map}
          normalMap={grass.normalMap}
          color="#B5E3B4"
          roughness={0.9}
        />
      </mesh>

      {/* Winding Turquoise Jungle River with WaterSurface Normals */}
      <WaterSurface
        geometry={riverGeo}
        position={[46, 0.115, 29]}
        rotation={[-Math.PI / 2, 0, 0.35]}
        color="#72D7EE"
        emissive="#4AC2E0"
        emissiveIntensity={0.2}
        repeat={8}
        speed={0.04}
      />

      {/* Wooden Jungle Bridge */}
      <ArchedBridge
        position={[41, 0.04, 27]}
        rotationY={0.35}
        deckColor="#C49368"
        railColor="#8D5D3E"
        length={6.8}
        width={2.9}
        surface="wood"
      />

      {/* Ancient Sandstone Temple Ruins */}
      <group position={[49, 0.08, 19.5]} rotation={[0, -0.3, 0]}>
        {[0, 1, 2].map((tier) => (
          <mesh key={tier} position={[0, 0.45 + tier * 0.85, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.4 - tier * 1.4, 0.85, 5.4 - tier * 1.2]} />
            <meshStandardMaterial
              map={brick.map}
              normalMap={brick.normalMap}
              color="#E5D3B3"
              roughness={0.85}
            />
          </mesh>
        ))}
        {[-2.2, 2.2].map((px) => (
          <mesh key={px} position={[px, 1.7, 2.2]} castShadow>
            <cylinderGeometry args={[0.3, 0.35, 3.2, 10]} />
            <meshStandardMaterial
              map={brick.map}
              normalMap={brick.normalMap}
              color="#DCC5A1"
              roughness={0.85}
            />
          </mesh>
        ))}
        <mesh position={[0, 3.55, 0]}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color="#7AE5AA"
            emissive="#4AD189"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* Realistic CC0 Palm Trees */}
      {palms.map((p, idx) => (
        <KenneyModel
          key={idx}
          url="/models/tree_palmDetailedTall.glb"
          position={p.pos}
          rotation={[0, p.rot, 0]}
          scale={p.scale}
        />
      ))}

      {/* Waterfall & Cascade */}
      {isDetailed ? (
        <WaterfallCascade />
      ) : (
        <mesh position={[57.5, 3.6, 33]} castShadow>
          <coneGeometry args={[5.5, 7.6, 8]} />
          <meshStandardMaterial color="#8E9B8F" roughness={0.92} />
        </mesh>
      )}

      {/* Interactive Treasure Chests */}
      <TreasureChest
        position={[46.5, 0.1, 24.5]}
        opened={openedChests.includes(0)}
        label="Jungle Chest"
        onClick={() => onOpenTreasure(0, birthdayConfig.adventureTreasures[0])}
      />
      <TreasureChest
        position={[52.5, 0.1, 28.5]}
        opened={openedChests.includes(1)}
        label="Waterfall Relic"
        onClick={() => onOpenTreasure(1, birthdayConfig.adventureTreasures[1])}
      />
    </group>
  );
}
