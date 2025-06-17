import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const { data: groups = [], isLoading, error } = useQuery<TournamentGroup[]>({
    queryKey: ['/api/tournament-groups'],
    refetchInterval: 60000, // Refetch every minute
  });

  // Manual sync mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/sync-groups', { method: 'POST' });
      if (!response.ok) throw new Error('Sync failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tournament-groups'] });
    },
  });

  const handleManualSync = () => {
    syncMutation.mutate();
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
              className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
              Sync
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="animate-in slide-in-from-top duration-300">
            {isLoading ? (
              <div className="text-center text-white py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2">Se încarcă grupele...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-8">
                <p>Eroare la încărcarea grupelor. Se folosesc date locale.</p>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>Nu există grupe configurate încă.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {groups.map((group) => (
                    <div key={group.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden">
                      {/* Group Header */}
                      <div className="bg-gradient-to-r from-primary/80 to-primary/60 px-4 py-3 border-b border-slate-600">
                        <h3 className="text-white font-bold text-lg text-center">
                          {group.groupDisplayName}
                        </h3>
                        <p className="text-white/80 text-sm text-center mt-1">
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
                                className={`flex items-center justify-between p-2 rounded ${
                                  index === 0 ? 'bg-green-600/20 border border-green-500/30' :
                                  index === 1 ? 'bg-blue-600/20 border border-blue-500/30' :
                                  index >= group.teams.length - 2 ? 'bg-red-600/20 border border-red-500/30' :
                                  'bg-slate-700/30 border border-slate-600/30'
                                }`}
                              >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <span className="text-white font-bold text-sm w-6 text-center">
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
                                    {team.wins}-{team.draws}-{team.losses}
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
                  ))}
                </div>
                
                {/* Legend */}
                <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-600/30 border border-green-500/50 rounded"></div>
                    <span className="text-white">{t('tournament.groups.legend.advance')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-600/30 border border-blue-500/50 rounded"></div>
                    <span className="text-white">{t('tournament.groups.legend.playoffs')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600/30 border border-red-500/50 rounded"></div>
                    <span className="text-white">{t('tournament.groups.legend.eliminated')}</span>
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