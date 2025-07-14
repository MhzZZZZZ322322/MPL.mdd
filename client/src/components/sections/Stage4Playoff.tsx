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

const getBracketPositionInfo = (position: string) => {
  const positions: Record<string, { stage: string; match: string; color: string }> = {
    // Quarter-finals (8 teams → 4 teams)
    'QF1': { stage: 'Sferturile de finală', match: 'Meciul 1', color: 'bg-blue-500' },
    'QF2': { stage: 'Sferturile de finală', match: 'Meciul 2', color: 'bg-blue-500' },
    'QF3': { stage: 'Sferturile de finală', match: 'Meciul 3', color: 'bg-blue-500' },
    'QF4': { stage: 'Sferturile de finală', match: 'Meciul 4', color: 'bg-blue-500' },
    
    // Semi-finals (4 teams → 2 teams)
    'SF1': { stage: 'Semifinalele', match: 'Meciul 1', color: 'bg-orange-500' },
    'SF2': { stage: 'Semifinalele', match: 'Meciul 2', color: 'bg-orange-500' },
    
    // Final (2 teams → 1 team)
    'FINAL': { stage: 'Finala', match: 'Marea Finală', color: 'bg-red-500' }
  };
  
  return positions[position] || { stage: 'Necunoscut', match: 'Necunoscut', color: 'bg-gray-500' };
};

const getDayFromPosition = (position: string): string => {
  // Day 1 (18 iulie): Quarter-finals
  if (position.startsWith('QF')) return '18 iulie 2025';
  // Day 2 (19 iulie): Semi-finals  
  if (position.startsWith('SF')) return '19 iulie 2025';
  // Day 3 (20 iulie): Final
  if (position === 'FINAL') return '20 iulie 2025';
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
    const day = getDayFromPosition(match.bracketPosition);
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
          sortedDays.map(day => (
            <div key={day} className="space-y-3">
              <h3 className="text-lg font-semibold text-white border-b border-primary/30 pb-2">
                📅 {day}
              </h3>
              <div className="grid gap-3">
                {matchesByDay[day]
                  .sort((a, b) => a.bracketPosition.localeCompare(b.bracketPosition))
                  .map(match => {
                    const positionInfo = getBracketPositionInfo(match.bracketPosition);
                    return (
                      <Card 
                        key={match.id}
                        className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-primary/30 hover:border-primary/50 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className={`${positionInfo.color} text-white px-3 py-1`}>
                                {positionInfo.stage}
                              </Badge>
                              <span className="text-gray-300 text-sm">
                                {positionInfo.match}
                              </span>
                            </div>
                            
                            {match.matchTime && (
                              <Badge variant="outline" className="text-primary border-primary/50">
                                {match.matchTime}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="mt-3">
                            {match.team1Name && match.team2Name ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className={`font-medium ${match.winnerName === match.team1Name ? 'text-yellow-400' : 'text-white'}`}>
                                    {match.winnerName === match.team1Name && '🏆 '}
                                    {match.team1Name}
                                  </span>
                                  {match.isPlayed && match.team1Score !== null && (
                                    <Badge variant="secondary" className="text-sm">
                                      {match.team1Score}
                                    </Badge>
                                  )}
                                </div>
                                
                                <span className="text-gray-400 mx-4">VS</span>
                                
                                <div className="flex items-center gap-3">
                                  {match.isPlayed && match.team2Score !== null && (
                                    <Badge variant="secondary" className="text-sm">
                                      {match.team2Score}
                                    </Badge>
                                  )}
                                  <span className={`font-medium ${match.winnerName === match.team2Name ? 'text-yellow-400' : 'text-white'}`}>
                                    {match.winnerName === match.team2Name && '🏆 '}
                                    {match.team2Name}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-gray-400">
                                <p className="text-sm">Echipele se vor anunța după finalizarea Stage 3</p>
                              </div>
                            )}
                            
                            {match.faceitUrl && (
                              <div className="mt-3 text-center">
                                <a 
                                  href={match.faceitUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 text-sm underline"
                                >
                                  🔗 Vezi pe Faceit
                                </a>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}