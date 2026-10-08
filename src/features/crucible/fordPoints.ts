/**
 * GnosticOS — Michael W. Ford's 11 Points of Power (Apotheosis & Luciferian Witchcraft)
 *
 * Core reference doctrine for cognitive deconditioning, habit reprogramming,
 * and Luciferian self-mastery across the 3 Alchemical Stages of Becoming.
 */

export type AlchemicalStage = 'clay' | 'fire' | 'light';

export interface PowerPoint {
  pointNumber: number;
  title: string;
  shortSummary: string;
  doctrine: string;
  adversaryAspect: string;
  clayPrompt: string;  // Days 1-10: Catching herd conditioning & slave morality
  firePrompt: string;  // Days 11-20: Active boundary disruption & the Forge of Cain
  lightPrompt: string; // Days 21-30: Autonomous integration & radiant Black Flame
}

export const ALCHEMICAL_STAGES: Record<
  AlchemicalStage,
  { name: string; subtitle: string; days: string; color: string; bg: string; border: string }
> = {
  clay: {
    name: 'Clay',
    subtitle: 'Identification of Herd Dogma & Guilt',
    days: 'Days 1–10',
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-700/50',
  },
  fire: {
    name: 'Fire / The Forge of Cain',
    subtitle: 'Active Resistance & Habit Destruction',
    days: 'Days 11–20',
    color: 'text-red-400',
    bg: 'bg-red-950/40',
    border: 'border-red-700/50',
  },
  light: {
    name: 'Light / The Black Flame',
    subtitle: 'Sovereign Integration & Apotheosis',
    days: 'Days 21–30',
    color: 'text-purple-300',
    bg: 'bg-purple-950/40',
    border: 'border-purple-700/50',
  },
};

export function getStageForDay(dayIndex: number): AlchemicalStage {
  if (dayIndex <= 10) return 'clay';
  if (dayIndex <= 20) return 'fire';
  return 'light';
}

