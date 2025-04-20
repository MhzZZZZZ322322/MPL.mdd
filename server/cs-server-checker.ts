// Importăm storage și schema CS-server
import { storage } from './storage';
import { CsServer } from '@shared/schema-cs-servers';

// Folosim simulare completă pentru starea serverelor
// Notă: În viitor poate fi înlocuit cu verificare reală prin gamedig
// Definim tipul pentru distribuția jucătorilor
type PlayerDistribution = {
  min: number; 
  max: number; 
  offlineChance: number;
};

/**
 * Simulează starea unui server CS2
 * @param ip - Adresa IP a serverului
 * @param port - Portul serverului
 * @returns - Informații despre server (online/offline, jucători)
 */
async function checkServerStatus(ip: string, port: number): Promise<{status: boolean, players: number}> {
  
  // Simulare pentru dezvoltare/testare
  // Folosim un sistem mai inteligent de simulare bazat pe o distribuție mai realistă
  // astfel încât unele servere să aibă mai mulți jucători decât altele
  const serverKey = `${ip}:${port}`;
  
  // Distribuție realistică în funcție de port/server
  let playerDistribution: Record<string, PlayerDistribution> = {
    // Serverul AIM tinde să aibă mai mulți jucători (4-9)
    '27015': { min: 3, max: 9, offlineChance: 0.01 },
    // Serverul Retake tinde să aibă jucători mediu (1-6)
    '27016': { min: 0, max: 6, offlineChance: 0.05 },
    // Serverul Deathmatch tinde să aibă mai puțini jucători (0-5)
    '27017': { min: 2, max: 8, offlineChance: 0.02 },
    // Default pentru orice alt server
    'default': { min: 0, max: 4, offlineChance: 0.1 }
  };
  
  // Alegem distribuția potrivită serverului
  const portKey = port.toString();
  const distribution = portKey in playerDistribution 
    ? playerDistribution[portKey] 
    : playerDistribution['default'];
  
  // Șansa mică de offline
  const isOnline = Math.random() > distribution.offlineChance;
  
  // Dacă e online, calculăm jucătorii în baza distribuției
  const playersCount = isOnline 
    ? Math.floor(Math.random() * (distribution.max - distribution.min + 1)) + distribution.min
    : 0;
  
  return {
    status: isOnline,
    players: playersCount
  };
}

/**
 * Verifică starea serverelor CS2 și actualizează baza de date
 */
export async function checkCsServers() {
  try {
    console.log('Verificarea serverelor CS2...');
    const servers = await storage.getCsServers();
    
    for (const server of servers) {
      try {
        // Verificăm statusul serverului (online/offline, jucători)
        const { status, players } = await checkServerStatus(server.ip, server.port);
        
        // Afișăm statusul serverului
        console.log(`Server ${server.name} este ${status ? 'ONLINE' : 'OFFLINE'}, Jucători: ${players}/${server.maxPlayers}`);
        
        // Actualizăm starea serverului în baza de date
        await storage.updateCsServerStatus(
          server.id, 
          status,
          players
        );
      } catch (error: any) {
        console.log(`Eroare la verificarea serverului ${server.name}: ${error.message || 'Eroare necunoscută'}`);
        
        // Marcăm serverul ca offline în baza de date
        await storage.updateCsServerStatus(
          server.id, 
          false, // offline
          0 // 0 jucători când serverul e offline
        );
      }
    }
    
    console.log('Verificarea serverelor CS2 finalizată');
  } catch (error: any) {
    console.error('Eroare la verificarea serverelor CS2:', error.message || error);
  }
}

/**
 * Pornește verificarea periodică a serverelor CS2
 * @param intervalMinutes - Intervalul în minute între verificări
 */
export function startCsServerChecker(intervalMinutes: number = 5) {
  // Verificăm imediat la pornire
  checkCsServers();
  
  // Setăm verificarea periodică
  const intervalMs = intervalMinutes * 60 * 1000;
  const interval = setInterval(checkCsServers, intervalMs);
  
  console.log(`Verificarea automată a serverelor CS2 a fost pornită (la fiecare ${intervalMinutes} minute)`);
  
  return {
    stop: () => {
      clearInterval(interval);
      console.log('Verificarea automată a serverelor CS2 a fost oprită');
    }
  };
}