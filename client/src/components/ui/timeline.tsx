import React from 'react';
import { Event } from '@shared/schema';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Trophy, Clock } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from './button';

interface TimelineProps {
  events: Event[];
  title?: string;
  subtitle?: string;
}

const Timeline: React.FC<TimelineProps> = ({ events, title = "Upcoming Events", subtitle }) => {
  // Sortăm evenimentele după dată (presupunem că cele mai noi sunt importante)
  const sortedEvents = [...events].sort((a, b) => {
    // Dacă evenimentul are status "În curând", primește prioritate
    if (a.status === "În curând" && b.status !== "În curând") return -1;
    if (a.status !== "În curând" && b.status === "În curând") return 1;
    
    // Altfel, sortează după ID pentru a afișa cele mai noi evenimente (presupunem că ID-urile mai mari sunt mai noi)
    return b.id - a.id;
  }).slice(0, 3); // Limităm la 3 evenimente pentru afișare

  return (
    <div className="py-12 md:py-20 bg-black/70">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-rajdhani" data-aos="fade-up">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-400 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="relative">
          {/* Linie de timp verticală */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/80 via-primary/40 to-transparent"
            data-aos="fade-down"
            data-aos-duration="1000"
          ></div>

          <div className="max-w-5xl mx-auto">
            {sortedEvents.map((event, index) => (
              <div 
                key={event.id} 
                className={`relative mb-12 md:mb-16 last:mb-0 ${index % 2 === 0 ? 'md:ml-auto md:mr-0' : 'md:mr-auto md:ml-0'}`}
                data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
                data-aos-delay={index * 100}
              >
                <div 
                  className={`flex flex-col md:flex-row md:w-[calc(50%-40px)] ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}
                >
                  {/* Card eveniment */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="bg-darkGray/60 border border-primary/20 rounded-lg p-5 shadow-lg hover:shadow-primary/20 transition-all duration-300 relative z-10"
                  >
                    {/* Punct central pe linia de timp */}
                    <div className="hidden md:block absolute top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-primary shadow-glow-sm shadow-primary/70 z-20"
                      style={{ 
                        [index % 2 === 0 ? 'left' : 'right']: "-42px",
                      }}
                    ></div>
                    {/* Linia conectoare */}
                    <div className="hidden md:block absolute top-1/2 transform -translate-y-1/2 w-10 h-1 bg-primary/30 z-10"
                      style={{ 
                        [index % 2 === 0 ? 'left' : 'right']: "-10px",
                      }}
                    ></div>
                    
                    {/* Status badge */}
                    {event.status && (
                      <div 
                        className={`absolute right-4 top-4 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                          ${event.status === "În curând" ? "bg-green-600/20 text-green-400 border border-green-600/40" 
                          : event.status === "Live" ? "bg-red-600/20 text-red-400 border border-red-600/40 animate-pulse" 
                          : "bg-gray-600/20 text-gray-400 border border-gray-600/40"}
                        `}
                      >
                        <span className="relative">
                          {event.status === "Live" && (
                            <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></span>
                          )}
                          {event.status}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Imagine eveniment */}
                      <div className="md:w-1/3 flex-shrink-0">
                        <div className="aspect-video rounded-lg overflow-hidden bg-black">
                          <img 
                            src={event.imageUrl || "https://i.postimg.cc/pVq0T0jz/hator-cs-league.jpg"} 
                            alt={event.title} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
                            onError={(e) => {
                              e.currentTarget.src = "https://i.postimg.cc/pVq0T0jz/hator-cs-league.jpg";
                              e.currentTarget.onerror = null;
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Detalii eveniment */}
                      <div className="md:w-2/3">
                        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-primary/80" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-cyan-500/80" />
                            <span>{event.location || "Online"}</span>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Users className="h-4 w-4 mr-2 text-yellow-500/80" />
                            <span>{event.teamSize}</span>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Trophy className="h-4 w-4 mr-2 text-orange-400/80" />
                            <span className="truncate">Premii</span>
                          </div>
                        </div>
                        
                        <Link href={`/event/${event.id}`}>
                          <Button className="w-full bg-primary/90 hover:bg-primary transition-colors">
                            {event.status === "În curând" ? "Vezi Detalii" : "Mai Multe"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {events.length > 3 && (
          <div className="mt-10 text-center" data-aos="fade-up">
            <Link href="/events">
              <Button variant="outline" className="border-primary/70 text-primary hover:bg-primary/10">
                Vezi toate evenimentele <Clock className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;