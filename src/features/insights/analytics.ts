/**
 * GnosticOS — On-Device Esoteric Insight & Analytics Engine
 *
 * 100% Client-Side zero-knowledge statistical processing over decrypted in-memory journal records.
 * Analyzes:
 *   1. Planetary Timing vs. Resonance Correlation (Saturn through Moon, Diurnal vs Nocturnal)
 *   2. Lunar Phase & Illumination vs. Working Efficacy
 *   3. Entity & Tunnel of Set Communion Efficacy Rankings
 *   4. Emotional Transformation Vectors (Ante -> Post Alchemical shifts)
 *   5. Offering Synergies & Potency
 */

import { JournalEntryData, EntityData, TunnelData } from '../../platform/vault';
import { Planet, MoonPhaseName, PLANETARY_CORRESPONDENCES } from '../ephemeris/planetaryHours';

export interface PlanetaryResonanceStat {
  planet: Planet;
  title: string;
  symbol: string;
  count: number;
  avgResonance: number;
  highestResonance: number;
  dominantWorkingType?: string;
}

export interface LunarResonanceStat {
  phase: MoonPhaseName;
  label: string;
  count: number;
  avgResonance: number;
  highestResonance: number;
}

export interface EntityResonanceStat {
  entityId: number;
  entityName: string;
  pantheon: string;
  count: number;
  avgResonance: number;
  highestResonance: number;
}

export interface TunnelResonanceStat {
  tunnelId: number;
  tunnelNumber: number;
  tunnelName: string;
  musicalKey: string;
  count: number;
  avgResonance: number;
}

export interface EmotionalShiftPair {
  anteState: string;
  postState: string;
  count: number;
  percentage: number;
  avgResonance: number;
}

export interface OfferingPotencyStat {
  kind: string;
  label: string;
  count: number;
  avgResonance: number;
}

export interface WorkingTypeStat {
  workingType: string;
  count: number;
  avgResonance: number;
}

export interface EsotericInsights {
  totalWorkings: number;
  averageResonance: number;
  diurnalAvgResonance: number;
  nocturnalAvgResonance: number;
  diurnalCount: number;
  nocturnalCount: number;
  planetaryStats: PlanetaryResonanceStat[];
  lunarStats: LunarResonanceStat[];
  topEntities: EntityResonanceStat[];
  topTunnels: TunnelResonanceStat[];
  emotionalShifts: EmotionalShiftPair[];
  offeringStats: OfferingPotencyStat[];
  workingTypeStats: WorkingTypeStat[];
  highestResonanceRuler: PlanetaryResonanceStat | null;
  highestResonancePhase: LunarResonanceStat | null;
  highestResonanceEntity: EntityResonanceStat | null;
}

const LUNAR_PHASE_LABELS: Record<MoonPhaseName, string> = {
  new: 'New Moon',
  waxing_crescent: 'Waxing Crescent',
  first_quarter: 'First Quarter',
  waxing_gibbous: 'Waxing Gibbous',
  full: 'Full Moon',
  waning_gibbous: 'Waning Gibbous',
  last_quarter: 'Last Quarter',
  waning_crescent: 'Waning Crescent',
};

const ALL_PLANETS: Planet[] = [
  'saturn',
  'jupiter',
  'mars',
  'sun',
  'venus',
  'mercury',
  'moon',
];

const ALL_LUNAR_PHASES: MoonPhaseName[] = [
  'new',
  'waxing_crescent',
  'first_quarter',
  'waxing_gibbous',
  'full',
  'waning_gibbous',
  'last_quarter',
  'waning_crescent',
];

