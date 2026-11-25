import React, { useEffect, useRef, useState } from 'react';
import {
  MessageSquareText,
  ImageUp,
  Link2,
  Flame,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import type { CheckResult, InputMode } from '../types';
import { SAMPLE_TRAPS } from '../data/sampleTraps';
import { readScreenshotLocally } from '../utils/ocrLocal';
import { checkMessageWithBestie } from '../utils/geminiClient';
import { LipstickKissMark } from './LipstickKissMark';
import { WipeSugarCard } from './WipeSugarCard';
import { ReceiptCard } from './ReceiptCard';

interface CoViewingCheckerProps {
  inputText: string;
  setInputText: (val: string) => void;
  result: CheckResult | null;
  onResultReady: (res: CheckResult) => void;
  onOpenSafety: () => void;
}

export const CoViewingChecker: React.FC<CoViewingCheckerProps> = ({
  inputText,
  setInputText,
  result,
  onResultReady,
  onOpenSafety,
}) => {
  const [mode, setMode] = useState<InputMode>('paste');
  const [loadingStage, setLoadingStage] = useState<string | null>(null);
  const [ocrPreviewName, setOcrPreviewName] = useState<string | null>(null);
  const [ocrPreviewUrl, setOcrPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (result && !loadingStage) {
      const timer = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [result, loadingStage]);

  const runBestieCheck = async (textToRead: string, activeMode: InputMode) => {
    const clean = textToRead.trim();
    if (!clean) {
      setErrorMsg('Drop a message, link, or screenshot first so we can read it together.');
      return;
    }

    setErrorMsg(null);
    setLoadingStage('Hold on, let me read this...');

    const minDelay = new Promise((r) => setTimeout(r, 700));
    const [checked] = await Promise.all([
      checkMessageWithBestie(clean, activeMode),
      minDelay,
    ]);

    setLoadingStage('Wait a second... swipe across this.');
    await new Promise((r) => setTimeout(r, 550));

    setLoadingStage(null);
    onResultReady(checked);
  };

  const handleSampleTrap = (trapContent: string, trapMode: InputMode) => {
    setMode(trapMode);
    setInputText(trapContent);
    setOcrPreviewName(null);
    void runBestieCheck(trapContent, trapMode);
  };

  const handleScreenshotSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setOcrPreviewName(file.name);
    setOcrPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setLoadingStage(
      'Reading your screenshot privately on your device first—your photo never leaves your phone... (0%)'
    );

    try {
      const extracted = await readScreenshotLocally(file, (pct) => {
        setLoadingStage(
          `Reading your screenshot privately on your device first—your photo never leaves your phone... (${pct}%)`
        );
      });

      if (!extracted) {
        setLoadingStage(null);
        setErrorMsg(
          "I couldn't make out clear text in that screenshot—try cropping closer to the chat or pasting the text directly."
        );
        return;
      }

      setInputText(extracted);
      await runBestieCheck(extracted, 'screenshot');
    } catch {
      setLoadingStage(null);
      setErrorMsg(
        'Something tripped up reading that image locally. Try pasting the message text instead.'
      );
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <section id="co-view-checker" className="px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Vanilla Cream Cocktail Napkin Card */}
        <div className="relative bg-[#FAF3E8] text-[#1A1110] rounded-3xl border-2 border-[#1A1110] hard-shadow-cream p-5 sm:p-8">
          {/* Tiny stamped kiss mark on corner */}
          <div className="absolute -top-4 -right-2 sm:right-4 pointer-events-none">
            <LipstickKissMark className="w-16 h-11 drop-shadow-sm" />
          </div>

          <p className="font-mono font-bold text-xs uppercase tracking-widest text-[#D91E36] mb-1">
            CO-VIEWING NAPKIN
          </p>
          <h2 className="font-editorial italic font-bold text-2xl sm:text-3xl text-[#1A1110] mb-5 pr-12">
            Okay, show me what we&apos;re dealing with:
          </h2>

          {/* 3 Input Tabs */}
          <div className="grid grid-cols-3 gap-1.5 bg-[#1A1110]/10 p-1.5 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => setMode('paste')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-sans font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                mode === 'paste'
                  ? 'bg-[#1A1110] text-[#FAF3E8] shadow-sm'
                  : 'text-[#1A1110]/75 hover:text-[#1A1110]'
              }`}
            >
              <MessageSquareText className="w-4 h-4 shrink-0" />
              <span className="truncate">Paste what they sent</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('screenshot')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-sans font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                mode === 'screenshot'
                  ? 'bg-[#1A1110] text-[#FAF3E8] shadow-sm'
                  : 'text-[#1A1110]/75 hover:text-[#1A1110]'
              }`}
            >
              <ImageUp className="w-4 h-4 shrink-0" />
              <span className="truncate">Show me a screenshot</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('link')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-sans font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                mode === 'link'
                  ? 'bg-[#1A1110] text-[#FAF3E8] shadow-sm'
                  : 'text-[#1A1110]/75 hover:text-[#1A1110]'
              }`}
            >
              <Link2 className="w-4 h-4 shrink-0" />
              <span className="truncate">Check a link they sent</span>
            </button>
          </div>

          {/* Tab Content */}
          {mode === 'screenshot' ? (
            <div className="mb-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleScreenshotSelected}
                className="hidden"
                id="screenshot-upload"
              />
              <label
                htmlFor="screenshot-upload"
                className="flex flex-col items-center justify-center text-center border-2 border-dashed border-[#1A1110]/35 hover:border-[#D91E36] bg-white/60 rounded-2xl p-6 sm:p-8 cursor-pointer transition-colors"
              >
                <ImageUp className="w-8 h-8 text-[#D91E36] mb-2" />
                <span className="font-sans font-bold text-sm sm:text-base text-[#1A1110]">
                  {ocrPreviewName
                    ? `Selected: ${ocrPreviewName} (tap to pick another)`
                    : 'Tap to drop a chat screenshot or profile'}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#10B981] font-bold mt-2 bg-[#10B981]/10 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Read 100% locally on your device — photo never leaves your phone
                </span>
              </label>

              {(ocrPreviewUrl || inputText) && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                  {ocrPreviewUrl && (
                    <div className="rounded-xl overflow-hidden border border-[#1A1110]/20 bg-white/70 p-1.5">
                      <img
                        src={ocrPreviewUrl}
                        alt="Uploaded chat screenshot preview"
                        className="w-full h-28 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className={ocrPreviewUrl ? 'sm:col-span-2' : 'sm:col-span-3'}>
                    <label className="block font-mono text-[11px] uppercase text-[#1A1110]/60 mb-1">
                      Text read by Tesseract locally (editable):
                    </label>
                    <textarea
                      rows={4}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full rounded-xl border border-[#1A1110]/20 bg-white/80 p-3 font-sans text-sm text-[#1A1110] focus:outline-none focus:border-[#D91E36]"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-5">
              <textarea
                rows={mode === 'link' ? 2 : 4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  mode === 'link'
                    ? 'Paste the sketchy link or handle they sent you (e.g. https://apex-wealth-vip.co/trade)...'
                    : 'Paste the sweet DM, late-night text, or "wrong number" opener right here...'
                }
                className="w-full rounded-2xl border-2 border-[#1A1110]/20 bg-white/85 p-4 font-sans text-sm sm:text-base text-[#1A1110] placeholder:text-[#1A1110]/40 focus:outline-none focus:border-[#D91E36]"
              />
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 rounded-xl bg-[#D91E36]/10 border border-[#D91E36]/40 px-4 py-3 text-xs sm:text-sm font-sans text-[#D91E36] font-medium">
              {errorMsg}
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={() => void runBestieCheck(inputText, mode)}
            disabled={Boolean(loadingStage)}
            className="w-full bg-[#D91E36] hover:bg-[#c3192f] disabled:opacity-70 text-[#FAF3E8] font-sans font-bold text-base py-3.5 px-6 rounded-2xl border-2 border-[#1A1110] hard-shadow-cherry transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loadingStage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{loadingStage}</span>
              </>
            ) : (
              <span>Read this with me</span>
            )}
          </button>

          {/* Vintage Matchbook Sample Traps */}
          <div className="mt-6 pt-5 border-t-2 border-dashed border-[#1A1110]/15">
            <div className="flex items-center gap-1.5 mb-3">
              <Flame className="w-4 h-4 text-[#E89B25]" />
              <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-[#1A1110]/70">
                Or tap a classic trap matchbook to test it live:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_TRAPS.map((trap) => (
                <button
                  key={trap.id}
                  type="button"
                  onClick={() => handleSampleTrap(trap.content, trap.mode)}
                  className="group text-left bg-[#F7C5CC]/55 hover:bg-[#F7C5CC] border-2 border-[#1A1110] rounded-xl p-3 transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  <p className="font-editorial italic font-bold text-sm text-[#1A1110] leading-snug">
                    {trap.label}
                  </p>
                  <p className="font-mono text-[10px] text-[#1A1110]/70 mt-1">
                    {trap.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Results: Wipe Away the Sugar + Co-Star Receipt */}
        {result && !loadingStage && (
          <div ref={resultsRef} className="mt-8 space-y-6 scroll-mt-20">
            <div className="px-1">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#FAF3E8]/60">
                {result.source === 'gemini' ? 'Live Gemini Bestie' : 'Local Bestie Check'}
              </span>
            </div>
            <WipeSugarCard
              items={result.sugared_vs_raw}
              flaggedPhrases={result.flagged_phrases}
            />
            <ReceiptCard result={result} />

            {result.risk_level === 'high' && (
              <div className="bg-[#10B981]/15 border-2 border-[#10B981] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="font-sans text-sm text-[#FAF3E8]">
                  This looks high-risk. Want me to walk you out step-by-step with zero judgment?
                </p>
                <button
                  type="button"
                  onClick={onOpenSafety}
                  className="shrink-0 bg-[#10B981] hover:bg-[#0ea572] text-[#120B0A] font-sans font-bold text-sm px-5 py-3 rounded-xl cursor-pointer min-h-[44px]"
                >
                  Open Golden-Hour Rescue →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
