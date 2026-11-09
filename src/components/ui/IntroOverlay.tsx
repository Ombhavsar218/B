import { Sparkles, Crown, ArrowRight, Keyboard, Gamepad2 } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import { formatOrdinal } from '../../utils/format';

interface IntroOverlayProps {
  visible: boolean;
  onEnterPark: () => void;
}

export function IntroOverlay({ visible, onEnterPark }: IntroOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-30 flex flex-col items-center justify-between px-4 py-4 transition-all duration-700 sm:py-6 ${
        visible
          ? 'pointer-events-auto visible opacity-100'
          : 'pointer-events-none invisible opacity-0 scale-105'
      }`}
      aria-hidden={!visible}
    >
      {/* Top Celebration Ribbon */}
      <div className="flex items-center gap-2 rounded-full storybook-pill px-4 py-1.5 text-[11px] font-semibold tracking-widest text-[#6E5098] uppercase shadow-sm sm:text-xs">
        <Crown className="h-3.5 w-3.5 text-[#E2A84B]" />
        <span>
          Celebrating {birthdayConfig.sisterName}&apos;s {formatOrdinal(birthdayConfig.age)}{' '}
          Birthday &middot; {birthdayConfig.birthdayDate}
        </span>
        <Sparkles className="h-3.5 w-3.5 text-[#E2A84B]" />
      </div>

      {/* Clear Center Viewport framing the Main Entrance Gates & Castle */}
      <div className="flex-1" />

      {/* Entrance Gates Prompt Card */}
      <div className="storybook-panel w-full max-w-2xl rounded-[26px] px-5 py-4 text-center sm:px-7 sm:py-5">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:text-left">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold tracking-[0.22em] text-[#8D6EC2] uppercase">
              Outside the Main Entrance Gates
            </p>
            <h1 className="font-display mt-0.5 text-2xl font-bold leading-tight text-[#3B2B4B] sm:text-3xl">
              {birthdayConfig.parkTitle}
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-[#57436C] sm:text-[13px]">
              Step inside on foot to explore six interconnected fairytale kingdoms, meet Elsa &amp;
              Anna, gather tulips, and celebrate with fireworks.
            </p>
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold text-[#5E467D] sm:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/75 px-2.5 py-0.5">
                <Keyboard className="h-3 w-3 text-[#C8842B]" />
                Desktop: WASD + Mouse Look + E Interact
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/75 px-2.5 py-0.5">
                <Gamepad2 className="h-3 w-3 text-[#8D6EC2]" />
                Mobile: Virtual Stick + Drag Look
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onEnterPark}
            className="group relative inline-flex shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-[#E2A84B]/85 bg-gradient-to-r from-[#FADAE6] via-[#FFF6E5] to-[#E6DDF9] px-6 py-3 text-sm font-bold tracking-wide text-[#3B2B4B] shadow-[0_10px_28px_rgba(141,110,194,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(226,168,75,0.34)] active:translate-y-0"
          >
            <Sparkles className="h-4 w-4 text-[#D99B38] transition-transform duration-300 group-hover:rotate-12" />
            <span>Enter Park</span>
            <ArrowRight className="h-4 w-4 text-[#6E5098] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
