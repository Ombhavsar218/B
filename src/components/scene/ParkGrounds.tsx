import { useMemo } from 'react';
import * as THREE from 'three';
import { ArchedBridge, CurvedPath, ParkLantern } from './SharedParkParts';
import { getPBRTextureSet } from '../../utils/pbrMaterials';
import { WaterSurface } from './WaterSurface';

export function ParkGrounds() {
  const grassTex = useMemo(() => getPBRTextureSet('leafy_grass', 38, 38), []);
  const centralGrassTex = useMemo(() => getPBRTextureSet('leafy_grass', 16, 16), []);
  const cobbleTex = useMemo(() => getPBRTextureSet('cobblestone_floor_02', 4, 22), []);
  const plazaCobbleTex = useMemo(() => getPBRTextureSet('cobblestone_floor_02', 6, 6), []);
  const marbleTex = useMemo(() => getPBRTextureSet('marble_01', 4, 4), []);

  const canalGeometry = useMemo(() => new THREE.RingGeometry(17.5, 22.5, 72), []);

  const promenadeLanternPositions: [number, number, number][] = useMemo(
    () => [
      [-2.8, 0, 35],
      [2.8, 0, 35],
      [-2.8, 0, 28],
      [2.8, 0, 28],
      [-2.8, 0, 21],
      [2.8, 0, 21],
      [-2.8, 0, 14.5],
      [2.8, 0, 14.5],
      [-2.8, 0, -5],
      [2.8, 0, -5],
    ],
    []
  );

  return (
    <group>
      {/* Massive Interconnected Wonderland Meadow Platform (Top at y = 0) */}
      <mesh position={[0, -0.7, -4]} receiveShadow>
        <cylinderGeometry args={[86, 84, 1.4, 72]} />
        <meshStandardMaterial
          map={grassTex.map}
          normalMap={grassTex.normalMap}
          roughnessMap={grassTex.roughnessMap}
          color="#CFECCF"
          roughness={0.92}
        />
      </mesh>

      {/* Sunlit Central Meadow Halo */}
      <mesh position={[0, -0.018, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[32, 56]} />
        <meshStandardMaterial
          map={centralGrassTex.map}
          normalMap={centralGrassTex.normalMap}
          roughnessMap={centralGrassTex.roughnessMap}
          color="#D8F2D6"
          roughness={0.9}
        />
      </mesh>

      {/* Outer Island Sandstone Rim & Floating Base */}
      <mesh position={[0, -3.4, -4]}>
        <cylinderGeometry args={[84, 64, 4.2, 48]} />
        <meshStandardMaterial color="#EADAD2" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.04, -4]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[85.6, 0.5, 10, 80]} />
        <meshStandardMaterial
          map={marbleTex.map}
          normalMap={marbleTex.normalMap}
          color="#F7EBDD"
          roughness={0.78}
        />
      </mesh>

      {/* Enchanted Shimmering Canal / Moat Ring with Live Normal-Map Water Shader */}
      <WaterSurface
        geometry={canalGeometry}
        position={[0, 0.014, -2]}
        color="#7FD4FA"
        emissive="#4AC2F2"
        emissiveIntensity={0.14}
        repeat={14}
        speed={0.025}
      />

      {/* Central Wishing Plaza (centered at [0, 0, 6]) */}
      <mesh position={[0, 0.04, 6.0]} receiveShadow>
        <cylinderGeometry args={[8.4, 8.6, 0.1, 56]} />
        <meshStandardMaterial
          map={plazaCobbleTex.map}
          normalMap={plazaCobbleTex.normalMap}
          roughnessMap={plazaCobbleTex.roughnessMap}
          color="#FFF3EB"
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0, 0.095, 6.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[5.2, 5.9, 48]} />
        <meshStandardMaterial
          map={marbleTex.map}
          normalMap={marbleTex.normalMap}
          color="#E6DAF8"
          roughness={0.65}
        />
      </mesh>
      <mesh position={[0, 0.098, 6.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[7.7, 8.15, 48]} />
        <meshStandardMaterial
          map={marbleTex.map}
          normalMap={marbleTex.normalMap}
          color="#F7D5E2"
          roughness={0.65}
        />
      </mesh>

      {/* Grand Entrance Promenade (South Gates z=39 -> Central Plaza z=6) */}
      <mesh position={[0, 0.035, 24.5]} receiveShadow>
        <boxGeometry args={[4.6, 0.09, 32]} />
        <meshStandardMaterial
          map={cobbleTex.map}
          normalMap={cobbleTex.normalMap}
          roughnessMap={cobbleTex.roughnessMap}
          color="#FFF4EC"
          roughness={0.82}
        />
      </mesh>
      {[-2.42, 2.42].map((x) => (
        <mesh key={x} position={[x, 0.07, 24.5]} receiveShadow castShadow>
          <boxGeometry args={[0.28, 0.12, 32]} />
          <meshStandardMaterial
            map={marbleTex.map}
            normalMap={marbleTex.normalMap}
            color="#F2D7DF"
            roughness={0.72}
          />
        </mesh>
      ))}

      {/* Royal Avenue North (Central Plaza -> Canal -> Fantasy Kingdom Castle) */}
      <CurvedPath
        points={[
          [0, 0, -1],
          [0, 0, -11],
          [0, 0, -18.5],
        ]}
        radius={1.95}
      />
      <CurvedPath
        points={[
          [0, 0, -24.5],
          [0, 0, -28],
        ]}
        radius={1.95}
      />

      {/* Longer Interconnected Pathways to All Six Kingdoms + Memory Pavilion */}
      {/* 1. Hub -> Frozen Kingdom */}
      <CurvedPath
        points={[
          [-6.2, 0, 1.5],
          [-10.2, 0, -6.5],
          [-12.2, 0, -12.6],
        ]}
        radius={1.55}
        color="#EEF4FC"
      />
      <CurvedPath
        points={[
          [-16.4, 0, -18.8],
          [-28, 0, -26],
          [-44, 0, -30],
        ]}
        radius={1.55}
        color="#EEF4FC"
      />

      {/* 2. Hub -> Tulip Wonderland */}
      <CurvedPath
        points={[
          [-7.5, 0, 5.6],
          [-12.5, 0, 4.8],
          [-16.2, 0, 4.2],
        ]}
        radius={1.65}
        color="#FDF0F5"
      />
      <CurvedPath
        points={[
          [-22.2, 0, 3.8],
          [-32, 0, 10],
          [-46, 0, 14],
        ]}
        radius={1.65}
        color="#FDF0F5"
      />

      {/* 3. Hub -> Galaxy Kingdom */}
      <CurvedPath
        points={[
          [6.2, 0, 1.5],
          [10.2, 0, -6.5],
          [12.2, 0, -12.6],
        ]}
        radius={1.55}
        color="#ECE8FC"
      />
      <CurvedPath
        points={[
          [16.4, 0, -18.8],
          [30, 0, -26],
          [46, 0, -34],
        ]}
        radius={1.55}
        color="#ECE8FC"
      />

      {/* 4. Hub -> Birthday Celebration Kingdom */}
      <CurvedPath
        points={[
          [7.8, 0, 4.2],
          [12.5, 0, 2.4],
          [16.6, 0, 1.3],
        ]}
        radius={1.7}
        color="#FFF3E5"
      />
      <CurvedPath
        points={[
          [23.0, 0, 0.2],
          [35, 0, -1.0],
          [48, 0, -2],
        ]}
        radius={1.7}
        color="#FFF3E5"
      />

      {/* 5. Hub -> Memory Pavilion -> Adventure Kingdom */}
      <CurvedPath
        points={[
          [5.4, 0, 10.2],
          [8.2, 0, 12.0],
          [10.0, 0, 13.0],
        ]}
        radius={1.55}
        color="#F8EFE4"
      />
      <CurvedPath
        points={[
          [13.6, 0, 16.5],
          [17, 0, 22],
          [32, 0, 25],
          [48, 0, 28],
        ]}
        radius={1.55}
        color="#F8EFE4"
      />

      {/* Six Storybook Canal Bridges Centered Cleanly Over Canal Ring */}
      <ArchedBridge position={[0, 0, -21.5]} rotationY={0} length={6.6} width={3.9} surface="stone" />
      <ArchedBridge
        position={[-14.3, 0, -15.7]}
        rotationY={-0.78}
        deckColor="#EAF6FF"
        railColor="#BCE3FA"
        length={6.6}
        width={3.1}
        surface="stone"
      />
      <ArchedBridge
        position={[-19.2, 0, 3.8]}
        rotationY={1.45}
        deckColor="#FFF6EC"
        railColor="#F7C6D9"
        length={6.5}
        width={3.3}
        surface="stone"
      />
      <ArchedBridge
        position={[14.3, 0, -15.7]}
        rotationY={0.78}
        deckColor="#F2ECFF"
        railColor="#B89CEB"
        length={6.6}
        width={3.1}
        surface="stone"
      />
      <ArchedBridge
        position={[19.8, 0, 0.8]}
        rotationY={1.42}
        deckColor="#FFF7EB"
        railColor="#F6BE65"
        length={6.6}
        width={3.3}
        surface="stone"
      />
      <ArchedBridge
        position={[11.8, 0, 14.2]}
        rotationY={-0.63}
        deckColor="#FFF6EC"
        railColor="#9ED7F6"
        length={6.5}
        width={3.1}
        surface="stone"
      />

      {/* Grand Wonderland Entrance Golden Pillars, Open Wrought Doors & Archway (z = 38) */}
      {[-3.1, 3.1].map((x) => (
        <group key={x} position={[x, 0, 38]}>
          <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.42, 0.56, 2.7, 16]} />
            <meshStandardMaterial
              map={marbleTex.map}
              normalMap={marbleTex.normalMap}
              color="#FFF6EC"
              roughness={0.55}
            />
          </mesh>
          <mesh position={[0, 2.85, 0]} castShadow>
            <sphereGeometry args={[0.46, 14, 14]} />
            <meshStandardMaterial color="#F7C6D9" roughness={0.45} />
          </mesh>
          <mesh position={[0, 3.48, 0]}>
            <octahedronGeometry args={[0.26, 0]} />
            <meshStandardMaterial
              color="#FFD98E"
              emissive="#F6BE65"
              emissiveIntensity={0.5}
              metalness={0.65}
              roughness={0.22}
            />
          </mesh>
          {/* Open Wrought-Iron & Gold Swung Gate Leaf */}
          <group position={[x < 0 ? 0.55 : -0.55, 1.05, -0.95]} rotation={[0, x < 0 ? 1.25 : -1.25, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.6, 1.9, 0.08]} />
              <meshStandardMaterial color="#4A385E" metalness={0.65} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.65, 0]}>
              <boxGeometry args={[1.65, 0.12, 0.12]} />
              <meshStandardMaterial color="#F6BE65" metalness={0.68} roughness={0.26} />
            </mesh>
          </group>
        </group>
      ))}
      {/* Overhead Golden Archway at Grand Gates */}
      <mesh position={[0, 3.6, 38]} castShadow>
        <torusGeometry args={[3.15, 0.15, 12, 36, Math.PI]} />
        <meshStandardMaterial color="#F6BE65" metalness={0.68} roughness={0.25} />
      </mesh>

      {/* Ornamental Promenade Lanterns */}
      {promenadeLanternPositions.map((pos, idx) => (
        <ParkLantern key={idx} position={pos} />
      ))}
    </group>
  );
}
