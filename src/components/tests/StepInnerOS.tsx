import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import type { EnneagramResult } from '../../types';

interface Props {
  onComplete: (result: EnneagramResult) => void;
}

interface EQuestion {
  id: number;
  type: number;
  text: string;
}

const questions: EQuestion[] = [
  // Type 1 - The Reformer
  { id: 1, type: 1, text: 'A quiet but persistent voice within me watches for what is wrong and longs to make it right.' },
  { id: 2, type: 1, text: 'I hold myself to standards that others might find exhausting, because perfection feels like a moral duty.' },
  // Type 2 - The Helper
  { id: 3, type: 2, text: 'I feel most alive when I am needed — when I can feel that my presence truly makes a difference.' },
  { id: 4, type: 2, text: 'It is easier for me to give than to receive; asking for help feels almost foreign to my nature.' },
  // Type 3 - The Achiever
  { id: 5, type: 3, text: 'I am deeply attuned to how I appear to others, and I shape myself to reflect success and admiration.' },
  { id: 6, type: 3, text: 'My worth feels tied to what I accomplish — without achievement, something hollow echoes inside.' },
  // Type 4 - The Individualist
  { id: 7, type: 4, text: 'I carry a feeling of being fundamentally different — perhaps missing something others seem to have naturally.' },
  { id: 8, type: 4, text: 'My emotions are a vast ocean — intense, meaningful, and often more real to me than the outer world.' },
  // Type 5 - The Investigator
  { id: 9, type: 5, text: 'I retreat inward to observe and understand before engaging — the world drains me if I am not prepared.' },
  { id: 10, type: 5, text: 'Knowledge feels like the only reliable currency; I hoard understanding to feel safe and capable.' },
  // Type 6 - The Loyalist
  { id: 11, type: 6, text: 'My mind is a constant risk-calculator — I scan for what could go wrong before it does.' },
  { id: 12, type: 6, text: 'Trust is earned slowly and guarded carefully; I am both drawn to and skeptical of authority.' },
  // Type 7 - The Enthusiast
  { id: 13, type: 7, text: 'The horizon always holds something brighter — I am pulled toward possibilities before the current one is finished.' },
  { id: 14, type: 7, text: 'Pain and limitation are things I instinctively reframe or escape — staying with discomfort is a practice, not a default.' },
  // Type 8 - The Challenger
  { id: 15, type: 8, text: 'I move through the world with an intensity that others sometimes find overwhelming — I rarely do anything halfway.' },
  { id: 16, type: 8, text: 'Vulnerability feels dangerous. Strength and control are my armor and my offering.' },
  // Type 9 - The Peacemaker
  { id: 17, type: 9, text: 'I drift easily into others\' priorities, sometimes losing track of what I myself actually want.' },
  { id: 18, type: 9, text: 'Conflict disrupts something essential in me — peace and harmony feel like survival, not preference.' },
];

const LABELS = ['Not at all', 'Rarely', 'Sometimes', 'Often', 'Deeply true'];

export default function StepInnerOS({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [direction, setDirection] = useState(1);

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  const choose = (val: number) => {
    const newScores = { ...scores, [q.id]: val };
    setScores(newScores);

    if (current < questions.length - 1) {
      setDirection(1);
      setTimeout(() => setCurrent(c => c + 1), 150);
    } else {
      // Aggregate per type
      const typeScores: Record<number, number> = {};
      for (let t = 1; t <= 9; t++) typeScores[t] = 0;

      questions.forEach(q => {
        const s = newScores[q.id] ?? 0;
        typeScores[q.type] = (typeScores[q.type] || 0) + s;
      });

      // Normalize to 0-100 (max raw = 10 per type (2 questions * 5))
      const normalized: Record<number, number> = {};
      for (let t = 1; t <= 9; t++) {
        normalized[t] = Math.round((typeScores[t] / 10) * 100);
      }

      // Primary type
      const primaryType = Number(
        Object.entries(normalized).sort((a, b) => b[1] - a[1])[0][0]
      );

      // Wing: adjacent type with higher score
      const left = primaryType === 1 ? 9 : primaryType - 1;
      const right = primaryType === 9 ? 1 : primaryType + 1;
      const wing = normalized[left] >= normalized[right] ? left : right;

      // Tritype: pick top from each center (gut 8-9-1, heart 2-3-4, head 5-6-7)
      const centers = [[8, 9, 1], [2, 3, 4], [5, 6, 7]];
      const tritype = centers.map(center => {
        return center.sort((a, b) => normalized[b] - normalized[a])[0];
      }) as [number, number, number];

      onComplete({ type: primaryType, wing, scores: normalized, tritype });
    }
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 40 : -40 }),
    center: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -40 : 40 }),
  };

  const typeNames: Record<number, string> = {
    1: 'The Reformer', 2: 'The Helper', 3: 'The Achiever',
    4: 'The Individualist', 5: 'The Investigator', 6: 'The Loyalist',
    7: 'The Enthusiast', 8: 'The Challenger', 9: 'The Peacemaker',
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <motion.div
          className="text-4xl mb-3"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        >◉</motion.div>
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-fuchsia-400 bg-clip-text text-transparent mb-1">
          Inner Operating System
        </h2>
        <p className="text-white/40 text-xs font-tech uppercase tracking-widest">
          Question {current + 1} of {questions.length} · Type {q.type}: {typeNames[q.type]}
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-6 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <GlassCard>
            <div className="mb-2">
              <span className="text-xs font-tech text-pink-400/60 uppercase tracking-widest">
                Type {q.type} · {typeNames[q.type]}
              </span>
            </div>
            <p className="text-white/90 text-lg font-light leading-relaxed mb-8">
              "{q.text}"
            </p>

            <p className="text-center text-white/40 text-xs font-tech uppercase tracking-widest mb-4">
              How resonant is this with your soul?
            </p>

            <div className="flex gap-2 justify-between">
              {[1, 2, 3, 4, 5].map(val => (
                <motion.button
                  key={val}
                  onClick={() => choose(val)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border transition-all duration-200 cursor-pointer
                    ${scores[q.id] === val
                      ? 'border-pink-400/60 bg-pink-500/20 text-pink-300'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-pink-400/30 hover:bg-white/10 hover:text-white/80'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg font-bold">{val}</span>
                  <span className="text-[9px] font-tech text-center leading-tight hidden sm:block">
                    {LABELS[val - 1]}
                  </span>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {current > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
          <button
            onClick={() => { setDirection(-1); setCurrent(c => c - 1); }}
            className="text-white/30 hover:text-white/60 text-xs font-tech uppercase tracking-widest transition-colors cursor-pointer"
          >
            ← Return
          </button>
        </motion.div>
      )}
    </div>
  );
}
