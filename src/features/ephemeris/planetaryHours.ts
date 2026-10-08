/**
 * GnosticOS — Astronomical & Planetary Hours Engine
 *
 * Implements high-precision solar algorithms (NOAA/Jean Meeus) and lunar ephemeris.
 * Computes:
 *  - Diurnal & Nocturnal planetary hours dividing true daylight and nighttime into 12 equal hours each.
 *  - Classical Chaldean planetary hour rulers (Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon).
 *  - Daemonolatry / Qliphothic correspondences for each planetary hour.
 *  - Lunar phase name, lunar age in days, and illumination percentage.
 */

export type Planet =
  | 'saturn'
  | 'jupiter'
  | 'mars'
  | 'sun'
  | 'venus'
  | 'mercury'
  | 'moon';

export const CHALDEAN_ORDER: readonly Planet[] = [
  'saturn',
  'jupiter',
  'mars',
  'sun',
  'venus',
  'mercury',
  'moon',
] as const;

/** Day rulers based on day of week (0 = Sunday, 1 = Monday ... 6 = Saturday) */
export const DAY_RULERS: readonly Planet[] = [
  'sun',      // Sunday
  'moon',     // Monday
  'mars',     // Tuesday
  'mercury',  // Wednesday
  'jupiter',  // Thursday
  'venus',    // Friday
  'saturn',   // Saturday
] as const;

export interface PlanetCorrespondence {
  planet: Planet;
  title: string;
  symbol: string;
  demonicRulers: string[];
  tunnelNumber: number;
  tunnelName: string;
  magickalAffinities: string[];
}

export const PLANETARY_CORRESPONDENCES: Record<Planet, PlanetCorrespondence> = {
  saturn: {
    planet: 'saturn',
    title: 'Saturn / Chronos',
    symbol: '♄',
    demonicRulers: ['Belial', 'Lucifuge Rofocale'],
    tunnelNumber: 32,
    tunnelName: 'Thantifaxath',
    magickalAffinities: ['Death Posture', 'Dissolution', 'Deep Trance', 'Binding', 'Abyssal Gnosis'],
  },
  jupiter: {
    planet: 'jupiter',
    title: 'Jupiter / Zeus',
    symbol: '♃',
    demonicRulers: ['Azazel', 'Verrine'],
    tunnelNumber: 21,
    tunnelName: 'Kurgasiax',
    magickalAffinities: ['Expansion', 'Wealth', 'Ascendancy', 'Apotheosis', 'Sovereignty'],
  },
  mars: {
    planet: 'mars',
    title: 'Mars / Ares',
    symbol: '♂',
    demonicRulers: ['Flereous', 'Parfaxitas'],
    tunnelNumber: 27,
    tunnelName: 'Parfaxitas',
    magickalAffinities: ['Destruction of Dogma', 'Wrathful Energy', 'Black Flame', 'Courage', 'Protection'],
  },
  sun: {
    planet: 'sun',
    title: 'Sun / Sorath',
    symbol: '☉',
    demonicRulers: ['Lucifer', 'Satan'],
    tunnelNumber: 30,
    tunnelName: 'Raflifu',
    magickalAffinities: ['Illumination', 'Black Sun Gnosis', 'Willpower', 'Charisma', 'Spiritual Vitality'],
  },
  venus: {
    planet: 'venus',
    title: 'Venus / Babalon',
    symbol: '♀',
    demonicRulers: ['Unsere', 'Astaroth'],
    tunnelNumber: 14,
    tunnelName: 'Dagdagiel',
    magickalAffinities: ['Sacred Eros', 'Creative Passion', 'Babalon Current', 'Fascination', 'Glamour'],
  },
  mercury: {
    planet: 'mercury',
    title: 'Mercury / Hermes',
    symbol: '☿',
    demonicRulers: ['Lucifer', 'Baratchial'],
    tunnelNumber: 12,
    tunnelName: 'Baratchial',
    magickalAffinities: ['Alchemical Intellect', 'Gnosis', 'Sigil Creation', 'Channeling', 'Communication'],
  },
  moon: {
    planet: 'moon',
    title: 'Moon / Hecate',
    symbol: '☽',
    demonicRulers: ['Leviathan', 'Unsere'],
    tunnelNumber: 13,
    tunnelName: 'Gargophias',
    magickalAffinities: ['Astral Scrying', 'Dream Incubations', 'Subconscious Shadows', 'Necromancy', 'Water Rites'],
  },
};

// -----------------------------------------------------------------------------
// Solar Ephemeris & Sun Transit Calculations
// -----------------------------------------------------------------------------
const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

function toJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function fromJulianDate(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

export interface SolarTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  isPolarDay: boolean;
  isPolarNight: boolean;
}

/**
 * Calculates solar transit, sunrise, and sunset for given coordinates.
 */
