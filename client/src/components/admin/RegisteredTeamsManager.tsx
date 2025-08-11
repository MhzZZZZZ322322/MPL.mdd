import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Users, Eye, Calendar, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: number;
  nickname: string;
  faceitProfile: string;
  discordAccount: string;
  role: string;
  position: string;
}

interface RegisteredTeam {
  id: number;
  name: string;
  logoUrl: string;
  logoData?: string;
  tournament: string;
  status: string;
  submittedAt: string;
  reviewedAt: string;
  reviewedBy: string;
  members?: TeamMember[];
}

export default function RegisteredTeamsManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<RegisteredTeam | null>(null);
  const [editingTeam, setEditingTeam] = useState<RegisteredTeam | null>(null);
  const [editedName, setEditedName] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);

  // Fetch registered teams
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['/api/kingston/admin/registered-teams'],
    queryFn: async () => {
      const response = await fetch('/api/kingston/admin/registered-teams');
      if (!response.ok) throw new Error("Failed to fetch registered teams");
      return response.json();
    }
  });

  // Fetch team members when viewing details
  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ['/api/kingston/teams', selectedTeam?.id, 'members'],
    queryFn: async () => {
      if (!selectedTeam) return [];
      const response = await fetch(`/api/kingston/teams/${selectedTeam.id}/members`);
      if (!response.ok) throw new Error("Failed to fetch team members");
      return response.json();
    },
    enabled: !!selectedTeam && showMembersDialog
  });

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: async ({ teamId, name }: { teamId: number; name: string }) => {
      const response = await fetch(`/api/kingston/admin/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kingston/admin/registered-teams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/kingston/teams'] });
      setShowEditDialog(false);
      setEditingTeam(null);
      setEditedName("");
      
      toast({
        title: "Echipa actualizată",
        description: "Numele echipei a fost modificat cu succes.",
        variant: "default",
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

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      const response = await fetch(`/api/kingston/admin/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kingston/admin/registered-teams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/kingston/teams'] });
      
      toast({
        title: "Echipa ștearsă",
        description: "Echipa a fost eliminată din turneu cu succes.",
        variant: "default",
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

  const handleEdit = (team: RegisteredTeam) => {
    setEditingTeam(team);
    setEditedName(team.name);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingTeam || !editedName.trim()) return;
    
    updateTeamMutation.mutate({
      teamId: editingTeam.id,
      name: editedName.trim()
    });
  };

  const handleDelete = (teamId: number) => {
    deleteTeamMutation.mutate(teamId);
  };

  const handleViewMembers = (team: RegisteredTeam) => {
    setSelectedTeam(team);
    setShowMembersDialog(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2" />
            Echipe Înregistrate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="mr-2" />
              Echipe Înregistrate ({teams.length})
            </div>
            <Badge variant="secondary">Kingston Tournament</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nu există echipe înregistrate încă.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {teams.map((team: RegisteredTeam) => (
                <div
                  key={team.id}
                  className="border rounded-lg p-4 bg-card/50 hover:bg-card/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        {team.logoData ? (
                          <img 
                            src={team.logoData} 
                            alt={team.name} 
                            className="w-full h-full object-contain rounded"
                          />
                        ) : (
                          <Trophy className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{team.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Înregistrată: {new Date(team.submittedAt).toLocaleDateString('ro-RO')}
                          </span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Aprobată
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewMembers(team)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Vezi membri
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(team)}
                        className="text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editează
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Șterge
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Șterge echipa?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Ești sigur că vrei să ștergi echipa "{team.name}"? Această acțiune nu poate fi anulată.
                              Toți membrii echipei vor fi, de asemenea, eliminați.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Anulează</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(team.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Da, șterge echipa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Team Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editează Echipa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nume echipă</label>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Introduceți numele echipei"
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={updateTeamMutation.isPending}
              >
                Anulează
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={!editedName.trim() || updateTeamMutation.isPending}
              >
                {updateTeamMutation.isPending ? "Se salvează..." : "Salvează"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Team Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Users className="mr-2" />
              Membri echipei: {selectedTeam?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {teamMembers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nu sunt membri înregistrați pentru această echipă.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="border rounded-lg p-4 bg-card/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{member.nickname}</h4>
                      <div className="flex space-x-2">
                        <Badge 
                          variant={member.role === 'captain' ? 'default' : 'secondary'}
                          className={member.role === 'captain' ? 'bg-primary' : ''}
                        >
                          {member.role === 'captain' ? 'Căpitan' : 'Jucător'}
                        </Badge>
                        <Badge variant="outline">
                          {member.position === 'main' ? 'Titular' : 'Rezervă'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>
                        <strong>FACEIT:</strong>{' '}
                        {member.faceitProfile ? (
                          <a 
                            href={member.faceitProfile} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Vezi profil
                          </a>
                        ) : (
                          'Nu este specificat'
                        )}
                      </p>
                      <p><strong>Discord:</strong> {member.discordAccount || 'Nu este specificat'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}