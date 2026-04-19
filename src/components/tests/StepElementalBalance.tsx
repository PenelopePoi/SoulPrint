import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CosmicButton from '../ui/CosmicButton';
import GlassCard from '../ui/GlassCard';
import type { BigFiveResult } from '../../types';

interface Props {
  onComplete: (result: BigFiveResult) => void;
}

interface BFQuestion {
  id: number;
  trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  text: string;
  reversed?: boolean;
}

const questions: BFQuestion[] = [
  // Openness (3)
  { id: 1, trait: 'openness', text: 'I am drawn into the labyrinth of ideas, art, and imagination with a force I rarely resist.' },
  { id: 2, trait: 'openness', text: 'Abstract concepts and philosophical questions light something in me that practical matters cannot.' },
  { id: 3, trait: 'openness', text: 'I seek out beauty and novelty the way others seek comfort and routine.' },
  // Conscientiousness (3)
  { id: 4, trait: 'conscientiousness', text: 'I navigate my life with intention — plans, order, and follow-through are how I honor my commitments.' },
  { id: 5, trait: 'conscientiousness', text: 'A task left unfinished creates a quiet but insistent discomfort that pulls at me until it is complete.' },
  { id: 6, trait: 'conscientiousness', text: 'I am reliable in the way bedrock is reliable — people can build on my word.' },
  // Extraversion (3)
  { id: 7, trait: 'extraversion', text: 'I carry a current of energy that seeks expression through others, movement, and the outer world.' },
  { id: 8, trait: 'extraversion', text: 'Social environments recharge me rather than drain me — I am energized by presence and connection.' },
  { id: 9, trait: 'extraversion', text: 'I speak before I reflect — my thoughts find their form in the act of expression itself.' },
  // Agreeableness (3)
  { id: 10, trait: 'agreeableness', text: 'The pain of others moves through me easily — compassion is not a practice but a reflex.' },
  { id: 11, trait: 'agreeableness', text: 'I lean toward trust, cooperation, and warmth even when caution might serve me better.' },
  { id: 12, trait: 'agreeableness', text: 'I would rather yield than wound — harmony holds more value than being right.' },
  // Neuroticism (3)
  { id: 13, trait: 'neuroticism', text: 'Beneath the surface, I am often more unsettled than I appear — emotions rise fast and linger long.' },
  { id: 14, trait: 'neuroticism', text: 'Stress touches me deeply; I feel the weight of pressure in ways that are hard to conceal.' },
  { id: 15, trait: 'neuroticism', text: 'My emotional world is vivid and volatile — beauty and fear arrive with equal intensity.' },
];

const traitMeta: Record<BFQuestion['trait'], { label: string; color: string; gradient: string; symbol: string }> = {
  openness: { label: 'Openness', color: '#a855f7', gradient: 'from-purple-500 to-violet-600', symbol: '◇' },
  conscientiousness: { label: 'Conscientiousness', color: '#10b981', gradient: 'from-emerald-500 to-teal-600', symbol: '⬡' },
  extraversion: { label: 'Extraversion', color: '#f59e0b', gradient: 'from-amber-500 to-orange-600', symbol: '◎' },
  agreeableness: { label: 'Agreeableness', color: '#ec4899', gradient: 'from-pink-500 to-rose-600', symbol: '◐' },
  neuroticism: { label: 'Neuroticism', color: '#06b6d4', gradient: 'from-cyan-500 to-sky-600', symbol: '◑' },
};

