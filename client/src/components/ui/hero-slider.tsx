import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Button } from './button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface SlideContent {
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

  const slides: SlideContent[] = [
    {
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2070',
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
    },
    {
      image: 'https://images.unsplash.com/photo-1627856014754-2907e2355d34?auto=format&fit=crop&q=80&w=2070',
      title: 'HATOR CS LEAGUE MOLDOVA',
      subtitle: 'Cel mai mare turneu CS:GO din Moldova cu premii de 10,000 MDL',
      primaryBtn: {
        text: 'Detalii & Înscriere',
        link: '/event/1',
      },
    },
    {
      image: 'https://images.unsplash.com/photo-1542751371-6533d14d821b?auto=format&fit=crop&q=80&w=2070',
      title: 'ALĂTURĂ-TE COMUNITĂȚII',
      subtitle: 'Intră pe Discord-ul nostru și rămâi conectat la evenimentele MPL',
      primaryBtn: {
        text: 'Discord',
        link: 'https://discord.gg/Ek4qvWE5qB',
      },
      secondaryBtn: {
        text: 'Tournament Schedule',
        link: '/events',
      },
    },
  ];

  return (
    <div className="relative h-screen overflow-hidden">
      {isLoaded && (
        <Swiper
          modules={[EffectFade, Autoplay, Navigation, Pagination]}
          effect="fade"
          speed={1000}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          className="absolute inset-0 w-full h-full max-w-[100vw]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="relative overflow-hidden">
              {/* Background Image with Gradient Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-center items-start px-4 sm:px-6 md:px-8 lg:px-16 max-w-screen-xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="max-w-3xl"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-rajdhani [text-shadow:_0_1px_5px_rgb(0_0_0_/_50%)]">
                    {slide.title}
                  </h1>
                  <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-xl [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {slide.primaryBtn.link.startsWith('http') ? (
                      <a href={slide.primaryBtn.link} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                          {slide.primaryBtn.text}
                        </Button>
                      </a>
                    ) : (
                      <Link href={slide.primaryBtn.link}>
                        <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                          {slide.primaryBtn.text}
                        </Button>
                      </Link>
                    )}
                    
                    {slide.secondaryBtn && (
                      slide.secondaryBtn.link.startsWith('http') ? (
                        <a href={slide.secondaryBtn.link} target="_blank" rel="noopener noreferrer">
                          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                            {slide.secondaryBtn.text}
                          </Button>
                        </a>
                      ) : (
                        <Link href={slide.secondaryBtn.link}>
                          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                            {slide.secondaryBtn.text}
                          </Button>
                        </Link>
                      )
                    )}
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      
      {/* Custom Style for Swiper Pagination */}
      <style>
        {`
          .swiper-container, .swiper-wrapper, .swiper-slide {
            overflow: hidden !important;
            max-width: 100vw !important;
            width: 100% !important;
          }
          
          .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.5);
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background: var(--color-primary);
            transform: scale(1.2);
          }
          .swiper-button-next,
          .swiper-button-prev {
            color: white;
            background: rgba(0, 0, 0, 0.3);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 18px;
          }
        `}
      </style>
    </div>
  );
};

export default HeroSlider;