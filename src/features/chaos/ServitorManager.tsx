import React, { useState, useEffect, useMemo } from 'react';
import { getCurrentMagickalTiming, MagickalTiming } from '../ephemeris/planetaryHours';
import {
  Sparkles,
  Plus,
  Clock,
  AlertTriangle,
  Skull,
  X,
  Activity,
  HeartHandshake,
} from 'lucide-react';

export interface ServitorData {
  id: string;
  name: string;
  intent_statement: string;
  vessel_anchor: string;
  feeding_schedule: string;
  offering_type: string;
  created_at: string;
  lifespan_days: number;
  dissolution_terms: string;
  status: 'gestating' | 'active' | 'dormant' | 'dissolved';
  last_fed_at?: string | null;
  dissolved_at?: string | null;
  feedings_count: number;
}

const STORAGE_SERVITORS_KEY = 'gnosticos_chaos_servitors';

export const ServitorManager: React.FC = () => {
  const [servitors, setServitors] = useState<ServitorData[]>([]);
  const [timing, setTiming] = useState<MagickalTiming | null>(null);

  // Creation modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [intent, setIntent] = useState('');
  const [vessel, setVessel] = useState('Obsidian Sphere / Consecrated Stone');
  const [schedule, setSchedule] = useState('Every Tuesday during Mars Hour');
  const [offeringType, setOfferingType] = useState('Dragon\'s Blood Incense & Mindful Focus');
  const [lifespanDays, setLifespanDays] = useState(30);
  const [dissolutionTerms, setDissolutionTerms] = useState(
    'Upon acquiring the target asset, vessel will be cleansed in salt water and sigil burned.',
  );

  // Dissolution modal state
  const [dissolvingServitor, setDissolvingServitor] = useState<ServitorData | null>(null);
  const [checkBanished, setCheckBanished] = useState(false);
  const [checkVesselDestroyed, setCheckVesselDestroyed] = useState(false);
  const [checkWillReleased, setCheckWillReleased] = useState(false);

  // Load servitors and ephemeris on mount
  useEffect(() => {
    setTiming(getCurrentMagickalTiming());
    try {
      const raw = localStorage.getItem(STORAGE_SERVITORS_KEY);
      if (raw) {
        setServitors(JSON.parse(raw));
      } else {
        // Seed initial sample servitor
        const sample: ServitorData = {
          id: 'servitor-sample-01',
          name: 'Vaelith the Sentinel',
          intent_statement: 'Guard the practitioner’s sanctum and computer against psychic drain and distraction.',
          vessel_anchor: 'Black tourmaline pendant on ritual desk',
          feeding_schedule: 'Every Saturday during Saturn Hour',
          offering_type: 'Patchouli incense and 5 minutes of focused breath gazing',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
          lifespan_days: 45,
          dissolution_terms: 'When moving residence or upon Adept command; pendant buried under oak roots.',
          status: 'active',
          last_fed_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
          feedings_count: 3,
        };
        setServitors([sample]);
        localStorage.setItem(STORAGE_SERVITORS_KEY, JSON.stringify([sample]));
      }
    } catch (err) {
      console.warn('Error loading servitors:', err);
    }
  }, []);

  const saveServitorsToStore = (list: ServitorData[]) => {
    setServitors(list);
    localStorage.setItem(STORAGE_SERVITORS_KEY, JSON.stringify(list));
  };

  // Create new servitor
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !intent.trim()) return;

    const newServitor: ServitorData = {
      id: `servitor-${Date.now()}`,
      name: name.trim(),
      intent_statement: intent.trim(),
      vessel_anchor: vessel.trim(),
      feeding_schedule: schedule.trim(),
      offering_type: offeringType.trim(),
      created_at: new Date().toISOString(),
      lifespan_days: Number(lifespanDays) || 30,
      dissolution_terms: dissolutionTerms.trim() || 'Dissolved upon mission completion.',
      status: 'active',
      last_fed_at: new Date().toISOString(),
      feedings_count: 1,
    };

    const updated = [newServitor, ...servitors];
    saveServitorsToStore(updated);
    setIsCreateOpen(false);

    // Reset inputs
    setName('');
    setIntent('');
  };

  // Feed servitor
  const handleFeed = (id: string) => {
    const updated = servitors.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          last_fed_at: new Date().toISOString(),
          feedings_count: (s.feedings_count || 0) + 1,
          status: 'active' as const,
        };
      }
      return s;
    });
    saveServitorsToStore(updated);
  };

  // Initiate dissolution ceremony
  const handleOpenDissolve = (s: ServitorData) => {
    setDissolvingServitor(s);
    setCheckBanished(false);
    setCheckVesselDestroyed(false);
    setCheckWillReleased(false);
  };

  // Confirm dissolution
  const handleConfirmDissolve = () => {
    if (!dissolvingServitor) return;
    const updated = servitors.map((s) => {
      if (s.id === dissolvingServitor.id) {
        return {
          ...s,
          status: 'dissolved' as const,
          dissolved_at: new Date().toISOString(),
        };
      }
      return s;
    });
    saveServitorsToStore(updated);
    setDissolvingServitor(null);
  };

  // Calculate planetary feeding synergy
  const feedingSynergies = useMemo(() => {
    if (!timing) return [];
    const currentPlanet = timing.currentHour.planet.toLowerCase();
    return servitors.filter(
      (s) =>
        s.status === 'active' &&
        s.feeding_schedule.toLowerCase().includes(currentPlanet),
    );
  }, [servitors, timing]);

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-black text-neutral-200 flex flex-col gap-6 select-none font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wider text-white flex items-center gap-3">
            <Activity className="w-6 h-6 text-purple-500" />
            Servitor Lifecycle & Thoughtform Manager
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Artificial Entities • Consecrated Vessels • Planetary Feeding & Safe Dissolution Protocols
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-red-600 hover:from-purple-600 hover:to-red-500 text-white font-serif text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" /> BIRTH NEW SERVITOR
        </button>
      </div>

      {/* Planetary Feeding Alert Banner */}
      {feedingSynergies.length > 0 && timing && (
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-700/60 flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-900/80 border border-purple-600 flex items-center justify-center text-purple-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-purple-300 font-bold block">
                Planetary Hour Feeding Window: {timing.currentHour.correspondence.title} ({timing.currentHour.correspondence.symbol})
              </span>
              <span className="text-neutral-400 text-[11px]">
                {feedingSynergies.length} active thoughtform matches current astrological current!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {feedingSynergies.map((s) => (
              <button
                key={s.id}
                onClick={() => handleFeed(s.id)}
                className="px-3 py-1.5 rounded-lg bg-purple-800 hover:bg-purple-700 text-white text-xs font-mono font-bold transition-all shadow"
              >
                Feed {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Servitor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {servitors.map((s) => {
          const isDissolved = s.status === 'dissolved';
          const createdDate = new Date(s.created_at);
          const ageDays = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
          const daysRemaining = Math.max(0, s.lifespan_days - ageDays);

          return (
            <div
              key={s.id}
              className={`glass-panel p-5 rounded-xl border flex flex-col justify-between gap-4 transition-all ${
                isDissolved
                  ? 'border-neutral-900 bg-neutral-950/40 opacity-50'
                  : 'border-neutral-800 hover:border-purple-900/60'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        isDissolved
                          ? 'bg-neutral-800 text-neutral-500'
                          : 'bg-purple-950 border border-purple-800 text-purple-300'
                      }`}
                    >
                      {s.status}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Age: {ageDays}d / {s.lifespan_days}d
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mt-1">
                    {s.name}
                  </h3>
                </div>

                {!isDissolved && (
                  <button
                    onClick={() => handleOpenDissolve(s)}
                    title="Initiate Dissolution Ceremony"
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-red-950 text-neutral-500 hover:text-red-400 border border-neutral-800 transition-all"
                  >
                    <Skull className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Statement of Intent */}
              <div className="p-3 rounded-lg bg-black/60 border border-neutral-800/80 text-xs font-mono text-neutral-300">
                <span className="text-[9px] text-neutral-500 uppercase block mb-0.5 font-bold">
                  Core Purpose & Programming:
                </span>
                "{s.intent_statement}"
              </div>

              {/* Details & Vessel Anchor */}
              <div className="flex flex-col gap-1.5 text-[11px] font-mono text-neutral-400">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Vessel:</span>
                  <span className="text-neutral-200 truncate max-w-[65%]">{s.vessel_anchor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Feeding:</span>
                  <span className="text-purple-300 truncate max-w-[65%]">{s.feeding_schedule}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Offering:</span>
                  <span className="text-neutral-300 truncate max-w-[65%]">{s.offering_type}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80">
                  <span className="text-neutral-500">Feedings Logged:</span>
                  <span className="text-amber-400 font-bold">{s.feedings_count}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                {isDissolved ? (
                  <span className="text-[10px] font-mono text-neutral-500 italic">
                    Dissolved on {new Date(s.dissolved_at || '').toLocaleDateString()}
                  </span>
                ) : (
                  <>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {daysRemaining} days of lifespan left
                    </span>
                    <button
                      onClick={() => handleFeed(s.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 border border-purple-700/60 text-purple-200 text-xs font-mono font-bold transition-all"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" /> Feed Thoughtform
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Servitor Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="glass-panel-glow max-w-xl w-full p-6 rounded-2xl border border-purple-900/50 flex flex-col gap-4 select-none"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Birth New Artificial Entity (Servitor)
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-neutral-300">Entity Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vaelith, Ourophion, Chronos-7..."
                  required
                  className="bg-black/80 border border-neutral-700 rounded-lg p-2.5 text-neutral-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-neutral-300">Statement of Purpose / Intent:</label>
                <textarea
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  rows={2}
                  placeholder="State exact, unambiguous mission parameters..."
                  required
                  className="bg-black/80 border border-neutral-700 rounded-lg p-2.5 text-neutral-100 focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-neutral-300">Vessel Anchor:</label>
                <input
                  type="text"
                  value={vessel}
                  onChange={(e) => setVessel(e.target.value)}
                  placeholder="Physical object / consecrated sigil"
                  className="bg-black/80 border border-neutral-700 rounded-lg p-2 text-neutral-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-neutral-300">Lifespan (Days):</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={lifespanDays}
                  onChange={(e) => setLifespanDays(Number(e.target.value))}
                  className="bg-black/80 border border-neutral-700 rounded-lg p-2 text-neutral-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-neutral-300">Feeding Schedule & Astrological Trigger:</label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="e.g. Every Tuesday during Mars Hour"
                  className="bg-black/80 border border-neutral-700 rounded-lg p-2 text-neutral-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-neutral-300">Offering Nourishment:</label>
                <input
                  type="text"
                  value={offeringType}
                  onChange={(e) => setOfferingType(e.target.value)}
                  placeholder="e.g. Frankincense, candle flame, physical workout exertion..."
                  className="bg-black/80 border border-neutral-700 rounded-lg p-2 text-neutral-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-red-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Mandatory Dissolution Terms:
                </label>
                <input
                  type="text"
                  value={dissolutionTerms}
                  onChange={(e) => setDissolutionTerms(e.target.value)}
                  placeholder="Exact condition under which entity is safely released/destroyed"
                  required
                  className="bg-black/80 border border-red-900/60 rounded-lg p-2 text-neutral-100 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-red-600 hover:from-purple-600 hover:to-red-500 text-white font-serif text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
              >
                ANIMATE SERVITOR
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dissolution Ceremony Modal */}
      {dissolvingServitor && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow max-w-lg w-full p-6 rounded-2xl border border-red-900/60 flex flex-col gap-5 select-none">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Skull className="w-5 h-5 text-red-500" />
                Dissolution & Banishing Ceremony: {dissolvingServitor.name}
              </h2>
              <button
                onClick={() => setDissolvingServitor(null)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-mono text-neutral-300 leading-relaxed">
              In accordance with Chaos Magic protocol, every artificial thoughtform must be cleanly released to prevent rogue psychic attachment or energetic destabilization.
            </p>

            <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-900/60 text-xs font-mono text-neutral-300">
              <span className="text-[10px] text-red-400 uppercase font-bold block mb-1">
                Specified Dissolution Clause:
              </span>
              "{dissolvingServitor.dissolution_terms}"
            </div>

            {/* Checklist */}
            <div className="flex flex-col gap-2.5 text-xs font-mono">
              <label
                onClick={() => setCheckBanished(!checkBanished)}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checkBanished}
                  onChange={() => {}}
                  className="rounded text-red-600"
                />
                <span>Psychic cords severed; closing banishing rite completed.</span>
              </label>

              <label
                onClick={() => setCheckVesselDestroyed(!checkVesselDestroyed)}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checkVesselDestroyed}
                  onChange={() => {}}
                  className="rounded text-red-600"
                />
                <span>Physical/Digital vessel anchor cleansed, burned, or unsealed.</span>
              </label>

              <label
                onClick={() => setCheckWillReleased(!checkWillReleased)}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checkWillReleased}
                  onChange={() => {}}
                  className="rounded text-red-600"
                />
                <span>Entity thanked and all invested Will reclaimed into the Black Flame.</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setDissolvingServitor(null)}
                className="px-4 py-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDissolve}
                disabled={!checkBanished || !checkVesselDestroyed || !checkWillReleased}
                className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-serif text-xs font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              >
                FINALIZE DISSOLUTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServitorManager;
