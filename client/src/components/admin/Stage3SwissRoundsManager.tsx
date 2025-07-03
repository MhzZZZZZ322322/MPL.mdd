import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Plus, Edit, Trash2, Target, Users, Trophy } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface Stage3SwissMatch {
  id: number;
  roundNumber: number;
  team1Name: string;
  team2Name: string;
  team1Score: number | null;
  team2Score: number | null;
  isPlayed: boolean;
  winnerName: string | null;
  matchType: string;
  isDecisive: boolean;
  technicalWin: boolean;
  streamUrl: string | null;
}

interface Team {
  id: number;
  name: string;
  logoUrl: string;
}

export function Stage3SwissRoundsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingMatch, setEditingMatch] = useState<Stage3SwissMatch | null>(null);
  const [newMatch, setNewMatch] = useState({
    roundNumber: 1,
    team1Name: "",
    team2Name: "",
    team1Score: "",
    team2Score: "",
    isPlayed: false,
    winnerName: "",
    matchType: "BO1",
    isDecisive: false,
    technicalWin: false,
    streamUrl: ""
  });

  // Fetch matches and teams
  const { data: matches = [] } = useQuery<Stage3SwissMatch[]>({
    queryKey: ["/api/stage3-swiss-matches"],
    refetchInterval: 10000,
  });

  // Get qualified teams from calculation
  const { data: qualifiedTeamNames = [] } = useQuery<string[]>({
    queryKey: ["/api/stage3-qualified-teams"],
  });

  const { data: allTeams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Use qualified team names directly for dropdowns
  // This ensures all 16 qualified teams appear even if not in teams table with logos
  const stage3TeamNames = qualifiedTeamNames;

  // Round descriptions
  const roundDescriptions: Record<number, { title: string; description: string; color: string }> = {
    1: {
      title: "Runda 1 - Toate echipele 0-0",
      description: "Repartizare pe seed - 8 meciuri pentru 16 echipe",
      color: "bg-blue-900/20 border-blue-500/30"
    },
    2: {
      title: "Runda 2 - 1-0 vs 1-0 și 0-1 vs 0-1",
      description: "Echipele cu același record se înfruntă",
      color: "bg-green-900/20 border-green-500/30"
    },
    3: {
      title: "Runda 3 - Prima rundă cu calificări",
      description: "2-0 vs 2-0 → primele calificate (3-0)",
      color: "bg-yellow-900/20 border-yellow-500/30"
    },
    4: {
      title: "Runda 4 - Calificări 3-1",
      description: "2-1 vs 2-1 → calificate cu 3-1",
      color: "bg-orange-900/20 border-orange-500/30"
    },
    5: {
      title: "Runda 5 - Ultima rundă",
      description: "2-2 vs 2-2 → ultimele calificate (3-2)",
      color: "bg-purple-900/20 border-purple-500/30"
    }
  };

  // Create match mutation
  const createMatchMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/stage3-swiss-matches", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-standings"] });
      setNewMatch({
        roundNumber: 1,
        team1Name: "",
        team2Name: "",
        team1Score: "",
        team2Score: "",
        isPlayed: false,
        winnerName: "",
        matchType: "BO1",
        isDecisive: false,
        technicalWin: false,
        streamUrl: ""
      });
      toast({
        title: "Succes",
        description: "Meciul a fost creat cu succes!",
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
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("PUT", `/api/admin/stage3-swiss-matches/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-standings"] });
      setEditingMatch(null);
      toast({
        title: "Succes",
        description: "Meciul a fost actualizat!",
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
        title: "Succes",
        description: "Meciul a fost șters!",
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

  // Handle create match
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
      roundNumber: newMatch.roundNumber,
      team1Name: newMatch.team1Name,
      team2Name: newMatch.team2Name,
      team1Score: newMatch.isPlayed ? parseInt(newMatch.team1Score) || 0 : null,
      team2Score: newMatch.isPlayed ? parseInt(newMatch.team2Score) || 0 : null,
      isPlayed: newMatch.isPlayed,
      winnerName: newMatch.isPlayed ? newMatch.winnerName : null,
      matchType: newMatch.matchType,
      isDecisive: newMatch.isDecisive,
      technicalWin: newMatch.technicalWin,
      streamUrl: newMatch.streamUrl || null,
    };

    createMatchMutation.mutate(matchData);
  };

  // Handle edit match
  const handleEditMatch = (match: Stage3SwissMatch) => {
    setEditingMatch({
      ...match,
      team1Score: match.team1Score ?? 0,
      team2Score: match.team2Score ?? 0,
    });
  };

  // Handle update match
  const handleUpdateMatch = () => {
    if (!editingMatch) return;

    const matchData = {
      roundNumber: editingMatch.roundNumber,
      team1Name: editingMatch.team1Name,
      team2Name: editingMatch.team2Name,
      team1Score: editingMatch.isPlayed ? editingMatch.team1Score : null,
      team2Score: editingMatch.isPlayed ? editingMatch.team2Score : null,
      isPlayed: editingMatch.isPlayed,
      winnerName: editingMatch.isPlayed ? editingMatch.winnerName : null,
      matchType: editingMatch.matchType,
      isDecisive: editingMatch.isDecisive,
      technicalWin: editingMatch.technicalWin,
      streamUrl: editingMatch.streamUrl || null,
    };

    updateMatchMutation.mutate({ id: editingMatch.id, data: matchData });
  };

  // Group matches by round
  const matchesByRound: Record<number, Stage3SwissMatch[]> = {};
  matches.forEach((match) => {
    if (!matchesByRound[match.roundNumber]) {
      matchesByRound[match.roundNumber] = [];
    }
    matchesByRound[match.roundNumber].push(match);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-darkGray/60 border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="mr-2 text-primary" />
            Gestionare Meciuri Stage 3 Swiss - Pe Runde
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Administrează meciurile Stage 3 Swiss System organizate pe runde (1-5). Fiecare rundă are explicația și echipele corespunzătoare.
          </p>
        </CardHeader>
      </Card>

      {/* Add New Match */}
      <Card className="bg-darkGray/60 border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plus className="mr-2 text-primary" />
            Adaugă Meci Nou
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-white">Runda</Label>
              <select
                value={newMatch.roundNumber}
                onChange={(e) => setNewMatch({ ...newMatch, roundNumber: parseInt(e.target.value) })}
                className="w-full mt-1 p-2 border border-gray-600 rounded bg-gray-700 text-white"
              >
                {[1, 2, 3, 4, 5].map(round => (
                  <option key={round} value={round}>
                    Runda {round}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-white">Echipa 1</Label>
              <select
                value={newMatch.team1Name}
                onChange={(e) => setNewMatch({ ...newMatch, team1Name: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-600 rounded bg-gray-700 text-white"
              >
                <option value="">Selectează echipa</option>
                {stage3TeamNames.map((teamName) => (
                  <option key={teamName} value={teamName}>
                    {teamName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-white">Echipa 2</Label>
              <select
                value={newMatch.team2Name}
                onChange={(e) => setNewMatch({ ...newMatch, team2Name: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-600 rounded bg-gray-700 text-white"
              >
                <option value="">Selectează echipa</option>
                {stage3TeamNames.map((teamName) => (
                  <option key={teamName} value={teamName}>
                    {teamName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-white">Tip Meci</Label>
              <select
                value={newMatch.matchType}
                onChange={(e) => setNewMatch({ ...newMatch, matchType: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-600 rounded bg-gray-700 text-white"
              >
                <option value="BO1">BO1</option>
                <option value="BO3">BO3</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPlayed"
                checked={newMatch.isPlayed}
                onChange={(e) => setNewMatch({ ...newMatch, isPlayed: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isPlayed" className="text-white">Meci jucat</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDecisive"
                checked={newMatch.isDecisive}
                onChange={(e) => setNewMatch({ ...newMatch, isDecisive: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isDecisive" className="text-white">Meci decisiv</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="technicalWin"
                checked={newMatch.technicalWin}
                onChange={(e) => setNewMatch({ ...newMatch, technicalWin: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="technicalWin" className="text-white">Victorie tehnică</Label>
            </div>
          </div>

          {newMatch.isPlayed && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-white">Scor Echipa 1</Label>
                <Input
                  type="number"
                  value={newMatch.team1Score}
                  onChange={(e) => setNewMatch({ ...newMatch, team1Score: e.target.value })}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div>
                <Label className="text-white">Scor Echipa 2</Label>
                <Input
                  type="number"
                  value={newMatch.team2Score}
                  onChange={(e) => setNewMatch({ ...newMatch, team2Score: e.target.value })}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div>
                <Label className="text-white">Echipa câștigătoare</Label>
                <select
                  value={newMatch.winnerName}
                  onChange={(e) => setNewMatch({ ...newMatch, winnerName: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-600 rounded bg-gray-700 text-white"
                >
                  <option value="">Selectează câștigătoarea</option>
                  {newMatch.team1Name && <option value={newMatch.team1Name}>{newMatch.team1Name}</option>}
                  {newMatch.team2Name && <option value={newMatch.team2Name}>{newMatch.team2Name}</option>}
                </select>
              </div>
            </div>
          )}

          <div>
            <Label className="text-white">Link Stream/FACEIT</Label>
            <Input
              value={newMatch.streamUrl}
              onChange={(e) => setNewMatch({ ...newMatch, streamUrl: e.target.value })}
              placeholder="https://..."
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>

          <Button 
            onClick={handleCreateMatch}
            disabled={createMatchMutation.isPending}
            className="bg-primary hover:bg-primary/80"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adaugă Meci
          </Button>
        </CardContent>
      </Card>

      {/* Matches by Round */}
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map(roundNum => {
          const roundMatches = matchesByRound[roundNum] || [];
          const roundConfig = roundDescriptions[roundNum];

          return (
            <Card key={roundNum} className={`${roundConfig.color} border`}>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  {roundConfig.title}
                </CardTitle>
                <p className="text-gray-300 text-sm">{roundConfig.description}</p>
                <p className="text-xs text-blue-400">
                  {roundMatches.length} meciuri 
                  {roundMatches.filter(m => m.isPlayed).length > 0 && 
                    ` - ${roundMatches.filter(m => m.isPlayed).length} jucate`
                  }
                </p>
              </CardHeader>
              <CardContent>
                {roundMatches.length > 0 ? (
                  <div className="space-y-3">
                    {roundMatches.map((match) => (
                      <motion.div
                        key={match.id}
                        className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <span className="text-white font-medium">{match.team1Name}</span>
                            <div className="text-center px-4">
                              {match.isPlayed ? (
                                <div className="text-white font-bold">
                                  {match.team1Score} - {match.team2Score}
                                  {match.technicalWin && <span className="text-yellow-400 ml-2">⚙️</span>}
                                </div>
                              ) : (
                                <div className="text-gray-400">vs</div>
                              )}
                              <div className="text-xs text-gray-500">
                                {match.matchType}
                                {match.isDecisive && <span className="text-yellow-400 ml-1">📌</span>}
                              </div>
                            </div>
                            <span className="text-white font-medium">{match.team2Name}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditMatch(match)}
                              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteMatchMutation.mutate(match.id)}
                              className="bg-red-600 hover:bg-red-700 text-white border-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nu sunt meciuri pentru această rundă. Adaugă primul meci!
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Match Modal */}
      {editingMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-darkGray border-primary/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Edit className="mr-2 text-primary" />
                Editează Meci - Runda {editingMatch.roundNumber}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Echipa 1</Label>
                  <select
                    value={editingMatch.team1Name}
                    onChange={(e) => setEditingMatch({ ...editingMatch, team1Name: e.target.value })}
                    className="w-full mt-1 p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  >
                    {stage3TeamNames.map((teamName) => (
                      <option key={teamName} value={teamName}>
                        {teamName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-white">Echipa 2</Label>
                  <select
                    value={editingMatch.team2Name}
                    onChange={(e) => setEditingMatch({ ...editingMatch, team2Name: e.target.value })}
                    className="w-full mt-1 p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  >
                    {stage3TeamNames.map((teamName) => (
                      <option key={teamName} value={teamName}>
                        {teamName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editIsPlayed"
                    checked={editingMatch.isPlayed}
                    onChange={(e) => setEditingMatch({ ...editingMatch, isPlayed: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="editIsPlayed" className="text-white">Meci jucat</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editIsDecisive"
                    checked={editingMatch.isDecisive}
                    onChange={(e) => setEditingMatch({ ...editingMatch, isDecisive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="editIsDecisive" className="text-white">Meci decisiv</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editTechnicalWin"
                    checked={editingMatch.technicalWin}
                    onChange={(e) => setEditingMatch({ ...editingMatch, technicalWin: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="editTechnicalWin" className="text-white">Victorie tehnică</Label>
                </div>
              </div>

              {editingMatch.isPlayed && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Scor Echipa 1</Label>
                    <Input
                      type="number"
                      value={editingMatch.team1Score || 0}
                      onChange={(e) => setEditingMatch({ 
                        ...editingMatch, 
                        team1Score: parseInt(e.target.value) || 0 
                      })}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Scor Echipa 2</Label>
                    <Input
                      type="number"
                      value={editingMatch.team2Score || 0}
                      onChange={(e) => setEditingMatch({ 
                        ...editingMatch, 
                        team2Score: parseInt(e.target.value) || 0 
                      })}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Echipa câștigătoare</Label>
                    <select
                      value={editingMatch.winnerName || ""}
                      onChange={(e) => setEditingMatch({ ...editingMatch, winnerName: e.target.value })}
                      className="w-full mt-1 p-2 border border-gray-600 rounded bg-gray-700 text-white"
                    >
                      <option value="">Selectează câștigătoarea</option>
                      <option value={editingMatch.team1Name}>{editingMatch.team1Name}</option>
                      <option value={editingMatch.team2Name}>{editingMatch.team2Name}</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-white">Link Stream/FACEIT</Label>
                <Input
                  value={editingMatch.streamUrl || ""}
                  onChange={(e) => setEditingMatch({ ...editingMatch, streamUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleUpdateMatch}
                  disabled={updateMatchMutation.isPending}
                  className="bg-primary hover:bg-primary/80"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvează
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setEditingMatch(null)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Anulează
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}