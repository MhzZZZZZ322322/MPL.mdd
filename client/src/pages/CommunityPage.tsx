import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, MessageSquare, CupSoda, Calendar, Award } from 'lucide-react';
import { SiDiscord as Discord } from 'react-icons/si';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NeonBorder from '@/components/animations/NeonBorder';

const CommunityPage = () => {
  return (
    <>
      <Helmet>
        <title>Comunitate | Moldova Pro League</title>
      </Helmet>
      
      <Navbar />
      
      <main className="pt-32 pb-16 min-h-screen bg-black">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-rajdhani text-white mb-2">
                Comunitatea <span className="text-secondary">MPL</span>
              </h1>
              <p className="text-gray-400 max-w-2xl">
                Descoperă o comunitate pasionată de gaming competitiv din Moldova, unită prin fair-play, respect și pasiune pentru esports.
              </p>
            </div>
            <Link href="/">
              <Button 
                variant="outline" 
                className="mt-4 md:mt-0 flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
              >
                <ArrowLeft size={16} />
                Înapoi la pagina principală
              </Button>
            </Link>
          </div>
          
          {/* Hero section */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 rounded-xl mb-12 border border-primary/30">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Alătură-te unei comunități de gameri pasionați</h2>
                <p className="mb-6 text-gray-300">
                  Moldova Pro League reprezintă mult mai mult decât turnee și competiții. Suntem o comunitate unită, construită din pasiune pentru gaming și dorința de a crea o scenă vibrantă de esports în Moldova.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="https://discord.gg/Ek4qvWE5qB" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 flex gap-2 items-center">
                      <Discord size={18} />
                      Alătură-te pe Discord
                    </Button>
                  </a>
                  <Link href="#communityBenefits">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      Beneficii comunitate
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <NeonBorder className="rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1561150169-371f366288e6?auto=format&fit=crop&q=80&w=1600"
                    alt="MPL Community" 
                    className="rounded-lg shadow-xl w-full max-w-md"
                  />
                </NeonBorder>
              </div>
            </div>
          </div>
          
          {/* Community benefits */}
          <div id="communityBenefits" className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center text-white">Beneficiile comunității <span className="text-secondary">MPL</span></h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-darkGray/50 border border-primary/20 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <CupSoda className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Turnee exclusive</h3>
                <p className="text-gray-400">Participă la turnee exclusive organizate doar pentru membrii comunității noastre, cu premii și experiențe unice.</p>
              </div>
              
              <div className="bg-darkGray/50 border border-primary/20 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-secondary" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Networking</h3>
                <p className="text-gray-400">Conectează-te cu alți jucători pasionați, formează echipe și dezvoltă prietenii bazate pe pasiunea comună pentru gaming.</p>
              </div>
              
              <div className="bg-darkGray/50 border border-primary/20 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="text-cyan-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Suport & Coaching</h3>
                <p className="text-gray-400">Primește sfaturi și trucuri de la jucători experimentați și îmbunătățește-ți abilitățile prin sesiuni de coaching.</p>
              </div>
              
              <div className="bg-darkGray/50 border border-primary/20 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="text-green-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Evenimente speciale</h3>
                <p className="text-gray-400">Participă la vizionări comune ale competițiilor internaționale, seri de gaming și alte evenimente exclusive.</p>
              </div>
              
              <div className="bg-darkGray/50 border border-primary/20 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                  <Award className="text-yellow-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Recunoaștere</h3>
                <p className="text-gray-400">Cele mai bune performanțe sunt recunoscute și evidențiate în cadrul comunității, cu oportunități de a deveni jucător emblematic MPL.</p>
              </div>
              
              <div className="bg-darkGray/50 border border-primary/20 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <Discord className="text-red-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Canale exclusive</h3>
                <p className="text-gray-400">Acces la canale Discord exclusive pentru discuții strategice, noutăți în premieră și interacțiune directă cu organizatorii.</p>
              </div>
            </div>
          </div>
          
          {/* Community rules */}
          <div className="bg-darkGray/30 p-8 rounded-lg border border-primary/20 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Reguli ale comunității</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Respect reciproc</h3>
                  <p className="text-gray-400">Tratează toate persoanele cu respect, indiferent de nivelul lor de joc sau experiență.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Fair-play</h3>
                  <p className="text-gray-400">Joacă corect și respectă regulile competițiilor. Orice formă de trișare va duce la excluderea din comunitate.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Comunicare adecvată</h3>
                  <p className="text-gray-400">Evită limbajul ofensator, discursul instigator la ură sau comportamentul toxic.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Participare activă</h3>
                  <p className="text-gray-400">Participă activ la evenimentele comunității și contribuie la discuții constructive.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">5</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Ajutor reciproc</h3>
                  <p className="text-gray-400">Ajută alți membri ai comunității să se dezvolte și să își îmbunătățească abilitățile.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center p-8 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary/30">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Pregătit să te alături comunității?</h2>
            <p className="mb-6 max-w-2xl mx-auto text-gray-300">
              Devino parte din cea mai mare comunitate de gaming competitiv din Moldova. Creștem împreună, învățăm împreună și creăm istoria esports-ului moldovenesc.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://discord.gg/Ek4qvWE5qB" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 flex gap-2 items-center">
                  <Discord size={18} />
                  Alătură-te acum
                </Button>
              </a>
              <Link href="/#contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Contactează-ne
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CommunityPage;