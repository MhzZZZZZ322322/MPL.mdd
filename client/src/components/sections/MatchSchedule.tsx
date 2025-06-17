import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
interface MatchResult {
  id: number;
  groupName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
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
  day: string;
  result?: MatchResult;
}

export default function MatchSchedule() {

  const { data: matchResults = [], isLoading: loadingResults } = useQuery<MatchResult[]>({
    queryKey: ["/api/match-results"],
  });

  const { data: teams = [], isLoading: loadingTeams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Generează meciurile programate pentru toate grupele
  const generateScheduledMatches = (): ScheduledMatch[] => {
    const groupTeams = {
      'A': ['Auratix', 'Barbosii', 'Bloody', 'Bobb3rs', 'BPSP', 'Brigada'],
      'B': ['Cipok', 'Coli', 'Cucumba', 'Japon', 'Killuminaty', 'KostiujeniKlinik'],
      'C': ['BaitMD', 'Bloody Mafia', 'Brokefire', 'Carpatina', 'CGS', 'FalcoN'],
      'D': ['Falcons', 'Gamerz', 'Imparable', 'Snipers', 'TSM Black', 'VeryGoodTeam'],
      'E': ['Anonym', 'Blacklist', 'Crasat', 'Evolution', 'FearLess', 'TuranTeam'],
      'F': ['CadianTeam', 'Kamikaze Clan', 'Legion', 'NewGen', 'TheStrong', 'Vinceremos'],
      'G': ['Adrenalin', 'InfraRed', 'SAP0NEL', 'Trigger', 'uGOD', 'WinSpirit', 'Xtreme Players']
    };

    const matches: ScheduledMatch[] = [];
    const days = ['Ziua 1', 'Ziua 2', 'Ziua 3', 'Ziua 4', 'Ziua 5'];
    
    Object.entries(groupTeams).forEach(([group, teamList]) => {
      // Generează toate combinațiile posibile de meciuri
      for (let i = 0; i < teamList.length; i++) {
        for (let j = i + 1; j < teamList.length; j++) {
          const dayIndex = Math.floor(matches.filter(m => m.group === group).length / 3) % days.length;
          
          const existingResult = matchResults.find(result => 
            result.groupName === group &&
            ((result.team1Name === teamList[i] && result.team2Name === teamList[j]) ||
             (result.team1Name === teamList[j] && result.team2Name === teamList[i]))
          );

          matches.push({
            team1: teamList[i],
            team2: teamList[j],
            group,
            day: days[dayIndex],
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
    if (!acc[match.group]) acc[match.group] = {};
    if (!acc[match.group][match.day]) acc[match.group][match.day] = [];
    acc[match.group][match.day].push(match);
    return acc;
  }, {} as Record<string, Record<string, ScheduledMatch[]>>);

  if (loadingResults || loadingTeams) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">
          Programul Meciurilor
        </h2>
        <p className="text-muted-foreground">
          Toate meciurile programate și rezultatele din faza grupelor
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {Object.entries(groupedMatches).map(([group, days]) => (
          <Card key={group} className="bg-card/50 backdrop-blur-sm border-border/50 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">
                  Grupa {group}
                </h3>
                <Badge variant="outline" className="bg-primary/10">
                  {Object.values(days).flat().length} meciuri
                </Badge>
              </div>

              {Object.entries(days).map(([day, matches]) => (
                <div key={day} className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground border-b border-border/50 pb-1">
                    {day}
                  </h4>
                  
                  <div className="space-y-2">
                    {matches.slice(0, 6).map((match, index) => (
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
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}