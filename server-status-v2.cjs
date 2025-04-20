// Importăm modulul Gamedig
const { GameDig } = require('gamedig');

// Creăm instanța GameDig
const gamedig = new GameDig();

const servers = [
  { name: 'Aim', host: '37.233.50.55', port: 27015 },
  { name: 'Retake', host: '37.233.50.55', port: 27016 },
  { name: 'FFA/DM', host: '37.233.50.55', port: 27017 }
];

async function checkServers() {
  console.log('Verificarea serverelor CS2 Moldova...\n');
  
  for (const server of servers) {
    try {
      console.log(`Verificare server ${server.name} (${server.host}:${server.port})...`);
      
      const state = await gamedig.query({
        type: 'cs2',
        host: server.host,
        port: server.port,
        maxAttempts: 2,
        timeout: 5000
      });

      console.log(`✅ SERVER ONLINE: ${server.host}:${server.port} - ${state.name}`);
      console.log(`👥 Jucători conectați: ${state.players.length}/${state.maxplayers}`);
      
      if (state.players.length > 0) {
        console.log('Jucători online:');
        state.players.forEach((player, index) => {
          console.log(`  ${index + 1}. ${player.name || 'Anonymous'} (Score: ${player.score || 'N/A'})`);
        });
      }
      
      console.log('------------------------------');
    } catch (e) {
      console.log(`❌ OFFLINE/INACCESIBIL: ${server.host}:${server.port} - ${server.name}`);
      console.log(`Eroare: ${e.message}`);
      console.log('------------------------------');
    }
  }
  
  console.log('\nVerificare completă!');
}

// Executăm funcția de verificare
checkServers();