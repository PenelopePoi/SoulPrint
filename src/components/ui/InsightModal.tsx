import { motion, AnimatePresence } from 'framer-motion';
import CosmicButton from './CosmicButton';

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: string;
  testName: string;
}

export default function InsightModal({ isOpen, onClose, insight, testName }: InsightModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-strong rounded-3xl p-8 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <motion.div
                className="text-4xl mb-3"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔮
              </motion.div>
              <h3 className="font-display text-xl gradient-text mb-1">
                Cosmic Insight
              </h3>
              <p className="text-white/40 text-sm font-tech">{testName} Analysis</p>
            </div>

            <div className="text-white/75 leading-relaxed text-center font-body mb-6">
              {insight || (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-cosmic-purple"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-white/40">Channeling insight...</span>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <CosmicButton onClick={onClose} variant="secondary" size="sm">
                Continue Journey
              </CosmicButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
