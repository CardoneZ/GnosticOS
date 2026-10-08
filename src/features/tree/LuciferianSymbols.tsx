import React from 'react';

/**
 * GnosticOS — Authentic Luciferian & Left-Hand Path Sacred Glyphs
 *
 * Vector implementations of:
 *  1. Assembly of Light Bearers (ALB) Talisman (Michael W. Ford, "Apotheosis")
 *  2. Classical Sigil of Lucifer (Grimorium Verum / Italian Grimoires)
 *  3. Triad of the Morning Star (Liberation, Illumination, Apotheosis)
 */

interface GlyphProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

/**
 * Points for an 8-pointed star (Star of Ishtar / Venus), as an SVG polygon string.
 * Pure geometry, so it is exact rather than hand-approximated.
 */
export function ishtarStarPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  return Array.from({ length: 16 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 8;
    const r = i % 2 === 0 ? outerR : innerR;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');
}

/** 8-pointed Star of Ishtar / Venus — the Morning Star. */
export const IshtarStar: React.FC<GlyphProps> = ({ className = '', size = 64, glow = true }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'drop-shadow-[0_0_10px_rgba(212,175,55,0.45)]' : ''}`}
  >
    <polygon
      points={ishtarStarPoints(100, 100, 95, 42)}
      fill="none"
      stroke="#d4af37"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle cx="100" cy="100" r="10" fill="#d4af37" opacity="0.6" />
  </svg>
);

/**
 * Sigil of Lucifer (Grimorium Verum tradition).
 * NOTE: hand-drawn approximation from memory, not traced from a source scan.
 * Replace with a traced public-domain version for accuracy.
 */
export const LuciferSigil: React.FC<GlyphProps> = ({
  className = '',
  size = 64,
  glow = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]' : ''}`}
    >
      <defs>
        <filter id="luciferGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Top Crossbar */}
      <line x1="20" y1="20" x2="180" y2="20" stroke="#f87171" strokeWidth="6" strokeLinecap="round" />

      {/* Main Descending Chevron / V-Shape */}
      <polyline
        points="20,20 100,160 180,20"
        stroke="#ef4444"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left Intersecting Spear */}
      <line x1="35" y1="20" x2="135" y2="175" stroke="#ef4444" strokeWidth="5.5" strokeLinecap="round" />

      {/* Right Intersecting Spear */}
      <line x1="165" y1="20" x2="65" y2="175" stroke="#ef4444" strokeWidth="5.5" strokeLinecap="round" />

      {/* Horizontal Bar under the V intersection */}
      <line x1="55" y1="125" x2="145" y2="125" stroke="#f87171" strokeWidth="5" strokeLinecap="round" />

      {/* Inverted Triangle / Lower Apex */}
      <polygon
        points="100,160 82,192 118,192"
        fill="#991b1b"
        stroke="#f87171"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Bottom Central Finial Stem & Hook */}
      <line x1="100" y1="192" x2="100" y2="225" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
      <path
        d="M 100,225 C 92,235 80,230 78,218"
        stroke="#f87171"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left Curled Serpent Flourish */}
      <path
        d="M 68,175 C 50,195 40,210 50,225 C 60,235 72,225 65,210 C 60,200 70,185 82,192"
        stroke="#f87171"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Right Curled Serpent Flourish */}
      <path
        d="M 132,175 C 150,195 160,210 150,225 C 140,235 128,225 135,210 C 140,200 130,185 118,192"
        stroke="#f87171"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

/**
 * Assembly of Light Bearers (ALB) emblem.
 *
 * NOTE: approximation drawn from memory of the published emblem (Michael W. Ford).
 * Not traced from the original; geometry and details may differ.
 * Features:
 *  - Outer ring: "ASSEMBLY OF LIGHT BEARERS"
 *  - 4 Elemental Triangles & Four Pillars
 *  - 8-Pointed Star of Venus / Ishtar in crimson
 *  - Broken Chain of Liberation (left)
 *  - Blazing Torch of Illumination (right)
 *  - All-Seeing Eye of Horus/Set (Apotheosis) at center
 *  - Sigil of Lucifer at the lower star angle
 */
