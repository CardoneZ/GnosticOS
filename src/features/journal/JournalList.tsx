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
  HeartPulse,
  Download,
  Upload,
  History,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  exportVaultBackup,
  importVaultBackup,
  getRollingBackups,
  restoreRollingBackup,
} from '../../platform/vault';

interface JournalListProps {
  entries: JournalEntryData[];
  entities: EntityData[];
  tunnels: TunnelData[];
  onNewEntry: () => void;
  onEditEntry: (entry: JournalEntryData) => void;
  onDeleteEntry: (id: string) => Promise<void>;
  onRefreshEntries?: () => Promise<void>;
}

export const JournalList: React.FC<JournalListProps> = ({
  entries,
  entities,
  tunnels,
  onNewEntry,
  onEditEntry,
  onDeleteEntry,
  onRefreshEntries,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWorkingType, setFilterWorkingType] = useState<string>('all');
  const [minResonance, setMinResonance] = useState<number>(1);
  const [isBackupsModalOpen, setIsBackupsModalOpen] = useState<boolean>(false);
  const [backupSnapshots, setBackupSnapshots] = useState<any[]>([]);
  const [backupFeedback, setBackupFeedback] = useState<string | null>(null);

  const refreshBackups = async () => {
    const list = await getRollingBackups();
    setBackupSnapshots(list);
  };

  const handleExportBackup = async () => {
    try {
      const jsonStr = await exportVaultBackup();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `gnosticos-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupFeedback(`Backup exported successfully as ${filename}`);
      setTimeout(() => setBackupFeedback(null), 4000);
    } catch (err) {
      alert(`Export failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = await importVaultBackup(text);
      await onRefreshEntries?.();
      setBackupFeedback(`Restored ${res.imported} entries from backup! Total entries: ${res.total}`);
      setTimeout(() => setBackupFeedback(null), 5000);
    } catch (err) {
      alert(`Restore failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    e.target.value = '';
  };

  const handleRestoreSnapshot = async (id: string) => {
    if (!confirm('Restore this backup snapshot? Existing entries will be overwritten with the snapshot state.')) {
      return;
    }
    try {
      const ok = await restoreRollingBackup(id);
      if (ok) {
        await onRefreshEntries?.();
        setIsBackupsModalOpen(false);
        setBackupFeedback('Database snapshot successfully restored!');
        setTimeout(() => setBackupFeedback(null), 4000);
      }
    } catch (err) {
      alert(`Failed to restore snapshot: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

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

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              refreshBackups();
              setIsBackupsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition-all"
            title="View rolling database snapshots & backup manager"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vault Security &amp; Backups</span>
          </button>

          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition-all"
            title="Export all journal entries to a secure JSON backup file"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export JSON</span>
          </button>

          <label
            htmlFor="journal-file-import"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
            title="Import entries from JSON backup file"
          >
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span>Import JSON</span>
            <input
              id="journal-file-import"
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            onClick={onNewEntry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-serif text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
          >
            <Plus className="w-4 h-4" /> RECORD NEW RITUAL
          </button>
        </div>
      </div>

      {/* Backup & System Feedback Banner */}
      {backupFeedback && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/70 text-emerald-200 text-xs font-mono flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{backupFeedback}</span>
          </div>
          <button
            onClick={() => setBackupFeedback(null)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

                {/* Dedicated Somatic Meditation Log Display */}
                {entry.meditation_record && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/20 via-black to-neutral-900 border border-rose-900/40 flex flex-col gap-3 text-xs">
                    <div className="flex items-center justify-between border-b border-rose-900/30 pb-2">
                      <div className="flex items-center gap-2 text-rose-300 font-serif font-bold">
                        <HeartPulse className="w-4 h-4 text-rose-500" />
                        <span>{entry.meditation_record.description || 'Meditation & Somatic Record'}</span>
                      </div>
                      {entry.meditation_record.duration_minutes && (
                        <span className="font-mono text-[10px] text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                          ⏱ {entry.meditation_record.duration_minutes} min
                        </span>
                      )}
                    </div>

                    {/* Somatic Feeling Progression */}
                    {(entry.meditation_record.felt_before ||
                      entry.meditation_record.felt_during ||
                      entry.meditation_record.felt_after) && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-black/60 p-2.5 rounded-lg border border-neutral-800 font-mono text-[11px]">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase block">1. Felt Before</span>
                          <span className="text-neutral-300">{entry.meditation_record.felt_before || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase block">2. Felt During</span>
                          <span className="text-rose-200">{entry.meditation_record.felt_during || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase block">3. Felt Afterward</span>
                          <span className="text-purple-300 font-bold">{entry.meditation_record.felt_after || '—'}</span>
                        </div>
                      </div>
                    )}

                    {/* Sensory Observations */}
                    {(entry.meditation_record.smells ||
                      entry.meditation_record.sounds ||
                      entry.meditation_record.physical_sensations ||
                      entry.meditation_record.emotional_sensations) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {entry.meditation_record.smells && (
                          <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800">
                            <span className="text-neutral-400 font-mono text-[10px] block">👃 Smells:</span>
                            <span className="text-neutral-200">{entry.meditation_record.smells}</span>
                          </div>
                        )}
                        {entry.meditation_record.sounds && (
                          <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800">
                            <span className="text-neutral-400 font-mono text-[10px] block">👂 Sounds:</span>
                            <span className="text-neutral-200">{entry.meditation_record.sounds}</span>
                          </div>
                        )}
                        {entry.meditation_record.physical_sensations && (
                          <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800 sm:col-span-2">
                            <span className="text-neutral-400 font-mono text-[10px] block">
                              🧘 Physical &amp; Posture Sensations:
                            </span>
                            <span className="text-amber-200">{entry.meditation_record.physical_sensations}</span>
                          </div>
                        )}
                        {entry.meditation_record.emotional_sensations && (
                          <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800 sm:col-span-2">
                            <span className="text-neutral-400 font-mono text-[10px] block">❤️ Emotional Sensations:</span>
                            <span className="text-rose-200">{entry.meditation_record.emotional_sensations}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mind Pop-ups */}
                    {entry.meditation_record.mind_popups && (
                      <div className="p-2.5 rounded-lg bg-black/50 border border-neutral-800 text-[11px]">
                        <span className="text-neutral-400 font-mono text-[10px] block">
                          💭 Thoughts That Popped into Mind:
                        </span>
                        <p className="text-neutral-300 italic">{entry.meditation_record.mind_popups}</p>
                      </div>
                    )}

                    {/* Thoughts or Comments */}
                    {entry.meditation_record.thoughts_comments && (
                      <div className="p-2.5 rounded-lg bg-black/50 border border-neutral-800 text-[11px]">
                        <span className="text-neutral-400 font-mono text-[10px] block">
                          📝 Thoughts &amp; Comments:
                        </span>
                        <p className="text-neutral-300">{entry.meditation_record.thoughts_comments}</p>
                      </div>
                    )}
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

                {/* Markdown snippet (if not just meditation record) */}
                {entry.body_md && !entry.meditation_record && (
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
      {/* Rolling Backups & Data Protection Modal */}
      {isBackupsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative glass-panel-glow max-w-2xl w-full p-6 rounded-2xl border border-neutral-700 bg-neutral-950 flex flex-col gap-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-700/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    Vault Cryptography &amp; Development Backups
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400">
                    Parametrized Queries · AES-256-GCM Zero-Knowledge Encryption · Rolling Auto-Snapshots
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBackupsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Architecture Overview Banner */}
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Data Loss Architecture</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                All read and write queries are executed through parametrized repository procedures. In Tauri, SQLite uses SQLCipher with PBKDF2/Argon2. In development and web mode, records are encrypted using Web Crypto AES-256-GCM. An automated rolling backup retains the last 10 snapshots so you can modify code without losing entries.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
                <button
                  onClick={handleExportBackup}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-[11px] transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Download Complete Backup JSON</span>
                </button>
              </div>
            </div>

            {/* Snapshots List */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-purple-400" /> Rolling Database Snapshots ({backupSnapshots.length})
                </span>
                <button
                  onClick={refreshBackups}
                  className="text-[10px] font-mono text-neutral-400 hover:text-white"
                >
                  Refresh Snapshots
                </button>
              </div>

              {backupSnapshots.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-neutral-500 rounded-xl bg-neutral-900/50 border border-neutral-800">
                  No rolling snapshots recorded yet. Snapshots are created automatically when entries are saved.
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {backupSnapshots.map((snap) => (
                    <div
                      key={snap.id}
                      className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-serif">{snap.label}</span>
                          <span className="font-mono text-[10px] text-purple-300 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-800/40">
                            {snap.entryCount} entries
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-neutral-400">
                          {new Date(snap.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRestoreSnapshot(snap.id)}
                        className="px-3 py-1.5 rounded bg-red-950/60 hover:bg-red-900/80 border border-red-700/60 text-red-200 text-xs font-mono transition-all font-bold"
                      >
                        Restore Snapshot
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-800">
              <button
                onClick={() => setIsBackupsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalList;
