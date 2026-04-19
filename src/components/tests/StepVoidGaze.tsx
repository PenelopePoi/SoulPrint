import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import CosmicButton from '../ui/CosmicButton';
import type { VoidGazeResult } from '../../types';

interface Props {
  onComplete: (result: VoidGazeResult) => void;
}

interface InkImage {
  id: string;
  title: string;
  description: string;
  pattern: string; // ASCII-style or text art representation
}

const images: InkImage[] = [
  {
    id: 'void-1',
    title: 'The Bilateral Bloom',
    description:
      'Two mirror shapes rise from a shared center — symmetrical yet each carrying its own weight. Dark pools gather in the lower regions while tendrils reach upward and outward, thinning at their tips. The center pulses with ambiguity.',
    pattern: '   ∿∿◗ ◖∿∿\n  ◜●◜ ◝●◝\n ◜◜ ◌ ◌ ◝◝\n  ◟◟ ▾ ◞◞\n   ◟ ◈ ◞',
  },
  {
    id: 'void-2',
    title: 'The Ascending Fracture',
    description:
      'A central dark mass, jagged along its edges, sends two projections upward like wings or outstretched arms. Below, smaller fragments scatter like fallen pieces. The whole image seems arrested mid-transformation.',
    pattern: '  ╱◤▓◥╲\n ╱ ▓▓▓ ╲\n◤ ◣▓▓▓◢ ◥\n  ◣ ▓ ◢\n ╲ ◈ ╱\n  ∙ ∙ ∙',
  },
  {
    id: 'void-3',
    title: 'The Hollow Vessel',
    description:
      'A wide, rounded shape — like a chalice or an open form — dominates the center. Its interior is dark but not opaque; light seems to enter from somewhere unseen. The edges are soft and undefined, as though the form is still deciding what it is.',
    pattern: ' ◜◜◜◜◜◜◜◝\n◜ ░░░░░░░ ◝\n◜  ▒▒▒▒▒  ◝\n ◝ ▓▓▓▓▓ ◜\n  ◝◝ ▓▓ ◜◜\n    ◝◝◜◜\n      ◈',
  },
  {
    id: 'void-4',
    title: 'The Twin Faces',
    description:
      'Two profiles seem to emerge from the edges — or perhaps it is one face seen twice. Between them, a shared space that could be a doorway, a vase, or simply the absence between two things that have not yet touched.',
    pattern: '◤▓       ▓◥\n ▓◤     ◥▓\n  ▓◤   ◥▓\n   ◤◈◈◈◥\n  ▓◟   ◞▓\n ▓◟     ◞▓\n◣▓       ▓◢',
  },
  {
    id: 'void-5',
    title: 'The Radiant Collapse',
    description:
      'A central point from which lines radiate outward — or perhaps converge inward. It is unclear whether this is an explosion or an implosion, a birth or a gathering. The surrounding space is flecked with smaller marks that may be debris or stars.',
    pattern: '∙  ╲ ↑ ╱  ∙\n  ∙ ╲|╱ ∙\n← ——◉—— →\n  ∙ ╱|╲ ∙\n∙  ╱ ↓ ╲  ∙\n  · · · · ·',
  },
];

const emotionalTones = [
  'calm', 'anxious', 'curious', 'fearful', 'joyful', 'melancholy', 'energized', 'neutral',
];

const toneColors: Record<string, string> = {
  calm: '#06b6d4',
  anxious: '#f59e0b',
  curious: '#a855f7',
  fearful: '#6366f1',
  joyful: '#ec4899',
  melancholy: '#3b82f6',
  energized: '#10b981',
  neutral: '#6b7280',
};

export default function StepVoidGaze({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [tones, setTones] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);

  const img = images[current];
  const progress = (current / images.length) * 100;
  const currentResponse = responses[img.id] ?? '';
  const currentTone = tones[img.id] ?? '';
  const canAdvance = currentResponse.trim().length > 3 && currentTone;

  const advance = () => {
    if (!canAdvance) return;
    if (current < images.length - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    } else {
      onComplete({
        responses: images.map(img => ({
          imageId: img.id,
          response: responses[img.id] ?? '',
          emotionalTone: tones[img.id] ?? 'neutral',
        })),
      });
    }
  };

  const variants = {
    enter: (_d: number) => ({ opacity: 0, scale: 0.97 }),
    center: { opacity: 1, scale: 1 },
    exit: (_d: number) => ({ opacity: 0, scale: 1.02 }),
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
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >◐</motion.div>
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent mb-1">
          Void Gaze
        </h2>
        <p className="text-white/40 text-xs font-tech uppercase tracking-widest">
          Form {current + 1} of {images.length} · Let the pattern speak through you
        </p>
      </motion.div>

      {/* Progress */}
      <div className="mb-6 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
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
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <GlassCard>
            {/* Pattern visualization */}
            <div className="mb-4 p-4 rounded-xl bg-white/3 border border-white/5 text-center">
              <p className="text-violet-300/60 text-xs font-tech uppercase tracking-widest mb-3">
                {img.title}
              </p>
              <pre className="text-white/20 text-sm font-mono leading-relaxed select-none">
                {img.pattern}
              </pre>
            </div>

            {/* Description */}
            <p className="text-white/50 text-sm font-light leading-relaxed italic mb-6">
              {img.description}
            </p>

            {/* Response */}
            <div className="mb-5">
              <label className="block text-white/40 text-xs font-tech uppercase tracking-widest mb-2">
                What do you see? What does this pattern evoke?
              </label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-400/40 focus:bg-white/8 transition-all duration-300 font-light text-sm leading-relaxed resize-none"
                rows={3}
                placeholder="Describe what emerges from the void for you..."
                value={currentResponse}
                onChange={e => setResponses(prev => ({ ...prev, [img.id]: e.target.value }))}
              />
            </div>

            {/* Emotional tone */}
            <div className="mb-6">
              <label className="block text-white/40 text-xs font-tech uppercase tracking-widest mb-3">
                The emotional current this stirs in you
              </label>
              <div className="flex flex-wrap gap-2">
                {emotionalTones.map(tone => (
                  <motion.button
                    key={tone}
                    onClick={() => setTones(prev => ({ ...prev, [img.id]: tone }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-tech capitalize transition-all duration-200 cursor-pointer border
                      ${currentTone === tone
                        ? 'text-white border-transparent'
                        : 'bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:bg-white/10'
                      }`}
                    style={currentTone === tone ? {
                      background: toneColors[tone] + '40',
                      borderColor: toneColors[tone] + '80',
                      color: toneColors[tone],
                    } : {}}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tone}
                  </motion.button>
                ))}
              </div>
            </div>

            <CosmicButton
              size="md"
              disabled={!canAdvance}
              onClick={advance}
              className="w-full"
            >
              {current < images.length - 1 ? 'Gaze Deeper →' : 'Seal My Visions →'}
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
