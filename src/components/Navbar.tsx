import React from 'react';
import { NavLink } from 'react-router-dom';
import { EyeOff, RotateCcw } from 'lucide-react';
import { LipstickKissMark } from './LipstickKissMark';

interface NavbarProps {
  onReplayIntro: () => void;
  onQuickCover: () => void;
  onClearAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReplayIntro,
  onQuickCover,
  onClearAll,
}) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-full font-mono text-xs font-semibold transition-colors ${
      isActive
        ? 'bg-[#D91E36] text-[#FAF3E8]'
        : 'text-[#FAF3E8]/75 hover:text-[#FAF3E8] hover:bg-[#FAF3E8]/10'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#120B0A]/90 backdrop-blur-md border-b border-[#FAF3E8]/10">
      <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onReplayIntro}
          title="Replay kiss-stamp intro"
          className="group flex items-center gap-2 text-left focus:outline-none cursor-pointer min-h-[44px]"
        >
          <LipstickKissMark className="w-9 h-6 transition-transform group-hover:scale-110" />
          <span className="font-editorial italic font-bold text-xl tracking-tight text-[#FAF3E8]">
            Hon<span className="text-[#E89B25]">nn</span>neyyyy
          </span>
        </button>

        {/* Desktop / Tablet Page Links */}
        <nav aria-label="Primary pages" className="hidden sm:flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/check" className={linkClass}>
            Check DM
          </NavLink>
          <NavLink to="/safety" className={linkClass}>
            Safety
          </NavLink>
          <NavLink to="/extension" className={linkClass}>
            Extension
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onQuickCover}
            title="Quickly hide screen behind a recipe page if someone walks by"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono font-medium bg-[#FAF3E8]/5 border border-[#FAF3E8]/15 text-[#FAF3E8]/80 hover:border-[#E89B25]/60 hover:text-[#E89B25] transition-colors cursor-pointer min-h-[38px]"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Cover</span>
          </button>

          <button
            type="button"
            onClick={onClearAll}
            title="Clear all pasted chats, screenshots, and saved data"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono font-medium bg-[#FAF3E8]/5 border border-[#FAF3E8]/15 text-[#FAF3E8]/75 hover:bg-[#D91E36]/20 hover:border-[#D91E36]/50 hover:text-[#FAF3E8] transition-colors cursor-pointer min-h-[38px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </header>
  );
};
