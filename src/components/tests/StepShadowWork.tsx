import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CosmicButton from '../ui/CosmicButton';
import GlassCard from '../ui/GlassCard';
import type { ShadowWorkResult } from '../../types';

interface Props {
  onComplete: (result: ShadowWorkResult) => void;
}

const COMPLETION_PROMPTS = [
  { key: 'disliked_trait', label: 'The trait I dislike most in others is...' },
  { key: 'when_angry', label: 'When I am angry, I...' },
  { key: 'vulnerable_when', label: 'I feel most vulnerable when...' },
  { key: 'unknown_self', label: 'People do not know that I...' },
  { key: 'biggest_fear', label: 'My biggest fear about myself is...' },
];

const TRIGGER_OPTIONS = [
  {
    category: 'Relational Triggers',
    options: [
      'Being ignored or overlooked',
      'Feeling controlled or micromanaged',
      'Witnessing dishonesty',
      'Feeling abandoned or left out',
      'Being criticized publicly',
      'Feeling unappreciated',
      'Others receiving what I deserve',
      'Being misunderstood',
    ],
  },
  {
    category: 'Internal Triggers',
    options: [
      'Making a mistake',
      'Feeling uncertain or out of control',
      'Being seen as weak',
      'Failing to meet my own standards',
      'Feeling trapped or constrained',
      'Sitting with difficult emotions',
      'Not being enough',
      'Success (fear of it)',
    ],
  },
  {
    category: 'Existential Triggers',
    options: [
      'Confronting my mortality',
      'Questions about meaning and purpose',
      'Feeling powerless in large systems',
      'The passage of time',
      'Witnessing suffering I cannot fix',
      'Uncertainty about the future',
      'Being fundamentally alone',
      'The gap between who I am and who I want to be',
    ],
  },
];

const PHASES = ['completion', 'triggers', 'integration'] as const;
type Phase = typeof PHASES[number];

