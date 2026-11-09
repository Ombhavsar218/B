import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  birthdayConfig,
  type GiftMessagePlaceholder,
  type ParkDestinationId,
  type TulipMessageItem,
} from './config/birthdayConfig';
import type { ParkInteractable } from './config/parkInteractables';
import type { PlayerHUDState, PlayerTeleportRequest } from './components/scene/PlayerController';
import type { FrozenCharacterId } from './components/scene/FrozenCharacters';
import type { FantasySecret } from './components/scene/FantasyKingdom';
import { soundEngine } from './utils/soundEngine';
import { isWebGLAvailable } from './utils/webgl';
import { WebGLFallback } from './components/ui/WebGLFallback';
import { LoadingOverlay } from './components/ui/LoadingOverlay';
import { IntroOverlay } from './components/ui/IntroOverlay';
import { GameHUD } from './components/ui/GameHUD';
import { MobileControls } from './components/ui/MobileControls';
import { PauseMenuModal } from './components/ui/PauseMenuModal';
import { ParkMapModal } from './components/ui/ParkMapModal';
import { MemoryGalleryModal } from './components/ui/MemoryGalleryModal';
import { BouquetBuilderDrawer } from './components/ui/BouquetBuilderDrawer';
import { InteractionModal, type ActiveInteraction } from './components/ui/InteractionModal';

const LazyParkScene = lazy(() =>
  import('./components/scene/ParkScene').then((mod) => ({ default: mod.ParkScene }))
);

interface ErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <WebGLFallback />;
    }
    return this.props.children;
  }
}

const DESTINATION_SPAWN_POSES: Record<ParkDestinationId, { x: number; z: number; yaw: number }> = {
  intro: { x: 0, z: 34, yaw: 0 },
  hub: { x: 0, z: 12.2, yaw: 0 },
  fantasyland: { x: 0, z: -24.8, yaw: 0 },
  'frozen-kingdom': { x: -35.5, z: -18.5, yaw: 0.72 },
  'tulip-garden': { x: -33.5, z: 13.5, yaw: 1.57 },
  'adventure-kingdom': { x: 35.5, z: 26.2, yaw: -1.45 },
  'galaxy-kingdom': { x: 42.5, z: -24.5, yaw: -0.35 },
  surprises: { x: 39.5, z: -1.5, yaw: -1.55 },
  memories: { x: 13.2, z: 27.5, yaw: -0.62 },
};

const FANTASY_SECRETS_BY_ID: Record<string, FantasySecret> = {
  'enchanted-rose': {
    id: 'enchanted-rose',
    title: 'Enchanted Rose Dome',
    message: 'Like an enchanted rose, may your joy stay vibrant in every season of life.',
    position: [-9.2, 0.25, -24.5],
    color: '#F59BB9',
  },
  'crystal-tiara': {
    id: 'crystal-tiara',
    title: 'Royal Birthday Tiara',
    message: 'Every queen deserves a crown—today the entire kingdom celebrates you!',
    position: [9.2, 0.25, -24.5],
    color: '#FFD98E',
  },
  'castle-gates': {
    id: 'castle-gates',
    title: 'Royal Castle Doors',
    message: 'Welcome inside Fantasy Kingdom! Make a royal birthday wish under the golden spires.',
    position: [0, 0.55, -25.2],
    color: '#C6A8F4',
  },
};

