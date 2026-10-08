import React, { useEffect, useRef } from 'react';

interface AudioVisualizerCanvasProps {
  getAnalyser: () => AnalyserNode | null;
  isPlaying: boolean;
  mode?: 'waveform' | 'spectrum';
  height?: number;
  color?: string;
}

export const AudioVisualizerCanvas: React.FC<AudioVisualizerCanvasProps> = ({
  getAnalyser,
  isPlaying,
  mode = 'waveform',
  height = 48,
  color = '#ef4444',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const analyser = getAnalyser();
      const width = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, width, h);

      // Subtle background grid line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(width, h / 2);
      ctx.stroke();

      if (!isPlaying || !analyser) {
        // Draw resting idle pulse
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const t = performance.now() * 0.002;
        for (let x = 0; x < width; x += 4) {
          const y = h / 2 + Math.sin(x * 0.04 + t) * 3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      if (mode === 'waveform') {
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * h) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, h / 2);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      } else {
        // Frequency spectrum bars
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barCount = 36;
        const barWidth = width / barCount;
        const step = Math.floor(bufferLength / barCount / 2);

        for (let i = 0; i < barCount; i++) {
          const val = dataArray[i * step] / 255.0;
          const barHeight = Math.max(2, val * h * 0.85);
          const x = i * barWidth;
          const y = h - barHeight;

          const grad = ctx.createLinearGradient(0, h, 0, y);
          grad.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
          grad.addColorStop(1, color);

          ctx.fillStyle = grad;
          ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [getAnalyser, isPlaying, mode, height, color]);

  return (
    <div className="w-full relative rounded overflow-hidden bg-neutral-950/80 border border-neutral-800/80">
      <canvas
        ref={canvasRef}
        width={320}
        height={height}
        className="w-full block"
      />
      <div className="absolute top-1 right-2 flex items-center gap-1 pointer-events-none">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isPlaying ? 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse' : 'bg-neutral-600'
          }`}
        />
        <span className="text-[9px] font-mono text-neutral-400 uppercase">
          {isPlaying ? 'ACOUSTIC RESONANCE' : 'IDLE'}
        </span>
      </div>
    </div>
  );
};
