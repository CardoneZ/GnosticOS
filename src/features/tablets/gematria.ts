/**
 * GnosticOS — 9x9 Magickal Tablet Generator (Connolly-style Gematria Engine)
 *
 * Pure, deterministic, side-effect-free. Same input + cipher + options ⇒ same tablet.
 *
 * CIPHER: S. Connolly "The Complete Book of Demonolatry" (pages 271–272, 290)
 * Dual values (T & Z): Primary (9) if initial or capitalized letter; Secondary (3) inside a word.
 *
 * LAYOUT: The cross + elemental-quadrant layout below ("GnosticOS layout v1")
 * is a documented, versioned convention. Persist `layoutVersion` with every saved tablet.
 */

export type Letter =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

export type LetterValue = number | { primary: number; secondary: number };

export type Cipher = Readonly<Record<Letter, LetterValue>>;

export interface CipherDefinition {
  id: string;
  name: string;
  values: Cipher;
}

export interface LetterContext {
  isInitial?: boolean;
  isCapitalized?: boolean;
  isInsideWord?: boolean;
}

export function resolveLetterValue(
  val: LetterValue | undefined,
  ctx?: LetterContext,
): number | undefined {
  if (val === undefined) return undefined;
  if (typeof val === 'number') return val;
  // Dual value { primary: 9, secondary: 3 }
  if (ctx?.isInitial || ctx?.isCapitalized) {
    return val.primary;
  }
  if (ctx?.isInsideWord) {
    return val.secondary;
  }
  return val.primary;
}

/**
 * Official S. Connolly Gematria Cipher (A–Z)
 * Source: "The Complete Book of Demonolatry" (pages 271–272, 290)
 */
export const CONNOLLY_CIPHER: CipherDefinition = {
  id: 'connolly-v1',
  name: 'Connolly Demonolatry Gematria',
  values: {
    A: 6,
    B: 5,
    C: 300,
    D: 4,
    E: 10,
    F: 3,
    G: 8,
    H: 1,
    I: 60,
    J: 60,
    K: 300,
    L: 8,
    M: 90,
    N: 50,
    O: 30,
    P: 9,
    Q: 40,
    R: 100,
    S: 7,
    T: { primary: 9, secondary: 3 },
    U: 70,
    V: 70,
    W: 70,
    X: 400,
    Y: 60,
    Z: { primary: 9, secondary: 3 },
  },
};

export const ENGLISH_ORDINAL: CipherDefinition = {
  id: 'english-ordinal',
  name: 'English Ordinal (A=1 … Z=26)',
  values: Object.fromEntries(
    Array.from({ length: 26 }, (_, i) => [String.fromCharCode(65 + i), i + 1]),
  ) as Cipher,
};

export function isCompleteCipher(c: CipherDefinition): boolean {
  return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i) as Letter).every(
    (l) => c.values[l] !== undefined,
  );
}

// -----------------------------------------------------------------------------
// Sephirothic rulership (Connolly's Nine Divinities on the Tree)
// -----------------------------------------------------------------------------
export interface SephiraInfo {
  number: number | 'daath';
  name: string;
  divinity: string;
}

export const SEPHIROTH: Record<number, SephiraInfo> = {
  1: { number: 1, name: 'Kether', divinity: 'Satan' },
  2: { number: 2, name: 'Chokmah', divinity: 'Lucifer' },
  3: { number: 3, name: 'Binah', divinity: 'Unsere' },
  4: { number: 4, name: 'Chesed', divinity: 'Verrine' },
  5: { number: 5, name: 'Geburah', divinity: 'Leviathan' },
  6: { number: 6, name: 'Tiphereth', divinity: 'Belial' },
  7: { number: 7, name: 'Netzach', divinity: 'Amducious' },
  8: { number: 8, name: 'Hod', divinity: 'Eurynomous' },
  9: { number: 9, name: 'Yesod', divinity: 'Flereous' },
  10: { number: 10, name: 'Malkuth', divinity: 'The Self' },
};
export const DAATH: SephiraInfo = { number: 'daath', name: 'Daath', divinity: 'Lucifuge Rofocale' };

// -----------------------------------------------------------------------------
// Gematria
// -----------------------------------------------------------------------------
export interface GematriaOptions {
  /** 'throw' (default) refuses unmapped letters; 'skip' ignores them. */
  onUnknown?: 'throw' | 'skip';
}

export interface AnalyzedLetter {
  char: Letter;
  rawChar: string;
  value: number;
  isInitial: boolean;
  isInsideWord: boolean;
  isCapitalized: boolean;
}

export interface GematriaResult {
  normalized: string;
  letters: ReadonlyArray<AnalyzedLetter>;
  skipped: string[];
  total: number;
  /** e.g. 1054 → [1054, 10, 1] */
  reductionChain: number[];
  primaryReduction: number;
  root: number;
  rulingSephira: SephiraInfo;
  /** Sephiroth touched by intermediate reductions (10 → Malkuth, 11 → Daath). */
  resonances: SephiraInfo[];
}

/** Uppercase, strip diacritics, keep A–Z only. */
export function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

