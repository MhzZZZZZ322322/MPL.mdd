import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Users, Eye, Calendar, Trophy, Upload, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: number;
  teamId: number;
  nickname: string;
  faceitProfile: string;
  discordAccount: string;
  role: string;
  position: string;
}

interface EditableTeamMember {
  id?: number;
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
  isDirectInvite?: boolean;
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
  const [editedLogo, setEditedLogo] = useState<string | null>(null);
  const [editedMembers, setEditedMembers] = useState<EditableTeamMember[]>([]);
  const [editedIsDirectInvite, setEditedIsDirectInvite] = useState<boolean>(false);
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

  // Update team mutation (comprehensive)
  const updateTeamMutation = useMutation({
    mutationFn: async ({ 
      teamId, 
      name, 
      logoData, 
      members,
      isDirectInvite 
    }: { 
      teamId: number; 
      name: string; 
      logoData?: string; 
      members: EditableTeamMember[];
      isDirectInvite?: boolean 
    }) => {
      const response = await fetch(`/api/kingston/admin/teams/${teamId}/full-update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, logoData, members, isDirectInvite }),
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
      setEditedLogo(null);
      setEditedMembers([]);
      setEditedIsDirectInvite(false);
      
      toast({
        title: "Echipa actualizată",
        description: "Toate detaliile echipei au fost modificate cu succes.",
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

  const handleEdit = async (team: RegisteredTeam) => {
    setEditingTeam(team);
    setEditedName(team.name);
    setEditedLogo(team.logoData || null);
    setEditedIsDirectInvite(team.isDirectInvite || false);
    
    // Fetch current team members
    try {
      const response = await fetch(`/api/kingston/teams/${team.id}/members`);
      if (response.ok) {
        const members = await response.json();
        setEditedMembers(members.map((member: TeamMember) => ({
          id: member.id,
          nickname: member.nickname,
          faceitProfile: member.faceitProfile || '',
          discordAccount: member.discordAccount || '',
          role: member.role,
          position: member.position
        })));
      } else {
        setEditedMembers([]);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setEditedMembers([]);
    }
    
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingTeam || !editedName.trim()) return;
    
    updateTeamMutation.mutate({
      teamId: editingTeam.id,
      name: editedName.trim(),
      logoData: editedLogo || undefined,
      members: editedMembers,
      isDirectInvite: editedIsDirectInvite
    });
  };

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Eroare",
        description: "Vă rugăm să selectați un fișier imagine valid.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Eroare",
        description: "Imaginea este prea mare. Dimensiunea maximă este 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setEditedLogo(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleAddMember = () => {
    setEditedMembers(prev => [...prev, {
      nickname: '',
      faceitProfile: '',
      discordAccount: '',
      role: 'member',
      position: 'main'
    }]);
  };

  const handleRemoveMember = (index: number) => {
    setEditedMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, field: keyof EditableTeamMember, value: string) => {
    setEditedMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    ));
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
            <Badge variant="secondary">Kingston FURY Tournament</Badge>
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
                          {team.isDirectInvite === true && (
                            <Badge variant="outline" className="text-purple-600 border-purple-600 bg-purple-50/50">
                              Invitație Directă
                            </Badge>
                          )}
                          {team.isDirectInvite === false && (
                            <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50/50">
                              Calificare
                            </Badge>
                          )}
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
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto" style={{zIndex: 9999}}>
          <DialogHeader>
            <DialogTitle>🔴 DIALOGUL CORECT - Editează Echipa - {editingTeam?.name} - DEBUG: {String(editedIsDirectInvite)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Debug Info */}
            <div className="bg-blue-100 p-2 text-xs">
              DEBUG: isDirectInvite = {String(editedIsDirectInvite)}
            </div>
            
            {/* Team Type Selection - MOVED TO TOP FOR TESTING */}
            <div className="border-4 border-green-500 rounded-lg p-4 bg-green-50">
              <Label className="text-xl font-bold text-green-600">SELECTOR TIP ECHIPĂ (TOP)</Label>
              <div className="mt-2">
                <Select 
                  value={editedIsDirectInvite ? "direct" : "qualification"} 
                  onValueChange={(value) => setEditedIsDirectInvite(value === "direct")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selectează tipul echipei" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span>Invitație Directă (12 locuri)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="qualification">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Calificare (20 locuri)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Alege tipul pentru această echipă în turneu
                </p>
              </div>
            </div>
            
            {/* Team Name */}
            <div>
              <Label htmlFor="team-name" className="text-sm font-medium">
                Nume echipă
              </Label>
              <Input
                id="team-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Introduceți numele echipei"
                className="mt-1"
              />
            </div>

            {/* Team Logo */}
            <div>
              <Label className="text-sm font-medium">Logo echipă</Label>
              <div className="mt-2 space-y-3">
                {editedLogo && (
                  <div className="flex items-center space-x-3">
                    <img 
                      src={editedLogo} 
                      alt="Logo preview" 
                      className="w-16 h-16 object-contain rounded border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditedLogo(null)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Șterge logo
                    </Button>
                  </div>
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formate acceptate: JPG, PNG, GIF. Mărime maximă: 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Team Type Selection - Direct sau Calificare */}
            <div className="border-2 border-red-500 rounded-lg p-4 bg-red-50">
              <Label className="text-lg font-bold text-red-600">TIPUL ECHIPEI ÎN TURNEU</Label>
              <div className="mt-2">
                <Select 
                  value={editedIsDirectInvite ? "direct" : "qualification"} 
                  onValueChange={(value) => setEditedIsDirectInvite(value === "direct")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selectează tipul echipei" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span>Invitație Directă (12 locuri)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="qualification">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Calificare (20 locuri)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Alege tipul pentru această echipă în turneu
                </p>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Membri echipei</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddMember}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adaugă membru
                </Button>
              </div>
              
              <div className="space-y-4">
                {editedMembers.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-card/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Membru #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500">Nickname</Label>
                        <Input
                          value={member.nickname}
                          onChange={(e) => handleMemberChange(index, 'nickname', e.target.value)}
                          placeholder="Nickname jucător"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-500">FACEIT Profile</Label>
                        <Input
                          value={member.faceitProfile}
                          onChange={(e) => handleMemberChange(index, 'faceitProfile', e.target.value)}
                          placeholder="https://www.faceit.com/..."
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-500">Discord Account</Label>
                        <Input
                          value={member.discordAccount}
                          onChange={(e) => handleMemberChange(index, 'discordAccount', e.target.value)}
                          placeholder="nume#1234"
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Label className="text-xs text-gray-500">Rol</Label>
                          <Select 
                            value={member.role} 
                            onValueChange={(value) => handleMemberChange(index, 'role', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="captain">Căpitan</SelectItem>
                              <SelectItem value="member">Membru</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex-1">
                          <Label className="text-xs text-gray-500">Poziție</Label>
                          <Select 
                            value={member.position} 
                            onValueChange={(value) => handleMemberChange(index, 'position', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="main">Titular</SelectItem>
                              <SelectItem value="substitute">Rezervă</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {editedMembers.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <Users className="mx-auto h-8 w-8 mb-2" />
                    <p>Nu sunt membri adăugați încă.</p>
                    <p className="text-sm">Folosește butonul "Adaugă membru" pentru a începe.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
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
                {updateTeamMutation.isPending ? "Se salvează..." : "Salvează toate modificările"}
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