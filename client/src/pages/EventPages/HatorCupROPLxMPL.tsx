import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Users, ExternalLink, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';
import hatorCupImage from '@assets/image_1754473367257.png';

const HatorCupROPLxMPL = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2025-08-23T10:00:00');
    
    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>HATOR CUP - ROPL x MPL | Moldova Pro League</title>
        <meta name="description" content="HATOR CUP - Primul turneu de colaborare între ROPL și MPL. 23-24 August 2025, 5500 RON prize pool, Single Elimination CS2." />
      </Helmet>
      <div className="min-h-screen bg-darkBg text-white">
        {/* Hero Section */}
        <section className="relative px-4 py-16 sm:py-24 bg-gradient-to-br from-darkBg via-darkGray to-darkBg">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
              data-aos="fade-up"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-rajdhani">
                <span className="text-primary">HATOR CUP</span>
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-secondary mb-4 font-rajdhani">
                ROPL x MPL
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto font-inter">
                Pentru prima dată ROPL și MPL își unesc forțele într-un super turneu de CS2, powered by HATOR și SkinBaron. 
                Un eveniment istoric care va aduce împreună cele mai bune echipe din România și Moldova într-o competiție de nivel înalt.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button 
                  variant="outline" 
                  className="border-primary/50 text-primary hover:bg-primary/10 font-rajdhani"
                  onClick={() => window.open('https://www.ropl.ro/', '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Vizitează ROPL
                </Button>
                <Button 
                  variant="outline" 
                  className="border-secondary/50 text-secondary hover:bg-secondary/10 font-rajdhani"
                  onClick={() => window.open('https://moldovapro.com/', '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Vizitează MPL
                </Button>
              </div>
            
              {/* Main Event Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-12"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <img 
                  src={hatorCupImage} 
                  alt="HATOR CUP - ROPL x MPL" 
                  className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl border-2 border-primary/30 hover:border-primary/50 transition-all duration-300"
                />
              </motion.div>
          </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-12"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              {[
                { label: 'Zile', value: timeLeft.days },
                { label: 'Ore', value: timeLeft.hours },
                { label: 'Minute', value: timeLeft.minutes },
                { label: 'Secunde', value: timeLeft.seconds }
              ].map((item, index) => (
                <Card key={index} className="bg-darkGray/60 border-primary/30 text-center hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="text-2xl md:text-3xl font-bold text-primary font-rajdhani">{item.value}</div>
                    <div className="text-sm text-gray-300 font-inter">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Registration Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mb-16"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-black px-8 py-4 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 font-rajdhani"
                onClick={() => window.open('https://www.ropl.ro/hatorcup', '_blank')}
              >
                <ExternalLink className="mr-2" />
                ÎNSCRIE ECHIPA ACUM!
              </Button>
              <p className="text-sm text-gray-400 mt-2 font-inter">
                Participarea e gratuită, dar locurile sunt limitate
              </p>
            </motion.div>
          </div>
        </section>

        {/* Event Details */}
        <section className="px-4 py-16 bg-darkGray/20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card className="bg-darkGray/60 border-primary/30 hover:border-primary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary font-rajdhani">
                    <Calendar className="mr-2" />
                    Dată
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white font-rajdhani">23-24 August</p>
                  <p className="text-gray-300 font-inter">2025</p>
                </CardContent>
              </Card>

              <Card className="bg-darkGray/60 border-secondary/30 hover:border-secondary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
                <CardHeader>
                  <CardTitle className="flex items-center text-secondary font-rajdhani">
                    <Trophy className="mr-2" />
                    Prize Pool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white font-rajdhani">5500 RON</p>
                  <p className="text-gray-300 font-inter">Premii în bani</p>
                </CardContent>
              </Card>

              <Card className="bg-darkGray/60 border-primary/30 hover:border-primary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary font-rajdhani">
                    <Users className="mr-2" />
                    Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white font-rajdhani">5vs5</p>
                  <p className="text-gray-300 font-inter">Single Elimination</p>
                </CardContent>
              </Card>

              <Card className="bg-darkGray/60 border-secondary/30 hover:border-secondary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="400">
                <CardHeader>
                  <CardTitle className="flex items-center text-secondary font-rajdhani">
                    <Flag className="mr-2" />
                    Eligibilitate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-white font-rajdhani">România 🇷🇴</p>
                  <p className="text-lg font-bold text-white font-rajdhani">Moldova 🇲🇩</p>
                </CardContent>
              </Card>
            </div>

            {/* Tournament Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-darkGray/60 border-primary/30 hover:border-primary/50 transition-all duration-300" data-aos="fade-right">
                <CardHeader>
                  <CardTitle className="text-primary font-rajdhani">Despre Turneu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 font-inter">
                    HATOR CUP reprezintă primul eveniment oficial de colaborare între ROPL (Romania Pro League) 
                    și MPL (Moldova Pro League), aducând împreună cele mai bune echipe din ambele țări într-o competiție unică.
                  </p>
                  <p className="text-gray-300 font-inter">
                    Turneul este powered by HATOR și SkinBaron, oferind nu doar premii în bani substanțiale, ci și 
                    o platformă pentru jucătorii din regiune să-și demonstreze abilitățile la cel mai înalt nivel.
                  </p>
                  <p className="text-gray-300 font-inter">
                    Evenimentul va fi transmis live cu comentatori profesioniști, oferind spectatorilor o experiență 
                    completă de esports. Echipele câștigătoare vor primi recunoaștere internațională și oportunități 
                    de dezvoltare în scena competitivă.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-primary/20 text-primary font-rajdhani">CS2</Badge>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary font-rajdhani">5vs5</Badge>
                    <Badge variant="secondary" className="bg-primary/20 text-primary font-rajdhani">Single Elimination</Badge>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary font-rajdhani">International</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-darkGray/60 border-secondary/30 hover:border-secondary/50 transition-all duration-300" data-aos="fade-left">
                <CardHeader>
                  <CardTitle className="text-secondary font-rajdhani">Cum să participi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black text-sm font-bold font-rajdhani">1</div>
                      <p className="text-gray-300 font-inter">Accesează link-ul de înscriere: ropl.ro/hatorcup</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-black text-sm font-bold font-rajdhani">2</div>
                      <p className="text-gray-300 font-inter">Completează datele echipei (5 jucători titulari + rezerve)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black text-sm font-bold font-rajdhani">3</div>
                      <p className="text-gray-300 font-inter">Verifică eligibilitatea (doar jucători din RO/MD)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-black text-sm font-bold font-rajdhani">4</div>
                      <p className="text-gray-300 font-inter">Confirmă participarea și pregătește-te pentru luptă!</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-secondary/20">
                    <h4 className="text-secondary font-rajdhani font-bold mb-3">Linkuri utile:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-primary" />
                        <a 
                          href="https://www.ropl.ro/hatorcup" 
                          target="_blank" 
                          className="text-primary hover:text-primary/80 font-inter underline"
                        >
                          Formularul oficial de înscriere
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-secondary" />
                        <a 
                          href="https://discord.gg/ropl" 
                          target="_blank" 
                          className="text-secondary hover:text-secondary/80 font-inter underline"
                        >
                          Discord ROPL pentru suport
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-primary" />
                        <a 
                          href="https://moldovapro.com/discord" 
                          target="_blank" 
                          className="text-primary hover:text-primary/80 font-inter underline"
                        >
                          Discord MPL pentru întrebări
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tournament Rules & Prizes */}
        <section className="px-4 py-16 bg-darkBg">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center font-rajdhani" data-aos="fade-up">
              Reguli & Premii
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Tournament Rules */}
              <Card className="bg-darkGray/60 border-primary/30 hover:border-primary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
                <CardHeader>
                  <CardTitle className="text-primary font-rajdhani flex items-center">
                    <Trophy className="mr-2" />
                    Reguli Turneu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-300 space-y-2 font-inter">
                    <p>• Format: Single Elimination (BO1 preliminarii, BO3 finale)</p>
                    <p>• Mappool: Active Duty CS2</p>
                    <p>• Anticheat: FACEIT Anti-Cheat obligatoriu</p>
                    <p>• Substitute: Maximum 2 jucători de rezervă</p>
                    <p>• Overtime: MR3 (max 6 runde OT)</p>
                    <p>• Disconnect: Jucătorul are 5 minute pentru reconectare</p>
                  </div>
                </CardContent>
              </Card>

              {/* Prize Distribution */}
              <Card className="bg-darkGray/60 border-secondary/30 hover:border-secondary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
                <CardHeader>
                  <CardTitle className="text-secondary font-rajdhani flex items-center">
                    <Trophy className="mr-2" />
                    Distribuția Premiilor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                      <span className="text-primary font-rajdhani font-bold">🥇 Locul 1</span>
                      <span className="text-white font-bold font-rajdhani">2500 RON</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                      <span className="text-secondary font-rajdhani font-bold">🥈 Locul 2</span>
                      <span className="text-white font-bold font-rajdhani">1500 RON</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                      <span className="text-primary font-rajdhani font-bold">🥉 Locul 3</span>
                      <span className="text-white font-bold font-rajdhani">1000 RON</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary font-rajdhani font-bold">🏆 Locul 4</span>
                      <span className="text-white font-bold font-rajdhani">500 RON</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card className="bg-darkGray/60 border-primary/30 hover:border-primary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
                <CardHeader>
                  <CardTitle className="text-primary font-rajdhani flex items-center">
                    <Calendar className="mr-2" />
                    Program Preliminar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="border-b border-gray-600 pb-2">
                      <p className="text-secondary font-rajdhani font-bold">Vineri, 23 August</p>
                      <p className="text-sm text-gray-300 font-inter">18:00 - Deschiderea oficială</p>
                      <p className="text-sm text-gray-300 font-inter">19:00 - Meciuri preliminarii</p>
                    </div>
                    <div className="border-b border-gray-600 pb-2">
                      <p className="text-secondary font-rajdhani font-bold">Sâmbătă, 24 August</p>
                      <p className="text-sm text-gray-300 font-inter">16:00 - Semifinale</p>
                      <p className="text-sm text-gray-300 font-inter">20:00 - Finala mare</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-inter italic">
                        *Programul poate fi ajustat în funcție de numărul de echipe înscrise
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-4 py-16 bg-gradient-to-r from-primary/20 to-secondary/20">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              data-aos="fade-up"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-rajdhani">
                Nu rata ocazia să reprezinți regiunea ta!
              </h3>
              <p className="text-xl text-gray-300 mb-8 font-inter">
                Fii parte din primul eveniment ROPL x MPL.<br />
                Let's show them ce înseamnă true skill from the East! 🇷🇴🇲🇩
              </p>
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-black px-8 py-4 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 font-rajdhani"
                onClick={() => window.open('https://www.ropl.ro/hatorcup', '_blank')}
              >
                <ExternalLink className="mr-2" />
                ÎNSCRIE-TE ACUM!
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Partners */}
        <section className="px-4 py-16 bg-darkGray/40 border-t border-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 font-rajdhani" data-aos="fade-up">Powered by</h3>
            <div className="flex justify-center items-center gap-8 md:gap-12" data-aos="fade-up" data-aos-delay="200">
              <a 
                href="https://hator.gg" 
                target="_blank" 
                className="text-white font-bold text-xl md:text-2xl font-rajdhani hover:text-primary transition-colors duration-300"
              >
                HATOR
              </a>
              <a 
                href="https://skinbaron.de" 
                target="_blank" 
                className="text-white font-bold text-xl md:text-2xl font-rajdhani hover:text-secondary transition-colors duration-300"
              >
                SkinBaron
              </a>
              <a 
                href="https://www.ropl.ro" 
                target="_blank" 
                className="text-primary font-bold text-xl md:text-2xl font-rajdhani hover:text-primary/80 transition-colors duration-300"
              >
                ROPL
              </a>
              <a 
                href="https://moldovapro.com" 
                target="_blank" 
                className="text-secondary font-bold text-xl md:text-2xl font-rajdhani hover:text-secondary/80 transition-colors duration-300"
              >
                MPL
              </a>
            </div>
            <p className="text-gray-400 text-center mt-6 font-inter" data-aos="fade-up" data-aos-delay="400">
              Un eveniment realizat în parteneriat cu cele mai importante organizații de esports din România și Moldova
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default HatorCupROPLxMPL;