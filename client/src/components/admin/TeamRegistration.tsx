import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Minus, Save, Users, UserPlus, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTournamentContext } from "@/pages/TournamentAdminFixed";

interface TeamMember {
  id?: number;
  nickname: string;
  faceitProfile: string;
  discordAccount: string;
  role: string;
  position: string;
}

interface TeamFormData {
  name: string;
  logoUrl: string;
  members: TeamMember[];
}

export default function TeamRegistration() {
  const { selectedTournament, isReadonly } = useTournamentContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    logoUrl: "",
    members: [
      { nickname: "", faceitProfile: "", discordAccount: "", role: "captain", position: "main" },
      { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
      { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
      { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
      { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
    ]
  });

  // Fetch existing teams
  const { data: teams = [] } = useQuery({
    queryKey: [`/api/${selectedTournament === 'kingston' ? 'kingston/' : ''}teams`],
    queryFn: async () => {
      const url = selectedTournament === 'kingston' ? '/api/kingston/teams' : '/api/teams';
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch teams");
      return response.json();
    }
  });

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: async (teamData: TeamFormData) => {
      if (isReadonly) {
        throw new Error("Turneul HATOR este înghețat și nu poate fi modificat");
      }

      const url = selectedTournament === 'kingston' ? '/api/kingston/admin/teams' : '/api/admin/teams';
      
      // Create team first
      const teamResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamData.name,
          logoUrl: teamData.logoUrl
        }),
      });

      if (!teamResponse.ok) {
        const error = await teamResponse.text();
        throw new Error(error);
      }

      const team = await teamResponse.json();

      // Then create team members
      const membersUrl = selectedTournament === 'kingston' ? '/api/kingston/admin/team-members' : '/api/admin/team-members';
      
      for (const member of teamData.members) {
        if (member.nickname && member.faceitProfile && member.discordAccount) {
          await fetch(membersUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              teamId: team.id,
              nickname: member.nickname,
              faceitProfile: member.faceitProfile,
              discordAccount: member.discordAccount,
              role: member.role,
              position: member.position
            }),
          });
        }
      }

      return team;
    },
    onSuccess: () => {
      const baseKey = selectedTournament === 'kingston' ? '/api/kingston/' : '/api/';
      queryClient.invalidateQueries({ queryKey: [`${baseKey}teams`] });
      
      // Reset form
      setFormData({
        name: "",
        logoUrl: "",
        members: [
          { nickname: "", faceitProfile: "", discordAccount: "", role: "captain", position: "main" },
          { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
          { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
          { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
          { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
        ]
      });

      toast({
        title: "Echipa înregistrată",
        description: "Echipa a fost adăugată cu succes în turneu",
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


  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" }]
    }));
  };

  const removeMember = (index: number) => {
    if (formData.members.length > 1) {
      setFormData(prev => ({
        ...prev,
        members: prev.members.filter((_, i) => i !== index)
      }));
    }
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReadonly) {
      toast({
        title: "Acțiune restricționată",
        description: "Turneul HATOR este înghețat și nu poate fi modificat",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.logoUrl) {
      toast({
        title: "Date incomplete",
        description: "Te rog completează numele echipei și logo-ul",
        variant: "destructive",
      });
      return;
    }

    const validMembers = formData.members.filter(m => m.nickname && m.faceitProfile && m.discordAccount);
    if (validMembers.length < 5) {
      toast({
        title: "Echipă incompletă",
        description: "O echipă trebuie să aibă minimum 5 jucători (maximum 10: 5 roster + 5 substitute)",
        variant: "destructive",
      });
      return;
    }

    createTeamMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">

      {/* Team Registration Form */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Înregistrare Echipă Nouă
            {isReadonly && (
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-200">
                Readonly Mode
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamName">Numele echipei *</Label>
                <Input
                  id="teamName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isReadonly}
                  placeholder="Ex: Team Phoenix"
                />
              </div>
              <div>
                <Label htmlFor="logoUrl">URL Logo echipă *</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                  disabled={isReadonly}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            {/* Team Members */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg">Participanți echipă</Label>
                {!isReadonly && (
                  <Button
                    type="button"
                    onClick={addMember}
                    variant="outline"
                    size="sm"
                    disabled={formData.members.length >= 10}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adaugă jucător
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {formData.members.map((member, index) => (
                  <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Jucător {index + 1}</h4>
                      {!isReadonly && formData.members.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeMember(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                      <div>
                        <Label>Nickname *</Label>
                        <Input
                          value={member.nickname}
                          onChange={(e) => updateMember(index, 'nickname', e.target.value)}
                          disabled={isReadonly}
                          placeholder="Ex: ProPlayer123"
                        />
                      </div>

                      <div>
                        <Label>Profil Faceit *</Label>
                        <Input
                          value={member.faceitProfile}
                          onChange={(e) => updateMember(index, 'faceitProfile', e.target.value)}
                          disabled={isReadonly}
                          placeholder="https://faceit.com/player123"
                        />
                      </div>

                      <div>
                        <Label>Discord *</Label>
                        <Input
                          value={member.discordAccount}
                          onChange={(e) => updateMember(index, 'discordAccount', e.target.value)}
                          disabled={isReadonly}
                          placeholder="user#1234"
                        />
                      </div>

                      <div>
                        <Label>Rol</Label>
                        <Select
                          value={member.role}
                          onValueChange={(value) => updateMember(index, 'role', value)}
                          disabled={isReadonly}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="captain">Căpitan</SelectItem>
                            <SelectItem value="player">Jucător</SelectItem>
                            <SelectItem value="coach">Antrenor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Poziție</Label>
                        <Select
                          value={member.position}
                          onValueChange={(value) => updateMember(index, 'position', value)}
                          disabled={isReadonly}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="main">Main</SelectItem>
                            <SelectItem value="substitute">Schimb</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            {!isReadonly && (
              <Button
                type="submit"
                disabled={createTeamMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Înregistrează echipa
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Existing Teams List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Echipe înregistrate ({teams.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nu există echipe înregistrate</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team: any) => (
                <div key={team.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={team.logoUrl}
                      alt={team.name}
                      className="w-8 h-8 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <h3 className="font-medium">{team.name}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    ID: {team.id}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}