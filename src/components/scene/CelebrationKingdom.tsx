import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { birthdayConfig, type GiftMessagePlaceholder } from '../../config/birthdayConfig';
import { getPBRTextureSet } from '../../utils/pbrMaterials';
import { CelebrationFireworks } from './CelebrationFireworks';

function GiantBirthdayCake({
  candlesLit,
  onClick,
}: {
  candlesLit: boolean;
  onClick: () => void;
}) {
  const flamesRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const candlePositions = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return [Math.cos(angle) * 0.45, 2.38, Math.sin(angle) * 0.45] as [number, number, number];
      }),
    []
  );

  useFrame((state) => {
    if (flamesRef.current && candlesLit) {
      const t = state.clock.elapsedTime;
      flamesRef.current.children.forEach((child, idx) => {
        child.scale.setScalar(0.9 + Math.sin(t * 11 + idx * 1.3) * 0.18);
      });
    }
  });

  return (
    <group
      position={[0, 0.35, 0]}
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
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[1.65, 1.85, 0.5, 24]} />
        <meshStandardMaterial color="#FFF6EC" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[1.4, 1.45, 0.72, 24]} />
        <meshStandardMaterial color="#FADAE6" roughness={0.48} />
      </mesh>
      <mesh position={[0, 1.48, 0]} castShadow>
        <cylinderGeometry args={[1.05, 1.1, 0.62, 24]} />
        <meshStandardMaterial color="#E6DDF9" roughness={0.46} />
      </mesh>
      <mesh position={[0, 2.02, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.76, 0.52, 24]} />
        <meshStandardMaterial color="#FFF7E5" roughness={0.44} />
      </mesh>
      <mesh position={[0, 1.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.38, 0.05, 8, 28]} />
        <meshStandardMaterial color="#F6BE65" metalness={0.72} roughness={0.24} />
      </mesh>

      {candlePositions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <cylinderGeometry args={[0.04, 0.04, 0.38, 8]} />
          <meshStandardMaterial color={['#F59BB9', '#8ECDF2', '#FFD98E', '#B89CEB', '#F59BB9'][idx]} />
        </mesh>
      ))}
      <group ref={flamesRef}>
        {candlePositions.map((pos, idx) =>
          candlesLit ? (
            <mesh key={idx} position={[pos[0], pos[1] + 0.26, pos[2]]}>
              <octahedronGeometry args={[0.075, 0]} />
              <meshStandardMaterial
                color="#FFF4B8"
                emissive="#FFB84D"
                emissiveIntensity={1.4}
              />
            </mesh>
          ) : null
        )}
      </group>

      {hovered && (
        <Html position={[0, 3.05, 0]} center distanceFactor={18} zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-full border border-[#E2B362] bg-[#FFF9F2] px-2.5 py-0.5 text-[10px] font-semibold text-[#3B2B4B] shadow">
            {candlesLit ? 'Click Cake to Make a Wish!' : 'Click to Relight Candles'}
          </div>
        </Html>
      )}
    </group>
  );
}

function InteractiveGiftBox({
  gift,
  position,
  opened,
  onClick,
}: {
  gift: GiftMessagePlaceholder;
  position: [number, number, number];
  opened: boolean;
  onClick: () => void;
}) {
  const lidRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (lidRef.current) {
      const targetRot = opened ? -0.95 : 0;
      const targetY = opened ? 0.92 : 0.76;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, targetRot, 0.12);
      lidRef.current.position.y = THREE.MathUtils.lerp(lidRef.current.position.y, targetY, 0.12);
    }
  });

  return (
    <group
      position={position}
      rotation={[0, -0.35, 0]}
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
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[0.92, 0.72, 0.92]} />
        <meshStandardMaterial color={gift.boxColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <boxGeometry args={[0.96, 0.73, 0.18]} />
        <meshStandardMaterial color={gift.ribbonColor} roughness={0.32} metalness={0.22} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <boxGeometry args={[0.18, 0.73, 0.96]} />
        <meshStandardMaterial color={gift.ribbonColor} roughness={0.32} metalness={0.22} />
      </mesh>

      <group ref={lidRef} position={[0, 0.76, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.0, 0.16, 1.0]} />
          <meshStandardMaterial color={gift.boxColor} roughness={0.48} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <torusGeometry args={[0.16, 0.055, 8, 16]} />
          <meshStandardMaterial color={gift.ribbonColor} roughness={0.3} metalness={0.25} />
        </mesh>
      </group>

      {hovered && (
        <Html position={[0, 1.35, 0]} center distanceFactor={18} zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-full border border-[#E2B362] bg-[#FFF9F2] px-2.5 py-0.5 text-[10px] font-semibold text-[#3B2B4B] shadow">
            {gift.title}
          </div>
        </Html>
      )}
    </group>
  );
}

