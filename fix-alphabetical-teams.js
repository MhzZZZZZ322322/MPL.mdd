// Script to fix team member mapping for alphabetical order
import fs from 'fs';

// Teams in alphabetical order (matching server/storage.ts)
const alphabeticalTeams = [
  "Auratix", "Barbosii", "Bloody", "Bobb3rs", "BPSP",
  "Brigada", "Brigada Meteor", "Cadian Team", "Ciocana Esports", "Ciocălău Team",
  "Cipok", "Coli", "Crasat", "Cucumba", "Flux Line",
  "Golden Five", "Team Prodigy", "Japon", "K9 Team", "Killuminaty",
  "KostiujeniKlinik", "La Passion", "Lean Vision", "Legalize", "LitEnergy",
  "LYSQ", "Muligambia", "Neo Egoist League", "Onyx", "RCBVR",
  "Robotaim", "Rumina", "Shashlik", "Trigger", "VeryGoodTeam",
  "WenDeagle", "Wenzo", "X-one", "XPlosion"
];

// Original team order from tournament file
const originalTeams = [
  "XPlosion", "Robotaim", "Lean Vision", "Coli", "Japon",
  "Flux Line", "Cipok", "La Passion", "LYSQ", "RCBVR",
  "Crasat", "Neo Egoist League", "LitEnergy", "Team Prodigy", "VeryGoodTeam",
  "KostiujeniKlinik", "Muligambia", "Legalize", "Trigger", "WenDeagle",
  "X-one", "Cucumba", "Cadian Team", "Onyx", "Barbosii",
  "Wenzo", "Golden Five", "Auratix", "Rumina", "K9 Team",
  "Killuminaty", "Shashlik", "Ciocana Esports", "Bobb3rs", "Bloody",
  "Brigada", "Ciocălău Team", "Brigada Meteor", "BPSP"
];

// Create mapping from original team index to alphabetical team index
const teamMapping = {};
originalTeams.forEach((teamName, originalIndex) => {
  const alphabeticalIndex = alphabeticalTeams.indexOf(teamName);
  if (alphabeticalIndex !== -1) {
    teamMapping[originalIndex + 1] = alphabeticalIndex + 1;
  }
});

console.log("Team ID mapping (original -> alphabetical):");
console.log(teamMapping);

// Read the current team members data
const finalTeamData = require('./final-team-data.js');

// Remap team IDs
const remappedMembers = finalTeamData.finalTeamMembers.map(member => ({
  ...member,
  teamId: teamMapping[member.teamId] || member.teamId
}));

// Sort by new team ID
remappedMembers.sort((a, b) => a.teamId - b.teamId);

// Generate the new data structure
let output = "// Team members correctly mapped to alphabetical team order\nconst finalTeamMembers = [\n";

let currentTeamId = 0;
remappedMembers.forEach(member => {
  if (member.teamId !== currentTeamId) {
    if (currentTeamId > 0) output += "\n";
    currentTeamId = member.teamId;
    const teamName = alphabeticalTeams[currentTeamId - 1];
    output += `  // Team ${currentTeamId}: ${teamName}\n`;
  }
  output += `  { teamId: ${member.teamId}, nickname: "${member.nickname}", role: "${member.role}", position: "${member.position}" },\n`;
});

output += "];\n\nmodule.exports = { finalTeamMembers };";

// Write to file
fs.writeFileSync('remapped-team-data.js', output);
console.log("Generated remapped team data in remapped-team-data.js");