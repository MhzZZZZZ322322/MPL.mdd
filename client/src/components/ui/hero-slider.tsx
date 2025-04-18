import { useEffect, useState, useRef } from 'react';
import { Button } from './button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroSlideContent {
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
  highlight?: string;
}

export const HeroSlider = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const progressCircle = useRef<SVGSVGElement>(null);
  const progressContent = useRef<HTMLSpanElement>(null);

  const onAutoplayTimeLeft = (_: any, time: number, progress: number) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty('--progress', String(1 - progress));
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const heroSlides: HeroSlideContent[] = [
    {
      image: "https://i.postimg.cc/pVq0T0jz/hator-cs-league.jpg",
      title: "HATOR CS2 LEAGUE MOLDOVA",
      subtitle: "Cel mai mare turneu de Counter-Strike 2 din Moldova",
      highlight: "nou",
      primaryBtn: {
        text: "Înscrie-te Acum",
        link: "/event/1",
      },
      secondaryBtn: {
        text: "Detalii",
        link: "/event/1",
      },
    },
    {
      image: "/attached_assets/mpl_hero_background.png",
      title: "MOLDOVA PRO LEAGUE",
      subtitle: "Gaming din pasiune. Competitiv din ADN.",
      primaryBtn: {
        text: "Alătură-te Comunității",
        link: "https://discord.gg/moldovaproleague",
      },
      secondaryBtn: {
        text: "Despre noi",
        link: "/#about",
      },
    },
    {
      image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "LIGA NAȚIONALĂ DE ESPORTS",
      subtitle: "Dezvoltăm scena competitivă de gaming din Moldova",
      primaryBtn: {
        text: "Vezi Clasamente",
        link: "/rankings",
      },
      secondaryBtn: {
        text: "Turnee",
        link: "/events",
      },
    },
  ];

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {isLoaded && (
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          effect={'fade'}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="mySwiper h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index} className="relative h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="h-full w-full object-cover object-center opacity-70"
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-center items-start px-4 sm:px-6 md:px-8 lg:px-16 max-w-screen-xl mx-auto z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-3xl"
                >
                  {slide.highlight && (
                    <div className="inline-block bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider animate-pulse">
                      {slide.highlight}
                    </div>
                  )}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-rajdhani [text-shadow:_0_1px_5px_rgb(0_0_0_/_50%)]">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-xl [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">
                    {slide.subtitle}
                  </h2>
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
          
          <div className="autoplay-progress absolute right-4 bottom-4 z-10 flex items-center justify-center" slot="container-end">
            <svg viewBox="0 0 48 48" ref={progressCircle} className="w-10 h-10">
              <circle cx="24" cy="24" r="20" className="stroke-white stroke-[4px] fill-none opacity-30"></circle>
              <circle 
                cx="24" 
                cy="24" 
                r="20" 
                className="stroke-primary stroke-[4px] fill-none" 
                style={{ 
                  strokeDasharray: "125.6",
                  strokeDashoffset: "calc(125.6 * (1 - var(--progress, 0)))",
                  transform: "rotate(-90deg)",
                  transformOrigin: "center"
                }}
              ></circle>
            </svg>
            <span ref={progressContent} className="text-white text-xs absolute"></span>
          </div>
        </Swiper>
      )}
    </div>
  );
};

export default HeroSlider;