import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trophy, Plus, Calendar, Users, Target } from "lucide-react";

interface MatchResult {
  id: number;
  groupName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  streamUrl?: string;
  technicalWin: boolean;
  technicalWinner?: string;
  matchDate: string;
}

interface GroupTeam {
  id: number;
  name: string;
  logoUrl: string;
}

interface TournamentGroup {
  groupName: string;
  displayName: string;
  teams: GroupTeam[];
}

const KingstonMatchResults = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [selectedGroup, setSelectedGroup] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [technicalWin, setTechnicalWin] = useState(false);
  const [technicalWinner, setTechnicalWinner] = useState("");

  // Fetch tournament groups
  const { data: groups = [] } = useQuery<TournamentGroup[]>({
    queryKey: ["/api/kingston/tournament-groups"],
    queryFn: async () => {
      const response = await fetch("/api/kingston/tournament-groups");
      if (!response.ok) throw new Error("Failed to fetch tournament groups");
      return response.json();
    }
  });

  // Fetch existing match results
  const { data: matchResults = [] } = useQuery<MatchResult[]>({
    queryKey: ["/api/kingston/match-results"],
    queryFn: async () => {
      const response = await fetch("/api/kingston/match-results");
      if (!response.ok) throw new Error("Failed to fetch match results");
      return response.json();
    }
  });

  // Add match result mutation
  const addMatchResultMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/kingston/admin/add-match-result", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Succes",
        description: "Rezultatul meciului a fost adăugat cu succes!",
      });
      // Reset form
      setSelectedGroup("");
      setTeam1("");
      setTeam2("");
      setTeam1Score("");
      setTeam2Score("");
      setStreamUrl("");
      setTechnicalWin(false);
      setTechnicalWinner("");
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/kingston/match-results"] });
      queryClient.invalidateQueries({ queryKey: ["/api/kingston/group-standings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Eroare",
        description: error.message || "Nu s-a putut adăuga rezultatul meciului",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGroup || !team1 || !team2) {
      toast({
        title: "Eroare",
        description: "Toate câmpurile obligatorii trebuie completate",
        variant: "destructive",
      });
      return;
    }

    if (team1 === team2) {
      toast({
        title: "Eroare", 
        description: "Echipele nu pot fi identice",
        variant: "destructive",
      });
      return;
    }

    if (!technicalWin) {
      const score1 = parseInt(team1Score);
      const score2 = parseInt(team2Score);
      
      if (isNaN(score1) || isNaN(score2)) {
        toast({
          title: "Eroare",
          description: "Scorurile trebuie să fie numere valide",
          variant: "destructive",
        });
        return;
      }

      if (score1 === score2) {
        toast({
          title: "Eroare",
          description: "În CS2 BO1 nu pot fi egaluri. O echipă trebuie să câștige",
          variant: "destructive",
        });
        return;
      }
    }

    const matchData = {
      groupName: selectedGroup,
      team1Name: team1,
      team2Name: team2,
      team1Score: technicalWin ? 0 : parseInt(team1Score),
      team2Score: technicalWin ? 0 : parseInt(team2Score),
      streamUrl: streamUrl || null,
      technicalWin,
      technicalWinner: technicalWin ? technicalWinner : null
    };

    addMatchResultMutation.mutate(matchData);
  };

  const selectedGroupData = groups.find(g => g.groupName === selectedGroup);
  const availableTeams = selectedGroupData?.teams || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Trophy className="h-6 w-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-gray-100">Rezultate Meciuri - Kingston FURY</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Match Result Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Adaugă Rezultat Meci</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Introduceți rezultatul meciului din faza grupelor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Group Selection */}
              <div className="space-y-2">
                <Label htmlFor="group" className="text-gray-200">
                  Grupă *
                </Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-gray-100">
                    <SelectValue placeholder="Selectează grupa" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {groups.map((group) => (
                      <SelectItem key={group.groupName} value={group.groupName} className="text-gray-100">
                        {group.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Team 1 Selection */}
              <div className="space-y-2">
                <Label htmlFor="team1" className="text-gray-200">
                  Echipa 1 *
                </Label>
                <Select value={team1} onValueChange={setTeam1} disabled={!selectedGroup}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-gray-100">
                    <SelectValue placeholder="Selectează echipa 1" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {availableTeams.map((team) => (
                      <SelectItem key={team.id} value={team.name} className="text-gray-100">
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Team 2 Selection */}
              <div className="space-y-2">
                <Label htmlFor="team2" className="text-gray-200">
                  Echipa 2 *
                </Label>
                <Select value={team2} onValueChange={setTeam2} disabled={!selectedGroup}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-gray-100">
                    <SelectValue placeholder="Selectează echipa 2" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {availableTeams.filter(team => team.name !== team1).map((team) => (
                      <SelectItem key={team.id} value={team.name} className="text-gray-100">
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Technical Win Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="technical-win"
                  checked={technicalWin}
                  onCheckedChange={setTechnicalWin}
                />
                <Label htmlFor="technical-win" className="text-gray-200">
                  Câștig tehnic
                </Label>
              </div>

              {technicalWin ? (
                /* Technical Winner Selection */
                <div className="space-y-2">
                  <Label htmlFor="technical-winner" className="text-gray-200">
                    Câștigătorul tehnic *
                  </Label>
                  <Select value={technicalWinner} onValueChange={setTechnicalWinner}>
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-gray-100">
                      <SelectValue placeholder="Selectează câștigătorul" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {team1 && <SelectItem value={team1} className="text-gray-100">{team1}</SelectItem>}
                      {team2 && <SelectItem value={team2} className="text-gray-100">{team2}</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                /* Score Inputs */
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="team1-score" className="text-gray-200">
                      Scor {team1 || "Echipa 1"} *
                    </Label>
                    <Input
                      id="team1-score"
                      type="number"
                      min="0"
                      max="30"
                      value={team1Score}
                      onChange={(e) => setTeam1Score(e.target.value)}
                      className="bg-gray-900 border-gray-600 text-gray-100"
                      placeholder="16"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team2-score" className="text-gray-200">
                      Scor {team2 || "Echipa 2"} *
                    </Label>
                    <Input
                      id="team2-score"
                      type="number"
                      min="0"
                      max="30"
                      value={team2Score}
                      onChange={(e) => setTeam2Score(e.target.value)}
                      className="bg-gray-900 border-gray-600 text-gray-100"
                      placeholder="14"
                    />
                  </div>
                </div>
              )}

              {/* Stream URL */}
              <div className="space-y-2">
                <Label htmlFor="stream-url" className="text-gray-200">
                  Link Stream (opțional)
                </Label>
                <Input
                  id="stream-url"
                  type="url"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  className="bg-gray-900 border-gray-600 text-gray-100"
                  placeholder="https://twitch.tv/..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={addMatchResultMutation.isPending}
              >
                {addMatchResultMutation.isPending ? "Se adaugă..." : "Adaugă Rezultat"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Match Results */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Rezultate Recente</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Ultimele {Math.min(matchResults.length, 10)} meciuri jucate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {matchResults.slice(0, 10).map((match) => {
                const team1Won = match.technicalWin 
                  ? match.technicalWinner === match.team1Name
                  : match.team1Score > match.team2Score;
                
                return (
                  <div key={match.id} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Grupa {match.groupName}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(match.matchDate).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${team1Won ? 'text-green-400' : 'text-gray-300'}`}>
                          {match.team1Name}
                        </span>
                        <span className="text-gray-500">vs</span>
                        <span className={`font-medium ${!team1Won ? 'text-green-400' : 'text-gray-300'}`}>
                          {match.team2Name}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        {match.technicalWin ? (
                          <Badge variant="secondary" className="text-xs">
                            Tehnic: {match.technicalWinner}
                          </Badge>
                        ) : (
                          <span className="font-mono text-lg">
                            {match.team1Score} - {match.team2Score}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {matchResults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Încă nu au fost adăugate rezultate de meciuri</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100 flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Statistici Generale</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{matchResults.length}</div>
              <div className="text-sm text-gray-400">Meciuri Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{groups.length}</div>
              <div className="text-sm text-gray-400">Grupe Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {groups.reduce((total, group) => total + group.teams.length, 0)}
              </div>
              <div className="text-sm text-gray-400">Echipe Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {matchResults.filter(m => m.technicalWin).length}
              </div>
              <div className="text-sm text-gray-400">Câștiguri Tehnice</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KingstonMatchResults;