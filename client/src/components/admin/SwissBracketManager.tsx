import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Crown, X, Users, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface SwissStanding {
  id: number;
  teamName: string;
  wins: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  status: string;
}

export function SwissBracketManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch standings
  const { data: standings = [] } = useQuery<SwissStanding[]>({
    queryKey: ["/api/stage3-swiss-standings"],
    refetchInterval: 10000,
  });

  // Mutation to update team positions
  const updateTeamMutation = useMutation({
    mutationFn: (data: { id: number; wins: number; losses: number; status: string }) =>
      apiRequest("PUT", `/api/admin/stage3-swiss-team/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stage3-swiss-standings"] });
      toast({
        title: "Succes",
        description: "Poziția echipei a fost actualizată!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Eroare",
        description: error.message || "Eroare la actualizarea poziției",
        variant: "destructive",
      });
    },
  });

  // Group teams by record for easy management
  const getTeamsByRecord = () => {
    const records: { [key: string]: SwissStanding[] } = {};
    
    standings.forEach(team => {
      const record = `${team.wins}-${team.losses}`;
      if (!records[record]) records[record] = [];
      records[record].push(team);
    });

    return records;
  };

  const teamsByRecord = getTeamsByRecord();

  // Move team to different record
  const moveTeam = (team: SwissStanding, newWins: number, newLosses: number) => {
    const status = newWins >= 3 ? 'qualified' : newLosses >= 3 ? 'eliminated' : 'active';
    updateTeamMutation.mutate({
      id: team.id,
      wins: newWins,
      losses: newLosses,
      status
    });
  };

  const renderRecordSection = (record: string, title: string, color: string) => {
    const teams = teamsByRecord[record] || [];
    const [wins, losses] = record.split('-').map(Number);

    return (
      <Card className={`${color} border-opacity-50`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-center text-sm font-bold">
            {title} ({teams.length} echipe)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {teams.map((team, index) => (
            <motion.div
              key={`${record}-${index}`}
              className="bg-slate-700/80 border border-slate-500 rounded p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">{team.teamName}</span>
                <div className="flex space-x-1">
                  {wins < 3 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700 text-white border-green-500"
                      onClick={() => moveTeam(team.teamName, wins + 1, losses)}
                      disabled={updateTeamMutation.isPending}
                    >
                      W
                    </Button>
                  )}
                  {losses < 3 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs bg-red-600 hover:bg-red-700 text-white border-red-500"
                      onClick={() => moveTeam(team.teamName, wins, losses + 1)}
                      disabled={updateTeamMutation.isPending}
                    >
                      L
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-300">
                Status: {team.status} | Rounds: {team.roundsWon}-{team.roundsLost}
              </div>
            </motion.div>
          ))}
          
          {teams.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Nicio echipă în această categorie
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-darkGray/60 border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="mr-2 text-primary" />
            Swiss Bracket Management
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Gestionează pozițiile echipelor în Swiss Bracket. Apasă W pentru victorie sau L pentru înfrângere.
          </p>
        </CardHeader>
      </Card>

      {/* Swiss Records Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Top Row - Winners Path */}
        <div className="space-y-4">
          {renderRecordSection('0-0', '0-0 (START)', 'bg-blue-900/40 border-blue-500')}
          {renderRecordSection('1-0', '1-0', 'bg-green-900/40 border-green-500')}
          {renderRecordSection('2-0', '2-0', 'bg-green-800/40 border-green-400')}
          {renderRecordSection('3-0', '3-0 (QUALIFIED)', 'bg-yellow-900/40 border-yellow-500')}
        </div>

        {/* Middle Row - Mixed Records */}
        <div className="space-y-4">
          {renderRecordSection('0-1', '0-1', 'bg-orange-900/40 border-orange-500')}
          {renderRecordSection('1-1', '1-1', 'bg-yellow-800/40 border-yellow-600')}
          {renderRecordSection('2-1', '2-1', 'bg-orange-800/40 border-orange-400')}
          {renderRecordSection('3-1', '3-1 (QUALIFIED)', 'bg-yellow-900/40 border-yellow-500')}
        </div>

        {/* Bottom Row - Elimination Path */}
        <div className="space-y-4">
          {renderRecordSection('0-2', '0-2', 'bg-red-900/40 border-red-500')}
          {renderRecordSection('1-2', '1-2', 'bg-red-800/40 border-red-400')}
          {renderRecordSection('2-2', '2-2', 'bg-red-700/40 border-red-400')}
          {renderRecordSection('0-3', '0-3 (ELIMINATED)', 'bg-red-900/60 border-red-600')}
          {renderRecordSection('1-3', '1-3 (ELIMINATED)', 'bg-red-900/60 border-red-600')}
          {renderRecordSection('2-3', '2-3 (ELIMINATED)', 'bg-red-900/60 border-red-600')}
          {renderRecordSection('3-2', '3-2 (QUALIFIED)', 'bg-yellow-900/40 border-yellow-500')}
        </div>
      </div>

      {/* Statistics */}
      <Card className="bg-darkGray/60 border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="mr-2 text-primary" />
            Statistici Swiss
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {standings.filter(t => t.status === 'qualified' || t.wins >= 3).length}
              </div>
              <div className="text-sm text-gray-300">Calificate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {standings.filter(t => t.status === 'active' && t.wins < 3 && t.losses < 3).length}
              </div>
              <div className="text-sm text-gray-300">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {standings.filter(t => t.status === 'eliminated' || t.losses >= 3).length}
              </div>
              <div className="text-sm text-gray-300">Eliminate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}