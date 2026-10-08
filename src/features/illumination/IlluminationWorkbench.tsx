import React, { useState } from 'react';
import {
  WillDesireBeliefSymbol,
  LuciferSigil,
  IshtarStar,
  AzhdahaSymbol,
  AlbTalisman,
} from '../tree/LuciferianSymbols';
import { SubliminalEngine, SUBLIMINAL_PRESETS } from '../audio/subliminalAudio';
import { playEnnChantTone } from '../audio/audioManager';
import { GrimoireEntity, DEMONIC_DIVINITIES } from '../../db/grimoireSeeds';
import {
  Flame,
  Zap,
  Volume2,
  Check,
  Send,
  Sparkles,
  BookOpen,
  ShieldAlert,
  Crown,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export type IlluminationStage = 'liberation' | 'illumination' | 'apotheosis';

interface IlluminationWorkbenchProps {
  onSendToJournal?: (entry: {
    title: string;
    body_md: string;
    working_type: string;
    pre_state_label: string;
    post_state_label: string;
    resonance: number;
  }) => void;
  onNavigateToSigilForge?: (statement: string) => void;
  onTuneToPortal?: (spirit: GrimoireEntity) => void;
}

export const IlluminationWorkbench: React.FC<IlluminationWorkbenchProps> = ({
  onSendToJournal,
  onNavigateToSigilForge,
  onTuneToPortal,
}) => {
  // Navigation & Mode
  const [currentStage, setCurrentStage] = useState<IlluminationStage>('illumination');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [completedStages, setCompletedStages] = useState<Record<IlluminationStage, boolean>>({
    liberation: true,
    illumination: false,
    apotheosis: false,
  });

  // Stage 1: Liberation State
  const [liberationIntent, setLiberationIntent] = useState<string>(
    'I SEVER ALL DOGMATIC CHAINS OF GUILT AND FEAR TO RECLAIM MY UNCONDITIONAL SOVEREIGNTY'
  );
  const [liberationFocus, setLiberationFocus] = useState<'conditioning' | 'fear_void' | 'sovereign_will'>('conditioning');

  // Stage 2: Illumination State (Will, Desire, Belief)
  const [willIntent, setWillIntent] = useState<string>(
    'TO AWAKEN UNSHAKEABLE SOVEREIGN INTELLECT AND IGNITE THE BLACK FLAME IN ALL CREATIVE ENDEAVORS'
  );
  const [desireModality, setDesireModality] = useState<
    'ecstatic' | 'enn_chant' | 'death_posture' | 'breath_fire'
  >('enn_chant');
  const [beliefSubconsciousState, setBeliefSubconsciousState] = useState<
    'neither_neither' | 'subconscious_void' | 'living_daemon'
  >('neither_neither');

  // Stage 3: Apotheosis State
  const [apotheosisIntent, setApotheosisIntent] = useState<string>(
    'I AM THE LIVING BLACK FLAME, SOVEREIGN CREATOR AND DIVINE DAEMON INCARNATE'
  );
  const [apotheosisPillar, setApotheosisPillar] = useState<'daemon_union' | 'thaumiel_sun' | 'subjective_mastery'>('daemon_union');

  // Operations tabs within Stage 2
  const [stage2SubTab, setStage2SubTab] = useState<'trine' | 'daily' | 'daemon'>('trine');

  // Charging Animation
  const [isCharging, setIsCharging] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [chargedSuccess, setChargedSuccess] = useState(false);

  // Audio Subliminal Invocation
  const [isAudioRunning, setIsAudioRunning] = useState(false);
  const [subliminalEngine, setSubliminalEngine] = useState<SubliminalEngine | null>(null);

  const toggleStageCompletion = (st: IlluminationStage, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedStages((prev) => ({ ...prev, [st]: !prev[st] }));
  };

  const handleToggleSubliminal = () => {
    if (isAudioRunning) {
      if (subliminalEngine) {
        subliminalEngine.stop();
        setSubliminalEngine(null);
      }
      setIsAudioRunning(false);
    } else {
      const presetId =
        currentStage === 'liberation'
          ? 'azazel_void'
          : currentStage === 'apotheosis'
          ? 'thaumiel_black_sun'
          : 'will_desire_belief';
      const preset =
        SUBLIMINAL_PRESETS.find((p) => p.id === presetId) ||
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

  const handleOpenInSigilForge = (statement: string) => {
    if (onNavigateToSigilForge) {
      onNavigateToSigilForge(statement);
    }
  };

  const handleCommitCurrentStageToJournal = () => {
    if (!onSendToJournal) return;
    if (currentStage === 'liberation') {
      onSendToJournal({
        title: `Stage I: Liberation Rite — ${liberationIntent.slice(0, 36)}...`,
        body_md: `### Stage I: Luciferian Liberation (Nigredo)
**Operation**: Severing Dogmatic Chains & Slave Morality
**Primary Intent**: ${liberationIntent}
**Focus Vector**: ${liberationFocus.toUpperCase()}

The inherited mental conditioning, guilt, and fear of the shadow have been severed. The psyche returns to pure primal ground zero, ready for the ignition of the Black Flame.

*Ave Phosphorus. Hail the Sovereign Mind.*`,
        working_type: 'ritual',
        pre_state_label: 'Conditioned / Dogmatic',
        post_state_label: 'Liberated Sovereign',
        resonance: 9,
      });
    } else if (currentStage === 'illumination') {
      onSendToJournal({
        title: `Stage II: Illumination Trine — ${willIntent.slice(0, 36)}...`,
        body_md: `### Stage II: Luciferian Illumination (Albedo)
**Operation**: Will, Desire & Belief Crucible (Zos Kia Cultus)
**Will (Thelema / Phosphorus)**: ${willIntent}
**Desire Modality**: ${desireModality.toUpperCase()}
**Belief / Void Gateway**: ${beliefSubconsciousState.toUpperCase()}

The Black Flame burns within the core of consciousness. The intent is released into the subconscious Kia void without conscious lust of result.

*Renich Tasa Uberaca Biasa Icar Lucifer.*`,
        working_type: 'invocation',
        pre_state_label: 'Seeking Gnosis',
        post_state_label: 'Illuminated Black Flame',
        resonance: 10,
      });
    } else {
      onSendToJournal({
        title: `Stage III: Apotheosis Working — ${apotheosisIntent.slice(0, 36)}...`,
        body_md: `### Stage III: Luciferian Apotheosis (Rubedo)
**Operation**: Living Godhood & Daemon Realization
**Summit Formula**: ${apotheosisIntent}
**Divine Axis**: ${apotheosisPillar.toUpperCase()}

Consciousness and Daemon unite. The Magus stands at the center of their subjective universe, not praying or begging, but commanding manifestation from internal divine authority.

*Apotheosis Aeterna. Solve et Coagula.*`,
        working_type: 'apotheosis',
        pre_state_label: 'Illuminated Initiate',
        post_state_label: 'Embodied Daemon / Living God',
        resonance: 10,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-neutral-200 overflow-y-auto">
      {/* Top Banner Navigation */}
      <div className="px-6 py-4 border-b border-neutral-900 bg-neutral-950/80 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              currentStage === 'liberation'
                ? 'bg-neutral-900 border-neutral-600 text-neutral-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                : currentStage === 'illumination'
                ? 'bg-amber-950/70 border-amber-600/70 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                : 'bg-red-950/70 border-red-600/70 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
            }`}
          >
            {currentStage === 'liberation' && <ShieldAlert className="w-5 h-5 text-neutral-300" />}
            {currentStage === 'illumination' && <Flame className="w-5 h-5 text-amber-400" />}
            {currentStage === 'apotheosis' && <Crown className="w-5 h-5 text-red-400" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg font-bold tracking-wider text-neutral-100">
                {currentStage === 'liberation' && 'Stage I: Luciferian Liberation (Nigredo)'}
                {currentStage === 'illumination' && 'Stage II: Luciferian Illumination (Albedo)'}
                {currentStage === 'apotheosis' && 'Stage III: Luciferian Apotheosis (Rubedo)'}
              </h1>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-semibold ${
                  currentStage === 'liberation'
                    ? 'bg-neutral-900 border-neutral-700 text-neutral-300'
                    : currentStage === 'illumination'
                    ? 'bg-amber-950 border-amber-800 text-amber-300'
                    : 'bg-red-950 border-red-800 text-red-300'
                }`}
              >
                {currentStage === 'liberation' ? 'Breaking Chains' : currentStage === 'illumination' ? 'The Black Flame' : 'Living Godhood'}
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">
              The Threefold Great Work · Nigredo → Albedo → Rubedo (Zos Kia Cultus / Michael W. Ford)
            </p>
          </div>
        </div>

        {/* Global Stage Controls & Mode */}
        <div className="flex items-center gap-2">
          {/* Focus Mode Toggle */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              isFocusMode
                ? 'bg-amber-950 border border-amber-500 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {isFocusMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                Exit Focus
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                Deep Focus Mode
              </>
            )}
          </button>

          {/* Subliminal Audio Mantra Toggle */}
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

      {/* Main Container */}
      <div className="p-6 max-w-6xl mx-auto w-full flex flex-col gap-6">
        {/* INTERACTIVE STAGES NAVBAR (STAGE 1, 2, 3 CAN BE CLICKED & NAVIGATED FREELY) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
          {/* STAGE I: LIBERATION */}
          <div
            onClick={() => setCurrentStage('liberation')}
            className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
              currentStage === 'liberation'
                ? 'bg-neutral-900/90 border-neutral-400 shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-neutral-400'
                : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/40 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className={currentStage === 'liberation' ? 'font-bold text-white' : 'text-neutral-400'}>
                STAGE I · NIGREDO
              </span>
              <button
                onClick={(e) => toggleStageCompletion('liberation', e)}
                title="Toggle stage completion"
                className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                  completedStages.liberation
                    ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300 font-bold'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                }`}
              >
                {completedStages.liberation ? 'COMPLETED ✓' : 'INCOMPLETE'}
              </button>
            </div>
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
              Liberation
              {currentStage === 'liberation' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                  ACTIVE
                </span>
              )}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              Breaking dogmatic chains, guilt, and slave-morality conditioning. Embracing the void of Azazel.
            </p>
          </div>

          {/* STAGE II: ILLUMINATION */}
          <div
            onClick={() => setCurrentStage('illumination')}
            className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
              currentStage === 'illumination'
                ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-500'
                : 'bg-neutral-950/60 border-neutral-800/80 hover:border-amber-900/50 hover:bg-neutral-900/40 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className={currentStage === 'illumination' ? 'font-bold text-amber-300' : 'text-neutral-400'}>
                STAGE II · ALBEDO
              </span>
              <button
                onClick={(e) => toggleStageCompletion('illumination', e)}
                title="Toggle stage completion"
                className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                  completedStages.illumination
                    ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300 font-bold'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                }`}
              >
                {completedStages.illumination ? 'COMPLETED ✓' : 'INCOMPLETE'}
              </button>
            </div>
            <h3 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-1.5">
              Illumination
              {currentStage === 'illumination' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-900/70 text-amber-200">
                  ACTIVE
                </span>
              )}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              Igniting the Black Flame, awakening inner divinity, and mastering Will, Desire &amp; Belief.
            </p>
          </div>

          {/* STAGE III: APOTHEOSIS */}
          <div
            onClick={() => setCurrentStage('apotheosis')}
            className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
              currentStage === 'apotheosis'
                ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)] ring-1 ring-red-500'
                : 'bg-neutral-950/60 border-neutral-800/80 hover:border-red-900/50 hover:bg-neutral-900/40 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className={currentStage === 'apotheosis' ? 'font-bold text-red-300' : 'text-neutral-400'}>
                STAGE III · RUBEDO
              </span>
              <button
                onClick={(e) => toggleStageCompletion('apotheosis', e)}
                title="Toggle stage completion"
                className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                  completedStages.apotheosis
                    ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300 font-bold'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                }`}
              >
                {completedStages.apotheosis ? 'COMPLETED ✓' : 'INCOMPLETE'}
              </button>
            </div>
            <h3 className="font-serif text-sm font-bold text-red-200 flex items-center gap-1.5">
              Apotheosis
              {currentStage === 'apotheosis' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-900/70 text-red-200">
                  ACTIVE
                </span>
              )}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              Living godhood, conscious Daemon embodiment, and absolute mastery of subjective reality.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DEEP FOCUS / CONTEMPLATIVE READING CODEX (EXPANDABLE) */}
        {/* ------------------------------------------------------------- */}
        {isFocusMode && (
          <div className="p-8 rounded-2xl bg-neutral-950 border border-amber-900/50 flex flex-col gap-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif text-lg font-bold text-amber-200">
                  The Contemplative Codex of {currentStage.toUpperCase()}
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-500">Luciferian Research Society</span>
            </div>

            {currentStage === 'liberation' && (
              <div className="flex flex-col gap-4 text-sm text-neutral-300 leading-relaxed font-serif">
                <p>
                  “The Luciferian Path begins with a sacred refusal: the unmasking and violent severing of slave morality.
                  For millennia, dogmatic faiths have taught humanity that submission, guilt, and self-denial are virtues.
                  In Nigredo, the candidate recognizes that every moral code inherited without conscious questioning is a psychic leash.”
                </p>
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 font-sans text-xs text-neutral-400">
                  <h4 className="font-mono text-amber-400 font-bold uppercase mb-1">
                    First Law of Liberation
                  </h4>
                  <p>
                    You are your own temple, your own priest, and your own god. No entity outside your sovereign consciousness holds authority over your destiny. Guilt is the mechanism through which weak institutions extract your vitality. Burn it in the furnace of self-ownership.
                  </p>
                </div>
                <p>
                  To complete Stage I, the initiate meditates within the void of Azazel—the desert of isolation—stripping away social expectations, family dogma, and theological fears until only the naked, uncorrupted Will remains.
                </p>
              </div>
            )}

            {currentStage === 'illumination' && (
              <div className="flex flex-col gap-4 text-sm text-neutral-300 leading-relaxed font-serif">
                <p>
                  “Once the chains are broken in Nigredo, the empty vessel must not remain dark. It must ignite.
                  In Stage II (Albedo), the Black Flame is fanned into incandescent fire. Here, the practitioner practices
                  Austin Osman Spare’s Zos Kia Cultus: the deliberate alchemy of Will, Desire, and Belief.”
                </p>
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/60 font-sans text-xs text-neutral-300">
                  <h4 className="font-mono text-amber-400 font-bold uppercase mb-1">
                    Second Law of Illumination
                  </h4>
                  <p>
                    Desire is the fuel. Will is the laser focus. Belief is the subconscious soil.
                    You do not beg deities to grant your wishes; you formulate your sovereign intention, charge it through ecstatic or ascetic trance, and fling it into the Kia void where the universe reorganizes around your command.
                  </p>
                </div>
                <p>
                  Illumination is also communion with the Holy Guardian Angel or Luciferian Daemon—the highest, perfected archetype of your transcendent self. You do not worship Lucifer; you mirror Lucifer.
                </p>
              </div>
            )}

            {currentStage === 'apotheosis' && (
              <div className="flex flex-col gap-4 text-sm text-neutral-300 leading-relaxed font-serif">
                <p>
                  “Apotheosis (Rubedo) is the summit: Living Godhood. The boundary between the human practitioner and the Divine Daemon dissolves.
                  You are no longer an operator performing occasional rituals; you are the living conduit of the Black Sun of Thaumiel.”
                </p>
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/60 font-sans text-xs text-neutral-300">
                  <h4 className="font-mono text-red-400 font-bold uppercase mb-1">
                    Third Law of Apotheosis
                  </h4>
                  <p>
                    Does a god doubt their creation? When an embodied magus speaks, reality adjusts.
                    The dualistic illusion of subjective vs objective reality collides in the abyss of Daath.
                    You live with absolute responsibility for your thoughts, environment, and destiny.
                  </p>
                </div>
                <p>
                  In this summit stage, the magus creates worlds, commands servitors and goetic spirits as sovereign allies, and shines as an unquenchable star in the void.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STAGE I: LIBERATION WORKBENCH VIEW */}
        {/* ------------------------------------------------------------- */}
        {currentStage === 'liberation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: De-programming Engine & Intent Formulation */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-neutral-300" />
                    The Rite of Severing &amp; Liberation
                  </h2>
                  <span className="text-[10px] font-mono text-neutral-400">Nigredo Groundwork</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  Formulate the dogmatic chain or subconscious slave-morality you are permanently shattering.
                  State your declaration of absolute autonomy.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider">
                    Sovereign Liberation Declaration:
                  </label>
                  <textarea
                    value={liberationIntent}
                    onChange={(e) => setLiberationIntent(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl bg-black border border-neutral-700 p-3 text-xs text-neutral-100 font-mono tracking-wide focus:border-neutral-400 focus:outline-none"
                  />
                </div>

                {/* Focus Modality */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-neutral-400">Liberation Modality:</span>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {[
                      ['conditioning', 'Mental De-Programming'],
                      ['fear_void', 'Void of Azazel'],
                      ['sovereign_will', 'Master Morality'],
                    ].map(([modId, label]) => (
                      <button
                        key={modId}
                        onClick={() => setLiberationFocus(modId as any)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          liberationFocus === modId
                            ? 'bg-neutral-800 border-neutral-400 text-white font-bold'
                            : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DIRECT ACTION: OPEN IN CHAOS SIGIL FORGE */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleOpenInSigilForge(liberationIntent)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-600 hover:border-neutral-400 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-neutral-200" />
                    Forge Sigil from this Intent (Chaos Forge)
                  </button>

                  <button
                    onClick={handleCommitCurrentStageToJournal}
                    className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Log to Journal
                  </button>
                </div>
              </div>

              {/* 3 Steps of Liberation Rites */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex flex-col gap-2">
                  <span className="font-mono text-[10px] text-neutral-400">STEP 1</span>
                  <h4 className="font-serif text-xs font-bold text-neutral-200">The Crucible of Doubt</h4>
                  <p className="text-[11px] text-neutral-500">
                    Question every single moral belief you inherited from parents, school, or church.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex flex-col gap-2">
                  <span className="font-mono text-[10px] text-neutral-400">STEP 2</span>
                  <h4 className="font-serif text-xs font-bold text-neutral-200">The Severing Rite</h4>
                  <p className="text-[11px] text-neutral-500">
                    Write out past guilt and burn the parchment into the black crucible void.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex flex-col gap-2">
                  <span className="font-mono text-[10px] text-neutral-400">STEP 3</span>
                  <h4 className="font-serif text-xs font-bold text-neutral-200">Primal Sovereignty</h4>
                  <p className="text-[11px] text-neutral-500">
                    Re-claim the body and psyche as sacred, unpolluted ground zero.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Symbol & Quote */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center border border-neutral-800 relative min-h-[360px]">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-3 text-center">
                  Sovereign Talisman of Liberation
                </div>
                <AlbTalisman size={240} glow />
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex flex-col gap-2">
                <span className="font-mono text-neutral-300 uppercase tracking-wider font-bold">
                  The Adversarial Inversion
                </span>
                <p className="leading-relaxed font-sans">
                  “The adversary is the great awakener. To invert is not merely to rebel; it is to realize that the cage door was never locked. You were only taught that leaving was a sin.”
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STAGE II: ILLUMINATION WORKBENCH VIEW */}
        {/* ------------------------------------------------------------- */}
        {currentStage === 'illumination' && (
          <div className="flex flex-col gap-6">
            {/* Sub-tab controls for Stage II */}
            <div className="flex rounded-lg bg-neutral-900/80 p-1 border border-neutral-800 text-xs font-mono self-start">
              <button
                onClick={() => setStage2SubTab('trine')}
                className={`px-3 py-1.5 rounded transition-all ${
                  stage2SubTab === 'trine'
                    ? 'bg-amber-950 border border-amber-600 text-white font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Will · Desire · Belief
              </button>
              <button
                onClick={() => setStage2SubTab('daily')}
                className={`px-3 py-1.5 rounded transition-all ${
                  stage2SubTab === 'daily'
                    ? 'bg-amber-950 border border-amber-600 text-white font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Illumination Operations
              </button>
              <button
                onClick={() => setStage2SubTab('daemon')}
                className={`px-3 py-1.5 rounded transition-all ${
                  stage2SubTab === 'daemon'
                    ? 'bg-amber-950 border border-amber-600 text-white font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                The Daemon &amp; Black Flame
              </button>
            </div>

            {stage2SubTab === 'trine' && (
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
                      <span className="text-[10px] font-mono text-neutral-500">Sovereign Intent</span>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      Formulate your intention purely. In Luciferian Illumination, the Will must be stated without guilt, hesitation, or pleading.
                    </p>

                    <textarea
                      value={willIntent}
                      onChange={(e) => setWillIntent(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl bg-black border border-amber-900/70 p-3 text-xs text-amber-100 font-mono focus:border-amber-500 focus:outline-none"
                    />

                    {/* Quick Button to open this Will Intent directly in the Chaos Sigil Forge */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-neutral-500">
                        Zos Kia Sigilization:
                      </span>
                      <button
                        onClick={() => handleOpenInSigilForge(willIntent)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-600/80 text-amber-200 font-mono text-[11px] font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)] transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Configure &amp; Forge Sigil in Chaos Forge →
                      </button>
                    </div>
                  </div>

                  {/* 2. DESIRE */}
                  <div className="p-5 rounded-2xl bg-neutral-950/80 border border-red-950/60 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-950 border border-red-600 flex items-center justify-center font-mono text-xs font-bold text-red-300">
                          2
                        </div>
                        <h2 className="font-serif text-base font-bold text-red-200">
                          DESIRE (Eros / Daemon Energy)
                        </h2>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">Primal Power</span>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      Desire is the emotional fuel of creation. Channel primal vitality to energize the intention into incandescent reality.
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {[
                        ['enn_chant', 'Demonic Enn Resonance', 'Sacred vocal vibration'],
                        ['breath_fire', 'Breath of the Black Flame', 'Cadenced prana holding'],
                        ['ecstatic', 'Ecstatic Sensory Trance', 'Emotional peak absorption'],
                        ['death_posture', 'Death Posture / Kia Void', 'Sensory exhaustion into stillness'],
                      ].map(([modId, label, sub]) => (
                        <button
                          key={modId}
                          onClick={() => setDesireModality(modId as any)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            desireModality === modId
                              ? 'bg-red-950/90 border-red-500 text-white font-bold shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div>{label}</div>
                          <div className="text-[10px] text-neutral-500">{sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. BELIEF */}
                  <div className="p-5 rounded-2xl bg-neutral-950/80 border border-purple-950/60 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-600 flex items-center justify-center font-mono text-xs font-bold text-purple-300">
                          3
                        </div>
                        <h2 className="font-serif text-base font-bold text-purple-200">
                          BELIEF (Kia / Subconscious Absorption)
                        </h2>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">Neither-Neither</span>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      Release all conscious lust of result. The seed must be planted deep in the fertile soil of the subconscious void.
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      {[
                        ['neither_neither', 'Neither-Neither (Spare)', 'Transcending duality'],
                        ['subconscious_void', 'Black Mirror Void', 'Absorbed into obsidian'],
                        ['living_daemon', 'Living Daemon Embodiment', 'Given to the higher self'],
                      ].map(([belId, label, sub]) => (
                        <button
                          key={belId}
                          onClick={() => setBeliefSubconsciousState(belId as any)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            beliefSubconsciousState === belId
                              ? 'bg-purple-950/90 border-purple-500 text-white font-bold shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div>{label}</div>
                          <div className="text-[10px] text-neutral-500">{sub}</div>
                        </button>
                      ))}
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleFireSigilIntoVoid}
                        disabled={isCharging}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-red-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4" />
                        {isCharging ? 'Absorbing into Kia Void...' : 'Charge & Plant into Subconscious Void'}
                      </button>

                      <button
                        onClick={handleCommitCurrentStageToJournal}
                        className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        <Send className="w-4 h-4" />
                        Log to Journal
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Sacred Geometry Visualizer */}
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

            {/* Daily Operations Sub-tab */}
            {stage2SubTab === 'daily' && (
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

            {/* Daemon Sub-tab */}
            {stage2SubTab === 'daemon' && (
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
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded">
                      Core Practice: Active Communion via Gazing Mirror &amp; Theta Drone
                    </span>
                    <button
                      onClick={() => handleOpenInSigilForge('I AWAKEN CONSCIOUS UNION WITH MY HIGHER DAEMON')}
                      className="text-[11px] font-mono text-white bg-red-950/80 border border-red-700/80 px-3 py-1 rounded hover:bg-red-900 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-red-400" />
                      Forge Daemon Sigil
                    </button>
                    {onTuneToPortal && (
                      <button
                        onClick={() => {
                          const lucifer = DEMONIC_DIVINITIES.find((d) => d.slug === 'lucifer');
                          if (lucifer) onTuneToPortal(lucifer);
                        }}
                        className="text-[11px] font-mono text-amber-200 bg-amber-950/80 border border-amber-700/80 px-3 py-1 rounded hover:bg-amber-900 transition-all flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Tune Portal to Lucifer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STAGE III: APOTHEOSIS WORKBENCH VIEW */}
        {/* ------------------------------------------------------------- */}
        {currentStage === 'apotheosis' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Apotheosis Formulation & Rites */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-red-950/70 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-base font-bold text-red-200 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-red-400" />
                    The Summit of Apotheosis (Rubedo)
                  </h2>
                  <span className="text-[10px] font-mono text-red-400">Living Godhood</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  In Apotheosis, the Magus moves beyond seeking illumination. You embody the Black Flame directly, commanding reality from the seat of conscious divine authority.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-red-300 uppercase tracking-wider">
                    Apotheosis Divine Decree:
                  </label>
                  <textarea
                    value={apotheosisIntent}
                    onChange={(e) => setApotheosisIntent(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl bg-black border border-red-900/70 p-3 text-xs text-red-100 font-mono tracking-wide focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Apotheosis Pillars */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-neutral-400">Apotheosis Vector:</span>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {[
                      ['daemon_union', 'Conscious Daemon Union'],
                      ['thaumiel_sun', 'Black Sun of Thaumiel'],
                      ['subjective_mastery', 'Subjective Reality Command'],
                    ].map(([vecId, label]) => (
                      <button
                        key={vecId}
                        onClick={() => setApotheosisPillar(vecId as any)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          apotheosisPillar === vecId
                            ? 'bg-red-950 border-red-500 text-white font-bold shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                            : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Action: Open in Chaos Sigil Forge */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleOpenInSigilForge(apotheosisIntent)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-950 via-red-800 to-amber-900 border border-red-600 hover:border-red-400 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.35)] transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Forge Sigil from this Decree (Chaos Forge)
                  </button>

                  <button
                    onClick={handleCommitCurrentStageToJournal}
                    className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Log to Journal
                  </button>
                </div>
              </div>

              {/* Apotheosis Rites */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex flex-col gap-2">
                  <span className="font-mono text-[10px] text-red-400">OPERATION I</span>
                  <h4 className="font-serif text-xs font-bold text-neutral-200">The Black Sun Rite</h4>
                  <p className="text-[11px] text-neutral-500">
                    Crossing the Abyss of Daath to ignite the eternal crown of Thaumiel.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex flex-col gap-2">
                  <span className="font-mono text-[10px] text-red-400">OPERATION II</span>
                  <h4 className="font-serif text-xs font-bold text-neutral-200">The Living Avatar</h4>
                  <p className="text-[11px] text-neutral-500">
                    Complete integration: speaking and acting with the full gravitas of the Daemon.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex flex-col gap-2">
                  <span className="font-mono text-[10px] text-red-400">OPERATION III</span>
                  <h4 className="font-serif text-xs font-bold text-neutral-200">Macrocosmic Will</h4>
                  <p className="text-[11px] text-neutral-500">
                    Commanding external synchronicities without attachment or desperation.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Luciferian Summit Focal Emblem */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center border border-red-950/80 relative min-h-[360px]">
                <div className="text-[11px] font-mono uppercase tracking-widest text-red-400 mb-3 text-center">
                  The Morning Star of Apotheosis
                </div>
                <LuciferSigil size={240} glow />
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex flex-col gap-2">
                <span className="font-mono text-red-400 uppercase tracking-wider font-bold">
                  The Law of the Living God
                </span>
                <p className="leading-relaxed font-sans">
                  “A god does not hope. A god does not wish. A god wills and observes the outcome. In Apotheosis, failure is merely feedback for recalibrating the flame.”
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IlluminationWorkbench;
