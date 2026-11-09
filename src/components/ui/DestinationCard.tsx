import { RotateCcw, Sparkles, Compass, ArrowRight, Eye } from 'lucide-react';
import { birthdayConfig, type ParkDestinationId } from '../../config/birthdayConfig';

interface DestinationCardProps {
  visible: boolean;
  activeDestination: ParkDestinationId;
  isExploring: boolean;
  onEnterDestination: () => void;
  onResetCamera: () => void;
  onReturnToHub: () => void;
  onOpenMemories?: () => void;
  onOpenBouquet?: () => void;
}

export function DestinationCard({
  visible,
  activeDestination,
  isExploring,
  onEnterDestination,
  onResetCamera,
  onReturnToHub,
  onOpenMemories,
  onOpenBouquet,
}: DestinationCardProps) {
  if (!visible || activeDestination === 'intro') return null;

  const destination = birthdayConfig.destinations[activeDestination];

  return (
    <aside className="pointer-events-auto fixed top-15 right-3 left-3 z-20 sm:top-4 sm:right-4 sm:left-auto sm:w-80">
      <div className="storybook-panel rounded-2xl p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#3B2B4B]"
            style={{ backgroundColor: `${destination.accentColor}45` }}
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

        <h2 className="font-display mt-1.5 text-2xl font-bold leading-tight text-[#3B2B4B]">
          {destination.label}
        </h2>
        <p className="text-xs font-medium text-[#8D6EC2]">{destination.subtitle}</p>

        <p className="mt-2 hidden text-xs leading-relaxed text-[#55426B] sm:block">
          {destination.description}
        </p>

        <div className="mt-3 flex flex-col gap-2">
          {!isExploring ? (
            <button
              type="button"
              onClick={onEnterDestination}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#E2A84B]/70 bg-gradient-to-r from-[#FADAE6]/85 via-[#FFF4DE] to-[#E6DDF9]/85 px-3 py-2 text-xs font-semibold text-[#3B2B4B] shadow-sm transition hover:brightness-105"
            >
              <span>{destination.enterLabel}</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#6E5098]" />
            </button>
          ) : (
            <div className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D9CCF2] bg-white/65 px-3 py-1.5 text-[11px] font-medium text-[#5A4570]">
              <Eye className="h-3.5 w-3.5 text-[#8D6EC2]" />
              <span>Exploring inside — click objects &amp; characters!</span>
            </div>
          )}

          {activeDestination === 'tulip-garden' && onOpenBouquet && (
            <button
              type="button"
              onClick={onOpenBouquet}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#F59BB9]/60 bg-[#FDF0F5] px-3 py-1.5 text-xs font-semibold text-[#5A3555] transition hover:bg-white"
            >
              <span>Open Virtual Bouquet Builder</span>
            </button>
          )}

          {activeDestination === 'memories' && onOpenMemories && (
            <button
              type="button"
              onClick={onOpenMemories}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#9ED7F6]/70 bg-[#EFF8FF] px-3 py-1.5 text-xs font-semibold text-[#2E4F6B] transition hover:bg-white"
            >
              <span>Open Photo Gallery &amp; Letters</span>
            </button>
          )}

          {activeDestination !== 'hub' && (
            <button
              type="button"
              onClick={onReturnToHub}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#E2B362]/45 bg-[#FFF9F2]/85 px-3 py-1.5 text-xs font-semibold text-[#3B2B4B] transition hover:bg-white"
            >
              <Compass className="h-3.5 w-3.5 text-[#D99B38]" />
              <span>Return to Main Park</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
