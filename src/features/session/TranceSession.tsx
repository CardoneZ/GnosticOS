import React, { useState, useEffect, useRef, useMemo } from 'react';
import GazingCircleCanvas, { BreathPhase } from '../gazing/GazingCircleCanvas';
import { useGazingAudio, parseNote, NoteName } from '../audio/useGazingAudio';
import { TunnelData, JournalEntryData, saveJournalEntry } from '../../platform/vault';
import { getCurrentMagickalTiming } from '../ephemeris/planetaryHours';
import {
  Play,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface TranceSessionProps {
  activeTunnel: TunnelData;
  onExit: () => void;
  onOpenJournalEntry?: (entry: JournalEntryData) => void;
}

export type TranceRhythm = 'box-4-4-4-4' | 'relax-4-7-8' | 'gnosis-7-1-7';

const RHYTHM_PRESETS: Record<TranceRhythm, { label: string; pattern: readonly number[] }> = {
  'box-4-4-4-4': { label: '4-4-4-4 Box (Equilibrium)', pattern: [4, 4, 4, 4] },
  'relax-4-7-8': { label: '4-7-8 Relax (Astral Scrying)', pattern: [4, 7, 8, 0] },
  'gnosis-7-1-7': { label: '7-1-7 Gnosis (Creative Vertigo)', pattern: [7, 1, 7, 1] },
};

/**
 * Web Audio Synthesized Ritual Tibetan Singing Bowl / Temple Bell
 */
function playSynthesizedRitualBell(baseHz = 432, duration = 4.5) {
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    const now = ctx.currentTime;

    // Inharmonic bell partials
    const partials = [
      { ratio: 1.0, gain: 0.6, decay: duration },
      { ratio: 2.0, gain: 0.35, decay: duration * 0.75 },
      { ratio: 2.76, gain: 0.25, decay: duration * 0.5 },
      { ratio: 4.07, gain: 0.15, decay: duration * 0.35 },
      { ratio: 5.43, gain: 0.08, decay: duration * 0.2 },
    ];

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.5, now);
    master.connect(ctx.destination);

    partials.forEach(({ ratio, gain, decay }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseHz * ratio, now);

      g.gain.setValueAtTime(gain, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(g);
      g.connect(master);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });

    setTimeout(() => {
      ctx.close();
    }, (duration + 1) * 1000);
  } catch (err) {
    console.warn('AudioContext bell chime failed:', err);
  }
}

