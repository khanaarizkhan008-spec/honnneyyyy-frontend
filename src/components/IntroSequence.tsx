import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { LipstickKissMark } from './LipstickKissMark';
import { playBestieAlert } from '../utils/soundAlert';

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [needsTapForSound, setNeedsTapForSound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const soundTimer = setTimeout(() => {
      void playBestieAlert().then((started) => {
        if (!cancelled && !started) {
          setNeedsTapForSound(true);
        }
      });
    }, 220);

    const timer = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      cancelled = true;
      clearTimeout(soundTimer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  const handleTap = () => {
    void playBestieAlert(true);
    setTimeout(() => {
      onComplete();
    }, 350);
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

        {needsTapForSound && (
          <div className="mt-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF3E8]/10 border border-[#FAF3E8]/25 text-[#FAF3E8] font-mono text-xs animate-pulse">
            <Volume2 className="w-3.5 h-3.5 text-[#F7C5CC]" />
            <span>Tap anywhere for sound</span>
          </div>
        )}
      </div>

      <span className="absolute bottom-8 font-mono text-[11px] uppercase tracking-widest text-[#FAF3E8]/40">
        Tap anywhere to continue
      </span>
    </div>
  );
};
