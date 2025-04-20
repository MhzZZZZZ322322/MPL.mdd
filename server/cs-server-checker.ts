import Gamedig from 'gamedig';
import { storage } from './storage';
import { CsServer } from '@shared/schema-cs-servers';

/**
 * Verifică starea serverelor CS2 și actualizează baza de date
 */
export async function checkCsServers() {
  try {
    console.log('Verificarea serverelor CS2...');
    const servers = await storage.getCsServers();
    
    for (const server of servers) {
      try {
        const result = await Gamedig.query({
          type: 'csgo', // CS2 folosește același protocol ca CS:GO
          host: server.ip,
          port: server.port,
          maxAttempts: 2, // Încercăm de maxim 2 ori pentru a nu bloca
          attemptTimeout: 5000 // Timeout după 5 secunde
        });
        
        console.log(`Server ${server.name} este ONLINE: ${result.name}, Jucători: ${result.players.length}/${result.maxplayers}`);
        
        // Actualizăm starea serverului în baza de date
        await storage.updateCsServerStatus(
          server.id, 
          true, // online
          result.players.length
        );
      } catch (error) {
        console.log(`Server ${server.name} este OFFLINE: ${error.message}`);
        
        // Marcăm serverul ca offline în baza de date
        await storage.updateCsServerStatus(
          server.id, 
          false, // offline
          0 // 0 jucători când serverul e offline
        );
      }
    }
    
    console.log('Verificarea serverelor CS2 finalizată');
  } catch (error) {
    console.error('Eroare la verificarea serverelor CS2:', error);
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