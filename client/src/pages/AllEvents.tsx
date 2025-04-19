import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/ui/event-card';
import type { Event } from '@shared/schema';

const AllEvents = () => {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  return (
    <>
      <Helmet>
        <title>Toate Evenimentele | Moldova Pro League</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-32 pb-16 min-h-screen bg-black">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-rajdhani text-white mb-2">
                Toate <span className="text-secondary">Evenimentele</span>
              </h1>
              <p className="text-gray-400 max-w-2xl">
                Descoperă calendarul complet al turneelor și evenimentelor organizate de Moldova Pro League. Înscrie-te, participă și câștigă premii!
              </p>
            </div>
            <Link href="/">
              <Button 
                variant="outline" 
                className="mt-4 md:mt-0 flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
              >
                <ArrowLeft size={16} />
                Înapoi la pagina principală
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
            <div className="text-center text-red-500 p-8 bg-red-500/10 rounded-lg border border-red-500/30">
              <p>A apărut o eroare la încărcarea evenimentelor. Vă rugăm încercați mai târziu.</p>
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center text-yellow-500 p-8 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <p>Nu există evenimente disponibile momentan. Verificați mai târziu pentru actualizări.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AllEvents;