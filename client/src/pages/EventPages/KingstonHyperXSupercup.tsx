import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, MapPin, Trophy, Users, Award, Gift, Sparkles, FileText as FileIcon, ChevronDown, ChevronUp, Flame, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import NeonBorder from "@/components/animations/NeonBorder";
import CountdownTimer from "@/components/ui/countdown-timer";
import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Team, TeamMember } from "@shared/schema";

// Kingston Tournament Components using dedicated API routes
const KingstonTournamentGroups = () => {
  const { data: standings = [] } = useQuery({
    queryKey: ["/api/kingston/group-standings"],
    queryFn: async () => {
      const response = await fetch("/api/kingston/group-standings");
      if (!response.ok) throw new Error("Failed to fetch Kingston group standings");
      return response.json();
    }
  });

  if (standings.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Grupele vor fi disponibile în curând</h3>
        <p className="text-gray-400">
          Organizarea în 8 grupe de câte 4 echipe va începe odată cu înregistrările.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-300 text-center">Clasamentele grupelor Kingston x HyperX Supercup</p>
      {/* Group standings would be rendered here */}
    </div>
  );
};

const KingstonStage2Swiss = () => {
  const { data: standings = [] } = useQuery({
    queryKey: ["/api/kingston/stage2-swiss-standings"],
    queryFn: async () => {
      const response = await fetch("/api/kingston/stage2-swiss-standings");
      if (!response.ok) throw new Error("Failed to fetch Kingston Stage 2 standings");
      return response.json();
    }
  });

  const { data: matches = [] } = useQuery({
    queryKey: ["/api/kingston/stage2-swiss-matches"],
    queryFn: async () => {
      const response = await fetch("/api/kingston/stage2-swiss-matches");
      if (!response.ok) throw new Error("Failed to fetch Kingston Stage 2 matches");
      return response.json();
    }
  });

  if (standings.length === 0 && matches.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Swiss System Stage va începe în curând</h3>
        <p className="text-gray-400">
          16 echipe calificate din Stage 1 vor concura în format Swiss System.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-300 text-center">Kingston Stage 2: Swiss System (16→8 echipe)</p>
      {/* Swiss standings and matches would be rendered here */}
    </div>
  );
};

const KingstonStage3Playoff = () => {
  const { data: matches = [] } = useQuery({
    queryKey: ["/api/kingston/stage3-playoff"],
    queryFn: async () => {
      const response = await fetch("/api/kingston/stage3-playoff");
      if (!response.ok) throw new Error("Failed to fetch Kingston Stage 3 playoff");
      return response.json();
    }
  });

  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <Zap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Playoff Double Elimination va începe în curând</h3>
        <p className="text-gray-400">
          8 echipe calificate din Stage 2 vor concura pentru marele premiu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-300 text-center">Kingston Stage 3: Double Elimination Playoff</p>
      {/* Playoff bracket would be rendered here */}
    </div>
  );
};

