/**
 * GLSL for the Gazing & Trance Portal (Week 2 Optimized).
 *
 * Layers (back → front):
 *   1. Black mirror  — domain-warped fbm smoke on obsidian, chromatic edge refraction, slow specular sheen.
 *   2. Procedural Black Flame embers — drifting luminous embers rising with breathing rhythms.
 *   3. Outer glyph band (36 cuneiform glyphs), rotating DEOSIL (clockwise).
 *   4. Inner glyph band (24 glyphs), rotating WIDDERSHINS (counter-clockwise).
 *   5. Algol 8-pointed Chaos Star, slow deosil drift.
 *   6. Inverted pentagram, widdershins drift.
 *   7. Breathing core (the yantra center for fixed concentration / Dharana).
 *
 * Highly optimized for 60 FPS on integrated GPUs via reduced octave domain-warp and early discard.
 */

export const gazingVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  // Full-screen quad: bypass camera matrices entirely.
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const gazingFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec2  uResolution;   // drawing-buffer pixels
uniform float uBreath;       // 0..1, eased breath envelope from JS
uniform float uRotation;     // accumulated radians (integrated in JS => no jumps on speed change)
uniform float uMirror;       // 0..1 black-mirror distortion
uniform float uBlur;         // 0..1 edge softening for soft-focus gazing
uniform float uGain;         // master brightness (includes optional strobe envelope)
uniform vec3  uColorA;       // inner glow (linear RGB)
uniform vec3  uColorB;       // outer glow (linear RGB)
uniform float uGlyphSeed;
uniform float uInnerGlyph;   // 0.0 = clear obsidian core (for focal sigils), 1.0 = procedural chaos star + pentagram

varying vec2 vUv;

#define PI  3.14159265359
#define TAU 6.28318530718

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i),               hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}

// 4-octave optimized FBM (smooth on mobile/integrated GPUs)
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * vnoise(p); p = m * p; a *= 0.5; }
  return v;
}

// Anti-aliased stroke mask from a distance field.
float stroke(float d, float w, float aa) { return 1.0 - smoothstep(w, w + aa, d); }

float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// Procedural glyph band: each angular cell holds a 3x4 grid of wedge strokes
float glyphBand(vec2 p, float r0, float r1, float count, float spin, float seed, float aa) {
  float r = length(p);
  if (r < r0 || r > r1) return 0.0;
  float a = atan(p.y, p.x) + spin;
  float s = (a / TAU) * count;
  float cell = mod(floor(s), count);
  vec2 local = vec2(fract(s), (r - r0) / (r1 - r0));
  vec2 g = (local - vec2(0.16, 0.12)) / vec2(0.68, 0.76);
  if (any(lessThan(g, vec2(0.0))) || any(greaterThan(g, vec2(1.0)))) return 0.0;

  vec2 dims = vec2(3.0, 4.0);
  vec2 gi = floor(g * dims);
  vec2 gf = fract(g * dims);
  float h = hash21(vec2(cell + seed * 13.0, seed) + gi * 7.13);
  if (h < 0.48) return 0.0;
  if (h > 0.78) gf = gf.yx;
  float halfW = mix(0.42, 0.06, gf.y);
  float soft = 0.08 + aa * 30.0;
  return 1.0 - smoothstep(halfW - soft, halfW, abs(gf.x - 0.5));
}

// Algol / Chaos Star: 8 rays with arrowheads
float chaosStar(vec2 p, float R, float aa) {
  float r = length(p);
  float seg = TAU / 8.0;
  float a = atan(p.y, p.x);
  float af = mod(a + seg * 0.5, seg) - seg * 0.5;
  vec2 q = vec2(cos(af), sin(af)) * r;

  float m = stroke(sdSegment(q, vec2(R * 0.20, 0.0), vec2(R * 0.80, 0.0)), 0.005, aa);

  float baseX = R * 0.76, tipX = R, halfW = R * 0.085;
  float t = clamp((q.x - baseX) / (tipX - baseX), 0.0, 1.0);
  float edge = abs(q.y) - halfW * (1.0 - t);
  float head = (1.0 - smoothstep(0.0, aa, edge)) * step(baseX, q.x) * (1.0 - step(tipX, q.x));

  float hub = stroke(abs(r - R * 0.20), 0.004, aa);
  return max(max(m, head), hub);
}

// Inverted pentagram (point downward)
float pentagram(vec2 p, float R, float aa) {
  float d = 1e5;
  for (int i = 0; i < 5; i++) {
    float a0 = -PI * 0.5 + TAU * float(i) / 5.0;
    float a1 = -PI * 0.5 + TAU * float(i + 2) / 5.0;
    d = min(d, sdSegment(p, R * vec2(cos(a0), sin(a0)), R * vec2(cos(a1), sin(a1))));
  }
  return stroke(d, 0.004, aa);
}