export function digitSum(n: number): number {
  let s = 0;
  for (let x = Math.abs(Math.trunc(n)); x > 0; x = Math.floor(x / 10)) s += x % 10;
  return s;
}

export function reductionChain(n: number): number[] {
  if (!Number.isInteger(n) || n <= 0) throw new RangeError(`Cannot reduce ${n}`);
  const chain = [n];
  while (chain[chain.length - 1] > 9) chain.push(digitSum(chain[chain.length - 1]));
  return chain;
}

/**
 * Tokenize input and compute gematria with Connolly's dual-value rules.
 */
export function computeGematria(
  input: string,
  cipher: CipherDefinition = CONNOLLY_CIPHER,
  { onUnknown = 'throw' }: GematriaOptions = {},
): GematriaResult {
  const cleaned = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Extract word tokens to accurately detect initial vs inside-word positions
  const wordTokens = cleaned.match(/[A-Za-z]+/g) || [];
  if (wordTokens.length === 0) throw new Error('Input contains no A–Z letters.');

  const letters: AnalyzedLetter[] = [];
  const skipped: string[] = [];
  let normalizedStr = '';

  for (const word of wordTokens) {
    const isAllUpper = word.length > 1 && word === word.toUpperCase();
    for (let i = 0; i < word.length; i++) {
      const rawChar = word[i];
      const upperChar = rawChar.toUpperCase() as Letter;
      if (!/[A-Z]/.test(upperChar)) continue;

      const isInitial = i === 0;
      const isInsideWord = i > 0;
      // Capitalized: either explicitly uppercase in mixed/lowercase word, or initial
      const isCapitalized = isInitial || (!isAllUpper && rawChar === rawChar.toUpperCase());

      const rawVal = cipher.values[upperChar];
      if (rawVal === undefined) {
        if (onUnknown === 'throw') {
          throw new Error(`Cipher "${cipher.id}" has no value for "${upperChar}".`);
        }
        skipped.push(upperChar);
        continue;
      }

      const value = resolveLetterValue(rawVal, { isInitial, isInsideWord, isCapitalized }) ?? 0;

      letters.push({
        char: upperChar,
        rawChar,
        value,
        isInitial,
        isInsideWord,
        isCapitalized,
      });
      normalizedStr += upperChar;
    }
  }

  const total = letters.reduce((a, l) => a + l.value, 0);
  if (total <= 0) throw new Error('Gematria total is zero — nothing to reduce.');

  const chain = reductionChain(total);
  const root = chain[chain.length - 1];
  const resonances: SephiraInfo[] = [];
  for (const step of chain.slice(1, -1)) {
    if (step === 10) resonances.push(SEPHIROTH[10]);
    if (step === 11) resonances.push(DAATH);
  }

  return {
    normalized: normalizedStr,
    letters,
    skipped,
    total,
    reductionChain: chain,
    primaryReduction: chain[1] ?? total,
    root,
    rulingSephira: SEPHIROTH[root],
    resonances,
  };
}

// -----------------------------------------------------------------------------
// 9x9 Tablet
// -----------------------------------------------------------------------------
export type TabletElement = 'air' | 'fire' | 'water' | 'earth';
export type Quadrant = 'NW' | 'NE' | 'SW' | 'SE';
export type CellRole = 'center' | 'cross-row' | 'cross-col' | 'quadrant';

export interface TabletCell {
  row: number;
  col: number;
  char: Letter;
  value: number | null;
  role: CellRole;
  element?: TabletElement;
  /** 0-based positions in the sigil path that visit this cell. */
  sigilSteps: number[];
}

export interface TabletOptions extends GematriaOptions {
  cipher?: CipherDefinition;
  /** Configurable convention; default follows Connolly's circle (E=Air, S=Fire, W=Water, N=Earth) rotated onto intercardinals. */
  quadrantElements?: Record<Quadrant, TabletElement>;
}

export interface Tablet {
  layoutVersion: 1;
  cipherId: string;
  gematria: GematriaResult;
  /** Exactly 9 letters laid along both arms of the equal-armed cross. */
  crossSequence: Letter[];
  /** Letters that did not fit on the cross (still present in quadrants). */
  crossOverflow: Letter[];
  cells: TabletCell[][];           // [row][col], 9x9
  matrix: Letter[][];              // JSON-ready for gematria_tablets.matrix_data
  flat: string;                    // 81 characters, row-major
  rowSums: number[];
  colSums: number[];
  sigilPath: Array<{ row: number; col: number; char: Letter }>;
  unplacedLetters: Letter[];
}

const N = 9;
const MID = 4;

const DEFAULT_QUADRANTS: Record<Quadrant, TabletElement> = {
  NE: 'air', SE: 'fire', SW: 'water', NW: 'earth',
};

const QUADRANT_ORIGIN: Record<Quadrant, [number, number]> = {
  NW: [0, 0], NE: [0, 5], SW: [5, 0], SE: [5, 5],
};

function dedupe<T>(xs: T[]): T[] {
  return xs.filter((x, i) => xs.indexOf(x) === i);
}

