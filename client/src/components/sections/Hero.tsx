import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Glitch from '@/components/animations/Glitch';
import HeroSlider from '@/components/ui/hero-slider';

const Hero = () => {
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="hero" className="overflow-hidden">
      {/* New Hero with Swiper Slider */}
      <HeroSlider />
      
      {/* Additional Content Section with AOS animations */}
      <div className="bg-darkBg border-b border-primary/10 py-10 relative">
        <div 
          className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
        >
          <div 
            className="flex flex-col items-center text-center bg-darkGray/40 rounded-xl p-6 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300 border border-primary/10"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-trophy text-2xl text-primary"></i>
            </div>
            <h3 className="text-xl font-bold mb-2 font-rajdhani">Turnee Regulate</h3>
            <p className="text-gray-400">Organizăm turnee și competiții pentru jucători de toate nivelurile, în diverse jocuri populare.</p>
          </div>
          
          <div 
            className="flex flex-col items-center text-center bg-darkGray/40 rounded-xl p-6 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300 border border-primary/10"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-users text-2xl text-secondary"></i>
            </div>
            <h3 className="text-xl font-bold mb-2 font-rajdhani">Comunitate Unită</h3>
            <p className="text-gray-400">O comunitate dedicată pasionaților de gaming competitiv din toată Moldova, cu Discord activ.</p>
          </div>
          
          <div 
            className="flex flex-col items-center text-center bg-darkGray/40 rounded-xl p-6 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300 border border-primary/10"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="w-14 h-14 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-broadcast-tower text-2xl text-cyan-500"></i>
            </div>
            <h3 className="text-xl font-bold mb-2 font-rajdhani">Transmisiuni Live</h3>
            <p className="text-gray-400">Toate evenimentele importante sunt transmise în direct pe platformele noastre Twitch și YouTube.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
