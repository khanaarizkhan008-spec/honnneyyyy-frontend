import React, { useEffect, useRef, useState } from 'react';
import {
  HeartHandshake,
  PhoneCall,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Send,
  Loader2,
  CheckSquare,
  Square,
} from 'lucide-react';
import type { CheckResult, RescueSituation } from '../types';
import { askBestieReply } from '../utils/geminiClient';
import { downloadReceiptPng } from '../utils/receiptCanvas';

interface RescueCompanionProps {
  visible: boolean;
  result: CheckResult | null;
}

const STALLING_SCRIPTS = [
  "Hey, my phone's acting weird and I'm swamped with family stuff tonight—let's catch up later.",
  "I don't move off this app until I've actually met someone, sorry! Hope you understand.",
];

export const RescueCompanion: React.FC<RescueCompanionProps> = ({
  visible,
  result,
}) => {
  const [situation, setSituation] = useState<RescueSituation>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [evidenceChecks, setEvidenceChecks] = useState<Record<string, boolean>>({
    utr: false,
    bank: false,
    chats: false,
  });
  const [askInput, setAskInput] = useState('');
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const actionCardRef = useRef<HTMLDivElement | null>(null);
  const replyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (situation) {
      const t = setTimeout(() => {
        actionCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
      return () => clearTimeout(t);
    }
  }, [situation, stepIndex]);

  useEffect(() => {
    if (askAnswer) {
      const t = setTimeout(() => {
        replyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
      return () => clearTimeout(t);
    }
  }, [askAnswer]);

  if (!visible) return null;

  const selectSituation = (next: RescueSituation) => {
    setSituation(next);
    setStepIndex(0);
    setAskAnswer(null);
  };

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // Ignore clipboard errors
    }
  };

  const handleAskBestie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim() || asking) return;
    setAsking(true);
    try {
      const reply = await askBestieReply(situation, askInput);
      setAskAnswer(reply);
    } finally {
      setAsking(false);
    }
  };

  const totalSteps = 3;

  return (
    <section id="rescue-companion" className="px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Grounding Reassurance Banner in Sage Mint & Cream */}
        <div className="bg-[#10B981]/15 border-2 border-[#10B981] rounded-3xl p-5 sm:p-6 text-[#FAF3E8]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10B981] text-[#120B0A] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono font-bold text-[11px] uppercase tracking-widest text-[#10B981]">
                GOLDEN-HOUR RESCUE COMPANION
              </p>
              <p className="font-sans text-sm sm:text-base text-[#FAF3E8] leading-relaxed mt-1.5">
                Hey—take a breath with me. Don&apos;t feel embarrassed and don&apos;t blame
                yourself. Scammers run rehearsed scripts on thousands of people every day. You
                caught it, and I&apos;m right here.
              </p>
            </div>
          </div>
        </div>

        {/* Conversational Check-In */}
        <div className="bg-[#FAF3E8] text-[#1A1110] rounded-3xl border-2 border-[#1A1110] hard-shadow-cream p-5 sm:p-8">
          <h2 className="font-editorial italic font-bold text-2xl sm:text-3xl text-[#1A1110] mb-4">
            Be honest with me—zero judgment, I promise. Where are things right now?
          </h2>

          {/* 3 Natural Reply Buttons */}
          <div className="grid grid-cols-1 gap-2.5 mb-6">
            <button
              type="button"
              onClick={() => selectSituation('talking')}
              className={`text-left px-4 py-3.5 rounded-2xl border-2 font-sans font-semibold text-sm sm:text-base transition-all cursor-pointer ${
                situation === 'talking'
                  ? 'bg-[#10B981] text-[#120B0A] border-[#1A1110] hard-shadow-blush'
                  : 'bg-white/75 border-[#1A1110]/20 hover:border-[#1A1110] text-[#1A1110]'
              }`}
            >
              “We&apos;re just talking — haven&apos;t sent money or photos”
            </button>

            <button
              type="button"
              onClick={() => selectSituation('money')}
              className={`text-left px-4 py-3.5 rounded-2xl border-2 font-sans font-semibold text-sm sm:text-base transition-all cursor-pointer ${
                situation === 'money'
                  ? 'bg-[#E89B25] text-[#120B0A] border-[#1A1110] hard-shadow-blush'
                  : 'bg-white/75 border-[#1A1110]/20 hover:border-[#1A1110] text-[#1A1110]'
              }`}
            >
              “I already sent them money...”
            </button>

            <button
              type="button"
              onClick={() => selectSituation('photos')}
              className={`text-left px-4 py-3.5 rounded-2xl border-2 font-sans font-semibold text-sm sm:text-base transition-all cursor-pointer ${
                situation === 'photos'
                  ? 'bg-[#D91E36] text-[#FAF3E8] border-[#1A1110] hard-shadow-blush'
                  : 'bg-white/75 border-[#1A1110]/20 hover:border-[#1A1110] text-[#1A1110]'
              }`}
            >
              “I sent private photos and they&apos;re threatening me”
            </button>
          </div>

          {/* ONE Calm, Focused Action Card at a Time */}
          {situation && (
            <div
              ref={actionCardRef}
              className="bg-[#120B0A] text-[#FAF3E8] rounded-2xl p-5 sm:p-6 border-2 border-[#1A1110] space-y-5 scroll-mt-20"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs uppercase tracking-widest text-[#10B981]">
                  STEP {stepIndex + 1} OF {totalSteps}
                </span>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className={`h-2 rounded-full transition-all ${
                        dot <= stepIndex ? 'w-6 bg-[#10B981]' : 'w-2 bg-[#FAF3E8]/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* SITUATION 1: JUST TALKING */}
              {situation === 'talking' && stepIndex === 0 && (
                <div className="space-y-3">
                  <h3 className="font-editorial italic font-bold text-2xl text-[#10B981]">
                    You&apos;re completely safe! Do NOT confront them—just go quiet.
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[#FAF3E8]/85 leading-relaxed">
                    Calling them out usually triggers guilt-trips or a faster sob story. You owe a
                    stranger zero explanation—just step back calmly.
                  </p>
                </div>
              )}

              {situation === 'talking' && stepIndex === 1 && (
                <div className="space-y-3">
                  <h3 className="font-editorial italic font-bold text-2xl text-[#FAF3E8]">
                    Copy a breezy exit line, then Block &amp; Report
                  </h3>
                  <div className="space-y-2.5">
                    {STALLING_SCRIPTS.map((script, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-3 bg-[#FAF3E8]/[0.07] border border-[#FAF3E8]/15 rounded-xl p-3.5"
                      >
                        <p className="font-sans text-sm text-[#FAF3E8]/90">“{script}”</p>
                        <button
                          type="button"
                          onClick={() => void handleCopy(script, idx)}
                          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF3E8]/10 hover:bg-[#FAF3E8]/20 font-mono text-xs cursor-pointer"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#10B981]" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="font-mono text-xs text-[#F7C5CC]">
                    Next: Mute notifications → Screenshot their profile → Block &amp; Report on the
                    app.
                  </p>
                </div>
              )}

              {situation === 'talking' && stepIndex === 2 && (
                <div className="space-y-3">
                  <h3 className="font-editorial italic font-bold text-2xl text-[#F7C5CC]">
                    Save your receipt for the group chat
                  </h3>
                  <p className="font-sans text-sm text-[#FAF3E8]/85">
                    Warn your friends so nobody else falls for the same script.
                  </p>
                  {result && (
                    <button
                      type="button"
                      onClick={() => void downloadReceiptPng(result)}
                      className="inline-flex items-center gap-2 bg-[#F7C5CC] text-[#1A1110] font-sans font-bold text-sm px-4 py-2.5 rounded-xl cursor-pointer"
                    >
                      <span>Download Stamped Receipt Card</span>
                    </button>
                  )}
                </div>
              )}

              {/* SITUATION 2: ALREADY SENT MONEY */}
              {situation === 'money' && stepIndex === 0 && (
                <div className="space-y-4">
                  <h3 className="font-editorial italic font-bold text-2xl text-[#E89B25]">
                    Stay calm—we&apos;re in the Golden Hour
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[#FAF3E8]/85 leading-relaxed">
                    Smart people fall for this every day. If we act right now, your bank still has a
                    shot at freezing the transfer before it&apos;s cashed out.
                  </p>
                  <a
                    href="tel:1930"
                    className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#10B981] hover:bg-[#0ea572] text-[#120B0A] font-sans font-extrabold text-base px-6 py-3.5 rounded-xl transition-colors"
                  >
                    <PhoneCall className="w-5 h-5" />
                    <span>Tap to Call 1930 (National Cybercrime Helpline)</span>
                  </a>
                </div>
              )}

              {situation === 'money' && stepIndex === 1 && (
                <div className="space-y-3">
                  <h3 className="font-editorial italic font-bold text-2xl text-[#FAF3E8]">
                    Let&apos;s file it officially &amp; alert your bank
                  </h3>
                  <p className="font-sans text-sm text-[#FAF3E8]/85">
                    Call your bank&apos;s fraud desk right now to freeze the transaction, and log it
                    on the official portals:
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href="https://cybercrime.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#FAF3E8] text-[#1A1110] font-sans font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl"
                    >
                      <span>cybercrime.gov.in</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://sancharsaathi.gov.in/sfc/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#F7C5CC] text-[#1A1110] font-sans font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl"
                    >
                      <span>Sanchar Saathi Chakshu</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {situation === 'money' && stepIndex === 2 && (
                <div className="space-y-3">
                  <h3 className="font-editorial italic font-bold text-2xl text-[#10B981]">
                    Keep your receipts (never delete the chat)
                  </h3>
                  <div className="space-y-2">
                    {[
                      { key: 'utr', label: 'Save the UTR / Transaction ID' },
                      { key: 'bank', label: 'Screenshot your bank / UPI statement' },
                      { key: 'chats', label: 'Screenshot the full chat & their profile handle' },
                    ].map((item) => {
                      const checked = evidenceChecks[item.key];
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() =>
                            setEvidenceChecks((prev) => ({
                              ...prev,
                              [item.key]: !prev[item.key],
                            }))
                          }
                          className="w-full flex items-center gap-3 bg-[#FAF3E8]/[0.07] border border-[#FAF3E8]/15 rounded-xl p-3 text-left cursor-pointer"
                        >
                          {checked ? (
                            <CheckSquare className="w-5 h-5 text-[#10B981] shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-[#FAF3E8]/50 shrink-0" />
                          )}
                          <span
                            className={`font-sans text-sm ${
                              checked ? 'line-through text-[#FAF3E8]/50' : 'text-[#FAF3E8]'
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SITUATION 3: SENT PRIVATE PHOTOS */}
              {situation === 'photos' && stepIndex === 0 && (
                <div className="space-y-3">
                  <h3 className="font-editorial italic font-bold text-2xl text-[#F7C5CC]">
                    Look at me: do NOT pay a single rupee
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[#FAF3E8]/85 leading-relaxed">
                    Paying never makes them delete it—it only tells them you&apos;ll pay more. They
                    lose all power when you stop responding.
                  </p>
                </div>
              )}

              {situation === 'photos' && stepIndex === 1 && (
                <div className="space-y-3">
                  <h3 className="font-editorial italic font-bold text-2xl text-[#FAF3E8]">
                    Let&apos;s lock your accounts down quietly
                  </h3>
                  <ul className="space-y-2 font-sans text-sm text-[#FAF3E8]/85 list-disc pl-5">
                    <li>Do NOT delete the chat—screenshot their username and every threat first.</li>
                    <li>Switch Instagram &amp; other socials to Private right now.</li>
                    <li>Hide your followers/following list and temporarily pause message requests.</li>
                  </ul>
                </div>
              )}

              {situation === 'photos' && stepIndex === 2 && (
                <div className="space-y-3">
                  <h3 className="font-editorial italic font-bold text-2xl text-[#10B981]">
                    Block the photos &amp; get safe help
                  </h3>
                  <p className="font-sans text-sm text-[#FAF3E8]/85">
                    StopNCII.org creates a private digital hash on your device to block intimate
                    images from being uploaded to Instagram or Facebook—without the photo ever
                    leaving your phone.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href="https://stopncii.org"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#10B981] text-[#120B0A] font-sans font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl"
                    >
                      <span>StopNCII.org</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="tel:1930"
                      className="inline-flex items-center gap-1.5 bg-[#FAF3E8] text-[#1A1110] font-sans font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call 1930</span>
                    </a>
                    <a
                      href="https://cybercrime.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#F7C5CC] text-[#1A1110] font-sans font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl"
                    >
                      <span>cybercrime.gov.in (Anonymous)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Step Progression Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-[#FAF3E8]/15">
                <button
                  type="button"
                  onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                  disabled={stepIndex === 0}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FAF3E8]/60 hover:text-[#FAF3E8] disabled:opacity-30 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {stepIndex < totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStepIndex((i) => Math.min(totalSteps - 1, i + 1))}
                    className="inline-flex items-center gap-1.5 bg-[#10B981] text-[#120B0A] font-sans font-bold text-xs sm:text-sm px-4 py-2 rounded-xl cursor-pointer"
                  >
                    <span>I did this</span>
                    <ArrowRight className="w-4 h-4" />
                    <span>Next Step</span>
                  </button>
                ) : (
                  <span className="font-mono text-xs text-[#10B981]">
                    You&apos;re doing great. Breathe.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Compact "Ask me what to reply..." input */}
          <form onSubmit={handleAskBestie} className="mt-6 pt-5 border-t-2 border-dashed border-[#1A1110]/15">
            <label className="block font-mono font-bold text-[11px] uppercase tracking-wider text-[#1A1110]/70 mb-2">
              Ask me what to reply...
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="e.g. They're asking why I stopped replying—what do I say?"
                className="flex-1 rounded-xl border-2 border-[#1A1110]/20 bg-white/85 px-3.5 py-2.5 font-sans text-sm text-[#1A1110] placeholder:text-[#1A1110]/40 focus:outline-none focus:border-[#D91E36]"
              />
              <button
                type="submit"
                disabled={asking}
                className="inline-flex items-center justify-center gap-1.5 bg-[#1A1110] hover:bg-[#D91E36] text-[#FAF3E8] font-sans font-bold text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
              >
                {asking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            {askAnswer && (
              <div
                ref={replyRef}
                className="mt-3 bg-[#10B981]/15 border border-[#10B981]/50 rounded-xl p-3.5 font-sans text-sm text-[#1A1110] leading-relaxed scroll-mt-20"
              >
                {askAnswer}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
