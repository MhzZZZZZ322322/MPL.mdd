import React from 'react';
import CounterStats from '@/components/ui/counter-stats';
import { Trophy, Users, Calendar, Monitor } from 'lucide-react';

const Stats: React.FC = () => {
  const statsItems = [
    {
      value: 25,
      label: 'Turnee Organizate',
      icon: <Trophy className="h-8 w-8" />,
      suffix: '+',
      delay: 0,
    },
    {
      value: 2500,
      label: 'Jucători Înregistrați',
      icon: <Users className="h-8 w-8" />,
      suffix: '+',
      delay: 200,
    },
    {
      value: 750,
      label: 'Meciuri Jucate',
      icon: <Calendar className="h-8 w-8" />,
      suffix: '+',
      delay: 400,
    },
    {
      value: 150000,
      label: 'Vizualizări pe Twitch',
      icon: <Monitor className="h-8 w-8" />,
      suffix: '+',
      delay: 600,
    },
  ];

  return (
    <section id="stats" className="relative py-8 bg-black">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-50"></div>
      <CounterStats
        items={statsItems}
        title="Moldova Pro League în Cifre"
        subtitle="Comunitatea noastră crește în fiecare zi, alături de pasiunea pentru gaming competitiv în Moldova"
        className="relative z-10"
      />
    </section>
  );
};

export default Stats;