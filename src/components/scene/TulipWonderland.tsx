import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { birthdayConfig, type TulipMessageItem } from '../../config/birthdayConfig';
import { ArchedBridge, CurvedPath } from './SharedParkParts';
import { Butterflies } from './Butterflies';
import { KenneyModel } from './KenneyModel';
import { WaterSurface } from './WaterSurface';
import { getPBRTextureSet } from '../../utils/pbrMaterials';

interface TulipSeed {
  x: number;
  y: number;
  z: number;
  scale: number;
  phase: number;
  rotY: number;
  color: THREE.Color;
}

const TULIP_PALETTE = [
  '#F596B6',
  '#F9C2D6',
  '#C9ADEF',
  '#A584D6',
  '#FFE6A3',
  '#FFD4C4',
  '#FF84AD',
];

const DAISY_PALETTE = ['#FFFDF8', '#FFE5F0', '#E8DDFB', '#FFF2BA'];

function buildTulipCupGeometry(): THREE.LatheGeometry {
  const points = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.08, 0.03),
    new THREE.Vector2(0.145, 0.14),
    new THREE.Vector2(0.155, 0.28),
    new THREE.Vector2(0.125, 0.39),
    new THREE.Vector2(0.08, 0.43),
    new THREE.Vector2(0.02, 0.35),
  ];
  return new THREE.LatheGeometry(points, 10);
}

