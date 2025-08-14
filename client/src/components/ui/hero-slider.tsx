import { useEffect, useState } from 'react';
import { Button } from './button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import hatorCupImage from '@assets/image_1754482998242.png';
import kingstonImage from '@assets/supercup season1 varianta 1_1755089877102.png';
import supercupMainImage from '@assets/image_1755174900402.png';

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
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: HeroContent[] = [
    {
      image: supercupMainImage,
      title: "Kingston x HyperX",
      subtitle: "Supercup Season 1 • 100,000 LEI premii • 15 august - 28 septembrie",
      primaryBtn: {
        text: "ÎNSCRIE-TE ACUM",
        link: '/events/kingston-hyperx-supercup',
      }
    },
    {
      image: hatorCupImage,
      title: t('hero.slider.title'),
      subtitle: t('hero.slider.subtitle'),
      primaryBtn: {
        text: t('hero.slider.button'),
        link: '/events/hator-cup-ropl-mpl',
      }
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    // Auto-slide every 8 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentContent = slides[currentSlide];

  return (
    <div className="relative h-[65vh] overflow-hidden bg-black">
      {/* Background Image */}
      <motion.div 
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 right-0 h-1/2 flex items-center justify-center"
      >
        <img 
          src={currentContent.image} 
          alt={currentContent.title}
          className="w-full max-w-7xl h-auto object-contain"
        />
      </motion.div>
      
      {/* Overlay pentru contrast */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Gradient overlay bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
      
      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      
      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-primary' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Content */}
      {isLoaded && (
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 md:px-8 lg:px-16 max-w-screen-xl mx-auto z-20 pb-4">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-rajdhani [text-shadow:_0_1px_5px_rgb(0_0_0_/_50%)]">
              {currentContent.title}
            </h1>
            <h2 className="text-xl sm:text-2xl text-primary font-semibold mb-4 max-w-xl [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">
              {currentContent.subtitle}
            </h2>
            <div className="flex flex-wrap gap-4 mt-6">
              {currentContent.primaryBtn.link.startsWith('http') ? (
                <a href={currentContent.primaryBtn.link} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                    {currentContent.primaryBtn.text} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Link href={currentContent.primaryBtn.link}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                    {currentContent.primaryBtn.text} <ChevronRight className="ml-2 h-4 w-4" />
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