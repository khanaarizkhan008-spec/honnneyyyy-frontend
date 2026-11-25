import React from 'react';
import { ArrowDown, ArrowRight, HeartHandshake } from 'lucide-react';
import { LipstickKissMark } from './LipstickKissMark';

interface HeroSectionProps {
  onStartCheck: () => void;
  onOpenRescueNow: () => void;
}

const MARQUEE_TEXT =
  "SHORT N' FAKE · WIPE THE SUGAR · CHECK THE RECEIPTS · HONNNNEYYY · ";

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCheck,
  onOpenRescueNow,
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-12 sm:pt-14 sm:pb-16 px-4">
      {/* Giant 5% opacity kinetic marquee */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-x-0 top-10 sm:top-12 overflow-hidden opacity-[0.05]"
      >
        <div className="animate-marquee font-editorial italic font-extrabold text-6xl sm:text-8xl tracking-tight text-[#FAF3E8] whitespace-nowrap">
          <span>{MARQUEE_TEXT.repeat(4)}</span>
          <span>{MARQUEE_TEXT.repeat(4)}</span>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7C5CC] text-[#1A1110] border border-[#1A1110] hard-shadow-blush mb-6">
          <LipstickKissMark className="w-5 h-3.5" />
          <span className="font-mono font-bold text-[11px] sm:text-xs tracking-wider uppercase">
            NOT AN ANTIVIRUS — YOUR PROTECTIVE BESTIE
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-editorial italic font-extrabold text-4xl sm:text-6xl leading-[1.06] tracking-tight text-[#FAF3E8] mb-5">
          Someone acting a little too sweet?{' '}
          <span className="text-[#E89B25] not-italic">Hand me your phone.</span>
        </h1>

        {/* Warm 2-line intro */}
        <p className="font-sans text-base sm:text-lg text-[#FAF3E8]/80 leading-relaxed max-w-xl mb-7">
          Paste their DM, drop a private screenshot, or check a link. Wipe away the sugar to see
          their real script—and if you&apos;re already in too deep, I&apos;ll walk you out calmly
          with zero judgment.
        </p>

        {/* 3 Compact Tactile Pillar Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full mb-8">
          <div className="bg-[#FAF3E8]/[0.06] border border-[#FAF3E8]/15 rounded-2xl px-3.5 py-3 text-left">
            <p className="font-mono font-bold text-[11px] text-[#E89B25] tracking-wider uppercase">
              01 · Wipe Away the Sugar
            </p>
            <p className="font-sans text-xs text-[#FAF3E8]/75 mt-1">
              Thumb-swipe to uncover manipulation
            </p>
          </div>
          <div className="bg-[#FAF3E8]/[0.06] border border-[#FAF3E8]/15 rounded-2xl px-3.5 py-3 text-left">
            <p className="font-mono font-bold text-[11px] text-[#F7C5CC] tracking-wider uppercase">
              02 · Group-Chat Receipts
            </p>
            <p className="font-sans text-xs text-[#FAF3E8]/75 mt-1">
              Co-Star style stamped cards
            </p>
          </div>
          <div className="bg-[#FAF3E8]/[0.06] border border-[#FAF3E8]/15 rounded-2xl px-3.5 py-3 text-left">
            <p className="font-mono font-bold text-[11px] text-[#10B981] tracking-wider uppercase">
              03 · Golden-Hour Rescue
            </p>
            <p className="font-sans text-xs text-[#FAF3E8]/75 mt-1">
              Zero-shame 1-step-at-a-time help
            </p>
          </div>
        </div>

        {/* Primary CTA & Direct Compassion Link */}
        <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={onStartCheck}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#D91E36] hover:bg-[#c3192f] active:translate-y-0.5 text-[#FAF3E8] font-sans font-bold text-base sm:text-lg px-8 py-4 rounded-2xl border-2 border-[#1A1110] hard-shadow-cherry transition-all cursor-pointer"
          >
            <span>Let&apos;s read it together</span>
            <ArrowDown className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenRescueNow}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-medium text-[#10B981] hover:text-[#FAF3E8] transition-colors cursor-pointer py-1"
          >
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span className="underline underline-offset-4 decoration-[#10B981]/50 group-hover:decoration-[#FAF3E8]">
              Already sent money or private photos? Skip the scan — I&apos;ve got you
            </span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
