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
import { useLanguage } from '@/lib/LanguageContext';

// Traducerile întrebărilor și răspunsurilor în rusă 
// (pentru o implementare rapidă, într-o soluție completă acestea ar veni din backend)
const faqTranslations: Record<string, string> = {
  "Cum mă pot alătura MPL?": "Как я могу присоединиться к MPL?",
  "Pentru a te alătura comunității MPL, poți să ne contactezi prin formular sau să te alături serverului nostru de Discord. Pentru a participa la turnee, trebuie să te înregistrezi pe platforma noastră și să urmărești anunțurile despre evenimentele viitoare.": 
    "Чтобы присоединиться к сообществу MPL, вы можете связаться с нами через форму или присоединиться к нашему серверу Discord. Чтобы участвовать в турнирах, вам нужно зарегистрироваться на нашей платформе и следить за объявлениями о предстоящих событиях.",
  
  "Ce jocuri sunt incluse în turnee?": "Какие игры включены в турниры?",
  "În prezent, organizăm turnee pentru CS:GO, League of Legends, FIFA, Dota 2 și Valorant. Planificăm să extindem în viitor cu mai multe jocuri în funcție de interesul comunității. Dacă ai sugestii pentru alte jocuri, ne poți contacta!": 
    "В настоящее время мы организуем турниры по CS:GO, League of Legends, FIFA, Dota 2 и Valorant. Мы планируем расширяться в будущем с большим количеством игр в зависимости от интереса сообщества. Если у вас есть предложения по другим играм, вы можете связаться с нами!",
  
  "Cum se desfășoară turneele?": "Как проходят турниры?",
  "Turneele noastre se desfășoară atât online cât și offline, în funcție de tipul evenimentului. Folosim platforme specializate pentru organizare și avem arbitri dedicați. Fiecare turneu are reguli specifice care sunt anunțate înainte de înscriere. Premiile sunt distribuite la finalul competițiilor.": 
    "Наши турниры проводятся как онлайн, так и офлайн, в зависимости от типа мероприятия. Мы используем специализированные платформы для организации и имеем специальных судей. Каждый турнир имеет определенные правила, которые объявляются перед регистрацией. Призы распределяются в конце соревнований.",
  
  "Este nevoie de echipament special?": "Нужно ли специальное оборудование?",
  "Pentru turneele online, ai nevoie doar de echipamentul tău personal și o conexiune stabilă la internet. Pentru evenimentele offline, noi asigurăm infrastructura necesară. Jucătorii pot aduce propriile periferice (tastatură, mouse, căști) dacă doresc.": 
    "Для онлайн-турниров вам нужно только ваше личное оборудование и стабильное интернет-соединение. Для офлайн-мероприятий мы обеспечиваем необходимую инфраструктуру. Игроки могут принести свои собственные периферийные устройства (клавиатура, мышь, наушники), если они того пожелают.",
  
  "Cum pot deveni sponsor?": "Как я могу стать спонсором?",
  "Pentru parteneriate și sponsorizări, te rugăm să ne contactezi direct prin formularul de contact sau la adresa de email proleaguemoldova@gmail.com. Echipa noastră îți va răspunde în cel mai scurt timp cu detalii despre pachetele de sponsorizare disponibile.": 
    "Для партнерства и спонсорства, пожалуйста, свяжитесь с нами напрямую через контактную форму или по электронной почте proleaguemoldova@gmail.com. Наша команда ответит вам в кратчайшие сроки с подробностями о доступных спонсорских пакетах."
};

const FAQ = () => {
  const { t, language } = useLanguage();
  const { data: faqs, isLoading } = useQuery<Faq[]>({
    queryKey: ['/api/faqs'],
  });
  
  // Procesarea întrebărilor și răspunsurilor pentru a le traduce în rusă când e necesar
  const translatedFaqs = useMemo(() => {
    if (!faqs) return [];
    
    return faqs.map(faq => {
      if (language === 'ru') {
        // Căutăm traducerile pentru întrebare și răspuns
        const translatedQuestion = faqTranslations[faq.question] || faq.question;
        const translatedAnswer = faqTranslations[faq.answer] || faq.answer;
        
        return {
          ...faq,
          question: translatedQuestion,
          answer: translatedAnswer
        };
      }
      // Dacă limba este română, returnăm faq-ul original
      return faq;
    });
  }, [faqs, language]);

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
              {translatedFaqs.length > 0 ? translatedFaqs.map((faq) => (
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
              )) : (
                <div className="bg-darkGray/50 border border-primary/20 rounded-lg p-6 text-center text-white/60">
                  {t('faq.no.questions')}
                </div>
              )}
            </Accordion>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FAQ;
