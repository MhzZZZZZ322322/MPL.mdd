import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Plus, Edit, Trash2, Target, Users, Trophy, Calendar, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface GroupMatch {
  id: number;
  groupName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number | null;
  team2Score: number | null;
  winnerId: number | null;
  streamUrl: string | null;
  technicalWin: boolean;
  technicalWinner: string | null;
  faceitUrl: string | null;
  matchDate: string;
  matchTime: string;
  dayOfWeek: string;
  isPlayed: boolean;
}

interface GroupStanding {
  teamName: string;
  groupName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  roundDifference: number;
  points: number;
  position: number;
}

interface NewMatch {
  groupName: string;
  team1Name: string;
  team2Name: string;
  matchDate: string;
  matchTime: string;
  dayOfWeek: string;
  faceitUrl: string;
}

// Programul din infografică pentru ETAPA 1 - GRUPE
const SCHEDULE_TEMPLATE = [
  // 11 septembrie (Joi)
  { date: "11 septembrie", dayOfWeek: "Joi", time: "19:00", slot: "A1 vs A2" },
  { date: "11 septembrie", dayOfWeek: "Joi", time: "20:10", slot: "A1 vs A3" },
  { date: "11 septembrie", dayOfWeek: "Joi", time: "21:20", slot: "A1 vs A4" },
  
  // 12 septembrie (Vineri)
  { date: "12 septembrie", dayOfWeek: "Vineri", time: "19:00", slot: "B1 vs B2" },
  { date: "12 septembrie", dayOfWeek: "Vineri", time: "20:10", slot: "B1 vs B3" },
  { date: "12 septembrie", dayOfWeek: "Vineri", time: "21:20", slot: "B1 vs B4" },
  
  // 13 septembrie (Sâmbătă)
  { date: "13 septembrie", dayOfWeek: "Sâmbătă", time: "16:00", slot: "C1 vs C2" },
  { date: "13 septembrie", dayOfWeek: "Sâmbătă", time: "17:10", slot: "C1 vs C3" },
  { date: "13 septembrie", dayOfWeek: "Sâmbătă", time: "18:20", slot: "C1 vs C4" },
  
  // 14 septembrie (Duminică)
  { date: "14 septembrie", dayOfWeek: "Duminică", time: "16:00", slot: "D1 vs D2" },
  { date: "14 septembrie", dayOfWeek: "Duminică", time: "17:10", slot: "D1 vs D3" },
  { date: "14 septembrie", dayOfWeek: "Duminică", time: "18:20", slot: "D1 vs D4" },
];

