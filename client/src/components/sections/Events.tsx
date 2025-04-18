import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import EventCard from '@/components/ui/event-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import type { Event } from '@shared/schema';
import Timeline from '@/components/ui/timeline';

const Events = () => {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['/api/events'],
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

  // Determină modul de afișare - timeline sau carduri
  const displayMode = 'timeline'; // Varianta nouă - putem face și un switch pentru a putea alterna

  return (
    <section id="events" className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 transform skew-y-1"></div>
      
      <motion.div 
        className="container mx-auto px-4 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="font-rajdhani font-bold text-3xl md:text-4xl text-white mb-4">
            Evenimente & <span className="text-secondary">Turnee</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mx-auto"></div>
          <p className="mt-4 max-w-2xl mx-auto">Descoperă calendarul nostru de evenimente și alătură-te viitoarelor competiții organizate de Moldova Pro League.</p>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-48" />
                <div className="p-6 bg-darkGray/50 border border-primary/20">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between mb-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mb-12">
            <p>A apărut o eroare. Vă rugăm încercați mai târziu.</p>
          </div>
        ) : displayMode === 'timeline' ? (
          // Noul mod de afișare cu timeline
          <Timeline 
            events={events || []} 
            title="Seria Evenimentelor"
            subtitle="Urmărește evoluția turneelor și competițiilor organizate de MPL" 
          />
        ) : (
          // Modul clasic de afișare cu carduri
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            variants={itemVariants}
          >
            {events?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </motion.div>
        )}
        
        {displayMode !== 'timeline' && (
          <motion.div className="text-center" variants={itemVariants}>
            <Link href="/events">
              <Button 
                className="inline-block bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.6)]"
              >
                Vezi toate evenimentele <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Events;
