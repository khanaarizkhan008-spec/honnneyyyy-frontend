import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, MessageSquareText, HeartHandshake, Globe } from 'lucide-react';

export const MobileDock: React.FC = () => {
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-center gap-1 py-2.5 px-1.5 rounded-full font-sans font-bold text-[11px] transition-colors min-h-[44px] ${
      isActive
        ? 'bg-[#D91E36] text-[#FAF3E8]'
        : 'text-[#FAF3E8]/80 hover:bg-[#FAF3E8]/10'
    }`;

  return (
    <nav
      aria-label="Quick thumb navigation"
      className="sm:hidden fixed bottom-3 inset-x-3 z-40 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="bg-[#1A1110]/95 backdrop-blur-md border border-[#FAF3E8]/20 rounded-full p-1.5 shadow-2xl grid grid-cols-4 gap-1">
        <NavLink to="/" end className={tabClass}>
          <Sparkles className="w-3.5 h-3.5 text-[#F7C5CC] shrink-0" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/check" className={tabClass}>
          <MessageSquareText className="w-3.5 h-3.5 text-[#E89B25] shrink-0" />
          <span>Check</span>
        </NavLink>

        <NavLink to="/safety" className={tabClass}>
          <HeartHandshake className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
          <span>Safety</span>
        </NavLink>

        <NavLink to="/extension" className={tabClass}>
          <Globe className="w-3.5 h-3.5 text-[#F7C5CC] shrink-0" />
          <span>Ext</span>
        </NavLink>
      </div>
    </nav>
  );
};
