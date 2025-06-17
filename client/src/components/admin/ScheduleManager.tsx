import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock, Edit, Plus, Link, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ScheduleDay {
  date: string;
  dayName: string;
  matches: ScheduleMatch[];
}

// Transform scheduled matches into schedule format grouped by days
const transformScheduleData = (matches: any[]) => {
  if (!matches) return [];
  
  const dayNames = {
    "18.06.2025": { display: "18 Iunie 2025", dayName: "Miercuri" },
    "19.06.2025": { display: "19 Iunie 2025", dayName: "Joi" },
    "20.06.2025": { display: "20 Iunie 2025", dayName: "Vineri" },
    "25.06.2025": { display: "25 Iunie 2025", dayName: "Miercuri" },
    "26.06.2025": { display: "26 Iunie 2025", dayName: "Joi" },
    "27.06.2025": { display: "27 Iunie 2025", dayName: "Vineri" },
    "28.06.2025": { display: "28 Iunie 2025", dayName: "Sâmbătă" }
  };
  
  const grouped = matches.reduce((acc, match) => {
    const dateKey = match.date || "18.06.2025";
    const dayInfo = dayNames[dateKey] || { display: dateKey, dayName: "Necunoscut" };
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dayInfo.display,
        dayName: dayInfo.dayName,
        matches: []
      };
    }
    
    acc[dateKey].matches.push({
      ...match,
      faceitUrl: match.faceitUrl || ""
    });
    
    return acc;
  }, {} as Record<string, any>);
  
  return Object.values(grouped).sort((a: any, b: any) => {
    const dateA = a.date.split(' ')[0];
    const dateB = b.date.split(' ')[0];
    return dateA.localeCompare(dateB);
  });
};

interface ScheduleMatch {
  time: string;
  team1: string;
  team2: string;
  group: string;
  stage: string;
  faceitUrl?: string;
}

const scheduleData: ScheduleDay[] = [
  {
    date: "18 Iunie 2025",
    dayName: "Miercuri",
    matches: [
      { time: "18:00", team1: "Kamikaze Clan", team2: "Saponel", group: "Grupa A", stage: "Stage 1" },
      { time: "18:00", team1: "Lean Vision", team2: "Ciocălău Team", group: "Grupa A", stage: "Stage 1" },
      { time: "18:00", team1: "Muligambia", team2: "BPSP", group: "Grupa A", stage: "Stage 1" },
      { time: "18:45", team1: "BPSP", team2: "Saponel", group: "Grupa A", stage: "Stage 1" },
      { time: "18:45", team1: "Muligambia", team2: "Ciocălău Team", group: "Grupa A", stage: "Stage 1" },
      { time: "18:45", team1: "Kamikaze Clan", team2: "Lean Vision", group: "Grupa A", stage: "Stage 1" },
      { time: "19:30", team1: "Lean Vision", team2: "Saponel", group: "Grupa A", stage: "Stage 1" },
      { time: "19:30", team1: "Kamikaze Clan", team2: "Muligambia", group: "Grupa A", stage: "Stage 1" },
      { time: "19:30", team1: "BPSP", team2: "Ciocălău Team", group: "Grupa A", stage: "Stage 1" },
      { time: "20:15", team1: "Ciocălău Team", team2: "Saponel", group: "Grupa A", stage: "Stage 1" },
      { time: "20:15", team1: "Kamikaze Clan", team2: "BPSP", group: "Grupa A", stage: "Stage 1" },
      { time: "20:15", team1: "Lean Vision", team2: "Muligambia", group: "Grupa A", stage: "Stage 1" },
      { time: "21:00", team1: "Muligambia", team2: "Saponel", group: "Grupa A", stage: "Stage 1" },
      { time: "21:00", team1: "Lean Vision", team2: "BPSP", group: "Grupa A", stage: "Stage 1" },
      { time: "21:00", team1: "Kamikaze Clan", team2: "Ciocălău Team", group: "Grupa A", stage: "Stage 1" },
    ]
  }
  // Adaug doar o zi pentru testare, restul pot fi adăugate după
];

