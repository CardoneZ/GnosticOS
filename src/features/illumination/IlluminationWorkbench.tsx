import React, { useState } from 'react';
import {
  WillDesireBeliefSymbol,
  LuciferSigil,
  IshtarStar,
  AzhdahaSymbol,
} from '../tree/LuciferianSymbols';
import { SubliminalEngine, SUBLIMINAL_PRESETS } from '../audio/subliminalAudio';
import { playEnnChantTone } from '../audio/audioManager';
import {
  Flame,
  Zap,
  Volume2,
  Check,
  Send,
} from 'lucide-react';

interface IlluminationWorkbenchProps {
  onSendToJournal?: (entry: {
    title: string;
    body_md: string;
    working_type: string;
    pre_state_label: string;
    post_state_label: string;
    resonance: number;
  }) => void;
}

export const IlluminationWorkbench: React.FC<IlluminationWorkbenchProps> = ({
  onSendToJournal,
}) => {
  // 3 Engines State
  const [willIntent, setWillIntent] = useState(
    'To awaken unshakeable sovereign intellect and ignite the Black Flame in all creative endeavors.'
  );
  const [desireModality, setDesireModality] = useState<
    'ecstatic' | 'enn_chant' | 'death_posture' | 'breath_fire'
  >('enn_chant');
  const [beliefSubconsciousState, setBeliefSubconsciousState] = useState<
    'neither_neither' | 'subconscious_void' | 'living_daemon'
  >('neither_neither');

  // Operation Stage & Charging
  const [activeTab, setActiveTab] = useState<'trine' | 'daily' | 'daemon'>('trine');
  const [isCharging, setIsCharging] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [chargedSuccess, setChargedSuccess] = useState(false);

  // Audio Subliminal Invocation
  const [isAudioRunning, setIsAudioRunning] = useState(false);
  const [subliminalEngine, setSubliminalEngine] = useState<SubliminalEngine | null>(null);

  const handleToggleSubliminal = () => {
    if (isAudioRunning) {
      if (subliminalEngine) {
        subliminalEngine.stop();
        setSubliminalEngine(null);
      }
      setIsAudioRunning(false);
    } else {
      const preset =
        SUBLIMINAL_PRESETS.find((p) => p.id === 'will_desire_belief') ||
        SUBLIMINAL_PRESETS[0];
      const engine = new SubliminalEngine({
        preset,
        whisperVolume: 0.4,
        speechIntervalSec: 6,
        droneVolume: 0.25,
      });
      const ok = engine.start();
      if (ok) {
        setSubliminalEngine(engine);
        setIsAudioRunning(true);
      }
    }
  };

  const handleFireSigilIntoVoid = () => {
    setIsCharging(true);
    setChargeProgress(0);
    setChargedSuccess(false);

    // Play resonant harmonic chime
    playEnnChantTone('F#', 4.5);

    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setChargeProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsCharging(false);
        setChargedSuccess(true);
      }
    }, 250);
  };

  const handleCommitToJournal = () => {
    if (!onSendToJournal) return;
    onSendToJournal({
      title: `Luciferian Illumination Working — ${willIntent.slice(0, 36)}...`,
      body_md: `### Illumination Trine Operation (Zos Kia Cultus)
**Stage**: Illumination (Igniting the Black Flame)

#### 1. Will (Thelema / Sovereign Direction)
${willIntent}

#### 2. Desire (Eros / Daemon Energy)
Modality: **${desireModality.toUpperCase()}**
The desire was elevated beyond conscious craving and energized through primal daemon fire.

#### 3. Belief (Kia / Incarnation into the Void)
Subconscious Gateway: **${beliefSubconsciousState.toUpperCase()}**
The intent is severed from conscious lust of result and planted into the Neither-Neither subconscious void.

*Renich Tasa Uberaca Biasa Icar Lucifer.*
*Apotheosis and Illumination.*`,
      working_type: 'invocation',
      pre_state_label: 'Neutral / Seeking Gnosis',
      post_state_label: 'Luciferian Illumination',
      resonance: 10,
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-neutral-200 overflow-y-auto">
      {/* Top Banner */}
      <div className="px-6 py-5 border-b border-neutral-900 bg-neutral-950/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-600/70 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.35)]">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wider text-neutral-100 flex items-center gap-2">
              Luciferian Illumination
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-900/60 uppercase">
                Stage II · The Black Flame
              </span>
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">
              Beyond Liberation · Will, Desire &amp; Belief Alchemy (Zos Kia Cultus / Michael W. Ford)
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-neutral-900/80 p-1 border border-neutral-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('trine')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'trine'
                  ? 'bg-amber-950 border border-amber-600 text-white font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Will · Desire · Belief
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'daily'
                  ? 'bg-amber-950 border border-amber-600 text-white font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Illumination Operations
            </button>
            <button
              onClick={() => setActiveTab('daemon')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'daemon'
                  ? 'bg-amber-950 border border-amber-600 text-white font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              The Daemon &amp; Black Flame
            </button>
          </div>

          <button
            onClick={handleToggleSubliminal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              isAudioRunning
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)] animate-pulse'
                : 'bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            {isAudioRunning ? 'Subliminals ON' : 'Audio Mantras'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-6xl mx-auto w-full flex flex-col gap-6">
        {/* Stage Overview Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 opacity-60">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-1">
              <span>STAGE I</span>
              <span>COMPLETED ✓</span>
            </div>
            <h3 className="font-serif text-sm font-bold text-neutral-300">Liberation</h3>
            <p className="text-[11px] text-neutral-500 mt-1">
              Breaking dogmatic chains, guilt, and slave-morality conditioning.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/70 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-1">
              <span className="font-bold">STAGE II</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-[10px] text-amber-200">
                ACTIVE FOCUS
              </span>
            </div>
            <h3 className="font-serif text-sm font-bold text-amber-200">Illumination</h3>
            <p className="text-[11px] text-neutral-300 mt-1">
              Igniting the Black Flame, awakening inner divinity, and mastering Will, Desire &amp; Belief.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 opacity-60">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-1">
              <span>STAGE III</span>
              <span>SUMMIT</span>
            </div>
            <h3 className="font-serif text-sm font-bold text-neutral-300">Apotheosis</h3>
            <p className="text-[11px] text-neutral-500 mt-1">
              Living godhood, conscious daemon embodiment, and mastery of subjective reality.
            </p>
          </div>
        </div>

        {/* Tab 1: The Will, Desire & Belief Crucible */}
        {activeTab === 'trine' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive 3-Engine Form */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* 1. WILL */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-amber-900/50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-950 border border-amber-600 flex items-center justify-center font-mono text-xs font-bold text-amber-300">
                      1
                    </div>
                    <h2 className="font-serif text-base font-bold text-amber-200">
                      WILL (Thelema / Phosphorus)
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">Sovereign Intent</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Formulate your intention purely. In Luciferian Illumination, the Will must be stated without guilt, hesitation, or pleading.
                </p>
                <textarea
                  value={willIntent}
                  onChange={(e) => setWillIntent(e.target.value)}
                  rows={3}
                  className="w-full bg-black/90 border border-neutral-700 rounded-xl p-3 text-sm font-serif text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 shadow-inner"
                  placeholder="State your sovereign intent clearly..."
                />
              </div>

              {/* 2. DESIRE */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-red-950/80 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-950 border border-red-600 flex items-center justify-center font-mono text-xs font-bold text-red-300">
                      2
                    </div>
                    <h2 className="font-serif text-base font-bold text-red-300">
                      DESIRE (Eros / Daemon Energy)
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">Primal Power</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Desire is the emotional fuel of creation. Channel primal vitality to energize the intention into incandescent reality.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {[
                    ['enn_chant', 'Demonic Enn Resonance', 'Sacred vocal vibration'],
                    ['breath_fire', 'Breath of the Black Flame', 'Cadenced prana holding'],
                    ['ecstatic', 'Ecstatic Sensory Trance', 'Emotional peak absorption'],
                    ['death_posture', 'Death Posture / Kia Void', 'Sensory exhaustion into stillness'],
                  ].map(([id, label, desc]) => (
                    <button
                      key={id}
                      onClick={() => setDesireModality(id as any)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        desireModality === id
                          ? 'bg-red-950/70 border-red-600 text-white font-bold shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="font-serif text-xs text-neutral-100">{label}</div>
                      <div className="text-[10px] font-mono text-neutral-500 mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. BELIEF */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-purple-950/80 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-600 flex items-center justify-center font-mono text-xs font-bold text-purple-300">
                      3
                    </div>
                    <h2 className="font-serif text-base font-bold text-purple-300">
                      BELIEF (Kia / Subconscious Incarnation)
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">The Void</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Austin Osman Spare’s Neither-Neither principle: release conscious craving. The subconscious mind only incarnates what the ego ceases to agonize over.
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {[
                    ['neither_neither', 'Neither-Neither', 'Suspension of dualities'],
                    ['subconscious_void', 'Abyssal Void', 'Complete mental silence'],
                    ['living_daemon', 'Living Daemon', 'Imprinted as absolute reality'],
                  ].map(([id, label, desc]) => (
                    <button
                      key={id}
                      onClick={() => setBeliefSubconsciousState(id as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        beliefSubconsciousState === id
                          ? 'bg-purple-950/80 border-purple-600 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="font-serif text-xs text-neutral-100">{label}</div>
                      <div className="text-[10px] font-mono text-neutral-500 mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fire into Void Action */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleFireSigilIntoVoid}
                  disabled={isCharging}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-700 via-red-800 to-purple-800 hover:from-amber-600 hover:to-purple-700 text-white font-serif text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  {isCharging ? `Charging into Void (${chargeProgress}%)` : 'Fire Intent into the Void'}
                </button>

                {chargedSuccess && onSendToJournal && (
                  <button
                    onClick={handleCommitToJournal}
                    className="px-5 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-emerald-600/70 text-emerald-300 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Commit to Journal
                  </button>
                )}
              </div>
            </div>

            {/* Right: Sacred Geometry Focal Visualizer */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center border border-amber-900/40 relative min-h-[380px]">
                <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 mb-3 text-center">
                  Triad of Illumination &amp; Zos Kia
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isCharging ? 'scale-110 drop-shadow-[0_0_35px_rgba(245,158,11,0.8)]' : ''
                  }`}
                >
                  <WillDesireBeliefSymbol size={260} glow />
                </div>

                {isCharging && (
                  <div className="w-full mt-4 flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-mono text-amber-300">
                      <span>Subconscious Absorption</span>
                      <span>{chargeProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${chargeProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {chargedSuccess && (
                  <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-700/60 text-xs font-mono text-emerald-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Intent absorbed into the subconscious Kia void.
                  </div>
                )}
              </div>

              {/* Occult Principles Card */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex flex-col gap-2">
                <span className="font-mono text-amber-400 uppercase tracking-wider font-bold">
                  Rule of Illumination
                </span>
                <p className="leading-relaxed font-sans">
                  “Does a god beg? Does a creator doubt their creation? In the Illumination stage, you acknowledge that your consciousness is the crucible where light and dark harmonize. Hold the intent with absolute certainty, then release all conscious fixation.”
                </p>
                <span className="font-serif italic text-neutral-500 text-[11px]">
                  — Michael W. Ford, Apotheosis: The Ultimate Beginner’s Guide to Luciferianism
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Daily Operations */}
        {activeTab === 'daily' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl glass-panel border border-amber-900/60 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-600 flex items-center justify-center">
                <IshtarStar size={24} />
              </div>
              <h3 className="font-serif text-base font-bold text-amber-200">
                1. Dawn: Phosphorus Rising
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                At sunrise, greet the Morning Star (Phosphorus). Dedicate the day’s intellectual challenges to Lucifer. State your primary goal for the day with unwavering resolve.
              </p>
              <div className="mt-auto p-2.5 rounded bg-black/60 border border-neutral-800 text-[11px] font-mono text-amber-300">
                Enn: Renich Tasa Uberaca Biasa Icar Lucifer
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-red-950/80 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-600 flex items-center justify-center">
                <Flame className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-serif text-base font-bold text-red-200">
                2. Midday: The Will Anchor
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Pause at peak solar power. Examine your morning actions: Were they sovereign, or reactive? Refocus any scattered energy into pure purposeful manifestation.
              </p>
              <div className="mt-auto p-2.5 rounded bg-black/60 border border-neutral-800 text-[11px] font-mono text-red-300">
                Affirmation: “My will is unbroken, self-governing, and sharp.”
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-purple-950/80 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-600 flex items-center justify-center">
                <AzhdahaSymbol size={24} />
              </div>
              <h3 className="font-serif text-base font-bold text-purple-200">
                3. Night: Black Flame Introspection
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Scry into the black mirror or gaze upon the Sigil of Lucifer. Enter the hypnagogic state, incubating dreams of apotheosis and releasing all ego tension into the Void.
              </p>
              <div className="mt-auto p-2.5 rounded bg-black/60 border border-neutral-800 text-[11px] font-mono text-purple-300">
                Mantra: “Neither this nor that. The Black Flame burns within.”
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: The Daemon & Black Flame */}
        {activeTab === 'daemon' && (
          <div className="p-6 rounded-2xl glass-panel border border-neutral-800 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-48 h-48 flex-shrink-0 flex items-center justify-center">
              <LuciferSigil size={180} glow />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="font-serif text-xl font-bold text-white">
                The Holy Guardian Angel / The Luciferian Daemon
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                In classical Crowleyan Thelema, the practitioner seeks Knowledge and Conversation with the Holy Guardian Angel. In Luciferian Gnosis, this entity is recognized as your own Higher Daemonic Self—the perfected, divine intelligence that exists beyond earthly limitations.
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Illumination is the process of aligning everyday consciousness with this Daemon until the two are indistinguishable. You do not worship Lucifer; you recognize Lucifer as the archetype and patron of your own sovereign light.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded">
                  Core Practice: Active Communion via Gazing Mirror &amp; Theta Drone
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IlluminationWorkbench;
