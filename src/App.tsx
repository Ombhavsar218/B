import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react';
import { birthdayConfig } from './config/birthdayConfig';
import { isWebGLAvailable } from './utils/webgl';
import { WebGLFallback } from './components/ui/WebGLFallback';
import { LoadingOverlay } from './components/ui/LoadingOverlay';
import { IntroOverlay } from './components/ui/IntroOverlay';
import { FloatingNav, type ParkDestinationId } from './components/ui/FloatingNav';
import { ParkMapModal } from './components/ui/ParkMapModal';
import { DestinationCard } from './components/ui/DestinationCard';

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

export function App() {
  const [webglSupported] = useState(() => isWebGLAvailable());
  const [sceneReady, setSceneReady] = useState(false);
  const [activeDestination, setActiveDestination] = useState<ParkDestinationId>('intro');
  const [focusNonce, setFocusNonce] = useState(0);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    document.title = birthdayConfig.parkTitle;
  }, []);

  const handleSelectDestination = useCallback((id: ParkDestinationId) => {
    setIsMapOpen(false);
    setActiveDestination(id);
    setFocusNonce((n) => n + 1);
  }, []);

  const handleEnterPark = useCallback(() => {
    handleSelectDestination('hub');
  }, [handleSelectDestination]);

  const handleResetCamera = useCallback(() => {
    setFocusNonce((n) => n + 1);
  }, []);

  if (!webglSupported) {
    return <WebGLFallback />;
  }

  const isIntro = activeDestination === 'intro';

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-[#BCE3FA]/50 via-[#FFF9F2] to-[#FADAE6]/50">
      <SceneErrorBoundary>
        <Suspense fallback={<LoadingOverlay visible={true} />}>
          <LazyParkScene
            activeDestination={activeDestination}
            focusNonce={focusNonce}
            isIntro={isIntro}
            onSelectDestination={handleSelectDestination}
            onSceneReady={() => setSceneReady(true)}
          />
        </Suspense>
      </SceneErrorBoundary>

      <LoadingOverlay visible={!sceneReady} />

      <IntroOverlay visible={sceneReady && isIntro} onEnterPark={handleEnterPark} />

      <FloatingNav
        visible={sceneReady && !isIntro}
        activeDestination={activeDestination}
        isMapOpen={isMapOpen}
        onSelectDestination={handleSelectDestination}
        onToggleMap={() => setIsMapOpen((prev) => !prev)}
      />

      <DestinationCard
        visible={sceneReady && !isIntro && !isMapOpen}
        activeDestination={activeDestination}
        onResetCamera={handleResetCamera}
        onReturnToHub={() => handleSelectDestination('hub')}
      />

      <ParkMapModal
        open={isMapOpen}
        activeDestination={activeDestination}
        onClose={() => setIsMapOpen(false)}
        onSelectDestination={handleSelectDestination}
      />
    </main>
  );
}

export default App;
