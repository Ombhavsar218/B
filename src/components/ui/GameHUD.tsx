import { useMemo } from 'react';
import {
  Compass,
  Eye,
  Gamepad2,
  Map as MapIcon,
  Pause,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { birthdayConfig, worldToMapPercent } from '../../config/birthdayConfig';
import type { PlayerHUDState } from '../scene/PlayerController';
import type { ParkInteractable } from '../../config/parkInteractables';

interface GameHUDProps {
  visible: boolean;
  hud: PlayerHUDState;
  exploredCount: number;
  totalKingdoms: number;
  viewMode: 'first' | 'third';
  muted: boolean;
  showHints: boolean;
  showTouchControls: boolean;
  welcomeToastVisible: boolean;
  onDismissHints: () => void;
  onOpenMap: () => void;
  onToggleView: () => void;
  onToggleMute: () => void;
  onToggleTouchControls: () => void;
  onOpenPause: () => void;
  onTriggerInteract: (item: ParkInteractable) => void;
}

const MINI_KINGDOM_PINS = [
  { id: 'frozen-kingdom', label: 'F', x: -46, z: -34, color: '#82D1F7' },
  { id: 'fantasyland', label: 'C', x: 0, z: -34, color: '#B89CEB' },
  { id: 'galaxy-kingdom', label: 'G', x: 46, z: -34, color: '#8B7AE8' },
  { id: 'tulip-garden', label: 'T', x: -46, z: 14, color: '#F59BB9' },
  { id: 'surprises', label: 'B', x: 48, z: -2, color: '#F6BE65' },
  { id: 'adventure-kingdom', label: 'A', x: 48, z: 28, color: '#67B77E' },
  { id: 'memories', label: 'M', x: 17, z: 22, color: '#72B7DF' },
];

function getCardinalInfo(yaw: number): { cardinal: string; deg: number } {
  // yaw = 0 faces -Z (North); +yaw rotates left toward -X (West)
  const rawDeg = ((-yaw * 180) / Math.PI) % 360;
  const heading = (rawDeg + 360) % 360;
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(heading / 45) % 8;
  return { cardinal: dirs[idx], deg: Math.round(heading) };
}

export function GameHUD({
  visible,
  hud,
  exploredCount,
  totalKingdoms,
  viewMode,
  muted,
  showHints,
  showTouchControls,
  welcomeToastVisible,
  onDismissHints,
  onOpenMap,
  onToggleView,
  onToggleMute,
  onToggleTouchControls,
  onOpenPause,
  onTriggerInteract,
}: GameHUDProps) {
  const { cardinal, deg } = useMemo(() => getCardinalInfo(hud.yaw), [hud.yaw]);
  const playerPct = useMemo(() => worldToMapPercent(hud.x, hud.z), [hud.x, hud.z]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-2.5 sm:p-4">
      {/* Top Bar: Location Pill | Compass | Mini-Map & Compact Actions */}
      <div className="flex items-start justify-between gap-2">
        {/* Top-Left: Current Zone Pill */}
        <div className="pointer-events-auto flex flex-col gap-1.5">
          <div className="storybook-pill flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm">
            <Compass className="h-3.5 w-3.5 shrink-0 text-[#C8842B]" />
            <span className="max-w-[140px] truncate text-xs font-bold text-[#3B2B4B] sm:max-w-[220px]">
              {hud.zoneName}
            </span>
            <span className="hidden rounded-full bg-[#3B2B4B]/10 px-2 py-0.5 text-[10px] font-semibold text-[#5E467D] sm:inline-block">
              {exploredCount}/{totalKingdoms} Realms
            </span>
          </div>

          {/* Dismissible Compact Control Hint (doesn't clutter the world) */}
          {showHints && (
            <div className="storybook-pill flex max-w-[280px] items-center gap-2 rounded-2xl px-3 py-1.5 text-[10px] font-medium text-[#4E3A63] shadow-sm sm:max-w-md sm:text-[11px]">
              <span className="leading-snug">
                {showTouchControls
                  ? 'Left Stick Walk · Drag Sky/Right Side to Look · Tap Prompt to Interact'
                  : 'WASD Walk · Click Sky & Move Mouse Look · Shift Sprint · Space Jump · E Interact'}
              </span>
              <button
                type="button"
                onClick={onDismissHints}
                className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#3B2B4B]/10 text-[#3B2B4B] hover:bg-[#3B2B4B]/20"
                aria-label="Hide control hints"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Top-Center: Sleek Compass Heading Pill (hidden on tiny portrait widths) */}
        <div className="storybook-pill hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-[#3B2B4B] md:flex">
          <span className="inline-block h-2 w-2 rounded-full bg-[#E2A84B]" />
          <span className="w-6 text-center font-bold text-[#7A549F]">{cardinal}</span>
          <span className="text-[#8E77A8]">{deg}&deg;</span>
          <span className="text-[#5C4678]">· {birthdayConfig.sisterName}&apos;s Park</span>
        </div>

        {/* Top-Right: Live Mini-Map + Action Icons */}
        <div className="pointer-events-auto flex items-start gap-2">
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={onOpenMap}
              title="Open Park Map (M)"
              aria-label="Open Park Map"
              className="storybook-pill flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold text-[#3B2B4B] transition hover:bg-white"
            >
              <MapIcon className="h-3.5 w-3.5 text-[#C8842B]" />
              <span className="hidden sm:inline">Map</span>
            </button>

            <button
              type="button"
              onClick={onToggleView}
              title="Switch First / Third Person (V)"
              aria-label="Toggle camera perspective"
              className="storybook-pill flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#3B2B4B] transition hover:bg-white"
            >
              <Eye className="h-3.5 w-3.5 text-[#6E5098]" />
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              title={muted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
              className="storybook-pill flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#3B2B4B] transition hover:bg-white"
            >
              {muted ? (
                <VolumeX className="h-3.5 w-3.5 text-[#9F5C76]" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#5E4287]" />
              )}
            </button>

            <button
              type="button"
              onClick={onToggleTouchControls}
              title="Toggle On-Screen Touch Pad"
              aria-label="Toggle touch controls"
              className={`storybook-pill flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-white sm:hidden ${
                showTouchControls ? 'ring-2 ring-[#E2A84B]' : ''
              }`}
            >
              <Gamepad2 className="h-3.5 w-3.5 text-[#5E4287]" />
            </button>

            <button
              type="button"
              onClick={onOpenPause}
              title="Pause & Settings (Esc)"
              aria-label="Pause and Settings"
              className="storybook-pill flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#3B2B4B] transition hover:bg-white"
            >
              <Pause className="h-3.5 w-3.5 text-[#3B2B4B]" />
            </button>
          </div>

          {/* Clickable Live Mini-Map */}
          <button
            type="button"
            onClick={onOpenMap}
            title="Click to Expand Full Park Map"
            aria-label="Mini-map"
            className="storybook-panel relative hidden h-24 w-28 cursor-pointer overflow-hidden rounded-2xl p-1 transition hover:scale-105 sm:block"
          >
            <div className="relative h-full w-full rounded-xl bg-gradient-to-b from-[#CCEAFD] to-[#E6F4DF]">
              {/* Canal circle */}
              <div
                style={{ left: '50%', top: '54%', width: '25%', height: '31.7%' }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#7FD4FA]/85"
              />
              {MINI_KINGDOM_PINS.map((pin) => {
                const pos = worldToMapPercent(pin.x, pin.z);
                return (
                  <span
                    key={pin.id}
                    style={{
                      left: `${pos.left}%`,
                      top: `${pos.top}%`,
                      backgroundColor: pin.color,
                    }}
                    className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow-xs"
                  />
                );
              })}
              {/* Player marker + view orientation */}
              <span
                style={{
                  left: `${playerPct.left}%`,
                  top: `${playerPct.top}%`,
                  transform: `translate(-50%, -50%) rotate(${-hud.yaw}rad)`,
                }}
                className="absolute flex h-3 w-3 items-center justify-center"
              >
                <span className="h-2.5 w-2.5 rounded-full border border-white bg-[#D95B86] shadow" />
                <span className="absolute -top-1.5 h-1.5 w-0.5 bg-[#3B2B4B]" />
              </span>
            </div>
            <span className="pointer-events-none absolute right-1.5 bottom-1 rounded bg-[#3B2B4B]/75 px-1 text-[8px] font-bold text-white uppercase">
              {viewMode === 'first' ? '1st' : '3rd'}
            </span>
          </button>
        </div>
      </div>

      {/* Subtle Center Aim Reticle (Desktop 1st-person) */}
      {!showTouchControls && (
        <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-1.5 w-1.5 rounded-full border border-[#3B2B4B]/55 bg-white/80 shadow-xs" />
        </div>
      )}

      {/* Transient Welcome Toast Upon Entering Gates */}
      {welcomeToastVisible && (
        <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2">
          <div className="storybook-panel flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-[#3B2B4B] shadow-md sm:text-sm">
            <Sparkles className="h-4 w-4 text-[#D99B38]" />
            <span>Welcome inside Wonderland! Walk forward along the Royal Promenade.</span>
          </div>
        </div>
      )}

      {/* Bottom-Center: Context-Sensitive Proximity Interaction Hint */}
      <div
        className={`flex justify-center ${
          showTouchControls ? 'mb-28 sm:mb-24' : 'mb-1 sm:mb-2'
        }`}
      >
        {hud.nearbyInteractable && (
          <button
            type="button"
            onClick={() => onTriggerInteract(hud.nearbyInteractable!)}
            className="pointer-events-auto flex cursor-pointer items-center gap-2.5 rounded-full border border-[#E2A84B] bg-gradient-to-r from-[#FFF9F2]/95 via-[#FFF2DC]/95 to-[#FCE5EF]/95 px-4 py-2 text-xs font-bold text-[#3B2B4B] shadow-[0_10px_26px_rgba(72,48,98,0.2)] transition hover:scale-105 active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <span className="hidden rounded-md bg-[#3B2B4B] px-1.5 py-0.5 text-[10px] font-extrabold text-[#FFF9F2] sm:inline-block">
              E
            </span>
            <Sparkles className="h-4 w-4 text-[#D99B38]" />
            <span>{hud.nearbyInteractable.actionPrompt}</span>
          </button>
        )}
      </div>
    </div>
  );
}
