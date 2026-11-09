import { Sparkles, Crown, ArrowRight } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import { formatOrdinal } from '../../utils/format';

interface IntroOverlayProps {
  visible: boolean;
  onEnterPark: () => void;
}

export function IntroOverlay({ visible, onEnterPark }: IntroOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-30 flex flex-col items-center justify-between px-4 py-6 transition-all duration-700 md:py-10 ${
        visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0 scale-105'
      }`}
      aria-hidden={!visible}
    >
      {/* Top Celebration Ribbon */}
      <div className="mt-1 flex items-center gap-2 rounded-full storybook-pill px-4 py-1.5 text-xs font-semibold tracking-widest text-[#6E5098] uppercase shadow-sm">
        <Crown className="h-3.5 w-3.5 text-[#E2A84B]" />
        <span>
          Celebrating {birthdayConfig.sisterName}&apos;s {formatOrdinal(birthdayConfig.age)}{' '}
          Birthday &middot; {birthdayConfig.birthdayDate}
        </span>
        <Sparkles className="h-3.5 w-3.5 text-[#E2A84B]" />
      </div>

      {/* Center spacer so the 3D castle spires & twinkling sky stay unobstructed */}
      <div className="flex-1" />

      {/* Bottom Storybook Entrance Card */}
      <div className="storybook-panel w-full max-w-xl rounded-[28px] px-6 py-6 text-center md:px-10 md:py-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-[#8D6EC2] uppercase">
          Welcome to a Fairytale Gift
        </p>

        <h1 className="font-display mt-1.5 text-4xl font-bold leading-tight text-[#3B2B4B] sm:text-5xl">
          {birthdayConfig.parkTitle}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#57436C] sm:text-[15px]">
          {birthdayConfig.heroTagline}. Step past the golden gates into sunlit tulip gardens,
          enchanted towers, and birthday magic made just for you.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onEnterPark}
            className="group relative inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-[#E2A84B]/80 bg-gradient-to-r from-[#FADAE6] via-[#FFF6E5] to-[#E6DDF9] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#3B2B4B] shadow-[0_10px_28px_rgba(141,110,194,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(226,168,75,0.32)] active:translate-y-0"
          >
            <Sparkles className="h-4 w-4 text-[#D99B38] transition-transform duration-300 group-hover:rotate-12" />
            <span>Enter the Wonderland</span>
            <ArrowRight className="h-4 w-4 text-[#6E5098] transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <p className="text-xs text-[#7D6696]">
            Drag to look around &middot; Scroll or pinch to zoom once inside
          </p>
        </div>
      </div>
    </div>
  );
}
