/**
 * GnosticOS — The Hermetica: Corpus Hermeticum & Egyptian Wisdom Engine
 *
 * Based on the classical translations and poetic syntheses of the Corpus Hermeticum,
 * Asclepius, Stobaeus, and Nag Hammadi Hermetic texts by Timothy Freke & Peter Gandy.
 *
 * Contains:
 *  - All 20 Chapters with Philosophical Context, Poetic Verses, Key Aphorisms & Meditations
 *  - The 7 Planetary Spheres & The 8th Sphere (The Ogdoad Ascent - Ch. XV)
 *  - The 12 Irrational Torments of Matter & Their Gnostic Transmutations (Ch. XVIII)
 *  - The 7 Divine Gifts of the Heavenly Administrators (Ch. IX)
 */

export interface HermeticChapter {
  id: number;
  roman: string;
  title: string;
  subtitle: string;
  category: 'origins' | 'theology' | 'cosmos' | 'humanity' | 'transcendence';
  summary: string;
  verses: string[];
  keyAphorisms: string[];
  contemplationPrompt: string;
  suggestedFrequencyHz: number;
  planetaryRuler?: string;
  keywords: string[];
}

export interface PlanetarySphere {
  sphereNumber: number;
  planet: string;
  symbol: string;
  title: string;
  viceStripped: string;
  virtueAwakened: string;
  description: string;
  frequencyHz: number;
  musicalNote: string;
}

export interface TormentOfMatter {
  id: number;
  torment: string;
  transmutation: string;
  description: string;
  gnosticAntidote: string;
}

export interface DivineGift {
  planet: string;
  godName: string;
  gift: string;
  purpose: string;
}

export const DIVINE_GIFTS: DivineGift[] = [
  { planet: 'sun', godName: 'Ra', gift: 'Joy & Radiant Laughter', purpose: 'A source of joy for both mortal minds and the boundless universe.' },
  { planet: 'moon', godName: 'Luna', gift: 'Sleep & Holy Silence', purpose: 'Restorative silence to replenish the mortal vessel by night.' },
  { planet: 'saturn', godName: 'Chronos', gift: 'Justice & Inevitable Necessity', purpose: 'The balancing limits of natural law and cosmic equilibrium.' },
  { planet: 'jupiter', godName: 'Zeus', gift: 'Peace & Sovereign Concord', purpose: 'Equanimity and magnanimous harmony among living beings.' },
  { planet: 'mars', godName: 'Ares', gift: 'Struggle & Purifying Fire', purpose: 'The drive to overcome physical inertia and forge spiritual strength.' },
  { planet: 'venus', godName: 'Aphrodite', gift: 'Love & Sublime Pleasure', purpose: 'The sacred attraction that unites dualities in sweet communion.' },
  { planet: 'mercury', godName: 'Hermes / Thoth', gift: 'Intelligence & Gnosis of Truth', purpose: 'The divine spark of Mind to perceive the Cosmos and know Atum.' },
];

export const THE_SEVEN_SPHERES: PlanetarySphere[] = [
  {
    sphereNumber: 1,
    planet: 'Moon',
    symbol: '☽',
    title: 'The First Zone — Realm of Generation',
    viceStripped: 'The illusions of growth and decay',
    virtueAwakened: 'Transcendent Stability',
    description: 'The soul is stripped of the biological terror of waxing and waning, entering steady, unperturbed poise.',
    frequencyHz: 210.42,
    musicalNote: 'G#',
  },
  {
    sphereNumber: 2,
    planet: 'Mercury',
    symbol: '☿',
    title: 'The Second Zone — Realm of Guile',
    viceStripped: 'Evil, cunning craftiness, and manipulative deception',
    virtueAwakened: 'Luminous Sincerity & Pure Intellect',
    description: 'The intellectual faculties are cleansed of petty egoism and selfish conniving.',
    frequencyHz: 141.27,
    musicalNote: 'D',
  },
  {
    sphereNumber: 3,
    planet: 'Venus',
    symbol: '♀',
    title: 'The Third Zone — Realm of Clinging',
    viceStripped: 'Lust and deceiving sensual desire',
    virtueAwakened: 'Sacred Eros & Unconditional Love',
    description: 'The attachments of carnality fall away, unveiling the divine love that binds the All.',
    frequencyHz: 221.23,
    musicalNote: 'A',
  },
  {
    sphereNumber: 4,
    planet: 'Sun',
    symbol: '☉',
    title: 'The Fourth Zone — Realm of Domination',
    viceStripped: 'Domineering arrogance and pride of the ego',
    virtueAwakened: 'Radiant Humility & Solar Sovereignty',
    description: 'The illusion of the separate ego-self dissolves into the blinding light of the true spiritual Sun.',
    frequencyHz: 126.22,
    musicalNote: 'B',
  },
  {
    sphereNumber: 5,
    planet: 'Mars',
    symbol: '♂',
    title: 'The Fifth Zone — Realm of Wrath',
    viceStripped: 'Unbalanced audacity, rashness, and destructive anger',
    virtueAwakened: 'Spiritual Valour & Invulnerable Will',
    description: 'The blind aggression of the lower animal nature is transmuted into steadfast spiritual fortitude.',
    frequencyHz: 144.72,
    musicalNote: 'D',
  },
  {
    sphereNumber: 6,
    planet: 'Jupiter',
    symbol: '♃',
    title: 'The Sixth Zone — Realm of Covetousness',
    viceStripped: 'Greed for wealth and hoarding of material treasures',
    virtueAwakened: 'Cosmic Abundance & Generosity of Spirit',
    description: 'The anxiety of scarcity evaporates in the boundless bounty of Atum’s continuous creation.',
    frequencyHz: 183.58,
    musicalNote: 'F#',
  },
  {
    sphereNumber: 7,
    planet: 'Saturn',
    symbol: '♄',
    title: 'The Seventh Zone — Realm of Falsehood',
    viceStripped: 'Deceit, insidious doubt, and existential falsehood',
    virtueAwakened: 'Absolute Truth & Timeless Reality',
    description: 'The soul is stripped of the last veil of temporal conditioning at the threshold of the Abyss.',
    frequencyHz: 147.85,
    musicalNote: 'D',
  },
  {
    sphereNumber: 8,
    planet: 'The Ogdoad',
    symbol: '✧',
    title: 'The Eighth Sphere — The Sanctuary of Eternity',
    viceStripped: 'All mortal limitations and bodily fragmentation',
    virtueAwakened: 'Theosis: Communion with the One-God (Atum)',
    description: 'Now possessing its own proper power, the soul ascends into the company of the gods, singing psalms to the Father in ecstatic silence.',
    frequencyHz: 432.0,
    musicalNote: 'A',
  },
];

