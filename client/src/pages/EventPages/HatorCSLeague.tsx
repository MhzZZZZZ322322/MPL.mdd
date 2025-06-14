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

const HatorCSLeague = () => {
  const { t } = useLanguage();
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isTeamsExpanded, setIsTeamsExpanded] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Team logo mapping
  const getTeamLogo = (teamName: string) => {
    switch (teamName) {
      case "FIRE SQUAD":
        return {
          icon: <Flame className="w-12 h-12 text-orange-400" />,
          gradient: "from-orange-500 to-red-600"
        };
      case "DIGITAL WOLVES":
        return {
          icon: <Zap className="w-12 h-12 text-cyan-400" />,
          gradient: "from-cyan-500 to-teal-600"
        };
      case "CYBER HAWKS":
        return {
          icon: <Eye className="w-12 h-12 text-blue-400" />,
          gradient: "from-blue-500 to-indigo-600"
        };
      default:
        return {
          icon: <Trophy className="w-12 h-12 text-primary" />,
          gradient: "from-primary to-primary/80"
        };
    }
  };

  // Fetch teams for this tournament
  const { data: teams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams", "hator-cs-league"],
    queryFn: async () => {
      const response = await fetch("/api/teams?tournament=hator-cs-league");
      if (!response.ok) throw new Error("Failed to fetch teams");
      return response.json();
    }
  });

  // Fetch members for selected team
  const { data: teamMembers = [], isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/teams", selectedTeam?.id, "members"],
    queryFn: async () => {
      if (!selectedTeam) return [];
      const response = await fetch(`/api/teams/${selectedTeam.id}/members`);
      if (!response.ok) throw new Error("Failed to fetch team members");
      return response.json();
    },
    enabled: !!selectedTeam
  });
  return (
    <>
      <Helmet>
        <title>HATOR CS2 LEAGUE MOLDOVA | Moldova Pro League</title>
        <meta name="description" content="HATOR CS2 LEAGUE MOLDOVA - Cel mai tare turneu online de Counter-Strike 2 din Moldova și România, organizat de comunitatea MPL în parteneriat cu HATOR." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-black min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[70vh] bg-gradient-to-b from-black to-darkBg overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/upscalemedia-transformed.jpeg" 
              alt="HATOR CS2 LEAGUE MOLDOVA" 
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
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('event.back.button')}
                </Button>
              </Link>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 font-rajdhani">
                {t('event.hator.title')}
              </h1>

              <div className="flex items-center mb-6 text-gray-300">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <span className="mr-4">{t('event.hator.date')}</span>

                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span>{t('event.hator.location')}</span>
              </div>

              <p className="text-lg text-gray-100 max-w-2xl mb-8">
                {t('event.hator.description')}
              </p>

              {/* Countdown timer până la începerea jocurilor */}
              <div className="mb-8">
                <p className="text-center text-white mb-2">{t('event.countdown')}</p>
                <CountdownTimer targetDate="2025-06-16T18:00:00" className="max-w-3xl" />
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="https://discord.gg/KgXXUebhVM" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary/90">
                    {t('event.registration')}
                  </Button>
                </a>
                <a href="#rules" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    {t('event.regulation')}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Premii Section */}
        <div className="py-12 bg-gradient-to-b from-darkBg to-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 font-rajdhani text-center">{t('event.prizes.value')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
              <a 
                href="https://darwin.md/scaun-gaming-hator-arc-2-xl-black-htc2000.html" 
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="group block"
              >
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-4 sm:p-6 rounded-lg border border-amber-500/30 transform group-hover:-translate-y-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/20 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <Award className="text-amber-500 h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3" />
                    <h3 className="text-amber-500 text-xl sm:text-2xl font-bold">{t('event.prize.first')}</h3>
                  </div>
                  <div className="relative h-52 sm:h-64 overflow-hidden rounded mb-4 flex-grow">
                    <img 
                      src="/image_1745061600248.png" 
                      alt="5x Scaune gaming HATOR Arc 2 XL" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="600"
                      height="450"
                    />
                  </div>
                  <p className="text-white text-center text-base sm:text-lg">{t('event.hator.chairs')}</p>
                </div>
              </a>

              <a 
                href="https://darwin.md/mouse-hator-quasar-3-ultra-8k-wireless-htm771-fara-fir-white.html" 
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="group block"
              >
                <div className="bg-gradient-to-br from-slate-400/20 to-slate-500/20 p-4 sm:p-6 rounded-lg border border-slate-400/30 transform group-hover:-translate-y-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-slate-400/20 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <Award className="text-slate-400 h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3" />
                    <h3 className="text-slate-400 text-xl sm:text-2xl font-bold">{t('event.prize.second')}</h3>
                  </div>
                  <div className="relative h-52 sm:h-64 overflow-hidden rounded mb-4 flex-grow">
                    <img 
                      src="/image_1745059215270.png" 
                      alt="5x Mouse HATOR Quasar 3 ULTRA 8K" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="600"
                      height="450"
                    />
                  </div>
                  <p className="text-white text-center text-base sm:text-lg">{t('event.hator.mouse')}</p>
                </div>
              </a>

              <a 
                href="https://darwin.md/casti-hator-hypergang-2-usb-71-cu-fir-matte-titanium.html" 
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="group block"
              >
                <div className="bg-gradient-to-br from-amber-700/20 to-amber-800/20 p-4 sm:p-6 rounded-lg border border-amber-700/30 transform group-hover:-translate-y-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-700/20 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <Award className="text-amber-700 h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3" />
                    <h3 className="text-amber-700 text-xl sm:text-2xl font-bold">{t('event.prize.third')}</h3>
                  </div>
                  <div className="relative h-52 sm:h-64 overflow-hidden rounded mb-4 flex-grow">
                    <img 
                      src="/image_1745060726522.png" 
                      alt="5x Căști HATOR Hypergang 2 USB 7.1" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="600"
                      height="450"
                    />
                  </div>
                  <p className="text-white text-center text-base sm:text-lg">{t('event.hator.headphones')}</p>
                </div>
              </a>

              <div className="group block md:col-span-2 lg:col-span-1 md:max-w-md lg:max-w-full md:mx-auto lg:mx-0">
                <div className="bg-gradient-to-br from-purple-500/30 to-purple-700/30 p-4 sm:p-6 rounded-lg border border-purple-500/40 transform group-hover:-translate-y-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/30 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <Gift className="text-purple-400 h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3" />
                    <h3 className="text-purple-400 text-xl sm:text-2xl font-bold">{t('event.prize.secret')}</h3>
                  </div>
                  <div className="relative h-52 sm:h-64 overflow-hidden rounded mb-4 flex-grow flex items-center justify-center bg-darkGray/60">
                    <Sparkles className="text-purple-300 h-20 w-20 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-8">
                      <p className="text-purple-300 text-lg sm:text-xl font-semibold">{t('event.prize.secret.description')}</p>
                    </div>
                  </div>
                  <p className="text-white text-center text-base sm:text-lg">{t('event.prize.special')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Profile Section */}
        <div className="py-16 container mx-auto px-4">
          <button 
            className="mb-6 cursor-pointer group text-left w-full p-6 rounded-xl border-3 border-gray-600 bg-gradient-to-r from-gray-800 to-gray-900 hover:border-primary hover:from-primary/20 hover:to-primary/10 transition-all duration-300 shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setIsTeamsExpanded(!isTeamsExpanded)}
          >
            <h2 className="text-3xl font-bold text-white font-rajdhani group-hover:text-primary transition-colors">
              Profilul echipelor
            </h2>
          </button>

          {isTeamsExpanded && (
            <>
              {teamsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {teams.map((team) => (
                    <NeonBorder key={team.id} className="p-6 bg-darkGray/50 rounded-lg cursor-pointer hover:bg-darkGray/70 transition-all duration-300">
                      <div 
                        onClick={() => setSelectedTeam(selectedTeam?.id === team.id ? null : team)}
                        className="text-center"
                      >
                        <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${getTeamLogo(team.name).gradient} rounded-lg flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-lg`}>
                          <div className="relative">
                            {getTeamLogo(team.name).icon}
                            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">{team.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {selectedTeam?.id === team.id ? "Ascunde membrii" : "Vezi membrii echipei"}
                        </p>
                      </div>
                    </NeonBorder>
                  ))}
                </div>
              )}

              {/* Team Members Modal/Expanded View */}
              {selectedTeam && (
                <NeonBorder className="p-6 bg-darkGray/80 rounded-lg animate-in slide-in-from-top duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white font-rajdhani">
                      Membrii echipei {selectedTeam.name}
                    </h3>
                    <Button
                      onClick={() => setSelectedTeam(null)}
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-black"
                    >
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Închide
                    </Button>
                  </div>

                  {membersLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="bg-black/30 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-white">{member.nickname}</h4>
                            {member.role === "captain" && (
                              <span className="bg-primary text-black px-2 py-1 text-xs rounded font-semibold">
                                CĂPITAN
                              </span>
                            )}
                          </div>
                          <a
                            href={member.faceitProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm"
                          >
                            <span className="mr-2">→</span>
                            Profil FACEIT
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </NeonBorder>
              )}
            </>
          )}
        </div>

        {/* Details Section */}
        <div className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <button 
                className="mb-6 cursor-pointer group text-left w-full p-6 rounded-xl border-3 border-gray-600 bg-gradient-to-r from-gray-800 to-gray-900 hover:border-primary hover:from-primary/20 hover:to-primary/10 transition-all duration-300 shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setIsContentExpanded(!isContentExpanded)}
              >
                <h2 className="text-3xl font-bold text-white font-rajdhani group-hover:text-primary transition-colors">
                  Informații generale despre turneu
                </h2>
              </button>

              {isContentExpanded && (
                <div className="prose prose-invert max-w-none animate-in slide-in-from-top duration-300">
                  <p>
                    <strong>{t('event.hator.title')}</strong> {t('event.league.description.1')}
                  </p>

                  <p>
                    {t('event.league.description.2')}
                  </p>

                  <h3>{t('event.format.title.official')}</h3>

                  <h4 className="mt-4 mb-2 text-primary font-semibold">{t('event.format.stage1')}</h4>
                  <ul className="mb-4">
                    <li><strong>{t('event.format.max.capacity')}</strong>: {t('event.format.teams.number')}</li>
                    <li><strong>{t('event.format.structure')}</strong>: {t('event.format.groups.structure')}</li>
                    <li>
                      <strong>{t('event.format.system')}</strong>: {t('event.format.swiss.description')}
                      <ul className="ml-6 mt-2 mb-2 list-disc">
                        <li>{t('event.format.wins.qualification')}</li>
                        <li>{t('event.format.losses.elimination')}</li>
                      </ul>
                      <div className="mt-2 ml-6">
                        <a 
                          href="/docs/Explicatie_Swiss_Grupa_8_Final.pdf" 
                          target="_blank"
                          className="text-primary hover:text-primary/80 underline flex items-center"
                        >
                          <FileIcon className="w-4 h-4 mr-1" /> {t('event.format.swiss.detailed')}
                        </a>
                      </div>
                    </li>
                    <li><strong>{t('event.format.qualification')}</strong>: {t('event.format.qualification.description')}</li>
                    <li><strong>{t('event.format.bonus.seeding')}</strong>: {t('event.format.bonus.description')}</li>
                  </ul>

                  <h4 className="mt-4 mb-2 text-primary font-semibold">{t('event.format.stage2')}</h4>
                  <ul className="mb-4">
                    <li><strong>{t('event.format.qualified.teams')}</strong>: {t('event.format.qualified.number')}</li>
                    <li>
                      <strong>{t('event.format.structure')}</strong>:
                      <ul className="ml-6 mt-2 mb-2 list-disc">
                        <li>{t('event.format.round1')}</li>
                        <li>{t('event.format.round2')}</li>
                        <li>{t('event.format.round3')}</li>
                        <li>{t('event.format.final')}</li>
                      </ul>
                      <div className="mt-2 ml-6">
                        <a 
                          href="/docs/Explicatie_Etapa2_Playoff_Curat.pdf" 
                          target="_blank"
                          className="text-primary hover:text-primary/80 underline flex items-center"
                        >
                          <FileIcon className="w-4 h-4 mr-1" /> {t('event.format.playoff.detailed')}
                        </a>
                      </div>
                    </li>
                  </ul>

                  <h4 className="mt-4 mb-2 text-primary font-semibold">{t('event.format.matches.format')}</h4>
                  <ul className="mb-4">
                    <li><strong>Bo1</strong>: {t('event.format.bo1')}</li>
                    <li><strong>Bo3</strong>: {t('event.format.bo3')}</li>
                  </ul>

                  <h4 className="mt-4 mb-2 text-primary font-semibold">{t('event.maps.selection')}</h4>
                  <ul>
                    <li><strong>{t('event.maps.coinflip')}</strong>: {t('event.maps.teams.determination')}</li>
                    <li><strong>{t('event.maps.steps')}</strong>:
                      <ol className="ml-6 mt-2 list-decimal">
                        <li>{t('event.maps.step1')}</li>
                        <li>{t('event.maps.step2')}</li>
                        <li>{t('event.maps.step3')}</li>
                        <li>{t('event.maps.step4')}</li>
                        <li>{t('event.maps.step5')}</li>
                        <li>{t('event.maps.step6')}</li>
                        <li>{t('event.maps.step7')}</li>
                        <li>{t('event.maps.step8')}</li>
                        <li>{t('event.maps.step9')}</li>
                        <li>{t('event.maps.step10')}</li>
                      </ol>
                    </li>
                  </ul>

                  <h3>{t('event.eligibility')}</h3>
                  <ul>
                    <li>{t('event.eligibility.teams')}</li>
                    <li>{t('event.eligibility.faceit')}</li>
                    <li>{t('event.eligibility.nationality')}</li>
                    <li>{t('event.eligibility.tag')}</li>
                  </ul>

                  <h3>{t('event.registration.title')}</h3>
                  <p>
                    {t('event.registration.description')}
                  </p>
                  <ul>
                    <li><strong>{t('event.registration.start')}</strong>: {t('event.date.registration.start')}</li>
                    <li><strong>{t('event.registration.end')}</strong>: {t('event.date.registration.end')}</li>
                    <li><strong>{t('event.team.validation')}</strong>: {t('event.date.team.validation')}</li>
                    <li><strong>{t('event.tournament.start')}</strong>: 18 Iunie 2025</li>
                  </ul>
                </div>
              )}

              {isContentExpanded && (
                <div className="mt-12">
                  <h2 id="rules" className="text-3xl font-bold text-white mb-6 font-rajdhani">{t('event.rules')}</h2>

                  <div className="prose prose-invert max-w-none animate-in slide-in-from-top duration-300">
                    <h3>{t('event.anticheat')}</h3>
                    <ul>
                      <li>{t('event.anticheat.rule1')}</li>
                      <li>{t('event.anticheat.rule2')}</li>
                      <li>{t('event.anticheat.rule3')}</li>
                      <li>{t('event.anticheat.rule4')}</li>
                    </ul>

                    <h3>{t('event.conduct')}</h3>
                    <ul>
                      <li>{t('event.conduct.rule1')}</li>
                      <li>{t('event.conduct.rule2')}</li>
                      <li>{t('event.conduct.rule3')}</li>
                    </ul>

                    <h3>{t('event.technical.pause')}</h3>
                    <ul>
                      <li>{t('event.technical.pause.rule1')}</li>
                      <li>{t('event.technical.pause.rule2')}</li>
                    </ul>

                    <h3>{t('event.rules.mandatory')}</h3>
                    <p className="text-red-400 font-semibold">{t('event.rules.warning')}</p>
                    <ol className="space-y-2">
                      <li><strong>{t('event.rule.nickname.title')}</strong> – {t('event.rule.nickname.description')}</li>
                      <li><strong>{t('event.rule.skins.title')}</strong> – {t('event.rule.skins.description')}</li>
                      <li><strong>{t('event.rule.agents.title')}</strong> – {t('event.rule.agents.description')}</li>
                      <li><strong>{t('event.rule.taunting.title')}</strong> – {t('event.rule.taunting.description')}</li>
                      <li><strong>{t('event.rule.bugs.title')}</strong> – {t('event.rule.bugs.description')}</li>
                      <li><strong>{t('event.rule.pfp.title')}</strong> – {t('event.rule.pfp.description')}</li>
                      <li><strong>{t('event.rule.smurfing.title')}</strong> – {t('event.rule.smurfing.description')}</li>
                      <li><strong>{t('event.rule.streamsniping.title')}</strong> – {t('event.rule.streamsniping.description')}</li>
                      <li><strong>{t('event.rule.discord.title')}</strong> – {t('event.rule.discord.description')}</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <NeonBorder className="mb-8 rounded-lg p-6 bg-darkGray/50">
                <h3 className="text-xl font-bold text-white mb-4">{t('event.quick.info')}</h3>

                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start">
                    <Calendar className="mr-3 h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">{t('event.date.range')}</div>
                      <div className="text-sm">{t('event.date.hours')}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="mr-3 h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Online (FACEIT)</div>
                      <div className="text-sm">{t('event.platform')}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="mr-3 h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">{t('event.teams.limit')}</div>
                      <div className="text-sm">{t('event.format.5v5')}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Trophy className="mr-3 h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">{t('event.prizes.value.hator')}</div>
                      <div className="text-sm">{t('event.hator.premium')}</div>
                    </div>
                  </div>
                </div>
              </NeonBorder>

              <NeonBorder className="mb-8 rounded-lg p-6 bg-darkGray/50">
                <h3 className="text-xl font-bold text-white mb-4">{t('event.organized.by')}</h3>
                <div className="flex flex-col space-y-4">
                  <div className="mb-4">
                    <a 
                      href="/" 
                      className="text-white text-xl font-medium hover:text-primary transition-colors"
                    >
                      Moldova Pro League
                    </a>
                  </div>

                  <hr className="border-gray-700" />

                  <div>
                    <div className="font-semibold text-white mb-2">{t('event.main.sponsor')}</div>
                    <a 
                      href="https://hator.gg" 
                      target="_blank" 
                      rel="nofollow noopener noreferrer"
                      className="text-white text-xl font-medium hover:text-primary transition-colors mb-2 block"
                    >
                      HATOR
                    </a>
                    <a 
                      href="https://darwin.md" 
                      target="_blank" 
                      rel="nofollow noopener noreferrer"
                      className="text-white text-xl font-medium hover:text-primary transition-colors"
                    >
                      Darwin.md
                    </a>
                  </div>
                </div>
              </NeonBorder>

              <NeonBorder className="mb-8 rounded-lg p-6 bg-darkGray/50">
                <h3 className="text-xl font-bold text-white mb-4">{t('event.stream.media')}</h3>

                <p className="text-gray-300 mb-4">
                  {t('event.stream.description')}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-primary text-lg mr-2">→</span>
                    <a 
                      href="https://twitch.tv/moldovaproleague" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-primary transition-colors"
                    >
                      Twitch
                    </a>
                  </div>

                  <div className="flex items-center">
                    <span className="text-primary text-lg mr-2">→</span>
                    <a 
                      href="https://www.youtube.com/@MoldovaProLeague" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-primary transition-colors"
                    >
                      YouTube
                    </a>
                  </div>
                </div>
              </NeonBorder>

              <NeonBorder className="rounded-lg p-6 bg-darkGray/50">
                <h3 className="text-xl font-bold text-white mb-4">{t('event.contact')}</h3>

                <p className="text-gray-300 mb-4">
                  {t('event.contact.description')}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-primary text-lg mr-2">→</span>
                    <a 
                      href="https://discord.gg/Ek4qvWE5qB" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-primary transition-colors"
                    >
                      Discord MPL
                    </a>
                  </div>

                  <div className="flex items-center">
                    <span className="text-primary text-lg mr-2">→</span>
                    <a 
                      href="mailto:proleaguemoldova@gmail.com" 
                      className="text-white hover:text-primary transition-colors"
                    >
                      proleaguemoldova@gmail.com
                    </a>
                  </div>
                </div>
              </NeonBorder>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HatorCSLeague;