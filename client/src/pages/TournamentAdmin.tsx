import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trophy, Users, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchResult {
  team1: string;
  team2: string;
  team1Score: number;
  team2Score: number;
  groupName: string;
}

interface GroupStanding {
  position: number;
  teamName: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  roundDifference: number;
  points: number;
}

export default function TournamentAdmin() {
  const [newMatch, setNewMatch] = useState<MatchResult>({
    team1: '',
    team2: '',
    team1Score: 0,
    team2Score: 0,
    groupName: 'A'
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch teams
  const { data: teams = [] } = useQuery<any[]>({
    queryKey: ['/api/teams'],
  });

  // Fetch current standings
  const { data: standings = [], isLoading: standingsLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/group-standings'],
    refetchInterval: 30000,
  });

  // Add match result mutation
  const addMatchMutation = useMutation({
    mutationFn: async (match: MatchResult) => {
      const response = await fetch('/api/admin/add-match-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(match),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/group-standings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tournament-groups'] });
      toast({
        title: "Rezultat adăugat",
        description: "Meciul a fost înregistrat și clasamentul actualizat",
      });
      setNewMatch({
        team1: '',
        team2: '',
        team1Score: 0,
        team2Score: 0,
        groupName: 'A'
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Initialize groups mutation
  const initGroupsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/initialize-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to initialize groups');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/group-standings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tournament-groups'] });
      toast({
        title: "Grupe inițializate",
        description: "Sistemul de grupe a fost configurat cu toate echipele",
      });
    },
  });

  // Reset all results mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/reset-tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to reset tournament');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/group-standings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tournament-groups'] });
      toast({
        title: "Turneu resetat",
        description: "Toate rezultatele au fost șterse",
      });
    },
  });

  const handleAddMatch = () => {
    if (newMatch.team1 && newMatch.team2 && newMatch.team1 !== newMatch.team2) {
      // Validate CS2 score format (first to 16 rounds wins)
      if (newMatch.team1Score < 16 && newMatch.team2Score < 16) {
        toast({
          title: "Scor invalid",
          description: "În CS2, o echipă trebuie să câștige cel puțin 16 runde",
          variant: "destructive",
        });
        return;
      }
      if (newMatch.team1Score === 16 && newMatch.team2Score === 16) {
        toast({
          title: "Scor invalid", 
          description: "Nu poate fi egalitate la 16-16 în CS2",
          variant: "destructive",
        });
        return;
      }
      
      addMatchMutation.mutate(newMatch);
    }
  };

  // Get teams for a specific group
  const getTeamsByGroup = (groupName: string) => {
    const groupIndex = groupName.charCodeAt(0) - 65; // A=0, B=1, etc.
    const teamsPerGroup = groupIndex === 6 ? 7 : 6; // Group G has 7 teams
    const startIndex = groupIndex === 6 ? 36 : groupIndex * 6;
    
    return (teams as any[]).slice(startIndex, startIndex + teamsPerGroup);
  };

  // Get standings for a specific group
  const getStandingsByGroup = (groupName: string) => {
    return standings.filter((team: any) => team.groupName === groupName)
      .sort((a: any, b: any) => {
        if (a.points !== b.points) return b.points - a.points;
        if (a.roundDifference !== b.roundDifference) return b.roundDifference - a.roundDifference;
        return b.roundsWon - a.roundsWon;
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkBg to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Trophy className="mr-3 text-primary" />
            Admin Grupe Turneu - HATOR CS2 LEAGUE MOLDOVA
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <Users className="text-primary" />
                  <div>
                    <p className="text-sm text-gray-300">Total echipe</p>
                    <p className="text-2xl font-bold">{teams.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <Button 
                  onClick={() => initGroupsMutation.mutate()}
                  disabled={initGroupsMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Inițializează Grupele
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <Button 
                  onClick={() => resetMutation.mutate()}
                  disabled={resetMutation.isPending}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Turneu
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Match Result Form */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Save className="mr-2" />
              Adaugă Rezultat Meci
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Select value={newMatch.groupName} onValueChange={(value) => 
                setNewMatch({...newMatch, groupName: value, team1: '', team2: ''})
              }>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Grupa" />
                </SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(group => (
                    <SelectItem key={group} value={group}>Grupa {group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={newMatch.team1} onValueChange={(value) => 
                setNewMatch({...newMatch, team1: value})
              }>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Echipa 1" />
                </SelectTrigger>
                <SelectContent>
                  {getTeamsByGroup(newMatch.groupName).map((team: any) => (
                    <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Runde câștigate"
                value={newMatch.team1Score}
                onChange={(e) => setNewMatch({...newMatch, team1Score: parseInt(e.target.value) || 0})}
                min="0"
                max="30"
                className="bg-slate-700 border-slate-600"
              />

              <Input
                type="number"
                placeholder="Runde câștigate"
                value={newMatch.team2Score}
                onChange={(e) => setNewMatch({...newMatch, team2Score: parseInt(e.target.value) || 0})}
                min="0"
                max="30"
                className="bg-slate-700 border-slate-600"
              />

              <Select value={newMatch.team2} onValueChange={(value) => 
                setNewMatch({...newMatch, team2: value})
              }>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Echipa 2" />
                </SelectTrigger>
                <SelectContent>
                  {getTeamsByGroup(newMatch.groupName)
                    .filter((team: any) => team.name !== newMatch.team1)
                    .map((team: any) => (
                    <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={handleAddMatch}
                disabled={addMatchMutation.isPending || !newMatch.team1 || !newMatch.team2}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {addMatchMutation.isPending ? "Se salvează..." : "Salvează"}
              </Button>
            </div>
            
            {newMatch.team1 && newMatch.team2 && (
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <p className="text-sm text-gray-300">Previzualizare rezultat:</p>
                <p className="text-lg font-semibold">
                  {newMatch.team1} <span className="text-primary">{newMatch.team1Score}</span> - 
                  <span className="text-primary"> {newMatch.team2Score}</span> {newMatch.team2}
                </p>
                <p className="text-xs text-gray-400">
                  Grupa {newMatch.groupName} • 
                  {newMatch.team1Score >= 16 || newMatch.team2Score >= 16 ? (
                    <>Învingător: {newMatch.team1Score > newMatch.team2Score ? newMatch.team1 : newMatch.team2}</>
                  ) : (
                    <span className="text-yellow-400">⚠️ Scor invalid pentru CS2</span>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Standings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(group => {
            const groupStandings = getStandingsByGroup(group);
            return (
              <Card key={group} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-center text-primary">Grupa {group}</CardTitle>
                </CardHeader>
                <CardContent>
                  {standingsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : groupStandings.length === 0 ? (
                    <div className="text-center text-gray-400 py-4">
                      <p className="text-sm">Nu există rezultate încă</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {groupStandings.map((team: any, index: number) => (
                        <div 
                          key={team.teamName} 
                          className={`flex items-center justify-between p-2 rounded text-sm ${
                            index === 0 ? 'bg-green-600/20 border border-green-500/30' :
                            index === 1 ? 'bg-blue-600/20 border border-blue-500/30' :
                            'bg-slate-700/30'
                          }`}
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <span className="font-bold w-4">{index + 1}.</span>
                            <span className="truncate">{team.teamName}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs">
                            <span className="bg-primary/20 px-1 rounded">{team.points}pts</span>
                            <span className="text-gray-400">{team.wins}-{team.losses}</span>
                            <span className="text-gray-400">
                              {team.roundDifference >= 0 ? '+' : ''}{team.roundDifference}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}