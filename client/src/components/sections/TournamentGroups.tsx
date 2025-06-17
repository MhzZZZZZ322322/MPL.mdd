import { useLanguage } from "@/lib/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Team {
  id: number;
  name: string;
  logoUrl: string;
}

interface GroupTeam extends Team {
  wins: number;
  losses: number;
  winRate: string;
}

interface Group {
  id: string;
  name: string;
  teams: GroupTeam[];
}

interface TournamentGroupsProps {
  isExpanded: boolean;
  onToggle: () => void;
}

// Mock data pentru demonstrație - în realitate ar veni din API
const mockGroups: Group[] = [
  {
    id: "A",
    name: "Group A",
    teams: [
      { id: 1, name: "Auratix", logoUrl: "/team-logos/Auratix.png", wins: 2, losses: 1, winRate: "5-1" },
      { id: 2, name: "Barbosii", logoUrl: "/team-logos/Barbosii.png", wins: 1, losses: 1, winRate: "3-3" },
      { id: 3, name: "Bloody", logoUrl: "/team-logos/Bloody.png", wins: 0, losses: 2, winRate: "2-4" },
      { id: 4, name: "Bobb3rs", logoUrl: "/team-logos/Bobb3rs.png", wins: 0, losses: 2, winRate: "2-4" },
      { id: 5, name: "BPSP", logoUrl: "/team-logos/BPSP.png", wins: 1, losses: 1, winRate: "3-3" },
      { id: 6, name: "Brigada", logoUrl: "/team-logos/Brigada.png", wins: 2, losses: 0, winRate: "4-0" },
    ]
  },
  {
    id: "B", 
    name: "Group B",
    teams: [
      { id: 7, name: "Brigada Meteor", logoUrl: "/team-logos/Brigada Meteor.png", wins: 2, losses: 1, winRate: "5-1" },
      { id: 8, name: "Cadian Team", logoUrl: "/team-logos/Cadian Team.png", wins: 0, losses: 3, winRate: "3-3" },
      { id: 9, name: "Ciocana Esports", logoUrl: "/team-logos/Ciocana Esports.png", wins: 1, losses: 1, winRate: "3-3" },
      { id: 10, name: "Ciocălău Team", logoUrl: "/team-logos/Ciocălău Team.png", wins: 1, losses: 2, winRate: "1-5" },
      { id: 11, name: "Cipok", logoUrl: "/team-logos/Cipok.png", wins: 0, losses: 2, winRate: "2-4" },
      { id: 12, name: "Coli", logoUrl: "/team-logos/Coli.png", wins: 0, losses: 0, winRate: "0-6" },
    ]
  },
  {
    id: "C",
    name: "Group C", 
    teams: [
      { id: 14, name: "Cucumba", logoUrl: "/team-logos/Cucumba.png", wins: 1, losses: 2, winRate: "4-2" },
      { id: 15, name: "Flux Line", logoUrl: "/team-logos/Flux Line.png", wins: 1, losses: 2, winRate: "4-2" },
      { id: 16, name: "Golden Five", logoUrl: "/team-logos/Golden Five.png", wins: 1, losses: 0, winRate: "2-4" },
      { id: 17, name: "Into the Beach", logoUrl: "/team-logos/Into the Beach.png", wins: 0, losses: 2, winRate: "2-4" },
      { id: 18, name: "Japon", logoUrl: "/team-logos/Japon.png", wins: 0, losses: 2, winRate: "2-4" },
      { id: 19, name: "K9 Team", logoUrl: "/team-logos/K9 Team.png", wins: 4, losses: 0, winRate: "6-0" },
    ]
  },
  {
    id: "D",
    name: "Group D",
    teams: [
      { id: 20, name: "Killuminaty", logoUrl: "/team-logos/Killuminaty.png", wins: 3, losses: 0, winRate: "6-0" },
      { id: 21, name: "KostiujeniKlinik", logoUrl: "/team-logos/KostiujeniKlinik.png", wins: 2, losses: 0, winRate: "5-1" },
      { id: 22, name: "La Passion", logoUrl: "/team-logos/La Passion.png", wins: 1, losses: 0, winRate: "2-4" },
      { id: 23, name: "Lean Vision", logoUrl: "/team-logos/Lean Vision.png", wins: 1, losses: 0, winRate: "2-4" },
      { id: 24, name: "Legalize", logoUrl: "/team-logos/Legalize.png", wins: 0, losses: 0, winRate: "0-3" },
      { id: 25, name: "LitEnergy", logoUrl: "/team-logos/LitEnergy.png", wins: 0, losses: 0, winRate: "0-6" },
    ]
  },
  {
    id: "E",
    name: "Group E",
    teams: [
      { id: 26, name: "LYSQ", logoUrl: "/team-logos/LYSQ.png", wins: 2, losses: 1, winRate: "5-1" },
      { id: 27, name: "Muligambia", logoUrl: "/team-logos/Muligambia.png", wins: 0, losses: 3, winRate: "3-3" },
      { id: 28, name: "Neo Egoist League", logoUrl: "/team-logos/Neo Egoist League.png", wins: 1, losses: 1, winRate: "3-3" },
      { id: 29, name: "Onyx", logoUrl: "/team-logos/Onyx.png", wins: 1, losses: 2, winRate: "1-5" },
      { id: 30, name: "RCBVR", logoUrl: "/team-logos/RCBVR.png", wins: 0, losses: 2, winRate: "2-4" },
      { id: 31, name: "Robotaim", logoUrl: "/team-logos/Robotaim.png", wins: 0, losses: 0, winRate: "0-6" },
    ]
  },
  {
    id: "F",
    name: "Group F",
    teams: [
      { id: 32, name: "Rumina", logoUrl: "/team-logos/Rumina.png", wins: 1, losses: 2, winRate: "4-2" },
      { id: 33, name: "Shashlik", logoUrl: "/team-logos/Shashlik.png", wins: 1, losses: 2, winRate: "4-2" },
      { id: 34, name: "Trigger", logoUrl: "/team-logos/Tigger.png", wins: 1, losses: 0, winRate: "2-4" },
      { id: 35, name: "VeryGoodTeam", logoUrl: "/team-logos/VeryGoodTeam.png", wins: 0, losses: 2, winRate: "2-4" },
      { id: 36, name: "WenDeagle", logoUrl: "/team-logos/WenDeagle.png", wins: 0, losses: 2, winRate: "2-4" },
      { id: 37, name: "Wenzo", logoUrl: "/team-logos/Wenzo.png", wins: 4, losses: 0, winRate: "6-0" },
    ]
  },
  {
    id: "G",
    name: "Group G",
    teams: [
      { id: 38, name: "X-one", logoUrl: "/team-logos/X-one.png", wins: 2, losses: 1, winRate: "5-1" },
      { id: 39, name: "XPlosion", logoUrl: "/team-logos/XPloision.webp", wins: 0, losses: 3, winRate: "3-3" },
      { id: 40, name: "Win Spirit", logoUrl: "/team-logos/Win_Spirit.webp", wins: 1, losses: 1, winRate: "3-3" },
      { id: 41, name: "Xtreme Players", logoUrl: "/team-logos/Xtreme_Players.webp", wins: 1, losses: 2, winRate: "1-5" },
      { id: 42, name: "Saponel", logoUrl: "/team-logos/Saponel.webp", wins: 0, losses: 2, winRate: "2-4" },
      { id: 43, name: "BaitMD", logoUrl: "/team-logos/BaitMD.webp", wins: 0, losses: 0, winRate: "0-6" },
      { id: 44, name: "Kamikaze Clan", logoUrl: "/team-logos/kamikaze-clan.webp", wins: 2, losses: 0, winRate: "4-2" },
    ]
  }
];

