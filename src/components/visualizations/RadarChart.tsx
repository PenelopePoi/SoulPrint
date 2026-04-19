import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface RadarDataPoint {
  label: string;
  value: number;
  max: number;
  color?: string;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function buildPolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  count: number,
  values: number[]
): string {
  return values
    .map((v, i) => {
      const angle = (360 / count) * i;
      const pt = polarToCartesian(cx, cy, radius * v, angle);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');
}

const DEFAULT_COLORS = [
  '#7c3aed',
  '#ec4899',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#f43f5e',
  '#a855f7',
  '#3b82f6',
];

export default function RadarChart({ data, size = 320 }: RadarChartProps) {
  const count = data.length;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38;
  const labelRadius = size * 0.47;
  const rings = 4;

  const normalizedValues = useMemo(
    () => data.map((d) => Math.min(d.value / d.max, 1)),
    [data]
  );

  const filledPoints = buildPolygonPoints(cx, cy, maxRadius, count, normalizedValues);

  const ringGridPoints = useMemo(
    () =>
      Array.from({ length: rings }, (_, ri) => {
        const frac = (ri + 1) / rings;
        return Array.from({ length: count }, (__, i) => {
          const angle = (360 / count) * i;
          return polarToCartesian(cx, cy, maxRadius * frac, angle);
        });
      }),
    [count, cx, cy, maxRadius, rings]
  );

  const axisPoints = useMemo(
    () =>
      data.map((_, i) => {
        const angle = (360 / count) * i;
        return polarToCartesian(cx, cy, maxRadius, angle);
      }),
    [count, cx, cy, data, maxRadius]
  );

  const labelPoints = useMemo(
    () =>
      data.map((_, i) => {
        const angle = (360 / count) * i;
        return polarToCartesian(cx, cy, labelRadius, angle);
      }),
    [count, cx, cy, data, labelRadius]
  );

  // Compute path length estimate for stroke-dasharray animation
  const pathLength = 2000;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="overflow-visible"
    >
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
        </radialGradient>
        <filter id="radarGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="labelGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ring grid lines */}
      {ringGridPoints.map((pts, ri) => (
        <motion.polygon
          key={`ring-${ri}`}
          points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: ri * 0.08 }}
        />
      ))}

      {/* Axis lines */}
      {axisPoints.map((pt, i) => (
        <motion.line
          key={`axis-${i}`}
          x1={cx}
          y1={cy}
          x2={pt.x}
          y2={pt.y}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
        />
      ))}

      {/* Filled polygon */}
      <motion.polygon
        points={filledPoints}
        fill="url(#radarFill)"
        stroke="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Stroke polygon animated */}
      <motion.polygon
        points={filledPoints}
        fill="none"
        stroke="url(#radarStroke)"
        strokeWidth="2"
        filter="url(#radarGlow)"
        strokeDasharray={pathLength}
        initial={{ strokeDashoffset: pathLength, opacity: 0 }}
        animate={{ strokeDashoffset: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: 'easeInOut' }}
      />

      {/* Per-point accent dots + glow */}
      {axisPoints.map((_, i) => {
        const angle = (360 / count) * i;
        const pt = polarToCartesian(cx, cy, maxRadius * normalizedValues[i], angle);
        const color = data[i].color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
        return (
          <motion.g key={`dot-${i}`} filter="url(#radarGlow)">
            <motion.circle
              cx={pt.x}
              cy={pt.y}
              r={5}
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.0 + i * 0.05, type: 'spring' }}
              style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
            />
            <motion.circle
              cx={pt.x}
              cy={pt.y}
              r={9}
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity={0.4}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
              style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
            />
          </motion.g>
        );
      })}

      {/* Labels */}
      {labelPoints.map((pt, i) => {
        const color = data[i].color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
        const pct = Math.round(normalizedValues[i] * 100);
        // Determine text anchor
        let anchor: 'start' | 'middle' | 'end' = 'middle';
        if (pt.x < cx - 10) anchor = 'end';
        else if (pt.x > cx + 10) anchor = 'start';

        return (
          <motion.g
            key={`label-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2 + i * 0.06 }}
          >
            <text
              x={pt.x}
              y={pt.y - 6}
              textAnchor={anchor}
              fontSize="10"
              fontFamily="Orbitron, sans-serif"
              fill={color}
              filter="url(#labelGlow)"
            >
              {data[i].label}
            </text>
            <text
              x={pt.x}
              y={pt.y + 8}
              textAnchor={anchor}
              fontSize="9"
              fontFamily="Space Mono, monospace"
              fill="rgba(255,255,255,0.5)"
            >
              {pct}%
            </text>
          </motion.g>
        );
      })}

      {/* Center dot */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={3}
        fill="rgba(255,255,255,0.4)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      />
    </svg>
  );
}