export default function StepElementalBalance({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [sliderVals, setSliderVals] = useState<Record<number, number>>({});
  const [confirmed, setConfirmed] = useState<Record<number, boolean>>({});
  const [direction, setDirection] = useState(1);

  const q = questions[current];
  const meta = traitMeta[q.trait];
  const progress = (current / questions.length) * 100;
  const currentVal = sliderVals[q.id] ?? 50;
  const handleSlider = (val: number) => {
    setSliderVals(prev => ({ ...prev, [q.id]: val }));
  };

  const confirm = () => {
    setConfirmed(prev => ({ ...prev, [q.id]: true }));
    const newVals = { ...sliderVals, [q.id]: currentVal };

    if (current < questions.length - 1) {
      setDirection(1);
      setTimeout(() => {
        setCurrent(c => c + 1);
        setConfirmed(prev => ({ ...prev }));
      }, 200);
    } else {
      // Calculate trait averages
      const traitSums: Record<string, number[]> = {
        openness: [], conscientiousness: [], extraversion: [], agreeableness: [], neuroticism: [],
      };
      questions.forEach(q => {
        const val = newVals[q.id] ?? 50;
        traitSums[q.trait].push(val);
      });

      const avg = (arr: number[]) =>
        arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 50;

      onComplete({
        openness: avg(traitSums.openness),
        conscientiousness: avg(traitSums.conscientiousness),
        extraversion: avg(traitSums.extraversion),
        agreeableness: avg(traitSums.agreeableness),
        neuroticism: avg(traitSums.neuroticism),
      });
    }
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, scale: d > 0 ? 0.95 : 1.05 }),
    center: { opacity: 1, scale: 1 },
    exit: (d: number) => ({ opacity: 0, scale: d > 0 ? 1.05 : 0.95 }),
  };

  const sliderLabel = (val: number) => {
    if (val <= 10) return 'Barely a whisper';
    if (val <= 25) return 'A faint echo';
    if (val <= 40) return 'Stirring beneath';
    if (val <= 60) return 'Present and real';
    if (val <= 75) return 'Strongly felt';
    if (val <= 90) return 'A defining current';
    return 'The core of my being';
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
          animate={{ rotate: [0, 45, 0, -45, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >◇</motion.div>
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-1">
          Elemental Balance
        </h2>
        <p className="text-white/40 text-xs font-tech uppercase tracking-widest">
          Question {current + 1} of {questions.length} · {meta.label}
        </p>
      </motion.div>

      {/* Progress */}
      <div className="mb-4 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${meta.gradient}`}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Trait tracker */}
      <div className="flex gap-2 mb-6 justify-center flex-wrap">
        {(Object.keys(traitMeta) as BFQuestion['trait'][]).map(trait => {
          const done = questions.filter(q => q.trait === trait && confirmed[q.id]).length;
          const total = questions.filter(q => q.trait === trait).length;
          const tm = traitMeta[trait];
          return (
            <div
              key={trait}
              className={`px-2 py-1 rounded-full text-xs font-tech ${q.trait === trait ? `bg-gradient-to-r ${tm.gradient} text-white` : 'bg-white/5 text-white/30'}`}
            >
              {tm.symbol} {done}/{total}
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
            <div className="mb-2">
              <span className={`text-xs font-tech uppercase tracking-widest`} style={{ color: meta.color }}>
                {meta.symbol} {meta.label}
              </span>
            </div>
            <p className="text-white/90 text-lg font-light leading-relaxed mb-8">
              "{q.text}"
            </p>

            {/* Slider */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-white/30 font-tech mb-3">
                <span>Not me</span>
                <span className="text-white/60 text-sm font-light">{sliderLabel(currentVal)}</span>
                <span>Deeply me</span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={currentVal}
                  onChange={e => handleSlider(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${meta.color} 0%, ${meta.color} ${currentVal}%, rgba(255,255,255,0.1) ${currentVal}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
                <motion.div
                  className="absolute -top-6 text-xs font-tech"
                  style={{ left: `${currentVal}%`, transform: 'translateX(-50%)', color: meta.color }}
                  animate={{ opacity: 1 }}
                >
                  {currentVal}
                </motion.div>
              </div>
            </div>

            <CosmicButton
              size="md"
              onClick={confirm}
              className="w-full"
            >
              Set My Reading →
            </CosmicButton>
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
