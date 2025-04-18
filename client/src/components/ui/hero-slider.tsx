import { useEffect, useState } from 'react';
import { Button } from './button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import CountdownTimer from './countdown-timer';

interface HeroContent {
  image: string;
  title: string;
  subtitle: string;
  description?: string;
  tourney?: {
    name: string;
    period: string;
    prizes: {
      first: string;
      second: string;
      third: string;
      bonus: string;
    };
    stats: {
      teams: string;
      format: string;
      platform: string;
    };
    countdown?: string;
  };
  primaryBtn: {
    text: string;
    link: string;
  };
  secondaryBtn?: {
    text: string;
    link: string;
  };
}

export const HeroSlider = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const heroContents: HeroContent[] = [
    {
      image: '/attached_assets/mpl_hero_background.png',
      title: 'HATOR CS2 LEAGUE MOLDOVA',
      subtitle: 'Sezonul 1 - Mai-Iunie 2025',
      description: 'Cel mai tare turneu online de Counter-Strike 2 din Moldova și România, organizat de comunitatea MPL în parteneriat cu HATOR.',
      tourney: {
        name: 'HATOR CS2 LEAGUE MOLDOVA - SEZONUL 1',
        period: 'Mai-Iunie 2025',
        prizes: {
          first: '5x Scaune gaming HATOR Arc 2 XL',
          second: '5x Mouse HATOR Quasar 3 ULTRA 8K',
          third: '5x Căști HATOR Hypergang 2 USB 7.1',
          bonus: '3x Mousepad HATOR Tonn eSport 3XL MONTE'
        },
        stats: {
          teams: '128',
          format: '5v5',
          platform: 'FACEIT'
        },
        countdown: '2025-05-15T18:00:00'
      },
      primaryBtn: {
        text: 'Detalii Turneu',
        link: '/events/hator-cs-league',
      },
      secondaryBtn: {
        text: 'Discord MPL',
        link: 'https://discord.gg/Ek4qvWE5qB',
      },
    },
    {
      image: '/attached_assets/image_1744913294009.png',
      title: 'MOLDOVA PRO LEAGUE',
      subtitle: 'Gaming din pasiune. Competitiv din ADN.',
      description: 'O comunitate de gaming dedicată pasionaților de esports din Moldova, creată din pasiune și dăruire, fără finanțare externă.',
      primaryBtn: {
        text: 'Despre noi',
        link: '/#about',
      },
      secondaryBtn: {
        text: 'Alătură-te',
        link: '/community',
      },
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroContents.length);
    }, 10000); // Schimbă slide-ul la fiecare 10 secunde
    
    return () => clearInterval(interval);
  }, [heroContents.length]);

  const currentHero = heroContents[activeIndex];

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Background Image with Transition */}
      <motion.div 
        key={`bg-${activeIndex}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <img 
          src={currentHero.image} 
          alt={`MPL ${activeIndex + 1}`} 
          className="h-full w-full object-cover"
        />
      </motion.div>
      
      {/* Overlay pentru contrast */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      {/* Gradient overlay bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      
      {/* Content */}
      {isLoaded && (
        <div className="relative h-full flex flex-col justify-center items-start px-4 sm:px-6 md:px-8 lg:px-16 max-w-screen-xl mx-auto z-10">
          <motion.div
            key={`content-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-rajdhani [text-shadow:_0_1px_5px_rgb(0_0_0_/_50%)]">
              {currentHero.title}
            </h1>
            <h2 className="text-xl sm:text-2xl text-primary font-semibold mb-4 max-w-xl [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">
              {currentHero.subtitle}
            </h2>
            
            {currentHero.description && (
              <p className="text-lg text-gray-200 mb-6 max-w-2xl [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">
                {currentHero.description}
              </p>
            )}
            
            {currentHero.tourney && (
              <>
                <div className="mb-6 mt-4 backdrop-blur-sm bg-black/30 rounded-lg p-4 border border-primary/20 max-w-2xl">
                  <h3 className="text-xl font-medium text-white mb-2">Premii impresionante:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-3 rounded-lg border border-amber-500/30">
                      <span className="text-amber-500 text-lg">🥇 Locul 1</span>
                      <p className="text-white">{currentHero.tourney.prizes.first}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-400/20 to-slate-500/20 p-3 rounded-lg border border-slate-400/30">
                      <span className="text-slate-400 text-lg">🥈 Locul 2</span>
                      <p className="text-white">{currentHero.tourney.prizes.second}</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-700/20 to-amber-800/20 p-3 rounded-lg border border-amber-700/30">
                      <span className="text-amber-700 text-lg">🥉 Locul 3</span>
                      <p className="text-white">{currentHero.tourney.prizes.third}</p>
                    </div>
                  </div>
                  <div className="mt-2 bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-2 rounded-lg border border-purple-500/30">
                    <span className="text-purple-400 text-base">🎯 ACE BONUS:</span>
                    <p className="text-white text-sm">{currentHero.tourney.prizes.bonus}</p>
                  </div>
                </div>
                
                {currentHero.tourney.countdown && (
                  <div className="mb-6">
                    <CountdownTimer targetDate={currentHero.tourney.countdown} className="max-w-2xl" />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4 mb-6 max-w-md">
                  <div className="flex flex-col items-center bg-black/40 backdrop-blur-sm border border-primary/20 p-3 rounded-lg w-24">
                    <div className="text-2xl font-bold text-primary mb-1">{currentHero.tourney.stats.teams}</div>
                    <div className="text-xs text-gray-300">Echipe</div>
                  </div>
                  <div className="flex flex-col items-center bg-black/40 backdrop-blur-sm border border-primary/20 p-3 rounded-lg w-24">
                    <div className="text-2xl font-bold text-primary mb-1">{currentHero.tourney.stats.format}</div>
                    <div className="text-xs text-gray-300">Format</div>
                  </div>
                  <div className="flex flex-col items-center bg-black/40 backdrop-blur-sm border border-primary/20 p-3 rounded-lg w-24">
                    <div className="text-2xl font-bold text-primary mb-1">{currentHero.tourney.stats.platform}</div>
                    <div className="text-xs text-gray-300">Platformă</div>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex flex-wrap gap-4">
              {currentHero.primaryBtn.link.startsWith('http') ? (
                <a href={currentHero.primaryBtn.link} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                    {currentHero.primaryBtn.text} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Link href={currentHero.primaryBtn.link}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                    {currentHero.primaryBtn.text} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              
              {currentHero.secondaryBtn && (
                currentHero.secondaryBtn.link.startsWith('http') ? (
                  <a href={currentHero.secondaryBtn.link} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      {currentHero.secondaryBtn.text}
                    </Button>
                  </a>
                ) : (
                  <Link href={currentHero.secondaryBtn.link}>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      {currentHero.secondaryBtn.text}
                    </Button>
                  </Link>
                )
              )}
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Slider indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
        {heroContents.map((_, index) => (
          <button
            key={`indicator-${index}`}
            className={`w-3 h-3 rounded-full transition-all ${
              activeIndex === index ? 'bg-primary w-6' : 'bg-gray-500 opacity-50'
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;