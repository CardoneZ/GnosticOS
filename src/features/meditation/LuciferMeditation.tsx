import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  IshtarStar,
  AzhdahaSymbol,
  AlbTalisman,
  WillDesireBeliefSymbol,
  ishtarStarPoints,
} from '../tree/LuciferianSymbols';
import SacredSigil from '../sigils/SacredSigil';
import {
  registerAudioContext,
  rankNaturalVoices,
  pickBestNaturalVoice,
} from '../audio/audioManager';
import { Play, Square, Volume2, Timer, Sparkles, AlertTriangle, Headphones } from 'lucide-react';

/**
 * GnosticOS — Lucifer Illumination Meditation
 *
 * A timed gazing meditation (default 5 min) with:
 *  - Sigil of Lucifer, Azhdaha, Star of Ishtar, ALB, or Will-Desire-Belief at centre
 *  - Breath-synced pulse (4 in / 4 hold / 6 out)
 *  - Low theta binaural drone (F#, the Chokmah key used on the Tree view)
 *  - The enn and subliminal illumination affirmations spoken softly in the background
 *
 * Privacy: only voices installed on this machine (`localService === true`) are offered,
 * so no audio or text leaves the device.
 */

const DEFAULT_ENN = 'Renich Tasa Uberaca Biasa Icar Lucifer';
const ENN_STORAGE_KEY = 'gnosticos_lucifer_enn';
const DURATION_PRESETS = [1, 3, 5, 10, 15];
const BREATH = [
  { label: 'Inhale', seconds: 4 },
  { label: 'Hold', seconds: 4 },
  { label: 'Exhale', seconds: 6 },
] as const;
const BREATH_CYCLE = BREATH.reduce((a, b) => a + b.seconds, 0);
const DRONE_HZ = 185; // F#3
const BEAT_HZ = 6; // theta

type Phase = 'settle' | 'gaze' | 'silence' | 'return';

const PHASE_INFO: Record<Phase, { label: string; hint: string }> = {
  settle: { label: 'Settle', hint: 'Follow the breath. Let the body grow still.' },
  gaze: { label: 'Gaze & Enn', hint: 'Rest your eyes on the sigil. Let the enn carry you inward.' },
  silence: { label: 'Silent Illumination', hint: 'No words now. Hold the light behind the eyes.' },
  return: { label: 'Return', hint: 'Give thanks to your patron. Feel your body and the room again.' },
};

function phaseAt(frac: number): Phase {
  if (frac < 0.15) return 'settle';
  if (frac < 0.8) return 'gaze';
  if (frac < 0.95) return 'silence';
  return 'return';
}

function breathAt(t: number): { label: string; progress: number } {
  let x = t % BREATH_CYCLE;
  for (const b of BREATH) {
    if (x < b.seconds) return { label: b.label, progress: x / b.seconds };
    x -= b.seconds;
  }
  return { label: 'Inhale', progress: 0 };
}

function breathScale(label: string, p: number): number {
  if (label === 'Inhale') return 1 + 0.08 * p;
  if (label === 'Hold') return 1.08;
  return 1.08 - 0.08 * p;
}

function formatTime(sec: number): string {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// -----------------------------------------------------------------------------
// Audio
// -----------------------------------------------------------------------------
interface Drone {
  ctx: AudioContext;
  master: GainNode;
  sources: OscillatorNode[];
}

function startDrone(volume: number): Drone | null {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  const ctx = new Ctor();
  registerAudioContext(ctx);
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(volume, now + 4);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  master.connect(filter).connect(ctx.destination);

  const osc = (type: OscillatorType, freq: number) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    return o;
  };

  // Binaural pair, hard-panned
  const merger = ctx.createChannelMerger(2);
  merger.connect(master);
  const left = osc('sine', DRONE_HZ - BEAT_HZ / 2);
  const right = osc('sine', DRONE_HZ + BEAT_HZ / 2);
  const lg = ctx.createGain();
  const rg = ctx.createGain();
  lg.gain.value = rg.gain.value = 0.5;
  left.connect(lg).connect(merger, 0, 0);
  right.connect(rg).connect(merger, 0, 1);

  // Sub-octave body + faint fifth
  const sub = osc('triangle', DRONE_HZ / 2);
  const sg = ctx.createGain();
  sg.gain.value = 0.2;
  sub.connect(sg).connect(master);
  const fifth = osc('sine', DRONE_HZ * 1.5);
  const fg = ctx.createGain();
  fg.gain.value = 0.06;
  fifth.connect(fg).connect(master);

  const sources = [left, right, sub, fifth];
  sources.forEach((s) => s.start(now));
  return { ctx, master, sources };
}

