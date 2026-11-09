import { RotateCcw, Sparkles, Compass } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import type { ParkDestinationId } from './FloatingNav';

interface DestinationCardProps {
  visible: boolean;
  activeDestination: ParkDestinationId;
  onResetCamera: () => void;
  onReturnToHub: () => void;
}

export function DestinationCard({
  visible,
  activeDestination,
  onResetCamera,
  onReturnToHub,
}: DestinationCardProps) {
  if (!visible || activeDestination === 'intro') return null;

  const destination = birthdayConfig.destinations[activeDestination];

  return (
    <aside className="pointer-events-auto fixed top-4 right-4 z-20 w-[calc(100%-2rem)] max-w-xs sm:w-80">
      <div className="storybook-panel rounded-2xl p-4">
        <div className="flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#3B2B4B]"
            style={{ backgroundColor: `${destination.accentColor}40` }}
          >
            <Sparkles className="h-3 w-3 text-[#C8842B]" />
            <span>{destination.badgeText}</span>
          </span>

          <button
            type="button"
            onClick={onResetCamera}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#E2B362]/40 bg-white/75 px-2.5 py-1 text-[11px] font-medium text-[#5A4570] transition hover:bg-white hover:text-[#3B2B4B]"
            title="Refocus camera on this destination"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Refocus</span>
          </button>
        </div>

        <h2 className="font-display mt-2 text-2xl font-bold leading-tight text-[#3B2B4B]">
          {destination.label}
        </h2>
        <p className="text-xs font-medium text-[#8D6EC2]">{destination.subtitle}</p>

        <p className="mt-2 hidden text-xs leading-relaxed text-[#55426B] sm:block">
          {destination.description}
        </p>

        {activeDestination !== 'hub' && (
          <button
            type="button"
            onClick={onReturnToHub}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#E2B362]/45 bg-[#FFF9F2]/85 px-3 py-1.5 text-xs font-semibold text-[#3B2B4B] transition hover:bg-white"
          >
            <Compass className="h-3.5 w-3.5 text-[#D99B38]" />
            <span>Return to Main Plaza</span>
          </button>
        )}
      </div>
    </aside>
  );
}
