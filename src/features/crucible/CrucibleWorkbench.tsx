import React, { useState, useEffect, useMemo } from 'react';
import {
  FORD_11_POINTS,
  ALCHEMICAL_STAGES,
  getStageForDay,
  PowerPoint,
  AlchemicalStage,
} from './fordPoints';
import { CrucibleCycle, CrucibleDailyLog } from './types';
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  X,
  Save,
  RotateCcw,
} from 'lucide-react';

interface CrucibleWorkbenchProps {
  // Can be extended with remote/vault props if desired
}

const STORAGE_CYCLE_KEY = 'gnosticos_crucible_active_cycle';
const STORAGE_LOGS_KEY = 'gnosticos_crucible_daily_logs';

export const CrucibleWorkbench: React.FC<CrucibleWorkbenchProps> = () => {
  const [selectedPointNumber, setSelectedPointNumber] = useState<number>(1);
  const [activeCycle, setActiveCycle] = useState<CrucibleCycle | null>(null);
  const [dailyLogs, setDailyLogs] = useState<CrucibleDailyLog[]>([]);
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [checkinDay, setCheckinDay] = useState<number>(1);

  // Form states for the daily check-in
  const [formObserved, setFormObserved] = useState<boolean>(true);
  const [formOvercome, setFormOvercome] = useState<boolean>(true);
  const [formBlackFlame, setFormBlackFlame] = useState<number>(8);
  const [formNote, setFormNote] = useState<string>('');

  // Intention input for starting a new cycle
  const [newIntention, setNewIntention] = useState<string>('');

  // Load active cycle and logs on mount
  useEffect(() => {
    try {
      const savedCycle = localStorage.getItem(STORAGE_CYCLE_KEY);
      const savedLogs = localStorage.getItem(STORAGE_LOGS_KEY);
      if (savedCycle) {
        const parsed = JSON.parse(savedCycle) as CrucibleCycle;
        setActiveCycle(parsed);
        setSelectedPointNumber(parsed.pointNumber);
      } else {
        // Create initial default cycle on Point 1
        const initial: CrucibleCycle = {
          id: `cycle-${Date.now()}`,
          pointNumber: 1,
          startDate: new Date().toISOString().split('T')[0],
          targetDays: 30,
          habitStatus: 'active',
          intentionText: 'Dismantle subconscious need for external validation and herd morality.',
          createdAt: new Date().toISOString(),
        };
        setActiveCycle(initial);
        localStorage.setItem(STORAGE_CYCLE_KEY, JSON.stringify(initial));
      }

      if (savedLogs) {
        setDailyLogs(JSON.parse(savedLogs));
      }
    } catch (err) {
      console.warn('Error loading crucible cycle:', err);
    }
  }, []);

  const activePoint: PowerPoint = useMemo(() => {
    return (
      FORD_11_POINTS.find((p) => p.pointNumber === selectedPointNumber) ||
      FORD_11_POINTS[0]
    );
  }, [selectedPointNumber]);

  // Calculate current day index relative to cycle start
  const currentDayIndex = useMemo(() => {
    if (!activeCycle) return 1;
    const start = new Date(activeCycle.startDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(activeCycle.targetDays, diffDays));
  }, [activeCycle]);

  const currentStage: AlchemicalStage = useMemo(() => {
    return getStageForDay(currentDayIndex);
  }, [currentDayIndex]);

  // Calculate streak and logs summary
  const stats = useMemo(() => {
    const cycleLogs = dailyLogs.filter(
      (l) => activeCycle && l.cycleId === activeCycle.id,
    );
    const overcomeCount = cycleLogs.filter((l) => l.overcome).length;
    const observedCount = cycleLogs.filter((l) => l.observed).length;
    const completionPct = activeCycle
      ? Math.round((overcomeCount / activeCycle.targetDays) * 100)
      : 0;

    return {
      totalLogged: cycleLogs.length,
      overcomeCount,
      observedCount,
      completionPct,
    };
  }, [dailyLogs, activeCycle]);

  // Open check-in modal for a specific day
  const handleOpenCheckin = (day: number) => {
    setCheckinDay(day);
    const existing = dailyLogs.find(
      (l) => activeCycle && l.cycleId === activeCycle.id && l.dayIndex === day,
    );
    if (existing) {
      setFormObserved(existing.observed);
      setFormOvercome(existing.overcome);
      setFormBlackFlame(existing.blackFlameRating);
      setFormNote(existing.reflectionNote);
    } else {
      setFormObserved(true);
      setFormOvercome(true);
      setFormBlackFlame(8);
      setFormNote('');
    }
    setIsCheckinOpen(true);
  };

  const handleSaveCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCycle) return;

    const logEntry: CrucibleDailyLog = {
      id: `log-${activeCycle.id}-day-${checkinDay}`,
      cycleId: activeCycle.id,
      logDate: new Date().toISOString().split('T')[0],
      dayIndex: checkinDay,
      observed: formObserved,
      overcome: formOvercome,
      blackFlameRating: formBlackFlame,
      reflectionNote: formNote.trim(),
    };

    const updated = dailyLogs.filter(
      (l) => !(l.cycleId === activeCycle.id && l.dayIndex === checkinDay),
    );
    updated.push(logEntry);
    setDailyLogs(updated);
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(updated));
    setIsCheckinOpen(false);
  };

  const handleStartNewCycle = (pointNum: number) => {
    const newC: CrucibleCycle = {
      id: `cycle-${Date.now()}`,
      pointNumber: pointNum,
      startDate: new Date().toISOString().split('T')[0],
      targetDays: 30,
      habitStatus: 'active',
      intentionText: newIntention.trim() || `Mastery of Point #${pointNum}`,
      createdAt: new Date().toISOString(),
    };
    setActiveCycle(newC);
    setSelectedPointNumber(pointNum);
    localStorage.setItem(STORAGE_CYCLE_KEY, JSON.stringify(newC));
    setNewIntention('');
  };

  const stageConfig = ALCHEMICAL_STAGES[currentStage];

  // Retrieve prompt for checkin day
  const checkinStage = getStageForDay(checkinDay);
  const activePrompt =
    checkinStage === 'clay'
      ? activePoint.clayPrompt
      : checkinStage === 'fire'
      ? activePoint.firePrompt
      : activePoint.lightPrompt;

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-black text-neutral-200 flex flex-col gap-6 select-none font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wider text-white flex items-center gap-3">
            <Flame className="w-6 h-6 text-red-500" />
            11 Points of Power Habit Crucible
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Michael W. Ford's 21–30 Day Cognitive Sovereignty & Alchemical Transformation Track
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-panel px-3.5 py-1.5 rounded-lg border border-neutral-800 flex items-center gap-2 text-xs font-mono">
            <span className="text-neutral-500">Day:</span>
            <span className="text-red-400 font-bold">{currentDayIndex} / 30</span>
            <span className="text-neutral-600">•</span>
            <span className={`capitalize font-semibold ${stageConfig.color}`}>
              {stageConfig.name}
            </span>
          </div>

          <button
            onClick={() => handleOpenCheckin(currentDayIndex)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-serif text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
          >
            <Sparkles className="w-4 h-4" /> DAILY CHECK-IN
          </button>
        </div>
      </div>

      {/* Point Selector Horizontal Scroll / Grid */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
          The 11 Luciferian Points of Power
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {FORD_11_POINTS.map((pt) => {
            const isSelected = selectedPointNumber === pt.pointNumber;
            const isCycleActive = activeCycle?.pointNumber === pt.pointNumber;
            return (
              <button
                key={pt.pointNumber}
                onClick={() => setSelectedPointNumber(pt.pointNumber)}
                className={`px-3 py-2 rounded-lg border text-xs font-mono shrink-0 transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-neutral-900 border-red-600 text-white font-bold shadow-[0_0_12px_rgba(220,38,38,0.3)]'
                    : 'bg-black/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCycleActive
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {pt.pointNumber}
                </span>
                <span className="truncate max-w-[140px] text-left">{pt.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Point Spotlight & Doctrine Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel p-6 rounded-xl border border-neutral-800 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 font-mono text-[10px] uppercase font-bold">
                  Point #{activePoint.pointNumber}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  Adversary Aspect: {activePoint.adversaryAspect}
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold text-white mt-1">
                {activePoint.title}
              </h2>
              <p className="text-xs font-mono text-neutral-400 mt-1 italic">
                "{activePoint.shortSummary}"
              </p>
            </div>

            {activeCycle?.pointNumber !== activePoint.pointNumber && (
              <button
                onClick={() => handleStartNewCycle(activePoint.pointNumber)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-red-500 text-neutral-300 hover:text-white text-xs font-mono transition-all shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-400" /> Start 30-Day Track
              </button>
            )}
          </div>

          <div className="p-4 rounded-lg bg-black/60 border border-neutral-800/80 text-xs font-sans text-neutral-300 leading-relaxed">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
              Doctrine & Philosophical Foundation
            </span>
            {activePoint.doctrine}
          </div>

          {/* Current Intention Banner */}
          {activeCycle && activeCycle.pointNumber === activePoint.pointNumber && (
            <div className="p-3.5 rounded-lg bg-red-950/30 border border-red-900/40 text-xs font-mono text-neutral-300 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-red-400 uppercase font-bold block">
                  Active Deconditioning Intention:
                </span>
                <span className="text-neutral-200 mt-0.5 block">{activeCycle.intentionText}</span>
              </div>
              <span className="text-[11px] text-neutral-500">
                Started {activeCycle.startDate}
              </span>
            </div>
          )}
        </div>

        {/* Alchemical Stage Progress Box */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-xl border border-neutral-800 flex flex-col justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
              Active Alchemical Stage
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xl font-serif font-bold ${stageConfig.color}`}>
                {stageConfig.name}
              </span>
              <span className="text-xs font-mono text-neutral-500">({stageConfig.days})</span>
            </div>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              {stageConfig.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Days Overcome:</span>
              <span className="text-red-400 font-bold">
                {stats.overcomeCount} / {activeCycle?.targetDays || 30}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Total Check-ins:</span>
              <span className="text-neutral-200 font-bold">{stats.totalLogged}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Alchemical Crucible Progress:</span>
              <span className="text-amber-400 font-bold">{stats.completionPct}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden mt-1 border border-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-purple-600 transition-all duration-500"
                style={{ width: `${Math.min(100, stats.completionPct)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Alchemical Progression Track */}
      <div className="glass-panel p-6 rounded-xl border border-neutral-800 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              30-Day Alchemical Progression Matrix
            </h3>
            <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
              Click any day node to review or record daily reflection & Black Flame rating
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-950 border border-amber-700" />
              Days 1–10 (Clay)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-950 border border-red-700" />
              Days 11–20 (Fire)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-950 border border-purple-700" />
              Days 21–30 (Light)
            </span>
          </div>
        </div>

        {/* Days Grid (30 Day Nodes) */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2.5 pt-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const stage = getStageForDay(day);
            const isToday = day === currentDayIndex;
            const log = dailyLogs.find(
              (l) => activeCycle && l.cycleId === activeCycle.id && l.dayIndex === day,
            );
            const isLogged = !!log;
            const isOvercome = log?.overcome;

            // Border color by stage
            const stageBorder =
              stage === 'clay'
                ? 'border-amber-900/60'
                : stage === 'fire'
                ? 'border-red-900/60'
                : 'border-purple-900/60';

            return (
              <button
                key={day}
                onClick={() => handleOpenCheckin(day)}
                className={`h-16 rounded-xl border p-2 flex flex-col justify-between items-center transition-all ${stageBorder} ${
                  isToday
                    ? 'bg-neutral-800/90 ring-2 ring-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                    : isLogged
                    ? 'bg-neutral-900/80 hover:bg-neutral-800/80'
                    : 'bg-black/50 hover:bg-neutral-900/40 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-full flex items-center justify-between text-[10px] font-mono">
                  <span className={isToday ? 'text-red-400 font-bold' : 'text-neutral-500'}>
                    D{day}
                  </span>
                  {isLogged && (
                    <span className="text-amber-400 font-bold text-[9px]">
                      ★{log.blackFlameRating}
                    </span>
                  )}
                </div>

                {isLogged ? (
                  isOvercome ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )
                ) : (
                  <span className="w-2 h-2 rounded-full bg-neutral-700" />
                )}

                <span className="text-[8px] font-mono text-neutral-500 capitalize">
                  {stage}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Check-in Modal */}
      {isCheckinOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCheckin}
            className="glass-panel-glow max-w-xl w-full p-6 rounded-2xl border border-red-900/50 flex flex-col gap-5 select-none"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-red-400">
                    Day {checkinDay} of 30
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-xs font-mono text-neutral-400 capitalize">
                    Stage: {checkinStage}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mt-1">
                  Point #{activePoint.pointNumber}: {activePoint.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsCheckinOpen(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt Callout */}
            <div className="p-3.5 rounded-lg bg-red-950/30 border border-red-900/40 text-xs font-mono text-neutral-200">
              <span className="text-[10px] text-red-400 uppercase font-bold block mb-1">
                Alchemical Daily Inquiry ({checkinStage.toUpperCase()}):
              </span>
              "{activePrompt}"
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setFormObserved(!formObserved)}
                className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between text-xs font-mono transition-all ${
                  formObserved
                    ? 'bg-neutral-900 border-red-700/60 text-white'
                    : 'bg-black/60 border-neutral-800 text-neutral-500'
                }`}
              >
                <span>Conditioning Caught Today?</span>
                <input
                  type="checkbox"
                  checked={formObserved}
                  onChange={() => {}}
                  className="rounded text-red-600 focus:ring-0"
                />
              </label>

              <label
                onClick={() => setFormOvercome(!formOvercome)}
                className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between text-xs font-mono transition-all ${
                  formOvercome
                    ? 'bg-neutral-900 border-emerald-700/60 text-white'
                    : 'bg-black/60 border-neutral-800 text-neutral-500'
                }`}
              >
                <span>Pattern Broken / Overcome?</span>
                <input
                  type="checkbox"
                  checked={formOvercome}
                  onChange={() => {}}
                  className="rounded text-emerald-600 focus:ring-0"
                />
              </label>
            </div>

            {/* Black Flame Potency Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Black Flame Vitality / Sovereignty:</span>
                <span className="text-amber-400 font-bold">{formBlackFlame} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formBlackFlame}
                onChange={(e) => setFormBlackFlame(Number(e.target.value))}
                className="w-full accent-red-600 bg-neutral-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Reflection Note Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-neutral-400">
                Encrypted Reflection Note:
              </label>
              <textarea
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                rows={3}
                placeholder="Log internal reactions, caught slave-morality thoughts, or sovereign actions taken..."
                className="w-full bg-black/80 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-neutral-200 placeholder:text-neutral-600 focus:border-red-500 focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsCheckinOpen(false)}
                className="px-4 py-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-serif text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
              >
                <Save className="w-4 h-4" /> SEAL IN CRUCIBLE
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CrucibleWorkbench;
