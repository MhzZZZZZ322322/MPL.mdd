import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Settings, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GroupManagement from "@/components/GroupManagement";
import MatchResultsManager from "@/components/admin/MatchResultsManager";
import ScheduleManager from "@/components/admin/ScheduleManager";
import { Stage2BracketManager } from "@/components/admin/Stage2BracketManager";
import { Stage3SwissManager } from "@/components/admin/Stage3SwissManager";

export default function TournamentAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkBg to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Trophy className="mr-3 text-primary" />
            Admin Grupe Turneu - HATOR CS2 LEAGUE MOLDOVA
          </h1>
          
          <Tabs defaultValue="management" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
              <TabsTrigger value="management" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurare Grupe
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Rezultate Meciuri
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Program Meciuri
              </TabsTrigger>
              <TabsTrigger value="stage2" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Stage 2 Bracket
              </TabsTrigger>
              <TabsTrigger value="stage3" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Stage 3 Swiss
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="management" className="mt-6">
              <GroupManagement />
            </TabsContent>
            
            <TabsContent value="results" className="mt-6">
              <MatchResultsManager />
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-6">
              <ScheduleManager />
            </TabsContent>
            
            <TabsContent value="stage2" className="mt-6">
              <Stage2BracketManager />
            </TabsContent>
            
            <TabsContent value="stage3" className="mt-6">
              <Stage3SwissManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}