/**
 * GnosticOS — Demonolatry Academy Curriculum & Practice Codex
 * Authenticated Lessons from S. Connolly Course Notes & Dukanté Tradition
 */

export interface DemonolatryLesson {
  id: number;
  title: string;
  subtitle: string;
  focus: string;
  homeworkTitle: string;
  homeworkInstructions: string;
  sections: {
    heading: string;
    body: string;
    keyTakeaway?: string;
  }[];
  verbatimNotes: string;
}

export interface DemonVariation {
  primaryName: string;
  variants: string[];
  originalRole: string;
  grimoireRole: string;
  historicalContext: string;
  element: string;
  enn?: string;
}

export interface DemonicDivinity {
  number: number;
  name: string;
  element: string;
  direction: string;
  archetype: string;
  enn: string;
  polarity: {
    masculine: string;
    feminine: string;
  };
  prayer: string;
  knotIndex: number;
}

export interface HolyRite {
  id: string;
  dateStr: string;
  month: number; // 1-12
  day: number;
  name: string;
  demonRuler: string;
  element: string;
  significance: string;
  purpose: string;
}

// -----------------------------------------------------------------------------
// The 9 Demonic Divinities (Knot-Cord Tradition)
// -----------------------------------------------------------------------------

export const NINE_DEMONIC_DIVINITIES: DemonicDivinity[] = [
  {
    number: 1,
    name: 'Satan',
    element: 'Quintessence / All Elements',
    direction: 'Centre / The Whole',
    archetype: 'The All, Acasual Source, Divine Whole',
    enn: 'Tasa reme laris Satan - Ave Satanis',
    polarity: {
      masculine: 'Active divine intelligence, cosmic spark, supreme sovereignty',
      feminine: 'Receptive cosmic womb, void of potential, eternal matrix',
    },
    prayer: 'Divine Intelligence replete with wisdom, we acknowledge the whole in each of its parts. Satanis, unifier of the elements, strengthen my sovereign will.',
    knotIndex: 1,
  },
  {
    number: 2,
    name: 'Lucifer',
    element: 'Air',
    direction: 'East',
    archetype: 'Enlightenment, Morning Star, Wisdom & Intellect',
    enn: 'Renich Tasa Uberaca Biasa Icar Lucifer',
    polarity: {
      masculine: 'The Light Bearer, independent intellect, sovereign will, black flame',
      feminine: 'Morning Star Venus / Ishtar, intuitive gnosis, sublime inspiration',
    },
    prayer: 'Lord of Air and Illumination, breathe clarity through my mind. Cleanse dogmatic illusions and grant the wisdom to see the whole in conjunction with its parts.',
    knotIndex: 2,
  },
  {
    number: 3,
    name: 'Flereous',
    element: 'Fire',
    direction: 'South',
    archetype: 'Vitality, Passion, Action & Transmutation',
    enn: 'Ganic Tasa Fubin Flereous',
    polarity: {
      masculine: 'Transformative flame, aggressive action, physical courage, sovereign heat',
      feminine: 'Sacred inner hearth, purification of spirit, passionate rebirth',
    },
    prayer: 'Spirit of Fire and Vital Spark, ignite the flame within my vessel. Fuel my will with disciplined passion and burn away inertia and doubt.',
    knotIndex: 3,
  },
  {
    number: 4,
    name: 'Leviathan',
    element: 'Water',
    direction: 'West',
    archetype: 'Subconscious Depth, Intuition & Emotional Balance',
    enn: 'Jaden Tasa Hoet Naca Leviathan',
    polarity: {
      masculine: 'The Great Sea Dragon, serpent of primordial depths, abyssal power',
      feminine: 'The astral tide, deep receptive empathy, dream incubation, emotional wisdom',
    },
    prayer: 'Serpent of the Abyssal Waters, bring balance to my emotional tides. Grant lucidity to my astral visions and deep resilience against turbulent storms.',
    knotIndex: 4,
  },
  {
    number: 5,
    name: 'Belial',
    element: 'Earth',
    direction: 'North',
    archetype: 'Stability, Carnal Strength, Grounding & Manifestation',
    enn: 'Lirach Tasa Vefa Wehlc Belial',
    polarity: {
      masculine: 'Carnal nature, physical strength, sovereign self-mastery, grounding',
      feminine: 'Nurturing Mother Earth, bountiful harvest, patience and silent foundation',
    },
    prayer: 'Lord without a Master, foundation of the physical realm. Ground my energy in fertile earth, provide stability to my temple, and anchor my works in reality.',
    knotIndex: 5,
  },
  {
    number: 6,
    name: 'Unsere',
    element: 'Life & Fertility',
    direction: 'Within / Cyclic Horizon',
    archetype: 'Life, Creation, Cycles of Growth & Maternal Gnosis',
    enn: 'Unsere tasa lirach on ca ayar',
    polarity: {
      masculine: 'Dynamic generation, sprouting seed, expanding life force',
      feminine: 'The Great Nurturer, cosmic birthgiver, healer of soul and cycles',
    },
    prayer: 'Unsere, Lady of Life and Cycles, bless this temple with vitality and continuous renewal. Help me recognize the eternal dance of rebirth in all things.',
    knotIndex: 6,
  },
  {
    number: 7,
    name: 'Eurynomous',
    element: 'Death & Transformation',
    direction: 'Abyss / Nightside Horizon',
    archetype: 'Death, Necromancy, Decomposition & Ancestral Awakening',
    enn: 'Ayar Secore on ca Eurynomous',
    polarity: {
      masculine: 'The Reaper, dissolver of obsolete vessels, silent sovereign of the grave',
      feminine: 'The fertile compost of decay, transformer of old matter into new soil',
    },
    prayer: 'Eurynomous, Keeper of Death and Metamorphosis, teach me not to fear endings. Dissolve all that hinders my apotheosis and honor the ancestral wisdom before me.',
    knotIndex: 7,
  },
  {
    number: 8,
    name: 'Verrine',
    element: 'Healing',
    direction: 'Within / Cellular Harmony',
    archetype: 'Restoration, Health, Emotional Peace & Cellular Vitality',
    enn: 'Elan Typan Verrine',
    polarity: {
      masculine: 'Disciplined physical rehabilitation, restoration of structural strength',
      feminine: 'Gentle balms, emotional soothing, intuitive regenerative vitality',
    },
    prayer: 'Verrine, Daemon of Healing and Equilibrium, restore balance to my physical and spiritual vessels. Infuse every cell with vibrant resilience and peace.',
    knotIndex: 8,
  },
  {
    number: 9,
    name: 'Amducious',
    element: 'Destruction & Overcoming',
    direction: 'Willward / Breakthrough',
    archetype: 'Active Destruction, Breakthrough of Barriers, Sonic Force',
    enn: 'Denyen valocur avage secore Amducious',
    polarity: {
      masculine: 'Battering ram of will, destructive thunder shattering stagnation',
      feminine: 'Calculated dismantling of toxic bonds, surgical severing of weakness',
    },
    prayer: 'Amducious, Shatterer of Stagnation, lend me the courage to dismantle my self-imposed limits. Break the chains of inertia and herald victory for my will.',
    knotIndex: 9,
  },
];

