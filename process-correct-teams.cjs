const fs = require('fs');

// Function to clean player names
function cleanPlayerName(name) {
  return name.replace(/[\[\]📌👥1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣]/g, '').replace(/\(@.*?\)/g, '').trim();
}

// Function to parse the formatted team file
function parseFormattedTeamFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
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
  
  return teams;
}

// Process the formatted file
const teams = parseFormattedTeamFile('attached_assets/Lista_Echipe_Formatata_1749925739404.txt');

console.log(`Processed ${teams.length} teams:`);

// Create TypeScript data structure
let tsOutput = 'const correctTeamMembers = [\n';

teams.forEach((team, index) => {
  const teamId = index + 1;
  console.log(`Team ${teamId}: ${team.teamName} (Captain: ${team.captain})`);
  
  // Add captain (always in main lineup)
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

tsOutput += '];\n\nexport default correctTeamMembers;';

// Save the corrected data
fs.writeFileSync('correct-team-members.js', tsOutput);

console.log('\nCorrected team members data saved to correct-team-members.js');
console.log(`Total players processed: ${teams.reduce((sum, team) => sum + team.mainPlayers.length + team.reservePlayers.length, 0)}`);

// Also create a summary for verification
let summary = 'Team Summary:\n';
teams.forEach((team, index) => {
  summary += `${index + 1}. ${team.teamName} - Captain: ${team.captain} (${team.mainPlayers.length} main, ${team.reservePlayers.length} reserve)\n`;
});

fs.writeFileSync('teams-summary.txt', summary);
console.log('Team summary saved to teams-summary.txt');