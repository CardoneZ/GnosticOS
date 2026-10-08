import React, { useState, useMemo, useRef, useEffect } from 'react';
import GazingCircleCanvas, { BREATH_PRESETS, BreathPhase } from '../gazing/GazingCircleCanvas';
import {
  useGazingAudio,
  parseNote,
  NoteName,
  SonicTexture,
  SoundscapeTimbre,
} from '../audio/useGazingAudio';
import { TunnelData } from '../../platform/vault';
import {
  LuciferSigil,
  IshtarStar,
  AzhdahaSymbol,
  AlbTalisman,
  WillDesireBeliefSymbol,
} from '../tree/LuciferianSymbols';
import {
  SubliminalEngine,
  SUBLIMINAL_PRESETS,
} from '../audio/subliminalAudio';
import { AudioVisualizerCanvas } from '../audio/AudioVisualizerCanvas';
import { SonicCodexModal } from '../audio/SonicCodexModal';
import {
  Play,
  Square,
  Volume2,
  Eye,
  Music,
  Zap,
  Sparkles,
  Headphones,
  HelpCircle,
  Activity,
  Sliders,
  Wind,
} from 'lucide-react';

interface SanctumPortalProps {
  activeTunnel: TunnelData;
  onSelectTunnel: (tunnel: TunnelData) => void;
  allTunnels: TunnelData[];
  onEnterTranceSession?: () => void;
}

export type VisualPreset = 'ouroboros' | 'algol' | 'adversary' | 'sentinels' | 'black_mirror';
export type FocalSymbolType = 'none' | 'lucifer' | 'ishtar' | 'azhdaha' | 'alb' | 'will_desire_belief';

