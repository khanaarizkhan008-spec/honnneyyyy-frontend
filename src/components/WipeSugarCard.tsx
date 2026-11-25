import React, { useRef, useState } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import type { FlaggedPhrase, SugaredVsRaw } from '../types';

interface WipeSugarCardProps {
  items: SugaredVsRaw[];
  flaggedPhrases: FlaggedPhrase[];
}

export const WipeSugarCard: React.FC<WipeSugarCardProps> = ({
  items,
  flaggedPhrases,
}) => {
  const [wipePercent, setWipePercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const maxWipeRef = useRef(0);

  const updateWipeFromPointer = (clientX: number) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const nextPercent = Math.round(ratio * 100);
    if (nextPercent > maxWipeRef.current) {
      maxWipeRef.current = nextPercent;
      setWipePercent(nextPercent >= 88 ? 100 : nextPercent);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateWipeFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateWipeFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }
  };

  const handleRevealAll = () => {
    maxWipeRef.current = 100;
    setWipePercent(100);
  };

  const handleResetWipe = () => {
    maxWipeRef.current = 0;
    setWipePercent(0);
  };

  const isRevealed = wipePercent >= 85;

  return (
    <div className="bg-[#1A1110] text-[#FAF3E8] rounded-2xl p-4 sm:p-5 border-2 border-[#E89B25]/40">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E89B25]" />
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-[#E89B25]">
            Wipe Away the Sugar
          </span>
        </div>
        <span className="font-mono text-xs text-[#F7C5CC]">
          {wipePercent}% wiped
        </span>
      </div>

      <p className="font-sans text-xs sm:text-sm text-[#FAF3E8]/80 mb-4">
        Drag your thumb across their sweet words below to dissolve the flattery and see the raw
        script underneath.
      </p>

      {/* Interactive Swipe/Scrub Surface */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
        className="relative rounded-xl overflow-hidden border-2 border-[#FAF3E8]/20 select-none cursor-ew-resize min-h-[220px] bg-[#120B0A]"
      >
        {/* UNDERNEATH: Raw Scammer Script + Cherry Red Margin Notes */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-[11px] uppercase tracking-widest text-[#D91E36]">
              RAW SCRIPT UNCOVERED
            </span>
            <span className="font-mono text-[10px] text-[#FAF3E8]/50">
              REAL TRANSLATION
            </span>
          </div>

          {items.map((pair, idx) => (
            <div
              key={idx}
              className="bg-[#FAF3E8]/[0.06] border-l-4 border-[#D91E36] rounded-r-xl p-3"
            >
              <p className="font-sans font-semibold text-sm text-[#FAF3E8]">
                {pair.hidden_meaning}
              </p>
              {flaggedPhrases[idx] && (
                <p className="font-mono text-[11px] text-[#F7C5CC] mt-1.5">
                  Margin note ({flaggedPhrases[idx].tactic}): {flaggedPhrases[idx].margin_note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* TOP SUGAR LAYER: Dissolves left-to-right as user wipes */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#F7C5CC] via-[#FAF3E8] to-[#F7C5CC] text-[#1A1110] p-4 sm:p-5 flex flex-col justify-between transition-opacity duration-200 pointer-events-none"
          style={{
            clipPath: `inset(0 0 0 ${wipePercent}%)`,
            opacity: wipePercent >= 98 ? 0 : 1,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-[11px] uppercase tracking-widest text-[#D91E36]">
              SUGAR COATING (SWIPE RIGHT →)
            </span>
            <span className="font-mono text-[11px] text-[#1A1110]/60">
              {100 - wipePercent}% left
            </span>
          </div>

          <div className="space-y-3 my-auto py-2">
            {items.map((pair, idx) => (
              <div
                key={idx}
                className="bg-white/70 border border-[#1A1110]/15 rounded-xl px-3.5 py-2.5"
              >
                <p className="font-editorial italic font-bold text-base sm:text-lg text-[#1A1110] leading-snug">
                  “{pair.sweet_line}”
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#1A1110]/70">
            <span>Drag thumb across to wipe</span>
            <span>→→→</span>
          </div>
        </div>

        {/* Wipe divider line */}
        {wipePercent > 0 && wipePercent < 98 && (
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#D91E36] shadow-[0_0_12px_#D91E36] pointer-events-none"
            style={{ left: `${wipePercent}%` }}
          />
        )}
      </div>

      {/* Progress Bar + Quick Reveal Toggle */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex-1 h-2 bg-[#FAF3E8]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E89B25] to-[#D91E36] transition-all duration-150"
            style={{ width: `${wipePercent}%` }}
          />
        </div>

        {!isRevealed ? (
          <button
            type="button"
            onClick={handleRevealAll}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#F7C5CC] hover:text-[#FAF3E8] cursor-pointer shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Wipe All</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleResetWipe}
            className="text-xs font-mono text-[#FAF3E8]/60 hover:text-[#FAF3E8] cursor-pointer shrink-0"
          >
            Re-coat sugar
          </button>
        )}
      </div>
    </div>
  );
};
