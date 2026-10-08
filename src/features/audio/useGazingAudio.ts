import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { registerAudioContext } from './audioManager';

// -----------------------------------------------------------------------------
// Pitch math (12-TET, scientific pitch notation, A4 = 440 Hz by default)
// -----------------------------------------------------------------------------
export type NoteName =
  | 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E' | 'Fb' | 'E#' | 'F' | 'F#' | 'Gb'
  | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B' | 'Cb' | 'B#';

/** Semitone offset from C *of the same octave number*. B# = C of the next octave; Cb = B of the previous. */
const SEMITONE: Record<NoteName, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4, 'E#': 5, F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, Cb: -1, 'B#': 12,
};

export function noteToMidi(note: NoteName, octave = 4): number {
  const s = SEMITONE[note];
  if (s === undefined) throw new Error(`Unknown note "${note}"`);
  return 12 * (octave + 1) + s;
}

/** noteToFrequency('A') === 440, noteToFrequency('D#') ≈ 311.127 */
export function noteToFrequency(note: NoteName, octave = 4, a4 = 440): number {
  return a4 * Math.pow(2, (noteToMidi(note, octave) - 69) / 12);
}

/** Map a Tunnel's DB `musical_key` (e.g. "F#") safely onto NoteName. */
export function parseNote(raw: string): NoteName {
  const n = raw.trim().replace('♯', '#').replace('♭', 'b');
  const norm = (n[0]?.toUpperCase() ?? '') + n.slice(1);
  if (!(norm in SEMITONE)) throw new Error(`Unparseable musical key "${raw}"`);
  return norm as NoteName;
}

// -----------------------------------------------------------------------------
// Sonic Soundscape Types
// -----------------------------------------------------------------------------
export type SonicTexture = 'none' | 'chatter' | 'roar';

export type SoundscapeTimbre =
  | 'temple_drone'    // Warm Tibetan singing bowl resonance with rich organic overtones
  | 'abyssal_sub'     // Ultra-deep low-end void drone, devoid of piercing treble
  | 'astral_shimmer'  // Ethereal unison detuned stereo pad with celestial harmonics
  | 'typhonian_void'; // Subterranean brown noise rumble with slow atmospheric swell

export interface GazingAudioOptions {
  /** Sonic key of the active tunnel or entity. */
  note: NoteName;
  octave?: number;
  /**
   * Binaural beat frequency (Hz) = |right − left|.
   * Delta: 1–4 Hz | Theta: 4–7 Hz | Alpha: 8–12 Hz | Beta: 13–30 Hz.
   * Stereo headphones required for neural entrainment.
   */
  beatHz?: number;
  /**
   * Optional sacred carrier override (e.g. 108 / 432 / 528 / 639 Hz).
   * When omitted, the sonic key itself serves as the carrier.
   */
  carrierHz?: number;
  a4?: number;
  /** 0..1 master volume. */
  volume?: number;
  waveform?: Exclude<OscillatorType, 'custom'>;
  /** Grant's modifiers: Baratchial's "chattering undertone", Temphioth's "roar". */
  texture?: SonicTexture;
  /** Soundscape acoustic timbre profile. */
  timbre?: SoundscapeTimbre;
  /** 0..1 volume of the organic ambient background bed (sanctum atmosphere). */
  atmosphereLevel?: number;
  /** 0..1 volume of warm harmonic overtones (octave & 5th). */
  harmonicsLevel?: number;
  /** Fade-in/out seconds; also glide time for tuning transitions. */
  rampSeconds?: number;
}

interface Graph {
  ctx: AudioContext;
  master: GainNode;
  warmFilter: BiquadFilterNode;
  left: OscillatorNode;
  right: OscillatorNode;
  leftDetune: OscillatorNode;
  rightDetune: OscillatorNode;
  ldg: GainNode;
  rdg: GainNode;
  key: OscillatorNode;
  keyGain: GainNode;
  sub: OscillatorNode;
  subGain: GainNode;
  harmOctave: OscillatorNode;
  harmOctaveGain: GainNode;
  harmFifth: OscillatorNode;
  harmFifthGain: GainNode;
  chatterOsc: OscillatorNode;
  chatterGain: GainNode;
  roarFilter: BiquadFilterNode;
  roarGain: GainNode;
  atmosphereGain: GainNode;
  atmosphereFilter: BiquadFilterNode;
  analyser: AnalyserNode;
  sources: AudioScheduledSourceNode[];
}

