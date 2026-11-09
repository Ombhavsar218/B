import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StorybookTree } from './SharedParkParts';
import { Butterflies } from './Butterflies';
import { KenneyModel } from './KenneyModel';
import { getPBRTextureSet } from '../../utils/pbrMaterials';

function ParkBench({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  const wood = useMemo(() => getPBRTextureSet('oak_wood_planks', 2, 1), []);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.08, 0.5]} />
        <meshStandardMaterial
          map={wood.map}
          normalMap={wood.normalMap}
          color="#FFF1E2"
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0, 0.68, -0.21]} rotation={[-0.14, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 0.44, 0.07]} />
        <meshStandardMaterial
          map={wood.map}
          normalMap={wood.normalMap}
          color="#F7D5E2"
          roughness={0.66}
        />
      </mesh>
      {[-0.65, 0.65].map((lx) => (
        <mesh key={lx} position={[lx, 0.2, 0]} castShadow>
          <boxGeometry args={[0.09, 0.38, 0.44]} />
          <meshStandardMaterial color="#B58A4A" metalness={0.62} roughness={0.34} />
        </mesh>
      ))}
    </group>
  );
}

function DriftingClouds() {
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo(
    () => [
      { pos: [-78, 16, -42] as [number, number, number], scale: 2.3 },
      { pos: [78, 18, -36] as [number, number, number], scale: 2.5 },
      { pos: [-82, 8, 22] as [number, number, number], scale: 2.0 },
      { pos: [82, 10, 26] as [number, number, number], scale: 2.2 },
      { pos: [-45, 22, -74] as [number, number, number], scale: 2.6 },
      { pos: [45, 21, -74] as [number, number, number], scale: 2.5 },
      { pos: [-50, -1.5, 62] as [number, number, number], scale: 1.8 },
      { pos: [52, -1.2, 60] as [number, number, number], scale: 1.9 },
    ],
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, idx) => (
        <group key={idx} position={c.pos} scale={c.scale}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2.1, 12, 10]} />
            <meshStandardMaterial color="#FFF9F4" roughness={0.95} />
          </mesh>
          <mesh position={[-1.6, -0.35, 0.2]}>
            <sphereGeometry args={[1.45, 12, 10]} />
            <meshStandardMaterial color="#FFF4F8" roughness={0.95} />
          </mesh>
          <mesh position={[1.65, -0.3, -0.15]}>
            <sphereGeometry args={[1.55, 12, 10]} />
            <meshStandardMaterial color="#F6F1FF" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function ParkDecor({ isDetailed = true }: { isDetailed?: boolean }) {
  const blossomTrees = useMemo(
    () => [
      { pos: [-7.5, 0, 32] as [number, number, number], color: '#F7C2D5', scale: 1.25 },
      { pos: [7.5, 0, 32] as [number, number, number], color: '#D8C6F3', scale: 1.2 },
      { pos: [8.5, 0, 22] as [number, number, number], color: '#FAD5E4', scale: 1.18 },
      { pos: [-11.5, 0, 12] as [number, number, number], color: '#F7C2D5', scale: 1.1 },
      { pos: [11.5, 0, 11] as [number, number, number], color: '#D8C6F3', scale: 1.12 },
      { pos: [12.5, 0, -4] as [number, number, number], color: '#FAD5E4', scale: 1.15 },
      { pos: [-64, 0, -8] as [number, number, number], color: '#D8C6F3', scale: 1.35 },
      { pos: [24, 0, -58] as [number, number, number], color: '#F7C2D5', scale: 1.3 },
    ],
    []
  );

  // Realistic CC0 Kenney Forest & Oak Trees placed seamlessly alongside Storybooks
  const realisticTrees = useMemo(
    () => [
      { url: '/models/tree_detailed.glb', pos: [-8.5, 0, 22] as [number, number, number], scale: 3.4, rot: 0.4 },
      { url: '/models/tree_oak.glb', pos: [-12.5, 0, -4] as [number, number, number], scale: 3.6, rot: 1.2 },
      { url: '/models/tree_detailed.glb', pos: [-26, 0, 36] as [number, number, number], scale: 4.1, rot: 2.1 },
      { url: '/models/tree_oak.glb', pos: [26, 0, 42] as [number, number, number], scale: 4.0, rot: 0.9 },
      { url: '/models/tree_detailed.glb', pos: [66, 0, 12] as [number, number, number], scale: 4.1, rot: 1.7 },
      { url: '/models/tree_oak.glb', pos: [-24, 0, -58] as [number, number, number], scale: 3.8, rot: 2.8 },
      { url: '/models/tree_detailed.glb', pos: [-16, 0, 40] as [number, number, number], scale: 3.7, rot: 0.3 },
      { url: '/models/tree_oak.glb', pos: [16, 0, 40] as [number, number, number], scale: 3.7, rot: 2.5 },
    ],
    []
  );

  const topiaries: [number, number, number][] = useMemo(
    () => [
      [-5.4, 0, 11.2],
      [5.4, 0, 11.2],
      [-5.4, 0, 0.8],
      [5.4, 0, 0.8],
      [-4.2, 0, 36.5],
      [4.2, 0, 36.5],
      [-10.2, 0, 6.0],
      [10.2, 0, 6.0],
    ],
    []
  );

  return (
    <group>
      {/* Storybook Blossom Trees with Gentle Breeze Motion */}
      {blossomTrees.map((tree, idx) => (
        <StorybookTree
          key={idx}
          position={tree.pos}
          canopyColor={tree.color}
          scale={tree.scale}
          swayOffset={idx * 0.7}
        />
      ))}

      {/* Realistic CC0 Oak & Forest Trees */}
      {realisticTrees.map((tree, idx) => (
        <KenneyModel
          key={`kt-${idx}`}
          url={tree.url}
          position={tree.pos}
          rotation={[0, tree.rot, 0]}
          scale={tree.scale}
          tintColor="#B7E2B8"
        />
      ))}

      {/* Manicured Topiary Shrubs + Natural Kenney Flower Bushes */}
      {topiaries.map((pos, idx) => (
        <group key={idx} position={pos}>
          <KenneyModel url="/models/plant_bushDetailed.glb" scale={2.4} tintColor="#9AD9A2" />
          <KenneyModel
            url={idx % 2 === 0 ? '/models/flower_purpleA.glb' : '/models/flower_redA.glb'}
            position={[0.45, 0, 0.35]}
            scale={1.8}
          />
        </group>
      ))}

      {/* Wishing Plaza Oak & Gold Benches */}
      <ParkBench position={[-5.2, 0.09, 8.6]} rotationY={2.35} />
      <ParkBench position={[5.2, 0.09, 8.6]} rotationY={-2.35} />
      <ParkBench position={[-5.2, 0.09, 3.4]} rotationY={0.78} />
      <ParkBench position={[5.2, 0.09, 3.4]} rotationY={-0.78} />

      {/* Promenade & Plaza Butterflies */}
      {isDetailed && <Butterflies areaCenter={[0, 2.1, 14]} count={8} spread={8} />}

      {/* Soft Distant Drifting Clouds */}
      <DriftingClouds />
    </group>
  );
}
