import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import type { JungianResult } from '../../types';

interface Props {
  onComplete: (result: JungianResult) => void;
}

interface JQuestion {
  id: number;
  archetype: string;
  text: string;
}

const ARCHETYPES = [
  'Hero', 'Sage', 'Explorer', 'Outlaw', 'Magician',
  'Lover', 'Jester', 'Everyman', 'Caregiver', 'Ruler', 'Creator', 'Innocent',
];

const questions: JQuestion[] = [
  // Hero
  { id: 1, archetype: 'Hero', text: 'When the world asks for courage, I answer — even when I am afraid, I choose to act.' },
  { id: 2, archetype: 'Hero', text: 'My deepest fulfillment comes from overcoming something worthy of the effort it demands.' },
  // Sage
  { id: 3, archetype: 'Sage', text: 'Truth is the highest value I serve — I would rather be right than comfortable.' },
  { id: 4, archetype: 'Sage', text: 'I seek understanding before action; wisdom matters more to me than speed.' },
  // Explorer
  { id: 5, archetype: 'Explorer', text: 'Freedom is not a preference — it is a necessity. Confinement in any form diminishes me.' },
  { id: 6, archetype: 'Explorer', text: 'I am drawn to the unfamiliar, the unmapped, the territory no one has yet named.' },
  // Outlaw
  { id: 7, archetype: 'Outlaw', text: 'I feel the pull to disrupt systems that have calcified into something no longer true or just.' },
  { id: 8, archetype: 'Outlaw', text: 'I have an instinctive resistance to rules that feel arbitrary or imposed by the wrong hands.' },
  // Magician
  { id: 9, archetype: 'Magician', text: 'I believe in transformation — that reality can be shifted through the right understanding and will.' },
  { id: 10, archetype: 'Magician', text: 'I am drawn to liminal spaces — the moments between states, where the unseen becomes visible.' },
  // Lover
  { id: 11, archetype: 'Lover', text: 'I live most fully when deeply connected — to another person, a purpose, a place, or a work.' },
  { id: 12, archetype: 'Lover', text: 'Beauty moves me in ways I cannot always articulate — it reaches somewhere beneath reason.' },
  // Jester
  { id: 13, archetype: 'Jester', text: 'Laughter is a form of truth — I often say in jest what others cannot bring themselves to say plainly.' },
  { id: 14, archetype: 'Jester', text: 'I resist taking things too seriously — life is too short and too absurd for that level of rigidity.' },
  // Everyman
  { id: 15, archetype: 'Everyman', text: 'I feel most at home among ordinary people — belonging and community matter more than distinction.' },
  { id: 16, archetype: 'Everyman', text: 'I distrust hierarchy and pretension; what is real is always more compelling than what is impressive.' },
  // Caregiver
  { id: 17, archetype: 'Caregiver', text: 'Protecting and nurturing those I love is not a duty — it is the expression of my deepest self.' },
  { id: 18, archetype: 'Caregiver', text: 'I feel the suffering of others as though it were my own, and I cannot leave it unaddressed.' },
  // Ruler
  { id: 19, archetype: 'Ruler', text: 'Order, structure, and responsibility feel natural to me — I understand that leadership requires sacrifice.' },
  { id: 20, archetype: 'Ruler', text: 'I carry a sense of duty to the larger systems I belong to — their stability feels like my responsibility.' },
  // Creator
  { id: 21, archetype: 'Creator', text: 'Something in me must make things — without creation, I feel a hollow where meaning should be.' },
  { id: 22, archetype: 'Creator', text: 'I see the world as raw material, always imagining how it could be shaped into something that did not exist before.' },
  // Innocent
  { id: 23, archetype: 'Innocent', text: 'I hold to a belief in fundamental goodness — in people, in life, in the possibility of things going right.' },
  { id: 24, archetype: 'Innocent', text: 'I have a quality of wonder that has survived — I can still be genuinely surprised, delighted, and moved.' },
];

const archetypeColors: Record<string, string> = {
  Hero: '#ef4444',
  Sage: '#3b82f6',
  Explorer: '#10b981',
  Outlaw: '#f59e0b',
  Magician: '#8b5cf6',
  Lover: '#ec4899',
  Jester: '#f97316',
  Everyman: '#6b7280',
  Caregiver: '#06b6d4',
  Ruler: '#a16207',
  Creator: '#a855f7',
  Innocent: '#fbbf24',
};

