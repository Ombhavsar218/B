import { X, Flower2, Sparkles, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { birthdayConfig, type TulipMessageItem } from '../../config/birthdayConfig';

interface BouquetBuilderDrawerProps {
  open: boolean;
  activeFlower: TulipMessageItem | null;
  collectedFlowers: TulipMessageItem[];
  bouquetCompleted: boolean;
  onClose: () => void;
  onSelectFlower: (flower: TulipMessageItem) => void;
  onCollectFlower: (flower: TulipMessageItem) => void;
  onRemoveStem: (index: number) => void;
  onCompleteBouquet: () => void;
}

export function BouquetBuilderDrawer({
  open,
  activeFlower,
  collectedFlowers,
  bouquetCompleted,
  onClose,
  onSelectFlower,
  onCollectFlower,
  onRemoveStem,
  onCompleteBouquet,
}: BouquetBuilderDrawerProps) {
  if (!open) return null;

  const displayFlower = activeFlower ?? birthdayConfig.tulipMessages[0];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#3B2B4B]/35 p-3 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Tulip Wonderland Bouquet Builder"
      onClick={onClose}
    >
      <div
        className="storybook-panel flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8D6EC2] uppercase">
              Tulip Wonderland
            </p>
            <h2 className="font-display text-3xl font-bold text-[#3B2B4B]">
              Flower Messages &amp; Virtual Bouquet
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E2B362]/45 bg-white/80 text-[#3B2B4B] hover:bg-white"
            aria-label="Close bouquet builder"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid flex-1 gap-4 overflow-y-auto sm:grid-cols-2">
          {/* Selected Flower Message */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#E2B362]/40 bg-white/75 p-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded-full border border-[#3B2B4B]/15"
                  style={{ backgroundColor: displayFlower.color }}
                />
                <h3 className="font-display text-2xl font-bold text-[#3B2B4B]">
                  {displayFlower.variety}
                </h3>
              </div>
              <p className="mt-2 rounded-xl bg-[#FDF0F5]/80 p-3 text-sm leading-relaxed text-[#4E3A63]">
                &ldquo;{displayFlower.message}&rdquo;
              </p>

              <p className="mt-3 text-[11px] font-semibold tracking-wider text-[#8D6EC2] uppercase">
                Pick from the Garden
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {birthdayConfig.tulipMessages.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectFlower(item)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                      displayFlower.id === item.id
                        ? 'border-[#C8842B] bg-[#FFF4DE] text-[#3B2B4B]'
                        : 'border-[#E2B362]/35 bg-white text-[#55426B] hover:bg-[#FDF0F5]'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.variety}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={collectedFlowers.length >= 7}
              onClick={() => onCollectFlower(displayFlower)}
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#E2A84B] bg-gradient-to-r from-[#FADAE6] to-[#FFF4DE] px-3 py-2 text-xs font-semibold text-[#3B2B4B] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>
                {collectedFlowers.length >= 7
                  ? 'Bouquet Full (7 Stems)'
                  : `Add ${displayFlower.variety} to Bouquet`}
              </span>
            </button>
          </div>

          {/* Live Virtual Bouquet Preview */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#E2B362]/40 bg-gradient-to-b from-[#FFF9F2] to-[#FADAE6]/40 p-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-bold text-[#3B2B4B]">
                  Your Bouquet ({collectedFlowers.length}/7)
                </h3>
                <Flower2 className="h-4 w-4 text-[#D96B94]" />
              </div>

              {/* Stylized SVG Bouquet Preview */}
              <div className="mt-2 flex h-40 items-center justify-center rounded-xl border border-white/75 bg-white/55">
                {collectedFlowers.length === 0 ? (
                  <p className="px-4 text-center text-xs text-[#7D6696]">
                    Collect stems from the garden to arrange your birthday bouquet.
                  </p>
                ) : (
                  <svg viewBox="0 0 200 160" className="h-36 w-44">
                    {/* Ribbon Wrap */}
                    <polygon points="75,92 125,92 110,145 90,145" fill="#F7C6D9" stroke="#E2A84B" strokeWidth="2" />
                    {collectedFlowers.map((stem, idx) => {
                      const offset = (idx - (collectedFlowers.length - 1) / 2) * 18;
                      const cx = 100 + offset;
                      const cy = 42 + Math.abs(offset) * 0.35;
                      return (
                        <g key={`${stem.id}-${idx}`}>
                          <line x1={cx} y1={cy + 10} x2={100} y2={105} stroke="#68A874" strokeWidth="3.5" />
                          <circle cx={cx} cy={cy} r="13" fill={stem.color} stroke="#FFF9F2" strokeWidth="2" />
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>

              {/* Collected Stems List */}
              {collectedFlowers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {collectedFlowers.map((stem, idx) => (
                    <span
                      key={`${stem.id}-${idx}`}
                      className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-medium text-[#3B2B4B]"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: stem.color }}
                      />
                      <span>{stem.variety}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveStem(idx)}
                        className="cursor-pointer text-[#9D7EB0] hover:text-[#C44569]"
                        aria-label={`Remove ${stem.variety}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {bouquetCompleted ? (
              <div className="mt-3 rounded-xl border border-[#67B77E]/50 bg-[#EFFAF2] p-3 text-xs leading-relaxed text-[#2D5E3C]">
                <div className="mb-1 flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-[#4A9E68]" />
                  <span>Birthday Bouquet Complete!</span>
                </div>
                <p>{birthdayConfig.bouquetCompletionMessage}</p>
              </div>
            ) : (
              <button
                type="button"
                disabled={collectedFlowers.length < 3}
                onClick={onCompleteBouquet}
                className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#3B2B4B] px-3 py-2 text-xs font-semibold text-[#FFF9F2] transition hover:bg-[#4F3B63] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#FFD98E]" />
                <span>
                  {collectedFlowers.length < 3
                    ? `Add ${3 - collectedFlowers.length} more stem(s) to tie bouquet`
                    : 'Tie & Reveal Birthday Message'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
