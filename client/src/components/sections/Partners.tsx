import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import NeonBorder from '@/components/animations/NeonBorder';
import darwinLogo from '@/assets/darwin-logo.png';
import hatorLogo from '@/assets/hator-logo-yellow.png';
import iziplayLogo from '@/assets/iziplay-logo.png';
import { useLanguage } from '@/lib/LanguageContext';

const Partners = () => {
  const { t } = useLanguage();
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
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

  const benefitsList = [
    t('partners.benefit.1'),
    t('partners.benefit.2'),
    t('partners.benefit.3'),
    t('partners.benefit.4')
  ];

  const handleScrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="partners" className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 transform -skew-y-1"></div>
      
      <motion.div 
        className="container mx-auto px-4 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="font-rajdhani font-bold text-3xl md:text-4xl text-white mb-4">
            {t('partners.title.first')} <span className="text-secondary">{t('partners.title.second')}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mx-auto"></div>
          <p className="mt-4 max-w-2xl mx-auto">{t('partners.subtitle')}</p>
        </motion.div>
        
        <motion.div
          className="max-w-4xl mx-auto bg-darkGray/60 border border-primary/20 rounded-lg p-8 md:p-12 mb-12"
          variants={itemVariants}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="font-orbitron text-2xl mb-4 text-white">
                {t('partners.grow.title')} <span className="text-secondary">{t('partners.grow.together')}</span>
              </h3>
              <p className="mb-4">{t('partners.description.1')}</p>
              <p className="mb-6">{t('partners.description.2')}</p>
              
              <ul className="space-y-2 mb-6">
                {benefitsList.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-secondary mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={handleScrollToContact}
                className="inline-block bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.6)]"
              >
                {t('partners.contact.button')}
              </Button>
            </div>
            
            <NeonBorder className="p-6 bg-darkBg/80 rounded-lg">
              <h4 className="font-rajdhani text-xl text-white mb-6 text-center">{t('partners.our.partners')}</h4>
              <div className="grid grid-cols-2 gap-6">
                <a 
                  href="https://darwin.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="aspect-video bg-darkGray/40 rounded flex items-center justify-center p-4 hover:bg-darkGray/60 transition-colors"
                >
                  <img src={darwinLogo} alt="Darwin.md Logo" className="max-h-16 w-auto object-contain" />
                </a>
                <a 
                  href="https://hator.gg/keyboards/skyfall-tkl-pro-wireless/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="aspect-video bg-darkBg rounded flex items-center justify-center p-4 hover:bg-darkGray/60 transition-colors"
                >
                  <img src={hatorLogo} alt="Hator Logo" className="max-h-16 w-auto object-contain" />
                </a>
                <a 
                  href="https://www.instagram.com/iziplay.md/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="aspect-video bg-darkBg rounded flex items-center justify-center p-4 hover:bg-darkGray/60 transition-colors"
                >
                  <img src={iziplayLogo} alt="IZI Play Logo" className="max-h-16 w-auto object-contain" />
                </a>
                {[...Array(1)].map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-video bg-darkGray/40 rounded flex items-center justify-center border border-dashed border-gray-600 hover:border-secondary transition-colors"
                  >
                    <span className="text-gray-400 text-sm">{t('partners.sponsor.spot')}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center text-sm text-gray-400">
                <p>{t('partners.supported.by')}</p>
              </div>
            </NeonBorder>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Partners;