// -----------------------------------------------------------------------------
// The Name Game & Demon Directory
// -----------------------------------------------------------------------------

export const DEMON_VARIATIONS_DIRECTORY: DemonVariation[] = [
  {
    primaryName: 'Asmodeus',
    variants: ['Asmoday', 'Amducious (partly conflated)', 'Chashmodai', 'Sydoney', 'Asmodee'],
    originalRole: 'Zoroastrian wrath demon (Aeshma Daeva), later king of earthly pleasures, mathematics, and geometry in Talmudic lore.',
    grimoireRole: '32nd Goetic King with three heads (bull, man, ram); teaches arithmetic, astronomy, geometry, and gives the ring of Virtues.',
    historicalContext: 'A prime example of the "name game" where transliteration from Avestan through Hebrew and Latin created multiple distinct catalogue entries across centuries.',
    element: 'fire',
    enn: 'Ayer avage aloren Asmodeus aken',
  },
  {
    primaryName: 'Ronove',
    variants: ['Ronwe', 'Roneve', 'Ronoveh'],
    originalRole: 'Pre-Christian deity of rhetoric, language, knowledge, and foreign tongue translation.',
    grimoireRole: '27th Goetic Marquis and Earl; teaches rhetoric, languages, gives good servants, and bestows favor of friends and foes.',
    historicalContext: 'A clerical spelling error in medieval grimoires duplicated Ronove into Ronwe, creating two listings for the exact same wisdom archetype.',
    element: 'air',
    enn: 'Kaymen vefa Ronove',
  },
  {
    primaryName: 'Astaroth',
    variants: ['Astarte', 'Ishtar', 'Inanna', 'Ashtaroth', 'Attar'],
    originalRole: 'Supreme Phoenician and Babylonian Goddess of fertility, celestial love, sovereign sovereignty, and warfare.',
    grimoireRole: '29th Goetic Duke; reveals past, present, and future, teaches liberal sciences, and declares how spirits fell.',
    historicalContext: 'The Hebrew vowel pointing of "Bosheth" (shame) was added to the pagan goddess Astarte to turn her into a male demonic duke of hell.',
    element: 'earth',
    enn: 'Serena Alora Astaroth Aken',
  },
  {
    primaryName: 'Leviathan',
    variants: ['Luithian', 'Lotan', 'Litan', 'The Crooked Serpent'],
    originalRole: 'Ugaritic sea dragon Lotan, primordial chaos and cosmic ocean of the fertile abyss.',
    grimoireRole: 'One of the four crowned princes of Hell; elemental emperor of the West and ruler of the subconscious.',
    historicalContext: 'Spelling variants like Luithian arose in medieval French and German Demonolatry family grimoires.',
    element: 'water',
    enn: 'Jaden Tasa Hoet Naca Leviathan',
  },
  {
    primaryName: 'Dagon',
    variants: ['Dagan', 'Dac-on', 'Dagon-El'],
    originalRole: 'Ancient Mesopotamian god of agriculture, grain, and bountiful harvest worshiped by Amorites and Philistines.',
    grimoireRole: 'Misinterpreted as a monstrous fish/serpent god of the murky deep and underworld demon.',
    historicalContext: 'A tragic mistranslation connecting Semitic "dagan" (grain) with "dag" (fish) completely inverted a god of golden harvest into a sea terror.',
    element: 'earth',
    enn: 'Dagon tasa vefa on ca ayar',
  },
  {
    primaryName: 'Beelzebuth',
    variants: ['Baal-Zebul', 'Beelzebub', 'Baal-Zebub', 'Belzebud'],
    originalRole: 'Canaanite "Ba\'al Zebul" meaning "Lord of the Heavenly Mansion" or "Lord of Lords".',
    grimoireRole: 'Chief of the demonic orders, associated in pop culture with flies and pestilence.',
    historicalContext: 'Israelite rivals coined the derogatory pun "Ba\'al Zebub" meaning "Lord of the Dung/Flies" to mock the temple.',
    element: 'air',
    enn: 'Adey vocar avage Beelzebuth',
  },
  {
    primaryName: 'Belial',
    variants: ['Beliel', 'Beliar', 'Beliya\'al', 'Beliel-Ra'],
    originalRole: 'Hebrew compound phrase meaning "without a master" / "worthless to tyrants" — sovereign self-determination.',
    grimoireRole: '68th Goetic King and Earth Elemental Divinity in Demonolatry; ruler of carnal nature and stability.',
    historicalContext: 'Belial was not originally a personal name but an epithet for those who refused servitude to rulers and priests.',
    element: 'earth',
    enn: 'Lirach Tasa Vefa Wehlc Belial',
  },
];

// -----------------------------------------------------------------------------
// Courtesies of the Sorcerer (Dukanté Sect Law)
// -----------------------------------------------------------------------------

