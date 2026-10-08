import React, { useState, useMemo } from 'react';
import GazingCircleCanvas, { BREATH_PRESETS, BreathPhase } from '../gazing/GazingCircleCanvas';
import { useGazingAudio, parseNote, NoteName, SonicTexture } from '../audio/useGazingAudio';
import { TunnelData } from '../../platform/vault';
import {
  Play,
  Square,
  Volume2,
  Eye,
  Music,
  Zap,
  Sparkles,
} from 'lucide-react';

interface SanctumPortalProps {
  activeTunnel: TunnelData;
  onSelectTunnel: (tunnel: TunnelData) => void;
  allTunnels: TunnelData[];
  onEnterTranceSession?: () => void;
}

export type VisualPreset = 'ouroboros' | 'algol' | 'adversary' | 'sentinels' | 'black_mirror';

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

  // Audio parameters
  const [volume, setVolume] = useState<number>(0.3);
  const [beatHz, setBeatHz] = useState<number>(6.0); // 6 Hz Theta default
  const [carrierOverride, setCarrierOverride] = useState<number | undefined>(undefined);
  const [texture, setTexture] = useState<SonicTexture>(
    (activeTunnel.key_modifier as SonicTexture) || 'none',
  );

  // Strobe state
  const [strobeEnabled, setStrobeEnabled] = useState<boolean>(false);
  const [strobeRiskAcknowledged, setStrobeRiskAcknowledged] = useState<boolean>(false);
  const [strobeHz, setStrobeHz] = useState<number>(6.0);

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
  } = useGazingAudio({
    note: parsedKey,
    beatHz,
    carrierHz: carrierOverride,
    volume,
    texture,
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

        {/* Integrated Audio Console */}
        <div className="p-4 rounded-lg bg-black/60 border border-neutral-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-400" />
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-neutral-200">
                Grant Sonic Keys & Drones
              </span>
            </div>
            <button
              onClick={isAudioPlaying ? stopAudio : startAudio}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                isAudioPlaying
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                  : 'bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-700/60'
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" /> SILENCE
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> RESONATE
                </>
              )}
            </button>
          </div>

          {audioError && (
            <p className="text-red-400 text-xs font-mono">{audioError}</p>
          )}

          {/* Sonic Key Details */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-neutral-950/70 p-2.5 rounded border border-neutral-800">
            <div>
              <span className="text-neutral-500 block text-[10px]">SONIC KEY</span>
              <span className="text-purple-300 font-bold">{parsedKey}</span> ({keyFrequency.toFixed(1)} Hz)
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">BINAURAL BEAT</span>
              <span className="text-amber-400 font-bold">{activeBeatHz.toFixed(1)} Hz</span>{' '}
              {activeBeatHz <= 7 ? '(Theta)' : activeBeatHz <= 12 ? '(Alpha)' : '(Beta)'}
            </div>
          </div>

          {/* Binaural Beat Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
              <span>Binaural Offset (Hz)</span>
              <span>{beatHz.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={beatHz}
              onChange={(e) => setBeatHz(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
              <span>4Hz (Deep Theta)</span>
              <span>7Hz (Theta/Alpha)</span>
              <span>10Hz (Alpha)</span>
            </div>
          </div>

          {/* Carrier Override */}
          <div>
            <label className="text-[11px] font-mono text-neutral-400 block mb-1">
              Carrier Frequency:
            </label>
            <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
              {[
                [undefined, 'Key'],
                [108, '108Hz'],
                [432, '432Hz'],
                [528, '528Hz'],
              ].map(([val, label]) => (
                <button
                  key={label}
                  onClick={() => setCarrierOverride(val as number | undefined)}
                  className={`py-1 rounded text-center transition-all ${
                    carrierOverride === val
                      ? 'bg-purple-950 border border-purple-500 text-white'
                      : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Texture selector (Grant Modifiers) */}
          <div>
            <label className="text-[11px] font-mono text-neutral-400 block mb-1">
              Sonic Modifier Texture:
            </label>
            <div className="grid grid-cols-3 gap-1 text-[11px] font-mono">
              {(['none', 'chatter', 'roar'] as SonicTexture[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTexture(t)}
                  className={`py-1 rounded text-center capitalize transition-all ${
                    texture === t
                      ? 'bg-red-950 border border-red-500 text-white'
                      : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  {t === 'none' ? 'Pure' : t === 'chatter' ? 'Chatter' : 'Roar'}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" /> Drone Volume
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
    </div>
  );
};

export default SanctumPortal;
