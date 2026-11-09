import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getPBRTextureSet } from '../../utils/pbrMaterials';

function OrbitingPlanets() {
  const groupRef = useRef<THREE.Group>(null);
  const saturnRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.22;
    }
    if (saturnRef.current) {
      saturnRef.current.position.y = 11.5 + Math.sin(t * 1.2) * 0.65;
      saturnRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group position={[47, 0, -34]}>
      <group ref={saturnRef} position={[0, 11.5, -2]} rotation={[0.35, 0, 0.2]}>
        <mesh>
          <sphereGeometry args={[2.1, 22, 18]} />
          <meshStandardMaterial
            color="#D7C4FF"
            emissive="#7A5CD6"
            emissiveIntensity={0.42}
            roughness={0.32}
            metalness={0.18}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.4, 0.24, 8, 40]} />
          <meshStandardMaterial
            color="#FFE0A6"
            emissive="#F6BE65"
            emissiveIntensity={0.35}
            roughness={0.25}
            metalness={0.55}
          />
        </mesh>
      </group>

      <group ref={groupRef} position={[0, 10.5, 0]}>
        <mesh position={[8.5, 1.5, 0]}>
          <sphereGeometry args={[1.05, 16, 14]} />
          <meshStandardMaterial
            color="#88E5FF"
            emissive="#4AC2F2"
            emissiveIntensity={0.45}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[-7.8, -0.8, 4.2]}>
          <sphereGeometry args={[1.25, 16, 14]} />
          <meshStandardMaterial
            color="#F9B5D2"
            emissive="#E377A8"
            emissiveIntensity={0.4}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[2.2, 2.8, -8.2]}>
          <sphereGeometry args={[0.82, 14, 12]} />
          <meshStandardMaterial
            color="#FFF0A8"
            emissive="#FFD175"
            emissiveIntensity={0.55}
          />
        </mesh>
      </group>
    </group>
  );
}

function StarSpinnerAttraction() {
  const rotorRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.y = state.clock.elapsedTime * 0.9;
    }
  });

  return (
    <group position={[39, 0.1, -27]}>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.5, 0.4, 24]} />
        <meshStandardMaterial color="#382C6A" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.55, 3.2, 12]} />
        <meshStandardMaterial color="#EDE8FF" metalness={0.5} roughness={0.28} />
      </mesh>
      <group ref={rotorRef} position={[0, 3.2, 0]}>
        <mesh>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#9AE8FF" emissive="#5AD2FA" emissiveIntensity={0.7} />
        </mesh>
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh position={[1.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.05, 0.05, 2.8, 6]} />
                <meshStandardMaterial color="#D9CCF2" metalness={0.4} />
              </mesh>
              <mesh position={[2.8, -0.45, 0]}>
                <sphereGeometry args={[0.42, 12, 10]} />
                <meshStandardMaterial
                  color={['#F7C6D9', '#8ECDF2', '#FFD98E', '#C6B1EC'][i]}
                  emissive="#A799FF"
                  emissiveIntensity={0.35}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

export function GalaxyKingdom({
  isDetailed,
  onSelectKingdom,
  onActivateStarWish,
}: {
  isDetailed: boolean;
  onSelectKingdom: () => void;
  onActivateStarWish: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const marble = useMemo(() => getPBRTextureSet('marble_01', 6, 6), []);

  const galaxyStars = useMemo(() => {
    let s = 515;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    return Array.from({ length: 48 }, () => ({
      pos: [30 + rand() * 34, 4 + rand() * 14, -50 + rand() * 32] as [number, number, number],
      scale: 0.1 + rand() * 0.12,
    }));
  }, []);

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelectKingdom();
      }}
    >
      {/* Cosmic Midnight-Lavender Platform with Marble Texture */}
      <mesh position={[46, 0.04, -34]} receiveShadow>
        <cylinderGeometry args={[23, 24, 0.14, 40]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#2C2154"
          roughness={0.52}
          metalness={0.18}
        />
      </mesh>
      <mesh position={[46, 0.12, -34]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[21.5, 22.8, 48]} />
        <meshStandardMaterial
          color="#96E4FF"
          emissive="#72D1FC"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Futuristic Starport Observatory & Space Domes */}
      <group position={[49, 0.1, -38]}>
        <mesh position={[0, 1.8, 0]} castShadow>
          <sphereGeometry args={[3.4, 22, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#EFEAFF" roughness={0.28} metalness={0.32} />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[3.6, 3.9, 0.9, 24]} />
          <meshStandardMaterial
            map={marble.map}
            normalMap={marble.normalMap}
            color="#42347A"
            roughness={0.46}
          />
        </mesh>
        <mesh position={[0, 2.2, 0]} rotation={[0.45, 0.3, 0]}>
          <torusGeometry args={[4.6, 0.14, 10, 40]} />
          <meshStandardMaterial
            color="#8CE3FF"
            emissive="#58C7FA"
            emissiveIntensity={0.65}
          />
        </mesh>
        {[-5.2, 5.2].map((ox) => (
          <group key={ox} position={[ox, 0, 2.2]}>
            <mesh position={[0, 1.1, 0]} castShadow>
              <sphereGeometry args={[1.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#D9CCF2" roughness={0.3} metalness={0.25} />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[1.7, 1.85, 0.56, 18]} />
              <meshStandardMaterial color="#584699" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Interactive Starlight Wish Beacon */}
      <group
        position={[45, 0.12, -31]}
        onClick={(e) => {
          e.stopPropagation();
          onActivateStarWish();
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
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.6, 1.3, 14]} />
          <meshStandardMaterial color="#4B3B86" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.65, 0]} scale={hovered ? 1.25 : 1}>
          <octahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial
            color="#FFF0A8"
            emissive="#FFD175"
            emissiveIntensity={hovered ? 1.3 : 0.85}
          />
        </mesh>
        {hovered && (
          <Html position={[0, 2.45, 0]} center distanceFactor={18} zIndexRange={[10, 0]}>
            <div className="pointer-events-none whitespace-nowrap rounded-full border border-[#8CE3FF] bg-[#241B46] px-2.5 py-0.5 text-[10px] font-semibold text-[#FFF9F2] shadow">
              Tap Cosmic Wish Star
            </div>
          </Html>
        )}
      </group>

      <StarSpinnerAttraction />
      <OrbitingPlanets />

      {isDetailed && (
        <>
          <pointLight position={[47, 8, -34]} intensity={4.5} distance={34} color="#A799FF" />
          {galaxyStars.map((st, idx) => (
            <mesh key={idx} position={st.pos} scale={st.scale}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#A6E4FF"
                emissiveIntensity={1.1}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}
