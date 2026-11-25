import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import type { CheckResult } from './types';
import { clearAllStoredData } from './utils/geminiClient';
import { IntroSequence } from './components/IntroSequence';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CoViewingChecker } from './components/CoViewingChecker';
import { RescueCompanion } from './components/RescueCompanion';
import { ExtensionHandoff } from './components/ExtensionHandoff';
import { MobileDock } from './components/MobileDock';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function AppShell() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [coverMode, setCoverMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);

  const handleClearAll = () => {
    setInputText('');
    setResult(null);
    clearAllStoredData();
  };

  if (coverMode) {
    return (
      <div className="min-h-screen bg-[#FAF3E8] text-[#1A1110] px-5 py-10 max-w-xl mx-auto">
        <div className="flex items-center justify-between border-b border-[#1A1110]/15 pb-4 mb-6">
          <span className="font-editorial italic font-bold text-2xl">
            Sunday Kitchen Notes
          </span>
          <button
            type="button"
            onClick={() => setCoverMode(false)}
            className="font-mono text-xs px-3 py-1.5 rounded-full border border-[#1A1110]/25 hover:bg-[#1A1110] hover:text-[#FAF3E8] cursor-pointer"
          >
            Back
          </button>
        </div>
        <h1 className="font-editorial font-bold text-3xl mb-3">
          Brown Butter Vanilla Bean Shortbread
        </h1>
        <p className="font-sans text-sm text-[#1A1110]/80 leading-relaxed mb-6">
          1 cup unsalted butter, 1/2 cup powdered sugar, 2 cups all-purpose flour, 1 tsp vanilla
          bean paste, and a pinch of flaky sea salt.
        </p>
        <ol className="list-decimal pl-5 space-y-2.5 font-sans text-sm text-[#1A1110]/85">
          <li>Brown the butter gently in a light skillet until nutty and golden.</li>
          <li>Let cool for 15 minutes, then whisk in powdered sugar and vanilla.</li>
          <li>Fold in flour and salt, chill 30 minutes, and bake at 175°C for 14 minutes.</li>
        </ol>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#120B0A] text-[#FAF3E8] paper-grain flex flex-col pb-20 sm:pb-0">
      <ScrollToTop />
      {showIntro && <IntroSequence onComplete={() => setShowIntro(false)} />}

      <Navbar
        onReplayIntro={() => setShowIntro(true)}
        onQuickCover={() => setCoverMode(true)}
        onClearAll={handleClearAll}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HeroSection
                onStartCheck={() => navigate('/check')}
                onOpenRescueNow={() => navigate('/safety')}
              />
            }
          />
          <Route
            path="/check"
            element={
              <CoViewingChecker
                inputText={inputText}
                setInputText={setInputText}
                result={result}
                onResultReady={(next) => setResult(next)}
                onOpenSafety={() => navigate('/safety')}
              />
            }
          />
          <Route
            path="/safety"
            element={<RescueCompanion visible={true} result={result} />}
          />
          <Route path="/extension" element={<ExtensionHandoff />} />
        </Routes>
      </main>

      <footer className="border-t border-[#FAF3E8]/10 py-6 px-4 text-center">
        <p className="font-mono text-xs text-[#FAF3E8]/50">
          Honnnneyyyy — Private on-device screenshot reading, zero-shame rescue.
        </p>
      </footer>

      <MobileDock />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
