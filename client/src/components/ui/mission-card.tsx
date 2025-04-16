import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MissionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor?: string;
}

const MissionCard: React.FC<MissionCardProps> = ({ 
  icon, 
  title, 
  description,
  iconColor = "text-secondary"
}) => {
  return (
    <motion.div 
      className="bg-darkGray/50 border border-primary/20 p-6 rounded-lg hover:bg-darkGray transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className={cn("text-3xl mb-4 flex justify-center", iconColor)}>
        {icon}
      </div>
      <h4 className="font-rajdhani text-xl text-white mb-2 text-center">{title}</h4>
      <p className="text-center">{description}</p>
    </motion.div>
  );
};

export default MissionCard;
