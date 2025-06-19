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
  result?: {
    team1Score: number;
    team2Score: number;
    technicalWin?: boolean;
    technicalWinner?: string;
    streamUrl?: string;
  };
}

interface MatchResult {
  id: number;
  groupName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  streamUrl?: string;
  matchDate: string;
  technicalWin?: boolean;
  technicalWinner?: string;
}

interface Team {
  id: number;
  name: string;
  logoUrl: string;
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
      group: match.group,
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
  const [showResultsByGroup, setShowResultsByGroup] = useState(false);

  // Fetch scheduled matches from API
  const { data: scheduledMatchesData = [], isLoading } = useQuery({
    queryKey: ['/api/admin/scheduled-matches'],
    refetchInterval: 30000,
  });

  // Fetch match results
  const { data: matchResults = [] } = useQuery<MatchResult[]>({
    queryKey: ['/api/match-results'],
    refetchInterval: 30000,
  });

  // Fetch teams for logos
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
    refetchInterval: 60000,
  });

  // Fetch group configuration for results by group view
  const { data: groupConfig = [] } = useQuery<any[]>({
    queryKey: ['/api/admin/group-config'],
    refetchInterval: 60000,
  });

  // Function to get team logo
  const getTeamLogo = (teamName: string): string => {
    const team = teams.find(t => t.name === teamName);
    return team?.logoUrl || '/team-logos/default.png';
  };

  // Transform scheduled matches data
  const baseScheduleData = transformScheduleData(scheduledMatchesData) as any[];
  
  // Merge with results
  const scheduleData: ScheduleDay[] = baseScheduleData.map((day: any) => ({
    date: day.date,
    dayName: day.dayName,
    matches: day.matches.map((match: any) => {
      // Find corresponding result (check both directions)
      const result = matchResults.find(r => 
        r.groupName === match.group && (
          (r.team1Name === match.team1 && r.team2Name === match.team2) ||
          (r.team1Name === match.team2 && r.team2Name === match.team1)
        )
      );
      
      // Debug logging
      if (match.team1 === "Kamikaze Clan" || match.team2 === "Kamikaze Clan") {
        console.log("Match:", match.team1, "vs", match.team2, "Group:", match.group);
        console.log("Found result:", result);
        console.log("All results for group A:", matchResults.filter(r => r.groupName === "A"));
      }
      
      return {
        time: match.time,
        team1: match.team1,
        team2: match.team2,
        group: match.group,
        stage: match.stage,
        faceitUrl: match.faceitUrl,
        result: result ? {
          team1Score: (result.team1Name === match.team1) ? result.team1Score : result.team2Score,
          team2Score: (result.team1Name === match.team1) ? result.team2Score : result.team1Score,
          technicalWin: result.technicalWin,
          technicalWinner: result.technicalWinner,
          streamUrl: result.streamUrl
        } : undefined
      };
    })
  }));

  // Generate scheduled matches from results for group view (like MatchSchedule)
  const generateScheduledMatches = () => {
    if (!Array.isArray(matchResults)) return [];
    
    return matchResults.map(result => ({
      team1: result.team1Name,
      team2: result.team2Name,
      group: result.groupName,
      result: result
    }));
  };

  const resultMatches = generateScheduledMatches();
  const groupedResults = resultMatches.reduce((acc, match) => {
    if (!acc[match.group]) acc[match.group] = [];
    acc[match.group].push(match);
    return acc;
  }, {} as Record<string, any[]>);

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
                    <div key={matchIndex} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20">
                      <div className="flex items-center justify-between w-full">
                        {/* Ora */}
                        <div className="flex items-center space-x-2 w-16">
                          <Clock className="w-4 h-4 text-orange-400" />
                          <span className="text-sm font-medium text-orange-400">{match.time}</span>
                        </div>

                        {/* Echipa 1 */}
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <img
                            src={getTeamLogo(match.team1)}
                            alt={match.team1}
                            className="w-6 h-6 rounded-sm object-cover flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/team-logos/default.png';
                            }}
                          />
                          <span className="text-sm font-medium text-white truncate flex items-center space-x-1">
                            <span>{match.team1}</span>
                            {match.result?.technicalWin && match.result?.technicalWinner === match.team1 && (
                              <span className="text-orange-500" title="Câștig tehnic">⚙️</span>
                            )}
                          </span>
                        </div>

                        {/* Scor clickabil */}
                        <div className="flex items-center justify-center w-20">
                          {match.result ? (
                            match.result.streamUrl ? (
                              <div 
                                className="flex items-center space-x-1 text-sm font-bold cursor-pointer hover:text-orange-400 transition-colors"
                                onClick={() => window.open(match.result!.streamUrl!, '_blank')}
                                title="Apasă pentru statistici Faceit"
                              >
                                <span className={match.result.team1Score > match.result.team2Score ? 'text-green-400' : 'text-red-400'}>
                                  {match.result.team1Score}
                                </span>
                                <span className="text-gray-400">-</span>
                                <span className={match.result.team2Score > match.result.team1Score ? 'text-green-400' : 'text-red-400'}>
                                  {match.result.team2Score}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 text-sm font-bold">
                                <span className={match.result.team1Score > match.result.team2Score ? 'text-green-400' : 'text-red-400'}>
                                  {match.result.team1Score}
                                </span>
                                <span className="text-gray-400">-</span>
                                <span className={match.result.team2Score > match.result.team1Score ? 'text-green-400' : 'text-red-400'}>
                                  {match.result.team2Score}
                                </span>
                              </div>
                            )
                          ) : (
                            <span className="text-xs text-gray-400">vs</span>
                          )}
                        </div>

                        {/* Echipa 2 */}
                        <div className="flex items-center space-x-2 flex-1 justify-end min-w-0">
                          <span className="text-sm font-medium text-white truncate flex items-center space-x-1">
                            <span>{match.team2}</span>
                            {match.result?.technicalWin && match.result?.technicalWinner === match.team2 && (
                              <span className="text-orange-500" title="Câștig tehnic">⚙️</span>
                            )}
                          </span>
                          <img
                            src={getTeamLogo(match.team2)}
                            alt={match.team2}
                            className="w-6 h-6 rounded-sm object-cover flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/team-logos/default.png';
                            }}
                          />
                        </div>

                        {/* Grupa și LIVE - lățime fixă */}
                        <div className="flex items-center justify-end space-x-2 ml-4 w-32">
                          <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded whitespace-nowrap">
                            Grupa {match.group}
                          </span>
                          
                          {match.faceitUrl && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => window.open(match.faceitUrl, '_blank')}
                              className="bg-red-600 hover:bg-red-700 text-white animate-pulse flex-shrink-0"
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
          
          {/* Toggle pentru rezultate pe grupe */}
          <div className="mt-8 border-t border-slate-600/20 pt-6">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/30 transition-colors rounded-lg"
              onClick={() => setShowResultsByGroup(!showResultsByGroup)}
            >
              <div className="flex items-center space-x-3">
                <h4 className="text-lg font-bold text-white">Rezultate pe Grupe</h4>
              </div>
              {showResultsByGroup ? (
                <ChevronUp className="w-5 h-5 text-purple-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-purple-400" />
              )}
            </div>

            {showResultsByGroup && (
              <div className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {Object.entries(groupedResults).map(([groupName, matches]) => (
                    <div key={groupName} className="bg-slate-700/30 rounded-lg border border-slate-600/20 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600/30 to-purple-500/20 p-4 border-b border-slate-600/30">
                        <h3 className="text-lg font-bold text-white">Grupa {groupName}</h3>
                        <p className="text-sm text-purple-300">{matches.length} meciuri completate</p>
                      </div>
                      
                      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                        {matches.map((match: any, index: number) => (
                          <div key={index} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/20">
                            <div className="flex items-center justify-between">
                              {/* Echipa 1 */}
                              <div className="flex items-center space-x-2 flex-1">
                                <img
                                  src={getTeamLogo(match.team1)}
                                  alt={match.team1}
                                  className="w-5 h-5 rounded-sm object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/team-logos/default.png';
                                  }}
                                />
                                <span className="text-sm font-medium text-white truncate flex items-center space-x-1">
                                  <span>{match.team1}</span>
                                  {match.result?.technicalWin && match.result?.technicalWinner === match.team1 && (
                                    <span className="text-orange-500" title="Câștig tehnic">⚙️</span>
                                  )}
                                </span>
                              </div>

                              {/* Scor */}
                              <div className="flex items-center space-x-2 px-3">
                                {match.result?.streamUrl ? (
                                  <div 
                                    className="flex items-center space-x-1 text-sm font-bold cursor-pointer hover:text-orange-400 transition-colors"
                                    onClick={() => window.open(match.result.streamUrl, '_blank')}
                                    title="Vezi statistici și demo pe Faceit"
                                  >
                                    <span className={match.result.team1Score > match.result.team2Score ? 'text-green-400' : 'text-red-400'}>
                                      {match.result.team1Score}
                                    </span>
                                    <span className="text-gray-400">-</span>
                                    <span className={match.result.team2Score > match.result.team1Score ? 'text-green-400' : 'text-red-400'}>
                                      {match.result.team2Score}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1 text-sm font-bold">
                                    <span className={match.result.team1Score > match.result.team2Score ? 'text-green-400' : 'text-red-400'}>
                                      {match.result.team1Score}
                                    </span>
                                    <span className="text-gray-400">-</span>
                                    <span className={match.result.team2Score > match.result.team1Score ? 'text-green-400' : 'text-red-400'}>
                                      {match.result.team2Score}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Echipa 2 */}
                              <div className="flex items-center space-x-2 flex-1 justify-end">
                                <span className="text-sm font-medium text-white truncate flex items-center space-x-1">
                                  <span>{match.team2}</span>
                                  {match.result?.technicalWin && match.result?.technicalWinner === match.team2 && (
                                    <span className="text-orange-500" title="Câștig tehnic">⚙️</span>
                                  )}
                                </span>
                                <img
                                  src={getTeamLogo(match.team2)}
                                  alt={match.team2}
                                  className="w-5 h-5 rounded-sm object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/team-logos/default.png';
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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