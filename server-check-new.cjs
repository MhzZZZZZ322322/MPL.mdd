// Importăm GameDig folosind destructuring conform documentației
const { GameDig } = require('gamedig');

// Definim serverele pe care vrem să le verificăm
const servers = [
  { name: 'Aim', host: '37.233.50.55', port: 27015, type: 'counterstrike2' },
  { name: 'Retake', host: '37.233.50.55', port: 27016, type: 'counterstrike2' },
  { name: 'FFA/DM', host: '37.233.50.55', port: 27017, type: 'counterstrike2' }
];

// Folosim funcția de bază, foarte simplu
console.log('Începem verificarea serverelor...\n');

// Verificăm fiecare server
async function checkServers() {
  for (const server of servers) {
    console.log(`Verificare ${server.name} (${server.host}:${server.port})...`);
    
    try {
      const state = await GameDig.query({
        type: server.type,
        host: server.host,
        port: server.port
      });
      
      console.log(`✅ ONLINE: ${server.name} (${state.name})`);
      console.log(`Jucători: ${state.players.length}/${state.maxplayers}`);
      console.log('-------------------');
    } catch (err) {
      console.log(`❌ OFFLINE: ${server.name} - ${err.message}`);
      console.log('-------------------');
    }
  }
}

// Rulăm verificarea
checkServers();