import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeonBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

const NeonBorder: React.FC<NeonBorderProps> = ({ 
  children, 
  className,
  color = '#8B5CF6' // Default purple color
}) => {
  // Pulse animation for the neon border
  const pulseVariants = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    }
  };

  return (
    <div className={cn("relative", className)}>
      {children}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none z-[-1]"
        style={{
          border: `2px solid ${color}`,
          boxShadow: `0 0 8px ${color}, inset 0 0 8px ${color}`,
        }}
        variants={pulseVariants}
        initial="initial"
        animate="animate"
      />
    </div>
  );
};

export default NeonBorder;
