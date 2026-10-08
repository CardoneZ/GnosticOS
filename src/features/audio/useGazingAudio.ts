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
// Hook
// -----------------------------------------------------------------------------
export type SonicTexture = 'none' | 'chatter' | 'roar';

export interface GazingAudioOptions {
  /** Sonic key of the active tunnel. */
  note: NoteName;
  octave?: number;
  /**
   * Binaural beat (Hz) = |right − left|. Theta ≈ 4–7, Alpha ≈ 8–12.
   * 0 disables the binaural split (pure mono drone). Headphones required.
   */
  beatHz?: number;
  /**
   * Optional carrier override (e.g. 108 / 432 / 528 Hz). When omitted, the
   * sonic key itself is the binaural carrier. When set, the key plays as a
   * separate centred drone and the binaural pair rides on this carrier.
   */
  carrierHz?: number;
  a4?: number;
  /** 0..1 master volume. Keep low — drones fatigue quickly. */
  volume?: number;
  waveform?: Exclude<OscillatorType, 'custom'>;
  /** Grant's modifiers: Baratchial's "chattering undertone", Temphioth's "roar". */
  texture?: SonicTexture;
  /** Fade-in/out seconds; also the glide time for retuning. */
  rampSeconds?: number;
}

interface Graph {
  ctx: AudioContext;
  master: GainNode;
  left: OscillatorNode;
  right: OscillatorNode;
  key: OscillatorNode;
  keyGain: GainNode;
  sub: OscillatorNode;
  chatterOsc: OscillatorNode;
  chatterGain: GainNode;
  roarFilter: BiquadFilterNode;
  roarGain: GainNode;
  analyser: AnalyserNode;
  sources: AudioScheduledSourceNode[];
}

const MAX_BEAT_HZ = 40;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function createNoiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    // Brown-ish noise: integrated white noise, leaky to stay bounded.
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    d[i] = last * 3.5;
  }
  return buf;
}

function buildGraph(ctx: AudioContext): Graph {
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 4;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  master.connect(comp).connect(analyser).connect(ctx.destination);

  // Binaural pair: hard-panned through a ChannelMerger (no crosstalk, unlike StereoPanner).
  const merger = ctx.createChannelMerger(2);
  merger.connect(master);
  const left = ctx.createOscillator();
  const right = ctx.createOscillator();
  const lg = ctx.createGain();
  const rg = ctx.createGain();
  lg.gain.value = rg.gain.value = 0.5;
  left.connect(lg).connect(merger, 0, 0);
  right.connect(rg).connect(merger, 0, 1);

  // Centred key drone (only audible when a carrier override is used).
  const key = ctx.createOscillator();
  const keyGain = ctx.createGain();
  keyGain.gain.value = 0;
  key.connect(keyGain).connect(master);

  // Sub-octave body.
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  const subGain = ctx.createGain();
  subGain.gain.value = 0.22;
  sub.connect(subGain).connect(master);

  // "Chatter": 3rd partial, amplitude-gated by a ~13 Hz square LFO.
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

  // "Roar": low-passed brown noise with slow swell.
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx);
  noise.loop = true;
  const roarFilter = ctx.createBiquadFilter();
  roarFilter.type = 'lowpass';
  roarFilter.Q.value = 2;
  const roarVca = ctx.createGain();
  roarVca.gain.value = 0.6;
  const roarLfo = ctx.createOscillator();
  roarLfo.frequency.value = 0.25;
  const roarDepth = ctx.createGain();
  roarDepth.gain.value = 0.4;
  roarLfo.connect(roarDepth).connect(roarVca.gain);
  const roarGain = ctx.createGain();
  roarGain.gain.value = 0;
  noise.connect(roarFilter).connect(roarVca).connect(roarGain).connect(master);

  const sources: AudioScheduledSourceNode[] = [left, right, key, sub, chatterOsc, chatterLfo, noise, roarLfo];
  sources.forEach((s) => s.start(now));

  return { ctx, master, left, right, key, keyGain, sub, chatterOsc, chatterGain, roarFilter, roarGain, analyser, sources };
}

export function useGazingAudio({
  note,
  octave = 4,
  beatHz = 6,
  carrierHz,
  a4 = 440,
  volume = 0.25,
  waveform = 'sine',
  texture = 'none',
  rampSeconds = 2.5,
}: GazingAudioOptions) {
  const keyHz = useMemo(() => noteToFrequency(note, octave, a4), [note, octave, a4]);
  const beat = clamp(beatHz, 0, MAX_BEAT_HZ);
  const carrier = carrierHz ?? keyHz;

  const ctxRef = useRef<AudioContext | null>(null);
  const graphRef = useRef<Graph | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Push current parameters into the live graph with a smooth glide. */
  const apply = useCallback(
    (g: Graph, glide: number) => {
      const t = g.ctx.currentTime;
      const tc = Math.max(glide / 4, 0.01); // setTargetAtTime reaches ~98% in 4τ
      g.left.frequency.setTargetAtTime(carrier - beat / 2, t, tc);
      g.right.frequency.setTargetAtTime(carrier + beat / 2, t, tc);
      g.key.frequency.setTargetAtTime(keyHz, t, tc);
      g.keyGain.gain.setTargetAtTime(carrierHz !== undefined ? 0.35 : 0, t, tc);
      g.sub.frequency.setTargetAtTime(keyHz / 2, t, tc);
      g.chatterOsc.frequency.setTargetAtTime(keyHz * 3, t, tc);
      g.chatterGain.gain.setTargetAtTime(texture === 'chatter' ? 0.08 : 0, t, tc);
      g.roarFilter.frequency.setTargetAtTime(keyHz * 0.75, t, tc);
      g.roarGain.gain.setTargetAtTime(texture === 'roar' ? 0.5 : 0, t, tc);
      g.left.type = g.right.type = g.key.type = waveform;
    },
    [carrier, beat, keyHz, carrierHz, texture, waveform],
  );

  // Live retune when the active tunnel / beat / texture changes.
  useEffect(() => {
    if (graphRef.current) apply(graphRef.current, rampSeconds);
  }, [apply, rampSeconds]);

  // Live volume.
  useEffect(() => {
    const g = graphRef.current;
    if (g) g.master.gain.setTargetAtTime(clamp(volume, 0, 1), g.ctx.currentTime, 0.1);
  }, [volume]);

  /** Must be called from a user gesture (autoplay policy). */
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

  const stop = useCallback(() => {
    const g = graphRef.current;
    if (!g) return;
    graphRef.current = null; // a new start() during fade-out builds a fresh graph
    const t = g.ctx.currentTime;
    g.master.gain.cancelScheduledValues(t);
    g.master.gain.setValueAtTime(g.master.gain.value, t);
    g.master.gain.linearRampToValueAtTime(0, t + rampSeconds);
    g.sources.forEach((s) => s.stop(t + rampSeconds + 0.05));
    g.sources[0].onended = () => g.master.disconnect();
    setIsPlaying(false);
  }, [rampSeconds]);

  // Release the device on unmount.
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
    /** Exact pitch of the sonic key in Hz. */
    keyFrequency: keyHz,
    leftHz: carrier - beat / 2,
    rightHz: carrier + beat / 2,
    beatHz: beat,
    /** For oscilloscope / visual sync with the gazing shader. */
    getAnalyser: () => graphRef.current?.analyser ?? null,
  };
}
