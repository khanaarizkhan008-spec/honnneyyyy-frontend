import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { FlaggedPhrase, SugaredVsRaw } from '../types';

interface WipeSugarCardProps {
  items: SugaredVsRaw[];
  flaggedPhrases: FlaggedPhrase[];
}

export const WipeSugarCard: React.FC<WipeSugarCardProps> = ({
  items,
  flaggedPhrases,
}) => {
  return (
    <div className="bg-[#1A1110] text-[#FAF3E8] rounded-2xl p-4 sm:p-5 border-2 border-[#E89B25]/40">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#E89B25]" />
        <span className="font-mono font-bold text-xs uppercase tracking-wider text-[#E89B25]">
          Sweet Words vs. Real Script
        </span>
      </div>

      <div className="space-y-3.5">
        {items.map((pair, idx) => (
          <div
            key={idx}
            className="bg-[#120B0A] border border-[#FAF3E8]/15 rounded-xl p-3.5 sm:p-4 space-y-2.5"
          >
            <div className="bg-[#F7C5CC]/15 border border-[#F7C5CC]/30 rounded-lg px-3 py-2">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#F7C5CC] mb-0.5">
                What they wrote
              </span>
              <p className="font-editorial italic font-bold text-sm sm:text-base text-[#FAF3E8]">
                “{pair.sweet_line}”
              </p>
            </div>

            <div className="flex items-start gap-2 border-l-4 border-[#D91E36] pl-3 py-0.5">
              <ArrowRight className="w-4 h-4 text-[#D91E36] shrink-0 mt-0.5" />
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#D91E36] mb-0.5">
                  What it actually means
                </span>
                <p className="font-sans font-semibold text-sm text-[#FAF3E8]">
                  {pair.hidden_meaning}
                </p>
                {flaggedPhrases[idx] && (
                  <p className="font-mono text-[11px] text-[#F7C5CC]/85 mt-1">
                    {flaggedPhrases[idx].tactic}: {flaggedPhrases[idx].margin_note}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
