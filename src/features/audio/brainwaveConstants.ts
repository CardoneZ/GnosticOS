/**
 * GnosticOS — Comprehensive Brainwave & Binaural Entrainment Spectrum
 *
 * Defines the standard neurological oscillation bands and their corresponding
 * occult / meditative gnosis states across the entire system.
 */

export interface BrainwavePreset {
  id: string;
  name: string;
  hz: number;
  minHz: number;
  maxHz: number;
  label: string;
  subtitle: string;
  color: string;
  badgeClass: string;
  description: string;
  occultSignificance: string;
}

export const BRAINWAVE_BANDS: BrainwavePreset[] = [
  {
    id: 'delta',
    name: 'Delta',
    hz: 2.5,
    minHz: 0.5,
    maxHz: 3.9,
    label: 'Delta Void',
    subtitle: 'Subconscious Void & Telluric Grounding',
    color: '#6366f1',
    badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/80',
    description:
      'Deep dreamless stillness, autonomous cellular regeneration, and direct immersion into the primal unconscious.',
    occultSignificance:
      'Attributed to Malkuth / Nahemoth and deep Telluric Earth. Ideal for somatic grounding, shadow integration, and silencing ego chatter.',
  },
  {
    id: 'theta',
    name: 'Theta',
    hz: 6.0,
    minHz: 4.0,
    maxHz: 7.9,
    label: 'Theta Gnosis',
    subtitle: 'Shamanic Trance & Hypnagogic Scrying',
    color: '#ef4444',
    badgeClass: 'bg-red-950/80 text-red-300 border-red-700/80',
    description:
      'The twilight bridge between waking consciousness and dreaming; deep hypnagogia and spontaneous astral imagery.',
    occultSignificance:
      'Attributed to Yesod / Gamaliel and Binah. Austin Osman Spare’s "Death Posture", black mirror scrying, and Demonic Evocation occur here.',
  },
  {
    id: 'alpha',
    name: 'Alpha',
    hz: 10.0,
    minHz: 8.0,
    maxHz: 12.9,
    label: 'Alpha Focus',
    subtitle: 'Calm Mindfulness & Astral Visualization',
    color: '#10b981',
    badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80',
    description:
      'Relaxed, effortless alertness. Bridges conscious intent with subconscious receptivity without falling asleep.',
    occultSignificance:
      'Attributed to Chesed / Netzach. Essential for ceremonial ritual presence, vibrant astral temple visualization, and tarot contemplation.',
  },
  {
    id: 'beta',
    name: 'Beta',
    hz: 18.0,
    minHz: 13.0,
    maxHz: 29.9,
    label: 'Beta Intellect',
    subtitle: 'Active Analysis & Mercurial Severance',
    color: '#38bdf8',
    badgeClass: 'bg-sky-950/80 text-sky-300 border-sky-700/80',
    description:
      'Crisp cognitive alertness, logical problem-solving, and decisive conscious executive focus.',
    occultSignificance:
      'Attributed to Hod / Samael and Geburah. Used during complex Qabalistic gematria calculations, grimoire translation, and strict banishing.',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    hz: 40.0,
    minHz: 30.0,
    maxHz: 59.9,
    label: 'Gamma Illumination',
    subtitle: '40 Hz Luciferian Epiphany & Hyper-Synchrony',
    color: '#f59e0b',
    badgeClass: 'bg-amber-950/90 text-amber-300 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    description:
      'High-frequency hemispheric cross-coherence. Peak conscious insight, hyper-awareness, and sudden synthesis of vast esoteric wisdom.',
    occultSignificance:
      'Attributed to Kether / Thaumiel, Chokmah (The Morning Star Lucifer), and Tiphareth. The supreme frequency of Luciferian Apotheosis, awakening the Black Flame, and experiencing divine intellectual illumination.',
  },
  {
    id: 'lambda',
    name: 'Lambda / High Gamma',
    hz: 100.0,
    minHz: 60.0,
    maxHz: 120.0,
    label: 'Lambda Ecstasy',
    subtitle: 'Trans-Abyssal Mystical Transport',
    color: '#d946ef',
    badgeClass: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-600/80 shadow-[0_0_12px_rgba(217,70,239,0.3)]',
    description:
      'Hyper-fast electrical brain oscillation riding over slow deep-carrier waves. Associated with non-dual transcendence and ecstatic mystical flight.',
    occultSignificance:
      'Attributed to Daäth / The Abyss of Choronzon and beyond the Crown. Ideal for ego-shattering trance and unmanifest void navigation.',
  },
];

/**
 * Find the matching brainwave band preset for any arbitrary Hz value.
 */
export function getBrainwaveBand(hz: number): BrainwavePreset {
  if (hz < 4.0) return BRAINWAVE_BANDS[0];
  if (hz < 8.0) return BRAINWAVE_BANDS[1];
  if (hz < 13.0) return BRAINWAVE_BANDS[2];
  if (hz < 30.0) return BRAINWAVE_BANDS[3];
  if (hz < 60.0) return BRAINWAVE_BANDS[4];
  return BRAINWAVE_BANDS[5];
}

export interface QuickPreset {
  hz: number;
  label: string;
  short: string;
  highlight?: boolean;
}

/**
 * Convenient quick-selection presets for sliders and control bars.
 */
export const QUICK_BRAINWAVE_PRESETS: QuickPreset[] = [
  { hz: 2.5, label: '2.5 Hz Delta', short: 'Delta' },
  { hz: 6.0, label: '6.0 Hz Theta', short: 'Theta' },
  { hz: 10.0, label: '10 Hz Alpha', short: 'Alpha' },
  { hz: 18.0, label: '18 Hz Beta', short: 'Beta' },
  { hz: 40.0, label: '40 Hz Gamma ★', short: 'Gamma 40Hz', highlight: true },
  { hz: 100.0, label: '100 Hz Lambda', short: 'Lambda' },
];
