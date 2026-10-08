import React, { useState } from 'react';
import { TunnelData, EntityData, SEED_TUNNELS } from '../../platform/vault';
import { AlbTalisman, LuciferSigil } from './LuciferianSymbols';
import {
  Network,
  ArrowUpRight,
  Sparkles,
  Volume2,
  Compass,
  Zap,
  BookOpen,
  Shield,
  Flame,
  Sun,
  Moon,
  Info,
} from 'lucide-react';

interface DualTreeViewerProps {
  tunnels?: TunnelData[];
  entities?: EntityData[];
  onTuneToTunnel: (tunnel: TunnelData) => void;
}

// -----------------------------------------------------------------------------
// Sephiroth & Qliphoth Definition with Connolly & Ford Lore
// -----------------------------------------------------------------------------
export interface SephiraNode {
  id: number;
  x: number;
  y: number;
  dayName: string;
  sephiraTitle: string;
  dayDivinity: string;
  dayHebrew: string;
  dayKemetic: string;
  dayPillar: 'Severity' | 'Balance' | 'Mercy';
  connollyEnn: string;
  /** Set true only after confirming the enn against a primary source. */
  ennVerified?: boolean;
  nightName: string;
  nightDemon: string;
  nightMeaning: string;
  gematria: number;
  musicalKey: string;
  keyModifier?: 'roar' | 'chatter' | 'tone';
  incense: string;
  colors: string;
  tools: string;
  gems: string;
  element: string;
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
    dayDivinity: 'Satan',
    dayHebrew: 'כתר',
    dayKemetic: 'Atem',
    dayPillar: 'Balance',
    connollyEnn: 'Tasa reme laris Satan - Ave Satanis',
    nightName: 'Thaumiel',
    nightDemon: 'Satan & Moloch',
    nightMeaning: 'The Twin Godheads / Dual Chaos',
    gematria: 620,
    musicalKey: 'E',
    incense: 'Ambergris, Sulphur, Pure Olibanum',
    colors: 'Brilliant White / Obsidian with Crimson Veins',
    tools: 'Crown, Swastika, Double Scythe',
    gems: 'Diamond, Black Diamond, Pure Quartz',
    element: 'All / Quintessence (The Source)',
    description: 'The supreme summit of consciousness and source from which all energy flows.',
    studyLore:
      'In Demonolatry (S. Connolly, p. 256), Satan is Kether (The Crown)—not an anthropomorphic enemy, but the Whole and the fifth element (Spirit/Acasual). He consists of all elements, alchemical conjunctions, and transmutations. On the Nightside, Thaumiel represents the twin heads of duality in eternal revolt against tyrannical monotheism.',
    practicalExercise:
      'Sit in dark stillness. Vibrate the Enn "Tasa reme laris Satan". Visualize a blinding black-gold light above the crown chakra, acknowledging that you are an indivisible droplet of the Whole.',
  },
  2: {
    id: 2,
    x: 620,
    y: 220,
    dayName: 'Chokmah',
    sephiraTitle: 'Wisdom',
    dayDivinity: 'Lucifer',
    dayHebrew: 'חכמה',
    dayKemetic: 'Shu',
    dayPillar: 'Mercy',
    connollyEnn: 'Renich Tasa Uberaca Biasa Icar Lucifer',
    nightName: 'Ghagiel',
    nightDemon: 'Beelzebub',
    nightMeaning: 'The Hinderers / Lords of Illusion',
    gematria: 73,
    musicalKey: 'F#',
    incense: 'Musk, Cedar, Dragon’s Breath, Sandalwood',
    colors: 'Soft Cerulean / Smoke Grey & Void Black',
    tools: 'Inner Phallus, Wand of Light, Eagle Sigil',
    gems: 'Star Ruby, Turquoise, Dark Jet',
    element: 'Air / Luminous Fire',
    description: 'The active masculine energy of illumination, enlightenment, and creative gnosis.',
    studyLore:
      'In Connolly’s Tree (p. 256), Lucifer is Air and Wisdom in Chokmah: "being able to see the whole in conjunction with the sum of its parts in order to reach gnosis." In Michael W. Ford’s Apotheosis, Lucifer is the Morning Star (Eosphoros) and Evening Star (Hesperos)—the Torch Bearer of Venus who ignites the Black Flame.',
    practicalExercise:
      'Contemplate the Air element. Vibrate "Renich Tasa Uberaca Biasa Icar Lucifer". Picture the dawn sun parting the clouds of superstition, awakening self-responsibility in your mind.',
  },
  3: {
    id: 3,
    x: 180,
    y: 220,
    dayName: 'Binah',
    sephiraTitle: 'Understanding',
    dayDivinity: 'Unsere',
    dayHebrew: 'בינה',
    dayKemetic: 'Tefnut',
    dayPillar: 'Severity',
    connollyEnn: 'Unsere tasa lirach on ca ayar',
    nightName: 'Satariel',
    nightDemon: 'Lucifuge Rofocale',
    nightMeaning: 'The Concealers / Guardians of the Labyrinth',
    gematria: 67,
    musicalKey: 'G',
    incense: 'Myrrh, Civet, Nightshade, Frankincense',
    colors: 'Crimson, Deep Indigo / Miry Black',
    tools: 'Cup of Understanding, Cowl-Cloak, Crystal Wand',
    gems: 'Black Pearl, Star Sapphire, Jet',
    element: 'Vapor (Fire transformed Water)',
    description: 'The Great Sea of the unconscious, womb of mysteries, and fertile sorcery.',
    studyLore:
      'Unsere in Binah (Connolly, p. 256) is Vapor/Steam. She represents feminine understanding and wisdom of self and others, connecting the mental realm to the divine/spiritual. On the Nightside, Satariel is ruled by Lucifuge Rofocale, guarding the dark labyrinth of the primal womb.',
    practicalExercise:
      'Focus on the breath as vapor rising and condensing. Call upon Unsere to grant patience, understanding of emotional roots, and deep feminine intuition.',
  },
  0: {
    id: 0,
    x: 400,
    y: 330,
    dayName: 'Daäth',
    sephiraTitle: 'The Pylon of Knowledge',
    dayDivinity: 'Lucifuge Rofocale',
    dayHebrew: 'דעת',
    dayKemetic: 'Tuat',
    dayPillar: 'Balance',
    connollyEnn: 'Eyen tasa valocur Lucifuge Rofocale',
    nightName: 'Pylon of Choronzon',
    nightDemon: 'Choronzon & Lucifuge',
    nightMeaning: 'The Abyss / Threshold of the 22 Tunnels',
    gematria: 474,
    musicalKey: 'C#',
    incense: 'Camphor, Wormwood, Henbane, Frankincense',
    colors: 'Ultraviolet / Flashing Abyssal Void',
    tools: 'Pylon Key, Sickle of Daäth, Black Mirror',
    gems: 'Chrysoberyl, Black Opal, Moldavite',
    element: 'Spiritual Breath / Void',
    description: 'The invisible threshold and cosmic axis through which the Dayside Tree flips into the Nightside Qliphoth.',
    studyLore:
      'Daäth is the non-Sephira, the invisible abyss (Connolly p. 257). Lucifuge Rofocale represents the spiritual breath connecting body to mind. He is the twin brother of Lucifer who controls wealth and dark wisdom. This is the exact pivot point where Dayside consciousness crosses over into the Nightside Qliphoth.',
    practicalExercise:
      'Meditation on the Void: Close your eyes, visualize an obsidian mirror. Intone "Eyen tasa valocur Lucifuge Rofocale" and feel the threshold of the Abyss open within the mind.',
  },
  4: {
    id: 4,
    x: 620,
    y: 440,
    dayName: 'Chesed',
    sephiraTitle: 'Mercy',
    dayDivinity: 'Verrine',
    dayHebrew: 'חסד',
    dayKemetic: 'Geb',
    dayPillar: 'Mercy',
    connollyEnn: 'Elan Typan Verrine',
    nightName: 'Gha\'agsheblah',
    nightDemon: 'Astaroth',
    nightMeaning: 'The Smiters / Devourers of Forms',
    gematria: 72,
    musicalKey: 'A#',
    incense: 'Cedar, Frankincense, Bayberry, Mulberry',
    colors: 'Deep Royal Violet / Blue-Black',
    tools: 'Sceptre, Healing Lancet, Wand',
    gems: 'Sapphire, Amethyst, Lapis Lazuli',
    element: 'Cold (Water transformed Earth)',
    description: 'Divinity of health, restorative mercy, and regenerative alchemical transmutation.',
    studyLore:
      'In Connolly’s framework (p. 256), Verrine is Chesed: Cold (Water transformed Earth). From emotional stability and maturity comes intuition and healing. Healing the Self is the highest mercy of the Left-Hand Path practitioner.',
    practicalExercise:
      'Burn bayberry or cedar incense. Scan your physical and emotional body for depleted areas. Invoke Verrine with "Elan Typan Verrine" to restore vitality.',
  },
  5: {
    id: 5,
    x: 180,
    y: 440,
    dayName: 'Geburah',
    sephiraTitle: 'Strength / Severity',
    dayDivinity: 'Leviathan',
    dayHebrew: 'גבורה',
    dayKemetic: 'Nut',
    dayPillar: 'Severity',
    connollyEnn: 'Jaden Tasa Hoet Naca Leviathan',
    nightName: 'Golachab',
    nightDemon: 'Asmodeus',
    nightMeaning: 'The Burning Ones / Flaming Wrath',
    gematria: 216,
    musicalKey: 'C',
    incense: 'Calamus, Red Sandalwood, Dragon’s Blood',
    colors: 'Scarlet, Crimson / Sulphuric Red',
    tools: 'Dagger, Serpent Wand, Pentagram Bowl',
    gems: 'Ruby, Garnet, Bloodstone',
    element: 'Water / Primordial Sea',
    description: 'The raging ocean of will, emotional discernment, martial resistance, and unyielding defense.',
    studyLore:
      'Leviathan in Geburah (Connolly p. 256) is emotional and mental strength through water. In Michael W. Ford’s Apotheosis (p. 169), Leviathan is the Ouroboros Serpent-Dragon encircling the circumference of the Living Temple, boundary of the cosmos and the acasual abyss.',
    practicalExercise:
      'Face West with chalice and salt water. Vibrate "Jaden Tasa Hoet Naca Leviathan". Visualize the great sea serpent coiling around you as an impenetrable circle of self-mastery.',
  },
  6: {
    id: 6,
    x: 400,
    y: 550,
    dayName: 'Tiphereth',
    sephiraTitle: 'Beauty / Harmony',
    dayDivinity: 'Belial',
    dayHebrew: 'תפארת',
    dayKemetic: 'Osiris',
    dayPillar: 'Balance',
    connollyEnn: 'Lirach Tasa Vefa Wehlc Belial',
    nightName: 'Thagirion',
    nightDemon: 'Belphegor',
    nightMeaning: 'The Disputers / The Black Sun & Solar Lion',
    gematria: 1081,
    musicalKey: 'D',
    incense: 'Olibanum, Patchouli, Sandalwood',
    colors: 'Radiant Gold / Black-Gold Eclipse',
    tools: 'Lamen, Rosy Cross, Altar Trivet',
    gems: 'Topaz, Yellow Diamond, Golden Pyrite',
    element: 'Earth / Soil',
    description: 'Lord of the physical foundation, beauty in matter, sovereignty, and independence.',
    studyLore:
      'Belial sits at Tiphereth (Connolly, p. 256), the heart center connecting the physical and mental. Belial means "without a master / without a yoke"—affirming independence and self-rule. On the Nightside, Thagirion represents the Black Sun of spiritual enlightenment.',
    practicalExercise:
      'Place both feet firmly on the ground. Vibrate "Lirach Tasa Vefa Wehlc Belial". Center your consciousness in your heart and belly, claiming absolute sovereignty over your life.',
  },
  7: {
    id: 7,
    x: 620,
    y: 720,
    dayName: 'Netzach',
    sephiraTitle: 'Victory',
    dayDivinity: 'Amducious',
    dayHebrew: 'נצח',
    dayKemetic: 'Isis',
    dayPillar: 'Mercy',
    connollyEnn: 'Denyen valocur avage secore Amducious',
    nightName: 'A\'arab Zaraq',
    nightDemon: 'Bael',
    nightMeaning: 'Ravens of Dispension / Death Warriors',
    gematria: 148,
    musicalKey: 'F',
    incense: 'Rose, Benzoin, Red Sandalwood',
    colors: 'Emerald Green / Raven Black-Green',
    tools: 'Girdle, War Horn, Brass Lamp',
    gems: 'Emerald, Malachite, Jade',
    element: 'Heat (Air transformed Fire)',
    description: 'Master of negative polarity, destructive force directed by will, martial victory and music.',
    studyLore:
      'Amducious in Netzach (Connolly p. 256) is Heat: the victory of will over physical limitations. While Amducious is associated with destruction, force is ruled by will, turning struggle into conscious triumph.',
    practicalExercise:
      'Listen to heavy percussive or martial music. Vibrate "Denyen valocur avage secore Amducious" to break through personal inertia and procrastination.',
  },
  8: {
    id: 8,
    x: 180,
    y: 720,
    dayName: 'Hod',
    sephiraTitle: 'Splendor',
    dayDivinity: 'Eurynomous',
    dayHebrew: 'הוד',
    dayKemetic: 'Set',
    dayPillar: 'Severity',
    connollyEnn: 'Ayar Secore on ca Eurynomous',
    nightName: 'Samael',
    nightDemon: 'Adramelech',
    nightMeaning: 'The Poison of God / Desolators',
    gematria: 15,
    musicalKey: 'E',
    incense: 'Mullein, Storax, Graveyard Dust',
    colors: 'Russet Orange / Rust Slime',
    tools: 'Book of the Dead, Mortar, Cursing Cord',
    gems: 'Opal, Agate, Carnelian',
    element: 'Dry (Earth transformed Air)',
    description: 'Keeper of death, transformation of consciousness, and honorable ancestral memory.',
    studyLore:
      'Eurynomous in Hod (Connolly p. 255) represents the splendor of transformation: change of consciousness through death and rebirth. Death equals the shedding of the worn-out vehicle so new shoots may rise.',
    practicalExercise:
      'Burn mullein and sage. Contemplate what old habits, relationships, or self-limiting beliefs are dead wood that need to be cleared from your psyche.',
  },
  9: {
    id: 9,
    x: 400,
    y: 860,
    dayName: 'Yesod',
    sephiraTitle: 'Foundation',
    dayDivinity: 'Flereous',
    dayHebrew: 'יסוד',
    dayKemetic: 'Nephthys',
    dayPillar: 'Balance',
    connollyEnn: 'Ganic Tasa Fubin Flereous',
    nightName: 'Gamaliel',
    nightDemon: 'Lilith',
    nightMeaning: 'The Obscene Ones / Moon Vampyres & Succubi',
    gematria: 80,
    musicalKey: 'G#',
    incense: 'Jasmine, Sandalwood, Sage, Arnica',
    colors: 'Indigo Violet / Menstrual Purple & Silver',
    tools: 'Baphometic Fire Font, Perfume Bowl',
    gems: 'Moonstone, Quartz, Hematite',
    element: 'Fire / Phoenix Flame',
    description: 'The foundation of vital fire, the Phoenix rising from the ashes, and nocturnal passion.',
    studyLore:
      'Flereous in Yesod (Connolly p. 255) is the Foundation in Fire. There would be no life without the solar spark. Fire represents primal desire, vitality, and the Phoenix rising from ashes. On the Nightside, Gamaliel is ruled by Lilith, governing the astral dream plane and sexual mysteries.',
    practicalExercise:
      'Light a red or black candle. Vibrate "Ganic Tasa Fubin Flereous". Feel the fire of vitality warm your abdomen and spine, sparking creative passion.',
  },
  10: {
    id: 10,
    x: 400,
    y: 1030,
    dayName: 'Malkuth',
    sephiraTitle: 'The Kingdom',
    dayDivinity: 'The Self',
    dayHebrew: 'מלכות',
    dayKemetic: 'Horus',
    dayPillar: 'Balance',
    connollyEnn: 'Living Temple of Mind, Body & Spirit',
    nightName: 'Nahemoth',
    nightDemon: 'Naamah',
    nightMeaning: 'The Groaning Ones / Carnal Earth Phantoms',
    gematria: 496,
    musicalKey: 'B#',
    incense: 'Dittany of Crete, Patchouli, Salt',
    colors: 'Citrine, Olive, Russet, Bone Black',
    tools: 'Altar of Earth, Double Cube, Bone Blade',
    gems: 'Rock Crystal, Smoky Quartz, Obsidian',
    element: 'Earth / Physical Flesh',
    description: 'The physical vessel and living temple through which the Divine is made manifest.',
    studyLore:
      'In Connolly’s Demonolatry Tree (p. 255), Malkuth is THE SELF: "We are the physical manifestations of the divine." You start at 10 (The Self in the physical world) and work your way up to 1 (Kether/Satan) through self-directed initiation.',
    practicalExercise:
      'Place your hand upon your chest. Acknowledge your physical body as the living, walking temple of all 9 Divinities and the cosmos.',
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
      gematria: node.gematria,
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
                  ? '10 Qliphothic Spheres of Death & 22 Tunnels of Set (Liber 231 / Grant)'
                  : 'S. Connolly • 9 Demonic Divinities + The Self & 10 Sephirothic Spheres'}
              </p>
            </div>
          </div>
        </div>

        {/* Tree Side Toggle Pill & Flip Button */}
        <div className="flex items-center gap-2">
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
                        {/* Visual Path Line */}
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={pathColor}
                          strokeWidth={isSelected ? '3.5' : '1.8'}
                          strokeDasharray={treeSide === 'night' ? '5 4' : 'none'}
                          opacity={isSelected ? 1 : 0.65}
                          className="transition-all duration-300 group-hover:opacity-100 group-hover:stroke-amber-400"
                        />
                        {/* Midpoint Hebrew Letter Disc */}
                        <circle
                          cx={mx}
                          cy={my}
                          r="11"
                          fill="#09090b"
                          stroke={pathColor}
                          strokeWidth="1.2"
                          className="transition-all group-hover:scale-125"
                        />
                        <text
                          x={mx}
                          y={my + 3.5}
                          textAnchor="middle"
                          fill={treeSide === 'night' ? '#d8b4fe' : '#fde047'}
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

                {/* Daath Abyss Corridor */}
                <ellipse
                  cx={TREE_NODES[0].x}
                  cy={TREE_NODES[0].y}
                  rx="95"
                  ry="48"
                  fill="url(#daathAbyssGlow)"
                  opacity="0.8"
                />

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
                        ? node.nightDemon.toUpperCase()
                        : node.dayDivinity.toUpperCase();

                    const categoryName =
                      treeSide === 'night'
                        ? node.nightName.toUpperCase()
                        : `${node.dayName.toUpperCase()}`;

                    const subName =
                      treeSide === 'night'
                        ? node.nightMeaning.split('/')[0].trim()
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
                          letterSpacing="1.5"
                          pointerEvents="none"
                        >
                          {node.dayHebrew} · {categoryName}
                        </text>

                        {/* Center: Demonic / Angelic Divinity Name */}
                        <text
                          x={node.x}
                          y={node.y + 2}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize={primaryName.length > 10 ? '11' : '13'}
                          fontFamily="Cinzel, Georgia, serif"
                          fontWeight="bold"
                          letterSpacing="0.5"
                          pointerEvents="none"
                        >
                          {primaryName}
                        </text>

                        {/* Bottom: Meaning / Title & Element */}
                        <text
                          x={node.x}
                          y={node.y + 19}
                          textAnchor="middle"
                          fill={treeSide === 'night' ? '#e9d5ff' : '#fef08a'}
                          fontSize="8"
                          fontFamily="sans-serif"
                          opacity="0.85"
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
        <div className="xl:col-span-5 2xl:col-span-4 glass-panel p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between min-h-[660px] shadow-2xl">
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
                        <span className="text-neutral-500">ArchDemon: </span>
                        <strong className="text-purple-300">{selectedNode.nightDemon}</strong>
                      </>
                    ) : (
                      <>
                        <span className="text-neutral-500">Demonolatry Divinity: </span>
                        <strong className="text-amber-300">{selectedNode.dayDivinity}</strong>
                        <span className="text-neutral-500"> (Egyptian: {selectedNode.dayKemetic})</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Demonic Enn Card */}
                {selectedNode.connollyEnn && (
                  <div className="p-3 rounded-xl bg-black/70 border border-neutral-800 flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-amber-500 font-bold">
                        Sacred Demonic Enn:
                      </span>
                      {!selectedNode.ennVerified && (
                        <span
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-400"
                          title="Not yet confirmed against a primary source"
                        >
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="font-serif italic text-neutral-100 text-sm">
                      "{selectedNode.connollyEnn}"
                    </p>
                  </div>
                )}

                {/* Grid Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800 text-xs font-mono">
                  <div>
                    <span className="text-neutral-500 text-[10px] block">ELEMENT / REALM</span>
                    <span className="text-neutral-200 font-semibold">{selectedNode.element}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">GEMATRIA CIPHER</span>
                    <span className="text-purple-300 font-bold">{selectedNode.gematria}</span>
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
    </div>
  );
};

export default DualTreeViewer;