// Black Flame rising ember field (procedural drifting particles)
float blackFlameEmbers(vec2 p, float t, float breath) {
  float embers = 0.0;
  for (int i = 0; i < 16; i++) {
    float fi = float(i);
    float speed = 0.12 + 0.08 * hash21(vec2(fi, 1.1));
    float xOffset = (hash21(vec2(fi, 3.7)) - 0.5) * 1.6;
    float y = mod(-t * speed + hash21(vec2(fi, 5.2)), 2.0) - 1.0;
    // Add sway via sin
    float x = xOffset + 0.08 * sin(t * 1.5 + fi * 2.0);
    vec2 pos = vec2(x, y);
    float dist = length(p - pos);
    float size = mix(0.006, 0.016, hash21(vec2(fi, 9.1))) * (1.0 + 0.4 * breath);
    embers += exp(-dist * dist / (size * size * 2.0)) * (0.6 + 0.4 * sin(t * 3.0 + fi));
  }
  return embers;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * 2.0;
  p.x *= aspect;

  float t = uTime;
  float aa = (2.0 / uResolution.y) * (1.0 + uBlur * 10.0);

  // ---------------- 1. Black mirror with edge chromatic refraction ----------------
  vec2 flow = vec2(fbm(p * 1.6 + vec2(0.0,  t * 0.04)),
                   fbm(p * 1.6 + vec2(5.2, -t * 0.03)));
  vec2 pw = p + (flow - 0.5) * 0.22 * uMirror;

  // Obsidian edge refraction
  float r0 = length(p);
  float edgeDistort = pow(smoothstep(0.4, 1.3, r0), 2.0) * 0.08 * uMirror;
  vec2 pRefract = pw + normalize(p + 1e-4) * edgeDistort;

  float smoke = fbm(pRefract * 2.2 + flow * 1.8 + t * 0.025);

  vec3 obsidian = mix(vec3(0.001, 0.001, 0.003), vec3(0.018, 0.007, 0.032), smoke * smoke);
  obsidian *= mix(1.0, smoothstep(1.6, 0.2, r0), 0.85);

  // Slow obsidian specular sheen
  float sheenLine = dot(normalize(vec2(0.6, 0.8)), p) - sin(t * 0.06) * 0.9;
  obsidian += pow(max(0.0, 1.0 - abs(sheenLine)), 18.0) * 0.035 * uMirror;

  // ---------------- Breathing scale ----------------
  float breath = uBreath;
  vec2 c = pw / (1.0 + 0.045 * breath);
  float r = length(c);

  // ---------------- 2. Drifting Black Flame Embers ----------------
  float embers = blackFlameEmbers(p, t, breath) * 0.35;
  vec3 emberCol = mix(uColorA, vec3(1.0, 0.4, 0.1), 0.6) * embers;

  // ---------------- 3–6. The Counter-Rotating Circle ----------------
  float m = 0.0;
  m += stroke(abs(r - 0.93), 0.004, aa);
  m += stroke(abs(r - 0.80), 0.003, aa);
  m += 0.9 * glyphBand(c, 0.815, 0.915, 36.0,  uRotation,        uGlyphSeed,        aa); // deosil
  m += stroke(abs(r - 0.70), 0.003, aa);
  m += 0.8 * glyphBand(c, 0.615, 0.690, 24.0, -uRotation * 0.7,  uGlyphSeed + 17.0, aa); // widdershins
  m += stroke(abs(r - 0.60), 0.0025, aa) * uInnerGlyph;
  m += uInnerGlyph * chaosStar(rot(uRotation * 0.35) * c, 0.58, aa);                                  // deosil
  m += stroke(abs(r - 0.40), 0.003, aa) * uInnerGlyph;
  m += uInnerGlyph * 0.85 * pentagram(rot(-uRotation * 0.5) * c, 0.40, aa);                           // widdershins

  float halo = 0.18 * exp(-abs(r - 0.93) * 30.0)
             + uInnerGlyph * 0.10 * exp(-abs(r - 0.58) * 25.0)
             + uInnerGlyph * 0.12 * exp(-abs(r - 0.40) * 30.0);

  // ---------------- 7. Breathing Core Yantra ----------------
  float core = exp(-r * r * mix(420.0, 110.0, breath)) * (0.6 + 0.8 * breath);

  vec3 glow = mix(uColorA, uColorB, smoothstep(0.05, 0.95, r));
  float energy = 0.75 + 0.5 * breath;
  float depth = mix(1.0, 0.55 + 0.6 * smoke, uMirror);

  vec3 col = obsidian + glow * (m + halo) * energy * depth + uColorA * core + emberCol;
  col *= uGain;
  col = 1.0 - exp(-col * 1.6);          // soft tonemap
  col = pow(col, vec3(1.0 / 2.2));      // linear → sRGB
  gl_FragColor = vec4(col, 1.0);
}
`;
