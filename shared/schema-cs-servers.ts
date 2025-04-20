import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const csServers = pgTable("cs_servers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ip: text("ip").notNull(),
  port: integer("port").notNull(),
  description: text("description"),
  max_players: integer("max_players").default(16),
  game_type: text("game_type"),
  map: text("map"),
  status: boolean("status").default(false),
  players: integer("players").default(0),
  ping: integer("ping").default(0),
  likes: integer("likes").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const insertCsServerSchema = createInsertSchema(csServers).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export type InsertCsServer = z.infer<typeof insertCsServerSchema>;
export type CsServer = typeof csServers.$inferSelect;