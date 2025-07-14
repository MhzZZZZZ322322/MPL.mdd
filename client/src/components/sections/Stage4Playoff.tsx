import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";

interface Stage4PlayoffMatch {
  id: number;
  bracketPosition: string;
  team1Name: string | null;
  team2Name: string | null;
  team1Score: number | null;
  team2Score: number | null;
  winnerName: string | null;
  matchDate: string | null;
  matchTime: string | null;
  isPlayed: boolean;
  faceitUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const getBracketPositionInfo = (bracketRound: string, bracketPosition: number) => {
  const roundInfo: Record<string, { stage: string; color: string }> = {
    'quarterfinals': { stage: 'Sferturile de finală', color: 'bg-blue-500' },
    'semifinals': { stage: 'Semifinalele', color: 'bg-orange-500' },
    'final': { stage: 'Finala', color: 'bg-red-500' },
    'third_place': { stage: 'Locul 3', color: 'bg-yellow-500' }
  };
  
  const info = roundInfo[bracketRound] || { stage: 'Necunoscut', color: 'bg-gray-500' };
  
  return {
    stage: info.stage,
    match: `Meciul ${bracketPosition}`,
    color: info.color
  };
};

const getDayFromPosition = (bracketRound: string): string => {
  // Day 1 (18 iulie): Quarter-finals
  if (bracketRound === 'quarterfinals') return '18 iulie 2025';
  // Day 2 (19 iulie): Semi-finals  
  if (bracketRound === 'semifinals') return '19 iulie 2025';
  // Day 3 (20 iulie): Final
  if (bracketRound === 'final') return '20 iulie 2025';
  return 'Data necunoscută';
};

export default function Stage4Playoff() {
  const { data: matches = [], isLoading } = useQuery<Stage4PlayoffMatch[]>({
    queryKey: ['/api/stage4-playoff'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <Card className="w-full border-primary/20 bg-gradient-to-br from-gray-900 to-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">
            🏆 Stage 4 - Playoff (8 echipe)
          </CardTitle>
          <p className="text-gray-300 text-center text-sm">
            Sistemul de eliminare directă - 3 zile de competiție intensă
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  // Group matches by day
  const matchesByDay = matches.reduce((acc, match) => {
    const day = getDayFromPosition(match.bracketRound);
    if (!acc[day]) acc[day] = [];
    acc[day].push(match);
    return acc;
  }, {} as Record<string, Stage4PlayoffMatch[]>);

  // Sort days chronologically
  const sortedDays = Object.keys(matchesByDay).sort((a, b) => {
    const order = ['18 iulie 2025', '19 iulie 2025', '20 iulie 2025'];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <Card className="w-full border-primary/20 bg-gradient-to-br from-gray-900 to-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl text-white text-center">
          🏆 Stage 4 - Playoff (8 echipe)
        </CardTitle>
        <p className="text-gray-300 text-center text-sm">
          Sistemul de eliminare directă - Cei mai buni 8 din Stage 3 Swiss se luptă pentru titlu
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
            18 iulie - Sferturi
          </Badge>
          <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500/50">
            19 iulie - Semifinale
          </Badge>
          <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/50">
            20 iulie - Finala
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-2">🔄 Echipele calificate se calculează automat</p>
            <p className="text-gray-500 text-sm">
              Stage 4 Playoff va începe după finalizarea Stage 3 Swiss System
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Top 8 echipe din Stage 3 se vor califica în acest bracket de eliminare
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[900px] h-[500px] relative">
              {/* Tournament Bracket SVG - Linii de conectare */}
              <svg viewBox="0 0 900 500" className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <defs>
                  <linearGradient id="bracketGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.6"/>
                  </linearGradient>
                </defs>
                
                {/* Quarter-finals to Semi-finals connections */}
                <g stroke="url(#bracketGradient)" strokeWidth="3" fill="none">
                  {/* QF1 to SF1 */}
                  <path d="M 200 70 L 250 70 L 250 120 L 300 120" />
                  {/* QF2 to SF1 */}
                  <path d="M 200 150 L 250 150 L 250 120 L 300 120" />
                  
                  {/* QF3 to SF2 */}
                  <path d="M 200 260 L 250 260 L 250 310 L 300 310" />
                  {/* QF4 to SF2 */}
                  <path d="M 200 340 L 250 340 L 250 310 L 300 310" />
                  
                  {/* SF1 to Final */}
                  <path d="M 480 120 L 530 120 L 530 215 L 580 215" />
                  {/* SF2 to Final */}
                  <path d="M 480 310 L 530 310 L 530 215 L 580 215" />
                </g>
              </svg>

              {/* Quarter-finals (Stânga) */}
              <div className="absolute left-4 top-4 space-y-4" style={{ zIndex: 2 }}>
                <h3 className="text-lg font-bold text-blue-400 mb-4">🔵 Sferturi de finală</h3>
                {matches
                  .filter(m => m.bracketRound === 'quarterfinals')
                  .sort((a, b) => a.bracketPosition - b.bracketPosition)
                  .map((match) => (
                    <div key={match.id} className="w-44">
                      <Card className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 border-blue-400/50 hover:border-blue-300 transition-all">
                        <CardContent className="p-3">
                          <div className="text-xs text-blue-300 mb-2 font-semibold">QF{match.bracketPosition} • 18 iulie</div>
                          <div className="space-y-2">
                            <div className={`text-sm px-2 py-1 rounded transition-colors ${
                              match.winnerName === match.team1Name 
                                ? 'bg-green-600/40 text-green-200 border border-green-400/50 font-bold' 
                                : 'text-white hover:bg-gray-700/30'
                            }`}>
                              {match.winnerName === match.team1Name && '👑 '}
                              {match.team1Name}
                              {match.isPlayed && match.team1Score !== null && (
                                <span className="ml-2 text-xs bg-gray-600 px-1 rounded">{match.team1Score}</span>
                              )}
                            </div>
                            <div className={`text-sm px-2 py-1 rounded transition-colors ${
                              match.winnerName === match.team2Name 
                                ? 'bg-green-600/40 text-green-200 border border-green-400/50 font-bold' 
                                : 'text-white hover:bg-gray-700/30'
                            }`}>
                              {match.winnerName === match.team2Name && '👑 '}
                              {match.team2Name}
                              {match.isPlayed && match.team2Score !== null && (
                                <span className="ml-2 text-xs bg-gray-600 px-1 rounded">{match.team2Score}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-blue-200 mt-2 text-center">BO3</div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>

              {/* Semi-finals (Centru) */}
              <div className="absolute left-72 top-16 space-y-16" style={{ zIndex: 2 }}>
                <h3 className="text-lg font-bold text-orange-400 mb-4">🟠 Semifinale</h3>
                {matches
                  .filter(m => m.bracketRound === 'semifinals')
                  .sort((a, b) => a.bracketPosition - b.bracketPosition)
                  .map((match, index) => (
                    <div key={match.id} className="w-44">
                      <Card className="bg-gradient-to-r from-orange-900/40 to-orange-800/40 border-orange-400/50 hover:border-orange-300 transition-all">
                        <CardContent className="p-3">
                          <div className="text-xs text-orange-300 mb-2 font-semibold">SF{match.bracketPosition} • 19 iulie</div>
                          <div className="space-y-2">
                            <div className={`text-sm px-2 py-1 rounded transition-colors ${
                              match.winnerName === match.team1Name 
                                ? 'bg-green-600/40 text-green-200 border border-green-400/50 font-bold' 
                                : 'text-white hover:bg-gray-700/30'
                            }`}>
                              {match.winnerName === match.team1Name && '👑 '}
                              {match.team1Name || `Câștigător QF${index * 2 + 1}`}
                              {match.isPlayed && match.team1Score !== null && (
                                <span className="ml-2 text-xs bg-gray-600 px-1 rounded">{match.team1Score}</span>
                              )}
                            </div>
                            <div className={`text-sm px-2 py-1 rounded transition-colors ${
                              match.winnerName === match.team2Name 
                                ? 'bg-green-600/40 text-green-200 border border-green-400/50 font-bold' 
                                : 'text-white hover:bg-gray-700/30'
                            }`}>
                              {match.winnerName === match.team2Name && '👑 '}
                              {match.team2Name || `Câștigător QF${index * 2 + 2}`}
                              {match.isPlayed && match.team2Score !== null && (
                                <span className="ml-2 text-xs bg-gray-600 px-1 rounded">{match.team2Score}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-orange-200 mt-2 text-center">BO3</div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>

              {/* Final (Dreapta) */}
              <div className="absolute left-[560px] top-32" style={{ zIndex: 2 }}>
                <h3 className="text-lg font-bold text-red-400 mb-4">🔴 Marea Finală</h3>
                {matches
                  .filter(m => m.bracketRound === 'final')
                  .map((match) => (
                    <div key={match.id} className="w-48">
                      <Card className="bg-gradient-to-r from-red-900/40 to-red-800/40 border-red-400/50 hover:border-red-300 transition-all">
                        <CardContent className="p-4">
                          <div className="text-xs text-red-300 mb-2 font-semibold text-center">🏆 FINALA • 20 iulie</div>
                          <div className="space-y-2">
                            <div className={`text-sm px-2 py-2 rounded transition-colors ${
                              match.winnerName === match.team1Name 
                                ? 'bg-yellow-600/40 text-yellow-200 border border-yellow-400/50 font-bold' 
                                : 'text-white hover:bg-gray-700/30'
                            }`}>
                              {match.winnerName === match.team1Name && '🏆 '}
                              {match.team1Name || 'Câștigător SF1'}
                              {match.isPlayed && match.team1Score !== null && (
                                <span className="ml-2 text-xs bg-gray-600 px-1 rounded">{match.team1Score}</span>
                              )}
                            </div>
                            <div className={`text-sm px-2 py-2 rounded transition-colors ${
                              match.winnerName === match.team2Name 
                                ? 'bg-yellow-600/40 text-yellow-200 border border-yellow-400/50 font-bold' 
                                : 'text-white hover:bg-gray-700/30'
                            }`}>
                              {match.winnerName === match.team2Name && '🏆 '}
                              {match.team2Name || 'Câștigător SF2'}
                              {match.isPlayed && match.team2Score !== null && (
                                <span className="ml-2 text-xs bg-gray-600 px-1 rounded">{match.team2Score}</span>
                              )}
                            </div>
                          </div>
                          {match.winnerName && (
                            <div className="mt-3 text-center">
                              <Badge className="bg-yellow-600 text-white font-bold text-xs">
                                🏆 CAMPIONUL: {match.winnerName}
                              </Badge>
                            </div>
                          )}
                          <div className="text-xs text-red-200 mt-2 text-center">BO3</div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>

              {/* Legend/Info */}
              <div className="absolute bottom-4 left-4 right-4" style={{ zIndex: 2 }}>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-blue-300">Sferturi (18 iulie)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span className="text-orange-300">Semifinale (19 iulie)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-red-300">Finala (20 iulie)</span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <span className="mr-4">👑 = Câștigător</span>
                    <span>Toate meciurile sunt BO3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}