import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { 
  ArrowLeft, Calendar, Gamepad, Users, Trophy, Info, ExternalLink, 
  MapPin, DollarSign, Shield, Clock, Award, TrendingUp, CheckCircle2, 
  Hourglass, Flag, Laptop2
} from 'lucide-react';
import { Link } from 'wouter';
import { Event } from '@shared/schema';
import { motion } from 'framer-motion';
import { getQueryFn } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import csHeroImg from '@assets/image_1744965966423.png';

const EventDetails = () => {
  const [, params] = useRoute('/event/:id');
  const eventId = params?.id;
  
  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: ['/api/events', eventId],
    queryFn: () => fetch(`/api/events/${eventId}`).then(res => {
      if (!res.ok) throw new Error('Evenimentul nu a putut fi găsit');
      return res.json();
    }),
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
  
  // Use a proper gaming background
  const getEventBackground = () => {
    return csHeroImg;
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
      <div className="relative h-[60vh] bg-cover bg-center bg-no-repeat" 
           style={{ backgroundImage: `url(${event.imageUrl || getEventBackground()})` }}>
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
                      <span>Premii: <span className="text-white font-medium">Echipamente Gaming Hator</span></span>
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
                    {event.title && (event.title.includes('HATOR') || event.title.includes('Hator')) && (
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
                  {event.description} Acest turneu oferă o experiență competitivă de top pentru toți jucătorii pasionați din Moldova și România.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8">
                  <div className="bg-darkGray/30 border border-primary/10 rounded-lg p-5">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Premii HATOR
                    </h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-yellow-500 shrink-0 mt-0.5" />
                        <span>🥇 Locul 1: 5x Gaming Chair HATOR Arc 2 XL</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-yellow-500 shrink-0 mt-0.5" />
                        <span>🥈 Locul 2: 5x Mouse HATOR Quasar 3 ULTRA 8K wireless</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-yellow-500 shrink-0 mt-0.5" />
                        <span>🥉 Locul 3: 5x Căști HATOR Hypergang 2 USB 7.1 Titanium Edition</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-yellow-500 shrink-0 mt-0.5" />
                        <span>🎯 ACE BONUS: 3x Mousepad HATOR Tonn eSport 3XL MONTE</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-darkGray/30 border border-primary/10 rounded-lg p-5">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <Laptop2 className="h-5 w-5 mr-2 text-blue-400" /> Format Turneu
                    </h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <Hourglass className="h-5 w-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
                        <span>Perioada: 1 lună înscriere + 1 lună meciuri zilnice</span>
                      </li>
                      <li className="flex items-start">
                        <Users className="h-5 w-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
                        <span>Până la 128 echipe participante</span>
                      </li>
                      <li className="flex items-start">
                        <Flag className="h-5 w-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
                        <span>Fază de grupe + playoff + finală</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
                        <span>Participarea este gratuită cu cont FACEIT</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">
                  Participanții vor concura în mai multe etape, începând cu faza grupelor, urmată de playoff-uri și marea finală.
                  Toate meciurile vor fi transmise live pe canalele noastre de Twitch și YouTube de către streameri parteneri precum
                  @domnukrot, @faceofmadness, @rage.md și @catalinciobanu.
                </p>
                
                {event.title && (event.title.includes('HATOR') || event.title.includes('Hator')) && (
                  <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
                      <ExternalLink className="h-5 w-5 mr-2" /> Sponsorizat de Hator
                    </h4>
                    <p className="text-gray-300 mb-3">
                      MPL, cea mai mare comunitate CS din Moldova, în parteneriat cu HATOR și susținut de rețeaua Darwin, 
                      organizează primul sezon al turneului Hator CS2 League Moldova. Primul sezon promite un spectacol de neuitat – 
                      sute de jucători, zeci de meciuri, transmisiuni live și premii impresionante.
                    </p>
                    <p className="text-gray-300">
                      Participanții și spectatorii vor primi coduri promoționale exclusive pentru produsele HATOR, 
                      disponibile în magazinele Darwin.
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
                  {event.title && (event.title.includes("HATOR") || event.title.includes("Hator")) ? (
                    <div className="bg-black w-full h-full flex items-center justify-center p-2">
                      <img 
                        src="https://i.postimg.cc/pVq0T0jz/hator-cs-league.jpg" 
                        alt={event.title} 
                        className="max-h-full w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <img 
                      src={event.imageUrl || "https://i.postimg.cc/pVq0T0jz/hator-cs-league.jpg"} 
                      alt={event.title || "Event image"} 
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