export const AlbTalisman: React.FC<GlyphProps> = ({
  className = '',
  size = 280,
  glow = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]' : ''}`}
    >
      <defs>
        {/* Curved Path for the Circular Title Text */}
        <path
          id="albTopPath"
          d="M 45,200 A 155,155 0 0,1 355,200"
          fill="none"
        />
        <path
          id="albBottomPath"
          d="M 355,200 A 155,155 0 0,1 45,200"
          fill="none"
        />
        <radialGradient id="albCoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#450a0a" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#1c0404" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#050101" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Deep Void Base */}
      <circle cx="200" cy="200" r="195" fill="#080305" stroke="#dc2626" strokeWidth="2.5" />

      {/* Outer Border Double Rings */}
      <circle cx="200" cy="200" r="190" fill="none" stroke="#fca5a5" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="160" fill="none" stroke="#f87171" strokeWidth="2" />
      <circle cx="200" cy="200" r="158" fill="url(#albCoreGlow)" />

      {/* Ring Text: ASSEMBLY OF LIGHT BEARERS */}
      <text
        fill="#fef2f2"
        fontSize="17"
        fontFamily="Cinzel, Georgia, serif"
        fontWeight="bold"
        letterSpacing="7"
      >
        <textPath href="#albTopPath" startOffset="50%" textAnchor="middle">
          ASSEMBLY OF LIGHT BEARERS
        </textPath>
      </text>

      {/* Four Cardinal / Quadrant Symbols on the Outer Rim */}
      {/* Top: Solar Cross ⊕ */}
      <g transform="translate(200, 24)">
        <circle cx="0" cy="0" r="10" fill="none" stroke="#fef2f2" strokeWidth="1.5" />
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#fef2f2" strokeWidth="1.5" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#fef2f2" strokeWidth="1.5" />
      </g>

      {/* Bottom: Inverted Water Triangle ∇ */}
      <g transform="translate(200, 376)">
        <polygon points="-9,-8 9,-8 0,9" fill="none" stroke="#fef2f2" strokeWidth="1.5" />
      </g>

      {/* Left: Earth / Air Triangle Symbol */}
      <g transform="translate(24, 200)">
        <polygon points="-8,8 8,8 0,-9" fill="none" stroke="#fef2f2" strokeWidth="1.5" />
        <line x1="-8" y1="-1" x2="8" y2="-1" stroke="#fef2f2" strokeWidth="1.5" />
      </g>

      {/* Right: Fire Triangle Δ */}
      <g transform="translate(376, 200)">
        <polygon points="-8,8 8,8 0,-9" fill="none" stroke="#fef2f2" strokeWidth="1.5" />
      </g>

      {/* Red 8-Pointed Star of Venus / Ishtar */}
      {/* Star 1: Cardinal Square (0, 90, 180, 270) rotated into 8-point star */}
      <polygon
        points="200,48 238,135 328,135 258,190 285,278 200,228 115,278 142,190 72,135 162,135"
        fill="#7f1d1d"
        fillOpacity="0.4"
        stroke="#ef4444"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Interlocking Inverted Star Point Framework */}
      <polygon
        points="200,352 162,265 72,265 142,210 115,122 200,172 285,122 258,210 328,265 238,265"
        fill="#7f1d1d"
        fillOpacity="0.4"
        stroke="#dc2626"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Left Symbol: Broken Chains of Liberation */}
      <g transform="translate(95, 155) rotate(-35)">
        <ellipse cx="-12" cy="0" rx="14" ry="7" fill="none" stroke="#ffffff" strokeWidth="3.5" />
        <ellipse cx="12" cy="0" rx="14" ry="7" fill="none" stroke="#ffffff" strokeWidth="3.5" />
        {/* Broken link jagged fracture */}
        <line x1="-3" y1="-5" x2="3" y2="-5" stroke="#ef4444" strokeWidth="3" strokeDasharray="2 2" />
        <line x1="-3" y1="5" x2="3" y2="5" stroke="#ef4444" strokeWidth="3" strokeDasharray="2 2" />
      </g>

      {/* Right Symbol: Blazing Torch of Illumination */}
      <g transform="translate(305, 155)">
        {/* Torch Handle */}
        <polygon points="-4,22 4,22 6,-6 -6,-6" fill="#a1a1aa" stroke="#f43f5e" strokeWidth="1.5" />
        <line x1="-7" y1="-6" x2="7" y2="-6" stroke="#f43f5e" strokeWidth="2.5" />
        {/* Flame */}
        <path
          d="M 0,-6 C -8,-16 -6,-28 0,-34 C 6,-28 8,-16 0,-6 Z"
          fill="#ef4444"
          stroke="#f59e0b"
          strokeWidth="1.5"
        />
        <path
          d="M 0,-10 C -4,-16 -3,-22 0,-26 C 3,-22 4,-16 0,-10 Z"
          fill="#fbbf24"
        />
      </g>

      {/* Center Circle: Ring of the Eye of Horus / Set */}
      <circle cx="200" cy="200" r="48" fill="#180404" stroke="#ef4444" strokeWidth="3" />
      <circle cx="200" cy="200" r="45" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />

      {/* Eye of Horus / Eye of Set (Apotheosis) */}
      <g transform="translate(200, 200)">
        {/* Eye contour */}
        <path
          d="M -30,-4 Q 0,-20 30,-4 Q 0,16 -30,-4 Z"
          fill="#1c1917"
          stroke="#f59e0b"
          strokeWidth="3"
        />
        {/* Iris & Pupil */}
        <circle cx="0" cy="-2" r="10" fill="#dc2626" />
        <circle cx="0" cy="-2" r="5" fill="#fef08a" />
        {/* Eyebrow */}
        <path
          d="M -32,-14 Q 0,-26 32,-12"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Falcon mark / spiral tail */}
        <path
          d="M 8,6 L 8,24"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
        />
        <path
          d="M -10,6 C -10,18 -22,20 -22,14 C -22,8 -14,10 -14,14"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
        />
      </g>

      {/* Lower Star Angle: Miniature Sigil of Lucifer */}
      <g transform="translate(200, 275) scale(0.28)">
        <line x1="-60" y1="-40" x2="60" y2="-40" stroke="#fca5a5" strokeWidth="5" />
        <polyline points="-60,-40 0,60 60,-40" stroke="#ef4444" strokeWidth="5" fill="none" />
        <line x1="-45" y1="-40" x2="35" y2="70" stroke="#ef4444" strokeWidth="4.5" />
        <line x1="45" y1="-40" x2="-35" y2="70" stroke="#ef4444" strokeWidth="4.5" />
        <polygon points="0,60 -15,85 15,85" fill="#991b1b" stroke="#fca5a5" strokeWidth="3" />
        <path d="M 0,85 L 0,105 C -8,112 -15,105 -12,98" stroke="#ef4444" strokeWidth="4" fill="none" />
      </g>
    </svg>
  );
};

