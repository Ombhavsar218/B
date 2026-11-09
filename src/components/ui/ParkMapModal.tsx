import { useRef, useState } from 'react';
import {
  X,
  Compass,
  Castle,
  Flower2,
  Heart,
  Cake,
  Sparkles,
  Snowflake,
  Palmtree,
  Orbit,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  MapPin,
  Navigation,
} from 'lucide-react';
import {
  birthdayConfig,
  worldToMapPercent,
  type ParkDestinationId,
} from '../../config/birthdayConfig';

interface ParkMapModalProps {
  open: boolean;
  activeDestination: ParkDestinationId;
  exploredDestinations: ParkDestinationId[];
  playerPosition?: { x: number; z: number; yaw: number };
  onClose: () => void;
  onSelectDestination: (id: ParkDestinationId) => void;
}

const DESTINATION_ICONS: Record<ParkDestinationId, typeof Castle> = {
  intro: Sparkles,
  hub: Compass,
  fantasyland: Castle,
  'frozen-kingdom': Snowflake,
  'tulip-garden': Flower2,
  'adventure-kingdom': Palmtree,
  'galaxy-kingdom': Orbit,
  surprises: Cake,
  memories: Heart,
};

const ALL_MAP_DESTINATIONS: ParkDestinationId[] = [
  'frozen-kingdom',
  'fantasyland',
  'galaxy-kingdom',
  'tulip-garden',
  'hub',
  'surprises',
  'memories',
  'adventure-kingdom',
  'intro',
];