function FloatingBalloons() {
  const groupRef = useRef<THREE.Group>(null);
  const balloons = useMemo(
    () => [
      { pos: [-4.6, 3.6, -2.5] as [number, number, number], color: '#F59BB9' },
      { pos: [-4.8, 4.3, 1.4] as [number, number, number], color: '#C9ADEF' },
      { pos: [4.2, 3.8, -2.2] as [number, number, number], color: '#8ECDF2' },
      { pos: [3.8, 4.4, 2.5] as [number, number, number], color: '#FFD98E' },
      { pos: [0.4, 4.9, -4.4] as [number, number, number], color: '#F7C6D9' },
    ],
    []
  );

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.children.forEach((child, idx) => {
        child.position.y = balloons[idx].pos[1] + Math.sin(t * 1.6 + idx * 1.1) * 0.28;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {balloons.map((b, idx) => (
        <group key={idx} position={b.pos}>
          <mesh castShadow>
            <sphereGeometry args={[0.52, 14, 12]} />
            <meshStandardMaterial color={b.color} roughness={0.24} metalness={0.14} />
          </mesh>
          <mesh position={[0, -1.35, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 2.1, 4]} />
            <meshStandardMaterial color="#E6C587" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function CelebrationKingdom({
  isDetailed,
  candlesLit,
  fireworksActive = false,
  openedGiftIds,
  onSelectKingdom,
  onToggleCake,
  onOpenGift,
}: {
  isDetailed: boolean;
  candlesLit: boolean;
  fireworksActive?: boolean;
  openedGiftIds: string[];
  onSelectKingdom: () => void;
  onToggleCake: () => void;
  onOpenGift: (gift: GiftMessagePlaceholder) => void;
}) {
  const grass = useMemo(() => getPBRTextureSet('leafy_grass', 8, 8), []);
  const marble = useMemo(() => getPBRTextureSet('marble_01', 4, 4), []);

  const giftOffsets: [number, number, number][] = [
    [-3.2, 0.35, 1.8],
    [3.2, 0.35, 1.8],
    [0, 0.35, 3.8],
  ];

  const posts = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return {
          x: Math.cos(angle) * 5.6,
          z: Math.sin(angle) * 5.6,
          color: ['#F7C6D9', '#D9CCF2', '#BCE3FA', '#FFD98E'][i % 4],
        };
      }),
    []
  );

  return (
    <group
      position={[48, 0, -2]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectKingdom();
      }}
    >
      {/* Festive Celebration Meadow */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[14.5, 15.2, 0.12, 36]} />
        <meshStandardMaterial
          map={grass.map}
          normalMap={grass.normalMap}
          color="#E2F2DA"
          roughness={0.88}
        />
      </mesh>

      {/* Grand Circular Marble Stage */}
      <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[6.1, 6.4, 0.36, 36]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#FFF3EB"
          roughness={0.58}
        />
      </mesh>
      <mesh position={[0, 0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.4, 5.7, 36]} />
        <meshStandardMaterial color="#FADAE6" roughness={0.58} />
      </mesh>

      {/* Giant Interactive Birthday Cake */}
      <GiantBirthdayCake candlesLit={candlesLit} onClick={onToggleCake} />

      {/* Interactive Gift Boxes */}
      {birthdayConfig.giftMessages.map((gift, idx) => (
        <InteractiveGiftBox
          key={gift.id}
          gift={gift}
          position={giftOffsets[idx % giftOffsets.length]}
          opened={openedGiftIds.includes(gift.id)}
          onClick={() => onOpenGift(gift)}
        />
      ))}

      {/* Celebration Lantern & Fireworks Launch Pylons */}
      {posts.map((post, idx) => (
        <group key={idx} position={[post.x, 0.35, post.z]}>
          <mesh position={[0, 1.45, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.11, 2.9, 10]} />
            <meshStandardMaterial
              map={marble.map}
              normalMap={marble.normalMap}
              color="#FFF6EC"
              roughness={0.58}
            />
          </mesh>
          <mesh position={[0, 2.98, 0]}>
            <sphereGeometry args={[0.26, 12, 12]} />
            <meshStandardMaterial
              color={post.color}
              emissive="#FFD98E"
              emissiveIntensity={0.65}
            />
          </mesh>
        </group>
      ))}

      {/* Multi-Burst Aerial Fireworks */}
      <CelebrationFireworks active={fireworksActive || !candlesLit} />

      {/* Floating Balloons & Ambient Sparkle Light */}
      {isDetailed && (
        <>
          <FloatingBalloons />
          <pointLight position={[0, 5, 0]} intensity={2.6} distance={18} color="#FFE0A3" />
        </>
      )}
    </group>
  );
}
