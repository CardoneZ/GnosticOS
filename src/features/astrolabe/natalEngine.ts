/**
 * GnosticOS — Esoteric Natal Engine & Currents Calculator
 *
 * Implements rigorous esoteric calculations across:
 *  1. Numerology & Gematria (Life Path, Master Numbers, Shadow Qliphothic inversion)
 *  2. Tarot Birth Cards (Crowley Thoth Major Arcana, Atu Hebrew Letter, Liber 777 Godforms)
 *  3. Nightside Tunnels of Set (Liber 231 / Kenneth Grant Shadow Inversion)
 *  4. Astrological Decanates & 72 Goetic Quinances (Mathers & Crowley Zodiacal Demonic Rulers)
 *  5. Dukanté Demonic Elemental Family (S. Connolly Demonolatry)
 *  6. Alchemical Correspondences (Planet, Metal, Incense, Altar Candle, Tarot Minor Arcana)
 */

export interface NatalCalculationResult {
  // Input Echo
  birthDate: {
    year: number;
    month: number;
    day: number;
    raw: string;
  };
  name?: string;

  // 1. Numerology
  lifePath: number;
  isMasterNumber: boolean;
  masterTitle?: string;
  birthdayNumber: number;
  shadowNumber: number; // 11 - lifePath or Thaumiel mirror
  destinyNumber?: number; // From name gematria
  soulUrgeNumber?: number; // From name vowels

  // 2. Tarot Birth Card & Crowley Thoth Correspondence
  tarotBirthCard: {
    number: number;
    name: string;
    crowleyTitle: string;
    hebrewLetter: string;
    pathNumber: number;
    treeDescription: string;
    liber777Godform: string;
    meaning: string;
    shadowWarning: string;
  };
  tarotSecondaryCard?: {
    number: number;
    name: string;
    crowleyTitle: string;
  };

  // 3. Nightside Qliphothic Counterpart (Liber 231 / Grant)
  qliphothTunnel: {
    tunnelNumber: number;
    guardian: string;
    hebrewAtu: string;
    meaning: string;
    sentinelPath: string;
    shadowGnosis: string;
  };

  // 4. Astrological Decan & 72 Goetic Quinance Rulers
  zodiacSign: {
    name: string;
    symbol: string;
    element: 'fire' | 'water' | 'air' | 'earth';
    modality: 'Cardinal' | 'Fixed' | 'Mutable';
    rulingPlanet: string;
    decan: 1 | 2 | 3;
    decanDegreeRange: string;
    subRuler: string;
    tarotMinorCard: string;
  };

  // 5. Patron Goetic Spirits (Mathers-Crowley Zodiac Wheel)
  goeticPatrons: {
    daySpirit: {
      number: number;
      name: string;
      rank: string;
      enn: string;
      office: string;
    };
    nightSpirit: {
      number: number;
      name: string;
      rank: string;
      enn: string;
      office: string;
    };
  };

  // 6. Connolly Demonolatry Dukanté Family
  dukanteFamily: {
    familyNumber: number;
    familyName: string;
    element: string;
    demonicPatron: string;
    direction: string;
    philosophicalFocus: string;
  };

  // 7. Alchemical Correspondences
  alchemical: {
    metal: string;
    incense: string;
    candleColor: string;
    stone: string;
    musicalKey: string;
    frequencyHz: number;
  };
}

// =============================================================================
// NUMEROLOGY UTILITIES
// =============================================================================

function reduceDigits(num: number, preserveMaster = true): number {
  if (preserveMaster && (num === 11 || num === 22 || num === 33)) {
    return num;
  }
  let sum = num;
  while (sum > 9) {
    if (preserveMaster && (sum === 11 || sum === 22 || sum === 33)) {
      return sum;
    }
    sum = String(sum)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
}

export function calculateLifePath(year: number, month: number, day: number): {
  lifePath: number;
  isMaster: boolean;
  masterTitle?: string;
} {
  const m = reduceDigits(month, false);
  const d = reduceDigits(day, false);
  const y = reduceDigits(year, false);

  const rawSum = m + d + y;
  const lifePath = reduceDigits(rawSum, true);

  const isMaster = lifePath === 11 || lifePath === 22 || lifePath === 33;
  let masterTitle: string | undefined;
  if (lifePath === 11) masterTitle = 'The Illuminator / Visionary Magus (11 - Light in Darkness)';
  if (lifePath === 22) masterTitle = 'The Master Architect / Sovereign Demiurge (22 Paths)';
  if (lifePath === 33) masterTitle = 'The Avatar of Transmutation / Black Sun Master (33 Vertebrae)';

  return { lifePath, isMaster, masterTitle };
}

// Chaldean / Pythagorean Letter Values
const PYTHAGOREAN_MAP: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

export function calculateNameGematria(name: string): {
  destiny: number;
  soulUrge: number;
} {
  const clean = name.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return { destiny: 0, soulUrge: 0 };

  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);

  let totalSum = 0;
  let vowelSum = 0;

  for (const char of clean) {
    const val = PYTHAGOREAN_MAP[char] || 0;
    totalSum += val;
    if (vowels.has(char)) {
      vowelSum += val;
    }
  }

  return {
    destiny: reduceDigits(totalSum, true),
    soulUrge: reduceDigits(vowelSum, true),
  };
}

// =============================================================================
// CROWLEY THOTH TAROT & LIBER 777 CORRESPONDENCES
// =============================================================================

export interface TarotMajorData {
  number: number;
  name: string;
  crowleyTitle: string;
  hebrewLetter: string;
  pathNumber: number;
  treeDescription: string;
  liber777Godform: string;
  meaning: string;
  shadowWarning: string;
  tunnelNumber: number;
  tunnelGuardian: string;
  tunnelMeaning: string;
}

