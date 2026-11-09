import { X, Compass, Castle, Flower2, Heart, Gift, Sparkles } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import type { ParkDestinationId } from './FloatingNav';

interface ParkMapModalProps {
  open: boolean;
  activeDestination: ParkDestinationId;
  onClose: () => void;
  onSelectDestination: (id: ParkDestinationId) => void;
}

const MAP_NODES: Array<{
  id: ParkDestinationId;
  xPercent: number;
  yPercent: number;
  icon: typeof Castle;
}> = [
  { id: 'fantasyland', xPercent: 50, yPercent: 22, icon: Castle },
  { id: 'surprises', xPercent: 77, yPercent: 31, icon: Gift },
  { id: 'tulip-garden', xPercent: 22, yPercent: 53, icon: Flower2 },
  { id: 'hub', xPercent: 50, yPercent: 55, icon: Compass },
  { id: 'memories', xPercent: 78, yPercent: 57, icon: Heart },
  { id: 'intro', xPercent: 50, yPercent: 84, icon: Sparkles },
];

export function ParkMapModal({
  open,
  activeDestination,
  onClose,
  onSelectDestination,
}: ParkMapModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#3B2B4B]/28 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Wonderland Park Map"
      onClick={onClose}
    >
      <div
        className="storybook-panel relative w-full max-w-2xl overflow-hidden rounded-[28px] p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8D6EC2] uppercase">
              Wonderland Cartography
            </p>
            <h2 className="font-display text-3xl font-bold text-[#3B2B4B]">
              Interactive Park Map
            </h2>
            <p className="mt-0.5 text-xs text-[#614D77]">
              Choose any destination pin to glide smoothly through the 3D park.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E2B362]/45 bg-white/75 text-[#3B2B4B] transition hover:bg-white"
            aria-label="Close park map"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Illustrated Interactive Park Map Canvas */}
        <div className="relative mt-5 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#E2B362]/40 bg-gradient-to-br from-[#BCE3FA]/55 via-[#FFF9F2] to-[#FADAE6]/55 shadow-inner">
          {/* Stylized Island & Pathways SVG */}
          <svg
            viewBox="0 0 800 500"
            className="h-full w-full"
            aria-hidden="true"
          >
            {/* Soft meadow island */}
            <ellipse
              cx="400"
              cy="255"
              rx="320"
              ry="205"
              fill="#DDF2DF"
              stroke="#E6C587"
              strokeWidth="4"
            />
            <ellipse
              cx="400"
              cy="255"
              rx="290"
              ry="180"
              fill="#E9F7E9"
              opacity="0.7"
            />

            {/* Connecting pathways */}
            <path
              d="M400 420 L400 115"
              stroke="#FDF3E7"
              strokeWidth="22"
              strokeLinecap="round"
            />
            <path
              d="M180 265 Q290 250 400 275 Q515 295 620 285"
              fill="none"
              stroke="#FDF3E7"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M400 250 Q510 185 615 155"
              fill="none"
              stroke="#FDF3E7"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Central plaza ring */}
            <circle
              cx="400"
              cy="275"
              r="52"
              fill="#FFF9F2"
              stroke="#E2B362"
              strokeWidth="3"
            />
            <circle cx="400" cy="275" r="22" fill="#BCE3FA" opacity="0.8" />

            {/* Tulip garden zone blush */}
            <ellipse cx="176" cy="265" rx="76" ry="56" fill="#FADAE6" opacity="0.65" />
            {/* Fantasyland castle halo */}
            <ellipse cx="400" cy="112" rx="88" ry="48" fill="#D9CCF2" opacity="0.55" />
            {/* Memories gazebo halo */}
            <circle cx="624" cy="285" r="46" fill="#BCE3FA" opacity="0.45" />
            {/* Surprises lawn halo */}
            <circle cx="615" cy="155" r="46" fill="#FFD98E" opacity="0.45" />
          </svg>

          {/* Interactive Pin Buttons */}
          {MAP_NODES.map((node) => {
            const dest = birthdayConfig.destinations[node.id];
            const Icon = node.icon;
            const isSelected = activeDestination === node.id;

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  onSelectDestination(node.id);
                  onClose();
                }}
                style={{
                  left: `${node.xPercent}%`,
                  top: `${node.yPercent}%`,
                }}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center transition-transform duration-200 hover:scale-105 ${
                  isSelected ? 'z-10 scale-105' : ''
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-md transition-all sm:h-11 sm:w-11 ${
                    isSelected
                      ? 'border-[#C8842B] bg-gradient-to-br from-[#FFF9F2] to-[#FADAE6] ring-4 ring-[#F6BE65]/35'
                      : 'border-white bg-[#FFF9F2]/95 group-hover:border-[#E2B362]'
                  }`}
                >
                  <Icon className="h-4 w-4 text-[#6E5098] sm:h-5 sm:w-5" />
                </span>
                <span
                  className={`mt-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold shadow-sm ${
                    isSelected
                      ? 'bg-[#3B2B4B] text-[#FFF9F2]'
                      : 'bg-[#FFF9F2]/95 text-[#3B2B4B] border border-[#E2B362]/40'
                  }`}
                >
                  {dest.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer quick actions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6E5098]">
          <span>Click any landmark pin to travel there instantly.</span>
          <button
            type="button"
            onClick={() => {
              onSelectDestination('hub');
              onClose();
            }}
            className="cursor-pointer rounded-full border border-[#E2B362]/50 bg-[#FFF9F2] px-3.5 py-1.5 font-semibold text-[#3B2B4B] transition hover:bg-[#FDF0F5]"
          >
            Reset to Park Overview
          </button>
        </div>
      </div>
    </div>
  );
}
