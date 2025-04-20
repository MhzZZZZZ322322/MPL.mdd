import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const csServers = pgTable("cs_servers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ip: text("ip").notNull(),
  port: integer("port").notNull(),
  location: text("location").notNull(),
  mode: text("mode").notNull(),
  status: boolean("status").default(false),
  players: integer("players").default(0),
  maxPlayers: integer("max_players").default(16),
  likes: integer("likes").default(0),
});

export const insertCsServerSchema = createInsertSchema(csServers).omit({
  id: true,
});

export type InsertCsServer = z.infer<typeof insertCsServerSchema>;
export type CsServer = typeof csServers.$inferSelect;