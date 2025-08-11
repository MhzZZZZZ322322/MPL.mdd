import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Eye, Clock, Users, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: number;
  nickname: string;
  faceitProfile: string;
  discordAccount: string;
  role: string;
  position: string;
}

interface PendingTeam {
  id: number;
  name: string;
  logoUrl: string;
  status: string;
  submittedAt: string;
  members: TeamMember[];
}

export default function TeamApprovalManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<PendingTeam | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Fetch pending teams
  const { data: pendingTeams = [], isLoading } = useQuery({
    queryKey: ['/api/kingston/admin/pending-teams'],
    queryFn: async () => {
      const response = await fetch('/api/kingston/admin/pending-teams');
      if (!response.ok) throw new Error("Failed to fetch pending teams");
      return response.json();
    }
  });

  // Review team mutation
  const reviewTeamMutation = useMutation({
    mutationFn: async ({ teamId, status, rejectionReason }: { 
      teamId: number; 
      status: 'approved' | 'rejected'; 
      rejectionReason?: string 
    }) => {
      const response = await fetch(`/api/kingston/admin/teams/${teamId}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kingston/admin/pending-teams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/kingston/teams'] });
      setShowRejectDialog(false);
      setRejectionReason("");
      setSelectedTeam(null);
      
      toast({
        title: "Cererea procesată",
        description: "Echipa a fost evaluată cu succes",
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

  const handleApprove = (teamId: number) => {
    reviewTeamMutation.mutate({ teamId, status: 'approved' });
  };

  const handleReject = (team: PendingTeam) => {
    setSelectedTeam(team);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (selectedTeam) {
      reviewTeamMutation.mutate({ 
        teamId: selectedTeam.id, 
        status: 'rejected',
        rejectionReason: rejectionReason || "Nu au fost îndeplinite criteriile de eligibilitate"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Se încarcă cererile de înregistrare...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Cereri de înregistrare echipe ({pendingTeams.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTeams.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Nu există cereri de înregistrare în așteptare
            </p>
          ) : (
            <div className="space-y-4">
              {pendingTeams.map((team: PendingTeam) => (
                <Card key={team.id} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-team-logo.png';
                          }}
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{team.name}</h3>
                          <p className="text-sm text-gray-400">
                            Trimisă: {formatDate(team.submittedAt)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="bg-amber-500/20 text-amber-200">
                              <Clock className="w-3 h-3 mr-1" />
                              În așteptare
                            </Badge>
                            <Badge variant="outline">
                              {team.members.length} membri
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Detalii
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <img
                                  src={team.logoUrl}
                                  alt={team.name}
                                  className="w-6 h-6 rounded"
                                />
                                {team.name} - Detalii echipă
                              </DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Informații generale</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-400">Nume echipă:</span>
                                    <p>{team.name}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Data trimiterii:</span>
                                    <p>{formatDate(team.submittedAt)}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-3">Membri echipă ({team.members.length})</h4>
                                <div className="space-y-3">
                                  {team.members.map((member) => (
                                    <div key={member.id} className="p-3 bg-slate-700/50 rounded-lg">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <span className="font-medium">{member.nickname}</span>
                                          <div className="flex gap-2 mt-1">
                                            <Badge variant={member.role === 'captain' ? 'default' : 'secondary'} className="text-xs">
                                              {member.role === 'captain' ? 'Căpitan' : 
                                               member.role === 'player' ? 'Jucător' : 'Antrenor'}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                              {member.position === 'main' ? 'Main' : 'Schimb'}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-1">
                                            <ExternalLink className="w-3 h-3" />
                                            <a 
                                              href={member.faceitProfile} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-blue-400 hover:text-blue-300 text-xs"
                                            >
                                              Profil Faceit
                                            </a>
                                          </div>
                                          <p className="text-xs text-gray-400">
                                            Discord: {member.discordAccount}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          onClick={() => handleApprove(team.id)}
                          disabled={reviewTeamMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Aprobă
                        </Button>
                        
                        <Button
                          onClick={() => handleReject(team)}
                          disabled={reviewTeamMutation.isPending}
                          variant="destructive"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Respinge
                        </Button>
                      </div>
                    </div>
                    
                    {/* Quick team info */}
                    <div className="border-t border-slate-600 pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-400">
                            Căpitan: {team.members.find(m => m.role === 'captain')?.nickname || 'N/A'}
                          </span>
                          <span className="text-gray-400">
                            Jucători main: {team.members.filter(m => m.position === 'main').length}
                          </span>
                          <span className="text-gray-400">
                            Schimbi: {team.members.filter(m => m.position === 'substitute').length}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ID: {team.id}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-red-400">
              Respinge cererea de înregistrare
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedTeam && (
              <p className="text-sm text-gray-300">
                Ești pe cale să respingi cererea echipei <strong>{selectedTeam.name}</strong>.
                Te rog să oferi un motiv pentru respingere:
              </p>
            )}
            
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: Date incomplete, profiluri Faceit invalide, echipa nu îndeplinește criteriile..."
              className="bg-slate-700 border-slate-600"
              rows={3}
            />
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Anulează
              </Button>
              <Button
                variant="destructive"
                onClick={confirmReject}
                disabled={reviewTeamMutation.isPending}
              >
                Confirmă respingerea
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}