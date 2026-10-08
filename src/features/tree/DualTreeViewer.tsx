import React, { useState, useRef, useEffect } from 'react';
import { TunnelData, EntityData, SEED_TUNNELS } from '../../platform/vault';
import { AlbTalisman, LuciferSigil } from './LuciferianSymbols';
import {
  playEnnChantTone,
  emergencyGroundAudio,
  startSphericResonator,
} from '../audio/audioManager';
import {
  getBrainwaveBand,
  QUICK_BRAINWAVE_PRESETS,
} from '../audio/brainwaveConstants';
import {
  Network,
  ArrowUpRight,
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  Zap,
  BookOpen,
  Shield,
  Flame,
  Sun,
  Moon,
  Info,
  Table,
  X,
  Headphones,
  Radio,
} from 'lucide-react';

interface DualTreeViewerProps {
  tunnels?: TunnelData[];
  entities?: EntityData[];
  onTuneToTunnel: (tunnel: TunnelData) => void;
}

// -----------------------------------------------------------------------------
// Sephiroth & Qliphoth Definition with Authentic Lore (Zohar, Crowley, Connolly)
// -----------------------------------------------------------------------------
export interface SephiraNode {
  id: number;
  x: number;
  y: number;
  dayName: string;
  sephiraTitle: string;
  archangel: string;
  divineName: string;
  dayDivinity: string;
  dayHebrew: string;
  dayKemetic: string;
  dayPillar: 'Severity' | 'Balance' | 'Mercy';
  connollyEnn: string;
  ennVerified?: boolean;
  nightName: string; // The Qliphoth sphere name: Thaumiel, Ghagiel, Satariel, Samael, etc.
  nightDemon: string; // The ruling arch-demon(s): Satan & Moloch, Beelzebub, Adrammelech & Samael, etc.
  nightMeaning: string;
  nightEnn: string; // Authentic Demonic Enn for Nightside
  gematria: number;
  nightGematria: number;
  musicalKey: string;
  keyModifier?: 'roar' | 'chatter' | 'tone';
  incense: string;
  colors: string;
  tools: string;
  gems: string;
  element: string;
  brainwaveHz: number;
  brainwaveBand: string;
  brainwaveTitle: string;
  description: string;
  studyLore: string;
  practicalExercise: string;
}

