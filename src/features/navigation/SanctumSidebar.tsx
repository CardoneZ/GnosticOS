import React, { useState, useEffect } from 'react';
import {
  Eye,
  Compass,
  Network,
  BookOpen,
  BookMarked,
  Flame,
  Lock,
  Moon,
  ShieldCheck,
  Disc,
  Sparkles,
  BarChart3,
  Command,
  Feather,
  Sun,
  Orbit,
} from 'lucide-react';
import { getCurrentMagickalTiming, MagickalTiming } from '../ephemeris/planetaryHours';

export type ActiveView =
  | 'portal'
  | 'meditation'
  | 'astrolabe'
  | 'illumination'
  | 'hermetica'
  | 'tablets'
  | 'tree'
  | 'grimoire'
  | 'journal'
  | 'crucible'
  | 'chaos'
  | 'insights';

interface SanctumSidebarProps {
  currentView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  isUnlocked: boolean;
  onLock: () => void;
  onOpenCommandPalette?: () => void;
}

export const SanctumSidebar: React.FC<SanctumSidebarProps> = ({
  currentView,
  onSelectView,
  isUnlocked,
  onLock,
  onOpenCommandPalette,
}) => {
  const [timing, setTiming] = useState<MagickalTiming | null>(null);

  useEffect(() => {
    setTiming(getCurrentMagickalTiming());
    const interval = setInterval(() => {
      setTiming(getCurrentMagickalTiming());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'portal', label: 'Gazing Portal', icon: Eye, badge: 'WebGL' },
    { id: 'meditation', label: 'Lucifer Meditation', icon: Sun, badge: '5 min' },
    { id: 'astrolabe', label: 'Natal Astrolabe', icon: Orbit, badge: 'Crowley·72' },
    { id: 'illumination', label: 'Illumination Forge', icon: Flame, badge: 'Will·Desire' },
    { id: 'hermetica', label: 'The Hermetica', icon: Feather, badge: 'Thoth' },
    { id: 'tablets', label: '9x9 Tablet Forge', icon: Compass, badge: 'Connolly' },
    { id: 'tree', label: 'The Dual Tree', icon: Network, badge: '22 Tunnels' },
    { id: 'grimoire', label: 'Grimoire Library', icon: BookMarked, badge: '72 Goetia' },
    { id: 'journal', label: 'Alchemical Journal', icon: BookOpen, badge: 'E2EE' },
    { id: 'crucible', label: '11 Points Crucible', icon: Flame, badge: 'Ford' },
    { id: 'chaos', label: 'Chaos Sigil Forge', icon: Sparkles, badge: 'Spare' },
    { id: 'insights', label: 'Esoteric Analytics', icon: BarChart3, badge: 'Local' },
  ] as const;

  return (
    <aside className="w-64 h-full bg-neutral-950 border-r border-neutral-800/80 flex flex-col justify-between p-4 select-none shrink-0 z-20">
      <div className="flex flex-col gap-6">
        {/* Grimoire Brand */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-purple-800 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500/40">
            <Disc className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-decorative text-lg font-bold tracking-wider text-white">
              GNOSTIC<span className="text-red-500">OS</span>
            </h1>
            <p className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
              Nightside System
            </p>
          </div>
        </div>

        {/* Global Command Palette Trigger Button */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-900/90 hover:bg-neutral-800/90 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-all shadow-sm group"
          >
            <div className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
              <span>Sanctum Palette</span>
            </div>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-black border border-neutral-800 text-amber-300 font-bold">
              Ctrl+K
            </kbd>
          </button>
        )}

        {/* Live Ephemeris Status Capsule */}
        <div className="p-3 rounded-lg bg-black/70 border border-purple-950/60 flex flex-col gap-1.5 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
            <span className="flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-purple-400" /> Luna
            </span>
            <span className="text-neutral-400">
              {timing ? `${timing.lunarState.phaseLabel} (${timing.lunarState.illuminationPct}%)` : 'Calculating...'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>Hour:</span>
            <span className="text-amber-400 font-semibold capitalize">
              {timing ? `${timing.currentHour.planet} (${timing.currentHour.isNocturnal ? 'Night' : 'Day'})` : '...'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-sans transition-all text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-red-950/80 to-purple-950/50 border border-red-700/60 text-white font-semibold shadow-[0_0_15px_-4px_rgba(220,38,38,0.5)]'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-red-400' : 'text-neutral-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-neutral-500 border border-neutral-800">
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Vault Security Status */}
      <div className="pt-4 border-t border-neutral-800/80 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-mono px-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isUnlocked ? 'Vault Sealed (AES-256)' : 'Vault Locked'}</span>
          </div>
        </div>

        <button
          onClick={onLock}
          className="w-full flex items-center justify-center gap-2 py-2 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-xs font-mono transition-all"
        >
          <Lock className="w-3.5 h-3.5 text-neutral-500" />
          <span>Lock Sanctum Vault</span>
        </button>
      </div>
    </aside>
  );
};

export default SanctumSidebar;
