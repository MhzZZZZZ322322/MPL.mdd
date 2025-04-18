import React from 'react';
import comingSoonImg from '@assets/image_1744965966423.png';
import { CalendarClock, Trophy, Users, MapPin, Clock, Gamepad2 } from 'lucide-react';

interface ComingSoonProps {
  enabled: boolean;
}

const ComingSoon = ({ enabled }: ComingSoonProps) => {
  // Dacă pagina "Coming Soon" nu este activată, sau dacă suntem pe pagina admin, nu afișăm nimic
  const isAdminPage = window.location.pathname.includes('/admin');
  if (!enabled || isAdminPage) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center overflow-auto bg-black">
      <div className="relative w-full min-h-screen">
        {/* Imaginea de fundal poziționată */}
        <div className="fixed inset-0 bg-gradient-to-b from-black via-black/80 to-black/40 z-10"></div>
        
        <img
          src={comingSoonImg}
          alt="Moldova Pro League - Coming Soon"
          className="fixed inset-0 w-full h-full object-cover opacity-20"
        />
        
        {/* Container principal */}
        <div className="relative z-20 container mx-auto px-4">
        
          {/* Hero section */}
          <section className="py-20 flex flex-col items-center justify-center min-h-screen">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center text-white">
                HATOR <span className="text-amber-500">CS LEAGUE</span> MOLDOVA
              </h1>
              <div className="text-6xl font-bold mb-6 text-center text-white">MPL</div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Primul turneu profesionist de Counter-Strike 2 din Moldova
              </p>
              
              {/* Call to action buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <a 
                  href="https://discord.gg/GUNbVdwm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="py-3 px-6 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white flex items-center gap-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                  </svg>
                  <span>Alătură-te pe Discord</span>
                </a>
              </div>
              
              {/* Tournament date countdown */}
              <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl inline-block mb-8">
                <div className="text-xl text-white mb-4 flex items-center justify-center gap-2">
                  <CalendarClock className="w-6 h-6 text-amber-500" />
                  <span>Turneul începe în curând</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">00</div>
                    <div className="text-xs text-gray-400">Zile</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">00</div>
                    <div className="text-xs text-gray-400">Ore</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">00</div>
                    <div className="text-xs text-gray-400">Minute</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">00</div>
                    <div className="text-xs text-gray-400">Secunde</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Tournament info */}
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Despre Turneu</h2>
              <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-all">
                <div className="text-amber-500 mb-4">
                  <Trophy className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Premii</h3>
                <p className="text-gray-300">
                  Fond de premiere atractiv pentru cele mai bune echipe de Counter-Strike 2 din Moldova.
                </p>
              </div>
              
              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-all">
                <div className="text-amber-500 mb-4">
                  <Users className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Participanți</h3>
                <p className="text-gray-300">
                  Echipe de top din Moldova se vor întrece pentru titlul de campion.
                </p>
              </div>
              
              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-all">
                <div className="text-amber-500 mb-4">
                  <MapPin className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Locație</h3>
                <p className="text-gray-300">
                  Turneul se va desfășura în Chișinău, cu finala transmisă live.
                </p>
              </div>
              
              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-all">
                <div className="text-amber-500 mb-4">
                  <Clock className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Program</h3>
                <p className="text-gray-300">
                  Calificări online urmate de etapele finale desfășurate în format LAN.
                </p>
              </div>
              
              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-all">
                <div className="text-amber-500 mb-4">
                  <Gamepad2 className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Format</h3>
                <p className="text-gray-300">
                  Format competitiv cu faze de grupe și eliminare directă.
                </p>
              </div>
              
              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-all">
                <div className="text-amber-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sponsori</h3>
                <p className="text-gray-300">
                  Turneu susținut de HATOR și alți sponsori importanți din industrie.
                </p>
              </div>
            </div>
          </section>
          
          {/* Call to action */}
          <section className="py-16 mb-16">
            <div className="bg-gradient-to-r from-amber-500/20 to-amber-700/20 backdrop-blur-sm p-8 rounded-2xl max-w-4xl mx-auto border border-amber-500/30">
              <h2 className="text-3xl font-bold text-white mb-4 text-center">Pregătit să te alături competiției?</h2>
              <p className="text-xl text-gray-200 mb-8 text-center">
                Urmărește-ne pe Discord pentru ultimele noutăți și data oficială de începere a turneului.
              </p>
              <div className="flex justify-center">
                <a 
                  href="https://discord.gg/GUNbVdwm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="py-4 px-8 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white flex items-center gap-2 transition-colors text-lg font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                  </svg>
                  <span>Alătură-te pe Discord</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;