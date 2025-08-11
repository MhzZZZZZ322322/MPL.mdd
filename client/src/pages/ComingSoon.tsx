import React, { useEffect, useState } from 'react';
import comingSoonBg from '@assets/image_1745037639280.png';
import darwinLogo from '@assets/ whiteAsset 7.png';
import hatorLogo from '@assets/Yellow_vector.png';

interface ComingSoonProps {
  enabled: boolean;
}

const ComingSoon = ({ enabled }: ComingSoonProps) => {
  // Dacă pagina "Coming Soon" nu este activată, sau dacă suntem pe pagina admin, nu afișăm nimic
  const isAdminPage = window.location.pathname.includes('/admin');
  if (!enabled || isAdminPage) return null;
  
  // Easter Egg pentru accesare secretă admin
  // Removed admin keyboard shortcut per user request
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Imaginea de fundal - și mai întunecată */}
      <div className="absolute inset-0" 
           style={{
             backgroundImage: `url(${comingSoonBg})`, 
             backgroundSize: 'cover', 
             backgroundPosition: 'center',
             opacity: 0.15 /* Opacitate foarte redusă pentru imagine */
           }}>
      </div>
      
      {/* Overlay pentru un contrast și mai bun */}
      <div className="absolute inset-0 bg-black opacity-75 z-10"></div>
      
      {/* Conținut centrat */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-3 text-white drop-shadow-lg">
          COMING SOON
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-amber-500 drop-shadow-lg">
          HATOR CS LEAGUE MOLDOVA
        </h2>
        <h3 className="text-3xl md:text-5xl font-bold mb-10 text-white drop-shadow-lg">
          MPL
        </h3>
        
        <p className="text-lg text-gray-100 mb-10 drop-shadow-lg font-medium">
          Website-ul nostru este în construcție dar va fi disponibil în curând.
        </p>
        
        <a 
          href="https://discord.gg/Ek4qvWE5qB" 
          target="_blank" 
          rel="noopener noreferrer"
          className="py-3 px-6 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white flex items-center gap-2 transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
          </svg>
          <span>Alătură-te pe Discord</span>
        </a>
        
        {/* Logouri parteneri - aceeași mărime pentru ambele */}
        <div className="fixed bottom-10 left-0 right-0 flex justify-center items-center gap-12">
          <a 
            href="https://hator.gg" 
            target="_blank" 
            rel="nofollow noopener noreferrer" 
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <img 
              src={hatorLogo} 
              alt="HATOR" 
              className="h-8"
            />
          </a>
          <a 
            href="https://darwin.md" 
            target="_blank" 
            rel="nofollow noopener noreferrer"
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <img 
              src={darwinLogo} 
              alt="Darwin" 
              className="h-8"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;