export const TREE_NODES: Record<number, SephiraNode> = {
  1: {
    id: 1,
    x: 400,
    y: 90,
    dayName: 'Kether',
    sephiraTitle: 'The Crown',
    archangel: 'Metatron (Prince of the Countenance)',
    divineName: 'Ehyeh Asher Ehyeh (אהיה אשר אהיה)',
    dayDivinity: 'Metatron · Satan (Quintessence)',
    dayHebrew: 'כתר',
    dayKemetic: 'Atem / Amun-Ra',
    dayPillar: 'Balance',
    connollyEnn: 'Tasa reme laris Satan - Ave Satanis',
    ennVerified: true,
    nightName: 'Thaumiel',
    nightDemon: 'Satan & Moloch',
    nightMeaning: 'The Twin Godheads / Dual Chaos in Revolt',
    nightEnn: 'Tasa reme laris Satan - Ave Satanis',
    gematria: 620,
    nightGematria: 488,
    musicalKey: 'E',
    incense: 'Ambergris, Sulphur, Pure Olibanum',
    colors: 'Brilliant White / Obsidian with Crimson Veins',
    tools: 'Crown, Swastika, Double Scythe',
    gems: 'Diamond, Black Diamond, Pure Quartz',
    element: 'All / Quintessence (The Source)',
    brainwaveHz: 40.0,
    brainwaveBand: 'Gamma',
    brainwaveTitle: '40 Hz Gamma (Crown Illumination & Twin Godheads)',
    description: 'The supreme summit of consciousness and source from which all energy flows.',
    studyLore:
      'In Kabbalah, Kether is the primordial point of light (Ehyeh Asher Ehyeh). In Demonolatry (S. Connolly, p. 256), Satan is Kether (The Crown)—the Whole and fifth element (Spirit/Acasual) consisting of all elements and alchemical transmutations. On the Nightside, Thaumiel represents the twin heads of duality in eternal revolt against tyrannical dogma.',
    practicalExercise:
      'Sit in dark stillness. Vibrate the Enn "Tasa reme laris Satan". Visualize a blinding black-gold light above the crown chakra, acknowledging that you are an indivisible droplet of the Whole.',
  },
  2: {
    id: 2,
    x: 620,
    y: 220,
    dayName: 'Chokmah',
    sephiraTitle: 'Wisdom',
    archangel: 'Raziel (Keeper of Secrets)',
    divineName: 'Yah (יה)',
    dayDivinity: 'Raziel · Lucifer (Air & Illumination)',
    dayHebrew: 'חכמה',
    dayKemetic: 'Shu / Thoth',
    dayPillar: 'Mercy',
    connollyEnn: 'Renich Tasa Uberaca Biasa Icar Lucifer',
    ennVerified: true,
    nightName: 'Ghagiel',
    nightDemon: 'Beelzebub',
    nightMeaning: 'The Hinderers / Lords of Rebellion & Confusion',
    nightEnn: 'Adey vocar avasa Beelzebub',
    gematria: 73,
    nightGematria: 52,
    musicalKey: 'F#',
    incense: 'Musk, Cedar, Dragon’s Breath, Sandalwood',
    colors: 'Soft Cerulean / Smoke Grey & Void Black',
    tools: 'Inner Phallus, Wand of Light, Eagle Sigil',
    gems: 'Star Ruby, Turquoise, Dark Jet',
    element: 'Air / Luminous Fire',
    brainwaveHz: 40.0,
    brainwaveBand: 'Gamma',
    brainwaveTitle: '40 Hz Gamma (Luciferian Wisdom & Morning Star Flash)',
    description: 'The active masculine energy of illumination, enlightenment, and creative gnosis.',
    studyLore:
      'Chokmah is primordial dynamic wisdom. In Connolly’s Tree (p. 256), Lucifer is Air and Wisdom: "being able to see the whole in conjunction with the sum of its parts in order to reach gnosis." In Michael W. Ford’s Apotheosis, Lucifer is the Morning Star (Eosphoros) igniting the Black Flame. On the Nightside, Ghagiel (Chaigidel) is ruled by Beelzebub, tearing down dogmatic illusions.',
    practicalExercise:
      'Contemplate the Air element. Vibrate "Renich Tasa Uberaca Biasa Icar Lucifer". Picture the dawn sun parting the clouds of superstition, awakening self-responsibility in your mind.',
  },
  3: {
    id: 3,
    x: 180,
    y: 220,
    dayName: 'Binah',
    sephiraTitle: 'Understanding',
    archangel: 'Tzaphkiel (Beholder of God)',
    divineName: 'YHVH Elohim (יהוה אלהים)',
    dayDivinity: 'Tzaphkiel · Unsere (Vapor & Intuition)',
    dayHebrew: 'בינה',
    dayKemetic: 'Tefnut / Isis',
    dayPillar: 'Severity',
    connollyEnn: 'Unsere tasa lirach on ca ayar',
    ennVerified: true,
    nightName: 'Satariel',
    nightDemon: 'Lucifuge Rofocale',
    nightMeaning: 'The Concealers / Guardians of the Dark Labyrinth',
    nightEnn: 'Eyen tasa valocur Lucifuge Rofocale',
    gematria: 67,
    nightGematria: 670,
    musicalKey: 'G',
    incense: 'Myrrh, Civet, Nightshade, Frankincense',
    colors: 'Crimson, Deep Indigo / Miry Black',
    tools: 'Cup of Understanding, Cowl-Cloak, Crystal Wand',
    gems: 'Black Pearl, Star Sapphire, Jet',
    element: 'Vapor (Fire transformed Water)',
    brainwaveHz: 5.5,
    brainwaveBand: 'Theta',
    brainwaveTitle: '5.5 Hz Theta (Womb of Understanding & Primordial Sea)',
    description: 'The Great Sea of the unconscious, womb of mysteries, and fertile sorcery.',
    studyLore:
      'Binah is the cosmic womb (Aimah Elohim). Unsere in Binah (Connolly, p. 256) is Vapor/Steam, representing feminine understanding and emotional roots. On the Nightside, Satariel is ruled by Lucifuge Rofocale, guarding the dark labyrinth of primal shadows and concealed wealth.',
    practicalExercise:
      'Focus on the breath as vapor rising and condensing. Call upon Unsere or Lucifuge Rofocale to grant patience, understanding of emotional roots, and deep feminine intuition.',
  },
  0: {
    id: 0,
    x: 400,
    y: 330,
    dayName: 'Daäth',
    sephiraTitle: 'Knowledge / The Abyss',
    archangel: 'Iophiel & Raziel (The Hidden Axis)',
    divineName: 'The Pylon of Truth',
    dayDivinity: 'The Pylon of Daäth',
    dayHebrew: 'דעת',
    dayKemetic: 'Tuat',
    dayPillar: 'Balance',
    connollyEnn: 'Lirach Tasa Vefa Wehlc Belial',
    ennVerified: true,
    nightName: 'The Abyss',
    nightDemon: 'Choronzon & Belial',
    nightMeaning: 'The Abyss of 333 / Threshold of the 22 Tunnels',
    nightEnn: 'Lirach Tasa Vefa Wehlc Belial',
    gematria: 474,
    nightGematria: 333,
    musicalKey: 'C#',
    incense: 'Camphor, Wormwood, Henbane, Frankincense',
    colors: 'Ultraviolet / Flashing Abyssal Void',
    tools: 'Pylon Key, Sickle of Daäth, Black Mirror',
    gems: 'Chrysoberyl, Black Opal, Moldavite',
    element: 'Spiritual Breath / Void',
    brainwaveHz: 100.0,
    brainwaveBand: 'Lambda',
    brainwaveTitle: '100 Hz Lambda (Trans-Abyssal Threshold & 333 Void)',
    description: 'The invisible threshold and cosmic axis through which the Dayside Tree flips into the Nightside Qliphoth.',
    studyLore:
      'Daäth is the non-Sephira, the invisible abyss (Connolly p. 257). It is the threshold between the conscious mind and the 22 Tunnels of Set. On the Nightside, Choronzon (Guardian of 333) tests the adept’s ego, while Belial enforces absolute independence and sovereignty.',
    practicalExercise:
      'Meditation on the Void: Close your eyes, visualize an obsidian mirror. Intone "Lirach Tasa Vefa Wehlc Belial" and feel the threshold of the Abyss open within the mind.',
  },
  4: {
    id: 4,
    x: 620,
    y: 440,
    dayName: 'Chesed',
    sephiraTitle: 'Mercy / Gedulah',
    archangel: 'Tzadkiel (Righteousness of God)',
    divineName: 'El (אל)',
    dayDivinity: 'Tzadkiel · Verrine (Restorative Healing)',
    dayHebrew: 'חסד',
    dayKemetic: 'Geb / Amon',
    dayPillar: 'Mercy',
    connollyEnn: 'Elan Typan Verrine',
    ennVerified: true,
    nightName: 'Gha\'agsheblah',
    nightDemon: 'Astaroth',
    nightMeaning: 'The Smiters / Devourers of Forms (Gamchicoth)',
    nightEnn: 'Serena Alora Astaroth Aken',
    gematria: 72,
    nightGematria: 436,
    musicalKey: 'A#',
    incense: 'Cedar, Frankincense, Bayberry, Mulberry',
    colors: 'Deep Royal Violet / Blue-Black',
    tools: 'Sceptre, Healing Lancet, Wand',
    gems: 'Sapphire, Amethyst, Lapis Lazuli',
    element: 'Cold (Water transformed Earth)',
    brainwaveHz: 10.0,
    brainwaveBand: 'Alpha',
    brainwaveTitle: '10 Hz Alpha (Regal Sovereign Equilibrium & Expansion)',
    description: 'Divinity of health, restorative mercy, and regenerative alchemical transmutation.',
    studyLore:
      'In Connolly’s framework (p. 256), Verrine is Chesed: Cold (Water transformed Earth). Emotional stability breeds intuition and physical recovery. On the Nightside, Gha’agsheblah (Gamchicoth) is governed by Astaroth, devouring outmoded forms and false orthodoxies.',
    practicalExercise:
      'Burn bayberry or cedar incense. Scan your physical and emotional body for depleted areas. Invoke Verrine or Astaroth to restore vitality and alchemical equilibrium.',
  },
  5: {
    id: 5,
    x: 180,
    y: 440,
    dayName: 'Geburah',
    sephiraTitle: 'Severity / Strength / Din',
    archangel: 'Kamael (Wrath of God)',
    divineName: 'Elohim Gibor (אלהים גבור)',
    dayDivinity: 'Kamael · Leviathan (Primordial Ocean)',
    dayHebrew: 'גבורה',
    dayKemetic: 'Nut / Sekhmet',
    dayPillar: 'Severity',
    connollyEnn: 'Jaden Tasa Hoet Naca Leviathan',
    ennVerified: true,
    nightName: 'Golachab',
    nightDemon: 'Asmodeus',
    nightMeaning: 'The Burning Ones / Flaming Wrath & Passion',
    nightEnn: 'Ayer avage aloren Asmodeus aken',
    gematria: 216,
    nightGematria: 77,
    musicalKey: 'C',
    incense: 'Calamus, Red Sandalwood, Dragon’s Blood',
    colors: 'Scarlet, Crimson / Sulphuric Red',
    tools: 'Dagger, Serpent Wand, Pentagram Bowl',
    gems: 'Ruby, Garnet, Bloodstone',
    element: 'Water / Primordial Sea',
    brainwaveHz: 24.0,
    brainwaveBand: 'Beta',
    brainwaveTitle: '24 Hz Beta (Martial Severance & Wrath of Asmodeus)',
    description: 'The raging ocean of will, emotional discernment, martial resistance, and unyielding defense.',
    studyLore:
      'Leviathan in Geburah (Connolly p. 256) is emotional and mental strength through water. In Ford’s Apotheosis, Leviathan is the Ouroboros encircling the circumference of the Living Temple. On the Nightside, Golachab is ruled by Asmodeus (King of Wrath & Desire), testing the initiate in the fires of discipline.',
    practicalExercise:
      'Face West with chalice and salt water. Vibrate "Jaden Tasa Hoet Naca Leviathan" or "Ayer avage aloren Asmodeus aken". Visualize the sea serpent coiling around you as an impenetrable circle of self-mastery.',
  },
  6: {
    id: 6,
    x: 400,
    y: 550,
    dayName: 'Tiphareth',
    sephiraTitle: 'Beauty / Solar Harmony',
    archangel: 'Raphael & Michael (Solar Healers)',
    divineName: 'YHVH Eloah va-Daath (יהוה אלוה ודעת)',
    dayDivinity: 'Raphael · Belial (Earth Sovereignty)',
    dayHebrew: 'תפארת',
    dayKemetic: 'Osiris / Ra',
    dayPillar: 'Balance',
    connollyEnn: 'Lirach Tasa Vefa Wehlc Belial',
    ennVerified: true,
    nightName: 'Thagirion',
    nightDemon: 'Belphegor & Sorath (666)',
    nightMeaning: 'The Disputers / The Black Sun (Sol Niger)',
    nightEnn: 'Lyan Ramec Catya Ganen Belphegor',
    gematria: 1081,
    nightGematria: 666,
    musicalKey: 'D',
    incense: 'Olibanum, Patchouli, Sandalwood',
    colors: 'Radiant Gold / Black-Gold Eclipse',
    tools: 'Lamen, Rosy Cross, Altar Trivet',
    gems: 'Topaz, Yellow Diamond, Golden Pyrite',
    element: 'Earth / Soil',
    brainwaveHz: 40.0,
    brainwaveBand: 'Gamma',
    brainwaveTitle: '40 Hz Gamma (Solar Illumination & Black Sun Sol Niger)',
    description: 'Lord of the physical foundation, beauty in matter, sovereignty, and independence.',
    studyLore:
      'Belial sits at Tiphareth (Connolly, p. 256), the solar heart center connecting physical and spiritual. Belial means "without a master"—absolute self-rule. On the Nightside, Thagirion represents the Black Sun (Sol Niger) and the number 666 (Sorath), where inner illumination burns away outer dependency.',
    practicalExercise:
      'Place both feet firmly on the ground. Vibrate "Lirach Tasa Vefa Wehlc Belial" or "Lyan Ramec Catya Ganen Belphegor". Center your consciousness in your heart and belly, claiming absolute sovereignty.',
  },
  7: {
    id: 7,
    x: 620,
    y: 720,
    dayName: 'Netzach',
    sephiraTitle: 'Victory / Eternity',
    archangel: 'Haniel (Grace of God)',
    divineName: 'YHVH Tzabaoth (יהוה צבאות)',
    dayDivinity: 'Haniel · Amducious (Heat & Will)',
    dayHebrew: 'נצח',
    dayKemetic: 'Isis / Hathor',
    dayPillar: 'Mercy',
    connollyEnn: 'Denyen valocur avage secore Amducious',
    ennVerified: true,
    nightName: 'A\'arab Zaraq',
    nightDemon: 'Baal (Bael)',
    nightMeaning: 'Ravens of Dispersion / Death Warriors',
    nightEnn: 'Ayer Secore On Ca Bael',
    gematria: 148,
    nightGematria: 329,
    musicalKey: 'F',
    incense: 'Rose, Benzoin, Red Sandalwood',
    colors: 'Emerald Green / Raven Black-Green',
    tools: 'Girdle, War Horn, Brass Lamp',
    gems: 'Emerald, Malachite, Jade',
    element: 'Heat (Air transformed Fire)',
    brainwaveHz: 8.0,
    brainwaveBand: 'Alpha',
    brainwaveTitle: '8 Hz Alpha (Venusian Astral Passion & Ecstasy)',
    description: 'Master of negative polarity, destructive force directed by will, martial victory and music.',
    studyLore:
      'Amducious in Netzach (Connolly p. 256) is Heat: the victory of will over inertia and physical limits. On the Nightside, A’arab Zaraq (Ravens of Dispersion) is ruled by Baal (Bael), teaching the adept to detach from petty social conditioning like ravens soaring over battlefields.',
    practicalExercise:
      'Listen to heavy percussive music. Vibrate "Denyen valocur avage secore Amducious" or "Ayer Secore On Ca Bael" to break through personal inertia and self-doubt.',
  },
  8: {
    id: 8,
    x: 180,
    y: 720,
    dayName: 'Hod',
    sephiraTitle: 'Splendor / Glory',
    archangel: 'Michael & Raphael (Elohim Tzabaoth)',
    divineName: 'Elohim Tzabaoth (אלהים צבאות)',
    dayDivinity: 'Michael · Eurynomous (Death & Rebirth)',
    dayHebrew: 'הוד',
    dayKemetic: 'Set / Anubis',
    dayPillar: 'Severity',
    connollyEnn: 'Ayar Secore on ca Eurynomous',
    ennVerified: true,
    nightName: 'Samael',
    nightDemon: 'Adrammelech & Samael',
    nightMeaning: 'The Poison of God / Desolators & Deceptive Splendor',
    nightEnn: 'Tasa sayir adrammelech on ca',
    gematria: 15,
    nightGematria: 131,
    musicalKey: 'E',
    incense: 'Mullein, Storax, Graveyard Dust',
    colors: 'Russet Orange / Rust Slime & Peacock Shimmer',
    tools: 'Book of the Dead, Mortar, Cursing Cord',
    gems: 'Opal, Agate, Carnelian',
    element: 'Dry (Earth transformed Air)',
    brainwaveHz: 18.0,
    brainwaveBand: 'Beta',
    brainwaveTitle: '18 Hz Beta (Mercurial Intellect & Adrammelech Discernment)',
    description: 'Keeper of death, transformation of consciousness, intellect, and honorable ancestral memory.',
    studyLore:
      'In Kabbalah, Hod represents the intellect and formal splendor. In Connolly (p. 255), Eurynomous in Hod represents the splendor of transformation: shedding worn-out vehicles for higher rebirth. On the Nightside, Samael (Gematria 131: סמאל) is the "Poison of God" ruled by Adrammelech (Peacock King). It dissolves rigid theological dogmas and tests the adept’s mental sharpness.',
    practicalExercise:
      'Burn mullein and sage. Contemplate what old habits, relationships, or self-limiting beliefs are dead wood. Vibrate "Tasa sayir adrammelech on ca" or "Ayar Secore on ca Eurynomous" to dissolve mental cages.',
  },
  9: {
    id: 9,
    x: 400,
    y: 860,
    dayName: 'Yesod',
    sephiraTitle: 'Foundation / Astral Matrix',
    archangel: 'Gabriel (Mighty One of God)',
    divineName: 'Shaddai El Chai (שדי אל חי)',
    dayDivinity: 'Gabriel · Flereous (Phoenix Flame)',
    dayHebrew: 'יסוד',
    dayKemetic: 'Nephthys / Khonsu',
    dayPillar: 'Balance',
    connollyEnn: 'Ganic Tasa Fubin Flereous',
    ennVerified: true,
    nightName: 'Gamaliel',
    nightDemon: 'Lilith',
    nightMeaning: 'The Obscene Ones / Shadow Lunar & Succubi Astral',
    nightEnn: 'Renich keda helire Lilith lirach doura',
    gematria: 80,
    nightGematria: 114,
    musicalKey: 'G#',
    incense: 'Jasmine, Sandalwood, Sage, Arnica',
    colors: 'Indigo Violet / Menstrual Purple & Silver',
    tools: 'Baphometic Fire Font, Perfume Bowl',
    gems: 'Moonstone, Quartz, Hematite',
    element: 'Fire / Phoenix Flame',
    brainwaveHz: 6.0,
    brainwaveBand: 'Theta',
    brainwaveTitle: '6 Hz Theta (Astral Gate, Lunar Hypnagogia & Lilith Trance)',
    description: 'The foundation of vital fire, the Phoenix rising from the ashes, astral navigation, and nocturnal passion.',
    studyLore:
      'Yesod is the astral foundation. Flereous in Yesod (Connolly p. 255) is the Foundation in Fire: vitality, primal passion, and the Phoenix rising from ashes. On the Nightside, Gamaliel (Gematria 114) is ruled by Lilith, Queen of the Night, governing astral dream incubations and sexual mysteries.',
    practicalExercise:
      'Light a red or black candle. Vibrate "Ganic Tasa Fubin Flereous" or "Renich keda helire Lilith lirach doura". Feel the fire of vitality warm your abdomen and spine, sparking creative passion.',
  },
  10: {
    id: 10,
    x: 400,
    y: 1030,
    dayName: 'Malkuth',
    sephiraTitle: 'The Kingdom / Physical Matter',
    archangel: 'Sandalphon (The Tall Angel)',
    divineName: 'Adonai ha-Aretz (אדני הארץ)',
    dayDivinity: 'Sandalphon · The Self (Living Temple)',
    dayHebrew: 'מלכות',
    dayKemetic: 'Horus / Geb',
    dayPillar: 'Balance',
    connollyEnn: 'Living Temple of Flesh, Mind & Spirit',
    ennVerified: true,
    nightName: 'Nahemoth',
    nightDemon: 'Naamah',
    nightMeaning: 'The Groaning Ones / Carnal Earth Phantoms',
    nightEnn: 'Geh ra en ca Naamah',
    gematria: 496,
    nightGematria: 495,
    musicalKey: 'B#',
    incense: 'Dittany of Crete, Patchouli, Salt',
    colors: 'Citrine, Olive, Russet, Bone Black',
    tools: 'Altar of Earth, Double Cube, Bone Blade',
    gems: 'Rock Crystal, Smoky Quartz, Obsidian',
    element: 'Earth / Physical Flesh',
    brainwaveHz: 2.5,
    brainwaveBand: 'Delta',
    brainwaveTitle: '2.5 Hz Delta (Telluric Earth & Somatic Grounding)',
    description: 'The physical vessel and living temple through which the Divine is made manifest.',
    studyLore:
      'In Kabbalah, Malkuth is the physical world and Shekhinah. In Connolly’s Demonolatry Tree (p. 255), Malkuth is THE SELF: "We are the physical manifestations of the divine." You start at 10 (The Self) and ascend to 1 (Kether) through self-directed initiation. On the Nightside, Nahemoth is ruled by Naamah, awakening carnal sensory gnosis in the physical flesh.',
    practicalExercise:
      'Place your hand upon your chest. Acknowledge your physical body as the living, walking temple of all cosmic forces. Vibrate "Geh ra en ca Naamah" to ground energy.',
  },
};

