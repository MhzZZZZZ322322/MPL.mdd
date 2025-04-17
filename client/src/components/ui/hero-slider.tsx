import { useEffect, useState } from 'react';
import { Button } from './button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

interface HeroContent {
  image: string;
  title: string;
  subtitle: string;
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

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const heroContent: HeroContent = {
    image: '/attached_assets/mpl_hero_background.png', // Folosim imaginea noua furnizată de client
    title: 'MOLDOVA PRO LEAGUE',
    subtitle: 'Gaming din pasiune. Competitiv din ADN.',
    primaryBtn: {
      text: 'Înscrie-te Acum',
      link: '/event/1',
    },
    secondaryBtn: {
      text: 'Despre noi',
      link: '/#about',
    },
  };

  return (
    <div 
      className="relative h-screen overflow-hidden bg-gradient-to-br from-black via-[#4a1d96]/90 to-black"
    >
      {/* Am eliminat complet imaginea și folosim doar un fundal cu gradient pentru a evita orice problemă */}
      
      {/* Content */}
      {isLoaded && (
        <div className="relative h-full flex flex-col justify-center items-start px-4 sm:px-6 md:px-8 lg:px-16 max-w-screen-xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-rajdhani [text-shadow:_0_1px_5px_rgb(0_0_0_/_50%)]">
              {heroContent.title}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-xl [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">
              {heroContent.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              {heroContent.primaryBtn.link.startsWith('http') ? (
                <a href={heroContent.primaryBtn.link} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                    {heroContent.primaryBtn.text}
                  </Button>
                </a>
              ) : (
                <Link href={heroContent.primaryBtn.link}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                    {heroContent.primaryBtn.text}
                  </Button>
                </Link>
              )}
              
              {heroContent.secondaryBtn && (
                heroContent.secondaryBtn.link.startsWith('http') ? (
                  <a href={heroContent.secondaryBtn.link} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      {heroContent.secondaryBtn.text}
                    </Button>
                  </a>
                ) : (
                  <Link href={heroContent.secondaryBtn.link}>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      {heroContent.secondaryBtn.text}
                    </Button>
                  </Link>
                )
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HeroSlider;