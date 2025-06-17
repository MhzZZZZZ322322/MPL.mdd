import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";

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
  faceitUrl?: string;
}

// Transform scheduled matches into schedule format grouped by days
const transformScheduleData = (matches: any[]) => {
  if (!matches) return [];
  
  const dayNames = {
    "18.06.2025": { display: "18 Iunie 2025", dayName: "Miercuri" },
    "19.06.2025": { display: "19 Iunie 2025", dayName: "Joi" },
    "20.06.2025": { display: "20 Iunie 2025", dayName: "Vineri" },
    "25.06.2025": { display: "25 Iunie 2025", dayName: "Miercuri" },
    "26.06.2025": { display: "26 Iunie 2025", dayName: "Joi" },
    "27.06.2025": { display: "27 Iunie 2025", dayName: "Vineri" },
    "28.06.2025": { display: "28 Iunie 2025", dayName: "Sâmbătă" }
  };
  
  const grouped = matches.reduce((acc, match) => {
    const dateKey = match.date || "18.06.2025";
    const dayInfo = dayNames[dateKey as keyof typeof dayNames] || { display: dateKey, dayName: "Necunoscut" };
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dayInfo.display,
        dayName: dayInfo.dayName,
        matches: []
      };
    }
    
    acc[dateKey].matches.push({
      time: match.time,
      team1: match.team1,
      team2: match.team2,
      group: `Grupa ${match.group}`,
      stage: match.stage,
      faceitUrl: match.faceitUrl || ""
    });
    
    return acc;
  }, {} as Record<string, any>);
  
  return Object.values(grouped).sort((a: any, b: any) => {
    const dateA = a.date.split(' ')[0];
    const dateB = b.date.split(' ')[0];
    return dateA.localeCompare(dateB);
  });
};

export default function TournamentSchedule() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch scheduled matches from API
  const { data: scheduledMatches = [], isLoading } = useQuery({
    queryKey: ['/api/admin/scheduled-matches'],
    refetchInterval: 30000,
  });

  // Transform scheduled matches data
  const scheduleData = transformScheduleData(scheduledMatches);

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-600/20 p-6">
        <div className="text-center text-white">Se încarcă programul...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-600/20 overflow-hidden">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-700/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">
            Orar Turneu
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-purple-400 hidden sm:block">
            Program complet meciuri
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-purple-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-purple-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="space-y-6">
            {scheduleData.map((day: ScheduleDay, dayIndex: number) => (
              <div key={dayIndex} className="border-l-4 border-purple-500/50 pl-4">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-white">{day.date}</h4>
                  <p className="text-sm text-purple-400">{day.dayName}</p>
                </div>
                
                <div className="space-y-3">
                  {day.matches.map((match: ScheduleMatch, matchIndex: number) => (
                    <div key={matchIndex} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/20">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-orange-400 min-w-[60px]">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{match.time}</span>
                          </div>
                          
                          <div className="text-white font-medium">
                            <span className="text-blue-300">{match.team1}</span>
                            <span className="text-gray-400 mx-2">vs</span>
                            <span className="text-red-300">{match.team2}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                            {match.group}
                          </span>
                          <span className="text-xs bg-slate-600/30 text-gray-300 px-2 py-1 rounded">
                            {match.stage}
                          </span>
                          
                          {match.faceitUrl && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => window.open(match.faceitUrl, '_blank')}
                              className="bg-red-600 hover:bg-red-700 text-white animate-pulse"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              LIVE
                            </Button>
                          )}
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