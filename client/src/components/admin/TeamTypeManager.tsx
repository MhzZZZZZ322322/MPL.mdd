import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, Trophy, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegisteredTeam {
  id: number;
  name: string;
  logoUrl?: string;
  logoData?: string;
  isDirectInvite: boolean;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy: string;
}

export default function TeamTypeManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch registered teams
  const { data: teams = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/kingston/admin/registered-teams'],
    queryFn: async () => {
      const response = await fetch('/api/kingston/admin/registered-teams');
      if (!response.ok) throw new Error("Failed to fetch registered teams");
      return response.json();
    }
  });

  // Update team type mutation
  const updateTeamTypeMutation = useMutation({
    mutationFn: async ({ teamId, isDirectInvite }: {
      teamId: number;
      isDirectInvite: boolean;
    }) => {
      const response = await fetch(`/api/kingston/admin/teams/${teamId}/type`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDirectInvite })
      });
      if (!response.ok) throw new Error('Failed to update team type');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kingston/admin/registered-teams'] });
      toast({
        title: "Tipul echipei actualizat",
        description: "Tipul echipei a fost modificat cu succes.",
      });
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza tipul echipei.",
        variant: "destructive",
      });
    }
  });

  // Count teams by type
  const directInviteCount = teams.filter((team: RegisteredTeam) => team.isDirectInvite === true).length;
  const qualificationCount = teams.filter((team: RegisteredTeam) => team.isDirectInvite === false).length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Se încarcă echipele...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="mr-3 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">Manager Tipuri Echipe</h2>
                <p className="text-muted-foreground font-normal">
                  Gestionează tipurile echipelor pentru Kingston FURY x HyperX Supercup
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reîmprospătează
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Echipe</p>
                <p className="text-2xl font-bold">{teams.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Invitații Directe</p>
                <p className="text-2xl font-bold text-purple-600">{directInviteCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calificări</p>
                <p className="text-2xl font-bold text-blue-600">{qualificationCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams Management */}
      <Card>
        <CardHeader>
          <CardTitle>Administrare Tipuri Echipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team: RegisteredTeam) => (
              <div
                key={team.id}
                className="border rounded-lg p-4 bg-card hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    {team.logoData ? (
                      <img 
                        src={team.logoData} 
                        alt={team.name} 
                        className="w-full h-full object-contain rounded"
                      />
                    ) : team.logoUrl ? (
                      <img 
                        src={`/api/kingston/teams/${team.id}/logo`} 
                        alt={team.name} 
                        className="w-full h-full object-contain rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
                        }}
                      />
                    ) : null}
                    <Trophy className="w-6 h-6 text-primary" style={{ display: team.logoData || team.logoUrl ? 'none' : 'flex' }} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold">{team.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {team.isDirectInvite === true && (
                        <Badge variant="outline" className="text-purple-600 border-purple-600 bg-purple-50/20">
                          Invitație Directă
                        </Badge>
                      )}
                      {team.isDirectInvite === false && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50/20">
                          Calificare
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Schimbă tipul echipei:</p>
                  <Select 
                    value={team.isDirectInvite ? "direct" : "qualification"} 
                    onValueChange={(value) => {
                      updateTeamTypeMutation.mutate({
                        teamId: team.id,
                        isDirectInvite: value === "direct"
                      });
                    }}
                    disabled={updateTeamTypeMutation.isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span>Invitație Directă</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="qualification">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span>Calificare</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {updateTeamTypeMutation.isPending && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                      Se actualizează...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {teams.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nu există echipe înregistrate încă.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}