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

  // 8. Geographic Origins & Classical Ascendant / Rising Decan
  geographicOrigins?: {
    city: EsotericCity;
    latitude: number;
    longitude: number;
    timezoneOffset: number;
    localSiderealTimeHours: number;
    localSiderealTimeString: string;
    solarTiming: {
      sunrise: string;
      sunset: string;
      solarNoon: string;
      isDiurnal: boolean;
    };
    planetaryHourOfBirth: {
      hourIndex: number; // 1 to 12
      isDiurnal: boolean;
      rulingPlanet: string;
      symbol: string;
      archangel: string;
      olympicSpirit: string;
      demonicReflex: string;
      magicalFocus: string;
    };
    ascendant: {
      degree: number; // 0 to 360
      degreeInSign: number; // 0 to 30
      formattedDegree: string;
      signName: string;
      signSymbol: string;
      element: 'fire' | 'water' | 'air' | 'earth';
      decan: 1 | 2 | 3;
      tarotMinorCard: string;
      subRuler: string;
      risingGoetiaPatron: {
        number: number;
        name: string;
        rank: string;
        enn: string;
        office: string;
      };
    };
  };
}

export interface EsotericCity {
  id: string;
  name: string;
  stateOrRegion?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number; // UTC offset in hours
  description: string;
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
// ESOTERIC CITIES & GEODETIC SANCTUARIES (WITH TUXPAN, VERACRUZ)
// =============================================================================

export const ESOTERIC_CITIES: EsotericCity[] = [
  {
    id: 'tuxpan',
    name: 'Tuxpan',
    stateOrRegion: 'Veracruz',
    country: 'Mexico',
    latitude: 20.9573,
    longitude: -97.4081,
    timezoneOffset: -6,
    description: 'Gulf Coast Port of Veracruz — Ancient Huasteca / Nahuatl Coastal Sanctuary of the Waters',
  },
  {
    id: 'veracruz_port',
    name: 'Veracruz (Heroica)',
    stateOrRegion: 'Veracruz',
    country: 'Mexico',
    latitude: 19.1738,
    longitude: -96.1342,
    timezoneOffset: -6,
    description: 'Historic Gateway Port to the Gulf of Mexico & Olmec Coastlands',
  },
  {
    id: 'xalapa',
    name: 'Xalapa-Enríquez',
    stateOrRegion: 'Veracruz',
    country: 'Mexico',
    latitude: 19.5438,
    longitude: -96.9102,
    timezoneOffset: -6,
    description: 'City of Flowers & Mist, foothills of Cofre de Perote volcano',
  },
  {
    id: 'poza_rica',
    name: 'Poza Rica',
    stateOrRegion: 'Veracruz',
    country: 'Mexico',
    latitude: 20.5332,
    longitude: -97.4595,
    timezoneOffset: -6,
    description: 'Northern Veracruz Oil & Lightning Hub near El Tajín Totonac Pyramids',
  },
  {
    id: 'mexico_city',
    name: 'Mexico City (Tenochtitlan)',
    stateOrRegion: 'CDMX',
    country: 'Mexico',
    latitude: 19.4326,
    longitude: -99.1332,
    timezoneOffset: -6,
    description: 'High Valley of Anahuac, Imperial Aztec Heart & Templo Mayor Nexus',
  },
  {
    id: 'cairo',
    name: 'Cairo / Giza',
    country: 'Egypt',
    latitude: 30.0444,
    longitude: 31.2357,
    timezoneOffset: 2,
    description: 'Ancient Khem, Pyramids of Giza & Nile River Valley of the Godforms',
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    timezoneOffset: 0,
    description: 'Hermetic Order of the Golden Dawn, Dee & Kelly Enochian Seat',
  },
  {
    id: 'prague',
    name: 'Prague',
    country: 'Czech Republic',
    latitude: 50.0755,
    longitude: 14.4378,
    timezoneOffset: 1,
    description: 'Rudolfine Imperial Capital of Alchemy, Golem of Prague & Rosicrucians',
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    timezoneOffset: 1,
    description: 'Eliphas Lévi, Nicolas Flamel, & Templar Gnostic Stronghold',
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    latitude: 41.9028,
    longitude: 12.4964,
    timezoneOffset: 1,
    description: 'Caput Mundi, Mithraic Mysteries, & Catacomb Gnosis',
  },
  {
    id: 'athens',
    name: 'Athens',
    country: 'Greece',
    latitude: 37.9838,
    longitude: 23.7275,
    timezoneOffset: 2,
    description: 'Eleusinian Mysteries, Dionysian Rites & Platonic Akademia',
  },
  {
    id: 'jerusalem',
    name: 'Jerusalem (Yerushalayim)',
    country: 'Israel',
    latitude: 31.7683,
    longitude: 35.2137,
    timezoneOffset: 2,
    description: 'Axis Mundi, Temple of Solomon, & Kabbalistic Merkabah Throne',
  },
  {
    id: 'new_york',
    name: 'New York City',
    stateOrRegion: 'NY',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.0060,
    timezoneOffset: -5,
    description: 'Modern Astral Metropole, Boleskine / Crowley US Travels',
  },
  {
    id: 'los_angeles',
    name: 'Los Angeles (Babalon)',
    stateOrRegion: 'CA',
    country: 'United States',
    latitude: 34.0522,
    longitude: -118.2437,
    timezoneOffset: -8,
    description: 'Jack Parsons, Babalon Working 1946 & Agape Lodge Thelema',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timezoneOffset: 9,
    description: 'Eastern Dragon Vein (Ryu-myaku) & Shinto-Buddhist Ley Nexus',
  },
  {
    id: 'buenos_aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    latitude: -34.6037,
    longitude: -58.3816,
    timezoneOffset: -3,
    description: 'Southern Cross Vortex & Latin American Esoteric Renaissance',
  },
  {
    id: 'bogota',
    name: 'Bogotá',
    country: 'Colombia',
    latitude: 4.7110,
    longitude: -74.0721,
    timezoneOffset: -5,
    description: 'Andean High Plateau, Sacred Guatavita Lagoon of El Dorado',
  },
  {
    id: 'custom',
    name: 'Custom Lat / Long Coordinates',
    country: 'User Specified',
    latitude: 20.9573,
    longitude: -97.4081,
    timezoneOffset: -6,
    description: 'Manual geodesic entry for exact coordinates',
  },
];

const PLANETARY_HOUR_DETAILS: Record<
  string,
  {
    symbol: string;
    archangel: string;
    olympicSpirit: string;
    demonicReflex: string;
    magicalFocus: string;
  }
> = {
  Sun: {
    symbol: '☉',
    archangel: 'Raphael (Healer of God) & Michael',
    olympicSpirit: 'Och (Solar Alchemist)',
    demonicReflex: 'Sorath (Sun Demon 666) & Belphegor',
    magicalFocus: 'Illumination, authority, vital health, wealth, and sovereign will.',
  },
  Moon: {
    symbol: '☽',
    archangel: 'Gabriel (Governor of Dreams)',
    olympicSpirit: 'Phul (Silver Lunar Lord)',
    demonicReflex: 'Lilith (Queen of the Night) & Naamah',
    magicalFocus: 'Subconscious depth, astral navigation, dream lucidity, and primal tides.',
  },
  Mars: {
    symbol: '♂',
    archangel: 'Kamael (Wrath of God)',
    olympicSpirit: 'Phaleg (Warlord of Iron)',
    demonicReflex: 'Asmodeus (King of Wrath) & Barzabel',
    magicalFocus: 'Severing energetic parasites, courage, combat mastery, and dynamic force.',
  },
  Mercury: {
    symbol: '☿',
    archangel: 'Michael & Raphael',
    olympicSpirit: 'Ophiel (Messenger of Hermes)',
    demonicReflex: 'Adrammelech (Chancellor of Hell) & Samael',
    magicalFocus: 'Grimoire study, gematria, telepathy, quicksilver intellect, and commerce.',
  },
  Jupiter: {
    symbol: '♃',
    archangel: 'Tzadkiel (Righteousness of God)',
    olympicSpirit: 'Bethor (Titan of Abundance)',
    demonicReflex: 'Astaroth (Grand Duke) & Gha\'agsheblah',
    magicalFocus: 'Expansion, imperial sovereignty, luck, high ceremonial magick, and honors.',
  },
  Venus: {
    symbol: '♀',
    archangel: 'Haniel (Grace of God) & Anael',
    olympicSpirit: 'Hagith (Empress of Beauty)',
    demonicReflex: 'Agrat bat Mahlat (Demoness of Whoredom) & Eisheth',
    magicalFocus: 'Magnetic attraction, aesthetic perfection, love, alchemy of desire, and art.',
  },
  Saturn: {
    symbol: '♄',
    archangel: 'Tzaphkiel (Contemplation of God) & Cassiel',
    olympicSpirit: 'Aratron (Architect of Time & Stones)',
    demonicReflex: 'Lucifuge Rofocale (Pact Keeper) & Saturnus',
    magicalFocus: 'Binding, ancestral necromancy, karma, boundaries, and lead-to-gold initiation.',
  },
};

const DECAN_SAMPLE_DATES: Array<[number, number]> = [
  // Aries (0° - 30°)
  [3, 25], [4, 5], [4, 15],
  // Taurus (30° - 60°)
  [4, 25], [5, 5], [5, 15],
  // Gemini (60° - 90°)
  [5, 25], [6, 5], [6, 15],
  // Cancer (90° - 120°)
  [6, 25], [7, 5], [7, 15],
  // Leo (120° - 150°)
  [7, 28], [8, 5], [8, 15],
  // Virgo (150° - 180°)
  [8, 28], [9, 5], [9, 15],
  // Libra (180° - 210°)
  [9, 28], [10, 5], [10, 15],
  // Scorpio (210° - 240°)
  [10, 28], [11, 5], [11, 15],
  // Sagittarius (240° - 270°)
  [11, 28], [12, 5], [12, 15],
  // Capricorn (270° - 300°)
  [12, 28], [1, 5], [1, 15],
  // Aquarius (300° - 330°)
  [1, 25], [2, 5], [2, 15],
  // Pisces (330° - 360°)
  [2, 25], [3, 5], [3, 15],
];

export function getDecanFromEclipticDegree(degree: number): {
  decanEntry: DecanEntry;
  signName: string;
  signSymbol: string;
  degreeInSign: number;
  formattedDegree: string;
  risingGoetiaPatron: {
    number: number;
    name: string;
    rank: string;
    enn: string;
    office: string;
  };
} {
  const normDeg = ((degree % 360) + 360) % 360;
  const signIdx = Math.floor(normDeg / 30);
  const degInSign = normDeg - signIdx * 30;
  const decanIdxInSign = Math.min(2, Math.floor(degInSign / 10));
  const globalIdx = Math.min(35, Math.max(0, signIdx * 3 + decanIdxInSign));

  const [m, d] = DECAN_SAMPLE_DATES[globalIdx];
  const decanEntry = getDecanFromDate(m, d);

  // 5° Quinance within decan
  const degInsideDecan = degInSign - decanIdxInSign * 10;
  const isNightQuinance = degInsideDecan >= 5;
  const risingGoetiaPatron = isNightQuinance ? decanEntry.nightGoetia : decanEntry.dayGoetia;

  const degInt = Math.floor(degInSign);
  const minutes = Math.floor((degInSign - degInt) * 60);
  const formattedDegree = `${degInt}° ${minutes.toString().padStart(2, '0')}' ${decanEntry.sign}`;

  return {
    decanEntry,
    signName: decanEntry.sign,
    signSymbol: decanEntry.symbol,
    degreeInSign: degInSign,
    formattedDegree,
    risingGoetiaPatron,
  };
}

export function calculateGeographicNatalCurrents(params: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  city: EsotericCity;
}) {
  const { year, month, day, hour, minute, city } = params;
  const lat = city.latitude;
  const lng = city.longitude;
  const tz = city.timezoneOffset;

  // Day of year
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const currentDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfYear = Math.floor((currentDate.getTime() - startOfYear.getTime()) / 86400000) + 1;

  // Solar Equation & Sunrise/Sunset
  const rad = Math.PI / 180;
  const B = ((360 / 365) * (dayOfYear - 81)) * rad;
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // in minutes
  const declination = 23.44 * Math.sin(B) * rad;

  const latRad = lat * rad;
  const solarNoonHour = 12.0 - (lng - tz * 15.0) / 15.0 - EoT / 60.0;

  // Solar hour angle at sunrise/sunset
  let cosH0 = (Math.sin(-0.833 * rad) - Math.sin(latRad) * Math.sin(declination)) /
              (Math.cos(latRad) * Math.cos(declination));
  cosH0 = Math.max(-1, Math.min(1, cosH0));
  const H0 = Math.acos(cosH0) / rad / 15.0; // hours

  const sunriseHour = solarNoonHour - H0;
  const sunsetHour = solarNoonHour + H0;

  const formatHoursToTime = (h: number): string => {
    let norm = ((h % 24) + 24) % 24;
    const hh = Math.floor(norm);
    const mm = Math.floor((norm - hh) * 60);
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  };

  const birthDecimalHours = hour + minute / 60.0;
  const isDiurnal = birthDecimalHours >= sunriseHour && birthDecimalHours < sunsetHour;

  // Planetary Hour (Chaldean Order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon)
  const CHALDEAN_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
  const DAY_WEEK_RULERS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const dayOfWeek = currentDate.getUTCDay(); // 0 = Sun
  const dayRuler = DAY_WEEK_RULERS[dayOfWeek];
  const dayRulerChaldeanIdx = CHALDEAN_ORDER.indexOf(dayRuler);

  let hourIndex = 1;
  let rulingPlanet = 'Sun';

  if (isDiurnal) {
    const dayLength = sunsetHour - sunriseHour;
    const singleHour = dayLength / 12.0;
    const elapsed = Math.max(0, birthDecimalHours - sunriseHour);
    hourIndex = Math.min(12, Math.floor(elapsed / singleHour) + 1);
    const chaldeanOffset = (dayRulerChaldeanIdx + (hourIndex - 1)) % 7;
    rulingPlanet = CHALDEAN_ORDER[chaldeanOffset];
  } else {
    const nightLength = 24.0 - (sunsetHour - sunriseHour);
    const singleHour = nightLength / 12.0;
    let elapsed = 0;
    if (birthDecimalHours >= sunsetHour) {
      elapsed = birthDecimalHours - sunsetHour;
    } else {
      elapsed = (24.0 - sunsetHour) + birthDecimalHours;
    }
    hourIndex = Math.min(12, Math.floor(elapsed / singleHour) + 1);
    const chaldeanOffset = (dayRulerChaldeanIdx + 12 + (hourIndex - 1)) % 7;
    rulingPlanet = CHALDEAN_ORDER[chaldeanOffset];
  }

  const planetDetails = PLANETARY_HOUR_DETAILS[rulingPlanet] || PLANETARY_HOUR_DETAILS.Sun;

  // Julian Date & Sidereal Time for Ascendant
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const utHours = birthDecimalHours - tz;
  const A = Math.floor(y / 100);
  const B_jd = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B_jd - 1524.5 + utHours / 24.0;
  const dJ2000 = jd - 2451545.0;

  // Greenwich Mean Sidereal Time in degrees
  let gmst = (280.46061837 + 360.98564736629 * dJ2000) % 360;
  if (gmst < 0) gmst += 360;

  // Local Sidereal Time in degrees
  let lstDeg = (gmst + lng) % 360;
  if (lstDeg < 0) lstDeg += 360;
  const lstHours = lstDeg / 15.0;

  // Obliquity of Ecliptic
  const tCenturies = dJ2000 / 36525.0;
  const epsDeg = 23.4392911 - 0.0130042 * tCenturies;
  const epsRad = epsDeg * rad;
  const ramcRad = lstDeg * rad;

  // Ascendant Calculation
  const yAsc = Math.cos(ramcRad);
  const xAsc = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascRad = Math.atan2(yAsc, xAsc);
  let ascDeg = (ascRad / rad) % 360;
  if (ascDeg < 0) ascDeg += 360;

  const ascDecan = getDecanFromEclipticDegree(ascDeg);

  return {
    city,
    latitude: lat,
    longitude: lng,
    timezoneOffset: tz,
    localSiderealTimeHours: lstHours,
    localSiderealTimeString: formatHoursToTime(lstHours),
    solarTiming: {
      sunrise: formatHoursToTime(sunriseHour),
      sunset: formatHoursToTime(sunsetHour),
      solarNoon: formatHoursToTime(solarNoonHour),
      isDiurnal,
    },
    planetaryHourOfBirth: {
      hourIndex,
      isDiurnal,
      rulingPlanet,
      symbol: planetDetails.symbol,
      archangel: planetDetails.archangel,
      olympicSpirit: planetDetails.olympicSpirit,
      demonicReflex: planetDetails.demonicReflex,
      magicalFocus: planetDetails.magicalFocus,
    },
    ascendant: {
      degree: ascDeg,
      degreeInSign: ascDecan.degreeInSign,
      formattedDegree: ascDecan.formattedDegree,
      signName: ascDecan.signName,
      signSymbol: ascDecan.signSymbol,
      element: ascDecan.decanEntry.element,
      decan: ascDecan.decanEntry.decan,
      tarotMinorCard: ascDecan.decanEntry.tarotMinor,
      subRuler: ascDecan.decanEntry.subRuler,
      risingGoetiaPatron: ascDecan.risingGoetiaPatron,
    },
  };
}

