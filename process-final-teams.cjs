const fs = require('fs');

// Function to clean player names
function cleanPlayerName(name) {
  return name.replace(/[\[\]📌👥1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣]/g, '').replace(/\(@.*?\)/g, '').trim();
}

// Process the final team file
const content = fs.readFileSync('attached_assets/Pasted--Echipa-XPlosion-C-pitan-Duke-0-Duke-0-Main-1-Duke0-Duke0-2-Gr1MM-G-1749926165254_1749926165254.txt', 'utf8');
const lines = content.split('\n').map(line => line.trim()).filter(line => line);

const teams = [];
let currentTeam = null;
let currentSection = '';

for (const line of lines) {
  if (line.includes('📌 Echipa:')) {
    // Save previous team
    if (currentTeam) {
      teams.push(currentTeam);
    }
    
    // Start new team
    const teamName = cleanPlayerName(line.split(':')[1]);
    currentTeam = {
      teamName,
      captain: '',
      mainPlayers: [],
      reservePlayers: []
    };
  } else if (line.includes('👥 Căpitan:')) {
    const captain = cleanPlayerName(line.split(':')[1]);
    if (currentTeam) {
      currentTeam.captain = captain;
    }
  } else if (line.includes('👥 Main:')) {
    currentSection = 'main';
  } else if (line.includes('👥 Rezervă')) {
    currentSection = 'reserve';
  } else if ((line.match(/^\d/) || line.includes('️⃣') || line.startsWith('[')) && currentTeam) {
    const playerName = cleanPlayerName(line);
    if (playerName && currentSection === 'main') {
      currentTeam.mainPlayers.push(playerName);
    } else if (playerName && currentSection === 'reserve') {
      currentTeam.reservePlayers.push(playerName);
    }
  }
}

// Add the last team
if (currentTeam) {
  teams.push(currentTeam);
}

console.log(`Processed ${teams.length} teams with complete data`);

// Generate final TypeScript data structure for storage
let tsOutput = '// Final corrected team members data from official tournament file\nconst finalTeamMembers = [\n';

teams.forEach((team, index) => {
  const teamId = index + 1;
  
  // Add captain
  if (team.captain) {
    tsOutput += `  { teamId: ${teamId}, nickname: "${team.captain}", role: "captain", position: "main" },\n`;
  }
  
  // Add main players (excluding captain if already added)
  team.mainPlayers.forEach(player => {
    if (player !== team.captain) {
      tsOutput += `  { teamId: ${teamId}, nickname: "${player}", role: "player", position: "main" },\n`;
    }
  });
  
  // Add reserve players
  team.reservePlayers.forEach(player => {
    tsOutput += `  { teamId: ${teamId}, nickname: "${player}", role: "player", position: "reserve" },\n`;
  });
});

tsOutput += '];\n\nexport { finalTeamMembers };';

// Save final corrected data
fs.writeFileSync('final-team-data.js', tsOutput);

// Generate summary
const totalPlayers = teams.reduce((sum, team) => {
  const captainCount = team.captain ? 1 : 0;
  return sum + captainCount + team.mainPlayers.length + team.reservePlayers.length;
}, 0);

console.log(`Total players: ${totalPlayers}`);
console.log('Final team data saved to final-team-data.js');

// Create detailed report
let report = 'FINAL TEAM REPORT\n' + '='.repeat(50) + '\n\n';
teams.forEach((team, index) => {
  report += `${index + 1}. ${team.teamName}\n`;
  report += `   Captain: ${team.captain}\n`;
  report += `   Main: ${team.mainPlayers.join(', ')}\n`;
  report += `   Reserve: ${team.reservePlayers.join(', ')}\n`;
  report += `   Total: ${(team.captain ? 1 : 0) + team.mainPlayers.length + team.reservePlayers.length} players\n\n`;
});

fs.writeFileSync('final-teams-report.txt', report);
console.log('Final report saved to final-teams-report.txt');