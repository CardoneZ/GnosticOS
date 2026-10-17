import React, { useState, useEffect, useRef } from 'react';
import {
  JournalEntryData,
  OfferingData,
  EntityData,
  TunnelData,
  MeditationRecordData,
} from '../../platform/vault';
import { getCurrentMagickalTiming, MagickalTiming } from '../ephemeris/planetaryHours';
import {
  WorkingType,
  WORKING_TYPE_LABELS,
  PRE_STATE_PRESETS,
  POST_STATE_PRESETS,
  OFFERING_PRESETS,
} from './types';
import {
  Save,
  X,
  Moon,
  Sparkles,
  Flame,
  Clock,
  Compass,
  Mic,
  MicOff,
  Radio,
  FileText,
  Activity,
  HeartPulse,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

interface JournalEntryFormProps {
  initialEntry?: JournalEntryData | null;
  entities: EntityData[];
  tunnels: TunnelData[];
  onSave: (entry: JournalEntryData) => Promise<void>;
  onCancel: () => void;
}

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  initialEntry,
  entities,
  tunnels,
  onSave,
  onCancel,
}) => {
  const [timing, setTiming] = useState<MagickalTiming | null>(null);

  // Form states
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [bodyMd, setBodyMd] = useState(initialEntry?.body_md || '');
  const [visions, setVisions] = useState(initialEntry?.visions || '');
  const [workingType, setWorkingType] = useState<WorkingType>(
    (initialEntry?.working_type as WorkingType) || 'invocation',
  );
  const [resonance, setResonance] = useState<number>(initialEntry?.resonance ?? 7);
  const [preStateLabel, setPreStateLabel] = useState(
    initialEntry?.pre_state_label || PRE_STATE_PRESETS[0],
  );
  const [postStateLabel, setPostStateLabel] = useState(
    initialEntry?.post_state_label || POST_STATE_PRESETS[0],
  );

  // Meditation Structured Protocol States
  const [meditationDesc, setMeditationDesc] = useState<string>(
    initialEntry?.meditation_record?.description || '',
  );
  const [meditationDuration, setMeditationDuration] = useState<string>(
    initialEntry?.meditation_record?.duration_minutes?.toString() || '15',
  );
  const [feltBefore, setFeltBefore] = useState<string>(
    initialEntry?.meditation_record?.felt_before || initialEntry?.pre_state_label || '',
  );
  const [feltDuring, setFeltDuring] = useState<string>(
    initialEntry?.meditation_record?.felt_during || '',
  );
  const [feltAfter, setFeltAfter] = useState<string>(
    initialEntry?.meditation_record?.felt_after || initialEntry?.post_state_label || '',
  );
  const [mindPopups, setMindPopups] = useState<string>(
    initialEntry?.meditation_record?.mind_popups || '',
  );
  const [smells, setSmells] = useState<string>(
    initialEntry?.meditation_record?.smells || '',
  );
  const [sounds, setSounds] = useState<string>(
    initialEntry?.meditation_record?.sounds || '',
  );
  const [physicalSensations, setPhysicalSensations] = useState<string>(
    initialEntry?.meditation_record?.physical_sensations || '',
  );
  const [emotionalSensations, setEmotionalSensations] = useState<string>(
    initialEntry?.meditation_record?.emotional_sensations || '',
  );
  const [thoughtsComments, setThoughtsComments] = useState<string>(
    initialEntry?.meditation_record?.thoughts_comments || '',
  );
  const [isMeditationExpanded, setIsMeditationExpanded] = useState<boolean>(
    initialEntry?.working_type === 'meditation' || !!initialEntry?.meditation_record,
  );

  // Voice Dictation (Speech-to-Text) States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  const [selectedEntityIds, setSelectedEntityIds] = useState<number[]>(
    initialEntry?.entities?.map((e) => e.entity_id) || [],
  );
  const [offerings, setOfferings] = useState<OfferingData[]>(
    initialEntry?.offerings || [{ kind: 'incense', quantity: 'Dragon\'s Blood' }],
  );
  const [tunnelId, setTunnelId] = useState<number | null>(initialEntry?.tunnel_id || null);

  // Auto-calculate astronomical timing on mount if creating new entry
  useEffect(() => {
    const t = getCurrentMagickalTiming();
    setTiming(t);
    if (!initialEntry && !title) {
      setTitle(`${WORKING_TYPE_LABELS[workingType].label} of ${t.currentHour.correspondence.title}`);
    }
  }, [initialEntry, workingType, title]);

  // Speech Recognition (Live Voice Dictation / Yap Mode)
  useEffect(() => {
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRec) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalChunk = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript;
          }
        }
        if (finalChunk.trim()) {
          setBodyMd((prev) => (prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim()));
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const toggleVoiceDictation = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  const handleApplyTemplate = (type: 'ritual' | 'dream' | 'yap' | 'meditation') => {
    const dateStr = new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    if (type === 'dream') {
      setWorkingType('dream');
      setTitle(`Dream & Astral Vision — ${dateStr}`);
      setPreStateLabel('Sleep / Hypnagogia');
      setPostStateLabel('Astral Lucidity');
      if (!bodyMd) {
        setBodyMd(
          `### Dream Log (${dateStr})\n\n**Setting & Atmosphere:**\n\n**Symbols & Figures:**\n\n**Astral Messages:**\n\n**Personal Gnosis:**\n`
        );
      }
    } else if (type === 'yap') {
      setWorkingType('daily_yap');
      setTitle(`Stream of Thought — ${dateStr}`);
      setPreStateLabel('Seeking Clarity');
      setPostStateLabel('Inner Equilibrium');
      if (!bodyMd) {
        setBodyMd(
          `### Daily Thoughts & Yap (${dateStr})\n\n`
        );
      }
      if (speechSupported && !isListening) {
        toggleVoiceDictation();
      }
    } else if (type === 'meditation') {
      setWorkingType('meditation');
      setTitle(`Meditation & Ritual Log — ${dateStr}`);
      setPreStateLabel('Physical Inertia / Seeking Gnosis');
      setPostStateLabel('Inner Equilibrium / Illumination');
      setIsMeditationExpanded(true);
      if (!meditationDesc) setMeditationDesc('Timed Gazing & Somatic Meditation');
      if (!meditationDuration) setMeditationDuration('15');
      if (!feltBefore) setFeltBefore('Tension in shoulders, mental chatter');
      if (!feltDuring) setFeltDuring('Theta entrainment, steady rhythmic breathing');
      if (!feltAfter) setFeltAfter('Deep centered calm, heightened senses');
    } else {
      setWorkingType('invocation');
      setTitle(`Ritual Working — ${dateStr}`);
    }
  };

  const toggleEntity = (id: number) => {
    setSelectedEntityIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleOfferingKind = (kind: OfferingData['kind']) => {
    setOfferings((prev) => {
      const exists = prev.some((o) => o.kind === kind);
      if (exists) {
        return prev.filter((o) => o.kind !== kind);
      }
      return [...prev, { kind, quantity: '1' }];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entryId = initialEntry?.id || `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    const hasMeditationData =
      workingType === 'meditation' ||
      meditationDesc.trim() ||
      feltBefore.trim() ||
      feltDuring.trim() ||
      feltAfter.trim() ||
      mindPopups.trim() ||
      smells.trim() ||
      sounds.trim() ||
      physicalSensations.trim() ||
      emotionalSensations.trim() ||
      thoughtsComments.trim();

    const meditationRecordToSave: MeditationRecordData | null = hasMeditationData
      ? {
          duration_minutes: meditationDuration || '15',
          description: meditationDesc.trim() || 'Meditation / Ritual Gnosis',
          felt_before: feltBefore.trim(),
          felt_during: feltDuring.trim(),
          felt_after: feltAfter.trim(),
          mind_popups: mindPopups.trim(),
          smells: smells.trim(),
          sounds: sounds.trim(),
          physical_sensations: physicalSensations.trim(),
          emotional_sensations: emotionalSensations.trim(),
          thoughts_comments: thoughtsComments.trim(),
        }
      : null;

    let finalBodyMd = bodyMd;
    if (workingType === 'meditation' && (!bodyMd.trim() || bodyMd.trim().startsWith('### Meditation Record'))) {
      finalBodyMd = `### Meditation Record (${now.toLocaleDateString()})

**Meditation Description & Duration:** ${meditationDesc || 'Meditation'} (${meditationDuration || 15} minutes)
**How I felt before:** ${feltBefore || 'N/A'}
**How I felt during:** ${feltDuring || 'N/A'}
**How I felt immediately afterward:** ${feltAfter || 'N/A'}
**What kept popping into my mind:** ${mindPopups || 'None'}
**Smells I noticed:** ${smells || 'None'}
**Sounds I noticed:** ${sounds || 'None'}
**Physical sensations & posture:** ${physicalSensations || 'None'}
**Emotional sensations:** ${emotionalSensations || 'None'}
**Thoughts or Comments:** ${thoughtsComments || 'None'}`;
    }

    const entryToSave: JournalEntryData = {
      id: entryId,
      ritual_at: initialEntry?.ritual_at || now.toISOString(),
      tz_offset_min: now.getTimezoneOffset(),
      latitude: 51.5074,
      longitude: -0.1278,
      moon_phase: initialEntry?.moon_phase || timing?.lunarState.phase || 'waxing_gibbous',
      moon_illumination: (initialEntry?.moon_illumination ?? timing?.lunarState.illuminationPct ?? 50) / 100,
      moon_age_days: initialEntry?.moon_age_days ?? timing?.lunarState.ageDays ?? 14,
      day_ruler: initialEntry?.day_ruler || timing?.daySchedule.magickalDayRuler || 'mercury',
      planetary_hour: initialEntry?.planetary_hour || timing?.currentHour.planet || 'saturn',
      planetary_hour_index: initialEntry?.planetary_hour_index ?? timing?.currentHour.hourIndex ?? 1,
      is_nocturnal: initialEntry?.is_nocturnal ?? (timing?.currentHour.isNocturnal ? 1 : 0),
      resonance,
      pre_state: 0,
      post_state: 5,
      working_type: workingType,
      tunnel_id: tunnelId,
      title: title.trim() || 'Untitled Ritual',
      body_md: finalBodyMd,
      visions: visions.trim() || null,
      pre_state_label: preStateLabel,
      post_state_label: postStateLabel,
      offerings,
      entities: selectedEntityIds.map((eid) => ({
        entity_id: eid,
        intensity: resonance,
        invoked: true,
      })),
      meditation_record: meditationRecordToSave,
    };

    await onSave(entryToSave);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-6 overflow-y-auto bg-black text-neutral-200 flex flex-col gap-6 select-none"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-red-500" />
            {initialEntry ? 'Edit Alchemical Record' : 'Record Ritual Working'}
          </h2>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Sealed with Client-Side SQLCipher Zero-Knowledge Encryption
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-mono transition-all"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-serif text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
          >
            <Save className="w-4 h-4" /> SEAL IN VAULT
          </button>
        </div>
      </div>

      {/* Astronomical & Timing Snapshot Banner */}
      {timing && (
        <div className="glass-panel p-4 rounded-xl border border-purple-900/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950 flex items-center justify-center border border-purple-800/60">
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block">Planetary Hour</span>
              <span className="text-neutral-100 font-bold capitalize">
                {timing.currentHour.correspondence.title}
              </span>
              <span className="text-[10px] text-amber-400 block">
                {timing.currentHour.isNocturnal ? 'Nocturnal Hour' : 'Diurnal Hour'} #{timing.currentHour.hourIndex}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center border border-blue-800/60">
              <Moon className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block">Lunar State</span>
              <span className="text-neutral-100 font-bold">
                {timing.lunarState.phaseLabel}
              </span>
              <span className="text-[10px] text-blue-300 block">
                {timing.lunarState.illuminationPct}% • Day {timing.lunarState.ageDays}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-950 flex items-center justify-center border border-red-800/60">
              <Flame className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block">Hour Daemon Ruler</span>
              <span className="text-neutral-100 font-bold">
                {timing.currentHour.correspondence.demonicRulers[0]}
              </span>
              <span className="text-[10px] text-red-300 block">
                Tunnel {timing.currentHour.correspondence.tunnelNumber} ({timing.currentHour.correspondence.tunnelName})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-950 flex items-center justify-center border border-amber-800/60">
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block">Magickal Day Ruler</span>
              <span className="text-neutral-100 font-bold capitalize">
                {timing.daySchedule.magickalDayRuler}
              </span>
              <span className="text-[10px] text-neutral-400 block">
                {timing.minutesRemainingInHour}m remaining in hour
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Journaling Modes Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <FileText className="w-3.5 h-3.5 text-neutral-400" />
          <span>Journal Mode:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleApplyTemplate('ritual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              workingType !== 'dream' && workingType !== 'daily_yap'
                ? 'bg-red-950/80 border border-red-700/60 text-red-200 font-bold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Ritual</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('dream')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              workingType === 'dream'
                ? 'bg-blue-950/80 border border-blue-700/60 text-blue-200 font-bold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-blue-400" />
            <span>Dream Log</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('yap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              workingType === 'daily_yap'
                ? 'bg-amber-950/80 border border-amber-700/60 text-amber-200 font-bold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Stream / Yap</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('meditation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              workingType === 'meditation'
                ? 'bg-rose-950/80 border border-rose-700/60 text-rose-200 font-bold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>Meditation Log</span>
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Title & Text Editors */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col gap-3">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Entry Title / Statement:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dream of the Obsidian Spire / Daily reflections..."
              required
              className="w-full bg-black/80 border border-neutral-700 rounded-lg px-3.5 py-2.5 font-serif text-lg text-neutral-100 focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Working Type Selector */}
          <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Category / Classification:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(WORKING_TYPE_LABELS) as WorkingType[]).map((wt) => {
                const info = WORKING_TYPE_LABELS[wt];
                const isSelected = workingType === wt;
                return (
                  <button
                    type="button"
                    key={wt}
                    onClick={() => {
                      setWorkingType(wt);
                      if (wt === 'meditation') setIsMeditationExpanded(true);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-mono text-left border transition-all ${
                      isSelected
                        ? `${info.color} shadow-[0_0_12px_rgba(220,38,38,0.3)] font-bold`
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dedicated Somatic & Sensory Meditation Protocol Form */}
          <div className="glass-panel p-5 rounded-xl border border-rose-900/60 bg-gradient-to-b from-rose-950/20 via-black to-neutral-950 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-950 flex items-center justify-center border border-rose-800/60">
                  <HeartPulse className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                    Recording Your Meditations
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800/50">
                      Somatic Protocol
                    </span>
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400">
                    Connolly Demonolatry Standards · Somatic, Sensory &amp; Mental Observation
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMeditationExpanded((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300 transition-all"
              >
                {isMeditationExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-rose-400" />
                    <span>Collapse Form</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-rose-400" />
                    <span>Expand All 10 Inputs</span>
                  </>
                )}
              </button>
            </div>

            {/* Compassionate Reflection Protocol Alert */}
            <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-900/50 text-xs text-neutral-200 leading-relaxed flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-amber-300 font-bold font-mono text-[11px] uppercase tracking-wider">
                  Mindful Reflection Guidance
                </span>
                <p className="text-neutral-300">
                  If you cannot fill in all of the spaces right away — don't force it. Allow yourself time to reflect on the experience and then go back and fill in the blanks at a later time. Noting how you felt is especially important.
                </p>
              </div>
            </div>

            {isMeditationExpanded && (
              <div className="flex flex-col gap-4 mt-1">
                {/* 1 & 2: Meditation Description & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase text-neutral-400">
                      Meditation Description:
                    </label>
                    <input
                      type="text"
                      value={meditationDesc}
                      onChange={(e) => setMeditationDesc(e.target.value)}
                      placeholder="e.g. Luciferian Sigil Gazing, Duke Berith commune, breath entrainment..."
                      className="w-full bg-black/80 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-sans text-neutral-100 focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase text-neutral-400">
                      Duration (Minutes):
                    </label>
                    <input
                      type="text"
                      value={meditationDuration}
                      onChange={(e) => setMeditationDuration(e.target.value)}
                      placeholder="e.g. 15 or 30 min"
                      className="w-full bg-black/80 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-mono text-neutral-100 focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3, 4, 5: Tri-Phase Feeling Progression */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase text-neutral-400">
                      1. How I felt BEFORE the meditation:
                    </label>
                    <textarea
                      value={feltBefore}
                      onChange={(e) => setFeltBefore(e.target.value)}
                      rows={3}
                      placeholder="Physical inertia, mental chatter, tension, fatigue, emotional agitation..."
                      className="w-full bg-black/80 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-200 focus:border-rose-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase text-neutral-400">
                      2. How I felt DURING the meditation:
                    </label>
                    <textarea
                      value={feltDuring}
                      onChange={(e) => setFeltDuring(e.target.value)}
                      rows={3}
                      placeholder="Pulsing third eye, floating sensations, deepening theta wave, timeless presence..."
                      className="w-full bg-black/80 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-200 focus:border-rose-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase text-neutral-400">
                      3. How I felt IMMEDIATELY AFTERWARD:
                    </label>
                    <textarea
                      value={feltAfter}
                      onChange={(e) => setFeltAfter(e.target.value)}
                      rows={3}
                      placeholder="Heightened awareness, empowered sovereign calm, awakened black flame..."
                      className="w-full bg-black/80 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-200 focus:border-rose-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* 6: Mind Pop-ups */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-neutral-400">
                    What kept popping into my mind during the meditation?
                  </label>
                  <textarea
                    value={mindPopups}
                    onChange={(e) => setMindPopups(e.target.value)}
                    rows={2}
                    placeholder="Recurring worries, mundane tasks, sudden astral flashes, words in foreign tongues..."
                    className="w-full bg-black/80 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-200 focus:border-rose-500 focus:outline-none resize-none"
                  />
                </div>

                {/* 7 & 8: Smells & Sounds */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase text-neutral-400">
                      👃 Smells I noticed:
                    </label>
                    <input
                      type="text"
                      value={smells}
                      onChange={(e) => setSmells(e.target.value)}
                      placeholder="Incense, frankincense, sandalwood, rose, metallic/ozone, sulfur, sweet earth..."
                      className="w-full bg-black/80 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase text-neutral-400">
                      👂 Sounds I noticed:
                    </label>
                    <input
                      type="text"
                      value={sounds}
                      onChange={(e) => setSounds(e.target.value)}
                      placeholder="Binaural drone, ringing in left ear, candle flickers, room acoustics, spirit whisper..."
                      className="w-full bg-black/80 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 9: Physical sensations with Posture Diagnostic Note */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-mono uppercase text-neutral-400">
                    🧘 Physical sensations (Posture, Tension &amp; Somatics):
                  </label>
                  <textarea
                    value={physicalSensations}
                    onChange={(e) => setPhysicalSensations(e.target.value)}
                    rows={2}
                    placeholder="Cramping in legs, muscles tensing in neck, tingling in palms, spine alignment, warmth..."
                    className="w-full bg-black/80 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-200 focus:border-rose-500 focus:outline-none resize-none"
                  />
                  <div className="p-3 rounded-lg bg-neutral-900/90 border border-amber-900/40 text-[11px] text-neutral-300 leading-relaxed flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-400">Posture Diagnostic Tip:</strong> Did you feel cramping in your legs? Were you aware of certain muscles tensing up? These could be meditation posture problems, which could be indicative that you need to find a different sitting position (e.g. utilizing a zafu meditation cushion, kneeling seiza, or an upright ergonomic chair).
                    </div>
                  </div>
                </div>

                {/* 10: Emotional sensations */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-neutral-400">
                    ❤️ Emotional sensations:
                  </label>
                  <textarea
                    value={emotionalSensations}
                    onChange={(e) => setEmotionalSensations(e.target.value)}
                    rows={2}
                    placeholder="Profound awe, release of sorrow, sovereign confidence, ecstasy, serenity, fearlessness..."
                    className="w-full bg-black/80 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-200 focus:border-rose-500 focus:outline-none resize-none"
                  />
                </div>

                {/* 11: Thoughts or Comments */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-neutral-400">
                    💭 Thoughts or Comments:
                  </label>
                  <textarea
                    value={thoughtsComments}
                    onChange={(e) => setThoughtsComments(e.target.value)}
                    rows={3}
                    placeholder="Epiphanies, philosophical insights, messages received, queries for your teacher..."
                    className="w-full bg-black/80 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-200 focus:border-rose-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Markdown Body Editor with Voice Dictation */}
          <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Journal Body / Thoughts & Operations (Markdown):
              </label>
              {/* Mic Voice Dictation Button */}
              {speechSupported ? (
                <button
                  type="button"
                  onClick={toggleVoiceDictation}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                    isListening
                      ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)] font-bold'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
                  }`}
                  title="Speak into your microphone to transcribe text directly into the body"
                >
                  {isListening ? (
                    <>
                      <Mic className="w-3.5 h-3.5 text-white" />
                      <span>Transcribing... (Tap to Stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dictate with Mic</span>
                    </>
                  )}
                </button>
              ) : (
                <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                  <MicOff className="w-3 h-3" /> Voice dictation requires Chrome/Edge/WebKit
                </span>
              )}
            </div>
            <textarea
              value={bodyMd}
              onChange={(e) => setBodyMd(e.target.value)}
              rows={9}
              placeholder="Speak or type freely... Record ritual operations, channeled gnosis, dream landscapes, or stream of consciousness..."
              className="w-full bg-black/80 border border-neutral-700 rounded-lg p-3 font-mono text-xs text-neutral-100 placeholder:text-neutral-600 focus:border-red-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Channeled Visions / Astral Impressions */}
          <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-purple-400">
              Channeled Messages, Visions & Astral Impressions:
            </label>
            <textarea
              value={visions}
              onChange={(e) => setVisions(e.target.value)}
              rows={4}
              placeholder="Words channeled during deep trance or death posture scrying..."
              className="w-full bg-black/80 border border-neutral-700 rounded-lg p-3 font-mono text-xs text-purple-200 placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column: Metadata, Resonance & Entities */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* 1–10 Resonance Rating */}
          <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Resonance Score (1–10):
              </label>
              <span className="font-mono text-base font-bold text-red-400 px-2 py-0.5 rounded bg-black border border-neutral-800">
                {resonance} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={resonance}
              onChange={(e) => setResonance(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
              <span>1 (Faint)</span>
              <span>5 (Equilibrium)</span>
              <span>10 (Apex Gnosis)</span>
            </div>
          </div>

          {/* Before & After Emotional State Shift */}
          <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col gap-3 text-xs">
            <label className="font-mono uppercase tracking-wider text-neutral-400 text-xs">
              Emotional State Shift:
            </label>
            <div>
              <span className="text-[10px] font-mono text-neutral-500 block mb-1">PRE-RITUAL (Ante):</span>
              <select
                value={preStateLabel}
                onChange={(e) => setPreStateLabel(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 font-mono text-xs text-neutral-200 focus:border-red-500 focus:outline-none"
              >
                {PRE_STATE_PRESETS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="text-[10px] font-mono text-neutral-500 block mb-1">POST-RITUAL (Post):</span>
              <select
                value={postStateLabel}
                onChange={(e) => setPostStateLabel(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 font-mono text-xs text-neutral-200 focus:border-purple-500 focus:outline-none"
              >
                {POST_STATE_PRESETS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Entities Invoked */}
          <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Entities Present / Invoked:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
              {entities.map((ent) => {
                const isSelected = selectedEntityIds.includes(ent.id);
                return (
                  <button
                    type="button"
                    key={ent.id}
                    onClick={() => toggleEntity(ent.id)}
                    className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                      isSelected
                        ? 'bg-red-950 border border-red-500 text-white font-semibold'
                        : 'bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {ent.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Offerings Given */}
          <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Offerings Given:
            </label>
            <div className="flex flex-col gap-1.5">
              {OFFERING_PRESETS.map((off) => {
                const isOffered = offerings.some((o) => o.kind === off.kind);
                return (
                  <button
                    type="button"
                    key={off.kind}
                    onClick={() => toggleOfferingKind(off.kind)}
                    className={`px-2.5 py-1.5 rounded text-left text-xs font-mono transition-all border ${
                      isOffered
                        ? 'bg-amber-950/60 border-amber-600/80 text-amber-200'
                        : 'bg-neutral-900/40 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {off.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tunnel of Set Linkage */}
          <div className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Associated Tunnel of Set (Optional):
            </label>
            <select
              value={tunnelId || ''}
              onChange={(e) => setTunnelId(e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 font-mono text-xs text-neutral-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="">None / General Working</option>
              {tunnels.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.number}. {t.name} (Atu: {t.atu})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </form>
  );
};

export default JournalEntryForm;