export function KingstonGroupManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingMatch, setEditingMatch] = useState<GroupMatch | null>(null);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("A");
  const [newMatch, setNewMatch] = useState<NewMatch>({
    groupName: "A",
    team1Name: "",
    team2Name: "",
    matchDate: "11 septembrie",
    matchTime: "19:00",
    dayOfWeek: "Joi",
    faceitUrl: ""
  });

  // Fetch group matches
  const { data: matches = [] } = useQuery<GroupMatch[]>({
    queryKey: ["/api/kingston/group-matches"],
    refetchInterval: 10000,
  });

  // Fetch group standings
  const { data: standings = [] } = useQuery<GroupStanding[]>({
    queryKey: ["/api/kingston/group-standings"],
    refetchInterval: 10000,
  });

  // Fetch group configuration to get teams
  const { data: groupConfig = [] } = useQuery({
    queryKey: ["/api/kingston/admin/group-config"],
  });

  // Get teams for selected group
  const getTeamsForGroup = (groupName: string) => {
    const group = (groupConfig as any[])?.find((g: any) => g.groupName === groupName);
    return group ? group.teams : [];
  };

  // Create match mutation
  const createMatchMutation = useMutation({
    mutationFn: async (match: NewMatch) => {
      const response = await fetch("/api/kingston/admin/group-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(match),
      });
      if (!response.ok) throw new Error("Failed to create match");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kingston/group-matches"] });
      setIsCreatingMatch(false);
      setNewMatch({
        groupName: "A",
        team1Name: "",
        team2Name: "",
        matchDate: "11 septembrie",
        matchTime: "19:00",
        dayOfWeek: "Joi",
        faceitUrl: ""
      });
      toast({
        title: "Succes",
        description: "Meciul a fost programat cu succes",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: error.message || "Eroare la programarea meciului",
        variant: "destructive",
      });
    },
  });

  // Update match result mutation
  const updateMatchMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<GroupMatch> & { id: number }) => {
      const response = await fetch(`/api/kingston/admin/group-matches/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update match");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kingston/group-matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/kingston/group-standings"] });
      setEditingMatch(null);
      toast({
        title: "Succes",
        description: "Rezultatul meciului a fost actualizat",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: error.message || "Eroare la actualizarea rezultatului",
        variant: "destructive",
      });
    },
  });

  // Auto-generate matches from template
  const generateScheduleMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/kingston/admin/generate-group-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to generate schedule");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kingston/group-matches"] });
      toast({
        title: "Succes",
        description: "Programul ETAPA 1 - GRUPE a fost generat cu succes",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: error.message || "Eroare la generarea programului",
        variant: "destructive",
      });
    },
  });

  const handleSaveMatchResult = () => {
    if (!editingMatch) return;
    
    const team1Score = editingMatch.team1Score || 0;
    const team2Score = editingMatch.team2Score || 0;
    
    if (team1Score === team2Score) {
      toast({
        title: "Eroare",
        description: "În CS2 nu pot fi rezultate egale. Trebuie să fie un câștigător.",
        variant: "destructive",
      });
      return;
    }

    const winnerName = team1Score > team2Score ? editingMatch.team1Name : editingMatch.team2Name;

    updateMatchMutation.mutate({
      id: editingMatch.id,
      team1Score,
      team2Score,
      winnerId: team1Score > team2Score ? 1 : 2, // Simplified winner ID
      isPlayed: true,
      streamUrl: editingMatch.streamUrl,
      technicalWin: editingMatch.technicalWin,
      technicalWinner: editingMatch.technicalWin ? editingMatch.technicalWinner : null,
    });
  };

  const filteredMatches = matches.filter(match => match.groupName === selectedGroup);
  const filteredStandings = standings.filter(standing => standing.groupName === selectedGroup);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Users className="mr-2 text-primary" />
            ETAPA 1 - GRUPE (11-14 septembrie)
          </h2>
          <p className="text-gray-400 mt-1">Configurare rezultate și clasamente pentru grupele A, B, C, D</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => generateScheduleMutation.mutate()}
            disabled={generateScheduleMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Generează Program
          </Button>
          <Button
            onClick={() => setIsCreatingMatch(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Meci Nou
          </Button>
        </div>
      </div>

      {/* Group Selector */}
      <Card className="bg-darkGray/60 border-primary/20">
        <CardHeader>
          <CardTitle className="text-white">Selectează Grupa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {["A", "B", "C", "D"].map((group) => (
              <Button
                key={group}
                onClick={() => setSelectedGroup(group)}
                variant={selectedGroup === group ? "default" : "outline"}
                className={selectedGroup === group ? "bg-primary" : "border-primary/50"}
              >
                Grupa {group}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Group Standings */}
      <Card className="bg-darkGray/60 border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="mr-2 text-primary" />
            Clasament Grupa {selectedGroup}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {filteredStandings.map((team, index) => (
              <div
                key={team.teamName}
                className="flex items-center justify-between p-3 bg-darkBg/60 rounded-lg border border-primary/10"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 font-mono w-6">{team.position}.</span>
                  <span className="text-white font-medium">{team.teamName}</span>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <span className="text-blue-400">{team.points} pts</span>
                  <span className="text-green-400">{team.wins}W</span>
                  <span className="text-red-400">{team.losses}L</span>
                  <span className="text-gray-400">{team.roundsWon}-{team.roundsLost}</span>
                  <span className="text-primary">
                    {team.roundDifference > 0 ? '+' : ''}{team.roundDifference}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Matches */}
      <Card className="bg-darkGray/60 border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="mr-2 text-primary" />
            Meciuri Grupa {selectedGroup}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredMatches.map((match) => (
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
                          min="0"
                          max="16"
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
                          min="0"
                          max="16"
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
                        placeholder="https://faceit.com/..."
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingMatch.technicalWin}
                          onChange={(e) => setEditingMatch({
                            ...editingMatch,
                            technicalWin: e.target.checked
                          })}
                          className="rounded border-primary/20"
                        />
                        <span className="text-white text-sm">Câștig tehnic</span>
                      </label>
                      {editingMatch.technicalWin && (
                        <Select
                          value={editingMatch.technicalWinner || ""}
                          onValueChange={(value) => setEditingMatch({
                            ...editingMatch,
                            technicalWinner: value
                          })}
                        >
                          <SelectTrigger className="w-48 bg-darkGray border-primary/20 text-white">
                            <SelectValue placeholder="Selectează câștigătorul" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={match.team1Name}>{match.team1Name}</SelectItem>
                            <SelectItem value={match.team2Name}>{match.team2Name}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSaveMatchResult}
                        disabled={updateMatchMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvează
                      </Button>
                      <Button
                        onClick={() => setEditingMatch(null)}
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-darkGray"
                      >
                        Anulează
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
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
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {match.matchDate} ({match.dayOfWeek})
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {match.matchTime}
                        </div>
                        <span className="bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded">
                          BO1
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setEditingMatch(match)}
                        size="sm"
                        variant="outline"
                        className="border-primary/50 text-primary hover:bg-primary/10"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create New Match Modal */}
      {isCreatingMatch && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <Card className="bg-darkGray border-primary/20 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Programează Meci Nou</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Grupa</Label>
                <Select
                  value={newMatch.groupName}
                  onValueChange={(value) => setNewMatch({ ...newMatch, groupName: value })}
                >
                  <SelectTrigger className="bg-darkGray border-primary/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((group) => (
                      <SelectItem key={group} value={group}>Grupa {group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Echipa 1</Label>
                  <Select
                    value={newMatch.team1Name}
                    onValueChange={(value) => setNewMatch({ ...newMatch, team1Name: value })}
                  >
                    <SelectTrigger className="bg-darkGray border-primary/20 text-white">
                      <SelectValue placeholder="Selectează" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTeamsForGroup(newMatch.groupName).map((team: any) => (
                        <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Echipa 2</Label>
                  <Select
                    value={newMatch.team2Name}
                    onValueChange={(value) => setNewMatch({ ...newMatch, team2Name: value })}
                  >
                    <SelectTrigger className="bg-darkGray border-primary/20 text-white">
                      <SelectValue placeholder="Selectează" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTeamsForGroup(newMatch.groupName).map((team: any) => (
                        <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Data</Label>
                  <Select
                    value={newMatch.matchDate}
                    onValueChange={(value) => {
                      const schedule = SCHEDULE_TEMPLATE.find(s => s.date === value);
                      setNewMatch({ 
                        ...newMatch, 
                        matchDate: value,
                        dayOfWeek: schedule?.dayOfWeek || "Joi"
                      });
                    }}
                  >
                    <SelectTrigger className="bg-darkGray border-primary/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(new Set(SCHEDULE_TEMPLATE.map(s => s.date))).map((date) => (
                        <SelectItem key={date} value={date}>{date}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Ora</Label>
                  <Select
                    value={newMatch.matchTime}
                    onValueChange={(value) => setNewMatch({ ...newMatch, matchTime: value })}
                  >
                    <SelectTrigger className="bg-darkGray border-primary/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(new Set(SCHEDULE_TEMPLATE.map(s => s.time))).map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Link Faceit (opțional)</Label>
                <Input
                  value={newMatch.faceitUrl}
                  onChange={(e) => setNewMatch({ ...newMatch, faceitUrl: e.target.value })}
                  className="bg-darkGray border-primary/20 text-white"
                  placeholder="https://faceit.com/..."
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => createMatchMutation.mutate(newMatch)}
                  disabled={createMatchMutation.isPending || !newMatch.team1Name || !newMatch.team2Name}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Programează
                </Button>
                <Button
                  onClick={() => setIsCreatingMatch(false)}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-darkGray"
                >
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