// -----------------------------------------------------------------------------
// Connecting Paths & Tunnels of Set (Paths 11 to 32)
// -----------------------------------------------------------------------------
interface PathLine {
  pathNum: number;
  from: number;
  to: number;
  dayAtu: string;
  hebrewLetter: string;
}

const TREE_PATHS: PathLine[] = [
  { pathNum: 11, from: 1, to: 2, dayAtu: 'The Fool', hebrewLetter: 'א' },
  { pathNum: 12, from: 1, to: 3, dayAtu: 'The Magus', hebrewLetter: 'ב' },
  { pathNum: 13, from: 1, to: 6, dayAtu: 'The Priestess', hebrewLetter: 'ג' },
  { pathNum: 14, from: 2, to: 3, dayAtu: 'The Empress', hebrewLetter: 'ד' },
  { pathNum: 15, from: 2, to: 6, dayAtu: 'The Star', hebrewLetter: 'ה' },
  { pathNum: 16, from: 2, to: 4, dayAtu: 'The Hierophant', hebrewLetter: 'ו' },
  { pathNum: 17, from: 3, to: 6, dayAtu: 'The Lovers', hebrewLetter: 'ז' },
  { pathNum: 18, from: 3, to: 5, dayAtu: 'The Chariot', hebrewLetter: 'ח' },
  { pathNum: 19, from: 4, to: 5, dayAtu: 'Lust', hebrewLetter: 'ט' },
  { pathNum: 20, from: 4, to: 6, dayAtu: 'The Hermit', hebrewLetter: 'י' },
  { pathNum: 21, from: 4, to: 7, dayAtu: 'Fortune', hebrewLetter: 'כ' },
  { pathNum: 22, from: 5, to: 6, dayAtu: 'Adjustment', hebrewLetter: 'ל' },
  { pathNum: 23, from: 5, to: 8, dayAtu: 'The Hanged Man', hebrewLetter: 'מ' },
  { pathNum: 24, from: 6, to: 7, dayAtu: 'Death', hebrewLetter: 'נ' },
  { pathNum: 25, from: 6, to: 9, dayAtu: 'Art', hebrewLetter: 'ס' },
  { pathNum: 26, from: 6, to: 8, dayAtu: 'The Devil', hebrewLetter: 'ע' },
  { pathNum: 27, from: 7, to: 8, dayAtu: 'The Tower', hebrewLetter: 'פ' },
  { pathNum: 28, from: 7, to: 9, dayAtu: 'The Emperor', hebrewLetter: 'צ' },
  { pathNum: 29, from: 7, to: 10, dayAtu: 'The Moon', hebrewLetter: 'ק' },
  { pathNum: 30, from: 8, to: 9, dayAtu: 'The Sun', hebrewLetter: 'ר' },
  { pathNum: 31, from: 8, to: 10, dayAtu: 'The Aeon', hebrewLetter: 'ש' },
  { pathNum: 32, from: 9, to: 10, dayAtu: 'The Universe', hebrewLetter: 'ת' },
];

