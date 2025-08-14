import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StatItem } from '@/components/ui/counter-stats';
import { Trophy, Users, Calendar, Eye, Award, Gamepad2 } from 'lucide-react';

interface StatsProps {
  className?: string;
}

const Stats: React.FC<StatsProps> = ({ className }) => {
  return (
    <section id="stats" className={cn("py-20 bg-darkGray border-t border-b border-primary/10", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-rajdhani" data-aos="fade-up">
            <span className="text-primary">#</span>MPL în cifre
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Comunitatea Moldova Pro League continuă să crească și să aducă împreună cei mai pasionați jucători din Moldova.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div data-aos="fade-up" data-aos-delay="150" className="bg-darkBg rounded-xl overflow-hidden border border-primary/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300">
            <StatItem 
              value={538250} 
              label="Impresii în social media"
              duration={2500}
              icon={<Eye size={28} />}
            />
          </div>
          
          <div data-aos="fade-up" data-aos-delay="200" className="bg-darkBg rounded-xl overflow-hidden border border-primary/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300">
            <StatItem 
              value={128}
              label="Echipe participante"
              duration={1500}
              icon={<Users size={28} />}
            />
          </div>
          
          <div data-aos="fade-up" data-aos-delay="250" className="bg-darkBg rounded-xl overflow-hidden border border-primary/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300">
            <StatItem 
              value={640} 
              label="Jucători"
              duration={1800}
              icon={<Gamepad2 size={28} />}
            />
          </div>
          
          <div data-aos="fade-up" data-aos-delay="300" className="bg-darkBg rounded-xl overflow-hidden border border-primary/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300">
            <StatItem 
              value={18} 
              label="Premii oferite"
              duration={1200}
              icon={<Trophy size={28} />}
            />
          </div>
          
          <div data-aos="fade-up" data-aos-delay="350" className="bg-darkBg rounded-xl overflow-hidden border border-primary/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300">
            <StatItem 
              value={30} 
              label="Zile de competiție"
              duration={1300}
              icon={<Calendar size={28} />}
            />
          </div>
          
          <div data-aos="fade-up" data-aos-delay="400" className="bg-darkBg rounded-xl overflow-hidden border border-primary/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300">
            <StatItem 
              value={3} 
              label="Ace Bonus-uri" 
              duration={800}
              icon={<Award size={28} />}
            />
          </div>
        </div>
        
        <div className="mt-16 bg-darkBg rounded-xl p-6 border border-primary/10" data-aos="fade-up" data-aos-delay="450">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 font-rajdhani text-white">Despre turneul HATOR CS2 League Moldova</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Cel mai mare turneu online de Counter-Strike 2 din Moldova</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Format 5v5 clasic cu faze de grupă și eliminatorii</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Participare gratuită pentru toate echipele din Moldova</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Premii pentru primele 3 locuri și bonus pentru cele mai spectaculoase momente</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 font-rajdhani text-white">Beneficii pentru participanți</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Coduri promoționale HATOR cu reduceri exclusive</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Transmisiuni live pe TikTok, YouTube și Twitch</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Intervuri exclusive și evidențierea celor mai bune momente</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Comunitate activă pe Discord cu camere vocale dedicate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;