export default function TournamentGroups({ isExpanded, onToggle }: TournamentGroupsProps) {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  return (
    <div className="py-8 sm:py-16 bg-gradient-to-b from-darkBg to-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-start mb-8">
          <Button 
            onClick={onToggle}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            {isExpanded ? (
              <>
                {t('tournament.groups.button')}
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                {t('tournament.groups.button')}
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {mockGroups.map((group) => (
                <div key={group.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden">
                  {/* Group Header */}
                  <div className="bg-gradient-to-r from-primary/80 to-primary/60 px-4 py-3 border-b border-slate-600">
                    <h3 className="text-white font-bold text-lg text-center">
                      {group.name}
                    </h3>
                    <p className="text-white/80 text-sm text-center mt-1">
                      {t('tournament.groups.standings')}
                    </p>
                  </div>

                  {/* Teams List */}
                  <div className="p-4">
                    <div className="space-y-2">
                      {group.teams
                        .sort((a, b) => {
                          // Sort by wins descending, then by losses ascending
                          if (a.wins !== b.wins) return b.wins - a.wins;
                          return a.losses - b.losses;
                        })
                        .map((team, index) => (
                        <div 
                          key={team.id} 
                          className={`flex items-center justify-between p-2 rounded ${
                            index === 0 ? 'bg-green-600/20 border border-green-500/30' :
                            index === 1 ? 'bg-blue-600/20 border border-blue-500/30' :
                            index >= group.teams.length - 2 ? 'bg-red-600/20 border border-red-500/30' :
                            'bg-slate-700/30 border border-slate-600/30'
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <span className="text-white font-bold text-sm w-6 text-center">
                              {index + 1}.
                            </span>
                            <div className="w-8 h-8 rounded overflow-hidden bg-slate-600 flex-shrink-0">
                              <img 
                                src={team.logoUrl} 
                                alt={team.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                            <span className="text-white text-sm font-medium truncate">
                              {team.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className={`px-2 py-1 rounded ${
                              team.wins > team.losses ? 'bg-green-600/30 text-green-400' :
                              team.wins === team.losses ? 'bg-yellow-600/30 text-yellow-400' :
                              'bg-red-600/30 text-red-400'
                            }`}>
                              {team.wins}-{team.losses}
                            </span>
                            <span className="text-slate-400 min-w-[2.5rem] text-right">
                              {team.winRate}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-600/30 border border-green-500/50 rounded"></div>
                <span className="text-white">{t('tournament.groups.legend.advance')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600/30 border border-blue-500/50 rounded"></div>
                <span className="text-white">{t('tournament.groups.legend.playoffs')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-600/30 border border-red-500/50 rounded"></div>
                <span className="text-white">{t('tournament.groups.legend.eliminated')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}