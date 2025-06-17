import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Event schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull().default(""),
  platform: text("platform").notNull().default(""),
  teamSize: text("team_size").notNull().default(""),
  prize: text("prize").notNull().default(""),
  status: text("status").notNull().default("upcoming"),
  imageUrl: text("image_url").notNull().default(""),
  registrationLink: text("registration_link").default(""),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Player schema
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  nickname: text("nickname").notNull(),
  realName: text("real_name").notNull(),
  team: text("team").notNull(),
  game: text("game").notNull(),
  score: integer("score").notNull().default(0),
  country: text("country").default("Moldova"),
  profileImage: text("profile_image").notNull().default(""),
  socialLinks: text("social_links").default(""),
  achievements: text("achievements").default(""),
  stats: text("stats").default(""),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

// Contact submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactSubmissions.$inferSelect;

// FAQ schema
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").notNull(),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;

// SEO schema
export const seoSettings = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  pageUrl: text("page_url").notNull().unique(),
  title: text("title").notNull(),
  metaDescription: text("meta_description").notNull(),
  metaKeywords: text("meta_keywords").default(""),
  metaRobots: text("meta_robots").default("index, follow"),
  canonicalUrl: text("canonical_url").default(""),
  structuredData: text("structured_data").default(""),
  openGraph: text("open_graph").default(""),
  twitterCard: text("twitter_card").default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSeoSchema = createInsertSchema(seoSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSeo = z.infer<typeof insertSeoSchema>;
export type SeoSettings = typeof seoSettings.$inferSelect;

// Analytics settings schema
export const analyticsSettings = pgTable("analytics_settings", {
  id: serial("id").primaryKey(),
  googleTagManagerId: text("google_tag_manager_id").default(""),
  googleAnalyticsId: text("google_analytics_id").default(""),
  googleSearchConsoleVerification: text("google_search_console_verification").default(""),
  facebookPixelId: text("facebook_pixel_id").default(""),
  robotsTxt: text("robots_txt").default("User-agent: *\nAllow: /"),
  sitemapXml: text("sitemap_xml").default(""),
  customHeaderScripts: text("custom_header_scripts").default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAnalyticsSchema = createInsertSchema(analyticsSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type AnalyticsSettings = typeof analyticsSettings.$inferSelect;

// Teams schema
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  tournament: text("tournament").notNull().default("hator-cs-league"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

// Team members schema
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  nickname: text("nickname").notNull(),
  faceitProfile: text("faceit_profile").notNull(),
  role: text("role").notNull().default("player"), // player, captain, coach
  position: text("position").notNull().default("main"), // main, reserve
  isActive: boolean("is_active").notNull().default(true),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

// Tournament Groups - Grupele de turneu
export const tournamentGroups = pgTable("tournament_groups", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, etc.
  groupDisplayName: text("group_display_name").notNull(), // Group A, Group B, etc.
  tournament: text("tournament").notNull().default("hator-cs-league"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Group Teams - Echipele din grupe cu statistici
export const groupTeams = pgTable("group_teams", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  teamId: integer("team_id").notNull(),
  matchesPlayed: integer("matches_played").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  draws: integer("draws").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  roundsWon: integer("rounds_won").notNull().default(0),
  roundsLost: integer("rounds_lost").notNull().default(0),
  roundDifference: integer("round_difference").notNull().default(0),
  points: integer("points").notNull().default(0),
  position: integer("position").notNull().default(1),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Matches - Meciurile din turneu
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  team1Id: integer("team1_id").notNull(),
  team2Id: integer("team2_id").notNull(),
  team1Score: integer("team1_score").default(0),
  team2Score: integer("team2_score").default(0),
  status: text("status").notNull().default("scheduled"), // scheduled, live, completed
  datePlayed: timestamp("date_played"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas pentru inserare
export const insertTournamentGroupSchema = createInsertSchema(tournamentGroups).omit({
  id: true,
  createdAt: true,
});

export const insertGroupTeamSchema = createInsertSchema(groupTeams).omit({
  id: true,
  lastUpdated: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertTournamentGroup = z.infer<typeof insertTournamentGroupSchema>;
export type TournamentGroup = typeof tournamentGroups.$inferSelect;

export type InsertGroupTeam = z.infer<typeof insertGroupTeamSchema>;
export type GroupTeam = typeof groupTeams.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
