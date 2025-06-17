import type { Express } from "express";
import { db } from "./db";
import { teams } from "@shared/schema";
import { eq } from "drizzle-orm";

// Simple in-memory storage for tournament results until database migration completes
interface GroupResult {
  id: string;
  groupName: string;
  team1: string;
  team2: string;
  team1Score: number;
  team2Score: number;
  timestamp: number;
}

// Helper function to check if two teams have already played against each other
function teamsHavePlayedBefore(team1: string, team2: string, groupName: string): boolean {
  return groupResults.some(result => 
    result.groupName === groupName &&
    ((result.team1 === team1 && result.team2 === team2) ||
     (result.team1 === team2 && result.team2 === team1))
  );
}

// Helper function to get maximum matches per team in a group
function getMaxMatchesPerTeam(groupName: string): number {
  const teamsInGroup = groupStandings.filter(s => s.groupName === groupName).length;
  return Math.max(0, teamsInGroup - 1); // Each team plays against every other team once
}

interface GroupStanding {
  teamName: string;
  groupName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  roundDifference: number;
  points: number;
  position: number;
}

// In-memory storage
let groupResults: GroupResult[] = [];
let groupStandings: GroupStanding[] = [];
let groupConfiguration: any[] = [];
let initialized = false;

export function registerSimpleGroupsAPI(app: Express) {
  
  // Initialize groups with all teams
  app.post("/api/admin/initialize-groups", async (req, res) => {
    try {
      const allTeams = await db.select().from(teams).where(eq(teams.isActive, true));
      
      if (allTeams.length === 0) {
        return res.status(400).json({ message: "No active teams found" });
      }

      // Create initial standings for all teams in groups
      groupStandings = [];
      const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      let teamIndex = 0;

      for (let groupIndex = 0; groupIndex < groupNames.length; groupIndex++) {
        const groupName = groupNames[groupIndex];
        const teamsInGroup = groupIndex === 6 ? 7 : 6; // Last group gets 7 teams
        
        for (let i = 0; i < teamsInGroup && teamIndex < allTeams.length; i++) {
          const team = allTeams[teamIndex];
          groupStandings.push({
            teamName: team.name,
            groupName,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            roundsWon: 0,
            roundsLost: 0,
            roundDifference: 0,
            points: 0,
            position: i + 1,
          });
          teamIndex++;
        }
      }

      initialized = true;
      res.json({ 
        message: "Groups initialized successfully", 
        teamsAssigned: teamIndex,
        groups: groupNames.length
      });
    } catch (error) {
      console.error("Error initializing groups:", error);
      res.status(500).json({ message: "Failed to initialize groups" });
    }
  });

  // Add match result
  app.post("/api/admin/add-match-result", async (req, res) => {
    try {
      const { team1, team2, team1Score, team2Score, groupName } = req.body;

      // Validate input
      if (!team1 || !team2 || team1 === team2) {
        return res.status(400).json({ message: "Invalid team selection" });
      }

      if (team1Score < 0 || team2Score < 0) {
        return res.status(400).json({ message: "Scores cannot be negative" });
      }

      // Validate CS2 scoring rules
      if (team1Score < 13 && team2Score < 13) {
        return res.status(400).json({ message: "În CS2 BO1, o echipă trebuie să câștige cu cel puțin 13 runde" });
      }

      if (team1Score >= 13 && team2Score >= 13) {
        return res.status(400).json({ message: "În CS2 BO1, doar o echipă poate câștiga (nu pot fi ambele cu 13+ runde)" });
      }

      // Check if teams exist in the group
      const team1Standing = groupStandings.find(s => s.teamName === team1 && s.groupName === groupName);
      const team2Standing = groupStandings.find(s => s.teamName === team2 && s.groupName === groupName);

      if (!team1Standing || !team2Standing) {
        return res.status(404).json({ message: "One or both teams not found in the specified group" });
      }

      // Record the match
      const matchResult: GroupResult = {
        id: Date.now().toString(),
        groupName,
        team1,
        team2,
        team1Score,
        team2Score,
        timestamp: Date.now(),
      };
      groupResults.push(matchResult);

      // Update standings
      const team1Wins = team1Score > team2Score ? 1 : 0;
      const team1Losses = team1Score < team2Score ? 1 : 0;
      const team1Points = team1Wins * 3; // 3 points for win

      const team2Wins = team2Score > team1Score ? 1 : 0;
      const team2Losses = team2Score < team1Score ? 1 : 0;
      const team2Points = team2Wins * 3;

      // Update team1 stats
      team1Standing.matchesPlayed += 1;
      team1Standing.wins += team1Wins;
      team1Standing.losses += team1Losses;
      team1Standing.roundsWon += team1Score;
      team1Standing.roundsLost += team2Score;
      team1Standing.roundDifference += (team1Score - team2Score);
      team1Standing.points += team1Points;

      // Update team2 stats
      team2Standing.matchesPlayed += 1;
      team2Standing.wins += team2Wins;
      team2Standing.losses += team2Losses;
      team2Standing.roundsWon += team2Score;
      team2Standing.roundsLost += team1Score;
      team2Standing.roundDifference += (team2Score - team1Score);
      team2Standing.points += team2Points;

      // Recalculate positions for the group
      recalculatePositions(groupName);

      res.json({ 
        message: "Match result added successfully",
        match: matchResult,
        winner: team1Score > team2Score ? team1 : team2
      });
    } catch (error) {
      console.error("Error adding match result:", error);
      res.status(500).json({ message: "Failed to add match result" });
    }
  });

  // Get group standings
  app.get("/api/admin/group-standings", (req, res) => {
    try {
      res.json(groupStandings);
    } catch (error) {
      console.error("Error fetching standings:", error);
      res.status(500).json({ message: "Failed to fetch standings" });
    }
  });

  // Reset tournament
  app.post("/api/admin/reset-tournament", (req, res) => {
    try {
      groupResults = [];
      groupStandings.forEach(standing => {
        standing.matchesPlayed = 0;
        standing.wins = 0;
        standing.losses = 0;
        standing.roundsWon = 0;
        standing.roundsLost = 0;
        standing.roundDifference = 0;
        standing.points = 0;
        standing.position = 1;
      });

      res.json({ message: "Tournament reset successfully" });
    } catch (error) {
      console.error("Error resetting tournament:", error);
      res.status(500).json({ message: "Failed to reset tournament" });
    }
  });

  // Get current group configuration
  app.get("/api/admin/group-config", (req, res) => {
    try {
      res.json(groupConfiguration);
    } catch (error) {
      console.error("Error fetching group config:", error);
      res.status(500).json({ message: "Failed to fetch group config" });
    }
  });

  // Save group configuration
  app.post("/api/admin/save-group-config", (req, res) => {
    try {
      const { groups } = req.body;
      groupConfiguration = groups;

      // Update standings based on new configuration
      groupStandings = [];
      groups.forEach((group: any) => {
        group.teams.forEach((team: any, index: number) => {
          const existingStanding = groupStandings.find(s => s.teamName === team.name && s.groupName === group.groupName);
          if (existingStanding) {
            existingStanding.position = index + 1;
          } else {
            groupStandings.push({
              teamName: team.name,
              groupName: group.groupName,
              matchesPlayed: 0,
              wins: 0,
              losses: 0,
              roundsWon: 0,
              roundsLost: 0,
              roundDifference: 0,
              points: 0,
              position: index + 1,
            });
          }
        });
      });

      res.json({ message: "Group configuration saved successfully" });
    } catch (error) {
      console.error("Error saving group config:", error);
      res.status(500).json({ message: "Failed to save group config" });
    }
  });

  // Auto-distribute teams
  app.post("/api/admin/auto-distribute-teams", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { teams } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      const allTeams = await db.select().from(teams).where(eq(teams.isActive, true));
      
      const groups = [
        { groupName: 'A', displayName: 'Group A', teams: [] },
        { groupName: 'B', displayName: 'Group B', teams: [] },
        { groupName: 'C', displayName: 'Group C', teams: [] },
        { groupName: 'D', displayName: 'Group D', teams: [] },
        { groupName: 'E', displayName: 'Group E', teams: [] },
        { groupName: 'F', displayName: 'Group F', teams: [] },
        { groupName: 'G', displayName: 'Group G', teams: [] },
      ];

      let teamIndex = 0;
      for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
        const group = groups[groupIndex];
        const teamsInGroup = groupIndex === 6 ? 7 : 6; // Last group gets 7 teams
        
        for (let i = 0; i < teamsInGroup && teamIndex < allTeams.length; i++) {
          (group.teams as any[]).push(allTeams[teamIndex]);
          teamIndex++;
        }
      }

      groupConfiguration = groups;

      res.json({ 
        message: "Teams distributed automatically",
        groups,
        teamsDistributed: teamIndex,
        groupsCount: groups.length
      });
    } catch (error) {
      console.error("Error auto-distributing teams:", error);
      res.status(500).json({ message: "Failed to auto-distribute teams" });
    }
  });

  // DISABLED: Tournament groups route moved to tournament-database.ts for PostgreSQL integration
  // app.get("/api/tournament-groups", (req, res) => { ... });

  // Add match result with validation
  app.post("/api/admin/add-match-result", (req, res) => {
    try {
      const { groupName, team1, team2, team1Score, team2Score } = req.body;

      // Validation checks
      if (!groupName || !team1 || !team2 || team1Score === undefined || team2Score === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (team1 === team2) {
        return res.status(400).json({ message: "O echipă nu poate juca împotriva ei însăși" });
      }

      // Check if teams have already played against each other
      if (teamsHavePlayedBefore(team1, team2, groupName)) {
        return res.status(400).json({ 
          message: `Echipele ${team1} și ${team2} au mai jucat între ele în grupa ${groupName}. Fiecare echipă poate juca doar o dată cu fiecare altă echipă din grupă.` 
        });
      }

      // Validate CS2 BO1 scores (minimum 13 rounds to win, no draws)
      if (team1Score < 13 && team2Score < 13) {
        return res.status(400).json({ message: "În CS2 BO1, o echipă trebuie să câștige cu minimum 13 runde" });
      }

      if (team1Score >= 13 && team2Score >= 13) {
        return res.status(400).json({ message: "În CS2 BO1, doar o echipă poate câștiga (nu pot fi ambele cu 13+ runde)" });
      }

      // Check if teams have reached maximum matches for their group
      const maxMatches = getMaxMatchesPerTeam(groupName);
      const team1Matches = groupResults.filter(r => 
        r.groupName === groupName && (r.team1 === team1 || r.team2 === team1)
      ).length;
      const team2Matches = groupResults.filter(r => 
        r.groupName === groupName && (r.team1 === team2 || r.team2 === team2)
      ).length;

      if (team1Matches >= maxMatches) {
        return res.status(400).json({ 
          message: `Echipa ${team1} a jucat deja toate cele ${maxMatches} meciuri posibile în grupa ${groupName}` 
        });
      }

      if (team2Matches >= maxMatches) {
        return res.status(400).json({ 
          message: `Echipa ${team2} a jucat deja toate cele ${maxMatches} meciuri posibile în grupa ${groupName}` 
        });
      }

      // Add the match result
      const matchResult: GroupResult = {
        id: `${Date.now()}-${Math.random()}`,
        groupName,
        team1,
        team2,
        team1Score,
        team2Score,
        timestamp: Date.now()
      };

      groupResults.push(matchResult);

      // Update standings
      updateStandingsAfterMatch(matchResult);

      // Recalculate positions
      recalculatePositions(groupName);

      res.json({ 
        message: "Rezultatul meciului a fost înregistrat cu succes",
        match: matchResult,
        standings: groupStandings.filter(s => s.groupName === groupName)
      });

    } catch (error) {
      console.error("Error adding match result:", error);
      res.status(500).json({ message: "Failed to add match result" });
    }
  });

  // Get match history for a group
  app.get("/api/admin/group-matches/:groupName", (req, res) => {
    try {
      const { groupName } = req.params;
      const matches = groupResults.filter(r => r.groupName === groupName);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching group matches:", error);
      res.status(500).json({ message: "Failed to fetch group matches" });
    }
  });

  // Sync groups endpoint for manual refresh - forces complete recalculation from database
  app.post("/api/sync-groups", async (req, res) => {
    try {
      // Import the auto-sync function to force complete recalculation
      const { autoSyncAllStandings } = await import("./auto-sync-standings");
      
      // Force complete recalculation of all standings based on database match results
      const result = await autoSyncAllStandings();
      
      if (result.success) {
        res.json({ 
          message: "Groups synced successfully",
          timestamp: Date.now(),
          totalGroups: result.groupsSynced,
          syncedFromDatabase: true
        });
      } else {
        throw new Error(result.error || "Sync failed");
      }
    } catch (error) {
      console.error("Error syncing groups:", error);
      res.status(500).json({ message: "Failed to sync groups" });
    }
  });
}