export const COURTESIES_OF_THE_SORCERER = [
  {
    id: 1,
    title: 'The Whole Over the Part',
    principle: 'We are all a part of the whole. Practitioners can learn and grow from one another, honoring the truth that individual talents and spiritual aptitudes vary.',
  },
  {
    id: 2,
    title: 'Sovereignty Against Jealousy',
    principle: 'Jealousy and envy deplete personal power. Coveting the gnosis or favor of another magician blinds the eyes to one\'s own demonic gifts and altar.',
  },
  {
    id: 3,
    title: 'Renunciation of Power Trips',
    principle: 'Ego power trips and spiritual vanity are destructive illusions. Daemons do not bow to arrogance; they partner with sincere discipline and balance.',
  },
  {
    id: 4,
    title: 'Self-Harm of Breaking Law',
    principle: 'Breaking sect law hurts no one except the practitioner himself. The universal mechanics of energy ensure that discord returns upon its author.',
  },
  {
    id: 5,
    title: 'Respect of Free Will in Invocation',
    principle: 'Always invoke; never attempt to evoke or compel. Respecting the demonic entity\'s free will creates eternal mutual alliances.',
  },
  {
    id: 6,
    title: 'Sanctity of the Circle',
    principle: 'Construct the elemental circle out of respect and balance. It is not a cage to trap spirits, but a harmonious temple that daemons prefer to visit.',
  },
  {
    id: 7,
    title: 'Balance of Giving and Taking',
    principle: 'Always offer devotion, incense, or energy in return for guidance. Balance is maintained because as much energy is given as is received.',
  },
  {
    id: 8,
    title: 'Honesty in Magickal Follow-up',
    principle: 'Magick requires mundane post-rite action. One cannot ask Belphegore for prosperity without seeking work in the physical realm.',
  },
  {
    id: 9,
    title: 'Respect for Matron & Patron Bounds',
    principle: 'Honor the unique, intimate relationship between another practitioner and their Patron. Never attempt to sever or intrude on a sacred pact.',
  },
];

// -----------------------------------------------------------------------------
// Liturgical Calendar of Demonolatry Holy Rites
// -----------------------------------------------------------------------------

export const DEMONOLATRY_HOLY_RITES: HolyRite[] = [
  {
    id: 'rite-lucifer',
    dateStr: 'March 21',
    month: 3,
    day: 21,
    name: 'Equinox Rite to Lucifer',
    demonRuler: 'Lucifer',
    element: 'Air',
    significance: 'Spring Equinox · Rebirth of light, intellect, and independent wisdom.',
    purpose: 'To celebrate the awakening of the mind, study new philosophies, and light the East quadrant in honor of illumination.',
  },
  {
    id: 'rite-walpurgisnacht',
    dateStr: 'April 30',
    month: 4,
    day: 30,
    name: 'Walpurgisnacht (May Eve)',
    demonRuler: 'Unsere & Belial',
    element: 'Earth & Life',
    significance: 'May Eve · Peak vitality, fertility, and celebration of the senses.',
    purpose: 'To commune with spirits of nature, leave outdoor altar offerings, and celebrate somatic physical incarnation.',
  },
  {
    id: 'rite-flereous',
    dateStr: 'June 22',
    month: 6,
    day: 22,
    name: 'Solstice Rite to Flereous',
    demonRuler: 'Flereous',
    element: 'Fire',
    significance: 'Summer Solstice · Maximum solar power, disciplined passion, action.',
    purpose: 'To consecrate magical blades and fire tools, ignite the will, and direct concentrated energy toward audacious goals.',
  },
  {
    id: 'rite-leviathan',
    dateStr: 'September 21',
    month: 9,
    day: 21,
    name: 'Equinox Rite to Leviathan',
    demonRuler: 'Leviathan',
    element: 'Water',
    significance: 'Autumn Equinox · First Rite initiation, emotional equilibrium, dream work.',
    purpose: 'The traditional season for Demonolatry initiations and baptisms. Facing emotional depth and attuning to the astral sea.',
  },
  {
    id: 'rite-eurynomous',
    dateStr: 'October 31',
    month: 10,
    day: 31,
    name: 'All Hallows Eve (Rite to Eurynomous)',
    demonRuler: 'Eurynomous & Baalberith',
    element: 'Death & Ancestors',
    significance: 'Hallowmas · Thinning of the veil between the living and the dead.',
    purpose: 'To honor departed ancestors, necromantic contemplation, and release old baggage into the transformative cauldron of death.',
  },
  {
    id: 'rite-belial',
    dateStr: 'December 22',
    month: 12,
    day: 22,
    name: 'Solstice Rite to Belial',
    demonRuler: 'Belial',
    element: 'Earth',
    significance: 'Winter Solstice · Deepest night, grounding of intentions into physical matter.',
    purpose: 'To ground energy, focus on long-term material foundation, and celebrate independence from dogmatic masters.',
  },
];

// -----------------------------------------------------------------------------
// The 5 Demonolatry Course Lessons (Full Texts & Notes)
// -----------------------------------------------------------------------------