function playBell(ctx: AudioContext) {
  if (ctx.state === 'closed') return;
  const now = ctx.currentTime;
  [392, 784, 1176].forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.22 / (i + 1), now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 5);
    o.connect(g).connect(ctx.destination);
    o.start(now);
    o.stop(now + 5.1);
  });
}

function stopDrone(d: Drone, fade: number) {
  if (d.ctx.state === 'closed') return;
  const t = d.ctx.currentTime;
  d.master.gain.cancelScheduledValues(t);
  d.master.gain.setValueAtTime(d.master.gain.value, t);
  d.master.gain.linearRampToValueAtTime(0, t + fade);
  d.sources.forEach((s) => {
    try {
      s.stop(t + fade + 0.05);
    } catch {
      // already stopped
    }
  });
  // Leave time for the closing bell to ring out
  window.setTimeout(() => {
    if (d.ctx.state !== 'closed') void d.ctx.close();
  }, (fade + 6) * 1000);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export const LuciferMeditation: React.FC = () => {
  const [minutes, setMinutes] = useState<number>(5);
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [focalSymbol, setFocalSymbol] = useState<
    'lucifer' | 'baphomet' | 'baphomet_pentagram' | 'azhdaha' | 'ishtar' | 'alb' | 'will_desire_belief'
  >('lucifer');
  const [enn, setEnn] = useState<string>(() => localStorage.getItem(ENN_STORAGE_KEY) || DEFAULT_ENN);
  const [ennEnabled, setEnnEnabled] = useState<boolean>(true);
  const [affirmationsEnabled, setAffirmationsEnabled] = useState<boolean>(true);
  const [affirmationText, setAffirmationText] = useState<string>(
    'The Black Flame awakens within me. I am sovereign and illuminated. Light and darkness unite in my will.'
  );
  const [currentSpokenText, setCurrentSpokenText] = useState<string>('');
  const [ennInterval, setEnnInterval] = useState<number>(18);
  const [ennVolume, setEnnVolume] = useState<number>(0.5);
  const [droneVolume, setDroneVolume] = useState<number>(0.18);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>('');
  const [running, setRunning] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const droneRef = useRef<Drone | null>(null);
  const activeRef = useRef<boolean>(false);
  const startRef = useRef<number>(0);
  const lastEnnRef = useRef<number>(-Infinity);
  const speechStepRef = useRef<number>(0);

  const totalSeconds = minutes * 60;
  const speechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    localStorage.setItem(ENN_STORAGE_KEY, enn);
  }, [enn]);

  // Load all available voices, prioritizing Microsoft Natural/Neural English voices
  useEffect(() => {
    if (!speechAvailable) return;
    const load = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const ranked = rankNaturalVoices(allVoices);
      setVoices(ranked);
      setVoiceURI((prev) => prev || pickBestNaturalVoice(allVoices)?.voiceURI || '');
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [speechAvailable]);

  const speakEnn = useCallback(() => {
    if (!speechAvailable) return;
    let textToSpeak = enn.trim();
    if (affirmationsEnabled && affirmationText.trim()) {
      if (speechStepRef.current % 2 === 1) {
        textToSpeak = affirmationText.trim();
      }
      speechStepRef.current++;
    }
    if (!textToSpeak) return;
    setCurrentSpokenText(textToSpeak);
    const u = new SpeechSynthesisUtterance(textToSpeak);
    const v = voices.find((x) => x.voiceURI === voiceURI);
    if (v) u.voice = v;
    u.rate = 0.72;
    u.pitch = 0.6;
    u.volume = ennVolume;
    window.speechSynthesis.speak(u);
  }, [speechAvailable, enn, affirmationText, affirmationsEnabled, voices, voiceURI, ennVolume]);

  const endSession = useCallback(
    (natural: boolean) => {
      if (!activeRef.current) return;
      activeRef.current = false;
      setRunning(false);
      if (speechAvailable) window.speechSynthesis.cancel();
      const d = droneRef.current;
      droneRef.current = null;
      if (d) {
        if (natural) playBell(d.ctx);
        stopDrone(d, natural ? 4 : 1.5);
      }
      setCompleted(natural);
    },
    [speechAvailable],
  );

  const begin = () => {
    setCompleted(false);
    setElapsed(0);
    lastEnnRef.current = -Infinity;
    speechStepRef.current = 0;
    setCurrentSpokenText(enn);
    startRef.current = performance.now();
    droneRef.current = startDrone(droneVolume);
    if (droneRef.current) playBell(droneRef.current.ctx);
    activeRef.current = true;
    setRunning(true);
  };

  // Session clock
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const t = (performance.now() - startRef.current) / 1000;
      setElapsed(t);
      if (t >= totalSeconds) {
        endSession(true);
        return;
      }
      const phase = phaseAt(t / totalSeconds);
      if (ennEnabled && phase === 'gaze' && t - lastEnnRef.current >= ennInterval) {
        lastEnnRef.current = t;
        speakEnn();
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [running, totalSeconds, ennEnabled, ennInterval, speakEnn, endSession]);

  // Live drone volume
  useEffect(() => {
    const d = droneRef.current;
    if (d && d.ctx.state !== 'closed') {
      d.master.gain.setTargetAtTime(droneVolume, d.ctx.currentTime, 0.2);
    }
  }, [droneVolume]);

  // Esc ends the session gently
  useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') endSession(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, endSession]);

  // Release audio on unmount
  useEffect(
    () => () => {
      activeRef.current = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      const d = droneRef.current;
      if (d && d.ctx.state !== 'closed') void d.ctx.close();
      droneRef.current = null;
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Session view
  // ---------------------------------------------------------------------------
  if (running) {
    const phase = phaseAt(elapsed / totalSeconds);
    const breath = breathAt(elapsed);
    const scale = reducedMotion ? 1 : breathScale(breath.label, breath.progress);
    const glow = (scale - 1) / 0.08; // 0..1
    const progress = Math.min(1, elapsed / totalSeconds);

    return (
      <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden select-none">
        {/* Breath-synced ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(127,29,29,0.35),_transparent_60%)]"
          style={{ opacity: 0.35 + 0.45 * glow }}
        />

        <div className="relative w-[min(68vh,60vw)] aspect-square flex items-center justify-center">
          {/* Rotating rings + Star of Ishtar */}
          <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
            <g>
              <circle cx="200" cy="200" r="192" fill="none" stroke="#7f1d1d" strokeWidth="1" strokeDasharray="2 6" />
              {!reducedMotion && (
                <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="140s" repeatCount="indefinite" />
              )}
            </g>
            <g>
              <circle cx="200" cy="200" r="176" fill="none" stroke="#b45309" strokeWidth="0.8" opacity="0.6" />
              {Array.from({ length: 24 }, (_, i) => {
                const a = (i * Math.PI) / 12;
                return (
                  <circle key={i} cx={200 + 176 * Math.cos(a)} cy={200 + 176 * Math.sin(a)} r={i % 3 === 0 ? 2.5 : 1.2} fill="#d4af37" opacity="0.7" />
                );
              })}
              {!reducedMotion && (
                <animateTransform attributeName="transform" type="rotate" from="360 200 200" to="0 200 200" dur="100s" repeatCount="indefinite" />
              )}
            </g>
            <g opacity={0.45 + 0.35 * glow}>
              <polygon points={ishtarStarPoints(200, 200, 165, 72)} fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinejoin="round" />
              {!reducedMotion && (
                <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="240s" repeatCount="indefinite" />
              )}
            </g>
            {/* Progress arc */}
            <circle
              cx="200" cy="200" r="198" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.6"
              strokeDasharray={`${2 * Math.PI * 198 * progress} ${2 * Math.PI * 198}`}
              transform="rotate(-90 200 200)"
            />
          </svg>

          {/* Sacred Focal Symbol, breathing */}
          <div style={{ transform: `scale(${scale})`, transition: 'transform 200ms linear' }}>
            {focalSymbol === 'lucifer' && (
              <SacredSigil variant="lucifer" size={240} glow color="#ef4444" alt="Sigil of Lucifer (Grimorium Verum)" />
            )}
            {focalSymbol === 'baphomet' && (
              <SacredSigil variant="baphomet" size={220} glow color="#ef4444" />
            )}
            {focalSymbol === 'baphomet_pentagram' && (
              <SacredSigil variant="baphomet_pentagram" size={220} glow color="#ef4444" />
            )}
            {focalSymbol === 'azhdaha' && <AzhdahaSymbol size={220} glow />}
            {focalSymbol === 'ishtar' && <IshtarStar size={220} glow />}
            {focalSymbol === 'alb' && <AlbTalisman size={240} glow />}
            {focalSymbol === 'will_desire_belief' && <WillDesireBeliefSymbol size={220} glow />}
          </div>
        </div>

        {/* Phase & breath guidance */}
        <div className="relative mt-6 flex flex-col items-center gap-1 text-center">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-amber-500/80">
            {PHASE_INFO[phase].label}
          </span>
          <span className="font-serif text-2xl text-neutral-100 tracking-widest">{breath.label}</span>
          <span className="text-xs text-neutral-500 max-w-md">{PHASE_INFO[phase].hint}</span>
          {phase === 'gaze' && (ennEnabled || affirmationsEnabled) && (
            <span className="mt-2 font-serif italic text-sm text-red-300/80 px-4 py-1 rounded bg-black/40 border border-red-950 max-w-md">
              “{currentSpokenText || enn}”
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 text-xs font-mono text-neutral-500">
          <span>{formatTime(totalSeconds - elapsed)} remaining</span>
          <button
            onClick={() => endSession(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white"
          >
            <Square className="w-3 h-3" /> End (Esc)
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Setup view
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full h-full overflow-y-auto bg-black text-neutral-200 p-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <header className="flex items-center gap-4 border-b border-neutral-800 pb-4">
          <SacredSigil variant="lucifer" size={56} glow color="#ef4444" alt="Sigil of Lucifer" />
          <div>
            <h1 className="font-decorative text-2xl font-bold tracking-wider text-white">
              Lucifer Illumination Meditation
            </h1>
            <p className="text-xs font-mono text-neutral-400">
              Patron sigil gazing · breathwork · theta drone · enn chanting &amp; subliminal affirmations
            </p>
          </div>
        </header>

        {completed && (
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 text-sm text-amber-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Session complete. The Black Flame burns brightly within.
          </div>
        )}

        {/* Focal Symbol Selector */}
        <section className="glass-panel p-4 rounded-xl flex flex-col gap-3">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Sacred Focal Glyph
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'lucifer', label: 'Sigil of Lucifer', desc: 'Grimorium Verum' },
              { id: 'baphomet', label: 'Sigil of Baphomet', desc: 'Solve et Coagula' },
              { id: 'baphomet_pentagram', label: 'Baphomet Pentagram', desc: 'Goat of Mendes' },
              { id: 'azhdaha', label: 'Azhdaha Dragon', desc: 'Serpent of Darkness' },
              { id: 'ishtar', label: 'Star of Ishtar', desc: 'Morning Star Venus' },
              { id: 'will_desire_belief', label: 'Will, Desire & Belief', desc: 'Illumination Trine' },
              { id: 'alb', label: 'ALB Talisman', desc: 'Light Bearers' },
            ].map((sym) => (
              <button
                key={sym.id}
                onClick={() => setFocalSymbol(sym.id as any)}
                className={`p-3 rounded-lg text-left border transition-all ${
                  focalSymbol === sym.id
                    ? 'bg-red-950/70 border-red-600 text-white font-bold shadow-[0_0_12px_rgba(220,38,38,0.35)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="font-serif text-sm text-neutral-100">{sym.label}</div>
                <div className="text-[10px] font-mono text-neutral-500">{sym.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Duration */}
        <section className="glass-panel p-4 rounded-xl flex flex-col gap-3">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5" /> Duration
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {DURATION_PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMinutes(m);
                  setCustomMinutes('');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-mono border transition-all ${
                  minutes === m && !customMinutes
                    ? 'bg-red-950/70 border-red-700/70 text-white font-bold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {m} min
              </button>
            ))}
            <input
              type="number"
              min={1}
              max={60}
              value={customMinutes}
              onChange={(e) => {
                setCustomMinutes(e.target.value);
                const n = parseInt(e.target.value, 10);
                if (n >= 1 && n <= 60) setMinutes(n);
              }}
              placeholder="Custom"
              className="w-24 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm font-mono text-neutral-200 focus:outline-none focus:border-red-600"
            />
          </div>
          <p className="text-[11px] text-neutral-500">
            Phases: settle (15%) → gaze &amp; enn (65%) → silent illumination (15%) → return (5%).
          </p>
        </section>

        {/* Enn & Subliminal Affirmations */}
        <section className="glass-panel p-4 rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">Enn</label>
            <label className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <input type="checkbox" checked={ennEnabled} onChange={(e) => setEnnEnabled(e.target.checked)} className="accent-red-600" />
              Speak in background
            </label>
          </div>
          <input
            type="text"
            value={enn}
            onChange={(e) => setEnn(e.target.value)}
            className="w-full bg-black/80 border border-neutral-700 rounded-lg px-3 py-2.5 font-serif text-lg text-neutral-100 focus:outline-none focus:border-red-600"
          />
          <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            Confirm this enn against your own books — edit it here and it will be remembered.
          </p>

          {/* Subliminal Manifestation Affirmations */}
          <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Subliminal Illumination Affirmation
              </label>
              <label className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <input
                  type="checkbox"
                  checked={affirmationsEnabled}
                  onChange={(e) => setAffirmationsEnabled(e.target.checked)}
                  className="accent-amber-500"
                />
                Alternate with Enn
              </label>
            </div>
            {affirmationsEnabled && (
              <textarea
                value={affirmationText}
                onChange={(e) => setAffirmationText(e.target.value)}
                rows={2}
                className="w-full bg-black/80 border border-neutral-700 rounded-lg p-2.5 font-serif text-sm text-neutral-200 focus:outline-none focus:border-amber-600"
                placeholder="Enter manifestation affirmations to whisper between enns..."
              />
            )}
          </div>

          {speechAvailable ? (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <label className="flex flex-col gap-1 text-neutral-400">
                  <span className="flex items-center justify-between">
                    <span>English Voice (TTS)</span>
                    <span className="text-[10px] text-amber-400 font-semibold">
                      {voices.find((v) => v.voiceURI === voiceURI)?.name.includes('Natural') ? '✦ Natural Neural' : 'Active'}
                    </span>
                  </span>
                  <select
                    value={voiceURI}
                    onChange={(e) => setVoiceURI(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-200"
                  >
                    {voices.length === 0 && <option value="">No English voices detected</option>}
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name.replace('Microsoft ', 'MS ').replace('Online (Natural)', '✦ Natural')} ({v.lang})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-neutral-400">
                  Repeat every {ennInterval}s
                  <input type="range" min={10} max={60} step={5} value={ennInterval} onChange={(e) => setEnnInterval(+e.target.value)} className="accent-red-600" />
                </label>
                <label className="flex flex-col gap-1 text-neutral-400">
                  Enn volume {Math.round(ennVolume * 100)}%
                  <input type="range" min={0.1} max={1} step={0.05} value={ennVolume} onChange={(e) => setEnnVolume(+e.target.value)} className="accent-red-600" />
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={speakEnn}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-mono"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  Test Voice Pronunciation
                </button>

                <p className="text-[11px] font-mono text-neutral-500">
                  💡 <strong>Windows Voices:</strong> Open Windows Settings → <em>Time &amp; Language</em> → <em>Speech</em> → <em>Add voices</em> to download free Microsoft Natural Voices (Jenny, Guy, Aria).
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-500">Text-to-speech isn’t available in this environment.</p>
          )}
        </section>

        {/* Drone */}
        <section className="glass-panel p-4 rounded-xl flex flex-col gap-2 text-xs font-mono">
          <label className="text-neutral-400 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" /> Theta drone (F#, 6 Hz binaural) — {Math.round(droneVolume * 100)}%
          </label>
          <input type="range" min={0} max={0.4} step={0.01} value={droneVolume} onChange={(e) => setDroneVolume(+e.target.value)} className="accent-amber-500" />
          <p className="text-neutral-500 flex items-center gap-1.5">
            <Headphones className="w-3 h-3" /> Headphones needed for the binaural effect.
          </p>
        </section>

        <button
          onClick={begin}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-red-900 via-neutral-900 to-amber-900 hover:from-red-800 hover:to-amber-800 border border-amber-700/50 text-white font-serif text-sm font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 transition-all"
        >
          <Play className="w-4 h-4" /> Begin · {minutes} min
        </button>
      </div>
    </div>
  );
};

export default LuciferMeditation;
