import { Compass, Eye, Gamepad2, Map as MapIcon, Music, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

interface PauseMenuModalProps {
  open: boolean;
  viewMode: 'first' | 'third';
  sensitivity: number;
  volume: number;
  muted: boolean;
  musicEnabled: boolean;
  showHints: boolean;
  showTouchControls: boolean;
  onResume: () => void;
  onOpenMap: () => void;
  onReturnToGates: () => void;
  onToggleView: () => void;
  onChangeSensitivity: (val: number) => void;
  onChangeVolume: (val: number) => void;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onToggleHints: () => void;
  onToggleTouchControls: () => void;
}

export function PauseMenuModal({
  open,
  viewMode,
  sensitivity,
  volume,
  muted,
  musicEnabled,
  showHints,
  showTouchControls,
  onResume,
  onOpenMap,
  onReturnToGates,
  onToggleView,
  onChangeSensitivity,
  onChangeVolume,
  onToggleMute,
  onToggleMusic,
  onToggleHints,
  onToggleTouchControls,
}: PauseMenuModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#2D1F3F]/45 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Wonderland Pause and Settings"
      onClick={onResume}
    >
      <div
        className="storybook-panel relative w-full max-w-md rounded-[26px] p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onResume}
          className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E2B362]/45 bg-white/80 text-[#3B2B4B] hover:bg-white"
          aria-label="Resume exploring"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-[10px] font-semibold tracking-[0.22em] text-[#8D6EC2] uppercase">
          Wonderland Explorer Menu
        </p>
        <h2 className="font-display mt-0.5 text-3xl font-bold text-[#3B2B4B]">
          {birthdayConfig.parkTitle}
        </h2>

        {/* Primary Resume & Quick Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onResume}
            className="col-span-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E2A84B] bg-gradient-to-r from-[#FADAE6] via-[#FFF6E5] to-[#E6DDF9] px-4 py-2.5 text-sm font-bold text-[#3B2B4B] shadow-sm hover:brightness-105"
          >
            <Play className="h-4 w-4 text-[#C8842B]" />
            <span>Resume Walking</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onResume();
              onOpenMap();
            }}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#E2B362]/50 bg-white/80 px-3 py-2 text-xs font-semibold text-[#3B2B4B] hover:bg-white"
          >
            <MapIcon className="h-3.5 w-3.5 text-[#8D6EC2]" />
            <span>Park Map (M)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onReturnToGates();
              onResume();
            }}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#E2B362]/50 bg-white/80 px-3 py-2 text-xs font-semibold text-[#3B2B4B] hover:bg-white"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#C8842B]" />
            <span>Entrance Gates</span>
          </button>
        </div>

        {/* Settings */}
        <div className="mt-4 space-y-3 rounded-2xl border border-white/80 bg-white/65 p-3.5 text-xs text-[#3B2B4B]">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Eye className="h-3.5 w-3.5 text-[#6E5098]" /> Camera View (V)
            </span>
            <button
              type="button"
              onClick={onToggleView}
              className="cursor-pointer rounded-full border border-[#E2B362]/60 bg-[#FFF9F2] px-3 py-1 text-[11px] font-bold"
            >
              {viewMode === 'first' ? 'First-Person' : 'Third-Person'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Gamepad2 className="h-3.5 w-3.5 text-[#6E5098]" /> On-Screen Touch Pad
            </span>
            <button
              type="button"
              onClick={onToggleTouchControls}
              className="cursor-pointer rounded-full border border-[#E2B362]/60 bg-[#FFF9F2] px-3 py-1 text-[11px] font-bold"
            >
              {showTouchControls ? 'Shown' : 'Hidden'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Compass className="h-3.5 w-3.5 text-[#6E5098]" /> Control Hints
            </span>
            <button
              type="button"
              onClick={onToggleHints}
              className="cursor-pointer rounded-full border border-[#E2B362]/60 bg-[#FFF9F2] px-3 py-1 text-[11px] font-bold"
            >
              {showHints ? 'On' : 'Off'}
            </button>
          </div>

          <div>
            <div className="mb-1 flex justify-between font-semibold">
              <span>Look Sensitivity</span>
              <span>{sensitivity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.4}
              max={2.2}
              step={0.1}
              value={sensitivity}
              onChange={(e) => onChangeSensitivity(Number(e.target.value))}
              className="w-full accent-[#8D6EC2]"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between font-semibold">
              <span className="inline-flex items-center gap-1.5">
                {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                Park Sound &amp; Ambient
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onToggleMusic}
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    musicEnabled ? 'bg-[#E6DDF9] text-[#3B2B4B]' : 'bg-white text-[#8E77A8]'
                  }`}
                >
                  <Music className="h-3 w-3" /> {musicEnabled ? 'Music On' : 'Music Off'}
                </button>
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="cursor-pointer rounded-full bg-[#3B2B4B] px-2 py-0.5 text-[10px] font-bold text-white"
                >
                  {muted ? 'Unmute' : 'Mute'}
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => onChangeVolume(Number(e.target.value))}
              className="w-full accent-[#E2A84B]"
            />
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] text-[#6B5484]">
          Desktop: WASD Move · Mouse Look · Shift Sprint · Space Jump · E Interact · M Map
        </p>
      </div>
    </div>
  );
}
