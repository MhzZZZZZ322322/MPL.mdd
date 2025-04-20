// Importăm Gamedig conform documentației oficiale
const Gamedig = require('gamedig');

// Definim serverele pe care vrem să le verificăm
const servers = [
  { name: 'Aim', host: '37.233.50.55', port: 27015, type: 'cs2' },
  { name: 'Retake', host: '37.233.50.55', port: 27016, type: 'cs2' },
  { name: 'FFA/DM', host: '37.233.50.55', port: 27017, type: 'cs2' }
];

// Folosim funcția de bază, foarte simplu
console.log('Începem verificarea serverelor...\n');

// Verificăm fiecare server
for (const server of servers) {
  console.log(`Verificare ${server.name} (${server.host}:${server.port})...`);
  
  Gamedig.query({
    type: server.type,
    host: server.host,
    port: server.port
  })
  .then((state) => {
    console.log(`✅ ONLINE: ${server.name} (${state.name})`);
    console.log(`Jucători: ${state.players.length}/${state.maxplayers}`);
    console.log('-------------------');
  })
  .catch((err) => {
    console.log(`❌ OFFLINE: ${server.name} - ${err.message}`);
    console.log('-------------------');
  });
}