export function App() {
  const [webglSupported] = useState(() => isWebGLAvailable());
  const [sceneReady, setSceneReady] = useState(false);

  // Intro state: begins outside Main Entrance Gates until "Enter Park" is clicked
  const [isIntro, setIsIntro] = useState(true);
  const [welcomeToastVisible, setWelcomeToastVisible] = useState(false);

  // Explorer HUD & Camera state
  const [hud, setHud] = useState<PlayerHUDState>({
    x: 0,
    z: 50.5,
    yaw: 0,
    zoneId: 'intro',
    zoneName: 'Main Entrance Courtyard',
    nearbyInteractable: null,
    pointerLocked: false,
    sprinting: false,
  });

  const [exploredDestinations, setExploredDestinations] = useState<ParkDestinationId[]>(['hub']);
  const [viewMode, setViewMode] = useState<'first' | 'third'>('first');
  const [isPaused, setIsPaused] = useState(false);
  const [sensitivity, setSensitivity] = useState(1.0);
  const [showHints, setShowHints] = useState(true);
  const [showTouchControls, setShowTouchControls] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false
  );
  const [teleportRequest, setTeleportRequest] = useState<PlayerTeleportRequest | null>(null);

  // Audio state
  const [muted, setMuted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(0.45);

  // Modals & Interactive Props state
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const [isBouquetOpen, setIsBouquetOpen] = useState(false);
  const [activeFlower, setActiveFlower] = useState<TulipMessageItem | null>(null);
  const [collectedFlowers, setCollectedFlowers] = useState<TulipMessageItem[]>([]);
  const [bouquetCompleted, setBouquetCompleted] = useState(false);

  const [elsaMagicActive, setElsaMagicActive] = useState(false);
  const [annaCelebrationActive, setAnnaCelebrationActive] = useState(false);
  const [discoveredFantasyIds, setDiscoveredFantasyIds] = useState<string[]>([]);
  const [openedChestIds, setOpenedChestIds] = useState<number[]>([]);
  const [candlesLit, setCandlesLit] = useState(true);
  const [fireworksActive, setFireworksActive] = useState(false);
  const [openedGiftIds, setOpenedGiftIds] = useState<string[]>([]);

  const [activeInteraction, setActiveInteraction] = useState<ActiveInteraction | null>(null);
  const [extraRevealed, setExtraRevealed] = useState(false);

  // Continuous input refs for 60fps controller
  const joystickRef = useRef({ x: 0, y: 0 });
  const touchLookDeltaRef = useRef({ dx: 0, dy: 0 });
  const jumpRequestRef = useRef(false);
  const sprintToggleRef = useRef(false);

  useEffect(() => {
    document.title = birthdayConfig.parkTitle;
  }, []);

  useEffect(() => {
    if (!welcomeToastVisible) return;
    const timer = window.setTimeout(() => setWelcomeToastVisible(false), 4500);
    return () => window.clearTimeout(timer);
  }, [welcomeToastVisible]);

  const markExplored = useCallback((id: ParkDestinationId) => {
    setExploredDestinations((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const teleportToDestination = useCallback(
    (id: ParkDestinationId) => {
      const pose = DESTINATION_SPAWN_POSES[id];
      setTeleportRequest((prev) => ({
        x: pose.x,
        z: pose.z,
        yaw: pose.yaw,
        nonce: (prev?.nonce ?? 0) + 1,
      }));
      if (id !== 'intro') {
        markExplored(id);
      }
    },
    [markExplored]
  );

  const handleEnterPark = useCallback(() => {
    soundEngine.startAmbience();
    soundEngine.playMagicChime();
    setIsIntro(false);
    setWelcomeToastVisible(true);
    teleportToDestination('intro'); // Places player just inside gates at [0, 34] facing North
  }, [teleportToDestination]);

  const handleSelectFrozenCharacter = useCallback((id: FrozenCharacterId) => {
    soundEngine.playMagicChime();
    setExtraRevealed(false);
    if (id === 'elsa') {
      const elsa = birthdayConfig.characterGreetings.elsa;
      setElsaMagicActive(true);
      setActiveInteraction({
        kind: 'elsa',
        title: elsa.name,
        subtitle: elsa.title,
        message: elsa.greeting,
        accentColor: '#99E5FF',
        extraActionLabel: 'Cast Birthday Ice Magic!',
        extraMessage: elsa.magicWish,
      });
    } else if (id === 'anna') {
      const anna = birthdayConfig.characterGreetings.anna;
      setAnnaCelebrationActive(true);
      setActiveInteraction({
        kind: 'anna',
        title: anna.name,
        subtitle: anna.title,
        message: anna.greeting,
        accentColor: '#F59BB9',
        extraActionLabel: "Open Anna's Birthday Surprise!",
        extraMessage: anna.surpriseNote,
      });
    } else {
      const olaf = birthdayConfig.characterGreetings.olaf;
      setActiveInteraction({
        kind: 'olaf',
        title: olaf.name,
        subtitle: olaf.title,
        message: olaf.greeting,
        accentColor: '#BCE3FA',
      });
    }
  }, []);

  const handleClickTulipFlower = useCallback((item: TulipMessageItem) => {
    soundEngine.playMagicChime();
    setActiveFlower(item);
    setIsBouquetOpen(true);
  }, []);

  const handleOpenBouquet = useCallback(() => {
    soundEngine.playMagicChime();
    setIsBouquetOpen(true);
  }, []);

  const handleCollectFlower = useCallback((flower: TulipMessageItem) => {
    soundEngine.playMagicChime();
    setCollectedFlowers((prev) => (prev.length >= 7 ? prev : [...prev, flower]));
  }, []);

  const handleDiscoverFantasySecret = useCallback((secret: FantasySecret) => {
    soundEngine.playMagicChime();
    setDiscoveredFantasyIds((prev) => (prev.includes(secret.id) ? prev : [...prev, secret.id]));
    setExtraRevealed(false);
    setActiveInteraction({
      kind: 'fantasy',
      title: secret.title,
      subtitle: 'Fantasy Kingdom Discovery',
      message: secret.message,
      accentColor: secret.color,
    });
  }, []);

  const handleOpenTreasure = useCallback((index: number, message: string) => {
    soundEngine.playMagicChime();
    setOpenedChestIds((prev) => (prev.includes(index) ? prev : [...prev, index]));
    setExtraRevealed(false);
    setActiveInteraction({
      kind: 'adventure',
      title: `Jungle Treasure #${index + 1}`,
      subtitle: 'Adventure Kingdom Discovery',
      message,
      accentColor: '#76C893',
    });
  }, []);

  const handleActivateStarWish = useCallback(() => {
    soundEngine.playMagicChime();
    setExtraRevealed(false);
    setActiveInteraction({
      kind: 'galaxy',
      title: 'Starlight Cosmic Wish',
      subtitle: 'Galaxy Kingdom',
      message: `Happy Birthday, ${birthdayConfig.sisterName}! Among billions of stars and orbiting moons, none shine brighter than your smile.`,
      accentColor: '#A799FF',
    });
  }, []);

  const handleToggleCake = useCallback(() => {
    soundEngine.playMagicChime();
    setFireworksActive(true);
    setCandlesLit((prev) => {
      const next = !prev;
      setExtraRevealed(false);
      setActiveInteraction({
        kind: 'cake',
        title: next ? 'Birthday Candles Relit!' : 'Wish Made on the Birthday Cake!',
        subtitle: 'Birthday Celebration Kingdom',
        message: next
          ? 'All five pastel birthday candles are glowing brightly with fireworks overhead!'
          : `You blew out the candles! ${birthdayConfig.personalBirthdayMessage}`,
        accentColor: '#FFD07B',
      });
      return next;
    });
  }, []);

  const handleOpenGift = useCallback((gift: GiftMessagePlaceholder) => {
    soundEngine.playMagicChime();
    setOpenedGiftIds((prev) => (prev.includes(gift.id) ? prev : [...prev, gift.id]));
    setExtraRevealed(false);
    setActiveInteraction({
      kind: 'gift',
      title: gift.title,
      subtitle: 'Birthday Surprise Gift Box',
      message: gift.message,
      accentColor: gift.ribbonColor,
    });
  }, []);

  const handleSelectPhoto = useCallback((photoId: string) => {
    soundEngine.playMagicChime();
    setSelectedPhotoId(photoId);
    setIsMemoryModalOpen(true);
  }, []);

  const handleWishFountain = useCallback(() => {
    soundEngine.playMagicChime();
    setExtraRevealed(false);
    setActiveInteraction({
      kind: 'fountain',
      title: 'Central Wishing Fountain',
      subtitle: 'Wishing Plaza',
      message: `Toss a golden coin into the fountain and make a birthday wish, ${birthdayConfig.sisterName}! Every path from here leads to a new enchanted kingdom.`,
      accentColor: '#8ECDF2',
    });
  }, []);

  const handleProximityInteract = useCallback(
    (item: ParkInteractable) => {
      switch (item.kind) {
        case 'wishing-fountain':
          handleWishFountain();
          break;
        case 'frozen-character':
          if (item.frozenId) handleSelectFrozenCharacter(item.frozenId);
          break;
        case 'tulip-flower': {
          const found = birthdayConfig.tulipMessages.find((t) => t.id === item.tulipId);
          if (found) handleClickTulipFlower(found);
          break;
        }
        case 'bouquet-studio':
          handleOpenBouquet();
          break;
        case 'fantasy-relic': {
          const sec = item.fantasySecretId ? FANTASY_SECRETS_BY_ID[item.fantasySecretId] : null;
          if (sec) handleDiscoverFantasySecret(sec);
          break;
        }
        case 'adventure-chest': {
          const idx = item.chestIndex ?? 0;
          handleOpenTreasure(idx, birthdayConfig.adventureTreasures[idx] ?? birthdayConfig.adventureTreasures[0]);
          break;
        }
        case 'galaxy-wish':
          handleActivateStarWish();
          break;
        case 'birthday-cake':
        case 'fireworks':
          handleToggleCake();
          break;
        case 'gift-box': {
          const gift = birthdayConfig.giftMessages.find((g) => g.id === item.giftId);
          if (gift) handleOpenGift(gift);
          break;
        }
        case 'photo-easel':
          if (item.photoId) handleSelectPhoto(item.photoId);
          break;
        case 'memory-letters':
          soundEngine.playMagicChime();
          setSelectedPhotoId(null);
          setIsMemoryModalOpen(true);
          break;
      }
    },
    [
      handleActivateStarWish,
      handleClickTulipFlower,
      handleDiscoverFantasySecret,
      handleOpenBouquet,
      handleOpenGift,
      handleOpenTreasure,
      handleSelectFrozenCharacter,
      handleSelectPhoto,
      handleToggleCake,
      handleWishFountain,
    ]
  );

  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleToggleMap = useCallback(() => {
    setIsMapOpen((prev) => !prev);
  }, []);

  const handleToggleView = useCallback(() => {
    setViewMode((prev) => (prev === 'first' ? 'third' : 'first'));
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  const handleToggleMusic = useCallback(() => {
    setMusicEnabled((prev) => {
      const next = !prev;
      soundEngine.setMusicEnabled(next);
      return next;
    });
  }, []);

  const handleChangeVolume = useCallback((val: number) => {
    setVolume(val);
    soundEngine.setVolume(val);
    if (val > 0 && muted) {
      setMuted(false);
      soundEngine.setMuted(false);
    }
  }, [muted]);

  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  const isModalOpen = isMapOpen || isMemoryModalOpen || isBouquetOpen || Boolean(activeInteraction);

  const collectedIds = useMemo(() => collectedFlowers.map((f) => f.id), [collectedFlowers]);

  const totalKingdoms = useMemo(
    () => Object.values(birthdayConfig.destinations).filter((d) => d.isKingdom).length,
    []
  );

  const exploredKingdomCount = useMemo(
    () => exploredDestinations.filter((id) => birthdayConfig.destinations[id].isKingdom).length,
    [exploredDestinations]
  );

  if (!webglSupported) {
    return <WebGLFallback />;
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-[#BCE3FA]/50 via-[#FFF9F2] to-[#FADAE6]/50">
      <SceneErrorBoundary>
        <Suspense fallback={<LoadingOverlay visible={true} />}>
          <LazyParkScene
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
            elsaMagicActive={elsaMagicActive}
            annaCelebrationActive={annaCelebrationActive}
            fireworksActive={fireworksActive}
            discoveredFantasyIds={discoveredFantasyIds}
            collectedFlowerIds={collectedIds}
            openedChestIds={openedChestIds}
            candlesLit={candlesLit}
            openedGiftIds={openedGiftIds}
            onHudUpdate={setHud}
            onInteract={handleProximityInteract}
            onZoneDiscovered={markExplored}
            onTogglePause={handleTogglePause}
            onToggleMap={handleToggleMap}
            onToggleView={handleToggleView}
            onSelectFrozenCharacter={handleSelectFrozenCharacter}
            onClickTulipFlower={handleClickTulipFlower}
            onOpenBouquet={handleOpenBouquet}
            onDiscoverFantasySecret={handleDiscoverFantasySecret}
            onOpenTreasure={handleOpenTreasure}
            onActivateStarWish={handleActivateStarWish}
            onToggleCake={handleToggleCake}
            onOpenGift={handleOpenGift}
            onSelectPhoto={handleSelectPhoto}
            onWishFountain={handleWishFountain}
            onSceneReady={handleSceneReady}
          />
        </Suspense>
      </SceneErrorBoundary>

      <LoadingOverlay visible={!sceneReady} />

      <IntroOverlay visible={sceneReady && isIntro} onEnterPark={handleEnterPark} />

      <GameHUD
        visible={sceneReady && !isIntro && !isModalOpen && !isPaused}
        hud={hud}
        exploredCount={exploredKingdomCount}
        totalKingdoms={totalKingdoms}
        viewMode={viewMode}
        muted={muted}
        showHints={showHints}
        showTouchControls={showTouchControls}
        welcomeToastVisible={welcomeToastVisible}
        onDismissHints={() => setShowHints(false)}
        onOpenMap={() => setIsMapOpen(true)}
        onToggleView={handleToggleView}
        onToggleMute={handleToggleMute}
        onToggleTouchControls={() => setShowTouchControls((prev) => !prev)}
        onOpenPause={() => setIsPaused(true)}
        onTriggerInteract={handleProximityInteract}
      />

      <MobileControls
        visible={sceneReady && !isIntro && !isModalOpen && !isPaused && showTouchControls}
        joystickRef={joystickRef}
        touchLookDeltaRef={touchLookDeltaRef}
        jumpRequestRef={jumpRequestRef}
        sprintToggleRef={sprintToggleRef}
        nearbyInteractable={hud.nearbyInteractable}
        onTriggerInteract={handleProximityInteract}
      />

      <PauseMenuModal
        open={isPaused}
        viewMode={viewMode}
        sensitivity={sensitivity}
        volume={volume}
        muted={muted}
        musicEnabled={musicEnabled}
        showHints={showHints}
        showTouchControls={showTouchControls}
        onResume={() => setIsPaused(false)}
        onOpenMap={() => setIsMapOpen(true)}
        onReturnToGates={() => teleportToDestination('intro')}
        onToggleView={handleToggleView}
        onChangeSensitivity={setSensitivity}
        onChangeVolume={handleChangeVolume}
        onToggleMute={handleToggleMute}
        onToggleMusic={handleToggleMusic}
        onToggleHints={() => setShowHints((prev) => !prev)}
        onToggleTouchControls={() => setShowTouchControls((prev) => !prev)}
      />

      <ParkMapModal
        open={isMapOpen}
        activeDestination={hud.zoneId}
        exploredDestinations={exploredDestinations}
        playerPosition={{ x: hud.x, z: hud.z, yaw: hud.yaw }}
        onClose={() => setIsMapOpen(false)}
        onSelectDestination={(id) => {
          soundEngine.playMagicChime();
          teleportToDestination(id);
        }}
      />

      <MemoryGalleryModal
        open={isMemoryModalOpen}
        initialPhotoId={selectedPhotoId}
        onClose={() => setIsMemoryModalOpen(false)}
      />

      <BouquetBuilderDrawer
        open={isBouquetOpen}
        activeFlower={activeFlower}
        collectedFlowers={collectedFlowers}
        bouquetCompleted={bouquetCompleted}
        onClose={() => setIsBouquetOpen(false)}
        onSelectFlower={setActiveFlower}
        onCollectFlower={handleCollectFlower}
        onRemoveStem={(idx) =>
          setCollectedFlowers((prev) => prev.filter((_, i) => i !== idx))
        }
        onCompleteBouquet={() => {
          soundEngine.playMagicChime();
          setBouquetCompleted(true);
        }}
      />

      <InteractionModal
        interaction={activeInteraction}
        extraRevealed={extraRevealed}
        onTriggerExtra={() => {
          soundEngine.playMagicChime();
          setExtraRevealed(true);
          if (activeInteraction?.kind === 'elsa') {
            setElsaMagicActive(true);
          } else if (activeInteraction?.kind === 'anna') {
            setAnnaCelebrationActive(true);
          }
        }}
        onClose={() => {
          setActiveInteraction(null);
          setElsaMagicActive(false);
          setAnnaCelebrationActive(false);
        }}
      />
    </main>
  );
}

export default App;
