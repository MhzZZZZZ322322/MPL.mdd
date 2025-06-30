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
            <div className="space-y-6">
              {matches.slice(0, 5).map((match, index) => (
                <div key={match.id} className="relative">
                  {/* Match with two teams playing */}
                  <div className="flex items-center space-x-6">
                    
                    {/* Match Box - Two Teams Playing */}
                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 w-80">
                      {/* Team 1 */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={getTeamLogo(match.team1Name)} 
                            alt={match.team1Name}
                            className="w-6 h-6 object-contain rounded-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/team-logos/default.png';
                            }}
                          />
                          <span className="text-white font-medium text-sm">{match.team1Name}</span>
                        </div>
                        {match.isPlayed && (
                          match.streamUrl ? (
                            <a
                              href={match.streamUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-400 hover:text-orange-300 font-bold text-lg underline-offset-4 hover:underline transition-colors"
                            >
                              {match.team1Score ?? 0}
                            </a>
                          ) : (
                            <span className="text-white font-bold text-lg">{match.team1Score ?? 0}</span>
                          )
                        )}
                      </div>

                      {/* VS Separator */}
                      <div className="text-center text-orange-400 text-xs font-bold my-1">VS</div>

                      {/* Team 2 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={getTeamLogo(match.team2Name)} 
                            alt={match.team2Name}
                            className="w-6 h-6 object-contain rounded-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/team-logos/default.png';
                            }}
                          />
                          <span className="text-white font-medium text-sm">{match.team2Name}</span>
                        </div>
                        {match.isPlayed && (
                          match.streamUrl ? (
                            <a
                              href={match.streamUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-400 hover:text-orange-300 font-bold text-lg underline-offset-4 hover:underline transition-colors"
                            >
                              {match.team2Score ?? 0}
                            </a>
                          ) : (
                            <span className="text-white font-bold text-lg">{match.team2Score ?? 0}</span>
                          )
                        )}
                      </div>


                    </div>

                    {/* Connection Line */}
                    <div className="flex items-center">
                      <div className="w-16 h-px bg-zinc-500"></div>
                      <div className="w-3 h-3 bg-orange-400 rounded-full mx-1"></div>
                      <div className="w-16 h-px bg-zinc-500"></div>
                    </div>

                    {/* Winner Box - Only the winner advances */}
                    <div className={`flex items-center justify-between p-3 rounded-lg w-48 ${
                      match.isPlayed && match.winnerName
                        ? 'bg-green-600/30 border-2 border-green-500/70' 
                        : 'bg-zinc-700/50 border border-zinc-600 border-dashed'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {match.isPlayed && match.winnerName ? (
                          <img 
                            src={getTeamLogo(match.winnerName)} 
                            alt={match.winnerName}
                            className="w-6 h-6 object-contain rounded-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/team-logos/default.png';
                            }}
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-500 rounded-sm flex items-center justify-center opacity-50">
                            <span className="text-white text-xs font-bold">?</span>
                          </div>
                        )}
                        <span className={`font-medium text-sm ${
                          match.isPlayed && match.winnerName ? 'text-green-200' : 'text-gray-400'
                        }`}>
                          {match.isPlayed && match.winnerName 
                            ? match.winnerName 
                            : 'Câștigător'
                          }
                        </span>
                      </div>
                      {match.isPlayed && match.winnerName && (
                        <div className="text-yellow-400 text-xl">
                          🏆
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
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