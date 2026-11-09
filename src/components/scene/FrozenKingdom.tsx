import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ArchedBridge } from './SharedParkParts';
import { FrozenCharacters, type FrozenCharacterId } from './FrozenCharacters';
import { getPBRTextureSet } from '../../utils/pbrMaterials';
import { KenneyModel } from './KenneyModel';
import { WaterSurface } from './WaterSurface';

interface FrozenKingdomProps {
  isDetailed: boolean;
  hideLabels?: boolean;
  elsaMagicActive: boolean;
  annaCelebrationActive: boolean;
  playerPosRef?: MutableRefObject<{ x: number; z: number }>;
  onSelectKingdom: () => void;
  onSelectCharacter: (id: FrozenCharacterId) => void;
}

function SnowyCottage({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  const wood = useMemo(() => getPBRTextureSet('oak_wood_planks', 2, 2), []);
  const snow = useMemo(() => getPBRTextureSet('snow_02', 2, 2), []);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Warm Timber Base */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.7, 2.2]} />
        <meshStandardMaterial
          map={wood.map}
          normalMap={wood.normalMap}
          color="#A67E69"
          roughness={0.82}
        />
      </mesh>
      {/* Steep Roof + PBR Snow Blanket */}
      <mesh position={[0, 2.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.05, 1.45, 4]} />
        <meshStandardMaterial
          map={snow.map}
          normalMap={snow.normalMap}
          roughnessMap={snow.roughnessMap}
          color="#F7FCFF"
          roughness={0.68}
        />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.7, 2.55, -0.45]}>
        <boxGeometry args={[0.35, 0.8, 0.35]} />
        <meshStandardMaterial color="#8A768C" roughness={0.8} />
      </mesh>
      {/* Glowing Warm Windows & Door */}
      <mesh position={[0, 0.65, 1.12]}>
        <boxGeometry args={[0.58, 1.1, 0.08]} />
        <meshStandardMaterial color="#6D4B3A" roughness={0.65} />
      </mesh>
      {[-0.78, 0.78].map((wx) => (
        <mesh key={wx} position={[wx, 0.95, 1.12]}>
          <boxGeometry args={[0.42, 0.44, 0.08]} />
          <meshStandardMaterial
            color="#FFEAB2"
            emissive="#FFD175"
            emissiveIntensity={0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

function IcePalace({
  position = [-52, 0, -40] as [number, number, number],
  magicActive,
}: {
  position?: [number, number, number];
  magicActive: boolean;
}) {
  return (
    <group position={position} rotation={[0, 0.48, 0]}>
      <mesh position={[0, 0.28, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[6.6, 7.2, 0.56, 8]} />
        <meshStandardMaterial color="#DCF3FF" roughness={0.22} metalness={0.2} />
      </mesh>

      <mesh position={[0, 2.6, 0]} castShadow>
        <cylinderGeometry args={[3.1, 3.6, 4.4, 8]} />
        <meshStandardMaterial
          color="#BCEEFF"
          emissive="#64C8F5"
          emissiveIntensity={magicActive ? 0.38 : 0.18}
          transparent
          opacity={0.86}
          roughness={0.14}
          metalness={0.28}
        />
      </mesh>

      <mesh position={[0, 6.2, 0]} castShadow>
        <coneGeometry args={[2.1, 5.2, 8]} />
        <meshStandardMaterial
          color="#D6F5FF"
          emissive="#7CE0FF"
          emissiveIntensity={magicActive ? 0.45 : 0.22}
          transparent
          opacity={0.88}
          roughness={0.12}
          metalness={0.3}
        />
      </mesh>

      <mesh position={[0, 9.2, 0]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#9BEBFF"
          emissiveIntensity={1.1}
        />
      </mesh>

      {[
        [-3.5, 0, 1.8, 3.8, 3.2],
        [3.5, 0, 1.8, 3.8, 3.2],
        [-2.8, 0, -2.6, 4.4, 3.5],
        [2.8, 0, -2.6, 4.4, 3.5],
      ].map(([x, y, z, h, rh], idx) => (
        <group key={idx} position={[x, y + 0.5, z]}>
          <mesh position={[0, h / 2, 0]} castShadow>
            <cylinderGeometry args={[0.72, 0.88, h, 6]} />
            <meshStandardMaterial
              color="#CBEFFF"
              emissive="#67C9F7"
              emissiveIntensity={0.2}
              transparent
              opacity={0.85}
              roughness={0.14}
            />
          </mesh>
          <mesh position={[0, h + rh / 2, 0]} castShadow>
            <coneGeometry args={[0.88, rh, 6]} />
            <meshStandardMaterial
              color="#E5F8FF"
              emissive="#93E4FF"
              emissiveIntensity={0.25}
              roughness={0.12}
            />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 1.75, 3.45]}>
        <capsuleGeometry args={[0.95, 1.4, 6, 12]} />
        <meshStandardMaterial
          color="#96E4FF"
          emissive="#58C7FA"
          emissiveIntensity={0.45}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

function AuroraRibbons() {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(pos.x * 0.14 + uTime * 0.8) * 2.4;
          pos.y += cos(pos.x * 0.18 + uTime * 0.6) * 1.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          float wave = 0.5 + 0.5 * sin(vUv.x * 12.0 + uTime * 1.1);
          vec3 c1 = vec3(0.42, 0.95, 0.82);
          vec3 c2 = vec3(0.65, 0.72, 1.0);
          vec3 col = mix(c1, c2, wave);
          float alpha = sin(vUv.y * 3.14159) * sin(vUv.x * 3.14159) * 0.48;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[-46, 22, -52]} rotation={[0.18, 0.35, 0]}>
      <planeGeometry args={[46, 11, 32, 8]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
}

function SnowfallParticles({ boost }: { boost: boolean }) {
  const snowRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(() => {
    let s = 314;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    return Array.from({ length: 160 }, () => ({
      x: -70 + rand() * 48,
      y: 1 + rand() * 18,
      z: -54 + rand() * 42,
      speed: 1.2 + rand() * 1.4,
      phase: rand() * Math.PI * 2,
      scale: 0.07 + rand() * 0.08,
    }));
  }, []);

  useFrame((state) => {
    if (!snowRef.current) return;
    const t = state.clock.elapsedTime;
    const mult = boost ? 1.8 : 1;

    for (let i = 0; i < seeds.length; i++) {
      const f = seeds[i];
      const yRange = 18;
      const y = ((f.y - t * f.speed * mult) % yRange + yRange) % yRange + 0.5;
      const x = f.x + Math.sin(t * 1.1 + f.phase) * 0.7;
      const z = f.z + Math.cos(t * 0.9 + f.phase) * 0.7;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(f.scale * (boost ? 1.35 : 1));
      dummy.updateMatrix();
      snowRef.current.setMatrixAt(i, dummy.matrix);
    }
    snowRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={snowRef}
      args={[undefined, undefined, seeds.length]}
      frustumCulled={false}
    >
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#FFFFFF"
        emissive="#D9F5FF"
        emissiveIntensity={0.65}
      />
    </instancedMesh>
  );
}

export function FrozenKingdom({
  isDetailed,
  hideLabels = false,
  elsaMagicActive,
  annaCelebrationActive,
  playerPosRef,
  onSelectKingdom,
  onSelectCharacter,
}: FrozenKingdomProps) {
  const snowTex = useMemo(() => getPBRTextureSet('snow_02', 12, 12), []);
  const lakeGeo = useMemo(() => new THREE.CircleGeometry(6.4, 32), []);

  const mountains = useMemo(
    () => [
      { pos: [-62, 0, -48] as [number, number, number], r: 8.5, h: 17 },
      { pos: [-49, 0, -56] as [number, number, number], r: 10, h: 21 },
      { pos: [-34, 0, -51] as [number, number, number], r: 7.5, h: 15 },
      { pos: [-68, 0, -34] as [number, number, number], r: 7, h: 13.5 },
    ],
    []
  );

  const pines: Array<{ pos: [number, number, number]; scale: number }> = useMemo(
    () => [
      { pos: [-60, 0, -24], scale: 3.1 },
      { pos: [-57, 0, -18], scale: 2.7 },
      { pos: [-48, 0, -14], scale: 2.9 },
      { pos: [-29, 0, -28], scale: 3.0 },
      { pos: [-34, 0, -39], scale: 3.3 },
      { pos: [-61, 0, -36], scale: 3.4 },
      { pos: [-26, 0, -16], scale: 2.8 },
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
      {/* Snowy Kingdom Ground Layer with PBR Snow Maps */}
      <mesh position={[-46, 0.03, -33]} receiveShadow>
        <cylinderGeometry args={[24, 25, 0.14, 40]} />
        <meshStandardMaterial
          map={snowTex.map}
          normalMap={snowTex.normalMap}
          roughnessMap={snowTex.roughnessMap}
          color="#F2FAFF"
          roughness={0.82}
        />
      </mesh>
      <mesh position={[-35, 0.025, -20]} receiveShadow>
        <cylinderGeometry args={[12, 13, 0.12, 28]} />
        <meshStandardMaterial
          map={snowTex.map}
          normalMap={snowTex.normalMap}
          color="#F4FBFF"
          roughness={0.82}
        />
      </mesh>

      {/* Snow-Covered Mountains */}
      {mountains.map((m, idx) => (
        <group key={idx} position={m.pos}>
          <mesh position={[0, m.h / 2, 0]} castShadow>
            <coneGeometry args={[m.r, m.h, 7]} />
            <meshStandardMaterial color="#A9CBE8" roughness={0.85} />
          </mesh>
          <mesh position={[0, m.h * 0.72, 0]}>
            <coneGeometry args={[m.r * 0.45, m.h * 0.56, 7]} />
            <meshStandardMaterial
              map={snowTex.map}
              normalMap={snowTex.normalMap}
              color="#FFFFFF"
              roughness={0.72}
            />
          </mesh>
        </group>
      ))}

      {/* Shimmering Glacial Ice Lake */}
      <WaterSurface
        geometry={lakeGeo}
        position={[-40, 0.125, -24.5]}
        color="#90E0FC"
        emissive="#58C6F2"
        emissiveIntensity={0.22}
        repeat={5}
        speed={0.012}
      />

      {/* Crystalline Ice Bridge crossing Frozen Lake */}
      <ArchedBridge
        position={[-41.5, 0.06, -26.2]}
        rotationY={-0.7}
        deckColor="#DCF5FF"
        railColor="#8CE0FF"
        length={7.4}
        width={2.8}
        surface="stone"
      />

      {/* Large Ice Palace */}
      <IcePalace magicActive={elsaMagicActive} />

      {/* Ice Sculptures */}
      {[-42.5, -37.2].map((sx, idx) => (
        <group key={idx} position={[sx, 0.1, -29.5 + idx * 1.4]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.52, 0.9, 8]} />
            <meshStandardMaterial color="#E5F7FF" roughness={0.26} />
          </mesh>
          <mesh position={[0, 1.35, 0]}>
            <octahedronGeometry args={[0.52, 0]} />
            <meshStandardMaterial
              color="#B8EEFF"
              emissive="#7CE0FF"
              emissiveIntensity={0.5}
              roughness={0.14}
              metalness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Snowy Village Cottages */}
      <SnowyCottage position={[-31.5, 0.08, -17.5]} rotationY={-0.45} />
      <SnowyCottage position={[-36.2, 0.08, -14.2]} rotationY={0.35} />
      <SnowyCottage position={[-29.2, 0.08, -22.5]} rotationY={-1.05} />

      {/* Detailed CC0 Snow-Tinted Alpine Pines */}
      {pines.map((p, idx) => (
        <KenneyModel
          key={idx}
          url="/models/tree_pineTallA_detailed.glb"
          position={p.pos}
          scale={p.scale}
          tintColor="#DCEFFF"
        />
      ))}

      {/* Northern Lights */}
      <AuroraRibbons />

      {/* 3D Interactive Elsa, Anna & Olaf */}
      <FrozenCharacters
        showLabels={false}
        suppressLabels={hideLabels}
        elsaMagicActive={elsaMagicActive}
        annaCelebrationActive={annaCelebrationActive}
        playerPosRef={playerPosRef}
        onSelectCharacter={onSelectCharacter}
      />

      {/* Snowfall Particles */}
      {isDetailed && <SnowfallParticles boost={elsaMagicActive} />}
    </group>
  );
}
