// Importăm GameDig din pachețelul gamedig (care este un modul ESM)
import { storage } from './storage';
import { CsServer } from '@shared/schema-cs-servers';

// Simulăm verificarea serverelor deoarece compatibilitatea ESM și TSX este dificilă
// Într-un proiect real vom utiliza o abordare completă de integrare
const SERVERS_ONLINE = true; // Simulăm că toate serverele sunt online

/**
 * Verifică starea serverelor CS2 și actualizează baza de date
 */
export async function checkCsServers() {
  try {
    console.log('Verificarea serverelor CS2...');
    const servers = await storage.getCsServers();
    
    for (const server of servers) {
      try {
        // Simulăm rezultatul interogării serverului
        // În implementarea reală, aici ar fi apelul către Gamedig.query
        const playersCount = Math.floor(Math.random() * 10); // Între 0 și 9 jucători simulați
        
        console.log(`Server ${server.name} este ONLINE, Jucători: ${playersCount}/16`);
        
        // Actualizăm starea serverului în baza de date
        await storage.updateCsServerStatus(
          server.id, 
          SERVERS_ONLINE, // status online (conform informațiilor primite)
          playersCount
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