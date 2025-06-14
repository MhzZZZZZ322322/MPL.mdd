const fs = require('fs');
const path = require('path');

// Function to clean player names
function cleanPlayerName(name) {
  return name.replace(/[\[\]📌👥1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣]/g, '').trim();
}

// Function to parse team file
function parseTeamFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  
  let teamName = '';
  let captain = '';
  let mainPlayers = [];
  let reservePlayers = [];
  let currentSection = '';
  
  for (const line of lines) {
    if (line.includes('Echipa:')) {
      teamName = cleanPlayerName(line.split(':')[1]);
    } else if (line.includes('Căpitan:')) {
      captain = cleanPlayerName(line.split(':')[1]);
    } else if (line.includes('Main:')) {
      currentSection = 'main';
    } else if (line.includes('Rezervă')) {
      currentSection = 'reserve';
    } else if (line.match(/^\d/) || line.includes('️⃣')) {
      const playerName = cleanPlayerName(line);
      if (playerName && currentSection === 'main') {
        mainPlayers.push(playerName);
      } else if (playerName && currentSection === 'reserve') {
        reservePlayers.push(playerName);
      }
    }
  }
  
  return {
    teamName,
    captain,
    mainPlayers,
    reservePlayers
  };
}

// Process all team files
const teamsDir = 'attached_assets/Aici Lista cu jucatori din Echipe';
const files = fs.readdirSync(teamsDir);

const allTeamsData = [];

for (const file of files) {
  if (file.endsWith('.txt')) {
    const filePath = path.join(teamsDir, file);
    try {
      const teamData = parseTeamFile(filePath);
      allTeamsData.push(teamData);
      console.log(`Processed: ${teamData.teamName}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
}

// Generate SQL statements
let sqlStatements = [];

allTeamsData.forEach((team, teamIndex) => {
  const teamId = teamIndex + 1; // Assuming teams start from ID 1
  
  // Add main players
  team.mainPlayers.forEach((player, playerIndex) => {
    const isCaptain = player === team.captain;
    sqlStatements.push(
      `INSERT INTO team_members (team_id, nickname, faceit_profile, role, position) VALUES (${teamId}, '${player}', 'https://faceit.com/players/${player}', '${isCaptain ? 'captain' : 'player'}', 'main');`
    );
  });
  
  // Add reserve players
  team.reservePlayers.forEach((player) => {
    sqlStatements.push(
      `INSERT INTO team_members (team_id, nickname, faceit_profile, role, position) VALUES (${teamId}, '${player}', 'https://faceit.com/players/${player}', 'player', 'reserve');`
    );
  });
});

// Save SQL statements to file
fs.writeFileSync('team_members_sql.sql', sqlStatements.join('\n'));
console.log('\nSQL statements generated in team_members_sql.sql');
console.log(`Total teams processed: ${allTeamsData.length}`);
console.log(`Total SQL statements: ${sqlStatements.length}`);