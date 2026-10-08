import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';
import { gazingFragmentShader, gazingVertexShader } from './shaders';

// -----------------------------------------------------------------------------
// Breath engine
// -----------------------------------------------------------------------------
/** Seconds per phase: [inhale, holdFull, exhale, holdEmpty?] */
export type BreathPattern = readonly number[];
export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export const BREATH_PRESETS = {
  'triangle-4-4-4': [4, 4, 4],
  'box-4-4-4-4': [4, 4, 4, 4],
  'relax-4-7-8': [4, 7, 8],
} as const satisfies Record<string, BreathPattern>;

const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);

/** Pure function — also used by the audio engine & UI cue text so all stay in lockstep. */
export function sampleBreath(seconds: number, pattern: BreathPattern) {
  const [inhale = 4, hold = 0, exhale = 4, rest = 0] = pattern;
  const total = inhale + hold + exhale + rest;
  if (total <= 0) return { value: 0, phase: 'rest' as BreathPhase, progress: 0 };
  let t = ((seconds % total) + total) % total;
  if (t < inhale) return { value: ease(t / inhale), phase: 'inhale' as BreathPhase, progress: t / inhale };
  t -= inhale;
  if (t < hold) return { value: 1, phase: 'hold' as BreathPhase, progress: t / hold };
  t -= hold;
  if (t < exhale) return { value: 1 - ease(t / exhale), phase: 'exhale' as BreathPhase, progress: t / exhale };
  t -= exhale;
  return { value: 0, phase: 'rest' as BreathPhase, progress: rest > 0 ? t / rest : 1 };
}

// -----------------------------------------------------------------------------
// Strobe (photosensitivity-gated)
// -----------------------------------------------------------------------------
export const STROBE_BANDS = {
  theta: { min: 4, max: 7 },
  alpha: { min: 8, max: 12 },
} as const;

export interface StrobeOptions {
  /**
   * 4–12 Hz luminance flicker sits squarely in the photosensitive-epilepsy band
   * (WCAG 2.3.1: > 3 flashes/s). The UI MUST show a warning and obtain explicit
   * consent before setting this to true.
   */
  acknowledgedPhotosensitivityRisk: boolean;
  hz: number;
  /** Modulation depth, hard-capped at 0.35 (sine, never square-wave). */
  depth?: number;
}

const MAX_STROBE_DEPTH = 0.35;
const MAX_STROBE_HZ = 12;

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------
export interface GazingCircleCanvasProps {
  breathPattern?: BreathPattern;
  /** Radians / second for the master rotation (bands derive their own ratios). */
  rotationSpeed?: number;
  /** 0..1 black-mirror liquid distortion. */
  mirrorDistortion?: number;
  /** 0..1 soft-focus blur. */
  blur?: number;
  colorInner?: THREE.ColorRepresentation;
  colorOuter?: THREE.ColorRepresentation;
  /** Changes the procedural glyph script (e.g. tunnel number). */
  glyphSeed?: number;
  /** When false, clears the inner chaos star and pentagram for uncluttered focal sigil meditation */
  showInnerGlyph?: boolean;
  strobe?: StrobeOptions | null;
  paused?: boolean;
  onBreathPhase?: (phase: BreathPhase) => void;
  className?: string;
  style?: CSSProperties;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

// -----------------------------------------------------------------------------
// Inner mesh — lives inside the R3F reconciler
// -----------------------------------------------------------------------------
type PlaneProps = Required<
  Pick<GazingCircleCanvasProps, 'breathPattern' | 'rotationSpeed' | 'mirrorDistortion' | 'blur' | 'glyphSeed' | 'paused'>
> &
  Pick<GazingCircleCanvasProps, 'strobe' | 'onBreathPhase' | 'colorInner' | 'colorOuter' | 'showInnerGlyph'> & { reducedMotion: boolean };

function GazingPlane(props: PlaneProps) {
  // Latest props in a ref so useFrame never captures stale values and uniforms are never re-created.
  const live = useRef(props);
  live.current = props;

  const elapsed = useRef(0);
  const rotation = useRef(0);
  const lastPhase = useRef<BreathPhase | null>(null);
  const bufferSize = useMemo(() => new THREE.Vector2(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uBreath: { value: 0 },
      uRotation: { value: 0 },
      uMirror: { value: 0.5 },
      uBlur: { value: 0 },
      uGain: { value: 1 },
      uColorA: { value: new THREE.Color('#ff3b2f') },
      uColorB: { value: new THREE.Color('#6a1bff') },
      uGlyphSeed: { value: 0 },
      uInnerGlyph: { value: 1.0 },
    }),
    [],
  );

