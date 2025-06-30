import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Save, X, Trophy, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Stage2Match {
  id: number;
  team1Name: string;
  team2Name: string;
  team1Score?: number;
  team2Score?: number;
  winnerName?: string;
  bracketPosition: number;
  isPlayed: boolean;
  streamUrl?: string;
  technicalWin: boolean;
  technicalWinner?: string;
  matchDate?: string;
}

interface Team {
  id: number;
  name: string;
}

export function Stage2BracketManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingMatch, setEditingMatch] = useState<Stage2Match | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch bracket data
  const { data: bracket = [], isLoading } = useQuery({
    queryKey: ["/api/stage2-bracket"],
    refetchInterval: 5000,
  });

  // Fetch teams for dropdown
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (matchData: any) => apiRequest("/api/admin/stage2-bracket", "POST", matchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stage2-bracket"] });
      setIsCreating(false);
      toast({
        title: "Success",
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

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest(`/api/admin/stage2-bracket/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stage2-bracket"] });
      setEditingMatch(null);
      toast({
        title: "Success",
        description: "Meciul a fost actualizat cu succes!",
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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/stage2-bracket/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stage2-bracket"] });
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

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const matchData = {
      team1Name: formData.get("team1Name") as string,
      team2Name: formData.get("team2Name") as string,
      bracketPosition: parseInt(formData.get("bracketPosition") as string),
      streamUrl: formData.get("streamUrl") as string || "",
      matchDate: formData.get("matchDate") ? new Date(formData.get("matchDate") as string).toISOString() : null,
    };

    if (matchData.team1Name === matchData.team2Name) {
      toast({
        title: "Eroare",
        description: "O echipă nu poate juca împotriva ei însăși",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(matchData);
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingMatch) return;

    const formData = new FormData(event.currentTarget);
    
    const team1Score = formData.get("team1Score") ? parseInt(formData.get("team1Score") as string) : null;
    const team2Score = formData.get("team2Score") ? parseInt(formData.get("team2Score") as string) : null;
    const technicalWin = formData.get("technicalWin") === "true";
    const technicalWinner = formData.get("technicalWinner") as string;

    let winnerName = "";
    let isPlayed = false;

    if (technicalWin && technicalWinner) {
      winnerName = technicalWinner;
      isPlayed = true;
    } else if (team1Score !== null && team2Score !== null) {
      if (team1Score > team2Score) {
        winnerName = editingMatch.team1Name;
      } else if (team2Score > team1Score) {
        winnerName = editingMatch.team2Name;
      }
      isPlayed = true;
    }

    const updateData = {
      id: editingMatch.id,
      team1Name: formData.get("team1Name") as string,
      team2Name: formData.get("team2Name") as string,
      team1Score,
      team2Score,
      winnerName,
      bracketPosition: parseInt(formData.get("bracketPosition") as string),
      isPlayed,
      streamUrl: formData.get("streamUrl") as string || "",
      technicalWin,
      technicalWinner: technicalWin ? technicalWinner : "",
      matchDate: formData.get("matchDate") ? new Date(formData.get("matchDate") as string).toISOString() : null,
    };

    updateMutation.mutate(updateData);
  };

  const matches = (bracket as Stage2Match[]).sort((a, b) => a.bracketPosition - b.bracketPosition);
  const qualifiedTeams = matches.filter(match => match.isPlayed && match.winnerName).length;

  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          <span className="ml-3 text-white">Se încarcă plasa Stage 2...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Administrare Stage 2</h2>
              <p className="text-orange-100 text-sm">
                Gestionează plasa eliminatorie cu 10 echipe
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-lg">{qualifiedTeams}/5</div>
            <div className="text-orange-100 text-sm">Echipe calificate</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Create New Match Button */}
        <div className="mb-6">
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
            disabled={isCreating}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adaugă Meci Nou
          </Button>
        </div>

        {/* Create Form */}
        {isCreating && (
          <div className="mb-6 bg-zinc-800 border border-zinc-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Creează Meci Nou</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team1Name" className="text-white">Echipa 1</Label>
                  <Select name="team1Name" required>
                    <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                      <SelectValue placeholder="Selectează echipa 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {(teams as Team[]).map((team: Team) => (
                        <SelectItem key={team.id} value={team.name}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="team2Name" className="text-white">Echipa 2</Label>
                  <Select name="team2Name" required>
                    <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                      <SelectValue placeholder="Selectează echipa 2" />
                    </SelectTrigger>
                    <SelectContent>
                      {(teams as Team[]).map((team: Team) => (
                        <SelectItem key={team.id} value={team.name}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bracketPosition" className="text-white">Poziția în plasă</Label>
                  <Input
                    type="number"
                    name="bracketPosition"
                    min="1"
                    max="5"
                    required
                    className="bg-zinc-700 border-zinc-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="matchDate" className="text-white">Data meciului</Label>
                  <Input
                    type="datetime-local"
                    name="matchDate"
                    className="bg-zinc-700 border-zinc-600 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="streamUrl" className="text-white">Link Faceit/Stream</Label>
                  <Input
                    type="url"
                    name="streamUrl"
                    placeholder="https://www.faceit.com/..."
                    className="bg-zinc-700 border-zinc-600 text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={createMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Creează Meci
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  variant="outline"
                  className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Anulează
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Matches List */}
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Niciun meci configurat</h3>
            <p className="text-gray-400">
              Adaugă primele meciuri pentru plasa Stage 2
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className={`bg-zinc-800 border rounded-lg p-4 ${
                  match.isPlayed ? 'border-green-500/30' : 'border-zinc-600'
                }`}
              >
                {editingMatch?.id === match.id ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-white">Echipa 1</Label>
                        <Select name="team1Name" defaultValue={match.team1Name}>
                          <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(teams as Team[]).map((team: Team) => (
                              <SelectItem key={team.id} value={team.name}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-white">Echipa 2</Label>
                        <Select name="team2Name" defaultValue={match.team2Name}>
                          <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((team: Team) => (
                              <SelectItem key={team.id} value={team.name}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-white">Scor Echipa 1</Label>
                        <Input
                          type="number"
                          name="team1Score"
                          min="0"
                          defaultValue={match.team1Score || ""}
                          className="bg-zinc-700 border-zinc-600 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-white">Scor Echipa 2</Label>
                        <Input
                          type="number"
                          name="team2Score"
                          min="0"
                          defaultValue={match.team2Score || ""}
                          className="bg-zinc-700 border-zinc-600 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-white">Poziția în plasă</Label>
                        <Input
                          type="number"
                          name="bracketPosition"
                          min="1"
                          max="5"
                          defaultValue={match.bracketPosition}
                          className="bg-zinc-700 border-zinc-600 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-white">Data meciului</Label>
                        <Input
                          type="datetime-local"
                          name="matchDate"
                          defaultValue={match.matchDate ? new Date(match.matchDate).toISOString().slice(0, 16) : ""}
                          className="bg-zinc-700 border-zinc-600 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-white">Câștig tehnic</Label>
                        <Select name="technicalWin" defaultValue={match.technicalWin ? "true" : "false"}>
                          <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">Nu</SelectItem>
                            <SelectItem value="true">Da</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-white">Câștigător tehnic</Label>
                        <Select name="technicalWinner" defaultValue={match.technicalWinner || ""}>
                          <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                            <SelectValue placeholder="Selectează câștigătorul" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">(Niciunul)</SelectItem>
                            <SelectItem value={match.team1Name}>{match.team1Name}</SelectItem>
                            <SelectItem value={match.team2Name}>{match.team2Name}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2 lg:col-span-4">
                        <Label className="text-white">Link Faceit/Stream</Label>
                        <Input
                          type="url"
                          name="streamUrl"
                          defaultValue={match.streamUrl || ""}
                          placeholder="https://www.faceit.com/..."
                          className="bg-zinc-700 border-zinc-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={updateMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvează
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setEditingMatch(null)}
                        variant="outline"
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Anulează
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-orange-400 font-bold">Meci {match.bracketPosition}</div>
                      <div className="text-white font-medium">
                        {match.team1Name} vs {match.team2Name}
                      </div>
                      {match.isPlayed && (
                        <div className="text-green-400 text-sm">
                          Câștigător: {match.winnerName}
                          {match.technicalWin && " (tehnic)"}
                        </div>
                      )}
                      {match.isPlayed && !match.technicalWin && (
                        <div className="text-gray-400 text-sm">
                          Scor: {match.team1Score} - {match.team2Score}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setEditingMatch(match)}
                        size="sm"
                        variant="outline"
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteMutation.mutate(match.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}