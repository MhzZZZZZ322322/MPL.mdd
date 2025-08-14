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
    <div className="relative h-[50vh] min-h-[400px] overflow-hidden bg-black">
      {/* Background Image Container */}
      <motion.div 
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <img 
          src={currentContent.image} 
          alt={currentContent.title}
          className="max-w-4xl max-h-[80%] w-auto h-auto object-contain"
          style={{
            filter: 'brightness(0.9) contrast(1.1) saturate(1.05)'
          }}
        />
      </motion.div>
      
      {/* Overlay pentru contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>
      
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
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${
                index === currentSlide ? 'bg-primary border-2 border-white' : 'bg-white/60 hover:bg-white/90 border border-white/30'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Content */}
      {isLoaded && (
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-8">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-4xl">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-xl mx-auto"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 font-rajdhani [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%)] leading-tight">
                {currentContent.title}
              </h1>
              <h2 className="text-sm sm:text-base md:text-lg text-primary font-semibold mb-5 max-w-xl mx-auto [text-shadow:_0_2px_8px_rgb(0_0_0_/_90%)] leading-snug px-2">
                {currentContent.subtitle}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {currentContent.primaryBtn.link.startsWith('http') ? (
                  <a href={currentContent.primaryBtn.link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 font-medium px-4 py-1.5 text-xs shadow-lg border border-primary/20">
                      {currentContent.primaryBtn.text} <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </a>
                ) : (
                  <Link href={currentContent.primaryBtn.link}>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 font-medium px-4 py-1.5 text-xs shadow-lg border border-primary/20">
                      {currentContent.primaryBtn.text} <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSlider;