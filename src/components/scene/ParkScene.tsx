import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { birthdayConfig } from '../../config/birthdayConfig';
import type { ParkDestinationId } from '../ui/FloatingNav';
import { CameraRig } from './CameraRig';
import { FairytaleCastle } from './FairytaleCastle';
import { ParkGrounds } from './ParkGrounds';
import { WishingFountain } from './WishingFountain';
import { TulipWonderland } from './TulipWonderland';
import { ParkDecor } from './ParkDecor';
import { MagicalAtmosphere } from './MagicalAtmosphere';
import { DestinationMarker } from './DestinationMarker';

interface ParkSceneProps {
  activeDestination: ParkDestinationId;
  focusNonce: number;
  isIntro: boolean;
  onSelectDestination: (id: ParkDestinationId) => void;
  onSceneReady: () => void;
}

const LANDMARK_DESTINATIONS: ParkDestinationId[] = [
  'tulip-garden',
  'fantasyland',
  'memories',
  'surprises',
];

export function ParkScene({
  activeDestination,
  focusNonce,
  isIntro,
  onSelectDestination,
  onSceneReady,
}: ParkSceneProps) {
  return (
    <div className="h-full w-full touch-none">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{
          fov: 44,
          near: 0.5,
          far: 160,
          position: birthdayConfig.destinations.intro.cameraPosition,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={() => {
          // Small frame delay lets initial instanced matrices populate cleanly
          requestAnimationFrame(() => onSceneReady());
        }}
      >
        <color attach="background" args={['#F8EAF4']} />
        <fog attach="fog" args={['#F8EAF4', 44, 96]} />

        {/* Fairytale Warm Golden & Pastel Lighting */}
        <hemisphereLight args={['#C9E7FB', '#F3D6E4', 0.92]} />
        <ambientLight intensity={0.32} color="#FFF4E8" />
        <directionalLight
          position={[20, 28, 18]}
          intensity={1.55}
          color="#FFE6B8"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={5}
          shadow-camera-far={75}
          shadow-camera-left={-26}
          shadow-camera-right={26}
          shadow-camera-top={26}
          shadow-camera-bottom={-26}
          shadow-bias={-0.0005}
        />
        {/* Soft Lavender Rim Light from Behind Castle */}
        <directionalLight
          position={[-16, 12, -24]}
          intensity={0.55}
          color="#D5C2F7"
        />
        {/* Warm Glow at Castle Gate */}
        <pointLight position={[0, 3.2, -7.2]} intensity={2.2} distance={14} color="#FFD282" />

        <Suspense fallback={null}>
          <CameraRig
            destinationId={activeDestination}
            focusNonce={focusNonce}
            isIntro={isIntro}
          />

          <MagicalAtmosphere />
          <ParkGrounds />
          <WishingFountain />

          <FairytaleCastle
            onSelect={() => {
              if (!isIntro) onSelectDestination('fantasyland');
            }}
          />

          <TulipWonderland
            onSelect={() => {
              if (!isIntro) onSelectDestination('tulip-garden');
            }}
          />

          <ParkDecor
            onSelectMemories={() => {
              if (!isIntro) onSelectDestination('memories');
            }}
            onSelectSurprises={() => {
              if (!isIntro) onSelectDestination('surprises');
            }}
          />

          {!isIntro &&
            LANDMARK_DESTINATIONS.map((id) => (
              <DestinationMarker
                key={id}
                destination={birthdayConfig.destinations[id]}
                active={activeDestination === id}
                onSelect={() => onSelectDestination(id)}
              />
            ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