// Helper function to update standings after a match
function updateStandingsAfterMatch(match: GroupResult) {
  const { groupName, team1, team2, team1Score, team2Score } = match;
  
  // Find standings for both teams
  let team1Standing = groupStandings.find(s => s.teamName === team1 && s.groupName === groupName);
  let team2Standing = groupStandings.find(s => s.teamName === team2 && s.groupName === groupName);
  
  // Create standings if they don't exist
  if (!team1Standing) {
    team1Standing = {
      teamName: team1,
      groupName,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      roundsWon: 0,
      roundsLost: 0,
      roundDifference: 0,
      points: 0,
      position: 1
    };
    groupStandings.push(team1Standing);
  }
  
  if (!team2Standing) {
    team2Standing = {
      teamName: team2,
      groupName,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      roundsWon: 0,
      roundsLost: 0,
      roundDifference: 0,
      points: 0,
      position: 1
    };
    groupStandings.push(team2Standing);
  }
  
  // Update match counts
  team1Standing.matchesPlayed++;
  team2Standing.matchesPlayed++;
  
  // Update rounds
  team1Standing.roundsWon += team1Score;
  team1Standing.roundsLost += team2Score;
  team2Standing.roundsWon += team2Score;
  team2Standing.roundsLost += team1Score;
  
  // Update round differences
  team1Standing.roundDifference = team1Standing.roundsWon - team1Standing.roundsLost;
  team2Standing.roundDifference = team2Standing.roundsWon - team2Standing.roundsLost;
  
  // Update wins/losses and points (CS2 BO1: 3 points for win, 0 for loss)
  if (team1Score > team2Score) {
    // Team1 wins
    team1Standing.wins++;
    team1Standing.points += 3;
    team2Standing.losses++;
  } else {
    // Team2 wins
    team2Standing.wins++;
    team2Standing.points += 3;
    team1Standing.losses++;
  }
}

// Helper function to recalculate positions within a group
function recalculatePositions(groupName: string) {
  const groupTeams = groupStandings
    .filter(s => s.groupName === groupName)
    .sort((a: any, b: any) => {
      if (a.points !== b.points) return b.points - a.points;
      if (a.roundDifference !== b.roundDifference) return b.roundDifference - a.roundDifference;
      return b.roundsWon - a.roundsWon;
    });

  groupTeams.forEach((team, index) => {
    team.position = index + 1;
  });
}