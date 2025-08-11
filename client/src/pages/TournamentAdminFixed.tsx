import { useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Settings, Calendar, AlertTriangle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GroupManagement from "@/components/GroupManagement";
import MatchResultsManager from "@/components/admin/MatchResultsManager";
import ScheduleManager from "@/components/admin/ScheduleManager";
import { Stage2BracketManager } from "@/components/admin/Stage2BracketManager";
import { Stage3SwissRoundsManager } from "@/components/admin/Stage3SwissRoundsManager";
import Stage4PlayoffManager from "@/components/admin/Stage4PlayoffManager";
import TeamRegistration from "@/components/admin/TeamRegistration";

// Context pentru turneul selectat
interface TournamentContextType {
  selectedTournament: 'hator' | 'kingston';
  isReadonly: boolean;
}

const TournamentContext = createContext<TournamentContextType>({
  selectedTournament: 'hator',
  isReadonly: true
});

export const useTournamentContext = () => useContext(TournamentContext);

export default function TournamentAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedTournament, setSelectedTournament] = useState<'hator' | 'kingston'>('hator');
  
  // HATOR este readonly (înghețat), Kingston este editabil
  const isReadonly = selectedTournament === 'hator';
  
  const tournamentNames = {
    hator: 'HATOR CS2 LEAGUE MOLDOVA',
    kingston: 'Kingston x HyperX - Supercup Season 1'
  };

  return (
    <TournamentContext.Provider value={{ selectedTournament, isReadonly }}>
      <div className="min-h-screen bg-gradient-to-b from-darkBg to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center">
              <Trophy className="mr-3 text-primary" />
              Admin Grupe Turneu
            </h1>
            
            {/* Selector Turneu */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-lg font-medium">Selectează turneul pentru gestionare:</label>
                <Select value={selectedTournament} onValueChange={(value: 'hator' | 'kingston') => setSelectedTournament(value)}>
                  <SelectTrigger className="w-80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hator">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span>HATOR CS2 LEAGUE (Readonly - Înghețat)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="kingston">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-green-500" />
                        <span>Kingston x HyperX Supercup (Editabil)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Avertisment pentru HATOR */}
              {isReadonly && (
                <div className="flex items-center space-x-2 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-amber-200 font-medium">Turneul HATOR este înghețat (readonly)</p>
                    <p className="text-amber-300/80 text-sm">Datele pot fi vizualizate dar nu pot fi modificate. Pentru editare, selectează turneul Kingston.</p>
                  </div>
                </div>
              )}
              
              {/* Info pentru Kingston */}
              {!isReadonly && (
                <div className="flex items-center space-x-2 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <Settings className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-green-200 font-medium">Turneul Kingston x HyperX este editabil</p>
                    <p className="text-green-300/80 text-sm">Poți adăuga, modifica și șterge echipe, meciuri și rezultate pentru acest turneu.</p>
                  </div>
                </div>
              )}
              
              <h2 className="text-xl font-semibold text-gray-300">
                Gestionezi: {tournamentNames[selectedTournament]}
              </h2>
            </div>
          
            <Tabs defaultValue="teams" className="w-full">
              <TabsList className="grid w-full grid-cols-7 bg-slate-800/50">
                <TabsTrigger value="teams" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Înregistrare Echipe
                </TabsTrigger>
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
                  Stage 2 Swiss
                </TabsTrigger>
                <TabsTrigger value="stage3-rounds" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Stage 3 Playoff
                </TabsTrigger>
                <TabsTrigger value="stage4-playoff" className="flex items-center gap-2 opacity-50" disabled>
                  <Trophy className="w-4 h-4" />
                  Stage 4 (Reserved)
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="teams" className="mt-6">
                <TeamRegistration />
              </TabsContent>
              
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
              
              <TabsContent value="stage3-rounds" className="mt-6">
                <Stage3SwissRoundsManager />
              </TabsContent>
              
              <TabsContent value="stage4-playoff" className="mt-6">
                <Stage4PlayoffManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </TournamentContext.Provider>
  );
}