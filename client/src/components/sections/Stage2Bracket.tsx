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
                  10 echipe • 5 meciuri • 5 echipe calificate în Stage 3
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">{qualifiedTeams}/5</div>
              <div className="text-orange-100 text-sm">Echipe calificate</div>
            </div>
          </div>
        </div>

        {/* Bracket Grid */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <motion.div
                  key={match.id}
                  className={`bg-zinc-800 border rounded-lg overflow-hidden ${
                    match.isPlayed 
                      ? 'border-green-500/30 bg-green-900/10' 
                      : 'border-orange-500/30 hover:border-orange-500/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Match Header */}
                  <div className="bg-zinc-700 p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span className="text-white font-medium text-sm">
                        Meci {match.bracketPosition}
                      </span>
                    </div>
                    {match.isPlayed && (
                      <div className="text-green-400 text-xs font-medium">FINALIZAT</div>
                    )}
                  </div>

                  {/* Teams */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {/* Team 1 */}
                      <div className={`flex items-center justify-between p-3 rounded ${
                        match.winnerName === match.team1Name 
                          ? 'bg-green-600/20 border border-green-500/30' 
                          : 'bg-zinc-700'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            match.winnerName === match.team1Name ? 'bg-green-400' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-white font-medium">{match.team1Name}</span>
                          {match.technicalWin && match.technicalWinner === match.team1Name && (
                            <span className="text-orange-400 text-xs">⚙️</span>
                          )}
                        </div>
                        {match.isPlayed && (
                          <span className="text-white font-bold text-lg">
                            {match.team1Score ?? 0}
                          </span>
                        )}
                      </div>

                      {/* VS Divider */}
                      <div className="text-center text-gray-400 text-sm font-medium">VS</div>

                      {/* Team 2 */}
                      <div className={`flex items-center justify-between p-3 rounded ${
                        match.winnerName === match.team2Name 
                          ? 'bg-green-600/20 border border-green-500/30' 
                          : 'bg-zinc-700'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            match.winnerName === match.team2Name ? 'bg-green-400' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-white font-medium">{match.team2Name}</span>
                          {match.technicalWin && match.technicalWinner === match.team2Name && (
                            <span className="text-orange-400 text-xs">⚙️</span>
                          )}
                        </div>
                        {match.isPlayed && (
                          <span className="text-white font-bold text-lg">
                            {match.team2Score ?? 0}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Match Info */}
                    <div className="mt-4 flex items-center justify-between">
                      {match.matchDate && (
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(match.matchDate).toLocaleDateString('ro-RO')}</span>
                        </div>
                      )}
                      {match.streamUrl && (
                        <a
                          href={match.streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-orange-400 hover:text-orange-300 text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Faceit</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
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
                  <li>• 10 echipe (locurile 12-21 din Stage 1)</li>
                  <li>• Eliminare directă (Best of 1)</li>
                  <li>• 5 meciuri simultane</li>
                </ul>
              </div>
              <div>
                <div className="text-orange-400 font-medium mb-2">Calificare</div>
                <ul className="space-y-1">
                  <li>• 5 echipe câștigătoare → Stage 3</li>
                  <li>• 5 echipe eliminate din turneu</li>
                  <li>• Un singur meci decisiv per echipă</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}