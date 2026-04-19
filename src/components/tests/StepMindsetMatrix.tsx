import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import type { MBTIResult } from '../../types';

interface Props {
  onComplete: (result: MBTIResult) => void;
}

interface Question {
  id: number;
  axis: 'EI' | 'SN' | 'TF' | 'JP';
  text: string;
  optionA: string; // E, S, T, J
  optionB: string; // I, N, F, P
}

const questions: Question[] = [
  // EI axis (5 questions)
  {
    id: 1, axis: 'EI',
    text: 'When your spirit needs replenishment after depletion, where do you find it?',
    optionA: 'In the warmth of gathering — people rekindle my flame',
    optionB: 'In solitude and silence — I must retreat to restore',
  },
  {
    id: 2, axis: 'EI',
    text: 'At a gathering of strangers, your soul instinctively...',
    optionA: 'Reaches outward, magnetized by new connections',
    optionB: 'Observes from still water, choosing depth over breadth',
  },
  {
    id: 3, axis: 'EI',
    text: 'When a new idea ignites within you, your first impulse is to...',
    optionA: 'Speak it into existence — words fuel the fire',
    optionB: 'Hold it inward, turn it slowly in the mind\'s light',
  },
  {
    id: 4, axis: 'EI',
    text: 'After extended time alone, your soul feels...',
    optionA: 'Restless — I hunger for voices and motion',
    optionB: 'Replenished — solitude is my sacred space',
  },
  {
    id: 5, axis: 'EI',
    text: 'In the theatre of life, you most naturally inhabit the role of...',
    optionA: 'The one who fills silence with stories and laughter',
    optionB: 'The one who listens until truth rises to the surface',
  },
  // SN axis (5 questions)
  {
    id: 6, axis: 'SN',
    text: 'When you gaze upon the world, what calls most to your attention?',
    optionA: 'The texture of what is — details, facts, the tangible now',
    optionB: 'The shadow of what could be — patterns, meaning, the possible',
  },
  {
    id: 7, axis: 'SN',
    text: 'You learn a new craft most naturally by...',
    optionA: 'Following each step in order, grounded in practical instruction',
    optionB: 'Grasping the whole concept first, then filling in the details',
  },
  {
    id: 8, axis: 'SN',
    text: 'In conversation, you are most drawn toward...',
    optionA: 'Real experiences, what happened, what is concrete and verifiable',
    optionB: 'Abstract ideas, hidden connections, the "why beneath the why"',
  },
  {
    id: 9, axis: 'SN',
    text: 'When you read the stars, you seek...',
    optionA: 'Their names, positions, and navigational facts',
    optionB: 'The myths they carry, the patterns they weave, the unseen meaning',
  },
  {
    id: 10, axis: 'SN',
    text: 'Your memory is most vivid in...',
    optionA: 'Specific moments — sights, sounds, the smell of that afternoon',
    optionB: 'The emotional truth of things — impressions and meanings persist',
  },
  // TF axis (5 questions)
  {
    id: 11, axis: 'TF',
    text: 'When someone you love is in pain, your first gift to them is...',
    optionA: 'Clear analysis — identifying the problem and the path through it',
    optionB: 'Presence and empathy — to be fully felt and understood',
  },
  {
    id: 12, axis: 'TF',
    text: 'A decision feels truly sound when it is...',
    optionA: 'Logically consistent, standing firm against all counterarguments',
    optionB: 'In harmony with values, honoring what matters to those involved',
  },
  {
    id: 13, axis: 'TF',
    text: 'When asked for an opinion that might sting, you...',
    optionA: 'Offer truth with precision — clarity serves better than comfort',
    optionB: 'Shape the truth gently — how it lands matters as much as what it says',
  },
  {
    id: 14, axis: 'TF',
    text: 'You trust a leader most when they demonstrate...',
    optionA: 'Rational competence and intellectual rigor',
    optionB: 'Deep care for those they guide and the impact of their choices',
  },
  {
    id: 15, axis: 'TF',
    text: 'When conflict arises, your path through it is guided by...',
    optionA: 'Principle — what is fair, what is logical, what is correct',
    optionB: 'Harmony — what will heal, what will preserve the relationship',
  },
  // JP axis (5 questions)
  {
    id: 16, axis: 'JP',
    text: 'Does your soul find harmony in charting paths before walking them?',
    optionA: 'Yes — a clear map steadies me and opens the horizon',
    optionB: 'No — I discover the path by walking, and that is enough',
  },
  {
    id: 17, axis: 'JP',
    text: 'When a project calls to you, you naturally begin by...',
    optionA: 'Establishing a structure, timeline, clear milestones',
    optionB: 'Diving in and letting the shape reveal itself organically',
  },
  {
    id: 18, axis: 'JP',
    text: 'An unresolved question in your life creates...',
    optionA: 'Discomfort — I need resolution to move forward with peace',
    optionB: 'Possibility — open questions hold the most interesting futures',
  },
  {
    id: 19, axis: 'JP',
    text: 'Your relationship with deadlines is best described as...',
    optionA: 'Sacred anchors — they are how I measure progress and success',
    optionB: 'Soft horizons — I meet them, but I resist their grip on my rhythm',
  },
  {
    id: 20, axis: 'JP',
    text: 'At the end of a free day, you feel most satisfied when you have...',
    optionA: 'Accomplished what you intended — the list fulfilled, the plan honored',
    optionB: 'Followed your energy wherever it led — spontaneity is its own reward',
  },
];

