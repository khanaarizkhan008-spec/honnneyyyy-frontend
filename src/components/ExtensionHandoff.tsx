import React, { useState } from 'react';
import { Download, Check, Globe, Volume2, Sparkles } from 'lucide-react';
import { LipstickKissMark } from './LipstickKissMark';
import { downloadChromeExtensionZip } from '../utils/extensionZip';
import { playBestieAlert } from '../utils/soundAlert';

export const ExtensionHandoff: React.FC = () => {
  const [previewApp, setPreviewApp] = useState<'whatsapp' | 'instagram'>('whatsapp');
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadZip = async () => {
    await downloadChromeExtensionZip();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  return (
    <section className="px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-[#FAF3E8]/[0.05] border border-[#FAF3E8]/15 rounded-3xl p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[#E89B25]" />
            <span className="font-mono font-bold text-xs uppercase tracking-widest text-[#E89B25]">
              CHROME &amp; EDGE EXTENSION (V1.0)
            </span>
          </div>

          <h1 className="font-editorial italic font-bold text-3xl sm:text-4xl text-[#FAF3E8] mb-3">
            I can&apos;t sit beside you 24/7—so put me in your browser.
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#FAF3E8]/80 leading-relaxed mb-6">
            Add the Honnnneyyyy extension to Chrome or Edge. Next time someone slides into your
            WhatsApp Web, Instagram DMs, or Telegram Web acting a little too sweet, I&apos;ll play
            your <span className="text-[#F7C5CC] font-semibold">Honnnneyyyy</span> alert and tap
            you quietly on the shoulder.
          </p>

          {/* How It Works - 3 Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-[#1A1110] border border-[#FAF3E8]/15 rounded-2xl p-4">
              <p className="font-mono font-bold text-xs text-[#E89B25] mb-1">
                01 · DOWNLOAD &amp; UNZIP
              </p>
              <p className="font-sans text-xs text-[#FAF3E8]/80 leading-relaxed">
                Grab the starter `.zip` below and extract it to any folder on your computer.
              </p>
            </div>
            <div className="bg-[#1A1110] border border-[#FAF3E8]/15 rounded-2xl p-4">
              <p className="font-mono font-bold text-xs text-[#F7C5CC] mb-1">
                02 · LOAD IN CHROME
              </p>
              <p className="font-sans text-xs text-[#FAF3E8]/80 leading-relaxed">
                Open <span className="font-mono">chrome://extensions</span>, turn on Developer
                Mode, and click <span className="font-semibold">Load unpacked</span>.
              </p>
            </div>
            <div className="bg-[#1A1110] border border-[#FAF3E8]/15 rounded-2xl p-4">
              <p className="font-mono font-bold text-xs text-[#10B981] mb-1">
                03 · LIVE CHAT WATCH
              </p>
              <p className="font-sans text-xs text-[#FAF3E8]/80 leading-relaxed">
                Watches WhatsApp Web, IG DMs &amp; Telegram locally—plays your alert + pops a card
                when 2+ honey-trap signals appear.
              </p>
            </div>
          </div>

          {/* Interactive Live Preview */}
          <div className="bg-[#1A1110] border-2 border-[#FAF3E8]/15 rounded-2xl overflow-hidden mb-6">
            <div className="bg-[#120B0A] px-4 py-2.5 border-b border-[#FAF3E8]/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D91E36]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E89B25]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="ml-2 font-mono text-[11px] text-[#FAF3E8]/50">
                  {previewApp === 'whatsapp' ? 'web.whatsapp.com' : 'instagram.com/direct/inbox'}
                </span>
              </div>

              <div className="flex bg-[#FAF3E8]/10 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewApp('whatsapp')}
                  className={`px-2.5 py-1 rounded-md font-mono text-[11px] cursor-pointer transition-colors ${
                    previewApp === 'whatsapp'
                      ? 'bg-[#FAF3E8] text-[#1A1110] font-bold'
                      : 'text-[#FAF3E8]/70'
                  }`}
                >
                  WhatsApp Web
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewApp('instagram')}
                  className={`px-2.5 py-1 rounded-md font-mono text-[11px] cursor-pointer transition-colors ${
                    previewApp === 'instagram'
                      ? 'bg-[#FAF3E8] text-[#1A1110] font-bold'
                      : 'text-[#FAF3E8]/70'
                  }`}
                >
                  Instagram DM
                </button>
              </div>
            </div>

            <div className="relative p-4 sm:p-5 min-h-[195px] flex flex-col justify-between gap-4">
              <div className="space-y-2.5 max-w-sm">
                <div className="inline-block bg-[#FAF3E8]/10 text-[#FAF3E8]/90 rounded-2xl rounded-tl-sm px-3.5 py-2 font-sans text-xs sm:text-sm">
                  {previewApp === 'whatsapp'
                    ? 'Babe move to my private Telegram right now, keep us secret from your friends...'
                    : 'Omg wrong number haha! Anyway I trade crypto in Singapore, check this link...'}
                </div>
              </div>

              {/* Floating Cherry Lipstick Shield */}
              <div className="self-end bg-[#FAF3E8] text-[#1A1110] border-2 border-[#D91E36] rounded-2xl p-3 max-w-xs hard-shadow-cherry flex items-start gap-2.5">
                <LipstickKissMark className="w-9 h-6 shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#D91E36]">
                    HONNNNEYYYY!
                  </p>
                  <p className="font-sans text-xs font-semibold text-[#1A1110] mt-0.5">
                    {previewApp === 'whatsapp'
                      ? 'Bestie, pause. Spotted: Off-app pivot, Secrecy request.'
                      : 'Bestie, pause. Spotted: Scripted opener, Crypto hook.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming v1.1 Note */}
          <div className="bg-[#F7C5CC]/10 border border-[#F7C5CC]/30 rounded-2xl p-4 mb-6 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#F7C5CC] shrink-0 mt-0.5" />
            <p className="font-sans text-xs sm:text-sm text-[#FAF3E8]/85 leading-relaxed">
              <span className="font-bold text-[#F7C5CC]">What&apos;s inside v1.0 vs. v1.1:</span>{' '}
              v1.0 already watches your chats locally, plays your Honnnneyyyy audio alert, and pops
              up the shoulder-tap card. Upcoming <span className="font-mono">v1.1</span> adds full
              on-page Gemini AI rewriting and inline screenshot reading right inside the chat window.
            </p>
          </div>

          {/* Actions: Test Sound + Download ZIP */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => void playBestieAlert(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1110] hover:bg-[#D91E36] text-[#FAF3E8] font-sans font-bold text-sm px-5 py-3.5 rounded-2xl border-2 border-[#FAF3E8]/25 transition-colors cursor-pointer min-h-[44px]"
            >
              <Volume2 className="w-4 h-4 text-[#F7C5CC]" />
              <span>Test Notification Sound</span>
            </button>

            <button
              type="button"
              onClick={() => void handleDownloadZip()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#FAF3E8] hover:bg-[#F7C5CC] text-[#1A1110] font-sans font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl border-2 border-[#1A1110] hard-shadow-cream transition-colors cursor-pointer min-h-[44px]"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Downloaded honnnneyyyy-chrome-extension.zip!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#D91E36]" />
                  <span>Add Me to Chrome (Download .ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
