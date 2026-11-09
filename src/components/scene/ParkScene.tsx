import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import {
  type GiftMessagePlaceholder,
  type ParkDestinationId,
  type TulipMessageItem,
} from '../../config/birthdayConfig';
import type { ParkInteractable } from '../../config/parkInteractables';
import {
  PlayerController,
  type PlayerHUDState,
  type PlayerTeleportRequest,
} from './PlayerController';
import { ParkGrounds } from './ParkGrounds';
import { ParkEntrance } from './ParkEntrance';
import { ParkSignposts } from './ParkSignposts';
import { MeadowGrass } from './MeadowGrass';
import { WishingFountain } from './WishingFountain';
import { ParkDecor } from './ParkDecor';
import { FlyingBirds } from './FlyingBirds';
import { MagicalAtmosphere } from './MagicalAtmosphere';
import { FantasyKingdom, type FantasySecret } from './FantasyKingdom';
import { TulipWonderland } from './TulipWonderland';
import { MemoryPavilion } from './MemoryPavilion';
import type { FrozenCharacterId } from './FrozenCharacters';

const LazyFrozenKingdom = lazy(() =>
  import('./FrozenKingdom').then((m) => ({ default: m.FrozenKingdom }))
);
const LazyAdventureKingdom = lazy(() =>
  import('./AdventureKingdom').then((m) => ({ default: m.AdventureKingdom }))
);
const LazyGalaxyKingdom = lazy(() =>
  import('./GalaxyKingdom').then((m) => ({ default: m.GalaxyKingdom }))
);
const LazyCelebrationKingdom = lazy(() =>
  import('./CelebrationKingdom').then((m) => ({ default: m.CelebrationKingdom }))
);

interface DetailLodState {
  hub: boolean;
  tulip: boolean;
  frozen: boolean;
  adventure: boolean;
  galaxy: boolean;
  celebration: boolean;
}

function FollowPlayerSunLight({
  playerPosRef,
}: {
  playerPosRef: MutableRefObject<{ x: number; z: number }>;
}) {
  const { scene } = useThree();
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const targetObj = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    scene.add(targetObj);
    return () => {
      scene.remove(targetObj);
    };
  }, [scene, targetObj]);

  useFrame(() => {
    if (!lightRef.current) return;
    // Snap to 0.5m increments to prevent shadow shimmer while keeping frustum crisp near the player
    const sx = Math.round(playerPosRef.current.x * 2) * 0.5;
    const sz = Math.round(playerPosRef.current.z * 2) * 0.5;
    targetObj.position.set(sx, 0, sz);
    targetObj.updateMatrixWorld();
    lightRef.current.position.set(sx + 28, 38, sz + 26);
    lightRef.current.target = targetObj;
  });

  return (
    <directionalLight
      ref={lightRef}
      position={[28, 38, 26]}
      intensity={1.55}
      color="#FFE6B8"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-near={6}
      shadow-camera-far={115}
      shadow-camera-left={-36}
      shadow-camera-right={36}
      shadow-camera-top={36}
      shadow-camera-bottom={-36}
      shadow-bias={-0.0005}
    />
  );
}

interface ParkSceneProps {
  isIntro: boolean;
  isModalOpen: boolean;
  isPaused: boolean;
  viewMode: 'first' | 'third';
  sensitivity: number;
  teleportRequest: PlayerTeleportRequest | null;
  joystickRef: MutableRefObject<{ x: number; y: number }>;
  touchLookDeltaRef: MutableRefObject<{ dx: number; dy: number }>;
  jumpRequestRef: MutableRefObject<boolean>;
  sprintToggleRef: MutableRefObject<boolean>;
  elsaMagicActive: boolean;
  annaCelebrationActive: boolean;
  fireworksActive: boolean;
  discoveredFantasyIds: string[];
  collectedFlowerIds: string[];
  openedChestIds: number[];
  candlesLit: boolean;
  openedGiftIds: string[];
  onHudUpdate: (hud: PlayerHUDState) => void;
  onInteract: (item: ParkInteractable) => void;
  onZoneDiscovered: (id: ParkDestinationId) => void;
  onTogglePause: () => void;
  onToggleMap: () => void;
  onToggleView: () => void;
  onSelectFrozenCharacter: (id: FrozenCharacterId) => void;
  onClickTulipFlower: (item: TulipMessageItem) => void;
  onOpenBouquet: () => void;
  onDiscoverFantasySecret: (secret: FantasySecret) => void;
  onOpenTreasure: (index: number, message: string) => void;
  onActivateStarWish: () => void;
  onToggleCake: () => void;
  onOpenGift: (gift: GiftMessagePlaceholder) => void;
  onSelectPhoto: (photoId: string) => void;
  onWishFountain: () => void;
  onSceneReady: () => void;
}

