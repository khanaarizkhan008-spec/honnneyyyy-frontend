import React, { useState } from 'react';
import { Download, Check, MessageSquareQuote, Share2 } from 'lucide-react';
import type { CheckResult } from '../types';
import { LipstickKissMark } from './LipstickKissMark';
import { downloadReceiptPng, generateReceiptBlob } from '../utils/receiptCanvas';

interface ReceiptCardProps {
  result: CheckResult;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ result }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [shared, setShared] = useState(false);

  const [receiptId] = useState(() => {
    const now = new Date();
    return `HNY-${String(now.getHours()).padStart(2, '0')}${String(
      now.getMinutes()
    ).padStart(2, '0')}-${result.sweetener_score}`;
  });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReceiptPng(result);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const blob = await generateReceiptBlob(result);
      const shareText = `Bestie, check this receipt (${result.sweetener_score}% Fake Sugar): “${result.costar_roast}” — honnneyyyy.embarko.app`;

      if (blob && typeof navigator.share === 'function') {
        const file = new File([blob], `honnnneyyyy-receipt-${result.sweetener_score}.png`, {
          type: 'image/png',
        });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: 'Honnnneyyyy Receipt',
            text: shareText,
            files: [file],
          });
          setShared(true);
          setTimeout(() => setShared(false), 3000);
          return;
        }
        await navigator.share({ title: 'Honnnneyyyy Receipt', text: shareText });
        setShared(true);
        setTimeout(() => setShared(false), 3000);
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    } catch {
      // User cancelled native share sheet
    }
  };

  const scoreBadgeColor =
    result.risk_level === 'high'
      ? 'bg-[#D91E36] text-[#FAF3E8]'
      : result.risk_level === 'medium'
        ? 'bg-[#E89B25] text-[#1A1110]'
        : 'bg-[#10B981] text-[#1A1110]';

  return (
    <div className="relative bg-[#FAF3E8] text-[#1A1110] rounded-2xl border-2 border-[#1A1110] hard-shadow-cream overflow-hidden">
      {/* Receipt Header */}
      <div className="p-5 sm:p-6 border-b-2 border-dashed border-[#1A1110]/20 relative">
        <div className="absolute top-3 right-3 sm:top-4 sm:right-5 pointer-events-none">
          <LipstickKissMark className="w-16 h-11 sm:w-20 sm:h-14 opacity-95" />
        </div>

        <p className="font-mono font-bold text-[11px] uppercase tracking-widest text-[#D91E36]">
          GROUP-CHAT RECEIPT // #{receiptId}
        </p>

        <div className="mt-3 flex flex-wrap items-baseline gap-3 pr-16">
          <span className="font-mono font-extrabold text-4xl sm:text-5xl tracking-tight text-[#1A1110]">
            {result.sweetener_score}%
          </span>
          <span
            className={`px-2.5 py-1 rounded-full font-mono font-bold text-xs uppercase tracking-wider ${scoreBadgeColor}`}
          >
            {result.sweetener_score >= 65
              ? 'Fake Sugar'
              : result.sweetener_score >= 35
                ? 'Mixed Signals'
                : 'Low Sugar'}
          </span>
        </div>

        <h3 className="font-editorial italic font-bold text-2xl sm:text-3xl text-[#1A1110] mt-2 leading-tight">
          {result.verdict_headline}
        </h3>
      </div>

      {/* Co-Star Style Roast */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="bg-[#F7C5CC] border-2 border-[#1A1110] rounded-xl p-4 hard-shadow-blush">
          <p className="font-mono font-bold text-[10px] uppercase tracking-widest text-[#1A1110]/70 mb-1">
            BESTIE, CHECK THIS RECEIPT
          </p>
          <p className="font-editorial italic font-bold text-lg sm:text-xl text-[#1A1110] leading-snug">
            “{result.costar_roast}”
          </p>
        </div>

        {/* Bestie Note */}
        <div className="flex items-start gap-3">
          <MessageSquareQuote className="w-5 h-5 text-[#D91E36] shrink-0 mt-0.5" />
          <p className="font-sans text-sm sm:text-base text-[#1A1110]/90 leading-relaxed">
            {result.bestie_note}
          </p>
        </div>

        {/* Flagged Phrases */}
        <div className="space-y-2.5 pt-1">
          <p className="font-mono font-bold text-[11px] uppercase tracking-widest text-[#1A1110]/60">
            MARGIN NOTES ON THE NAPKIN
          </p>
          {result.flagged_phrases.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/70 border border-[#1A1110]/15 rounded-xl p-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="font-mono font-bold text-xs text-[#D91E36] uppercase">
                  {item.tactic}
                </span>
                <span className="font-mono text-[11px] text-[#1A1110]/55 truncate max-w-[220px]">
                  “{item.quote}”
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#1A1110]/85">
                {item.margin_note}
              </p>
            </div>
          ))}
        </div>

        {/* PNG Export & Native Share */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-2 border-dashed border-[#1A1110]/20">
          <span className="font-mono text-[11px] text-[#1A1110]/60">
            9:16 story-ready card • honnneyyyy.embarko.app
          </span>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => void handleShare()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F7C5CC] hover:bg-[#f2b2bc] text-[#1A1110] font-sans font-bold text-sm px-4 py-3 rounded-xl border-2 border-[#1A1110] transition-colors cursor-pointer min-h-[44px]"
            >
              {shared ? (
                <>
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Ready to send!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={downloading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1110] hover:bg-[#D91E36] text-[#FAF3E8] font-sans font-bold text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-60 min-h-[44px]"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    {downloading ? 'Stamping...' : 'Save Receipt for Group Chat'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
