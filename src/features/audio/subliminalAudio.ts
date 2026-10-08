import { registerAudioContext } from './audioManager';

/**
 * GnosticOS — Subliminal Invocation & Manifestation Audio Engine
 *
 * Combines:
 *  1. Reverberant Subliminal Voice Chanting (SpeechSynthesis with whisper pacing & resonance)
 *  2. Solfeggio / Harmonic Carrier Tones (185 Hz F#, 528 Hz Transformation, 639 Hz Communion, etc.)
 *  3. Binaural Beat Entrainment (Theta 5-7 Hz for Gnosis, Delta 2-3 Hz for subconscious imprinting)
 *  4. Respectful Demonic Invocation Presets & Custom Will-Desire-Belief Manifestation Mantras
 */

export interface SubliminalPreset {
  id: string;
  name: string;
  title: string;
  spirit?: string;
  enn: string;
  affirmations: string[];
  carrierHz: number;
  beatHz: number; // binaural frequency
  recommendedTone: string;
  description: string;
}

export const SUBLIMINAL_PRESETS: SubliminalPreset[] = [
  {
    id: 'lucifer_illumination',
    name: 'Lucifer',
    title: 'Morning Star Illumination & Apotheosis',
    spirit: 'Lucifer',
    enn: 'Renich Tasa Uberaca Biasa Icar Lucifer',
    affirmations: [
      'The Black Flame awakens within me.',
      'I am sovereign, self-directed, and illuminated.',
      'Phosphorus illuminates all darkness in my path.',
      'I possess the divine spark of wisdom and creation.',
      'My will is aligned with sovereign mastery.',
    ],
    carrierHz: 185.0, // F# (Key of Chokmah / Lucifer)
    beatHz: 6.0, // Theta
    recommendedTone: 'F#',
    description: 'Awaken the inner Black Flame, achieve mental clarity, and align with the Morning Star.',
  },
  {
    id: 'ipos_clarity',
    name: 'Ipos',
    title: 'Lion of Courage & Omniscient Sight',
    spirit: 'Ipos',
    enn: 'Desa An Ipos Ayer',
    affirmations: [
      'Desa An Ipos Ayer.',
      'Courage of the lion burns in my heart.',
      'Past, present, and future reveal their truth.',
      'My intellect is sharp, unclouded, and penetrating.',
      'I speak with authority and profound eloquence.',
    ],
    carrierHz: 196.0, // G
    beatHz: 5.5,
    recommendedTone: 'G',
    description: 'Invoke Prince/Count Ipos for fearless courage, piercing discernment, and future sight.',
  },
  {
    id: 'will_desire_belief',
    name: 'Illumination Trine',
    title: 'Zos Kia Cultus — Will, Desire & Belief',
    enn: 'Zos Kia Kia Cultus Apotheosis',
    affirmations: [
      'By my Will is the seed planted.',
      'Through my Desire is the fire ignited.',
      'In my Belief is the reality incarnated.',
      'Neither this nor that. Void becomes flesh.',
      'My desire is realized now in absolute stillness.',
    ],
    carrierHz: 528.0, // Solfeggio 528 Hz (Transformation / Miracles)
    beatHz: 7.0, // Alpha/Theta border
    recommendedTone: 'C',
    description: 'Imprint intent directly into the deep subconscious through Spare’s threefold gnosis.',
  },
  {
    id: 'belial_sovereignty',
    name: 'Belial',
    title: 'Masterless Sovereignty & Earth Power',
    spirit: 'Belial',
    enn: 'Lirach Tasa Vefa Wehlc Belial',
    affirmations: [
      'Lirach Tasa Vefa Wehlc Belial.',
      'I am without master, unbroken and untamed.',
      'The earth supports my ambition and foundation.',
      'I stand immovable in my purpose.',
      'Physical reality bends to my unwavering dedication.',
    ],
    carrierHz: 146.83, // D
    beatHz: 4.5, // Deep Theta
    recommendedTone: 'D',
    description: 'Earthly authority, career strength, self-reliance, and breaking subservience.',
  },
  {
    id: 'leviathan_abyss',
    name: 'Leviathan',
    title: 'Chaos Waters & Astral Dragon Gnosis',
    spirit: 'Leviathan',
    enn: 'Jeyan Rama Calevei Leviathan',
    affirmations: [
      'Jeyan Rama Calevei Leviathan.',
      'I navigate the dark subconscious ocean with mastery.',
      'Primal emotional power is transformed into spiritual gold.',
      'The Coiled Dragon awakens the Kundalini within.',
      'I am one with the primordial depths of eternity.',
    ],
    carrierHz: 207.65, // G#
    beatHz: 5.0,
    recommendedTone: 'G#',
    description: 'Astral lucidity, emotional equilibrium, and tapping primordial chaos currents.',
  },
];

