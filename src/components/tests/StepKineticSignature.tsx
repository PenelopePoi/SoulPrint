import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import type { DISCResult } from '../../types';

interface Props {
  onComplete: (result: DISCResult) => void;
}

type DIMension = 'D' | 'I' | 'S' | 'C';

interface DISCOption {
  dim: DIMension;
  text: string;
}

interface DISCQuestion {
  id: number;
  scenario: string;
  options: DISCOption[];
}

const questions: DISCQuestion[] = [
  {
    id: 1,
    scenario: 'In the face of a difficult challenge, your soul most naturally...',
    options: [
      { dim: 'D', text: 'Charges directly at the obstacle — force is the answer' },
      { dim: 'I', text: 'Rallies others with enthusiasm — together we cannot fail' },
      { dim: 'S', text: 'Steadies the pace, conserves energy, moves deliberately' },
      { dim: 'C', text: 'Maps the territory first — knowledge before movement' },
    ],
  },
  {
    id: 2,
    scenario: 'Others would most recognize you as the person who...',
    options: [
      { dim: 'D', text: 'Gets results, no matter what stands in the way' },
      { dim: 'I', text: 'Lights up the room and makes everyone feel the magic' },
      { dim: 'S', text: 'Can always be counted on — steady, patient, reliable' },
      { dim: 'C', text: 'Has thought it through more carefully than anyone else' },
    ],
  },
  {
    id: 3,
    scenario: 'When a decision must be made quickly, you...',
    options: [
      { dim: 'D', text: 'Decide instantly — hesitation is the enemy of progress' },
      { dim: 'I', text: 'Trust your gut and the energy in the room' },
      { dim: 'S', text: 'Check how others are affected before committing' },
      { dim: 'C', text: 'Gather what data you can, even under pressure' },
    ],
  },
  {
    id: 4,
    scenario: 'Your deepest resistance rises when someone...',
    options: [
      { dim: 'D', text: 'Tries to control or micromanage your path' },
      { dim: 'I', text: 'Drains the energy from the room with rigidity or pessimism' },
      { dim: 'S', text: 'Disrupts the stability you have carefully built' },
      { dim: 'C', text: 'Makes decisions without proper analysis or preparation' },
    ],
  },
  {
    id: 5,
    scenario: 'Your greatest gift to a team or community is...',
    options: [
      { dim: 'D', text: 'Driving momentum and pushing past comfort zones' },
      { dim: 'I', text: 'Inspiring belief and generating creative energy' },
      { dim: 'S', text: 'Holding the center — offering calm, patience, and follow-through' },
      { dim: 'C', text: 'Ensuring quality and catching what others overlook' },
    ],
  },
  {
    id: 6,
    scenario: 'In a new environment, you are most comfortable when...',
    options: [
      { dim: 'D', text: 'You can establish your position and set direction quickly' },
      { dim: 'I', text: 'You have made connections and created warmth around you' },
      { dim: 'S', text: 'You understand the existing rhythms and how to fit within them' },
      { dim: 'C', text: 'You have studied the rules, expectations, and standards' },
    ],
  },
  {
    id: 7,
    scenario: 'Under extreme pressure, the version of you that emerges is...',
    options: [
      { dim: 'D', text: 'Harder, faster, more demanding of results' },
      { dim: 'I', text: 'Either more charming or more scattered — intensity amplifies' },
      { dim: 'S', text: 'Quieter, inward, holding until the storm passes' },
      { dim: 'C', text: 'More methodical, more critical — detail becomes refuge' },
    ],
  },
  {
    id: 8,
    scenario: 'Your relationship with authority is best described as...',
    options: [
      { dim: 'D', text: 'I prefer to be the authority — I earn the right to lead' },
      { dim: 'I', text: 'Authority is only as strong as the connection it builds' },
      { dim: 'S', text: 'I respect established structures and work within them' },
      { dim: 'C', text: 'Authority must demonstrate competence to earn my trust' },
    ],
  },
  {
    id: 9,
    scenario: 'If you could architect your ideal life, it would center around...',
    options: [
      { dim: 'D', text: 'Autonomy, conquest, and the satisfaction of dominance' },
      { dim: 'I', text: 'Connection, creativity, and the joy of inspiring others' },
      { dim: 'S', text: 'Stability, belonging, and the peace of a life well-maintained' },
      { dim: 'C', text: 'Mastery, precision, and the elegance of things done correctly' },
    ],
  },
  {
    id: 10,
    scenario: 'When receiving feedback, your first inner response is...',
    options: [
      { dim: 'D', text: 'Assess whether the source has the standing to offer it' },
      { dim: 'I', text: 'Feel it emotionally first — then decide what it means' },
      { dim: 'S', text: 'Consider it carefully and integrate it if it rings true' },
      { dim: 'C', text: 'Evaluate its accuracy and weigh it against available evidence' },
    ],
  },
  {
    id: 11,
    scenario: 'Your sense of time is most aligned with...',
    options: [
      { dim: 'D', text: 'The present — there is only now and what must be done' },
      { dim: 'I', text: 'The future — possibility and potential keep me moving' },
      { dim: 'S', text: 'Continuity — I honor what has been as I tend what is' },
      { dim: 'C', text: 'The past as data — I learn from it to perfect the future' },
    ],
  },
  {
    id: 12,
    scenario: 'The phrase that most echoes something true about you is...',
    options: [
      { dim: 'D', text: '"I came. I saw. I made it happen."' },
      { dim: 'I', text: '"Life is a story — and I intend to make it unforgettable."' },
      { dim: 'S', text: '"I will be here when you need me. That is enough."' },
      { dim: 'C', text: '"If it is worth doing, it is worth doing precisely right."' },
    ],
  },
];