function FlowerHouse({
  position = [-56, 0, 8] as [number, number, number],
  onOpenBouquet,
}: {
  position?: [number, number, number];
  onOpenBouquet?: () => void;
}) {
  const brick = useMemo(() => getPBRTextureSet('castle_brick_02_white', 3, 2), []);
  const wood = useMemo(() => getPBRTextureSet('oak_wood_planks', 2, 2), []);

  return (
    <group
      position={position}
      rotation={[0, 0.6, 0]}
      onClick={(e) => {
        if (onOpenBouquet) {
          e.stopPropagation();
          onOpenBouquet();
        }
      }}
    >
      {/* Stone & Brick Cottage Body */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 2.2, 10]} />
        <meshStandardMaterial
          map={brick.map}
          normalMap={brick.normalMap}
          roughnessMap={brick.roughnessMap}
          color="#FFF6EE"
          roughness={0.72}
        />
      </mesh>
      {/* Pastel Rose Shingled Roof */}
      <mesh position={[0, 3.05, 0]} castShadow>
        <coneGeometry args={[2.75, 2.0, 10]} />
        <meshStandardMaterial color="#F4A5C0" roughness={0.55} />
      </mesh>
      {/* Roof Blossom Finial */}
      <mesh position={[0, 4.18, 0]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color="#FFD98E"
          emissive="#F6BE65"
          emissiveIntensity={0.45}
          metalness={0.65}
        />
      </mesh>
      {/* Arched Oak & Lavender Door */}
      <mesh position={[0, 0.85, 2.2]}>
        <capsuleGeometry args={[0.52, 0.72, 6, 12]} />
        <meshStandardMaterial
          map={wood.map}
          normalMap={wood.normalMap}
          color="#9A7BC8"
          roughness={0.58}
        />
      </mesh>
      {/* Glowing Cottage Windows */}
      {[-1.55, 1.55].map((wx) => (
        <mesh key={wx} position={[wx, 1.35, 1.6]} rotation={[0, wx > 0 ? 0.65 : -0.65, 0]}>
          <circleGeometry args={[0.35, 12]} />
          <meshStandardMaterial
            color="#FFEAB2"
            emissive="#FFD175"
            emissiveIntensity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

function HeroFlowerSpot({
  item,
  collected,
  onClick,
}: {
  item: TulipMessageItem;
  collected: boolean;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = item.position[1] + Math.sin(t * 2.3 + item.position[0]) * 0.08;
      ref.current.rotation.y = t * 0.6;
    }
  });

  return (
    <group
      position={item.position}
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
      {/* Glowing Base Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.55, 20]} />
        <meshBasicMaterial
          color={collected ? '#67B77E' : '#FFD98E'}
          transparent
          opacity={hovered ? 0.9 : 0.65}
        />
      </mesh>

      <group ref={ref} scale={hovered ? 1.25 : 1.05}>
        <mesh position={[0, 0.48, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.06, 0.96, 8]} />
          <meshStandardMaterial color="#5DA36C" roughness={0.65} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <sphereGeometry args={[0.32, 12, 10]} />
          <meshStandardMaterial
            color={item.color}
            emissive={item.color}
            emissiveIntensity={hovered ? 0.55 : 0.28}
            roughness={0.35}
          />
        </mesh>
        <mesh position={[0, 1.48, 0]}>
          <octahedronGeometry args={[0.11, 0]} />
          <meshStandardMaterial
            color="#FFF4B8"
            emissive="#FFD175"
            emissiveIntensity={0.95}
          />
        </mesh>
      </group>

      {hovered && (
        <Html position={[0, 1.85, 0]} center distanceFactor={16} zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-full border border-[#E2B362] bg-[#FFF9F2] px-2.5 py-0.5 text-[10px] font-semibold text-[#3B2B4B] shadow">
            {item.variety}
          </div>
        </Html>
      )}
    </group>
  );
}

export function TulipWonderland({
  isDetailed,
  collectedFlowerIds,
  onSelectKingdom,
  onClickFlower,
  onOpenBouquet,
}: {
  isDetailed: boolean;
  collectedFlowerIds: string[];
  onSelectKingdom?: () => void;
  onClickFlower: (item: TulipMessageItem) => void;
  onOpenBouquet?: () => void;
}) {
  const stemRef = useRef<THREE.InstancedMesh>(null);
  const leafRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const daisyRef = useRef<THREE.InstancedMesh>(null);

  const grassTex = useMemo(() => getPBRTextureSet('leafy_grass', 6, 6), []);
  const lakeGeo = useMemo(() => new THREE.CircleGeometry(5.4, 32), []);
  const cupGeometry = useMemo(() => buildTulipCupGeometry(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const tulipSeeds: TulipSeed[] = useMemo(() => {
    const seeds: TulipSeed[] = [];
    let seedVal = 42;
    const rand = () => {
      seedVal = (seedVal * 1664525 + 1013904223) % 4294967296;
      return seedVal / 4294967296;
    };

    const addCluster = (
      cx: number,
      baseY: number,
      cz: number,
      rx: number,
      rz: number,
      count: number
    ) => {
      for (let i = 0; i < count; i++) {
        const angle = rand() * Math.PI * 2;
        const r = Math.sqrt(rand());
        seeds.push({
          x: cx + Math.cos(angle) * r * rx,
          y: baseY,
          z: cz + Math.sin(angle) * r * rz,
          scale: 0.7 + rand() * 0.36,
          phase: rand() * Math.PI * 2,
          rotY: rand() * Math.PI * 2,
          color: new THREE.Color(TULIP_PALETTE[Math.floor(rand() * TULIP_PALETTE.length)]),
        });
      }
    };

    addCluster(-45, 0.16, 13, 6.4, 5.0, 140);
    addCluster(-52, 0.28, 18, 5.2, 4.2, 95);
    addCluster(-41, 0.14, 5, 4.8, 3.8, 80);
    addCluster(-55, 0.18, 12, 4.0, 3.6, 65);
    addCluster(-35, 0.1, 14, 3.6, 3.2, 55);

    for (let z = 15; z <= 37; z += 1.25) {
      for (const side of [-1, 1]) {
        seeds.push({
          x: side * (3.2 + rand() * 0.9),
          y: 0.05,
          z: z + (rand() - 0.5) * 0.4,
          scale: 0.72 + rand() * 0.3,
          phase: rand() * Math.PI * 2,
          rotY: rand() * Math.PI * 2,
          color: new THREE.Color(TULIP_PALETTE[Math.floor(rand() * TULIP_PALETTE.length)]),
        });
      }
    }

    return seeds;
  }, []);

  const daisySeeds = useMemo(() => {
    let seedVal = 999;
    const rand = () => {
      seedVal = (seedVal * 1664525 + 1013904223) % 4294967296;
      return seedVal / 4294967296;
    };
    return Array.from({ length: 120 }, () => ({
      x: -58 + rand() * 26,
      y: 0.34,
      z: 3 + rand() * 22,
      scale: 0.55 + rand() * 0.45,
      phase: rand() * Math.PI * 2,
      color: new THREE.Color(DAISY_PALETTE[Math.floor(rand() * DAISY_PALETTE.length)]),
    }));
  }, []);

  useEffect(() => {
    if (!stemRef.current || !leafRef.current || !headRef.current) return;

    tulipSeeds.forEach((seed, idx) => {
      dummy.position.set(seed.x, seed.y + 0.26 * seed.scale, seed.z);
      dummy.rotation.set(0, seed.rotY, 0);
      dummy.scale.setScalar(seed.scale);
      dummy.updateMatrix();
      stemRef.current!.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(seed.x, seed.y + 0.14 * seed.scale, seed.z);
      dummy.rotation.set(0.35, seed.rotY + 0.4, 0.28);
      dummy.scale.setScalar(seed.scale);
      dummy.updateMatrix();
      leafRef.current!.setMatrixAt(idx, dummy.matrix);

      headRef.current!.setColorAt(idx, seed.color);
    });

    stemRef.current.instanceMatrix.needsUpdate = true;
    leafRef.current.instanceMatrix.needsUpdate = true;
    if (headRef.current.instanceColor) {
      headRef.current.instanceColor.needsUpdate = true;
    }

    if (daisyRef.current) {
      daisySeeds.forEach((d, idx) => {
        dummy.position.set(d.x, d.y, d.z);
        dummy.rotation.set(-Math.PI / 2 + 0.15, 0, d.phase);
        dummy.scale.setScalar(d.scale);
        dummy.updateMatrix();
        daisyRef.current!.setMatrixAt(idx, dummy.matrix);
        daisyRef.current!.setColorAt(idx, d.color);
      });
      daisyRef.current.instanceMatrix.needsUpdate = true;
      if (daisyRef.current.instanceColor) {
        daisyRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [tulipSeeds, daisySeeds, dummy]);

  useFrame((state) => {
    if (!headRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < tulipSeeds.length; i++) {
      const seed = tulipSeeds[i];
      const swayX = Math.sin(t * 1.45 + seed.phase + seed.x * 0.22) * 0.085;
      const swayZ = Math.cos(t * 1.2 + seed.phase + seed.z * 0.22) * 0.065;

      dummy.position.set(
        seed.x + swayX * 0.28,
        seed.y + 0.52 * seed.scale,
        seed.z + swayZ * 0.28
      );
      dummy.rotation.set(swayZ, seed.rotY, -swayX);
      dummy.scale.setScalar(seed.scale);
      dummy.updateMatrix();
      headRef.current.setMatrixAt(i, dummy.matrix);
    }
    headRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group
      onClick={(e) => {
        if (onSelectKingdom) {
          e.stopPropagation();
          onSelectKingdom();
        }
      }}
    >
      {/* Terraced Tulip Hills with PBR Grass */}
      {[
        { pos: [-45, 0.08, 13] as [number, number, number], r: 7.4, h: 0.22, col: '#B5DFB2', rim: '#F7EBDD' },
        { pos: [-52, 0.16, 18] as [number, number, number], r: 6.2, h: 0.34, col: '#ACD7AA', rim: '#F4DDE5' },
        { pos: [-41, 0.08, 5] as [number, number, number], r: 5.5, h: 0.2, col: '#BAE3B7', rim: '#E6DAF8' },
      ].map((hill, idx) => (
        <group key={idx} position={hill.pos}>
          <mesh receiveShadow>
            <cylinderGeometry args={[hill.r, hill.r + 0.5, hill.h, 30]} />
            <meshStandardMaterial
              map={grassTex.map}
              normalMap={grassTex.normalMap}
              color={hill.col}
              roughness={0.9}
            />
          </mesh>
          <mesh position={[0, -hill.h * 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[hill.r + 0.2, 0.16, 8, 36]} />
            <meshStandardMaterial color={hill.rim} roughness={0.78} />
          </mesh>
        </group>
      ))}

      {/* Internal Flower-Bordered Winding Path */}
      <CurvedPath
        points={[
          [-34, 0, 14],
          [-43, 0, 12],
          [-50, 0, 10],
          [-55, 0, 8],
        ]}
        radius={1.05}
        color="#FDF0F5"
      />

      {/* Lily-Pad Lake with Animated Water Surface & CC0 Lily Pads */}
      <WaterSurface
        geometry={lakeGeo}
        position={[-36, 0.05, 22.5]}
        color="#7FD4FA"
        emissive="#4AC2F2"
        emissiveIntensity={0.18}
        repeat={6}
        speed={0.025}
      />
      <KenneyModel url="/models/lily_large.glb" position={[-34.5, 0.08, 24.0]} scale={3.8} rotation={[0, 0.4, 0]} />
      <KenneyModel url="/models/lily_large.glb" position={[-37.8, 0.08, 23.6]} scale={3.2} rotation={[0, 1.8, 0]} />
      <KenneyModel url="/models/lily_large.glb" position={[-33.6, 0.08, 21.2]} scale={3.5} rotation={[0, 2.7, 0]} />

      <ArchedBridge
        position={[-37.5, 0, 20.5]}
        rotationY={0.62}
        deckColor="#F5E1CC"
        railColor="#F7C6D9"
        length={6.4}
        width={2.5}
        surface="wood"
      />

      {/* Flower House Conservatory Cottage */}
      <FlowerHouse onOpenBouquet={onOpenBouquet} />

      {/* Entrance Floral Trellis Archway */}
      <group position={[-30.5, 0, 13.5]} rotation={[0, -0.25, 0]}>
        {[-1.55, 1.55].map((zOff) => (
          <mesh key={zOff} position={[0, 1.5, zOff]} castShadow>
            <cylinderGeometry args={[0.1, 0.13, 3.0, 10]} />
            <meshStandardMaterial color="#FFF6EC" roughness={0.65} />
          </mesh>
        ))}
        <mesh position={[0, 3.0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[1.55, 0.13, 10, 24, Math.PI]} />
          <meshStandardMaterial color="#F7C6D9" roughness={0.55} />
        </mesh>
      </group>

      {/* Natural CC0 Accent Shrubs */}
      <KenneyModel url="/models/flower_purpleA.glb" position={[-53, 0.06, 11.2]} scale={2.4} />
      <KenneyModel url="/models/flower_yellowA.glb" position={[-54, 0.06, 6.2]} scale={2.4} />

      {/* Instanced Tulips & Daisies */}
      <instancedMesh
        ref={stemRef}
        args={[undefined, undefined, tulipSeeds.length]}
        frustumCulled={false}
      >
        <cylinderGeometry args={[0.025, 0.032, 0.52, 6]} />
        <meshStandardMaterial color="#68A874" roughness={0.75} />
      </instancedMesh>

      <instancedMesh
        ref={leafRef}
        args={[undefined, undefined, tulipSeeds.length]}
        frustumCulled={false}
      >
        <coneGeometry args={[0.08, 0.32, 4]} />
        <meshStandardMaterial color="#7BC083" roughness={0.72} />
      </instancedMesh>

      <instancedMesh
        ref={headRef}
        args={[cupGeometry, undefined, tulipSeeds.length]}
        frustumCulled={false}
        castShadow
      >
        <meshStandardMaterial color="#FFFFFF" roughness={0.42} />
      </instancedMesh>

      <instancedMesh
        ref={daisyRef}
        args={[undefined, undefined, daisySeeds.length]}
        frustumCulled={false}
      >
        <circleGeometry args={[0.22, 8]} />
        <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} roughness={0.5} />
      </instancedMesh>

      {/* Interactive Hero Flowers for Personal Messages & Bouquet Collection */}
      {birthdayConfig.tulipMessages.map((item) => (
        <HeroFlowerSpot
          key={item.id}
          item={item}
          collected={collectedFlowerIds.includes(item.id)}
          onClick={() => onClickFlower(item)}
        />
      ))}

      {/* Animated Butterfly Garden */}
      {isDetailed && <Butterflies areaCenter={[-45, 2.2, 13]} count={14} spread={9.5} />}
    </group>
  );
}
