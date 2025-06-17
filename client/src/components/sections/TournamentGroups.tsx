import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface GroupTeam {
  id: number;
  teamId: number;
  teamName: string;
  teamLogo: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  roundDifference: number;
  points: number;
  position: number;
  lastUpdated: string;
}

interface MatchResult {
  id: number;
  groupName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  winnerId: number | null;
  matchDate: string;
}

interface TournamentGroup {
  id: number;
  groupName: string;
  groupDisplayName: string;
  tournament: string;
  isActive: boolean;
  teams: GroupTeam[];
}

interface TournamentGroupsProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function TournamentGroups({ isExpanded, onToggle }: TournamentGroupsProps) {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);
  const queryClient = useQueryClient();

  // Fetch tournament groups from API
  const { data: groups = [], isLoading, error, refetch } = useQuery<TournamentGroup[]>({
    queryKey: ['/api/tournament-groups'],
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch match results from API
  const { data: matchResults = [] } = useQuery<MatchResult[]>({
    queryKey: ['/api/match-results'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { toast } = useToast();

  // Manual sync mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/sync-groups', { method: 'POST' });
      if (!response.ok) throw new Error('Sync failed');
      return response.json();
    },
    onSuccess: (data) => {
      // Force refresh of all tournament-related data
      queryClient.invalidateQueries({ queryKey: ['/api/tournament-groups'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/group-config'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/group-standings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      
      // Force refetch immediately
      refetch();
      
      // Show success notification
      toast({
        title: "Sincronizare completă",
        description: `Grupele au fost actualizate cu succes. ${data.totalGroups} grupe sincronizate.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare sincronizare",
        description: "Nu s-au putut actualiza grupele. Încercați din nou.",
        variant: "destructive",
      });
    },
  });

  const handleManualSync = () => {
    syncMutation.mutate();
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper function to get results for a specific group
  const getResultsForGroup = (groupName: string): MatchResult[] => {
    return matchResults.filter(result => result.groupName === groupName)
      .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());
  };

  return (
    <div className="py-8 sm:py-16 bg-gradient-to-b from-darkBg to-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Button 
            onClick={onToggle}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            {isExpanded ? (
              <>
                {t('tournament.groups.button')}
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                {t('tournament.groups.button')}
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>

          {isExpanded && (
            <Button
              onClick={handleManualSync}
              disabled={syncMutation.isPending}
              variant="outline"
              size="sm"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
              {syncMutation.isPending ? 'Sincronizare...' : 'Sincronizare'}
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-300">{t('tournament.groups.loading')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{t('tournament.groups.error')}</p>
                <Button onClick={() => refetch()} variant="outline">
                  Încearcă din nou
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groups.map((group) => (
                    <div key={group.id} className="group">
                      <div className="bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/30 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-200">
                        {/* Group Header */}
                        <div className="bg-gradient-to-r from-primary/30 to-blue-600/30 p-4 border-b border-primary/20">
                          <h3 className="text-lg font-bold text-white mb-1">
                            {group.groupDisplayName}
                          </h3>
                          <p className="text-sm text-gray-300">
                            {group.teams.length} {group.teams.length === 1 ? 'echipă' : 'echipe'} • {' '}
                            {t('tournament.groups.standings')}
                          </p>
                        </div>

                        {/* Teams List */}
                        <div className="p-4">
                          {group.teams.length === 0 ? (
                            <div className="text-center text-gray-400 py-4">
                              <p className="text-sm">Nu există echipe în această grupă încă</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {group.teams
                                .sort((a, b) => {
                                  // Sort by position (ascending), then by points (descending), then by round difference (descending)
                                  if (a.position !== b.position) return a.position - b.position;
                                  if (a.points !== b.points) return b.points - a.points;
                                  return b.roundDifference - a.roundDifference;
                                })
                                .map((team, index) => (
                                <div 
                                  key={team.id}
                                  className={`flex items-center justify-between p-2 rounded transition-colors ${
                                    // Top 3 teams advance for groups with 6 teams, top 4 for group with 7 teams
                                    (group.teams.length <= 6 && team.position <= 3) || 
                                    (group.teams.length === 7 && team.position <= 4)
                                      ? 'bg-green-600/20 border border-green-500/30' 
                                      : 'bg-slate-700/30 border border-slate-600/30'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                                    <span className="text-xs text-gray-400 w-4 flex-shrink-0">
                                      {team.position}.
                                    </span>
                                    <div className="w-8 h-8 rounded overflow-hidden bg-slate-600 flex-shrink-0">
                                      <img 
                                        src={team.teamLogo} 
                                        alt={team.teamName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                    <span className="text-white text-sm font-medium truncate">
                                      {team.teamName}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-xs">
                                    <span className={`px-2 py-1 rounded ${
                                      team.points > 0 ? 'bg-green-600/30 text-green-400' :
                                      'bg-gray-600/30 text-gray-400'
                                    }`}>
                                      {team.points}pts
                                    </span>
                                    <span className="text-slate-400 min-w-[3rem] text-right">
                                      {team.wins}-{team.losses}
                                    </span>
                                    <span className="text-slate-400 min-w-[2.5rem] text-right">
                                      {team.roundDifference >= 0 ? '+' : ''}{team.roundDifference}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}


                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Layout cu grupe și reguli pe același rând */}
                <div className="mt-8 grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                  {/* Grupele continuă în partea stângă */}
                  <div className="xl:col-span-3">
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-600/30 border border-green-500/50 rounded"></div>
                        <span className="text-white">Avansează în playoff</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-slate-700/30 border border-slate-600/50 rounded"></div>
                        <span className="text-white">Eliminat</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reguli în partea dreaptă - mai înguste */}
                  <div className="xl:col-span-1">
                    <div className="bg-slate-800/50 rounded-lg p-3 h-fit">
                      <h3 className="text-white font-semibold mb-3 text-center text-sm">Reguli de Avansare în Playoff</h3>
                      <div className="space-y-2 text-xs">
                        <div className="bg-green-600/20 rounded p-2 border border-green-500/30">
                          <div className="font-medium text-green-400 mb-1">Grupe A, B, C, D, E, F</div>
                          <div className="text-gray-300 text-xs">6 echipe per grupă</div>
                          <div className="text-white font-semibold text-xs">Primele 3 echipe avansează</div>
                        </div>
                        <div className="bg-amber-600/20 rounded p-2 border border-amber-500/30">
                          <div className="font-medium text-amber-400 mb-1">Grupa G</div>
                          <div className="text-gray-300 text-xs">7 echipe în grupă</div>
                          <div className="text-white font-semibold text-xs">Primele 4 echipe avansează</div>
                        </div>
                      </div>
                      <div className="mt-2 text-center text-xs text-gray-400">
                        <div>Total: 22 echipe avansează în playoff (3×6 + 4×1 = 22)</div>
                        <div className="mt-1">Format: CS2 BO1 (Best of 1) - fără egaluri</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Last updated info */}
                <div className="mt-4 text-center text-xs text-gray-400">
                  Ultima actualizare: {new Date().toLocaleString('ro-RO')}
                  {syncMutation.isPending && <span className="ml-2">Sincronizare în curs...</span>}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}