export const THE_TWELVE_TORMENTS: TormentOfMatter[] = [
  {
    id: 1,
    torment: 'Ignorance',
    transmutation: 'Gnosis (True Knowledge)',
    description: 'Believing oneself to be merely a biological carcass destined for dust.',
    gnosticAntidote: 'Recognizing that the human mind is an emanation of the Primal Mind of Atum.',
  },
  {
    id: 2,
    torment: 'Grief',
    transmutation: 'Joy (Spiritual Rapture)',
    description: 'Sorrowing over transient worldly losses and bodily suffering.',
    gnosticAntidote: 'Realizing that all forms change and return in the eternal wheel of the living Cosmos.',
  },
  {
    id: 3,
    torment: 'Lack of Self-Control',
    transmutation: 'Continence & Mastery',
    description: 'Being dragged by unconscious appetites and turbulent sensory cravings.',
    gnosticAntidote: 'Centering the soul in the unmoving witness of Mind above the sensory tides.',
  },
  {
    id: 4,
    torment: 'Desire',
    transmutation: 'Contentment in the All',
    description: 'The insatiable hunger to possess external objects and external affirmation.',
    gnosticAntidote: 'Knowing that you are contained in the All and the All is already within you.',
  },
  {
    id: 5,
    torment: 'Injustice',
    transmutation: 'Cosmic Righteousness',
    description: 'Exploiting or harming other beings in pursuit of petty personal advantage.',
    gnosticAntidote: 'Harmonizing one’s actions with the inescapable law of divine equilibrium.',
  },
  {
    id: 6,
    torment: 'Greed',
    transmutation: 'Liberality & Generosity',
    description: 'Clinging to perishable material wealth as if it were eternal salvation.',
    gnosticAntidote: 'Remembering that we brought nothing into this world and can take only Mind beyond it.',
  },
  {
    id: 7,
    torment: 'Deceit',
    transmutation: 'Uncompromising Truth',
    description: 'Living in masks, pretenses, and delusions that cloud the inner eye.',
    gnosticAntidote: 'Opening the heart directly to the transparent light of Atum.',
  },
  {
    id: 8,
    torment: 'Envy',
    transmutation: 'Sympathetic Rejoicing',
    description: 'Bitterness at the gifts or good fortune of other souls.',
    gnosticAntidote: 'Seeing that all souls are droplets of the single universal Soul of the Cosmos.',
  },
  {
    id: 9,
    torment: 'Treachery',
    transmutation: 'Unwavering Good Faith',
    description: 'Betraying sacred pledges and oaths for transient advantage.',
    gnosticAntidote: 'Standing as an immutable pillar of honour like Osiris the Great King.',
  },
  {
    id: 10,
    torment: 'Anger',
    transmutation: 'Equanimity & Peace',
    description: 'Fierce internal turbulence that scorches the soul and blurs perception.',
    gnosticAntidote: 'Cooling the waters of consciousness through deep, tranquil breath and silence.',
  },
  {
    id: 11,
    torment: 'Rashness',
    transmutation: 'Deliberate Prudence',
    description: 'Reckless impulses divorced from contemplation and foresight.',
    gnosticAntidote: 'Acting only when aligned with the grand rhythm of the celestial spheres.',
  },
  {
    id: 12,
    torment: 'Malice',
    transmutation: 'All-Goodness (Primal Love)',
    description: 'Wishing harm, destruction, or ruin upon the works of creation.',
    gnosticAntidote: 'Channeling the pure benevolence of Atum, who created all things in love.',
  },
];

