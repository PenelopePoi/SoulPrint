import { useState } from 'react';
import { motion } from 'framer-motion';
import CosmicButton from '../ui/CosmicButton';
import GlassCard from '../ui/GlassCard';
import type { PersonalData } from '../../types';

interface Props {
  onComplete: (data: PersonalData) => void;
}

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cosmic-purple/60 focus:bg-white/10 transition-all duration-300 font-light tracking-wide';

const labelClass = 'block text-white/60 text-xs font-tech uppercase tracking-widest mb-2';

export default function StepPersonalData({ onComplete }: Props) {
  const [form, setForm] = useState<PersonalData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: '',
    pronouns: '',
  });

  const set = (key: keyof PersonalData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const canSubmit = form.name.trim() && form.birthDate && form.birthPlace.trim();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <motion.div
          className="text-5xl mb-4"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          ✦
        </motion.div>
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent mb-2">
          Astral Coordinates
        </h2>
        <p className="text-white/50 text-sm font-light">
          The cosmos recorded your arrival. Let us locate it.
        </p>
      </motion.div>

      <GlassCard>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          <motion.div variants={fieldVariants}>
            <label className={labelClass}>Your Name</label>
            <input
              className={inputClass}
              placeholder="What do they call you in this realm?"
              value={form.name}
              onChange={set('name')}
            />
          </motion.div>

          <motion.div variants={fieldVariants} className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Birth Date</label>
              <input
                type="date"
                className={inputClass}
                value={form.birthDate}
                onChange={set('birthDate')}
              />
            </div>
            <div>
              <label className={labelClass}>Birth Time</label>
              <input
                type="time"
                className={`${inputClass} [color-scheme:dark]`}
                value={form.birthTime}
                onChange={set('birthTime')}
                placeholder="Optional"
              />
            </div>
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className={labelClass}>Birth Place</label>
            <input
              className={inputClass}
              placeholder="City, Country — where your star fell to earth"
              value={form.birthPlace}
              onChange={set('birthPlace')}
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className={labelClass}>Gender Identity</label>
            <select
              className={inputClass}
              value={form.gender}
              onChange={set('gender')}
            >
              <option value="" className="bg-gray-900">Select your cosmic expression</option>
              <option value="man" className="bg-gray-900">Man</option>
              <option value="woman" className="bg-gray-900">Woman</option>
              <option value="non-binary" className="bg-gray-900">Non-Binary</option>
              <option value="genderfluid" className="bg-gray-900">Genderfluid</option>
              <option value="agender" className="bg-gray-900">Agender</option>
              <option value="prefer-not-to-say" className="bg-gray-900">Prefer Not to Say</option>
              <option value="other" className="bg-gray-900">Other</option>
            </select>
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className={labelClass}>Pronouns</label>
            <select
              className={inputClass}
              value={form.pronouns}
              onChange={set('pronouns')}
            >
              <option value="" className="bg-gray-900">How shall we speak of you?</option>
              <option value="she/her" className="bg-gray-900">she / her</option>
              <option value="he/him" className="bg-gray-900">he / him</option>
              <option value="they/them" className="bg-gray-900">they / them</option>
              <option value="she/they" className="bg-gray-900">she / they</option>
              <option value="he/they" className="bg-gray-900">he / they</option>
              <option value="any" className="bg-gray-900">any / all</option>
              <option value="prefer-not-to-say" className="bg-gray-900">Prefer Not to Say</option>
            </select>
          </motion.div>

          <motion.div variants={fieldVariants} className="pt-2">
            <CosmicButton
              size="lg"
              disabled={!canSubmit}
              onClick={() => canSubmit && onComplete(form)}
              className="w-full"
            >
              Seal My Coordinates →
            </CosmicButton>
          </motion.div>
        </motion.div>
      </GlassCard>
    </div>
  );
}
