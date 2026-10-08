import React, { useState, useMemo } from 'react';
import {
  ALL_GRIMOIRE_ENTITIES,
  GrimoireEntity,
} from '../../db/grimoireSeeds';
import { playEnnChantTone } from '../audio/audioManager';
import {
  BookOpen,
  Search,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sparkles,
  Volume2,
  Copy,
  Check,
  Zap,
  ArrowUpRight,
  X,
  Gem,
  Award,
} from 'lucide-react';

interface GrimoireLibraryProps {
  onSelectEntity?: (entity: GrimoireEntity) => void;
  onNavigateToJournal?: (entity: GrimoireEntity) => void;
  onNavigateToChaos?: (entity: GrimoireEntity) => void;
  onTuneToPortal?: (entity: GrimoireEntity) => void;
}

export const GrimoireLibrary: React.FC<GrimoireLibraryProps> = ({
  onNavigateToJournal,
  onNavigateToChaos,
  onTuneToPortal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPantheon, setSelectedPantheon] = useState<string>('all');
  const [selectedCurrent, setSelectedCurrent] = useState<string>('all');
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');

  const [activeEntity, setActiveEntity] = useState<GrimoireEntity | null>(ALL_GRIMOIRE_ENTITIES[0] || null);
  const [copiedEnnId, setCopiedEnnId] = useState<number | null>(null);
  const [playingEnnId, setPlayingEnnId] = useState<number | null>(null);

  // Filter entities
  const filteredEntities = useMemo(() => {
    return ALL_GRIMOIRE_ENTITIES.filter((entity) => {
      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = entity.name.toLowerCase().includes(q);
        const matchesEnn = entity.enn?.toLowerCase().includes(q) ?? false;
        const matchesDesc = entity.description.toLowerCase().includes(q);
        const matchesRank = entity.rank?.toLowerCase().includes(q) ?? false;
        const matchesFamily = entity.family?.toLowerCase().includes(q) ?? false;
        const matchesPurpose = entity.purpose.toLowerCase().includes(q);
        if (!matchesName && !matchesEnn && !matchesDesc && !matchesRank && !matchesFamily && !matchesPurpose) {
          return false;
        }
      }

      // Pantheon Filter
      if (selectedPantheon !== 'all' && entity.pantheon !== selectedPantheon) {
        return false;
      }

      // Current Filter
      if (selectedCurrent !== 'all' && entity.current !== selectedCurrent) {
        return false;
      }

      // Element Filter
      if (selectedElement !== 'all' && entity.element !== selectedElement) {
        return false;
      }

      // Purpose Filter
      if (selectedPurpose !== 'all' && entity.purpose !== selectedPurpose) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedPantheon, selectedCurrent, selectedElement, selectedPurpose]);

  const handleCopyEnn = (entity: GrimoireEntity, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!entity.enn) return;
    navigator.clipboard.writeText(entity.enn);
    setCopiedEnnId(entity.id);
    setTimeout(() => {
      setCopiedEnnId(null);
    }, 2000);
  };

  const handlePlayChant = (entity: GrimoireEntity, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingEnnId === entity.id) {
      setPlayingEnnId(null);
      return;
    }
    setPlayingEnnId(entity.id);
    // Assign musical note key from correspondences or element
    let noteKey = 'D';
    if (entity.element === 'fire') noteKey = 'C';
    else if (entity.element === 'water') noteKey = 'G#';
    else if (entity.element === 'air') noteKey = 'E';
    else if (entity.element === 'earth') noteKey = 'B#';

    playEnnChantTone(noteKey, 3.2, () => {
      setPlayingEnnId(null);
    });
  };

  const getElementIcon = (elem?: string) => {
    switch (elem) {
      case 'fire':
        return <Flame className="w-3.5 h-3.5 text-red-400" />;
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
      case 'air':
        return <Wind className="w-3.5 h-3.5 text-amber-300" />;
      case 'earth':
        return <Mountain className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'Healing':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'Enlightenment':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'Vengeance':
        return 'bg-red-950/80 text-red-300 border-red-800';
      case 'Wealth':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-800';
      case 'Magick':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      case 'Protection':
        return 'bg-blue-950/80 text-blue-300 border-blue-800';
      case 'Divination':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-800';
      default:
        return 'bg-neutral-900 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="w-full h-full p-4 lg:p-6 overflow-y-auto bg-black text-neutral-200 flex flex-col gap-6 select-none font-sans">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-600/70 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <BookOpen className="w-5 h-5 text-red-300" />
            </div>
            <div>
              <h1 className="font-decorative text-2xl font-bold tracking-wider text-white">
                THE LIVING GRIMOIRE LIBRARY
              </h1>
              <p className="text-xs font-mono text-neutral-400 mt-0.5">
                72 Goetic Spirits • 39 Dukanté Hierarchs (9 Families) • Draconian Spirits of Chaos
              </p>
            </div>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
            Total Catalog: <strong className="text-white">{ALL_GRIMOIRE_ENTITIES.length}</strong> Spirits
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800 text-purple-300">
            Filtered: <strong className="text-white">{filteredEntities.length}</strong>
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3.5 bg-neutral-950/80 p-4 rounded-xl border border-neutral-800/80 shadow-lg">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, rank, authentic Enn, traditional purpose, or description..."
            className="w-full bg-black/90 border border-neutral-800 rounded-lg pl-10 pr-10 py-2.5 text-xs font-mono text-neutral-100 placeholder:text-neutral-600 focus:border-red-600 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Pantheon Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 text-[11px]">Pantheon:</span>
            <select
              value={selectedPantheon}
              onChange={(e) => setSelectedPantheon(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-neutral-200 text-xs focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Pantheons ({ALL_GRIMOIRE_ENTITIES.length})</option>
              <option value="goetia">72 Goetia</option>
              <option value="dukante_family">39 Dukanté Hierarchs</option>
              <option value="draconian">Draconian & Chaos</option>
            </select>
          </div>

          {/* Current Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 text-[11px]">Current:</span>
            <select
              value={selectedCurrent}
              onChange={(e) => setSelectedCurrent(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-neutral-200 text-xs focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Currents</option>
              <option value="demonolatry">Demonolatry</option>
              <option value="luciferian">Luciferian</option>
              <option value="draconian">Draconian</option>
              <option value="typhonian">Typhonian</option>
            </select>
          </div>

          {/* Element Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 text-[11px]">Element:</span>
            <select
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-neutral-200 text-xs focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Elements</option>
              <option value="fire">Fire</option>
              <option value="water">Water</option>
              <option value="air">Air</option>
              <option value="earth">Earth</option>
            </select>
          </div>

          {/* Purpose Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 text-[11px]">Purpose:</span>
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-neutral-200 text-xs focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Purposes</option>
              <option value="Enlightenment">Enlightenment</option>
              <option value="Healing">Healing</option>
              <option value="Vengeance">Vengeance</option>
              <option value="Wealth">Wealth</option>
              <option value="Magick">Magick</option>
              <option value="Protection">Protection</option>
              <option value="Divination">Divination</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Arcana Detail Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 items-start">
        {/* Spirits Cards Grid */}
        <div className="xl:col-span-7 2xl:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-3.5">
          {filteredEntities.length === 0 ? (
            <div className="col-span-full p-12 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-xl">
              No spirits found matching the selected filters.
            </div>
          ) : (
            filteredEntities.map((entity) => {
              const isSelected = activeEntity?.id === entity.id;
              const isCopied = copiedEnnId === entity.id;
              const isChanting = playingEnnId === entity.id;

              return (
                <div
                  key={entity.id}
                  onClick={() => setActiveEntity(entity)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-neutral-900/90 border-red-500 shadow-[0_0_20px_-4px_rgba(220,38,38,0.5)]'
                      : 'bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/50'
                  }`}
                >
                  <div>
                    {/* Header: Rank + Element + Purpose */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        {entity.goeticNumber && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 border border-neutral-800 text-neutral-400">
                            #{entity.goeticNumber}
                          </span>
                        )}
                        {entity.rank && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-300 font-semibold">
                            {entity.rank}
                          </span>
                        )}
                        {entity.family && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800 text-purple-300">
                            {entity.family}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {entity.element && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black border border-neutral-800 flex items-center gap-1">
                            {getElementIcon(entity.element)}
                            <span className="capitalize">{entity.element}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Spirit Name */}
                    <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                      {entity.name}
                    </h3>

                    {/* Purpose Pill */}
                    <div className="mt-1">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getPurposeColor(entity.purpose)}`}>
                        {entity.purpose}
                      </span>
                    </div>

                    {/* Enn Callout */}
                    {entity.enn && (
                      <div className="mt-3 p-2 rounded-lg bg-black/60 border border-neutral-800/80 font-serif text-xs italic text-neutral-300 leading-relaxed">
                        "{entity.enn}"
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-2 font-sans leading-relaxed">
                      {entity.description}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2.5 border-t border-neutral-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      {entity.enn && (
                        <>
                          <button
                            onClick={(e) => handlePlayChant(entity, e)}
                            title="Play Enn Chanting Tone"
                            className={`p-1.5 rounded transition-all ${
                              isChanting
                                ? 'bg-red-600 text-white animate-pulse'
                                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => handleCopyEnn(entity, e)}
                            title="Copy Authentic Enn"
                            className="p-1.5 rounded bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all flex items-center gap-1"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </>
                      )}
                    </div>

                    <span className="text-[11px] text-red-400 hover:underline flex items-center gap-0.5">
                      Arcana <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Spirit Arcana Panel */}
        {activeEntity && (
          <div className="xl:col-span-5 2xl:col-span-4 glass-panel p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between gap-5 sticky top-6 shadow-2xl">
            <div className="flex flex-col gap-4">
              {/* Top Banner */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-mono text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-red-400" />
                  {activeEntity.pantheon.replace('_', ' ')}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-amber-300">
                  {activeEntity.rank || 'Hierarch'}
                </span>
              </div>

              {/* Title & Element */}
              <div>
                <h2 className="font-decorative text-3xl font-bold text-white">
                  {activeEntity.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`text-xs font-mono px-2.5 py-0.5 rounded border ${getPurposeColor(activeEntity.purpose)}`}>
                    Purpose: {activeEntity.purpose}
                  </span>
                  {activeEntity.element && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-black border border-neutral-800 text-neutral-300 flex items-center gap-1 capitalize">
                      {getElementIcon(activeEntity.element)}
                      {activeEntity.element}
                    </span>
                  )}
                  {activeEntity.sephira && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800 text-purple-300">
                      Sphere: {activeEntity.sephira}
                    </span>
                  )}
                </div>
              </div>

              {/* Enn Chanting Station */}
              {activeEntity.enn && (
                <div className="p-4 rounded-xl bg-black/80 border border-red-950/60 flex flex-col gap-2.5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      Authentic Demonic Enn
                    </span>
                    <button
                      onClick={(e) => handlePlayChant(activeEntity, e)}
                      className="px-2.5 py-1 rounded bg-red-950 border border-red-700 text-red-200 text-xs font-mono hover:bg-red-900 transition-all flex items-center gap-1.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{playingEnnId === activeEntity.id ? 'Chanting...' : 'Play Chant Drone'}</span>
                    </button>
                  </div>

                  <p className="font-decorative text-base text-amber-300 italic tracking-wide">
                    "{activeEntity.enn}"
                  </p>

                  {activeEntity.pronunciation && (
                    <div className="text-xs font-mono text-neutral-400 pt-2 border-t border-neutral-800/80">
                      <strong className="text-neutral-500">Pronunciation: </strong>
                      <span className="text-neutral-200">{activeEntity.pronunciation}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Full Occult Description */}
              <div className="text-xs font-sans text-neutral-300 leading-relaxed bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80">
                <strong className="text-white block font-mono text-[11px] mb-1">TRADITIONAL LORE & PURPOSE:</strong>
                {activeEntity.description}
              </div>

              {/* Liber 777 Correspondences */}
              {activeEntity.correspondences && (
                <div className="flex flex-col gap-2 bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800 text-xs font-mono">
                  <span className="text-[11px] text-amber-400 font-semibold tracking-wider flex items-center gap-1.5">
                    <Gem className="w-3.5 h-3.5 text-amber-400" /> CORRESPONDENCES & ALTAR OFFERINGS
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
                    {activeEntity.correspondences.metal && (
                      <div>
                        <span className="text-neutral-500 block text-[10px]">METAL</span>
                        <span>{activeEntity.correspondences.metal}</span>
                      </div>
                    )}
                    {activeEntity.correspondences.planet && (
                      <div>
                        <span className="text-neutral-500 block text-[10px]">PLANET</span>
                        <span>{activeEntity.correspondences.planet}</span>
                      </div>
                    )}
                    {activeEntity.correspondences.incense && (
                      <div>
                        <span className="text-neutral-500 block text-[10px]">INCENSE</span>
                        <span>{activeEntity.correspondences.incense}</span>
                      </div>
                    )}
                    {activeEntity.correspondences.candle && (
                      <div>
                        <span className="text-neutral-500 block text-[10px]">CANDLE</span>
                        <span>{activeEntity.correspondences.candle}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Navigation Integrations */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
              <button
                onClick={() => onNavigateToJournal?.(activeEntity)}
                className="w-full py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-red-400" />
                Record in Alchemical Journal
              </button>

              <button
                onClick={() => onNavigateToChaos?.(activeEntity)}
                className="w-full py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Forge Sigil in Chaos Workbench
              </button>

              <button
                onClick={() => onTuneToPortal?.(activeEntity)}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-700 to-purple-800 hover:from-red-600 hover:to-purple-700 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Tune Gazing Portal to Spirit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrimoireLibrary;
