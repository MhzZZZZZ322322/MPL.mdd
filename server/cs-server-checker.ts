// Importăm storage și schema CS-server
import { storage } from './storage';
import { CsServer } from '@shared/schema-cs-servers';
import * as gamedig from 'gamedig';

/**
 * Verifică starea reală a unui server CS2 folosind Gamedig
 * Implementare 100% reală - nicio simulare
 * @param ip - Adresa IP a serverului
 * @param port - Portul serverului
 * @returns - Informații despre server (online/offline, jucători)
 */
async function checkServerStatus(ip: string, port: number): Promise<{status: boolean, players: number}> {
  try {
    console.log(`Verificarea REALĂ a serverului ${ip}:${port} folosind Gamedig...`);
    
    // Folosim Gamedig pentru a verifica starea serverului
    const result = await gamedig.query({
      type: 'cs2',
      host: ip,
      port: port,
      maxAttempts: 2,
      socketTimeout: 2000
    });
    
    // Gamedig returnează datele serverului dacă acesta e online
    console.log(`Server ${ip}:${port} este ONLINE conform verificării Gamedig, Nume: ${result.name}, Jucători: ${result.players.length}/${result.maxplayers}`);
    
    return {
      status: true,
      players: result.players.length
    };
    
  } catch (error) {
    // Orice eroare înseamnă că serverul este offline sau inaccesibil
    console.log(`Server ${ip}:${port} este OFFLINE sau inaccesibil conform verificării Gamedig`);
    return {
      status: false,
      players: 0
    };
  }
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