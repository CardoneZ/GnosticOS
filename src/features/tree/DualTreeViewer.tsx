import React, { useState } from 'react';
import { TunnelData, EntityData, SEED_TUNNELS } from '../../platform/vault';
import {
  Network,
  ArrowUpRight,
  Sparkles,
  Volume2,
  Gem,
  Compass,
  Zap,
} from 'lucide-react';

interface DualTreeViewerProps {
  tunnels?: TunnelData[];
  entities?: EntityData[];
  onTuneToTunnel: (tunnel: TunnelData) => void;
}

// -----------------------------------------------------------------------------
// Sephiroth & Qliphoth Definition with Connolly & Grant Correspondences
// -----------------------------------------------------------------------------
interface SephiraNode {
  id: number;
  x: number;
  y: number;
  dayName: string;
  dayDivinity: string;
  dayHebrew: string;
  dayKemetic: string;
  dayPillar: 'Severity' | 'Balance' | 'Mercy';
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
}

const TREE_NODES: Record<number, SephiraNode> = {
  1: {
    id: 1,
    x: 400,
    y: 90,
    dayName: 'Kether (The Crown)',
    dayDivinity: 'Satan',
    dayHebrew: 'כתר',
    dayKemetic: 'Atem',
    dayPillar: 'Balance',
    nightName: 'Thaumiel',
    nightDemon: 'Satan & Moloch',
    nightMeaning: 'The Twin Cursers / Crown of Dual Chaos',
    gematria: 620,
    musicalKey: 'E',
    incense: 'Ambergris, Sulphur, Pure Olibanum',
    colors: 'Brilliant White / Obsidian Black with Crimson Veins',
    tools: 'Crown, Swastika, Double Scythe',
    gems: 'Diamond, Black Diamond, Pure Quartz',
    element: 'All / Quintessence',
    description: 'The supreme summit of consciousness and primordial unmanifest will.',
  },
  2: {
    id: 2,
    x: 620,
    y: 220,
    dayName: 'Chokmah (Wisdom)',
    dayDivinity: 'Lucifer',
    dayHebrew: 'חכמה',
    dayKemetic: 'Shu',
    dayPillar: 'Mercy',
    nightName: 'Ghagiel',
    nightDemon: 'Beelzebub',
    nightMeaning: 'The Hinderers / Lords of Illusion',
    gematria: 73,
    musicalKey: 'F#',
    incense: 'Musk, Cedar, Dragon’s Breath',
    colors: 'Soft Cerulean / Smoke Grey & Void Black',
    tools: 'Inner Phallus, Wand of Light, Eagle Sigil',
    gems: 'Star Ruby, Turquoise, Dark Jet',
    element: 'Air / Luminous Fire',
    description: 'The active masculine energy of illumination, enlightenment, and creative gnosis.',
  },
  3: {
    id: 3,
    x: 180,
    y: 220,
    dayName: 'Binah (Understanding)',
    dayDivinity: 'Unsere',
    dayHebrew: 'בינה',
    dayKemetic: 'Tefnut',
    dayPillar: 'Severity',
    nightName: 'Satariel',
    nightDemon: 'Lucifuge Rofocale',
    nightMeaning: 'The Concealers / Guardians of the Dark Labyrinth',
    gematria: 67,
    musicalKey: 'G',
    incense: 'Myrrh, Civet, Nightshade',
    colors: 'Crimson, Deep Indigo / Miry Black',
    tools: 'Cup of Understanding, Cowl-Cloak, Crystal Wand',
    gems: 'Black Pearl, Star Sapphire, Jet',
    element: 'Vapor (Fire-Water)',
    description: 'The Great Sea of the unconscious, womb of mysteries, and fertile sorcery.',
  },
  0: {
    id: 0,
    x: 400,
    y: 330,
    dayName: 'Daäth (The Pylon of Knowledge)',
    dayDivinity: 'Lucifuge Rofocale',
    dayHebrew: 'דעת',
    dayKemetic: 'Tuat',
    dayPillar: 'Balance',
    nightName: 'The Pylon of Choronzon',
    nightDemon: 'Choronzon & Lucifuge',
    nightMeaning: 'The Abyss / Portal of the 22 Tunnels of Set',
    gematria: 474,
    musicalKey: 'C#',
    incense: 'Camphor, Wormwood, Henbane, Frankincense',
    colors: 'Ultraviolet / Flashing Abyssal Void',
    tools: 'Pylon Key, Sickle of Daäth, Black Mirror',
    gems: 'Chrysoberyl, Black Opal, Moldavite',
    element: 'Spiritual Breath / Void',
    description: 'The invisible threshold and cosmic axis through which the Dayside Tree flips into the Nightside Qliphoth.',
  },
  4: {
    id: 4,
    x: 620,
    y: 440,
    dayName: 'Chesed (Mercy / Grace)',
    dayDivinity: 'Verrine',
    dayHebrew: 'חסד',
    dayKemetic: 'Geb',
    dayPillar: 'Mercy',
    nightName: 'Gha\'agsheblah',
    nightDemon: 'Astaroth',
    nightMeaning: 'The Smiters / Devourers of Forms',
    gematria: 72,
    musicalKey: 'A#',
    incense: 'Cedar, Frankincense, Bayberry, Mulberry',
    colors: 'Deep Royal Violet / Blue-Black',
    tools: 'Sceptre, Healing Lancet, Wand',
    gems: 'Sapphire, Amethyst, Lapis Lazuli',
    element: 'Cold (Water-Earth)',
    description: 'Divinity of health, restorative mercy, and regenerative alchemical transmutation.',
  },
  5: {
    id: 5,
    x: 180,
    y: 440,
    dayName: 'Geburah (Strength / Severity)',
    dayDivinity: 'Leviathan',
    dayHebrew: 'גבורה',
    dayKemetic: 'Nut',
    dayPillar: 'Severity',
    nightName: 'Golachab',
    nightDemon: 'Asmodeus',
    nightMeaning: 'The Burning Bodies / Flaming Wrath',
    gematria: 216,
    musicalKey: 'C',
    incense: 'Calamus, Red Sandalwood, Dragon’s Blood',
    colors: 'Scarlet, Crimson / Sulphuric Red',
    tools: 'Dagger, Serpent Wand, Pentagram Bowl',
    gems: 'Ruby, Garnet, Bloodstone',
    element: 'Water / Primordial Sea',
    description: 'The raging ocean of will, emotional discernment, martial resistance, and unyielding defense.',
  },
  6: {
    id: 6,
    x: 400,
    y: 550,
    dayName: 'Tiphareth (Beauty / Harmony)',
    dayDivinity: 'Belial',
    dayHebrew: 'תפארת',
    dayKemetic: 'Osiris',
    dayPillar: 'Balance',
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
  },
  7: {
    id: 7,
    x: 620,
    y: 720,
    dayName: 'Netzach (Victory)',
    dayDivinity: 'Amducious',
    dayHebrew: 'נצח',
    dayKemetic: 'Isis',
    dayPillar: 'Mercy',
    nightName: 'A\'arab Zaraq',
    nightDemon: 'Bael',
    nightMeaning: 'Ravens of Dispension / Death Warriors',
    gematria: 148,
    musicalKey: 'F',
    incense: 'Rose, Benzoin, Red Sandalwood',
    colors: 'Emerald Green / Raven Black-Green',
    tools: 'Girdle, War Horn, Brass Lamp',
    gems: 'Emerald, Malachite, Jade',
    element: 'Heat (Air-Fire)',
    description: 'Master of negative polarity, destructive force directed by will, martial victory and music.',
  },
  8: {
    id: 8,
    x: 180,
    y: 720,
    dayName: 'Hod (Splendor)',
    dayDivinity: 'Eurynomous',
    dayHebrew: 'הוד',
    dayKemetic: 'Set',
    dayPillar: 'Severity',
    nightName: 'Samael',
    nightDemon: 'Adramalech',
    nightMeaning: 'The Poison of God / Desolators',
    gematria: 15,
    musicalKey: 'E',
    incense: 'Mullein, Storax, Graveyard Dust',
    colors: 'Russet Orange / Rust Slime',
    tools: 'Book of the Dead, Mortar, Cursing Cord',
    gems: 'Opal, Agate, Carnelian',
    element: 'Dry (Earth-Air)',
    description: 'Keeper of death, transformation of consciousness, and honorable ancestral memory.',
  },
  9: {
    id: 9,
    x: 400,
    y: 860,
    dayName: 'Yesod (Foundation)',
    dayDivinity: 'Flereous',
    dayHebrew: 'יסוד',
    dayKemetic: 'Nephthys',
    dayPillar: 'Balance',
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
  },
  10: {
    id: 10,
    x: 400,
    y: 1030,
    dayName: 'Malkuth (The Kingdom)',
    dayDivinity: 'The Self',
    dayHebrew: 'מלכות',
    dayKemetic: 'Horus',
    dayPillar: 'Balance',
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
  const [treeSide, setTreeSide] = useState<'day' | 'night'>('night');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<SephiraNode | null>(TREE_NODES[0]);
  const [selectedTunnel, setSelectedTunnel] = useState<TunnelData | null>(tunnels[0] || null);
  const [activeTab, setActiveTab] = useState<'node' | 'tunnel'>('node');

  // Trigger Daath 3D Flip
  const handleDaathFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setTreeSide((prev) => (prev === 'day' ? 'night' : 'day'));
    }, 450);
    setTimeout(() => {
      setIsFlipping(false);
    }, 900);
  };

  const handleSelectNode = (node: SephiraNode) => {
    setSelectedNode(node);
    setActiveTab('node');
  };

  const handleSelectPath = (pathNum: number) => {
    const foundTunnel = tunnels.find((t) => t.number === pathNum) || SEED_TUNNELS.find((t) => t.number === pathNum);
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
      atu: treeSide === 'night' ? node.nightMeaning : node.dayName,
      tier: 'magus',
    };
    onTuneToTunnel(synthTunnel);
  };

  return (
    <div className="w-full h-full p-4 lg:p-6 overflow-y-auto bg-black text-neutral-200 flex flex-col gap-6 select-none font-sans">
      {/* Header bar & Daath Flip Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border transition-all ${
              treeSide === 'night'
                ? 'bg-purple-950/80 border-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-amber-950/80 border-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
            }`}>
              <Network className={`w-5 h-5 ${treeSide === 'night' ? 'text-purple-300' : 'text-amber-300'}`} />
            </div>
            <div>
              <h1 className="font-decorative text-2xl font-bold tracking-wider text-white">
                {treeSide === 'night' ? 'THE NIGHTSIDE QLIPHOTH' : 'THE DAYSIDE TREE OF LIFE'}
              </h1>
              <p className="text-xs font-mono text-neutral-400 mt-0.5">
                {treeSide === 'night'
                  ? 'Kenneth Grant • 10 Spheres of Death & 22 Tunnels of Set (Liber 231)'
                  : 'S. Connolly • 9 Demonic Divinities + The Self & 22 Sacred Paths'}
              </p>
            </div>
          </div>
        </div>

        {/* Daath Flip Action Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDaathFlip}
            disabled={isFlipping}
            className={`relative group px-4 py-2 rounded-lg border font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2.5 overflow-hidden shadow-lg ${
              treeSide === 'night'
                ? 'bg-gradient-to-r from-purple-950 to-red-950 hover:from-purple-900 hover:to-red-900 border-purple-600 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-gradient-to-r from-amber-950 to-emerald-950 hover:from-amber-900 hover:to-emerald-900 border-amber-600 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
            }`}
          >
            <Zap className={`w-4 h-4 transition-transform ${isFlipping ? 'animate-spin text-red-400' : 'text-amber-400 group-hover:scale-125'}`} />
            <span>TRIGGER THE DAÄTH FLIP</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 border border-neutral-700 text-neutral-300">
              {treeSide === 'night' ? '→ DAYSIDE' : '→ NIGHTSIDE'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout: Tree Canvas (Left/Center) + Detail Drawer (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 items-start">
        {/* 3D Animated Tree Canvas */}
        <div className="xl:col-span-7 2xl:col-span-8 flex flex-col items-center justify-center p-4 bg-neutral-950/90 rounded-2xl border border-neutral-800/80 shadow-2xl relative overflow-hidden min-h-[640px]">
          {/* Background Ambient Void Lightning Glow */}
          <div
            className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
              treeSide === 'night'
                ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/30 via-red-950/10 to-transparent'
                : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/25 via-emerald-950/10 to-transparent'
            }`}
          />

          {/* 3D Perspective Card Container for the Daath Flip */}
          <div
            className="w-full max-w-[620px] transition-transform duration-700 ease-out flex items-center justify-center"
            style={{
              perspective: '1400px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className="w-full relative transition-all duration-700 ease-in-out"
              style={{
                transform: isFlipping
                  ? 'rotateX(90deg) scale(0.92)'
                  : 'rotateX(0deg) scale(1)',
                transformOrigin: '50% 32%', // Pivots exactly at Daath's y-coordinate!
              }}
            >
              {/* High-Definition SVG Tree Visualization */}
              <svg
                viewBox="0 0 800 1140"
                className="w-full h-auto drop-shadow-2xl cursor-default"
                style={{ filter: 'drop-shadow(0 0 25px rgba(0,0,0,0.9))' }}
              >
                <defs>
                  {/* Glow Filters */}
                  <filter id="nightGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="dayGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  {/* Daath Abyss Pulsing Gradient */}
                  <radialGradient id="daathAbyssGlow">
                    <stop offset="0%" stopColor="#9333ea" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#4c1d95" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* 22 Connecting Paths / Tunnels of Set */}
                <g className="paths-group">
                  {TREE_PATHS.map((p) => {
                    const fromNode = TREE_NODES[p.from];
                    const toNode = TREE_NODES[p.to];
                    const isSelected = selectedTunnel?.number === p.pathNum;
                    const pathColor =
                      treeSide === 'night'
                        ? isSelected
                          ? '#c084fc'
                          : '#581c87'
                        : isSelected
                        ? '#fbbf24'
                        : '#78350f';

                    // Center point for path glyph
                    const mx = (fromNode.x + toNode.x) / 2;
                    const my = (fromNode.y + toNode.y) / 2;

                    return (
                      <g
                        key={`path-${p.pathNum}`}
                        onClick={() => handleSelectPath(p.pathNum)}
                        className="cursor-pointer group"
                      >
                        {/* Interactive Click Buffer Line */}
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke="transparent"
                          strokeWidth="28"
                        />
                        {/* Visual Path Line */}
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={pathColor}
                          strokeWidth={isSelected ? '5' : '2.5'}
                          strokeDasharray={treeSide === 'night' ? '6 4' : 'none'}
                          opacity={isSelected ? 1 : 0.75}
                          className="transition-all duration-300 group-hover:stroke-purple-400 group-hover:stroke-width-4"
                        />
                        {/* Midpoint Path Badge / Hebrew Letter */}
                        <circle
                          cx={mx}
                          cy={my}
                          r="13"
                          fill="#09090b"
                          stroke={pathColor}
                          strokeWidth="1.5"
                          className="transition-all group-hover:scale-125"
                        />
                        <text
                          x={mx}
                          y={my + 4}
                          textAnchor="middle"
                          fill={treeSide === 'night' ? '#e9d5ff' : '#fef08a'}
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          {p.hebrewLetter}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* Daath Pylon Portal Corridor / Abyss Line */}
                <ellipse
                  cx={TREE_NODES[0].x}
                  cy={TREE_NODES[0].y}
                  rx="95"
                  ry="48"
                  fill="url(#daathAbyssGlow)"
                  opacity="0.75"
                />

                {/* 10 Spheres (Sephiroth / Qliphoth) + Daath */}
                <g className="spheres-group">
                  {Object.values(TREE_NODES).map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const isDaath = node.id === 0;

                    const sphereRadius = isDaath ? 34 : 44;
                    const strokeColor =
                      treeSide === 'night'
                        ? isSelected
                          ? '#f43f5e'
                          : isDaath
                          ? '#a855f7'
                          : '#9333ea'
                        : isSelected
                        ? '#10b981'
                        : isDaath
                        ? '#d97706'
                        : '#f59e0b';

                    const fillColor =
                      treeSide === 'night'
                        ? isDaath
                          ? '#1e1035'
                          : '#0f051d'
                        : isDaath
                        ? '#291b00'
                        : '#141416';

                    return (
                      <g
                        key={`node-${node.id}`}
                        onClick={() => handleSelectNode(node)}
                        className="cursor-pointer group"
                      >
                        {/* Outer Glow Halo */}
                        {isSelected && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={sphereRadius + 14}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            opacity="0.8"
                            className="animate-spin-slow"
                          />
                        )}

                        {/* Node Sphere Circle */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={sphereRadius}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth={isSelected ? '4' : '2'}
                          filter={treeSide === 'night' ? 'url(#nightGlow)' : 'url(#dayGlow)'}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />

                        {/* Center Glyph (Hebrew or Kemetic) */}
                        <text
                          x={node.x}
                          y={node.y - 4}
                          textAnchor="middle"
                          fill={treeSide === 'night' ? '#f3e8ff' : '#fef3c7'}
                          fontSize={isDaath ? '16' : '18'}
                          fontFamily="serif"
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          {node.dayHebrew}
                        </text>

                        {/* Title text */}
                        <text
                          x={node.x}
                          y={node.y + 14}
                          textAnchor="middle"
                          fill={treeSide === 'night' ? '#c084fc' : '#fbbf24'}
                          fontSize="9"
                          fontFamily="sans-serif"
                          fontWeight="bold"
                          letterSpacing="1"
                          pointerEvents="none"
                        >
                          {treeSide === 'night'
                            ? node.nightName.split(' ')[0]
                            : node.dayDivinity.toUpperCase()}
                        </text>

                        {/* Node Number Badge */}
                        <text
                          x={node.x}
                          y={node.y + 26}
                          textAnchor="middle"
                          fill="#71717a"
                          fontSize="8"
                          fontFamily="monospace"
                          pointerEvents="none"
                        >
                          {isDaath ? 'PYLON' : `NO. ${node.id}`}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Quick Pillar & Daath Guide Footer */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-neutral-500 border-t border-neutral-800/80 pt-3 px-2 mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" /> Left Pillar: Severity
            </span>
            <span className="flex items-center gap-1.5 text-purple-400 font-semibold cursor-pointer hover:underline" onClick={handleDaathFlip}>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Center: Pylon of Daäth (Click to Flip)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Right Pillar: Mercy
            </span>
          </div>
        </div>

        {/* Interactive Node & Tunnel Detail Drawer */}
        <div className="xl:col-span-5 2xl:col-span-4 glass-panel p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between min-h-[640px] shadow-2xl">
          <div>
            {/* Drawer Mode Tabs */}
            <div className="flex rounded-lg bg-neutral-900/80 p-1 border border-neutral-800 text-xs font-mono mb-5">
              <button
                onClick={() => setActiveTab('node')}
                className={`flex-1 py-1.5 rounded text-center transition-all ${
                  activeTab === 'node'
                    ? treeSide === 'night'
                      ? 'bg-purple-950 border border-purple-600 text-white font-bold'
                      : 'bg-amber-950 border border-amber-600 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {treeSide === 'night' ? 'Qlipha Sphere' : 'Sephira Sphere'}
              </button>
              <button
                onClick={() => setActiveTab('tunnel')}
                className={`flex-1 py-1.5 rounded text-center transition-all ${
                  activeTab === 'tunnel'
                    ? 'bg-purple-950 border border-purple-600 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Tunnel of Set
              </button>
            </div>

            {/* TAB 1: NODE / SPHERE CORRESPONDENCES */}
            {activeTab === 'node' && selectedNode && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-purple-400" />
                    {treeSide === 'night' ? 'Nightside Sphere' : 'Dayside Emanation'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 border border-neutral-700 text-neutral-300">
                    Pillar of {selectedNode.dayPillar}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-decorative text-2xl font-bold text-white">
                      {treeSide === 'night' ? selectedNode.nightName : selectedNode.dayName}
                    </h2>
                    <span className="font-serif text-2xl font-bold text-amber-400">
                      {selectedNode.dayHebrew}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-400 mt-1">
                    {treeSide === 'night'
                      ? `ArchDemon: ${selectedNode.nightDemon}`
                      : `Connolly Divinity: ${selectedNode.dayDivinity} (Egyptian: ${selectedNode.dayKemetic})`}
                  </p>
                </div>

                {/* Occult Grid Metrics */}
                <div className="grid grid-cols-2 gap-2.5 bg-black/60 p-3 rounded-xl border border-neutral-800 text-xs font-mono">
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
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-red-400" />
                      Key of {selectedNode.musicalKey}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">SONIC TEXTURE</span>
                    <span className="text-amber-300 capitalize">{selectedNode.keyModifier || 'Pure Harmonic'}</span>
                  </div>
                </div>

                {/* Liber 777 Correspondences Accordion */}
                <div className="flex flex-col gap-2 bg-neutral-950/70 p-3 rounded-xl border border-neutral-800/80 text-xs">
                  <span className="font-mono text-[11px] text-amber-400 font-semibold tracking-wider flex items-center gap-1.5">
                    <Gem className="w-3.5 h-3.5 text-amber-400" /> LIBER 777 CORRESPONDENCES
                  </span>
                  <div className="grid grid-cols-1 gap-1.5 font-mono text-[11px] text-neutral-300">
                    <div>
                      <strong className="text-neutral-500">Colors: </strong> {selectedNode.colors}
                    </div>
                    <div>
                      <strong className="text-neutral-500">Incense: </strong> {selectedNode.incense}
                    </div>
                    <div>
                      <strong className="text-neutral-500">Magical Tools: </strong> {selectedNode.tools}
                    </div>
                    <div>
                      <strong className="text-neutral-500">Sacred Gems: </strong> {selectedNode.gems}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
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

                <div className="grid grid-cols-2 gap-2.5 bg-black/60 p-3 rounded-xl border border-neutral-800 text-xs font-mono">
                  <div>
                    <span className="text-neutral-500 text-[10px] block">ATTRIBUTION</span>
                    <span className="text-neutral-200 font-semibold">{selectedTunnel.planet_element}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">GEMATRIA NUMBER</span>
                    <span className="text-purple-300 font-bold">{selectedTunnel.gematria}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">GRANT KEY</span>
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-red-400" />
                      Key of {selectedTunnel.musical_key}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">TEXTURE</span>
                    <span className="text-neutral-300 capitalize">{selectedTunnel.key_modifier || 'Pure Drone'}</span>
                  </div>
                </div>

                {/* Tunnel Lore Snippet */}
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40 text-xs font-sans text-neutral-300 leading-relaxed">
                  Sentinel of the {selectedTunnel.number}th Kala of the Nightside of Eden.
                  Corresponds to tarot trump <strong>{selectedTunnel.atu}</strong> and vibrates to the sonic pitch of note <strong className="text-red-400">{selectedTunnel.musical_key}</strong>.
                </div>
              </div>
            )}
          </div>

          {/* One-Click Action: TUNE TRANCE PORTAL */}
          <div className="pt-4 border-t border-neutral-800">
            {activeTab === 'node' && selectedNode && (
              <button
                onClick={() => handleTuneNodeToPortal(selectedNode)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-purple-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-serif text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                TUNE TRANCE PORTAL TO THIS SPHERE
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}

            {activeTab === 'tunnel' && selectedTunnel && (
              <button
                onClick={() => onTuneToTunnel(selectedTunnel)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-700 to-red-600 hover:from-purple-600 hover:to-red-500 text-white font-serif text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all"
              >
                <Zap className="w-4 h-4 text-purple-200" />
                TUNE TRANCE PORTAL TO TUNNEL {selectedTunnel.number}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualTreeViewer;