export const SanctumPortal: React.FC<SanctumPortalProps> = ({
  activeTunnel,
  onSelectTunnel,
  allTunnels,
  onEnterTranceSession,
}) => {
  // Visual Preset configuration
  const [preset, setPreset] = useState<VisualPreset>('adversary');
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.12);
  const [mirrorDistortion, setMirrorDistortion] = useState<number>(0.55);
  const [blur, setBlur] = useState<number>(0.08);
  const [breathPatternKey, setBreathPatternKey] = useState<keyof typeof BREATH_PRESETS>('relax-4-7-8');
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('rest');

  // Sacred Focal Symbol Overlay state
  const [focalSymbol, setFocalSymbol] = useState<FocalSymbolType>('lucifer');
  const [focalPulse, setFocalPulse] = useState<boolean>(true);
  const [focalOpacity, setFocalOpacity] = useState<number>(0.85);

  // Subliminal Audio Invocation state
  const [subliminalActive, setSubliminalActive] = useState<boolean>(false);
  const [subliminalPresetId, setSubliminalPresetId] = useState<string>('lucifer_illumination');
  const [subliminalPhrase, setSubliminalPhrase] = useState<string>('');
  const [subliminalWhisperVol, setSubliminalWhisperVol] = useState<number>(0.35);
  const [subliminalInterval, setSubliminalInterval] = useState<number>(6);
  const subliminalRef = useRef<SubliminalEngine | null>(null);

  // Audio parameters
  const [volume, setVolume] = useState<number>(0.3);
  const [beatHz, setBeatHz] = useState<number>(6.0); // 6 Hz Theta default
  const [carrierOverride, setCarrierOverride] = useState<number | undefined>(undefined);
  const [texture, setTexture] = useState<SonicTexture>(
    (activeTunnel.key_modifier as SonicTexture) || 'none',
  );
  const [timbre, setTimbre] = useState<SoundscapeTimbre>('temple_drone');
  const [atmosphereLevel, setAtmosphereLevel] = useState<number>(0.18);
  const [harmonicsLevel, setHarmonicsLevel] = useState<number>(0.35);
  const [visualizerMode, setVisualizerMode] = useState<'waveform' | 'spectrum'>('waveform');
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);

  // Strobe state
  const [strobeEnabled, setStrobeEnabled] = useState<boolean>(false);
  const [strobeRiskAcknowledged, setStrobeRiskAcknowledged] = useState<boolean>(false);
  const [strobeHz, setStrobeHz] = useState<number>(6.0);

  // Subliminal engine lifecycle & phrase sync
  useEffect(() => {
    return () => {
      if (subliminalRef.current) {
        subliminalRef.current.stop();
        subliminalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!subliminalActive) return;
    const timer = setInterval(() => {
      if (subliminalRef.current) {
        const p = subliminalRef.current.getActivePhrase();
        if (p) setSubliminalPhrase(p);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [subliminalActive]);

  const toggleSubliminal = () => {
    if (subliminalActive) {
      if (subliminalRef.current) {
        subliminalRef.current.stop();
        subliminalRef.current = null;
      }
      setSubliminalActive(false);
      setSubliminalPhrase('');
    } else {
      const p = SUBLIMINAL_PRESETS.find((x) => x.id === subliminalPresetId) || SUBLIMINAL_PRESETS[0];
      const engine = new SubliminalEngine({
        preset: p,
        whisperVolume: subliminalWhisperVol,
        speechIntervalSec: subliminalInterval,
        droneVolume: 0.15,
      });
      const ok = engine.start();
      if (ok) {
        subliminalRef.current = engine;
        setSubliminalActive(true);
        setSubliminalPhrase(p.enn);
      }
    }
  };

  // Preset configuration map
  const activeColors = useMemo(() => {
    switch (preset) {
      case 'ouroboros':
        return { inner: '#10b981', outer: '#6366f1' };
      case 'algol':
        return { inner: '#ef4444', outer: '#f59e0b' };
      case 'black_mirror':
        return { inner: '#38bdf8', outer: '#1e1b4b' };
      case 'sentinels':
        return { inner: '#ec4899', outer: '#8b5cf6' };
      case 'adversary':
      default:
        return { inner: '#ef4444', outer: '#7c3aed' };
    }
  }, [preset]);

  // Audio hook bound to active tunnel's musical key
  const parsedKey: NoteName = useMemo(() => {
    try {
      return parseNote(activeTunnel.musical_key);
    } catch {
      return 'E';
    }
  }, [activeTunnel.musical_key]);

  const {
    start: startAudio,
    stop: stopAudio,
    isPlaying: isAudioPlaying,
    keyFrequency,
    beatHz: activeBeatHz,
    error: audioError,
    getAnalyser,
  } = useGazingAudio({
    note: parsedKey,
    beatHz,
    carrierHz: carrierOverride,
    volume,
    texture,
    timbre,
    atmosphereLevel,
    harmonicsLevel,
    rampSeconds: 1.5,
  });

  const handlePresetSelect = (newPreset: VisualPreset) => {
    setPreset(newPreset);
    switch (newPreset) {
      case 'ouroboros':
        setRotationSpeed(0.06);
        setMirrorDistortion(0.4);
        setBreathPatternKey('relax-4-7-8');
        break;
      case 'algol':
        setRotationSpeed(0.24);
        setMirrorDistortion(0.3);
        setBreathPatternKey('box-4-4-4-4');
        break;
      case 'black_mirror':
        setRotationSpeed(0.02);
        setMirrorDistortion(0.95);
        setBlur(0.35);
        setBreathPatternKey('triangle-4-4-4');
        break;
      case 'sentinels':
        setRotationSpeed(0.1);
        setMirrorDistortion(0.65);
        break;
      case 'adversary':
      default:
        setRotationSpeed(0.14);
        setMirrorDistortion(0.55);
        setBlur(0.08);
        break;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden bg-black select-none">
      {/* Main Canvas Viewport */}
      <div className="relative flex-1 h-full min-h-[460px] overflow-hidden flex items-center justify-center">
        <GazingCircleCanvas
          breathPattern={BREATH_PRESETS[breathPatternKey]}
          rotationSpeed={rotationSpeed}
          mirrorDistortion={mirrorDistortion}
          blur={blur}
          colorInner={activeColors.inner}
          colorOuter={activeColors.outer}
          glyphSeed={activeTunnel.number}
          strobe={
            strobeEnabled
              ? { acknowledgedPhotosensitivityRisk: strobeRiskAcknowledged, hz: strobeHz, depth: 0.25 }
              : null
          }
          onBreathPhase={setCurrentPhase}
        />

        {/* Sacred Center Focal Glyph Overlay */}
        {focalSymbol !== 'none' && (
          <div
            className="absolute pointer-events-none flex items-center justify-center transition-transform duration-700 ease-out z-10"
            style={{
              opacity: focalOpacity,
              transform: `scale(${
                focalPulse
                  ? currentPhase === 'inhale'
                    ? 1.08
                    : currentPhase === 'hold'
                    ? 1.08
                    : 0.95
                  : 1.0
              })`,
            }}
          >
            {focalSymbol === 'lucifer' && <LuciferSigil size={240} glow />}
            {focalSymbol === 'ishtar' && <IshtarStar size={240} glow />}
            {focalSymbol === 'azhdaha' && <AzhdahaSymbol size={260} glow />}
            {focalSymbol === 'alb' && <AlbTalisman size={260} glow />}
            {focalSymbol === 'will_desire_belief' && <WillDesireBeliefSymbol size={250} glow />}
          </div>
        )}

        {/* Subliminal Invocation Whisper Banner (Active HUD) */}
        {subliminalActive && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-red-950/80 border border-red-700/60 shadow-[0_0_20px_rgba(220,38,38,0.45)] pointer-events-none flex items-center gap-2.5 z-20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-serif italic text-xs tracking-wider text-amber-200">
              {subliminalPhrase || 'Demonic Subliminal Invocation Active...'}
            </span>
          </div>
        )}

        {/* Breath Cue HUD Overlay */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel-glow border border-red-900/40 pointer-events-none">
          <div
            className={`w-3 h-3 rounded-full transition-all duration-700 ${
              currentPhase === 'inhale'
                ? 'bg-emerald-400 shadow-[0_0_12px_#34d399] scale-125'
                : currentPhase === 'hold'
                ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24] scale-100'
                : 'bg-indigo-400 shadow-[0_0_12px_#818cf8] scale-75'
            }`}
          />
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-300 font-medium">
            Breath:{' '}
            <span className="text-white font-bold tracking-wider">
              {currentPhase === 'inhale' ? 'INSPIRATIO (Inhale)' : currentPhase === 'hold' ? 'RETENTIO (Hold)' : 'EXPIRATIO (Exhale)'}
            </span>
          </span>
        </div>

        {/* Active Tunnel Correspondence Badge */}
        <div className="absolute bottom-6 left-6 glass-panel px-4 py-3 rounded-lg border border-purple-900/40 max-w-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60">
              TUNNEL {activeTunnel.number}
            </span>
            <span className="text-xs font-mono text-amber-400 font-semibold">
              {activeTunnel.path_letter}
            </span>
            <span className="text-xs font-mono text-neutral-400">
              ({activeTunnel.planet_element})
            </span>
          </div>
          <h2 className="font-serif text-lg font-bold text-neutral-100 flex items-center gap-2">
            {activeTunnel.name}
            <span className="text-xs font-sans text-neutral-400 font-normal">
              Atu: {activeTunnel.atu}
            </span>
          </h2>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 mt-2">
            <span>Gematria: <strong className="text-purple-300">{activeTunnel.gematria}</strong></span>
            <span>Key: <strong className="text-red-400">{activeTunnel.musical_key}</strong> ({keyFrequency.toFixed(1)} Hz)</span>
          </div>

          {onEnterTranceSession && (
            <button
              onClick={onEnterTranceSession}
              className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-serif text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(220,38,38,0.4)] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> ENTER IMMERSIVE TRANCE
            </button>
          )}
        </div>
      </div>

      {/* Control Console Sidebar */}
      <div className="w-full lg:w-96 glass-panel border-t lg:border-t-0 lg:border-l border-neutral-800/80 p-5 flex flex-col gap-5 overflow-y-auto z-10">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-sm font-bold tracking-wider uppercase text-neutral-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-red-500" />
              Gazing Archetypes
            </h3>
            <span className="text-[10px] font-mono text-neutral-500">GLSL SHADER</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(
              [
                ['adversary', 'Circle of Adversary'],
                ['ouroboros', 'Leviathan Ouroboros'],
                ['algol', 'Algol Chaos Star'],
                ['sentinels', '22 Qliphoth Sentinels'],
                ['black_mirror', 'Digital Black Mirror'],
              ] as [VisualPreset, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => handlePresetSelect(id)}
                className={`px-3 py-2 rounded text-left transition-all font-sans text-xs ${
                  preset === id
                    ? 'bg-red-950/70 border border-red-600 text-neutral-100 shadow-[0_0_12px_-3px_rgba(239,68,68,0.5)]'
                    : 'bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tunnel Quick Selector */}
        <div>
          <label className="text-xs font-mono text-neutral-400 block mb-1">
            Active Tunnel of Set (Kenneth Grant):
          </label>
          <select
            value={activeTunnel.number}
            onChange={(e) => {
              const selected = allTunnels.find((t) => t.number === Number(e.target.value));
              if (selected) {
                onSelectTunnel(selected);
                if (selected.key_modifier) {
                  setTexture(selected.key_modifier as SonicTexture);
                } else {
                  setTexture('none');
                }
              }
            }}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-200 font-mono focus:border-red-500 focus:outline-none"
          >
            {allTunnels.map((t) => (
              <option key={t.number} value={t.number}>
                {t.number}. {t.name} (Key: {t.musical_key}, {t.atu})
              </option>
            ))}
          </select>
        </div>

        {/* Sacred Focal Glyphs Selector */}
        <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xs font-bold tracking-wider uppercase text-neutral-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sacred Mirror Focal Glyph
            </h3>
            <span className="text-[10px] font-mono text-amber-400 font-bold">
              {focalSymbol.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
            {(
              [
                ['lucifer', 'Sigil of Lucifer'],
                ['ishtar', 'Star of Ishtar (8-pt)'],
                ['azhdaha', 'Azhdaha Black Dragon'],
                ['will_desire_belief', 'Will, Desire & Belief'],
                ['alb', 'ALB Talisman'],
                ['none', 'Pure Void Mirror'],
              ] as [FocalSymbolType, string][]
            ).map(([symId, label]) => (
              <button
                key={symId}
                onClick={() => setFocalSymbol(symId)}
                className={`px-2.5 py-1.5 rounded text-left transition-all truncate ${
                  focalSymbol === symId
                    ? 'bg-red-950 border border-red-600 text-white font-bold shadow-[0_0_10px_rgba(220,38,38,0.4)]'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-neutral-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={focalPulse}
                onChange={(e) => setFocalPulse(e.target.checked)}
                className="accent-red-600"
              />
              Pulse with Breath
            </label>

            <div className="flex items-center gap-1.5">
              <span>Glow:</span>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={focalOpacity}
                onChange={(e) => setFocalOpacity(Number(e.target.value))}
                className="w-16 accent-red-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Subliminal Demonic Invocation Audio Console */}
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-red-400" />
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-neutral-100">
                Subliminal Demonic Invocations
              </span>
            </div>
            <button
              onClick={toggleSubliminal}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                subliminalActive
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_12px_rgba(220,38,38,0.6)] animate-pulse'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700'
              }`}
            >
              {subliminalActive ? 'INVOKING' : 'ACTIVATE'}
            </button>
          </div>

          <div className="flex flex-col gap-1 text-[11px] font-mono">
            <label className="text-neutral-400">Invocation Preset:</label>
            <select
              value={subliminalPresetId}
              onChange={(e) => {
                setSubliminalPresetId(e.target.value);
                if (subliminalActive && subliminalRef.current) {
                  const p = SUBLIMINAL_PRESETS.find((x) => x.id === e.target.value);
                  if (p) subliminalRef.current.updateOptions({ preset: p });
                }
              }}
              className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-200 focus:outline-none"
            >
              {SUBLIMINAL_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-400">
            <div>
              <div className="flex justify-between mb-0.5">
                <span>Whisper Vol</span>
                <span>{Math.round(subliminalWhisperVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={subliminalWhisperVol}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSubliminalWhisperVol(val);
                  if (subliminalRef.current) {
                    subliminalRef.current.updateOptions({ whisperVolume: val });
                  }
                }}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-0.5">
                <span>Interval</span>
                <span>{subliminalInterval}s</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={subliminalInterval}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSubliminalInterval(val);
                  if (subliminalRef.current) {
                    subliminalRef.current.updateOptions({ speechIntervalSec: val });
                  }
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Integrated State-of-the-Art Sonic Console */}
        <div className="p-4 rounded-xl bg-black/75 border border-purple-900/40 flex flex-col gap-3.5 shadow-xl">
          {/* Header & Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-neutral-200 block">
                  Nightside Sonic Engine
                </span>
                <span className="text-[10px] font-mono text-purple-400">
                  Typhonian Acoustic Synthesis
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsCodexOpen(true)}
                title="Open Sonic Sanctum Codex & Audio Guide"
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-purple-300 hover:text-white border border-neutral-700/80 transition-all flex items-center gap-1 text-[11px] font-mono"
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Guide</span>
              </button>

              <button
                onClick={isAudioPlaying ? stopAudio : startAudio}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-md ${
                  isAudioPlaying
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse'
                    : 'bg-gradient-to-r from-purple-900 to-red-900 hover:from-purple-800 hover:to-red-800 text-white border border-purple-600/50'
                }`}
              >
                {isAudioPlaying ? (
                  <>
                    <Square className="w-3 h-3 fill-current" /> SILENCE
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" /> RESONATE
                  </>
                )}
              </button>
            </div>
          </div>

          {audioError && (
            <p className="text-red-400 text-xs font-mono bg-red-950/40 p-2 rounded border border-red-900/60">
              {audioError}
            </p>
          )}

          {/* Real-time Oscilloscope & Frequency Spectrum Visualizer */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-red-500" />
                Acoustic Field
              </span>
              <button
                onClick={() =>
                  setVisualizerMode((prev) => (prev === 'waveform' ? 'spectrum' : 'waveform'))
                }
                className="text-purple-400 hover:text-purple-300 underline cursor-pointer"
              >
                Mode: {visualizerMode === 'waveform' ? 'Oscilloscope' : 'Spectrum'}
              </button>
            </div>
            <AudioVisualizerCanvas
              getAnalyser={getAnalyser}
              isPlaying={isAudioPlaying}
              mode={visualizerMode}
              height={44}
              color={timbre === 'abyssal_sub' ? '#38bdf8' : timbre === 'astral_shimmer' ? '#c084fc' : '#ef4444'}
            />
          </div>

          {/* Sonic Key & Entrainment Readout */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-neutral-950/90 p-2.5 rounded-lg border border-neutral-800">
            <div>
              <span className="text-neutral-500 block text-[10px]">PITCH / KEY</span>
              <span className="text-purple-300 font-bold">{parsedKey}</span> ({keyFrequency.toFixed(1)} Hz)
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">BINAURAL BEAT</span>
              <span className="text-amber-400 font-bold">{activeBeatHz.toFixed(1)} Hz</span>{' '}
              <span className="text-[10px] text-amber-300">
                {activeBeatHz <= 4
                  ? '(Delta Void)'
                  : activeBeatHz <= 7.5
                  ? '(Theta Gnosis)'
                  : activeBeatHz <= 12
                  ? '(Alpha Focus)'
                  : '(Beta)'}
              </span>
            </div>
          </div>

          {/* Soundscape Timbre Selector */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 mb-1.5">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Acoustic Timbre:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              {[
                { id: 'temple_drone', label: 'Temple Drone', sub: 'Singing Bowl Warmth' },
                { id: 'abyssal_sub', label: 'Abyssal Sub', sub: 'Zero Highs Sub-bass' },
                { id: 'astral_shimmer', label: 'Astral Shimmer', sub: 'Stereo Detuned Pad' },
                { id: 'typhonian_void', label: 'Typhonian Void', sub: 'Subterranean Rumble' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTimbre(item.id as SoundscapeTimbre)}
                  className={`p-2 rounded text-left transition-all flex flex-col ${
                    timbre === item.id
                      ? 'bg-purple-950/80 border border-purple-500 text-white shadow-sm'
                      : 'bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80'
                  }`}
                >
                  <span className="font-bold text-[11px]">{item.label}</span>
                  <span className="text-[9px] text-neutral-400">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Binaural Beat Offset Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
              <span className="flex items-center gap-1">
                <Headphones className="w-3 h-3 text-amber-400" />
                Binaural Entrainment (Headphones)
              </span>
              <span className="text-amber-400 font-bold">{beatHz.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={beatHz}
              onChange={(e) => setBeatHz(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
              <button onClick={() => setBeatHz(3.0)} className="hover:text-neutral-300">3Hz Delta</button>
              <button onClick={() => setBeatHz(6.0)} className="hover:text-amber-300 text-amber-400/90 font-bold">6Hz Theta</button>
              <button onClick={() => setBeatHz(10.0)} className="hover:text-neutral-300">10Hz Alpha</button>
            </div>
          </div>

          {/* Sacred Carrier Override */}
          <div>
            <label className="text-[11px] font-mono text-neutral-400 block mb-1">
              Sacred Carrier Override:
            </label>
            <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
              {[
                [undefined, 'Key'],
                [108, '108Hz Om'],
                [432, '432Hz Verdi'],
                [528, '528Hz Solf'],
              ].map(([val, label]) => (
                <button
                  key={label}
                  onClick={() => setCarrierOverride(val as number | undefined)}
                  className={`py-1 rounded text-center transition-all ${
                    carrierOverride === val
                      ? 'bg-purple-950 border border-purple-500 text-white font-bold'
                      : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Grant Texture selector */}
          <div>
            <label className="text-[11px] font-mono text-neutral-400 block mb-1">
              Grant Typhonian Texture:
            </label>
            <div className="grid grid-cols-3 gap-1 text-[11px] font-mono">
              {(['none', 'chatter', 'roar'] as SonicTexture[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTexture(t)}
                  className={`py-1 rounded text-center capitalize transition-all ${
                    texture === t
                      ? 'bg-red-950 border border-red-500 text-white font-bold'
                      : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  {t === 'none' ? 'Pure' : t === 'chatter' ? 'Chatter (13Hz)' : 'Roar (Abyss)'}
                </button>
              ))}
            </div>
          </div>

          {/* Mix Controls (Sliders Grid) */}
          <div className="grid grid-cols-1 gap-2.5 pt-2 border-t border-neutral-800/80 text-xs font-mono">
            {/* Master Drone Volume */}
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-red-400" /> Master Volume
                </span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>

            {/* Atmosphere Ambient Bed */}
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" /> Sanctum Atmosphere Bed
                </span>
                <span>{Math.round(atmosphereLevel * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.02"
                value={atmosphereLevel}
                onChange={(e) => setAtmosphereLevel(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Warm Harmonic Overtones */}
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" /> Harmonic Overtones
                </span>
                <span>{Math.round(harmonicsLevel * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={harmonicsLevel}
                onChange={(e) => setHarmonicsLevel(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Breathing Rhythm Controller */}
        <div>
          <label className="text-xs font-mono text-neutral-400 block mb-1">
            Breathing Pace:
          </label>
          <div className="grid grid-cols-3 gap-1 text-xs font-mono">
            {(
              [
                ['relax-4-7-8', '4-7-8 Deep'],
                ['box-4-4-4-4', '4-4-4-4 Box'],
                ['triangle-4-4-4', '4-4-4 Triangle'],
              ] as [keyof typeof BREATH_PRESETS, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setBreathPatternKey(key)}
                className={`py-1.5 px-2 rounded text-center transition-all ${
                  breathPatternKey === key
                    ? 'bg-neutral-800 border border-neutral-600 text-white font-medium'
                    : 'bg-neutral-900/60 text-neutral-400 hover:bg-neutral-800/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Modifiers */}
        <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800 text-xs">
          <div>
            <div className="flex justify-between font-mono text-neutral-400 mb-1">
              <span>Mirror Viscosity</span>
              <span>{Math.round(mirrorDistortion * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={mirrorDistortion}
              onChange={(e) => setMirrorDistortion(Number(e.target.value))}
              className="w-full accent-neutral-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-mono text-neutral-400 mb-1">
              <span>Astral Scrying Blur</span>
              <span>{Math.round(blur * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.02"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full accent-neutral-400 cursor-pointer"
            />
          </div>

          {/* Strobe Entrainment Controls */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between font-mono text-neutral-400 mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Strobe Entrainment
              </span>
              <button
                onClick={() => {
                  if (!strobeEnabled && !strobeRiskAcknowledged) {
                    const ok = window.confirm(
                      'Photosensitivity Warning: Strobe lighting (4–12 Hz) can trigger seizures in individuals with photosensitive epilepsy. Proceed with caution?',
                    );
                    if (ok) {
                      setStrobeRiskAcknowledged(true);
                      setStrobeEnabled(true);
                    }
                  } else {
                    setStrobeEnabled(!strobeEnabled);
                  }
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                  strobeEnabled
                    ? 'bg-amber-950 border border-amber-500 text-amber-200'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-500'
                }`}
              >
                {strobeEnabled ? 'Active' : 'Disabled'}
              </button>
            </div>
            {strobeEnabled && (
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex justify-between font-mono text-[11px] text-neutral-400">
                  <span>Frequency</span>
                  <span>{strobeHz.toFixed(1)} Hz</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={strobeHz}
                  onChange={(e) => setStrobeHz(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sonic Sanctum Codex & Audio Guide Modal */}
      <SonicCodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
      />
    </div>
  );
};

export default SanctumPortal;
