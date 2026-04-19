import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CosmicButton from '../ui/CosmicButton';
import GlassCard from '../ui/GlassCard';
import type { ImageUploadData } from '../../types';

interface Props {
  onComplete: (data: ImageUploadData) => void;
}

interface DropZoneProps {
  label: string;
  sublabel: string;
  icon: string;
  preview: string | null;
  dragActive: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onClick: () => void;
  onClear: () => void;
  color: string;
}

function DropZone({
  label, sublabel, icon, preview, dragActive,
  onDrop, onDragOver, onDragLeave, onClick, onClear, color,
}: DropZoneProps) {
  return (
    <motion.div
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden cursor-pointer
        ${dragActive
          ? 'border-opacity-100 bg-white/10 scale-[1.02]'
          : preview
          ? 'border-opacity-50'
          : 'border-white/20 bg-white/3 hover:bg-white/7 hover:border-white/30'
        }`}
      style={dragActive ? { borderColor: color } : preview ? { borderColor: color + '60' } : {}}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      whileHover={{ scale: 1.01 }}
    >
      {preview ? (
        <div className="relative aspect-square">
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
            <div>
              <p className="text-white text-xs font-tech uppercase tracking-widest">{label}</p>
              <p className="text-white/60 text-xs">Imprint captured</p>
            </div>
            <motion.button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-red-500/50 flex items-center justify-center text-white text-xs transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>
          {/* Scan line animation */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 opacity-60"
            style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 p-8 aspect-square">
          <motion.div
            className="text-4xl"
            style={{ color: dragActive ? color : 'rgba(255,255,255,0.2)' }}
            animate={dragActive ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            {icon}
          </motion.div>
          <div className="text-center">
            <p className="text-white/60 text-sm font-tech uppercase tracking-widest">{label}</p>
            <p className="text-white/30 text-xs mt-1 font-light">{sublabel}</p>
          </div>
          <p className="text-white/20 text-xs font-tech">
            {dragActive ? 'Release to upload' : 'Drag & drop or tap'}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function StepImageUpload({ onComplete }: Props) {
  const [palmImage, setPalmImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [palmDrag, setPalmDrag] = useState(false);
  const [faceDrag, setFaceDrag] = useState(false);

  const palmRef = useRef<HTMLInputElement>(null);
  const faceRef = useRef<HTMLInputElement>(null);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFile = useCallback(async (file: File, type: 'palm' | 'face') => {
    if (!file.type.startsWith('image/')) return;
    try {
      const b64 = await toBase64(file);
      if (type === 'palm') setPalmImage(b64);
      else setFaceImage(b64);
    } catch (e) {
      console.error('Upload failed', e);
    }
  }, []);

  const handleDrop = (type: 'palm' | 'face') => (e: React.DragEvent) => {
    e.preventDefault();
    if (type === 'palm') setPalmDrag(false); else setFaceDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file, type);
  };

  const handleInputChange = (type: 'palm' | 'face') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file, type);
  };

  const handleSkip = () => onComplete({});

  const handleSubmit = () =>
    onComplete({
      palmImage: palmImage ?? undefined,
      faceImage: faceImage ?? undefined,
    });

  const hasAny = palmImage || faceImage;

  return (
    <div className="max-w-lg mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <motion.div
          className="text-4xl mb-3"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >⊕</motion.div>
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-teal-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent mb-1">
          Biometric Imprint
        </h2>
        <p className="text-white/40 text-xs font-tech uppercase tracking-widest">
          Optional · Your soul print is complete without this
        </p>
      </motion.div>

      <GlassCard className="mb-4">
        <p className="text-white/60 text-sm font-light leading-relaxed text-center mb-6">
          For those who wish to go deeper — upload a palm image for line analysis and a face image for energetic resonance mapping. These remain entirely local to your session.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Palm */}
          <div>
            <DropZone
              label="Palm"
              sublabel="Open hand, clear light"
              icon="◈"
              preview={palmImage}
              dragActive={palmDrag}
              onDrop={handleDrop('palm')}
              onDragOver={(e) => { e.preventDefault(); setPalmDrag(true); }}
              onDragLeave={() => setPalmDrag(false)}
              onClick={() => palmRef.current?.click()}
              onClear={() => setPalmImage(null)}
              color="#14b8a6"
            />
            <input
              ref={palmRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange('palm')}
            />
          </div>

          {/* Face */}
          <div>
            <DropZone
              label="Face"
              sublabel="Neutral expression, front-facing"
              icon="◉"
              preview={faceImage}
              dragActive={faceDrag}
              onDrop={handleDrop('face')}
              onDragOver={(e) => { e.preventDefault(); setFaceDrag(true); }}
              onDragLeave={() => setFaceDrag(false)}
              onClick={() => faceRef.current?.click()}
              onClear={() => setFaceImage(null)}
              color="#06b6d4"
            />
            <input
              ref={faceRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange('face')}
            />
          </div>
        </div>

        {/* Privacy note */}
        <div className="mb-5 p-3 rounded-xl bg-white/3 border border-white/5 flex items-start gap-2">
          <span className="text-teal-400 text-xs mt-0.5">◎</span>
          <p className="text-white/30 text-xs font-light leading-relaxed">
            Images are converted to base64 and held only in your active session. They are never stored, indexed, or shared.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <AnimatePresence>
            {hasAny && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CosmicButton
                  size="lg"
                  onClick={handleSubmit}
                  className="w-full"
                >
                  Seal My Biometric Imprint →
                </CosmicButton>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleSkip}
            className={`w-full py-3 rounded-xl border font-tech text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer
              ${hasAny
                ? 'border-white/10 text-white/30 hover:text-white/50 bg-transparent'
                : 'border-teal-500/40 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20'
              }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {hasAny ? 'Skip Biometrics' : '✦ Skip This Step — Continue to Report'}
          </motion.button>
        </div>
      </GlassCard>

      {/* Upload status */}
      <AnimatePresence>
        {hasAny && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 text-xs font-tech text-white/40">
              {palmImage && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse inline-block" />
                  Palm captured
                </span>
              )}
              {faceImage && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
                  Face captured
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
