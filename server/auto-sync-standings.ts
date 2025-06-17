import { db } from "./db";
import { matchResults, groupStandings, groupConfiguration } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Auto-sync all standings after any match result change
export async function autoSyncAllStandings() {
  try {
    console.log("Starting auto-sync of all group standings...");
    
    const configs = await db.select().from(groupConfiguration);
    let syncedGroups = 0;
    
    for (const config of configs) {
      await syncGroupStandings(config.groupName);
      syncedGroups++;
    }
    
    console.log(`Auto-sync completed: ${syncedGroups} groups synchronized`);
    return { success: true, groupsSynced: syncedGroups };
  } catch (error) {
    console.error("Error in auto-sync:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// Sync specific group standings based on match results
async function syncGroupStandings(groupName: string) {
  try {
    // Get all matches for this group
    const matches = await db
      .select()
      .from(matchResults)
      .where(eq(matchResults.groupName, groupName));

    // Get all teams in this group
    const teams = await db
      .select()
      .from(groupStandings)
      .where(eq(groupStandings.groupName, groupName));

    // Create standings map
    const standingsMap = new Map();
    
    // Initialize all teams with zero stats
    teams.forEach(team => {
      standingsMap.set(team.teamName, {
        matches: 0,
        wins: 0,
        losses: 0,
        roundsWon: 0,
        roundsLost: 0,
        points: 0
      });
    });

    // Process all matches
    matches.forEach(match => {
      const team1Stats = standingsMap.get(match.team1Name);
      const team2Stats = standingsMap.get(match.team2Name);
      
      if (team1Stats && team2Stats) {
        // Update match counts
        team1Stats.matches++;
        team2Stats.matches++;
        
        // Update rounds
        team1Stats.roundsWon += match.team1Score;
        team1Stats.roundsLost += match.team2Score;
        team2Stats.roundsWon += match.team2Score;
        team2Stats.roundsLost += match.team1Score;
        
        // Update wins/losses and points (CS2 BO1: 3 points for win, 0 for loss)
        if (match.team1Score > match.team2Score) {
          team1Stats.wins++;
          team2Stats.losses++;
          team1Stats.points += 3;
        } else {
          team2Stats.wins++;
          team1Stats.losses++;
          team2Stats.points += 3;
        }
      }
    });

    // Convert to array and sort by points, then round difference
    const sortedStandings = Array.from(standingsMap.entries())
      .map(([teamName, stats]) => ({
        teamName,
        stats: {
          ...stats,
          roundDifference: stats.roundsWon - stats.roundsLost
        }
      }))
      .sort((a, b) => {
        if (b.stats.points !== a.stats.points) {
          return b.stats.points - a.stats.points;
        }
        return b.stats.roundDifference - a.stats.roundDifference;
      });

    // Update database with new standings - ALWAYS reset to match database exactly
    for (let i = 0; i < sortedStandings.length; i++) {
      const { teamName, stats } = sortedStandings[i];
      
      await db
        .update(groupStandings)
        .set({
          matchesPlayed: stats.matches,
          wins: stats.wins,
          losses: stats.losses,
          roundsWon: stats.roundsWon,
          roundsLost: stats.roundsLost,
          roundDifference: stats.roundDifference,
          points: stats.points,
          position: i + 1,
          lastUpdated: new Date()
        })
        .where(
          and(
            eq(groupStandings.groupName, groupName),
            eq(groupStandings.teamName, teamName)
          )
        );
    }

    console.log(`Synchronized standings for group ${groupName}: ${sortedStandings.length} teams`);
  } catch (error) {
    console.error(`Error syncing group ${groupName}:`, error);
    throw error;
  }
}