/**
 * Azhdaha (Azhi Dahaka / The Great Dragon of Darkness & Awakening).
 * Persian Luciferian / Yatukih Draconian tradition (Michael W. Ford, Kenneth Grant).
 * Features:
 *  - Serpentine Coiled Dragon of the Black Flame
 *  - 7 Sacred Horns / Spikes of the ArchDaevas
 *  - Burning Emerald/Ruby Draconian Eye
 *  - Central Primordial Black Flame
 */
export const AzhdahaSymbol: React.FC<GlyphProps> = ({
  className = '',
  size = 180,
  glow = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'drop-shadow-[0_0_18px_rgba(220,38,38,0.55)]' : ''}`}
    >
      <defs>
        <radialGradient id="azhdahaFlameGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#7f1d1d" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0a0505" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dragonGoldRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>

      {/* Outer Ritual Circle with Draconian Runes / Ticks */}
      <circle cx="150" cy="150" r="140" stroke="#7f1d1d" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
      <circle cx="150" cy="150" r="132" stroke="#dc2626" strokeWidth="1.5" />
      <circle cx="150" cy="150" r="124" fill="url(#azhdahaFlameGlow)" />

      {/* Dragon Body: Ouroboros Coiling Arc */}
      <path
        d="M 150,26 C 220,26 270,78 270,148 C 270,218 218,270 148,270 C 80,270 30,218 30,150 C 30,95 68,52 118,34"
        stroke="url(#dragonGoldRed)"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Inner Coiling Serpent Body */}
      <path
        d="M 125,50 C 75,70 52,110 52,150 C 52,204 94,246 148,246 C 202,246 244,204 244,150 C 244,104 212,68 165,58"
        stroke="#450a0a"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Dragon Spine Spikes / 7 ArchDaeva Horns */}
      {[
        { x: 195, y: 35, angle: 25 },
        { x: 245, y: 80, angle: 60 },
        { x: 268, y: 140, angle: 95 },
        { x: 250, y: 205, angle: 135 },
        { x: 195, y: 260, angle: 175 },
        { x: 135, y: 268, angle: 215 },
        { x: 75, y: 240, angle: 250 },
      ].map((pt, i) => (
        <polygon
          key={i}
          points={`${pt.x},${pt.y - 12} ${pt.x - 7},${pt.y + 6} ${pt.x + 7},${pt.y + 6}`}
          fill="#ef4444"
          stroke="#f59e0b"
          strokeWidth="1.2"
          transform={`rotate(${pt.angle}, ${pt.x}, ${pt.y})`}
        />
      ))}

      {/* Dragon Head (at top left arc, poised to consume / crown) */}
      <g transform="translate(132, 34) rotate(-35)">
        {/* Upper Jaw & Snout */}
        <path
          d="M 0,0 L 28,-14 L 38,-4 L 16,8 Z"
          fill="#7f1d1d"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        {/* Horns */}
        <path
          d="M 4,-12 C 0,-26 -16,-34 -24,-36 C -18,-24 -10,-16 0,-10"
          fill="#dc2626"
          stroke="#fbbf24"
          strokeWidth="1.5"
        />
        <path
          d="M 12,-10 C 14,-22 8,-30 0,-34 C 4,-24 8,-16 10,-8"
          fill="#991b1b"
          stroke="#f59e0b"
          strokeWidth="1.2"
        />
        {/* Lower Jaw */}
        <path
          d="M 6,10 L 26,4 L 18,16 Z"
          fill="#450a0a"
          stroke="#dc2626"
          strokeWidth="1.8"
        />
        {/* Glowing Eye of Ahriman / Azhdaha */}
        <circle cx="16" cy="-4" r="3.5" fill="#fef08a" />
        <circle cx="16" cy="-4" r="1.5" fill="#000000" />
        {/* Serpent Tongue of Fire */}
        <path
          d="M 36,0 L 48,2 L 54,-4 M 48,2 L 54,8"
          stroke="#ef4444"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>

      {/* Center Black Flame of Illumination */}
      <g transform="translate(150, 150)">
        {/* Outer Flame Halo */}
        <path
          d="M 0,-50 C 22,-20 34,10 18,34 C 8,46 -8,46 -18,34 C -34,10 -22,-20 0,-50 Z"
          fill="#1c0505"
          stroke="#ef4444"
          strokeWidth="2.5"
        />
        {/* Mid Fire */}
        <path
          d="M 0,-36 C 14,-14 20,8 10,24 C 4,32 -4,32 -10,24 C -20,8 -14,-14 0,-36 Z"
          fill="#991b1b"
          stroke="#f59e0b"
          strokeWidth="1.8"
        />
        {/* Inner Phosphorus Core */}
        <path
          d="M 0,-22 C 8,-8 10,4 5,14 C 2,18 -2,18 -5,14 C -10,4 -8,-8 0,-22 Z"
          fill="#fef08a"
        />
      </g>

      {/* Seven-Fold Inverted Pentacle Star within the belly */}
      <polygon
        points="150,116 158,138 180,140 162,154 168,175 150,162 132,175 138,154 120,140 142,138"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="1.2"
        opacity="0.8"
      />
    </svg>
  );
};

/**
 * Will, Desire, and Belief Triad (Luciferian Illumination & Zos Kia Cultus).
 * Represents the 3 engines of Apotheosis:
 *  1. WILL (Thelema / Phosphorus) - Crown of Direction
 *  2. DESIRE (Eros / Daemon Fire) - Passion of Creation
 *  3. BELIEF (Kia / Flesh / Void) - Subconscious Incarnation
 */
export const WillDesireBeliefSymbol: React.FC<GlyphProps> = ({
  className = '',
  size = 200,
  glow = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]' : ''}`}
    >
      <defs>
        <radialGradient id="triadGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#78350f" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#1e1b4b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="150" cy="150" r="140" fill="url(#triadGlow)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
      <circle cx="150" cy="150" r="132" stroke="#dc2626" strokeWidth="2" />

      {/* The Equilateral Trine of Illumination */}
      <polygon
        points="150,45 240,215 60,215"
        fill="#180404"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Interlocking Inverted Triangle (Union of Opposites / Solve et Coagula) */}
      <polygon
        points="150,225 240,75 60,75"
        fill="none"
        stroke="#9333ea"
        strokeWidth="1.8"
        strokeDasharray="4 4"
      />

      {/* APEX: WILL (Top Node - Phosphorus / Sun) */}
      <g transform="translate(150, 45)">
        <circle cx="0" cy="0" r="22" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
        {/* Crown of Will */}
        <polygon points="-8,4 0,-12 8,4 0,0" fill="#fbbf24" />
        <circle cx="0" cy="0" r="4" fill="#ffffff" />
        <text x="0" y="-28" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="Cinzel, serif" fontWeight="bold" letterSpacing="2">
          WILL
        </text>
      </g>

      {/* RIGHT NODE: DESIRE (Flame / Dionysian Energy) */}
      <g transform="translate(240, 215)">
        <circle cx="0" cy="0" r="22" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
        {/* Flame of Desire */}
        <path d="M 0,-10 C -6,-2 0,6 0,8 C 0,6 6,-2 0,-10 Z" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />
        <text x="18" y="24" textAnchor="start" fill="#f87171" fontSize="11" fontFamily="Cinzel, serif" fontWeight="bold" letterSpacing="2">
          DESIRE
        </text>
      </g>

      {/* LEFT NODE: BELIEF (The Flesh / Subconscious Kia) */}
      <g transform="translate(60, 215)">
        <circle cx="0" cy="0" r="22" fill="#2e1065" stroke="#a855f7" strokeWidth="2" />
        {/* Eye of Belief / Subconscious Gateway */}
        <ellipse cx="0" cy="0" rx="9" ry="5" fill="none" stroke="#d8b4fe" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="3" fill="#e9d5ff" />
        <text x="-18" y="24" textAnchor="end" fill="#c084fc" fontSize="11" fontFamily="Cinzel, serif" fontWeight="bold" letterSpacing="2">
          BELIEF
        </text>
      </g>

      {/* Center 8-pointed Morning Star of Illumination */}
      <g transform="translate(150, 150)">
        <polygon
          points={ishtarStarPoints(0, 0, 36, 15)}
          fill="#b45309"
          stroke="#fbbf24"
          strokeWidth="2"
        />
        <circle cx="0" cy="0" r="6" fill="#fef08a" />
        <text y="48" textAnchor="middle" fill="#fef3c7" fontSize="10" fontFamily="monospace" letterSpacing="3">
          ILLUMINATION
        </text>
      </g>
    </svg>
  );
};

