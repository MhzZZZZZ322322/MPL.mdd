import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Minus, Save, RotateCcw, Users, ArrowUpDown, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTournamentContext } from "@/pages/TournamentAdminFixed";

interface Team {
  id: number;
  name: string;
  logoUrl: string;
}

interface GroupConfig {
  groupName: string;
  displayName: string;
  teams: Team[];
}

export default function GroupManagement() {
  const { selectedTournament, isReadonly } = useTournamentContext();
  const [groups, setGroups] = useState<GroupConfig[]>([
    { groupName: 'A', displayName: 'Group A', teams: [] },
    { groupName: 'B', displayName: 'Group B', teams: [] },
    { groupName: 'C', displayName: 'Group C', teams: [] },
    { groupName: 'D', displayName: 'Group D', teams: [] },
    { groupName: 'E', displayName: 'Group E', teams: [] },
    { groupName: 'F', displayName: 'Group F', teams: [] },
    { groupName: 'G', displayName: 'Group G', teams: [] },
  ]);

  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('A');
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all teams based on selected tournament
  const { data: allTeams = [] } = useQuery<Team[]>({
    queryKey: [`/api/${selectedTournament === 'kingston' ? 'kingston/' : ''}teams`],
    queryFn: async () => {
      const url = selectedTournament === 'kingston' ? '/api/kingston/teams' : '/api/teams';
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch teams");
      return response.json();
    }
  });

  // Fetch current group configuration based on selected tournament
  const { data: currentConfig, refetch: refetchConfig } = useQuery({
    queryKey: [`/api/${selectedTournament === 'kingston' ? 'kingston/' : ''}admin/group-config`],
    queryFn: async () => {
      const url = selectedTournament === 'kingston' ? '/api/kingston/admin/group-config' : '/api/admin/group-config';
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch group config");
      return response.json();
    },
    refetchInterval: 10000,
  });

  // Load current configuration when available
  useEffect(() => {
    if (currentConfig && Array.isArray(currentConfig)) {
      setGroups(currentConfig);
    }
  }, [currentConfig]);

  // Save group configuration mutation
  const saveConfigMutation = useMutation({
    mutationFn: async (groupConfig: GroupConfig[]) => {
      // Nu permite salvarea pentru HATOR (readonly)
      if (isReadonly) {
        throw new Error("Turneul HATOR este înghețat și nu poate fi modificat");
      }
      
      const url = selectedTournament === 'kingston' ? '/api/kingston/admin/save-group-config' : '/api/admin/save-group-config';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groups: groupConfig }),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return response.json();
    },
    onSuccess: () => {
      const baseKey = selectedTournament === 'kingston' ? '/api/kingston/' : '/api/';
      queryClient.invalidateQueries({ queryKey: [`${baseKey}admin/group-standings`] });
      queryClient.invalidateQueries({ queryKey: [`${baseKey}tournament-groups`] });
      queryClient.invalidateQueries({ queryKey: [`${baseKey}admin/group-config`] });
      toast({
        title: "Configurație salvată",
        description: "Grupele au fost actualizate cu succes",
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

  // Auto-distribute teams mutation
  const autoDistributeMutation = useMutation({
    mutationFn: async () => {
      // Nu permite auto-distribuția pentru HATOR (readonly)
      if (isReadonly) {
        throw new Error("Turneul HATOR este înghețat și nu poate fi modificat");
      }
      
      const url = selectedTournament === 'kingston' ? '/api/kingston/admin/auto-distribute-teams' : '/api/admin/auto-distribute-teams';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return response.json();
    },
    onSuccess: (data) => {
      setGroups(data.groups);
      const baseKey = selectedTournament === 'kingston' ? '/api/kingston/' : '/api/';
      queryClient.invalidateQueries({ queryKey: [`${baseKey}admin/group-config`] });
      toast({
        title: "Distribuție automată completă",
        description: `${data.teamsDistributed} echipe au fost distribuite în ${data.groupsCount} grupe`,
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

  // Get available teams (not assigned to any group)
  const getAvailableTeams = () => {
    const assignedTeamIds = groups.flatMap(group => group.teams.map(team => team.id));
    return (allTeams as any[]).filter(team => !assignedTeamIds.includes(team.id));
  };

  // Add team to group
  const addTeamToGroup = () => {
    if (isReadonly) {
      toast({
        title: "Acțiune restricționată",
        description: "Turneul HATOR este înghețat și nu poate fi modificat",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedTeam || !selectedGroup) return;

    const team = (allTeams as any[]).find(t => t.id === parseInt(selectedTeam));
    if (!team) return;

    const updatedGroups = groups.map(group => {
      if (group.groupName === selectedGroup) {
        return {
          ...group,
          teams: [...group.teams, team]
        };
      }
      return group;
    });

    setGroups(updatedGroups);
    setSelectedTeam('');
  };

  // Remove team from group
  const removeTeamFromGroup = (groupName: string, teamId: number) => {
    if (isReadonly) {
      toast({
        title: "Acțiune restricționată",
        description: "Turneul HATOR este înghețat și nu poate fi modificat",
        variant: "destructive",
      });
      return;
    }
    
    const updatedGroups = groups.map(group => {
      if (group.groupName === groupName) {
        return {
          ...group,
          teams: group.teams.filter(team => team.id !== teamId)
        };
      }
      return group;
    });

    setGroups(updatedGroups);
  };

  // Move team between groups
  const moveTeam = (fromGroup: string, toGroup: string, teamId: number) => {
    const team = groups.find(g => g.groupName === fromGroup)?.teams.find(t => t.id === teamId);
    if (!team) return;

    removeTeamFromGroup(fromGroup, teamId);
    
    const updatedGroups = groups.map(group => {
      if (group.groupName === toGroup) {
        return {
          ...group,
          teams: [...group.teams, team]
        };
      }
      return group;
    });

    setGroups(updatedGroups);
  };

  // Reset groups
  const resetGroups = () => {
    setGroups([
      { groupName: 'A', displayName: 'Group A', teams: [] },
      { groupName: 'B', displayName: 'Group B', teams: [] },
      { groupName: 'C', displayName: 'Group C', teams: [] },
      { groupName: 'D', displayName: 'Group D', teams: [] },
      { groupName: 'E', displayName: 'Group E', teams: [] },
      { groupName: 'F', displayName: 'Group F', teams: [] },
      { groupName: 'G', displayName: 'Group G', teams: [] },
    ]);
  };

  const availableTeams = getAvailableTeams();
  const totalAssigned = groups.reduce((sum, group) => sum + group.teams.length, 0);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Configurare Grupe Turneu
            {isReadonly && (
              <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-amber-900/30 border border-amber-500/30 rounded-lg">
                <Lock className="w-4 h-4 text-amber-500" />
                <span className="text-amber-200 text-sm font-medium">Readonly Mode</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Avertisment pentru readonly */}
          {isReadonly && (
            <div className="flex items-center space-x-2 p-4 mb-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-amber-200 font-medium">Vizualizare fără editare</p>
                <p className="text-amber-300/80 text-sm">Turneul HATOR este înghețat. Pentru editare, selectează turneul Kingston.</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-400">Total echipe:</span>
                <span className="ml-2 font-bold text-white">{allTeams.length}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Distribuite:</span>
                <span className="ml-2 font-bold text-green-400">{totalAssigned}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Rămase:</span>
                <span className="ml-2 font-bold text-yellow-400">{availableTeams.length}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => autoDistributeMutation.mutate()}
                disabled={autoDistributeMutation.isPending || isReadonly}
                className={`${isReadonly ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Distribuție automată
              </Button>
              <Button
                onClick={resetGroups}
                disabled={isReadonly}
                variant="outline"
                className={`border-slate-600 ${isReadonly ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={() => saveConfigMutation.mutate(groups)}
                disabled={saveConfigMutation.isPending || isReadonly}
                className={`${isReadonly ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvează
              </Button>
            </div>
          </div>

          {/* Add Team Controls */}
          {!isReadonly && (
            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Adaugă echipă în grupă</h4>
              <div className="flex gap-3">
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="w-32 bg-slate-600 border-slate-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map(group => (
                      <SelectItem key={group.groupName} value={group.groupName}>
                        Grupa {group.groupName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="flex-1 bg-slate-600 border-slate-500">
                    <SelectValue placeholder="Selectează echipa" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams.map((team: any) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={addTeamToGroup}
                  disabled={!selectedTeam || !selectedGroup}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adaugă
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {groups.map(group => (
          <Card key={group.groupName} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-center text-primary">
                {group.displayName}
                <Badge variant="secondary" className="ml-2">
                  {group.teams.length} echipe
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 min-h-[200px]">
                {group.teams.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nu există echipe</p>
                  </div>
                ) : (
                  group.teams.map((team, index) => (
                    <div 
                      key={team.id}
                      className="flex items-center justify-between p-2 bg-slate-700/50 rounded group hover:bg-slate-700/70 transition-colors"
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span className="text-xs font-mono w-6 text-center text-gray-400">
                          {index + 1}.
                        </span>
                        <div className="w-6 h-6 rounded-sm overflow-hidden bg-slate-600 flex-shrink-0">
                          <img 
                            src={team.logoUrl} 
                            alt={team.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="text-sm truncate">{team.name}</span>
                      </div>
                      
                      {!isReadonly && (
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Select onValueChange={(toGroup) => moveTeam(group.groupName, toGroup, team.id)}>
                            <SelectTrigger className="w-12 h-6 text-xs bg-slate-600 border-slate-500">
                              <ArrowUpDown className="w-3 h-3" />
                            </SelectTrigger>
                            <SelectContent>
                              {groups
                                .filter(g => g.groupName !== group.groupName)
                                .map(g => (
                                <SelectItem key={g.groupName} value={g.groupName}>
                                  {g.groupName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeTeamFromGroup(group.groupName, team.id)}
                            className="h-6 w-6 p-0 hover:bg-red-600/20"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Teams */}
      {availableTeams.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">
              Echipe nedistribuite ({availableTeams.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              {availableTeams.map((team: any) => (
                <div 
                  key={team.id}
                  className="flex items-center space-x-2 p-2 bg-slate-700/30 rounded text-sm"
                >
                  <div className="w-5 h-5 rounded overflow-hidden bg-slate-600 flex-shrink-0">
                    <img 
                      src={team.logoUrl} 
                      alt={team.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="truncate">{team.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}