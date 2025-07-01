import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Save, X, Trophy, Target, Link as LinkIcon, Trash2, Plus, Users, Crown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface SwissStanding {
  teamName: string;
  wins: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  status: string;
}

interface SwissMatch {
  id: number;
  roundNumber: number;
  team1Name: string;
  team2Name: string;
  team1Score?: number;
  team2Score?: number;
  winnerName?: string;
  isPlayed: boolean;
  streamUrl?: string;
  technicalWin: boolean;
  technicalWinner?: string;
  matchType: string;
  isDecisive: boolean;
  matchDate?: string;
}

interface Team {
  id: number;
  name: string;
}

export function Stage3SwissManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingMatch, setEditingMatch] = useState<SwissMatch | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newMatch, setNewMatch] = useState({
    roundNumber: 1,
    team1Name: "",
    team2Name: "",
    team1Score: "",
    team2Score: "",
    streamUrl: "",
    technicalWin: false,
    technicalWinner: "",
    matchType: "BO1",
    isDecisive: false,
    matchDate: ""
  });

  // Fetch standings
  const { data: standings = [], isLoading: standingsLoading } = useQuery<SwissStanding[]>({
    queryKey: ["/api/stage3-swiss-standings"],
    refetchInterval: 5000,
  });

  // Fetch matches
  const { data: matches = [], isLoading: matchesLoading } = useQuery<SwissMatch[]>({
    queryKey: ["/api/stage3-swiss-matches"],
    refetchInterval: 5000,
  });

  // Fetch teams for dropdown
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Create match mutation
  const createMatchMutation = useMutation({
    mutationFn: (matchData: any) => apiRequest("POST", "/api/admin/stage3-swiss-matches", matchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-standings"] });
      setIsCreating(false);
      setNewMatch({
        roundNumber: 1,
        team1Name: "",
        team2Name: "",
        team1Score: "",
        team2Score: "",
        streamUrl: "",
        technicalWin: false,
        technicalWinner: "",
        matchType: "BO1",
        isDecisive: false,
        matchDate: ""
      });
      toast({
        title: "Success",
        description: "Meciul Swiss a fost creat cu succes!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Eroare",
        description: error.message || "Eroare la crearea meciului",
        variant: "destructive",
      });
    },
  });

  // Update match mutation
  const updateMatchMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/admin/stage3-swiss-matches/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-standings"] });
      setEditingMatch(null);
      toast({
        title: "Success",
        description: "Meciul Swiss a fost actualizat cu succes!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Eroare",
        description: error.message || "Eroare la actualizarea meciului",
        variant: "destructive",
      });
    },
  });

  // Delete match mutation
  const deleteMatchMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/stage3-swiss-matches/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-standings"] });
      toast({
        title: "Success",
        description: "Meciul a fost șters cu succes!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Eroare",
        description: error.message || "Eroare la ștergerea meciului",
        variant: "destructive",
      });
    },
  });

  // Add team to Swiss mutation
  const addTeamMutation = useMutation({
    mutationFn: (teamName: string) => apiRequest("POST", "/api/admin/stage3-swiss-teams", { teamName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-standings"] });
      toast({
        title: "Success",
        description: "Echipa a fost adăugată în Swiss System!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Eroare",
        description: error.message || "Eroare la adăugarea echipei",
        variant: "destructive",
      });
    },
  });

  const handleCreateMatch = () => {
    if (!newMatch.team1Name || !newMatch.team2Name) {
      toast({
        title: "Eroare",
        description: "Selectează ambele echipe",
        variant: "destructive",
      });
      return;
    }

    if (newMatch.team1Name === newMatch.team2Name) {
      toast({
        title: "Eroare",
        description: "O echipă nu poate juca împotriva ei însăși",
        variant: "destructive",
      });
      return;
    }

    const matchData = {
      ...newMatch,
      team1Score: newMatch.team1Score ? parseInt(newMatch.team1Score) : null,
      team2Score: newMatch.team2Score ? parseInt(newMatch.team2Score) : null,
      isPlayed: !!(newMatch.team1Score && newMatch.team2Score),
    };

    createMatchMutation.mutate(matchData);
  };

  const handleUpdateMatch = (match: SwissMatch) => {
    const matchData = {
      id: match.id,
      team1Score: match.team1Score,
      team2Score: match.team2Score,
      streamUrl: match.streamUrl || "",
      technicalWin: match.technicalWin,
      technicalWinner: match.technicalWinner || "",
      matchType: match.matchType,
      isDecisive: match.isDecisive,
      isPlayed: !!(match.team1Score !== null && match.team2Score !== null),
    };

    updateMatchMutation.mutate(matchData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'text-green-400';
      case 'eliminated': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'qualified': return 'Calificat';
      case 'eliminated': return 'Eliminat';
      default: return 'Activ';
    }
  };

  if (standingsLoading || matchesLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Trophy className="mr-2 text-primary" />
          Stage 3 Swiss System Manager
        </h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Meci Nou
        </Button>
      </div>

      {/* Swiss Standings */}
      <Card className="bg-darkGray/60 border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Crown className="mr-2 text-primary" />
            Clasament Swiss System
          </CardTitle>
          <CardDescription>
            16 echipe → 8 echipe: 3 victorii = calificare, 3 înfrângeri = eliminare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {standings.map((team, index) => (
              <div
                key={team.teamName}
                className="flex items-center justify-between p-3 bg-darkBg/60 rounded-lg border border-primary/10"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 font-mono w-6">{index + 1}.</span>
                  <span className="text-white font-medium">{team.teamName}</span>
                  <span className={`text-sm font-medium ${getStatusColor(team.status)}`}>
                    {getStatusText(team.status)}
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <span className="text-green-400">{team.wins}W</span>
                  <span className="text-red-400">{team.losses}L</span>
                  <span className="text-blue-400">{team.roundsWon}-{team.roundsLost}</span>
                  <span className="text-gray-400">
                    {team.roundsWon - team.roundsLost > 0 ? '+' : ''}{team.roundsWon - team.roundsLost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Matches by Round */}
      <Card className="bg-darkGray/60 border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="mr-2 text-primary" />
            Meciuri Swiss pe Runde
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from(new Set(matches.map(m => m.roundNumber))).sort().map(roundNum => (
            <div key={roundNum} className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold mr-2">
                  {roundNum}
                </div>
                Runda {roundNum}
              </h3>
              <div className="grid gap-3">
                {matches
                  .filter(match => match.roundNumber === roundNum)
                  .map((match) => (
                    <div
                      key={match.id}
                      className="p-4 bg-darkBg/60 rounded-lg border border-primary/10"
                    >
                      {editingMatch?.id === match.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-white">Scor {match.team1Name}</Label>
                              <Input
                                type="number"
                                value={editingMatch.team1Score || ""}
                                onChange={(e) => setEditingMatch({
                                  ...editingMatch,
                                  team1Score: parseInt(e.target.value) || 0
                                })}
                                className="bg-darkGray border-primary/20 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white">Scor {match.team2Name}</Label>
                              <Input
                                type="number"
                                value={editingMatch.team2Score || ""}
                                onChange={(e) => setEditingMatch({
                                  ...editingMatch,
                                  team2Score: parseInt(e.target.value) || 0
                                })}
                                className="bg-darkGray border-primary/20 text-white"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-white">Link Stream/Faceit</Label>
                            <Input
                              value={editingMatch.streamUrl || ""}
                              onChange={(e) => setEditingMatch({
                                ...editingMatch,
                                streamUrl: e.target.value
                              })}
                              className="bg-darkGray border-primary/20 text-white"
                              placeholder="https://..."
                            />
                          </div>

                          <div className="flex items-center space-x-4">
                            <label className="flex items-center text-white">
                              <input
                                type="checkbox"
                                checked={editingMatch.technicalWin}
                                onChange={(e) => setEditingMatch({
                                  ...editingMatch,
                                  technicalWin: e.target.checked
                                })}
                                className="mr-2"
                              />
                              Câștig tehnic
                            </label>
                            
                            <label className="flex items-center text-white">
                              <input
                                type="checkbox"
                                checked={editingMatch.isDecisive}
                                onChange={(e) => setEditingMatch({
                                  ...editingMatch,
                                  isDecisive: e.target.checked,
                                  matchType: e.target.checked ? "BO3" : "BO1"
                                })}
                                className="mr-2"
                              />
                              Meci decisiv (BO3)
                            </label>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleUpdateMatch(editingMatch)}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={updateMatchMutation.isPending}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Salvează
                            </Button>
                            <Button
                              onClick={() => setEditingMatch(null)}
                              variant="outline"
                              className="border-gray-600 text-white hover:bg-darkGray"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Anulează
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-white font-medium">
                              {match.team1Name} vs {match.team2Name}
                            </div>
                            {match.isPlayed && (
                              <div className="text-primary font-bold">
                                {match.team1Score}-{match.team2Score}
                                {match.technicalWin && " ⚙️"}
                              </div>
                            )}
                            <div className="text-sm text-gray-400">
                              {match.matchType} {match.isDecisive && "(Decisiv)"}
                            </div>
                            {match.streamUrl && (
                              <a
                                href={match.streamUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 text-sm flex items-center"
                              >
                                <LinkIcon className="w-3 h-3 mr-1" />
                                Link
                              </a>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => setEditingMatch(match)}
                              size="sm"
                              variant="outline"
                              className="border-primary/50 text-primary hover:bg-primary/10"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={() => deleteMatchMutation.mutate(match.id)}
                              size="sm"
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              disabled={deleteMatchMutation.isPending}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Create New Match Modal */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <Card className="w-full max-w-md bg-darkGray border-primary/20">
            <CardHeader>
              <CardTitle className="text-white">Meci Nou Swiss</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Runda</Label>
                <Input
                  type="number"
                  value={newMatch.roundNumber}
                  onChange={(e) => setNewMatch({
                    ...newMatch,
                    roundNumber: parseInt(e.target.value) || 1
                  })}
                  className="bg-darkBg border-primary/20 text-white"
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Echipa 1</Label>
                  <select
                    value={newMatch.team1Name}
                    onChange={(e) => setNewMatch({ ...newMatch, team1Name: e.target.value })}
                    className="w-full p-2 bg-darkBg border border-primary/20 text-white rounded-md"
                  >
                    <option value="">Selectează echipa</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-white">Echipa 2</Label>
                  <select
                    value={newMatch.team2Name}
                    onChange={(e) => setNewMatch({ ...newMatch, team2Name: e.target.value })}
                    className="w-full p-2 bg-darkBg border border-primary/20 text-white rounded-md"
                  >
                    <option value="">Selectează echipa</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Scor Echipa 1</Label>
                  <Input
                    type="number"
                    value={newMatch.team1Score}
                    onChange={(e) => setNewMatch({ ...newMatch, team1Score: e.target.value })}
                    className="bg-darkBg border-primary/20 text-white"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label className="text-white">Scor Echipa 2</Label>
                  <Input
                    type="number"
                    value={newMatch.team2Score}
                    onChange={(e) => setNewMatch({ ...newMatch, team2Score: e.target.value })}
                    className="bg-darkBg border-primary/20 text-white"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Link Stream/Faceit</Label>
                <Input
                  value={newMatch.streamUrl}
                  onChange={(e) => setNewMatch({ ...newMatch, streamUrl: e.target.value })}
                  className="bg-darkBg border-primary/20 text-white"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={newMatch.isDecisive}
                    onChange={(e) => setNewMatch({
                      ...newMatch,
                      isDecisive: e.target.checked,
                      matchType: e.target.checked ? "BO3" : "BO1"
                    })}
                    className="mr-2"
                  />
                  Meci decisiv (BO3)
                </label>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateMatch}
                  className="bg-primary hover:bg-primary/90"
                  disabled={createMatchMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Creează Meci
                </Button>
                <Button
                  onClick={() => setIsCreating(false)}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-darkGray"
                >
                  <X className="w-4 h-4 mr-2" />
                  Anulează
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}