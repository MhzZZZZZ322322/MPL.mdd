const fs = require('fs');

// Read the formatted team file
const content = fs.readFileSync('attached_assets/Lista_Echipe_Formatata_1749925739404.txt', 'utf8');
const lines = content.split('\n').map(line => line.trim()).filter(line => line);

console.log('=== PROCESARE ECHIPE UNA CÂTE UNA ===\n');

let currentTeam = null;
let currentSection = '';
let teamIndex = 0;
const extractedTeams = [];

function cleanName(name) {
  // Remove emojis, brackets, and @ mentions
  return name
    .replace(/[\[\]📌👥1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣]/g, '')
    .replace(/\(@.*?\)/g, '')
    .replace(/^\s*[a-zA-Z]\s+/g, '') // Remove single letters at start
    .trim();
}

for (const line of lines) {
  if (line.includes('📌 Echipa:')) {
    // Save previous team if exists
    if (currentTeam) {
      extractedTeams.push(currentTeam);
      console.log(`ECHIPA ${teamIndex}: ${currentTeam.name}`);
      console.log(`  Căpitan: ${currentTeam.captain}`);
      console.log(`  Main (${currentTeam.main.length}): ${currentTeam.main.join(', ')}`);
      console.log(`  Rezervă (${currentTeam.reserve.length}): ${currentTeam.reserve.join(', ')}`);
      console.log('');
      teamIndex++;
    }
    
    // Extract team name
    const teamName = cleanName(line.split(':')[1]);
    currentTeam = {
      name: teamName,
      captain: '',
      main: [],
      reserve: []
    };
  } 
  else if (line.includes('👥 Căpitan:')) {
    const captain = cleanName(line.split(':')[1]);
    if (currentTeam) {
      currentTeam.captain = captain;
    }
  }
  else if (line.includes('👥 Main:')) {
    currentSection = 'main';
  }
  else if (line.includes('👥 Rezervă')) {
    currentSection = 'reserve';
  }
  else if (line.match(/^\d/) || line.includes('️⃣') || line.startsWith('[')) {
    const playerName = cleanName(line);
    if (playerName && currentTeam) {
      if (currentSection === 'main') {
        currentTeam.main.push(playerName);
      } else if (currentSection === 'reserve') {
        currentTeam.reserve.push(playerName);
      }
    }
  }
}

// Add the last team
if (currentTeam) {
  extractedTeams.push(currentTeam);
  console.log(`ECHIPA ${teamIndex + 1}: ${currentTeam.name}`);
  console.log(`  Căpitan: ${currentTeam.captain}`);
  console.log(`  Main (${currentTeam.main.length}): ${currentTeam.main.join(', ')}`);
  console.log(`  Rezervă (${currentTeam.reserve.length}): ${currentTeam.reserve.join(', ')}`);
  console.log('');
}

console.log(`\n=== SUMAR ===`);
console.log(`Total echipe: ${extractedTeams.length}`);
console.log(`Total jucători: ${extractedTeams.reduce((sum, team) => sum + team.main.length + team.reserve.length + (team.captain ? 1 : 0), 0)}`);

// Generate corrected TypeScript data
let tsOutput = '// Corrected team members data extracted one by one\nconst correctTeamMembers = [\n';

extractedTeams.forEach((team, index) => {
  const teamId = index + 1;
  
  // Add captain
  if (team.captain) {
    tsOutput += `  { teamId: ${teamId}, nickname: "${team.captain}", role: "captain", position: "main" },\n`;
  }
  
  // Add main players (excluding captain if already added)
  team.main.forEach(player => {
    if (player !== team.captain) {
      tsOutput += `  { teamId: ${teamId}, nickname: "${player}", role: "player", position: "main" },\n`;
    }
  });
  
  // Add reserve players
  team.reserve.forEach(player => {
    tsOutput += `  { teamId: ${teamId}, nickname: "${player}", role: "player", position: "reserve" },\n`;
  });
});

tsOutput += '];\n\nexport { correctTeamMembers };';

// Save corrected data
fs.writeFileSync('corrected-team-data.js', tsOutput);
console.log('\nDatele corectate au fost salvate în corrected-team-data.js');

// Also save a detailed report
let report = 'RAPORT DETALIAT ECHIPE\n' + '='.repeat(50) + '\n\n';
extractedTeams.forEach((team, index) => {
  report += `${index + 1}. ${team.name}\n`;
  report += `   Căpitan: ${team.captain}\n`;
  report += `   Jucători main: ${team.main.join(', ')}\n`;
  report += `   Jucători rezervă: ${team.reserve.join(', ')}\n`;
  report += `   Total: ${team.main.length + team.reserve.length + (team.captain ? 1 : 0)} jucători\n\n`;
});

fs.writeFileSync('detailed-teams-report.txt', report);
console.log('Raportul detaliat a fost salvat în detailed-teams-report.txt');