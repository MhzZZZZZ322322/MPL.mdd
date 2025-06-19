import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Trophy, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MatchResult } from '@shared/schema';

interface Team {
  id: number;
  name: string;
  logoUrl: string;
}

interface MatchFormData {
  groupName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  streamUrl: string;
  tournamentId: string;
}

export default function MatchResultsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchResult | null>(null);
  const [formData, setFormData] = useState<MatchFormData>({
    groupName: '',
    team1Name: '',
    team2Name: '',
    team1Score: 0,
    team2Score: 0,
    streamUrl: '',
    tournamentId: 'hator-cs-league'
  });

  // Fetch match results
  const { data: matchResults = [], isLoading: resultsLoading } = useQuery<MatchResult[]>({
    queryKey: ['/api/admin/match-results'],
    refetchInterval: 30000,
  });

  // Fetch teams for dropdowns
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });

  // Fetch group configuration
  const { data: groupConfig = [] } = useQuery<any[]>({
    queryKey: ['/api/admin/group-config'],
  });

  // Get teams for selected group
  const getTeamsForGroup = (groupName: string) => {
    if (!groupName || !groupConfig.length) return [];
    
    const group = groupConfig.find((g: any) => g.groupName === groupName);
    if (!group || !group.teams) return [];
    
    // Return the teams directly from the group configuration
    return group.teams;
  };

  // Create match mutation
  const createMatchMutation = useMutation({
    mutationFn: async (data: MatchFormData) => {
      const response = await fetch('/api/admin/match-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create match result');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/match-results'] });
      queryClient.invalidateQueries({ queryKey: ['/api/match-results'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Succes",
        description: "Rezultatul meciului a fost adăugat cu succes!",
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

  // Update match mutation
  const updateMatchMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<MatchFormData> }) => {
      const response = await fetch(`/api/admin/match-results/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update match result');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/match-results'] });
      queryClient.invalidateQueries({ queryKey: ['/api/match-results'] });
      setEditingMatch(null);
      resetForm();
      toast({
        title: "Succes",
        description: "Rezultatul meciului a fost actualizat cu succes!",
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

  // Delete match mutation
  const deleteMatchMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/match-results/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete match result');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/match-results'] });
      queryClient.invalidateQueries({ queryKey: ['/api/match-results'] });
      toast({
        title: "Succes",
        description: "Rezultatul meciului a fost șters cu succes!",
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

  const resetForm = () => {
    setFormData({
      groupName: '',
      team1Name: '',
      team2Name: '',
      team1Score: 0,
      team2Score: 0,
      streamUrl: '',
      tournamentId: 'hator-cs-league'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.groupName || !formData.team1Name || !formData.team2Name) {
      toast({
        title: "Eroare",
        description: "Toate câmpurile sunt obligatorii",
        variant: "destructive",
      });
      return;
    }

    if (formData.team1Name === formData.team2Name) {
      toast({
        title: "Eroare",
        description: "Echipele nu pot fi identice",
        variant: "destructive",
      });
      return;
    }

    // CS2 BO1 validation - minimum 13 rounds to win
    const maxScore = Math.max(formData.team1Score, formData.team2Score);
    
    if (maxScore < 13) {
      toast({
        title: "Eroare",
        description: "În CS2 BO1, echipa câștigătoare trebuie să aibă minimum 13 runde",
        variant: "destructive",
      });
      return;
    }

    if (formData.team1Score === formData.team2Score) {
      toast({
        title: "Eroare",
        description: "În CS2 BO1 nu pot fi egaluri. O echipă trebuie să câștige",
        variant: "destructive",
      });
      return;
    }

    if (editingMatch) {
      updateMatchMutation.mutate({ id: editingMatch.id, data: formData });
    } else {
      createMatchMutation.mutate(formData);
    }
  };

  const startEdit = (match: MatchResult) => {
    setEditingMatch(match);
    setFormData({
      groupName: match.groupName,
      team1Name: match.team1Name,
      team2Name: match.team2Name,
      team1Score: match.team1Score,
      team2Score: match.team2Score,
      streamUrl: match.streamUrl || '',
      tournamentId: match.tournamentId
    });
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWinner = (match: MatchResult): string => {
    if (match.team1Score > match.team2Score) return match.team1Name;
    if (match.team2Score > match.team1Score) return match.team2Name;
    return '';
  };

  // Group matches by group
  const groupedMatches = matchResults.reduce((acc, match) => {
    if (!acc[match.groupName]) acc[match.groupName] = [];
    acc[match.groupName].push(match);
    return acc;
  }, {} as Record<string, MatchResult[]>);

  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestionare Rezultate Meciuri</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Adaugă Rezultat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adaugă Rezultat Meci</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="groupName">Grupa</Label>
                <Select value={formData.groupName} onValueChange={(value) => setFormData({
                  ...formData, 
                  groupName: value,
                  team1Name: '', // Reset team selections when group changes
                  team2Name: ''
                })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează grupa" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map(group => (
                      <SelectItem key={group} value={group}>Grupa {group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="team1Name">Echipa 1</Label>
                <Select 
                  value={formData.team1Name} 
                  onValueChange={(value) => setFormData({...formData, team1Name: value})}
                  disabled={!formData.groupName}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.groupName ? "Selectează echipa 1" : "Selectează grupa mai întâi"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getTeamsForGroup(formData.groupName).map((team: Team) => (
                      <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="team1Score">Scor Echipa 1</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.team1Score}
                  onChange={(e) => setFormData({...formData, team1Score: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="team2Name">Echipa 2</Label>
                <Select 
                  value={formData.team2Name} 
                  onValueChange={(value) => setFormData({...formData, team2Name: value})}
                  disabled={!formData.groupName}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.groupName ? "Selectează echipa 2" : "Selectează grupa mai întâi"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getTeamsForGroup(formData.groupName)
                      .filter((team: Team) => team.name !== formData.team1Name)
                      .map((team: Team) => (
                        <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="team2Score">Scor Echipa 2</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.team2Score}
                  onChange={(e) => setFormData({...formData, team2Score: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="streamUrl">Link (opțional)</Label>
                <Input
                  type="url"
                  placeholder="https://www.faceit.com/match/... sau https://www.twitch.tv/..."
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({...formData, streamUrl: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                >
                  Anulează
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMatchMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createMatchMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Salvează
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Match Dialog */}
      <Dialog open={!!editingMatch} onOpenChange={(open) => !open && setEditingMatch(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editează Rezultat Meci</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="groupName">Grupa</Label>
              <Select value={formData.groupName} onValueChange={(value) => setFormData({...formData, groupName: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează grupa" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group} value={group}>Grupa {group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="team1Name">Echipa 1</Label>
              <Select value={formData.team1Name} onValueChange={(value) => setFormData({...formData, team1Name: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează echipa 1" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="team1Score">Scor Echipa 1</Label>
              <Input
                type="number"
                min="0"
                value={formData.team1Score}
                onChange={(e) => setFormData({...formData, team1Score: parseInt(e.target.value) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="team2Name">Echipa 2</Label>
              <Select value={formData.team2Name} onValueChange={(value) => setFormData({...formData, team2Name: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează echipa 2" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="team2Score">Scor Echipa 2</Label>
              <Input
                type="number"
                min="0"
                value={formData.team2Score}
                onChange={(e) => setFormData({...formData, team2Score: parseInt(e.target.value) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="streamUrl">Link (opțional)</Label>
              <Input
                type="url"
                placeholder="https://www.faceit.com/match/... sau https://www.twitch.tv/..."
                value={formData.streamUrl}
                onChange={(e) => setFormData({...formData, streamUrl: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingMatch(null);
                  resetForm();
                }}
              >
                Anulează
              </Button>
              <Button 
                type="submit" 
                disabled={updateMatchMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateMatchMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Actualizează
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {resultsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-white">Se încarcă rezultatele...</span>
        </div>
      ) : (
        <div className="grid gap-6">
          {Object.entries(groupedMatches)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([groupName, matches]) => (
              <Card key={groupName} className="bg-gray-800 border-gray-700">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Grupa {groupName}
                    <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
                      {matches.length} meciuri
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {matches
                      .sort((a, b) => b.id - a.id)
                      .map((match) => {
                        const winner = getWinner(match);
                        return (
                          <div
                            key={match.id}
                            className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-center min-w-[120px]">
                                <p className={`font-semibold ${
                                  winner === match.team1Name ? 'text-green-400' : 'text-gray-300'
                                }`}>
                                  {match.team1Name}
                                </p>
                                {winner === match.team1Name && (
                                  <Trophy className="h-4 w-4 text-green-400 mx-auto mt-1" />
                                )}
                              </div>
                              
                              <div className="text-center px-4">
                                <div 
                                  className={`flex items-center gap-2 text-xl font-bold text-white ${
                                    match.streamUrl ? 'cursor-pointer hover:text-orange-400 transition-colors' : ''
                                  }`}
                                  onClick={match.streamUrl ? () => window.open(match.streamUrl, '_blank') : undefined}
                                  title={match.streamUrl ? "Vezi statistici și demo pe Faceit" : undefined}
                                >
                                  <span className={
                                    match.team1Score > match.team2Score ? 'text-green-400' : 'text-gray-400'
                                  }>
                                    {match.team1Score}
                                  </span>
                                  <span className="text-gray-500">-</span>
                                  <span className={
                                    match.team2Score > match.team1Score ? 'text-green-400' : 'text-gray-400'
                                  }>
                                    {match.team2Score}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">CS2 BO1</p>
                              </div>
                              
                              <div className="text-center min-w-[120px]">
                                <p className={`font-semibold ${
                                  winner === match.team2Name ? 'text-green-400' : 'text-gray-300'
                                }`}>
                                  {match.team2Name}
                                </p>
                                {winner === match.team2Name && (
                                  <Trophy className="h-4 w-4 text-green-400 mx-auto mt-1" />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="flex items-center text-gray-400 text-sm">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(typeof match.matchDate === 'string' ? match.matchDate : match.matchDate?.toISOString() || null)}
                                </div>
                                {winner && (
                                  <Badge variant="outline" className="mt-1 text-green-400 border-green-400">
                                    Câștigător: {winner}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEdit(match)}
                                  className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteMatchMutation.mutate(match.id)}
                                  disabled={deleteMatchMutation.isPending}
                                  className="text-red-400 border-red-400 hover:bg-red-400/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  {matches.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      Nu există rezultate pentru această grupă
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          
          {Object.keys(groupedMatches).length === 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">Nu există rezultate înregistrate</p>
                <p className="text-gray-500 text-sm mt-2">Adaugă primul rezultat folosind butonul de mai sus</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}