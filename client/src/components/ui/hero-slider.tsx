import { useEffect, useState } from 'react';
import { Button } from './button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import hatorCupImage from '@assets/image_1754482590402.png';

interface HeroContent {
  image: string;
  title: string;
  subtitle: string;
  primaryBtn: {
    text: string;
    link: string;
  };
}

export const HeroSlider = () => {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const heroContent: HeroContent = {
    image: hatorCupImage,
    title: t('hero.slider.title'),
    subtitle: t('hero.slider.subtitle'),
    primaryBtn: {
      text: t('hero.slider.button'),
      link: '/events/hator-cup-ropl-mpl',
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <img 
          src={heroContent.image} 
          alt="HATOR CUP - ROPL x MPL" 
          className="max-h-[70%] max-w-[90%] object-contain"
        />
      </motion.div>
      
      {/* Overlay pentru contrast */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Gradient overlay bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      
      {/* Content */}
      {isLoaded && (
        <div className="relative h-full flex flex-col justify-center items-start px-4 sm:px-6 md:px-8 lg:px-16 max-w-screen-xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-rajdhani [text-shadow:_0_1px_5px_rgb(0_0_0_/_50%)]">
              {heroContent.title}
            </h1>
            <h2 className="text-xl sm:text-2xl text-primary font-semibold mb-4 max-w-xl [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">
              {heroContent.subtitle}
            </h2>
            <div className="flex flex-wrap gap-4 mt-6">
              {heroContent.primaryBtn.link.startsWith('http') ? (
                <a href={heroContent.primaryBtn.link} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                    {heroContent.primaryBtn.text} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Link href={heroContent.primaryBtn.link}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                    {heroContent.primaryBtn.text} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HeroSlider;