import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Save, X, Trophy, Target, Link as LinkIcon, Trash2, Plus, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTournamentContext } from '@/pages/TournamentAdminFixed';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

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
  const { selectedTournament, isReadonly } = useTournamentContext();
  const [editingMatch, setEditingMatch] = useState<Stage2Match | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Determină API endpoint în funcție de turneul selectat
  const getApiEndpoint = (endpoint: string) => {
    return selectedTournament === 'kingston' ? `/api/kingston${endpoint}` : `/api${endpoint}`;
  };

  const getAdminEndpoint = (endpoint: string) => {
    return selectedTournament === 'kingston' ? `/api/kingston/admin${endpoint}` : `/api/admin${endpoint}`;
  };

  const getTeamsEndpoint = () => {
    return selectedTournament === 'kingston' ? '/api/kingston/teams' : '/api/teams';
  };

  // Fetch bracket data
  const { data: bracket = [], isLoading } = useQuery({
    queryKey: [getApiEndpoint('/stage2-bracket'), selectedTournament],
    refetchInterval: 5000,
  });

  // Fetch teams for dropdown
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: [getTeamsEndpoint(), selectedTournament],
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (matchData: any) => apiRequest("POST", getAdminEndpoint("/stage2-bracket"), matchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getApiEndpoint('/stage2-bracket'), selectedTournament] });
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

  // Update mutation pentru actualizarea rezultatelor
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `${getAdminEndpoint("/stage2-bracket")}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getApiEndpoint('/stage2-bracket'), selectedTournament] });
      setEditingMatch(null);
      toast({
        title: "Success",
        description: "Rezultatul a fost actualizat cu succes!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Eroare",
        description: error.message || "Eroare la actualizarea rezultatului",
        variant: "destructive",
      });
    },
  });

  // Delete link mutation
  const deleteLinkMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PUT", `/api/admin/stage2-bracket/${id}`, { streamUrl: "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stage2-bracket"] });
      toast({
        title: "Success",
        description: "Link-ul a fost șters cu succes!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Eroare",
        description: error.message || "Eroare la ștergerea link-ului",
        variant: "destructive",
      });
    },
  });

  // Delete match mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/stage2-bracket/${id}`),
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

  // Handler pentru crearea meciului nou
  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const matchData = {
      team1Name: formData.get("team1Name") as string,
      team2Name: formData.get("team2Name") as string,
      bracketPosition: parseInt(formData.get("bracketPosition") as string),
      streamUrl: formData.get("streamUrl") as string || "",
      isPlayed: false,
      technicalWin: false,
      tournamentId: "hator-cs-league"
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

  // Handler pentru actualizarea rezultatelor
  const handleUpdateResult = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingMatch) return;

    const formData = new FormData(event.currentTarget);
    
    const team1Score = formData.get("team1Score") ? parseInt(formData.get("team1Score") as string) : null;
    const team2Score = formData.get("team2Score") ? parseInt(formData.get("team2Score") as string) : null;
    const technicalWin = formData.get("technicalWin") === "true";
    const technicalWinner = formData.get("technicalWinner") as string;
    const streamUrl = formData.get("streamUrl") as string || "";

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
      team1Score,
      team2Score,
      winnerName,
      isPlayed,
      streamUrl,
      technicalWin,
      technicalWinner: technicalWin ? technicalWinner : "",
    };

    updateMutation.mutate(updateData);
  };

  // Sortare meciuri după poziția în plasă
  const matches = (bracket as Stage2Match[]).sort((a, b) => a.bracketPosition - b.bracketPosition);
  const qualifiedTeams = matches.filter(match => match.isPlayed && match.winnerName).length;

  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-5 h-5 text-orange-400" />
          <h2 className="text-xl font-bold text-white">Plasa Stage 2 - Administrare</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          <span className="ml-3 text-white">Se încarcă plasa...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-orange-400" />
          <h2 className="text-xl font-bold text-white">Plasa Stage 2 - Administrare</h2>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">
            Echipe calificate: {qualifiedTeams}/5
          </span>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-orange-500 hover:bg-orange-600"
            disabled={isCreating}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adaugă Meci
          </Button>
        </div>
      </div>

      {/* Create Match Form */}
      {isCreating && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Adaugă Meci Nou</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-white">Echipa 1</Label>
                <select 
                  name="team1Name" 
                  required
                  className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2"
                >
                  <option value="">Selectează echipa 1</option>
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
                  name="team2Name" 
                  required
                  className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2"
                >
                  <option value="">Selectează echipa 2</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-white">Poziția în plasă</Label>
                <Input
                  type="number"
                  name="bracketPosition"
                  min="1"
                  max="5"
                  required
                  className="bg-zinc-700 border-zinc-600 text-white"
                  placeholder="1-5"
                />
              </div>

              <div>
                <Label className="text-white">Link Stream/Faceit</Label>
                <Input
                  type="url"
                  name="streamUrl"
                  className="bg-zinc-700 border-zinc-600 text-white"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Se creează..." : "Creează Meci"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreating(false)}
              >
                Anulează
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Bracket Grid - Similar cu site-ul dar editabil */}
      <div className="space-y-6">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Plasa Stage 2 în preparare</h3>
            <p className="text-gray-400">
              Meciurile vor fi configurate după finalizarea Stage 1
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                className={`bg-zinc-800 border rounded-lg overflow-hidden ${
                  match.isPlayed 
                    ? 'border-green-500/30 bg-green-900/10' 
                    : 'border-orange-500/30 hover:border-orange-500/50'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Match Header */}
                <div className="bg-zinc-700 p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="text-white font-medium text-sm">
                      Meci {match.bracketPosition}
                    </span>
                    {match.isPlayed && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                        Finalizat
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingMatch(match)}
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-xs"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(match.id)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Match Content */}
                <div className="p-4">
                  {/* Teams */}
                  <div className="space-y-3 mb-4">
                    <div className={`flex items-center justify-between p-2 rounded ${
                      match.winnerName === match.team1Name ? 'bg-green-500/20' : 'bg-zinc-700/50'
                    }`}>
                      <span className="text-white font-medium">{match.team1Name}</span>
                      {match.isPlayed && (
                        <span className={`text-lg font-bold ${
                          match.winnerName === match.team1Name ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {match.team1Score ?? 0}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-center text-gray-400 text-sm">VS</div>
                    
                    <div className={`flex items-center justify-between p-2 rounded ${
                      match.winnerName === match.team2Name ? 'bg-green-500/20' : 'bg-zinc-700/50'
                    }`}>
                      <span className="text-white font-medium">{match.team2Name}</span>
                      {match.isPlayed && (
                        <span className={`text-lg font-bold ${
                          match.winnerName === match.team2Name ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {match.team2Score ?? 0}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Technical Win Indicator */}
                  {match.technicalWin && (
                    <div className="mb-3 text-center">
                      <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">
                        ⚙️ Câștig tehnic - {match.technicalWinner}
                      </span>
                    </div>
                  )}

                  {/* Stream Link */}
                  {match.streamUrl && (
                    <div className="text-center">
                      <a
                        href={match.streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-orange-400 hover:text-orange-300 text-sm underline"
                      >
                        <LinkIcon className="w-3 h-3 mr-1" />
                        Faceit/Demo
                      </a>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteLinkMutation.mutate(match.id)}
                        className="ml-2 text-red-400 hover:text-red-300 text-xs p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                Editare Meci {editingMatch.bracketPosition}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingMatch(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleUpdateResult} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Scor {editingMatch.team1Name}</Label>
                  <Input
                    type="number"
                    name="team1Score"
                    min="0"
                    defaultValue={editingMatch.team1Score || ""}
                    className="bg-zinc-700 border-zinc-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Scor {editingMatch.team2Name}</Label>
                  <Input
                    type="number"
                    name="team2Score"
                    min="0"
                    defaultValue={editingMatch.team2Score || ""}
                    className="bg-zinc-700 border-zinc-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Link Faceit/Demo</Label>
                <Input
                  type="url"
                  name="streamUrl"
                  defaultValue={editingMatch.streamUrl || ""}
                  className="bg-zinc-700 border-zinc-600 text-white"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Câștig tehnic</Label>
                <select 
                  name="technicalWin" 
                  defaultValue={editingMatch.technicalWin ? "true" : "false"}
                  className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2"
                >
                  <option value="false">Nu</option>
                  <option value="true">Da</option>
                </select>
              </div>

              <div>
                <Label className="text-white">Câștigător tehnic</Label>
                <select 
                  name="technicalWinner" 
                  defaultValue={editingMatch.technicalWinner || ""}
                  className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2"
                >
                  <option value="">(Niciunul)</option>
                  <option value={editingMatch.team1Name}>{editingMatch.team1Name}</option>
                  <option value={editingMatch.team2Name}>{editingMatch.team2Name}</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  disabled={updateMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Se salvează..." : "Salvează"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingMatch(null)}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Anulează
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}