const MAX_BEAT_HZ = 40;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Creates high-quality continuous Brownian/Pinkish organic ambient noise. */
function createNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.018;
    d[i] = last * 3.8;
  }
  return buf;
}

function buildGraph(ctx: AudioContext): Graph {
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 12;
  comp.ratio.value = 4;
  comp.attack.value = 0.02;
  comp.release.value = 0.25;

  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.85;

  // Master warm filter to eliminate harsh digital sterility
  const warmFilter = ctx.createBiquadFilter();
  warmFilter.type = 'lowpass';
  warmFilter.frequency.setValueAtTime(950, now);
  warmFilter.Q.setValueAtTime(2.2, now);

  master.connect(warmFilter);
  warmFilter.connect(comp);
  comp.connect(analyser);
  analyser.connect(ctx.destination);

  // Binaural Channel Merger: hard-panned discrete stereo channels (no cross-bleed)
  const merger = ctx.createChannelMerger(2);
  merger.connect(master);

  // Primary binaural oscillators
  const left = ctx.createOscillator();
  const right = ctx.createOscillator();
  const lg = ctx.createGain();
  const rg = ctx.createGain();
  lg.gain.value = rg.gain.value = 0.45;
  left.connect(lg).connect(merger, 0, 0);
  right.connect(rg).connect(merger, 0, 1);

  // Unison stereo shimmer oscillators (for ethereal width)
  const leftDetune = ctx.createOscillator();
  const rightDetune = ctx.createOscillator();
  const ldg = ctx.createGain();
  const rdg = ctx.createGain();
  ldg.gain.value = rdg.gain.value = 0; // modulated by timbre
  leftDetune.connect(ldg).connect(merger, 0, 0);
  rightDetune.connect(rdg).connect(merger, 0, 1);

  // Centred key drone (plays when carrier override is active)
  const key = ctx.createOscillator();
  const keyGain = ctx.createGain();
  keyGain.gain.value = 0;
  key.connect(keyGain).connect(master);

  // Sub-octave fundamental body
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  const subGain = ctx.createGain();
  subGain.gain.value = 0.28;
  sub.connect(subGain).connect(master);

  // Harmonic overtones (Octave + 5th) for singing bowl warmth
  const harmOctave = ctx.createOscillator();
  harmOctave.type = 'sine';
  const harmOctaveGain = ctx.createGain();
  harmOctaveGain.gain.value = 0.12;
  harmOctave.connect(harmOctaveGain).connect(master);

  const harmFifth = ctx.createOscillator();
  harmFifth.type = 'triangle';
  const harmFifthGain = ctx.createGain();
  harmFifthGain.gain.value = 0.08;
  harmFifth.connect(harmFifthGain).connect(master);

  // "Chatter" (Baratchial's 13 Hz modulated undertone)
  const chatterOsc = ctx.createOscillator();
  chatterOsc.type = 'triangle';
  const chatterVca = ctx.createGain();
  chatterVca.gain.value = 0.5;
  const chatterLfo = ctx.createOscillator();
  chatterLfo.type = 'square';
  chatterLfo.frequency.value = 13;
  const chatterDepth = ctx.createGain();
  chatterDepth.gain.value = 0.5;
  chatterLfo.connect(chatterDepth).connect(chatterVca.gain);
  const chatterGain = ctx.createGain();
  chatterGain.gain.value = 0;
  chatterOsc.connect(chatterVca).connect(chatterGain).connect(master);

  // "Roar" (Temphioth's abyssal rumble)
  const noiseBuf = createNoiseBuffer(ctx);
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;
  noise.loop = true;
  const roarFilter = ctx.createBiquadFilter();
  roarFilter.type = 'lowpass';
  roarFilter.Q.value = 3;
  const roarVca = ctx.createGain();
  roarVca.gain.value = 0.6;
  const roarLfo = ctx.createOscillator();
  roarLfo.frequency.value = 0.2;
  const roarDepth = ctx.createGain();
  roarDepth.gain.value = 0.4;
  roarLfo.connect(roarDepth).connect(roarVca.gain);
  const roarGain = ctx.createGain();
  roarGain.gain.value = 0;
  noise.connect(roarFilter).connect(roarVca).connect(roarGain).connect(master);

  // Organic Ambient Atmosphere Bed (Sanctum Wind / Temple Air)
  const atmoSource = ctx.createBufferSource();
  atmoSource.buffer = noiseBuf;
  atmoSource.loop = true;
  const atmosphereFilter = ctx.createBiquadFilter();
  atmosphereFilter.type = 'bandpass';
  atmosphereFilter.frequency.setValueAtTime(320, now);
  atmosphereFilter.Q.setValueAtTime(1.2, now);
  const atmosphereGain = ctx.createGain();
  atmosphereGain.gain.value = 0.15;
  atmoSource.connect(atmosphereFilter).connect(atmosphereGain).connect(master);

  const sources: AudioScheduledSourceNode[] = [
    left, right, leftDetune, rightDetune, key, sub,
    harmOctave, harmFifth, chatterOsc, chatterLfo,
    noise, roarLfo, atmoSource
  ];
  sources.forEach((s) => s.start(now));

  return {
    ctx, master, warmFilter, left, right, leftDetune, rightDetune, ldg, rdg,
    key, keyGain, sub, subGain, harmOctave, harmOctaveGain, harmFifth, harmFifthGain,
    chatterOsc, chatterGain, roarFilter, roarGain,
    atmosphereGain, atmosphereFilter, analyser, sources,
  };
}

