const gamedig = require('gamedig');

// Listăm toate cheile din modulul gamedig
console.log('Metodele și proprietățile din modulul Gamedig:');
console.log(Object.keys(gamedig));

// Verificăm ce conține metoda principală
console.log('\nTipul functiei query:');
console.log(typeof gamedig.query);