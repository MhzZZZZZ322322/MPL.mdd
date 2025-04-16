import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlitchProps {
  children: React.ReactNode;
  className?: string;
}

const Glitch: React.FC<GlitchProps> = ({ children, className }) => {
  // Glitch animation variant
  const glitchVariants = {
    initial: { transform: 'translate(0)' },
    animate: {
      transform: [
        'translate(0)', 
        'translate(-2px, 2px)', 
        'translate(2px, -2px)', 
        'translate(0)'
      ],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: 'loop' as const,
        repeatDelay: 2.7
      }
    }
  };

  return (
    <motion.div
      className={cn("relative", className)}
      variants={glitchVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

export default Glitch;