export const THOTH_MAJOR_ARCANA: Record<number, TarotMajorData> = {
  1: {
    number: 1,
    name: 'The Magician',
    crowleyTitle: 'The Magus (Atu I)',
    hebrewLetter: 'Beth (ב)',
    pathNumber: 12,
    treeDescription: 'Kether to Binah (The Crown to Understanding)',
    liber777Godform: 'Thoth / Hermes Trismegistus / Mercury',
    meaning: 'Direct transmission of divine will into form. Master of elements, communication, and focused manifestation.',
    shadowWarning: 'Deception, intellectual arrogance, manipulation, words without grounded reality.',
    tunnelNumber: 12,
    tunnelGuardian: 'Baratchial',
    tunnelMeaning: 'The Lightning of Illusion & Mercurial Sorcery',
  },
  2: {
    number: 2,
    name: 'The High Priestess',
    crowleyTitle: 'The Priestess (Atu II)',
    hebrewLetter: 'Gimel (ג)',
    pathNumber: 13,
    treeDescription: 'Kether to Tiphereth (Crossing the Abyss)',
    liber777Godform: 'Isis / Artemis / Diana / Moon',
    meaning: 'Unveiled gnosis, intuitive sanctuary, memory of cosmic origins, and the silver bridge across the abyss.',
    shadowWarning: 'Cold withdrawal, obsession with secrets, emotional detachment, paralysis by mystery.',
    tunnelNumber: 13,
    tunnelGuardian: 'Gargophias',
    tunnelMeaning: 'The Lemurian Scribe & Priestess of the Dark Abyss',
  },
  3: {
    number: 3,
    name: 'The Empress',
    crowleyTitle: 'The Empress (Atu III)',
    hebrewLetter: 'Daleth (ד)',
    pathNumber: 14,
    treeDescription: 'Chokmah to Binah (Wisdom to Understanding)',
    liber777Godform: 'Aphrodite / Hathor / Venus',
    meaning: 'Creative gestation, sensual sovereignty, nature as living magick, and boundless abundance of the womb.',
    shadowWarning: 'Smothering possessiveness, stagnation, self-indulgent decadence, creative blockage.',
    tunnelNumber: 14,
    tunnelGuardian: 'Dagdagiel',
    tunnelMeaning: 'The Venusian Siren & Mistress of the Deep Waters',
  },
  4: {
    number: 4,
    name: 'The Emperor',
    crowleyTitle: 'The Emperor (Atu IV)',
    hebrewLetter: 'Tzaddi (צ) in Crowley / Heh (ה)',
    pathNumber: 15,
    treeDescription: 'Chokmah to Tiphereth',
    liber777Godform: 'Amon-Ra / Mars / Aries',
    meaning: 'Sovereign authority, establishment of esoteric law, defensive mastery, and unshakeable willpower.',
    shadowWarning: 'Tyranny, rigid dogmatism, fear of chaos, suppression of vulnerability.',
    tunnelNumber: 15,
    tunnelGuardian: 'Hemethterith',
    tunnelMeaning: 'The Horned Despot & Sentinel of Fiery Will',
  },
  5: {
    number: 5,
    name: 'The Hierophant',
    crowleyTitle: 'The Hierophant (Atu V)',
    hebrewLetter: 'Vau (ו)',
    pathNumber: 16,
    treeDescription: 'Chokmah to Chesed',
    liber777Godform: 'Osiris / Apis / Taurus',
    meaning: 'Initiatic teacher, inner guru, lineage of the mysteries, and the spoken pentagram of truth.',
    shadowWarning: 'Blind orthodoxy, hypocritical dogma, enslavement to external gurus, intellectual inertia.',
    tunnelNumber: 16,
    tunnelGuardian: 'Uriens',
    tunnelMeaning: 'The Dark Hierophant & Breaker of False Initiations',
  },
  6: {
    number: 6,
    name: 'The Lovers',
    crowleyTitle: 'The Lovers (Atu VI)',
    hebrewLetter: 'Zain (ז)',
    pathNumber: 17,
    treeDescription: 'Binah to Tiphereth',
    liber777Godform: 'Castor & Pollux / Gemini / Solve et Coagula',
    meaning: 'The Royal Marriage of Opposites. Discrimination of values, sacred polarity, and alchemical synthesis.',
    shadowWarning: 'Indecision, inner schism, conflicting desires that tear the will apart, codependency.',
    tunnelNumber: 17,
    tunnelGuardian: 'Zamradiel',
    tunnelMeaning: 'The Clashing Blades & Dual Vampiric Gate',
  },
  7: {
    number: 7,
    name: 'The Chariot',
    crowleyTitle: 'The Chariot (Atu VII)',
    hebrewLetter: 'Cheth (ח)',
    pathNumber: 18,
    treeDescription: 'Binah to Geburah',
    liber777Godform: 'Horus / Apollo / Cancer',
    meaning: 'Victorious containment of the Grail. Moving triumphantly through opposing currents under the armor of light.',
    shadowWarning: 'Brittle defensiveness, ruthlessness, refusal to heal, inner emotional starvation.',
    tunnelNumber: 18,
    tunnelGuardian: 'Characith',
    tunnelMeaning: 'The Amber Car & Sentinel of Shells',
  },
  8: {
    number: 8,
    name: 'Strength / Justice',
    crowleyTitle: 'Adjustment (Atu VIII)',
    hebrewLetter: 'Lamed (ל)',
    pathNumber: 22,
    treeDescription: 'Geburah to Tiphereth',
    liber777Godform: 'Ma\'at / Themis / Libra',
    meaning: 'The poise of the dancing balance. Karma as instantaneous equilibrium. Truth stripped of sentimentality.',
    shadowWarning: 'Obsessive fault-finding, self-flagellation, cold intellectual cruelty, indecisive scales.',
    tunnelNumber: 22,
    tunnelGuardian: 'Qulielfi',
    tunnelMeaning: 'The Nightside Scales & Lord of Inverted Karma',
  },
  9: {
    number: 9,
    name: 'The Hermit',
    crowleyTitle: 'The Hermit (Atu IX)',
    hebrewLetter: 'Yod (י)',
    pathNumber: 20,
    treeDescription: 'Chesed to Tiphereth',
    liber777Godform: 'Anubis / Hermes Chthonios / Virgo',
    meaning: 'The solitary lantern in the dark abyss. Gnosis found through deep inner retreat, wisdom of the seed.',
    shadowWarning: 'Misanthropic isolation, hoarding of knowledge, refusal to participate in the living world.',
    tunnelNumber: 20,
    tunnelGuardian: 'Kurgasiax',
    tunnelMeaning: 'The Hidden Vulture & Sentinel of Crypt Gnosis',
  },
};