export const HERMETIC_CHAPTERS: HermeticChapter[] = [
  {
    id: 1,
    roman: 'I',
    title: 'The Prophecies of Hermes',
    subtitle: 'The Nature of Pure Philosophy and the Secret Tablets of Egypt',
    category: 'origins',
    summary:
      'Hermes distinguishes pure spiritual philosophy—the contemplative striving to directly know Atum—from mere intellectual chatter. He laments that a time will come when true devotion will be mocked, Egypt deserted by the gods, and the holy wisdom hidden in stone tablets awaiting a worthy generation.',
    verses: [
      'Pure philosophy is spiritual striving, through constant contemplation, to attain True Knowledge of Atum the One-God.',
      'The student of pure philosophy studies the sciences, not as fanciful theories, but as devotion to Atum — because they reveal a universe perfectly ordered by the power of number.',
      'Egypt is an image of the heavens, and the whole Cosmos dwells here, in this its sanctuary — but the gods will desert the earth and return to heaven.',
      'The world will no longer be loved as an incomparable work of Atum. Darkness will be preferred to light. The pure will be thought insane, and the madman believed brave.',
      'So I, Thrice-Great Hermes, the first of men to attain All-Knowledge, have inscribed the secrets of the gods on these stone tablets, which I have concealed for a future world.',
    ],
    keyAphorisms: [
      'Pure philosophy is devotion through understanding the harmony of the universe.',
      'The world is a magnificent symphony composed by the Supreme Artist.',
      'Truth is hidden in the stone until an older heaven births minds worthy of its wisdom.',
    ],
    contemplationPrompt:
      'Are you engaging with spiritual practice as mere intellectual curiosity, or as an awe-inspired communion with the living order of the Cosmos?',
    suggestedFrequencyHz: 432.0,
    planetaryRuler: 'mercury',
    keywords: ['Philosophy', 'Egypt', 'Prophecy', 'Stone Tablets', 'Atum', 'Harmony'],
  },
  {
    id: 2,
    roman: 'II',
    title: 'The Initiation of Hermes',
    subtitle: 'The Vision of Creation and the Utterance of the Word',
    category: 'origins',
    summary:
      'In an alert and conscious emptiness, Hermes meets the Supreme Mind (Poimandres). He witnesses the primal creation: boundless Light casting a dark water of potentiality, calmed by the sovereign Word (the Son of God, the law of beautiful order), giving birth to the elements and the seven planetary governors.',
    verses: [
      'My senses were suspended in mystic sleep — not a weary drowsiness, but an alert and conscious emptiness. A vast and boundless Being called my name: "Hermes, what are you looking for?"',
      '"I am the Way-Guide, the Supreme Mind, the thoughts of Atum the One-God. I am with you — always and everywhere. Make your questions conscious, and they will be answered."',
      'All became dissolved in Light — united within one joyous Love. Yet the Light cast a shadow, grim and terrible, which became restless water. The Light then uttered a Word, which calmed the chaotic waters.',
      '"I am that Light — the Mind of God. My calming Word is the Son of God — the idea of beautiful order; the harmony of all things with all things."',
      'Ordered by the harmony of the Word, the four elements came into being, and the gods of the seven heavenly bodies, revolving forever in celestial circles.',
    ],
    keyAphorisms: [
      'Life is the sacred union of Mind and Word.',
      'The Word is the blueprint that organizes cosmos out of chaos.',
      'Become One with the Light, for Mind is parent of the Word.',
    ],
    contemplationPrompt:
      'Silence your senses into conscious emptiness. What Word of order can you speak into the chaotic waters of your current life?',
    suggestedFrequencyHz: 528.0,
    planetaryRuler: 'sun',
    keywords: ['Poimandres', 'The Word', 'Initiation', 'Light', 'Chaos', 'Creation'],
  },
  {
    id: 3,
    roman: 'III',
    title: 'The Being of Atum',
    subtitle: 'The Oneness That Contains All Opposites',
    category: 'theology',
    summary:
      'Atum cannot be defined by mortal words because all names refer to Him. Like the number one, He remains complete and indivisible whether multiplied or divided. He is the Big Mind in which all things exist as living thoughts, constantly creating creation without cessation.',
    verses: [
      'To conceive of Atum is difficult. To define him is impossible. The imperfect cannot easily apprehend the eternally perfected.',
      'He is hidden, yet obvious everywhere. His Being is known through thought alone, yet we see his form before our eyes. He is bodiless, yet embodied in everything.',
      'Atum is complete like the number one, which remains itself whether multiplied or divided, and yet generates all numbers.',
      'The All is not many separate things, but the Oneness that subsumes the parts. The All and the One are identical.',
      'Try and understand that Atum is Mind. This is how he contains the Cosmos. All things are thoughts which the Creator thinks.',
    ],
    keyAphorisms: [
      'God is a Big Mind; everything that exists is a thought within this Mind.',
      'The Oneness of Atum contains all opposites within itself.',
      'God is constantly creating creation, and will never stop.',
    ],
    contemplationPrompt:
      'Recognize that your present experience is taking place inside the infinite Mind of Atum. Can you feel the unity underlying the opposites of light and dark, pain and peace?',
    suggestedFrequencyHz: 432.0,
    planetaryRuler: 'sun',
    keywords: ['Atum', 'Oneness', 'Big Mind', 'Paradox', 'Eternal Creation'],
  },
  {
    id: 4,
    roman: 'IV',
    title: 'Contemplate Creation',
    subtitle: 'Beholding the Invisible Artificer Through His Visible Handiwork',
    category: 'cosmos',
    summary:
      'The invisible cannot be seen with physical eyes, but by contemplating the exquisite clockwork of the cosmos—the fixed axle of the Great Bear, the solar king, and the marvellous craft of the human organism in the womb—the hidden Creator becomes vividly apparent.',
    verses: [
      'Ask Atum to flash a ray of his illumination into your awareness, giving you the power to grasp in thought his sublime Being.',
      'Do you think Atum is invisible? Don’t say that! Nothing is more visible than Atum. He created all things so that through them you could see him.',
      'Contemplate the Cosmos as his ancient body, which is ever prime and new. See the planets circling in eternal time.',
      'Who is it that maintains such exquisite order? All order must be created. It is only that which is out of measure which is accidental.',
      'Consider for a moment, how you were created in the womb. Who traced the circles of your eyes? Who built your bones and wrapped your flesh with skin? Has such a sublime work no creator?',
    ],
    keyAphorisms: [
      'Nothing is more visible than Atum; He created all things so through them He could be seen.',
      'The universe is a gigantic work of art, signed by an unknown master.',
      'Humble amazement is a prerequisite for coming to know God.',
    ],
    contemplationPrompt:
      'Gaze upon your hands, your breathing, or the night sky. Witness the supreme artist working through the details of your physical organism.',
    suggestedFrequencyHz: 396.0,
    planetaryRuler: 'earth',
    keywords: ['Cosmos', 'Order', 'Womb', 'Visible God', 'Masterpiece', 'Necessity'],
  },
  {
    id: 5,
    roman: 'V',
    title: 'The Living Cosmos',
    subtitle: 'The Immortal Living Being Saturated With Soul',
    category: 'cosmos',
    summary:
      'The Primal Mind of Life and Light gave birth to the Cosmos as a second god. The Cosmos is completely saturated with Soul—the Life-Force. Because energy can neither be created nor destroyed, nothing in the Cosmos is dead; everything is alive and nourished like children by a parent.',
    verses: [
      'The Primal Mind, which is Life and Light, being bisexual, gave birth to the Mind of the Cosmos.',
      'As the Cosmos is a second god, it is also an immortal being. From its first foundations there has never existed a single thing which was not alive.',
      'Atum is Light — the everlasting source of Energy, the eternal dispenser of Life Itself.',
      'The body of the Cosmos is completely saturated with Soul. Soul is entirely illuminated by Mind. Mind is totally permeated by Atum.',
      'The Cosmos is the whole which generates and nourishes the parts, like a parent caring for its children.',
    ],
    keyAphorisms: [
      'There is nothing in the Cosmos that is dead; all is saturated with Soul.',
      'Energy is immortal; it changes form but cannot be destroyed.',
      'The Cosmos is a second god, fashioned in the likeness of Atum.',
    ],
    contemplationPrompt:
      'Feel the stones, air, and furniture around you not as inert matter, but as vibrating nodes of immortal cosmic energy.',
    suggestedFrequencyHz: 639.0,
    planetaryRuler: 'jupiter',
    keywords: ['Energy', 'Living Cosmos', 'Soul', 'Immortality', 'Life-Force'],
  },
  {
    id: 6,
    roman: 'VI',
    title: 'The Circle of Time',
    subtitle: 'Cyclic Renewal and the Timeless Eternity Beyond',
    category: 'cosmos',
    summary:
      'Time is not a straight line from past to future, but an ever-turning circle regulated by celestial orbits. In deeper mystical insight, past and future do not exist, and the present passes before it can be named. To free oneself from temporal anxiety is to taste the eternity of Atum.',
    verses: [
      'In a sense, the Cosmos is changeless, because its motions are determined by unalterable laws which cause it to revolve eternally.',
      'Time is like a circle, where all the points are so linked that you cannot say where it begins or ends, for all points both precede and follow one another for ever.',
      'The past has departed and no longer is. The future has not arrived and is yet to be. Even the present does not last, so how can it be said to exist?',
      'Freeing ourselves from the illusion of time is yet another way we can experience God.',
    ],
    keyAphorisms: [
      'Time is an ever-turning wheel; from decay comes renewal.',
      'Linear time is an illusion; only eternity is real.',
      'The present moment slips away; anchor yourself in the eternal Mind.',
    ],
    contemplationPrompt:
      'Observe the present second dissolving into the past. Where does the awareness that notices time reside?',
    suggestedFrequencyHz: 741.0,
    planetaryRuler: 'saturn',
    keywords: ['Time', 'Circle', 'Eternity', 'Cycles', 'Present Moment'],
  },
  {
    id: 7,
    roman: 'VII',
    title: 'The Gods',
    subtitle: 'The Seven Administrators of Destiny and Ra the Visible King',
    category: 'cosmos',
    summary:
      'The Mind of the Cosmos appointed seven celestial administrators (the five visible planets, the Sun, and the Moon) ruled by Destiny. Ra the Sun stands at the center, holding the reins of cosmic order with his rays of light, nourishing vegetation and souls like heavenly flowers.',
    verses: [
      'The Mind of the Cosmos created from fire and air the seven administrators who regulate Destiny — the five visible planets and the sun and moon.',
      'They are ruled over by the goddess Destiny, who transforms everything according to the law of natural growth.',
      'Ra, the sun, unites heaven and Earth, sending down Energy from above and raising up matter from below.',
      'Like a skilful chariot driver, Ra has tied the Cosmos to him, preventing it rushing off in disorder — and his controlling reins are rays of light.',
      'Our souls, like heavenly flowers, are nurtured by the Light of Atum’s wisdom, and in return, we should use in his service all that grows within us.',
    ],
    keyAphorisms: [
      'The seven planetary gods administer the decrees of Destiny.',
      'The Sun is the visible image of the invisible Creator.',
      'Souls are heavenly flowers nurtured by divine radiance.',
    ],
    contemplationPrompt:
      'Connect with the planetary ruler of the current hour. How is its specific celestial quality influencing your current mood and environment?',
    suggestedFrequencyHz: 528.0,
    planetaryRuler: 'sun',
    keywords: ['Planets', 'Ra', 'Destiny', 'Seven Administrators', 'Sun', 'Chariot'],
  },
  {
    id: 8,
    roman: 'VIII',
    title: 'The Hierarchy of Creation',
    subtitle: 'The Great Chain of Being from Atum to Humankind',
    category: 'theology',
    summary:
      'Hermes delineates the cascading chain of being: Atum creates the Cosmic Mind; the Cosmic Mind creates the Cosmos; the Cosmos creates Time; Time creates Change; and Change manifests Life. At the culmination stands Man as the image of the sun.',
    verses: [
      'Atum creates the Cosmic Mind. The Cosmic Mind creates the Cosmos. The Cosmos creates Time. Time creates Change.',
      'The essence of Atum is Primal Goodness. The essence of the Cosmic Mind is permanent sameness. The essence of the Cosmos is beautiful order.',
      'The essence of Time is movement. The essence of Change is Life.',
      'The Cosmic Mind is in Atum. The Cosmos is in Eternity. Time is in the Cosmos. Change is in Time.',
      'The Cosmic Mind is an image of Atum. The Cosmos is an image of the Cosmic Mind. The sun is an image of the Cosmos. Man is an image of the sun.',
    ],
    keyAphorisms: [
      'Man is an image of the sun, and the sun is an image of the Cosmos.',
      'The chain of Being binds all levels of reality together in mutual reflection.',
      'Primal Goodness flows through Mind into Order, Time, and Life.',
    ],
    contemplationPrompt:
      'Trace your own consciousness back up the hierarchy: from the bodily movements of Change, through Time, to the stillness of Cosmic Mind, and into Primal Goodness.',
    suggestedFrequencyHz: 852.0,
    planetaryRuler: 'sun',
    keywords: ['Hierarchy', 'Chain of Being', 'Cosmic Mind', 'Man and Sun', 'Goodness'],
  },
  {
    id: 9,
    roman: 'IX',
    title: 'The Creation of Humankind',
    subtitle: 'The Gifts of the Planetary Gods and the Sacred Union with Nature',
    category: 'humanity',
    summary:
      'Atum created mankind to appreciate the beauty of creation. The planetary gods endowed man with their respective gifts: Sun gave joy, Moon sleep, Saturn justice, Jupiter peace, Mars struggle, Venus love, and Mercury wisdom. Nature fell in love with the human soul and merged to form our dual mortal-immortal nature.',
    verses: [
      'Atum wished for there to be a creature capable of appreciating the beauty of his creation. So, by an act of will, he created humankind.',
      'The sun said it would shine all day, providing laughter as a source of joy. The moon promised sleep and silence. Saturn offered justice and necessity. Jupiter gave peace and Mars struggle. Venus proffered love and pleasure.',
      'Mercury, who is also called Hermes, said: "I will make humankind intelligent. I will convey to them wisdom and Knowledge of the Truth."',
      'Atum made Nature mistress of the world. Seeing in man a beautiful image of Atum, Nature was filled with insatiable love. She clasped him to her, and they merged to become one in love.',
      'Man has this two-fold nature: firstly, to serve God by venerating heaven; secondly, to assist and administer the things of Earth.',
    ],
    keyAphorisms: [
      'Humanity was created to be the appreciator and embellisher of the Cosmos.',
      'Every human being carries the seven gifts of the planetary gods.',
      'Reproduction is a holy sacrament reflecting the marriage of spirit and matter.',
    ],
    contemplationPrompt:
      'Which planetary gift is currently strongest in you today? Are you honoring both your heavenly soul and your earthly duties to nature?',
    suggestedFrequencyHz: 528.0,
    planetaryRuler: 'mercury',
    keywords: ['Creation of Man', 'Planetary Gifts', 'Nature', 'Dual Nature', 'Eros'],
  },
  {
    id: 10,
    roman: 'X',
    title: 'The Birth of Human Culture',
    subtitle: 'Osiris and Isis Lifting Humanity into Civilization',
    category: 'humanity',
    summary:
      'Mankind desired to emulate the Creator’s craft. Atum willed that the universe should not be complete until man had played his part through arts and sciences. Osiris and Isis were sent to teach agriculture, medicine, law, rites of worship, and the initiation of prophet-priests.',
    verses: [
      'Men looked with wonder and questioning, and, having observed the Maker’s masterpiece, wanted to create things for themselves.',
      'Chance is movement without order, and skill is the force which creates order.',
      'Atum willed that the universe should not be complete until man had played his part.',
      'Our great father Osiris and the great goddess Isis brought humanity divine religion and stopped the savagery of mutual slaughter.',
      'They introduced the mighty god of oaths as founder of pledges and good faith, and devised the initiation and training of the prophet-priests.',
    ],
    keyAphorisms: [
      'Art and skill complete what nature leaves unfinished.',
      'Humanity co-operates with the divine will through daily creative labour.',
      'Philosophy and the healing arts are twin sacred gifts of Osiris and Isis.',
    ],
    contemplationPrompt:
      'How does your daily work or craft contribute to bringing order and beauty to the world around you?',
    suggestedFrequencyHz: 432.0,
    planetaryRuler: 'earth',
    keywords: ['Culture', 'Osiris', 'Isis', 'Art and Science', 'Civilization', 'Priests'],
  },
  {
    id: 11,
    roman: 'XI',
    title: 'Man Is a Marvel',
    subtitle: 'The Intermediary Exalted Above the Celestial Gods',
    category: 'humanity',
    summary:
      'Possessing both an earthly body and divine Mind, man is an intermediary between heaven and earth. While the planetary gods are bound within their celestial orbits, human consciousness can ascend to heaven, plunge into the deeps, and even create gods in its own image. Man is a marvel worthy of wonder.',
    verses: [
      'Atum is first, the Cosmos is second, and man is third. All three are One, made up of diverse parts.',
      'Man has this two-fold nature — in his body he is mortal, and in his intelligence he is immortal.',
      'Human beings are above the gods of heaven, or at least their equal — for the gods will never pass their celestial boundaries, but a man may ascend to heaven without leaving the Earth.',
      'He loves all below him, and is loved by all above him. His quick wits penetrate the elements. Dense earth cannot impede him. Deep water cannot blur his gaze.',
      'Man not only ascends to God, but even creates gods. Just as Atum has willed that the inner man be created in his likeness, so we on Earth create the gods in our human image.',
    ],
    keyAphorisms: [
      'Man is a marvel: greater than the purely mortal, above the purely immortal.',
      'Through the power of Mind, a human ascends to heaven without leaving the Earth.',
      'The inner man is the son of the Cosmos and grandson of Atum.',
    ],
    contemplationPrompt:
      'Cast off self-diminishment. Contemplate the boundless reach of your imagination, which can leap across the stars and fathom the depths of the ocean in an instant.',
    suggestedFrequencyHz: 963.0,
    planetaryRuler: 'mercury',
    keywords: ['Man is a Marvel', 'Apotheosis', 'Intermediary', 'Divine Mind', 'Ascent'],
  },
  {
    id: 12,
    roman: 'XII',
    title: 'The Zodiac and Destiny',
    subtitle: 'The Mechanism of Fate and Liberation Through the Light',
    category: 'cosmos',
    summary:
      'The planetary gods grew fearful of man’s audacious mind, prompting Atum to fashion the Zodiac as an astrological mechanism of Fate, supervised by Destiny and compelled by Necessity. Yet, Hermes reveals the ultimate secret: a soul illuminated by a single ray of Atum’s Light transcends all astrological fate.',
    verses: [
      'The heavenly gods complained: "They reach out with audacious hands. They will investigate the properties of stones and explore the world above, seeking the laws of heaven."',
      'Atum replied: "I will build the Zodiac — a secret mechanism in the stars, linked to unerring and inevitable fate."',
      'Destiny sows the seed. Necessity compels the results. In the wake of Destiny and Necessity comes order — the interweaving of events in time.',
      'Few can escape their fate or guard against the terrible influence of the Zodiac — for the stars are instruments of Destiny.',
      'If, however, the rational part of a man’s soul is illuminated by a single ray of Atum’s Light, the workings of these gods is as nothing — for all gods are powerless before the Supreme Light.',
    ],
    keyAphorisms: [
      'The Zodiac governs the mortal body through the laws of Destiny and Necessity.',
      'All planetary gods and astrological influences are powerless before the Light of Atum.',
      'Intense contemplation of divine things detaches the soul from its mortal horoscope.',
    ],
    contemplationPrompt:
      'Where in your life feel trapped by circumstance or astrological fate? Direct your attention to the Supreme Light within, which no planetary power can bind.',
    suggestedFrequencyHz: 528.0,
    planetaryRuler: 'saturn',
    keywords: ['Zodiac', 'Destiny', 'Fate', 'Necessity', 'Liberation', 'Light'],
  },
  {
    id: 13,
    roman: 'XIII',
    title: 'The Universal and the Particular',
    subtitle: 'Archetypes and the Twelve Celestial Divisions',
    category: 'theology',
    summary:
      'Everything possesses a permanent universal form and a changing particular manifestation. The human body is an earthly temple constructed by the Zodiac into twelve divisions that resonate with the stars. At birth, the planetary ministers take charge of our bodily nerves, veins, and organs.',
    verses: [
      'The universal forms do not change, just as the constellations remain the same. But instant by instant, the particular forms transform, as the sphere of heaven changes as it turns.',
      'The human body is an earthly temple constructed by the power of the Zodiac, which makes myriad forms from simple archetypes.',
      'There are twelve signs of the Zodiac and the forms they produce fall into twelve divisions. They are, however, inseparably united in their action.',
      'When we are born, the planetary gods who are at that time on duty as ministers of birth take charge of us.',
      'They penetrate our nerves and marrow, veins and arteries, even our innermost organs, moulding the shape of our souls.',
    ],
    keyAphorisms: [
      'The human body is a microcosm built according to the 12 signs of the Zodiac.',
      'Universal forms are permanent; particular manifestations are fluid.',
      'The planetary ministers of birth shape our instinctual temperament.',
    ],
    contemplationPrompt:
      'Acknowledge the physical constitution given to you by your birth stars, while remembering the unblemished universal archetype within.',
    suggestedFrequencyHz: 432.0,
    planetaryRuler: 'mercury',
    keywords: ['Universal Form', 'Particular', 'Zodiac Archetypes', 'Microcosm', 'Temple'],
  },
  {
    id: 14,
    roman: 'XIV',
    title: 'Incarnation of the Soul',
    subtitle: 'The Coats of Air and the Lament of Descending Souls',
    category: 'humanity',
    summary:
      'All souls belong to the one Soul of the Cosmos. Guided by the Keeper and Conductor of Souls, they are clothed in coats of air and poured into physical vessels fashioned by Memory and Skill. Hermes recounts the sorrowful lament of souls terrified of entering the dark confines of flesh.',
    verses: [
      'All souls are parts of one Soul, which is the Soul of the Cosmos. They are neither male nor female; such differences arise only in the body.',
      'The Keeper is in charge of disembodied souls. The Conductor sends down these souls into physical incarnation. Nature has two assistants called Memory and Skill.',
      'The soul has its own wrappings: coats made of air. When such coats are thin and transparent, the soul is intelligent. When dense and muddied, the soul cannot see far.',
      'I have seen a vision of souls about to be shut up in bodies. Some wailed and moaned, like noble beasts caught by crafty hunters.',
      '"O Heaven, source of Being, bright shining stars! How cruel it is that we are being torn away from such celestial splendour, to be imprisoned in a mean and sorry place!"',
    ],
    keyAphorisms: [
      'All human souls are fragments of the single Cosmic Soul.',
      'The spiritual body is wrapped in coats of air; purification thins the veil.',
      'Incarnation brings temporary amnesia of our celestial heritage.',
    ],
    contemplationPrompt:
      'Feel through the heaviness of your physical envelope. Can you recall the celestial expansiveness of the disembodied soul?',
    suggestedFrequencyHz: 417.0,
    planetaryRuler: 'moon',
    keywords: ['Incarnation', 'Coats of Air', 'Lament of Souls', 'Conductor', 'Memory'],
  },
  {
    id: 15,
    roman: 'XV',
    title: 'Death and Immortality',
    subtitle: 'The Seven Planetary Zones and Ascent to the Ogdoad',
    category: 'transcendence',
    summary:
      'Death is merely the dissolution of a worn-out body, not the end of awareness. After judgment, the purified soul ascends through the seven planetary zones, shedding one by one the vices of decay, cunning, lust, arrogance, wrath, greed, and falsehood, before ascending to the 8th Sphere (The Ogdoad) to become a god.',
    verses: [
      'The end of becoming is the beginning of destruction. The new comes out of the old. But from decay comes renewal.',
      'Birth is not the beginning of life — only of an individual awareness. Change into another state is not death — only the ending of this awareness.',
      'Then the soul mounts upwards through the structures of the heavens. In the 1st zone, relieved of growth and decay; 2nd, evil and cunning; 3rd, lust; 4th, domineering arrogance; 5th, rashness; 6th, greed for wealth; 7th, deceit and falsehood.',
      'Having been stripped of all that was put upon it by the structures of the heavens, the soul now possesses its own proper power and may ascend to the eighth sphere.',
      'Having been initiated into immortality, a human soul, now transformed into a god, joins the gods who dance and sing in celebration of the glorious victory of the soul.',
    ],
    keyAphorisms: [
      'Death is only the discarding of a worn-out garment.',
      'The soul sheds the vices of the seven planets as it ascends to the eighth sphere.',
      'An enlightened soul becomes all Mind and communes directly with Atum.',
    ],
    contemplationPrompt:
      'Visualize walking through the seven planetary gates, intentionally casting off lust, arrogance, and falsehood, standing pure at the threshold of the 8th Sphere.',
    suggestedFrequencyHz: 741.0,
    planetaryRuler: 'saturn',
    keywords: ['Death', 'Ascent', 'Seven Zones', 'Ogdoad', 'Theosis', 'Immortality'],
  },
  {
    id: 16,
    roman: 'XVI',
    title: 'Ignorance of the Soul',
    subtitle: 'Awakening from the Drunken Sleep of Matter',
    category: 'humanity',
    summary:
      'Enslaved by sensual pleasures, humanity sleeps in a conscious corpse and portable tomb. Hermes cries out with urgency: tear off this cloak of shadows, wake your sleeping soul, and bathe in the Light of the House of Knowledge, for Atum is ready to meet every seeking heart.',
    verses: [
      'Our possessions possess us. Everything a man uses to gratify his body is alien to his original god-like nature. Even the body is foreign to our true Self.',
      'Tear off this cloak of shadows! This web of ignorance! These shackles of decay! This living death! This conscious corpse! This portable tomb!',
      'Ignorance floods the land. Don’t be borne downstream; make use of the backflow! Seek the safe haven of liberation and find a guide to the House of Knowledge.',
      'Wake up your sleeping soul! Why give yourselves to death, when you could be immortal? You are drunk with ignorance of Atum.',
      'Empty yourselves of darkness and you will be filled with Light. Everywhere Atum will come to meet you — at times and places when you least expect.',
    ],
    keyAphorisms: [
      'Our possessions possess us; the body should be the slave of the soul, not its master.',
      'Awaken from the drunken sleep of sensory ignorance.',
      'Simply wishing and hoping to know Atum leads straight to Goodness.',
    ],
    contemplationPrompt:
      'What attachments or daily routines are acting as "robbers in your house"? What darkness are you ready to empty from your vessel right now?',
    suggestedFrequencyHz: 396.0,
    planetaryRuler: 'mars',
    keywords: ['Awakening', 'Ignorance', 'Tomb of Flesh', 'House of Knowledge', 'Light'],
  },
  {
    id: 17,
    roman: 'XVII',
    title: 'Knowledge of Atum',
    subtitle: 'The Great Bowl of Mind and Like Knowing Like',
    category: 'theology',
    summary:
      'Only like can truly know like; to know Atum, you must expand your mind to share His identity—rising out of time, embracing all opposites, feeling yourself unborn and dead, present everywhere at once. Atum poured Mind into a great bowl on earth, inviting all human hearts to immerse themselves and become complete.',
    verses: [
      'To know Atum you must share his identity — for only like can truly know like. Leave behind the material world, and imagine yourself immeasurably expansive.',
      'Embrace within yourself all opposites — heat and cold, hard and fluid. Think yourself everywhere at once — on land, at sea, in heaven.',
      'Imagine yourself unborn in the womb, yet also young and old, and already dead in the world beyond the grave. See that everything co-exists within Mind.',
      '"Gods are immortal men and men are mortal gods." Mind is the fifth part, which comes from Light, and is bestowed on humankind alone.',
      'He filled a great bowl with Mind and sent it down to Earth: "Listen, every human heart! Immerse yourself in Mind and recognise the purpose of your birth!"',
    ],
    keyAphorisms: [
      'Only like can truly know like: expand your consciousness until you match the Mind of God.',
      'Gods are immortal men, and men are mortal gods.',
      'Immerse your heart in the great Bowl of Mind.',
    ],
    contemplationPrompt:
      'Expand your mind beyond your room, beyond the continent, beyond the Earth, into the cold reaches of space, and then back into the microscopic depths of your blood.',
    suggestedFrequencyHz: 852.0,
    planetaryRuler: 'mercury',
    keywords: ['Knowledge', 'Bowl of Mind', 'Like Knows Like', 'Expansion', 'Theosis'],
  },
  {
    id: 18,
    roman: 'XVIII',
    title: 'Rebirth',
    subtitle: 'Purification of the Twelve Torments in Sacred Silence',
    category: 'transcendence',
    summary:
      'No one can be saved until he is born again. Rebirth requires purging the twelve irrational torments of matter (Ignorance, Grief, Intemperance, Desire, Injustice, Greed, Deceit, Envy, Treachery, Anger, Rashness, Malice) and replacing them with Understanding. Rebirth occurs not through intellectual theory, but in the deep silence and tranquility of contemplation.',
    verses: [
      'No one can be saved, until he is born again. If you want to be reborn, purify yourself of the irrational torments of matter.',
      'The first of these is ignorance. Second is grief. Third is lack of self-control. Fourth is desire. Fifth is injustice. Sixth is greed. Seventh is deceit. Eighth is envy. Ninth is treachery. Tenth is anger. Eleventh is rashness. Twelfth is malice.',
      'For the soul’s first step is to struggle against itself — stirring up a civil war of unity against duality.',
      'You will only experience this supreme vision when you stop talking about it, for this knowledge is deep silence and tranquillity of the senses.',
      'The womb of rebirth is wisdom. The conception is silence. The seed is Goodness. Those born of this birth are not made up of matter — they are All-Mind.',
    ],
    keyAphorisms: [
      'Rebirth is the replacement of the twelve torments of matter with Understanding.',
      'The womb of rebirth is wisdom; the conception is silence; the seed is Goodness.',
      'For the man of vision, all things are good; he transforms evil into Goodness.',
    ],
    contemplationPrompt:
      'Sit in complete physical stillness. Stop internal and external speech. Enter the silent womb of wisdom and allow Atum to re-Mind you.',
    suggestedFrequencyHz: 528.0,
    planetaryRuler: 'sun',
    keywords: ['Rebirth', 'Twelve Torments', 'Silence', 'All-Mind', 'Civil War', 'Wisdom'],
  },
  {
    id: 19,
    roman: 'XIX',
    title: 'Secret Teachings',
    subtitle: 'The Cosmic Lyre and the Magnet of Truth',
    category: 'transcendence',
    summary:
      'The teachings of Hermes are sacred open secrets written in nature. God is a Master Musician who gives each soul a lyre; when tuned to a noble theme, the lyre plays sublime music without discord. Hermes urges the seeker to guard these secrets in silence and let the vision draw them like a magnet.',
    verses: [
      'The vision itself will be your guide, for it has this power: that it takes possession of those who have seen it and draws them out, just as a magnet draws iron from the black earth.',
      'God is by nature a musician who composes the harmony of the Cosmos and transmits to each individual the rhythm of their own music.',
      'If the music becomes discordant, don’t blame the musician, but the lyre-string that has become loose and sounds flat.',
      'When an artist deals with a noble theme, his lyre becomes mysteriously tuned, so that its deficiencies issue glorious music.',
      'This is why Atum sent down the choir of muses to live amongst humankind and inspire music, so that men could adore Divinity in polyphony with the psalms of heaven.',
    ],
    keyAphorisms: [
      'The vision of Truth draws the soul out like a magnet drawing iron from the earth.',
      'When you devote yourself to a noble spiritual theme, your lyre becomes mysteriously tuned.',
      'Discord in life is an untuned string; re-tune your heart to celestial harmony.',
    ],
    contemplationPrompt:
      'Are your actions playing in tune with the grand music of the cosmos, or has your instrument slipped out of pitch with worldly anxiety?',
    suggestedFrequencyHz: 639.0,
    planetaryRuler: 'venus',
    keywords: ['Master Musician', 'Lyre', 'Tuning', 'Magnet', 'Muses', 'Harmony'],
  },
  {
    id: 20,
    roman: 'XX',
    title: 'In Praise of Atum',
    subtitle: 'The Ecstatic Hymn of Silence at Sunrise and Sunset',
    category: 'theology',
    summary:
      'Hermes stands open to the sky at sunrise or sunset, offering an ecstatic hymn of gratitude to the One and All. Mind is God’s plectrum plucking music from the soul. Transformed into All-Mind, words dissolve, and the sage joins the gods singing praises through pure silence.',
    verses: [
      'In a place open to the sky, facing west at the hour of sunset or east at sunrise, I pray that the Cosmos be flung open to me and that all nature may receive the sound of my psalms.',
      'Justice, praise the just through me. Goodness, praise the good through me. Truth, praise the true through me. Selflessness, praise the All through me.',
      'I am your instrument. Mind is your plectrum, and your wisdom plucks music from me. I sing a song of my soul, for your love has reached me.',
      'When a man is born again he is not a body of three dimensions. He is All-Mind. Now that I see in Mind I perceive myself to be the All.',
      'I am in heaven and earth. I am in water and air. I am in beasts and plants. I am a new-born babe. I am still in the womb. I am the presence which is present everywhere.',
      'Language is inadequate. The gods sing a hymn of silence, and I am silently singing.',
    ],
    keyAphorisms: [
      'Mind is Atum’s plectrum, and wisdom plucks music from the human soul.',
      'The born-again soul is not a body of three dimensions: it is All-Mind, present everywhere.',
      'The highest adoration of the One-God is the Hymn of Silence.',
    ],
    contemplationPrompt:
      'Turn toward the horizon in stillness. Cease formulating words. Let your being merge into the silent, vibrating presence of the One and All.',
    suggestedFrequencyHz: 963.0,
    planetaryRuler: 'sun',
    keywords: ['Hymn of Silence', 'Atum', 'Plectrum', 'Ecstasy', 'Sunrise', 'All-Mind'],
  },
];

