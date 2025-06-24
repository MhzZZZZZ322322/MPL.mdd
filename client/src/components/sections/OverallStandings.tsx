import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Trophy, Star, Zap } from 'lucide-react';

interface TeamStanding {
  id: number;
  name: string;
  logoUrl: string;
  groupName: string;
  points: number;
  wins: number;
  losses: number;
  roundDifference: number;
  roundsWon: number;
  roundsLost: number;
}

interface MatchResult {
  id: number;
  groupName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  technicalWin?: boolean;
  technicalWinner?: string;
}

interface Team {
  id: number;
  name: string;
  logoUrl: string;
}

interface GroupConfig {
  groupName: string;
  displayName: string;
  teams: Team[];
}

export default function OverallStandings() {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  // Fetch data with aggressive refresh for real-time updates
  const { data: matchResults = [] } = useQuery<MatchResult[]>({
    queryKey: ['/api/match-results'],
    refetchInterval: 15000, // Faster refresh for match results
    staleTime: 0, // Always consider data stale
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
    refetchInterval: 30000,
    staleTime: 0,
  });

  const { data: groupConfig = [] } = useQuery<GroupConfig[]>({
    queryKey: ['/api/admin/group-config'],
    refetchInterval: 30000,
    staleTime: 0,
  });

  // Function to get team logo
  const getTeamLogo = (teamName: string): string => {
    const team = teams.find(t => t.name === teamName);
    return team?.logoUrl || '/team-logos/default.png';
  };

  // Calculate overall standings
  const calculateOverallStandings = (): TeamStanding[] => {
    const teamStats: { [key: string]: TeamStanding } = {};

    // Debug log for data synchronization
    if (matchResults.length > 0) {
      console.log(`[OverallStandings] Recalculating with ${matchResults.length} match results and ${groupConfig.length} groups`);
    }

    // Initialize all teams from group config
    groupConfig.forEach(group => {
      group.teams.forEach(team => {
        if (!teamStats[team.name]) {
          teamStats[team.name] = {
            id: team.id,
            name: team.name,
            logoUrl: team.logoUrl,
            groupName: group.groupName,
            points: 0,
            wins: 0,
            losses: 0,
            roundDifference: 0,
            roundsWon: 0,
            roundsLost: 0
          };
        }
      });
    });

    // Process match results
    matchResults.forEach(match => {
      const team1 = teamStats[match.team1Name];
      const team2 = teamStats[match.team2Name];

      if (!team1 || !team2) return;

      // Add rounds
      team1.roundsWon += match.team1Score;
      team1.roundsLost += match.team2Score;
      team2.roundsWon += match.team2Score;
      team2.roundsLost += match.team1Score;

      // Calculate round difference
      team1.roundDifference = team1.roundsWon - team1.roundsLost;
      team2.roundDifference = team2.roundsWon - team2.roundsLost;

      // Determine winner and assign points
      let winner: string | null = null;

      if (match.technicalWin && match.technicalWinner) {
        winner = match.technicalWinner;
      } else if (match.team1Score > match.team2Score) {
        winner = match.team1Name;
      } else if (match.team2Score > match.team1Score) {
        winner = match.team2Name;
      }

      if (winner === match.team1Name) {
        team1.points += 3;
        team1.wins += 1;
        team2.losses += 1;
      } else if (winner === match.team2Name) {
        team2.points += 3;
        team2.wins += 1;
        team1.losses += 1;
      }
    });

    // Convert to array and sort
    return Object.values(teamStats)
      .sort((a, b) => {
        // Sort only by round difference (higher difference = better position)
        return b.roundDifference - a.roundDifference;
      });
  };

  const standings = calculateOverallStandings();

  // Force refresh when new match results are added
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/match-results'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/group-config'] });
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
    }, 5000); // Check for updates every 5 seconds for faster response

    return () => clearInterval(interval);
  }, [queryClient]);

  const getPositionStyle = (position: number) => {
    if (position <= 11) {
      return 'bg-green-500/20 text-green-400 border-green-500/30'; // Direct la Stage 3
    } else if (position <= 21) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'; // Stage 2
    } else {
      return 'bg-red-500/20 text-red-400 border-red-500/30'; // Eliminat
    }
  };

  const getPositionIcon = (position: number) => {
    if (position <= 11) {
      return <Star className="w-4 h-4" />;
    } else if (position <= 21) {
      return <Zap className="w-4 h-4" />;
    } else {
      return null;
    }
  };

  const getPositionText = (position: number) => {
    if (position <= 11) {
      return 'Stage 3 Direct';
    } else if (position <= 21) {
      return 'Stage 2';
    } else {
      return 'Eliminat';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 h-auto justify-between hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-orange-400" />
            <div className="text-left">
              <h2 className="text-xl font-bold text-white">Clasament General</h2>
              <p className="text-sm text-gray-400">
                Toate echipele din turneu • Top 11 → Stage 3 • Locurile 12-21 → Stage 2
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </Button>

        {isExpanded && (
          <div className="border-t border-slate-700/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-sm font-medium text-gray-300">#</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-300">Echipă</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-300">Grupa</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-300">Puncte</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-300">V-Î</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-300">Runde</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-300">Diferența</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-300">Calificare</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => {
                    const position = index + 1;
                    return (
                      <tr
                        key={team.name}
                        className={`border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors ${
                          position <= 11 ? 'bg-green-500/5' : 
                          position <= 21 ? 'bg-yellow-500/5' : 
                          'bg-red-500/5'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold ${getPositionStyle(position)}`}>
                            {position}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={team.logoUrl}
                              alt={team.name}
                              className="w-8 h-8 rounded-sm object-cover flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/team-logos/default.png';
                              }}
                            />
                            <span className="text-white font-medium">{team.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                            Grupa {team.groupName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-white font-bold text-lg">{team.points}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-300 text-sm">
                            {team.wins}-{team.losses}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-300 text-sm">
                            {team.roundsWon}-{team.roundsLost}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${
                            team.roundDifference > 0 ? 'text-green-400' : 
                            team.roundDifference < 0 ? 'text-red-400' : 
                            'text-gray-400'
                          }`}>
                            {team.roundDifference > 0 ? '+' : ''}{team.roundDifference}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${getPositionStyle(position)}`}>
                            {getPositionIcon(position)}
                            <span>{getPositionText(position)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {standings.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nu există rezultate disponibile pentru clasament</p>
              </div>
            )}

            <div className="p-4 bg-slate-800/30 border-t border-slate-700/30">
              <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-green-500/30 border border-green-500/50"></div>
                  <span>Locurile 1-11: Calificare directă în Stage 3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500/50"></div>
                  <span>Locurile 12-21: Calificare în Stage 2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50"></div>
                  <span>Locurile 22+: Eliminare</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}