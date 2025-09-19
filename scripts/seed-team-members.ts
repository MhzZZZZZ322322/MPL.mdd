#!/usr/bin/env tsx
import 'dotenv/config';
import { db } from '../server/db';
import { teams, teamMembers } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';
import fs from 'fs';

/*
  Seed logic:
  1. Parse team_members_sql.sql lines.
  2. Collect teamIds and member rows.
  3. Ensure each teamId exists in teams table; create placeholder if not.
  4. Insert member if (teamId,nickname) not already present.
*/

const SQL_FILE = 'team_members_sql.sql';

interface ParsedRow { teamId: number; nickname: string; faceit: string; role: string; position: string; }

function parse(): ParsedRow[] {
  if (!fs.existsSync(SQL_FILE)) {
    console.error(`Seed file ${SQL_FILE} not found.`);
    process.exit(1);
  }
  const lines = fs.readFileSync(SQL_FILE, 'utf8').split(/\r?\n/).filter(l => l.trim());
  const rows: ParsedRow[] = [];
  const regex = /INSERT INTO team_members \(team_id, nickname, faceit_profile, role, position\) VALUES \((\d+), '([^']+)', '([^']+)', '([^']+)', '([^']+)'\);/;
  for (const line of lines) {
    const m = line.match(regex);
    if (!m) continue;
    rows.push({
      teamId: Number(m[1]),
      nickname: m[2],
      faceit: m[3],
      role: m[4],
      position: m[5],
    });
  }
  return rows;
}

async function ensureTeams(teamIds: number[]) {
  for (const id of teamIds) {
    const existing = await db.select().from(teams).where(eq(teams.id, id));
    if (existing.length === 0) {
      // Insert placeholder team with deterministic name
      await db.insert(teams).values({
        // @ts-ignore drizzle will ignore id if serial; we want explicit id so we may need raw SQL if not allowed
        id,
        name: `Team ${id}`,
        logoUrl: `https://placehold.co/200x200?text=Team+${id}`,
        tournament: 'hator-cs-league',
        isActive: true,
        isDirectInvite: false,
      }).catch(err => {
        console.warn(`Could not insert team ${id}:`, err.message);
      });
    }
  }
}

async function seedMembers(rows: ParsedRow[]) {
  let inserted = 0;
  for (const r of rows) {
    const existing = await db.select().from(teamMembers)
      .where(eq(teamMembers.teamId, r.teamId));
    // Check duplicate nickname in that team
    if (existing.some(e => e.nickname === r.nickname)) continue;

    await db.insert(teamMembers).values({
      teamId: r.teamId,
      nickname: r.nickname,
      faceitProfile: r.faceit,
      role: r.role as any,
      position: r.position as any,
      isActive: true,
    }).catch(err => {
      console.warn(`Skip member ${r.nickname} (team ${r.teamId}): ${err.message}`);
    });
    inserted++;
  }
  return inserted;
}

(async () => {
  try {
    const rows = parse();
    const teamIds = Array.from(new Set(rows.map(r => r.teamId))).sort((a,b)=>a-b);
    console.log(`Parsed ${rows.length} member rows for ${teamIds.length} teams.`);
    await ensureTeams(teamIds);
    const inserted = await seedMembers(rows);
    console.log(`Seed complete. Inserted ${inserted} new members.`);
    process.exit(0);
  } catch (err:any) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
})();
