import { useQuery } from "@tanstack/react-query";
import { Trophy, Users, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface Stage2Match {
  id: number;
  team1Name: string;
  team2Name: string;
  team1Score?: number;
  team2Score?: number;
  winnerName?: string;
  bracketPosition: number;
  isPlayed: boolean;
  streamUrl?: string;
  technicalWin: boolean;
  technicalWinner?: string;
  matchDate?: string;
}

export function Stage2Bracket() {
  const { data: bracket = [], isLoading, error } = useQuery({
    queryKey: ["/api/stage2-bracket"],
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="bg-gradient-to-r from-zinc-900 to-black border border-orange-500/20 rounded-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
            <span className="ml-3 text-white">Se încarcă plasa Stage 2...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-12">
        <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 rounded-lg p-6">
          <p className="text-red-400 text-center">Eroare la încărcarea plasei Stage 2</p>
        </div>
      </div>
    );
  }

  const matches = (bracket as Stage2Match[]).sort((a, b) => a.bracketPosition - b.bracketPosition);
  const qualifiedTeams = matches.filter(match => match.isPlayed && match.winnerName).length;

  return (
    <motion.div 
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-zinc-900 to-black border border-orange-500/20 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Stage 2 - Eliminare Directă</h2>
                <p className="text-orange-100 text-sm">
                  10 echipe • 5 meciuri BO3 • 5 echipe → Stage 3 (alături de 11 direct din grupe)
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">{qualifiedTeams}/5</div>
              <div className="text-orange-100 text-sm">Echipe calificate</div>
            </div>
          </div>
        </div>

        {/* Tournament Bracket */}
        <div className="p-6">
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Plasa Stage 2 în preparare</h3>
              <p className="text-gray-400">
                Echipele pentru Stage 2 vor fi anunțate după finalizarea Stage 1
              </p>
            </div>
          ) : (
            <div className="tournament-bracket relative">
              {/* Stage 2 Bracket Layout */}
              <div className="grid grid-cols-3 gap-8 items-center min-h-[400px]">
                
                {/* First Round (5 matches) */}
                <div className="space-y-6">
                  {matches.slice(0, 5).map((match, index) => (
                    <motion.div
                      key={match.id}
                      className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden w-64"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {/* Match Header */}
                      <div className="bg-zinc-700 p-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                          <span className="text-white font-medium text-xs">
                            Meci {match.bracketPosition}
                          </span>
                        </div>
                        {match.isPlayed && (
                          <div className="text-green-400 text-xs font-medium">FINALIZAT</div>
                        )}
                      </div>

                      {/* Teams */}
                      <div className="p-3 space-y-2">
                        {/* Team 1 */}
                        <div className={`flex items-center justify-between p-2 rounded ${
                          match.winnerName === match.team1Name 
                            ? 'bg-green-600/20 border border-green-500/50' 
                            : 'bg-zinc-700/50'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              match.winnerName === match.team1Name ? 'bg-green-400' : 'bg-gray-400'
                            }`}></div>
                            <span className={`font-medium text-xs ${
                              match.winnerName === match.team1Name ? 'text-green-300' : 'text-white'
                            }`}>
                              {match.team1Name}
                            </span>
                          </div>
                          {match.isPlayed && (
                            <span className={`font-bold text-sm ${
                              match.winnerName === match.team1Name ? 'text-green-300' : 'text-white'
                            }`}>
                              {match.team1Score ?? 0}
                            </span>
                          )}
                        </div>

                        {/* VS */}
                        <div className="text-center text-gray-400 text-xs">VS</div>

                        {/* Team 2 */}
                        <div className={`flex items-center justify-between p-2 rounded ${
                          match.winnerName === match.team2Name 
                            ? 'bg-green-600/20 border border-green-500/50' 
                            : 'bg-zinc-700/50'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              match.winnerName === match.team2Name ? 'bg-green-400' : 'bg-gray-400'
                            }`}></div>
                            <span className={`font-medium text-xs ${
                              match.winnerName === match.team2Name ? 'text-green-300' : 'text-white'
                            }`}>
                              {match.team2Name}
                            </span>
                          </div>
                          {match.isPlayed && (
                            <span className={`font-bold text-sm ${
                              match.winnerName === match.team2Name ? 'text-green-300' : 'text-white'
                            }`}>
                              {match.team2Score ?? 0}
                            </span>
                          )}
                        </div>

                        {/* Faceit Link */}
                        {match.streamUrl && (
                          <div className="pt-1">
                            <a
                              href={match.streamUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center space-x-1 text-orange-400 hover:text-orange-300 text-xs py-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Faceit</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Connecting Lines */}
                <div className="flex flex-col justify-center items-center h-full space-y-16">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="relative">
                      <div className="w-16 h-px bg-zinc-600"></div>
                      <div className="absolute right-0 top-0 w-2 h-2 bg-orange-400 rounded-full transform translate-x-1 -translate-y-0.5"></div>
                    </div>
                  ))}
                </div>

                {/* Winners Box */}
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="bg-zinc-700 p-2 rounded mb-3">
                    <h3 className="text-white font-medium text-sm text-center">
                      Echipe Calificate în Stage 3
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {matches.filter(m => m.isPlayed && m.winnerName).map((match, index) => (
                      <div key={match.id} className="bg-green-600/20 border border-green-500/50 rounded p-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-300 font-medium text-xs">{match.winnerName}</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Empty slots for remaining winners */}
                    {Array.from({ length: 5 - matches.filter(m => m.isPlayed && m.winnerName).length }).map((_, index) => (
                      <div key={`empty-${index}`} className="bg-zinc-700/50 border border-zinc-600 rounded p-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span className="text-gray-500 text-xs">În așteptare...</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 text-center">
                    <div className="text-orange-400 text-xs font-medium">
                      {matches.filter(m => m.isPlayed && m.winnerName).length}/5 calificate
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      + 11 direct din grupe = 16 în Stage 3
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Stage 2 Rules */}
          <div className="mt-8 bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Regulament Stage 2</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <div className="text-orange-400 font-medium mb-2">Format</div>
                <ul className="space-y-1">
                  <li>• 10 echipe (locurile 12-21 din grupe)</li>
                  <li>• Eliminare directă (Best of 3)</li>
                  <li>• 5 meciuri BO3 simultane</li>
                </ul>
              </div>
              <div>
                <div className="text-orange-400 font-medium mb-2">Progresie în Stage 3</div>
                <ul className="space-y-1">
                  <li>• 5 echipe câștigătoare din Stage 2</li>
                  <li>• + 11 echipe direct din grupe (top 1-11)</li>
                  <li>• = 16 echipe în total în Stage 3</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}