// Fill remaining majors 10..22 for complete 22-card mapping
export function getTarotMajor(cardNum: number): TarotMajorData {
  const norm = ((cardNum - 1) % 22) + 1;
  if (THOTH_MAJOR_ARCANA[norm]) return THOTH_MAJOR_ARCANA[norm];

  // Extended fallbacks
  const names: Record<number, { name: string; title: string; letter: string; path: number; desc: string; god: string; tunG: string }> = {
    10: { name: 'Wheel of Fortune', title: 'Fortune (Atu X)', letter: 'Kaph (כ)', path: 21, desc: 'Chesed to Netzach', god: 'Sphinx / Jupiter', tunG: 'Raflifu' },
    11: { name: 'Justice / Lust', title: 'Lust (Atu XI)', letter: 'Teth (ט)', path: 19, desc: 'Chesed to Geburah', god: 'Babalon & The Beast / Leo', tunG: 'Temphioth' },
    12: { name: 'The Hanged Man', title: 'The Hanged Man (Atu XII)', letter: 'Mem (מ)', path: 23, desc: 'Geburah to Hod', god: 'Poseidon / Water', tunG: 'Miamphi' },
    13: { name: 'Death', title: 'Death (Atu XIII)', letter: 'Nun (נ)', path: 24, desc: 'Tiphereth to Netzach', god: 'Typhon / Scorpio', tunG: 'Niantiel' },
    14: { name: 'Temperance', title: 'Art (Atu XIV)', letter: 'Samekh (ס)', path: 25, desc: 'Tiphereth to Yesod', god: 'Chiron / Sagittarius', tunG: 'Saksaksalim' },
    15: { name: 'The Devil', title: 'The Devil (Atu XV)', letter: 'Ayin (ע)', path: 26, desc: 'Tiphereth to Hod', god: 'Pan / Baphomet / Capricorn', tunG: 'A’ano’nin' },
    16: { name: 'The Tower', title: 'The Tower (Atu XVI)', letter: 'Peh (פ)', path: 27, desc: 'Netzach to Hod', god: 'Horus / Mars', tunG: 'Parfaxitas' },
    17: { name: 'The Star', title: 'The Star (Atu XVII)', letter: 'Heh (ה) / Tzaddi', path: 28, desc: 'Netzach to Yesod', god: 'Nuit / Venus / Aquarius', tunG: 'Tzuflifu' },
    18: { name: 'The Moon', title: 'The Moon (Atu XVIII)', letter: 'Qoph (ק)', path: 29, desc: 'Netzach to Malkuth', god: 'Khepri / Pisces', tunG: 'Qulielfi II' },
    19: { name: 'The Sun', title: 'The Sun (Atu XIX)', letter: 'Resh (ר)', path: 30, desc: 'Hod to Yesod', god: 'Ra / Herakles / Sun', tunG: 'Raflifu II' },
    20: { name: 'Judgement', title: 'The Aeon (Atu XX)', letter: 'Shin (ש)', path: 31, desc: 'Hod to Malkuth', god: 'Heru-Ra-Ha / Fire', tunG: 'Shalicu' },
    21: { name: 'The World', title: 'The Universe (Atu XXI)', letter: 'Tau (ת)', path: 32, desc: 'Yesod to Malkuth', god: 'Saturn / Quintessence', tunG: 'Thantifaxath' },
    22: { name: 'The Fool', title: 'The Fool (Atu 0/XXII)', letter: 'Aleph (א)', path: 11, desc: 'Kether to Chokmah', god: 'Harpocrates / Air', tunG: 'Amprodias' },
  };

  const ext = names[norm] || names[10];
  return {
    number: norm,
    name: ext.name,
    crowleyTitle: ext.title,
    hebrewLetter: ext.letter,
    pathNumber: ext.path,
    treeDescription: ext.desc,
    liber777Godform: ext.god,
    meaning: 'Archetypal manifestation of the soul through this cosmic initiation path.',
    shadowWarning: 'Beware the inverted temptation of stagnation or ungrounded spiritual pride.',
    tunnelNumber: ext.path,
    tunnelGuardian: ext.tunG,
    tunnelMeaning: `Nightside tunnel initiation governed by ${ext.tunG}`,
  };
}

// Calculate Tarot Birth Card pair
export function calculateTarotBirthCards(year: number, month: number, day: number): {
  primary: TarotMajorData;
  secondary?: TarotMajorData;
} {
  // Sum of birthdate digits: e.g. 1990 + 10 + 15 = 2015 -> 2+0+1+5 = 8
  const sum1 =
    String(year)
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0) +
    String(month)
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0) +
    String(day)
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0);

  let c1 = sum1;
  while (c1 > 22) {
    c1 = String(c1)
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0);
  }

  const primary = getTarotMajor(c1);

  // Secondary reduction if c1 is double digits
  let secondary: TarotMajorData | undefined;
  if (c1 > 9 && c1 <= 22) {
    const c2 = String(c1)
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0);
    if (c2 !== c1) {
      secondary = getTarotMajor(c2);
    }
  }

  return { primary, secondary };
}

// =============================================================================
// ZODIAC DECANS & 72 GOETIA QUINANCES (ZODIACAL WHEEL)
// =============================================================================

interface DecanEntry {
  sign: string;
  symbol: string;
  element: 'fire' | 'water' | 'air' | 'earth';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  rulingPlanet: string;
  decan: 1 | 2 | 3;
  degreeRange: string;
  subRuler: string;
  tarotMinor: string;
  dayGoetia: { number: number; name: string; rank: string; enn: string; office: string };
  nightGoetia: { number: number; name: string; rank: string; enn: string; office: string };
  dukanteFamilyNum: number;
}