export const TranceSession: React.FC<TranceSessionProps> = ({
  activeTunnel,
  onExit,
  onOpenJournalEntry,
}) => {
  // Session Stages: 'setup' -> 'active' -> 'debrief'
  const [stage, setStage] = useState<'setup' | 'active' | 'debrief'>('setup');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(20);
  const [rhythmKey, setRhythmKey] = useState<TranceRhythm>('relax-4-7-8');
  const [binauralBeatHz, setBinauralBeatHz] = useState<number>(6.0); // 6 Hz Theta
  const [volume, setVolume] = useState<number>(0.35);

  // Active Session State
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20 * 60);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('rest');
  const timerRef = useRef<number | null>(null);

  // Debrief Notes
  const [channeledText, setChanneledText] = useState<string>('');
  const [sessionResonance, setSessionResonance] = useState<number>(8);
  const [debriefSaved, setDebriefSaved] = useState<boolean>(false);

  // Sonic synthesis
  const parsedKey: NoteName = useMemo(() => {
    try {
      return parseNote(activeTunnel.musical_key);
    } catch {
      return 'E';
    }
  }, [activeTunnel.musical_key]);

  const {
    start: startAudio,
    stop: stopAudio,
    keyFrequency,
  } = useGazingAudio({
    note: parsedKey,
    beatHz: binauralBeatHz,
    volume,
    rampSeconds: 2.0,
  });

  // Countdown timer in 'active' stage
  useEffect(() => {
    if (stage === 'active') {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  // Keyboard shortcut: Esc triggers immediate grounding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (stage === 'active') {
          handleEmergencyGround();
        } else if (stage === 'setup' || stage === 'debrief') {
          onExit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, onExit]);

  const handleStartSession = async () => {
    setSecondsRemaining(selectedMinutes * 60);
    setStage('active');
    playSynthesizedRitualBell(432, 5.0); // Opening Temple Bell
    await startAudio();
  };

  const handleCompleteSession = () => {
    stopAudio();
    playSynthesizedRitualBell(528, 6.0); // Closing Resolution Bell
    setStage('debrief');
  };

  const handleEmergencyGround = () => {
    stopAudio();
    setStage('debrief');
  };

  const handleSaveDebrief = async () => {
    const timing = getCurrentMagickalTiming();
    const entryId = `session-${Date.now()}`;
    const now = new Date();

    const entry: JournalEntryData = {
      id: entryId,
      ritual_at: now.toISOString(),
      tz_offset_min: now.getTimezoneOffset(),
      latitude: 51.5074,
      longitude: -0.1278,
      moon_phase: timing.lunarState.phase,
      moon_illumination: timing.lunarState.illuminationPct / 100,
      moon_age_days: timing.lunarState.ageDays,
      day_ruler: timing.daySchedule.magickalDayRuler,
      planetary_hour: timing.currentHour.planet,
      planetary_hour_index: timing.currentHour.hourIndex,
      is_nocturnal: timing.currentHour.isNocturnal ? 1 : 0,
      resonance: sessionResonance,
      pre_state: 0,
      post_state: 5,
      working_type: 'pathworking',
      tunnel_id: activeTunnel.id,
      title: `Pathworking of Tunnel ${activeTunnel.number} (${activeTunnel.name})`,
      body_md: `Meditative trance session conducted for ${selectedMinutes} minutes on the Kala of ${activeTunnel.name} (Atu: ${activeTunnel.atu}). Sonic resonance key: ${activeTunnel.musical_key}.`,
      visions: channeledText.trim() || null,
      pre_state_label: 'Seeking Gnosis',
      post_state_label: 'Creative Apotheosis',
      offerings: [{ kind: 'devotion', quantity: `${selectedMinutes}m Trance` }],
      entities: [
        {
          entity_id: activeTunnel.id,
          intensity: sessionResonance,
          invoked: true,
        },
      ],
    };

    await saveJournalEntry(entry);
    setDebriefSaved(true);
    if (onOpenJournalEntry) {
      setTimeout(() => onOpenJournalEntry(entry), 800);
    } else {
      setTimeout(onExit, 800);
    }
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ---------------------------------------------------------------------------
  // Stage 1: Setup Modal
  // ---------------------------------------------------------------------------
  if (stage === 'setup') {
    return (
      <div className="w-full h-full bg-black/95 flex items-center justify-center p-6 select-none relative">
        <div className="max-w-xl w-full glass-panel-glow p-8 rounded-2xl border border-red-900/40 flex flex-col gap-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest block">
                Ritual Crucible • Kenneth Grant Nightside
              </span>
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-500" />
                Trance Immersion: {activeTunnel.name}
              </h2>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-purple-950 border border-purple-800 text-purple-300">
              KALA #{activeTunnel.number}
            </span>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="text-xs font-mono text-neutral-400 block mb-2">
              Ritual Duration (Minutes):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 30].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMinutes(m)}
                  className={`py-2.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    selectedMinutes === m
                      ? 'bg-red-950/80 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {m} Min
                </button>
              ))}
            </div>
          </div>

          {/* Breathing Rhythm */}
          <div>
            <label className="text-xs font-mono text-neutral-400 block mb-2">
              Breathing Rhythm / Pranayama:
            </label>
            <div className="flex flex-col gap-1.5">
              {(Object.keys(RHYTHM_PRESETS) as TranceRhythm[]).map((rk) => (
                <button
                  key={rk}
                  onClick={() => setRhythmKey(rk)}
                  className={`px-3 py-2 rounded-lg text-xs font-mono text-left transition-all border ${
                    rhythmKey === rk
                      ? 'bg-purple-950/60 border-purple-500 text-purple-100 font-semibold'
                      : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {RHYTHM_PRESETS[rk].label}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Presets */}
          <div className="flex flex-col gap-3 text-xs font-mono bg-black/60 p-3.5 rounded-xl border border-neutral-800">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-neutral-500 block">SONIC KEY DRONE</span>
                <span className="text-purple-300 font-bold">{parsedKey}</span> ({keyFrequency.toFixed(1)} Hz)
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">BINAURAL BEAT</span>
                <span className="text-amber-400 font-bold">{binauralBeatHz} Hz (Theta)</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 pt-2 border-t border-neutral-850">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>Binaural Offset</span>
                <span>{binauralBeatHz.toFixed(1)} Hz</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                step="0.5"
                value={binauralBeatHz}
                onChange={(e) => setBinauralBeatHz(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>Drone Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onExit}
              className="flex-1 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-mono border border-neutral-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleStartSession}
              className="flex-2 py-3 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-serif text-sm font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> ENTER TRANCE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Stage 2: Active Fullscreen Trance Immersion
  // ---------------------------------------------------------------------------
  if (stage === 'active') {
    return (
      <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
        {/* Full-bleed WebGL Gazing Canvas */}
        <GazingCircleCanvas
          breathPattern={RHYTHM_PRESETS[rhythmKey].pattern}
          rotationSpeed={0.08}
          mirrorDistortion={0.65}
          blur={0.12}
          colorInner="#ef4444"
          colorOuter="#8b5cf6"
          glyphSeed={activeTunnel.number}
          onBreathPhase={setCurrentPhase}
        />

        {/* Breath Cue Pill */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-2.5 rounded-full glass-panel-glow border border-red-900/50 pointer-events-none shadow-2xl">
          <div
            className={`w-3.5 h-3.5 rounded-full transition-all duration-700 ${
              currentPhase === 'inhale'
                ? 'bg-emerald-400 shadow-[0_0_15px_#34d399] scale-125'
                : currentPhase === 'hold'
                ? 'bg-amber-400 shadow-[0_0_15px_#fbbf24] scale-100'
                : 'bg-indigo-400 shadow-[0_0_15px_#818cf8] scale-75'
            }`}
          />
          <span className="font-mono text-sm uppercase tracking-widest text-neutral-200 font-bold">
            {currentPhase === 'inhale'
              ? 'Inspiratio (Inhale)'
              : currentPhase === 'hold'
              ? 'Retentio (Hold)'
              : 'Expiratio (Exhale)'}
          </span>
        </div>

        {/* Countdown HUD */}
        <div className="absolute bottom-8 left-8 glass-panel px-5 py-3 rounded-xl border border-neutral-800/80 flex items-center gap-4">
          <Clock className="w-5 h-5 text-red-500 animate-pulse" />
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">Time Remaining</span>
            <span className="font-mono text-2xl font-bold text-white tracking-widest">
              {formatTimer(secondsRemaining)}
            </span>
          </div>
        </div>

        {/* Emergency Grounding Breakout Button */}
        <div className="absolute bottom-8 right-8 flex items-center gap-3">
          <button
            onClick={handleEmergencyGround}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black/80 hover:bg-red-950/80 text-neutral-400 hover:text-red-300 border border-neutral-800 text-xs font-mono transition-all backdrop-blur"
            title="Press Escape or click to ground"
          >
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>GROUND & EXIT (ESC)</span>
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Stage 3: Immediate Post-Session Debrief
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full h-full bg-black/95 flex items-center justify-center p-6 select-none relative">
      <div className="max-w-xl w-full glass-panel-glow p-8 rounded-2xl border border-purple-900/50 flex flex-col gap-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest block">
              Trance Complete • Immediate Debrief
            </span>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Capture Channeled Gnosis
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-400">
            {selectedMinutes}m Immersion
          </span>
        </div>

        <p className="text-xs text-neutral-400 font-sans leading-relaxed">
          Record any spirit messages, auditory perceptions, or astral geometries experienced
          before everyday conscious chatter re-emerges.
        </p>

        {/* Channeled Text */}
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-purple-300 block mb-1">
            Channeled Impressions / Visions:
          </label>
          <textarea
            value={channeledText}
            onChange={(e) => setChanneledText(e.target.value)}
            rows={5}
            autoFocus
            placeholder="Write words heard, sigils glimpsed in the black mirror, or subconscious revelations..."
            className="w-full bg-black/80 border border-neutral-700 rounded-lg p-3 font-mono text-xs text-neutral-100 placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none leading-relaxed"
          />
        </div>

        {/* Resonance Rating */}
        <div>
          <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
            <span>Ritual Resonance Rating:</span>
            <span className="text-red-400 font-bold">{sessionResonance} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={sessionResonance}
            onChange={(e) => setSessionResonance(Number(e.target.value))}
            className="w-full accent-red-500 cursor-pointer"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onExit}
            className="px-4 py-2.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white text-xs font-mono border border-neutral-800 transition-all"
          >
            Discard & Return
          </button>

          <button
            onClick={handleSaveDebrief}
            disabled={debriefSaved}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-serif text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
          >
            {debriefSaved ? 'SEALED IN VAULT' : 'SEAL IN ALCHEMICAL JOURNAL'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranceSession;