export function useGazingAudio({
  note,
  octave = 4,
  beatHz = 6,
  carrierHz,
  a4 = 440,
  volume = 0.28,
  waveform = 'sine',
  texture = 'none',
  timbre = 'temple_drone',
  atmosphereLevel = 0.18,
  harmonicsLevel = 0.35,
  rampSeconds = 2.0,
}: GazingAudioOptions) {
  const keyHz = useMemo(() => noteToFrequency(note, octave, a4), [note, octave, a4]);
  const beat = clamp(beatHz, 0, MAX_BEAT_HZ);
  const carrier = carrierHz ?? keyHz;

  const ctxRef = useRef<AudioContext | null>(null);
  const graphRef = useRef<Graph | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Push current parameters into the live graph with smooth glide. */
  const apply = useCallback(
    (g: Graph, glide: number) => {
      const t = g.ctx.currentTime;
      const tc = Math.max(glide / 4, 0.02);

      // Frequencies for binaural entrainment
      g.left.frequency.setTargetAtTime(carrier - beat / 2, t, tc);
      g.right.frequency.setTargetAtTime(carrier + beat / 2, t, tc);

      // Unison detuned spread (active in 'astral_shimmer')
      const detuneAmt = timbre === 'astral_shimmer' ? 1.5 : 0;
      g.leftDetune.frequency.setTargetAtTime(carrier - beat / 2 + detuneAmt, t, tc);
      g.rightDetune.frequency.setTargetAtTime(carrier + beat / 2 - detuneAmt, t, tc);
      const detuneVol = timbre === 'astral_shimmer' ? 0.22 : 0;
      g.ldg.gain.setTargetAtTime(detuneVol, t, tc);
      g.rdg.gain.setTargetAtTime(detuneVol, t, tc);

      // Centered key drone
      g.key.frequency.setTargetAtTime(keyHz, t, tc);
      g.keyGain.gain.setTargetAtTime(carrierHz !== undefined ? 0.25 : 0, t, tc);

      // Sub-bass body
      g.sub.frequency.setTargetAtTime(keyHz * 0.5, t, tc);
      const subVol = timbre === 'abyssal_sub' ? 0.45 : 0.25;
      g.subGain.gain.setTargetAtTime(subVol, t, tc);

      // Harmonics (octave & fifth)
      g.harmOctave.frequency.setTargetAtTime(keyHz * 2, t, tc);
      g.harmFifth.frequency.setTargetAtTime(keyHz * 1.5, t, tc);
      const harmBase = clamp(harmonicsLevel, 0, 1);
      const octGain = timbre === 'abyssal_sub' ? 0.02 : harmBase * 0.16;
      const fifthGain = timbre === 'abyssal_sub' ? 0.01 : harmBase * 0.10;
      g.harmOctaveGain.gain.setTargetAtTime(octGain, t, tc);
      g.harmFifthGain.gain.setTargetAtTime(fifthGain, t, tc);

      // Grant textures
      g.chatterOsc.frequency.setTargetAtTime(keyHz * 3, t, tc);
      g.chatterGain.gain.setTargetAtTime(texture === 'chatter' ? 0.08 : 0, t, tc);
      g.roarFilter.frequency.setTargetAtTime(keyHz * 0.75, t, tc);
      g.roarGain.gain.setTargetAtTime(texture === 'roar' ? 0.5 : 0, t, tc);

      // Timbre filter shaping
      let filterCutoff = 900;
      let filterQ = 2.2;
      if (timbre === 'abyssal_sub') {
        filterCutoff = 480;
        filterQ = 1.8;
      } else if (timbre === 'astral_shimmer') {
        filterCutoff = 2200;
        filterQ = 2.8;
      } else if (timbre === 'typhonian_void') {
        filterCutoff = 620;
        filterQ = 3.5;
      }
      g.warmFilter.frequency.setTargetAtTime(filterCutoff, t, tc);
      g.warmFilter.Q.setTargetAtTime(filterQ, t, tc);

      // Atmosphere Bed Level
      const atmoVol = timbre === 'typhonian_void' ? Math.max(0.35, atmosphereLevel) : atmosphereLevel;
      g.atmosphereGain.gain.setTargetAtTime(clamp(atmoVol, 0, 1), t, tc);

      // Waveforms
      g.left.type = g.right.type = g.key.type = waveform;
      g.leftDetune.type = g.rightDetune.type = 'triangle';
    },
    [carrier, beat, keyHz, carrierHz, texture, timbre, atmosphereLevel, harmonicsLevel, waveform],
  );

  // Live retune when parameters change
  useEffect(() => {
    if (graphRef.current) apply(graphRef.current, rampSeconds);
  }, [apply, rampSeconds]);

  // Live master volume
  useEffect(() => {
    const g = graphRef.current;
    if (g) g.master.gain.setTargetAtTime(clamp(volume, 0, 1), g.ctx.currentTime, 0.1);
  }, [volume]);

  /** Start drone audio (must be called from user gesture) */
  const start = useCallback(async () => {
    try {
      setError(null);
      if (!ctxRef.current) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctxRef.current = new Ctor({ latencyHint: 'playback' });
        registerAudioContext(ctxRef.current);
      }
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') await ctx.resume();
      if (graphRef.current) return;

      const g = buildGraph(ctx);
      apply(g, 0);
      g.master.gain.linearRampToValueAtTime(clamp(volume, 0, 1), ctx.currentTime + rampSeconds);
      graphRef.current = g;
      setIsPlaying(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [apply, volume, rampSeconds]);

  /** Graceful fade out and stop */
  const stop = useCallback(() => {
    const g = graphRef.current;
    if (!g) return;
    graphRef.current = null;
    const t = g.ctx.currentTime;
    g.master.gain.cancelScheduledValues(t);
    g.master.gain.setValueAtTime(g.master.gain.value, t);
    g.master.gain.linearRampToValueAtTime(0, t + rampSeconds);
    g.sources.forEach((s) => s.stop(t + rampSeconds + 0.05));
    g.sources[0].onended = () => g.master.disconnect();
    setIsPlaying(false);
  }, [rampSeconds]);

  // Release on unmount
  useEffect(
    () => () => {
      graphRef.current = null;
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    [],
  );

  return {
    start,
    stop,
    isPlaying,
    error,
    keyFrequency: keyHz,
    leftHz: carrier - beat / 2,
    rightHz: carrier + beat / 2,
    beatHz: beat,
    carrierHz: carrier,
    timbre,
    getAnalyser: () => graphRef.current?.analyser ?? null,
  };
}