function rotate<T>(xs: T[], k: number): T[] {
  if (xs.length === 0) return xs;
  const s = ((k % xs.length) + xs.length) % xs.length;
  return xs.slice(s).concat(xs.slice(0, s));
}

/**
 * Fit a name to exactly 9 cross cells:
 *  - length 9      → as-is
 *  - length > 9    → remove repeated letters (classic sigil reduction); if still > 9, truncate
 *  - length < 9    → centre the name and pad cyclically on both sides
 */
function fitToNine(letters: Letter[]): { seq: Letter[]; overflow: Letter[] } {
  let base = letters;
  if (base.length > N) base = dedupe(base);
  if (base.length >= N) return { seq: base.slice(0, N), overflow: base.slice(N) };
  const len = base.length;
  const offset = Math.floor((N - len) / 2);
  return { seq: Array.from({ length: N }, (_, i) => base[(((i - offset) % len) + len) % len]), overflow: [] };
}

/** Element-specific permutation of the source letters for each quadrant. */
function quadrantSequence(el: TabletElement, letters: Letter[], total: number, root: number): Letter[] {
  switch (el) {
    case 'air':   return letters;                                    // as spoken
    case 'fire':  return [...letters].reverse();                     // inverted
    case 'water': return rotate(letters, total);                     // flowed by the number
    case 'earth': return rotate([...letters].reverse(), root);       // inverted & grounded
  }
}

const chebyshev = (a: [number, number], b: [number, number]) =>
  Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));

export function generateTablet(input: string, options: TabletOptions = {}): Tablet {
  const cipher = options.cipher ?? CONNOLLY_CIPHER;
  const gematria = computeGematria(input, cipher, options);
  const quadrants = options.quadrantElements ?? DEFAULT_QUADRANTS;
  const letters = gematria.letters.map((l) => l.char);

  const valueOf = (c: Letter) => {
    const raw = cipher.values[c];
    if (raw === undefined) return null;
    return typeof raw === 'number' ? raw : raw.secondary;
  };

  const { seq, overflow } = fitToNine(letters);

  const grid: (TabletCell | null)[][] = Array.from({ length: N }, () => Array<TabletCell | null>(N).fill(null));
  const put = (row: number, col: number, char: Letter, role: CellRole, element?: TabletElement) => {
    grid[row][col] = { row, col, char, value: valueOf(char), role, element, sigilSteps: [] };
  };

  // 1. Equal-armed cross — both arms share the centre letter seq[4].
  for (let i = 0; i < N; i++) {
    if (i === MID) continue;
    put(MID, i, seq[i], 'cross-row');
    put(i, MID, seq[i], 'cross-col');
  }
  put(MID, MID, seq[MID], 'center');

  // 2. Elemental quadrants (4x4 each), filled row-major from the corner touching the centre outward.
  (Object.keys(QUADRANT_ORIGIN) as Quadrant[]).forEach((q) => {
    const el = quadrants[q];
    const src = quadrantSequence(el, letters, gematria.total, gematria.root);
    const [r0, c0] = QUADRANT_ORIGIN[q];
    const rows = q.startsWith('N') ? [3, 2, 1, 0] : [0, 1, 2, 3];
    const cols = q.endsWith('W') ? [3, 2, 1, 0] : [0, 1, 2, 3];
    let k = 0;
    for (const dr of rows) for (const dc of cols) put(r0 + dr, c0 + dc, src[k++ % src.length], 'quadrant', el);
  });

  const cells = grid as TabletCell[][];

  // 3. Sigil path: trace the name letter-by-letter, stepping to the nearest cell
  const sigilPath: Tablet['sigilPath'] = [];
  const unplaced: Letter[] = [];
  let pos: [number, number] = [MID, MID];
  const pathLetters = letters.filter((c, i) => i === 0 || c !== letters[i - 1]);
  pathLetters.forEach((ch) => {
    let best: TabletCell | null = null;
    let bestD = Infinity;
    for (const row of cells) {
      for (const cell of row) {
        if (cell.char !== ch) continue;
        const d = chebyshev(pos, [cell.row, cell.col]);
        if (d < bestD) { best = cell; bestD = d; }
      }
    }
    if (!best) { unplaced.push(ch); return; }
    best.sigilSteps.push(sigilPath.length);
    sigilPath.push({ row: best.row, col: best.col, char: ch });
    pos = [best.row, best.col];
  });

  const matrix = cells.map((r) => r.map((c) => c.char));
  const num = (c: TabletCell) => c.value ?? 0;

  return {
    layoutVersion: 1,
    cipherId: cipher.id,
    gematria,
    crossSequence: seq,
    crossOverflow: overflow,
    cells,
    matrix,
    flat: matrix.map((r) => r.join('')).join(''),
    rowSums: cells.map((r) => r.reduce((a, c) => a + num(c), 0)),
    colSums: Array.from({ length: N }, (_, j) => cells.reduce((a, r) => a + num(r[j]), 0)),
    sigilPath,
    unplacedLetters: unplaced,
  };
}
