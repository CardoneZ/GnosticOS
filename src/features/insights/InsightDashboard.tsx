import React, { useState, useMemo } from 'react';
import {
  JournalEntryData,
  EntityData,
  TunnelData,
  saveJournalEntry,
} from '../../platform/vault';
import { computeEsotericInsights } from './analytics';
import {
  BarChart3,
  Flame,
  Moon,
  Clock,
  Zap,
  TrendingUp,
  Award,
  PlusCircle,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface InsightDashboardProps {
  entries: JournalEntryData[];
  entities: EntityData[];
  tunnels: TunnelData[];
  onRefreshEntries?: () => Promise<void>;
  onNavigateToJournal?: () => void;
}

export const InsightDashboard: React.FC<InsightDashboardProps> = ({
  entries,
  entities,
  tunnels,
  onRefreshEntries,
  onNavigateToJournal,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | '30d' | '90d'>('all');
  const [isSeeding, setIsSeeding] = useState(false);

  // Filter entries by time if requested
  const filteredEntries = useMemo(() => {
    if (filterPeriod === 'all') return entries;
    const now = Date.now();
    const days = filterPeriod === '30d' ? 30 : 90;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return entries.filter((e) => new Date(e.ritual_at).getTime() >= cutoff);
  }, [entries, filterPeriod]);

  const insights = useMemo(() => {
    return computeEsotericInsights(filteredEntries, entities, tunnels);
  }, [filteredEntries, entities, tunnels]);

  // Seed sample working records for instant analytics exploration if empty
  const handleSeedDemonstrationData = async () => {
    setIsSeeding(true);
    try {
      const mockSeeds: Partial<JournalEntryData>[] = [
        {
          title: 'Luciferian Morning Star Evocation',
          ritual_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          planetary_hour: 'sun',
          is_nocturnal: 0,
          moon_phase: 'full',
          resonance: 9,
          working_type: 'evocation',
          tunnel_id: 30, // Raflifu
          pre_state_label: 'Mental Fog',
          post_state_label: 'Luciferian Illumination',
          body_md: 'Channeled intense radiant solar intellect. The Black Sun sigil burned emerald-gold.',
          offerings: [{ kind: 'incense', quantity: 'Frankincense & Gold Copal' }],
          entities: [{ entity_id: 2, intensity: 9, invoked: true }], // Lucifer
        },
        {
          title: 'Abyssal Scrying with Leviathan',
          ritual_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          planetary_hour: 'moon',
          is_nocturnal: 1,
          moon_phase: 'waxing_gibbous',
          resonance: 8,
          working_type: 'pathworking',
          tunnel_id: 23, // Malkunofat
          pre_state_label: 'Discord / Turmoil',
          post_state_label: 'Astral Lucidity',
          body_md: 'Obsidian mirror water surface dissolved into oceanic abyss. Serpents of Daath coiled.',
          offerings: [{ kind: 'drink', quantity: 'Dark Red Wine' }, { kind: 'devotion', quantity: 'Enn Mantras' }],
          entities: [{ entity_id: 6, intensity: 8, invoked: true }], // Leviathan
        },
        {
          title: 'Forge of Cain Martial Rites',
          ritual_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
          planetary_hour: 'mars',
          is_nocturnal: 1,
          moon_phase: 'first_quarter',
          resonance: 9,
          working_type: 'invocation',
          tunnel_id: 27, // Parfaxitas
          pre_state_label: 'Physical Inertia',
          post_state_label: 'Awakened Black Flame',
          body_md: 'Striking the inner anvil. Transmuted sluggish self-doubt into sharp aggressive focus.',
          offerings: [{ kind: 'blood', quantity: 'Vital Essence' }, { kind: 'candle', quantity: 'Black/Crimson' }],
          entities: [{ entity_id: 10, intensity: 9, invoked: true }], // Flereous
        },
        {
          title: 'Necromantic Dissolution at Midnight',
          ritual_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
          planetary_hour: 'saturn',
          is_nocturnal: 1,
          moon_phase: 'new',
          resonance: 10,
          working_type: 'invocation',
          tunnel_id: 32, // Thantifaxath
          pre_state_label: 'Anxiety / Agitation',
          post_state_label: 'Abyssal Silence',
          body_md: 'Death posture meditation. Complete silence and ego dissolution under Belial.',
          offerings: [{ kind: 'incense', quantity: "Dragon's Blood" }],
          entities: [{ entity_id: 7, intensity: 10, invoked: true }], // Belial
        },
        {
          title: 'Hermetic Cuneiform Script Channeling',
          ritual_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
          planetary_hour: 'mercury',
          is_nocturnal: 0,
          moon_phase: 'waxing_crescent',
          resonance: 8,
          working_type: 'divination',
          tunnel_id: 12, // Baratchial
          pre_state_label: 'Slave Morality / Guilt',
          post_state_label: 'Draconian Sovereignty',
          body_md: 'Stream of conscious automatic writing under Baratchial.',
          offerings: [{ kind: 'art', quantity: 'Drawn 9x9 Kamea Tablet' }],
          entities: [{ entity_id: 2, intensity: 8, invoked: true }],
        },
      ];

      for (const s of mockSeeds) {
        await saveJournalEntry({
          id: `demo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          ritual_at: s.ritual_at || new Date().toISOString(),
          tz_offset_min: 0,
          moon_phase: s.moon_phase || 'full',
          moon_illumination: 0.85,
          moon_age_days: 14,
          day_ruler: 'sun',
          planetary_hour: s.planetary_hour || 'sun',
          planetary_hour_index: 3,
          is_nocturnal: s.is_nocturnal || 0,
          resonance: s.resonance || 8,
          working_type: s.working_type || 'invocation',
          tunnel_id: s.tunnel_id || 11,
          title: s.title || 'Working',
          body_md: s.body_md || '',
          visions: 'Channeled visions of the Nightside Current.',
          pre_state_label: s.pre_state_label || 'Neutral',
          post_state_label: s.post_state_label || 'Illuminated',
          offerings: s.offerings || [],
          entities: s.entities || [],
        });
      }

      if (onRefreshEntries) {
        await onRefreshEntries();
      }
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-black text-neutral-200 flex flex-col gap-6 select-none font-sans">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wider text-white flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-red-500" />
            Esoteric Insight & Analytics Engine
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Zero-Knowledge On-Device Statistical Correlations • Ephemeris, Entities & Efficacy
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex rounded-lg bg-neutral-900 border border-neutral-800 p-0.5 text-xs font-mono">
            {(['all', '90d', '30d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  filterPeriod === period
                    ? 'bg-neutral-800 text-white font-semibold shadow'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {period === 'all' ? 'All Time' : period === '90d' ? '90 Days' : '30 Days'}
              </button>
            ))}
          </div>

          {onNavigateToJournal && (
            <button
              onClick={onNavigateToJournal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white text-xs font-mono transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
              Journal Records
            </button>
          )}

          {entries.length === 0 && (
            <button
              onClick={handleSeedDemonstrationData}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950/70 border border-red-700/60 text-red-300 hover:bg-red-900/80 text-xs font-mono transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              {isSeeding ? 'Seeding...' : 'Load Demo Records'}
            </button>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workings */}
        <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
              Total Recorded Rites
            </span>
            <span className="text-2xl font-serif font-bold text-white mt-1 block">
              {insights.totalWorkings}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {insights.diurnalCount} Diurnal • {insights.nocturnalCount} Nocturnal
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Mean Resonance */}
        <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
              Mean Resonance Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-serif font-bold text-amber-400">
                {insights.averageResonance}
              </span>
              <span className="text-xs font-mono text-neutral-500">/ 10</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              Night: {insights.nocturnalAvgResonance} • Day: {insights.diurnalAvgResonance}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Apex Planetary Ruler */}
        <div className="glass-panel p-4 rounded-xl border border-purple-900/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
              Optimal Planetary Hour
            </span>
            <span className="text-lg font-serif font-bold text-purple-300 mt-1 block capitalize truncate">
              {insights.highestResonanceRuler
                ? `${insights.highestResonanceRuler.symbol} ${insights.highestResonanceRuler.planet}`
                : 'Awaiting Data'}
            </span>
            <span className="text-[10px] font-mono text-purple-400">
              {insights.highestResonanceRuler
                ? `Avg ${insights.highestResonanceRuler.avgResonance}/10 (${insights.highestResonanceRuler.count} rites)`
                : 'Log more workings'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-950/70 border border-purple-800/60 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Apex Patron Divinity */}
        <div className="glass-panel p-4 rounded-xl border border-red-900/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
              Highest Resonance Entity
            </span>
            <span className="text-lg font-serif font-bold text-red-300 mt-1 block truncate">
              {insights.highestResonanceEntity
                ? insights.highestResonanceEntity.entityName
                : 'Awaiting Data'}
            </span>
            <span className="text-[10px] font-mono text-red-400">
              {insights.highestResonanceEntity
                ? `Peak ${insights.highestResonanceEntity.highestResonance}/10`
                : 'Commune in journal'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-950/70 border border-red-800/60 flex items-center justify-center text-red-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Analytics Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Planetary & Lunar Analysis (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Chart 1: Planetary Hour Resonance Bar Chart (SVG) */}
          <div className="glass-panel p-5 rounded-xl border border-neutral-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Planetary Hour vs. Mean Resonance
              </h2>
              <span className="text-[10px] font-mono text-neutral-500">Chaldean Order</span>
            </div>

            {/* Pure SVG Bar Chart */}
            <div className="w-full h-52 relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
                {/* Background Grid Lines */}
                {[2, 4, 6, 8, 10].map((val) => {
                  const y = 180 - (val / 10) * 150;
                  return (
                    <g key={val}>
                      <line
                        x1="40"
                        y1={y}
                        x2="680"
                        y2={y}
                        stroke="#262626"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x="30"
                        y={y + 3}
                        fill="#525252"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="end"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Bars for 7 Planets */}
                {insights.planetaryStats.map((p, idx) => {
                  const barWidth = 55;
                  const x = 65 + idx * 88;
                  const barHeight = (p.avgResonance / 10) * 150;
                  const y = 180 - barHeight;
                  const hasData = p.count > 0;

                  return (
                    <g key={p.planet} className="transition-all duration-300">
                      {/* Bar Background Track */}
                      <rect
                        x={x}
                        y="30"
                        width={barWidth}
                        height="150"
                        rx="4"
                        fill="#171717"
                        opacity="0.5"
                      />

                      {/* Active Fill Bar */}
                      {hasData && (
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx="4"
                          fill="url(#planetaryBarGrad)"
                          stroke="#ef4444"
                          strokeWidth="1"
                        />
                      )}

                      {/* Top Label (Resonance Score) */}
                      {hasData && (
                        <text
                          x={x + barWidth / 2}
                          y={y - 6}
                          fill="#facc15"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {p.avgResonance}
                        </text>
                      )}

                      {/* Planet Symbol */}
                      <text
                        x={x + barWidth / 2}
                        y="196"
                        fill={hasData ? '#ffffff' : '#737373'}
                        fontSize="13"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        {p.symbol}
                      </text>

                      {/* Planet Name */}
                      <text
                        x={x + barWidth / 2}
                        y="210"
                        fill="#a3a3a3"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="capitalize"
                      >
                        {p.planet.slice(0, 3)}
                      </text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="planetaryBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-3 border-t border-neutral-800/80">
              <span>Saturn: ♄ • Jupiter: ♃ • Mars: ♂ • Sol: ☉</span>
              <span>Venus: ♀ • Mercury: ☿ • Moon: ☽</span>
            </div>
          </div>

          {/* Chart 2: Lunar Phase Efficacy Radial Distribution */}
          <div className="glass-panel p-5 rounded-xl border border-neutral-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-400" />
                Lunar Phase Correlation Matrix
              </h2>
              <span className="text-[10px] font-mono text-neutral-500">8 Synodic Phases</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {insights.lunarStats.map((lunar) => {
                const hasData = lunar.count > 0;
                return (
                  <div
                    key={lunar.phase}
                    className={`p-3 rounded-lg border flex flex-col justify-between gap-2 transition-all ${
                      hasData
                        ? 'bg-neutral-900/80 border-blue-900/60 shadow-sm'
                        : 'bg-black/40 border-neutral-900 opacity-60'
                    }`}
                  >
                    <div>
                      <span className="text-[11px] font-mono text-neutral-300 font-semibold block truncate">
                        {lunar.label}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500">
                        {lunar.count} {lunar.count === 1 ? 'rite' : 'rites'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-neutral-800">
                      <span className="text-[10px] font-mono text-neutral-400">Resonance:</span>
                      <span
                        className={`text-sm font-mono font-bold ${
                          hasData ? 'text-blue-300' : 'text-neutral-600'
                        }`}
                      >
                        {hasData ? `${lunar.avgResonance}` : '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Entities, Emotional Shifts & Offerings (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Top Spirits & Entities Leaderboard */}
          <div className="glass-panel p-5 rounded-xl border border-neutral-800 flex flex-col gap-3">
            <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Entity Communion Efficacy
            </h2>

            {insights.topEntities.length === 0 ? (
              <p className="text-xs font-mono text-neutral-500 py-4 text-center">
                No spirit invocations recorded yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2 mt-1">
                {insights.topEntities.slice(0, 5).map((ent, idx) => (
                  <div
                    key={ent.entityId}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-950 border border-red-800 text-red-300 flex items-center justify-center text-[10px] font-mono font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-neutral-200 block">
                          {ent.entityName}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500 capitalize">
                          {ent.pantheon.replace('_', ' ')} • {ent.count} communions
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {ent.avgResonance} / 10
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500 block">
                        Peak: {ent.highestResonance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emotional Transformation Vector Matrix */}
          <div className="glass-panel p-5 rounded-xl border border-neutral-800 flex flex-col gap-3">
            <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Alchemical Transformation Vectors
            </h2>
            <p className="text-[10px] font-mono text-neutral-400">
              Frequency of Ante State $\rightarrow$ Post State internal shifts
            </p>

            {insights.emotionalShifts.length === 0 ? (
              <p className="text-xs font-mono text-neutral-500 py-4 text-center">
                Record Ante/Post states in the journal to view shifts.
              </p>
            ) : (
              <div className="flex flex-col gap-2 mt-1">
                {insights.emotionalShifts.slice(0, 4).map((shift, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-neutral-900/50 border border-neutral-800 text-xs font-mono flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-red-400 truncate max-w-[45%]">
                        {shift.anteState}
                      </span>
                      <span className="text-neutral-500 font-bold">$\longrightarrow$</span>
                      <span className="text-emerald-400 truncate max-w-[45%] text-right">
                        {shift.postState}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-800/60">
                      <span>Occurrences: {shift.count} ({shift.percentage}%)</span>
                      <span className="text-amber-400 font-bold">Avg Res: {shift.avgResonance}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offerings Efficacy Correlation */}
          <div className="glass-panel p-5 rounded-xl border border-neutral-800 flex flex-col gap-3">
            <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Offerings Potency Ranking
            </h2>

            {insights.offeringStats.length === 0 ? (
              <p className="text-xs font-mono text-neutral-500 py-4 text-center">
                No offerings recorded yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {insights.offeringStats.map((off) => (
                  <div
                    key={off.kind}
                    className="p-2 rounded-lg bg-neutral-900/40 border border-neutral-800 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-neutral-300 text-[11px] truncate">{off.label}</span>
                    <span className="text-purple-300 font-bold">{off.avgResonance}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightDashboard;
