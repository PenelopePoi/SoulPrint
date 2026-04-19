import { motion, AnimatePresence } from 'framer-motion';
import CosmicButton from '../components/ui/CosmicButton';

interface LandingPageProps {
  onBegin: () => void;
  onResume: () => void;
  onArchives: () => void;
  hasExistingSession: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

function CosmicEye() {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: 200, height: 200 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
    >
      {/* Outer rotating rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: 160 + i * 30,
            height: 160 + i * 30,
            borderColor:
              i === 0
                ? 'rgba(124,58,237,0.35)'
                : i === 1
                ? 'rgba(236,72,153,0.2)'
                : 'rgba(6,182,212,0.12)',
            borderStyle: i === 1 ? 'dashed' : 'solid',
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{
            duration: 12 + i * 6,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Eye shape — SVG */}
      <svg width="120" height="80" viewBox="0 0 120 80" className="absolute">
        <defs>
          <radialGradient id="iris-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#7c3aed" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0a0a1a" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="pupil-grad" cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#1a0a2a" />
            <stop offset="100%" stopColor="#000010" />
          </radialGradient>
          <filter id="eye-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Eyelid clip */}
          <clipPath id="eye-clip">
            <path d="M 10 40 Q 60 5 110 40 Q 60 75 10 40 Z" />
          </clipPath>
        </defs>

        {/* Eye outline glow */}
        <path
          d="M 10 40 Q 60 5 110 40 Q 60 75 10 40 Z"
          fill="none"
          stroke="rgba(124,58,237,0.6)"
          strokeWidth="1.5"
          filter="url(#eye-glow)"
        />

        {/* Iris */}
        <circle cx="60" cy="40" r="22" fill="url(#iris-grad)" clipPath="url(#eye-clip)" />

        {/* Iris pattern lines */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={60 + 10 * Math.cos(angle)}
              y1={40 + 10 * Math.sin(angle)}
              x2={60 + 20 * Math.cos(angle)}
              y2={40 + 20 * Math.sin(angle)}
              stroke="rgba(6,182,212,0.35)"
              strokeWidth="0.8"
              clipPath="url(#eye-clip)"
            />
          );
        })}

        {/* Pupil */}
        <motion.circle
          cx="60"
          cy="40"
          r="10"
          fill="url(#pupil-grad)"
          clipPath="url(#eye-clip)"
          animate={{ r: [10, 7, 10, 12, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Pupil highlight */}
        <circle cx="56" cy="36" r="2.5" fill="rgba(255,255,255,0.7)" clipPath="url(#eye-clip)" />

        {/* Limbal ring */}
        <circle
          cx="60"
          cy="40"
          r="22"
          fill="none"
          stroke="rgba(6,182,212,0.5)"
          strokeWidth="1"
          clipPath="url(#eye-clip)"
          filter="url(#eye-glow)"
        />
      </svg>

      {/* Orbital dot */}
      <motion.div
        className="absolute"
        style={{ width: 8, height: 8 }}
        animate={{
          rotate: 360,
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        // Orbit at radius ~90
      >
        <div
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#ec4899',
            boxShadow: '0 0 10px #ec4899, 0 0 20px rgba(236,72,153,0.4)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) translateX(90px)',
          }}
        />
      </motion.div>

      {/* Inner aura */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

export default function LandingPage({ onBegin, onResume, onArchives, hasExistingSession }: LandingPageProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden starfield">
      {/* Deep space gradient backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,58,237,0.08) 0%, rgba(10,10,26,0) 70%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 40% at 80% 20%, rgba(6,182,212,0.05) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 40% at 20% 80%, rgba(236,72,153,0.04) 0%, transparent 60%)',
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyemark symbol top */}
        <motion.div variants={itemVariants}>
          <span
            className="text-xs font-tech tracking-[0.4em] uppercase"
            style={{ color: 'rgba(124,58,237,0.6)' }}
          >
            ✦ &nbsp; Psyche Archive System &nbsp; ✦
          </span>
        </motion.div>

        {/* Main title */}
        <motion.div variants={itemVariants} className="space-y-1">
          <h1
            className="text-7xl md:text-9xl font-display gradient-text leading-none tracking-tight"
            style={{ textShadow: '0 0 80px rgba(124,58,237,0.25)' }}
          >
            SoulPrint
          </h1>
          <motion.div
            className="h-px w-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(236,72,153,0.5), transparent)',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.0, delay: 0.8 }}
          />
        </motion.div>

        {/* Cosmic Eye */}
        <motion.div variants={itemVariants}>
          <CosmicEye />
        </motion.div>

        {/* Subtitle */}
        <motion.div variants={itemVariants} className="space-y-2 max-w-lg">
          <p
            className="text-lg md:text-xl font-body tracking-wide"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            Discover Your Cosmic Psychological Blueprint
          </p>
          <p
            className="text-sm font-body"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            A multi-dimensional journey through MBTI, Enneagram, Big Five, Jungian archetypes,
            and shadow work — synthesized into a single, living document of your psyche.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
          <CosmicButton onClick={onBegin} variant="primary" size="lg">
            ✦ Begin Ritual
          </CosmicButton>

          <AnimatePresence>
            {hasExistingSession && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <CosmicButton onClick={onResume} variant="secondary" size="lg">
                  ◌ Resume Session
                </CosmicButton>
              </motion.div>
            )}
          </AnimatePresence>

          <CosmicButton onClick={onArchives} variant="ghost" size="lg">
            ◈ View Archives
          </CosmicButton>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 w-full max-w-sm"
        >
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-white/20 text-xs">◆</span>
          <div className="flex-1 h-px bg-white/5" />
        </motion.div>

        {/* Feature pills */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2">
          {[
            'MBTI',
            'Enneagram',
            'Big Five',
            'DISC',
            'Jungian',
            'Shadow Work',
            'Projective',
          ].map((tag, i) => (
            <motion.span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-tech tracking-wider glass"
              style={{ color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 + i * 0.06 }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="text-xs font-mono tracking-widest mt-4"
          style={{ color: 'rgba(255,255,255,0.2)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.4 }}
        >
          Powered by AI Personality Synthesis
        </motion.p>
      </motion.div>
    </div>
  );
}
