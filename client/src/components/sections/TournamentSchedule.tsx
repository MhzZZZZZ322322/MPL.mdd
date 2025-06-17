import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock } from 'lucide-react';

interface ScheduleDay {
  date: string;
  dayName: string;
  matches: ScheduleMatch[];
}

interface ScheduleMatch {
  time: string;
  team1: string;
  team2: string;
  group: string;
  stage: string;
}

const scheduleData: ScheduleDay[] = [
  {
    date: "18 Iunie 2025",
    dayName: "Miercuri",
    matches: [
      { time: "18:00", team1: "Kamikaze Clan", team2: "Saponel", group: "Grupa A", stage: "Stage 1" },
      { time: "18:00", team1: "Lean Vision", team2: "Ciocălău Team", group: "Grupa A", stage: "Stage 1" },
      { time: "18:00", team1: "Muligambia", team2: "BPSP", group: "Grupa A", stage: "Stage 1" },
      { time: "18:45", team1: "BPSP", team2: "Saponel", group: "Grupa A", stage: "Stage 1" },
      { time: "18:45", team1: "Muligambia", team2: "Ciocălău Team", group: "Grupa A", stage: "Stage 1" },
      { time: "18:45", team1: "Kamikaze Clan", team2: "Lean Vision", group: "Grupa A", stage: "Stage 1" },
      { time: "19:30", team1: "Lean Vision", team2: "Saponel", group: "Grupa A", stage: "Stage 1" },
      { time: "19:30", team1: "Kamikaze Clan", team2: "Muligambia", group: "Grupa A", stage: "Stage 1" },
      { time: "19:30", team1: "BPSP", team2: "Ciocălău Team", group: "Grupa A", stage: "Stage 1" },
      { time: "20:15", team1: "Ciocălău Team", team2: "Saponel", group: "Grupa A", stage: "Stage 1" },
      { time: "20:15", team1: "Kamikaze Clan", team2: "BPSP", group: "Grupa A", stage: "Stage 1" },
      { time: "20:15", team1: "Lean Vision", team2: "Muligambia", group: "Grupa A", stage: "Stage 1" },
      { time: "21:00", team1: "Muligambia", team2: "Saponel", group: "Grupa A", stage: "Stage 1" },
      { time: "21:00", team1: "Lean Vision", team2: "BPSP", group: "Grupa A", stage: "Stage 1" },
      { time: "21:00", team1: "Kamikaze Clan", team2: "Ciocălău Team", group: "Grupa A", stage: "Stage 1" },
    ]
  },
  {
    date: "19 Iunie 2025",
    dayName: "Joi",
    matches: [
      { time: "18:00", team1: "Ciocana Esports", team2: "Xtreme Players", group: "Grupa B", stage: "Stage 1" },
      { time: "18:00", team1: "Legalize", team2: "Barbosii", group: "Grupa B", stage: "Stage 1" },
      { time: "18:00", team1: "LitEnergy", team2: "Japon", group: "Grupa B", stage: "Stage 1" },
      { time: "18:45", team1: "Japon", team2: "Xtreme Players", group: "Grupa B", stage: "Stage 1" },
      { time: "18:45", team1: "LitEnergy", team2: "Barbosii", group: "Grupa B", stage: "Stage 1" },
      { time: "18:45", team1: "Ciocana Esports", team2: "Legalize", group: "Grupa B", stage: "Stage 1" },
      { time: "19:30", team1: "Legalize", team2: "Xtreme Players", group: "Grupa B", stage: "Stage 1" },
      { time: "19:30", team1: "Ciocana Esports", team2: "LitEnergy", group: "Grupa B", stage: "Stage 1" },
      { time: "19:30", team1: "Japon", team2: "Barbosii", group: "Grupa B", stage: "Stage 1" },
      { time: "20:15", team1: "Barbosii", team2: "Xtreme Players", group: "Grupa B", stage: "Stage 1" },
      { time: "20:15", team1: "Ciocana Esports", team2: "Japon", group: "Grupa B", stage: "Stage 1" },
      { time: "20:15", team1: "Legalize", team2: "LitEnergy", group: "Grupa B", stage: "Stage 1" },
      { time: "21:00", team1: "LitEnergy", team2: "Xtreme Players", group: "Grupa B", stage: "Stage 1" },
      { time: "21:00", team1: "Legalize", team2: "Japon", group: "Grupa B", stage: "Stage 1" },
      { time: "21:00", team1: "Ciocana Esports", team2: "Barbosii", group: "Grupa B", stage: "Stage 1" },
    ]
  },
  {
    date: "20 Iunie 2025",
    dayName: "Vineri",
    matches: [
      { time: "18:00", team1: "Brigada Meteor", team2: "Bobb3rs", group: "Grupa C", stage: "Stage 1" },
      { time: "18:00", team1: "Neo Egoist League", team2: "BaitMD", group: "Grupa C", stage: "Stage 1" },
      { time: "18:00", team1: "La Passion", team2: "Win Spirit", group: "Grupa C", stage: "Stage 1" },
      { time: "18:45", team1: "Win Spirit", team2: "Bobb3rs", group: "Grupa C", stage: "Stage 1" },
      { time: "18:45", team1: "La Passion", team2: "BaitMD", group: "Grupa C", stage: "Stage 1" },
      { time: "18:45", team1: "Brigada Meteor", team2: "Neo Egoist League", group: "Grupa C", stage: "Stage 1" },
      { time: "19:30", team1: "Neo Egoist League", team2: "Bobb3rs", group: "Grupa C", stage: "Stage 1" },
      { time: "19:30", team1: "Brigada Meteor", team2: "La Passion", group: "Grupa C", stage: "Stage 1" },
      { time: "19:30", team1: "Win Spirit", team2: "BaitMD", group: "Grupa C", stage: "Stage 1" },
      { time: "20:15", team1: "BaitMD", team2: "Bobb3rs", group: "Grupa C", stage: "Stage 1" },
      { time: "20:15", team1: "Brigada Meteor", team2: "Win Spirit", group: "Grupa C", stage: "Stage 1" },
      { time: "20:15", team1: "Neo Egoist League", team2: "La Passion", group: "Grupa C", stage: "Stage 1" },
      { time: "21:00", team1: "La Passion", team2: "Bobb3rs", group: "Grupa C", stage: "Stage 1" },
      { time: "21:00", team1: "Neo Egoist League", team2: "Win Spirit", group: "Grupa C", stage: "Stage 1" },
      { time: "21:00", team1: "Brigada Meteor", team2: "BaitMD", group: "Grupa C", stage: "Stage 1" },
    ]
  },
  {
    date: "25 Iunie 2025",
    dayName: "Miercuri",
    matches: [
      { time: "18:00", team1: "Coli", team2: "Rumina", group: "Grupa D", stage: "Stage 1" },
      { time: "18:00", team1: "K9 Team", team2: "Shashlik", group: "Grupa D", stage: "Stage 1" },
      { time: "18:00", team1: "Into the Breach", team2: "WenDeagle", group: "Grupa D", stage: "Stage 1" },
      { time: "18:45", team1: "WenDeagle", team2: "Rumina", group: "Grupa D", stage: "Stage 1" },
      { time: "18:45", team1: "Into the Breach", team2: "Shashlik", group: "Grupa D", stage: "Stage 1" },
      { time: "18:45", team1: "Coli", team2: "K9 Team", group: "Grupa D", stage: "Stage 1" },
      { time: "19:30", team1: "K9 Team", team2: "Rumina", group: "Grupa D", stage: "Stage 1" },
      { time: "19:30", team1: "Coli", team2: "Into the Breach", group: "Grupa D", stage: "Stage 1" },
      { time: "19:30", team1: "WenDeagle", team2: "Shashlik", group: "Grupa D", stage: "Stage 1" },
      { time: "20:15", team1: "Shashlik", team2: "Rumina", group: "Grupa D", stage: "Stage 1" },
      { time: "20:15", team1: "Coli", team2: "WenDeagle", group: "Grupa D", stage: "Stage 1" },
      { time: "20:15", team1: "K9 Team", team2: "Into the Breach", group: "Grupa D", stage: "Stage 1" },
      { time: "21:00", team1: "Into the Breach", team2: "Rumina", group: "Grupa D", stage: "Stage 1" },
      { time: "21:00", team1: "K9 Team", team2: "WenDeagle", group: "Grupa D", stage: "Stage 1" },
      { time: "21:00", team1: "Coli", team2: "Shashlik", group: "Grupa D", stage: "Stage 1" },
    ]
  },
  {
    date: "26 Iunie 2025",
    dayName: "Joi",
    matches: [
      { time: "18:00", team1: "XPlosion", team2: "LYSQ", group: "Grupa E", stage: "Stage 1" },
      { time: "18:00", team1: "Cadian Team", team2: "Bloody", group: "Grupa E", stage: "Stage 1" },
      { time: "18:00", team1: "KostiujeniKlinik", team2: "Flux Line", group: "Grupa E", stage: "Stage 1" },
      { time: "18:45", team1: "Flux Line", team2: "LYSQ", group: "Grupa E", stage: "Stage 1" },
      { time: "18:45", team1: "KostiujeniKlinik", team2: "Bloody", group: "Grupa E", stage: "Stage 1" },
      { time: "18:45", team1: "XPlosion", team2: "Cadian Team", group: "Grupa E", stage: "Stage 1" },
      { time: "19:30", team1: "Cadian Team", team2: "LYSQ", group: "Grupa E", stage: "Stage 1" },
      { time: "19:30", team1: "XPlosion", team2: "KostiujeniKlinik", group: "Grupa E", stage: "Stage 1" },
      { time: "19:30", team1: "Flux Line", team2: "Bloody", group: "Grupa E", stage: "Stage 1" },
      { time: "20:15", team1: "Bloody", team2: "LYSQ", group: "Grupa E", stage: "Stage 1" },
      { time: "20:15", team1: "XPlosion", team2: "Flux Line", group: "Grupa E", stage: "Stage 1" },
      { time: "20:15", team1: "Cadian Team", team2: "KostiujeniKlinik", group: "Grupa E", stage: "Stage 1" },
      { time: "21:00", team1: "KostiujeniKlinik", team2: "LYSQ", group: "Grupa E", stage: "Stage 1" },
      { time: "21:00", team1: "Cadian Team", team2: "Flux Line", group: "Grupa E", stage: "Stage 1" },
      { time: "21:00", team1: "XPlosion", team2: "Bloody", group: "Grupa E", stage: "Stage 1" },
    ]
  },
  {
    date: "27 Iunie 2025",
    dayName: "Vineri",
    matches: [
      { time: "18:00", team1: "Wenzo", team2: "X-one", group: "Grupa F", stage: "Stage 1" },
      { time: "18:00", team1: "Robotaim", team2: "Brigada", group: "Grupa F", stage: "Stage 1" },
      { time: "18:00", team1: "Auratix", team2: "Killuminaty", group: "Grupa F", stage: "Stage 1" },
      { time: "18:45", team1: "Killuminaty", team2: "X-one", group: "Grupa F", stage: "Stage 1" },
      { time: "18:45", team1: "Auratix", team2: "Brigada", group: "Grupa F", stage: "Stage 1" },
      { time: "18:45", team1: "Wenzo", team2: "Robotaim", group: "Grupa F", stage: "Stage 1" },
      { time: "19:30", team1: "Robotaim", team2: "X-one", group: "Grupa F", stage: "Stage 1" },
      { time: "19:30", team1: "Wenzo", team2: "Auratix", group: "Grupa F", stage: "Stage 1" },
      { time: "19:30", team1: "Killuminaty", team2: "Brigada", group: "Grupa F", stage: "Stage 1" },
      { time: "20:15", team1: "Brigada", team2: "X-one", group: "Grupa F", stage: "Stage 1" },
      { time: "20:15", team1: "Wenzo", team2: "Killuminaty", group: "Grupa F", stage: "Stage 1" },
      { time: "20:15", team1: "Robotaim", team2: "Auratix", group: "Grupa F", stage: "Stage 1" },
      { time: "21:00", team1: "Auratix", team2: "X-one", group: "Grupa F", stage: "Stage 1" },
      { time: "21:00", team1: "Robotaim", team2: "Killuminaty", group: "Grupa F", stage: "Stage 1" },
      { time: "21:00", team1: "Wenzo", team2: "Brigada", group: "Grupa F", stage: "Stage 1" },
    ]
  },
  {
    date: "28 Iunie 2025",
    dayName: "Sâmbătă",
    matches: [
      { time: "18:00", team1: "Cipok", team2: "VeryGoodTeam", group: "Grupa G", stage: "Stage 1" },
      { time: "18:00", team1: "Cucumba", team2: "Trigger", group: "Grupa G", stage: "Stage 1" },
      { time: "18:00", team1: "Golden Five", team2: "Onyx", group: "Grupa G", stage: "Stage 1" },
      { time: "18:45", team1: "Onyx", team2: "VeryGoodTeam", group: "Grupa G", stage: "Stage 1" },
      { time: "18:45", team1: "Golden Five", team2: "Trigger", group: "Grupa G", stage: "Stage 1" },
      { time: "18:45", team1: "Cipok", team2: "Cucumba", group: "Grupa G", stage: "Stage 1" },
      { time: "19:30", team1: "Cucumba", team2: "VeryGoodTeam", group: "Grupa G", stage: "Stage 1" },
      { time: "19:30", team1: "Cipok", team2: "Golden Five", group: "Grupa G", stage: "Stage 1" },
      { time: "19:30", team1: "Onyx", team2: "Trigger", group: "Grupa G", stage: "Stage 1" },
      { time: "20:15", team1: "Trigger", team2: "VeryGoodTeam", group: "Grupa G", stage: "Stage 1" },
      { time: "20:15", team1: "Cipok", team2: "Onyx", group: "Grupa G", stage: "Stage 1" },
      { time: "20:15", team1: "Cucumba", team2: "Golden Five", group: "Grupa G", stage: "Stage 1" },
      { time: "21:00", team1: "Golden Five", team2: "VeryGoodTeam", group: "Grupa G", stage: "Stage 1" },
      { time: "21:00", team1: "Cucumba", team2: "Onyx", group: "Grupa G", stage: "Stage 1" },
      { time: "21:00", team1: "Cipok", team2: "Trigger", group: "Grupa G", stage: "Stage 1" },
    ]
  }
];