export const ParkScene = memo(function ParkScene({
  isIntro,
  isModalOpen,
  isPaused,
  viewMode,
  sensitivity,
  teleportRequest,
  joystickRef,
  touchLookDeltaRef,
  jumpRequestRef,
  sprintToggleRef,
  elsaMagicActive,
  annaCelebrationActive,
  fireworksActive,
  discoveredFantasyIds,
  collectedFlowerIds,
  openedChestIds,
  candlesLit,
  openedGiftIds,
  onHudUpdate,
  onInteract,
  onZoneDiscovered,
  onTogglePause,
  onToggleMap,
  onToggleView,
  onSelectFrozenCharacter,
  onClickTulipFlower,
  onOpenBouquet,
  onDiscoverFantasySecret,
  onOpenTreasure,
  onActivateStarWish,
  onToggleCake,
  onOpenGift,
  onSelectPhoto,
  onWishFountain,
  onSceneReady,
}: ParkSceneProps) {
  const playerPosRef = useRef({ x: 0, z: 50.5 });

  const [detailLod, setDetailLod] = useState<DetailLodState>({
    hub: true,
    tulip: false,
    frozen: false,
    adventure: false,
    galaxy: false,
    celebration: false,
  });

  const handlePlayerHudUpdate = useCallback(
    (hud: PlayerHUDState) => {
      playerPosRef.current.x = hud.x;
      playerPosRef.current.z = hud.z;

      const next: DetailLodState = {
        hub: Math.hypot(hud.x, hud.z - 14) < 48 || isIntro,
        tulip: Math.hypot(hud.x + 46, hud.z - 14) < 46,
        frozen: Math.hypot(hud.x + 46, hud.z + 34) < 48,
        adventure: Math.hypot(hud.x - 48, hud.z - 28) < 46,
        galaxy: Math.hypot(hud.x - 46, hud.z + 34) < 48,
        celebration: Math.hypot(hud.x - 48, hud.z + 2) < 45,
      };

      setDetailLod((prev) =>
        prev.hub === next.hub &&
        prev.tulip === next.tulip &&
        prev.frozen === next.frozen &&
        prev.adventure === next.adventure &&
        prev.galaxy === next.galaxy &&
        prev.celebration === next.celebration
          ? prev
          : next
      );

      onHudUpdate(hud);
    },
    [isIntro, onHudUpdate]
  );

  return (
    <div className="h-full w-full touch-none">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{
          fov: 58,
          near: 0.25,
          far: 340,
          position: [0, 2.35, 51.5],
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.04,
        }}
        onCreated={() => {
          requestAnimationFrame(() => onSceneReady());
        }}
      >
        <color attach="background" args={['#F8EAF4']} />
        <fog attach="fog" args={['#F8EAF4', 92, 235]} />

        {/* Offline Procedural IBL Environment for Realistic PBR Reflections */}
        <Environment resolution={256} frames={1}>
          <Lightformer
            form="ring"
            intensity={2.2}
            color="#FFF2DC"
            position={[18, 16, 18]}
            scale={[18, 18, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.5}
            color="#B8E0FC"
            position={[0, 25, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[30, 30, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            color="#FCE2EC"
            position={[-22, 8, -22]}
            scale={[24, 14, 1]}
          />
        </Environment>

        {/* Fairytale Sunlit Lighting + Dynamic Player-Tracking High-Res Shadow Frustum */}
        <hemisphereLight args={['#C9E7FB', '#F3D6E4', 0.92]} />
        <ambientLight intensity={0.3} color="#FFF4E8" />
        <FollowPlayerSunLight playerPosRef={playerPosRef} />
        <directionalLight position={[-32, 22, -45]} intensity={0.55} color="#D5C2F7" />
        <pointLight position={[0, 5, -24]} intensity={2.2} distance={26} color="#FFD282" />

        <Suspense fallback={null}>
          <PlayerController
            isIntro={isIntro}
            isModalOpen={isModalOpen}
            isPaused={isPaused}
            viewMode={viewMode}
            sensitivity={sensitivity}
            teleportRequest={teleportRequest}
            joystickRef={joystickRef}
            touchLookDeltaRef={touchLookDeltaRef}
            jumpRequestRef={jumpRequestRef}
            sprintToggleRef={sprintToggleRef}
            onHudUpdate={handlePlayerHudUpdate}
            onInteract={onInteract}
            onZoneDiscovered={onZoneDiscovered}
            onTogglePause={onTogglePause}
            onToggleMap={onToggleMap}
            onToggleView={onToggleView}
          />

          <MagicalAtmosphere />
          <ParkGrounds />
          <ParkEntrance />
          <ParkSignposts />
          <MeadowGrass />
          <FlyingBirds />

          <WishingFountain
            position={[0, 0.08, 6.0]}
            scale={1.15}
            onClick={isIntro ? undefined : onWishFountain}
          />
          <ParkDecor isDetailed={detailLod.hub} />

          {/* Kingdom II: Fantasy Kingdom */}
          <FantasyKingdom
            discoveredIds={discoveredFantasyIds}
            onSelectKingdom={() => {}}
            onDiscoverSecret={isIntro ? () => {} : onDiscoverFantasySecret}
          />

          {/* Kingdom III: Tulip Wonderland */}
          <TulipWonderland
            isDetailed={detailLod.tulip || isIntro}
            collectedFlowerIds={collectedFlowerIds}
            onClickFlower={isIntro ? () => {} : onClickTulipFlower}
            onOpenBouquet={isIntro ? undefined : onOpenBouquet}
          />

          {/* Memory Pavilion */}
          <MemoryPavilion
            onSelectPavilion={() => {}}
            onSelectPhoto={isIntro ? () => {} : onSelectPhoto}
          />

          {/* Lazy-Loaded Outer Kingdoms with Proximity Detail LOD */}
          <Suspense fallback={null}>
            <LazyFrozenKingdom
              isDetailed={detailLod.frozen}
              hideLabels={isIntro || isModalOpen || isPaused}
              elsaMagicActive={elsaMagicActive}
              annaCelebrationActive={annaCelebrationActive}
              playerPosRef={playerPosRef}
              onSelectKingdom={() => {}}
              onSelectCharacter={isIntro ? () => {} : onSelectFrozenCharacter}
            />
            <LazyAdventureKingdom
              isDetailed={detailLod.adventure}
              openedChests={openedChestIds}
              onSelectKingdom={() => {}}
              onOpenTreasure={isIntro ? () => {} : onOpenTreasure}
            />
            <LazyGalaxyKingdom
              isDetailed={detailLod.galaxy}
              onSelectKingdom={() => {}}
              onActivateStarWish={isIntro ? () => {} : onActivateStarWish}
            />
            <LazyCelebrationKingdom
              isDetailed={detailLod.celebration}
              candlesLit={candlesLit}
              fireworksActive={fireworksActive}
              openedGiftIds={openedGiftIds}
              onSelectKingdom={() => {}}
              onToggleCake={isIntro ? () => {} : onToggleCake}
              onOpenGift={isIntro ? () => {} : onOpenGift}
            />
          </Suspense>
        </Suspense>
      </Canvas>
    </div>
  );
});