// =============================================================================
// MAIN ENTRY CALCULATOR
// =============================================================================

export function calculateNatalEsotericBlueprint(
  birthDateStr: string, // 'YYYY-MM-DD'
  name?: string,
  birthTimeStr: string = '12:00',
  cityIdOrCustom?: string | { latitude: number; longitude: number; timezoneOffset: number; name: string }
): NatalCalculationResult | null {
  const parts = birthDateStr.split('-').map((p) => parseInt(p, 10));
  if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return null;
  }

  const [year, month, day] = parts;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  // Resolve City
  let city: EsotericCity = ESOTERIC_CITIES[0]; // Default to Tuxpan, Veracruz
  if (typeof cityIdOrCustom === 'string') {
    const found = ESOTERIC_CITIES.find((c) => c.id === cityIdOrCustom);
    if (found) city = found;
  } else if (cityIdOrCustom && typeof cityIdOrCustom === 'object') {
    city = {
      id: 'custom',
      name: cityIdOrCustom.name || 'Custom Location',
      country: 'User Coordinates',
      latitude: cityIdOrCustom.latitude,
      longitude: cityIdOrCustom.longitude,
      timezoneOffset: cityIdOrCustom.timezoneOffset,
      description: `User-defined coordinates: ${cityIdOrCustom.latitude.toFixed(4)}°, ${cityIdOrCustom.longitude.toFixed(4)}°`,
    };
  }

  // Parse Birth Time
  const timeParts = (birthTimeStr || '12:00').split(':').map((p) => parseInt(p, 10));
  const birthHour = isNaN(timeParts[0]) ? 12 : timeParts[0];
  const birthMinute = isNaN(timeParts[1]) ? 0 : timeParts[1];

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

  // 6. Geographic Current & Ascendant Calculation
  const geographicOrigins = calculateGeographicNatalCurrents({
    year,
    month,
    day,
    hour: birthHour,
    minute: birthMinute,
    city,
  });

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
    geographicOrigins,
  };
}