export default function TournamentSchedule() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-lg overflow-hidden">
      <div 
        className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 p-4 border-b border-slate-600/30 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Orar Turneu</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Program meciuri</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="space-y-6">
            {scheduleData.map((day, dayIndex) => (
              <div key={dayIndex} className="border-l-4 border-purple-500/50 pl-4">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-white">{day.date}</h4>
                  <p className="text-sm text-purple-400">{day.dayName}</p>
                </div>
                
                <div className="space-y-3">
                  {day.matches.map((match, matchIndex) => (
                    <div 
                      key={matchIndex}
                      className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-purple-400">
                            <Clock className="w-4 h-4" />
                            <span className="font-semibold">{match.time}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{match.team1}</span>
                            <span className="text-gray-400">vs</span>
                            <span className="text-white font-medium">{match.team2}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                            {match.group}
                          </span>
                          <span className="text-xs bg-slate-600/30 text-gray-300 px-2 py-1 rounded">
                            {match.stage}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Note about schedule */}
          <div className="mt-6 p-3 bg-slate-700/20 rounded-lg border border-slate-600/20">
            <p className="text-xs text-gray-400 text-center">
              * Orarul poate fi modificat în funcție de durata meciurilor anterioare
            </p>
          </div>
        </div>
      )}
    </div>
  );
}