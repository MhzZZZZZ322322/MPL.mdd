import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, Users, Clock, ExternalLink, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              🔥 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">HATOR CUP</span> 🔥
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              ROPL x MPL
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Pentru prima dată ROPL și MPL își unesc forțele într-un super turneu de CS2, powered by HATOR și SkinBaron 🖤
            </p>
            
            {/* Main Event Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <img 
                src={hatorCupImage} 
                alt="HATOR CUP - ROPL x MPL" 
                className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl border-2 border-blue-500/30"
              />
            </motion.div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-12"
          >
            {[
              { label: 'Zile', value: timeLeft.days },
              { label: 'Ore', value: timeLeft.hours },
              { label: 'Minute', value: timeLeft.minutes },
              { label: 'Secunde', value: timeLeft.seconds }
            ].map((item, index) => (
              <Card key={index} className="bg-black/40 border-blue-500/30 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl md:text-3xl font-bold text-blue-400">{item.value}</div>
                  <div className="text-sm text-gray-300">{item.label}</div>
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
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={() => window.open('https://www.ropl.ro/hatorcup', '_blank')}
            >
              <ExternalLink className="mr-2" />
              ÎNSCRIE ECHIPA ACUM!
            </Button>
            <p className="text-sm text-gray-400 mt-2">
              ‼️ Participarea e gratuită, dar locurile sunt limitate
            </p>
          </motion.div>
        </div>
      </section>

      {/* Event Details */}
      <section className="px-4 py-16 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-400">
                  <Calendar className="mr-2" />
                  Dată
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">23-24 August</p>
                <p className="text-gray-300">2025</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-400">
                  <Trophy className="mr-2" />
                  Prize Pool
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">5500 RON</p>
                <p className="text-gray-300">Premii în bani</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <Users className="mr-2" />
                  Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">5vs5</p>
                <p className="text-gray-300">Single Elimination</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-400">
                  <Flag className="mr-2" />
                  Eligibilitate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-white">România 🇷🇴</p>
                <p className="text-lg font-bold text-white">Moldova 🇲🇩</p>
              </CardContent>
            </Card>
          </div>

          {/* Tournament Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">Despre Turneu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  HATOR CUP reprezintă primul eveniment oficial de colaborare între ROPL (Romania Pro League) 
                  și MPL (Moldova Pro League), aducând împreună cele mai bune echipe din ambele țări.
                </p>
                <p className="text-gray-300">
                  Turneul este powered by HATOR și SkinBaron, oferind o experiență competitivă de 
                  înaltă calitate pentru toate echipele participante.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">CS2</Badge>
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">5vs5</Badge>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-400">Single Elimination</Badge>
                  <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">International</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Cum să participi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <p className="text-gray-300">Accesează link-ul de înscriere: ropl.ro/hatorcup</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <p className="text-gray-300">Completează datele echipei (5 jucători titulari + rezerve)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <p className="text-gray-300">Verifică eligibilitatea (doar jucători din RO/MD)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                    <p className="text-gray-300">Confirmă participarea și pregătește-te pentru luptă!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Nu rata ocazia să reprezinți regiunea ta!
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              ⚠️ Fii parte din primul eveniment ROPL x MPL.<br />
              Let's show them ce înseamnă true skill from the East! 🇷🇴🇲🇩
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={() => window.open('https://www.ropl.ro/hatorcup', '_blank')}
            >
              <ExternalLink className="mr-2" />
              ÎNSCRIE-TE ACUM!
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Partners */}
      <section className="px-4 py-16 bg-black/40">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">Powered by</h3>
          <div className="flex justify-center items-center gap-8 md:gap-12">
            <div className="text-white font-bold text-xl md:text-2xl">HATOR</div>
            <div className="text-white font-bold text-xl md:text-2xl">SkinBaron</div>
            <div className="text-blue-400 font-bold text-xl md:text-2xl">ROPL</div>
            <div className="text-purple-400 font-bold text-xl md:text-2xl">MPL</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HatorCupROPLxMPL;