import { useMemo, useRef, useState, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export type FrozenCharacterId = 'elsa' | 'anna' | 'olaf';

interface FrozenCharactersProps {
  showLabels: boolean;
  suppressLabels?: boolean;
  elsaMagicActive: boolean;
  annaCelebrationActive: boolean;
  playerPosRef?: MutableRefObject<{ x: number; z: number }>;
  onSelectCharacter: (id: FrozenCharacterId) => void;
}

function lookTowardsPlayer(
  group: THREE.Group,
  baseX: number,
  baseZ: number,
  baseRotY: number,
  idleSway: number,
  playerPosRef?: MutableRefObject<{ x: number; z: number }>
) {
  if (!playerPosRef) {
    group.rotation.y = baseRotY + idleSway;
    return;
  }
  const dx = playerPosRef.current.x - baseX;
  const dz = playerPosRef.current.z - baseZ;
  const dist = Math.hypot(dx, dz);
  if (dist < 14 && dist > 0.5) {
    const desired = Math.atan2(dx, dz);
    const diff = ((desired - group.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    group.rotation.y += diff * 0.08;
  } else {
    const target = baseRotY + idleSway;
    const diff = ((target - group.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    group.rotation.y += diff * 0.05;
  }
}

function BraidChain({
  position,
  rotation,
  color,
  links = 6,
  highlightColor,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  links?: number;
  highlightColor?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: links }, (_, i) => {
        const radius = 0.085 - i * 0.01;
        return (
          <mesh key={i} position={[0, -i * 0.11, i * 0.018]} castShadow>
            <sphereGeometry args={[Math.max(0.032, radius), 8, 8]} />
            <meshStandardMaterial
              color={highlightColor && i === 1 ? highlightColor : color}
              roughness={0.55}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function ElsaModel({
  showLabel,
  suppressLabel,
  magicActive,
  playerPosRef,
  onClick,
}: {
  showLabel: boolean;
  suppressLabel: boolean;
  magicActive: boolean;
  playerPosRef?: MutableRefObject<{ x: number; z: number }>;
  onClick: () => void;
}) {
  const outerRef = useRef<THREE.Group>(null);
  const rootRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Mesh>(null);
  const magicSwirlRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const swirlParticles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        angle: (i / 12) * Math.PI * 2,
        radius: 0.35 + (i % 3) * 0.18,
        y: (i % 4) * 0.14 - 0.2,
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRef.current) {
      lookTowardsPlayer(outerRef.current, -47, -31, 0.35, Math.sin(t * 0.7) * 0.06, playerPosRef);
    }
    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(t * 1.8) * 0.04;
    }

    if (rightArmRef.current) {
      const targetRaise = magicActive ? -1.85 + Math.sin(t * 5) * 0.18 : -0.35 + Math.sin(t * 1.6) * 0.08;
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x,
        targetRaise,
        0.12
      );
      rightArmRef.current.rotation.z = magicActive ? -0.35 : -0.18;
    }

    if (leftArmRef.current) {
      const targetLeft = magicActive ? -0.9 : 0.08 + Math.cos(t * 1.6) * 0.06;
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.x,
        targetLeft,
        0.12
      );
    }

    if (capeRef.current) {
      capeRef.current.rotation.x = 0.22 + Math.sin(t * 2.1) * 0.04;
    }

    if (magicSwirlRef.current) {
      magicSwirlRef.current.rotation.y = t * (magicActive ? 4.2 : 1.4);
      magicSwirlRef.current.scale.setScalar(magicActive ? 1.35 : 0.72);
    }
  });

  return (
    <group
      ref={outerRef}
      position={[-47, 0.1, -31]}
      rotation={[0, 0.35, 0]}
      scale={1.18}
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
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[0.95, 1.08, 0.12, 18]} />
        <meshStandardMaterial
          color="#D2F2FF"
          emissive="#7AD7FF"
          emissiveIntensity={hovered || magicActive ? 0.5 : 0.2}
          roughness={0.22}
          metalness={0.18}
        />
      </mesh>

      <group ref={rootRef}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.68, 1.35, 18]} />
          <meshStandardMaterial
            color="#7ED5FA"
            emissive="#4ABCEB"
            emissiveIntensity={0.22}
            roughness={0.24}
            metalness={0.22}
          />
        </mesh>

        <mesh position={[0, 1.56, 0]} castShadow>
          <cylinderGeometry args={[0.21, 0.23, 0.48, 14]} />
          <meshStandardMaterial
            color="#A8E7FF"
            emissive="#6BD1FC"
            emissiveIntensity={0.22}
            roughness={0.26}
            metalness={0.2}
          />
        </mesh>

        <mesh ref={capeRef} position={[0, 1.05, -0.32]} rotation={[0.22, 0, 0]} castShadow>
          <coneGeometry args={[0.62, 1.85, 10, 1, true, -Math.PI * 0.45, Math.PI * 0.9]} />
          <meshStandardMaterial
            color="#DDF6FF"
            emissive="#99E4FF"
            emissiveIntensity={0.25}
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
            roughness={0.18}
          />
        </mesh>

        <mesh position={[0, 1.86, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.16, 10]} />
          <meshStandardMaterial color="#FFE4D6" roughness={0.58} />
        </mesh>
        <group position={[0, 2.08, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.22, 16, 14]} />
            <meshStandardMaterial color="#FFE4D6" roughness={0.56} />
          </mesh>
          {[-0.075, 0.075].map((ex) => (
            <mesh key={ex} position={[ex, 0.02, 0.19]}>
              <sphereGeometry args={[0.026, 8, 8]} />
              <meshStandardMaterial color="#3B7BBF" />
            </mesh>
          ))}
          {[-0.11, 0.11].map((cx) => (
            <mesh key={cx} position={[cx, -0.04, 0.17]}>
              <sphereGeometry args={[0.032, 8, 8]} />
              <meshStandardMaterial color="#F7A8BE" roughness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 0.08, -0.02]} castShadow>
            <sphereGeometry args={[0.235, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
            <meshStandardMaterial color="#FAF3DA" roughness={0.48} />
          </mesh>
          <mesh position={[0.04, 0.16, 0.08]} rotation={[0.2, 0, -0.25]}>
            <sphereGeometry args={[0.13, 12, 10]} />
            <meshStandardMaterial color="#FAF3DA" roughness={0.48} />
          </mesh>
          <BraidChain
            position={[-0.14, -0.02, 0.02]}
            rotation={[0.2, 0, 0.24]}
            color="#FAF3DA"
            links={6}
          />
          <mesh position={[0, 0.25, 0.04]}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial
              color="#DDF7FF"
              emissive="#7CE0FF"
              emissiveIntensity={0.65}
            />
          </mesh>
        </group>

        <group ref={leftArmRef} position={[-0.27, 1.72, 0]}>
          <mesh position={[0, -0.25, 0]} rotation={[0, 0, 0.18]} castShadow>
            <capsuleGeometry args={[0.055, 0.42, 6, 8]} />
            <meshStandardMaterial color="#B5ECFF" roughness={0.38} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.27, 1.72, 0]}>
          <mesh position={[0, -0.25, 0]} rotation={[0, 0, -0.18]} castShadow>
            <capsuleGeometry args={[0.055, 0.42, 6, 8]} />
            <meshStandardMaterial color="#B5ECFF" roughness={0.38} />
          </mesh>

          <group ref={magicSwirlRef} position={[0.08, -0.54, 0.12]}>
            <mesh>
              <octahedronGeometry args={[0.11, 0]} />
              <meshStandardMaterial
                color="#E5FAFF"
                emissive="#7FE2FF"
                emissiveIntensity={1.2}
              />
            </mesh>
            {swirlParticles.map((p, idx) => (
              <mesh
                key={idx}
                position={[
                  Math.cos(p.angle) * p.radius,
                  p.y,
                  Math.sin(p.angle) * p.radius,
                ]}
              >
                <octahedronGeometry args={[0.045, 0]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  emissive="#9BEAFF"
                  emissiveIntensity={1.1}
                />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {!suppressLabel && (showLabel || hovered) && (
        <Html position={[0, 2.85, 0]} center distanceFactor={20} zIndexRange={[10, 0]}>
          <button
            type="button"
            onClick={onClick}
            className="cursor-pointer whitespace-nowrap rounded-full border border-[#99E5FF] bg-[#F2FAFF]/95 px-2.5 py-0.5 text-[11px] font-semibold text-[#1D4E70] shadow-sm transition hover:scale-105"
          >
            Queen Elsa
          </button>
        </Html>
      )}
    </group>
  );
}

function AnnaModel({
  showLabel,
  suppressLabel,
  celebrating,
  playerPosRef,
  onClick,
}: {
  showLabel: boolean;
  suppressLabel: boolean;
  celebrating: boolean;
  playerPosRef?: MutableRefObject<{ x: number; z: number }>;
  onClick: () => void;
}) {
  const outerRef = useRef<THREE.Group>(null);
  const rootRef = useRef<THREE.Group>(null);
  const waveArmRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRef.current) {
      lookTowardsPlayer(
        outerRef.current,
        -34.5,
        -21,
        0.55,
        celebrating ? Math.sin(t * 3.5) * 0.45 : Math.sin(t * 0.9) * 0.08,
        playerPosRef
      );
    }
    if (rootRef.current) {
      rootRef.current.position.y = celebrating
        ? Math.abs(Math.sin(t * 6)) * 0.16
        : Math.sin(t * 2.2 + 1) * 0.035;
    }
    if (waveArmRef.current) {
      waveArmRef.current.rotation.z = celebrating
        ? -2.2 + Math.sin(t * 10) * 0.35
        : -1.35 + Math.sin(t * 3.2) * 0.25;
    }
  });

  return (
    <group
      ref={outerRef}
      position={[-34.5, 0.1, -21]}
      rotation={[0, 0.55, 0]}
      scale={1.15}
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
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[0.9, 1.0, 0.1, 18]} />
        <meshStandardMaterial
          color="#F8DCE9"
          emissive="#E98AB4"
          emissiveIntensity={hovered || celebrating ? 0.4 : 0.15}
          roughness={0.35}
        />
      </mesh>

      <group ref={rootRef}>
        <mesh position={[0, 0.72, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.65, 1.28, 18]} />
          <meshStandardMaterial color="#2D5A76" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.045, 8, 22]} />
          <meshStandardMaterial color="#D66294" roughness={0.45} />
        </mesh>

        <mesh position={[0, 1.52, 0]} castShadow>
          <cylinderGeometry args={[0.21, 0.24, 0.46, 14]} />
          <meshStandardMaterial color="#28233A" roughness={0.55} />
        </mesh>

        <mesh position={[0, 1.15, -0.26]} rotation={[0.2, 0, 0]} castShadow>
          <coneGeometry args={[0.56, 1.38, 10, 1, true, -Math.PI * 0.45, Math.PI * 0.9]} />
          <meshStandardMaterial color="#B53874" side={THREE.DoubleSide} roughness={0.52} />
        </mesh>
        <mesh position={[0, 1.72, 0.18]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#F6BE65" metalness={0.6} />
        </mesh>

        <group position={[0, 2.02, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.215, 16, 14]} />
            <meshStandardMaterial color="#FFE3D4" roughness={0.58} />
          </mesh>
          {[-0.075, 0.075].map((ex) => (
            <mesh key={ex} position={[ex, 0.02, 0.185]}>
              <sphereGeometry args={[0.026, 8, 8]} />
              <meshStandardMaterial color="#3A7A70" />
            </mesh>
          ))}
          {[-0.11, 0.11].map((cx) => (
            <mesh key={cx} position={[cx, -0.04, 0.165]}>
              <sphereGeometry args={[0.032, 8, 8]} />
              <meshStandardMaterial color="#F7A0B3" roughness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 0.08, -0.02]} castShadow>
            <sphereGeometry args={[0.23, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
            <meshStandardMaterial color="#8F432D" roughness={0.6} />
          </mesh>
          <BraidChain
            position={[-0.2, -0.04, 0.04]}
            rotation={[0.15, 0, 0.16]}
            color="#8F432D"
            highlightColor="#F8EAD2"
            links={5}
          />
          <BraidChain
            position={[0.2, -0.04, 0.04]}
            rotation={[0.15, 0, -0.16]}
            color="#8F432D"
            links={5}
          />
        </group>

        <mesh position={[-0.28, 1.46, 0]} rotation={[0, 0, 0.24]} castShadow>
          <capsuleGeometry args={[0.052, 0.4, 6, 8]} />
          <meshStandardMaterial color="#7BC5D9" roughness={0.5} />
        </mesh>

        <group ref={waveArmRef} position={[0.25, 1.66, 0]}>
          <mesh position={[0.15, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
            <capsuleGeometry args={[0.052, 0.4, 6, 8]} />
            <meshStandardMaterial color="#7BC5D9" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {!suppressLabel && (showLabel || hovered) && (
        <Html position={[0, 2.75, 0]} center distanceFactor={20} zIndexRange={[10, 0]}>
          <button
            type="button"
            onClick={onClick}
            className="cursor-pointer whitespace-nowrap rounded-full border border-[#F59BB9] bg-[#FFF2F7]/95 px-2.5 py-0.5 text-[11px] font-semibold text-[#6E274A] shadow-sm transition hover:scale-105"
          >
            Princess Anna
          </button>
        </Html>
      )}
    </group>
  );
}

function OlafModel({
  showLabel,
  suppressLabel,
  playerPosRef,
  onClick,
}: {
  showLabel: boolean;
  suppressLabel: boolean;
  playerPosRef?: MutableRefObject<{ x: number; z: number }>;
  onClick: () => void;
}) {
  const outerRef = useRef<THREE.Group>(null);
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRef.current) {
      lookTowardsPlayer(outerRef.current, -39.5, -22.5, 0.3, 0, playerPosRef);
    }
    if (ref.current) {
      ref.current.position.y = Math.abs(Math.sin(t * 2.5)) * 0.08;
      ref.current.rotation.z = Math.sin(t * 2.5) * 0.06;
    }
  });

  return (
    <group
      ref={outerRef}
      position={[-39.5, 0.1, -22.5]}
      rotation={[0, 0.3, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <group ref={ref}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <sphereGeometry args={[0.38, 14, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.82, 0]} castShadow>
          <sphereGeometry args={[0.28, 14, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.65} />
        </mesh>
        {[0.72, 0.88, 0.45].map((by, idx) => (
          <mesh key={idx} position={[0, by, idx === 2 ? 0.35 : 0.25]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#2D2936" />
          </mesh>
        ))}
        <group position={[0, 1.24, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.23, 14, 12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.045, 0.24, 8]} />
            <meshStandardMaterial color="#F48A3B" roughness={0.5} />
          </mesh>
          {[-0.07, 0.07].map((ex) => (
            <mesh key={ex} position={[ex, 0.06, 0.2]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <meshStandardMaterial color="#23202A" />
            </mesh>
          ))}
        </group>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.38, 0.92, 0]}
            rotation={[0, 0, side * 0.7]}
          >
            <cylinderGeometry args={[0.022, 0.025, 0.48, 6]} />
            <meshStandardMaterial color="#6D4B3A" />
          </mesh>
        ))}
      </group>
      {!suppressLabel && showLabel && (
        <Html position={[0, 1.9, 0]} center distanceFactor={20} zIndexRange={[10, 0]}>
          <button
            type="button"
            onClick={onClick}
            className="cursor-pointer whitespace-nowrap rounded-full border border-[#BCE3FA] bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-[#2E5670] shadow-sm transition hover:scale-105"
          >
            Olaf
          </button>
        </Html>
      )}
    </group>
  );
}

export function FrozenCharacters({
  showLabels,
  suppressLabels = false,
  elsaMagicActive,
  annaCelebrationActive,
  playerPosRef,
  onSelectCharacter,
}: FrozenCharactersProps) {
  return (
    <group>
      <ElsaModel
        showLabel={showLabels}
        suppressLabel={suppressLabels}
        magicActive={elsaMagicActive}
        playerPosRef={playerPosRef}
        onClick={() => onSelectCharacter('elsa')}
      />
      <AnnaModel
        showLabel={showLabels}
        suppressLabel={suppressLabels}
        celebrating={annaCelebrationActive}
        playerPosRef={playerPosRef}
        onClick={() => onSelectCharacter('anna')}
      />
      <OlafModel
        showLabel={showLabels}
        suppressLabel={suppressLabels}
        playerPosRef={playerPosRef}
        onClick={() => onSelectCharacter('olaf')}
      />
    </group>
  );
}
