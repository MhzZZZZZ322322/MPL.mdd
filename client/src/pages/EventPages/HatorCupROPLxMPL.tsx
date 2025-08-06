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
                🔥 <span className="text-primary">HATOR CUP</span> 🔥
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-secondary mb-4 font-rajdhani">
                ROPL x MPL
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto font-inter">
                Pentru prima dată ROPL și MPL își unesc forțele într-un super turneu de CS2, powered by HATOR și SkinBaron
              </p>
            
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
                    și MPL (Moldova Pro League), aducând împreună cele mai bune echipe din ambele țări.
                  </p>
                  <p className="text-gray-300 font-inter">
                    Turneul este powered by HATOR și SkinBaron, oferind o experiență competitivă de 
                    înaltă calitate pentru toate echipele participante.
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
              <div className="text-white font-bold text-xl md:text-2xl font-rajdhani hover:text-primary transition-colors duration-300">HATOR</div>
              <div className="text-white font-bold text-xl md:text-2xl font-rajdhani hover:text-secondary transition-colors duration-300">SkinBaron</div>
              <div className="text-primary font-bold text-xl md:text-2xl font-rajdhani">ROPL</div>
              <div className="text-secondary font-bold text-xl md:text-2xl font-rajdhani">MPL</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HatorCupROPLxMPL;