const KingstonHyperXSupercup = () => {
  const { t } = useLanguage();
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isTeamsExpanded, setIsTeamsExpanded] = useState(false);
  const [isGroupsExpanded, setIsGroupsExpanded] = useState(false);
  const [isMatchesExpanded, setIsMatchesExpanded] = useState(false);
  const [isStage2Expanded, setIsStage2Expanded] = useState(false);
  const [isStage3Expanded, setIsStage3Expanded] = useState(false);
  const [isStage4Expanded, setIsStage4Expanded] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Team logo mapping - uses actual team logos from database
  const getTeamLogo = (team: Team) => {
    // Use logoData (base64) first, then fallback to logoUrl
    const logoSrc = (team as any).logoData || team.logoUrl;
    if (logoSrc) {
      return {
        icon: <img src={logoSrc} alt={team.name} className="w-full h-full object-contain rounded" onError={(e) => {
          console.error(`Failed to load logo for ${team.name}: ${logoSrc}`);
          e.currentTarget.style.display = 'none';
        }} />,
        gradient: "from-primary to-primary/80"
      };
    }
    return {
      icon: <Trophy className="w-full h-full text-primary" />,
      gradient: "from-primary to-primary/80"
    };
  };

  // Fetch teams for Kingston tournament
  const { data: rawTeams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/kingston/teams"],
    queryFn: async () => {
      const response = await fetch("/api/kingston/teams");
      if (!response.ok) throw new Error("Failed to fetch Kingston teams");
      return response.json();
    }
  });

  // Sort teams alphabetically by name
  const teams = rawTeams.sort((a, b) => a.name.localeCompare(b.name));

  // Fetch members for selected team
  const { data: rawTeamMembers = [], isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/kingston/teams", selectedTeam?.id, "members"],
    queryFn: async () => {
      if (!selectedTeam) return [];
      const response = await fetch(`/api/kingston/teams/${selectedTeam.id}/members`);
      if (!response.ok) throw new Error("Failed to fetch Kingston team members");
      return response.json();
    },
    enabled: !!selectedTeam
  });

  // Sort team members: captain first, then by position (main before reserve), then alphabetically
  const teamMembers = rawTeamMembers.sort((a, b) => {
    if (a.role === 'captain' && b.role !== 'captain') return -1;
    if (b.role === 'captain' && a.role !== 'captain') return 1;
    if (a.position === 'main' && b.position === 'reserve') return -1;
    if (b.position === 'main' && a.position === 'reserve') return 1;
    return a.nickname.localeCompare(b.nickname);
  });
  return (
    <>
      <Helmet>
        <title>Kingston x HyperX - Supercup Season 1 | Moldova Pro League</title>
        <meta name="description" content="Kingston x HyperX - Supercup Season 1 - Cel mai mare turneu de Counter-Strike 2 din Moldova și România, powered by Kingston și HyperX gaming gear." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="bg-black min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[70vh] bg-gradient-to-b from-black to-darkBg overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/upscalemedia-transformed.jpeg" 
              alt="Kingston x HyperX - Supercup Season 1" 
              className="w-full h-full object-cover opacity-45"
              loading="eager"
              width="1920"
              height="1080"
            />
            <div className="absolute inset-0 bg-black/70 z-0"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-4xl">
              <Link href="/#about">
                <Button variant="ghost" className="mb-4 text-gray-300 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Înapoi la pagina principală
                </Button>
              </Link>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 font-rajdhani">
                Kingston x HyperX
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 font-rajdhani">
                Supercup Season 1
              </h2>

              <div className="flex items-center mb-6 text-gray-300">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <span className="mr-4">10 septembrie - 28 septembrie 2025</span>

                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span>Online (Moldova & România)</span>
              </div>

              <p className="text-lg text-gray-100 max-w-2xl mb-8">
                Primul turneu Supercup powered by Kingston și HyperX. Competiție de elită cu echipamente gaming premium 
                pentru cele mai bune echipe din Moldova și România.
              </p>

              {/* Live Countdown Timer */}
              <div className="mb-8">
                <CountdownTimer 
                  targetDate="2025-08-15T18:00:00Z" 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register-team">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-black font-bold px-8 py-3 text-lg"
                  >
                    <Gift className="mr-2 h-5 w-5" />
                    Înscrie-te acum
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-lg"
                  onClick={() => {
                    const rulesSection = document.querySelector('#tournament-rules');
                    rulesSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Vezi regulamentul
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Info Cards */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Prize Pool */}
              <NeonBorder className="bg-darkGray/60 p-6 text-center">
                <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">Prize Pool</h3>
                <p className="text-2xl font-bold text-primary">130,000 LEI</p>
                <div className="text-sm text-gray-400 space-y-1">
                  <a href="https://www.kingston.com/en/gaming" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline block">Kingston Gaming</a>
                  <span className="text-gray-400">&</span>
                  <a href="https://hyperx.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline block">HyperX gear</a>
                </div>
              </NeonBorder>

              {/* Teams */}
              <NeonBorder className="bg-darkGray/60 p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">Echipe</h3>
                <p className="text-2xl font-bold text-primary">32</p>
                <p className="text-sm text-gray-400">Echipe planificate</p>
              </NeonBorder>

              {/* Format */}
              <NeonBorder className="bg-darkGray/60 p-6 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">Format</h3>
                <p className="text-lg font-bold text-primary">Grupe + Swiss + Double Elimination</p>
                <p className="text-sm text-gray-400">3 etape</p>
              </NeonBorder>

              {/* Duration */}
              <NeonBorder className="bg-darkGray/60 p-6 text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">Durată</h3>
                <p className="text-lg font-bold text-primary">3 săptămâni</p>
                <p className="text-sm text-gray-400">10-28 septembrie</p>
              </NeonBorder>
            </div>
          </div>
        </section>

        {/* Tournament Rules */}
        <section id="tournament-rules" className="py-16 px-4 bg-darkGray/20">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-rajdhani">
                Regulamentul Turneului
              </h2>
              <p className="text-gray-300 text-lg">
                Toate informațiile importante despre competiție
              </p>
            </div>

            <div className="space-y-6">
              {/* Tournament Content Expandable Section */}
              <NeonBorder className="bg-darkGray/60">
                <Button
                  variant="ghost"
                  className="w-full p-6 justify-between text-left hover:bg-transparent"
                  onClick={() => setIsContentExpanded(!isContentExpanded)}
                >
                  <div className="flex items-center">
                    <FileIcon className="mr-3 h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold text-white">Informații generale despre turneu</span>
                  </div>
                  {isContentExpanded ? 
                    <ChevronUp className="h-5 w-5 text-primary" /> : 
                    <ChevronDown className="h-5 w-5 text-primary" />
                  }
                </Button>
                
                {isContentExpanded && (
                  <div className="px-6 pb-6 text-gray-300 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-primary font-bold mb-2">📝 Format Turneu</h4>
                        <p className="text-sm leading-relaxed">
                          Turneul Kingston x HyperX Supercup Season 1 se desfășoară în 3 etape:
                          <br />• <strong>Stage 1:</strong> 8 grupe de câte 4 echipe, jocuri BO1
                          <br />• <strong>Stage 2:</strong> Swiss System cu 16 echipe, jocuri BO1
                          <br />• <strong>Stage 3:</strong> Playoff cu dublă eliminare (Upper/Lower Bracket)
                          <br />• <strong>Total:</strong> ~32 echipe participante
                        </p>
                      </div>
                      <div>
                        <h4 className="text-primary font-bold mb-2">🎮 Specificații Tehnice</h4>
                        <p className="text-sm leading-relaxed">
                          <strong>Joc:</strong> Counter-Strike 2<br />
                          <strong>Platform:</strong> Steam & FACEIT<br />
                          <strong>Anti-cheat:</strong> FACEIT AC obligatoriu<br />
                          <strong>Servere:</strong> FACEIT EU East<br />
                          <strong>Tickrate:</strong> 128 tick
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-primary font-bold mb-2">📅 Cronograma Turneului</h4>
                        <p className="text-sm leading-relaxed">
                          <strong>Înregistrări:</strong> 15 august - 10 septembrie<br />
                          <strong>Stage 1 (Grupe):</strong> 10 - 14 septembrie<br />
                          <strong>Stage 2 (Swiss):</strong> 17 - 21 septembrie<br />
                          <strong>Stage 3 (Playoff):</strong> 27 - 28 septembrie<br />
                          <em className="text-gray-400">*Datele pot fi ajustate în funcție de necesități</em>
                        </p>
                      </div>
                      <div className="col-span-2">
                        <h4 className="text-primary font-bold mb-4 text-center">🏆 Premii Detaliate - 130,000 LEI</h4>
                        <p className="text-xs text-gray-400 text-center mb-4">Click pe produse pentru a vedea specificații complete</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-primary font-bold mb-2">👥 Echipe și Jucători</h4>
                        <p className="text-sm leading-relaxed">
                          <strong>Jucători per echipă:</strong> 5 titulari + 2 rezerve<br />
                          <strong>Eligibilitate:</strong> Cetățeni români și moldoveni<br />
                          <strong>Vârstă minimă:</strong> 16 ani<br />
                          <strong>FACEIT Level:</strong> Minim Level 4
                        </p>
                      </div>
                      <div>
                        <h4 className="text-primary font-bold mb-2">🔄 Detalii Format</h4>
                        <p className="text-sm leading-relaxed">
                          <strong>Stage 1:</strong> Primele 2 echipe din fiecare grupă avansează<br />
                          <strong>Stage 2:</strong> De la 16 la 8 echipe prin Swiss<br />
                          <strong>Stage 3:</strong> Double Elimination (Upper/Lower Bracket)<br />
                          <strong>Toate meciurile:</strong> Format BO1 până la playoff
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </NeonBorder>

              {/* Registration Call to Action */}
              <NeonBorder className="bg-gradient-to-r from-primary/20 to-pink-500/20 border-primary/50">
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4 font-rajdhani">
                    Participă la cel mai mare turneu CS2!
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Înregistrează-ți echipa acum pentru Kingston x HyperX Supercup Season 1. 
                    Numai 32 de locuri disponibile!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/register-team">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/80 hover:to-pink-500/80 text-white font-bold px-8 py-3 text-lg"
                      >
                        Înscrie-te acum
                      </Button>
                    </Link>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">
                        Deadline înregistrări: <span className="text-primary font-bold">10 septembrie 2025</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Locuri disponibile: <span className="text-white font-bold">{32 - teams.length} / 32</span>
                      </p>
                    </div>
                  </div>
                </div>
              </NeonBorder>

              {/* Teams Section */}
              <NeonBorder className="bg-darkGray/60">
                <Button
                  variant="ghost"
                  className="w-full p-6 justify-between text-left hover:bg-transparent"
                  onClick={() => setIsTeamsExpanded(!isTeamsExpanded)}
                >
                  <div className="flex items-center">
                    <Users className="mr-3 h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold text-white">
                      Echipe participante ({teams.length})
                    </span>
                    {teamsLoading && <span className="ml-2 text-sm text-gray-400">(Se încarcă...)</span>}
                  </div>
                  {isTeamsExpanded ? 
                    <ChevronUp className="h-5 w-5 text-primary" /> : 
                    <ChevronDown className="h-5 w-5 text-primary" />
                  }
                </Button>
                
                {isTeamsExpanded && (
                  <div className="px-6 pb-6">
                    {teamsLoading ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-gray-400 mt-2">Se încarcă echipele...</p>
                      </div>
                    ) : teams.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        Nu sunt echipe înregistrate încă pentru acest turneu.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teams.map((team) => {
                          const teamLogo = getTeamLogo(team);
                          return (
                            <div
                              key={team.id}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                                selectedTeam?.id === team.id
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-600 hover:border-primary/50 bg-black/30'
                              }`}
                              onClick={() => setSelectedTeam(selectedTeam?.id === team.id ? null : team)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                  {teamLogo.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-white font-bold font-rajdhani truncate">
                                    {team.name}
                                  </h3>
                                  <p className="text-gray-400 text-sm truncate">
                                    Echipă participantă
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Team Details Modal-like Section */}
                    {selectedTeam && (
                      <div className="mt-6 p-6 bg-black/40 rounded-lg border border-primary/30">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white font-rajdhani">
                            Detalii echipă: {selectedTeam.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTeam(null)}
                            className="text-gray-400 hover:text-white"
                          >
                            ✕
                          </Button>
                        </div>
                        
                        {membersLoading ? (
                          <div className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <p className="text-gray-400 mt-2">Se încarcă membrii echipei...</p>
                          </div>
                        ) : teamMembers.length === 0 ? (
                          <p className="text-gray-400">Nu sunt membri înregistrați pentru această echipă.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teamMembers.map((member, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-darkGray/40 rounded-lg">
                                <div>
                                  <p className="text-white font-medium">{member.nickname}</p>
                                  <p className="text-gray-400 text-sm">
                                    {member.faceitProfile || 'Profil jucător'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    member.role === 'captain' 
                                      ? 'bg-primary/20 text-primary' 
                                      : 'bg-gray-600/20 text-gray-300'
                                  }`}>
                                    {member.role === 'captain' ? 'Căpitan' : 'Jucător'}
                                  </span>
                                  <p className="text-gray-400 text-xs mt-1">
                                    {member.position === 'main' ? 'Titular' : 'Rezervă'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </NeonBorder>

              {/* Groups Stage */}
              <NeonBorder className="bg-darkGray/60">
                <Button
                  variant="ghost"
                  className="w-full p-6 justify-between text-left hover:bg-transparent"
                  onClick={() => setIsGroupsExpanded(!isGroupsExpanded)}
                >
                  <div className="flex items-center">
                    <Users className="mr-3 h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold text-white">Stage 1: 8 Grupe (4 echipe fiecare)</span>
                  </div>
                  {isGroupsExpanded ? 
                    <ChevronUp className="h-5 w-5 text-primary" /> : 
                    <ChevronDown className="h-5 w-5 text-primary" />
                  }
                </Button>
                
                {isGroupsExpanded && (
                  <div className="px-6 pb-6">
                    <KingstonTournamentGroups />
                  </div>
                )}
              </NeonBorder>

              {/* Stage 2 - Bracket */}
              <NeonBorder className="bg-darkGray/60">
                <Button
                  variant="ghost"
                  className="w-full p-6 justify-between text-left hover:bg-transparent"
                  onClick={() => setIsStage2Expanded(!isStage2Expanded)}
                >
                  <div className="flex items-center">
                    <Trophy className="mr-3 h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold text-white">Stage 2: Swiss System (16 echipe)</span>
                  </div>
                  {isStage2Expanded ? 
                    <ChevronUp className="h-5 w-5 text-primary" /> : 
                    <ChevronDown className="h-5 w-5 text-primary" />
                  }
                </Button>
                
                {isStage2Expanded && (
                  <div className="px-6 pb-6">
                    <KingstonStage2Swiss />
                  </div>
                )}
              </NeonBorder>

              {/* Stage 3 - Swiss */}
              <NeonBorder className="bg-darkGray/60">
                <Button
                  variant="ghost"
                  className="w-full p-6 justify-between text-left hover:bg-transparent"
                  onClick={() => setIsStage3Expanded(!isStage3Expanded)}
                >
                  <div className="flex items-center">
                    <Zap className="mr-3 h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold text-white">Stage 3: Playoff Double Elimination</span>
                  </div>
                  {isStage3Expanded ? 
                    <ChevronUp className="h-5 w-5 text-primary" /> : 
                    <ChevronDown className="h-5 w-5 text-primary" />
                  }
                </Button>
                
                {isStage3Expanded && (
                  <div className="px-6 pb-6">
                    <KingstonStage3Playoff />
                  </div>
                )}
              </NeonBorder>


            </div>
          </div>
        </section>

        {/* Simple Prizes Section */}
        <section className="py-16 px-4 bg-darkGray/20">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-rajdhani">
                Premii - 130,000 LEI
              </h2>
              <p className="text-gray-300 text-lg">
                Echipamente premium de gaming oferite de Kingston și HyperX
              </p>
            </div>

            {/* Prize Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 1st Place */}
              <NeonBorder className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-400/50">
                <div className="p-6 text-center min-h-[480px] flex flex-col">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-400/50 mb-4">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-400 font-rajdhani mb-6">
                    Locul 1
                  </h3>

                  {/* Product Images */}
                  <div className="flex-1 flex flex-col justify-center space-y-4">
                    <div className="text-center">
                      <div className="flex justify-center mb-3 h-24">
                        <img 
                          src="/hyperx-cloud-iii-s.png"
                          alt="HyperX Cloud III S Wireless"
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                      <p className="text-sm text-yellow-300/90 font-medium">
                        5x HyperX Cloud III S Wireless
                      </p>
                      <p className="text-xs text-yellow-300/70 mt-1">
                        Căști gaming premium wireless
                      </p>
                    </div>
                    
                    {/* Plus Sign */}
                    <div className="flex justify-center">
                      <div className="text-2xl font-bold text-white">+</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex justify-center mb-3 h-24">
                        <img 
                          src="/kingston-fury-renegade-transparent.png"
                          alt="Kingston FURY Renegade DDR5 RGB"
                          className="w-32 h-20 object-contain"
                        />
                      </div>
                      <p className="text-sm text-yellow-300/90 font-medium">
                        5x Kingston FURY Renegade RGB 48GB DDR5
                      </p>
                      <p className="text-xs text-yellow-300/70 mt-1">
                        Memorie RAM premium 6000MT/s
                      </p>
                    </div>
                  </div>
                </div>
              </NeonBorder>

              {/* 2nd Place */}
              <NeonBorder className="bg-gradient-to-br from-gray-400/20 to-gray-500/10 border-gray-300/50">
                <div className="p-6 text-center min-h-[480px] flex flex-col">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-400/20 border border-gray-300/50 mb-4">
                    <Award className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-300 font-rajdhani mb-6">
                    Locul 2
                  </h3>

                  {/* Product Images */}
                  <div className="flex-1 flex flex-col justify-center space-y-4">
                    <div className="text-center">
                      <div className="flex justify-center mb-3 h-24">
                        <img 
                          src="/kingston-fury-beast-32gb.png"
                          alt="Kingston FURY Beast 32GB DDR5"
                          className="w-32 h-20 object-contain"
                        />
                      </div>
                      <p className="text-sm text-gray-300/90 font-medium">
                        5x Kingston FURY Beast 32GB DDR5
                      </p>
                      <p className="text-xs text-gray-300/70 mt-1">
                        Memorie RAM gaming 5600MT/s
                      </p>
                    </div>
                    
                    {/* Plus Sign */}
                    <div className="flex justify-center py-2">
                      <div className="text-2xl font-bold text-white">+</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex justify-center mb-3 h-24">
                        <img 
                          src="/hyperx-alloy-rise-75.png"
                          alt="Tastatură HyperX Alloy Rise 75 Black"
                          className="w-32 h-20 object-contain"
                        />
                      </div>
                      <p className="text-sm text-gray-300/90 font-medium">
                        5x Tastatură HyperX Alloy Rise 75 Black
                      </p>
                      <p className="text-xs text-gray-300/70 mt-1">
                        Tastatură mecanică RGB gaming
                      </p>
                    </div>
                  </div>
                </div>
              </NeonBorder>

              {/* 3rd Place */}
              <NeonBorder className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-400/50">
                <div className="p-6 text-center min-h-[480px] flex flex-col">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 border border-orange-400/50 mb-4">
                    <Award className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-400 font-rajdhani mb-6">
                    Locul 3
                  </h3>

                  {/* Product Images */}
                  <div className="flex-1 flex flex-col justify-center space-y-3">
                    <div className="text-center">
                      <div className="flex justify-center mb-3 h-24">
                        <img 
                          src="/hyperx-pulsefire-haste-2.png"
                          alt="HyperX Pulsefire Haste 2"
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                      <p className="text-sm text-orange-400/90 font-medium">
                        5x HyperX Pulsefire Haste 2
                      </p>
                      <p className="text-xs text-orange-400/70 mt-1">
                        Mouse gaming ultralight
                      </p>
                    </div>
                    
                    {/* Plus Sign */}
                    <div className="flex justify-center py-1">
                      <div className="text-xl font-bold text-white">+</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex justify-center mb-2 h-16">
                        <img 
                          src="/kingston-datatraveler-exodia.png"
                          alt="DataTraveler Exodia S USB 256GB"
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <p className="text-sm text-orange-400/90 font-medium">
                        5x Kingston Bundle Premium:
                      </p>
                      <p className="text-xs text-orange-400/90 mt-1">
                        • DataTraveler Exodia S USB 256GB
                      </p>
                      <p className="text-xs text-orange-400/90">
                        • T-shirt Kingston Fury branded
                      </p>
                      <p className="text-xs text-orange-400/90">
                        • Termo bag Kingston Fury premium
                      </p>
                    </div>
                  </div>
                </div>
              </NeonBorder>

              {/* Ace of Aces */}
              <NeonBorder className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-400/50">
                <div className="p-6 text-center min-h-[480px] flex flex-col">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 border border-purple-400/50 mb-4">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-400 font-rajdhani mb-6">
                    Ace of Aces
                  </h3>

                  {/* Product Images */}
                  <div className="flex-1 flex flex-col justify-center space-y-4">
                    <div className="text-center">
                      <div className="flex justify-center mb-3 h-24">
                        <img 
                          src="/kingston-fury-renegade-limited-edition.png"
                          alt="Kingston FURY Renegade 48GB DDR5 RGB Limited Edition"
                          className="w-32 h-20 object-contain"
                        />
                      </div>
                      <p className="text-sm text-purple-400/90 font-medium">
                        1x FURY Renegade 48GB DDR5 RGB Limited Edition
                      </p>
                      <p className="text-xs text-purple-400/70 mt-1">
                        Memorie RAM exclusivă 8000MT/s
                      </p>
                    </div>
                    
                    {/* Plus Sign */}
                    <div className="flex justify-center py-2">
                      <div className="text-2xl font-bold text-white">+</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex justify-center mb-3 h-24">
                        <img 
                          src="/hyperx-alloy-rise-75-wireless.png"
                          alt="HyperX Alloy Rise 75 Wireless"
                          className="w-32 h-20 object-contain"
                        />
                      </div>
                      <p className="text-sm text-purple-400/90 font-medium">
                        1x HyperX Premium Choice:
                      </p>
                      <p className="text-xs text-purple-400/90 mt-1">
                        • HyperX Alloy Rise 75 Wireless
                      </p>
                      <p className="text-xs text-purple-400/70 italic">
                        sau HyperX Cloud III S Wireless
                      </p>
                    </div>
                  </div>
                </div>
              </NeonBorder>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/20 to-secondary/20">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-rajdhani">
              Alătură-te competiției!
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Înscrie-te la Kingston x HyperX Supercup Season 1 și câștigă echipamente gaming premium.
            </p>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-black px-8 py-4 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Gift className="mr-2" />
              ÎNSCRIE-TE ACUM!
            </Button>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 px-4 bg-darkGray/40 border-t border-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 font-rajdhani">Powered by</h3>
            <div className="flex justify-center items-center gap-8 md:gap-12">
              <div className="text-primary font-bold text-xl md:text-2xl font-rajdhani">
                Kingston
              </div>
              <div className="text-primary font-bold text-xl md:text-2xl font-rajdhani">
                HyperX
              </div>
              <div className="text-primary font-bold text-xl md:text-2xl font-rajdhani">
                MPL
              </div>
            </div>
            <p className="text-gray-400 text-center mt-6">
              Un eveniment realizat în parteneriat cu cele mai importante branduri de gaming gear
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default KingstonHyperXSupercup;