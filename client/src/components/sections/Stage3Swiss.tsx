import { useQuery } from "@tanstack/react-query";
import { Trophy, Target, Calendar, ExternalLink, ChevronDown, ChevronUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Stage3SwissTeam {
  id: number;
  teamName: string;
  wins: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  status: 'active' | 'qualified' | 'eliminated';
}

interface Stage3SwissMatch {
  id: number;
  roundNumber: number;
  team1Name: string;
  team2Name: string;
  team1Score?: number;
  team2Score?: number;
  winnerName?: string;
  isPlayed: boolean;
  streamUrl?: string;
  technicalWin: boolean;
  technicalWinner?: string;
  matchType: string; // BO1 or BO3
  isDecisive: boolean;
  matchDate?: string;
}

interface Stage3SwissProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function Stage3Swiss({ isExpanded, onToggle }: Stage3SwissProps) {
  const { data: standings = [], isLoading: standingsLoading, error: standingsError } = useQuery<Stage3SwissTeam[]>({
    queryKey: ["/api/stage3-swiss-standings"],
    refetchInterval: 15000, // Reduced frequency - refresh every 15 seconds
  });

  const { data: matches = [], isLoading: matchesLoading, error: matchesError } = useQuery<Stage3SwissMatch[]>({
    queryKey: ["/api/stage3-swiss-matches"],
    refetchInterval: 15000, // Reduced frequency - refresh every 15 seconds
  });

  // Get teams data for logos
  const { data: teams = [] } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Helper function to get team logo
  const getTeamLogo = (teamName: string) => {
    const teamsArray = teams as Array<{ name: string; logoUrl: string }>;
    const team = teamsArray.find((t) => t.name === teamName);
    return team?.logoUrl || '/team-logos/default.png';
  };

  if (standingsLoading || matchesLoading) {
    return (
      <div className="pt-4 pb-2 bg-gradient-to-b from-darkBg to-black">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-zinc-900 to-black border border-blue-500/20 rounded-lg p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-white">Se încarcă Swiss System Stage 3...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (standingsError || matchesError) {
    return (
      <div className="pt-4 pb-2 bg-gradient-to-b from-darkBg to-black">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 rounded-lg p-6">
            <p className="text-red-400 text-center">Eroare la încărcarea Swiss System Stage 3</p>
          </div>
        </div>
      </div>
    );
  }

  const standingsArray = standings as Stage3SwissTeam[];
  const matchesArray = matches as Stage3SwissMatch[];
  
  // If no matches exist in database, don't show anything
  if (matchesArray.length === 0) {
    return null;
  }
  
  // Calculate Swiss statistics
  const totalTeams = standingsArray.length;
  const qualifiedTeams = standingsArray.filter(team => team.status === 'qualified').length;
  const eliminatedTeams = standingsArray.filter(team => team.status === 'eliminated').length;
  const activeTeams = standingsArray.filter(team => team.status === 'active').length;

  // Group matches by round
  const matchesByRound = matchesArray.reduce((acc, match) => {
    if (!acc[match.roundNumber]) {
      acc[match.roundNumber] = [];
    }
    acc[match.roundNumber].push(match);
    return acc;
  }, {} as Record<number, Stage3SwissMatch[]>);

  const currentRound = Math.max(...Object.keys(matchesByRound).map(Number), 0);

  return (
    <div className="pt-4 pb-2 bg-gradient-to-b from-darkBg to-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Button 
            onClick={onToggle}
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 text-sm sm:text-base flex items-center gap-2 font-medium"
          >
            {isExpanded ? (
              <>
                Stage 3 - Swiss System
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Stage 3 - Swiss System  
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
          
          <div className="text-right">
            <div className="text-blue-400 font-semibold text-sm">
              Swiss System - 16→8 echipe
            </div>
            <div className="text-gray-400 text-xs">
              3 Victorii = Calificare | 3 Înfrângeri = Eliminare
            </div>
          </div>
        </div>

        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Swiss Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-lg p-4 text-center">
                <div className="text-blue-400 font-bold text-lg">{totalTeams}</div>
                <div className="text-gray-300 text-sm">Total Echipe</div>
              </div>
              <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-500/30 rounded-lg p-4 text-center">
                <div className="text-green-400 font-bold text-lg">{qualifiedTeams}</div>
                <div className="text-gray-300 text-sm">Calificate</div>
              </div>
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30 rounded-lg p-4 text-center">
                <div className="text-red-400 font-bold text-lg">{eliminatedTeams}</div>
                <div className="text-gray-300 text-sm">Eliminate</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border border-yellow-500/30 rounded-lg p-4 text-center">
                <div className="text-yellow-400 font-bold text-lg">{activeTeams}</div>
                <div className="text-gray-300 text-sm">În Concurs</div>
              </div>
            </div>



            {/* Swiss Standings */}
            <div className="bg-gradient-to-r from-zinc-900 to-black border border-blue-500/20 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600/30 to-blue-500/20 p-4 border-b border-blue-500/30">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Clasament Swiss System</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-300 font-medium">Pozitie</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Echipa</th>
                        <th className="text-center py-3 px-2 text-gray-300 font-medium">V-Î</th>
                        <th className="text-center py-3 px-2 text-gray-300 font-medium">Runde</th>
                        <th className="text-center py-3 px-2 text-gray-300 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standingsArray
                        .sort((a, b) => {
                          // Sort by wins (desc), then by round difference (desc)
                          if (b.wins !== a.wins) return b.wins - a.wins;
                          return (b.roundsWon - b.roundsLost) - (a.roundsWon - a.roundsLost);
                        })
                        .map((team, index) => (
                          <tr key={team.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                            <td className="py-3 px-2">
                              <span className="text-gray-300 font-medium">{index + 1}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={getTeamLogo(team.teamName)}
                                  alt={team.teamName}
                                  className="w-8 h-8 object-contain rounded"
                                />
                                <span className="text-white font-medium">{team.teamName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="text-white font-medium">
                                {team.wins}-{team.losses}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="text-gray-300">
                                {team.roundsWon}-{team.roundsLost}
                              </span>
                              <div className="text-xs text-gray-500">
                                ({team.roundsWon - team.roundsLost > 0 ? '+' : ''}{team.roundsWon - team.roundsLost})
                              </div>
                            </td>
                            <td className="py-3 px-2 text-center">
                              {team.status === 'qualified' && (
                                <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                                  🏆 Calificat
                                </span>
                              )}
                              {team.status === 'eliminated' && (
                                <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                                  ❌ Eliminat
                                </span>
                              )}
                              {team.status === 'active' && (
                                <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                                  ⚡ Activ
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Swiss Rounds with Real Matches - Only Database Data */}
            {matchesArray.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Meciurile Swiss System
                </h3>
                
                {/* Group matches by round number */}
                {(() => {
                  // Group matches by round
                  const matchesByRound: Record<number, Stage3SwissMatch[]> = {};
                  
                  matchesArray.forEach((match) => {
                    const round = match.roundNumber;
                    if (!matchesByRound[round]) {
                      matchesByRound[round] = [];
                    }
                    matchesByRound[round].push(match);
                  });
                  
                  return Object.entries(matchesByRound)
                    .sort(([a], [b]) => Number(a) - Number(b)) // Sort by round number
                    .map(([roundNum, roundMatches]) => {
                      const round = Number(roundNum);
                      
                      // Round descriptions
                      const roundDescriptions: Record<number, { title: string; description: string; bgColor: string; borderColor: string }> = {
                        1: {
                          title: "Runda 1 - Toate echipele 0-0",
                          description: "Repartizare pe seed - 8 meciuri pentru 16 echipe",
                          bgColor: "bg-blue-900/20",
                          borderColor: "border-blue-500/30"
                        },
                        2: {
                          title: "Runda 2 - 1-0 vs 1-0 și 0-1 vs 0-1",
                          description: "Echipele cu același record se înfruntă",
                          bgColor: "bg-green-900/20",
                          borderColor: "border-green-500/30"
                        },
                        3: {
                          title: "Runda 3 - Prima rundă cu calificări",
                          description: "2-0 vs 2-0 → primele calificate (3-0)",
                          bgColor: "bg-yellow-900/20",
                          borderColor: "border-yellow-500/30"
                        },
                        4: {
                          title: "Runda 4 - Calificări 3-1",
                          description: "2-1 vs 2-1 → calificate cu 3-1",
                          bgColor: "bg-orange-900/20",
                          borderColor: "border-orange-500/30"
                        },
                        5: {
                          title: "Runda 5 - Ultima rundă",
                          description: "2-2 vs 2-2 → ultimele calificate (3-2)",
                          bgColor: "bg-purple-900/20",
                          borderColor: "border-purple-500/30"
                        }
                      };
                      
                      const config = roundDescriptions[round] || {
                        title: `Runda ${round}`,
                        description: "Meciuri Swiss System",
                        bgColor: "bg-gray-900/20",
                        borderColor: "border-gray-500/30"
                      };
                      
                      return (
                        <div key={roundNum} className={`${config.bgColor} border ${config.borderColor} rounded-lg overflow-hidden`}>
                          <div className="bg-gradient-to-r from-blue-600/30 to-blue-500/20 p-4 border-b border-blue-500/30">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-green-400 text-lg">⚽</span>
                              <h4 className="text-lg font-bold text-white">{config.title}</h4>
                            </div>
                            <p className="text-sm text-gray-300">{config.description}</p>
                            <p className="text-xs text-blue-400 mt-1">
                              {roundMatches.length} {roundMatches.length === 1 ? 'meci' : 'meciuri'}
                              {roundMatches.filter(m => m.isPlayed).length > 0 && 
                                ` - ${roundMatches.filter(m => m.isPlayed).length} jucate`
                              }
                            </p>
                          </div>
                        
                          <div className="p-6">
                            <div className="grid gap-4">
                              {roundMatches.map((match) => (
                                <div
                                  key={match.id}
                                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 relative"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                      {/* Team 1 */}
                                      <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <img
                                          src={getTeamLogo(match.team1Name)}
                                          alt={match.team1Name}
                                          className="w-10 h-10 object-contain rounded"
                                        />
                                        <div className="flex items-center gap-2">
                                          <span className="text-white font-medium truncate">{match.team1Name}</span>
                                          {match.isPlayed && match.winnerName === match.team1Name && (
                                            <span className="text-yellow-400 text-lg">🏆</span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Score */}
                                      <div className="text-center px-4">
                                        {match.isPlayed ? (
                                          <div className="text-white font-bold text-lg">
                                            {match.streamUrl ? (
                                              <a
                                                href={match.streamUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-orange-400 hover:text-orange-300 transition-colors"
                                              >
                                                {match.team1Score} - {match.team2Score}
                                              </a>
                                            ) : (
                                              `${match.team1Score} - ${match.team2Score}`
                                            )}
                                            {match.technicalWin && (
                                              <span className="text-xs text-yellow-400 ml-2">⚙️</span>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="text-gray-400 text-sm">vs</div>
                                        )}
                                        <div className="text-xs text-gray-500 mt-1">
                                          {match.matchType}
                                          {match.isDecisive && (
                                            <span className="text-yellow-400 ml-1">📌</span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Team 2 */}
                                      <div className="flex items-center gap-3 min-w-0 flex-1 justify-end">
                                        <div className="flex items-center gap-2">
                                          {match.isPlayed && match.winnerName === match.team2Name && (
                                            <span className="text-yellow-400 text-lg">🏆</span>
                                          )}
                                          <span className="text-white font-medium truncate">{match.team2Name}</span>
                                        </div>
                                        <img
                                          src={getTeamLogo(match.team2Name)}
                                          alt={match.team2Name}
                                          className="w-10 h-10 object-contain rounded"
                                        />
                                      </div>
                                    </div>


                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    });
                })()}
              </div>
            )}


          </motion.div>
        )}
      </div>
    </div>
  );
}