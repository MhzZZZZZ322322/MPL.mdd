import type { Express } from "express";
import { db } from "./db";
import { teams, tournamentGroups, groupTeams, matches } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export function registerAdminRoutes(app: Express) {
  // Initialize tournament groups with all teams
  app.post("/api/admin/initialize-groups", async (req, res) => {
    try {
      // First, get all active teams
      const allTeams = await db.select().from(teams).where(eq(teams.isActive, true));
      
      if (allTeams.length === 0) {
        return res.status(400).json({ message: "No active teams found" });
      }

      // Create 7 groups (A-G)
      const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      const createdGroups = [];

      for (const groupName of groupNames) {
        // Check if group already exists
        const existingGroup = await db.select()
          .from(tournamentGroups)
          .where(eq(tournamentGroups.groupName, groupName));

        let group;
        if (existingGroup.length === 0) {
          const [newGroup] = await db.insert(tournamentGroups).values({
            groupName,
            groupDisplayName: `Group ${groupName}`,
            tournament: "hator-cs-league",
            isActive: true,
          }).returning();
          group = newGroup;
        } else {
          group = existingGroup[0];
        }
        createdGroups.push(group);
      }

      // Assign teams to groups (6 teams per group, 7 for last group)
      let teamIndex = 0;
      for (let groupIndex = 0; groupIndex < createdGroups.length; groupIndex++) {
        const group = createdGroups[groupIndex];
        const teamsInGroup = groupIndex === 6 ? 7 : 6; // Last group gets 7 teams
        
        for (let i = 0; i < teamsInGroup && teamIndex < allTeams.length; i++) {
          const team = allTeams[teamIndex];
          
          // Check if team is already in this group
          const existingGroupTeam = await db.select()
            .from(groupTeams)
            .where(and(
              eq(groupTeams.groupId, group.id),
              eq(groupTeams.teamId, team.id)
            ));

          if (existingGroupTeam.length === 0) {
            await db.insert(groupTeams).values({
              groupId: group.id,
              teamId: team.id,
              matchesPlayed: 0,
              wins: 0,
              draws: 0,
              losses: 0,
              roundsWon: 0,
              roundsLost: 0,
              roundDifference: 0,
              points: 0,
              position: i + 1,
            });
          }
          
          teamIndex++;
        }
      }

      res.json({ 
        message: "Groups initialized successfully", 
        groupsCreated: createdGroups.length,
        teamsAssigned: teamIndex 
      });
    } catch (error) {
      console.error("Error initializing groups:", error);
      res.status(500).json({ message: "Failed to initialize groups" });
    }
  });

  // Add match result and update standings
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

      // Find the group
      const [group] = await db.select()
        .from(tournamentGroups)
        .where(eq(tournamentGroups.groupName, groupName));

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Find the teams
      const [teamA] = await db.select().from(teams).where(eq(teams.name, team1));
      const [teamB] = await db.select().from(teams).where(eq(teams.name, team2));

      if (!teamA || !teamB) {
        return res.status(404).json({ message: "One or both teams not found" });
      }

      // Record the match
      await db.insert(matches).values({
        groupId: group.id,
        team1Id: teamA.id,
        team2Id: teamB.id,
        team1Score,
        team2Score,
        status: "completed",
        datePlayed: new Date(),
        notes: `Admin entry: ${team1} ${team1Score}-${team2Score} ${team2}`,
      });

      // Update team statistics
      const team1Wins = team1Score > team2Score ? 1 : 0;
      const team1Losses = team1Score < team2Score ? 1 : 0;
      const team1Points = team1Wins * 3; // 3 points for win, 0 for loss

      const team2Wins = team2Score > team1Score ? 1 : 0;
      const team2Losses = team2Score < team1Score ? 1 : 0;
      const team2Points = team2Wins * 3;

      // Update team A statistics
      await db.update(groupTeams)
        .set({
          matchesPlayed: sql`matches_played + 1`,
          wins: sql`wins + ${team1Wins}`,
          losses: sql`losses + ${team1Losses}`,
          roundsWon: sql`rounds_won + ${team1Score}`,
          roundsLost: sql`rounds_lost + ${team2Score}`,
          roundDifference: sql`round_difference + ${team1Score - team2Score}`,
          points: sql`points + ${team1Points}`,
          lastUpdated: new Date(),
        })
        .where(and(
          eq(groupTeams.groupId, group.id),
          eq(groupTeams.teamId, teamA.id)
        ));

      // Update team B statistics
      await db.update(groupTeams)
        .set({
          matchesPlayed: sql`matches_played + 1`,
          wins: sql`wins + ${team2Wins}`,
          losses: sql`losses + ${team2Losses}`,
          roundsWon: sql`rounds_won + ${team2Score}`,
          roundsLost: sql`rounds_lost + ${team1Score}`,
          roundDifference: sql`round_difference + ${team2Score - team1Score}`,
          points: sql`points + ${team2Points}`,
          lastUpdated: new Date(),
        })
        .where(and(
          eq(groupTeams.groupId, group.id),
          eq(groupTeams.teamId, teamB.id)
        ));

      // Recalculate positions for the group
      await recalculateGroupPositions(group.id);

      res.json({ 
        message: "Match result added successfully",
        match: {
          team1,
          team2,
          team1Score,
          team2Score,
          winner: team1Score > team2Score ? team1 : team2
        }
      });
    } catch (error) {
      console.error("Error adding match result:", error);
      res.status(500).json({ message: "Failed to add match result" });
    }
  });

  // Get current group standings
  app.get("/api/admin/group-standings", async (req, res) => {
    try {
      const standings = await db.select({
        groupName: tournamentGroups.groupName,
        groupDisplayName: tournamentGroups.groupDisplayName,
        teamName: teams.name,
        teamLogo: teams.logoUrl,
        matchesPlayed: groupTeams.matchesPlayed,
        wins: groupTeams.wins,
        draws: groupTeams.draws,
        losses: groupTeams.losses,
        roundsWon: groupTeams.roundsWon,
        roundsLost: groupTeams.roundsLost,
        roundDifference: groupTeams.roundDifference,
        points: groupTeams.points,
        position: groupTeams.position,
        lastUpdated: groupTeams.lastUpdated,
      })
      .from(groupTeams)
      .innerJoin(teams, eq(groupTeams.teamId, teams.id))
      .innerJoin(tournamentGroups, eq(groupTeams.groupId, tournamentGroups.id))
      .where(eq(tournamentGroups.isActive, true));

      res.json(standings);
    } catch (error) {
      console.error("Error fetching group standings:", error);
      res.status(500).json({ message: "Failed to fetch group standings" });
    }
  });

  // Reset tournament (clear all results)
  app.post("/api/admin/reset-tournament", async (req, res) => {
    try {
      // Delete all matches
      await db.delete(matches);

      // Reset all group team statistics
      await db.update(groupTeams).set({
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        roundsWon: 0,
        roundsLost: 0,
        roundDifference: 0,
        points: 0,
        position: 1,
        lastUpdated: new Date(),
      });

      res.json({ message: "Tournament reset successfully" });
    } catch (error) {
      console.error("Error resetting tournament:", error);
      res.status(500).json({ message: "Failed to reset tournament" });
    }
  });
}

// Helper function to recalculate group positions
async function recalculateGroupPositions(groupId: number) {
  const groupTeamsData = await db.select()
    .from(groupTeams)
    .where(eq(groupTeams.groupId, groupId))
    .orderBy(
      sql`points DESC`,
      sql`round_difference DESC`, 
      sql`rounds_won DESC`
    );

  for (let i = 0; i < groupTeamsData.length; i++) {
    await db.update(groupTeams)
      .set({ position: i + 1 })
      .where(eq(groupTeams.id, groupTeamsData[i].id));
  }
}