const dimMeta: Record<DIMension, { label: string; color: string; desc: string }> = {
  D: { label: 'Dominance', color: '#ef4444', desc: 'Drive · Force · Results' },
  I: { label: 'Influence', color: '#f59e0b', desc: 'Inspire · Connect · Energize' },
  S: { label: 'Steadiness', color: '#10b981', desc: 'Support · Patience · Loyalty' },
  C: { label: 'Conscientiousness', color: '#3b82f6', desc: 'Accuracy · Quality · Analysis' },
};

export default function StepKineticSignature({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [mostLike, setMostLike] = useState<Record<number, DIMension>>({});
  const [leastLike, setLeastLike] = useState<Record<number, DIMension>>({});
  const [phase, setPhase] = useState<'most' | 'least'>('most');
  const [direction, setDirection] = useState(1);

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  const handleMost = (dim: DIMension) => {
    setMostLike(prev => ({ ...prev, [q.id]: dim }));
    setPhase('least');
  };

  const handleLeast = (dim: DIMension) => {
    if (dim === mostLike[q.id]) return; // Can't pick same
    const newLeast = { ...leastLike, [q.id]: dim };
    setLeastLike(newLeast);

    if (current < questions.length - 1) {
      setDirection(1);
      setPhase('most');
      setTimeout(() => setCurrent(c => c + 1), 200);
    } else {
      // Tally scores
      const scores: Record<DIMension, number> = { D: 0, I: 0, S: 0, C: 0 };
      questions.forEach(q => {
        const ml = mostLike[q.id];
        const ll = newLeast[q.id];
        if (ml) scores[ml] += 2;
        if (ll) scores[ll] -= 1;
      });

      // Normalize to 0-100
      const vals = Object.values(scores);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const range = max - min || 1;

      const normalized: Record<DIMension, number> = {
        D: Math.round(((scores.D - min) / range) * 100),
        I: Math.round(((scores.I - min) / range) * 100),
        S: Math.round(((scores.S - min) / range) * 100),
        C: Math.round(((scores.C - min) / range) * 100),
      };

      const primaryStyle = (Object.entries(normalized) as [DIMension, number][])
        .sort((a, b) => b[1] - a[1])[0][0];

      onComplete({
        dominance: normalized.D,
        influence: normalized.I,
        steadiness: normalized.S,
        conscientiousness: normalized.C,
        primaryStyle,
      });
    }
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 30 : -30 }),
    center: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -30 : 30 }),
  };

  const currentMost = mostLike[q.id];

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
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >◎</motion.div>
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent mb-1">
          Kinetic Signature
        </h2>
        <p className="text-white/40 text-xs font-tech uppercase tracking-widest">
          Pattern {current + 1} of {questions.length} · {phase === 'most' ? 'Most Like Me' : 'Least Like Me'}
        </p>
      </motion.div>

      {/* Progress */}
      <div className="mb-4 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Phase indicator */}
      <div className="flex gap-2 mb-6 justify-center">
        <div className={`px-4 py-1 rounded-full text-xs font-tech transition-all ${phase === 'most' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-white/30'}`}>
          Step 1: Most Like Me
        </div>
        <div className={`px-4 py-1 rounded-full text-xs font-tech transition-all ${phase === 'least' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40' : 'bg-white/5 text-white/30'}`}>
          Step 2: Least Like Me
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${current}-${phase}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <GlassCard>
            <p className="text-white/90 text-base font-light leading-relaxed mb-6">
              {q.scenario}
            </p>

            <p className="text-xs font-tech uppercase tracking-widest text-center mb-4 text-white/40">
              {phase === 'most' ? '↓ Choose the option that feels most like your soul' : '↓ Now choose the option least like you'}
            </p>

            <div className="space-y-2">
              {q.options.map(opt => {
                const meta = dimMeta[opt.dim];
                const isMostSelected = mostLike[q.id] === opt.dim;
                const isDisabledForLeast = phase === 'least' && opt.dim === currentMost;

                return (
                  <motion.button
                    key={opt.dim}
                    onClick={() => phase === 'most' ? handleMost(opt.dim) : handleLeast(opt.dim)}
                    disabled={isDisabledForLeast}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer
                      ${isDisabledForLeast ? 'opacity-30 cursor-not-allowed border-white/5 bg-white/3' :
                        isMostSelected && phase === 'least' ? 'border-cyan-500/30 bg-cyan-500/10' :
                        'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}
                    `}
                    whileHover={isDisabledForLeast ? {} : { scale: 1.01, x: 3 }}
                    whileTap={isDisabledForLeast ? {} : { scale: 0.99 }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ background: meta.color + '30', color: meta.color }}
                      >
                        {opt.dim}
                      </span>
                      <div>
                        <div className="text-sm text-white/80 font-light">{opt.text}</div>
                        <div className="text-xs mt-0.5 font-tech" style={{ color: meta.color + '80' }}>
                          {meta.desc}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {(current > 0 || phase === 'least') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
          <button
            onClick={() => {
              if (phase === 'least') {
                setPhase('most');
              } else {
                setDirection(-1);
                setCurrent(c => c - 1);
                setPhase('most');
              }
            }}
            className="text-white/30 hover:text-white/60 text-xs font-tech uppercase tracking-widest transition-colors cursor-pointer"
          >
            ← Return
          </button>
        </motion.div>
      )}
    </div>
  );
}
