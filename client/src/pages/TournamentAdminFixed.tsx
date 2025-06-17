import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trophy, Users, RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GroupManagement from "@/components/GroupManagement";
import MatchResultsManager from "@/components/admin/MatchResultsManager";

interface MatchResult {
  team1: string;
  team2: string;
  team1Score: number;
  team2Score: number;
  groupName: string;
}

export default function TournamentAdmin() {
  const [newMatch, setNewMatch] = useState<MatchResult>({
    team1: '',
    team2: '',
    team1Score: 0,
    team2Score: 0,
    groupName: 'A'
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch teams
  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['/api/teams'],
  });

  // Fetch standings
  const { data: standings = [], isLoading: standingsLoading } = useQuery({
    queryKey: ['/api/admin/group-standings'],
  });

  // Initialize groups mutation
  const initGroupsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/initialize-groups', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to initialize groups');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/group-config'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/group-standings'] });
      toast({
        title: "Succes",
        description: "Grupele au fost inițializate cu succes",
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

  // Reset tournament mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/reset-tournament', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to reset tournament');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/group-config'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/group-standings'] });
      toast({
        title: "Succes",
        description: "Turneul a fost resetat cu succes",
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

  // Add match mutation
  const addMatchMutation = useMutation({
    mutationFn: async (match: MatchResult) => {
      const response = await fetch('/api/admin/add-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(match),
      });
      if (!response.ok) throw new Error('Failed to add match');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/group-standings'] });
      setNewMatch({
        team1: '',
        team2: '',
        team1Score: 0,
        team2Score: 0,
        groupName: 'A'
      });
      toast({
        title: "Succes",
        description: "Meciul a fost adăugat cu succes",
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

  const handleAddMatch = () => {
    if (!newMatch.team1 || !newMatch.team2 || newMatch.team1 === newMatch.team2) {
      toast({
        title: "Eroare",
        description: "Selectează două echipe diferite",
        variant: "destructive",
      });
      return;
    }

    const totalScore = newMatch.team1Score + newMatch.team2Score;
    const maxScore = Math.max(newMatch.team1Score, newMatch.team2Score);
    
    if (maxScore < 13 || totalScore < 13) {
      toast({
        title: "Eroare", 
        description: "Scorul este invalid pentru CS2 BO1 (minim 13 runde pentru câștigător)",
        variant: "destructive",
      });
      return;
    }

    if (Math.abs(newMatch.team1Score - newMatch.team2Score) < 2 && maxScore < 16) {
      toast({
        title: "Eroare",
        description: "Pentru CS2 BO1, diferența trebuie să fie de minim 2 runde sau scorul maxim 16",
        variant: "destructive",
      });
      return;
    }

    if (maxScore > 16) {
      toast({
        title: "Eroare",
        description: "Scorul maxim pentru CS2 BO1 este 16",
        variant: "destructive",
      });
      return;
    }

    addMatchMutation.mutate(newMatch);
  };

  // Get teams for a specific group
  const getTeamsByGroup = (groupName: string) => {
    const groupIndex = groupName.charCodeAt(0) - 65; // A=0, B=1, etc.
    const teamsPerGroup = groupIndex === 6 ? 7 : 6; // Group G has 7 teams
    const startIndex = groupIndex === 6 ? 36 : groupIndex * 6;
    
    return (teams as any[]).slice(startIndex, startIndex + teamsPerGroup);
  };

  // Get standings for a specific group
  const getStandingsByGroup = (groupName: string) => {
    return (standings as any[]).filter((team: any) => team.groupName === groupName)
      .sort((a: any, b: any) => {
        if (a.points !== b.points) return b.points - a.points;
        if (a.roundDifference !== b.roundDifference) return b.roundDifference - a.roundDifference;
        return b.roundsWon - a.roundsWon;
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkBg to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Trophy className="mr-3 text-primary" />
            Admin Grupe Turneu - HATOR CS2 LEAGUE MOLDOVA
          </h1>
          
          <Tabs defaultValue="management" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="management" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurare Grupe
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Rezultate Meciuri
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="management" className="mt-6">
              <GroupManagement />
            </TabsContent>
            
            <TabsContent value="results" className="mt-6">
              <MatchResultsManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}