  // Colours parsed only when they change (Color.set parses strings).
  useEffect(() => {
    uniforms.uColorA.value.set(props.colorInner ?? '#ff3b2f');
  }, [props.colorInner, uniforms]);
  useEffect(() => {
    uniforms.uColorB.value.set(props.colorOuter ?? '#6a1bff');
  }, [props.colorOuter, uniforms]);

  useFrame((state, delta) => {
    const p = live.current;
    const dt = p.paused ? 0 : Math.min(delta, 0.1); // clamp tab-switch spikes
    elapsed.current += dt;
    rotation.current += dt * p.rotationSpeed * (p.reducedMotion ? 0.2 : 1);

    const breath = sampleBreath(elapsed.current, p.breathPattern);
    if (breath.phase !== lastPhase.current) {
      lastPhase.current = breath.phase;
      p.onBreathPhase?.(breath.phase);
    }

    let gain = 1;
    const s = p.strobe;
    if (s?.acknowledgedPhotosensitivityRisk && !p.reducedMotion) {
      const hz = THREE.MathUtils.clamp(s.hz, 0.5, MAX_STROBE_HZ);
      const depth = THREE.MathUtils.clamp(s.depth ?? 0.2, 0, MAX_STROBE_DEPTH);
      gain = 1 - depth * 0.5 * (1 - Math.cos(2 * Math.PI * hz * elapsed.current));
    }

    state.gl.getDrawingBufferSize(bufferSize);
    uniforms.uResolution.value.copy(bufferSize);
    uniforms.uTime.value = elapsed.current;
    uniforms.uBreath.value = breath.value;
    uniforms.uRotation.value = rotation.current;
    uniforms.uMirror.value = THREE.MathUtils.clamp(p.mirrorDistortion, 0, 1);
    uniforms.uBlur.value = THREE.MathUtils.clamp(p.blur, 0, 1);
    uniforms.uGain.value = gain;
    uniforms.uGlyphSeed.value = p.glyphSeed;
    uniforms.uInnerGlyph.value = p.showInnerGlyph !== false ? 1.0 : 0.0;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={gazingVertexShader}
        fragmentShader={gazingFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

// -----------------------------------------------------------------------------
// Public component
// -----------------------------------------------------------------------------
export function GazingCircleCanvas({
  breathPattern = BREATH_PRESETS['relax-4-7-8'],
  rotationSpeed = 0.12,
  mirrorDistortion = 0.55,
  blur = 0.1,
  colorInner = '#ff3b2f',
  colorOuter = '#6a1bff',
  glyphSeed = 11,
  showInnerGlyph = true,
  strobe = null,
  paused = false,
  onBreathPhase,
  className,
  style,
}: GazingCircleCanvasProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      role="img"
      aria-label="Animated gazing circle: counter-rotating glyph rings, chaos star and inverted pentagram over a black mirror"
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', background: '#000', ...style }}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop={paused ? 'demand' : 'always'}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      >
        <GazingPlane
          breathPattern={breathPattern}
          rotationSpeed={rotationSpeed}
          mirrorDistortion={mirrorDistortion}
          blur={blur}
          colorInner={colorInner}
          colorOuter={colorOuter}
          glyphSeed={glyphSeed}
          showInnerGlyph={showInnerGlyph}
          strobe={strobe}
          paused={paused}
          onBreathPhase={onBreathPhase}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}

export default GazingCircleCanvas;