export function computeEsotericInsights(
  entries: JournalEntryData[],
  entities: EntityData[],
  tunnels: TunnelData[],
): EsotericInsights {
  if (!entries || entries.length === 0) {
    return {
      totalWorkings: 0,
      averageResonance: 0,
      diurnalAvgResonance: 0,
      nocturnalAvgResonance: 0,
      diurnalCount: 0,
      nocturnalCount: 0,
      planetaryStats: ALL_PLANETS.map((p) => ({
        planet: p,
        title: PLANETARY_CORRESPONDENCES[p].title,
        symbol: PLANETARY_CORRESPONDENCES[p].symbol,
        count: 0,
        avgResonance: 0,
        highestResonance: 0,
      })),
      lunarStats: ALL_LUNAR_PHASES.map((ph) => ({
        phase: ph,
        label: LUNAR_PHASE_LABELS[ph],
        count: 0,
        avgResonance: 0,
        highestResonance: 0,
      })),
      topEntities: [],
      topTunnels: [],
      emotionalShifts: [],
      offeringStats: [],
      workingTypeStats: [],
      highestResonanceRuler: null,
      highestResonancePhase: null,
      highestResonanceEntity: null,
    };
  }

  const entityMap = new Map<number, EntityData>(entities.map((e) => [e.id, e]));
  const tunnelMap = new Map<number, TunnelData>(tunnels.map((t) => [t.id, t]));

  let totalResonanceSum = 0;
  let validResonanceCount = 0;

  let diurnalSum = 0;
  let diurnalCount = 0;
  let nocturnalSum = 0;
  let nocturnalCount = 0;

  // Planetary accumulations
  const planetBuckets = new Map<
    Planet,
    { sum: number; count: number; max: number; types: Map<string, number> }
  >();
  ALL_PLANETS.forEach((p) => {
    planetBuckets.set(p, { sum: 0, count: 0, max: 0, types: new Map() });
  });

  // Lunar accumulations
  const lunarBuckets = new Map<MoonPhaseName, { sum: number; count: number; max: number }>();
  ALL_LUNAR_PHASES.forEach((ph) => {
    lunarBuckets.set(ph, { sum: 0, count: 0, max: 0 });
  });

  // Working type accumulations
  const workingTypeBuckets = new Map<string, { sum: number; count: number }>();

  // Entity accumulations
  const entityBuckets = new Map<number, { sum: number; count: number; max: number }>();

  // Tunnel accumulations
  const tunnelBuckets = new Map<number, { sum: number; count: number }>();

  // Emotional transition accumulations
  const shiftBuckets = new Map<string, { ante: string; post: string; count: number; resSum: number }>();

  // Offering accumulations
  const offeringBuckets = new Map<string, { sum: number; count: number }>();

  for (const entry of entries) {
    const res = entry.resonance ?? 5;
    totalResonanceSum += res;
    validResonanceCount++;

    // Diurnal / Nocturnal
    if (entry.is_nocturnal) {
      nocturnalSum += res;
      nocturnalCount++;
    } else {
      diurnalSum += res;
      diurnalCount++;
    }

    // Planetary Hour
    const p = (entry.planetary_hour?.toLowerCase() || 'saturn') as Planet;
    if (planetBuckets.has(p)) {
      const pb = planetBuckets.get(p)!;
      pb.sum += res;
      pb.count++;
      if (res > pb.max) pb.max = res;
      if (entry.working_type) {
        pb.types.set(entry.working_type, (pb.types.get(entry.working_type) || 0) + 1);
      }
    }

    // Lunar Phase
    const ph = (entry.moon_phase || 'new') as MoonPhaseName;
    if (lunarBuckets.has(ph)) {
      const lb = lunarBuckets.get(ph)!;
      lb.sum += res;
      lb.count++;
      if (res > lb.max) lb.max = res;
    }

    // Working Type
    const wt = entry.working_type || 'invocation';
    if (!workingTypeBuckets.has(wt)) {
      workingTypeBuckets.set(wt, { sum: 0, count: 0 });
    }
    const wtb = workingTypeBuckets.get(wt)!;
    wtb.sum += res;
    wtb.count++;

    // Tunnel
    if (entry.tunnel_id) {
      if (!tunnelBuckets.has(entry.tunnel_id)) {
        tunnelBuckets.set(entry.tunnel_id, { sum: 0, count: 0 });
      }
      const tb = tunnelBuckets.get(entry.tunnel_id)!;
      tb.sum += res;
      tb.count++;
    }

    // Entities
    if (entry.entities && entry.entities.length > 0) {
      for (const ep of entry.entities) {
        if (!entityBuckets.has(ep.entity_id)) {
          entityBuckets.set(ep.entity_id, { sum: 0, count: 0, max: 0 });
        }
        const eb = entityBuckets.get(ep.entity_id)!;
        eb.sum += res;
        eb.count++;
        if (res > eb.max) eb.max = res;
      }
    }

    // Emotional Shifts
    const ante = entry.pre_state_label || 'Neutral / Seeking Gnosis';
    const post = entry.post_state_label || 'Grounded Equilibrium';
    const key = `${ante}__->${post}`;
    if (!shiftBuckets.has(key)) {
      shiftBuckets.set(key, { ante, post, count: 0, resSum: 0 });
    }
    const sb = shiftBuckets.get(key)!;
    sb.count++;
    sb.resSum += res;

    // Offerings
    if (entry.offerings && entry.offerings.length > 0) {
      for (const off of entry.offerings) {
        const k = off.kind || 'other';
        if (!offeringBuckets.has(k)) {
          offeringBuckets.set(k, { sum: 0, count: 0 });
        }
        const ob = offeringBuckets.get(k)!;
        ob.sum += res;
        ob.count++;
      }
    }
  }

  // Format Planetary Stats
  const planetaryStats: PlanetaryResonanceStat[] = ALL_PLANETS.map((planet) => {
    const b = planetBuckets.get(planet)!;
    let dominantType: string | undefined;
    let maxTypeCount = 0;
    b.types.forEach((cnt, t) => {
      if (cnt > maxTypeCount) {
        maxTypeCount = cnt;
        dominantType = t;
      }
    });

    return {
      planet,
      title: PLANETARY_CORRESPONDENCES[planet].title,
      symbol: PLANETARY_CORRESPONDENCES[planet].symbol,
      count: b.count,
      avgResonance: b.count > 0 ? Math.round((b.sum / b.count) * 10) / 10 : 0,
      highestResonance: b.max,
      dominantWorkingType: dominantType,
    };
  });

  // Format Lunar Stats
  const lunarStats: LunarResonanceStat[] = ALL_LUNAR_PHASES.map((phase) => {
    const b = lunarBuckets.get(phase)!;
    return {
      phase,
      label: LUNAR_PHASE_LABELS[phase],
      count: b.count,
      avgResonance: b.count > 0 ? Math.round((b.sum / b.count) * 10) / 10 : 0,
      highestResonance: b.max,
    };
  });

  // Format Entity Stats
  const topEntities: EntityResonanceStat[] = Array.from(entityBuckets.entries())
    .map(([eid, b]) => {
      const ent = entityMap.get(eid);
      return {
        entityId: eid,
        entityName: ent?.name || `Entity #${eid}`,
        pantheon: ent?.pantheon || 'seed',
        count: b.count,
        avgResonance: b.count > 0 ? Math.round((b.sum / b.count) * 10) / 10 : 0,
        highestResonance: b.max,
      };
    })
    .sort((a, b) => b.avgResonance - a.avgResonance || b.count - a.count);

  // Format Tunnel Stats
  const topTunnels: TunnelResonanceStat[] = Array.from(tunnelBuckets.entries())
    .map(([tid, b]) => {
      const t = tunnelMap.get(tid);
      return {
        tunnelId: tid,
        tunnelNumber: t?.number || tid,
        tunnelName: t?.name || `Tunnel #${tid}`,
        musicalKey: t?.musical_key || 'C',
        count: b.count,
        avgResonance: b.count > 0 ? Math.round((b.sum / b.count) * 10) / 10 : 0,
      };
    })
    .sort((a, b) => b.avgResonance - a.avgResonance || b.count - a.count);

  // Format Emotional Shifts
  const emotionalShifts: EmotionalShiftPair[] = Array.from(shiftBuckets.values())
    .map((b) => ({
      anteState: b.ante,
      postState: b.post,
      count: b.count,
      percentage: Math.round((b.count / entries.length) * 100),
      avgResonance: Math.round((b.resSum / b.count) * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count);

  // Format Offering Stats
  const offeringLabels: Record<string, string> = {
    incense: "Incense & Oleums",
    candle: "Consecrated Candles",
    drink: "Libations (Wine/Mead)",
    blood: "Vital Essence / Blood",
    art: "Hand-Drawn Sigils",
    devotion: "Enn Chants & Mantras",
    food: "Food & Salt",
    other: "Other Offerings",
  };

  const offeringStats: OfferingPotencyStat[] = Array.from(offeringBuckets.entries())
    .map(([k, b]) => ({
      kind: k,
      label: offeringLabels[k] || k,
      count: b.count,
      avgResonance: b.count > 0 ? Math.round((b.sum / b.count) * 10) / 10 : 0,
    }))
    .sort((a, b) => b.avgResonance - a.avgResonance);

  // Format Working Types
  const workingTypeStats: WorkingTypeStat[] = Array.from(workingTypeBuckets.entries())
    .map(([wt, b]) => ({
      workingType: wt,
      count: b.count,
      avgResonance: b.count > 0 ? Math.round((b.sum / b.count) * 10) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Best performers
  const planetaryWithWorkings = planetaryStats.filter((p) => p.count > 0);
  const highestResonanceRuler =
    planetaryWithWorkings.length > 0
      ? planetaryWithWorkings.reduce((max, p) => (p.avgResonance > max.avgResonance ? p : max))
      : null;

  const lunarWithWorkings = lunarStats.filter((l) => l.count > 0);
  const highestResonancePhase =
    lunarWithWorkings.length > 0
      ? lunarWithWorkings.reduce((max, l) => (l.avgResonance > max.avgResonance ? l : max))
      : null;

  const highestResonanceEntity = topEntities.length > 0 ? topEntities[0] : null;

  return {
    totalWorkings: entries.length,
    averageResonance: validResonanceCount > 0 ? Math.round((totalResonanceSum / validResonanceCount) * 10) / 10 : 0,
    diurnalAvgResonance: diurnalCount > 0 ? Math.round((diurnalSum / diurnalCount) * 10) / 10 : 0,
    nocturnalAvgResonance: nocturnalCount > 0 ? Math.round((nocturnalSum / nocturnalCount) * 10) / 10 : 0,
    diurnalCount,
    nocturnalCount,
    planetaryStats,
    lunarStats,
    topEntities,
    topTunnels,
    emotionalShifts,
    offeringStats,
    workingTypeStats,
    highestResonanceRuler,
    highestResonancePhase,
    highestResonanceEntity,
  };
}
