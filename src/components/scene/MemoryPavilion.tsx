import { useMemo, useState } from 'react';
import { Html } from '@react-three/drei';
import { birthdayConfig, type PhotoMemoryPlaceholder } from '../../config/birthdayConfig';
import { getPBRTextureSet } from '../../utils/pbrMaterials';

function PhotoFrameEasel({
  photo,
  position,
  rotationY,
  onClick,
}: {
  photo: PhotoMemoryPlaceholder;
  position: [number, number, number];
  rotationY: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const wood = useMemo(() => getPBRTextureSet('oak_wood_planks', 1, 1), []);

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
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
      scale={hovered ? 1.08 : 1}
    >
      <mesh position={[0, 0.72, -0.14]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.5, 6]} />
        <meshStandardMaterial
          map={wood.map}
          normalMap={wood.normalMap}
          color="#C89E5D"
          roughness={0.55}
        />
      </mesh>
      <mesh position={[0, 1.15, 0]} rotation={[-0.14, 0, 0]} castShadow>
        <boxGeometry args={[1.15, 0.92, 0.08]} />
        <meshStandardMaterial color={photo.frameTint} roughness={0.42} />
      </mesh>
      <mesh position={[0, 1.15, 0.045]} rotation={[-0.14, 0, 0]}>
        <planeGeometry args={[0.92, 0.7]} />
        <meshStandardMaterial
          color={photo.palette[0]}
          emissive={photo.palette[1]}
          emissiveIntensity={hovered ? 0.35 : 0.15}
        />
      </mesh>
      {hovered && (
        <Html position={[0, 1.9, 0]} center distanceFactor={16} zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-full border border-[#E2B362] bg-[#FFF9F2] px-2.5 py-0.5 text-[10px] font-semibold text-[#3B2B4B] shadow">
            {photo.title}
          </div>
        </Html>
      )}
    </group>
  );
}

export function MemoryPavilion({
  position = [17, 0, 22] as [number, number, number],
  onSelectPavilion,
  onSelectPhoto,
}: {
  position?: [number, number, number];
  onSelectPavilion: () => void;
  onSelectPhoto: (photoId: string) => void;
}) {
  const marble = useMemo(() => getPBRTextureSet('marble_01', 3, 3), []);

  const columns = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return [Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5] as [number, number, number];
      }),
    []
  );

  const easelPlacements: Array<{ pos: [number, number, number]; rotY: number }> = [
    { pos: [-3.9, 0, 2.2], rotY: 0.7 },
    { pos: [3.9, 0, 2.2], rotY: -0.7 },
    { pos: [-3.9, 0, -2.2], rotY: 2.3 },
    { pos: [3.9, 0, -2.2], rotY: -2.3 },
  ];

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelectPavilion();
      }}
    >
      {/* Stepped Marble Gazebo Floor */}
      <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.3, 3.55, 0.24, 24]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#FFF6EC"
          roughness={0.62}
        />
      </mesh>
      <mesh position={[0, 0.28, 0]} receiveShadow>
        <cylinderGeometry args={[2.9, 3.0, 0.12, 24]} />
        <meshStandardMaterial
          map={marble.map}
          normalMap={marble.normalMap}
          color="#F6EAF9"
          roughness={0.6}
        />
      </mesh>

      {/* Six Fairytale Marble Columns */}
      {columns.map((pos, idx) => (
        <mesh key={idx} position={[pos[0], 1.7, pos[2]]} castShadow>
          <cylinderGeometry args={[0.11, 0.14, 2.85, 12]} />
          <meshStandardMaterial
            map={marble.map}
            normalMap={marble.normalMap}
            color="#FFF9F2"
            roughness={0.55}
          />
        </mesh>
      ))}

      {/* Gold Ring Beam */}
      <mesh position={[0, 3.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.52, 0.11, 10, 32]} />
        <meshStandardMaterial color="#F6BE65" metalness={0.68} roughness={0.26} />
      </mesh>

      {/* Sky-Blue Dome & Finial */}
      <mesh position={[0, 4.0, 0]} castShadow>
        <coneGeometry args={[3.1, 1.9, 12]} />
        <meshStandardMaterial color="#BCE3FA" roughness={0.45} />
      </mesh>
      <mesh position={[0, 5.05, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial
          color="#FFD98E"
          emissive="#F6BE65"
          emissiveIntensity={0.45}
          metalness={0.65}
        />
      </mesh>

      {/* Warm Central Hanging Lantern */}
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 6]} />
        <meshStandardMaterial color="#C89E5D" />
      </mesh>
      <mesh position={[0, 2.38, 0]}>
        <sphereGeometry args={[0.26, 14, 14]} />
        <meshStandardMaterial color="#FFE8AF" emissive="#FFD07B" emissiveIntensity={0.95} />
      </mesh>

      {/* 3D Framed Family Photo Easels */}
      {birthdayConfig.photos.slice(0, 4).map((photo, idx) => (
        <PhotoFrameEasel
          key={photo.id}
          photo={photo}
          position={easelPlacements[idx].pos}
          rotationY={easelPlacements[idx].rotY}
          onClick={() => onSelectPhoto(photo.id)}
        />
      ))}
    </group>
  );
}