export const DEMONOLATRY_LESSONS: DemonolatryLesson[] = [
  {
    id: 1,
    title: 'Lesson One: The Study of Demons & Nature of Deity',
    subtitle: 'Etymology, Hierarchies, Archetypal Polarity, and the "Name Game"',
    focus: 'Demons as pre-Christian divinities, Goetic & Dukanté hierarchies, masculine/feminine polarities in entities.',
    homeworkTitle: 'The Name Game & Demonic Spelling Exploration',
    homeworkInstructions: 'Explore the Demon directory or hierarchy sections. Find a Demon who has several different spellings of his/her name (e.g. Asmodeus/Asmoday, Ronove/Ronwe, Astarte/Astaroth). Note the variety and historical shifts. Reflect on how translation errors altered their perceived archetypes.',
    sections: [
      {
        heading: '1. True Etymology of the Word "Demon"',
        body: 'This first class is about the study of Demons, the nature of Demons and deity, and the worship of Demons as deities. The word Demon (from the Latin daimon and Greek) originally meant a divine intelligence replete with wisdom. Divine comes from the Latin divus meaning God. Therefore, we can safely say that Demons did not start out as the Christian devils as the word now applies in our modern age. Demons were originally Gods in their own right.',
        keyTakeaway: 'Daimon = Divine Intelligence replete with wisdom. Divus = God.',
      },
      {
        heading: '2. Demonology vs. Demonolatry & The "Name Game"',
        body: 'Demonology as a study was created by the Christian church to catalogue Gods (aka Demons) of past religions. Perhaps the most notable are the 72 spirits of Solomon dating back to around 100 A.D. Hebraic and other Demons were later catalogued by Johan Weyer, Peter Binsfield, Pope Honorius, etc. In most instances, these men took existing Demonic hierarchies and modified them, added to them, and changed them to create new hierarchies. Dagon was allegedly a God of harvest before somehow finding a home as a serpent God of the underworld. Beelzebuth was originally "Lord of Lords" (Baal Zebul), but misconstrued as "Lord of the Flies". Also, a good number of Demons were created from one Demon via the "name game" (Asmodeus -> Asmoday, Ronove -> Ronwe, Astarte -> Astaroth, Leviathan -> Luithian).',
        keyTakeaway: 'Hierarchies reflect personal preference. The Dukanté and Goetic hierarchies are the most popular.',
      },
      {
        heading: '3. The Nature of Deity & Archetypal Polarity',
        body: 'Some people believe deity is a single pure energy source while others believe in deity as a sentient being. This is personal choice. In Demonolatry, a few basic rules apply: Every Demon has a counterpart, positive and negative polarity, male/female polarity, and every aspect in between. In saying male/female, we are NOT talking physical sexual gender, but archetype polarities. Belial, for instance, is the Earth elemental: his feminine aspect is mother, nurturer, and bountiful harvest; his masculine aspects are carnal nature, strength, stability, and balance. Whether energy or sentient entity, a deity is composed of "matter" (pure energy). Through prayer we give it form and positive energy. In turn, it returns the favor.',
        keyTakeaway: 'Gender in Demonolatry refers to archetype polarity, not physical sex. Belial is both bountiful nurturer and carnal pillar.',
      },
    ],
    verbatimNotes: `For the best results - read through the class notes, note any questions you have, research your questions in this book, then contact your teacher with any questions that have not been answered. If there is any homework, you should do it and write a short journal entry or essay detailing your results. This should be turned into your teacher.
This first class is about the study of Demons, the nature of Demons and deity, and the worship of Demons as deities. The word Demon (from the Latin and Greek) originally meant a divine intelligence replete with wisdom. Divine comes from the Latin divus meaning God. Therefore, we can safely say that Demons did not start out as the Christian devils as the word now applies in our modern age. Demons were originally Gods in their own right.
First let's start by discussing Demonology, which is the study of Demons. Demonology as a study was created by the Christian church to catalogue Gods (aka Demons) of past religions. Perhaps the most notable are the 72 spirits of Solomon. These Goetic Demons date back to around 100 A.D. when the practice of Demonology and Demonography became common place among clergy of the Catholic church. Hebraic and other Demons were later catalogued by such noted Demonologists as Johan Weyer, Peter Binsfield, Pope Honorius, and so on. In most instances, these men took existing Demonic hierarchies and modified them, added to them, and changed them to create new hierarchies. It's no wonder that the history of many Demons has been lost through the passage of time. Dagon, for example, was allegedly a God of harvest before somehow finding a home as a serpent God of the underworld. A huge difference in purposes indeed. Or how a simple translation error can create a whole gambit of errors. i.e. Beelzebuth was originally Lord of the Flies. More recent evidence suggests that the translation was in error and he should have been identified as Lord of Lords.
Also, a good number of Demons were created from one Demon. I like to call this the "name game". A prime example of this is the Demon Asmodeous. He is also known as Asmoday, Amducious, and his name can be spelt a variety of ways. This is how one Demon becomes two. Ronove becomes Ronwe because of a simple spelling error handed on through the passage of time just as Astarte becomes Astaroth and Ashtaroth. Or Leviathan becomes Luithian and so on.
Because of this I have to say that studying different Demons and hierarchies can be a rewarding hobby and quite fascinating. In Demonolatry, the hierarchies different people use are usually based on personal preference. A lot of people use both Goetic Demons, and the Dukanté hierarchy, along with stand-alone Hebraic Demons who have no specific hierarchies. Generally the Goetia and Dukante hierarchies are the most popular.
Studying Demons can be a valuable to you as a practitioner of Demonolatry in that it can help you choose a Matron/Patron and will help you to know which Demons you wish to work with or honor for any variety of purposes. Please note that I like to point out that the definition of a Demon is not it's soul purpose. It's simply an aspect of that Demon. An option to give you a way to interpret it. We'll go into this in more depth next class.
Now I would like to discuss the nature of deity. Some people believe that deity is a single pure energy source while others believe in deity as a sentient being. This is a personal choice entirely. However, in Demonolatry a few basic rules apply to this - Every Demon has a counterpart, positive and negative polarity, male/female polarity, and every aspect in between. Let me point out that in saying male/female I am not talking physical, sexual gender as we know them. I am talking archetype polarity. Each gender represents a set of ideas or aspects that have been labeled in the feminine or masculine. You can see this polarity in the nine Demonic divinities as well as the aspects of each individual Demon. By saying a Demon is masculine or feminine, please note that I am not suggesting literal sex. Some people choose to see Leviathan as male while others see Leviathan as female. The same can be applied to Lucifer and many other Demons.
Let's use Belial as an example. Belial is the Earth elemental. His feminine aspect is mother, nurturer, and bountiful harvest. His masculine aspects are carnal nature, strength, stability, and balance. Each aspect can be helpful or hurtful depending on the perspective of the individual experience pertaining to that aspect.
One thing is for certain, whether energy or sentient entity - a deity is composed of matter. We worship (work with) this "matter". Through prayer we give it form and positive energy. In turn, it will likely return the favor. We'll discuss how prayer works a little more in the next lesson.
Homework: Read the chapter Introduction to Demonolatry. This will introduce you to the basic philosophies of Demonolatry. Also, go through the Demon directory and find a Demon who has several different spellings of his/her name. Note the variety.`,
  },
  {
    id: 2,
    title: 'Lesson Two: Ritual Basics, The 9 Divinities & Patron Selection',
    subtitle: 'The 9-Knot Prayer Cord, 3 Purposes/Parts of Ritual, and the 5-Demons Exercise',
    focus: 'The Nine Demonic Divinities, elemental balance circle, prayer as intention of will, Matron/Patron selection vs Mentor Demons.',
    homeworkTitle: 'The 5-Demons Patron Selection & Altar Construction',
    homeworkInstructions: 'Find 5 Demons from the directory: 1 Alter-Ego, 1 Complete Opposite, 1 Elemental Demon, 1 Aesthetic/Image Demon, and 1 Hidden Emotions Demon. For several nights, sit in a quiet room with a candle for 30-60 min focusing on one demon. Record thoughts, feelings, tastes, smells, and sounds. Determine which Demon left the strongest impression. Part 2: Construct an altar of offering (inconspicuous or outdoor) and make regular offerings with journal entries.',
    sections: [
      {
        heading: '1. The Nine Demonic Divinities & The Prayer Cord',
        body: 'The first five divinities are the five elements (Spirit/Satan, Air/Lucifer, Fire/Flereous, Water/Leviathan, Earth/Belial) promoting life, balance, and the cycle of the year. The next are Unsere (Life) and Eurynomous (Death) — polar opposite archetypes. Finally, Healing (Verrine) and Destruction (Amducious). This is how the Demonolatry prayer cord is set up: nine knots, nine divinities. The Catholic rosary was originally adapted from pre-Christian nature-oriented traditions.',
        keyTakeaway: 'Nine knots on the prayer cord represent the 5 elements plus Life/Death and Healing/Destruction polarities.',
      },
      {
        heading: '2. The Three Purposes & Three Parts of Ritual',
        body: 'Three basic purposes for ritual: 1. To honor or celebrate a Demon. 2. For personal meditation, insight, and enlightenment. 3. To focus on a specific goal (Magick). Every ritual has three parts: 1. The Beginning (construct elemental circle and invite Demons). 2. The Middle (purpose recognized and acted on). 3. The End (polite thank you before they depart). Constructing an elemental circle promotes balance and flow of energy conducive to the atmosphere a Demon prefers.',
        keyTakeaway: 'Respectful practitioners construct a balanced circle. Demons are invited politely, never coerced.',
      },
      {
        heading: '3. Choosing a Matron/Patron vs. Mentor/Teacher Demon',
        body: 'Demonolators select a Matron/Patron by matching attributes: elemental signs, alter-ego, balancing opposite, or passions/hobbies (e.g. Ronove for scholarship and languages). The Matron/Patron is the "self" Demon who intensifies strengths and negates weaknesses. In contrast, a Mentor or Teacher Demon picks YOU through visions or supernatural experiences (rare under 3 years of practice). Prayer in Demonolatry is not begging to "get stuff"; prayer is intention of will, and words spoken are the bridge to manifestation.',
        keyTakeaway: 'Patron = The Self Demon. Mentor = The Teacher Demon that chooses you.',
      },
    ],
    verbatimNotes: `LESSON TWO: Ritual Basics and Prayer
I am briefly going to go over the nine Demonic divinities. The first five are the five elements. They promote life and balance. They are the cycle of life and death, the year, etc. I know this sounds extremely Wiccan, but let me remind you that Demonolatry stems from pre-Christian religions, which were all very "Nature" oriented. The next divinities are Unsere - Life, and Eurynomous-Death. Polar opposite archetypes. Finally there is Healing and Destruction - Verrine and Amduscious. This is how the prayer cord is set up. Nine knots, nine divinities. If the prayer cord seems like a Catholic rosary to you, that's because the Catholics took the concept of the rosary from Demonolatry traditions.
Ritual basics. There are three basic purposes for ritual. 1. To honor or celebrate a Demon or set of ideas represented by that Demon. 2. For personal meditation, insight, and enlightenment. and 3. To focus on a specific purpose or goal (Magick). There are three parts to each ritual. 1. The Beginning - where you invite Demons into your ritual space. 2. The Middle - where the purpose of the ritual is recognized and acted on. 3. The End - where you thank each Demon for showing up politely before they "go home".
For each and every ritual - it is considered respectful to construct an elemental circle. In our tradition the circle promotes balance to ensure the proper flow of energy conducive to the type of atmosphere a Demon prefers. We build the circle out of respect for our wise friends and teachers. It is said that those people who take the time to construct a proper circle are considered worthy to gain wisdom and insight from the divine intelligences. This is a traditional practice.
Demonolators select a Matron/Patron Demon. They do this by matching the Demon's attributes to their own. Some people choose based on elemental signs and attributes, some people choose a Demon who resembles what they would like to be (alter-ego), some people choose a Demon who balances them out (i.e. a hot headed fire person may choose a stable, level headed earth Demon) and others choose a Demon based on a passion or hobby that greatly interests them. A good number of scholarly Demonolators have chosen Ronove (Ronwe) as their patron as he is the Demon who teaches languages and gives knowledge.
But - choosing a Matron/Patron does not mean you cannot work with other Demons. You can work with whichever Demons you choose. But it is an entirely different relationship than with a Matron/Patron. A lot of people have asked me about "Demon Guides." In Demonolatry the equivalent is a "Mentor or Teacher" Demon. This Demon picks you by presenting itself to you through a vision, supernatural experience, or one of the many forms of communication a Demon may use. You do not pick a mentor. That generally happens by default if you happen to strike the fancy of any particular Demon. It is very rare for a mentor to choose someone who has been practicing less than three years. However, there are exceptions to any rule. The Mentor/Teacher Demon gives spiritual lessons and enlightenment whereas the Matron/Patron is the "self" Demon. The "self" Demon helps you focus on and learn about you. It is an innate part of you. It can intensify your existing strengths and negate your weaknesses. This is why choosing the "proper" Matron/Patron is so important.
A brief bit on prayer: Prayer is the connection between you and deity. We do not pray to "get" stuff. Prayer is intention of will and the words spoken are the bridge to manifestation of that will. The divinities are there to promote the strength of will. See the Prayer chapter for more.
HOMEWORK:
I like to suggest the following meditation (wherein you will not have to build an elemental circle - and you will be forgiven for it.). Go through the Demon dictionary or hierarchy section and find one Demon for your alter-ego, one Demon that is the complete opposite of your personality, find your elemental Demon, find one Demon that appeals to your aesthetic/image side, and find another Demon that deals with any strong hidden emotions you have. Make a list. Write down what appeals to you about each Demon. Note any patterns. Some of these Demons may be the same Demon. If you have a particular drawing to any one particular Demon - please note it.
Now I want you to build mental images for each Demon. For the next few nights, take a half hour to an hour and sit in a quiet room with a candle. Focus on one Demon from your list for each half hour session. Record your thoughts, feelings, tastes, smells, or sounds that you sensed during the meditation. Do this for each Demon. Once you have finished with each Demon - place all of your notes in front of you. Which Demon left the strongest impression on you? Keep doing this. It could take you weeks, months or years to complete this exercise. Once you've explored all the Demons that interest you, choose the ones you felt the strongest connections to. You will likely find yourself drawn to one in particular. The strongest one wherein you felt a "connection" is usually the BEST choice for a Patron/Matron.
Homework Part Two: Construct an altar of offering. It can be outdoors or it can be inconspicuous. It can be the same altar you use for ritual. Upon this altar, make it a habit to leave offerings and prayers. Make journal entries describing your thoughts and feelings as well as results with this.`,
  },
  {
    id: 3,
    title: 'Lesson Three: Personal Symbols of Power: Sigils, Enns & Ascension',
    subtitle: 'Calling Cards, Communicating via Ascension, and Invocation vs. Evocation',
    focus: 'Sigils as spiritual signatures, Enns as meditative frequencies, Ascension trance, why Demonolators never evoke.',
    homeworkTitle: 'Personal Sigil Contemplation & Ascension Meditation',
    homeworkInstructions: 'Practice entering the quiet ascension state. Focus upon a demonic sigil or enn without forcing contact. Practice drafting a personal seal of intent. Keep a record in the journal regarding inner imagery and sensations.',
    sections: [
      {
        heading: '1. What Are Sigils and Enns?',
        body: 'Sigils and Enns are focusing tools used to assist the practitioner with invoking a Demonic entity. They are considered to be the "calling cards" or spiritual signatures of a particular entity. They are usually acquired through conversing with a spirit during an ascension meditation — a deep meditative state wherein the priest(ess) or adept communes with Demonic entities on a spiritual plane. In absence of an Enn or sigil, you can create your own invitation or sigil based on your perception of that Demon.',
        keyTakeaway: 'Sigils and Enns are spiritual calling cards acquired through deep meditative ascension.',
      },
      {
        heading: '2. Invocation vs. Evocation',
        body: 'Demonolators INVOKE as opposed to EVOKE. Evocation suggests conjuring an entity against its will with coercive threats and divine names. Invocation is a personal polite invitation and prayer that respects the Demonic entity\'s free will. People who evoke Demons generally end up terrified and running back to dogmatic religions after traumatic backlashes. Demons do not take kindly to attempted forced attendance.',
        keyTakeaway: 'Never evoke or compel. Always invoke with polite invitation and mutual dignity.',
      },
    ],
    verbatimNotes: `LESSON THREE: Personal Symbols of Power
Sigils and Enns are, essentially, focusing tools used to assist the practitioner with invoking a Demonic entity. They are considered to be the "calling cards" of a particular entity. Where do sigils come from? Some people believe the sigil is the spiritual "signature" of a Demonic entity. They are usually acquired through conversing with a particular spirit during an ascension meditation. Where do Enns come from? Enns are acquired through ascension as well. What is ascension? A deep meditative state wherein the priest(ess) or long-time adept communes with Demonic entities on a spiritual level. In absence of an Enn or sigil - you can create your own invitation in whatever language you feel comfortable with. You can also create a sigil for a Demon based on your perception of that Demon. There are many techniques for sigil creation. One is to use representative shapes, letters, or pictures. Or perhaps a design of your own creation that means something to you. Sigil magick is a course in and of itself. I suggest a book called Practical Sigil Magic by U.D. Frater and Ingird Fischer.
Invocation vs. Evocation - Demonolators invoke as opposed to evoke because evocation suggests conjuring an entity against its will. Invocation is more of a personal "invite", prayer, and allows the Demonic entity the right to its own free will. People who evoke Demons generally end up running back to Christianity after some scary experiences. Demons do not take kindly to attempted “forced” attendance.
Hierarchies used in Demonolatry include the Dukanté hierarchy and the Goetic hierarchy, which was discussed in the last lesson. We also briefly touched on the 9 Demonic divinities.`,
  },
  {
    id: 4,
    title: 'Lesson Four: Courtesies of the Sorcerer & The Liturgical Calendar',
    subtitle: 'Dukanté Sect Law, Non-Jealousy, and the 6 Seasonal Holy Rites',
    focus: 'Courtesies of the Sorcerer as universal sect law, equinoxes and solstices, Demonolatry as religion first.',
    homeworkTitle: 'Daily Review of Sect Law & Calendar Attunement',
    homeworkInstructions: 'Review the Courtesies of the Sorcerer daily. Identify which of the 6 major holy rites is approaching on the calendar. Prepare offerings and ritual intent for the appropriate seasonal Demon.',
    sections: [
      {
        heading: '1. The Courtesies of the Sorcerer (Dukanté Sect Law)',
        body: 'Dukanté outlined the Courtesies as sect law to show the working harmony that should exist between all practitioners. The main concept is that we are all part of the whole and can learn and grow from one another even though individual talents vary. The Courtesies strictly warn against jealousy and power trips as ways of depleting our own personal power. Breaking sect law hurts no one except the practitioner himself.',
        keyTakeaway: 'Jealousy and power trips drain personal power. Harmony and humility amplify gnosis.',
      },
      {
        heading: '2. The Major Seasonal Holy Rites',
        body: 'The Demonolatry calendar year is separated into four seasons marked by equinoxes and solstices: March 21 (Rite to Lucifer - Air), April 30 (Walpurgisnacht / May Eve), June 22 (Rite to Flereous - Fire), September 21 (Rite to Leviathan - Water & First Rite Initiation), October 31 (All Hallows Eve / Eurynomous - Death & Ancestors), and December 22 (Rite to Belial - Earth). Major rites are primarily religious: times of honoring, concentration, prayer, meditation, and celebration.',
        keyTakeaway: 'Demonolatry is primarily a nature religion of cosmic cycles. Magick can be added within the circle.',
      },
    ],
    verbatimNotes: `LESSON FOUR: Courtesies/Sect Law and Celebration
Let’s first discuss the Courtesies of the Sorcerer. Dukanté outlined the Courtesies as sect law to show the working harmony that should exist between all practitioners. The main concept underlying their [the Courtesies] design is that we are all a part of the whole and can learn and grow from one another even though our individual talents may vary. The Courtesies also warn against jealousy and power trips as ways of depleting our own personal power. You may want to print yourself a copy of the Courtesies and hang them someplace where you can review them daily.
Ideally, each practitioner of Demonolatry should hold the Courtesies as the highest form of sect law. Sect Law entails the codes of conduct by which each individual Demonolator should abide. It can vary from sect to sect. Some sect law (as the Courtesies) are all encompassing and universal. Others relate to group mechanics and human psychology. Breaking sect law hurts no one except the practitioner himself. Sect Law can be found in the section Proper Invocation, Tools, Ritual Execution and Layout
Holidays and Major Rites: The Demons most universally celebrated in Demonolatry are the seasonal changes represented by the elemental Demons, the standard spring initiation rite (First Rite to Leviathan) and the Rite to Eurynomous. While most Demons have their own individual days or months for celebration, the latter are the basics. Our calendar year is separated into four seasons - each being marked by either an equinox or solstice. Each part of the year makes up the whole. If you are familiar with many modern nature religions you will see that each season represents a life cycle. This is true for Demonolatry as well. Our universe becomes balance and mathematical. Demonolatry is seeing everything from this viewpoint. The Religious holidays are extensions, expressions, and manifestations of these ideas. They are symbolic and balance and structure, as much as they are universal to our experience.
Month/Day Holiday:
March 21 Equinox Rite to Lucifer
April 30 Walpurgisnacht May Eve
June 22 Solstice Rite to Flereous
September 21 Equinox Rite to Leviathan
October 31 All Hallows Eve Halloween
December 22 Solstice Rite to Belial
To learn more about each rite and its purpose or function within Demonolatry as a religion – see the Introduction to Demonolatry chapter.
The Major rites are a time for honoring the Demons, concentrating on individual parts of the whole, prayer, meditation, and celebration. These basic rites are primarily religious rites. Because Demonolatry in and of itself is a religion, this means that magick is not necessarily a part of the practice. Nonetheless, magick can be added to Demonolatry provided it is done in the construct of a ceremonial circle in worship of a particular Demon. Which, as mentioned in previous classes, is customary out of respect and tradition. We will go into magick next class period when we discuss the scientific and psychological principals of how and why magick works and why it compliments Demonolatry as a religion.
Homework: Continue with meditation and prayer exercises.`,
  },
  {
    id: 5,
    title: 'Lesson Five: Demonic Magick, Ritual Tools & Elemental Mechanics',
    subtitle: 'Consecration of Tools, 3 Functions of Magick, and Natal Elemental Imbalances',
    focus: 'Ceremonial tools & 4-element consecration, oleums & incenses, psychological vs physical magick, elemental imbalances in practitioners.',
    homeworkTitle: 'Elemental Breakdown of Natal Chart & Elemental Balancing',
    homeworkInstructions: 'Figure out your elemental breakdown based on your natal chart (each sign has an element and we have 12 signs in our charts). Identify whether you have excess water (scattered focus), earth (premature grounding), air (overextending/overdoing), or fire (exhaustion). Perform the Elemental Balancing Ritual and record results in the journal.',
    sections: [
      {
        heading: '1. Ritual Tools, Altars & The 4-Element Consecration',
        body: 'Basic ritual tools include a bowl for burning, candles and holders, a dagger or knife, a chalice or wine glass, pen & paper. You can improvise in the beginning (wine glasses, butter knives, ashtrays). Consecrate tools by passing through fire, scouring with earth, rinsing with water, and air-drying in air. Then perform a rite mentally infusing each item with your will and patron sigil.',
        keyTakeaway: 'Tools are extensions of your will. Consecrate them through all 4 elements.',
      },
      {
        heading: '2. The 3 Functions of Magick & Post-Rite Action',
        body: 'Magick functions in three ways: 1. It puts the magician\'s focus on a goal. 2. It directs appropriate energy toward that goal. 3. It motivates the magician to take action. Magick is not a quick fix. If you do a rite to Belphegore for a job, you must still send out applications and attend interviews. Psychological magick attunes the mind; physical magick actually directs energy molecules.',
        keyTakeaway: 'Magick requires mundane follow-up. A happy Demon is a helpful Demon in mutual partnership.',
      },
      {
        heading: '3. Elemental Imbalances in Magical Practice',
        body: 'When electricity hits water, it becomes electric with no direction: high-water practitioners struggle with focus. When electricity hits earth, it grounds instantly: high-earth practitioners struggle to build energy before it dissipates. When electricity hits air, it slices right through: high-air practitioners risk overextending or overdoing. When fire hits electricity, it blends: high-fire practitioners burn out their energy building it and feel exhausted afterwards. Calling on Demons whose correspondences match the working benefits both: the Demon adds pure energy so you do not burn out.',
        keyTakeaway: 'Identify your elemental imbalances and balance them before intense ceremonial work.',
      },
    ],
    verbatimNotes: `LESSON FIVE: Demonic Magick
Obviously all of us knows by now that Demonolatry magick is largely ceremonial in that we take the time to build an atmosphere (circle) comfortable for the Demonic entities. We also take the time to build altars, shrines, and/or personal temples that create atmosphere for ourselves. These places and things are often laden with symbolism of our devotion to the Demons, our matrons and patrons, and so forth.
The Ritual Tools - Basic ritual tools include a bowl for burning things like incense and requests, candles, candle holders, a dagger (or knife of some sort), a chalice (or wine glass), pen & paper. Your ritual tools do not have to be elaborate. It can take years for you to acquire just the right tools. In the meantime, if you do not have the money or have not found what you want, you can certainly improvise using wine glasses for chalices, butter knives for daggers, sticks for swords, ashtrays to burn incense and requests in, and any type of candles you have. You may even elect to use no tools at all if that works for you.
However, over time, you will find that working magick is easier with the right tools. You will want at least two chalices, a cast iron burning bowl, an incense burner, candle holders that suit you, parchment, a ritual pen, ritual ink, a dagger, a sword, the sigil of your patron/matron painted or inscribed on an altar trivet (piece of wood), a large selection of candles (different colors). You should also acquire a basic set of ritual oleums, and incenses and build from there. Of course the easiest way is to make them yourself. In the beginning you can use store bought incense if all else fails. Use woody scents for earth (sandalwood, patchouli), light scents for air (bergamot), deep scents for fire (cinnamon or rose), and floral scents for water (lily). For each individual ritual purpose, decide which element that purpose falls under, and use the appropriate scent.
Ritual tools should be used solely for ritual purposes. You can consecrate them by passing them through fire, scouring them with earth, rinsing them with water, and allowing them to air dry. Then you can do a rite wherein you "mentally" (or magickally) infuse each item with your will and the image of your patron/matron.
Remember, your tools are an extension of you. They are meant to help you focus and create atmosphere in your ritual space.
The Altar - For your altar, a piece of wood or a section of floor space will work just fine. For those of you who have more room - you can use an old desk or table as an altar. For others of you - a coffee table or the top of your entertainment center will work just as well. Always cover your altar with a cloth - to keep wax drippings off your furniture, carpet, and floors. Altar cloths are merely practical items. An old sheet will suffice. But if you are into ceremony, a nice piece of satin will do just as well.
Ritual Space - your ritual space should be quiet, warm, comfortable, and as free from distraction as it can be. It doesn't need to be a large space. Just enough space where you can walk around the altar and kneel in front of it. Some people choose to chalk or paint the outer boundary of their circle on the floor of the ritual space.
Outside the seemingly elaborate set up of tools, altars, et al, Demonic magick can seem quite basic. Most often the basic magical formula for Demonic magick includes oleums & incenses corresponding to the purpose of the magickal working, the writing of a request, the seal of the request in the magicians own blood, the burning of a request, and finally, a prayer or meditation time. Most magick is done during a rite in honor of a Demon that caters to the specific goal of the magick working. i.e. an Example might be that magick for love would be done during a rite to honor Rosier or any of the "Love & Friendship" Demons. In all other instances people choose to work magick during rites to their matron/patrons or to Satan.
All of this symbolism helps magick to function properly. The most important point to remember is that Magick is not a quick fix for anything.
Magick functions in several ways. First: It puts the magician's focus on a goal. Second: It directs appropriate energy toward that goal. Third: It motivates the magician to take action on that goal.
While some magick can and will work if you just sit back and wait for it to work - some of it will not work unless the magician takes post-rite action toward the goal. Example - if you do a rite to Belphegore and work magick during that rite to find a job - the job isn't going to just fall in your lap. You actually have to go out and fill out applications, go to interviews, and so on. Which brings me to the next point.
Let's break magick down into two types - psychological (self) magick wherein the magician takes an active role in creating positive energy and directing it toward a goal, and physical magick wherein the magician actually changes or creates the physical or existing state of something or someone.
In almost all instances, all magick is highly psychological. It attunes the magician's mind to the goal at hand, and preps the magician to reach that goal. It also lends favor to the magician via the energy put into the ritual. It most often requires post-ritual follow up.
Physical magick's purpose and direction are more clearly defined. This magick is actually more scientific. As psychological magick in and of itself can be seen as simply a ritual for "self-help" that motivates the individual doing it - scientific magick is actually something like esp or telekinesis where the magician's own will sends or directs matter (in the form of a pure energy) toward an object or person (including the self). Yes, I mean actually moving real molecules of energy after infusing them with purpose. Alone, this magick requires little to no follow up.
All magick is both psychological and physical to one degree or another. Breaking them up is just a way for the student to better understand how magick functions as a "whole".
Some people have a harder time with physical magick than others. Here are some common problems people with certain elemental makeups may have difficulty with:
Water - when electricity hits water it becomes electric with no clear direction. People who have a lot of water in their natal charts may have a difficult time focusing.
Earth - when electricity hits earth it grounds. People who have a lot of earth in their natal charts may have a difficult time building and sending energy before it grounds.
Air - when electricity hits air it slices right through it. People who have a lot of air their natal charts may over extend their energies and either overdo things, or under do them to compensate. Air people should be very careful about directing negative energy as they can inadvertently hurt others or themselves by overdoing.
Fire - when fire hits electricity it blends. People who have a lot of fire in their natal charts may expend all their energy building energy so that they have none left to direct that energy. They may end up feeling exhausted after ritual work.
So where do Demons come in? Calling on Demons whose correspondences match the magickal working benefits the magician and the Demon. It benefits the magician in that it draws additional pure energy so the magician is not over-exerting himself in creating it all himself (which makes the magick much more effective), and it also helps the magician gain clearer focus and insight into the purpose of the magick - which ultimately helps with easier direction. Plus, Demons will help to "send" or direct that energy in conjunction with the magician making the magick work faster. By doing the magickal working inside a structured rite - the magician feeds the Demon positive energy through prayer, devotion, and energy built during the rite. A happy Demon is a helpful Demon!
Not to mention that true Demonic magick involves worshiping and respecting the Demon, which in turn elicits respect and help from the Demon. This is why Demonic magick coupled with Demonolatry works so much better than many of the other forms of folk and ceremonial magick - because both the Demon and practitioner benefit positively from the rite. Balance is maintained because as much energy is given as is taken.
Homework: Figure out your elemental breakdown based on your natal chart (each sign has an element and we each have 12 signs in our charts – see elemental balancing for more information) and correct any noted imbalances using the elemental balancing ritual.`,
  },
];
