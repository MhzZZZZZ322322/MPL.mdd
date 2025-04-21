import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import NeonBorder from "@/components/animations/NeonBorder";
import { useLanguage } from "@/lib/LanguageContext";

const MPLPilotCup = () => {
  const { t } = useLanguage();
  return (
    <>
      <Helmet>
        <title>MPL Pilot Cup | Moldova Pro League</title>
        <meta name="description" content="MPL Pilot Cup - Turneul inaugural dedicat jucătorilor din Moldova și România, 22-23 Martie 2025." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-black min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[60vh] bg-gradient-to-b from-black to-darkBg overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/image_1745068400330.png" 
              alt="MPL Pilot Cup" 
              className="w-full h-full object-cover opacity-45"
              loading="eager"
              width="1920"
              height="1080"
            />
            <div className="absolute inset-0 bg-black/20 z-0"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              <Link href="/#about">
                <Button variant="ghost" className="mb-4 text-gray-300 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('event.back.button')}
                </Button>
              </Link>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 font-rajdhani">
                {t('event.pilot.cup.title')}
              </h1>
              
              <div className="flex items-center mb-6 text-gray-300">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <span className="mr-4">{t('event.pilot.cup.date')}</span>
                
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span>{t('event.pilot.cup.location')}</span>
              </div>
              
              <p className="text-lg text-gray-100 max-w-2xl mb-8">
                {t('event.pilot.cup.description')}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {/* Butoanele au fost eliminate */}
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
                  <strong>MPL Pilot Cup</strong> {t('event.pilot.cup.about.p1')}
                </p>
                
                <p>
                  {t('event.pilot.cup.about.p2')}
                </p>
                
                <h3>{t('event.format.title')}</h3>
                <ul>
                  <li><strong>{t('event.format.elimination')}</strong></li>
                  <li><strong>{t('event.format.matches')}</strong></li>
                </ul>
                
                <h3>{t('event.prizes.title')}</h3>
                <p>
                  {t('event.prizes.description')}
                </p>
                <ul>
                  <li><strong>{t('event.prize.first.place')}</strong>: 5x Mouse sau Tastatură (la alegere): Tastatură Hator Gravity TKL White sau Mouse Hator Quasar 2 Ultra 4K Black</li>
                  <li><strong>{t('event.prize.second.place')}</strong>: 5x Mouse sau Tastatură (în funcție de alegerea echipei câștigătoare)</li>
                  <li><strong>{t('event.prize.third.place')}</strong>: 5x Căști gaming Hator Hypergang 2 USB 7.1</li>
                  <li><strong>{t('event.prize.fourth.place')}</strong>: 5x Mousepad Hator Tonn EVO L Black</li>
                </ul>
              </div>
              
              <div className="mt-12">
                
                <h2 className="text-3xl font-bold text-white mb-6 font-rajdhani">{t('event.winners.title')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {/* Locul 1 */}
                  <div className="bg-darkGray/60 rounded-lg overflow-hidden border border-primary/30 hover:border-primary transition-colors">
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <span className="bg-gradient-to-r from-yellow-500 to-amber-300 text-black font-bold text-sm py-1 px-3 rounded mr-2">{t('event.first.place')}</span>
                        <h3 className="text-xl font-bold text-white">LitEnergy</h3>
                      </div>
                      <img 
                        src="/img_0402_1.jpg" 
                        alt="Câștigător MPL Pilot Cup cu premii" 
                        className="w-full h-64 object-cover rounded mb-4"
                        loading="lazy"
                        width="400"
                        height="300"
                      />
                      <p className="text-gray-300 mt-4">
                        Felicitări, LitEnergy! 🏆 Echipa a demonstrat că talentul, determinarea și munca în echipă sunt cheia succesului! Printr-un parcurs spectaculos și momente de joc electrizante, au reușit să cucerească titlul de campioni ai turneului.
                      </p>
                    </div>
                  </div>
                  
                  {/* Locul 2 */}
                  <div className="bg-darkGray/60 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors">
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <span className="bg-gradient-to-r from-gray-200 to-gray-400 text-black font-bold text-sm py-1 px-3 rounded mr-2">LOCUL 2</span>
                        <h3 className="text-xl font-bold text-white">R5Team</h3>
                      </div>
                      <img 
                        src="/image_1745053980568.png" 
                        alt="Echipa R5Team" 
                        className="w-full h-64 object-cover rounded mb-4"
                        loading="lazy"
                        width="400" 
                        height="300"
                      />
                      <p className="text-gray-300">
                        Respect, R5Team! Echipa a demonstrat curaj, determinare și un joc de înaltă clasă în turneu! Au luptat până la capăt și au arătat de ce sunt una dintre cele mai puternice echipe din competiție.
                      </p>
                    </div>
                  </div>
                  
                  {/* Locul 3 */}
                  <div className="bg-darkGray/60 rounded-lg overflow-hidden border border-amber-800/50 hover:border-amber-700 transition-colors">
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <span className="bg-gradient-to-r from-amber-700 to-amber-500 text-white font-bold text-sm py-1 px-3 rounded mr-2">LOCUL 3</span>
                        <h3 className="text-xl font-bold text-white">K9 TEAM</h3>
                      </div>
                      <img 
                        src="/image_1745053990322.png" 
                        alt="Echipa K9 TEAM" 
                        className="w-full h-64 object-cover rounded mb-4"
                        loading="lazy"
                        width="400" 
                        height="300"
                      />
                      <p className="text-gray-300">
                        Felicitări, K9 TEAM! Echipa a demonstrat ambiție, spirit de luptă și skill-uri impresionante în turneu! Printr-un parcurs plin de emoții și meciuri spectaculoase, au reușit să urce pe podium.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-6 font-rajdhani">Regulament</h2>
                
                <div className="prose prose-invert max-w-none">
                  <h3>Eligibilitate</h3>
                  <ul>
                    <li>Echipele au trebuit să aibă minim 5 jucători și maximum 7 (5 titulari + 2 rezerve)</li>
                    <li>Toți jucătorii au trebuit să dețină un cont FACEIT verificat</li>
                    <li>Cel puțin 3 jucători din echipă au trebuit să fie din Republica Moldova</li>
                  </ul>
                  
                  <h3>Reguli generale</h3>
                  <ul>
                    <li>Utilizarea oricărui tip de cheat/hack a fost strict interzisă și a rezultat în descalificarea imediată</li>
                    <li>Comportamentul toxic, rasist sau discriminatoriu nu a fost tolerat</li>
                    <li>Hărțile s-au ales prin sistemul de veto înainte de fiecare meci</li>
                    <li>Toate meciurile au fost monitorizate de administratori oficiali MPL</li>
                    <li>Orice dispută a fost rezolvată de administratorii turneului, iar decizia lor a fost finală</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <NeonBorder className="mb-8 rounded-lg p-6 bg-darkGray/50">
                <h3 className="text-xl font-bold text-white mb-4">Informații rapide</h3>
                
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start">
                    <Calendar className="mr-3 h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">10-23 Martie 2025</div>
                      <div className="text-sm">15:00 - 22:00 EEST</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="mr-3 h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Online (FACEIT)</div>
                      <div className="text-sm">Platforma oficială de competiție</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="mr-3 h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">64 echipe</div>
                      <div className="text-sm">Format 5v5</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Trophy className="mr-3 h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Premii oferite de HATOR</div>
                      <div className="text-sm">Echipament gaming pentru câștigători</div>
                    </div>
                  </div>
                </div>
              </NeonBorder>
              
              <NeonBorder className="mb-8 rounded-lg p-6 bg-darkGray/50">
                <h3 className="text-xl font-bold text-white mb-4">Sponsori</h3>
                
                <div className="flex flex-col space-y-6">
                  <div>
                    <div className="font-semibold text-white mb-2">Main Sponsor</div>
                    <a 
                      href="https://hator.gg" 
                      target="_blank" 
                      rel="nofollow noopener noreferrer"
                      className="text-white text-xl hover:text-primary transition-colors"
                    >
                      HATOR
                    </a>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-white mb-2">Partner</div>
                    <a 
                      href="https://darwin.md" 
                      target="_blank" 
                      rel="nofollow noopener noreferrer"
                      className="text-white text-xl hover:text-primary transition-colors"
                    >
                      DARWIN
                    </a>
                  </div>
                </div>
              </NeonBorder>
              
              <NeonBorder className="rounded-lg p-6 bg-darkGray/50">
                <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
                
                <p className="text-gray-300 mb-4">
                  Pentru orice întrebări legate de turneu, nu ezitați să ne contactați:
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

export default MPLPilotCup;