export const FORD_11_POINTS: PowerPoint[] = [
  {
    pointNumber: 1,
    title: 'Luciferian Awakening & Self-Deification',
    shortSummary: 'Godhood begins within; you are your own highest authority.',
    doctrine:
      'Lucifer represents the light of intellect, self-awareness, and personal sovereignty. Reject all external saviors or cosmic judges. You are the center of your universe; your mind is the temple and the forge.',
    adversaryAspect: 'Lucifer / Phosphorus the Bringer of Light',
    clayPrompt:
      'Where did you defer authority or seek unneeded validation today from social consensus or ingrained fear of judgment?',
    firePrompt:
      'Take full, unapologetic ownership of one uncomfortable choice today without making excuses or blaming others.',
    lightPrompt:
      'How did your conscious intellect act as the radiant sovereign master of your desires and creative focus today?',
  },
  {
    pointNumber: 2,
    title: 'The Triad of the Morning Star',
    shortSummary: 'Liberation, Illumination, and Apotheosis as daily living acts.',
    doctrine:
      'Liberation breaks mental bonds; Illumination seeks hidden knowledge and insight; Apotheosis is the deliberate evolutionary elevation of the self toward divine mastery.',
    adversaryAspect: 'The Morning Star / Azazel',
    clayPrompt:
      'What obsolete belief, guilty hesitation, or herd superstition constrained your freedom of thought today?',
    firePrompt:
      'What forbidden or difficult truth did you actively study and absorb today to expand your mental power?',
    lightPrompt:
      'In what tangible way did you synthesize higher knowledge into a sovereign victory or personal masterpiece?',
  },
  {
    pointNumber: 3,
    title: 'The Adversary as Catalyst',
    shortSummary: 'Opposition is not an obstacle; it is the vital friction for evolution.',
    doctrine:
      'The Luciferian welcomes conflict, friction, and resistance as the whetstone that sharpens the mind. Without darkness, light has no meaning; without struggle, there is no ascension.',
    adversaryAspect: 'Satan / The Opposer',
    clayPrompt:
      'Did you complain, despair, or shrink back from an obstacle today instead of recognizing it as alchemical fuel?',
    firePrompt:
      'Lean directly into friction today: confront a difficult conversation, grueling workout, or complex problem head-on.',
    lightPrompt:
      'Observe how past resistance has forged a permanent strength and resilience into your character.',
  },
  {
    pointNumber: 4,
    title: 'Mastery of Flesh & Spirit',
    shortSummary: 'Harmonizing primal subconscious instincts with razor-sharp intellect.',
    doctrine:
      'Ascetic self-denial is slave morality; unchecked hedonism is animalistic slavery. The Luciferian indulges with mastery, harnessing primal lusts, hunger, and fury as raw horsepower guided by divine Will.',
    adversaryAspect: 'Lilith / Babalon & Samael',
    clayPrompt:
      'Where did impulse, screen addiction, or unmastered craving rob your conscious Will of its direction today?',
    firePrompt:
      'Deliberately channel raw emotional intensity (lust, anger, restless energy) into creative or physical conquest.',
    lightPrompt:
      'Experience the calm, coiled predator poise of having body and spirit in absolute, balanced obedience.',
  },
  {
    pointNumber: 5,
    title: 'The Darkness Precedes the Light',
    shortSummary: 'Plumbing the subconscious abyss to retrieve raw spiritual power.',
    doctrine:
      'Ahrimanic Yoga teaches that the deepest well of psychic vitality resides in the primal, atavistic shadows of the reptilian mind (Azhdeha). Denying the shadow weakens you; diving into it crowns you.',
    adversaryAspect: 'Ahriman / Angra Mainyu',
    clayPrompt:
      'What dark thought, repressed fear, or taboo ambition did you shy away from looking in the face today?',
    firePrompt:
      'Perform Ahrimanic trance or deep gazing: face your inner serpent, acknowledge the shadow, and integrate its raw power.',
    lightPrompt:
      'Notice how self-honesty with your deepest subterranean shadows generates unshakable inner peace and immunity to fear.',
  },
  {
    pointNumber: 6,
    title: 'Self-Accountability & The Will',
    shortSummary: 'Absolute ownership of karma and results; total repudiation of victimhood.',
    doctrine:
      'There is no external fate, no bad luck to blame, and no merciful savior to bail you out. Every consequence in your life is a direct result of your decisions or reactions. Own every outcome fully.',
    adversaryAspect: 'Belial / Lord of the Earth and Foundation',
    clayPrompt:
      'Did you catch yourself adopting victim language, complaining about circumstances, or wishing someone would rescue you?',
    firePrompt:
      'Identify a past failure and verbally write out your exact 100% causal responsibility for every step of it.',
    lightPrompt:
      'Stand upon the earth as Belial: completely self-contained, grounded in your own bedrock of Will.',
  },
  {
    pointNumber: 7,
    title: 'The Forge of Cain',
    shortSummary: 'The alchemical craftsman shaping raw base instinct into sharp genius.',
    doctrine:
      'Cain is the first son of the Dragon, the wandering initiate who forged bronze and iron. He took the base dirt of the earth and the fire of Lucifer to invent technology, art, and metallurgy. Be the blacksmith of your destiny.',
    adversaryAspect: 'Tubal-Cain / The Horned Smith of the Nightside',
    clayPrompt:
      'Where are you settling for raw, unrefined emotional outbursts instead of crafting something permanent and potent?',
    firePrompt:
      'Put your craft to the fire: spend focused, uninterrupted hours building code, writing philosophy, or forging a tangible skill.',
    lightPrompt:
      'Inspect the blade of your mind: is it sharper, more lethal to illusions, and more capable than it was 10 days ago?',
  },
  {
    pointNumber: 8,
    title: 'Questioning Dogma & Sacred Cows',
    shortSummary: 'Relentless skepticism toward cultural conditioning and orthodoxies.',
    doctrine:
      'Tradition is the democracy of the dead. Do not respect rules merely because they are ancient or popular. Scrutinize laws, religious dogmas, and moral assumptions with cold, Luciferian discernment.',
    adversaryAspect: 'Mephistopheles / The Spirit that Ever Denies',
    clayPrompt:
      'What "should" or cultural expectation did you automatically obey today without conscious agreement?',
    firePrompt:
      'Directly challenge a sacred consensus belief in your peer group or family with calm, rigorous, independent logic.',
    lightPrompt:
      'Reflect on your personal philosophy: is it an original sovereign grimoire, or a collection of borrowed hand-me-downs?',
  },
  {
    pointNumber: 9,
    title: 'Strategic Solitude & The Citadel',
    shortSummary: 'Retreating into silence to fortify the mind and distill sovereign purpose.',
    doctrine:
      'The crowd is deafening and intoxicating with slave energy. The Adept must regularly retreat into the desert of the self to silence the noise, hear the inner daemon, and recharge the Black Flame.',
    adversaryAspect: 'The Hermit of the Qliphoth / Yamatu',
    clayPrompt:
      'Did you distract yourself with noise, chatter, or endless notifications today because silence felt uncomfortable?',
    firePrompt:
      'Spend at least 30 minutes in absolute silence, darkness, and digital disconnection in fixed concentration.',
    lightPrompt:
      'Feel the fortress of your private mind: impregnable, quiet, and sovereign above the storm of mundane society.',
  },
  {
    pointNumber: 10,
    title: 'Creation Over Destruction',
    shortSummary: 'Directing dark current energy into generative art, wealth, and mastery.',
    doctrine:
      'Pointless rebellion is childish; the true Left-Hand Path practitioner builds empires, writes literature, accumulates resources, and bends reality. Destruction is only useful to clear ground for monumental creation.',
    adversaryAspect: 'Lucifuge Rofocale / Lord of the Nightside Vaults',
    clayPrompt:
      'Did you consume more than you produced today? Did you tear down someone else instead of building your own kingdom?',
    firePrompt:
      'Channel dark, aggressive energy into a finished creative or commercial asset that commands respect in the material world.',
    lightPrompt:
      'Witness your works: how does your external life and sanctum reflect the majesty of your internal gnosis?',
  },
  {
    pointNumber: 11,
    title: 'The Eternal Apotheosis',
    shortSummary: 'Refusing complacency; perpetual self-overcoming and becoming.',
    doctrine:
      'Apotheosis has no final resting plateau. The moment an initiate believes they have "arrived," they decay. The Left-Hand Path is an infinite spiral of becoming (Xeper), continually shedding skins and reaching for higher heights.',
    adversaryAspect: 'Apep / The Ouroboros Serpent of Eternity',
    clayPrompt:
      'Where have you grown lazy, self-satisfied, or comfortable with past accomplishments?',
    firePrompt:
      'Identify your next terrifying mountain or discipline, set a non-negotiable target, and take the first decisive strike.',
    lightPrompt:
      'The Black Flame burns undying. You are both the creator and the creature, continually reborn in your own divine fire.',
  },
];
