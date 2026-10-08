import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  generateSigil,
  SigilMatrixType,
  SIGIL_THEMES,
} from './sigilEngine';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Sliders,
  BookOpen,
} from 'lucide-react';

interface SigilForgeProps {
  onAttachToJournal?: (svgString: string, intent: string) => void;
  initialStatement?: string | null;
}

export const SigilForge: React.FC<SigilForgeProps> = ({
  onAttachToJournal,
  initialStatement,
}) => {
  const [statement, setStatement] = useState<string>(
    initialStatement || 'IT IS MY WILL TO COMMUNE WITH LEVIATHAN',
  );

  useEffect(() => {
    if (initialStatement && initialStatement.trim().length > 0) {
      setStatement(initialStatement);
    }
  }, [initialStatement]);
  const [matrixType, setMatrixType] = useState<SigilMatrixType>('circle_8_winds');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [curveSmoothness, setCurveSmoothness] = useState<number>(0.65);
  const [colorTheme, setColorTheme] = useState<keyof typeof SIGIL_THEMES>('crimson');
  const [showNodes, setShowNodes] = useState<boolean>(true);
  const [showTerminus, setShowTerminus] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Compute sigil data
  const result = useMemo(() => {
    return generateSigil(statement, matrixType, curveSmoothness, 500);
  }, [statement, matrixType, curveSmoothness]);

  const theme = SIGIL_THEMES[colorTheme];

  // Quick preset statements
  const PRESET_INTENTS = [
    'IT IS MY WILL TO COMMUNE WITH LEVIATHAN',
    'I TRANSMUTE ALL WEAKNESS INTO THE FORGE OF CAIN',
    'LUCIFERIAN GNOSIS ILLUMINATES MY PATH',
    'MY MIND IS AN IMPREGNABLE CITADEL OF SOVEREIGN WILL',
    'BELIAL ROOTS MY FOUNDATION IN BEDROCK',
  ];

  // Download raw SVG
  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gnosticos-sigil-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy SVG markup to clipboard
  const handleCopySvg = async () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    await navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAttach = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    if (onAttachToJournal) {
      onAttachToJournal(source, statement);
    }
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-black text-neutral-200 flex flex-col gap-6 select-none font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wider text-white flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-red-500" />
            Chaos Magic Sigil Forge
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Austin Osman Spare Monogram Reduction • Matrix Geometric Projection & Bézier Splines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySvg}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy SVG'}
          </button>
          <button
            onClick={handleDownloadSvg}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export SVG
          </button>
          {onAttachToJournal && (
            <button
              onClick={handleAttach}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-serif text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" /> Attach to Journal
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Input & Options (Left 5 Cols) vs. Live Canvas (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Statement of Intent Input */}
          <div className="glass-panel p-5 rounded-xl border border-neutral-800 flex flex-col gap-3">
            <label className="text-xs font-mono text-neutral-300 flex items-center justify-between">
              <span>Statement of Magical Intent:</span>
              <span className="text-[10px] text-neutral-500 uppercase">A.O. Spare Formula</span>
            </label>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              rows={3}
              placeholder="e.g. IT IS MY WILL TO COMMUNE WITH LEVIATHAN..."
              className="w-full bg-black/80 border border-neutral-700 rounded-lg p-3 text-xs font-mono text-neutral-100 placeholder:text-neutral-600 focus:border-red-500 focus:outline-none resize-none"
            />

            {/* Quick Intent Presets */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-neutral-500">Preset Intents:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_INTENTS.map((pi, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStatement(pi)}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 truncate max-w-full text-left"
                  >
                    {pi}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Word Reduction Breakdown Card */}
          <div className="glass-panel p-4 rounded-xl border border-red-950/60 flex flex-col gap-2.5 text-xs font-mono">
            <span className="text-[10px] uppercase text-neutral-500 font-bold">
              Word Reduction Breakdown
            </span>

            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-neutral-500">1. Vowels Removed:</span>
              <span className="text-red-400 font-semibold tracking-wider">
                {result.vowelsRemoved.join(' ') || '—'}
              </span>
            </div>

            <div className="flex items-center justify-between text-neutral-400 pt-1.5 border-t border-neutral-800">
              <span className="text-neutral-500">2. Unique Consonants:</span>
              <div className="flex items-center gap-1.5">
                {result.uniqueConsonants.map((c, i) => (
                  <span
                    key={i}
                    className="w-5 h-5 rounded bg-red-950 border border-red-700 text-red-200 flex items-center justify-center font-bold text-[11px]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Matrix & Style Controls */}
          <div className="glass-panel p-5 rounded-xl border border-neutral-800 flex flex-col gap-4 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="font-serif font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-400" />
                Forge Parameters
              </span>
            </div>

            {/* Matrix Type Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-neutral-400">Coordinate Matrix:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'circle_8_winds', label: '8 Winds / Chaos' },
                  { id: 'planetary_kamea', label: 'Saturn Kamea' },
                  { id: 'nine_divinities', label: '9 Divinities' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMatrixType(m.id as SigilMatrixType)}
                    className={`py-2 px-1 rounded-lg border text-center text-[10px] transition-all ${
                      matrixType === m.id
                        ? 'bg-neutral-900 border-red-600 text-white font-bold'
                        : 'bg-black/40 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spline Curvature Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Bézier Spline Smoothness:</span>
                <span className="text-red-400 font-bold">{Math.round(curveSmoothness * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={curveSmoothness}
                onChange={(e) => setCurveSmoothness(Number(e.target.value))}
                className="w-full accent-red-600 bg-neutral-900 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-neutral-600">
                <span>Straight Lines</span>
                <span>Organic Splines</span>
              </div>
            </div>

            {/* Stroke Width Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Stroke Thickness:</span>
                <span className="text-red-400 font-bold">{strokeWidth}px</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="0.5"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-red-600 bg-neutral-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Color Palette Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-neutral-400">Alchemical Palette:</span>
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(SIGIL_THEMES).map((k) => (
                  <button
                    key={k}
                    onClick={() => setColorTheme(k as keyof typeof SIGIL_THEMES)}
                    className={`py-1.5 rounded-lg border text-center text-[10px] capitalize transition-all ${
                      colorTheme === k
                        ? 'bg-neutral-900 border-white text-white font-bold'
                        : 'bg-black/40 border-neutral-800 text-neutral-500'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Node Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label
                onClick={() => setShowNodes(!showNodes)}
                className={`p-2 rounded-lg border cursor-pointer flex items-center justify-between text-[11px] ${
                  showNodes ? 'bg-neutral-900 border-neutral-700 text-white' : 'border-neutral-800 text-neutral-600'
                }`}
              >
                <span>Letter Nodes</span>
                <input type="checkbox" checked={showNodes} onChange={() => {}} className="text-red-600" />
              </label>

              <label
                onClick={() => setShowTerminus(!showTerminus)}
                className={`p-2 rounded-lg border cursor-pointer flex items-center justify-between text-[11px] ${
                  showTerminus ? 'bg-neutral-900 border-neutral-700 text-white' : 'border-neutral-800 text-neutral-600'
                }`}
              >
                <span>Terminus Mark</span>
                <input type="checkbox" checked={showTerminus} onChange={() => {}} className="text-red-600" />
              </label>
            </div>
          </div>
        </div>

        {/* Live Sigil Canvas Column */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center glass-panel p-6 rounded-xl border border-neutral-800 relative min-h-[520px]">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-xl transition-all duration-700"
            style={{
              background: `radial-gradient(circle at center, ${theme.glow} 0%, transparent 65%)`,
              opacity: 0.25,
            }}
          />

          {/* Master SVG Canvas (500 x 500) */}
          <svg
            ref={svgRef}
            viewBox="0 0 500 500"
            className="w-full max-w-[460px] aspect-square overflow-visible relative z-10"
          >
            <defs>
              <filter id="sigilGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Matrix Geometry Guides */}
            <circle cx="250" cy="250" r="230" fill="#040103" stroke="#262626" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="190" fill="none" stroke="#1f1f1f" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="250" cy="250" r="95" fill="none" stroke="#1a1a1a" strokeWidth="1" />

            {/* 8 Cardinal Axis Rays */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * Math.PI) / 4;
              return (
                <line
                  key={i}
                  x1={250 + 40 * Math.cos(angle)}
                  y1={250 + 40 * Math.sin(angle)}
                  x2={250 + 220 * Math.cos(angle)}
                  y2={250 + 220 * Math.sin(angle)}
                  stroke="#1c1c1c"
                  strokeWidth="1"
                />
              );
            })}

            {/* Center Chaos Star Hub */}
            <circle cx="250" cy="250" r="4" fill="#525252" />

            {/* Main Sigil Path with Glow Filter */}
            {result.svgPathData && (
              <path
                d={result.svgPathData}
                fill="none"
                stroke={theme.stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#sigilGlow)"
              />
            )}

            {/* Start Node Indicator (Spare Classical Circle) */}
            {result.points.length > 0 && (
              <circle
                cx={result.points[0].x}
                cy={result.points[0].y}
                r={strokeWidth * 1.8}
                fill="#000000"
                stroke={theme.stroke}
                strokeWidth={strokeWidth * 0.8}
              />
            )}

            {/* Terminus Mark (Crossbar on final point) */}
            {showTerminus && result.points.length > 1 && (() => {
              const last = result.points[result.points.length - 1];
              const prev = result.points[result.points.length - 2];
              const angle = Math.atan2(last.y - prev.y, last.x - prev.x) + Math.PI / 2;
              const barLen = 14;
              const x1 = last.x + barLen * Math.cos(angle);
              const y1 = last.y + barLen * Math.sin(angle);
              const x2 = last.x - barLen * Math.cos(angle);
              const y2 = last.y - barLen * Math.sin(angle);
              return (
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={theme.stroke}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              );
            })()}

            {/* Node Points & Letters */}
            {showNodes &&
              result.points.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={strokeWidth + 2}
                    fill={theme.nodeBg}
                    stroke={theme.stroke}
                    strokeWidth="1.5"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - strokeWidth - 5}
                    fill="#a3a3a3"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {pt.letter}
                  </text>
                </g>
              ))}
          </svg>

          {/* Matrix Footnote */}
          <div className="text-[10px] font-mono text-neutral-500 mt-4 text-center">
            Austin Osman Spare Monogram • {result.uniqueConsonants.length} Key Vectors • {result.originalStatement}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigilForge;
