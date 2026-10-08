import React, { useState, useMemo } from 'react';
import {
  generateTablet,
  CONNOLLY_CIPHER,
  ENGLISH_ORDINAL,
  CipherDefinition,
} from './gematria';
import {
  Compass,
  Copy,
  Check,
  Flame,
  Wind,
  Droplets,
  Mountain,
  Shield,
} from 'lucide-react';
import GoetiaForge from './GoetiaForge';
import VbrkVault from './VbrkVault';
import { EntityData } from '../../platform/vault';
import { GrimoireEntity } from '../../db/grimoireSeeds';
import { Crown } from 'lucide-react';

interface TabletWorkbenchProps {
  entities?: EntityData[];
  onTuneToPortal?: (spirit: GrimoireEntity) => void;
}

export const TabletWorkbench: React.FC<TabletWorkbenchProps> = ({
  entities = [],
  onTuneToPortal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'goetia' | 'vbrk'>('matrix');
  const [intentInput, setIntentInput] = useState<string>('Leviathan');
  const [cipherMode, setCipherMode] = useState<'connolly' | 'ordinal'>('connolly');
  const [copied, setCopied] = useState<boolean>(false);
  const [showSigilPath, setShowSigilPath] = useState<boolean>(true);

  const activeCipher: CipherDefinition =
    cipherMode === 'connolly' ? CONNOLLY_CIPHER : ENGLISH_ORDINAL;

  const tablet = useMemo(() => {
    try {
      return generateTablet(intentInput.trim() || 'A', { cipher: activeCipher });
    } catch (err) {
      console.warn('Tablet generation error:', err);
      return null;
    }
  }, [intentInput, activeCipher]);

  const handleCopyMatrix = () => {
    if (!tablet) return;
    navigator.clipboard.writeText(JSON.stringify(tablet.matrix, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getElementColor = (el?: string) => {
    switch (el) {
      case 'air':
        return 'bg-amber-950/20 text-amber-200 border-amber-900/30';
      case 'fire':
        return 'bg-red-950/30 text-red-200 border-red-900/40';
      case 'water':
        return 'bg-blue-950/25 text-blue-200 border-blue-900/30';
      case 'earth':
        return 'bg-emerald-950/20 text-emerald-200 border-emerald-900/30';
      default:
        return 'bg-neutral-900/40 text-neutral-300 border-neutral-800';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-neutral-200 overflow-hidden">
      {/* Top Tab Bar */}
      <div className="px-6 pt-4 pb-2 border-b border-neutral-900 bg-neutral-950/60 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              activeSubTab === 'matrix'
                ? 'bg-neutral-900 border border-red-700/60 text-white font-bold shadow-[0_0_12px_rgba(220,38,38,0.3)]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-red-500" />
            9x9 Connolly Magickal Tablet
          </button>

          <button
            onClick={() => setActiveSubTab('goetia')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              activeSubTab === 'goetia'
                ? 'bg-neutral-900 border border-amber-600/70 text-amber-200 font-bold shadow-[0_0_12px_rgba(217,119,6,0.35)]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            72 Goetia Sigils &amp; Seals Forge
          </button>

          <button
            onClick={() => setActiveSubTab('vbrk')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              activeSubTab === 'vbrk'
                ? 'bg-neutral-900 border border-purple-700/60 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            VBRK &amp; Secret Demonic Name Vault
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeSubTab === 'goetia' ? (
        <GoetiaForge
          onLoadIntoTablet={(name) => {
            setIntentInput(name);
            setActiveSubTab('matrix');
          }}
          onTuneToPortal={onTuneToPortal}
        />
      ) : activeSubTab === 'vbrk' ? (
        <VbrkVault entities={entities} />
      ) : (
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
          {/* Header bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-wider text-neutral-100 flex items-center gap-3">
                <Compass className="w-6 h-6 text-red-500" />
                9x9 Magickal Tablet Workbench
              </h1>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Richard Dukanté & S. Connolly Demonolatry Gematria Engine • 81-Square Elemental Cross
              </p>
            </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded bg-neutral-900 p-1 border border-neutral-800 text-xs font-mono">
            <button
              onClick={() => setCipherMode('connolly')}
              className={`px-3 py-1 rounded transition-all ${
                cipherMode === 'connolly'
                  ? 'bg-red-950 border border-red-600 text-white font-medium shadow-[0_0_10px_rgba(220,38,38,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Connolly Cipher (A–Z)
            </button>
            <button
              onClick={() => setCipherMode('ordinal')}
              className={`px-3 py-1 rounded transition-all ${
                cipherMode === 'ordinal'
                  ? 'bg-purple-950 border border-purple-600 text-white font-medium'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              English Ordinal (1–26)
            </button>
          </div>

          <button
            onClick={handleCopyMatrix}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Matrix' : 'Copy 9x9'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Input and Gematria Details */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col gap-3">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Daemon Name or Intent Statement:
            </label>
            <input
              type="text"
              value={intentInput}
              onChange={(e) => setIntentInput(e.target.value)}
              placeholder="e.g. Leviathan, Satan, Belial..."
              className="w-full bg-black/80 border border-neutral-700 rounded-lg px-3.5 py-2.5 font-serif text-lg text-neutral-100 placeholder:text-neutral-600 focus:border-red-500 focus:outline-none shadow-inner"
            />
            <div className="flex flex-wrap gap-1.5">
              {['Satan', 'Lucifer', 'Leviathan', 'Belial', 'Flereous', 'Unsere', 'Ahriman'].map(
                (name) => (
                  <button
                    key={name}
                    onClick={() => setIntentInput(name)}
                    className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400 hover:text-white hover:border-neutral-700"
                  >
                    {name}
                  </button>
                ),
              )}
            </div>
          </div>

          {tablet && (
            <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col gap-4">
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-300 border-b border-neutral-800 pb-2">
                Gematria Calculation & Breakdown
              </h2>

              {/* Letter breakdown pills */}
              <div className="flex flex-wrap gap-1.5">
                {tablet.gematria.letters.map((l, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center bg-black/60 border border-neutral-800 rounded px-2 py-1 min-w-[34px]"
                  >
                    <span className="font-serif font-bold text-sm text-neutral-200">
                      {l.rawChar}
                    </span>
                    <span className="font-mono text-[10px] text-amber-400 font-semibold">
                      {l.value}
                    </span>
                    {(l.char === 'T' || l.char === 'Z') && (
                      <span className="text-[8px] font-mono text-purple-400">
                        {l.isInitial ? 'prim' : 'sec'}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Calculation Totals */}
              <div className="grid grid-cols-2 gap-3 bg-black/60 p-3 rounded-lg border border-neutral-800 text-xs font-mono">
                <div>
                  <span className="text-neutral-500 block text-[10px]">TOTAL VALUE</span>
                  <span className="text-xl font-bold text-red-400">
                    {tablet.gematria.total}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">REDUCTION CHAIN</span>
                  <span className="text-neutral-200 font-bold">
                    {tablet.gematria.reductionChain.join(' → ')}
                  </span>
                </div>
              </div>

              {/* Sephiroth & Divinity Rulership */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-950/40 via-purple-950/30 to-black border border-red-900/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                    Ruling Sphere & Divinity
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    {tablet.gematria.rulingSephira.name}
                    <span className="text-xs font-sans text-neutral-400 font-normal">
                      (Sphere {tablet.gematria.rulingSephira.number})
                    </span>
                  </h3>
                  <p className="font-mono text-xs text-amber-300 font-semibold mt-0.5">
                    Daemon: {tablet.gematria.rulingSephira.divinity}
                  </p>
                </div>
                {tablet.gematria.resonances.length > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-purple-400 block uppercase">
                      Resonances
                    </span>
                    <span className="font-mono text-xs text-purple-300">
                      {tablet.gematria.resonances.map((r) => r.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Cross Sequence */}
              <div className="text-xs font-mono text-neutral-400">
                <span className="block text-[10px] text-neutral-500 mb-1">
                  EQUAL-ARMED CROSS SEQUENCE:
                </span>
                <span className="tracking-widest text-neutral-200 font-bold bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                  {tablet.crossSequence.join(' • ')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 81-Square Tablet Grid & Sigil Path */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-xl border border-neutral-800 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Wind className="w-3.5 h-3.5" /> NE Air
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <Flame className="w-3.5 h-3.5" /> SE Fire
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <Droplets className="w-3.5 h-3.5" /> SW Water
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Mountain className="w-3.5 h-3.5" /> NW Earth
              </span>
            </div>

            <button
              onClick={() => setShowSigilPath(!showSigilPath)}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                showSigilPath
                  ? 'bg-purple-950 border border-purple-500 text-purple-200'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
              }`}
            >
              {showSigilPath ? 'Hide Sigil Line' : 'Show Sigil Line'}
            </button>
          </div>

          {/* 9x9 Grid Visualization */}
          {tablet ? (
            <div className="relative inline-block p-2 rounded-xl bg-black border border-neutral-800 shadow-2xl">
              <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
                {tablet.cells.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isCenter = cell.role === 'center';
                    const isCross = cell.role === 'cross-row' || cell.role === 'cross-col';
                    const isSigilNode = cell.sigilSteps.length > 0;

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`relative w-8 h-8 sm:w-11 sm:h-11 flex flex-col items-center justify-center rounded border transition-all ${
                          isCenter
                            ? 'bg-red-950/80 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.7)] font-black z-10'
                            : isCross
                            ? 'bg-purple-950/50 border-purple-800/80 text-purple-100 font-bold'
                            : getElementColor(cell.element)
                        } ${isSigilNode ? 'ring-1 ring-amber-400/70' : ''}`}
                      >
                        <span className="font-serif text-sm sm:text-base leading-none">
                          {cell.char}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-mono opacity-60 leading-none mt-0.5">
                          {cell.value}
                        </span>

                        {/* Sigil Node Badge */}
                        {isSigilNode && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 text-black text-[7px] font-bold font-mono flex items-center justify-center">
                            {cell.sigilSteps[0] + 1}
                          </div>
                        )}
                      </div>
                    );
                  }),
                )}
              </div>

              {/* Sigil Pathway SVG Overlay */}
              {showSigilPath && tablet.sigilPath.length > 1 && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none p-2"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="2,1"
                    points={tablet.sigilPath
                      .map((p) => {
                        // Calculate percentage coordinate for each 9x9 cell center
                        const x = (p.col + 0.5) * (100 / 9);
                        const y = (p.row + 0.5) * (100 / 9);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                  {tablet.sigilPath.map((p, i) => {
                    const cx = (p.col + 0.5) * (100 / 9);
                    const cy = (p.row + 0.5) * (100 / 9);
                    return (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={i === 0 ? '2' : '1.4'}
                        fill={i === 0 ? '#ef4444' : '#f59e0b'}
                      />
                    );
                  })}
                </svg>
              )}
            </div>
          ) : (
            <p className="text-neutral-500 font-mono text-xs">Enter a valid statement</p>
          )}

          {tablet && (
            <p className="text-[11px] font-mono text-neutral-500 mt-4 text-center max-w-lg">
              Sigil Path traces {tablet.sigilPath.length} steps through the 81 squares via nearest
              Chebyshev glyph attraction. Starting node: Red circle.
            </p>
          )}
        </div>
      </div>
    </div>
  )}
</div>
);
};

export default TabletWorkbench;
