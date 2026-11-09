import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { FairytaleCastle } from './FairytaleCastle';
import { WishingFountain } from './WishingFountain';
import { StorybookTree } from './SharedParkParts';
import { KenneyModel } from './KenneyModel';
import { getPBRTextureSet } from '../../utils/pbrMaterials';

export interface FantasySecret {
  id: string;
  title: string;
  message: string;
  position: [number, number, number];
  color: string;
}

const FANTASY_SECRETS: FantasySecret[] = [
  {
    id: 'enchanted-rose',
    title: 'Enchanted Rose Dome',
    message: 'Like an enchanted rose, may your joy stay vibrant in every season of life.',
    position: [-9.2, 0.25, -24.5],
    color: '#F59BB9',
  },
  {
    id: 'crystal-tiara',
    title: 'Royal Birthday Tiara',
    message: 'Every queen deserves a crown—today the entire kingdom celebrates you!',
    position: [9.2, 0.25, -24.5],
    color: '#FFD98E',
  },
  {
    id: 'castle-gates',
    title: 'Royal Castle Doors',
    message: 'Welcome inside Fantasy Kingdom! Make a royal birthday wish under the golden spires.',
    position: [0, 0.55, -25.2],
    color: '#C6A8F4',
  },
];

function MagicalRelic({
  secret,
  discovered,
  onSelect,
}: {
  secret: FantasySecret;
  discovered: boolean;
  onSelect: (secret: FantasySecret) => void;
}) {
  const orbRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const marble = useMemo(() => getPBRTextureSet('marble_01', 1, 2), []);

  useFrame((state) => {
    if (orbRef.current) {
      const t = state.clock.elapsedTime;
      orbRef.current.position.y = 1.15 + Math.sin(t * 2.4 + secret.position[0]) * 0.12;
      orbRef.current.rotation.y = t * 1.1;
    }
  });

  return (
    <group
      position={secret.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(secret);
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
      {/* Carved Marble Pedestal */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.48, 0.84, 16]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#FFF6EC"
          roughness={0.55}
        />
      </mesh>
      <mesh
        ref={orbRef}
        position={[0, 1.15, 0]}
        scale={hovered || discovered ? 1.2 : 1}
      >
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial
          color={secret.color}
          emissive={secret.color}
          emissiveIntensity={hovered ? 0.95 : 0.55}
          roughness={0.18}
          metalness={0.35}
        />
      </mesh>
      {hovered && (
        <Html position={[0, 1.85, 0]} center distanceFactor={18} zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-full border border-[#E2B362] bg-[#FFF9F2] px-2.5 py-0.5 text-[10px] font-semibold text-[#3B2B4B] shadow">
            {secret.title}
          </div>
        </Html>
      )}
    </group>
  );
}

export function FantasyKingdom({
  discoveredIds,
  onSelectKingdom,
  onDiscoverSecret,
}: {
  discoveredIds: string[];
  onSelectKingdom: () => void;
  onDiscoverSecret: (secret: FantasySecret) => void;
}) {
  const grass = useMemo(() => getPBRTextureSet('leafy_grass', 10, 10), []);
  const marble = useMemo(() => getPBRTextureSet('marble_01', 4, 4), []);

  return (
    <group>
      {/* Royal Lavender-Blush Castle Courtyard Lawn */}
      <mesh position={[0, 0.03, -33]} receiveShadow>
        <cylinderGeometry args={[18.5, 19.2, 0.12, 40]} />
        <meshStandardMaterial
          map={grass.map}
          normalMap={grass.normalMap}
          color="#DDF0DC"
          roughness={0.88}
        />
      </mesh>
      <mesh position={[0, 0.095, -33]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[13.5, 14.3, 44]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#E6DAF8"
          roughness={0.68}
        />
      </mesh>

      {/* Fairytale Castle Preserved at Center of Fantasy Kingdom */}
      <FairytaleCastle position={[0, 0, -34]} scale={1.15} onSelect={onSelectKingdom} />

      {/* Symmetrical Royal Garden Fountains */}
      <WishingFountain position={[-11.5, 0.08, -30]} scale={0.68} />
      <WishingFountain position={[11.5, 0.08, -30]} scale={0.68} />

      {/* Royal Garden Hedges & Flowers */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <KenneyModel
            url="/models/hedge-curved.glb"
            position={[side * 6.5, 0.08, -23.5]}
            rotation={[0, side > 0 ? Math.PI : 0, 0]}
            scale={1.8}
          />
          <KenneyModel url="/models/flower_purpleA.glb" position={[side * 4.5, 0.08, -23.5]} scale={2.0} />
          <KenneyModel url="/models/flower_redA.glb" position={[side * 7.8, 0.08, -23.2]} scale={2.0} />
        </group>
      ))}

      {/* Blossom Trees framing the Castle */}
      <StorybookTree position={[-14.5, 0, -39]} canopyColor="#F7C2D5" scale={1.25} swayOffset={0.4} />
      <StorybookTree position={[14.5, 0, -39]} canopyColor="#D8C6F3" scale={1.25} swayOffset={1.2} />
      <StorybookTree position={[-10.5, 0, -45]} canopyColor="#D8C6F3" scale={1.3} swayOffset={2.1} />
      <StorybookTree position={[10.5, 0, -45]} canopyColor="#F7C2D5" scale={1.3} swayOffset={2.8} />

      {/* Hidden Magical Relics & Interactive Castle Entrance */}
      {FANTASY_SECRETS.map((secret) => (
        <MagicalRelic
          key={secret.id}
          secret={secret}
          discovered={discoveredIds.includes(secret.id)}
          onSelect={onDiscoverSecret}
        />
      ))}
    </group>
  );
}
