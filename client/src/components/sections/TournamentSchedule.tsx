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
    date: "18 Ianuarie 2025",
    dayName: "Sâmbătă",
    matches: [
      { time: "10:00", team1: "Auratix", team2: "BPSP", group: "Grupa A", stage: "Stage 1" },
      { time: "10:30", team1: "Japon", team2: "Brigada", group: "Grupa A", stage: "Stage 1" },
      { time: "11:00", team1: "Ciocana Esports", team2: "Killuminaty", group: "Grupa B", stage: "Stage 1" },
      { time: "11:30", team1: "Golden Five", team2: "K9 Team", group: "Grupa B", stage: "Stage 1" },
      { time: "12:00", team1: "Cadian Team", team2: "Lean Vision", group: "Grupa C", stage: "Stage 1" },
      { time: "12:30", team1: "Flux Line", team2: "Legalize", group: "Grupa C", stage: "Stage 1" },
    ]
  },
  {
    date: "19 Ianuarie 2025",
    dayName: "Duminică",
    matches: [
      { time: "10:00", team1: "Into the Beach", team2: "Muligambia", group: "Grupa D", stage: "Stage 1" },
      { time: "10:30", team1: "Neo Egoist League", team2: "Onyx", group: "Grupa D", stage: "Stage 1" },
      { time: "11:00", team1: "Bloody", team2: "Kamikaze Clan", group: "Grupa E", stage: "Stage 1" },
      { time: "11:30", team1: "LitEnergy", team2: "LYSQ", group: "Grupa E", stage: "Stage 1" },
      { time: "12:00", team1: "Barbosii", team2: "Ciocălău Team", group: "Grupa F", stage: "Stage 1" },
      { time: "12:30", team1: "Robotaim", team2: "Rumina", group: "Grupa F", stage: "Stage 1" },
    ]
  },
  {
    date: "25 Ianuarie 2025",
    dayName: "Sâmbătă",
    matches: [
      { time: "10:00", team1: "Bobb3rs", team2: "Cipok", group: "Grupa G", stage: "Stage 1" },
      { time: "10:30", team1: "Coli", team2: "Cucumba", group: "Grupa G", stage: "Stage 1" },
      { time: "11:00", team1: "La Passion", team2: "Saponel", group: "Grupa G", stage: "Stage 1" },
      { time: "11:30", team1: "Shashlik", team2: "Trigger", group: "Grupa G", stage: "Stage 1" },
      { time: "12:00", team1: "VeryGoodTeam", team2: "WenDeagle", group: "Grupa G", stage: "Stage 1" },
      { time: "12:30", team1: "Wenzo", team2: "Win Spirit", group: "Grupa G", stage: "Stage 1" },
    ]
  },
  {
    date: "26 Ianuarie 2025",
    dayName: "Duminică",
    matches: [
      { time: "14:00", team1: "TBD", team2: "TBD", group: "Stage 2", stage: "Single Elimination" },
      { time: "14:30", team1: "TBD", team2: "TBD", group: "Stage 2", stage: "Single Elimination" },
      { time: "15:00", team1: "TBD", team2: "TBD", group: "Stage 2", stage: "Single Elimination" },
      { time: "15:30", team1: "TBD", team2: "TBD", group: "Stage 2", stage: "Single Elimination" },
      { time: "16:00", team1: "TBD", team2: "TBD", group: "Stage 2", stage: "Single Elimination" },
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