import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StorybookTree({
  position,
  canopyColor = '#F7C2D5',
  scale = 1,
}: {
  position: [number, number, number];
  canopyColor?: string;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.26, 1.8, 10]} />
        <meshStandardMaterial color="#B58E7D" roughness={0.85} />
      </mesh>
      {/* Layered Fluffy Blossom Canopy */}
      <mesh position={[0, 2.35, 0]} castShadow>
        <sphereGeometry args={[1.15, 16, 14]} />
        <meshStandardMaterial color={canopyColor} roughness={0.68} />
      </mesh>
      <mesh position={[-0.68, 1.98, 0.35]} castShadow>
        <sphereGeometry args={[0.78, 14, 12]} />
        <meshStandardMaterial color={canopyColor} roughness={0.68} />
      </mesh>
      <mesh position={[0.68, 2.02, -0.3]} castShadow>
        <sphereGeometry args={[0.82, 14, 12]} />
        <meshStandardMaterial color={canopyColor} roughness={0.68} />
      </mesh>
    </group>
  );
}

function ParkBench({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.48]} />
        <meshStandardMaterial color="#FFF6EC" roughness={0.65} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.68, -0.2]} rotation={[-0.14, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.42, 0.07]} />
        <meshStandardMaterial color="#F7D5E2" roughness={0.6} />
      </mesh>
      {/* Legs */}
      {[-0.55, 0.55].map((lx) => (
        <mesh key={lx} position={[lx, 0.2, 0]} castShadow>
          <boxGeometry args={[0.08, 0.38, 0.42]} />
          <meshStandardMaterial color="#C89E5D" metalness={0.3} roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function MemoryGazebo({
  position = [11.2, 0, 2.5],
  onSelect,
}: {
  position?: [number, number, number];
  onSelect?: () => void;
}) {
  const columns = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return [Math.cos(angle) * 2.2, 0, Math.sin(angle) * 2.2] as [number, number, number];
      }),
    []
  );

  return (
    <group
      position={position}
      onClick={(e) => {
        if (onSelect) {
          e.stopPropagation();
          onSelect();
        }
      }}
    >
      {/* Stepped Marble Gazebo Floor */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.9, 3.1, 0.2, 24]} />
        <meshStandardMaterial color="#FFF6EC" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.24, 0]} receiveShadow>
        <cylinderGeometry args={[2.55, 2.65, 0.12, 24]} />
        <meshStandardMaterial color="#F6EAF9" roughness={0.68} />
      </mesh>

      {/* Six Fairytale Columns */}
      {columns.map((pos, idx) => (
        <mesh key={idx} position={[pos[0], 1.55, pos[2]]} castShadow>
          <cylinderGeometry args={[0.1, 0.13, 2.6, 12]} />
          <meshStandardMaterial color="#FFF9F2" roughness={0.6} />
        </mesh>
      ))}

      {/* Decorative Ring Beam */}
      <mesh position={[0, 2.86, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.22, 0.1, 10, 32]} />
        <meshStandardMaterial color="#F6BE65" metalness={0.4} roughness={0.35} />
      </mesh>

      {/* Scalloped Sky-Blue & Lavender Gazebo Dome */}
      <mesh position={[0, 3.65, 0]} castShadow>
        <coneGeometry args={[2.75, 1.75, 12]} />
        <meshStandardMaterial color="#BCE3FA" roughness={0.48} />
      </mesh>
      <mesh position={[0, 4.65, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial
          color="#FFD98E"
          emissive="#F6BE65"
          emissiveIntensity={0.4}
          metalness={0.45}
        />
      </mesh>

      {/* Warm Central Hanging Lantern */}
      <mesh position={[0, 2.55, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.65, 6]} />
        <meshStandardMaterial color="#C89E5D" />
      </mesh>
      <mesh position={[0, 2.15, 0]}>
        <sphereGeometry args={[0.24, 14, 14]} />
        <meshStandardMaterial
          color="#FFE8AF"
          emissive="#FFD07B"
          emissiveIntensity={0.9}
        />
      </mesh>
    </group>
  );
}

