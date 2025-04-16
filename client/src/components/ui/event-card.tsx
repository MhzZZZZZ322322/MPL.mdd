import { motion } from 'framer-motion';
import { Gamepad, Users, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Event } from '@shared/schema';
import eventImages from '@/components/sections/EventImages';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const statusColor = event.status === 'Activ' ? 'bg-secondary' : 'bg-primary';

  return (
    <motion.div 
      className="bg-darkGray/50 border border-primary/20 rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300 group"
      whileHover={{ y: -5 }}
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={eventImages[event.title as keyof typeof eventImages] || (event.imageUrl as string)} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "https://i.postimg.cc/pVq0T0jz/hator-cs-league.jpg";
            e.currentTarget.onerror = null;
          }}
        />
        <div className={`absolute top-0 right-0 ${statusColor} text-white text-sm font-medium px-3 py-1 rounded-bl-lg`}>
          {event.status}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-rajdhani font-bold text-xl text-white">{event.title}</h3>
          <span className="text-secondary text-sm">{event.date}</span>
        </div>
        <p className="mb-4 text-sm">{event.description}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-1">
            <Gamepad className="text-accent h-4 w-4" /> {event.platform}
          </span>
          <span className="flex items-center gap-1">
            <Users className="text-secondary h-4 w-4" /> {event.teamSize}
          </span>
          <span className="flex items-center gap-1">
            <Wallet className="text-cyan-500 h-4 w-4" /> {event.prize}
          </span>
        </div>
        <Button
          variant="outline" 
          className="mt-4 w-full text-center bg-primary/20 hover:bg-primary/40 text-white px-4 py-2 rounded text-sm font-medium transition-all border border-primary/40"
        >
          Detalii & Înscriere
        </Button>
      </div>
    </motion.div>
  );
};

export default EventCard;
