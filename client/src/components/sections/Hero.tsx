import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Glitch from '@/components/animations/Glitch';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-darkBg"></div>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDZ8fGVzcG9ydHN8ZW58MHx8fHwxNjI1ODQ0NTE4&ixlib=rb-4.0.3&q=80&w=2000")', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            filter: 'grayscale(50%)'
          }}
        ></div>
      </div>
      
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="font-rajdhani font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-white"
            variants={itemVariants}
          >
            <Glitch className="block mb-2">Gaming din pasiune.</Glitch>
            <span className="text-secondary animate-pulse">Competitiv din ADN.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 font-light leading-relaxed"
            variants={itemVariants}
          >
            Moldova Pro League este comunitatea independentă de esports creată din pasiunea pentru gaming competitiv. Fără finanțări externe, dar cu o viziune clară: facem esportul mare în Moldova.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Button 
              onClick={() => handleScrollToSection('events')}
              className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.6)] relative overflow-hidden group"
            >
              <span className="relative z-10">Vezi turnee</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Button>
            <Button 
              onClick={() => handleScrollToSection('contact')}
              variant="outline"
              className="bg-transparent border-2 border-secondary hover:border-accent text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-[0_0_15px_rgba(236,72,153,0.6)]"
            >
              Alătură-te comunității
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
