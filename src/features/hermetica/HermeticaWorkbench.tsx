import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  HERMETIC_CHAPTERS,
  THE_SEVEN_SPHERES,
  THE_TWELVE_TORMENTS,
  DIVINE_GIFTS,
  HERMETIC_MAXIMS,
  HermeticChapter,
} from './hermeticCorpus';
import { getCurrentMagickalTiming, MagickalTiming } from '../ephemeris/planetaryHours';
import { registerAudioContext } from '../audio/audioManager';
import {
  BookOpen,
  Sparkles,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  Layers,
  Shield,
  Feather,
  Compass,
  ArrowRight,
  RotateCcw,
  Search,
  BookMarked,
} from 'lucide-react';

export interface HermeticaWorkbenchProps {
  onSendToJournal?: (draft: {
    title: string;
    body_md: string;
    working_type: string;
    pre_state_label: string;
    post_state_label: string;
    resonance: number;
  }) => void;
  onTunePortalFrequency?: (frequencyHz: number, note: string) => void;
}

type TabType = 'corpus' | 'spheres' | 'torments' | 'oracle';

export const HermeticaWorkbench: React.FC<HermeticaWorkbenchProps> = ({
  onSendToJournal,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('corpus');
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);

  // Audio Contemplation Drone
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [droneFreq, setDroneFreq] = useState<number>(528);
  const [droneVolume, setDroneVolume] = useState<number>(0.2);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  // 12 Torments Transmutation State (persisted locally)
  const [transmutedTorments, setTransmutedTorments] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('gnosticos_hermetic_torments');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Current Ephemeris Timing
  const [timing, setTiming] = useState<MagickalTiming | null>(null);

  // Daily Oracle Maxim
  const [currentMaximIndex, setCurrentMaximIndex] = useState<number>(0);

  useEffect(() => {
    setTiming(getCurrentMagickalTiming());
    const interval = setInterval(() => {
      setTiming(getCurrentMagickalTiming());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const selectedChapter: HermeticChapter = useMemo(() => {
    return (
      HERMETIC_CHAPTERS.find((c) => c.id === selectedChapterId) ||
      HERMETIC_CHAPTERS[0]
    );
  }, [selectedChapterId]);

  // Sync drone frequency when chapter changes
  useEffect(() => {
    if (selectedChapter) {
      setDroneFreq(selectedChapter.suggestedFrequencyHz);
    }
  }, [selectedChapter]);

  // Filtered Chapters
  const filteredChapters = useMemo(() => {
    return HERMETIC_CHAPTERS.filter((c) => {
      const matchesCat =
        categoryFilter === 'all' || c.category === categoryFilter;
      const matchesSearch =
        searchQuery === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.keywords.some((k) =>
          k.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      return matchesCat && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  // Audio Synth Engine for Hermetic Drone
  const startDrone = (freq: number) => {
    stopDrone();
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      registerAudioContext(ctx);

      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(droneVolume, now + 2.0);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      // Master carrier
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.connect(gain);
      osc1.start(now);
      osc1Ref.current = osc1;

      // Binaural Theta offset (6 Hz)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq + 6.0, now);
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.value = 0.4;
      osc2.connect(osc2Gain).connect(gain);
      osc2.start(now);
      osc2Ref.current = osc2;

      setIsAudioPlaying(true);
    } catch (err) {
      console.warn('Audio initiation error:', err);
    }
  };

  const stopDrone = () => {
    if (audioCtxRef.current) {
      try {
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.linearRampToValueAtTime(
            0.001,
            audioCtxRef.current.currentTime + 0.8,
          );
        }
        setTimeout(() => {
          if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
            void audioCtxRef.current.close();
          }
          audioCtxRef.current = null;
        }, 900);
      } catch {
        // Ignore
      }
    }
    setIsAudioPlaying(false);
  };

  const toggleDrone = () => {
    if (isAudioPlaying) {
      stopDrone();
    } else {
      startDrone(droneFreq);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopDrone();
    };
  }, []);

  // Update volume live
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        droneVolume,
        audioCtxRef.current.currentTime,
        0.1,
      );
    }
  }, [droneVolume]);

  const toggleTorment = (id: number) => {
    setTransmutedTorments((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('gnosticos_hermetic_torments', JSON.stringify(next));
      return next;
    });
  };

  const resetTorments = () => {
    setTransmutedTorments({});
    localStorage.removeItem('gnosticos_hermetic_torments');
  };

  const handleCopyPassage = (chapter: HermeticChapter) => {
    const text = `${chapter.roman}. ${chapter.title}\n"${chapter.subtitle}"\n\n` +
      chapter.verses.join('\n\n') +
      `\n\n— The Hermetica: The Lost Wisdom of the Pharaohs`;
    navigator.clipboard.writeText(text);
    setCopiedMessage('Copied to clipboard!');
    setTimeout(() => setCopiedMessage(null), 2500);
  };

  const handleSendChapterToJournal = (chapter: HermeticChapter) => {
    if (!onSendToJournal) return;
    const markdownBody = `### ${chapter.roman}. ${chapter.title}\n*${chapter.subtitle}*\n\n` +
      `> "${chapter.verses[0]}"\n\n` +
      `#### Hermetic Doctrine\n${chapter.summary}\n\n` +
      `#### Contemplation\n${chapter.contemplationPrompt}\n\n` +
      `---\n*Recorded in GnosticOS Hermetic Sanctum under the ${timing?.currentHour.planet.toUpperCase() || 'SOLAR'} planetary hour.*`;

    onSendToJournal({
      title: `Hermetic Contemplation: ${chapter.title}`,
      body_md: markdownBody,
      working_type: 'meditation',
      pre_state_label: 'Contemplative Openness',
      post_state_label: 'Hermetic Gnosis',
      resonance: 8,
    });
  };

  // Rebirth score
  const transmutedCount = Object.values(transmutedTorments).filter(Boolean).length;
  const rebirthPercentage = Math.round((transmutedCount / 12) * 100);

  // Current planetary ruler gift
  const currentPlanetaryGift = useMemo(() => {
    if (!timing) return DIVINE_GIFTS[0];
    const planetKey = timing.currentHour.planet;
    return (
      DIVINE_GIFTS.find((g) => g.planet === planetKey) || DIVINE_GIFTS[0]
    );
  }, [timing]);

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-neutral-200 select-none overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-neutral-800/80 px-6 flex items-center justify-between bg-black/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600/30 to-emerald-600/20 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Feather className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-decorative text-xl font-bold tracking-wider text-white">
                THE HERMETICA
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-700/50 text-amber-300 font-semibold uppercase">
                Chamber of Thoth
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-400">
              The Lost Wisdom of the Pharaohs • Corpus Hermeticum & The 8th Sphere
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('corpus')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'corpus'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Corpus (20 Books)</span>
          </button>
          <button
            onClick={() => setActiveTab('spheres')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'spheres'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>7 Spheres & Ogdoad</span>
          </button>
          <button
            onClick={() => setActiveTab('torments')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'torments'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Rebirth Crucible ({transmutedCount}/12)</span>
          </button>
          <button
            onClick={() => setActiveTab('oracle')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'oracle'
                ? 'bg-red-600/20 text-red-300 border border-red-500/40 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Contemplation</span>
          </button>
        </div>

        {/* Audio Contemplation Drone Widget */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono">
            <span className="text-neutral-400">Drone:</span>
            <span className="text-amber-400 font-bold">{droneFreq} Hz</span>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.01"
              value={droneVolume}
              onChange={(e) => setDroneVolume(parseFloat(e.target.value))}
              className="w-16 h-1 accent-amber-500 bg-neutral-800 rounded-lg cursor-pointer"
              title={`Drone Volume: ${Math.round(droneVolume * 100)}%`}
            />
            <button
              onClick={toggleDrone}
              className={`p-1.5 rounded-md transition-all ${
                isAudioPlaying
                  ? 'bg-amber-600 text-black font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title={isAudioPlaying ? 'Mute Hermetic Drone' : 'Play Hermetic Theta Drone'}
            >
              {isAudioPlaying ? (
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: THE 20 BOOKS OF THE CORPUS */}
        {activeTab === 'corpus' && (
          <div className="w-full h-full flex overflow-hidden">
            {/* Left Chapter Rail */}
            <div className="w-80 h-full border-r border-neutral-800/80 bg-neutral-950/70 flex flex-col shrink-0">
              {/* Search & Filter Header */}
              <div className="p-3 border-b border-neutral-800/80 flex flex-col gap-2 bg-neutral-950">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search teachings, keywords..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 pl-8 text-xs font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/70"
                  />
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono pb-1 scrollbar-none">
                  {['all', 'origins', 'theology', 'cosmos', 'humanity', 'transcendence'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition-all ${
                        categoryFilter === cat
                          ? 'bg-amber-950/80 border border-amber-600/60 text-amber-300 font-bold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapters Scrollable List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredChapters.map((chap) => {
                  const isSelected = chap.id === selectedChapterId;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => setSelectedChapterId(chap.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all border ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-950/60 to-purple-950/40 border-amber-500/60 shadow-[0_0_15px_-4px_rgba(245,158,11,0.3)]'
                          : 'bg-neutral-900/40 border-transparent hover:bg-neutral-900/80 hover:border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono text-amber-400 font-bold tracking-wider">
                          Book {chap.roman}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/60 text-neutral-400 border border-neutral-800 uppercase">
                          {chap.category}
                        </span>
                      </div>
                      <h3 className="font-serif text-sm font-semibold text-neutral-100 line-clamp-1">
                        {chap.title}
                      </h3>
                      <p className="text-[11px] font-sans text-neutral-400 line-clamp-1 mt-0.5">
                        {chap.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Reading & Contemplation Altar */}
            <div className="flex-1 h-full overflow-y-auto p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/10 via-neutral-950 to-black">
              <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-16">
                {/* Chapter Banner */}
                <div className="border-b border-neutral-800/80 pb-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
                      Corpus Hermeticum • Book {selectedChapter.roman}
                    </span>
                    <div className="flex items-center gap-2">
                      {copiedMessage && (
                        <span className="text-xs font-mono text-emerald-400 animate-pulse">
                          {copiedMessage}
                        </span>
                      )}
                      <button
                        onClick={() => handleCopyPassage(selectedChapter)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-all"
                        title="Copy text to clipboard"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                      {onSendToJournal && (
                        <button
                          onClick={() => handleSendChapterToJournal(selectedChapter)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/60 text-xs font-mono text-amber-200 hover:text-white transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                        >
                          <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                          <span>Contemplate in Journal</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <h2 className="font-decorative text-3xl font-bold tracking-wide text-white">
                    {selectedChapter.title}
                  </h2>
                  <p className="font-serif italic text-base text-amber-200/80">
                    "{selectedChapter.subtitle}"
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {selectedChapter.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-400 border border-neutral-800"
                      >
                        #{kw}
                      </span>
                    ))}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-400 border border-amber-800/40">
                      Tuning: {selectedChapter.suggestedFrequencyHz} Hz
                    </span>
                  </div>
                </div>

                {/* Philosophical Introduction */}
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 text-sm font-sans text-neutral-300 leading-relaxed shadow-inner">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Essential Doctrine & Context
                  </h4>
                  <p>{selectedChapter.summary}</p>
                </div>

                {/* Sacred Poetic Verses */}
                <div className="flex flex-col gap-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                    <Feather className="w-3.5 h-3.5" />
                    The Sacred Words of Thrice-Great Hermes
                  </h4>

                  <div className="space-y-4">
                    {selectedChapter.verses.map((verse, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-black/70 border border-neutral-800 hover:border-amber-600/40 transition-all font-serif text-neutral-100 text-base leading-loose relative group shadow-sm"
                      >
                        <span className="absolute top-3 right-4 font-mono text-[10px] text-neutral-600 group-hover:text-amber-500/70">
                          § {idx + 1}
                        </span>
                        <p className="pr-6">{verse}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Aphorisms Grid */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                    Key Aphorisms for Gnosis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedChapter.keyAphorisms.map((aph, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 text-xs font-serif text-purple-200 leading-relaxed italic flex items-center"
                      >
                        "{aph}"
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contemplative Inquiry Prompt */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 to-neutral-900/80 border border-amber-600/40 flex flex-col gap-3 shadow-[0_0_25px_rgba(245,158,11,0.1)]">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    <Compass className="w-4 h-4" />
                    Hermetic Reflection & Inquiry
                  </div>
                  <p className="font-sans text-sm text-neutral-200 leading-relaxed">
                    {selectedChapter.contemplationPrompt}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-400">
                      Silence speech. Allow Atum to re-Mind you.
                    </span>
                    {onSendToJournal && (
                      <button
                        onClick={() => handleSendChapterToJournal(selectedChapter)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-xs font-mono text-white transition-all"
                      >
                        <span>Record Realization</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ASCENT OF THE SEVEN SPHERES & THE OGDOAD (Ch. XV) */}
        {activeTab === 'spheres' && (
          <div className="w-full h-full overflow-y-auto p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/20 via-neutral-950 to-black">
            <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-16">
              <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
                <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">
                  Book XV • Death and Immortality
                </span>
                <h2 className="font-decorative text-3xl font-bold tracking-wide text-white">
                  The Ascent of the Seven Spheres
                </h2>
                <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                  As the soul departs the bodily vessel, it mounts upward through the
                  structures of the heavens. In each planetary zone, it is stripped of
                  a terrestrial vice, regaining its proper power before entering the
                  Eighth Sphere (The Ogdoad) in joyous communion with Atum.
                </p>
              </div>

              {/* Spheres Vertical Ladder */}
              <div className="space-y-3 mt-4">
                {THE_SEVEN_SPHERES.map((sphere) => {
                  const isOgdoad = sphere.sphereNumber === 8;
                  return (
                    <div
                      key={sphere.sphereNumber}
                      className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                        isOgdoad
                          ? 'bg-gradient-to-r from-amber-950/50 via-purple-950/40 to-neutral-900 border-amber-500/70 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-purple-600/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-decorative text-xl font-bold border shrink-0 ${
                            isOgdoad
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                              : 'bg-neutral-800 border-neutral-700 text-purple-300'
                          }`}
                        >
                          {sphere.symbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                              {isOgdoad ? 'Transcendent Apex' : `Zone ${sphere.sphereNumber} • ${sphere.planet}`}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-black/60 text-neutral-400 border border-neutral-800">
                              {sphere.musicalNote} ({sphere.frequencyHz} Hz)
                            </span>
                          </div>
                          <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                            {sphere.title}
                          </h3>
                          <p className="text-xs font-sans text-neutral-300 mt-1 max-w-lg">
                            {sphere.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 border-neutral-800 pt-3 md:pt-0">
                        <div className="text-right">
                          <p className="text-[11px] font-mono text-red-400">
                            <span className="text-neutral-500">Stripped:</span> {sphere.viceStripped}
                          </p>
                          <p className="text-[11px] font-mono text-emerald-400 font-bold">
                            <span className="text-neutral-500">Awakened:</span> {sphere.virtueAwakened}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setDroneFreq(sphere.frequencyHz);
                            startDrone(sphere.frequencyHz);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 transition-all self-start md:self-end"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Sound Tone ({sphere.frequencyHz} Hz)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: THE 12 TORMENTS & REBIRTH CRUCIBLE (Ch. XVIII) */}
        {activeTab === 'torments' && (
          <div className="w-full h-full overflow-y-auto p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-neutral-950 to-black">
            <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-16">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    Book XVIII • Rebirth in Sacred Silence
                  </span>
                  <h2 className="font-decorative text-3xl font-bold tracking-wide text-white">
                    Crucible of the 12 Torments
                  </h2>
                  <p className="text-xs font-sans text-neutral-400 leading-relaxed mt-1">
                    "Purify yourself of the twelve irrational torments of matter... By Atum’s
                    mercy, they may all depart and be replaced by understanding."
                  </p>
                </div>

                {/* Progress Dial */}
                <div className="flex items-center gap-4 bg-neutral-900/80 p-3.5 rounded-2xl border border-neutral-800">
                  <div className="text-right">
                    <div className="text-xs font-mono text-neutral-400">Rebirth Metric</div>
                    <div className="text-xl font-decorative font-bold text-emerald-400">
                      {rebirthPercentage}% Gnosis
                    </div>
                  </div>
                  <button
                    onClick={resetTorments}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                    title="Reset All Transmutations"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 12 Torments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {THE_TWELVE_TORMENTS.map((t) => {
                  const isTransmuted = !!transmutedTorments[t.id];
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleTorment(t.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                        isTransmuted
                          ? 'bg-emerald-950/20 border-emerald-500/60 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]'
                          : 'bg-neutral-900/50 border-neutral-800/80 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">
                              Torment #{t.id}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold uppercase ${
                                isTransmuted
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                  : 'bg-red-950/60 text-red-400 border border-red-900/60'
                              }`}
                            >
                              {isTransmuted ? 'Transmuted to Gold' : 'Shadow in Flesh'}
                            </span>
                          </div>
                          <h3 className="font-serif text-lg font-bold text-white mt-1">
                            {t.torment}
                          </h3>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            isTransmuted
                              ? 'bg-emerald-500 border-emerald-400 text-black'
                              : 'border-neutral-700 bg-neutral-800 text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>

                      <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                        {t.description}
                      </p>

                      <div className="pt-2 border-t border-neutral-800/60 flex flex-col gap-1 text-[11px] font-mono">
                        <div className="text-emerald-400 font-semibold">
                          ✦ Antidote: {t.transmutation}
                        </div>
                        <div className="text-neutral-400 italic">
                          "{t.gnosticAntidote}"
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HERMETIC EPHEMERIS & DAILY CONTEMPLATION */}
        {activeTab === 'oracle' && (
          <div className="w-full h-full overflow-y-auto p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-neutral-950 to-black">
            <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-16">
              <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
                <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
                  Daily Hermetic Alignment & Oracle
                </span>
                <h2 className="font-decorative text-3xl font-bold tracking-wide text-white">
                  The Gift of the Reigning God
                </h2>
                <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                  Chapter IX reveals the seven heavenly gifts bestowed by the planetary administrators.
                  See which god currently governs your hour and receive its blessing.
                </p>
              </div>

              {/* Current Hour Alignment Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 to-neutral-900/90 border border-amber-600/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/50 flex items-center justify-center font-decorative text-3xl font-bold text-amber-400 shadow-inner">
                    {timing ? (
                      timing.currentHour.planet === 'sun' ? (
                        <Sun className="w-8 h-8 text-amber-400" />
                      ) : timing.currentHour.planet === 'moon' ? (
                        <Moon className="w-8 h-8 text-purple-400" />
                      ) : (
                        <Compass className="w-8 h-8 text-amber-400" />
                      )
                    ) : (
                      '☉'
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      Current Celestial Ruler
                    </span>
                    <h3 className="font-decorative text-2xl font-bold text-white capitalize">
                      {currentPlanetaryGift.godName} ({currentPlanetaryGift.planet})
                    </h3>
                    <p className="text-xs font-serif text-amber-200/90 italic mt-0.5">
                      Gift: "{currentPlanetaryGift.gift}"
                    </p>
                  </div>
                </div>

                <div className="text-right max-w-xs">
                  <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                    {currentPlanetaryGift.purpose}
                  </p>
                  {onSendToJournal && (
                    <button
                      onClick={() => {
                        onSendToJournal({
                          title: `Hermetic Alignment: ${currentPlanetaryGift.godName} (${currentPlanetaryGift.planet})`,
                          body_md: `### Hermetic Gift of ${currentPlanetaryGift.godName}\n*${currentPlanetaryGift.gift}*\n\n> "${currentPlanetaryGift.purpose}"\n\n#### Contemplation on Planetary Infusion\nHow am I receiving and applying this celestial quality during this ritual hour?`,
                          working_type: 'invocation',
                          pre_state_label: 'Seeking Alignment',
                          post_state_label: 'Attuned to Celestial Ruler',
                          resonance: 8,
                        });
                      }}
                      className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-xs font-mono text-white transition-all ml-auto"
                    >
                      <span>Log In Journal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Hermetic Maxim Oracle Card */}
              <div className="p-8 rounded-2xl bg-black/80 border border-neutral-800 flex flex-col items-center text-center gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
                  Hermetic Maxim Oracle • {HERMETIC_MAXIMS[currentMaximIndex].source}
                </span>

                <blockquote className="font-decorative text-xl md:text-2xl font-semibold text-neutral-100 max-w-xl leading-relaxed">
                  "{HERMETIC_MAXIMS[currentMaximIndex].text}"
                </blockquote>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const next = (currentMaximIndex + 1) % HERMETIC_MAXIMS.length;
                      setCurrentMaximIndex(next);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Draw Another Maxim</span>
                  </button>

                  {onSendToJournal && (
                    <button
                      onClick={() => {
                        const maxim = HERMETIC_MAXIMS[currentMaximIndex];
                        onSendToJournal({
                          title: `Maxim Contemplation: ${maxim.source}`,
                          body_md: `### Hermetic Maxim (${maxim.source})\n\n> "${maxim.text}"\n\n#### Direct Perception\nWhat does this reveal about my true identity as Mind rather than body?`,
                          working_type: 'meditation',
                          pre_state_label: 'Reflecting',
                          post_state_label: 'Inner Lucidity',
                          resonance: 9,
                        });
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-xs font-mono text-amber-200 hover:text-white transition-all"
                    >
                      <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                      <span>Contemplate in Journal</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HermeticaWorkbench;