// Exact date lookup for the 36 decans
function getDecanFromDate(month: number, day: number): DecanEntry {
  // Aries (Mar 21 - Apr 19)
  if ((month === 3 && day >= 21) || (month === 4 && day <= 9)) {
    if (month === 3 && day <= 30) {
      return {
        sign: 'Aries', symbol: '♈', element: 'fire', modality: 'Cardinal', rulingPlanet: 'Mars',
        decan: 1, degreeRange: '0° - 10° Aries', subRuler: 'Mars', tarotMinor: 'Two of Wands',
        dayGoetia: { number: 1, name: 'Bael', rank: 'King', enn: 'Ayer Secore On Ca Bael', office: 'Invisibility, strategic command, and warding off eyes of enemies.' },
        nightGoetia: { number: 2, name: 'Agares', rank: 'Duke', enn: 'Rean Caire An Ca Agares', office: 'Language acquisition, breaking political pride, retrieving runaways.' },
        dukanteFamilyNum: 2, // Flereous / Fire
      };
    }
    return {
      sign: 'Aries', symbol: '♈', element: 'fire', modality: 'Cardinal', rulingPlanet: 'Mars',
      decan: 2, degreeRange: '10° - 20° Aries', subRuler: 'Sun', tarotMinor: 'Three of Wands',
      dayGoetia: { number: 3, name: 'Vassago', rank: 'Prince', enn: 'Keyan Cire Vassago Secore', office: 'True vision of past, present, and future; recovering lost wisdom.' },
      nightGoetia: { number: 4, name: 'Samigina', rank: 'Marquis', enn: 'Esta Ca Ra Samigina Secore', office: 'Liberal sciences, communion with departed ancestors.' },
      dukanteFamilyNum: 2,
    };
  }
  if (month === 4 && day >= 10 && day <= 19) {
    return {
      sign: 'Aries', symbol: '♈', element: 'fire', modality: 'Cardinal', rulingPlanet: 'Mars',
      decan: 3, degreeRange: '20° - 30° Aries', subRuler: 'Venus / Jupiter', tarotMinor: 'Four of Wands',
      dayGoetia: { number: 5, name: 'Marbas', rank: 'President', enn: 'Renich Tasa Uberaca Biasa Icar Marbas', office: 'Instantaneous healing, transmutation, mechanical sciences.' },
      nightGoetia: { number: 6, name: 'Valefor', rank: 'Duke', enn: 'Keyman Vefa Valefor', office: 'Cunning intellect, familiar spirit of craftiness.' },
      dukanteFamilyNum: 2,
    };
  }

  // Taurus (Apr 20 - May 20)
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    if (day <= 29 && month === 4) {
      return {
        sign: 'Taurus', symbol: '♉', element: 'earth', modality: 'Fixed', rulingPlanet: 'Venus',
        decan: 1, degreeRange: '0° - 10° Taurus', subRuler: 'Mercury', tarotMinor: 'Five of Pentacles',
        dayGoetia: { number: 7, name: 'Amon', rank: 'Marquis', enn: 'Avage Secore Amon Ninan', office: 'Reconciliation of feuds, emotional courage, deep nocturnal loyalty.' },
        nightGoetia: { number: 8, name: 'Barbatos', rank: 'Duke', enn: 'Eveta Fubin Barbatos', office: 'Understanding animal speech, unlocking hidden earth treasures.' },
        dukanteFamilyNum: 4, // Belial / Earth
      };
    }
    if ((month === 4 && day >= 30) || (month === 5 && day <= 9)) {
      return {
        sign: 'Taurus', symbol: '♉', element: 'earth', modality: 'Fixed', rulingPlanet: 'Venus',
        decan: 2, degreeRange: '10° - 20° Taurus', subRuler: 'Moon', tarotMinor: 'Six of Pentacles',
        dayGoetia: { number: 9, name: 'Paimon', rank: 'King', enn: 'Linan Tasa Vefa Paimon', office: 'Supreme occult sciences, bind anyone to respect, Luciferian obedience.' },
        nightGoetia: { number: 10, name: 'Buer', rank: 'President', enn: 'Erato Rorem Caracol Buer', office: 'Philosophy, logic, herbal remedies, moral self-sovereignty.' },
        dukanteFamilyNum: 4,
      };
    }
    return {
      sign: 'Taurus', symbol: '♉', element: 'earth', modality: 'Fixed', rulingPlanet: 'Venus',
      decan: 3, degreeRange: '20° - 30° Taurus', subRuler: 'Saturn', tarotMinor: 'Seven of Pentacles',
      dayGoetia: { number: 11, name: 'Gusion', rank: 'Duke', enn: 'Secore On Ca Gusion', office: 'Honors, dignities, reconciling friendship, truth in divination.' },
      nightGoetia: { number: 12, name: 'Sitri', rank: 'Prince', enn: 'Lirach Alora Sitri Vefa', office: 'Magnetic charisma, awakening lust, breaking inhibitions.' },
      dukanteFamilyNum: 4,
    };
  }

  // Gemini (May 21 - Jun 20)
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    if (month === 5) {
      return {
        sign: 'Gemini', symbol: '♊', element: 'air', modality: 'Mutable', rulingPlanet: 'Mercury',
        decan: 1, degreeRange: '0° - 10° Gemini', subRuler: 'Jupiter', tarotMinor: 'Eight of Swords',
        dayGoetia: { number: 13, name: 'Beleth', rank: 'King', enn: 'Lirach Tasa Vefa Beleth', office: 'Arouses burning devotion until will is fulfilled.' },
        nightGoetia: { number: 14, name: 'Leraje', rank: 'Marquis', enn: 'Caymen Caymen Leraje', office: 'Archery of the mind, tactical battle, winning competitions.' },
        dukanteFamilyNum: 1, // Lucifer / Air
      };
    }
    if (day <= 10) {
      return {
        sign: 'Gemini', symbol: '♊', element: 'air', modality: 'Mutable', rulingPlanet: 'Mercury',
        decan: 2, degreeRange: '10° - 20° Gemini', subRuler: 'Mars', tarotMinor: 'Nine of Swords',
        dayGoetia: { number: 15, name: 'Eligos', rank: 'Duke', enn: 'Ayer Secore Eligos On', office: 'Foreseeing hidden wars, attracting warrior allies.' },
        nightGoetia: { number: 16, name: 'Zepar', rank: 'Duke', enn: 'Lirach Alora Zepar On', office: 'Alchemical passion, binding union.' },
        dukanteFamilyNum: 1,
      };
    }
    return {
      sign: 'Gemini', symbol: '♊', element: 'air', modality: 'Mutable', rulingPlanet: 'Mercury',
      decan: 3, degreeRange: '20° - 30° Gemini', subRuler: 'Sun', tarotMinor: 'Ten of Swords',
      dayGoetia: { number: 17, name: 'Botis', rank: 'President / Earl', enn: 'Jedan Secore Botis On', office: 'Reconciles friends and foes; uncovers hidden intentions.' },
      nightGoetia: { number: 18, name: 'Bathin', rank: 'Duke', enn: 'Dyram Secore Bathin On', office: 'Astral projection, speed across dimensions, virtue of gems.' },
      dukanteFamilyNum: 1,
    };
  }

  // Cancer (Jun 21 - Jul 22) — Includes Ipos!
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    if ((month === 6) || (month === 7 && day === 1)) {
      return {
        sign: 'Cancer', symbol: '♋', element: 'water', modality: 'Cardinal', rulingPlanet: 'Moon',
        decan: 1, degreeRange: '0° - 10° Cancer', subRuler: 'Venus', tarotMinor: 'Two of Cups',
        dayGoetia: { number: 19, name: 'Salleos', rank: 'Duke', enn: 'Serena Alora Salleos Aken', office: 'Inspires deep loyal love between kindred souls.' },
        nightGoetia: { number: 20, name: 'Purson', rank: 'King', enn: 'Ana Secore Purson On Ca', office: 'Secrets of creation, unseen riches, reveals past & future.' },
        dukanteFamilyNum: 3, // Leviathan / Water
      };
    }
    if (day >= 2 && day <= 11) {
      return {
        sign: 'Cancer', symbol: '♋', element: 'water', modality: 'Cardinal', rulingPlanet: 'Moon',
        decan: 2, degreeRange: '10° - 20° Cancer', subRuler: 'Mercury', tarotMinor: 'Three of Cups',
        dayGoetia: { number: 21, name: 'Marax', rank: 'President / Earl', enn: 'Kaymen Fubin Marax Secore', office: 'Astronomy, astrology, liberal sciences, stones & herbs.' },
        nightGoetia: { number: 22, name: 'Ipos', rank: 'Earl / Prince', enn: 'Desa An Ipos Ayer', office: 'All past & future knowledge, confers razor-sharp wit and boldness.' },
        dukanteFamilyNum: 3,
      };
    }
    return {
      sign: 'Cancer', symbol: '♋', element: 'water', modality: 'Cardinal', rulingPlanet: 'Moon',
      decan: 3, degreeRange: '20° - 30° Cancer', subRuler: 'Moon', tarotMinor: 'Four of Cups',
      dayGoetia: { number: 23, name: 'Aim', rank: 'Duke', enn: 'Ayer Fubin Aim Secore', office: 'Strategic cunning, burning down obstacles with mental torch.' },
      nightGoetia: { number: 24, name: 'Naberius', rank: 'Marquis', enn: 'Eyan Tasa Naberius Secore', office: 'Eloquent speech, rhetoric, regaining lost dignities.' },
      dukanteFamilyNum: 3,
    };
  }

  // Leo (Jul 23 - Aug 22)
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    if ((month === 7) || (month === 8 && day === 1)) {
      return {
        sign: 'Leo', symbol: '♌', element: 'fire', modality: 'Fixed', rulingPlanet: 'Sun',
        decan: 1, degreeRange: '0° - 10° Leo', subRuler: 'Saturn', tarotMinor: 'Five of Wands',
        dayGoetia: { number: 25, name: 'Glasya-Labolas', rank: 'President', enn: 'Elan Tasa Glasya-Labolas', office: 'Occult wisdom, invisibly strikes adversaries.' },
        nightGoetia: { number: 26, name: 'Bune', rank: 'Duke', enn: 'Wehl Melan Avage Bune Tasa', office: 'Wealth, worldly riches, eloquence, moves corpses.' },
        dukanteFamilyNum: 2,
      };
    }
    if (day >= 2 && day <= 11) {
      return {
        sign: 'Leo', symbol: '♌', element: 'fire', modality: 'Fixed', rulingPlanet: 'Sun',
        decan: 2, degreeRange: '10° - 20° Leo', subRuler: 'Jupiter', tarotMinor: 'Six of Wands',
        dayGoetia: { number: 27, name: 'Ronove', rank: 'Marquis', enn: 'Kaymen Tasa Ronove Secore', office: 'Rhetoric, comprehension of all tongues, winning favor.' },
        nightGoetia: { number: 28, name: 'Berith', rank: 'Duke', enn: 'Hoath Recore Berith Ninan', office: 'Answers truly of past and future, dignity, alchemical silver to gold.' },
        dukanteFamilyNum: 2,
      };
    }
    return {
      sign: 'Leo', symbol: '♌', element: 'fire', modality: 'Fixed', rulingPlanet: 'Sun',
      decan: 3, degreeRange: '20° - 30° Leo', subRuler: 'Mars', tarotMinor: 'Seven of Wands',
      dayGoetia: { number: 29, name: 'Astaroth', rank: 'Duke', enn: 'Tasa Alora Foren Astaroth', office: 'Liberal sciences, secrets of the Fall, deep initiatic wisdom.' },
      nightGoetia: { number: 30, name: 'Forneus', rank: 'Marquis', enn: 'Senan Tasa Forneus Vefa', office: 'Rhetoric, good name, loved by foes and allies.' },
      dukanteFamilyNum: 2,
    };
  }

  // Virgo (Aug 23 - Sep 22)
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    if (day <= 1 && month === 9) {
      return {
        sign: 'Virgo', symbol: '♍', element: 'earth', modality: 'Mutable', rulingPlanet: 'Mercury',
        decan: 1, degreeRange: '0° - 10° Virgo', subRuler: 'Sun', tarotMinor: 'Eight of Pentacles',
        dayGoetia: { number: 31, name: 'Foras', rank: 'President', enn: 'Kaymen Tasa Foras Secore', office: 'Virtues of herbs and precious stones, longevity, logic.' },
        nightGoetia: { number: 32, name: 'Asmodeus', rank: 'King', enn: 'Ayer Avage Aloren Asmodeus Aken', office: 'Ring of Virtues, hidden treasures, invincibility, passion.' },
        dukanteFamilyNum: 4,
      };
    }
    if (day >= 2 && day <= 11) {
      return {
        sign: 'Virgo', symbol: '♍', element: 'earth', modality: 'Mutable', rulingPlanet: 'Mercury',
        decan: 2, degreeRange: '10° - 20° Virgo', subRuler: 'Venus', tarotMinor: 'Nine of Pentacles',
        dayGoetia: { number: 33, name: 'Gaap', rank: 'Prince / President', enn: 'Deyan Tasa Gaap Secore', office: 'Astral transportation, philosophy, liberates from ignorance.' },
        nightGoetia: { number: 34, name: 'Furfur', rank: 'Earl', enn: 'Karean Tasa Furfur On', office: 'Thunder, lightning, secrets of divine union.' },
        dukanteFamilyNum: 4,
      };
    }
    return {
      sign: 'Virgo', symbol: '♍', element: 'earth', modality: 'Mutable', rulingPlanet: 'Mercury',
      decan: 3, degreeRange: '20° - 30° Virgo', subRuler: 'Mercury', tarotMinor: 'Ten of Pentacles',
      dayGoetia: { number: 35, name: 'Marchosias', rank: 'Marquis', enn: 'Es Na Ayer Marchosias Secore', office: 'Fierce warrior spirit, loyal protector, answers all questions.' },
      nightGoetia: { number: 36, name: 'Stolas', rank: 'Prince', enn: 'Stolas Rochem Tasa Vefa', office: 'Astronomy, virtues of plants and poisonous herbs.' },
      dukanteFamilyNum: 4,
    };
  }

  // Libra (Sep 23 - Oct 22)
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    if (day <= 2 && month === 10) {
      return {
        sign: 'Libra', symbol: '♎', element: 'air', modality: 'Cardinal', rulingPlanet: 'Venus',
        decan: 1, degreeRange: '0° - 10° Libra', subRuler: 'Moon', tarotMinor: 'Two of Swords',
        dayGoetia: { number: 37, name: 'Phenex', rank: 'Marquis', enn: 'Ef En Phenex Tasa', office: 'Poetry, sweet melodies, sciences of the Phoenix spirit.' },
        nightGoetia: { number: 38, name: 'Halphas', rank: 'Earl', enn: 'Erato Halphas On Ca', office: 'Builds towers and bastions, provides ammunition and strategy.' },
        dukanteFamilyNum: 1,
      };
    }
    if (day >= 3 && day <= 12) {
      return {
        sign: 'Libra', symbol: '♎', element: 'air', modality: 'Cardinal', rulingPlanet: 'Venus',
        decan: 2, degreeRange: '10° - 20° Libra', subRuler: 'Saturn', tarotMinor: 'Three of Swords',
        dayGoetia: { number: 39, name: 'Malphas', rank: 'President', enn: 'Lirach Tasa Malphas Vefa', office: 'Builds fortresses swiftly, breaks defenses of enemies.' },
        nightGoetia: { number: 40, name: 'Raum', rank: 'Earl', enn: 'Furca Ra Raum Secore', office: 'Steals treasures from kings, creates reconciliations.' },
        dukanteFamilyNum: 1,
      };
    }
    return {
      sign: 'Libra', symbol: '♎', element: 'air', modality: 'Cardinal', rulingPlanet: 'Venus',
      decan: 3, degreeRange: '20° - 30° Libra', subRuler: 'Jupiter', tarotMinor: 'Four of Swords',
      dayGoetia: { number: 41, name: 'Focalor', rank: 'Duke', enn: 'En Deyan Tasa Focalor', office: 'Command of winds and seas, destructive storms.' },
      nightGoetia: { number: 42, name: 'Vepar', rank: 'Duke', enn: 'On Ca Vepar Secore', office: 'Waters, battleships, reveals festering spiritual wounds.' },
      dukanteFamilyNum: 1,
    };
  }

  // Scorpio (Oct 23 - Nov 21)
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    if (day <= 1 && month === 11) {
      return {
        sign: 'Scorpio', symbol: '♏', element: 'water', modality: 'Fixed', rulingPlanet: 'Mars / Pluto',
        decan: 1, degreeRange: '0° - 10° Scorpio', subRuler: 'Mars', tarotMinor: 'Five of Cups',
        dayGoetia: { number: 43, name: 'Sabnock', rank: 'Marquis', enn: 'Tasa Sabnock On Ca Ayer', office: 'Constructs impenetrable spiritual towers, casts affliction on enemies.' },
        nightGoetia: { number: 44, name: 'Shax', rank: 'Marquis', enn: 'Ayer Avage Shax Aken', office: 'Deprives enemies of sight and hearing, reveals stolen secrets.' },
        dukanteFamilyNum: 3,
      };
    }
    if (day >= 2 && day <= 11) {
      return {
        sign: 'Scorpio', symbol: '♏', element: 'water', modality: 'Fixed', rulingPlanet: 'Mars / Pluto',
        decan: 2, degreeRange: '10° - 20° Scorpio', subRuler: 'Sun', tarotMinor: 'Six of Cups',
        dayGoetia: { number: 45, name: 'Vine', rank: 'King / Earl', enn: 'Eyesta Vefa Vine Tasa', office: 'Reveals witches, hidden defenses, past, present, and future.' },
        nightGoetia: { number: 46, name: 'Bifrons', rank: 'Earl', enn: 'Bifrons Secore On Ca Tasa', office: 'Astrology, geometry, necromancy, lighting graveyard lights.' },
        dukanteFamilyNum: 3,
      };
    }
    return {
      sign: 'Scorpio', symbol: '♏', element: 'water', modality: 'Fixed', rulingPlanet: 'Mars / Pluto',
      decan: 3, degreeRange: '20° - 30° Scorpio', subRuler: 'Venus', tarotMinor: 'Seven of Cups',
      dayGoetia: { number: 47, name: 'Vual', rank: 'Duke', enn: 'Secore On Ca Vual', office: 'Uncovers ancient mysteries, wins the love of adversaries.' },
      nightGoetia: { number: 48, name: 'Haagenti', rank: 'President', enn: 'Haagenti Rochem Tasa Vefa', office: 'Alchemical transmutation: metals to gold, wine to water, water to wine.' },
      dukanteFamilyNum: 3,
    };
  }

  // Sagittarius (Nov 22 - Dec 21)
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    if (day <= 1 && month === 12) {
      return {
        sign: 'Sagittarius', symbol: '♐', element: 'fire', modality: 'Mutable', rulingPlanet: 'Jupiter',
        decan: 1, degreeRange: '0° - 10° Sagittarius', subRuler: 'Mercury', tarotMinor: 'Eight of Wands',
        dayGoetia: { number: 49, name: 'Crocell', rank: 'Duke', enn: 'Jedan Tasa Crocell On Ca', office: 'Geometry, mysticism, warms dark waters, causes rushing sounds.' },
        nightGoetia: { number: 50, name: 'Furcas', rank: 'Knight', enn: 'Secore On Ca Furcas', office: 'Logic, philosophy, rhetoric, astrology, chiromancy.' },
        dukanteFamilyNum: 2,
      };
    }
    if (day >= 2 && day <= 11) {
      return {
        sign: 'Sagittarius', symbol: '♐', element: 'fire', modality: 'Mutable', rulingPlanet: 'Jupiter',
        decan: 2, degreeRange: '10° - 20° Sagittarius', subRuler: 'Moon', tarotMinor: 'Nine of Wands',
        dayGoetia: { number: 51, name: 'Balam', rank: 'King', enn: 'Lirach Tasa Vefa Balam', office: 'Invisibility, answers truly of times, witty repartee.' },
        nightGoetia: { number: 52, name: 'Alloces', rank: 'Duke', enn: 'Alloces Rochem Tasa Vefa', office: 'Astronomy, liberal sciences, loyal familiars.' },
        dukanteFamilyNum: 2,
      };
    }
    return {
      sign: 'Sagittarius', symbol: '♐', element: 'fire', modality: 'Mutable', rulingPlanet: 'Jupiter',
      decan: 3, degreeRange: '20° - 30° Sagittarius', subRuler: 'Saturn', tarotMinor: 'Ten of Wands',
      dayGoetia: { number: 53, name: 'Camio', rank: 'President', enn: 'Tasa On Ca Camio', office: 'Understanding birds, barking dogs, running water.' },
      nightGoetia: { number: 54, name: 'Murmur', rank: 'Duke / Earl', enn: 'Vefa Mena Murmur Tasa', office: 'Philosophy, calls departed souls to answer questions.' },
      dukanteFamilyNum: 2,
    };
  }

  // Capricorn (Dec 22 - Jan 19)
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    if (month === 12) {
      return {
        sign: 'Capricorn', symbol: '♑', element: 'earth', modality: 'Cardinal', rulingPlanet: 'Saturn',
        decan: 1, degreeRange: '0° - 10° Capricorn', subRuler: 'Jupiter', tarotMinor: 'Two of Pentacles',
        dayGoetia: { number: 55, name: 'Orobas', rank: 'Prince', enn: 'Jedan Tasa Orobas On Ca', office: 'Honors, truth of creation, shields from deceiving spirits.' },
        nightGoetia: { number: 56, name: 'Gremory', rank: 'Duke', enn: 'An Tasa Gremory On Ca', office: 'Hidden treasures in subterranean depths, love of women.' },
        dukanteFamilyNum: 4,
      };
    }
    if (day <= 10) {
      return {
        sign: 'Capricorn', symbol: '♑', element: 'earth', modality: 'Cardinal', rulingPlanet: 'Saturn',
        decan: 2, degreeRange: '10° - 20° Capricorn', subRuler: 'Mars', tarotMinor: 'Three of Pentacles',
        dayGoetia: { number: 57, name: 'Ose', rank: 'President', enn: 'Ayer Avage Ose Tasa', office: 'Transforms perception, grants sanity or madness, secret sciences.' },
        nightGoetia: { number: 58, name: 'Amy', rank: 'President', enn: 'Secore On Ca Amy', office: 'Astrology, sciences, reveals treasures guarded by spirits.' },
        dukanteFamilyNum: 4,
      };
    }
    return {
      sign: 'Capricorn', symbol: '♑', element: 'earth', modality: 'Cardinal', rulingPlanet: 'Saturn',
      decan: 3, degreeRange: '20° - 30° Capricorn', subRuler: 'Sun', tarotMinor: 'Four of Pentacles',
      dayGoetia: { number: 59, name: 'Orias', rank: 'Marquis', enn: 'Lirach Tasa Vefa Orias', office: 'Astrology, teaches virtues of stars and planets, grants dignities.' },
      nightGoetia: { number: 60, name: 'Vapula', rank: 'Duke', enn: 'Renich Tasa Vapula On Ca', office: 'Handicrafts, engineering, philosophy, liberal sciences.' },
      dukanteFamilyNum: 4,
    };
  }

  // Aquarius (Jan 20 - Feb 18)
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    if (month === 1) {
      return {
        sign: 'Aquarius', symbol: '♒', element: 'air', modality: 'Fixed', rulingPlanet: 'Saturn / Uranus',
        decan: 1, degreeRange: '0° - 10° Aquarius', subRuler: 'Venus', tarotMinor: 'Five of Swords',
        dayGoetia: { number: 61, name: 'Zagan', rank: 'King / President', enn: 'Secore On Ca Zagan Tasa', office: 'Turns wine to water, blood to oil, makes fools witty.' },
        nightGoetia: { number: 62, name: 'Valac', rank: 'President', enn: 'Avage Secore Valac On Ca', office: 'Reveals hidden serpents and hidden riches.' },
        dukanteFamilyNum: 1,
      };
    }
    if (day <= 8) {
      return {
        sign: 'Aquarius', symbol: '♒', element: 'air', modality: 'Fixed', rulingPlanet: 'Saturn / Uranus',
        decan: 2, degreeRange: '10° - 20° Aquarius', subRuler: 'Mercury', tarotMinor: 'Six of Swords',
        dayGoetia: { number: 63, name: 'Andras', rank: 'Marquis', enn: 'En Deyan Tasa Andras', office: 'Discord, sowing feuds, martial power, supreme warrior spirit.' },
        nightGoetia: { number: 64, name: 'Haures', rank: 'Duke', enn: 'Haures Tasa Vefa Rochem', office: 'Destroys enemies with consumed fire, reveals creation.' },
        dukanteFamilyNum: 1,
      };
    }
    return {
      sign: 'Aquarius', symbol: '♒', element: 'air', modality: 'Fixed', rulingPlanet: 'Saturn / Uranus',
      decan: 3, degreeRange: '20° - 30° Aquarius', subRuler: 'Moon', tarotMinor: 'Seven of Swords',
      dayGoetia: { number: 65, name: 'Andrealphus', rank: 'Marquis', enn: 'Tasa Andrealphus On Ca Ayer', office: 'Geometry, astronomy, transforms men into birds (astral flight).' },
      nightGoetia: { number: 66, name: 'Cimeies', rank: 'Marquis', enn: 'Cimeies Rochem Tasa Vefa', office: 'Grammar, rhetoric, reveals treasures of Africa.' },
      dukanteFamilyNum: 1,
    };
  }

  // Pisces (Feb 19 - Mar 20) — Includes Belial & Dantalion!
  if (day <= 28 && month === 2) {
    return {
      sign: 'Pisces', symbol: '♓', element: 'water', modality: 'Mutable', rulingPlanet: 'Jupiter / Neptune',
      decan: 1, degreeRange: '0° - 10° Pisces', subRuler: 'Saturn', tarotMinor: 'Eight of Cups',
      dayGoetia: { number: 67, name: 'Amdusias', rank: 'Duke', enn: 'Denyen Valocur Amdusias On Ca', office: 'Causes trees to bend, commands invisible musical concerts.' },
      nightGoetia: { number: 68, name: 'Belial', rank: 'King', enn: 'Lirach Tasa Vefa Wehl Belial', office: 'Independent sovereignty, legal triumph, political favor.' },
      dukanteFamilyNum: 3,
    };
  }
  if (month === 3 && day <= 10) {
    return {
      sign: 'Pisces', symbol: '♓', element: 'water', modality: 'Mutable', rulingPlanet: 'Jupiter / Neptune',
      decan: 2, degreeRange: '10° - 20° Pisces', subRuler: 'Jupiter', tarotMinor: 'Nine of Cups',
      dayGoetia: { number: 69, name: 'Decarabia', rank: 'Marquis', enn: 'Hoath Tasa Decarabia', office: 'Virtues of birds and precious stones, optical illusions.' },
      nightGoetia: { number: 70, name: 'Seere', rank: 'Prince', enn: 'Jedan Tasa Seere On Ca', office: 'Brings abundance in an instant, swift messenger of desires.' },
      dukanteFamilyNum: 3,
    };
  }
  return {
    sign: 'Pisces', symbol: '♓', element: 'water', modality: 'Mutable', rulingPlanet: 'Jupiter / Neptune',
    decan: 3, degreeRange: '20° - 30° Pisces', subRuler: 'Mars', tarotMinor: 'Ten of Cups',
    dayGoetia: { number: 71, name: 'Dantalion', rank: 'Duke', enn: 'Avage Ayer Dantalion On Ca', office: 'Teaches all human thoughts, reads minds, changes emotional hearts.' },
    nightGoetia: { number: 72, name: 'Andromalius', rank: 'Earl', enn: 'Tasa Fubin Andromalius On Ca', office: 'Catches thieves, retrieves stolen goods, uncovers hidden malice.' },
    dukanteFamilyNum: 3,
  };
}

