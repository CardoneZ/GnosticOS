/**
 * GnosticOS — Chaos Magic Austin Osman Spare Sigil Engine
 *
 * Implements classical Austin Osman Spare word-reduction and geometric projection:
 *   1. Normalizes intent statement: capitalizes, strips punctuation, whitespace, and numbers.
 *   2. Removes all vowels (A, E, I, O, U, Y).
 *   3. Strips duplicate consonants while preserving first appearance order.
 *   4. Projects remaining unique letters onto selectable coordinate matrices:
 *      - Circle of 8 Winds (Algol Chaos Star / Chaosphere)
 *      - Planetary Kamea (Saturn 3x3 Magic Square)
 *      - Nine Demonic Divinities Matrix (Dukanté Cardinal Grid)
 *   5. Generates smooth Catmull-Rom / Bézier spline SVG paths with terminal embellishments
 *      (Spare circle start node, crossbar / arrow terminus).
 */

export type SigilMatrixType = 'circle_8_winds' | 'planetary_kamea' | 'nine_divinities';

export interface Point2D {
  x: number;
  y: number;
  letter: string;
}

export interface SigilProcessingResult {
  originalStatement: string;
  normalizedLetters: string[];
  vowelsRemoved: string[];
  uniqueConsonants: string[];
  points: Point2D[];
  svgPathData: string;
}

export interface SigilStyleOptions {
  strokeWidth: number;
  curveSmoothness: number; // 0 (straight lines) to 1 (full curves)
  colorTheme: 'crimson' | 'gold' | 'amethyst' | 'emerald';
  showNodes: boolean;
  showTerminus: boolean;
  glowIntensity: number;
}

/**
 * Classical Austin Osman Spare word reduction
 */
export function reduceStatementOfIntent(statement: string): {
  normalized: string[];
  noVowels: string[];
  uniqueConsonants: string[];
} {
  // 1. Normalize uppercase and keep A-Z only
  const clean = statement.toUpperCase().replace(/[^A-Z]/g, '');
  const normalized = clean.split('');

  // 2. Remove vowels (A, E, I, O, U, Y)
  const vowels = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);
  const noVowels = normalized.filter((char) => !vowels.has(char));

  // 3. Keep unique consonants in order of appearance
  const seen = new Set<string>();
  const uniqueConsonants: string[] = [];
  for (const c of noVowels) {
    if (!seen.has(c)) {
      seen.add(c);
      uniqueConsonants.push(c);
    }
  }

  return {
    normalized,
    noVowels,
    uniqueConsonants,
  };
}

/**
 * Coordinate Matrix Mappings
 */
export function getLetterCoordinates(
  letter: string,
  matrixType: SigilMatrixType,
  canvasSize = 500,
): Point2D {
  const center = canvasSize / 2;
  const radius = canvasSize * 0.38;
  const charCode = letter.charCodeAt(0) - 65; // A=0, B=1 ... Z=25

  if (matrixType === 'circle_8_winds') {
    // 8 Cardinal/Intercardinal spokes, distributed in 3 concentric rings
    const spoke = charCode % 8;
    const ring = Math.floor(charCode / 8); // 0, 1, 2, 3
    const angle = (spoke * (Math.PI * 2)) / 8 - Math.PI / 2;
    const r = radius * (0.35 + ring * 0.22);
    return {
      x: Math.round(center + r * Math.cos(angle)),
      y: Math.round(center + r * Math.sin(angle)),
      letter,
    };
  }

  if (matrixType === 'planetary_kamea') {
    // 3x3 Magic Square of Saturn (Grid indices 1 to 9, mapping charCode % 9)
    // Classical Saturn Kamea:
    // 4  9  2
    // 3  5  7
    // 8  1  6
    const saturnKamea = [
      [4, 9, 2],
      [3, 5, 7],
      [8, 1, 6],
    ];
    const targetVal = (charCode % 9) + 1;
    let gridX = 1;
    let gridY = 1;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (saturnKamea[r][c] === targetVal) {
          gridX = c;
          gridY = r;
        }
      }
    }
    const step = canvasSize / 4;
    return {
      x: Math.round(step * (gridX + 1)),
      y: Math.round(step * (gridY + 1)),
      letter,
    };
  }

  // matrixType === 'nine_divinities'
  // 3x3 cardinal grid correlating with the 9 Divinities
  const col = charCode % 3;
  const row = Math.floor((charCode % 9) / 3);
  const step = canvasSize / 4;
  // slight radial offset to prevent straight-line overlaps
  const jitter = ((charCode % 5) - 2) * 8;
  return {
    x: Math.round(step * (col + 1) + jitter),
    y: Math.round(step * (row + 1) + jitter),
    letter,
  };
}

/**
 * Generates an SVG path string from an array of coordinates.
 * Smooths path using cubic Bézier tangents based on curveSmoothness [0..1].
 */
export function buildSigilSvgPath(points: Point2D[], curveSmoothness = 0.5): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y} m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0`;
  }

  if (curveSmoothness <= 0.05) {
    // Sharp polyline
    return points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  }

  // Smooth Catmull-Rom to Cubic Bézier spline
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * curveSmoothness * 2;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * curveSmoothness * 2;

    const cp2x = p2.x - ((p3.x - p1.x) / 6) * curveSmoothness * 2;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * curveSmoothness * 2;

    d += ` C ${Math.round(cp1x)} ${Math.round(cp1y)}, ${Math.round(cp2x)} ${Math.round(cp2y)}, ${p2.x} ${p2.y}`;
  }

  return d;
}

export function generateSigil(
  intentStatement: string,
  matrixType: SigilMatrixType = 'circle_8_winds',
  curveSmoothness = 0.5,
  canvasSize = 500,
): SigilProcessingResult {
  const { normalized, noVowels, uniqueConsonants } = reduceStatementOfIntent(intentStatement);
  const points = uniqueConsonants.map((letter) =>
    getLetterCoordinates(letter, matrixType, canvasSize),
  );
  const svgPathData = buildSigilSvgPath(points, curveSmoothness);

  return {
    originalStatement: intentStatement,
    normalizedLetters: normalized,
    vowelsRemoved: noVowels,
    uniqueConsonants,
    points,
    svgPathData,
  };
}

export const SIGIL_THEMES = {
  crimson: {
    name: 'Obsidian Crimson',
    stroke: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.6)',
    nodeBg: '#7f1d1d',
    border: 'border-red-600',
  },
  gold: {
    name: 'Alchemical Gold',
    stroke: '#eab308',
    glow: 'rgba(234, 179, 8, 0.6)',
    nodeBg: '#713f12',
    border: 'border-amber-600',
  },
  amethyst: {
    name: 'Nightside Amethyst',
    stroke: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.6)',
    nodeBg: '#581c87',
    border: 'border-purple-600',
  },
  emerald: {
    name: 'Black Emerald',
    stroke: '#10b981',
    glow: 'rgba(16, 185, 129, 0.6)',
    nodeBg: '#064e3b',
    border: 'border-emerald-600',
  },
};
