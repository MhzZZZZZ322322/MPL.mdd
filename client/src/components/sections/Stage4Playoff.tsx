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
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Quarter-finals (Coloana 1-4) */}
              <div className="lg:col-span-4">
                <h3 className="text-lg font-bold text-blue-400 mb-4 text-center">Sferturi de finală</h3>
                <div className="space-y-4">
                  {matches
                    .filter(m => m.bracketRound === 'quarterfinals')
                    .sort((a, b) => a.bracketPosition - b.bracketPosition)
                    .map((match) => (
                      <div key={match.id}>
                        <Card className="bg-gradient-to-r from-blue-900/60 to-blue-800/60 border-blue-400/50 hover:border-blue-300 transition-all">
                          <CardContent className="p-4">
                            <div className="text-xs text-blue-300 mb-3 font-semibold text-center">
                              QF{match.bracketPosition} • 18 iulie
                            </div>
                            <div className="space-y-2">
                              <div className={`text-sm px-3 py-2 rounded transition-colors ${
                                match.winnerName === match.team1Name 
                                  ? 'bg-green-600/50 text-green-200 font-bold border border-green-400/50' 
                                  : 'text-white bg-gray-700/40'
                              }`}>
                                {match.winnerName === match.team1Name && '👑 '}
                                {match.team1Name}
                                {match.isPlayed && match.team1Score !== null && (
                                  <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded">{match.team1Score}</span>
                                )}
                              </div>
                              <div className="text-center text-gray-400 text-xs">VS</div>
                              <div className={`text-sm px-3 py-2 rounded transition-colors ${
                                match.winnerName === match.team2Name 
                                  ? 'bg-green-600/50 text-green-200 font-bold border border-green-400/50' 
                                  : 'text-white bg-gray-700/40'
                              }`}>
                                {match.winnerName === match.team2Name && '👑 '}
                                {match.team2Name}
                                {match.isPlayed && match.team2Score !== null && (
                                  <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded">{match.team2Score}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-blue-200 mt-3 text-center font-medium">BO3</div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                </div>
              </div>

              {/* Semi-finals (Coloana 5-8) */}
              <div className="lg:col-span-4">
                <h3 className="text-lg font-bold text-orange-400 mb-4 text-center">Semifinale</h3>
                <div className="space-y-8">
                  {matches
                    .filter(m => m.bracketRound === 'semifinals')
                    .sort((a, b) => a.bracketPosition - b.bracketPosition)
                    .map((match, index) => (
                      <div key={match.id}>
                        <Card className="bg-gradient-to-r from-orange-900/60 to-orange-800/60 border-orange-400/50 hover:border-orange-300 transition-all">
                          <CardContent className="p-4">
                            <div className="text-xs text-orange-300 mb-3 font-semibold text-center">
                              SF{match.bracketPosition} • 19 iulie
                            </div>
                            <div className="space-y-2">
                              <div className={`text-sm px-3 py-2 rounded transition-colors ${
                                match.winnerName === match.team1Name 
                                  ? 'bg-green-600/50 text-green-200 font-bold border border-green-400/50' 
                                  : 'text-white bg-gray-700/40'
                              }`}>
                                {match.winnerName === match.team1Name && '👑 '}
                                {match.team1Name || (match.bracketPosition === 1 ? `Câștigător QF1` : `Câștigător QF3`)}
                                {match.isPlayed && match.team1Score !== null && (
                                  <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded">{match.team1Score}</span>
                                )}
                              </div>
                              <div className="text-center text-gray-400 text-xs">VS</div>
                              <div className={`text-sm px-3 py-2 rounded transition-colors ${
                                match.winnerName === match.team2Name 
                                  ? 'bg-green-600/50 text-green-200 font-bold border border-green-400/50' 
                                  : 'text-white bg-gray-700/40'
                              }`}>
                                {match.winnerName === match.team2Name && '👑 '}
                                {match.team2Name || (match.bracketPosition === 1 ? `Câștigător QF2` : `Câștigător QF4`)}
                                {match.isPlayed && match.team2Score !== null && (
                                  <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded">{match.team2Score}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-orange-200 mt-3 text-center font-medium">BO3</div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                </div>
              </div>

              {/* Final (Coloana 9-12) */}
              <div className="lg:col-span-4">
                <h3 className="text-lg font-bold text-red-400 mb-4 text-center">Marea Finală</h3>
                <div className="flex justify-center">
                  {matches
                    .filter(m => m.bracketRound === 'final')
                    .map((match) => (
                      <div key={match.id} className="w-full max-w-sm">
                        <Card className="bg-gradient-to-r from-red-900/60 to-red-800/60 border-red-400/50 hover:border-red-300 transition-all">
                          <CardContent className="p-5">
                            <div className="text-sm text-red-300 mb-4 font-bold text-center">
                              🏆 FINALA • 20 iulie
                            </div>
                            <div className="space-y-3">
                              <div className={`text-sm px-3 py-3 rounded transition-colors ${
                                match.winnerName === match.team1Name 
                                  ? 'bg-yellow-600/50 text-yellow-200 font-bold border border-yellow-400/50' 
                                  : 'text-white bg-gray-700/40'
                              }`}>
                                {match.winnerName === match.team1Name && '🏆 '}
                                {match.team1Name || 'Câștigător SF1'}
                                {match.isPlayed && match.team1Score !== null && (
                                  <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded">{match.team1Score}</span>
                                )}
                              </div>
                              <div className="text-center text-gray-400 text-sm font-bold">VS</div>
                              <div className={`text-sm px-3 py-3 rounded transition-colors ${
                                match.winnerName === match.team2Name 
                                  ? 'bg-yellow-600/50 text-yellow-200 font-bold border border-yellow-400/50' 
                                  : 'text-white bg-gray-700/40'
                              }`}>
                                {match.winnerName === match.team2Name && '🏆 '}
                                {match.team2Name || 'Câștigător SF2'}
                                {match.isPlayed && match.team2Score !== null && (
                                  <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded">{match.team2Score}</span>
                                )}
                              </div>
                            </div>
                            {match.winnerName && (
                              <div className="mt-4 text-center">
                                <Badge className="bg-yellow-600 text-white font-bold text-sm px-4 py-2">
                                  🏆 CAMPIONUL: {match.winnerName}
                                </Badge>
                              </div>
                            )}
                            <div className="text-sm text-red-200 mt-4 text-center font-medium">BO3</div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 text-center">
              <div className="flex justify-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  Sferturi (18 iulie)
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  Semifinale (19 iulie)
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  Finala (20 iulie)
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">👑 = Câștigător • 🏆 = Campion • Toate meciurile sunt BO3</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}