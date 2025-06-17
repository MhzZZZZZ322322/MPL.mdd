import type { Express } from "express";
import { db } from "./db";
import { teams, matchResults, groupStandings, groupConfiguration } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

// Helper function to check if two teams have already played against each other
async function teamsHavePlayedBefore(team1: string, team2: string, groupName: string): Promise<boolean> {
  const matches = await db.select().from(matchResults).where(
    and(
      eq(matchResults.groupName, groupName),
      // Check both combinations: team1 vs team2 and team2 vs team1
      eq(matchResults.team1Name, team1),
      eq(matchResults.team2Name, team2)
    )
  );
  
  const reverseMatches = await db.select().from(matchResults).where(
    and(
      eq(matchResults.groupName, groupName),
      eq(matchResults.team1Name, team2),
      eq(matchResults.team2Name, team1)
    )
  );
  
  return matches.length > 0 || reverseMatches.length > 0;
}

// Helper function to get maximum matches per team in a group
async function getMaxMatchesPerTeam(groupName: string): Promise<number> {
  const standings = await db.select().from(groupStandings).where(
    eq(groupStandings.groupName, groupName)
  );
  const teamsInGroup = standings.length;
  return Math.max(0, teamsInGroup - 1); // Each team plays against every other team once
}

// Helper function to update standings after a match
async function updateStandingsAfterMatch(matchData: {
  groupName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
}) {
  const { groupName, team1Name, team2Name, team1Score, team2Score } = matchData;
  
  // Get or create standings for both teams
  let team1Standing = await db.select().from(groupStandings).where(
    and(
      eq(groupStandings.teamName, team1Name),
      eq(groupStandings.groupName, groupName)
    )
  );
  
  let team2Standing = await db.select().from(groupStandings).where(
    and(
      eq(groupStandings.teamName, team2Name),
      eq(groupStandings.groupName, groupName)
    )
  );
  
  // Create standings if they don't exist
  if (team1Standing.length === 0) {
    await db.insert(groupStandings).values({
      teamName: team1Name,
      groupName,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      roundsWon: 0,
      roundsLost: 0,
      roundDifference: 0,
      points: 0,
      position: 1,
    });
    team1Standing = await db.select().from(groupStandings).where(
      and(
        eq(groupStandings.teamName, team1Name),
        eq(groupStandings.groupName, groupName)
      )
    );
  }
  
  if (team2Standing.length === 0) {
    await db.insert(groupStandings).values({
      teamName: team2Name,
      groupName,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      roundsWon: 0,
      roundsLost: 0,
      roundDifference: 0,
      points: 0,
      position: 1,
    });
    team2Standing = await db.select().from(groupStandings).where(
      and(
        eq(groupStandings.teamName, team2Name),
        eq(groupStandings.groupName, groupName)
      )
    );
  }
  
  const team1Stats = team1Standing[0];
  const team2Stats = team2Standing[0];
  
  // Calculate new statistics
  const team1Wins = team1Score > team2Score ? 1 : 0;
  const team1Losses = team1Score < team2Score ? 1 : 0;
  const team1Points = team1Wins * 3; // 3 points for win
  
  const team2Wins = team2Score > team1Score ? 1 : 0;
  const team2Losses = team2Score < team1Score ? 1 : 0;
  const team2Points = team2Wins * 3;
  
  // Update team1 stats
  await db.update(groupStandings)
    .set({
      matchesPlayed: team1Stats.matchesPlayed + 1,
      wins: team1Stats.wins + team1Wins,
      losses: team1Stats.losses + team1Losses,
      roundsWon: team1Stats.roundsWon + team1Score,
      roundsLost: team1Stats.roundsLost + team2Score,
      roundDifference: (team1Stats.roundsWon + team1Score) - (team1Stats.roundsLost + team2Score),
      points: team1Stats.points + team1Points,
      lastUpdated: new Date(),
    })
    .where(eq(groupStandings.id, team1Stats.id));
  
  // Update team2 stats
  await db.update(groupStandings)
    .set({
      matchesPlayed: team2Stats.matchesPlayed + 1,
      wins: team2Stats.wins + team2Wins,
      losses: team2Stats.losses + team2Losses,
      roundsWon: team2Stats.roundsWon + team2Score,
      roundsLost: team2Stats.roundsLost + team1Score,
      roundDifference: (team2Stats.roundsWon + team2Score) - (team2Stats.roundsLost + team1Score),
      points: team2Stats.points + team2Points,
      lastUpdated: new Date(),
    })
    .where(eq(groupStandings.id, team2Stats.id));
}

// Helper function to recalculate positions within a group
async function recalculatePositions(groupName: string) {
  const standings = await db.select().from(groupStandings)
    .where(eq(groupStandings.groupName, groupName))
    .orderBy(
      desc(groupStandings.points),
      desc(groupStandings.roundDifference),
      desc(groupStandings.roundsWon)
    );
  
  // Update positions
  for (let i = 0; i < standings.length; i++) {
    await db.update(groupStandings)
      .set({ position: i + 1 })
      .where(eq(groupStandings.id, standings[i].id));
  }
}

