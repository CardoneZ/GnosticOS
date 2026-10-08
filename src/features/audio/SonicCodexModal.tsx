import React, { useState } from 'react';
import {
  X,
  Headphones,
  Radio,
  Waves,
  Activity,
  Flame,
  ShieldAlert,
  BookOpen,
  Sparkles,
  Compass,
} from 'lucide-react';

interface SonicCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CodexTab = 'brainwaves' | 'carriers' | 'keys' | 'timbres' | 'subliminal' | 'safety';

export const SonicCodexModal: React.FC<SonicCodexModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<CodexTab>('brainwaves');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800/80 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-500 shadow-[0_0_12px_rgba(220,38,38,0.4)]">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Sonic Sanctum Codex
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50">
                  Acoustic & Esoteric Guide
                </span>
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Psychoacoustics, Brainwave Entrainment & Kenneth Grant’s Nightside Sonic Keys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all border border-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-neutral-800/60 flex gap-2 overflow-x-auto bg-neutral-950/50">
          {[
            { id: 'brainwaves', label: 'Brainwave Bands', icon: Activity },
            { id: 'carriers', label: 'Sacred Frequencies', icon: Waves },
            { id: 'keys', label: 'Typhonian Keys', icon: Compass },
            { id: 'timbres', label: 'Soundscape Timbres', icon: Sparkles },
            { id: 'subliminal', label: 'Subliminal Invocations', icon: Flame },
            { id: 'safety', label: 'Acoustic Safety', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CodexTab)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? 'border-red-500 text-red-400 font-bold bg-red-950/20'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-neutral-300 leading-relaxed font-sans">
          {activeTab === 'brainwaves' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <h3 className="font-serif text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-purple-400" />
                  What Are Binaural Beats?
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  When two tones of slightly differing frequencies are presented separately to each ear via stereo headphones,
                  the brain’s superior olivary complex synthesizes a third phantom frequency equal to the mathematical difference:
                  <code className="text-amber-300 font-mono ml-1">Beat (Hz) = |Frequency_Right − Frequency_Left|</code>.
                  This process, known as <strong>Frequency Following Response (FFR)</strong>, gently synchronizes electrical brainwave oscillations across the cerebral hemispheres.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-black/60 border border-indigo-900/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-indigo-400">DELTA (0.5 – 4.0 Hz)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300">Subconscious Void</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Dreamless sleep, deep cellular regeneration, shadow work, and autonomic restructuring. Ideal for accessing the primal unconscious without conscious interference.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-black/60 border border-red-900/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-red-400">THETA (4.0 – 7.5 Hz)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300">Shamanic Gnosis</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    The borderland of hypnagogia, deep scrying, astral projection, and magical gnosis. Austin Osman Spare’s "Death Posture" and creative trance occur primarily within the 5–7 Hz window.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-black/60 border border-emerald-900/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-emerald-400">ALPHA (8.0 – 12.0 Hz)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">Ritual Focus</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Calm, alert mindfulness, vivid mental visualization, and ceremonial focus. Bridges the conscious analytical mind with subconscious receptivity.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-black/60 border border-amber-900/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-amber-400">GAMMA (30.0 – 50.0 Hz)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">Illumination</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Hyper-awareness, peak mystical experience, Kundalini arousal, and sudden synthesis of complex esoteric knowledge.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'carriers' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                In GnosticOS, the <strong>Carrier Frequency</strong> is the fundamental pitch upon which the binaural split rides. While the Sonic Key of each Tunnel provides the natural astrological pitch, you can override it with universal sacred tunings:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-black/60 border border-neutral-800 flex items-start gap-3">
                  <span className="px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 text-xs font-mono font-bold shrink-0">
                    108 Hz
                  </span>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-white">Vedic Cosmic Grounding (Om Frequency)</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      108 represents the cosmic ratio of distance between Earth, Sun, and Moon. An anchor frequency that grounds excessive nervous tension during intense evocation.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-black/60 border border-neutral-800 flex items-start gap-3">
                  <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 text-xs font-mono font-bold shrink-0">
                    432 Hz
                  </span>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-white">Verdi / Natural Pythagorean Pitch</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Mathematical tuning aligned with the harmonic series of nature (unlike modern arbitrary 440 Hz). Calms cardiac rhythm and induces effortless visual focus in scrying mirrors.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-black/60 border border-neutral-800 flex items-start gap-3">
                  <span className="px-2 py-1 rounded bg-red-950 text-red-300 border border-red-800 text-xs font-mono font-bold shrink-0">
                    528 Hz
                  </span>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-white">Solfeggio Transformation (MI — Miracle & DNA Renewal)</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      The core Solfeggio frequency of alchemical transmutation. Used in the Crucible and Illumination Forge to break habitual cognitive stagnation and manifest sovereign will.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-black/60 border border-neutral-800 flex items-start gap-3">
                  <span className="px-2 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 text-xs font-mono font-bold shrink-0">
                    639 Hz
                  </span>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-white">Solfeggio Spirit Communion (FA — Interconnection)</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Enhances interpersonal communion, telepathic empathy, and establishing harmonic resonance during spirit invocations in the Grimoire.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <h3 className="font-serif text-base font-bold text-white mb-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-400" />
                  Kenneth Grant’s Nightside Sonic Keys
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  In <em>Nightside of Eden</em> (1977), Kenneth Grant revealed that the 22 Tunnels of Set that honeycomb the backside of the Tree of Life resonate to specific musical keys and acoustic textures. In GnosticOS, selecting any Tunnel automatically tunes the acoustic synthesizer to its authentic vibratory signature.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded bg-black/60 border border-neutral-800">
                  <span className="text-red-400 font-bold block mb-1">Key of F# (Path 14 / Lucifer / Chokmah)</span>
                  <p className="text-neutral-400 text-[11px] font-sans">
                    Vibrates the current of creative illumination, phosphorus flame, and sovereign will.
                  </p>
                </div>

                <div className="p-3 rounded bg-black/60 border border-neutral-800">
                  <span className="text-amber-400 font-bold block mb-1">Key of D (Belial / Malkuth / Earth)</span>
                  <p className="text-neutral-400 text-[11px] font-sans">
                    Resonates with masterless sovereignty, material foundation, and unbreakable physical willpower.
                  </p>
                </div>

                <div className="p-3 rounded bg-black/60 border border-neutral-800">
                  <span className="text-blue-400 font-bold block mb-1">Key of G# (Leviathan / Abyssal Waters)</span>
                  <p className="text-neutral-400 text-[11px] font-sans">
                    Tuned to the serpentine subconscious ocean, emotional alchemy, and Kundalini awakening.
                  </p>
                </div>

                <div className="p-3 rounded bg-black/60 border border-neutral-800">
                  <span className="text-purple-400 font-bold block mb-1">Grant’s Sonic Textures</span>
                  <p className="text-neutral-400 text-[11px] font-sans">
                    <strong>Chatter:</strong> 13 Hz square LFO gating a high partial (Tunnel 11 / Baratchial).<br />
                    <strong>Roar:</strong> Filtered subterranean brown noise swell (Tunnel 22 / Temphioth).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timbres' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                To prevent auditory fatigue, GnosticOS replaces harsh raw digital oscillators with four acoustic timbres modeled after ritual instruments and physical spaces:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800">
                  <h4 className="font-serif text-xs font-bold text-white mb-1">🪘 Temple Drone</h4>
                  <p className="text-xs text-neutral-400">
                    Modeled after Tibetan singing bowls and cathedral pipe organs. Adds warm sub-bass, tuned octave overtones, and analog low-pass filtering (850 Hz) for deep, velvety warmth.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800">
                  <h4 className="font-serif text-xs font-bold text-white mb-1">🌑 Abyssal Sub</h4>
                  <p className="text-xs text-neutral-400">
                    Ultra-deep low-end void drone (cutoff at 480 Hz) completely devoid of treble harshness. Perfect for scrying in total darkness and long trance sessions.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800">
                  <h4 className="font-serif text-xs font-bold text-white mb-1">✨ Astral Shimmer</h4>
                  <p className="text-xs text-neutral-400">
                    Lush unison detuned stereo oscillators (±3 cents) producing a wide, ethereal celestial soundstage. Enhances dream exploration and higher mental clarity.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800">
                  <h4 className="font-serif text-xs font-bold text-white mb-1">🌪️ Typhonian Void</h4>
                  <p className="text-xs text-neutral-400">
                    Blends subterranean brown noise rumble with slow breathing swells. Simulates the acoustic pressure of underground crypts and primal nightside currents.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subliminal' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <h3 className="font-serif text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Subliminal Invocation & Demonic Enns
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  In ceremonial demonolatry, an <strong>Enn</strong> is a sacred vibrational phrase used to invite an entity’s current into the ritual space. Austin Osman Spare demonstrated that conscious intellectual analysis often acts as a psychic censor that repels magical manifestation.
                </p>
              </div>

              <div className="space-y-2 text-xs text-neutral-300">
                <div className="p-3 rounded bg-black/60 border border-neutral-800">
                  <strong className="text-red-400 block mb-0.5">Whisper Pacing & Threshold Dynamics:</strong>
                  The Subliminal Engine chants demonic enns and sovereignty affirmations in a slow, low-resonance cadence underneath the drone. When adjusted so the words are just barely audible, the conscious mind relaxes while the subconscious absorbs the invocation directly.
                </div>
                <div className="p-3 rounded bg-black/60 border border-neutral-800">
                  <strong className="text-purple-400 block mb-0.5">Sovereignty Alignment:</strong>
                  All presets in GnosticOS are structured on self-ownership, illumination, and non-servile communion—aligning with Luciferian and left-hand path apotheosis.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50">
                <h3 className="font-serif text-base font-bold text-red-200 mb-1 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  Acoustic Safety & Listening Protocols
                </h3>
                <ul className="text-xs text-neutral-300 space-y-2.5 mt-3">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <span><strong>Headphones Required for Binaural Beats:</strong> Normal room speakers mix left and right soundwaves in the air before reaching your ears, cancelling the binaural entrainment effect. Use over-ear or in-ear stereo headphones.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <span><strong>Keep Volume Low (20% – 35%):</strong> Drones and sustained tones cause auditory fatigue much faster than dynamic music. The drone should feel like a distant sacred chamber, not a loud test tone.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <span><strong>Emergency Grounding:</strong> Pressing <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-amber-300 font-mono text-[10px] border border-neutral-700">ESC</kbd> or clicking the Emergency Ground button in the Command Palette immediately silences every oscillator and speech synthesis thread across the operating system.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <span><strong>Do Not Use While Driving or Operating Heavy Machinery:</strong> Deep Theta and Delta frequencies induce profound trance, hypnagogia, and altered states of consciousness.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800/80 bg-neutral-950 flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-500">
            Press ESC or click close to return to Sanctum
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-serif text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(220,38,38,0.4)]"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