export function calculateSolarTimes(date: Date, lat: number, lng: number): SolarTimes {
  // Midnight UTC of target date
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
  const jd = toJulianDate(utcDate);
  const n = jd - 2451545.0 + 0.0008; // Julian days since J2000.0

  // Mean solar noon
  const Jstar = n - lng / 360;
  // Solar mean anomaly
  const M = (357.5291 + 0.98560028 * Jstar) % 360;
  const Mrad = M * RAD;
  // Center
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad);
  // Ecliptic longitude
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = lambda * RAD;

  // Solar transit (Solar Noon)
  const Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad);

  // Declination of the Sun
  const sinDec = Math.sin(lambdaRad) * Math.sin(23.44 * RAD);
  const cosDec = Math.sqrt(1 - sinDec * sinDec);

  // Hour angle (altitude = -0.833° accounting for atmospheric refraction)
  const phiRad = lat * RAD;
  const cosOmega0 = (Math.sin(-0.833 * RAD) - Math.sin(phiRad) * sinDec) / (Math.cos(phiRad) * cosDec);

  let isPolarDay = false;
  let isPolarNight = false;
  let omega0Deg = 90; // fallback

  if (cosOmega0 > 1) {
    isPolarNight = true;
  } else if (cosOmega0 < -1) {
    isPolarDay = true;
  } else {
    omega0Deg = Math.acos(cosOmega0) * DEG;
  }

  const Jrise = Jtransit - omega0Deg / 360;
  const Jset = Jtransit + omega0Deg / 360;

  return {
    sunrise: fromJulianDate(Jrise),
    sunset: fromJulianDate(Jset),
    solarNoon: fromJulianDate(Jtransit),
    isPolarDay,
    isPolarNight,
  };
}

// -----------------------------------------------------------------------------
// Planetary Hours Calculation
// -----------------------------------------------------------------------------
export interface PlanetaryHour {
  hourIndex: number; // 1 to 24 (1-12 Diurnal, 13-24 Nocturnal)
  isNocturnal: boolean;
  planet: Planet;
  correspondence: PlanetCorrespondence;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
}

export interface DayPlanetarySchedule {
  magickalDayRuler: Planet;
  sunrise: Date;
  sunset: Date;
  nextSunrise: Date;
  hours: PlanetaryHour[];
}

export function calculatePlanetaryHours(
  targetDate: Date,
  lat = 51.5074, // Default London
  lng = -0.1278,
): DayPlanetarySchedule {
  const currentSolar = calculateSolarTimes(targetDate, lat, lng);
  const nextDay = new Date(targetDate.getTime() + 86400000);
  const nextSolar = calculateSolarTimes(nextDay, lat, lng);
  const prevDay = new Date(targetDate.getTime() - 86400000);
  const prevSolar = calculateSolarTimes(prevDay, lat, lng);

  // In Magickal astrology, if the current time is before today's sunrise,
  // we are in the nocturnal hours of the PREVIOUS magickal day!
  let sunrise = currentSolar.sunrise;
  let sunset = currentSolar.sunset;
  let nextSunrise = nextSolar.sunrise;
  let referenceDateForDayRuler = targetDate;

  if (targetDate.getTime() < sunrise.getTime()) {
    // We are in the nocturnal hours of yesterday's magical day
    sunrise = prevSolar.sunrise;
    sunset = prevSolar.sunset;
    nextSunrise = currentSolar.sunrise;
    referenceDateForDayRuler = prevDay;
  }

  // Day ruler determined by day of week of the sunrise
  const dayOfWeek = referenceDateForDayRuler.getDay();
  const dayRuler = DAY_RULERS[dayOfWeek];

  const diurnalDurationMs = (sunset.getTime() - sunrise.getTime()) / 12;
  const nocturnalDurationMs = (nextSunrise.getTime() - sunset.getTime()) / 12;

  const startChaldeanIdx = CHALDEAN_ORDER.indexOf(dayRuler);
  const hours: PlanetaryHour[] = [];

  // 12 Diurnal Hours
  for (let i = 0; i < 12; i++) {
    const planetIdx = (startChaldeanIdx + i) % 7;
    const planet = CHALDEAN_ORDER[planetIdx];
    const startTime = new Date(sunrise.getTime() + i * diurnalDurationMs);
    const endTime = new Date(sunrise.getTime() + (i + 1) * diurnalDurationMs);

    hours.push({
      hourIndex: i + 1,
      isNocturnal: false,
      planet,
      correspondence: PLANETARY_CORRESPONDENCES[planet],
      startTime,
      endTime,
      durationMinutes: Math.round(diurnalDurationMs / 60000),
    });
  }

  // 12 Nocturnal Hours
  for (let i = 0; i < 12; i++) {
    const planetIdx = (startChaldeanIdx + 12 + i) % 7;
    const planet = CHALDEAN_ORDER[planetIdx];
    const startTime = new Date(sunset.getTime() + i * nocturnalDurationMs);
    const endTime = new Date(sunset.getTime() + (i + 1) * nocturnalDurationMs);

    hours.push({
      hourIndex: 13 + i,
      isNocturnal: true,
      planet,
      correspondence: PLANETARY_CORRESPONDENCES[planet],
      startTime,
      endTime,
      durationMinutes: Math.round(nocturnalDurationMs / 60000),
    });
  }

  return {
    magickalDayRuler: dayRuler,
    sunrise,
    sunset,
    nextSunrise,
    hours,
  };
}