// Dukanté Families (Connolly p. 25-35)
export const DUKANTE_FAMILIES = [
  {
    familyNumber: 1,
    familyName: 'Family 1: Air & Enlightenment',
    element: 'Air',
    demonicPatron: 'Lucifer (Emperor of Air) & Amon',
    direction: 'East',
    philosophicalFocus: 'Intellectual sovereignty, illumination, communication, and learning.',
  },
  {
    familyNumber: 2,
    familyName: 'Family 2: Fire & Transformation',
    element: 'Fire',
    demonicPatron: 'Flereous (Fire Duke) & Satan',
    direction: 'South',
    philosophicalFocus: 'Will, desire, passion, destructive purification, and transmutation.',
  },
  {
    familyNumber: 3,
    familyName: 'Family 3: Water & Intuition',
    element: 'Water',
    demonicPatron: 'Leviathan (Water Dragon) & Dagon',
    direction: 'West',
    philosophicalFocus: 'Subconscious depth, astral navigation, emotional mastery, and primal gnosis.',
  },
  {
    familyNumber: 4,
    familyName: 'Family 4: Earth & Sovereignty',
    element: 'Earth',
    demonicPatron: 'Belial (Master of Earth) & Eurynomous',
    direction: 'North',
    philosophicalFocus: 'Physical manifestation, bodily health, wealth, legal triumph, and grounding.',
  },
];