export default function StepMindsetMatrix({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [direction, setDirection] = useState(1);

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  const choose = (choice: 'A' | 'B') => {
    const newAnswers = { ...answers, [q.id]: choice };
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setDirection(1);
      setTimeout(() => setCurrent(c => c + 1), 200);
    } else {
      // Calculate scores
      const axisScores: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
      const axisCounts: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

      questions.forEach(q => {
        const ans = newAnswers[q.id];
        if (!ans) return;
        axisCounts[q.axis]++;
        // A = positive pole (E,S,T,J), B = negative pole (I,N,F,P)
        axisScores[q.axis] += ans === 'A' ? 1 : -1;
      });

      // Normalize to -100..100
      const normalize = (axis: string) =>
        axisCounts[axis] > 0
          ? Math.round((axisScores[axis] / axisCounts[axis]) * 100)
          : 0;

      const EI = normalize('EI');
      const SN = normalize('SN');
      const TF = normalize('TF');
      const JP = normalize('JP');

      const type =
        (EI >= 0 ? 'E' : 'I') +
        (SN >= 0 ? 'S' : 'N') +
        (TF >= 0 ? 'T' : 'F') +
        (JP >= 0 ? 'J' : 'P');

      // Assertive if most scores are strong (>30 average absolute)
      const avgAbs = (Math.abs(EI) + Math.abs(SN) + Math.abs(TF) + Math.abs(JP)) / 4;
      const assertive = avgAbs > 40;

      onComplete({ type, scores: { EI, SN, TF, JP }, assertive });
    }
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  const axisColors: Record<string, string> = {
    EI: 'from-violet-500 to-purple-600',
    SN: 'from-cyan-500 to-blue-600',
    TF: 'from-pink-500 to-rose-600',
    JP: 'from-amber-500 to-orange-600',
  };

  const axisLabels: Record<string, string> = {
    EI: 'Energy Flow',
    SN: 'Perception Gate',
    TF: 'Judgment Core',
    JP: 'Life Orientation',
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <motion.div className="text-4xl mb-3"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >◈</motion.div>
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-blue-400 via-violet-300 to-purple-400 bg-clip-text text-transparent mb-1">
          Mindset Matrix
        </h2>
        <p className="text-white/40 text-xs font-tech uppercase tracking-widest">
          Question {current + 1} of {questions.length} · {axisLabels[q.axis]}
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="mb-6 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${axisColors[q.axis]}`}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Axis indicator pills */}
      <div className="flex gap-2 mb-6 justify-center">
        {(['EI', 'SN', 'TF', 'JP'] as const).map(axis => {
          const done = questions.filter(q => q.axis === axis && answers[q.id]).length;
          const total = questions.filter(q => q.axis === axis).length;
          return (
            <div
              key={axis}
              className={`px-3 py-1 rounded-full text-xs font-tech ${q.axis === axis ? `bg-gradient-to-r ${axisColors[axis]} text-white` : 'bg-white/5 text-white/30'}`}
            >
              {axis} {done}/{total}
            </div>
          );
        })}
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
            <p className="text-white/90 text-lg font-light leading-relaxed text-center mb-8 min-h-[72px] flex items-center justify-center">
              {q.text}
            </p>

            <div className="space-y-3">
              {(['A', 'B'] as const).map(choice => (
                <motion.button
                  key={choice}
                  onClick={() => choose(choice)}
                  className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-400/40 transition-all duration-200 text-white/80 hover:text-white text-sm font-light leading-relaxed cursor-pointer"
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="font-tech text-white/30 mr-3 text-xs">{choice}</span>
                  {choice === 'A' ? q.optionA : q.optionB}
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
            ← Revisit Previous
          </button>
        </motion.div>
      )}
    </div>
  );
}
