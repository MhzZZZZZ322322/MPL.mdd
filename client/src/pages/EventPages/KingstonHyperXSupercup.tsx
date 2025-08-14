import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, MapPin, Trophy, Users, Award, Gift, Sparkles, FileText as FileIcon, ChevronDown, ChevronUp, Flame, Zap, Eye, Flag, Target, Clock, Shield, AlertTriangle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import NeonBorder from "@/components/animations/NeonBorder";
import CountdownTimer from "@/components/ui/countdown-timer";
import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Team, TeamMember } from "@shared/schema";
import supercupBgImage from "@assets/Untitled_1755089452078.png";
import supercupRulesImage from "@assets/supercup season1 varianta 1_1755089877102.png";


// Kingston FURY Tournament Components using dedicated API routes
const KingstonTournamentGroups = () => {
  const { data: standings = [] } = useQuery({
    queryKey: ["/api/kingston/group-standings"],
    queryFn: async () => {
      const response = await fetch("/api/kingston/group-standings");
      if (!response.ok) throw new Error("Failed to fetch Kingston FURY group standings");
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
      <p className="text-gray-300 text-center">Clasamentele grupelor Kingston FURY x HyperX Supercup</p>
      {/* Group standings would be rendered here */}
    </div>
  );
};

const KingstonStage2DoubleElim = () => {
  const { data: upperBracket = [] } = useQuery({
    queryKey: ["/api/kingston/stage2-upper-bracket"],
    queryFn: async () => {
      const response = await fetch("/api/kingston/stage2-upper-bracket");
      if (!response.ok) throw new Error("Failed to fetch Kingston FURY Stage 2 upper bracket");
      return response.json();
    }
  });

  const { data: lowerBracket = [] } = useQuery({
    queryKey: ["/api/kingston/stage2-lower-bracket"],
    queryFn: async () => {
      const response = await fetch("/api/kingston/stage2-lower-bracket");
      if (!response.ok) throw new Error("Failed to fetch Kingston FURY Stage 2 lower bracket");
      return response.json();
    }
  });

  if (upperBracket.length === 0 && lowerBracket.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Double Elimination va începe în curând</h3>
        <p className="text-gray-400">
          16 echipe calificate din Stage 1 vor concura în format Double Elimination (Upper/Lower Bracket).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-300 text-center">Kingston FURY Stage 2: Double Elimination Bracket</p>
      {/* Upper Bracket */}
      <div className="bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/30 rounded-lg p-6">
        <h4 className="text-green-400 font-semibold mb-3">Upper Bracket</h4>
        <p className="text-gray-400 text-sm">Winners bracket - nu poți fi eliminat la prima înfrângere</p>
      </div>
      
      {/* Lower Bracket */}
      <div className="bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-500/30 rounded-lg p-6">
        <h4 className="text-red-400 font-semibold mb-3">Lower Bracket</h4>
        <p className="text-gray-400 text-sm">Losers bracket - o singură înfrângere înseamnă eliminare</p>
      </div>
      
      {/* Grand Final */}
      <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 border border-yellow-500/30 rounded-lg p-6">
        <h4 className="text-yellow-400 font-semibold mb-3">Grand Final</h4>
        <p className="text-gray-400 text-sm">Câștigătorul Upper Bracket vs Câștigătorul Lower Bracket</p>
      </div>
    </div>
  );
};

// Componenta KingstonStage3Playoff eliminată - nu mai există Stage 3 în noul format

const KingstonHyperXSupercup = () => {
  const { t } = useLanguage();
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isTeamsExpanded, setIsTeamsExpanded] = useState(false);
  const [isGroupsExpanded, setIsGroupsExpanded] = useState(false);
  const [isMatchesExpanded, setIsMatchesExpanded] = useState(false);
  const [isStage2Expanded, setIsStage2Expanded] = useState(false);
  const [isStage3Expanded, setIsStage3Expanded] = useState(false);
  const [isStage4Expanded, setIsStage4Expanded] = useState(false);
  const [isStage0Expanded, setIsStage0Expanded] = useState(false);
  const [isPrizeDetailsExpanded, setIsPrizeDetailsExpanded] = useState(false);
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

  // Fetch teams for Kingston FURY tournament
  const { data: rawTeams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/kingston/teams"],
    queryFn: async () => {
      const response = await fetch("/api/kingston/teams");
      if (!response.ok) throw new Error("Failed to fetch Kingston FURY teams");
      return response.json();
    }
  });

  // Sort teams alphabetically by name
  const teams = rawTeams.sort((a, b) => a.name.localeCompare(b.name));
  
  // Show only teams registered for qualification (exclude direct invites)
  const qualificationTeams = teams.filter(team => !team.isDirectInvite);

  // Fetch members for selected team
  const { data: rawTeamMembers = [], isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/kingston/teams", selectedTeam?.id, "members"],
    queryFn: async () => {
      if (!selectedTeam) return [];
      const response = await fetch(`/api/kingston/teams/${selectedTeam.id}/members`);
      if (!response.ok) throw new Error("Failed to fetch Kingston FURY team members");
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
        <title>Kingston FURY x HyperX - Supercup Season 1 | Moldova Pro League</title>
        <meta name="description" content="Kingston FURY x HyperX - Supercup Season 1 - Cel mai mare turneu de Counter-Strike 2 din Moldova, powered by Kingston FURY și HyperX gaming gear." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="bg-black min-h-screen">
        {/* Hero Section */}
        <div className="relative min-h-[80vh] lg:h-[70vh] bg-gradient-to-b from-black to-darkBg overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <img 
              src={supercupBgImage} 
              alt="Kingston FURY x HyperX - Supercup Season 1" 
              className="w-3/4 h-3/4 object-contain opacity-40 mx-auto my-auto"
              loading="eager"
              width="1920"
              height="1080"
            />
            <div className="absolute inset-0 bg-black/50 z-0"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-8 h-full flex flex-col justify-center">
            <div className="max-w-4xl">
              <Link href="/#about">
                <Button variant="ghost" className="mb-4 text-gray-300 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Înapoi la pagina principală
                </Button>
              </Link>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 font-rajdhani drop-shadow-lg">
                Kingston FURY x HyperX
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 font-rajdhani drop-shadow-lg">
                Supercup Season 1
              </h2>

              <div className="flex items-center mb-6 text-gray-300">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <span className="mr-4">10 septembrie - 28 septembrie 2025</span>

                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span>Online (Moldova)</span>
              </div>

              <p className="text-lg text-gray-100 max-w-2xl mb-6">
                Primul turneu Supercup powered by Kingston FURY și HyperX. Competiție de elită cu echipamente gaming premium 
                pentru cele mai bune echipe din Moldova.
              </p>

              {/* Live Countdown Timer */}
              <div className="mb-6">
                <CountdownTimer 
                  targetDate="2025-08-15T18:00:00Z" 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pb-8 pt-2">
                <Link href="/register-team">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-black font-bold px-6 py-3 text-base sm:px-8 sm:text-lg w-full sm:w-auto shadow-lg border-2 border-primary"
                  >
                    <Gift className="mr-2 h-5 w-5" />
                    Înscrie-te acum
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-primary text-primary hover:bg-primary/20 px-6 py-3 text-base sm:px-8 sm:text-lg w-full sm:w-auto shadow-lg bg-black/60"
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

        {/* Simple Prizes Section */}
        <section className="py-16 px-4 bg-darkGray/20">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-rajdhani">
                Premii - 100,000 LEI
              </h2>
              <p className="text-gray-300 text-lg">
                Echipamente premium de gaming oferite de Kingston FURY și HyperX
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
                        5x Kingston FURY Bundle Premium:
                      </p>
                      <p className="text-xs text-orange-400/90 mt-1">
                        • DataTraveler Exodia S USB 256GB
                      </p>
                      <p className="text-xs text-orange-400/90">
                        • T-shirt Kingston FURY branded
                      </p>
                      <p className="text-xs text-orange-400/90">• Termo bag Kingston FURY branded</p>
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



        {/* Tournament Info Cards */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Prize Pool */}
              <NeonBorder className="bg-darkGray/60 p-6 text-center">
                <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">Prize Pool</h3>
                <p className="text-2xl font-bold text-primary">100,000 LEI</p>
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
                <p className="text-lg font-bold text-primary">Grupe + Double Elimination</p>
                <p className="text-sm text-gray-400">2 etape principale</p>
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

        {/* Schedule Image and Rules Section */}
        <section className="py-16 px-4 bg-darkGray/40">
          <div className="container mx-auto max-w-6xl">
            {/* Tournament Rules Header Image */}
            <div className="text-center mb-8 -mx-4">
              <img 
                src={supercupRulesImage} 
                alt="Supercup Season 1 - Tournament Schedule" 
                className="w-full h-auto object-cover rounded-lg shadow-2xl"
              />
            </div>
            
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
                          Turneul Kingston FURY x HyperX Supercup Season 1 se desfășoară în 3 etape:
                          <br />• <strong>Stage 1:</strong> Calificarea - toate echipele înregistrate
                          <br />• <strong>Stage 2:</strong> 8 grupe de câte 4 echipe, primele 2 avansează (32→16)
                          <br />• <strong>Playoff:</strong> Double Elimination cu 16 echipe (Upper/Lower Bracket)
                          <br />• <strong>Total:</strong> 32 echipe (12 selectate direct + 20 prin calificare)
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
                          <strong>Stage 1 (Calificare):</strong> 10 - 14 septembrie<br />
                          <strong>Stage 2 (Grupe):</strong> 17 - 21 septembrie<br />
                          <strong>Playoff (Double Elimination):</strong> 27 - 28 septembrie<br />
                          <em className="text-gray-400">*Datele pot fi ajustate în funcție de necesități</em>
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-primary font-bold mb-2">👥 Echipe și Jucători</h4>
                        <p className="text-sm leading-relaxed">
                          <strong>Jucători per echipă:</strong> 5 în roster + 5 substitute<br />
                          <strong>Eligibilitate:</strong> Cetățeni moldoveni<br />
                          <strong>Format echipe:</strong> Roster fix pe durata turneului<br />
                          <strong>Platformă:</strong> FACEIT cu anti-cheat activ
                        </p>
                      </div>
                      <div>
                        <h4 className="text-primary font-bold mb-2">🔄 Detalii Format</h4>
                        <p className="text-sm leading-relaxed">
                          <strong>Stage 1:</strong> 10-14 septembrie - Calificare<br />
                          <strong>Stage 2:</strong> 17-21 septembrie - 8 Grupe cu 4 echipe (32→16)<br />
                          <strong>Playoff:</strong> 27-28 septembrie - Double Elimination (16 echipe)<br />
                          <strong>Total echipe:</strong> 32 (12 cu invitație directă + 20 prin calificare)<br />
                          <strong>Toate meciurile:</strong> Format BO1, meciurile decisive BO3
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
                    Înregistrează-ți echipa pentru Kingston FURY x HyperX Supercup Season 1. 
                    32 echipe totale: 12 selectate direct + 20 prin calificare!
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
                        Echipe înregistrate: <span className="text-white font-bold">{qualificationTeams.length}</span> • Invitații directe: 12
                      </p>
                    </div>
                  </div>
                </div>
              </NeonBorder>
            </div>
          </div>
        </section>

        {/* Direct Invites Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-rajdhani">
                Echipe cu Invitație Directă
              </h2>
              <p className="text-gray-300 text-lg mb-2">
                Următoarele 12 echipe sunt invitate direct în Stage 2 (Grupe)
              </p>
              <p className="text-primary font-semibold">
                Aceste echipe nu participă la Stage 1 - Calificare
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-800/40 rounded-lg p-6 border border-purple-500/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    "Lit Energy",
                    "Cocojambo", 
                    "VGT",
                    "Golden Five",
                    "Team 23",
                    "Cadian Team",
                    "Team 1HP",
                    "begrip",
                    "Muligambia",
                    "BiteMD",
                    "Legalize",
                    "Team Prodigy"
                  ].map((teamName, index) => (
                    <div key={index} className="flex items-center space-x-3 py-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-white font-medium">{teamName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-lg p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Star className="mr-3 h-6 w-6 text-primary" />
                  <h4 className="text-xl font-bold text-primary font-rajdhani">Echipe de Top</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Aceste echipe au fost selectate pe baza performanțelor, stabilității și contribuției la dezvoltarea scenei competitive CS2 din Moldova. 
                  Ele intră direct în etapa de grupe alături de cele 20 de echipe care se vor califica prin Stage 1.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Registered Teams for Qualification Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-green-900/20 to-teal-900/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-rajdhani">
                Echipe Înregistrate pentru Calificare
              </h2>
              <p className="text-gray-300 text-lg mb-2">
                Echipele care luptă pentru cele 20 de locuri în Stage 2
              </p>
              <p className="text-green-400 font-semibold">
                Aceste echipe vor participa la Stage 1 - Calificare (10-14 septembrie)
              </p>
            </div>

            {/* Qualification Teams Grid - will show teams registered for qualification */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {/* Show teams that are NOT direct invites */}
              {qualificationTeams.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Înregistrările încep în curând</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Echipele care se vor înregistra pentru calificare vor apărea aici. 
                    Înregistrările încep pe 15 august 2025.
                  </p>
                </div>
              ) : (
                qualificationTeams.map((team, index) => (
                  <div key={team.id} className="relative perspective-1000">
                    <div 
                      className={`relative w-full h-64 md:h-80 transform-style-preserve-3d transition-transform duration-700 cursor-pointer ${
                        selectedTeam?.id === team.id ? 'rotate-y-180' : ''
                      }`}
                      onClick={() => setSelectedTeam(selectedTeam?.id === team.id ? null : team)}
                    >
                      {/* Front of card - Team Logo */}
                      <NeonBorder className="absolute inset-0 p-2 bg-darkGray/30 rounded-lg hover:bg-darkGray/50 transition-colors duration-300 backface-hidden">
                        <div className="text-center h-full flex flex-col justify-between">
                          <div className="mx-auto bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center overflow-hidden border-2 border-green-500/30 shadow-lg w-full h-48 md:h-60">
                            <div className="relative w-full h-full p-3 flex items-center justify-center bg-slate-800/90 rounded">
                              {team.logoUrl ? (
                                <img 
                                  src={team.logoUrl} 
                                  alt={team.name} 
                                  className="w-full h-full object-contain filter brightness-110 contrast-110" 
                                  onError={(e) => {
                                    console.error(`Failed to load logo for ${team.name}: ${team.logoUrl}`);
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <Target className="w-12 h-12 text-green-400 hidden" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm md:text-base font-bold text-white font-rajdhani py-1">{team.name}</h3>
                            <span className="text-green-400 text-xs font-semibold">CALIFICARE</span>
                          </div>
                        </div>
                      </NeonBorder>

                      {/* Back of card - Team Members */}
                      <NeonBorder className="absolute inset-0 p-3 bg-darkGray/50 rounded-lg backface-hidden rotate-y-180">
                        <div className="h-full flex flex-col">
                          <h4 className="text-sm md:text-base font-bold text-white mb-2 text-center flex-shrink-0">Membrii</h4>
                          {membersLoading ? (
                            <div className="flex justify-center py-4 flex-1">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                            </div>
                          ) : (
                            <div className="space-y-1 flex-1 overflow-y-auto">
                              {teamMembers.filter(member => member.teamId === team.id).map((member) => (
                                <a
                                  key={member.id}
                                  href={member.faceitProfile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block bg-black/30 p-1.5 rounded border border-gray-700 hover:bg-black/50 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="text-xs flex items-center justify-between">
                                    <div className="font-semibold text-white truncate pr-2">{member.nickname}</div>
                                    <div className="flex gap-1 flex-shrink-0">
                                      {member.role === "captain" && (
                                        <span className="bg-primary text-black px-1 py-0.5 text-xs rounded font-semibold">
                                          C
                                        </span>
                                      )}
                                      <span className={`px-1 py-0.5 text-xs rounded font-semibold ${
                                        member.position === "main" 
                                          ? "bg-green-600 text-white" 
                                          : "bg-orange-600 text-white"
                                      }`}>
                                        {member.position === "main" ? "M" : "R"}
                                      </span>
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                          <div className="text-center mt-2 flex-shrink-0">
                            <span className="text-green-400 text-xs font-semibold">CALIFICARE</span>
                          </div>
                        </div>
                      </NeonBorder>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-lg p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Target className="mr-3 h-6 w-6 text-green-400" />
                  <h4 className="text-xl font-bold text-green-400 font-rajdhani">Locuri prin Calificare</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Toate echipele înregistrate (exceptând cele cu invitație directă) vor participa la Stage 1 - Calificare. 
                  Doar primele 20 echipe se vor califica pentru Stage 2 (Grupe) alături de cele 12 echipe cu invitație directă.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tournament Format Section */}
        <section className="py-8 md:py-16 px-4 bg-darkGray/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-6 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4 font-rajdhani">
                Format Turneu
              </h2>
              <p className="text-gray-300 text-sm md:text-lg px-2">
                Structura completă a competiției Kingston FURY x HyperX Supercup Season 1
              </p>
            </div>

            <div className="space-y-6">
              {/* Stage 0 - Qualification */}
              <NeonBorder className="bg-darkGray/60">
                <Button
                  variant="ghost"
                  className="w-full p-4 md:p-6 justify-between text-left hover:bg-transparent"
                  onClick={() => setIsStage0Expanded(!isStage0Expanded)}
                >
                  <div className="flex items-center">
                    <Target className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5 text-primary" />
                    <span className="text-sm md:text-lg font-semibold text-white">Stage 1: Calificare (toate echipele înregistrate)</span>
                  </div>
                  {isStage0Expanded ? 
                    <ChevronUp className="h-5 w-5 text-primary" /> : 
                    <ChevronDown className="h-5 w-5 text-primary" />
                  }
                </Button>
                
                {isStage0Expanded && (
                  <div className="px-6 pb-6 text-gray-300 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-primary font-bold mb-2">🎯 Procesul de Calificare</h4>
                        <p className="text-sm leading-relaxed">
                          <strong>Perioada:</strong> 10 - 14 septembrie 2025<br />
                          <strong>Format:</strong> Single Elimination Bracket<br />
                          <strong>Locuri:</strong> 20 locuri disponibile pentru Stage 2<br />
                          <strong>Meciuri:</strong> Best of 1 (BO1)<br />
                          <strong>Servere:</strong> FACEIT EU East
                        </p>
                      </div>
                      <div>
                        <h4 className="text-primary font-bold mb-2">🎯 Echipe cu Invitație Directă</h4>
                        <p className="text-sm leading-relaxed">
                          <strong>12 echipe invite direct în Stage 2:</strong><br />
                          • Se înregistrează pe platformă ca toate echipele<br />
                          • Nu participă la Stage 1 (Calificare)<br />
                          • Sunt plasate direct în Stage 2 (Grupe)<br />
                          • Lista echipelor cu invite va fi anunțată separat
                        </p>
                      </div>
                      <div>
                        <h4 className="text-primary font-bold mb-2">📋 Eligibilitatea pentru Calificare</h4>
                        <p className="text-sm leading-relaxed">
                          <strong>Echipe eligible pentru Stage 1:</strong> Toate echipele înregistrate (exceptând cele cu invitație directă)<br />
                          <strong>Criterii minime:</strong><br />
                          • Minimum 5 jucători activi în roster<br />
                          • Roster complet cu toate datele FACEIT<br />
                          • Respectarea regulamentului turneului<br />
                          • Cetățenie moldoveană
                        </p>
                      </div>
                    </div>
                    
                    
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-primary font-bold mb-2">🏆 Avantajele Calificării</h4>
                        <p className="text-sm leading-relaxed">
                          • Intrare în grupele de 32 echipe<br />
                          • Șansa de a câștiga premii în valoare de 100,000 LEI<br />
                          • Experiență competitivă contra echipelor de top<br />
                          • Transmisiune live pe canalele MPL<br />
                          • Statistici oficiale și recunoaștere în comunitate
                        </p>
                      </div>
                      <div>
                        <h4 className="text-primary font-bold mb-2">⚡ Informații Importante</h4>
                        <p className="text-sm leading-relaxed">
                          • Înregistrarea se închide pe 10 septembrie<br />
                          • Check-in obligatoriu cu 30 min înainte<br />
                          • Toate echipele trebuie să aibă Discord activ<br />
                          • Anti-cheat: FACEIT AC obligatoriu<br />
                          • Vezi regulamentul complet mai jos
                        </p>
                      </div>
                    </div>
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
                    <span className="text-lg font-semibold text-white">Stage 2: 8 Grupe (4 echipe fiecare)</span>
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
                    <span className="text-lg font-semibold text-white">Playoff: Double Elimination (16 echipe)</span>
                  </div>
                  {isStage2Expanded ? 
                    <ChevronUp className="h-5 w-5 text-primary" /> : 
                    <ChevronDown className="h-5 w-5 text-primary" />
                  }
                </Button>
                
                {isStage2Expanded && (
                  <div className="px-6 pb-6">
                    <KingstonStage2DoubleElim />
                  </div>
                )}
              </NeonBorder>


            </div>
          </div>
        </section>

        {/* Tournament Rules */}
        <section className="py-8 md:py-16 px-4 bg-darkGray/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-6 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4 font-rajdhani">
                Regulamentul Turneului
              </h2>
              <p className="text-sm md:text-xl text-gray-300 px-2">
                Regulile oficiale pentru Kingston FURY x HyperX Supercup Season 1
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Roster Rules */}
              <NeonBorder className="bg-darkGray/60 p-4 md:p-6">
                <div className="flex items-center mb-4">
                  <Users className="mr-3 h-5 md:h-6 w-5 md:w-6 text-primary" />
                  <h3 className="text-lg md:text-xl font-bold text-white font-rajdhani">Regulile Rosterului</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Rosterul înregistrat inițial la începutul turneului este valabil pe parcursul întregului turneu și <strong className="text-white">nu poate fi schimbat</strong>.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>În fiecare echipă este permis un număr de până la <strong className="text-white">10 jucători</strong>: <span className="text-primary">5 în roster</span> și <span className="text-secondary">5 în substitute</span>.</p>
                  </div>
                </div>
              </NeonBorder>

              {/* Match Conduct */}
              <NeonBorder className="bg-darkGray/60 p-4 md:p-6">
                <div className="flex items-center mb-4">
                  <Clock className="mr-3 h-5 md:h-6 w-5 md:w-6 text-primary" />
                  <h3 className="text-lg md:text-xl font-bold text-white font-rajdhani">Conduita în Meci</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Dacă echipa nu s-a prezentat la meci, este sancționată cu un <strong className="text-red-400">tech lose</strong> sau <strong className="text-red-400">descalificare</strong>.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Această regulă nu este valabilă dacă echipa anunță din timp organizatorii și echipa oponentă că are probleme tehnice; în caz de probleme tehnice este permis un <strong className="text-yellow-400">delay de 15-30 de minute</strong>.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Este interzis abuzul funcțiilor FACEIT, cum ar fi <strong className="text-orange-400">banarea lentă a hărților pentru întinderea timpului</strong>. Este permisă această funcție doar când este anunțată echipa oponentă și organizatorii.</p>
                  </div>
                </div>
              </NeonBorder>

              {/* Behavior Rules */}
              <NeonBorder className="bg-darkGray/60 p-4 md:p-6">
                <div className="flex items-center mb-4">
                  <Shield className="mr-3 h-5 md:h-6 w-5 md:w-6 text-primary" />
                  <h3 className="text-lg md:text-xl font-bold text-white font-rajdhani">Reguli de Comportament</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Insulta față de alți jucători = <strong className="text-yellow-400">warn</strong></p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Insulta sau lipsa de respect față de organizatori = <strong className="text-yellow-400">warn</strong>, apoi <strong className="text-red-400">ban pe termen nedeterminat</strong></p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Critica evenimentului fără bază de argumentare va fi sancționată cu <strong className="text-yellow-400">warn</strong>, apoi cu <strong className="text-red-400">descalificare</strong></p>
                  </div>
                </div>
              </NeonBorder>

              {/* Anti-Cheat & Fair Play */}
              <NeonBorder className="bg-darkGray/60 p-4 md:p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="mr-3 h-5 md:h-6 w-5 md:w-6 text-primary" />
                  <h3 className="text-lg md:text-xl font-bold text-white font-rajdhani">Anti-Cheat & Fair Play</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Folosirea bugurilor cu scop de avantaj vizibil este <strong className="text-red-500">strict interzisă</strong></p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Cheat-urile și orice tip de exploit sunt, de asemenea, <strong className="text-red-500">interzise</strong></p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Toate meciurile se desfășoară pe <strong className="text-primary">FACEIT</strong> cu anti-cheat activ</p>
                  </div>
                </div>
              </NeonBorder>
            </div>

            <div className="mt-6 md:mt-12 text-center">
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg p-4 md:p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-3 md:mb-4">
                  <AlertTriangle className="mr-2 md:mr-3 h-5 md:h-6 w-5 md:w-6 text-red-400" />
                  <h4 className="text-lg md:text-xl font-bold text-red-400 font-rajdhani">IMPORTANT</h4>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  Încălcarea acestor reguli va rezulta în sancțiuni severe, inclusiv descalificare din turneu. 
                  Organizatorii MPL își rezervă dreptul de a lua decizii finale în toate situațiile disputate. 
                  Participarea în turneu implică acceptarea completă a acestui regulament.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-8 md:py-16 px-4 bg-gradient-to-r from-primary/20 to-secondary/20">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 font-rajdhani">
              Alătură-te competiției!
            </h2>
            <p className="text-sm md:text-xl text-gray-300 mb-6 md:mb-8 px-2">
              Înscrie-te la Kingston FURY x HyperX Supercup Season 1 și câștigă echipamente gaming premium.
            </p>
            <Link href="/register-team">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-black px-6 md:px-8 py-3 md:py-4 text-lg md:text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Gift className="mr-2" />
                ÎNSCRIE-TE ACUM!
              </Button>
            </Link>
          </div>
        </section>

        {/* Partners */}
        <section className="py-8 md:py-16 px-4 bg-darkGray/40 border-t border-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-6 md:mb-8 font-rajdhani">Powered by</h3>
            <div className="flex justify-center items-center gap-4 md:gap-6 lg:gap-8 flex-wrap">
              <div className="text-primary font-bold text-lg md:text-xl lg:text-2xl font-rajdhani">
                Kingston FURY
              </div>
              <div className="text-primary font-bold text-lg md:text-xl lg:text-2xl font-rajdhani">
                HyperX
              </div>
              <div className="text-primary font-bold text-lg md:text-xl lg:text-2xl font-rajdhani">
                Darwin
              </div>
              <div className="text-primary font-bold text-lg md:text-xl lg:text-2xl font-rajdhani">
                MPL
              </div>
            </div>
            <p className="text-gray-400 text-center mt-4 md:mt-6 text-sm md:text-base px-2">
              Un eveniment realizat în parteneriat cu cele mai importante branduri de gaming gear
            </p>
          </div>
        </section>

        {/* Prize Details Disclaimer - Small Footer */}
        <section className="py-4 px-4 bg-darkGray/20 border-t border-gray-700/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-gray-300 hover:bg-transparent p-2"
                onClick={() => setIsPrizeDetailsExpanded(!isPrizeDetailsExpanded)}
              >
                * Detalii complete despre premii
                {isPrizeDetailsExpanded ? 
                  <ChevronUp className="ml-1 h-3 w-3" /> : 
                  <ChevronDown className="ml-1 h-3 w-3" />
                }
              </Button>
              
              {isPrizeDetailsExpanded && (
                <div className="mt-4 max-w-3xl mx-auto">
                  <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-4 mb-6">
                    <p className="text-amber-200 text-center text-sm font-medium">
                      <strong>Suma de 100,000 LEI este calculată conform prețurilor retail găsite online.</strong>
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-white mb-4 border-b border-gray-600/30 pb-2">
                      Lista completă de produse pentru primele trei locuri:
                    </h4>

                    {/* 1st Place Detailed */}
                    <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-400/30 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-yellow-400 mb-3 flex items-center">
                        <Trophy className="h-4 w-4 mr-2" />
                        Locul 1 - Produse Kingston FURY:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                        <div>
                          <p className="font-medium mb-2">Kingston FURY Renegade RGB:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• 1x KF584CU40RSAK2-48 (48GB 8400MT/s DDR5 CL40 CUDIMM Silver)</li>
                            <li>• 2x KF584CU40RWAK2-48 (48GB 8400MT/s DDR5 CL40 CUDIMM White)</li>
                            <li>• 2x KF580C38RWAK2-48 (48GB 8000MT/s DDR5 CL38 White)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-2">HyperX Gaming Gear:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• 5x HyperX Cloud III S Wireless (căști gaming)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 2nd Place Detailed */}
                    <div className="bg-gradient-to-r from-gray-400/10 to-gray-500/10 border border-gray-400/30 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-gray-300 mb-3 flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Locul 2 - Produse Kingston FURY:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                        <div>
                          <p className="font-medium mb-2">Kingston FURY Beast:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• 1x KF560C36BWE2AK2-32 (32GB 6000MT/s DDR5 CL36 White RGB EXPO)</li>
                            <li>• 2x KF560C36BBE2K2-32 (32GB 6000MT/s DDR5 CL36 Black EXPO)</li>
                            <li>• 2x KF560C36BWE2K2-32 (32GB 6000MT/s DDR5 CL36 White EXPO)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-2">HyperX Gaming Gear:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• 5x HyperX Alloy Rise 75 (tastatură mecanică wired)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 3rd Place Detailed */}
                    <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-400/30 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-orange-400 mb-3 flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Locul 3 - Kingston FURY Bundle:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                        <div>
                          <p className="font-medium mb-2">Kingston FURY Premium Bundle (5 seturi):</p>
                          <ul className="space-y-1 text-xs">
                            <li>• 5x Kingston FURY DT Exodia S 256GB (DTXS/256GB)</li>
                            <li>• 5x Tricou negru cu inscripție roșie "Kingston FURY"</li>
                            <li>• 5x Geantă termică Kingston FURY branded</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-2">HyperX Gaming Gear:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• 5x HyperX Pulsefire Haste 2 Wireless (mouse gaming)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Ace of Aces Detailed */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-400/30 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-purple-400 mb-3 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Premiul special Ace of Aces:
                      </h5>
                      <div className="text-xs text-gray-300 space-y-3">
                        <div>
                          <p className="font-medium mb-2">Kingston FURY Renegade Limited Edition:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• 1x KF580C36RLAK2-48 (FURY Renegade 48GB 2x24GB 8000MT/s DDR5 RGB Limited Edition)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-2">HyperX Premium Choice:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• 1x HyperX Alloy Rise 75 Wireless (tastatură wireless)</li>
                            <li className="italic text-purple-300">* Dacă câștigătorul Ace of Aces va alege HyperX Cloud III S Wireless</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default KingstonHyperXSupercup;
