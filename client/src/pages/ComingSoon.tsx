import React from 'react';
import comingSoonImg from '@assets/image_1744965966423.png';

interface ComingSoonProps {
  enabled: boolean;
}

const ComingSoon = ({ enabled }: ComingSoonProps) => {
  // Dacă pagina "Coming Soon" nu este activată, sau dacă suntem pe pagina admin, nu afișăm nimic
  const isAdminPage = window.location.pathname.includes('/admin');
  if (!enabled || isAdminPage) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="relative w-full h-full">
        {/* Imaginea de fundal poziționată mai jos, pentru a nu se intersecta cu textul */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/40 z-10"></div>
        
        <img
          src={comingSoonImg}
          alt="Moldova Pro League - Coming Soon"
          className="w-full h-full object-cover opacity-30"
        />
        
        {/* Container pentru conținut cu fundal semi-transparent */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 z-20">
          <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl max-w-2xl w-full">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center">COMING SOON</h1>
            <h2 className="text-2xl md:text-4xl font-bold text-amber-400 mb-8 text-center">HATOR CS LEAGUE MOLDOVA</h2>
            
            {/* Logo MPL */}
            <div className="text-6xl font-bold mb-6 text-center">MPL</div>
            
            <p className="mb-8 text-lg text-center max-w-md mx-auto opacity-90">
              Website-ul nostru este în construcție dar va fi disponibil în curând.
            </p>
            
            {/* Buton Discord cu link pentru invitație */}
            <div className="flex justify-center mb-6">
              <a href="https://discord.gg/GUNbVdwm" target="_blank" rel="noopener noreferrer" 
                className="py-3 px-6 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white flex items-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                </svg>
                <span>Alătură-te pe Discord</span>
              </a>
            </div>
          </div>
          
          {/* Am eliminat butonul de Admin Login vizibil */}
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;