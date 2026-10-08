import React, { useState, useMemo } from 'react';
import { JournalEntryData, EntityData, TunnelData } from '../../platform/vault';
import { WORKING_TYPE_LABELS, WorkingType } from './types';
import SanctumDropdown from '../ui/SanctumDropdown';
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  Moon,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface JournalListProps {
  entries: JournalEntryData[];
  entities: EntityData[];
  tunnels: TunnelData[];
  onNewEntry: () => void;
  onEditEntry: (entry: JournalEntryData) => void;
  onDeleteEntry: (id: string) => Promise<void>;
}

export const JournalList: React.FC<JournalListProps> = ({
  entries,
  entities,
  tunnels,
  onNewEntry,
  onEditEntry,
  onDeleteEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWorkingType, setFilterWorkingType] = useState<string>('all');
  const [minResonance, setMinResonance] = useState<number>(1);

  // Entities lookup map
  const entityMap = useMemo(() => {
    return new Map<number, EntityData>(entities.map((e) => [e.id, e]));
  }, [entities]);

  const tunnelMap = useMemo(() => {
    return new Map<number, TunnelData>(tunnels.map((t) => [t.id, t]));
  }, [tunnels]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (filterWorkingType !== 'all' && e.working_type !== filterWorkingType) {
        return false;
      }
      if ((e.resonance ?? 0) < minResonance) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesBody = e.body_md.toLowerCase().includes(q);
        const matchesVisions = e.visions?.toLowerCase().includes(q) ?? false;
        const matchesEntity = e.entities.some((ep) => {
          const name = entityMap.get(ep.entity_id)?.name.toLowerCase() || '';
          return name.includes(q);
        });
        if (!matchesTitle && !matchesBody && !matchesVisions && !matchesEntity) {
          return false;
        }
      }
      return true;
    });
  }, [entries, filterWorkingType, minResonance, searchQuery, entityMap]);

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-black text-neutral-200 flex flex-col gap-6 select-none">
      {/* Header & New Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wider text-neutral-100 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-red-500" />
            Alchemical Journal & Grimoire Records
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Encrypted Personal Magical Logbook • Ephemeris & Planetary Hour Correlation
          </p>
        </div>

        <button
          onClick={onNewEntry}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-serif text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" /> RECORD NEW RITUAL
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 glass-panel p-3.5 rounded-xl border border-neutral-800">
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records by title, entities, or channeled visions..."
            className="w-full bg-black/80 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-neutral-200 placeholder:text-neutral-600 focus:border-red-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="sm:col-span-3">
          <SanctumDropdown
            options={[
              { value: 'all', label: 'All Working Types' },
              ...Object.keys(WORKING_TYPE_LABELS).map((wt) => ({
                value: wt,
                label: WORKING_TYPE_LABELS[wt as WorkingType].label,
              })),
            ]}
            value={filterWorkingType}
            onChange={setFilterWorkingType}
            width="w-full"
            placeholder="Working Type..."
          />
        </div>

        <div className="sm:col-span-3">
          <SanctumDropdown
            options={[
              { value: '1', label: 'Resonance: Any (1+)' },
              { value: '5', label: 'Resonance: Balanced (5+)' },
              { value: '7', label: 'Resonance: High (7+)' },
              { value: '9', label: 'Resonance: Apex (9+)' },
            ]}
            value={String(minResonance)}
            onChange={(val) => setMinResonance(Number(val))}
            width="w-full"
            placeholder="Min Resonance..."
          />
        </div>
      </div>

      {/* Timeline List */}
      {filteredEntries.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
          <Flame className="w-10 h-10 text-neutral-600 mb-3" />
          <h3 className="font-serif text-lg font-bold text-neutral-300">No Ritual Records Found</h3>
          <p className="font-mono text-xs text-neutral-500 mt-1 max-w-sm">
            Begin your work by recording an invocation, pathworking, or astral meditation.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredEntries.map((entry) => {
            const wtInfo =
              WORKING_TYPE_LABELS[entry.working_type as WorkingType] ||
              WORKING_TYPE_LABELS.invocation;
            const dateStr = new Date(entry.ritual_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={entry.id}
                className="glass-panel p-5 rounded-xl border border-neutral-800/90 hover:border-neutral-700 transition-all flex flex-col gap-4 shadow-lg"
              >
                {/* Entry Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider ${wtInfo.color}`}
                    >
                      {wtInfo.label}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {entry.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-neutral-400">
                      {dateStr}
                    </span>
                    <button
                      onClick={() => onEditEntry(entry)}
                      className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all"
                      title="Edit Entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ritual entry "${entry.title}"?`)) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      className="p-1.5 rounded hover:bg-red-950/60 text-neutral-500 hover:text-red-400 transition-all"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Correspondence & Ephemeris Strip */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
                  {/* Planetary Hour */}
                  {entry.planetary_hour && (
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      Hour of <strong className="capitalize">{entry.planetary_hour}</strong> (
                      {entry.is_nocturnal ? 'Night' : 'Day'})
                    </span>
                  )}

                  {/* Moon Phase */}
                  {entry.moon_phase && (
                    <span className="flex items-center gap-1.5 text-blue-300">
                      <Moon className="w-3.5 h-3.5" />
                      {entry.moon_phase.replace('_', ' ')} (
                      {Math.round((entry.moon_illumination ?? 0) * 100)}%)
                    </span>
                  )}

                  {/* Resonance Rating */}
                  <span className="flex items-center gap-1 text-red-400 font-bold ml-auto">
                    <Flame className="w-3.5 h-3.5" />
                    Resonance: {entry.resonance}/10
                  </span>
                </div>

                {/* Emotional State Shift */}
                {(entry.pre_state_label || entry.post_state_label) && (
                  <div className="flex items-center gap-2 text-xs font-mono bg-black/60 px-3 py-1.5 rounded-lg border border-neutral-800/80 w-fit">
                    <span className="text-neutral-500">ANTE:</span>
                    <span className="text-neutral-300">{entry.pre_state_label || 'Neutral'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-neutral-500">POST:</span>
                    <span className="text-purple-300 font-semibold">
                      {entry.post_state_label || 'Equilibrium'}
                    </span>
                  </div>
                )}

                {/* Channeled Impressions Callout */}
                {entry.visions && (
                  <div className="p-3 rounded-lg bg-purple-950/20 border-l-2 border-purple-500 text-xs font-mono text-purple-200">
                    <span className="text-[10px] uppercase text-purple-400 block font-bold mb-1">
                      Channeled Impressions & Visions:
                    </span>
                    <p className="italic leading-relaxed">{entry.visions}</p>
                  </div>
                )}

                {/* Markdown snippet */}
                {entry.body_md && (
                  <p className="text-xs font-sans text-neutral-300 line-clamp-3 leading-relaxed">
                    {entry.body_md}
                  </p>
                )}

                {/* Footer tags (Entities and Offerings) */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800/60 text-xs font-mono flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {entry.entities.map((ep) => {
                      const ent = entityMap.get(ep.entity_id);
                      return (
                        <span
                          key={ep.entity_id}
                          className="px-2 py-0.5 rounded bg-red-950/40 border border-red-900/60 text-red-200 text-[11px]"
                        >
                          {ent?.name || `Entity #${ep.entity_id}`}
                        </span>
                      );
                    })}
                    {entry.tunnel_id && (
                      <span className="px-2 py-0.5 rounded bg-purple-950/40 border border-purple-900/60 text-purple-300 text-[11px]">
                        Tunnel #{tunnelMap.get(entry.tunnel_id)?.number || entry.tunnel_id}
                      </span>
                    )}
                  </div>

                  {entry.offerings.length > 0 && (
                    <span className="text-neutral-500 text-[11px]">
                      Offerings: {entry.offerings.map((o) => o.kind).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JournalList;
