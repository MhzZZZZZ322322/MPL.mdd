import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Save, Plus } from 'lucide-react';

interface Stage4PlayoffMatch {
  id: number;
  bracketPosition: string;
  team1Name: string | null;
  team2Name: string | null;
  team1Score: number | null;
  team2Score: number | null;
  winnerName: string | null;
  matchDate: string | null;
  matchTime: string | null;
  isPlayed: boolean;
  faceitUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NewMatch {
  bracketPosition: string;
  team1Name: string;
  team2Name: string;
  team1Score: number | null;
  team2Score: number | null;
  winnerName: string;
  matchDate: string;
  matchTime: string;
  isPlayed: boolean;
  faceitUrl: string;
}

const BRACKET_POSITIONS = [
  { value: 'QF1', label: 'Sferturi - Meciul 1' },
  { value: 'QF2', label: 'Sferturi - Meciul 2' },
  { value: 'QF3', label: 'Sferturi - Meciul 3' },
  { value: 'QF4', label: 'Sferturi - Meciul 4' },
  { value: 'SF1', label: 'Semifinale - Meciul 1' },
  { value: 'SF2', label: 'Semifinale - Meciul 2' },
  { value: 'FINAL', label: 'Finala' },
];

// Stage 3 Swiss qualified teams (top 8)
const QUALIFIED_TEAMS = [
  "LitEnergy", "K9 Team", "La Passion", "XPlosion", "VeryGoodTeam", 
  "Saponel", "Wenzo", "Bobb3rs"
];

export default function Stage4PlayoffManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editingMatch, setEditingMatch] = useState<Stage4PlayoffMatch | null>(null);
  const [newMatch, setNewMatch] = useState<NewMatch>({
    bracketPosition: 'QF1',
    team1Name: '',
    team2Name: '',
    team1Score: null,
    team2Score: null,
    winnerName: '',
    matchDate: '2025-07-18',
    matchTime: '19:00',
    isPlayed: false,
    faceitUrl: ''
  });

  const { data: matches = [], isLoading } = useQuery<Stage4PlayoffMatch[]>({
    queryKey: ['/api/stage4-playoff'],
    refetchInterval: 5000,
  });

  const createMutation = useMutation({
    mutationFn: (match: NewMatch) => apiRequest('POST', '/api/admin/stage4-playoff', match),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stage4-playoff'] });
      setNewMatch({
        bracketPosition: 'QF1',
        team1Name: '',
        team2Name: '',
        team1Score: null,
        team2Score: null,
        winnerName: '',
        matchDate: '2025-07-18',
        matchTime: '19:00',
        isPlayed: false,
        faceitUrl: ''
      });
      toast({ title: "Succes", description: "Meciul a fost adăugat cu succes!" });
    },
    onError: (error: any) => {
      toast({ title: "Eroare", description: error.message || "A apărut o eroare la adăugarea meciului.", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, match }: { id: number; match: Partial<NewMatch> }) =>
      apiRequest('PUT', `/api/admin/stage4-playoff/${id}`, match),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stage4-playoff'] });
      setEditingMatch(null);
      toast({ title: "Succes", description: "Meciul a fost actualizat cu succes!" });
    },
    onError: (error: any) => {
      toast({ title: "Eroare", description: error.message || "A apărut o eroare la actualizarea meciului.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/stage4-playoff/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stage4-playoff'] });
      toast({ title: "Succes", description: "Meciul a fost șters cu succes!" });
    },
    onError: (error: any) => {
      toast({ title: "Eroare", description: error.message || "A apărut o eroare la ștergerea meciului.", variant: "destructive" });
    }
  });

  const handleCreateMatch = () => {
    if (!newMatch.team1Name || !newMatch.team2Name) {
      toast({ title: "Eroare", description: "Selectează ambele echipe.", variant: "destructive" });
      return;
    }
    if (newMatch.team1Name === newMatch.team2Name) {
      toast({ title: "Eroare", description: "O echipă nu poate juca împotriva sa.", variant: "destructive" });
      return;
    }

    // Determinăm bracketRound din bracketPosition
    let bracketRound = 'quarterfinals';
    let bracketPositionNum = 1;
    
    if (newMatch.bracketPosition.startsWith('QF')) {
      bracketRound = 'quarterfinals';
      bracketPositionNum = parseInt(newMatch.bracketPosition.replace('QF', ''));
    } else if (newMatch.bracketPosition.startsWith('SF')) {
      bracketRound = 'semifinals';
      bracketPositionNum = parseInt(newMatch.bracketPosition.replace('SF', ''));
    } else if (newMatch.bracketPosition === 'F') {
      bracketRound = 'final';
      bracketPositionNum = 1;
    } else if (newMatch.bracketPosition === 'TP') {
      bracketRound = 'third_place';
      bracketPositionNum = 1;
    }

    const matchToCreate = {
      ...newMatch,
      bracketRound,
      bracketPosition: bracketPositionNum,
      playDate: newMatch.matchDate,
      streamUrl: newMatch.faceitUrl || null,
      matchDate: newMatch.matchDate && newMatch.matchTime ? 
        `${newMatch.matchDate}T${newMatch.matchTime}:00` : null
    };

    createMutation.mutate(matchToCreate);
  };

  const handleUpdateMatch = () => {
    if (!editingMatch) return;
    
    // Formatăm datele pentru update similar cu create
    let bracketRound = editingMatch.bracketRound || 'quarterfinals';
    let bracketPositionNum = editingMatch.bracketPosition;
    
    const matchToUpdate = {
      ...editingMatch,
      bracketRound,
      bracketPosition: bracketPositionNum,
      playDate: editingMatch.matchDate || editingMatch.playDate,
      streamUrl: editingMatch.faceitUrl || editingMatch.streamUrl || null,
      matchDate: editingMatch.matchDate ? new Date(editingMatch.matchDate).toISOString() : null
    };
    
    updateMutation.mutate({
      id: editingMatch.id,
      match: matchToUpdate
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestionare Stage 4 Playoff</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create New Match */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adaugă Meci Nou - Stage 4 Playoff
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bracketPosition">Poziția în bracket</Label>
              <select
                id="bracketPosition"
                value={newMatch.bracketPosition}
                onChange={(e) => setNewMatch(prev => ({ ...prev, bracketPosition: e.target.value }))}
                className="w-full p-2 border rounded-md bg-background"
              >
                {BRACKET_POSITIONS.map(pos => (
                  <option key={pos.value} value={pos.value}>{pos.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="team1">Echipa 1</Label>
              <select
                id="team1"
                value={newMatch.team1Name}
                onChange={(e) => setNewMatch(prev => ({ ...prev, team1Name: e.target.value }))}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="">Selectează echipa 1</option>
                {QUALIFIED_TEAMS.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="team2">Echipa 2</Label>
              <select
                id="team2"
                value={newMatch.team2Name}
                onChange={(e) => setNewMatch(prev => ({ ...prev, team2Name: e.target.value }))}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="">Selectează echipa 2</option>
                {QUALIFIED_TEAMS.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="matchDate">Data meciului</Label>
              <Input
                id="matchDate"
                type="date"
                value={newMatch.matchDate}
                onChange={(e) => setNewMatch(prev => ({ ...prev, matchDate: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="matchTime">Ora meciului</Label>
              <Input
                id="matchTime"
                type="time"
                value={newMatch.matchTime}
                onChange={(e) => setNewMatch(prev => ({ ...prev, matchTime: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="faceitUrl">Link Faceit</Label>
              <Input
                id="faceitUrl"
                type="url"
                placeholder="https://faceit.com/..."
                value={newMatch.faceitUrl}
                onChange={(e) => setNewMatch(prev => ({ ...prev, faceitUrl: e.target.value }))}
              />
            </div>
          </div>
          
          <Button onClick={handleCreateMatch} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Se adaugă...' : 'Adaugă Meci'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Meciurile Programate - Stage 4 Playoff</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total meciuri: {matches.length} | Jucate: {matches.filter(m => m.isPlayed).length}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {matches.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nu există meciuri programate pentru Stage 4 Playoff.
            </p>
          ) : (
            matches
              .sort((a, b) => a.bracketPosition - b.bracketPosition)
              .map(match => (
                <Card key={match.id} className="p-4">
                  {editingMatch?.id === match.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label>Poziția în bracket</Label>
                          <select
                            value={editingMatch.bracketPosition}
                            onChange={(e) => setEditingMatch(prev => prev ? { ...prev, bracketPosition: e.target.value } : null)}
                            className="w-full p-2 border rounded-md bg-background"
                          >
                            {BRACKET_POSITIONS.map(pos => (
                              <option key={pos.value} value={pos.value}>{pos.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <Label>Echipa 1</Label>
                          <select
                            value={editingMatch.team1Name || ''}
                            onChange={(e) => setEditingMatch(prev => prev ? { ...prev, team1Name: e.target.value } : null)}
                            className="w-full p-2 border rounded-md bg-background"
                          >
                            <option value="">Selectează echipa 1</option>
                            {QUALIFIED_TEAMS.map(team => (
                              <option key={team} value={team}>{team}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <Label>Echipa 2</Label>
                          <select
                            value={editingMatch.team2Name || ''}
                            onChange={(e) => setEditingMatch(prev => prev ? { ...prev, team2Name: e.target.value } : null)}
                            className="w-full p-2 border rounded-md bg-background"
                          >
                            <option value="">Selectează echipa 2</option>
                            {QUALIFIED_TEAMS.map(team => (
                              <option key={team} value={team}>{team}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <Label>Scor Echipa 1</Label>
                          <Input
                            type="number"
                            min="0"
                            value={editingMatch.team1Score || ''}
                            onChange={(e) => setEditingMatch(prev => prev ? { ...prev, team1Score: e.target.value ? parseInt(e.target.value) : null } : null)}
                          />
                        </div>
                        
                        <div>
                          <Label>Scor Echipa 2</Label>
                          <Input
                            type="number"
                            min="0"
                            value={editingMatch.team2Score || ''}
                            onChange={(e) => setEditingMatch(prev => prev ? { ...prev, team2Score: e.target.value ? parseInt(e.target.value) : null } : null)}
                          />
                        </div>
                        
                        <div>
                          <Label>Echipa câștigătoare</Label>
                          <select
                            value={editingMatch.winnerName || ''}
                            onChange={(e) => setEditingMatch(prev => prev ? { ...prev, winnerName: e.target.value, isPlayed: !!e.target.value } : null)}
                            className="w-full p-2 border rounded-md bg-background"
                          >
                            <option value="">Meciul nu s-a terminat</option>
                            {editingMatch.team1Name && <option value={editingMatch.team1Name}>{editingMatch.team1Name}</option>}
                            {editingMatch.team2Name && <option value={editingMatch.team2Name}>{editingMatch.team2Name}</option>}
                          </select>
                        </div>
                        
                        <div>
                          <Label>Data meciului</Label>
                          <Input
                            type="date"
                            value={editingMatch.matchDate || ''}
                            onChange={(e) => setEditingMatch(prev => prev ? { ...prev, matchDate: e.target.value } : null)}
                          />
                        </div>
                        
                        <div>
                          <Label>Ora meciului</Label>
                          <Input
                            type="time"
                            value={editingMatch.matchTime || ''}
                            onChange={(e) => setEditingMatch(prev => prev ? { ...prev, matchTime: e.target.value } : null)}
                          />
                        </div>
                        
                        <div>
                          <Label>Link Faceit</Label>
                          <Input
                            type="url"
                            value={editingMatch.faceitUrl || ''}
                            onChange={(e) => setEditingMatch(prev => prev ? { ...prev, faceitUrl: e.target.value } : null)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateMatch} disabled={updateMutation.isPending}>
                          <Save className="h-4 w-4 mr-2" />
                          {updateMutation.isPending ? 'Se salvează...' : 'Salvează'}
                        </Button>
                        <Button variant="outline" onClick={() => setEditingMatch(null)}>
                          Anulează
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{match.bracketPosition}</Badge>
                          <span className="font-medium">
                            {match.team1Name || 'TBD'} vs {match.team2Name || 'TBD'}
                          </span>
                          {match.isPlayed && match.winnerName && (
                            <Badge className="bg-green-600">
                              🏆 {match.winnerName}
                            </Badge>
                          )}
                        </div>
                        {match.isPlayed && match.team1Score !== null && match.team2Score !== null && (
                          <div className="text-sm text-muted-foreground">
                            Scor: {match.team1Score} - {match.team2Score}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {match.matchDate} {match.matchTime && `la ${match.matchTime}`}
                        </div>
                        {match.faceitUrl && (
                          <a 
                            href={match.faceitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            🔗 Faceit
                          </a>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingMatch(match)}>
                          Editează
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteMutation.mutate(match.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}