import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GeneratingViewProps {
  progress: string;
  streamPreview: string;
}

const MESSAGES = [
  'Channeling cosmic frequencies…',
  'Analyzing neural patterns…',
  'Consulting the archetypes…',
  'Weaving your narrative…',
  'Synthesizing your blueprint…',
  'Aligning psychic coordinates…',
  'Illuminating the shadow self…',
];

function CosmicEyeAnimation() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Blink pattern
    const cycle = () => {
      setOpen(false);
      const t1 = setTimeout(() => setOpen(true), 400);
      const t2 = setTimeout(cycle, 3500 + Math.random() * 2000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    };
    const cancel = cycle();
    return cancel;
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      {/* Pulsing halos */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 100 + i * 28,
            height: 100 + i * 28,
            border: `1px solid rgba(124,58,237,${0.35 - i * 0.1})`,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{
            duration: 2.2 + i * 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Rotating outer ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 146,
          height: 146,
          border: '1.5px dashed rgba(236,72,153,0.3)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Eye SVG */}
      <svg width="100" height="70" viewBox="0 0 100 70" className="absolute">
        <defs>
          <radialGradient id="gen-iris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#7c3aed" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0a0a1a" />
          </radialGradient>
          <filter id="gen-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="gen-clip">
            <motion.path
              d={
                open
                  ? 'M 5 35 Q 50 5 95 35 Q 50 65 5 35 Z'
                  : 'M 5 35 Q 50 28 95 35 Q 50 42 5 35 Z'
              }
              animate={{
                d: open
                  ? 'M 5 35 Q 50 5 95 35 Q 50 65 5 35 Z'
                  : 'M 5 35 Q 50 28 95 35 Q 50 42 5 35 Z',
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            />
          </clipPath>
        </defs>

        {/* Eye outline */}
        <motion.path
          d="M 5 35 Q 50 5 95 35 Q 50 65 5 35 Z"
          fill="none"
          stroke="rgba(124,58,237,0.7)"
          strokeWidth="1.2"
          filter="url(#gen-glow)"
          animate={{
            d: open
              ? 'M 5 35 Q 50 5 95 35 Q 50 65 5 35 Z'
              : 'M 5 35 Q 50 28 95 35 Q 50 42 5 35 Z',
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />

        {/* Iris */}
        <circle cx="50" cy="35" r="18" fill="url(#gen-iris)" clipPath="url(#gen-clip)" />

        {/* Iris rays */}
        {Array.from({ length: 8 }, (_, i) => {
          const ang = (i / 8) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={50 + 8 * Math.cos(ang)}
              y1={35 + 8 * Math.sin(ang)}
              x2={50 + 16 * Math.cos(ang)}
              y2={35 + 16 * Math.sin(ang)}
              stroke="rgba(6,182,212,0.4)"
              strokeWidth="0.8"
              clipPath="url(#gen-clip)"
            />
          );
        })}

        {/* Pupil */}
        <motion.circle
          cx="50"
          cy="35"
          r={open ? 8 : 4}
          fill="#000010"
          clipPath="url(#gen-clip)"
          animate={{ r: open ? 8 : 4 }}
          transition={{ duration: 0.35 }}
        />

        {/* Highlight */}
        <circle cx="46" cy="31" r="2" fill="rgba(255,255,255,0.75)" clipPath="url(#gen-clip)" />

        {/* Limbal glow */}
        <circle
          cx="50"
          cy="35"
          r="18"
          fill="none"
          stroke="rgba(6,182,212,0.6)"
          strokeWidth="1"
          filter="url(#gen-glow)"
          clipPath="url(#gen-clip)"
        />
      </svg>
    </div>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const size = 200;
  const sw = 3;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute -rotate-90"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-90deg)' }}
    >
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="ring-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
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
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={sw}
      />
      {/* Animated arc */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: circ * (1 - pct) }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        filter="url(#ring-glow)"
      />
      {/* Indeterminate shimmer segment */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={sw * 0.6}
        strokeLinecap="round"
        strokeDasharray={`${circ * 0.08} ${circ * 0.92}`}
        animate={{ strokeDashoffset: [0, -circ] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  );
}

export default function GeneratingView({ progress, streamPreview }: GeneratingViewProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [pct, setPct] = useState(0);

  // Cycle messages
  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  // Fake progress bar that slowly advances
  useEffect(() => {
    setPct(0);
    const steps = 80; // stop at 80% until done
    let current = 0;
    const id = setInterval(() => {
      current += 1;
      setPct(Math.min(current / steps, 0.82));
      if (current >= steps) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, []);

  const preview = streamPreview.slice(0, 500);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 starfield">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(124,58,237,0.1) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 max-w-lg w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Eye + Progress ring */}
        <div className="relative" style={{ width: 200, height: 200 }}>
          <ProgressRing pct={pct} />
          <div className="absolute inset-0 flex items-center justify-center">
            <CosmicEyeAnimation />
          </div>
        </div>

        {/* Title */}
        <motion.div className="text-center space-y-2">
          <h2 className="text-2xl font-display gradient-text">Synthesizing Blueprint</h2>
          <p className="text-xs font-tech tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {progress || 'Processing…'}
          </p>
        </motion.div>

        {/* Rotating message */}
        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              className="text-sm font-body text-center"
              style={{ color: 'rgba(255,255,255,0.55)' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              {MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress percentage */}
        <div className="w-full space-y-1.5">
          <div className="flex justify-between text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span>Generating</span>
            <span>{Math.round(pct * 100)}%</span>
          </div>
          <div className="h-0.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)' }}
              animate={{ width: `${pct * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stream preview panel */}
        <AnimatePresence>
          {preview.length > 10 && (
            <motion.div
              className="w-full glass rounded-2xl p-5 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p
                className="text-xs font-tech tracking-widest uppercase mb-3"
                style={{ color: 'rgba(124,58,237,0.7)' }}
              >
                ✦ Incoming Signal
              </p>
              <p
                className="text-xs font-mono leading-relaxed line-clamp-6"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                {preview}
                <motion.span
                  className="inline-block w-0.5 h-3 ml-0.5 align-middle"
                  style={{ background: '#7c3aed' }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.75, repeat: Infinity }}
                />
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating particle dots */}
        <div className="flex gap-3 mt-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background:
                  i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#ec4899' : '#06b6d4',
              }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.28,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
