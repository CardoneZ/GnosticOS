import React, { useState, useMemo } from 'react';
import { GOETIA_72_SPIRITS, GrimoireEntity } from '../../db/grimoireSeeds';
import { playEnnChantTone } from '../audio/audioManager';
import { generateTablet } from './gematria';
import SacredSigil, { getGoetiaSvgPath } from '../sigils/SacredSigil';
import SanctumDropdown from '../ui/SanctumDropdown';
import {
  Flame,
  Droplets,
  Wind,
  Mountain,
  Crown,
  Search,
  Volume2,
  Copy,
  Check,
  Compass,
  Eye,
  Download,
  Sparkles,
} from 'lucide-react';

interface GoetiaForgeProps {
  onLoadIntoTablet?: (name: string) => void;
  onTuneToPortal?: (spirit: GrimoireEntity) => void;
}

export const GoetiaForge: React.FC<GoetiaForgeProps> = ({
  onLoadIntoTablet,
  onTuneToPortal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');
  const [activeSpirit, setActiveSpirit] = useState<GrimoireEntity>(GOETIA_72_SPIRITS[0]);
  const [copiedEnn, setCopiedEnn] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<number | null>(null);
  const [sealMode, setSealMode] = useState<'authentic_vector' | 'kamea_circle'>('authentic_vector');

  // Filtered spirit list
  const filteredSpirits = useMemo(() => {
    return GOETIA_72_SPIRITS.filter((spirit) => {
      const matchSearch =
        spirit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (spirit.enn && spirit.enn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        spirit.goeticNumber?.toString() === searchTerm.trim() ||
        spirit.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRank =
        selectedRank === 'all' ||
        spirit.rank?.toLowerCase().includes(selectedRank.toLowerCase());

      const matchElement =
        selectedElement === 'all' ||
        spirit.element?.toLowerCase() === selectedElement.toLowerCase();

      const matchPurpose =
        selectedPurpose === 'all' ||
        spirit.purpose?.toLowerCase() === selectedPurpose.toLowerCase();

      return matchSearch && matchRank && matchElement && matchPurpose;
    });
  }, [searchTerm, selectedRank, selectedElement, selectedPurpose]);

  // Compute a live sacred geometric sigil for the active spirit
  const activeTablet = useMemo(() => {
    return generateTablet(activeSpirit.name);
  }, [activeSpirit]);

  const handleCopyEnn = (spirit: GrimoireEntity) => {
    if (!spirit.enn) return;
    navigator.clipboard.writeText(spirit.enn);
    setCopiedEnn(spirit.id);
    setTimeout(() => setCopiedEnn(null), 2000);
  };

  const handlePlayEnn = (spirit: GrimoireEntity) => {
    if (isPlayingAudio === spirit.id) return;
    setIsPlayingAudio(spirit.id);

    // Pick musical key according to element
    let note = 'D';
    if (spirit.element === 'fire') note = 'C';
    else if (spirit.element === 'water') note = 'G#';
    else if (spirit.element === 'air') note = 'E';
    else if (spirit.element === 'earth') note = 'B#';

    // Tone synthesis
    const stopTone = playEnnChantTone(note, 3.2, () => {
      setIsPlayingAudio(null);
    });

    // Also speak enn softly if speech is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && spirit.enn) {
      try {
        const u = new SpeechSynthesisUtterance(spirit.enn);
        u.rate = 0.85;
        u.pitch = 0.7;
        u.volume = 0.55;
        window.speechSynthesis.speak(u);
      } catch {
        // speech fallback
      }
    }

    setTimeout(() => {
      stopTone();
      setIsPlayingAudio(null);
    }, 3500);
  };

  const handleDownloadSvg = () => {
    if (sealMode === 'authentic_vector') {
      const svgPath = getGoetiaSvgPath(activeSpirit.goeticNumber || activeSpirit.slug);
      if (svgPath) {
        const link = document.createElement('a');
        link.href = svgPath;
        link.download = `Goetia_${activeSpirit.goeticNumber}_${activeSpirit.name}_Authentic_Seal.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
    }
    const svgElement = document.getElementById(`goetia-seal-${activeSpirit.id}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Goetia_${activeSpirit.goeticNumber}_${activeSpirit.name}_Kamea_Seal.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getElementBadge = (el?: string) => {
    switch (el) {
      case 'fire':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-red-400 bg-red-950/60 border border-red-900/60 px-2 py-0.5 rounded">
            <Flame className="w-3 h-3 text-red-500" /> Fire
          </span>
        );
      case 'water':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-blue-400 bg-blue-950/60 border border-blue-900/60 px-2 py-0.5 rounded">
            <Droplets className="w-3 h-3 text-blue-400" /> Water
          </span>
        );
      case 'air':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-900/60 px-2 py-0.5 rounded">
            <Wind className="w-3 h-3 text-amber-400" /> Air
          </span>
        );
      case 'earth':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded">
            <Mountain className="w-3 h-3 text-emerald-400" /> Earth
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
            Spirit
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-black text-neutral-200">
      {/* Spirits Sidebar List */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-neutral-800 bg-neutral-950/80">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-neutral-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <h2 className="font-serif text-sm font-bold tracking-wider text-neutral-100 uppercase">
                72 Goetic Spirits
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
              {filteredSpirits.length} / 72
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search spirit, enn, number..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 pl-9 text-xs font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
            />
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Quick Filter Selectors (Sanctum Dropdowns) */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
            <SanctumDropdown
              options={[
                { value: 'all', label: 'All Ranks' },
                { value: 'King', label: 'King' },
                { value: 'Duke', label: 'Duke' },
                { value: 'Prince', label: 'Prince' },
                { value: 'Marquis', label: 'Marquis' },
                { value: 'President', label: 'President' },
                { value: 'Earl', label: 'Earl' },
                { value: 'Knight', label: 'Knight' },
              ]}
              value={selectedRank}
              onChange={setSelectedRank}
              width="w-full"
            />

            <SanctumDropdown
              options={[
                { value: 'all', label: 'All Elements' },
                { value: 'fire', label: 'Fire', badge: '🜂' },
                { value: 'water', label: 'Water', badge: '🜄' },
                { value: 'air', label: 'Air', badge: '🜁' },
                { value: 'earth', label: 'Earth', badge: '🜃' },
              ]}
              value={selectedElement}
              onChange={setSelectedElement}
              width="w-full"
            />

            <SanctumDropdown
              options={[
                { value: 'all', label: 'All Offices' },
                { value: 'enlightenment', label: 'Enlightenment' },
                { value: 'magick', label: 'Magick' },
                { value: 'protection', label: 'Protection' },
                { value: 'divination', label: 'Divination' },
                { value: 'wealth', label: 'Wealth' },
                { value: 'healing', label: 'Healing' },
                { value: 'vengeance', label: 'Vengeance' },
              ]}
              value={selectedPurpose}
              onChange={setSelectedPurpose}
              width="w-full"
            />
          </div>
        </div>

        {/* Scrollable Spirit Grid / List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
          {filteredSpirits.map((spirit) => {
            const isSelected = activeSpirit.id === spirit.id;
            return (
              <button
                key={spirit.id}
                onClick={() => setActiveSpirit(spirit)}
                className={`w-full text-left p-3 flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-red-950/40 border-l-4 border-l-red-600 text-white'
                    : 'hover:bg-neutral-900/60 text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold ${
                      isSelected
                        ? 'bg-red-900 text-amber-200 border border-amber-600/50'
                        : 'bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    {spirit.goeticNumber}
                  </div>
                  <div>
                    <div className="font-serif font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                      {spirit.name}
                      <span className="text-[10px] font-mono font-normal text-neutral-500">
                        ({spirit.rank})
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 truncate max-w-[170px]">
                      {spirit.enn}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {spirit.element === 'fire' && <Flame className="w-3.5 h-3.5 text-red-500" />}
                  {spirit.element === 'water' && <Droplets className="w-3.5 h-3.5 text-blue-400" />}
                  {spirit.element === 'air' && <Wind className="w-3.5 h-3.5 text-amber-400" />}
                  {spirit.element === 'earth' && <Mountain className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spirit Focus Details & Sacred Seal Forge */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/80 font-mono text-xs font-bold">
                SPIRIT #{activeSpirit.goeticNumber}
              </span>
              <span className="px-2 py-0.5 rounded bg-neutral-900 text-amber-300 border border-neutral-800 font-mono text-xs">
                {activeSpirit.rank}
              </span>
              {getElementBadge(activeSpirit.element)}
              <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-900/60 font-mono text-xs">
                {activeSpirit.purpose}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-wider text-white">
              {activeSpirit.name}
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-1 max-w-xl">
              {activeSpirit.description}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handlePlayEnn(activeSpirit)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                isPlayingAudio === activeSpirit.id
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                  : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-red-400" />
              {isPlayingAudio === activeSpirit.id ? 'Resonating...' : 'Chant Enn'}
            </button>

            {onLoadIntoTablet && (
              <button
                onClick={() => onLoadIntoTablet(activeSpirit.name)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-red-900/60 text-red-300 text-xs font-mono transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-red-500" />
                Forge 9x9 Tablet
              </button>
            )}

            {onTuneToPortal && (
              <button
                onClick={() => onTuneToPortal(activeSpirit)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-red-700 to-purple-800 hover:from-red-600 hover:to-purple-700 text-white text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_12px_rgba(220,38,38,0.4)]"
              >
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                Tune to Portal Mirror
              </button>
            )}
          </div>
        </div>

        {/* Central Display: Seal Visualizer + Correspondences */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Vector Seal Visualization */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl flex flex-col items-center justify-center border border-red-950/70 relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleDownloadSvg}
                title="Download SVG Seal"
                className="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-all"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Seal View Mode Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-black/80 border border-neutral-800 text-[10px] font-mono mb-4">
              <button
                onClick={() => setSealMode('authentic_vector')}
                className={`px-3 py-1.5 rounded transition-all ${
                  sealMode === 'authentic_vector'
                    ? 'bg-red-950 border border-red-600 text-white font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Authentic Historical Seal
              </button>
              <button
                onClick={() => setSealMode('kamea_circle')}
                className={`px-3 py-1.5 rounded transition-all ${
                  sealMode === 'kamea_circle'
                    ? 'bg-red-950 border border-red-600 text-white font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Connolly 9×9 Kamea Seal
              </button>
            </div>

            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {sealMode === 'authentic_vector' ? (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <SacredSigil
                    variant={activeSpirit.goeticNumber || activeSpirit.slug}
                    size={240}
                    glow
                    color="#dc2626"
                    alt={`${activeSpirit.name} Ars Goetia Seal`}
                  />
                </div>
              ) : (
                /* Connolly Gematria / Kamea Seal SVG */
                <svg
                  id={`goetia-seal-${activeSpirit.id}`}
                  viewBox="0 0 320 320"
                  className="w-full h-full drop-shadow-[0_0_20px_rgba(220,38,38,0.45)]"
                >
                  <defs>
                    <radialGradient id={`sealGrad-${activeSpirit.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#450a0a" stopOpacity="0.7" />
                      <stop offset="60%" stopColor="#180404" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
                    </radialGradient>
                    <path id={`sealCircleText-${activeSpirit.id}`} d="M 30,160 A 130,130 0 1,1 290,160 A 130,130 0 1,1 30,160" fill="none" />
                  </defs>

                  {/* Base Dark Orb */}
                  <circle cx="160" cy="160" r="150" fill={`url(#sealGrad-${activeSpirit.id})`} stroke="#dc2626" strokeWidth="2.5" />
                  <circle cx="160" cy="160" r="140" fill="none" stroke="#fca5a5" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="160" cy="160" r="122" fill="none" stroke="#ef4444" strokeWidth="1.8" />

                  {/* Outer Ring Inscribed Text */}
                  <text fill="#fef2f2" fontSize="11" fontFamily="serif" fontWeight="bold" letterSpacing="4">
                    <textPath href={`#sealCircleText-${activeSpirit.id}`} startOffset="5%">
                      ★ {activeSpirit.name.toUpperCase()} ★ {activeSpirit.rank?.toUpperCase()} ★ GOETIA {activeSpirit.goeticNumber} ★
                    </textPath>
                  </text>

                  {/* Elemental / Rank Crest Geometry */}
                  {activeSpirit.element === 'fire' && (
                    <polygon points="160,56 226,170 94,170" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
                  )}
                  {activeSpirit.element === 'water' && (
                    <polygon points="160,264 226,150 94,150" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
                  )}
                  {activeSpirit.element === 'air' && (
                    <>
                      <polygon points="160,56 226,170 94,170" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
                      <line x1="110" y1="130" x2="210" y2="130" stroke="#fbbf24" strokeWidth="1.2" opacity="0.6" />
                    </>
                  )}
                  {activeSpirit.element === 'earth' && (
                    <>
                      <polygon points="160,264 226,150 94,150" fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.6" />
                      <line x1="110" y1="190" x2="210" y2="190" stroke="#34d399" strokeWidth="1.2" opacity="0.6" />
                    </>
                  )}

                  {/* Connolly / Gematria Crossbar & Sigil Line Trace */}
                  {activeTablet && activeTablet.sigilPath.length > 1 && (
                    <g transform="translate(40, 40) scale(0.75)">
                      {activeTablet.sigilPath.map((step, idx) => {
                        if (idx === 0) return null;
                        const prev = activeTablet.sigilPath[idx - 1];
                        const x1 = 20 + prev.col * 31;
                        const y1 = 20 + prev.row * 31;
                        const x2 = 20 + step.col * 31;
                        const y2 = 20 + step.row * 31;
                        return (
                          <line
                            key={idx}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#fbbf24"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                        );
                      })}

                      {/* Start Circle */}
                      {activeTablet.sigilPath[0] && (
                        <circle
                          cx={20 + activeTablet.sigilPath[0].col * 31}
                          cy={20 + activeTablet.sigilPath[0].row * 31}
                          r="6"
                          fill="#dc2626"
                          stroke="#fef2f2"
                          strokeWidth="2"
                        />
                      )}

                      {/* End Termination Crossbar */}
                      {activeTablet.sigilPath.length > 1 && (
                        <line
                          x1={20 + activeTablet.sigilPath[activeTablet.sigilPath.length - 1].col * 31 - 8}
                          y1={20 + activeTablet.sigilPath[activeTablet.sigilPath.length - 1].row * 31}
                          x2={20 + activeTablet.sigilPath[activeTablet.sigilPath.length - 1].col * 31 + 8}
                          y2={20 + activeTablet.sigilPath[activeTablet.sigilPath.length - 1].row * 31}
                          stroke="#fef2f2"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      )}
                    </g>
                  )}

                  {/* Central Demonolatry Focus Point */}
                  <circle cx="160" cy="160" r="4" fill="#ffffff" />
                </svg>
              )}
            </div>

            <span className="text-[11px] font-mono text-neutral-400 mt-4 text-center">
              {sealMode === 'authentic_vector'
                ? `Historical Ars Goetia Seal #${activeSpirit.goeticNumber} · ${activeSpirit.name}`
                : `Demonolatry 9×9 Kamea Seal · ${activeSpirit.name}`}
            </span>
          </div>

          {/* Right: Authentic Enn, Pronunciation & Correspondences */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Demonolatry Enn Banner */}
            <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="text-red-400 font-bold uppercase tracking-wider">
                  Demonic Invocation Enn
                </span>
                <button
                  onClick={() => handleCopyEnn(activeSpirit)}
                  className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
                >
                  {copiedEnn === activeSpirit.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Enn
                    </>
                  )}
                </button>
              </div>

              <p className="font-serif text-lg text-amber-200 font-medium tracking-wide">
                “{activeSpirit.enn}”
              </p>

              {activeSpirit.pronunciation && (
                <div className="text-xs font-mono text-neutral-400">
                  <span className="text-neutral-500">Pronunciation: </span>
                  <span className="italic text-neutral-300">{activeSpirit.pronunciation}</span>
                </div>
              )}
            </div>

            {/* Correspondences Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 block text-[10px] uppercase">Planetary Metal</span>
                <span className="text-neutral-200 font-medium font-serif text-sm">
                  {activeSpirit.correspondences?.metal || 'Lead / Iron'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 block text-[10px] uppercase">Planet</span>
                <span className="text-amber-300 font-medium font-serif text-sm">
                  {activeSpirit.correspondences?.planet || 'Saturn / Mars'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 block text-[10px] uppercase">Sacred Incense</span>
                <span className="text-neutral-200 font-medium font-serif text-sm">
                  {activeSpirit.correspondences?.incense || 'Dragon\'s Blood'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 block text-[10px] uppercase">Candle Color</span>
                <span className="text-red-400 font-medium font-serif text-sm">
                  {activeSpirit.correspondences?.candle || 'Black / Crimson'}
                </span>
              </div>
            </div>

            {/* Practical Magickal Advice & Office */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Occult Office & Manifestation
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {activeSpirit.description}
              </p>
              <div className="mt-2 text-[11px] font-mono text-neutral-500">
                Tradition: The Lesser Key of Solomon (Goetia) & S. Connolly Demonolatry. Invocations are always conducted with utmost respect, honouring the sovereign spirit as a teacher and ally.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoetiaForge;
