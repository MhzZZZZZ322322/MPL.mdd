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

            {/* Swiss Rounds by Match Type */}
            {matches.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Meciurile Swiss System
                </h3>
                
                {/* Group matches by their type */}
                {(() => {
                  // Group matches by match type (0-0, 1-0, 2-0, etc.)
                  const matchesByType: Record<string, Stage3SwissMatch[]> = {};
                  
                  matches.forEach((match) => {
                    // Determine match type based on teams' current records
                    const team1Stats = standingsArray.find(t => t.teamName === match.team1Name);
                    const team2Stats = standingsArray.find(t => t.teamName === match.team2Name);
                    
                    if (team1Stats && team2Stats) {
                      const record1 = `${team1Stats.wins}-${team1Stats.losses}`;
                      const record2 = `${team2Stats.wins}-${team2Stats.losses}`;
                      
                      // Use the most common record as the match type
                      const matchType = record1 === record2 ? record1 : `${record1} vs ${record2}`;
                      
                      if (!matchesByType[matchType]) {
                        matchesByType[matchType] = [];
                      }
                      matchesByType[matchType].push(match);
                    }
                  });
                  
                  // Define order priority for match types
                  const typeOrder = ['0-0', '1-0', '2-0', '1-1', '2-1', '0-1', '0-2', '1-2', '2-2'];
                  
                  return Object.entries(matchesByType)
                    .sort(([a], [b]) => {
                      const aIndex = typeOrder.indexOf(a);
                      const bIndex = typeOrder.indexOf(b);
                      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                      if (aIndex !== -1) return -1;
                      if (bIndex !== -1) return 1;
                      return a.localeCompare(b);
                    })
                    .map(([matchType, typeMatches]) => (
                      <div key={matchType} className="bg-gradient-to-r from-zinc-900 to-black border border-blue-500/20 rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600/30 to-blue-500/20 p-4 border-b border-blue-500/30">
                          <h4 className="text-lg font-bold text-white">
                            Meciuri {matchType}
                          </h4>
                          <p className="text-sm text-gray-300">
                            {typeMatches.length} {typeMatches.length === 1 ? 'meci' : 'meciuri'}
                          </p>
                        </div>
                      
                        <div className="p-6">
                          <div className="grid gap-4">
                            {typeMatches.map((match) => (
                              <div
                                key={match.id}
                                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
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
                                      <span className="text-white font-medium truncate">{match.team1Name}</span>
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
                                      <span className="text-white font-medium truncate">{match.team2Name}</span>
                                      <img
                                        src={getTeamLogo(match.team2Name)}
                                        alt={match.team2Name}
                                        className="w-10 h-10 object-contain rounded"
                                      />
                                    </div>
                                  </div>

                                  {/* Winner indicator */}
                                  {match.isPlayed && match.winnerName && (
                                    <div className="ml-4">
                                      <span className="text-yellow-400 text-2xl">🏆</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ));
                })()}
              </div>
            )}

            {/* Swiss System Rounds Explanation */}
            <div className="bg-gradient-to-r from-zinc-900 to-black border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Clasificare Swiss System – Rundele
              </h3>
              
              <div className="space-y-6">
                {/* Runda 1 */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-400 text-lg">✅</span>
                    <h4 className="text-white font-bold">Runda 1</h4>
                  </div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>Toate echipele sunt 0-0</p>
                    <p>Repartizare pe  seed</p>
                    <p className="text-blue-400 font-medium">8 meciuri: 16 echipe → 8 câștigă (1-0), 8 pierd (0-1)</p>
                  </div>
                </div>

                {/* Runda 2 */}
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-400 text-lg">✅</span>
                    <h4 className="text-white font-bold">Runda 2</h4>
                  </div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>1-0 vs 1-0 → 4 meciuri → 4 echipe devin 2-0</p>
                    <p>0-1 vs 0-1 → 4 meciuri → 4 echipe devin 0-2</p>
                    <p className="text-yellow-400 font-medium">Restul: 4 echipe rămân 1-1</p>
                  </div>
                </div>

                {/* Runda 3 */}
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-400 text-lg">✅</span>
                    <h4 className="text-white font-bold">Runda 3</h4>
                  </div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>2-0 vs 2-0 → 2 meciuri → <span className="text-yellow-400 font-bold">2 echipe devin 3-0 ✅ CALIFICATE</span></p>
                    <p>1-1 vs 1-1 → 4 meciuri → 4 echipe devin 2-1, 4 devin 1-2</p>
                    <p>0-2 vs 0-2 → 2 meciuri → 2 echipe devin 1-2, <span className="text-red-400 font-bold">2 eliminări (0-3)</span></p>
                  </div>
                </div>

                {/* Runda 4 */}
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-400 text-lg">✅</span>
                    <h4 className="text-white font-bold">Runda 4</h4>
                  </div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>2-1 vs 2-1 → 2 meciuri → <span className="text-yellow-400 font-bold">2 echipe devin 3-1 ✅ CALIFICATE</span></p>
                    <p>1-2 vs 1-2 → 4 meciuri → 2 echipe devin 2-2, <span className="text-red-400 font-bold">2 eliminări (1-3)</span></p>
                    <p>1-2 vs 2-1 (restul) → 2 meciuri → echipele se reechilibrează</p>
                  </div>
                </div>

                {/* Runda 5 */}
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-400 text-lg">✅</span>
                    <h4 className="text-white font-bold">Runda 5</h4>
                  </div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>Doar echipe cu 2-2 → 4 meciuri</p>
                    <p><span className="text-yellow-400 font-bold">Câștigătoarele devin 3-2 ✅ CALIFICATE</span></p>
                    <p><span className="text-red-400 font-bold">Pierzătoarele devin 2-3 ❌ ELIMINATE</span></p>
                  </div>
                </div>

                {/* Rezultat final */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-green-900/30 border border-yellow-500/50 rounded-lg p-4 mt-6">
                  <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Rezultat Final
                  </h4>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p><span className="text-green-400 font-bold">8 echipe calificate:</span> 2 echipe (3-0) + 2 echipe (3-1) + 4 echipe (3-2)</p>
                    <p><span className="text-red-400 font-bold">8 echipe eliminate:</span> 2 echipe (0-3) + 2 echipe (1-3) + 4 echipe (2-3)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Swiss System Format Details */}
            <div className="bg-gradient-to-r from-zinc-900 to-black border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Detalii Format Swiss System
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-blue-400 font-semibold mb-2">Reguli Generale:</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>• 16 echipe → 8 echipe calificate</li>
                    <li>• 3 victorii = calificare garantată</li>
                    <li>• 3 înfrângeri = eliminare</li>
                    <li>• Maxim 8 runde de joc</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-blue-400 font-semibold mb-2">Format Meciuri:</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>• BO1 - meciuri normale</li>
                    <li>• BO3 - meciuri decisive (2-2 vs 2-2)</li>
                    <li>• Pairing după victorii similare</li>
                    <li>• Nu se repetă adversarii</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}