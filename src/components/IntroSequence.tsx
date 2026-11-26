import React, { useEffect, useState } from 'react';
import { LipstickKissMark } from './LipstickKissMark';
import { playBestieAlert } from '../utils/soundAlert';

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'checking' | 'gate' | 'playing'>('checking');

  useEffect(() => {
    let cancelled = false;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;

    void playBestieAlert(true).then((started) => {
      if (cancelled) return;
      if (started) {
        setPhase('playing');
        finishTimer = setTimeout(() => {
          onComplete();
        }, 2200);
      } else {
        setPhase('gate');
      }
    });

    return () => {
      cancelled = true;
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [onComplete]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  const handleStartWithSound = () => {
    if (phase === 'gate') {
      void playBestieAlert(true);
      setPhase('playing');
      return;
    }
    onComplete();
  };

  if (phase === 'checking') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#120B0A] paper-grain" />
    );
  }

  if (phase === 'gate') {
    return (
      <button
        type="button"
        onClick={handleStartWithSound}
        className="fixed inset-0 z-50 w-full h-full flex flex-col items-center justify-center bg-[#120B0A] paper-grain px-6 cursor-pointer select-none focus:outline-none"
        aria-label="Tap to open Honnnneyyyy with sound"
      >
        <div className="relative flex flex-col items-center text-center group">
          <div className="transition-transform duration-300 group-hover:scale-110 group-active:scale-95 drop-shadow-[0_12px_28px_rgba(217,30,54,0.5)] mb-4">
            <LipstickKissMark className="w-28 h-20" />
          </div>
          <span className="font-editorial italic font-bold text-2xl sm:text-3xl text-[#FAF3E8]">
            Hon<span className="text-[#E89B25]">nn</span>neyyyy
          </span>
          <span className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-[#F7C5CC] text-[#1A1110] border-2 border-[#1A1110] hard-shadow-blush font-mono font-bold text-xs uppercase tracking-wider">
            Tap to open
          </span>
        </div>
      </button>
    );
  }

  return (
    <div
      onClick={handleStartWithSound}
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
