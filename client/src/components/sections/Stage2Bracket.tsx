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
            <div className="tournament-bracket relative overflow-x-auto">
              {/* Tournament Bracket with SVG Connections */}
              <div className="relative min-w-[1000px] min-h-[700px] bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-lg">
                
                {/* SVG for all bracket connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#fb923c" />
                    </marker>
                  </defs>
                  
                  {/* Connections from matches to center collection */}
                  {[0, 1, 2, 3, 4].map((index) => (
                    <g key={index}>
                      {/* Horizontal line from match */}
                      <line
                        x1="300"
                        y1={80 + (index * 130)}
                        x2="450"
                        y2={80 + (index * 130)}
                        stroke="#71717a"
                        strokeWidth="2"
                      />
                      {/* Vertical line to central collection point */}
                      <line
                        x1="450"
                        y1={80 + (index * 130)}
                        x2="500"
                        y2={300}
                        stroke="#71717a"
                        strokeWidth="2"
                      />
                      {/* Connection dots */}
                      <circle cx="450" cy={80 + (index * 130)} r="4" fill="#fb923c" />
                    </g>
                  ))}
                  
                  {/* Central collection to winners */}
                  <line x1="500" y1="300" x2="650" y2="300" stroke="#71717a" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <circle cx="500" cy="300" r="6" fill="#fb923c" />
                </svg>

                {/* Left Column - Tournament Matches */}
                <div className="absolute left-0 top-0 space-y-4" style={{ zIndex: 2 }}>
                  {matches.slice(0, 5).map((match, index) => (
                    <motion.div
                      key={match.id}
                      className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden w-72 shadow-lg"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      style={{ marginTop: `${index * 130}px` }}
                    >
                      {/* Match Header */}
                      <div className="bg-zinc-700 p-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse"></div>
                          <span className="text-white font-medium text-sm">
                            Meci {match.bracketPosition}
                          </span>
                        </div>
                        {match.isPlayed && (
                          <div className="text-green-400 text-xs font-bold bg-green-400/20 px-2 py-1 rounded">
                            FINALIZAT
                          </div>
                        )}
                      </div>

                      {/* Teams */}
                      <div className="p-3 space-y-2">
                        {/* Team 1 */}
                        <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          match.winnerName === match.team1Name 
                            ? 'bg-green-600/30 border-2 border-green-500/70 shadow-green-500/20 shadow-lg' 
                            : 'bg-zinc-700/70 border border-zinc-600'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              match.winnerName === match.team1Name ? 'bg-green-400' : 'bg-gray-500'
                            }`}></div>
                            <span className={`font-semibold text-sm ${
                              match.winnerName === match.team1Name ? 'text-green-200' : 'text-white'
                            }`}>
                              {match.team1Name}
                            </span>
                          </div>
                          {match.isPlayed && (
                            <span className={`font-bold text-lg ${
                              match.winnerName === match.team1Name ? 'text-green-200' : 'text-gray-300'
                            }`}>
                              {match.team1Score ?? 0}
                            </span>
                          )}
                        </div>

                        {/* VS Divider */}
                        <div className="text-center text-orange-400 text-sm font-bold">VS</div>

                        {/* Team 2 */}
                        <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          match.winnerName === match.team2Name 
                            ? 'bg-green-600/30 border-2 border-green-500/70 shadow-green-500/20 shadow-lg' 
                            : 'bg-zinc-700/70 border border-zinc-600'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              match.winnerName === match.team2Name ? 'bg-green-400' : 'bg-gray-500'
                            }`}></div>
                            <span className={`font-semibold text-sm ${
                              match.winnerName === match.team2Name ? 'text-green-200' : 'text-white'
                            }`}>
                              {match.team2Name}
                            </span>
                          </div>
                          {match.isPlayed && (
                            <span className={`font-bold text-lg ${
                              match.winnerName === match.team2Name ? 'text-green-200' : 'text-gray-300'
                            }`}>
                              {match.team2Score ?? 0}
                            </span>
                          )}
                        </div>

                        {/* Faceit Link */}
                        {match.streamUrl && (
                          <div className="pt-2">
                            <a
                              href={match.streamUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center space-x-2 text-orange-400 hover:text-orange-300 text-sm font-medium bg-orange-400/10 hover:bg-orange-400/20 py-2 px-3 rounded-lg transition-all"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Faceit</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Center Collection Point */}
                <motion.div 
                  className="absolute bg-orange-500/20 border-2 border-orange-400 rounded-full w-16 h-16 flex items-center justify-center"
                  style={{ left: '480px', top: '280px', zIndex: 3 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="text-orange-400 font-bold text-xs text-center">STAGE<br/>2</div>
                </motion.div>

                {/* Right Column - Qualified Teams */}
                <motion.div 
                  className="absolute right-0 top-0 bg-zinc-800 border-2 border-zinc-700 rounded-xl p-6 w-80 shadow-2xl"
                  style={{ zIndex: 2 }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <div className="bg-gradient-to-r from-green-600 to-green-500 p-3 rounded-lg mb-4">
                    <h3 className="text-white font-bold text-lg text-center">
                      Echipe Calificate în Stage 3
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {matches.filter(m => m.isPlayed && m.winnerName).map((match, index) => (
                      <motion.div 
                        key={match.id} 
                        className="bg-green-600/30 border-2 border-green-500/70 rounded-lg p-3 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 1.2 + (index * 0.1) }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-200 font-bold text-sm">{match.winnerName}</span>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Empty slots for remaining winners */}
                    {Array.from({ length: 5 - matches.filter(m => m.isPlayed && m.winnerName).length }).map((_, index) => (
                      <div key={`empty-${index}`} className="bg-zinc-700/50 border-2 border-zinc-600 rounded-lg p-3 border-dashed">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-gray-500 rounded-full opacity-50"></div>
                          <span className="text-gray-400 text-sm">Calificare în curs...</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center border-t-2 border-zinc-700 pt-4">
                    <div className="text-orange-400 text-lg font-bold">
                      {matches.filter(m => m.isPlayed && m.winnerName).length}/5 Calificate
                    </div>
                    <div className="text-gray-300 text-sm mt-2 bg-zinc-700/50 rounded p-2">
                      + 11 echipe direct din grupe<br />
                      = <span className="text-white font-bold">16 echipe în Stage 3</span>
                    </div>
                  </div>
                </motion.div>

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