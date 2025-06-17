import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchResult {
  id: number;
  groupName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  streamUrl?: string;
  matchDate: string;
}

interface Team {
  id: number;
  name: string;
  logoUrl: string;
}

interface ScheduledMatch {
  team1: string;
  team2: string;
  group: string;
  result?: MatchResult;
}

export default function MatchSchedule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: matchResults = [], isLoading: loadingResults, refetch: refetchResults } = useQuery<MatchResult[]>({
    queryKey: ["/api/match-results"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: teams = [], isLoading: loadingTeams, refetch: refetchTeams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Fetch current group configuration from API
  const { data: groupConfig = [], isLoading: loadingGroups, refetch: refetchGroups } = useQuery<any[]>({
    queryKey: ["/api/admin/group-config"],
    refetchInterval: 60000, // Refetch every minute
  });

  // Sync mutation to refresh all match data
  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/sync-groups', { method: 'POST' });
      if (!response.ok) throw new Error('Sync failed');
      return response.json();
    },
    onSuccess: (data) => {
      // Force refresh of all match-related data
      queryClient.invalidateQueries({ queryKey: ["/api/match-results"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/group-config"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tournament-groups"] });
      
      // Force refetch immediately
      refetchResults();
      refetchGroups();
      refetchTeams();
      
      toast({
        title: "Sincronizare completă",
        description: `Meciurile au fost actualizate cu succes. ${data.totalGroups} grupe sincronizate.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare sincronizare",
        description: "Nu s-au putut actualiza meciurile. Încercați din nou.",
        variant: "destructive",
      });
    },
  });

  const handleSync = () => {
    syncMutation.mutate();
  };

  // Generează meciurile programate pe baza configurației curente din grupe
  const generateScheduledMatches = (): ScheduledMatch[] => {
    if (!Array.isArray(groupConfig) || groupConfig.length === 0) return [];
    
    // Construiește grupele pe baza configurației din baza de date
    const groupTeams: Record<string, string[]> = {};
    groupConfig.forEach((group: any) => {
      if (group && group.groupName && Array.isArray(group.teams)) {
        groupTeams[group.groupName] = group.teams.map((team: any) => team.name);
      }
    });

    const matches: ScheduledMatch[] = [];
    
    Object.entries(groupTeams).forEach(([group, teamList]) => {
      for (let i = 0; i < teamList.length; i++) {
        for (let j = i + 1; j < teamList.length; j++) {
          const existingResult = matchResults.find(result => 
            result.groupName === group &&
            ((result.team1Name === teamList[i] && result.team2Name === teamList[j]) ||
             (result.team1Name === teamList[j] && result.team2Name === teamList[i]))
          );

          matches.push({
            team1: teamList[i],
            team2: teamList[j],
            group,
            result: existingResult
          });
        }
      }
    });

    return matches;
  };

  const getTeamLogo = (teamName: string): string => {
    const team = teams.find(t => t.name === teamName);
    return team?.logoUrl || '/team-logos/default.png';
  };

  const scheduledMatches = generateScheduledMatches();
  const groupedMatches = scheduledMatches.reduce((acc, match) => {
    if (!acc[match.group]) acc[match.group] = [];
    acc[match.group].push(match);
    return acc;
  }, {} as Record<string, ScheduledMatch[]>);

  if (loadingResults || loadingTeams || loadingGroups) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with sync button aligned right like groups */}
      <div className="flex justify-between items-center mb-6">
        <div></div> {/* Empty div for spacing */}
        <Button
          onClick={handleSync}
          disabled={syncMutation.isPending}
          variant="outline"
          size="sm"
          className="border-primary/50 text-primary hover:bg-primary/10"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          {syncMutation.isPending ? 'Sincronizare...' : 'Sincronizare'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {Object.entries(groupedMatches).map(([group, matches]) => (
          <Card key={group} className="bg-card/50 backdrop-blur-sm border-border/50 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">
                  Grupa {group}
                </h3>
                <Badge variant="outline" className="bg-primary/10">
                  {matches.length} meciuri
                </Badge>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {matches
                  .sort((a, b) => {
                    // Meciurile jucate (cu rezultate) în partea de sus
                    if (a.result && !b.result) return -1;
                    if (!a.result && b.result) return 1;
                    return 0;
                  })
                  .map((match, index) => (
                  <div
                    key={`${match.team1}-${match.team2}-${index}`}
                    className="flex items-center justify-between bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    {/* Echipa 1 */}
                    <div className="flex items-center space-x-2 flex-1">
                      <img
                        src={getTeamLogo(match.team1)}
                        alt={match.team1}
                        className="w-6 h-6 rounded-sm object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/team-logos/default.png';
                        }}
                      />
                      <span className="text-sm font-medium truncate">
                        {match.team1}
                      </span>
                    </div>

                    {/* Scor */}
                    <div className="flex items-center space-x-2 px-3">
                      {match.result ? (
                        <div className="flex items-center space-x-1 text-sm font-bold">
                          <span className={match.result.team1Score > match.result.team2Score ? 'text-green-400' : 'text-red-400'}>
                            {match.result.team1Score}
                          </span>
                          <span className="text-muted-foreground">-</span>
                          <span className={match.result.team2Score > match.result.team1Score ? 'text-green-400' : 'text-red-400'}>
                            {match.result.team2Score}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <span>-</span>
                          <span>vs</span>
                          <span>-</span>
                        </div>
                      )}
                    </div>

                    {/* Echipa 2 */}
                    <div className="flex items-center space-x-2 flex-1 justify-end">
                      <span className="text-sm font-medium truncate">
                        {match.team2}
                      </span>
                      <img
                        src={getTeamLogo(match.team2)}
                        alt={match.team2}
                        className="w-6 h-6 rounded-sm object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/team-logos/default.png';
                        }}
                      />
                    </div>

                    {/* Faceit button */}
                    {match.result?.streamUrl && (
                      <div className="ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(match.result!.streamUrl!, '_blank')}
                          className="h-6 w-6 p-0 text-orange-500 hover:text-orange-400 hover:bg-transparent"
                          title="Vezi statistici și demo pe Faceit"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                            <path d="M14.4 10.8c-.8-.8-2.1-.8-2.9 0-.8.8-.8 2.1 0 2.9.8.8 2.1.8 2.9 0 .8-.8.8-2.1 0-2.9zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
                          </svg>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}