// =============================================================================
// MAIN ENTRY CALCULATOR
// =============================================================================

export function calculateNatalEsotericBlueprint(
  birthDateStr: string, // 'YYYY-MM-DD'
  name?: string
): NatalCalculationResult | null {
  const parts = birthDateStr.split('-').map((p) => parseInt(p, 10));
  if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return null;
  }

  const [year, month, day] = parts;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  // 1. Numerology
  const { lifePath, isMaster, masterTitle } = calculateLifePath(year, month, day);
  const birthdayNumber = reduceDigits(day, true);
  // Shadow number on Qliphothic 11-fold spectrum
  const shadowNumber = lifePath <= 11 ? 11 - lifePath || 11 : reduceDigits(lifePath, false);

  const nameGematria = name ? calculateNameGematria(name) : undefined;

  // 2. Tarot Birth Cards (Crowley Thoth)
  const { primary: tarotBirthCard, secondary: tarotSecondaryCard } = calculateTarotBirthCards(
    year,
    month,
    day
  );

  // 3. Nightside Qliphothic Tunnel
  const qliphothTunnel = {
    tunnelNumber: tarotBirthCard.tunnelNumber,
    guardian: tarotBirthCard.tunnelGuardian,
    hebrewAtu: tarotBirthCard.hebrewLetter,
    meaning: tarotBirthCard.tunnelMeaning,
    sentinelPath: tarotBirthCard.treeDescription,
    shadowGnosis: `Shadow initiation in the realm of ${tarotBirthCard.tunnelGuardian}. Integrate the suppressed instinctive fires into sovereign consciousness.`,
  };

  // 4. Decans & Goetic Wheel
  const decanData = getDecanFromDate(month, day);

  const dukanteFamily =
    DUKANTE_FAMILIES.find((f) => f.familyNumber === decanData.dukanteFamilyNum) ||
    DUKANTE_FAMILIES[0];

  // 5. Alchemical Correspondences based on element & planet
  const elementToKey: Record<string, { key: string; hz: number }> = {
    fire: { key: 'C', hz: 130.81 },
    water: { key: 'G#', hz: 207.65 },
    air: { key: 'E', hz: 164.81 },
    earth: { key: 'D', hz: 146.83 },
  };

  const sound = elementToKey[decanData.element] || { key: 'D', hz: 146.83 };

  const elementToAlchemical: Record<string, { metal: string; incense: string; candle: string; stone: string }> = {
    fire: { metal: 'Gold / Iron', incense: 'Frankincense / Dragon\'s Blood', candle: 'Crimson & Gold', stone: 'Ruby / Carnelian' },
    water: { metal: 'Silver / Tin', incense: 'Myrrh / Copal / Cedar', candle: 'Deep Blue & Violet', stone: 'Aquamarine / Pearl' },
    air: { metal: 'Electrum / Copper', incense: 'Lavender / Sandalwood', candle: 'White & Amber', stone: 'Topaz / Quartz' },
    earth: { metal: 'Lead / Bronze', incense: 'Patchouli / Storax', candle: 'Obsidian Black & Emerald', stone: 'Black Tourmaline / Jade' },
  };

  const alch = elementToAlchemical[decanData.element] || elementToAlchemical.air;

  return {
    birthDate: {
      year,
      month,
      day,
      raw: birthDateStr,
    },
    name,
    lifePath,
    isMasterNumber: isMaster,
    masterTitle,
    birthdayNumber,
    shadowNumber,
    destinyNumber: nameGematria?.destiny,
    soulUrgeNumber: nameGematria?.soulUrge,
    tarotBirthCard,
    tarotSecondaryCard: tarotSecondaryCard
      ? {
          number: tarotSecondaryCard.number,
          name: tarotSecondaryCard.name,
          crowleyTitle: tarotSecondaryCard.crowleyTitle,
        }
      : undefined,
    qliphothTunnel,
    zodiacSign: {
      name: decanData.sign,
      symbol: decanData.symbol,
      element: decanData.element,
      modality: decanData.modality,
      rulingPlanet: decanData.rulingPlanet,
      decan: decanData.decan,
      decanDegreeRange: decanData.degreeRange,
      subRuler: decanData.subRuler,
      tarotMinorCard: decanData.tarotMinor,
    },
    goeticPatrons: {
      daySpirit: decanData.dayGoetia,
      nightSpirit: decanData.nightGoetia,
    },
    dukanteFamily,
    alchemical: {
      metal: alch.metal,
      incense: alch.incense,
      candleColor: alch.candle,
      stone: alch.stone,
      musicalKey: sound.key,
      frequencyHz: sound.hz,
    },
  };
}