export function registerTournamentDatabaseAPI(app: Express) {
  
  // Add match result with full database persistence
  app.post("/api/admin/add-match-result", async (req, res) => {
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
      if (await teamsHavePlayedBefore(team1, team2, groupName)) {
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
      const maxMatches = await getMaxMatchesPerTeam(groupName);
      
      const team1Matches = await db.select().from(matchResults).where(
        and(
          eq(matchResults.groupName, groupName),
          // Count matches where team1 is either team1Name or team2Name
        )
      );
      
      const team1MatchCount = await db.select().from(matchResults).where(
        and(
          eq(matchResults.groupName, groupName),
          eq(matchResults.team1Name, team1)
        )
      ).then(matches1 => 
        db.select().from(matchResults).where(
          and(
            eq(matchResults.groupName, groupName),
            eq(matchResults.team2Name, team1)
          )
        ).then(matches2 => matches1.length + matches2.length)
      );
      
      const team2MatchCount = await db.select().from(matchResults).where(
        and(
          eq(matchResults.groupName, groupName),
          eq(matchResults.team1Name, team2)
        )
      ).then(matches1 => 
        db.select().from(matchResults).where(
          and(
            eq(matchResults.groupName, groupName),
            eq(matchResults.team2Name, team2)
          )
        ).then(matches2 => matches1.length + matches2.length)
      );

      if (team1MatchCount >= maxMatches) {
        return res.status(400).json({ 
          message: `Echipa ${team1} a jucat deja toate cele ${maxMatches} meciuri posibile în grupa ${groupName}` 
        });
      }

      if (team2MatchCount >= maxMatches) {
        return res.status(400).json({ 
          message: `Echipa ${team2} a jucat deja toate cele ${maxMatches} meciuri posibile în grupa ${groupName}` 
        });
      }

      // Determine winner
      const winnerId = team1Score > team2Score ? 
        (await db.select().from(teams).where(eq(teams.name, team1)))[0]?.id :
        (await db.select().from(teams).where(eq(teams.name, team2)))[0]?.id;

      // Add the match result to database
      const [matchResult] = await db.insert(matchResults).values({
        groupName,
        team1Name: team1,
        team2Name: team2,
        team1Score,
        team2Score,
        winnerId,
      }).returning();

      // Update standings
      await updateStandingsAfterMatch({
        groupName,
        team1Name: team1,
        team2Name: team2,
        team1Score,
        team2Score
      });

      // Recalculate positions
      await recalculatePositions(groupName);

      const updatedStandings = await db.select().from(groupStandings).where(
        eq(groupStandings.groupName, groupName)
      );

      res.json({ 
        message: "Rezultatul meciului a fost înregistrat cu succes în baza de date",
        match: matchResult,
        standings: updatedStandings
      });

    } catch (error) {
      console.error("Error adding match result:", error);
      res.status(500).json({ message: "Failed to add match result to database" });
    }
  });

  // Get match history for a group
  app.get("/api/admin/group-matches/:groupName", async (req, res) => {
    try {
      const { groupName } = req.params;
      const matches = await db.select().from(matchResults)
        .where(eq(matchResults.groupName, groupName))
        .orderBy(desc(matchResults.createdAt));
      res.json(matches);
    } catch (error) {
      console.error("Error fetching group matches:", error);
      res.status(500).json({ message: "Failed to fetch group matches" });
    }
  });

  // Get standings with database persistence
  app.get("/api/admin/group-standings", async (req, res) => {
    try {
      const standings = await db.select().from(groupStandings)
        .orderBy(
          groupStandings.groupName,
          groupStandings.position
        );
      res.json(standings);
    } catch (error) {
      console.error("Error fetching group standings:", error);
      res.status(500).json({ message: "Failed to fetch group standings" });
    }
  });

  // Save group configuration to database
  app.post("/api/admin/save-group-config", async (req, res) => {
    try {
      const { groups } = req.body;

      // Clear existing configuration
      await db.delete(groupConfiguration);
      await db.delete(groupStandings);

      // Save new configuration
      for (const group of groups) {
        await db.insert(groupConfiguration).values({
          groupName: group.groupName,
          displayName: group.displayName,
          teamIds: JSON.stringify(group.teams.map((t: any) => t.id)),
        });

        // Create initial standings for teams in this group
        for (let i = 0; i < group.teams.length; i++) {
          const team = group.teams[i];
          await db.insert(groupStandings).values({
            teamName: team.name,
            groupName: group.groupName,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            roundsWon: 0,
            roundsLost: 0,
            roundDifference: 0,
            points: 0,
            position: i + 1,
          });
        }
      }

      res.json({ message: "Group configuration saved to database successfully" });
    } catch (error) {
      console.error("Error saving group config:", error);
      res.status(500).json({ message: "Failed to save group config to database" });
    }
  });

  // Get group configuration from database
  app.get("/api/admin/group-config", async (req, res) => {
    try {
      const configs = await db.select().from(groupConfiguration)
        .orderBy(groupConfiguration.groupName);
      
      const groupsWithTeams = await Promise.all(
        configs.map(async (config) => {
          const teamIds = JSON.parse(config.teamIds);
          const teamsData = await Promise.all(
            teamIds.map(async (id: number) => {
              const [team] = await db.select().from(teams).where(eq(teams.id, id));
              return team;
            })
          );
          
          return {
            groupName: config.groupName,
            displayName: config.displayName,
            teams: teamsData.filter(Boolean),
          };
        })
      );
      
      res.json(groupsWithTeams);
    } catch (error) {
      console.error("Error fetching group config:", error);
      res.status(500).json({ message: "Failed to fetch group config" });
    }
  });

  // Reset tournament - clear all match results and standings
  app.post("/api/admin/reset-tournament", async (req, res) => {
    try {
      await db.delete(matchResults);
      await db.delete(groupStandings);
      await db.delete(groupConfiguration);

      res.json({ message: "Tournament reset successfully - all data cleared from database" });
    } catch (error) {
      console.error("Error resetting tournament:", error);
      res.status(500).json({ message: "Failed to reset tournament" });
    }
  });
}