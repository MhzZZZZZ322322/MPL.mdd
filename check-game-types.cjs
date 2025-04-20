const { GameDig } = require('gamedig');

// Afișăm tipurile de jocuri disponibile
console.log('Tipuri de jocuri disponibile în GameDig:');
if (GameDig.games) {
  // Afișăm doar jocurile care au în nume "counter" sau "cs"
  const csGames = Object.keys(GameDig.games).filter(game => 
    game.toLowerCase().includes('counter') || 
    game.toLowerCase().includes('cs')
  );
  
  console.log('Jocuri Counter-Strike disponibile:');
  csGames.forEach(game => {
    console.log(`- ${game}`);
  });
} else {
  console.log('Nu am putut accesa lista de jocuri');
}