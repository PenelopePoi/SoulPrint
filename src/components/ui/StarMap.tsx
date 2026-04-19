import { motion, AnimatePresence } from 'framer-motion';
import { STEP_CONFIGS, AppStep } from '../../types';
import { useSession } from '../../contexts/SessionContext';

interface StarMapProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (step: AppStep) => void;
  currentStep: AppStep;
}

export default function StarMap({ isOpen, onClose, onNavigate, currentStep }: StarMapProps) {
  const { session } = useSession();

  const positions = [
    { x: 50, y: 15 },
    { x: 20, y: 28 },
    { x: 80, y: 28 },
    { x: 10, y: 48 },
    { x: 50, y: 42 },
    { x: 90, y: 48 },
    { x: 25, y: 65 },
    { x: 75, y: 65 },
    { x: 15, y: 82 },
    { x: 50, y: 78 },
    { x: 85, y: 82 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-2xl h-[80vh] glass-strong rounded-3xl p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl gradient-text text-center mb-4">
              Star Map Navigation
            </h2>
            <p className="text-white/40 text-center text-sm mb-8 font-body">
              Click any constellation to navigate
            </p>

            <div className="relative w-full h-[calc(100%-100px)]">
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {positions.map((pos, i) => {
                  if (i === 0) return null;
                  const prev = positions[i - 1];
                  return (
                    <line
                      key={i}
                      x1={`${prev.x}%`}
                      y1={`${prev.y}%`}
                      x2={`${pos.x}%`}
                      y2={`${pos.y}%`}
                      stroke="rgba(124, 58, 237, 0.15)"
                      strokeWidth="0.3"
                    />
                  );
                })}
              </svg>

              {STEP_CONFIGS.map((step, i) => {
                const pos = positions[i];
                const isCompleted = session.completedSteps.includes(step.id);
                const isCurrent = currentStep === step.id;

                return (
                  <motion.button
                    key={step.id}
                    className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onNavigate(step.id);
                      onClose();
                    }}
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all
                        ${isCurrent ? 'border-cosmic-pink bg-cosmic-pink/20 shadow-[0_0_20px_rgba(236,72,153,0.4)]' : ''}
                        ${isCompleted && !isCurrent ? 'border-cosmic-emerald bg-cosmic-emerald/10' : ''}
                        ${!isCompleted && !isCurrent ? 'border-white/10 bg-white/5' : ''}
                      `}
                      animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {step.icon}
                    </motion.div>
                    <span className="text-[10px] font-tech text-white/50 group-hover:text-white/80 whitespace-nowrap">
                      {step.subtitle}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
