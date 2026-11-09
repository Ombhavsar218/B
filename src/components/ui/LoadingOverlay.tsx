import { Sparkles } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

interface LoadingOverlayProps {
  visible: boolean;
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#BCE3FA]/75 via-[#FFF9F2] to-[#FADAE6]/80 transition-opacity duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden={!visible}
    >
      <div className="storybook-panel flex flex-col items-center rounded-3xl px-8 py-7 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#E2B362]/50 bg-[#FFF9F2] shadow-sm animate-gentle-float">
          <Sparkles className="h-5 w-5 text-[#E2A84B]" />
        </div>
        <p className="font-display text-2xl font-semibold text-[#3B2B4B]">
          Preparing {birthdayConfig.sisterName}&apos;s Wonderland
        </p>
        <p className="mt-1 text-xs font-medium tracking-wider text-[#8D6EC2] uppercase">
          Opening the pastel gates...
        </p>
        <div className="mt-4 h-1.5 w-44 overflow-hidden rounded-full bg-[#D9CCF2]/50">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#F7C6D9] via-[#F6BE65] to-[#B89CEB]" />
        </div>
      </div>
    </div>
  );
}