const archetypeSymbols: Record<string, string> = {
  Hero: '⚔', Sage: '◈', Explorer: '◎', Outlaw: '◣', Magician: '✦',
  Lover: '◐', Jester: '◇', Everyman: '◎', Caregiver: '◉', Ruler: '◈', Creator: '⬡', Innocent: '◌',
};

const LABELS = ['Not me', 'Rarely', 'Sometimes', 'Often', 'This is me'];

export default function StepJungianArchetypes({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [direction, setDirection] = useState(1);

  const q = questions[current];
  const progress = (current / questions.length) * 100;
  const color = archetypeColors[q.archetype];

  const choose = (val: number) => {
    const newScores = { ...scores, [q.id]: val };
    setScores(newScores);

    if (current < questions.length - 1) {
      setDirection(1);
      setTimeout(() => setCurrent(c => c + 1), 150);
    } else {
      // Sum per archetype, normalize
      const archetypeScores: Record<string, number> = {};
      ARCHETYPES.forEach(a => { archetypeScores[a] = 0; });

      questions.forEach(q => {
        const s = newScores[q.id] ?? 0;
        archetypeScores[q.archetype] = (archetypeScores[q.archetype] || 0) + s;
      });

      // Normalize to 0-100 (max raw per archetype = 2 questions * 5 = 10)
      const normalized: Record<string, number> = {};
      ARCHETYPES.forEach(a => {
        normalized[a] = Math.round((archetypeScores[a] / 10) * 100);
      });

      const sorted = ARCHETYPES.sort((a, b) => normalized[b] - normalized[a]);

      onComplete({
        primaryArchetype: sorted[0],
        secondaryArchetype: sorted[1],
        scores: normalized,
      });
    }
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 30 : -30 }),
    center: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -30 : 30 }),
  };

  // Track archetype completion
  const archetypeDone = (arch: string) =>
    questions.filter(q => q.archetype === arch && scores[q.id] !== undefined).length;

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
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >⬢</motion.div>
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent mb-1">
          Archetype Resonance
        </h2>
        <p className="text-white/40 text-xs font-tech uppercase tracking-widest">
          Reflection {current + 1} of {questions.length} · {q.archetype}
        </p>
      </motion.div>

      {/* Progress */}
      <div className="mb-4 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full transition-all"
          style={{ background: `linear-gradient(to right, ${color}, ${color}aa)`, width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Archetype grid mini-tracker */}
      <div className="flex flex-wrap gap-1 mb-5 justify-center">
        {ARCHETYPES.map(arch => {
          const done = archetypeDone(arch);
          return (
            <div
              key={arch}
              className={`px-2 py-0.5 rounded text-xs font-tech transition-all ${q.archetype === arch ? 'text-white' : done === 2 ? 'text-white/50' : 'text-white/20'}`}
              style={q.archetype === arch ? { background: color + '30', color } : {}}
            >
              {archetypeSymbols[arch]}{done === 2 ? '✓' : ''}
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
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <GlassCard>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xl" style={{ color }}>{archetypeSymbols[q.archetype]}</span>
              <span className="text-sm font-display font-semibold" style={{ color }}>
                The {q.archetype}
              </span>
            </div>

            <p className="text-white/90 text-lg font-light leading-relaxed mb-8">
              "{q.text}"
            </p>

            <p className="text-center text-white/30 text-xs font-tech uppercase tracking-widest mb-4">
              How deeply does this archetype live in you?
            </p>

            <div className="flex gap-2 justify-between">
              {[1, 2, 3, 4, 5].map(val => (
                <motion.button
                  key={val}
                  onClick={() => choose(val)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border transition-all duration-200 cursor-pointer
                    ${scores[q.id] === val
                      ? 'text-white'
                      : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                    }`}
                  style={scores[q.id] === val ? {
                    borderColor: color + '80',
                    background: color + '20',
                    color,
                  } : {}}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg font-bold">{val}</span>
                  <span className="text-[9px] font-tech text-center leading-tight hidden sm:block opacity-70">
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
