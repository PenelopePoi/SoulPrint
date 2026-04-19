import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CosmicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export default function CosmicButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}: CosmicButtonProps) {
  const baseStyles = 'relative font-tech font-semibold tracking-wider uppercase transition-all duration-300 rounded-xl overflow-hidden';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white glow-purple hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]',
    secondary: 'glass text-white/80 hover:text-white hover:border-cosmic-purple/50',
    ghost: 'bg-transparent text-white/60 hover:text-white hover:bg-white/5',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
