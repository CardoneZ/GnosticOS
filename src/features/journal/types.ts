import { MeditationRecordData } from '../../platform/vault';

export type { MeditationRecordData };

export type WorkingType =
  | 'invocation'
  | 'evocation'
  | 'pathworking'
  | 'dream'
  | 'daily_yap'
  | 'divination'
  | 'elemental_balancing'
  | 'meditation';

export const WORKING_TYPE_LABELS: Record<WorkingType, { label: string; color: string }> = {
  invocation: { label: 'Invocation', color: 'border-red-600/70 bg-red-950/40 text-red-200' },
  evocation: { label: 'Evocation', color: 'border-purple-600/70 bg-purple-950/40 text-purple-200' },
  pathworking: { label: 'Pathworking (Liber 231)', color: 'border-indigo-600/70 bg-indigo-950/40 text-indigo-200' },
  dream: { label: 'Dream Log / Astral Vision', color: 'border-blue-600/70 bg-blue-950/40 text-blue-200' },
  daily_yap: { label: 'Stream of Thought / Daily Yap', color: 'border-amber-600/70 bg-amber-950/40 text-amber-200' },
  divination: { label: 'Divination / Tarot', color: 'border-yellow-600/70 bg-yellow-950/40 text-yellow-200' },
  elemental_balancing: { label: 'Elemental Balancing', color: 'border-emerald-600/70 bg-emerald-950/40 text-emerald-200' },
  meditation: { label: 'Meditation & Trance Record', color: 'border-rose-600/70 bg-rose-950/40 text-rose-200' },
};

export const PRE_STATE_PRESETS = [
  'Anxiety / Agitation',
  'Discord / Turmoil',
  'Mental Fog',
  'Physical Inertia',
  'Spiritual Emptiness',
  'Slave Morality / Guilt',
  'Neutral / Seeking Gnosis',
];

export const POST_STATE_PRESETS = [
  'Grounded Equilibrium',
  'Luciferian Illumination',
  'Awakened Black Flame',
  'Astral Lucidity',
  'Draconian Sovereignty',
  'Creative Apotheosis',
  'Abyssal Silence',
];

export const OFFERING_PRESETS = [
  { kind: 'incense', label: 'Incense (Dragon\'s Blood, Frankincense, Copal)' },
  { kind: 'candle', label: 'Candle (Black, Crimson, Gold)' },
  { kind: 'drink', label: 'Libation (Wine, Mead, Dark Beer)' },
  { kind: 'blood', label: 'Vital Essence / Blood' },
  { kind: 'art', label: 'Hand-drawn Sigil / Art' },
  { kind: 'devotion', label: 'Chanted Enns / Meditation' },
] as const;