function CelebrationStage({
  position = [10.0, 0, -8.0],
  onSelect,
}: {
  position?: [number, number, number];
  onSelect?: () => void;
}) {
  const posts = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2 + 0.3;
        return {
          x: Math.cos(angle) * 3.05,
          z: Math.sin(angle) * 3.05,
          color: ['#F7C6D9', '#D9CCF2', '#BCE3FA'][i % 3],
        };
      }),
    []
  );

  return (
    <group
      position={position}
      onClick={(e) => {
        if (onSelect) {
          e.stopPropagation();
          onSelect();
        }
      }}
    >
      {/* Festive Circular Stage */}
      <mesh position={[0, 0.14, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.35, 3.55, 0.28, 32]} />
        <meshStandardMaterial color="#FFF3EB" roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 3.1, 32]} />
        <meshStandardMaterial color="#FADAE6" roughness={0.65} />
      </mesh>

      {/* Center Pedestal Cushion (ready for Day 3 Birthday Cake!) */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.98, 0.55, 24]} />
        <meshStandardMaterial color="#FDF0F5" roughness={0.58} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <torusGeometry args={[0.86, 0.05, 8, 28]} />
        <meshStandardMaterial color="#F6BE65" metalness={0.45} roughness={0.3} />
      </mesh>

      {/* Decorative Stage Posts & Pastel Lanterns */}
      {posts.map((post, idx) => (
        <group key={idx} position={[post.x, 0.28, post.z]}>
          <mesh position={[0, 1.15, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 2.3, 10]} />
            <meshStandardMaterial color="#FFF6EC" roughness={0.6} />
          </mesh>
          <mesh position={[0, 2.36, 0]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial
              color={post.color}
              emissive="#FFD98E"
              emissiveIntensity={0.45}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DriftingClouds() {
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo(
    () => [
      { pos: [-34, 8.5, -18] as [number, number, number], scale: 1.5 },
      { pos: [34, 10.2, -16] as [number, number, number], scale: 1.7 },
      { pos: [-32, 3.2, 14] as [number, number, number], scale: 1.3 },
      { pos: [33, 4.5, 16] as [number, number, number], scale: 1.45 },
      { pos: [0, 11.5, -34] as [number, number, number], scale: 2.0 },
      { pos: [-18, -1.5, 29] as [number, number, number], scale: 1.2 },
      { pos: [20, -1.2, 28] as [number, number, number], scale: 1.35 },
    ],
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.014;
    }
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, idx) => (
        <group key={idx} position={c.pos} scale={c.scale}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.8, 12, 10]} />
            <meshStandardMaterial color="#FFF9F4" roughness={0.95} />
          </mesh>
          <mesh position={[-1.4, -0.35, 0.2]}>
            <sphereGeometry args={[1.25, 12, 10]} />
            <meshStandardMaterial color="#FFF4F8" roughness={0.95} />
          </mesh>
          <mesh position={[1.45, -0.3, -0.15]}>
            <sphereGeometry args={[1.35, 12, 10]} />
            <meshStandardMaterial color="#F6F1FF" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function ParkDecor({
  onSelectMemories,
  onSelectSurprises,
}: {
  onSelectMemories?: () => void;
  onSelectSurprises?: () => void;
}) {
  const trees = useMemo(
    () => [
      // Framing behind and beside the Castle
      { pos: [-11.5, 0, -14.5] as [number, number, number], color: '#F7C2D5', scale: 1.15 },
      { pos: [-15.2, 0, -10.0] as [number, number, number], color: '#D8C6F3', scale: 1.05 },
      { pos: [11.5, 0, -15.5] as [number, number, number], color: '#F7C2D5', scale: 1.1 },
      { pos: [-6.5, 0, -19.0] as [number, number, number], color: '#D8C6F3', scale: 1.2 },
      { pos: [6.5, 0, -19.0] as [number, number, number], color: '#FAD5E4', scale: 1.2 },
      // West Tulip Garden Perimeter
      { pos: [-19.2, 0, 3.2] as [number, number, number], color: '#FAD5E4', scale: 1.1 },
      { pos: [-17.5, 0, 9.8] as [number, number, number], color: '#9FD3A8', scale: 1.0 },
      { pos: [-13.0, 0, 14.5] as [number, number, number], color: '#F7C2D5', scale: 0.95 },
      // East Memory Pavilion Perimeter
      { pos: [17.8, 0, 6.2] as [number, number, number], color: '#D8C6F3', scale: 1.1 },
      { pos: [17.2, 0, -2.5] as [number, number, number], color: '#9FD3A8', scale: 1.0 },
      { pos: [14.5, 0, 12.8] as [number, number, number], color: '#FAD5E4', scale: 1.0 },
      // South Entrance Framing
      { pos: [-7.5, 0, 17.8] as [number, number, number], color: '#9FD3A8', scale: 1.05 },
      { pos: [7.5, 0, 17.8] as [number, number, number], color: '#F7C2D5', scale: 1.05 },
      { pos: [16.5, 0, -12.5] as [number, number, number], color: '#D8C6F3', scale: 1.05 },
    ],
    []
  );

  const topiaries: [number, number, number][] = useMemo(
    () => [
      [-4.6, 0, 6.2],
      [4.6, 0, 6.2],
      [-5.2, 0, -1.6],
      [5.2, 0, -1.6],
      [-3.5, 0, 19.6],
      [3.5, 0, 19.6],
    ],
    []
  );

  return (
    <group>
      {/* Storybook Blossom & Meadow Trees */}
      {trees.map((tree, idx) => (
        <StorybookTree
          key={idx}
          position={tree.pos}
          canopyColor={tree.color}
          scale={tree.scale}
        />
      ))}

      {/* Manicured Topiary Hedges */}
      {topiaries.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh position={[0, 0.48, 0]} castShadow>
            <sphereGeometry args={[0.55, 14, 12]} />
            <meshStandardMaterial color="#8BC692" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.02, 0]}>
            <sphereGeometry args={[0.28, 12, 10]} />
            <meshStandardMaterial color="#A3D9A8" roughness={0.78} />
          </mesh>
        </group>
      ))}

      {/* Wishing Plaza Benches */}
      <ParkBench position={[-3.9, 0.07, 4.1]} rotationY={2.35} />
      <ParkBench position={[3.9, 0.07, 4.1]} rotationY={-2.35} />

      {/* Memory Pavilion Gazebo */}
      <MemoryGazebo onSelect={onSelectMemories} />

      {/* Celebration Lawn Stage */}
      <CelebrationStage onSelect={onSelectSurprises} />

      {/* Soft Floating Clouds */}
      <DriftingClouds />
    </group>
  );
}
