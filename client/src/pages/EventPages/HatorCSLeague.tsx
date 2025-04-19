import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, MapPin, Trophy, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import NeonBorder from "@/components/animations/NeonBorder";
import CountdownTimer from "@/components/ui/countdown-timer";

const HatorCSLeague = () => {
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
              fetchPriority="high"
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
                  <ArrowLeft className="mr-2 h-4 w-4" /> Înapoi la evenimente
                </Button>
              </Link>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 font-rajdhani">
                HATOR CS2 LEAGUE MOLDOVA
              </h1>
              
              <div className="flex items-center mb-6 text-gray-300">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <span className="mr-4">Aprilie-Iunie 2025</span>
                
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span>Online (FACEIT)</span>
              </div>
              
              <p className="text-lg text-gray-100 max-w-2xl mb-8">
                Cel mai tare turneu online de Counter-Strike 2 din Moldova și România, organizat de comunitatea MPL în parteneriat cu HATOR.
              </p>
              
              {/* Countdown timer */}
              <div className="mb-8">
                <CountdownTimer targetDate="2025-05-15T18:00:00" className="max-w-3xl" />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <a href="https://discord.gg/KgXXUebhVM" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary/90">
                    Înregistrare echipă
                  </Button>
                </a>
                <a href="#rules" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    Regulament
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Premii Section */}
        <div className="py-12 bg-gradient-to-b from-darkBg to-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 font-rajdhani text-center">Premii Impresionante</h2>
            
            <div className="flex flex-col gap-10 max-w-2xl mx-auto">
              <a 
                href="https://darwin.md/scaun-gaming-hator-arc-2-xl-black-htc2000.html" 
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="group block"
              >
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-6 rounded-lg border border-amber-500/30 transform group-hover:-translate-y-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/20">
                  <div className="flex items-center mb-6">
                    <Award className="text-amber-500 h-10 w-10 mr-3" />
                    <h3 className="text-amber-500 text-2xl font-bold">Locul 1</h3>
                  </div>
                  <div className="relative h-80 overflow-hidden rounded mb-6">
                    <img 
                      src="/image_1745061600248.png" 
                      alt="5x Scaune gaming HATOR Arc 2 XL" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="600"
                      height="450"
                    />
                  </div>
                  <p className="text-white text-center text-xl">5x Scaune gaming HATOR Arc 2 XL</p>
                </div>
              </a>
              
              <a 
                href="https://darwin.md/mouse-hator-quasar-3-ultra-8k-wireless-htm771-fara-fir-white.html" 
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="group block"
              >
                <div className="bg-gradient-to-br from-slate-400/20 to-slate-500/20 p-6 rounded-lg border border-slate-400/30 transform group-hover:-translate-y-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-slate-400/20">
                  <div className="flex items-center mb-6">
                    <Award className="text-slate-400 h-10 w-10 mr-3" />
                    <h3 className="text-slate-400 text-2xl font-bold">Locul 2</h3>
                  </div>
                  <div className="relative h-80 overflow-hidden rounded mb-6">
                    <img 
                      src="/image_1745059215270.png" 
                      alt="5x Mouse HATOR Quasar 3 ULTRA 8K" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="600"
                      height="450"
                    />
                  </div>
                  <p className="text-white text-center text-xl">5x Mouse HATOR Quasar 3 ULTRA 8K</p>
                </div>
              </a>
              
              <a 
                href="https://darwin.md/casti-hator-hypergang-2-usb-71-cu-fir-matte-titanium.html" 
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="group block"
              >
                <div className="bg-gradient-to-br from-amber-700/20 to-amber-800/20 p-6 rounded-lg border border-amber-700/30 transform group-hover:-translate-y-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-700/20">
                  <div className="flex items-center mb-6">
                    <Award className="text-amber-700 h-10 w-10 mr-3" />
                    <h3 className="text-amber-700 text-2xl font-bold">Locul 3</h3>
                  </div>
                  <div className="relative h-80 overflow-hidden rounded mb-6">
                    <img 
                      src="/image_1745060726522.png" 
                      alt="5x Căști HATOR Hypergang 2 USB 7.1" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="600"
                      height="450"
                    />
                  </div>
                  <p className="text-white text-center text-xl">5x Căști HATOR Hypergang 2 USB 7.1</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-6 font-rajdhani">Despre turneu</h2>
              
              <div className="prose prose-invert max-w-none">
                <p>
                  <strong>HATOR CS2 LEAGUE MOLDOVA</strong> este primul turneu major de Counter-Strike 2 organizat de Moldova Pro League în parteneriat cu HATOR - unul dintre cei mai importanți producători de periferice de gaming din regiune.
                </p>
                
                <p>
                  Acest turneu reprezintă un pas important în dezvoltarea scenei de esports din Moldova, oferind jucătorilor locali șansa de a concura la un nivel înalt, cu premii substanțiale și vizibilitate internațională.
                </p>
                
                <h3>Format Oficial Turneu</h3>
                
                <h4 className="mt-4 mb-2 text-primary font-semibold">Etapa 1: Grupe (Swiss Format)</h4>
                <ul className="mb-4">
                  <li><strong>Capacitate maximă</strong>: 128 echipe din Moldova și România</li>
                  <li><strong>Structură</strong>: 16 grupe a câte 8 echipe</li>
                  <li><strong>Sistem</strong>: Swiss Style Bo1 - echipele joacă meciuri până acumulează:
                    <ul className="ml-6 mt-2 mb-2 list-disc">
                      <li>2 victorii - se califică automat în play-off</li>
                      <li>2 înfrângeri - sunt eliminate</li>
                    </ul>
                  </li>
                  <li><strong>Calificare</strong>: Primele 3 echipe din fiecare grupă (cele cu rezultate 2-0, 2-1 sau 1-2) avansează în faza Play-off</li>
                  <li><strong>Bonus seeding</strong>: Echipele clasate pe locul 1 din cele 16 grupe avansează direct în Top 24, fără a juca primul meci din Play-off</li>
                </ul>
                
                <h4 className="mt-4 mb-2 text-primary font-semibold">Etapa 2: Play-off (Eliminatoriu)</h4>
                <ul className="mb-4">
                  <li><strong>Echipe calificate</strong>: 48 din faza grupelor</li>
                  <li><strong>Structură</strong>:
                    <ul className="ml-6 mt-2 mb-2 list-disc">
                      <li>Runda 1 (Top 48 → Top 32): participă locurile 2 și 3 din grupe (32 echipe) - meciuri Bo1</li>
                      <li>Runda 2 (Top 32 → Top 24): echipele câștigătoare din R1 + echipele clasate pe locul 1 în grupe - meciuri Bo1</li>
                      <li>De la Top 12 încolo (optimi, sferturi, semifinale și finală) - meciuri Bo3</li>
                    </ul>
                  </li>
                </ul>
                
                <h4 className="mt-4 mb-2 text-primary font-semibold">Format Meciuri</h4>
                <ul className="mb-4">
                  <li><strong>Bo1</strong>: Un singur meci decide câștigătorul (grupe și primele 2 runde din Play-off)</li>
                  <li><strong>Bo3</strong>: Cele mai bune din 3 hărți (din optimi până în finală)</li>
                </ul>
                
                <h4 className="mt-4 mb-2 text-primary font-semibold">Alegere Hărți - Bo3</h4>
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
                
                <h3>Eligibilitate</h3>
                <ul>
                  <li>Echipele trebuie să aibă minimum 5 jucători și maximum 7 (5 titulari + 2 rezerve)</li>
                  <li>Toți jucătorii trebuie să dețină un cont FACEIT verificat</li>
                  <li>Cel puțin 4 jucători din echipă trebuie să fie din Moldova, din Romania maxim 1 jucator</li>
                </ul>
                
                <h3>Înscriere</h3>
                <p>
                  Înscrierea echipelor se va face exclusiv pe platforma FACEIT și Discord MPL, conform următorului calendar:
                </p>
                <ul>
                  <li><strong>Start înscrieri</strong>: 21 Aprilie 2025</li>
                  <li><strong>Închidere înscrieri</strong>: 25 Mai 2025</li>
                  <li><strong>Validare echipe</strong>: 26 Mai - 1 Iunie 2025</li>
                  <li><strong>Start turneu</strong>: 2 Iunie 2025</li>
                </ul>
              </div>
              
              <div className="mt-12">
                <h2 id="rules" className="text-3xl font-bold text-white mb-6 font-rajdhani">Reguli importante</h2>
                
                <div className="prose prose-invert max-w-none">
                  <h3>Anti-cheat și Fair Play</h3>
                  <ul>
                    <li>Toți jucătorii sunt obligați să folosească FACEIT Anti-Cheat pe durata turneului</li>
                    <li>Utilizarea oricărui tip de cheat/hack, exploit, sau script neautorizat va duce la descalificarea imediată a echipei</li>
                    <li>Este obligatorie înregistrarea video (POV) a jocului pentru toți jucătorii</li>
                    <li>Administratorii MPL își rezervă dreptul de a verifica orice înregistrare suspectă</li>
                  </ul>
                  
                  <h3>Conduită</h3>
                  <ul>
                    <li>Jucătorii trebuie să manifeste respect față de adversari, spectatori și administratori</li>
                    <li>Comportamentul toxic, limbajul abuziv, rasist sau discriminatoriu nu sunt tolerate</li>
                    <li>Nerespectarea regulilor de conduită poate duce la avertismente, penalizări sau descalificare</li>
                  </ul>
                  
                  <h3>Technical Pause</h3>
                  <ul>
                    <li>Fiecare echipă are dreptul la maximum 2 pauze tehnice de maximum 5 minute pe meci</li>
                    <li>Abuzul de pauze tehnice va fi penalizat cu avertismente și potențial pierderea dreptului la pauze viitoare</li>
                  </ul>
                  
                  <h3>Reguli obligatorii pentru participanți</h3>
                  <p className="text-red-400 font-semibold">Nerespectarea acestor reguli duce la descalificare (pierdere tehnică):</p>
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
                <h3 className="text-xl font-bold text-white mb-4">Informații rapide</h3>
                
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start">
                    <Calendar className="mr-3 h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Aprilie-Iunie 2025</div>
                      <div className="text-sm">Weekenduri: 10:00 - 22:00 EEST</div>
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
                      <div className="font-semibold text-white">Până la 128 echipe</div>
                      <div className="text-sm">Format 5v5</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Trophy className="mr-3 h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Premii substanțiale</div>
                      <div className="text-sm">Echipament HATOR premium</div>
                    </div>
                  </div>
                </div>
              </NeonBorder>
              
              <NeonBorder className="mb-8 rounded-lg p-6 bg-darkGray/50">
                <h3 className="text-xl font-bold text-white mb-4">Organizat de</h3>
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
                    <div className="font-semibold text-white mb-2">Title Sponsor</div>
                    <a 
                      href="https://hator.gg" 
                      target="_blank" 
                      rel="nofollow noopener noreferrer"
                      className="text-white text-xl font-medium hover:text-primary transition-colors"
                    >
                      HATOR
                    </a>
                  </div>
                </div>
              </NeonBorder>
              
              <NeonBorder className="mb-8 rounded-lg p-6 bg-darkGray/50">
                <h3 className="text-xl font-bold text-white mb-4">Stream & Media</h3>
                
                <p className="text-gray-300 mb-4">
                  Toate meciurile din faza eliminatorie vor fi transmise live pe canalele oficiale:
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

export default HatorCSLeague;