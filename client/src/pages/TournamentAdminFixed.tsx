import { useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Settings, Calendar, AlertTriangle, Lock, Users, FileText, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GroupManagement from "@/components/GroupManagement";
import MatchResultsManager from "@/components/admin/MatchResultsManager";
import ScheduleManager from "@/components/admin/ScheduleManager";
import { Stage2BracketManager } from "@/components/admin/Stage2BracketManager";
import { Stage3SwissRoundsManager } from "@/components/admin/Stage3SwissRoundsManager";
import Stage4PlayoffManager from "@/components/admin/Stage4PlayoffManager";
import TeamRegistration from "@/components/admin/TeamRegistration";
import TeamApprovalManager from "@/components/admin/TeamApprovalManager";
import RegisteredTeamsManager from "@/components/admin/RegisteredTeamsManager";
import TeamTypeManager from "@/components/admin/TeamTypeManager";

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
  
  // HATOR este readonly (înghețat), Kingston FURY este editabil
  const isReadonly = selectedTournament === 'hator';
  
  const tournamentNames = {
    hator: 'HATOR CS2 LEAGUE MOLDOVA',
    kingston: 'Kingston FURY x HyperX - Supercup Season 1'
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
                        <span>Kingston FURY x HyperX Supercup (Editabil)</span>
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
                    <p className="text-amber-300/80 text-sm">Datele pot fi vizualizate dar nu pot fi modificate. Pentru editare, selectează turneul Kingston FURY.</p>
                  </div>
                </div>
              )}
              
              {/* Info pentru Kingston FURY */}
              {!isReadonly && (
                <div className="flex items-center space-x-2 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <Settings className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-green-200 font-medium">Turneul Kingston FURY x HyperX este editabil</p>
                    <p className="text-green-300/80 text-sm">Poți adăuga, modifica și șterge echipe, meciuri și rezultate pentru acest turneu.</p>
                  </div>
                </div>
              )}
              
              <h2 className="text-xl font-semibold text-gray-300">
                Gestionezi: {tournamentNames[selectedTournament]}
              </h2>
            </div>
          
            <Tabs defaultValue="team-approval" className="w-full">
              <TabsList className="grid w-full grid-cols-11 bg-slate-800/50">
                <TabsTrigger value="team-approval" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Aprobare Echipe
                </TabsTrigger>
                <TabsTrigger value="registered-teams" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Echipe Înregistrate
                </TabsTrigger>
                <TabsTrigger value="team-types" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Tipuri Echipe
                </TabsTrigger>
                <TabsTrigger value="teams" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Adăugare Echipe
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
                  Stage 2 Double Elim
                </TabsTrigger>
                <TabsTrigger value="stage3-rounds" className="flex items-center gap-2 opacity-50" disabled>
                  <Settings className="w-4 h-4" />
                  Stage 3 (Eliminat)
                </TabsTrigger>
                <TabsTrigger value="stage4-playoff" className="flex items-center gap-2 opacity-50" disabled>
                  <Trophy className="w-4 h-4" />
                  Stage 4 (Eliminat)
                </TabsTrigger>

              </TabsList>
              
              <TabsContent value="team-approval" className="mt-6">
                <TeamApprovalManager />
              </TabsContent>
              
              <TabsContent value="registered-teams" className="mt-6">
                <RegisteredTeamsManager />
              </TabsContent>
              
              <TabsContent value="team-types" className="mt-6">
                <TeamTypeManager />
              </TabsContent>
              
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
                {selectedTournament === 'hator' ? (
                  <Stage3SwissRoundsManager />
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/10 border border-amber-500/30 rounded-lg p-8 max-w-2xl mx-auto">
                      <Zap className="mx-auto h-16 w-16 text-amber-400 mb-4" />
                      <h3 className="text-xl font-semibold text-amber-300 mb-3">Format Actualizat</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Turneul Kingston FURY a fost restructurat: <strong>nu mai folosește Swiss System</strong>. 
                        Noul format: Stage 1 (8 grupe de 4 echipe) → Stage 2 (Double Elimination cu 16 echipe).
                      </p>
                      <p className="text-gray-400 text-sm mt-4">
                        Stage 3 Swiss a fost eliminat din formatul oficial al turneului.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="stage4-playoff" className="mt-6">
                {selectedTournament === 'hator' ? (
                  <Stage4PlayoffManager />
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/10 border border-amber-500/30 rounded-lg p-8 max-w-2xl mx-auto">
                      <Zap className="mx-auto h-16 w-16 text-amber-400 mb-4" />
                      <h3 className="text-xl font-semibold text-amber-300 mb-3">Format Actualizat</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Turneul Kingston FURY are acum doar <strong>2 stages</strong>. 
                        Stage 2 (Double Elimination) este etapa finală - nu mai există Stage 4 Playoff.
                      </p>
                      <p className="text-gray-400 text-sm mt-4">
                        Toate finalizările se desfășoară în Stage 2 Double Elimination.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
              

            </Tabs>
          </div>
        </div>
      </div>
    </TournamentContext.Provider>
  );
}