export function ParkMapModal({
  open,
  activeDestination,
  exploredDestinations,
  playerPosition,
  onClose,
  onSelectDestination,
}: ParkMapModalProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragState = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    origPanX: number;
    origPanY: number;
    moved: boolean;
  }>({ active: false, startX: 0, startY: 0, origPanX: 0, origPanY: 0, moved: false });

  if (!open) return null;

  const kingdomIds = ALL_MAP_DESTINATIONS.filter(
    (id) => birthdayConfig.destinations[id].isKingdom
  );
  const exploredKingdomCount = kingdomIds.filter((id) =>
    exploredDestinations.includes(id)
  ).length;

  const playerPct = playerPosition
    ? worldToMapPercent(playerPosition.x, playerPosition.z)
    : null;

  const clampPan = (nx: number, ny: number, z: number) => {
    const limitX = 280 * z;
    const limitY = 200 * z;
    return {
      x: Math.max(-limitX, Math.min(limitX, nx)),
      y: Math.max(-limitY, Math.min(limitY, ny)),
    };
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.max(0.85, Math.min(2.4, Number((prev + delta).toFixed(2))));
      setPan((p) => clampPan(p.x, p.y, next));
      return next;
    });
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col bg-[#2D1F3F]/45 p-2 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Full-Screen Wonderland Park Map"
    >
      <div className="storybook-panel flex h-full w-full flex-col overflow-hidden rounded-[26px] p-3.5 sm:p-5">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2B362]/30 pb-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] text-[#8D6EC2] uppercase sm:text-[11px]">
              Six-Kingdom Interactive Cartography &middot; Tap Any Kingdom To Fast-Travel
            </p>
            <h2 className="font-display text-2xl font-bold text-[#3B2B4B] sm:text-3xl">
              {birthdayConfig.parkTitle} — Park Map
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E2B362]/45 bg-[#FFF9F2] px-3 py-1.5 text-xs font-semibold text-[#4E3A63]">
              <Sparkles className="h-3.5 w-3.5 text-[#D99B38]" />
              <span>
                {exploredKingdomCount} / {kingdomIds.length} Kingdoms Explored
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectDestination('hub');
                onClose();
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E2B362]/65 bg-gradient-to-r from-[#FADAE6]/80 to-[#FFF3DF] px-3.5 py-1.5 text-xs font-semibold text-[#3B2B4B] shadow-sm transition hover:brightness-105"
            >
              <Compass className="h-3.5 w-3.5 text-[#C8842B]" />
              <span>Walk Wishing Plaza</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E2B362]/45 bg-white/80 text-[#3B2B4B] transition hover:bg-white"
              aria-label="Close park map"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Interactive Zoom/Pan Map Viewport */}
        <div
          className="relative mt-3 flex-1 overflow-hidden rounded-2xl border border-[#E2B362]/45 bg-gradient-to-b from-[#B9E2FA]/70 via-[#E7F4FA]/65 to-[#FADAE6]/55 shadow-inner select-none cursor-grab active:cursor-grabbing"
          onWheel={(e) => {
            e.preventDefault();
            handleZoom(e.deltaY < 0 ? 0.18 : -0.18);
          }}
          onPointerDown={(e) => {
            dragState.current = {
              active: true,
              startX: e.clientX,
              startY: e.clientY,
              origPanX: pan.x,
              origPanY: pan.y,
              moved: false,
            };
          }}
          onPointerMove={(e) => {
            if (!dragState.current.active) return;
            const dx = e.clientX - dragState.current.startX;
            const dy = e.clientY - dragState.current.startY;
            if (Math.hypot(dx, dy) > 5) {
              dragState.current.moved = true;
            }
            setPan(clampPan(dragState.current.origPanX + dx, dragState.current.origPanY + dy, zoom));
          }}
          onPointerUp={() => {
            dragState.current.active = false;
          }}
          onPointerLeave={() => {
            dragState.current.active = false;
          }}
        >
          {/* Zoom Controls Overlay */}
          <div
            className="pointer-events-auto absolute top-3 right-3 z-20 flex flex-col gap-1.5"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => handleZoom(0.25)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#E2B362]/45 bg-[#FFF9F2]/95 text-[#3B2B4B] shadow-sm transition hover:bg-white"
              aria-label="Zoom in map"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(-0.25)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#E2B362]/45 bg-[#FFF9F2]/95 text-[#3B2B4B] shadow-sm transition hover:bg-white"
              aria-label="Zoom out map"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={resetView}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#E2B362]/45 bg-[#FFF9F2]/95 text-[#3B2B4B] shadow-sm transition hover:bg-white"
              aria-label="Reset map view"
              title="Reset view"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Legend Badge */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-20 hidden items-center gap-3 rounded-full border border-[#E2B362]/45 bg-[#FFF9F2]/90 px-3.5 py-1.5 text-[11px] font-medium text-[#4B3860] shadow-sm sm:flex">
            <span className="inline-flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5 text-[#D95B86]" /> Your Explorer Position
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#D99B38]" /> Current Zone
            </span>
            <span className="inline-flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-[#4A9E68]" /> Visited
            </span>
          </div>

          {/* Scaled Map Plane Matching Exact 3D World Coordinates */}
          <div className="flex h-full w-full items-center justify-center">
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
              className="relative aspect-[1600/1260] h-full max-h-full w-auto max-w-full transition-transform duration-100 ease-out"
            >
              <svg viewBox="0 0 1600 1260" className="h-full w-full" aria-hidden="true">
                <ellipse
                  cx="800"
                  cy="660"
                  rx="760"
                  ry="565"
                  fill="#CBEBCB"
                  stroke="#E5C58A"
                  strokeWidth="8"
                />
                <ellipse cx="330" cy="360" rx="240" ry="200" fill="#E3F4FF" stroke="#B7DDF5" strokeWidth="4" />
                <ellipse cx="390" cy="450" rx="95" ry="55" fill="#99DEF9" opacity="0.7" />
                <ellipse cx="800" cy="350" rx="200" ry="165" fill="#EDE2FA" stroke="#D1BFEF" strokeWidth="4" />
                <ellipse cx="1260" cy="360" rx="235" ry="195" fill="#312456" opacity="0.88" stroke="#9B8AE6" strokeWidth="4" />
                <ellipse cx="340" cy="840" rx="235" ry="190" fill="#FCE2EC" stroke="#F4B7CE" strokeWidth="4" />
                <ellipse cx="445" cy="925" rx="78" ry="48" fill="#9FDDFB" opacity="0.75" />
                <ellipse cx="1280" cy="680" rx="205" ry="140" fill="#FFF1DA" stroke="#F5C97B" strokeWidth="4" />
                <ellipse cx="1270" cy="960" rx="220" ry="165" fill="#BFE8C3" stroke="#7FC48C" strokeWidth="4" />
                <path
                  d="M1140 980 Q1260 950 1380 1010"
                  fill="none"
                  stroke="#7AD3EE"
                  strokeWidth="26"
                  strokeLinecap="round"
                />
                <circle cx="970" cy="920" r="90" fill="#E5F4FD" stroke="#A6D9F5" strokeWidth="3" />
                <circle cx="800" cy="680" r="200" fill="none" stroke="#9ADAF7" strokeWidth="44" opacity="0.85" />
                <path d="M800 1080 L800 760" stroke="#FFF8EF" strokeWidth="38" strokeLinecap="round" />
                <path d="M800 690 L800 410" stroke="#FFF8EF" strokeWidth="34" strokeLinecap="round" />
                <path d="M740 725 Q620 620 480 500 T355 390" fill="none" stroke="#F3F8FF" strokeWidth="26" strokeLinecap="round" />
                <path d="M725 765 Q590 805 460 830 L355 840" fill="none" stroke="#FDF0F5" strokeWidth="28" strokeLinecap="round" />
                <path d="M860 725 Q980 620 1120 490 L1255 365" fill="none" stroke="#EDE9FD" strokeWidth="26" strokeLinecap="round" />
                <path d="M875 755 Q1020 725 1150 700 L1275 680" fill="none" stroke="#FFF5E6" strokeWidth="28" strokeLinecap="round" />
                <path d="M858 805 L970 920 Q1120 950 1275 975" fill="none" stroke="#F9F0E6" strokeWidth="26" strokeLinecap="round" />
                <circle cx="800" cy="760" r="78" fill="#FFF9F2" stroke="#E2B362" strokeWidth="5" />
                <circle cx="800" cy="760" r="28" fill="#9EDDFB" />
              </svg>

              {/* Clickable Kingdom & Destination Pins */}
              {ALL_MAP_DESTINATIONS.map((id) => {
                const dest = birthdayConfig.destinations[id];
                const { left, top } = worldToMapPercent(dest.worldPosition[0], dest.worldPosition[1]);
                const Icon = DESTINATION_ICONS[id];
                const isCurrent = activeDestination === id;
                const isExplored = exploredDestinations.includes(id);

                return (
                  <button
                    key={id}
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (dragState.current.moved) return;
                      onSelectDestination(id);
                      onClose();
                    }}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center transition-transform duration-150 hover:scale-110 ${
                      isCurrent ? 'z-20 scale-110' : 'z-10'
                    }`}
                  >
                    <div className="relative">
                      <span
                        className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-md transition-all sm:h-11 sm:w-11 ${
                          isCurrent
                            ? 'border-[#C8842B] bg-gradient-to-br from-[#FFF9F2] to-[#FADAE6] ring-4 ring-[#F6BE65]/45'
                            : 'border-white bg-[#FFF9F2]/95 group-hover:border-[#E2B362]'
                        }`}
                      >
                        <Icon className="h-4 w-4 text-[#5E4287] sm:h-5 sm:w-5" />
                      </span>

                      {isExplored && !isCurrent && (
                        <span
                          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-[#67B77E] text-white shadow"
                          title="Explored"
                        >
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <span
                      className={`mt-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-semibold shadow-sm sm:text-[11px] ${
                        isCurrent
                          ? 'bg-[#3B2B4B] text-[#FFF9F2]'
                          : 'border border-[#E2B362]/45 bg-[#FFF9F2]/95 text-[#3B2B4B]'
                      }`}
                    >
                      {dest.label}
                    </span>
                  </button>
                );
              })}

              {/* Live Explorer Arrow Marker */}
              {playerPct && (
                <div
                  style={{
                    left: `${playerPct.left}%`,
                    top: `${playerPct.top}%`,
                  }}
                  className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                >
                  <div
                    style={{ transform: `rotate(${-(playerPosition?.yaw || 0)}rad)` }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#D95B86] text-white shadow-lg"
                  >
                    <Navigation className="h-3.5 w-3.5 fill-white" />
                  </div>
                  <span className="mt-0.5 rounded-full bg-[#D95B86] px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase shadow">
                    You
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Quick-Jump Kingdom Strip */}
        <div className="no-scrollbar mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {ALL_MAP_DESTINATIONS.map((id) => {
            const dest = birthdayConfig.destinations[id];
            const Icon = DESTINATION_ICONS[id];
            const isCurrent = activeDestination === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onSelectDestination(id);
                  onClose();
                }}
                className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isCurrent
                    ? 'border-[#C8842B] bg-[#3B2B4B] text-[#FFF9F2]'
                    : 'border-[#E2B362]/40 bg-white/80 text-[#4B3860] hover:bg-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{id === 'intro' ? 'Main Gates' : dest.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
