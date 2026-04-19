import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CosmicButton from '../ui/CosmicButton';
import GlassCard from '../ui/GlassCard';
import type { NarrativeArcResult } from '../../types';

interface Props {
  onComplete: (result: NarrativeArcResult) => void;
}

interface Scene {
  id: string;
  title: string;
  description: string;
  atmosphere: string;
}

const scenes: Scene[] = [
  {
    id: 'scene-1',
    title: 'The Threshold',
    description:
      'A figure stands at the edge of a vast field as night falls. Behind them, the warm glow of a place they have always known. Before them, an unfamiliar road that vanishes into darkness. Their hand rests on the gate — open. The air is still. No one else is present.',
    atmosphere: 'Liminal · Ambivalent · Open',
  },
  {
    id: 'scene-2',
    title: 'The Reunion',
    description:
      'Two people face each other in a sparse room. One stands near the window with arms crossed; the other sits with hands folded in their lap. Between them, a small object rests on the table — its meaning unclear. They have not spoken yet. The silence has been going on for some time.',
    atmosphere: 'Tension · History · Unresolved',
  },
  {
    id: 'scene-3',
    title: 'The Summit',
    description:
      'A lone figure sits atop a great height — mountain, tower, or rooftop. They gaze outward at a horizon that stretches endlessly in both directions. In their hands, an object they have been carrying for a very long time. Below, the world continues without noticing them.',
    atmosphere: 'Solitude · Perspective · Weight',
  },
  {
    id: 'scene-4',
    title: 'The Hidden Door',
    description:
      'In an otherwise ordinary room, someone discovers a door that should not be there. It is slightly ajar, revealing only darkness beyond. The rest of the room is familiar — perhaps a room from childhood, or one they visit in dreams. The door hums faintly. Others are nearby but unaware.',
    atmosphere: 'Discovery · Forbidden · Familiar-strange',
  },
];

// Theme keywords for auto-detection
const themeKeywords: Record<string, string[]> = {
  'achievement': ['success', 'won', 'accomplished', 'achieved', 'goal', 'triumph', 'victory'],
  'loss': ['lost', 'died', 'gone', 'never came back', 'left', 'grief', 'mourning', 'empty'],
  'connection': ['together', 'held', 'loved', 'joined', 'reached', 'embraced', 'friend', 'bond'],
  'isolation': ['alone', 'no one', 'silent', 'abandoned', 'forgotten', 'solitary', 'empty'],
  'transformation': ['changed', 'became', 'transformed', 'different', 'reborn', 'new', 'shifted'],
  'conflict': ['fought', 'argued', 'struggled', 'battle', 'opposed', 'against', 'resistance'],
  'escape': ['ran', 'fled', 'escaped', 'left it all', 'freedom', 'break free', 'away'],
  'nurturing': ['helped', 'cared', 'protected', 'healed', 'guided', 'saved', 'supported'],
  'curiosity': ['explored', 'discovered', 'wondered', 'opened', 'uncovered', 'found', 'searched'],
  'fear': ['afraid', 'terror', 'dread', 'feared', 'horror', 'danger', 'unsafe'],
  'power': ['control', 'command', 'led', 'ruled', 'power', 'decided', 'authority'],
  'resignation': ['gave up', 'accepted', 'surrendered', 'let go', 'stopped trying', 'inevitable'],
};

function detectThemes(story: string): string[] {
  const lower = story.toLowerCase();
  const found: string[] = [];
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(kw => lower.includes(kw))) {
      found.push(theme);
    }
  }
  return found.length > 0 ? found : ['open-ended'];
}

export default function StepNarrativeArc({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [stories, setStories] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);

  const scene = scenes[current];
  const progress = (current / scenes.length) * 100;
  const currentStory = stories[scene.id] ?? '';
  const canAdvance = currentStory.trim().length > 20;

  const advance = () => {
    if (!canAdvance) return;
    if (current < scenes.length - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    } else {
      onComplete({
        stories: scenes.map(s => ({
          imageId: s.id,
          story: stories[s.id] ?? '',
          themes: detectThemes(stories[s.id] ?? ''),
        })),
      });
    }
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
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
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        >◌</motion.div>
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-rose-400 via-pink-300 to-fuchsia-400 bg-clip-text text-transparent mb-1">
          Narrative Arc
        </h2>
        <p className="text-white/40 text-xs font-tech uppercase tracking-widest">
          Scene {current + 1} of {scenes.length} · Let the story find its own shape
        </p>
      </motion.div>

      {/* Progress */}
      <div className="mb-6 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-600"
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
            {/* Scene title and atmosphere */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-white/90 font-display font-semibold text-lg">{scene.title}</h3>
                <p className="text-white/30 text-xs font-tech mt-0.5">{scene.atmosphere}</p>
              </div>
              <span className="text-3xl text-white/20">◌</span>
            </div>

            {/* Scene description */}
            <div className="mb-5 p-4 rounded-xl bg-white/3 border border-white/5">
              <p className="text-white/60 text-sm font-light leading-relaxed italic">
                {scene.description}
              </p>
            </div>

            {/* Story input */}
            <div className="mb-4">
              <label className="block text-white/40 text-xs font-tech uppercase tracking-widest mb-2">
                What happens next? Write the story this scene contains...
              </label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rose-400/40 focus:bg-white/8 transition-all duration-300 font-light text-sm leading-relaxed resize-none"
                rows={5}
                placeholder="Let the narrative unfold naturally. There is no right answer — only your truth..."
                value={currentStory}
                onChange={e => setStories(prev => ({ ...prev, [scene.id]: e.target.value }))}
              />
              <div className="flex justify-between mt-1">
                <span className="text-white/20 text-xs font-tech">
                  {currentStory.length > 0 ? `${currentStory.split(/\s+/).filter(Boolean).length} words` : 'Begin writing...'}
                </span>
                {canAdvance && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-rose-400/60 text-xs font-tech"
                  >
                    Themes detected: {detectThemes(currentStory).slice(0, 3).join(', ')}
                  </motion.span>
                )}
              </div>
            </div>

            <CosmicButton
              size="md"
              disabled={!canAdvance}
              onClick={advance}
              className="w-full"
            >
              {current < scenes.length - 1 ? 'Enter the Next Scene →' : 'Complete My Arc →'}
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
