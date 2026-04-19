import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface ScoreRevealProps {
  value: number;
  max: number;
  label: string;
  color?: string;
  delay?: number;
}

export default function ScoreReveal({
  value,
  max,
  label,
  color = '#7c3aed',
  delay = 0,
}: ScoreRevealProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);

  // Intersection observer — start animation when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Count-up animation
  useEffect(() => {
    if (!hasStarted) return;
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const duration = 1400;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [hasStarted, value, delay]);

  const dashOffset = circumference * (1 - (hasStarted ? pct : 0));

  // Color stops for gradient
  const gradId = `score-grad-${label.replace(/\s+/g, '-')}`;

  return (
    <motion.div
      ref={containerRef}
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id={`score-glow-${label.replace(/\s+/g, '-')}`}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />

          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, delay: delay, ease: 'easeOut' }}
            filter={`url(#score-glow-${label.replace(/\s+/g, '-')})`}
          />

          {/* Outer tick marks */}
          {Array.from({ length: 32 }, (_, i) => {
            const angle = (i / 32) * 360;
            const rad = (angle * Math.PI) / 180;
            const innerR = radius - strokeWidth / 2 - 4;
            const outerR = radius + strokeWidth / 2 + 2;
            const x1 = size / 2 + innerR * Math.cos(rad);
            const y1 = size / 2 + innerR * Math.sin(rad);
            const x2 = size / 2 + outerR * Math.cos(rad);
            const y2 = size / 2 + outerR * Math.sin(rad);
            const isActive = i / 32 <= pct;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? color : 'rgba(255,255,255,0.05)'}
                strokeWidth="1"
                opacity={isActive ? 0.6 : 1}
              />
            );
          })}
        </svg>

        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: 'rotate(0deg)' }}
        >
          <motion.span
            className="text-2xl font-bold font-mono"
            style={{ color }}
          >
            {displayValue}
          </motion.span>
          <span className="text-xs text-white/40 font-mono">/{max}</span>
        </div>

        {/* Pulsing halo when at full */}
        {pct >= 0.95 && hasStarted && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 20px ${color}40, 0 0 40px ${color}20`,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Label */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.3 }}
      >
        <p
          className="text-xs font-semibold tracking-widest uppercase font-tech"
          style={{ color }}
        >
          {label}
        </p>
        {/* Percentage bar */}
        <div className="mt-1.5 w-20 h-0.5 bg-white/10 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}, #ec4899)` }}
            initial={{ width: 0 }}
            animate={{ width: hasStarted ? `${pct * 100}%` : 0 }}
            transition={{ duration: 1.4, delay: delay, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
