import { X, Sparkles, Gift, Snowflake } from 'lucide-react';

export interface ActiveInteraction {
  kind: 'elsa' | 'anna' | 'olaf' | 'fantasy' | 'adventure' | 'galaxy' | 'cake' | 'gift' | 'fountain';
  title: string;
  subtitle: string;
  message: string;
  accentColor: string;
  extraActionLabel?: string;
  extraMessage?: string;
}

interface InteractionModalProps {
  interaction: ActiveInteraction | null;
  extraRevealed: boolean;
  onTriggerExtra?: () => void;
  onClose: () => void;
}

export function InteractionModal({
  interaction,
  extraRevealed,
  onTriggerExtra,
  onClose,
}: InteractionModalProps) {
  if (!interaction) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#3B2B4B]/32 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={interaction.title}
      onClick={onClose}
    >
      <div
        className="storybook-panel relative w-full max-w-md rounded-[26px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E2B362]/45 bg-white/80 text-[#3B2B4B] hover:bg-white"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
        </button>

        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-[#3B2B4B]"
          style={{ backgroundColor: `${interaction.accentColor}45` }}
        >
          {interaction.kind === 'elsa' ? (
            <Snowflake className="h-3.5 w-3.5 text-[#2E7EB8]" />
          ) : interaction.kind === 'gift' || interaction.kind === 'anna' ? (
            <Gift className="h-3.5 w-3.5 text-[#B53874]" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 text-[#C8842B]" />
          )}
          <span>{interaction.subtitle}</span>
        </span>

        <h3 className="font-display mt-2.5 text-3xl font-bold text-[#3B2B4B]">
          {interaction.title}
        </h3>

        <p className="mt-3 rounded-2xl border border-white/80 bg-white/70 p-4 text-sm leading-relaxed text-[#4B3860]">
          {interaction.message}
        </p>

        {interaction.extraActionLabel && onTriggerExtra && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onTriggerExtra}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E2A84B]/80 bg-gradient-to-r from-[#E6F6FF] via-[#FFF6E5] to-[#FADAE6] px-4 py-2.5 text-xs font-semibold text-[#3B2B4B] shadow-sm transition hover:brightness-105"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#C8842B]" />
              <span>{interaction.extraActionLabel}</span>
            </button>

            {extraRevealed && interaction.extraMessage && (
              <p className="mt-3 rounded-xl border border-[#E2B362]/45 bg-[#FFF9F2] p-3 text-xs font-medium leading-relaxed text-[#5A3D6E]">
                {interaction.extraMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
