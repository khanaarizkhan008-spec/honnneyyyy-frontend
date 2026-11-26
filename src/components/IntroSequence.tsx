import React, { useEffect } from 'react';
import { LipstickKissMark } from './LipstickKissMark';
import {
  playBestieAlert,
  playOnFirstInteractionIfBlocked,
} from '../utils/soundAlert';

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  useEffect(() => {
    const soundTimer = setTimeout(() => {
      void playBestieAlert(true).then((started) => {
        if (!started) {
          playOnFirstInteractionIfBlocked();
        }
      });
    }, 220);

    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  const handleTap = () => {
    void playBestieAlert(true);
    onComplete();
  };

  return (
    <div
      onClick={handleTap}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#120B0A] paper-grain px-6 cursor-pointer select-none"
      role="status"
      aria-label="Honnnneyyyy intro"
    >
      <div className="relative flex flex-col items-center text-center">
        {/* Blush-pink ripple ring */}
        <div className="relative flex items-center justify-center mb-3">
          <div className="absolute w-28 h-28 rounded-full border-2 border-[#F7C5CC] opacity-0 animate-blush-ripple pointer-events-none" />
          <div className="animate-kiss-stamp drop-shadow-[0_12px_24px_rgba(217,30,54,0.45)]">
            <LipstickKissMark className="w-32 h-22" />
          </div>
        </div>

        {/* Elastic wordmark */}
        <h1 className="animate-honey-stretch font-editorial italic font-extrabold text-5xl sm:text-6xl tracking-tight text-[#FAF3E8]">
          Hon<span className="text-[#E89B25]">nn</span>neyyyy
        </h1>

        {/* Tilted Blush Pink sticker tag */}
        <div className="animate-sticker-snap mt-5 bg-[#F7C5CC] text-[#1A1110] px-4 py-2 rounded-xl border-2 border-[#1A1110] hard-shadow-blush max-w-xs sm:max-w-sm">
          <p className="font-sans font-semibold text-xs sm:text-sm tracking-tight">
            Short, sweet, and totally fake? Let&apos;s check the receipts together.
          </p>
        </div>
      </div>

      <span className="absolute bottom-8 font-mono text-[11px] uppercase tracking-widest text-[#FAF3E8]/40">
        Tap anywhere to continue
      </span>
    </div>
  );
};