export default function ScheduleManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingMatch, setEditingMatch] = useState<ScheduleMatch | null>(null);
  const [faceitUrl, setFaceitUrl] = useState('');

  // Fetch scheduled matches from database
  const { data: scheduledMatches = [], isLoading } = useQuery({
    queryKey: ['/api/admin/scheduled-matches'],
    refetchInterval: 30000,
  });

  // Transform scheduled matches data
  const scheduleData = React.useMemo(() => {
    if (!Array.isArray(scheduledMatches)) return [];
    return transformScheduleData(scheduledMatches);
  }, [scheduledMatches]);

  // Update Faceit URL mutation
  const updateFaceitUrlMutation = useMutation({
    mutationFn: async (data: { team1: string; team2: string; faceitUrl: string }) => {
      const response = await fetch('/api/admin/scheduled-matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update Faceit URL');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succes",
        description: "Link-ul meciului a fost actualizat cu succes",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/scheduled-matches'] });
      setEditingMatch(null);
      setFaceitUrl('');
    },
    onError: (error: any) => {
      toast({
        title: "Eroare",
        description: error.message || "Nu s-a putut actualiza link-ul Faceit",
        variant: "destructive",
      });
    },
  });

  const handleEditMatch = (match: ScheduleMatch) => {
    setEditingMatch(match);
    setFaceitUrl(match.faceitUrl || '');
  };

  const handleSaveFaceitUrl = () => {
    if (!editingMatch) return;
    
    updateFaceitUrlMutation.mutate({
      team1: editingMatch.team1,
      team2: editingMatch.team2,
      faceitUrl: faceitUrl,
    });
  };

  const handleDeleteLink = (match: ScheduleMatch) => {
    updateFaceitUrlMutation.mutate({
      team1: match.team1,
      team2: match.team2,
      faceitUrl: "",
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-lg overflow-hidden">
      <div 
        className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 p-4 border-b border-slate-600/30 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Gestionare Program Meciuri</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Setează link-uri Faceit</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="space-y-6">
            {scheduleData.map((day: any, dayIndex: number) => (
              <div key={dayIndex} className="border-l-4 border-purple-500/50 pl-4">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-white">{day.date}</h4>
                  <p className="text-sm text-purple-400">{day.dayName}</p>
                </div>
                
                <div className="space-y-3">
                  {day.matches.map((match, matchIndex) => (
                    <div 
                      key={matchIndex}
                      className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-purple-400">
                            <Clock className="w-4 h-4" />
                            <span className="font-semibold">{match.time}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{match.team1}</span>
                            <span className="text-gray-400">vs</span>
                            <span className="text-white font-medium">{match.team2}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                            {match.group}
                          </span>
                          
                          {match.faceitUrl && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => window.open(match.faceitUrl, '_blank')}
                              className="bg-red-600 hover:bg-red-700 text-white animate-pulse"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              LIVE
                            </Button>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditMatch(match)}
                              className="text-orange-400 border-orange-400/50 hover:bg-orange-400/10"
                            >
                              <Link className="w-4 h-4 mr-1" />
                              {match.faceitUrl ? 'Editează' : 'Adaugă'} Link
                            </Button>
                            
                            {match.faceitUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteLink(match)}
                                className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                              >
                                Șterge
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Faceit URL Dialog */}
      <Dialog open={!!editingMatch} onOpenChange={() => setEditingMatch(null)}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              Setează Link pentru Meci
            </DialogTitle>
          </DialogHeader>
          
          {editingMatch && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <p className="text-white font-medium">
                  {editingMatch.team1} vs {editingMatch.team2}
                </p>
                <p className="text-sm text-gray-400">
                  {editingMatch.time} • {editingMatch.group}
                </p>
              </div>
              
              <div>
                <Label htmlFor="faceitUrl" className="text-white">Link Meci</Label>
                <Input
                  id="faceitUrl"
                  type="url"
                  value={faceitUrl}
                  onChange={(e) => setFaceitUrl(e.target.value)}
                  placeholder="https://www.faceit.com/en/cs2/room/... sau orice alt link"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingMatch(null)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Anulează
                </Button>
                <Button
                  onClick={handleSaveFaceitUrl}
                  disabled={updateFaceitUrlMutation.isPending}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {updateFaceitUrlMutation.isPending ? 'Se salvează...' : 'Salvează Link'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}