import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, MapPin, Trophy, Users, Award, Gift, Sparkles, FileText as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import NeonBorder from "@/components/animations/NeonBorder";
import CountdownTimer from "@/components/ui/countdown-timer";
import { useLanguage } from "@/lib/LanguageContext";

const HatorCSLeague = () => {
  const { t } = useLanguage();
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
                <CountdownTimer targetDate="2025-06-02T20:00:00" className="max-w-3xl" />
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

        {/* Details Section */}
        <div className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-6 font-rajdhani">{t('event.about.title')}</h2>
              
              <div className="prose prose-invert max-w-none">
                <p>
                  <strong>{t('event.hator.title')}</strong> {t('event.league.description.1')}
                </p>
                
                <p>
                  {t('event.league.description.2')}
                </p>
                
                <h3>{t('event.format.title.official')}</h3>
                
                <h4 className="mt-4 mb-2 text-primary font-semibold">{t('event.format.stage1')}</h4>
                <ul className="mb-4">
                  <li><strong>Capacitate maximă</strong>: 128 echipe din Moldova și România</li>
                  <li><strong>Structură</strong>: 16 grupe a câte 8 echipe</li>
                  <li>
                    <strong>Sistem</strong>: Swiss Style Bo1 - echipele joacă meciuri până acumulează:
                    <ul className="ml-6 mt-2 mb-2 list-disc">
                      <li>2 victorii - se califică automat în play-off</li>
                      <li>2 înfrângeri - sunt eliminate</li>
                    </ul>
                    <div className="mt-2 ml-6">
                      <a 
                        href="/docs/Explicatie_Swiss_Grupa_8_Final.pdf" 
                        target="_blank"
                        className="text-primary hover:text-primary/80 underline flex items-center"
                      >
                        <FileIcon className="w-4 h-4 mr-1" /> Explicație detaliată Swiss Format
                      </a>
                    </div>
                  </li>
                  <li><strong>Calificare</strong>: Primele 3 echipe din fiecare grupă (cele cu rezultate 2-0, 2-1 sau 1-2) avansează în faza Play-off</li>
                  <li><strong>Bonus seeding</strong>: Echipele clasate pe locul 1 din cele 16 grupe avansează direct în Top 24, fără a juca primul meci din Play-off</li>
                </ul>
                
                <h4 className="mt-4 mb-2 text-primary font-semibold">{t('event.format.stage2')}</h4>
                <ul className="mb-4">
                  <li><strong>Echipe calificate</strong>: 48 din faza grupelor</li>
                  <li>
                    <strong>Structură</strong>:
                    <ul className="ml-6 mt-2 mb-2 list-disc">
                      <li>Runda 1 (Top 48 → Top 32): participă locurile 2 și 3 din grupe (32 echipe) - meciuri Bo1</li>
                      <li>Runda 2 (Top 32 → Top 24): echipele câștigătoare din R1 + echipele clasate pe locul 1 în grupe - meciuri Bo1</li>
                      <li>Runda 3 (Top 24 → Top 12): se joacă 12 meciuri Bo1</li>
                      <li>Etapa finală: optimi, sferturi, semifinale și finală - toate meciuri Bo3</li>
                    </ul>
                    <div className="mt-2 ml-6">
                      <a 
                        href="/docs/Explicatie_Etapa2_Playoff_Curat.pdf" 
                        target="_blank"
                        className="text-primary hover:text-primary/80 underline flex items-center"
                      >
                        <FileIcon className="w-4 h-4 mr-1" /> Explicație detaliată Play-off
                      </a>
                    </div>
                  </li>
                </ul>
                
                <h4 className="mt-4 mb-2 text-primary font-semibold">{t('event.format.matches.format')}</h4>
                <ul className="mb-4">
                  <li><strong>Bo1</strong>: Un singur meci decide câștigătorul (grupe și primele 3 runde din Play-off)</li>
                  <li><strong>Bo3</strong>: Cele mai bune din 3 hărți (etapa finală din Top 12 până în finală)</li>
                </ul>
                
                <h4 className="mt-4 mb-2 text-primary font-semibold">{t('event.maps.selection')}</h4>
                <ul>
                  <li><strong>Coinflip</strong>: Determinarea echipelor A și B</li>
                  <li><strong>Pași alegere hartă</strong>:
                    <ol className="ml-6 mt-2 list-decimal">
                      <li>Echipa A elimină 1 hartă</li>
                      <li>Echipa B elimină 1 hartă</li>
                      <li>Echipa A alege harta 1 (care va fi jucată prima)</li>
                      <li>Echipa B alege partea (CT/T) pentru harta 1</li>
                      <li>Echipa B alege harta 2 (care va fi jucată a doua)</li>
                      <li>Echipa A alege partea (CT/T) pentru harta 2</li>
                      <li>Echipa A elimină 1 hartă</li>
                      <li>Echipa B elimină 1 hartă</li>
                      <li>Harta rămasă devine harta 3 (decisivă dacă scorul e 1-1)</li>
                      <li>Echipa A alege partea (CT/T) pentru harta 3</li>
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
                  <li><strong>{t('event.registration.start')}</strong>: 21 Aprilie 2025</li>
                  <li><strong>{t('event.registration.end')}</strong>: 25 Mai 2025</li>
                  <li><strong>{t('event.team.validation')}</strong>: 26 Mai - 1 Iunie 2025</li>
                  <li><strong>{t('event.tournament.start')}</strong>: 2 Iunie 2025</li>
                </ul>
              </div>
              
              <div className="mt-12">
                <h2 id="rules" className="text-3xl font-bold text-white mb-6 font-rajdhani">{t('event.rules')}</h2>
                
                <div className="prose prose-invert max-w-none">
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
                    <li><strong>Nickname adecvat</strong> – un nickname provocator, care instigă la ură națională, rasism, misoginie și alte forme de discriminare, este absolut INTERZIS.</li>
                    <li><strong>Skinuri indecente</strong> – se interzice folosirea skinurilor care conțin combinații de stickere indecente sau name tag-uri provocatoare. Dacă este depistată utilizarea unui skin indecent, se va aplica o avertizare; la a doua abatere, echipa va fi descalificată.</li>
                    <li><strong>Agenții</strong> trebuie să aibă skin-ul default.</li>
                    <li><strong>Provocarea</strong> și alte forme de batjocură sunt permise doar dacă ambele echipe sunt de acord cu trash talk-ul; în caz contrar, se aplică avertizare, urmată de descalificare.</li>
                    <li><strong>Bug-uri</strong> – folosirea bug-urilor cu ajutorul aplicațiilor externe este echivalentă cu folosirea de cheats. Bug-urile din joc sunt permise doar dacă nu oferă un avantaj semnificativ (ex: bug cu WH sau macro/exploit pentru Auto-Aim sunt interzise).</li>
                    <li><strong>PFP (profile picture)</strong> – poza de profil trebuie să conțină un conținut adecvat.</li>
                    <li><strong>Smurfing</strong> – conturile suspecte de smurfing vor fi investigate până la demonstrarea clară a smurfingului sau, în caz contrar, până la infirmarea acestuia. Se admite folosirea unui alt cont (decât cel principal) doar dacă acel cont principal are un ban temporar. Conturile cu ban pentru smurfing sau cheating nu sunt admise. Dacă jucătorul nu deține contul original, este obligat să informeze moderatorii sau organizatorii turneului.</li>
                    <li><strong>Streamsniping</strong> – este interzisă vizionarea jocului atât timp cât jucătorul se află în meci, indiferent de delay.</li>
                    <li><strong>Folosirea Discordului</strong> – Discord turneului este platforma oficială de comunicare și trebuie utilizată pentru coordonare.</li>
                  </ol>
                </div>
              </div>
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