// -----------------------------------------------------------------------------
// Lunar Ephemeris
// -----------------------------------------------------------------------------
export type MoonPhaseName =
  | 'new'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export interface LunarState {
  phase: MoonPhaseName;
  phaseLabel: string;
  ageDays: number;
  illuminationPct: number;
  isWaxing: boolean;
  description: string;
}

const SYNODIC_MONTH = 29.53058867;
// Reference Known New Moon: 2000-01-06 18:14 UTC (JD 2451549.26)
const KNOWN_NEW_MOON_JD = 2451549.26;

export function calculateLunarState(date: Date = new Date()): LunarState {
  const jd = toJulianDate(date);
  const daysSinceNew = (jd - KNOWN_NEW_MOON_JD) % SYNODIC_MONTH;
  const ageDays = (daysSinceNew + SYNODIC_MONTH) % SYNODIC_MONTH;

  // Phase angle [0, 360)
  const phaseAngle = (ageDays / SYNODIC_MONTH) * 360;
  // Illumination percentage
  const illumination = 0.5 * (1 - Math.cos(phaseAngle * RAD));
  const illuminationPct = Math.round(illumination * 100);

  const isWaxing = ageDays < SYNODIC_MONTH / 2;

  let phase: MoonPhaseName = 'new';
  let phaseLabel = 'New Moon';
  let description = 'Dark moon of Lilith & Hecate. Prime for scrying, shadow work, and banishings.';

  if (phaseAngle >= 337.5 || phaseAngle < 22.5) {
    phase = 'new';
    phaseLabel = 'New Moon';
    description = 'Dark Moon: deep silence, introspection, seed invocations, and subterranean rites.';
  } else if (phaseAngle >= 22.5 && phaseAngle < 67.5) {
    phase = 'waxing_crescent';
    phaseLabel = 'Waxing Crescent';
    description = 'Growing horned moon: awakening power, initial sparks of the Black Flame, and intent consecration.';
  } else if (phaseAngle >= 67.5 && phaseAngle < 112.5) {
    phase = 'first_quarter';
    phaseLabel = 'First Quarter';
    description = 'Equilibrium of darkness and light: overcoming inertia, decisive willpower, and martial rites.';
  } else if (phaseAngle >= 112.5 && phaseAngle < 157.5) {
    phase = 'waxing_gibbous';
    phaseLabel = 'Waxing Gibbous';
    description = 'Swelling potency: deepening gnosis, expanding astral sight, and refinement of the Work.';
  } else if (phaseAngle >= 157.5 && phaseAngle < 202.5) {
    phase = 'full';
    phaseLabel = 'Full Moon';
    description = 'Peak astral illumination: full evocations, apex Draconian power, and Babalon current rites.';
  } else if (phaseAngle >= 202.5 && phaseAngle < 247.5) {
    phase = 'waning_gibbous';
    phaseLabel = 'Waning Gibbous';
    description = 'Distillation of gnosis: journaling revelations, gratitude offerings, and mental alchemy.';
  } else if (phaseAngle >= 247.5 && phaseAngle < 292.5) {
    phase = 'last_quarter';
    phaseLabel = 'Last Quarter';
    description = 'Severing and dismantling: breaking slave conditioning, habit destruction, and releasing obsolete bonds.';
  } else {
    phase = 'waning_crescent';
    phaseLabel = 'Waning Crescent';
    description = 'Balsamic crescent: quiet void before rebirth, dream scrying, and surrender to the Abyss.';
  }

  return {
    phase,
    phaseLabel,
    ageDays: Math.round(ageDays * 10) / 10,
    illuminationPct,
    isWaxing,
    description,
  };
}

// -----------------------------------------------------------------------------
// Unified Magickal Timing
// -----------------------------------------------------------------------------
export interface MagickalTiming {
  currentTime: Date;
  currentHour: PlanetaryHour;
  daySchedule: DayPlanetarySchedule;
  lunarState: LunarState;
  minutesRemainingInHour: number;
}

export function getCurrentMagickalTiming(
  lat = 51.5074,
  lng = -0.1278,
  date = new Date(),
): MagickalTiming {
  const schedule = calculatePlanetaryHours(date, lat, lng);
  const nowMs = date.getTime();

  // Find matching active hour
  let currentHour = schedule.hours.find(
    (h) => nowMs >= h.startTime.getTime() && nowMs < h.endTime.getTime(),
  );

  // If outside bounds (e.g. edge of day schedule boundary), pick closest
  if (!currentHour) {
    currentHour = schedule.hours[schedule.hours.length - 1];
  }

  const minutesRemainingInHour = Math.max(
    0,
    Math.round((currentHour.endTime.getTime() - nowMs) / 60000),
  );

  const lunarState = calculateLunarState(date);

  return {
    currentTime: date,
    currentHour,
    daySchedule: schedule,
    lunarState,
    minutesRemainingInHour,
  };
}
