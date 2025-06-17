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
      if (team1Score < 16 && team2Score < 16) {
        return res.status(400).json({ message: "In CS2, one team must win at least 16 rounds" });
      }

      if (team1Score >= 16 && team2Score >= 16) {
        return res.status(400).json({ message: "Both teams cannot have 16+ rounds in CS2" });
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

  // Get tournament groups for public display
  app.get("/api/tournament-groups", (req, res) => {
    try {
      if (groupConfiguration.length === 0) {
        // Fallback to automatic distribution if no manual config exists
        const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(groupName => {
          const teams = groupStandings
            .filter(s => s.groupName === groupName)
            .sort((a, b) => {
              if (a.points !== b.points) return b.points - a.points;
              if (a.roundDifference !== b.roundDifference) return b.roundDifference - a.roundDifference;
              return b.roundsWon - a.roundsWon;
            })
            .map((standing, index) => ({
              id: index + 1,
              teamId: index + 1,
              teamName: standing.teamName,
              teamLogo: `/team-logos/${standing.teamName.toLowerCase().replace(/\s+/g, '-')}.webp`,
              matchesPlayed: standing.matchesPlayed,
              wins: standing.wins,
              draws: 0, // CS2 doesn't have draws
              losses: standing.losses,
              roundsWon: standing.roundsWon,
              roundsLost: standing.roundsLost,
              roundDifference: standing.roundDifference,
              points: standing.points,
              position: index + 1,
              lastUpdated: new Date().toISOString(),
            }));

          return {
            id: groupName.charCodeAt(0) - 64, // A=1, B=2, etc.
            groupName,
            groupDisplayName: `Group ${groupName}`,
            tournament: "hator-cs-league",
            isActive: true,
            teams,
          };
        });
        return res.json(groups);
      }

      // Use manual configuration
      const groups = groupConfiguration.map(group => {
        const teams = group.teams.map((team: any, index: number) => {
          const standing = groupStandings.find(s => s.teamName === team.name && s.groupName === group.groupName);
          return {
            id: team.id,
            teamId: team.id,
            teamName: team.name,
            teamLogo: team.logoUrl,
            matchesPlayed: standing?.matchesPlayed || 0,
            wins: standing?.wins || 0,
            draws: 0,
            losses: standing?.losses || 0,
            roundsWon: standing?.roundsWon || 0,
            roundsLost: standing?.roundsLost || 0,
            roundDifference: standing?.roundDifference || 0,
            points: standing?.points || 0,
            position: standing?.position || index + 1,
            lastUpdated: new Date().toISOString(),
          };
        });

        // Sort teams by performance
        teams.sort((a, b) => {
          if (a.points !== b.points) return b.points - a.points;
          if (a.roundDifference !== b.roundDifference) return b.roundDifference - a.roundDifference;
          return b.roundsWon - a.roundsWon;
        });

        return {
          id: group.groupName.charCodeAt(0) - 64,
          groupName: group.groupName,
          groupDisplayName: group.displayName,
          tournament: "hator-cs-league",
          isActive: true,
          teams,
        };
      });

      res.json(groups);
    } catch (error) {
      console.error("Error fetching tournament groups:", error);
      res.status(500).json({ message: "Failed to fetch tournament groups" });
    }
  });
}

// Helper function to recalculate positions within a group
function recalculatePositions(groupName: string) {
  const groupTeams = groupStandings
    .filter(s => s.groupName === groupName)
    .sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      if (a.roundDifference !== b.roundDifference) return b.roundDifference - a.roundDifference;
      return b.roundsWon - a.roundsWon;
    });

  groupTeams.forEach((team, index) => {
    team.position = index + 1;
  });
}