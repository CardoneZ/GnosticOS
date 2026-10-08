/**
 * GnosticOS — Global Audio Manager & Emergency Grounding
 *
 * Provides emergency silencing of all web audio oscillators, active sound nodes,
 * and audio contexts when 'Esc' (Emergency Grounding) is triggered.
 * Also provides an authentic, resonant harmonic synthesizer for Demonic Enn chanting.
 */

// Active AudioContext registry for global emergency silencing
const activeAudioContexts = new Set<AudioContext>();

export function registerAudioContext(ctx: AudioContext): () => void {
  activeAudioContexts.add(ctx);
  return () => {
    activeAudioContexts.delete(ctx);
  };
}

/**
 * Emergency Grounding: Immediately silences all audio across the application.
 */
export function emergencyGroundAudio(): void {
  for (const ctx of activeAudioContexts) {
    try {
      if (ctx.state !== 'closed') {
        void ctx.suspend();
        void ctx.close();
      }
    } catch {
      // Ignore already closed context
    }
  }
  activeAudioContexts.clear();

  // Silence any spoken enns / affirmations (text-to-speech)
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  // Stop any HTMLAudio elements if playing
  if (typeof document !== 'undefined') {
    const audioTags = document.querySelectorAll('audio');
    audioTags.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}

/**
 * Procedural Demonic Enn Chant Synthesizer
 * Synthesizes a resonant, rhythmic drone-chant harmonic tuned to the spirit's frequency.
 */
export function playEnnChantTone(
  noteKey: string = 'D',
  durationSec: number = 2.5,
  onComplete?: () => void
): () => void {
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return () => {};

  const ctx = new AudioCtx();
  const unregister = registerAudioContext(ctx);

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(0.35, now + 0.4);
  master.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
  master.connect(ctx.destination);

  // Pitch calculation
  const noteFreqs: Record<string, number> = {
    'C': 130.81, 'C#': 138.59, 'D': 146.83, 'D#': 155.56,
    'E': 164.81, 'F': 174.61, 'F#': 185.00, 'G': 196.00,
    'G#': 207.65, 'A': 220.00, 'A#': 233.08, 'B': 246.94, 'B#': 261.63
  };
  const baseFreq = noteFreqs[noteKey.toUpperCase()] || 146.83; // D default

  // Low vocal formants: fundamental + sub-octave + fifth
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(baseFreq, now);

  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(baseFreq * 0.5, now); // Sub-bass drone

  const osc3 = ctx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(baseFreq * 1.5, now); // Fifth harmonic

  // Filter for deep temple acoustic resonance
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, now);
  filter.frequency.linearRampToValueAtTime(750, now + durationSec * 0.5);
  filter.frequency.linearRampToValueAtTime(350, now + durationSec);
  filter.Q.value = 4.5;

  osc1.connect(filter);
  osc2.connect(filter);
  osc3.connect(filter);
  filter.connect(master);

  osc1.start(now);
  osc2.start(now);
  osc3.start(now);

  osc1.stop(now + durationSec);
  osc2.stop(now + durationSec);
  osc3.stop(now + durationSec);

  const timeoutId = setTimeout(() => {
    unregister();
    void ctx.close();
    onComplete?.();
  }, durationSec * 1000 + 100);

  return () => {
    clearTimeout(timeoutId);
    unregister();
    try {
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      setTimeout(() => {
        void ctx.close();
      }, 60);
    } catch {
      // Ignore
    }
  };
}