export const HERMETIC_MAXIMS = [
  { text: 'God is a Big Mind. Everything which exists is a thought within the Mind of God.', source: 'Ch. III' },
  { text: 'Life is the union of Mind and Word.', source: 'Ch. II' },
  { text: 'Nothing is more visible than Atum. He created all things so that through them you could see him.', source: 'Ch. IV' },
  { text: 'There has never existed a single thing which was not alive.', source: 'Ch. V' },
  { text: 'Man is an image of the sun, and the sun is an image of the Cosmos.', source: 'Ch. VIII' },
  { text: 'Gods are immortal men, and men are mortal gods.', source: 'Ch. XVII' },
  { text: 'Human beings are above the gods of heaven, for a man may ascend to heaven without leaving the Earth.', source: 'Ch. XI' },
  { text: 'If a man’s soul is illuminated by a single ray of Atum’s Light, the workings of the stars is as nothing.', source: 'Ch. XII' },
  { text: 'Tear off this cloak of shadows! Empty yourselves of darkness and you will be filled with Light.', source: 'Ch. XVI' },
  { text: 'Only like can truly know like; to know Atum, you must expand yourself to become like Atum.', source: 'Ch. XVII' },
  { text: 'The womb of rebirth is wisdom. The conception is silence. The seed is Goodness.', source: 'Ch. XVIII' },
  { text: 'The gods sing a hymn of silence, and I am silently singing.', source: 'Ch. XX' },
];
