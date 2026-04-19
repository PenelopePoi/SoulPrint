import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface StarPoint {
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface ConstellationMapProps {
  points: StarPoint[];
  connections?: [number, number][];
}

export default function ConstellationMap({ points, connections = [] }: ConstellationMapProps) {
  // Normalize coordinate space to 0-100 → actual SVG dimensions
  const svgW = 500;
  const svgH = 380;

  const mapped = useMemo(
    () =>
      points.map((p) => ({
        ...p,
        sx: (p.x / 100) * svgW,
        sy: (p.y / 100) * svgH,
      })),
    [points]
  );

  // Build unique glow filter ids
  const filterIds = useMemo(() => points.map((_, i) => `star-glow-${i}`), [points]);

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="w-full overflow-visible"
      style={{ maxHeight: 380 }}
    >
      <defs>
        {points.map((p, i) => (
          <filter key={filterIds[i]} id={filterIds[i]} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor={p.color} floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
        <filter id="constellation-line-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Subtle nebula background */}
        <radialGradient id="nebula-bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.04" />
          <stop offset="60%" stopColor="#ec4899" stopOpacity="0.02" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background nebula wash */}
      <rect width={svgW} height={svgH} fill="url(#nebula-bg)" />

      {/* Static tiny background stars */}
      {useMemo(() => {
        const bg = [];
        // deterministic "random" positions
        const seeds = [
          [0.05,0.1],[0.15,0.4],[0.25,0.7],[0.35,0.2],[0.45,0.85],
          [0.55,0.15],[0.65,0.55],[0.75,0.35],[0.85,0.75],[0.92,0.45],
          [0.08,0.6],[0.18,0.9],[0.28,0.3],[0.38,0.65],[0.48,0.05],
          [0.58,0.8],[0.68,0.22],[0.78,0.5],[0.88,0.12],[0.95,0.68],
        ];
        for (let i = 0; i < seeds.length; i++) {
          const [fx, fy] = seeds[i];
          bg.push(
            <circle
              key={`bg-star-${i}`}
              cx={fx * svgW}
              cy={fy * svgH}
              r={0.8 + (i % 3) * 0.4}
              fill="rgba(255,255,255,0.25)"
            />
          );
        }
        return bg;
      }, [])}

      {/* Connection lines */}
      {connections.map(([a, b], ci) => {
        if (!mapped[a] || !mapped[b]) return null;
        const pa = mapped[a];
        const pb = mapped[b];
        return (
          <motion.line
            key={`conn-${ci}`}
            x1={pa.sx}
            y1={pa.sy}
            x2={pb.sx}
            y2={pb.sy}
            stroke="rgba(124,58,237,0.45)"
            strokeWidth="1.2"
            filter="url(#constellation-line-glow)"
            strokeDasharray="200"
            initial={{ strokeDashoffset: 200, opacity: 0 }}
            animate={{ strokeDashoffset: 0, opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.4 + ci * 0.12, ease: 'easeInOut' }}
          />
        );
      })}

      {/* Pulsing connection line overlays */}
      {connections.map(([a, b], ci) => {
        if (!mapped[a] || !mapped[b]) return null;
        const pa = mapped[a];
        const pb = mapped[b];
        return (
          <motion.line
            key={`conn-pulse-${ci}`}
            x1={pa.sx}
            y1={pa.sy}
            x2={pb.sx}
            y2={pb.sy}
            stroke="rgba(236,72,153,0.3)"
            strokeWidth="1"
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{
              duration: 2.5 + (ci % 3) * 0.5,
              repeat: Infinity,
              delay: ci * 0.3,
            }}
          />
        );
      })}

      {/* Stars */}
      {mapped.map((p, i) => (
        <motion.g
          key={`star-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.8 + i * 0.1,
            type: 'spring',
            stiffness: 200,
          }}
          style={{ transformOrigin: `${p.sx}px ${p.sy}px` }}
        >
          {/* Outer glow halo */}
          <motion.circle
            cx={p.sx}
            cy={p.sy}
            r={p.size * 3.5}
            fill={p.color}
            opacity={0.08}
            animate={{ r: [p.size * 3.5, p.size * 5, p.size * 3.5] }}
            transition={{
              duration: 3 + (i % 4) * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          />
          {/* Mid glow */}
          <circle
            cx={p.sx}
            cy={p.sy}
            r={p.size * 1.8}
            fill={p.color}
            opacity={0.25}
            filter={`url(#${filterIds[i]})`}
          />
          {/* Core */}
          <circle cx={p.sx} cy={p.sy} r={p.size} fill={p.color} filter={`url(#${filterIds[i]})`} />
          {/* Bright center */}
          <circle cx={p.sx} cy={p.sy} r={p.size * 0.4} fill="rgba(255,255,255,0.9)" />

          {/* 4-point star spike */}
          {p.size > 5 && (
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20 + i * 3, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${p.sx}px ${p.sy}px` }}
            >
              <line
                x1={p.sx}
                y1={p.sy - p.size * 2.2}
                x2={p.sx}
                y2={p.sy + p.size * 2.2}
                stroke={p.color}
                strokeWidth="0.8"
                opacity={0.5}
              />
              <line
                x1={p.sx - p.size * 2.2}
                y1={p.sy}
                x2={p.sx + p.size * 2.2}
                y2={p.sy}
                stroke={p.color}
                strokeWidth="0.8"
                opacity={0.5}
              />
            </motion.g>
          )}
        </motion.g>
      ))}

      {/* Labels */}
      {mapped.map((p, i) => {
        const offsetY = p.sy > svgH * 0.75 ? -p.size - 18 : p.size + 18;
        return (
          <motion.text
            key={`label-${i}`}
            x={p.sx}
            y={p.sy + offsetY}
            textAnchor="middle"
            fontSize="10"
            fontFamily="Orbitron, sans-serif"
            fill={p.color}
            opacity={0.9}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.4, delay: 1.2 + i * 0.08 }}
          >
            {p.label}
          </motion.text>
        );
      })}
    </svg>
  );
}
