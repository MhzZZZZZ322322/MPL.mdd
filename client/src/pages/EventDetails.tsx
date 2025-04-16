import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Calendar, Gamepad, Users, Trophy, Info, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { Event } from '@shared/schema';
import { motion } from 'framer-motion';
import eventImages from '@/components/sections/EventImages';

const EventDetails = () => {
  const [, params] = useRoute('/event/:id');
  const eventId = params?.id;
  
  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: ['/api/events', eventId],
    enabled: !!eventId,
  });

  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl font-bold text-primary">
          Se încarcă...
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Evenimentul nu a putut fi găsit
        </h1>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Înapoi la pagina principală
          </Button>
        </Link>
      </div>
    );
  }

  // Determine if event is accepting registrations
  const isActive = event.status === 'În curând' || event.status === 'Activ';
  
  // Alternate background images based on the game/platform
  const getBgClass = () => {
    if (event.title.includes('CS')) return 'bg-[url(https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&q=85)]';
    if (event.title.includes('LoL')) return 'bg-[url(https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&q=85)]';
    if (event.title.includes('FIFA')) return 'bg-[url(https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&q=85)]';
    return 'bg-[url(https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&q=85)]';
  };

  const handleRegistration = () => {
    setRegistrationOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>{event.title} | MPL - Moldova Pro League</title>
        <meta name="description" content={event.description} />
      </Helmet>

      {/* Hero Section */}
      <div className={`relative h-[40vh] ${getBgClass()} bg-cover bg-center bg-no-repeat`}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-8">
          <div className="absolute top-4 left-4 z-10">
            <Link to="/">
              <Button variant="outline" size="sm" className="bg-black/50 hover:bg-black/70">
                <ArrowLeft className="mr-2 h-4 w-4" /> Înapoi
              </Button>
            </Link>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <div className="inline-block bg-primary/90 text-white px-3 py-1 text-sm font-medium mb-3 rounded">
              {event.status}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-rajdhani">
              {event.title}
            </h1>
            <p className="text-gray-200 text-lg mb-4">
              {event.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="bg-darkGray/50 border border-primary/20 rounded-lg p-6">
              <h2 className="text-3xl font-bold mb-6 font-rajdhani text-white">Detalii Eveniment</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Informații Generale</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-300">
                      <Calendar className="h-5 w-5 mr-3 text-primary" />
                      <span>Data: <span className="text-white font-medium">{event.date}</span></span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <Gamepad className="h-5 w-5 mr-3 text-accent" />
                      <span>Platformă: <span className="text-white font-medium">{event.platform}</span></span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <Users className="h-5 w-5 mr-3 text-secondary" />
                      <span>Format: <span className="text-white font-medium">{event.teamSize}</span></span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <Trophy className="h-5 w-5 mr-3 text-yellow-500" />
                      <span>Premii: <span className="text-white font-medium">{event.prize}</span></span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Reguli Principale</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <Info className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                      <span>Participanții trebuie să fie cetățeni sau rezidenți ai Republicii Moldova</span>
                    </li>
                    <li className="flex items-start">
                      <Info className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                      <span>Echipele trebuie să se înregistreze cu cel puțin 2 zile înainte de începerea turneului</span>
                    </li>
                    <li className="flex items-start">
                      <Info className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                      <span>Toate deciziile arbitrilor sunt finale</span>
                    </li>
                    {event.title.includes('HATOR') && (
                      <li className="flex items-start">
                        <Info className="h-5 w-5 mr-3 text-yellow-400 shrink-0 mt-0.5" />
                        <span>Câștigătorii vor primi periferice gaming Hator</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Descriere Detaliată</h3>
                <p className="text-gray-300 mb-4">
                  {event.description} Acest turneu oferă o experiență competitivă de top pentru toți jucătorii pasionați din Moldova.
                </p>
                <p className="text-gray-300 mb-4">
                  Participanții vor concura în mai multe etape, începând cu faza grupelor, urmată de playoff-uri și marea finală.
                  Toate meciurile vor fi transmise live pe canalele noastre de Twitch și YouTube.
                </p>
                {event.title.includes('HATOR') && (
                  <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
                      <ExternalLink className="h-5 w-5 mr-2" /> Sponsorizat de Hator
                    </h4>
                    <p className="text-gray-300">
                      Turneul este sponsorizat de Hator, brand de echipamente gaming de top. 
                      Câștigătorii vor primi premii în bani și periferice gaming Hator de ultimă generație.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="bg-darkGray/50 border border-primary/20 rounded-lg overflow-hidden">
                <div className="h-64 overflow-hidden">
                  {event.title === "HATOR CS LEAGUE MOLDOVA" ? (
                    <div className="bg-black w-full h-full flex items-center justify-center p-2">
                      <img 
                        src="https://i.postimg.cc/pVq0T0jz/hator-cs-league.jpg" 
                        alt={event.title} 
                        className="max-h-full w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <img 
                      src={eventImages[event.title as keyof typeof eventImages] || (event.imageUrl as string)} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://i.postimg.cc/pVq0T0jz/hator-cs-league.jpg";
                        e.currentTarget.onerror = null;
                      }}
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-white">Înscriere</h3>
                  {isActive ? (
                    <>
                      <p className="text-gray-300 mb-4">
                        Înscrierea este deschisă până pe {event.date}. Asigură-te că citești toate regulile înainte de a te înscrie.
                      </p>
                      <Button 
                        onClick={handleRegistration}
                        className="w-full bg-primary hover:bg-primary/80 text-white"
                      >
                        Înscrie-te Acum
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-300 mb-4">
                        Înscrierile pentru acest eveniment s-au încheiat sau vor fi deschise în curând.
                      </p>
                      <Button 
                        disabled
                        className="w-full bg-gray-700 text-gray-300 cursor-not-allowed"
                      >
                        Înscriere Închisă
                      </Button>
                    </>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
                    <p className="text-gray-300 mb-2">
                      Pentru orice întrebări legate de acest eveniment, contactați-ne prin:
                    </p>
                    <ul className="text-gray-300">
                      <li className="mb-1">Email: events@moldovaproleague.md</li>
                      <li>Discord: discord.gg/moldovaproleague</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Registration Modal would be added here */}
        {registrationOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-darkGray/90 border border-primary/40 rounded-lg p-6 max-w-lg w-full"
            >
              <h2 className="text-2xl font-bold mb-4 text-white">Înscrie-te la {event.title}</h2>
              <p className="text-gray-300 mb-6">
                Pentru a finaliza înscrierea, te rugăm să completezi formularul sau să te alături Discord-ului nostru pentru instrucțiuni suplimentare.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-primary hover:bg-primary/80">
                  Discord
                </Button>
                <Button className="flex-1 bg-secondary hover:bg-secondary/80">
                  Formular
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setRegistrationOpen(false)}
                  className="flex-1"
                >
                  Închide
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default EventDetails;