export default function StepShadowWork({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('completion');
  const [promptIndex, setPromptIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [triggerCat, setTriggerCat] = useState(0);
  const [integrationLevel, setIntegrationLevel] = useState(50);
  const [direction, setDirection] = useState(1);

  const currentPrompt = COMPLETION_PROMPTS[promptIndex];
  const currentResponse = responses[currentPrompt?.key] ?? '';
  const canAdvancePrompt = currentResponse.trim().length > 5;

  const advancePrompt = () => {
    if (promptIndex < COMPLETION_PROMPTS.length - 1) {
      setDirection(1);
      setPromptIndex(p => p + 1);
    } else {
      setPhase('triggers');
    }
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const advanceTriggers = () => {
    if (triggerCat < TRIGGER_OPTIONS.length - 1) {
      setTriggerCat(c => c + 1);
    } else {
      setPhase('integration');
    }
  };

  const complete = () => {
    const repressedTraits = responses.disliked_trait
      ? [responses.disliked_trait.split(' ').slice(0, 5).join(' ')]
      : [];

    onComplete({
      repressedTraits,
      triggerPatterns: selectedTriggers,
      integrationLevel,
      responses,
    });
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 30 : -30 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -30 : 30 }),
  };

  const integrationLabel = (val: number) => {
    if (val <= 10) return 'The shadow rules unexamined';
    if (val <= 25) return 'Dimly aware of hidden depths';
    if (val <= 45) return 'Beginning to look inward';
    if (val <= 60) return 'Actively in dialogue with shadow';
    if (val <= 75) return 'Shadow is a known companion';
    if (val <= 90) return 'Integrated and working consciously';
    return 'Shadow alchemized into gift';
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
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >◑</motion.div>
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-violet-400 bg-clip-text text-transparent mb-1">
          Shadow Integration
        </h2>
        <p className="text-white/40 text-xs font-tech uppercase tracking-widest">
          {phase === 'completion' && `Sentence ${promptIndex + 1} of ${COMPLETION_PROMPTS.length} · Completion`}
          {phase === 'triggers' && `Triggers · Category ${triggerCat + 1} of ${TRIGGER_OPTIONS.length}`}
          {phase === 'integration' && 'Integration Assessment'}
        </p>
      </motion.div>

      {/* Phase progress */}
      <div className="flex gap-2 mb-6 justify-center">
        {PHASES.map((p, i) => (
          <div
            key={p}
            className={`px-3 py-1 rounded-full text-xs font-tech capitalize transition-all ${phase === p ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40' : PHASES.indexOf(phase) > i ? 'bg-white/10 text-white/50' : 'bg-white/5 text-white/20'}`}
          >
            {p}
          </div>
        ))}
      </div>

      {/* Sentence Completion Phase */}
      {phase === 'completion' && (
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={promptIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <GlassCard>
              <div className="mb-5">
                <p className="text-white/40 text-xs font-tech uppercase tracking-widest mb-3">
                  Complete this sentence without thinking too long
                </p>
                <p className="text-indigo-300 text-lg font-display font-semibold leading-relaxed mb-4">
                  {currentPrompt.label}
                </p>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-indigo-400/40 transition-all duration-300 font-light text-sm leading-relaxed resize-none"
                  rows={3}
                  placeholder="Let the first true thing rise to the surface..."
                  value={currentResponse}
                  onChange={e => setResponses(prev => ({ ...prev, [currentPrompt.key]: e.target.value }))}
                />
              </div>

              <CosmicButton
                size="md"
                disabled={!canAdvancePrompt}
                onClick={advancePrompt}
                className="w-full"
              >
                {promptIndex < COMPLETION_PROMPTS.length - 1 ? 'Continue Descending →' : 'Enter the Trigger Mapping →'}
              </CosmicButton>
            </GlassCard>

            {promptIndex > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => { setDirection(-1); setPromptIndex(p => p - 1); }}
                  className="text-white/30 hover:text-white/60 text-xs font-tech uppercase tracking-widest transition-colors cursor-pointer"
                >
                  ← Return
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Trigger Mapping Phase */}
      {phase === 'triggers' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={triggerCat}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard>
              <p className="text-white/40 text-xs font-tech uppercase tracking-widest mb-1">
                Select all that activate your shadow
              </p>
              <h3 className="text-indigo-300 font-display font-semibold text-base mb-5">
                {TRIGGER_OPTIONS[triggerCat].category}
              </h3>

              <div className="flex flex-wrap gap-2 mb-6">
                {TRIGGER_OPTIONS[triggerCat].options.map(opt => (
                  <motion.button
                    key={opt}
                    onClick={() => toggleTrigger(opt)}
                    className={`px-3 py-2 rounded-xl text-xs font-light border transition-all duration-200 cursor-pointer text-left
                      ${selectedTriggers.includes(opt)
                        ? 'border-indigo-400/60 bg-indigo-500/20 text-indigo-200'
                        : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {selectedTriggers.includes(opt) ? '✓ ' : ''}{opt}
                  </motion.button>
                ))}
              </div>

              <p className="text-white/20 text-xs font-tech mb-4">
                {selectedTriggers.length} trigger{selectedTriggers.length !== 1 ? 's' : ''} identified
              </p>

              <CosmicButton
                size="md"
                onClick={advanceTriggers}
                className="w-full"
              >
                {triggerCat < TRIGGER_OPTIONS.length - 1 ? 'Next Category →' : 'Measure Integration →'}
              </CosmicButton>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Integration Phase */}
      {phase === 'integration' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard>
            <p className="text-white/40 text-xs font-tech uppercase tracking-widest mb-2">
              Where are you in the process of meeting your shadow?
            </p>
            <p className="text-indigo-300 text-lg font-display font-semibold mb-6">
              Shadow Integration Level
            </p>

            <div className="mb-8">
              <div className="flex justify-between text-xs text-white/30 font-tech mb-3">
                <span>Unconscious</span>
                <span className="text-white/70 text-sm font-light text-center">{integrationLabel(integrationLevel)}</span>
                <span>Integrated</span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={integrationLevel}
                onChange={e => setIntegrationLevel(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6366f1 0%, #a855f7 ${integrationLevel}%, rgba(255,255,255,0.1) ${integrationLevel}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />

              <div className="mt-3 text-center">
                <span className="text-2xl font-bold text-indigo-400">{integrationLevel}</span>
                <span className="text-white/30 text-sm font-tech"> / 100</span>
              </div>
            </div>

            {/* Summary preview */}
            <div className="mb-6 p-3 rounded-xl bg-white/3 border border-white/5">
              <p className="text-white/30 text-xs font-tech mb-2">Shadow Profile Summary</p>
              <p className="text-white/50 text-xs leading-relaxed">
                {selectedTriggers.length} trigger patterns identified across relational, internal, and existential domains.
                Integration resonance: {integrationLabel(integrationLevel).toLowerCase()}.
              </p>
            </div>

            <CosmicButton size="md" onClick={complete} className="w-full">
              Seal My Shadow Work →
            </CosmicButton>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
