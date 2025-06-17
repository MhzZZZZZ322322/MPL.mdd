import { db } from "./db";
import { tournamentGroups, groupTeams, matches, teams } from "@shared/schema";
import { eq, and } from "drizzle-orm";

interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey?: string;
  serviceAccountEmail?: string;
  privateKey?: string;
}

interface GroupStanding {
  position: number;
  teamName: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  roundDiff: number;
  points: number;
  lastUpdated: string;
}

interface MatchResult {
  matchId: number;
  groupName: string;
  team1: string;
  team2: string;
  team1Score?: number;
  team2Score?: number;
  status: 'scheduled' | 'live' | 'completed';
  datePlayed?: string;
  notes?: string;
}

export class GoogleSheetsSync {
  private config: GoogleSheetsConfig;
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  /**
   * Sincronizează toate grupele și rezultatele din Google Sheets
   */
  async syncAllGroups(): Promise<void> {
    try {
      console.log('Începe sincronizarea cu Google Sheets...');
      
      // Citește rezultatele meciurilor
      const matchResults = await this.readMatchResults();
      
      // Procesează rezultatele și actualizează clasamentele
      await this.processMatchResults(matchResults);
      
      // Actualizează clasamentele pentru fiecare grupă
      for (const groupLetter of ['A', 'B', 'C', 'D', 'E', 'F', 'G']) {
        await this.updateGroupStandings(groupLetter);
      }
      
      console.log('Sincronizarea completă cu succes');
    } catch (error) {
      console.error('Eroare la sincronizarea cu Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Citește rezultatele meciurilor din sheet-ul "Matches_Results"
   */
  private async readMatchResults(): Promise<MatchResult[]> {
    if (!this.config.apiKey) {
      console.log('Nu există API key pentru Google Sheets, folosind date locale');
      return [];
    }

    try {
      const range = 'Matches_Results!A2:I1000'; // Skip header row
      const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}?key=${this.config.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const rows = data.values || [];
      
      return rows.map((row: any[], index: number) => ({
        matchId: parseInt(row[0]) || index + 1,
        groupName: row[1] || '',
        team1: row[2] || '',
        team2: row[3] || '',
        team1Score: row[4] ? parseInt(row[4]) : undefined,
        team2Score: row[5] ? parseInt(row[5]) : undefined,
        status: (row[6] || 'scheduled') as 'scheduled' | 'live' | 'completed',
        datePlayed: row[7] || undefined,
        notes: row[8] || undefined,
      }));
    } catch (error) {
      console.error('Eroare la citirea rezultatelor din Google Sheets:', error);
      return [];
    }
  }

  /**
   * Procesează rezultatele meciurilor și actualizează baza de date
   */
  private async processMatchResults(matchResults: MatchResult[]): Promise<void> {
    for (const match of matchResults) {
      if (match.status === 'completed' && match.team1Score !== undefined && match.team2Score !== undefined) {
        await this.updateMatchInDatabase(match);
      }
    }
  }

  /**
   * Actualizează un meci în baza de date
   */
  private async updateMatchInDatabase(match: MatchResult): Promise<void> {
    try {
      // Găsește echipele
      const [team1] = await db.select().from(teams).where(eq(teams.name, match.team1));
      const [team2] = await db.select().from(teams).where(eq(teams.name, match.team2));
      
      if (!team1 || !team2) {
        console.warn(`Echipe negăsite pentru meciul: ${match.team1} vs ${match.team2}`);
        return;
      }

      // Găsește grupa
      const groupLetter = match.groupName.replace('Group ', '');
      const [group] = await db.select().from(tournamentGroups).where(eq(tournamentGroups.groupName, groupLetter));
      
      if (!group) {
        console.warn(`Grupa negăsită: ${match.groupName}`);
        return;
      }

      // Verifică dacă meciul există deja
      const [existingMatch] = await db.select()
        .from(groupMatches)
        .where(
          and(
            eq(groupMatches.groupId, group.id),
            eq(groupMatches.team1Id, team1.id),
            eq(groupMatches.team2Id, team2.id)
          )
        );

      const matchData = {
        groupId: group.id,
        team1Id: team1.id,
        team2Id: team2.id,
        team1Score: match.team1Score,
        team2Score: match.team2Score,
        status: match.status,
        completedTime: match.datePlayed ? new Date(match.datePlayed) : new Date(),
        notes: match.notes,
        googleSheetsRowId: match.matchId.toString(),
      };

      if (existingMatch) {
        // Actualizează meciul existent
        await db.update(groupMatches)
          .set(matchData)
          .where(eq(groupMatches.id, existingMatch.id));
      } else {
        // Inserează meci nou
        await db.insert(groupMatches).values(matchData);
      }

      // Actualizează statisticile echipelor
      await this.updateTeamStats(group.id, team1.id, team2.id, match.team1Score!, match.team2Score!);
      
    } catch (error) {
      console.error(`Eroare la actualizarea meciului ${match.team1} vs ${match.team2}:`, error);
    }
  }

  /**
   * Actualizează statisticile echipelor după un meci
   */
  private async updateTeamStats(groupId: number, team1Id: number, team2Id: number, team1Score: number, team2Score: number): Promise<void> {
    // Calculează rezultatele
    const team1Won = team1Score > team2Score;
    const team2Won = team2Score > team1Score;
    const isDraw = team1Score === team2Score;

    // Actualizează echipa 1
    await this.updateSingleTeamStats(groupId, team1Id, {
      matchesPlayed: 1,
      wins: team1Won ? 1 : 0,
      draws: isDraw ? 1 : 0,
      losses: team2Won ? 1 : 0,
      roundsWon: team1Score,
      roundsLost: team2Score,
      points: team1Won ? 3 : (isDraw ? 1 : 0),
    });

    // Actualizează echipa 2
    await this.updateSingleTeamStats(groupId, team2Id, {
      matchesPlayed: 1,
      wins: team2Won ? 1 : 0,
      draws: isDraw ? 1 : 0,
      losses: team1Won ? 1 : 0,
      roundsWon: team2Score,
      roundsLost: team1Score,
      points: team2Won ? 3 : (isDraw ? 1 : 0),
    });
  }

  /**
   * Actualizează statisticile unei echipe
   */
  private async updateSingleTeamStats(groupId: number, teamId: number, stats: any): Promise<void> {
    const [existingTeam] = await db.select()
      .from(groupTeams)
      .where(and(eq(groupTeams.groupId, groupId), eq(groupTeams.teamId, teamId)));

    if (existingTeam) {
      // Actualizează statisticile existente (adaugă la cele actuale)
      await db.update(groupTeams)
        .set({
          matchesPlayed: existingTeam.matchesPlayed + stats.matchesPlayed,
          wins: existingTeam.wins + stats.wins,
          draws: existingTeam.draws + stats.draws,
          losses: existingTeam.losses + stats.losses,
          roundsWon: existingTeam.roundsWon + stats.roundsWon,
          roundsLost: existingTeam.roundsLost + stats.roundsLost,
          roundDifference: (existingTeam.roundsWon + stats.roundsWon) - (existingTeam.roundsLost + stats.roundsLost),
          points: existingTeam.points + stats.points,
          lastUpdated: new Date(),
        })
        .where(eq(groupTeams.id, existingTeam.id));
    } else {
      // Inserează echipa nouă în grupă
      await db.insert(groupTeams).values({
        groupId,
        teamId,
        matchesPlayed: stats.matchesPlayed,
        wins: stats.wins,
        draws: stats.draws,
        losses: stats.losses,
        roundsWon: stats.roundsWon,
        roundsLost: stats.roundsLost,
        roundDifference: stats.roundsWon - stats.roundsLost,
        points: stats.points,
        position: 1,
      });
    }
  }

  /**
   * Actualizează clasamentul unei grupe
   */
  private async updateGroupStandings(groupLetter: string): Promise<void> {
    const [group] = await db.select().from(tournamentGroups).where(eq(tournamentGroups.groupName, groupLetter));
    
    if (!group) return;

    // Obține toate echipele din grupă, ordonate după puncte și diferența de runde
    const standings = await db.select({
      id: groupTeams.id,
      teamId: groupTeams.teamId,
      points: groupTeams.points,
      roundDifference: groupTeams.roundDifference,
      roundsWon: groupTeams.roundsWon,
    })
    .from(groupTeams)
    .where(eq(groupTeams.groupId, group.id))
    .orderBy(groupTeams.points, groupTeams.roundDifference, groupTeams.roundsWon);

    // Actualizează pozițiile
    for (let i = 0; i < standings.length; i++) {
      await db.update(groupTeams)
        .set({ position: i + 1 })
        .where(eq(groupTeams.id, standings[i].id));
    }
  }
}

// Instanța globală pentru sincronizare
let googleSheetsSync: GoogleSheetsSync | null = null;

/**
 * Inițializează sincronizarea cu Google Sheets
 */
export function initializeGoogleSheetsSync(): void {
  const config: GoogleSheetsConfig = {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '',
    apiKey: process.env.GOOGLE_SHEETS_API_KEY,
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  googleSheetsSync = new GoogleSheetsSync(config);

  // Sincronizare automată la fiecare minut
  setInterval(async () => {
    if (googleSheetsSync) {
      try {
        await googleSheetsSync.syncAllGroups();
      } catch (error) {
        console.error('Eroare la sincronizarea automată:', error);
      }
    }
  }, 60000); // 60 secunde

  console.log('Sincronizarea automată cu Google Sheets a fost inițializată');
}

/**
 * Sincronizare manuală
 */
export async function syncNow(): Promise<void> {
  if (googleSheetsSync) {
    await googleSheetsSync.syncAllGroups();
  } else {
    throw new Error('Sincronizarea Google Sheets nu a fost inițializată');
  }
}