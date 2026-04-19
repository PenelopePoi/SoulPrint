import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import type { NeuralResonanceResult } from '../../types';

interface Props {
  onComplete: (result: NeuralResonanceResult) => void;
}

type Scale = keyof NeuralResonanceResult['scales'];

interface NRQuestion {
  id: number;
  scale: Scale;
  text: string;
  trueScore: boolean; // true = True answer adds to scale
}

const questions: NRQuestion[] = [
  // Hypochondriasis
  {
    id: 1, scale: 'hypochondriasis', trueScore: true,
    text: 'My body speaks to me often — subtle signals, small aches — and I listen with careful attention.',
  },
  {
    id: 2, scale: 'hypochondriasis', trueScore: true,
    text: 'I find myself drawn to researching symptoms and physical sensations even when I am told nothing is wrong.',
  },
  // Depression
  {
    id: 3, scale: 'depression', trueScore: true,
    text: 'There are seasons of my inner life where color drains away and only gray remains.',
  },
  {
    id: 4, scale: 'depression', trueScore: true,
    text: 'The future sometimes feels like a door I have no key for — distant and sealed.',
  },
  // Hysteria
  {
    id: 5, scale: 'hysteria', trueScore: true,
    text: 'I sometimes experience physical symptoms — tightness, fatigue, pain — that intensify in moments of emotional stress.',
  },
  {
    id: 6, scale: 'hysteria', trueScore: true,
    text: 'I adapt my presentation to my audience — showing what is needed to feel connected and accepted.',
  },
  // Psychopathic Deviate
  {
    id: 7, scale: 'psychopathicDeviate', trueScore: true,
    text: 'Rules designed by others often feel arbitrary to me — I follow my own internal compass first.',
  },
  {
    id: 8, scale: 'psychopathicDeviate', trueScore: true,
    text: 'I have acted impulsively in ways I later reconsidered, driven by the heat of the moment.',
  },
  // Paranoia
  {
    id: 9, scale: 'paranoia', trueScore: true,
    text: 'I sense undercurrents in my relationships — unspoken agendas, shifting loyalties — even when others seem unaware.',
  },
  {
    id: 10, scale: 'paranoia', trueScore: true,
    text: 'When bad things happen to me, I feel they are rarely truly random — something or someone seems involved.',
  },
  // Psychasthenia
  {
    id: 11, scale: 'psychasthenia', trueScore: true,
    text: 'I return repeatedly to thoughts I would rather leave — loops that play without my permission.',
  },
  {
    id: 12, scale: 'psychasthenia', trueScore: true,
    text: 'Anxiety lives close to the surface for me — a low hum that rises when life becomes uncertain.',
  },
  // Schizophrenia
  {
    id: 13, scale: 'schizophrenia', trueScore: true,
    text: 'My inner world is so vivid and complex that it sometimes feels more real than the one others share.',
  },
  {
    id: 14, scale: 'schizophrenia', trueScore: true,
    text: 'I sometimes experience a sense of unreality — as though I am observing my life from somewhere slightly outside it.',
  },
  // Hypomania
  {
    id: 15, scale: 'hypomania', trueScore: true,
    text: 'My energy surges in waves — at peaks, I feel I could rewrite everything at once.',
  },
  {
    id: 16, scale: 'hypomania', trueScore: true,
    text: 'My thoughts race ahead of my ability to capture them — ideas multiply faster than I can act on them.',
  },
];

const scaleLabels: Record<Scale, string> = {
  hypochondriasis: 'Body Resonance',
  depression: 'Shadow Depth',
  hysteria: 'Emotional Frequency',
  psychopathicDeviate: 'Boundary Current',
  paranoia: 'Vigilance Field',
  psychasthenia: 'Obsidian Loop',
  schizophrenia: 'Inner Cosmos',
  hypomania: 'Solar Surge',
};

const scaleColors: Record<Scale, string> = {
  hypochondriasis: '#10b981',
  depression: '#6366f1',
  hysteria: '#f43f5e',
  psychopathicDeviate: '#f59e0b',
  paranoia: '#8b5cf6',
  psychasthenia: '#06b6d4',
  schizophrenia: '#a855f7',
  hypomania: '#ec4899',
};

export default function StepNeuralResonance({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [direction, setDirection] = useState(1);

  const q = questions[current];
  const progress = (current / questions.length) * 100;
  const color = scaleColors[q.scale];

  const choose = (val: boolean) => {
    const newAnswers = { ...answers, [q.id]: val };
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setDirection(1);
      setTimeout(() => setCurrent(c => c + 1), 200);
    } else {
      // Tally scores per scale
      const scaleCounts: Record<Scale, number> = {
        hypochondriasis: 0, depression: 0, hysteria: 0, psychopathicDeviate: 0,
        paranoia: 0, psychasthenia: 0, schizophrenia: 0, hypomania: 0,
      };
      const scaleHits: Record<Scale, number> = { ...scaleCounts };

      questions.forEach(q => {
        scaleCounts[q.scale]++;
        const answer = newAnswers[q.id] ?? false;
        const hit = q.trueScore ? answer : !answer;
        if (hit) scaleHits[q.scale]++;
      });

      const normalize = (scale: Scale) =>
        scaleCounts[scale] > 0
          ? Math.round((scaleHits[scale] / scaleCounts[scale]) * 100)
          : 0;

      onComplete({
        scales: {
          hypochondriasis: normalize('hypochondriasis'),
          depression: normalize('depression'),
          hysteria: normalize('hysteria'),
          psychopathicDeviate: normalize('psychopathicDeviate'),
          paranoia: normalize('paranoia'),
          psychasthenia: normalize('psychasthenia'),
          schizophrenia: normalize('schizophrenia'),
          hypomania: normalize('hypomania'),
        },
      });
    }
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -50 : 50 }),
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
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >⬡</motion.div>
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent mb-1">
          Neural Resonance
        </h2>
        <p className="text-white/40 text-xs font-tech uppercase tracking-widest">
          Signal {current + 1} of {questions.length} · {scaleLabels[q.scale]}
        </p>
      </motion.div>

      {/* Progress */}
      <div className="mb-6 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full transition-all"
          style={{ background: `linear-gradient(to right, ${color}, ${color}aa)`, width: `${progress}%` }}
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
            <div className="mb-3 flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: color }}
              />
              <span className="text-xs font-tech uppercase tracking-widest" style={{ color }}>
                {scaleLabels[q.scale]}
              </span>
            </div>

            <p className="text-white/90 text-lg font-light leading-relaxed mb-10">
              "{q.text}"
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'True — this resonates', value: true, icon: '◉' },
                { label: 'False — this does not', value: false, icon: '◎' },
              ].map(opt => (
                <motion.button
                  key={String(opt.value)}
                  onClick={() => choose(opt.value)}
                  className="flex flex-col items-center gap-2 py-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                  style={{
                    borderColor: answers[q.id] === opt.value ? color + '80' : undefined,
                    background: answers[q.id] === opt.value ? color + '20' : undefined,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-2xl" style={{ color: answers[q.id] === opt.value ? color : 'rgba(255,255,255,0.3)' }}>
                    {opt.icon}
                  </span>
                  <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors font-light text-center leading-tight">
                    {opt.label}
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
