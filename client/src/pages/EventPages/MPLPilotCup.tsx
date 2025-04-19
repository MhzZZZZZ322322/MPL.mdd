import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import NeonBorder from "@/components/animations/NeonBorder";

const MPLPilotCup = () => {
  return (
    <>
      <Helmet>
        <title>MPL Pilot Cup | Moldova Pro League</title>
        <meta name="description" content="MPL Pilot Cup - Turneul inaugural dedicat jucătorilor din Moldova și România, 22-23 Martie 2025." />
      </Helmet>

      <div className="bg-black min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[60vh] bg-gradient-to-b from-black to-darkBg overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/attached_assets/image_1744965966423.png" 
              alt="MPL Pilot Cup" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black/50 z-0"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              <Link href="/#about">
                <Button variant="ghost" className="mb-4 text-gray-300 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Înapoi la evenimente
                </Button>
              </Link>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 font-rajdhani">
                MPL Pilot Cup
              </h1>
              
              <div className="flex items-center mb-6 text-gray-300">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <span className="mr-4">22-23 Martie 2025</span>
                
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span>Online (FACEIT)</span>
              </div>
              
              <p className="text-lg text-gray-100 max-w-2xl mb-8">
                Turneul inaugural organizat de Moldova Pro League, dedicat jucătorilor de Counter-Strike 2 din Moldova și România, sprijinit de Darwin și HATOR.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-primary hover:bg-primary/90">
                  Înregistrare echipă
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Regulament
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-6 font-rajdhani">Despre eveniment</h2>
              
              <div className="prose prose-invert max-w-none">
                <p>
                  <strong>MPL Pilot Cup</strong> este turneul pilot prin care Moldova Pro League inaugurează seria sa de competiții oficiale pentru Counter-Strike 2. Acest turneu este conceput special pentru jucătorii din Moldova și România, indiferent de nivelul lor de abilitate, oferind o platformă inclusivă unde echipele pot concura într-un mediu profesionist.
                </p>
                
                <p>
                  Turneul este organizat exclusiv online pe platforma FACEIT, eliminând astfel barierele geografice și facilitând participarea echipelor din ambele țări. MPL Pilot Cup nu este doar despre competiție, ci și despre construirea unei comunități unite în jurul pasiunii pentru Counter-Strike.
                </p>
                
                <h3>Format</h3>
                <ul>
                  <li><strong>Faza de grupe</strong>: 16 echipe împărțite în 4 grupe de câte 4 echipe, format round-robin (fiecare cu fiecare). Primele două echipe din fiecare grupă avansează în faza eliminatorie.</li>
                  <li><strong>Faza eliminatorie</strong>: 8 echipe într-un bracket simplu, meciuri eliminatorii (single elimination).</li>
                  <li><strong>Format meciuri</strong>: Bo1 (Best of 1) în grupe, Bo3 (Best of 3) în semifinale și finală.</li>
                </ul>
                
                <h3>Premii</h3>
                <p>
                  MPL Pilot Cup oferă premii speciale pentru echipele câștigătoare, furnizate de sponsorii noștri Darwin și HATOR:
                </p>
                <ul>
                  <li><strong>Locul 1</strong>: 5x Căști HATOR Hypergang</li>
                  <li><strong>Locul 2</strong>: 5x Mousepad HATOR Tonn</li>
                  <li><strong>Locul 3</strong>: 5x Tricouri personalizate MPL</li>
                  <li><strong>MVP al turneului</strong>: Mouse HATOR Quasar</li>
                </ul>
              </div>
              
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-white mb-6 font-rajdhani">Regulament</h2>
                
                <div className="prose prose-invert max-w-none">
                  <h3>Eligibilitate</h3>
                  <ul>
                    <li>Echipele trebuie să aibă minim 5 jucători și maximum 7 (5 titulari + 2 rezerve)</li>
                    <li>Toți jucătorii trebuie să dețină un cont FACEIT verificat</li>
                    <li>Cel puțin 3 jucători din echipă trebuie să fie din Republica Moldova sau România</li>
                  </ul>
                  
                  <h3>Reguli generale</h3>
                  <ul>
                    <li>Utilizarea oricărui tip de cheat/hack este strict interzisă și va rezulta în descalificarea imediată</li>
                    <li>Comportamentul toxic, rasist sau discriminatoriu nu va fi tolerat</li>
                    <li>Hărțile se vor alege prin sistemul de veto înainte de fiecare meci</li>
                    <li>Toate meciurile vor fi monitorizate de administratori oficiali MPL</li>
                    <li>Orice dispută va fi rezolvată de administratorii turneului, iar decizia lor este finală</li>
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
                      <div className="font-semibold text-white">22-23 Martie 2025</div>
                      <div className="text-sm">10:00 - 22:00 EEST</div>
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
                      <div className="font-semibold text-white">16 echipe</div>
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
                      rel="noopener noreferrer"
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <img src="/attached_assets/vert blackAsset 4.png" alt="HATOR" className="h-12" />
                    </a>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-white mb-2">Partner</div>
                    <a 
                      href="https://darwin.md" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <img src="/attached_assets/Yellow_vector.png" alt="Darwin" className="h-10" />
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
                      href="mailto:contact@moldovaproleague.com" 
                      className="text-white hover:text-primary transition-colors"
                    >
                      contact@moldovaproleague.com
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