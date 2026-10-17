import React, { useState, useEffect, useMemo } from 'react';
import {
  DEMONOLATRY_LESSONS,
  NINE_DEMONIC_DIVINITIES,
  DEMON_VARIATIONS_DIRECTORY,
  COURTESIES_OF_THE_SORCERER,
  DEMONOLATRY_HOLY_RITES,
  DemonicDivinity,
  DemonVariation,
} from './demonolatryData';
import { JournalEntryData } from '../../platform/vault';
import {
  BookOpen,
  Sparkles,
  Flame,
  CheckCircle2,
  Circle,
  Compass,
  Shield,
  Calendar,
  Layers,
  Wand2,
  Play,
  Square,
  RotateCcw,
  FileText,
  AlertTriangle,
  Feather,
} from 'lucide-react';

interface DemonolatryAcademyProps {
  onSendToJournal?: (draft: Partial<JournalEntryData>) => void;
  onNavigateToMeditation?: () => void;
  onNavigateToAstrolabe?: () => void;
  onNavigateToSigils?: (intent?: string) => void;
  onTuneToPortal?: (spirit: any) => void;
}

export const DemonolatryAcademy: React.FC<DemonolatryAcademyProps> = ({
  onSendToJournal,
  onNavigateToMeditation,
  onNavigateToAstrolabe,
  onNavigateToSigils,
  onTuneToPortal,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'study' | 'lab'>('study');
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('gnosticos_demonolatry_completed') || '[]');
    } catch {
      return [];
    }
  });

  // Lesson 1 State: Name Game search
  const [nameGameQuery, setNameGameQuery] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<DemonVariation>(DEMON_VARIATIONS_DIRECTORY[0]);
  const [polarityTarget, setPolarityTarget] = useState<'belial' | 'lucifer' | 'leviathan'>('belial');

  // Lesson 2 State: 9-Knot Cord & 5-Demons Patron Selector
  const [activeKnot, setActiveKnot] = useState<DemonicDivinity>(NINE_DEMONIC_DIVINITIES[0]);
  const [patronSlots, setPatronSlots] = useState<{
    alterEgo: string;
    opposite: string;
    elemental: string;
    aesthetic: string;
    hiddenEmotions: string;
  }>(() => {
    try {
      return JSON.parse(
        localStorage.getItem('gnosticos_patron_slots') ||
          JSON.stringify({
            alterEgo: 'Lucifer (Illumination & Sovereignty)',
            opposite: 'Belial (Grounding Stability)',
            elemental: 'Flereous (Fire / Passion)',
            aesthetic: 'Ronove (Languages & Rhetoric)',
            hiddenEmotions: 'Leviathan (Abyssal Subconscious)',
          }),
      );
    } catch {
      return {
        alterEgo: 'Lucifer',
        opposite: 'Belial',
        elemental: 'Flereous',
        aesthetic: 'Ronove',
        hiddenEmotions: 'Leviathan',
      };
    }
  });

  // Candle Meditation Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(1800); // 30 mins
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerActiveDemon, setTimerActiveDemon] = useState<string>('Lucifer');

  // Lesson 5 State: Consecration Step
  const [consecrationStep, setConsecrationStep] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('gnosticos_demonolatry_completed', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('gnosticos_patron_slots', JSON.stringify(patronSlots));
  }, [patronSlots]);

  // Candle Timer Clock
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          alert(`Meditation on ${timerActiveDemon} complete! Record your experience in the Alchemical Journal.`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerActiveDemon]);

  const toggleLessonComplete = (id: number) => {
    setCompletedLessons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const currentLesson = useMemo(() => {
    return DEMONOLATRY_LESSONS.find((l) => l.id === selectedLessonId) || DEMONOLATRY_LESSONS[0];
  }, [selectedLessonId]);

  const filteredVariants = useMemo(() => {
    if (!nameGameQuery.trim()) return DEMON_VARIATIONS_DIRECTORY;
    const q = nameGameQuery.toLowerCase();
    return DEMON_VARIATIONS_DIRECTORY.filter(
      (v) =>
        v.primaryName.toLowerCase().includes(q) ||
        v.variants.some((varName) => varName.toLowerCase().includes(q)) ||
        v.historicalContext.toLowerCase().includes(q),
    );
  }, [nameGameQuery]);

  // Homework send to Journal Handlers
  const handleSendLesson1Homework = () => {
    if (!onSendToJournal) return;
    onSendToJournal({
      title: `Demonolatry Lesson 1: Name Game Analysis of ${selectedVariant.primaryName}`,
      working_type: 'meditation',
      resonance: 8,
      pre_state_label: 'Seeking Gnosis',
      post_state_label: 'Hermetic Gnosis',
      body_md: `### Demonolatry Lesson 1 Homework: Name Variations & Archetypal Polarity

**Demon Investigated:** ${selectedVariant.primaryName}
**Historical Variants:** ${selectedVariant.variants.join(', ')}
**Original Pre-Christian Deity Role:** ${selectedVariant.originalRole}
**Grimoire / Demonic Catalogue Translation:** ${selectedVariant.grimoireRole}

#### Historical Analysis & "Name Game" Reflections:
${selectedVariant.historicalContext}

**Personal Observations on Archetypal Polarity:**
The definition of this Demon is an aspect, not its sole purpose. Working with this entity provides access to divine intelligence replete with wisdom (*daimon*).
`,
    });
  };

  const handleSendPatronMeditationToJournal = () => {
    if (!onSendToJournal) return;
    const minutes = Math.round((1800 - timerSeconds) / 60) || 30;
    onSendToJournal({
      title: `Patron Meditation: 5-Demons Contemplation (${timerActiveDemon})`,
      working_type: 'meditation',
      resonance: 9,
      pre_state_label: 'Neutral / Seeking Gnosis',
      post_state_label: 'Grounded Equilibrium',
      meditation_record: {
        duration_minutes: minutes,
        description: `Connolly 5-Demons Patron Selection Exercise: Candle gazing on ${timerActiveDemon}`,
        felt_before: 'Seeking clarity on demonic resonance and spiritual alter-ego',
        felt_during: 'Steady candlelight contemplation, sensory and somatic awareness',
        felt_after: 'Resonant alignment and deep spiritual impression',
        mind_popups: `Thoughts regarding attributes of ${timerActiveDemon}`,
        smells: 'Candle wax, ritual incense',
        sounds: 'Quiet room resonance, rhythmic breath',
        physical_sensations: 'Stable posture, warmth radiating from candle',
        emotional_sensations: 'Reverence, sovereign calm, intuitive communion',
        thoughts_comments: `Evaluating ${timerActiveDemon} as candidate for Patron/Matron vs Mentor Demon.`,
      },
    });
  };

  const handleSendRiteToJournal = (rite: typeof DEMONOLATRY_HOLY_RITES[0]) => {
    if (!onSendToJournal) return;
    onSendToJournal({
      title: `Holy Rite Preparation: ${rite.name} (${rite.demonRuler})`,
      working_type: 'invocation',
      resonance: 9,
      pre_state_label: 'Seeking Gnosis',
      post_state_label: 'Draconian Sovereignty',
      body_md: `### ${rite.name} — Ritual Operations & Seasonal Attunement

**Date / Season:** ${rite.dateStr}
**Presiding Daemon:** ${rite.demonRuler}
**Governing Element:** ${rite.element}
**Cosmic Significance:** ${rite.significance}

#### Three-Part Ritual Layout:
1. **The Beginning:**
   - Construct the Elemental Circle honoring East (Lucifer/Air), South (Flereous/Fire), West (Leviathan/Water), North (Belial/Earth), and Center (Satan/Spirit).
   - Polite invitation of ${rite.demonRuler} without coercion.

2. **The Middle:**
   - Recognize the seasonal shift: ${rite.purpose}
   - Presentation of offerings upon the altar.
   - Intention of will spoken as the bridge to manifestation.

3. **The End:**
   - Polite expressions of gratitude to ${rite.demonRuler} and all attending divine intelligences before their departure.
`,
    });
  };

  const formatTimerTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-black text-neutral-200 p-6 flex flex-col gap-6 select-none font-sans">
      {/* Academy Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-neutral-900 to-amber-700 flex items-center justify-center border border-red-500/50 shadow-[0_0_18px_rgba(220,38,38,0.4)]">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-decorative text-2xl font-bold tracking-wider text-white flex items-center gap-2">
              Demonolatry Academy &amp; Practice Codex
            </h1>
            <p className="text-xs font-mono text-neutral-400">
              S. Connolly Authentic Course Notes · 5 Foundational Lessons · Ritual Labs &amp; Homework
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-neutral-900/80 p-1.5 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('study')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'study'
                ? 'bg-red-950/90 border border-red-700/80 text-white font-bold shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>Class Notes &amp; Text</span>
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'lab'
                ? 'bg-amber-950/90 border border-amber-700/80 text-white font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Practical Laboratory &amp; Tools</span>
          </button>
        </div>
      </div>

      {/* Lesson Navigation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {DEMONOLATRY_LESSONS.map((lesson) => {
          const isSelected = selectedLessonId === lesson.id;
          const isCompleted = completedLessons.includes(lesson.id);
          return (
            <button
              key={lesson.id}
              onClick={() => setSelectedLessonId(lesson.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-gradient-to-b from-red-950/60 to-black border-red-600/80 shadow-[0_0_12px_rgba(220,38,38,0.3)]'
                  : 'bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                  Lesson 0{lesson.id}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLessonComplete(lesson.id);
                  }}
                  title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  className="text-neutral-400 hover:text-white"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-600 hover:text-neutral-400" />
                  )}
                </button>
              </div>
              <div className="font-serif text-xs font-bold text-neutral-100 line-clamp-1">
                {lesson.title.split(':')[1] || lesson.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Class Notes & Philosophy Reader */}
      {activeTab === 'study' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Reading Section */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-neutral-800 flex flex-col gap-5">
              <div className="border-b border-neutral-800 pb-4">
                <span className="font-mono text-[11px] text-red-400 uppercase tracking-widest block">
                  Curriculum Module · Lesson {currentLesson.id}
                </span>
                <h2 className="font-serif text-2xl font-bold text-white mt-1">
                  {currentLesson.title}
                </h2>
                <p className="text-xs font-mono text-neutral-400 mt-1 italic">
                  {currentLesson.subtitle}
                </p>
              </div>

              {/* Sections Breakdown */}
              <div className="flex flex-col gap-6">
                {currentLesson.sections.map((sec, idx) => (
                  <div key={idx} className="flex flex-col gap-2.5">
                    <h3 className="font-serif text-lg font-bold text-amber-200/90 flex items-center gap-2">
                      <Feather className="w-4 h-4 text-amber-500" />
                      {sec.heading}
                    </h3>
                    <p className="text-sm font-sans text-neutral-300 leading-relaxed text-justify">
                      {sec.body}
                    </p>
                    {sec.keyTakeaway && (
                      <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs font-mono text-amber-300/90 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white uppercase text-[10px] block">Key Concept:</strong>
                          {sec.keyTakeaway}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Verbatim Class Notes Accordion */}
              <details className="mt-4 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 text-xs font-mono text-neutral-400">
                <summary className="cursor-pointer font-bold text-neutral-300 hover:text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-neutral-400" />
                  View Original Complete Class Transcript Notes
                </summary>
                <div className="mt-3 p-3 bg-black/60 rounded-lg text-neutral-300 whitespace-pre-wrap font-sans text-xs leading-relaxed max-h-96 overflow-y-auto border border-neutral-900">
                  {currentLesson.verbatimNotes}
                </div>
              </details>
            </div>
          </div>

          {/* Right Column: Homework & Practical Bridge */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Homework Assignment Card */}
            <div className="glass-panel p-5 rounded-2xl border border-amber-900/50 bg-gradient-to-b from-amber-950/20 via-black to-neutral-950 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base border-b border-amber-900/40 pb-2">
                <Wand2 className="w-4 h-4 text-amber-400" />
                <span>Class Homework Assignment</span>
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-white">
                  {currentLesson.homeworkTitle}
                </h4>
                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                  {currentLesson.homeworkInstructions}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('lab')}
                  className="w-full py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono flex items-center justify-center gap-2 transition-all font-bold"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  Launch Interactive Lab for Lesson {currentLesson.id}
                </button>

                {currentLesson.id === 1 && (
                  <button
                    onClick={handleSendLesson1Homework}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-serif text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Record Homework in Journal
                  </button>
                )}

                {currentLesson.id === 2 && (
                  <button
                    onClick={handleSendPatronMeditationToJournal}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-serif text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Record 5-Demons in Journal
                  </button>
                )}
              </div>
            </div>

            {/* Quick Wisdom Callout */}
            <div className="glass-panel p-4 rounded-xl border border-neutral-800 text-xs font-mono text-neutral-400 flex flex-col gap-2">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">
                Demonolatry Principle
              </span>
              <p className="text-neutral-300 italic leading-relaxed">
                "Demonolatry stems from pre-Christian religions, which were all nature oriented. Our universe is balance and mathematical. Daemons are divine intelligences with whom we form sovereign, mutually respectful partnerships."
              </p>
              <span className="text-[10px] text-red-400 text-right block">— S. Connolly</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Practical Interactive Laboratories */}
      {activeTab === 'lab' && (
        <div className="flex flex-col gap-6">
          {/* LAB 1: The Name Game & Demon Directory Explorer */}
          {selectedLessonId === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-red-500" />
                      The "Name Game" &amp; Transmutation Directory
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Explore how translation errors and church catalogues modified ancient deities into Goetic spirits.
                    </p>
                  </div>

                  <input
                    type="text"
                    value={nameGameQuery}
                    onChange={(e) => setNameGameQuery(e.target.value)}
                    placeholder="Search Demon name or variant (e.g. Asmodeus, Dagon, Ronove)..."
                    className="w-full bg-black/80 border border-neutral-700 rounded-lg px-3.5 py-2 text-xs font-mono text-white placeholder:text-neutral-500 focus:border-red-500 focus:outline-none"
                  />

                  <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                    {filteredVariants.map((item) => (
                      <button
                        key={item.primaryName}
                        onClick={() => setSelectedVariant(item)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                          selectedVariant.primaryName === item.primaryName
                            ? 'bg-red-950/60 border-red-600 text-white'
                            : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm font-bold text-neutral-100">
                            {item.primaryName}
                          </span>
                          <span className="font-mono text-[10px] uppercase text-amber-400">
                            {item.element}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400 line-clamp-1">
                          Variants: {item.variants.join(', ')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Variant Dossier */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="glass-panel p-6 rounded-2xl border border-red-900/50 bg-gradient-to-b from-red-950/20 via-black to-neutral-950 flex flex-col gap-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-red-900/40 pb-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white">
                        {selectedVariant.primaryName}
                      </h3>
                      <span className="text-[10px] font-mono text-red-300 block">
                        Known Spelling Variations: {selectedVariant.variants.join(' • ')}
                      </span>
                    </div>
                    {selectedVariant.enn && (
                      <span className="text-[10px] font-mono text-amber-300 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/40">
                        Enn Active
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 text-xs leading-relaxed">
                    <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800">
                      <span className="text-neutral-400 font-mono text-[10px] uppercase block font-bold">
                        Pre-Christian Deity Role:
                      </span>
                      <p className="text-neutral-200 mt-1">{selectedVariant.originalRole}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800">
                      <span className="text-neutral-400 font-mono text-[10px] uppercase block font-bold">
                        Church Catalogue &amp; Grimoire Reinterpretation:
                      </span>
                      <p className="text-neutral-200 mt-1">{selectedVariant.grimoireRole}</p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-neutral-900/90 border border-red-900/40">
                      <span className="text-red-400 font-mono text-[10px] uppercase block font-bold">
                        Historical "Name Game" Analysis:
                      </span>
                      <p className="text-neutral-300 mt-1">{selectedVariant.historicalContext}</p>
                    </div>

                    {selectedVariant.enn && (
                      <div className="p-3 rounded-lg bg-black/60 border border-neutral-800 font-serif italic text-amber-200 text-center">
                        “{selectedVariant.enn}”
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex items-center gap-3">
                    <button
                      onClick={handleSendLesson1Homework}
                      className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-serif text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Export Analysis to Journal
                    </button>
                    {onTuneToPortal && (
                      <button
                        onClick={() => onTuneToPortal({ name: selectedVariant.primaryName, enn: selectedVariant.enn })}
                        className="py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
                        title="Tune Spirit Portal"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tune Portal
                      </button>
                    )}
                  </div>
                </div>

                {/* Polarity Matrix */}
                <div className="glass-panel p-5 rounded-2xl border border-neutral-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Archetypal Polarity Inspector
                    </h4>
                    <div className="flex items-center gap-1">
                      {(['belial', 'lucifer', 'leviathan'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setPolarityTarget(t)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize transition-all ${
                            polarityTarget === t
                              ? 'bg-red-950 text-red-200 border border-red-700'
                              : 'text-neutral-500 hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {polarityTarget === 'belial' && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                        <span className="text-red-400 font-mono text-[10px] block font-bold">
                          Masculine Archetype:
                        </span>
                        <p className="text-neutral-300 mt-1">
                          Carnal nature, physical strength, stability, earthly foundation, sovereign independence.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                        <span className="text-emerald-400 font-mono text-[10px] block font-bold">
                          Feminine Archetype:
                        </span>
                        <p className="text-neutral-300 mt-1">
                          Nurturing Mother Earth, bountiful harvest, patience, subterranean womb of seeds.
                        </p>
                      </div>
                    </div>
                  )}

                  {polarityTarget === 'lucifer' && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                        <span className="text-amber-400 font-mono text-[10px] block font-bold">
                          Masculine Archetype:
                        </span>
                        <p className="text-neutral-300 mt-1">
                          The Light Bearer, independent intellect, sovereign will, black flame awakening.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                        <span className="text-blue-400 font-mono text-[10px] block font-bold">
                          Feminine Archetype:
                        </span>
                        <p className="text-neutral-300 mt-1">
                          Morning Star Venus / Ishtar, intuitive illumination, sublime poetic gnosis.
                        </p>
                      </div>
                    </div>
                  )}

                  {polarityTarget === 'leviathan' && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                        <span className="text-blue-400 font-mono text-[10px] block font-bold">
                          Masculine Archetype:
                        </span>
                        <p className="text-neutral-300 mt-1">
                          Primordial sea serpent, abyssal power, relentless tidal momentum.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                        <span className="text-purple-400 font-mono text-[10px] block font-bold">
                          Feminine Archetype:
                        </span>
                        <p className="text-neutral-300 mt-1">
                          Astral womb, psychic reception, dream incubation, subconscious tides.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LAB 2: 9 Demonic Divinities Knot-Cord & 5-Demons Patron Selector */}
          {selectedLessonId === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Virtual 9-Knot Prayer Cord */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-purple-400" />
                      The 9 Demonic Divinities Prayer Cord
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Finger the nine sacred knots. Connect through intention of will and chanted enns.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {NINE_DEMONIC_DIVINITIES.map((div) => {
                      const isSelected = activeKnot.number === div.number;
                      return (
                        <button
                          key={div.number}
                          onClick={() => setActiveKnot(div)}
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            isSelected
                              ? 'bg-purple-950/70 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center font-mono text-[10px] text-amber-400">
                            {div.knotIndex}
                          </span>
                          <span className="font-serif text-xs font-bold">{div.name}</span>
                          <span className="text-[9px] font-mono text-neutral-500 line-clamp-1">
                            {div.element}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Knot Detail Card */}
                  <div className="p-4 rounded-xl bg-black/60 border border-purple-900/40 flex flex-col gap-3 text-xs">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="font-serif text-base font-bold text-purple-200">
                        Knot #{activeKnot.knotIndex}: {activeKnot.name}
                      </span>
                      <span className="font-mono text-[10px] text-amber-400 uppercase">
                        {activeKnot.direction}
                      </span>
                    </div>

                    <div className="font-serif italic text-amber-200 text-center py-1 bg-neutral-900/60 rounded">
                      “{activeKnot.enn}”
                    </div>

                    <div className="text-neutral-300 leading-relaxed font-sans text-xs">
                      <strong className="text-purple-300 font-mono text-[10px] uppercase block">
                        Intention of Will Prayer:
                      </strong>
                      {activeKnot.prayer}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-1 pt-2 border-t border-neutral-800">
                      <div>
                        <span className="text-neutral-500 uppercase block">Active / Solar:</span>
                        <span className="text-neutral-300">{activeKnot.polarity.masculine}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 uppercase block">Receptive / Lunar:</span>
                        <span className="text-neutral-300">{activeKnot.polarity.feminine}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Demons Patron Selection & Candle Meditation Laboratory */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-amber-900/50 bg-gradient-to-b from-amber-950/20 via-black to-neutral-950 flex flex-col gap-4 shadow-xl">
                  <div className="border-b border-amber-900/40 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-500" />
                        5-Demons Patron/Matron Discovery Tool
                      </h3>
                      <p className="text-xs font-mono text-neutral-400">
                        Homework 2 Practice · Map your inner archetypes and sit with a candle
                      </p>
                    </div>
                  </div>

                  {/* 5 Slots */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] text-amber-400 uppercase">
                        1. Alter-Ego Demon (Aspirational Self):
                      </label>
                      <input
                        type="text"
                        value={patronSlots.alterEgo}
                        onChange={(e) => setPatronSlots({ ...patronSlots, alterEgo: e.target.value })}
                        className="bg-black/80 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] text-amber-400 uppercase">
                        2. Complete Opposite Demon (Balancing):
                      </label>
                      <input
                        type="text"
                        value={patronSlots.opposite}
                        onChange={(e) => setPatronSlots({ ...patronSlots, opposite: e.target.value })}
                        className="bg-black/80 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] text-amber-400 uppercase">
                        3. Natal Elemental Demon:
                      </label>
                      <input
                        type="text"
                        value={patronSlots.elemental}
                        onChange={(e) => setPatronSlots({ ...patronSlots, elemental: e.target.value })}
                        className="bg-black/80 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] text-amber-400 uppercase">
                        4. Aesthetic / Image / Hobby Demon:
                      </label>
                      <input
                        type="text"
                        value={patronSlots.aesthetic}
                        onChange={(e) => setPatronSlots({ ...patronSlots, aesthetic: e.target.value })}
                        className="bg-black/80 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-col gap-1">
                      <label className="font-mono text-[10px] text-amber-400 uppercase">
                        5. Hidden Emotions Demon (Shadow Depth):
                      </label>
                      <input
                        type="text"
                        value={patronSlots.hiddenEmotions}
                        onChange={(e) => setPatronSlots({ ...patronSlots, hiddenEmotions: e.target.value })}
                        className="bg-black/80 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Candle Meditation Chamber */}
                  <div className="p-4 rounded-xl bg-black/80 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Flickering Candle Graphic */}
                      <div className="relative w-10 h-16 flex flex-col items-center justify-end">
                        <div
                          className={`w-3.5 h-6 rounded-full bg-gradient-to-t from-amber-600 via-yellow-400 to-white shadow-[0_0_20px_rgba(245,158,11,0.8)] transition-all ${
                            timerRunning ? 'animate-bounce' : 'opacity-60'
                          }`}
                        />
                        <div className="w-5 h-8 bg-neutral-800 rounded-t border-t border-neutral-700" />
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                          30-Min Candle Focus Chamber
                        </span>
                        <div className="font-mono text-2xl font-bold text-white tracking-widest">
                          {formatTimerTime(timerSeconds)}
                        </div>
                        <span className="text-[11px] font-serif text-amber-300">
                          Focusing on: {timerActiveDemon}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={timerActiveDemon}
                        onChange={(e) => setTimerActiveDemon(e.target.value)}
                        className="bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                      >
                        <option value={patronSlots.alterEgo || 'Alter-Ego'}>Slot 1: Alter-Ego</option>
                        <option value={patronSlots.opposite || 'Opposite'}>Slot 2: Opposite</option>
                        <option value={patronSlots.elemental || 'Elemental'}>Slot 3: Elemental</option>
                        <option value={patronSlots.aesthetic || 'Aesthetic'}>Slot 4: Aesthetic</option>
                        <option value={patronSlots.hiddenEmotions || 'Hidden Emotions'}>Slot 5: Shadow</option>
                      </select>

                      <button
                        onClick={() => setTimerRunning((p) => !p)}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold font-mono text-xs flex items-center gap-1 transition-all"
                      >
                        {timerRunning ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {timerRunning ? 'Pause' : 'Start'}
                      </button>

                      <button
                        onClick={() => {
                          setTimerRunning(false);
                          setTimerSeconds(1800);
                        }}
                        className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
                        title="Reset 30 min"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                    {onNavigateToMeditation && (
                      <button
                        onClick={onNavigateToMeditation}
                        className="py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-500" /> Open Lucifer Meditation Chamber
                      </button>
                    )}
                    <button
                      onClick={handleSendPatronMeditationToJournal}
                      className="py-2.5 px-4 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-serif text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(220,38,38,0.4)] flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Record Meditation in Alchemical Journal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAB 3: Invocation vs Evocation & Ascension Trance */}
          {selectedLessonId === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    Invocation vs. Evocation Protocol
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex flex-col gap-2">
                      <span className="font-serif font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Invocation (Demonolatry)
                      </span>
                      <p className="text-neutral-300 leading-relaxed">
                        A personal, polite invite honoring the free will of the Demonic intelligence. Conducive circle of balance. Long-term mutually beneficial spiritual alliance.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 flex flex-col gap-2">
                      <span className="font-serif font-bold text-red-300 text-sm flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        Evocation (Ceremonial Force)
                      </span>
                      <p className="text-neutral-300 leading-relaxed">
                        Attempting to bind or coerce entities against their will with holy names. Leads to terrifying backlashes, fear, and practitioners fleeing back to dogma.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-purple-900/50 bg-gradient-to-b from-purple-950/20 via-black to-neutral-950 flex flex-col gap-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-purple-400" />
                    Ascension Meditation &amp; Sigil Crafting
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Ascension is a deep meditative state wherein the adept communes directly with demonic entities to receive gnosis, personal enns, or customized seals.
                  </p>
                  <div className="pt-2 border-t border-neutral-800 flex items-center gap-3">
                    {onNavigateToSigils && (
                      <button
                        onClick={() => onNavigateToSigils('IT IS MY WILL TO COMMUNE IN ASCENSION WITH WISDOM')}
                        className="py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-mono text-xs flex items-center gap-2 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Launch Chaos Sigil Forge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAB 4: Courtesies of the Sorcerer & Liturgical Holy Rites */}
          {selectedLessonId === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Courtesies */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-500" />
                      The Courtesies of the Sorcerer (Dukanté Sect Law)
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Codes of conduct ensuring working harmony and preventing self-depletion of power.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto">
                    {COURTESIES_OF_THE_SORCERER.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-1 text-xs"
                      >
                        <span className="font-serif font-bold text-amber-200">
                          {c.id}. {c.title}
                        </span>
                        <p className="text-neutral-300 leading-relaxed">{c.principle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Liturgical Holy Rites Calendar */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-amber-900/50 bg-gradient-to-b from-amber-950/20 via-black to-neutral-950 flex flex-col gap-4 shadow-xl">
                  <div className="border-b border-amber-900/40 pb-3">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      The 6 Major Liturgical Holy Rites
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      The seasonal cycle of the Demonolatry year (Equinoxes &amp; Solstices)
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {DEMONOLATRY_HOLY_RITES.map((rite) => (
                      <div
                        key={rite.id}
                        className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col gap-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-white text-sm">
                            {rite.name}
                          </span>
                          <span className="font-mono text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                            {rite.dateStr}
                          </span>
                        </div>
                        <p className="text-neutral-300 text-[11px] leading-relaxed">
                          {rite.significance}
                        </p>
                        <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-purple-300">
                            Element: {rite.element} · Daemon: {rite.demonRuler}
                          </span>
                          <button
                            onClick={() => handleSendRiteToJournal(rite)}
                            className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-[10px] flex items-center gap-1 transition-all"
                          >
                            <BookOpen className="w-3 h-3 text-red-400" />
                            <span>Prepare in Journal</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAB 5: Ritual Tools 4-Element Consecration & Elemental Imbalances */}
          {selectedLessonId === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Consecration Chamber */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-amber-400" />
                      Ritual Tools 4-Element Consecration Chamber
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Pass your tools through the four elements before infusing with your will.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[
                      { step: 1, element: 'Fire 🔥', action: 'Pass the tool through the candle flame three times, purifying stagnant vibrations.' },
                      { step: 2, element: 'Earth 🌿', action: 'Scour the tool with sea salt and dry earth, anchoring it in the physical realm.' },
                      { step: 3, element: 'Water 💧', action: 'Rinse the tool with consecrated or spring water, blessing it with emotional flow.' },
                      { step: 4, element: 'Air 💨', action: 'Allow the tool to air-dry in the breeze, passing through the smoke of light incense.' },
                      { step: 5, element: 'Will Infusion ⚡', action: 'Mentally infuse the item with your sovereign will and the sigil of your Matron/Patron.' },
                    ].map((st) => (
                      <div
                        key={st.step}
                        onClick={() => setConsecrationStep(st.step)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 text-xs ${
                          consecrationStep === st.step
                            ? 'bg-amber-950/60 border-amber-600 text-white shadow-md'
                            : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center font-mono font-bold text-amber-400 shrink-0">
                          {st.step}
                        </span>
                        <div>
                          <span className="font-serif font-bold text-white block">
                            Stage {st.step}: {st.element}
                          </span>
                          <p className="text-neutral-300 mt-0.5 leading-relaxed">{st.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Elemental Imbalance Diagnostics & Natal Astrolabe */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-red-900/50 bg-gradient-to-b from-red-950/20 via-black to-neutral-950 flex flex-col gap-4 shadow-xl">
                  <div className="border-b border-red-900/40 pb-3">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-red-500" />
                      Natal Elemental Imbalances &amp; Balancing
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Understand how your astrological elemental breakdown affects magical energy transmission.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/50">
                      <span className="font-mono text-blue-400 font-bold block">Water Dominant:</span>
                      <p className="text-neutral-300 mt-1 text-[11px] leading-relaxed">
                        Electricity scatters in water with no clear direction. Magicians struggle with mental focus. Counter with Earth grounding.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/50">
                      <span className="font-mono text-emerald-400 font-bold block">Earth Dominant:</span>
                      <p className="text-neutral-300 mt-1 text-[11px] leading-relaxed">
                        Electricity grounds immediately on contact. Magicians struggle to project energy before it grounds. Counter with Air movement.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/50">
                      <span className="font-mono text-amber-400 font-bold block">Air Dominant:</span>
                      <p className="text-neutral-300 mt-1 text-[11px] leading-relaxed">
                        Electricity slices through air. Magicians risk overextending or overdoing, accidentally causing collateral discord.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50">
                      <span className="font-mono text-red-400 font-bold block">Fire Dominant:</span>
                      <p className="text-neutral-300 mt-1 text-[11px] leading-relaxed">
                        Fire blends with electricity. Magicians expend all energy creating it, leaving them physically exhausted after rites.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex flex-col sm:flex-row items-center gap-2">
                    {onNavigateToAstrolabe && (
                      <button
                        onClick={onNavigateToAstrolabe}
                        className="w-full sm:w-auto flex-1 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Compass className="w-3.5 h-3.5 text-amber-400" />
                        <span>Inspect Natal Astrolabe</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (!onSendToJournal) return;
                        onSendToJournal({
                          title: 'Elemental Balancing Ritual Record',
                          working_type: 'elemental_balancing',
                          resonance: 9,
                          pre_state_label: 'Discord / Turmoil',
                          post_state_label: 'Grounded Equilibrium',
                          body_md: `### Elemental Balancing Ritual (Lesson 5 Homework)

**Target Balance:** Earth, Air, Fire, Water harmony.
**Identified Natal Imbalance:** High emotional water and mental air.
**Demonic Invocations:**
- North: Belial (Earth grounding)
- East: Lucifer (Intellectual clarity)
- South: Flereous (Controlled will flame)
- West: Leviathan (Emotional composure)

**Somatic & Practical Results:**
Restored grounded equilibrium. Cleared muscle fatigue and stabilized energetic flow.
`,
                        });
                      }}
                      className="w-full sm:w-auto flex-1 py-2 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-serif text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(220,38,38,0.4)] flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Record Balancing in Journal</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DemonolatryAcademy;