export const DualTreeViewer: React.FC<DualTreeViewerProps> = ({
  tunnels = SEED_TUNNELS,
  onTuneToTunnel,
}) => {
  const [treeSide, setTreeSide] = useState<'day' | 'night'>('day');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<SephiraNode | null>(TREE_NODES[1]);
  const [selectedTunnel, setSelectedTunnel] = useState<TunnelData | null>(tunnels[0] || null);
  const [activeTab, setActiveTab] = useState<'node' | 'tunnel' | 'alb' | 'study'>('node');
  const [isMatrixOpen, setIsMatrixOpen] = useState<boolean>(false);
  const [playingEnnNote, setPlayingEnnNote] = useState<string | null>(null);
  const [activeEntrainHz, setActiveEntrainHz] = useState<number>(40.0);
  const [playingDroneSphereId, setPlayingDroneSphereId] = useState<number | null>(null);
  const [playingDroneTunnelId, setPlayingDroneTunnelId] = useState<number | null>(null);
  const stopEnnAudioRef = useRef<(() => void) | null>(null);
  const stopDroneAudioRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (stopEnnAudioRef.current) stopEnnAudioRef.current();
      if (stopDroneAudioRef.current) stopDroneAudioRef.current();
      emergencyGroundAudio();
    };
  }, []);

  const handleChantEnn = (noteKey: string, spokenEnn: string) => {
    if (playingEnnNote) {
      if (stopEnnAudioRef.current) stopEnnAudioRef.current();
      emergencyGroundAudio();
      setPlayingEnnNote(null);
      return;
    }
    if (stopDroneAudioRef.current) {
      stopDroneAudioRef.current();
      stopDroneAudioRef.current = null;
      setPlayingDroneSphereId(null);
      setPlayingDroneTunnelId(null);
    }
    setPlayingEnnNote(noteKey);
    stopEnnAudioRef.current = playEnnChantTone(
      noteKey,
      5.0,
      () => setPlayingEnnNote(null),
      spokenEnn
    );
  };

  const handleToggleSphereDrone = (node: SephiraNode) => {
    if (playingDroneSphereId === node.id) {
      if (stopDroneAudioRef.current) stopDroneAudioRef.current();
      stopDroneAudioRef.current = null;
      setPlayingDroneSphereId(null);
      return;
    }
    if (stopDroneAudioRef.current) stopDroneAudioRef.current();
    if (stopEnnAudioRef.current) stopEnnAudioRef.current();
    setPlayingEnnNote(null);
    setPlayingDroneTunnelId(null);
    setPlayingDroneSphereId(node.id);
    stopDroneAudioRef.current = startSphericResonator(node.musicalKey, activeEntrainHz, 0.28);
  };

  const handleToggleTunnelDrone = (tunnel: TunnelData) => {
    if (playingDroneTunnelId === tunnel.id) {
      if (stopDroneAudioRef.current) stopDroneAudioRef.current();
      stopDroneAudioRef.current = null;
      setPlayingDroneTunnelId(null);
      return;
    }
    if (stopDroneAudioRef.current) stopDroneAudioRef.current();
    if (stopEnnAudioRef.current) stopEnnAudioRef.current();
    setPlayingEnnNote(null);
    setPlayingDroneSphereId(null);
    setPlayingDroneTunnelId(tunnel.id);
    stopDroneAudioRef.current = startSphericResonator(tunnel.musical_key, activeEntrainHz, 0.28);
  };

  const handleSetEntrainHz = (hz: number) => {
    setActiveEntrainHz(hz);
    if (playingDroneSphereId !== null && selectedNode) {
      if (stopDroneAudioRef.current) stopDroneAudioRef.current();
      stopDroneAudioRef.current = startSphericResonator(selectedNode.musicalKey, hz, 0.28);
    } else if (playingDroneTunnelId !== null && selectedTunnel) {
      if (stopDroneAudioRef.current) stopDroneAudioRef.current();
      stopDroneAudioRef.current = startSphericResonator(selectedTunnel.musical_key, hz, 0.28);
    }
  };

  // Smooth Horizontal 3D Flip (keeps vertical orientation correct)
  const handleDaathFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setTreeSide((prev) => (prev === 'day' ? 'night' : 'day'));
    }, 350);
    setTimeout(() => {
      setIsFlipping(false);
    }, 700);
  };

  const handleSelectNode = (node: SephiraNode) => {
    setSelectedNode(node);
    setActiveEntrainHz(node.brainwaveHz);
    setActiveTab('node');
  };

  const handleSelectPath = (pathNum: number) => {
    const foundTunnel =
      tunnels.find((t) => t.number === pathNum) ||
      SEED_TUNNELS.find((t) => t.number === pathNum);
    if (foundTunnel) {
      setSelectedTunnel(foundTunnel);
      setActiveTab('tunnel');
    }
  };

  // Convert Sephira/Qlipha node to tunnel representation for portal tuning
  const handleTuneNodeToPortal = (node: SephiraNode) => {
    const synthTunnel: TunnelData = {
      id: 1000 + node.id,
      number: node.id === 0 ? 0 : node.id,
      name: treeSide === 'night' ? node.nightName : node.dayDivinity,
      path_letter: node.dayHebrew,
      attribution_type: node.element.toLowerCase().includes('water') ? 'element' : 'planet',
      planet_element: node.element,
      gematria: treeSide === 'night' ? node.nightGematria : node.gematria,
      musical_key: node.musicalKey,
      key_modifier: node.keyModifier || null,
      atu: treeSide === 'night' ? node.nightMeaning : `${node.dayName} (${node.sephiraTitle})`,
      tier: 'magus',
    };
    onTuneToTunnel(synthTunnel);
  };

  return (
    <div className="w-full h-full p-4 lg:p-6 overflow-y-auto bg-black text-neutral-200 flex flex-col gap-5 select-none font-sans">
      {/* Header bar & Daath Flip Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border transition-all ${
                treeSide === 'night'
                  ? 'bg-purple-950/40 border-purple-800/80 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-amber-950/40 border-amber-800/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              }`}
            >
              <Network
                className={`w-5 h-5 ${
                  treeSide === 'night' ? 'text-purple-300' : 'text-amber-300'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-decorative text-2xl font-bold tracking-wider text-white">
                  {treeSide === 'night' ? 'THE NIGHTSIDE QLIPHOTH' : 'THE DAYSIDE TREE OF LIFE'}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold uppercase">
                  {treeSide === 'night' ? 'Nightside' : 'Dayside'}
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400 mt-0.5">
                {treeSide === 'night'
                  ? '10 Qliphothic Spheres of Death (Samael, Thaumiel...) & 22 Tunnels of Set'
                  : '10 Sephirothic Spheres of Wisdom (Kether, Chokmah...) & 22 Paths'}
              </p>
            </div>
          </div>
        </div>

        {/* Tree Side Toggle Pill, Matrix Modal, & Flip Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dual Toggle Pill */}
          <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
            <button
              onClick={() => {
                if (treeSide !== 'day') handleDaathFlip();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                treeSide === 'day'
                  ? 'bg-amber-950/80 border border-amber-600/70 text-amber-200 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Dayside Tree</span>
            </button>
            <button
              onClick={() => {
                if (treeSide !== 'night') handleDaathFlip();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                treeSide === 'night'
                  ? 'bg-purple-950/80 border border-purple-600/70 text-purple-200 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-purple-400" />
              <span>Nightside Qliphoth</span>
            </button>
          </div>

          {/* Sephiroth vs Qliphoth Comparative Table Button */}
          <button
            onClick={() => setIsMatrixOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-all shadow-sm"
            title="Inspect 10 Sephiroth vs 10 Qliphoth Comparative Table"
          >
            <Table className="w-3.5 h-3.5 text-purple-400" />
            <span>Dual Tree Matrix</span>
          </button>

          {/* Trigger Flip Button */}
          <button
            onClick={handleDaathFlip}
            disabled={isFlipping}
            className={`px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 shadow-sm ${
              treeSide === 'night'
                ? 'bg-purple-950/70 hover:bg-purple-900/80 border-purple-700/80 text-purple-200'
                : 'bg-amber-950/70 hover:bg-amber-900/80 border-amber-700/80 text-amber-200'
            }`}
            title="Flip the Tree between Dayside and Nightside through Daäth"
          >
            <Zap className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin text-red-400' : 'text-amber-400'}`} />
            <span>Daäth Flip</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout: Tree Canvas (Left/Center) + Detail Drawer (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 items-start">
        {/* Animated Tree Canvas */}
        <div className="xl:col-span-7 2xl:col-span-8 flex flex-col items-center justify-center p-4 bg-neutral-950/80 rounded-2xl border border-neutral-800/80 shadow-2xl relative overflow-hidden min-h-[660px]">
          {/* Subtle Ambient Glow */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
              treeSide === 'night'
                ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/20 via-black to-transparent'
                : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/15 via-black to-transparent'
            }`}
          />

          {/* Perspective Container for Horizontal 3D Flip */}
          <div
            className="w-full max-w-[640px] flex items-center justify-center"
            style={{ perspective: '1600px' }}
          >
            <div
              className="w-full relative transition-all duration-700 ease-in-out"
              style={{
                transform: isFlipping
                  ? 'rotateY(90deg) scale(0.96)'
                  : 'rotateY(0deg) scale(1)',
                transformOrigin: '50% 50%',
              }}
            >
              {/* High-Definition SVG Tree Visualization */}
              <svg
                viewBox="0 0 800 1140"
                className="w-full h-auto drop-shadow-2xl cursor-default"
                style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))' }}
              >
                <defs>
                  {/* Gradients for Authentic Metallic Sphere Medallions */}
                  <radialGradient id="daySphereGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2a1e0b" />
                    <stop offset="75%" stopColor="#17120a" />
                    <stop offset="100%" stopColor="#0a0805" />
                  </radialGradient>

                  <radialGradient id="nightSphereGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#25102f" />
                    <stop offset="75%" stopColor="#14071b" />
                    <stop offset="100%" stopColor="#08020a" />
                  </radialGradient>

                  <radialGradient id="daathAbyssGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.8" />
                    <stop offset="45%" stopColor="#2e1065" stopOpacity="0.5" />
                    <stop offset="85%" stopColor="#090514" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>

                  {/* Filter for celestial glow aura */}
                  <filter id="medallionGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 22 Connecting Paths */}
                <g className="paths-group">
                  {TREE_PATHS.map((p) => {
                    const fromNode = TREE_NODES[p.from];
                    const toNode = TREE_NODES[p.to];
                    if (!fromNode || !toNode) return null;

                    const isSelected = selectedTunnel?.number === p.pathNum;
                    const pathColor =
                      treeSide === 'night'
                        ? isSelected
                          ? '#c084fc'
                          : '#581c87'
                        : isSelected
                        ? '#fbbf24'
                        : '#784d12';

                    const mx = (fromNode.x + toNode.x) / 2;
                    const my = (fromNode.y + toNode.y) / 2;

                    return (
                      <g
                        key={`path-${p.pathNum}`}
                        onClick={() => handleSelectPath(p.pathNum)}
                        className="cursor-pointer group"
                      >
                        {/* Invisible Wide Hit Area */}
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke="transparent"
                          strokeWidth="24"
                        />
                        {/* Visual Path Base Line */}
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={pathColor}
                          strokeWidth={isSelected ? '3.5' : '1.8'}
                          opacity={isSelected ? 0.9 : 0.45}
                          className="transition-all duration-300 group-hover:opacity-100 group-hover:stroke-amber-400"
                        />
                        {/* Flowing Astral Energy Current Line */}
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={
                            isSelected
                              ? treeSide === 'night'
                                ? '#f43f5e'
                                : '#fef08a'
                              : treeSide === 'night'
                              ? '#c084fc'
                              : '#fbbf24'
                          }
                          strokeWidth={isSelected ? '2.4' : '1.2'}
                          strokeDasharray="6 14"
                          opacity={isSelected ? 1 : 0.55}
                          className={isSelected ? 'animate-tree-current-fast' : 'animate-tree-current'}
                          style={{
                            filter: isSelected
                              ? `drop-shadow(0 0 8px ${treeSide === 'night' ? '#f43f5e' : '#f59e0b'})`
                              : undefined,
                          }}
                        />
                        {/* Midpoint Hebrew Letter Disc */}
                        <circle
                          cx={mx}
                          cy={my}
                          r="12"
                          fill="#07040a"
                          stroke={pathColor}
                          strokeWidth={isSelected ? '2' : '1.2'}
                          className="transition-all duration-300 group-hover:scale-125"
                          style={{
                            filter: isSelected
                              ? `drop-shadow(0 0 10px ${pathColor})`
                              : undefined,
                          }}
                        />
                        <text
                          x={mx}
                          y={my + 3.5}
                          textAnchor="middle"
                          fill={treeSide === 'night' ? '#e9d5ff' : '#fef08a'}
                          fontSize="10"
                          fontFamily="serif"
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          {p.hebrewLetter}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* Daath Abyss Corridor & Gravitational Vortex */}
                <g className="daath-abyss-group">
                  <ellipse
                    cx={TREE_NODES[0].x}
                    cy={TREE_NODES[0].y}
                    rx="105"
                    ry="54"
                    fill="url(#daathAbyssGlow)"
                    opacity="0.85"
                  />
                  <ellipse
                    cx={TREE_NODES[0].x}
                    cy={TREE_NODES[0].y}
                    rx="95"
                    ry="46"
                    fill="none"
                    stroke={treeSide === 'night' ? '#c084fc' : '#f59e0b'}
                    strokeWidth="1.5"
                    strokeDasharray="8 6"
                    className="animate-tree-current"
                    opacity="0.6"
                  />
                </g>

                {/* 10 Spheres + Daath Medallions */}
                <g className="spheres-group">
                  {Object.values(TREE_NODES).map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const isDaath = node.id === 0;

                    // Large radius for rich legible circles
                    const sphereRadius = isDaath ? 40 : 48;

                    const rimColor =
                      treeSide === 'night'
                        ? isSelected
                          ? '#f43f5e'
                          : isDaath
                          ? '#a855f7'
                          : '#7e22ce'
                        : isSelected
                        ? '#34d399'
                        : isDaath
                        ? '#d97706'
                        : '#b45309';

                    const primaryName =
                      treeSide === 'night'
                        ? node.nightName.toUpperCase()
                        : node.dayName.toUpperCase();

                    const categoryName =
                      treeSide === 'night'
                        ? `QLIPHA ${node.id === 0 ? 'DAATH' : node.id}`
                        : `SEPHIRA ${node.id === 0 ? 'DAATH' : node.id}`;

                    const subName =
                      treeSide === 'night'
                        ? node.nightDemon.split('&')[0].trim()
                        : node.sephiraTitle;

                    return (
                      <g
                        key={`node-${node.id}`}
                        onClick={() => handleSelectNode(node)}
                        className="cursor-pointer group"
                      >
                        {/* Selection Glowing Aura */}
                        {isSelected && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={sphereRadius + 12}
                            fill="none"
                            stroke={rimColor}
                            strokeWidth="2.5"
                            strokeDasharray="6 4"
                            filter="url(#medallionGlow)"
                            opacity="0.95"
                          />
                        )}

                        {/* Outer Celestial Degree Compass Ring */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={sphereRadius + 5}
                          fill="none"
                          stroke={rimColor}
                          strokeWidth="1"
                          strokeDasharray="2 4"
                          opacity={isSelected ? 0.9 : 0.45}
                        />

                        {/* Outer Medallion Body */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={sphereRadius}
                          fill={treeSide === 'night' ? 'url(#nightSphereGrad)' : 'url(#daySphereGrad)'}
                          stroke={rimColor}
                          strokeWidth={isSelected ? '3.5' : '2'}
                          className="transition-transform duration-300 ease-out group-hover:scale-105"
                        />

                        {/* Concentric Alchemical Framing Rings */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={sphereRadius - 4}
                          fill="none"
                          stroke={treeSide === 'night' ? '#6b21a8' : '#92400e'}
                          strokeWidth="1.2"
                          strokeDasharray="3 3"
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={sphereRadius - 7}
                          fill="none"
                          stroke={treeSide === 'night' ? '#3b0764' : '#451a03'}
                          strokeWidth="0.8"
                        />

                        {/* Top: Hebrew Letter & Sephira / Qlipha Order */}
                        <text
                          x={node.x}
                          y={node.y - 19}
                          textAnchor="middle"
                          fill={treeSide === 'night' ? '#d8b4fe' : '#fbbf24'}
                          fontSize="9"
                          fontFamily="Cinzel, Georgia, serif"
                          fontWeight="bold"
                          letterSpacing="1.2"
                          pointerEvents="none"
                        >
                          {node.dayHebrew} · {categoryName}
                        </text>

                        {/* Center: Sephira / Qlipha Primary Name */}
                        <text
                          x={node.x}
                          y={node.y + 3}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize={primaryName.length > 11 ? '10' : primaryName.length > 8 ? '11.5' : '13'}
                          fontFamily="Cinzel, Georgia, serif"
                          fontWeight="bold"
                          letterSpacing="0.8"
                          pointerEvents="none"
                        >
                          {primaryName}
                        </text>

                        {/* Bottom: Meaning / Title & Element */}
                        <text
                          x={node.x}
                          y={node.y + 20}
                          textAnchor="middle"
                          fill={treeSide === 'night' ? '#e9d5ff' : '#fef08a'}
                          fontSize="7.5"
                          fontFamily="sans-serif"
                          opacity="0.9"
                          pointerEvents="none"
                        >
                          {subName} • {node.element.split('/')[0].trim()}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Tree Footnote Guidance */}
          <div className="mt-4 pt-3 border-t border-neutral-900 w-full flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>● Click any Sphere or Path to study its correspondences</span>
            <span>Daäth (Center Axis) unlocks the Nightside</span>
          </div>
        </div>

        {/* Interactive Detail & Study Drawer (Right Column) */}
        <div className="xl:col-span-5 2xl:col-span-4 glass-panel p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between sticky top-4 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar shadow-2xl">
          <div>
            {/* Drawer Tabs (4 Modes) */}
            <div className="flex rounded-xl bg-neutral-900 p-1 border border-neutral-800 text-xs font-mono mb-5 gap-1">
              <button
                onClick={() => setActiveTab('node')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                  activeTab === 'node'
                    ? 'bg-amber-950/80 border border-amber-600/70 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {treeSide === 'night' ? 'Qlipha' : 'Sephira'}
              </button>
              <button
                onClick={() => setActiveTab('tunnel')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                  activeTab === 'tunnel'
                    ? 'bg-purple-950/80 border border-purple-600/70 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Tunnels
              </button>
              <button
                onClick={() => setActiveTab('study')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                  activeTab === 'study'
                    ? 'bg-emerald-950/80 border border-emerald-600/70 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Study
              </button>
              <button
                onClick={() => setActiveTab('alb')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                  activeTab === 'alb'
                    ? 'bg-red-950/80 border border-red-600/70 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ALB
              </button>
            </div>

            {/* TAB 1: NODE / SPHERE CORRESPONDENCES */}
            {activeTab === 'node' && selectedNode && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-400" />
                    {treeSide === 'night' ? 'Nightside Sphere' : 'Dayside Emanation'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 border border-neutral-700 text-neutral-300">
                    Pillar of {selectedNode.dayPillar}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-decorative text-2xl font-bold text-white">
                        {treeSide === 'night' ? selectedNode.nightName : selectedNode.dayName}
                      </h2>
                      <p className="font-serif italic text-sm text-amber-200/80">
                        {treeSide === 'night'
                          ? selectedNode.nightMeaning
                          : `"${selectedNode.sephiraTitle}"`}
                      </p>
                    </div>
                    <span className="font-serif text-3xl font-bold text-amber-400">
                      {selectedNode.dayHebrew}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-neutral-300 mt-2 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    {treeSide === 'night' ? (
                      <>
                        <span className="text-neutral-500">Ruling Arch-Demon: </span>
                        <strong className="text-purple-300">{selectedNode.nightDemon}</strong>
                        <span className="text-neutral-500 block text-[11px] mt-0.5">
                          Dayside Reflex: {selectedNode.dayName} ({selectedNode.sephiraTitle})
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-neutral-500">Archangel: </span>
                        <strong className="text-amber-300">{selectedNode.archangel}</strong>
                        <span className="text-neutral-500 block text-[11px] mt-0.5">
                          Divine Name: {selectedNode.divineName} • Demonolatry: {selectedNode.dayDivinity}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                {/* Active Enn Card & Audio Chanting Station */}
                <div className="p-3.5 rounded-xl bg-black/80 border border-neutral-800 flex flex-col gap-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-red-500" />
                      <span>{treeSide === 'night' ? 'Nightside Demonic Enn' : 'Dayside Divinity Enn'}</span>
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
                      Key of {selectedNode.musicalKey}
                    </span>
                  </div>

                  <p className="font-serif italic text-white text-sm select-all">
                    "{treeSide === 'night' ? selectedNode.nightEnn : selectedNode.connollyEnn}"
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-neutral-900">
                    <button
                      onClick={() =>
                        handleChantEnn(
                          selectedNode.musicalKey,
                          treeSide === 'night' ? selectedNode.nightEnn : selectedNode.connollyEnn
                        )
                      }
                      className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                        playingEnnNote === selectedNode.musicalKey
                          ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse'
                          : treeSide === 'night'
                          ? 'bg-purple-950/70 hover:bg-purple-900 border border-purple-700/80 text-purple-200'
                          : 'bg-amber-950/70 hover:bg-amber-900 border border-amber-700/80 text-amber-200'
                      }`}
                    >
                      {playingEnnNote === selectedNode.musicalKey ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Silence Enn</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Chant Enn & Key Drone</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Binaural Entrainment & Harmonic Resonator Station */}
                <div className="p-3.5 rounded-xl bg-black/80 border border-neutral-800 flex flex-col gap-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                      <Headphones className="w-3.5 h-3.5 text-amber-400" />
                      <span>Binaural Entrainment Station</span>
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${getBrainwaveBand(activeEntrainHz).badgeClass}`}>
                      {getBrainwaveBand(activeEntrainHz).name} {activeEntrainHz === 40 ? '★' : ''} ({activeEntrainHz.toFixed(1)} Hz)
                    </span>
                  </div>

                  {/* 6 Quick Presets covering Delta through 40Hz Gamma to 100Hz Lambda */}
                  <div className="grid grid-cols-6 gap-1 text-[10px] font-mono">
                    {QUICK_BRAINWAVE_PRESETS.map((p) => {
                      const isSelected = Math.abs(activeEntrainHz - p.hz) < 0.2;
                      return (
                        <button
                          key={p.hz}
                          onClick={() => handleSetEntrainHz(p.hz)}
                          className={`py-1 rounded text-center transition-all ${
                            isSelected
                              ? p.highlight
                                ? 'bg-amber-900 border border-amber-400 text-amber-200 font-bold shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                : 'bg-purple-900 border border-purple-400 text-purple-200 font-bold'
                              : p.highlight
                              ? 'bg-amber-950/40 border border-amber-800/60 text-amber-400/90 hover:bg-amber-900/50'
                              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {p.short}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                    <strong className="text-amber-300 font-mono">{getBrainwaveBand(activeEntrainHz).label}:</strong> {getBrainwaveBand(activeEntrainHz).occultSignificance}
                  </p>

                  <button
                    onClick={() => handleToggleSphereDrone(selectedNode)}
                    className={`w-full py-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                      playingDroneSphereId === selectedNode.id
                        ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse'
                        : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200'
                    }`}
                  >
                    {playingDroneSphereId === selectedNode.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Silence Continuous Resonator</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sustain Harmonic Drone ({selectedNode.musicalKey} + {activeEntrainHz.toFixed(1)} Hz)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Grid Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800 text-xs font-mono">
                  <div className="col-span-2 flex items-center justify-between p-2 rounded-lg bg-black/60 border border-neutral-800">
                    <div>
                      <span className="text-neutral-500 text-[10px] block">RESONANT BRAINWAVE</span>
                      <span className="text-amber-300 font-bold text-xs">{selectedNode.brainwaveTitle}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${getBrainwaveBand(selectedNode.brainwaveHz).badgeClass}`}>
                      {selectedNode.brainwaveBand} {selectedNode.brainwaveHz === 40 ? '★' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">ELEMENT / REALM</span>
                    <span className="text-neutral-200 font-semibold">{selectedNode.element}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">
                      {treeSide === 'night' ? 'QLIPHA GEMATRIA' : 'SEPHIRA GEMATRIA'}
                    </span>
                    <span className="text-purple-300 font-bold">
                      {treeSide === 'night' ? selectedNode.nightGematria : selectedNode.gematria}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">MUSICAL KEY</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      Key of {selectedNode.musicalKey}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">INCENSE</span>
                    <span className="text-neutral-300 truncate block">{selectedNode.incense.split(',')[0]}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {selectedNode.description}
                </p>
              </div>
            )}

            {/* TAB 2: TUNNEL OF SET CORRESPONDENCES */}
            {activeTab === 'tunnel' && selectedTunnel && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Sentinel of Kenneth Grant
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 border border-purple-800 text-purple-300">
                    TUNNEL {selectedTunnel.number}
                  </span>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    {selectedTunnel.name}
                  </h2>
                  <p className="font-mono text-xs text-amber-400 font-medium mt-1">
                    Path Letter: {selectedTunnel.path_letter} • Atu: {selectedTunnel.atu}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800 text-xs font-mono">
                  <div>
                    <span className="text-neutral-500 text-[10px] block">ATTRIBUTION</span>
                    <span className="text-neutral-200 font-semibold">{selectedTunnel.planet_element}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">GEMATRIA NUMBER</span>
                    <span className="text-purple-300 font-bold">{selectedTunnel.gematria}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">SONIC KEY</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      Key of {selectedTunnel.musical_key}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">TEXTURE</span>
                    <span className="text-neutral-300 capitalize">{selectedTunnel.key_modifier || 'Pure Drone'}</span>
                  </div>
                </div>

                {/* Tunnel Resonant Frequency Station */}
                <div className="p-3.5 rounded-xl bg-black/80 border border-purple-900/40 flex flex-col gap-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-300 font-bold flex items-center gap-1.5 uppercase">
                      <Headphones className="w-3.5 h-3.5 text-purple-400" />
                      <span>Tunnel Resonant Frequency</span>
                    </span>
                    <span className="text-amber-400 font-bold">
                      Key of {selectedTunnel.musical_key} · {activeEntrainHz.toFixed(1)} Hz ({getBrainwaveBand(activeEntrainHz).name})
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-1 text-[10px] font-mono">
                    {QUICK_BRAINWAVE_PRESETS.map((p) => {
                      const isSelected = Math.abs(activeEntrainHz - p.hz) < 0.2;
                      return (
                        <button
                          key={p.hz}
                          onClick={() => handleSetEntrainHz(p.hz)}
                          className={`py-1 rounded text-center transition-all ${
                            isSelected
                              ? p.highlight
                                ? 'bg-amber-900 border border-amber-400 text-amber-200 font-bold shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                : 'bg-purple-900 border border-purple-400 text-purple-200 font-bold'
                              : p.highlight
                              ? 'bg-amber-950/40 border border-amber-800/60 text-amber-400/90 hover:bg-amber-900/50'
                              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {p.short}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handleToggleTunnelDrone(selectedTunnel)}
                    className={`w-full py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                      playingDroneTunnelId === selectedTunnel.id
                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-pulse'
                        : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200'
                    }`}
                  >
                    {playingDroneTunnelId === selectedTunnel.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Silence Tunnel Drone</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-3.5 h-3.5 text-purple-400" />
                        <span>Sustain Tunnel Drone ({selectedTunnel.musical_key} + {activeEntrainHz.toFixed(1)} Hz)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-900/40 text-xs font-sans text-neutral-300 leading-relaxed">
                  Sentinel of the {selectedTunnel.number}th Kala of the Nightside of Eden (Kenneth Grant, Liber 231).
                  Governs tarot trump <strong>{selectedTunnel.atu}</strong> and resonates with musical note <strong className="text-amber-400">{selectedTunnel.musical_key}</strong>.
                </div>
              </div>
            )}

            {/* TAB 3: STUDY GUIDE & SOURCE LORE */}
            {activeTab === 'study' && selectedNode && (
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-1">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    Grimoire Study & Source Texts
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    Sphere {selectedNode.id}
                  </span>
                </div>

                {/* Lore from S. Connolly & Ford */}
                <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col gap-2">
                  <h4 className="text-xs font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    Study Notes (paraphrased — verify against your books):
                  </h4>
                  <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                    {selectedNode.studyLore}
                  </p>
                </div>

                {/* Practical Meditative Exercise */}
                <div className="p-4 rounded-xl bg-black/80 border border-emerald-900/40 flex flex-col gap-2">
                  <h4 className="text-xs font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    Practical Working & Meditation:
                  </h4>
                  <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                    {selectedNode.practicalExercise}
                  </p>
                </div>

                {/* Key Questions to Ponder */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-400 leading-relaxed">
                  <strong className="text-neutral-300 block mb-1">Study Questions:</strong>
                  1. How does this divinity balance the opposite pillar on the Tree?
                  <br />
                  2. What personal weakness or habit can you transmute by aligning with this force?
                </div>
              </div>
            )}

            {/* TAB 4: LUCIFERIAN GNOSIS & ALB TALISMAN */}
            {activeTab === 'alb' && (
              <div className="flex flex-col items-center gap-5 overflow-y-auto max-h-[500px] pr-1 text-center">
                <div className="w-full flex items-center justify-between border-b border-neutral-800 pb-3 text-left">
                  <span className="text-xs font-mono text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-red-400" />
                    Assembly of Light Bearers (ALB)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300">
                    Apotheosis
                  </span>
                </div>

                {/* Authentic ALB Vector Talisman */}
                <div className="p-2 rounded-2xl bg-black border border-red-900/40 shadow-[0_0_25px_rgba(220,38,38,0.25)]">
                  <AlbTalisman size={220} />
                </div>

                {/* Triad of the Morning Star */}
                <div className="w-full grid grid-cols-3 gap-2 text-left">
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                    <strong className="text-red-400 block font-mono text-[11px]">1. LIBERATION</strong>
                    <span className="text-[10px] text-neutral-400">Broken Chains • Freeing the mind from guilt & dogma.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                    <strong className="text-amber-400 block font-mono text-[11px]">2. ILLUMINATION</strong>
                    <span className="text-[10px] text-neutral-400">The Torch • Awakening the inner Black Flame.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                    <strong className="text-purple-400 block font-mono text-[11px]">3. APOTHEOSIS</strong>
                    <span className="text-[10px] text-neutral-400">The Eye • Deification & becoming your own God.</span>
                  </div>
                </div>

                {/* Classical Sigil of Lucifer */}
                <div className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <LuciferSigil size={42} />
                    <div>
                      <h4 className="text-xs font-serif font-bold text-white">Sigil of Lucifer</h4>
                      <p className="text-[10px] font-mono text-neutral-400">Grimorium Verum • Air & Chokmah</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-red-400 border border-red-900/60 px-2 py-0.5 rounded bg-red-950/40">
                    Morning Star
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action: Tune Trance Portal */}
          <div className="pt-4 border-t border-neutral-800">
            {activeTab !== 'tunnel' && selectedNode && (
              <button
                onClick={() => handleTuneNodeToPortal(selectedNode)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-900 via-neutral-900 to-amber-900 hover:from-red-800 hover:to-amber-800 border border-amber-600/50 text-white font-serif text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>TUNE TRANCE PORTAL TO THIS SPHERE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}

            {activeTab === 'tunnel' && selectedTunnel && (
              <button
                onClick={() => onTuneToTunnel(selectedTunnel)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-900 via-neutral-900 to-red-900 hover:from-purple-800 hover:to-red-800 border border-purple-600/50 text-white font-serif text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-purple-300" />
                <span>TUNE TRANCE PORTAL TO TUNNEL {selectedTunnel.number}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dual Tree Comparative Matrix Modal (Sephiroth vs Qliphoth) */}
      {isMatrixOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-5xl max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-800/80 text-purple-300">
                  <Table className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-decorative text-lg sm:text-xl font-bold text-white tracking-wide">
                    Comparative Emanation Matrix: Sephiroth vs Qliphoth
                  </h3>
                  <p className="text-xs font-mono text-neutral-400 mt-0.5">
                    10 Divine Spheres of Light & 10 Demonic Spheres of Shadow (Zohar, Crowley, Kenneth Grant & Connolly)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMatrixOpen(false)}
                className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-all"
                title="Close Matrix"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Matrix Table Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
              <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-black/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/90 text-neutral-300 font-mono uppercase text-[11px]">
                      <th className="py-3 px-3 text-center w-12">#</th>
                      <th className="py-3 px-4 text-amber-300">Dayside Sephira</th>
                      <th className="py-3 px-4 text-amber-400/80">Archangel & Divine Name</th>
                      <th className="py-3 px-4 text-purple-300">Nightside Qlipha</th>
                      <th className="py-3 px-4 text-purple-400/80">Ruling Arch-Demon</th>
                      <th className="py-3 px-4 text-amber-300">Brainwave Entrainment</th>
                      <th className="py-3 px-4 text-red-300">Demonic Enn & Chant</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/70 font-mono">
                    {/* Render all 11 nodes ordered 1 to 10 with Da'ath in order */}
                    {[1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10].map((nodeId) => {
                      const node = TREE_NODES[nodeId];
                      if (!node) return null;
                      const isDaath = node.id === 0;

                      return (
                        <tr
                          key={`matrix-node-${node.id}`}
                          className={`hover:bg-neutral-900/50 transition-colors ${
                            selectedNode?.id === node.id ? 'bg-purple-950/20' : ''
                          }`}
                        >
                          {/* Sphere Number & Hebrew */}
                          <td className="py-3 px-3 text-center font-bold">
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                                isDaath
                                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                  : 'bg-neutral-900 text-neutral-300 border border-neutral-800'
                              }`}
                            >
                              {isDaath ? '0/Daäth' : node.id}
                            </span>
                            <div className="font-serif text-sm text-neutral-400 mt-0.5">
                              {node.dayHebrew}
                            </div>
                          </td>

                          {/* Dayside Sephira */}
                          <td className="py-3 px-4">
                            <div className="font-serif font-bold text-white text-sm">
                              {node.dayName}
                            </div>
                            <div className="text-[11px] text-amber-300/80 font-sans italic">
                              "{node.sephiraTitle}"
                            </div>
                            <div className="text-[10px] text-neutral-500 mt-0.5">
                              Gematria: <span className="text-amber-400 font-bold">{node.gematria}</span> • Pillar: {node.dayPillar}
                            </div>
                          </td>

                          {/* Archangel & Divine Name */}
                          <td className="py-3 px-4">
                            <div className="text-amber-200 font-semibold text-[11px]">
                              {node.archangel}
                            </div>
                            <div className="text-neutral-400 text-[10px] mt-0.5 font-sans">
                              {node.divineName}
                            </div>
                          </td>

                          {/* Nightside Qlipha */}
                          <td className="py-3 px-4">
                            <div className="font-serif font-bold text-purple-200 text-sm flex items-center gap-1.5">
                              <span>{node.nightName}</span>
                              {node.nightName === 'Samael' && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-red-950 border border-red-800 text-red-300">
                                  Sphere 8
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-purple-400/80 font-sans italic">
                              "{node.nightMeaning}"
                            </div>
                            <div className="text-[10px] text-neutral-500 mt-0.5">
                              Qliphothic Gematria: <span className="text-purple-300 font-bold">{node.nightGematria}</span>
                            </div>
                          </td>

                          {/* Ruling Arch-Demon */}
                          <td className="py-3 px-4">
                            <div className="text-purple-300 font-bold text-[11px]">
                              {node.nightDemon}
                            </div>
                            <div className="text-neutral-500 text-[10px] mt-0.5">
                              Note Key: <span className="text-amber-400">{node.musicalKey}</span>
                            </div>
                          </td>

                          {/* Brainwave Entrainment */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${getBrainwaveBand(node.brainwaveHz).badgeClass}`}>
                                {node.brainwaveBand} {node.brainwaveHz === 40 ? '★' : ''}
                              </span>
                              <span className="text-amber-300 font-bold text-[10px]">{node.brainwaveHz} Hz</span>
                            </div>
                            <div className="text-[9px] text-neutral-400 mt-0.5 max-w-[140px] truncate">
                              {node.brainwaveTitle.split('(')[1]?.replace(')', '') || node.brainwaveBand}
                            </div>
                          </td>

                          {/* Demonic Enn & Chant Station */}
                          <td className="py-3 px-4 max-w-xs">
                            <p className="font-serif italic text-white/90 text-[11px] leading-snug">
                              "{node.nightEnn}"
                            </p>
                            <button
                              onClick={() => handleChantEnn(node.musicalKey, node.nightEnn)}
                              className={`mt-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                                playingEnnNote === node.musicalKey
                                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.6)] animate-pulse'
                                  : 'bg-purple-950/80 hover:bg-purple-900 border border-purple-700/80 text-purple-200'
                              }`}
                            >
                              {playingEnnNote === node.musicalKey ? (
                                <>
                                  <VolumeX className="w-3 h-3" />
                                  <span>Stop Chant</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3 h-3 text-purple-300" />
                                  <span>Chant Enn ({node.musicalKey})</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Action Button: Inspect Node */}
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedNode(node);
                                setActiveTab('node');
                                setIsMatrixOpen(false);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-[10px] text-amber-300 hover:text-white font-mono uppercase tracking-wider transition-all"
                            >
                              Examine
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Matrix Note & Scholarly References */}
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] font-mono text-neutral-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>
                  ● SAMAEL (Sphere 8) is the Nightside reflex of Hod (Splendor), with gematria cipher 131, ruled by Adrammelech & Samael.
                </span>
                <span className="text-purple-300">Source: Occult.wiki & Kenneth Grant's Nightside of Eden</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DualTreeViewer;
