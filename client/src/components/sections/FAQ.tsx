import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from '@/components/ui/skeleton';
import type { Faq } from '@shared/schema';
import { useLanguage, Language } from '@/lib/LanguageContext';

const FAQ = () => {
  const { t } = useLanguage();
  const { data: faqs, isLoading } = useQuery<Faq[]>({
    queryKey: ['/api/faqs'],
  });

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

  return (
    <section id="faq" className="py-16 md:py-24 relative">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="font-rajdhani font-bold text-3xl md:text-4xl text-white mb-4">
            {t('faq.title.first')} <span className="text-secondary">{t('faq.title.second')}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mx-auto"></div>
          <p className="mt-4 max-w-2xl mx-auto">{t('faq.subtitle')}</p>
        </motion.div>
        
        <motion.div className="max-w-3xl mx-auto" variants={itemVariants}>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-darkGray/50 border border-primary/20 rounded-lg p-5">
                  <Skeleton className="h-6 w-3/4 mb-1" />
                </div>
              ))}
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {faqs?.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={`item-${faq.id}`}
                  className="bg-darkGray/50 border border-primary/20 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-5 py-4 font-rajdhani font-medium text-lg text-white hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 pt-1 border-t border-primary/20">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FAQ;