export interface SubliminalEngineOptions {
  preset?: SubliminalPreset;
  customEnn?: string;
  customAffirmations?: string[];
  carrierHz?: number;
  beatHz?: number;
  whisperVolume?: number; // 0..1
  droneVolume?: number; // 0..1
  speechIntervalSec?: number; // interval between phrases
  selectedVoiceURI?: string;
}

export class SubliminalEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private unregisterAudio: (() => void) | null = null;
  private isRunning = false;
  private speechTimeoutId: number | null = null;
  private currentAffirmationIndex = 0;
  private phrases: string[] = [];

  constructor(private options: SubliminalEngineOptions) {
    this.refreshPhrases();
  }

  private refreshPhrases() {
    const enn = this.options.customEnn || this.options.preset?.enn || '';
    const affirmations =
      this.options.customAffirmations && this.options.customAffirmations.length > 0
        ? this.options.customAffirmations
        : this.options.preset?.affirmations || [];

    // Interleave enn with affirmations for rhythmic invocation cadence
    const list: string[] = [];
    if (enn) list.push(enn);
    for (const aff of affirmations) {
      list.push(aff);
      if (enn) list.push(enn);
    }
    this.phrases = list.length > 0 ? list : ['Apotheosis and Illumination'];
  }

  public updateOptions(opts: Partial<SubliminalEngineOptions>) {
    this.options = { ...this.options, ...opts };
    this.refreshPhrases();

    if (this.droneGain && this.ctx) {
      const vol = this.options.droneVolume ?? 0.35;
      this.droneGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.2);
    }
  }

  public start(): boolean {
    if (this.isRunning) return true;

    const AudioCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return false;

    try {
      this.ctx = new AudioCtor();
      this.unregisterAudio = registerAudioContext(this.ctx);
      const now = this.ctx.currentTime;

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.linearRampToValueAtTime(1.0, now + 2);
      this.masterGain.connect(this.ctx.destination);

      // Drone Subsystem
      this.droneGain = this.ctx.createGain();
      const droneVol = this.options.droneVolume ?? 0.35;
      this.droneGain.gain.setValueAtTime(droneVol, now);

      // Low pass filter to create deep warm sanctum acoustics
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, now);
      filter.Q.setValueAtTime(3, now);

      this.droneGain.connect(filter);
      filter.connect(this.masterGain);

      const carrierHz = this.options.carrierHz ?? this.options.preset?.carrierHz ?? 185;
      const beatHz = this.options.beatHz ?? this.options.preset?.beatHz ?? 6.0;

      // Binaural Stereo Panning
      const merger = this.ctx.createChannelMerger(2);
      merger.connect(this.droneGain);

      const oscL = this.ctx.createOscillator();
      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(carrierHz - beatHz / 2, now);
      const gainL = this.ctx.createGain();
      gainL.gain.value = 0.5;
      oscL.connect(gainL).connect(merger, 0, 0);

      const oscR = this.ctx.createOscillator();
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(carrierHz + beatHz / 2, now);
      const gainR = this.ctx.createGain();
      gainR.gain.value = 0.5;
      oscR.connect(gainR).connect(merger, 0, 1);

      // Warm sub-bass body (Octave below)
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(carrierHz * 0.5, now);
      const subGain = this.ctx.createGain();
      subGain.gain.value = 0.25;
      subOsc.connect(subGain).connect(this.droneGain);

      // Soft harmonic 5th
      const fifthOsc = this.ctx.createOscillator();
      fifthOsc.type = 'sine';
      fifthOsc.frequency.setValueAtTime(carrierHz * 1.5, now);
      const fifthGain = this.ctx.createGain();
      fifthGain.gain.value = 0.08;
      fifthOsc.connect(fifthGain).connect(this.droneGain);

      this.oscillators = [oscL, oscR, subOsc, fifthOsc];
      this.oscillators.forEach((o) => o.start(now));

      this.isRunning = true;
      this.currentAffirmationIndex = 0;
      this.scheduleNextSpeechPhrase(1000); // Start speech after 1s
      return true;
    } catch (err) {
      console.warn('SubliminalEngine start error:', err);
      return false;
    }
  }

  private scheduleNextSpeechPhrase(delayMs: number) {
    if (!this.isRunning) return;

    this.speechTimeoutId = window.setTimeout(() => {
      this.speakNextPhrase();
    }, delayMs);
  }

  private speakNextPhrase() {
    if (!this.isRunning || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (this.phrases.length === 0) return;

    const phrase = this.phrases[this.currentAffirmationIndex % this.phrases.length];
    this.currentAffirmationIndex++;

    try {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 0.88; // Reverent, deliberate slow cadence
      utterance.pitch = 0.75; // Low harmonic resonance
      utterance.volume = Math.max(0.05, Math.min(1.0, this.options.whisperVolume ?? 0.35));

      // Attempt to find a preferred voice
      const voices = window.speechSynthesis.getVoices();
      if (this.options.selectedVoiceURI) {
        const found = voices.find((v) => v.voiceURI === this.options.selectedVoiceURI);
        if (found) utterance.voice = found;
      } else {
        // Fallback to local deep English voice
        const deepVoice = voices.find(
          (v) => (v.localService && v.lang.startsWith('en') && v.name.toLowerCase().includes('david')) ||
                 (v.lang.startsWith('en') && v.name.toLowerCase().includes('male'))
        );
        if (deepVoice) utterance.voice = deepVoice;
      }

      utterance.onend = () => {
        const interval = (this.options.speechIntervalSec ?? 5) * 1000;
        this.scheduleNextSpeechPhrase(interval);
      };

      utterance.onerror = () => {
        const interval = (this.options.speechIntervalSec ?? 5) * 1000;
        this.scheduleNextSpeechPhrase(interval);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      const interval = (this.options.speechIntervalSec ?? 5) * 1000;
      this.scheduleNextSpeechPhrase(interval);
    }
  }

  public stop() {
    this.isRunning = false;

    if (this.speechTimeoutId !== null) {
      window.clearTimeout(this.speechTimeoutId);
      this.speechTimeoutId = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (this.ctx && this.masterGain && this.ctx.state !== 'closed') {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.0);

      window.setTimeout(() => {
        this.oscillators.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch {
            // ignore
          }
        });
        this.oscillators = [];
        if (this.ctx && this.ctx.state !== 'closed') {
          void this.ctx.close();
        }
        if (this.unregisterAudio) {
          this.unregisterAudio();
          this.unregisterAudio = null;
        }
        this.ctx = null;
      }, 1050);
    }
  }

  public getActivePhrase(): string {
    if (this.phrases.length === 0) return '';
    const idx = (this.currentAffirmationIndex - 1 + this.phrases.length) % this.phrases.length;
    return this.phrases[idx] || '';
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}
