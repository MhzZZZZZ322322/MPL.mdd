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

// Scheduled Matches - Meciurile programate cu link-uri Faceit
export const scheduledMatches = pgTable("scheduled_matches", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, etc.
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  faceitUrl: text("faceit_url"), // Link-ul către room-ul Faceit
  matchDate: timestamp("match_date").notNull(),
  matchTime: text("match_time").notNull(), // "18:00", "18:45", etc.
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  isPlayed: boolean("is_played").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Match Results - Rezultatele meciurilor
export const matchResults = pgTable("match_results", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, etc.
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  team1Score: integer("team1_score").notNull(),
  team2Score: integer("team2_score").notNull(),
  winnerId: integer("winner_id"), // ID-ul echipei câștigătoare
  streamUrl: text("stream_url"), // Link-ul către stream
  technicalWin: boolean("technical_win").notNull().default(false), // Câștig tehnic
  technicalWinner: text("technical_winner"), // Numele echipei care a câștigat tehnic
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  matchDate: timestamp("match_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Group Configuration - Configurația grupelor
export const groupConfiguration = pgTable("group_configuration", {
  id: serial("id").primaryKey(),
  groupName: text("group_name").notNull(), // A, B, C, etc.
  displayName: text("display_name").notNull(), // Group A, Group B, etc.
  teamIds: text("team_ids").notNull(), // JSON array cu ID-urile echipelor
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Group Standings - Clasamentele grupelor
export const groupStandings = pgTable("group_standings", {
  id: serial("id").primaryKey(),
  teamName: text("team_name").notNull(),
  groupName: text("group_name").notNull(),
  matchesPlayed: integer("matches_played").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  roundsWon: integer("rounds_won").notNull().default(0),
  roundsLost: integer("rounds_lost").notNull().default(0),
  roundDifference: integer("round_difference").notNull().default(0),
  points: integer("points").notNull().default(0),
  position: integer("position").notNull().default(1),
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas and types for the new tables
export const insertScheduledMatchSchema = createInsertSchema(scheduledMatches).omit({
  id: true,
  createdAt: true,
});

export const insertMatchResultSchema = createInsertSchema(matchResults).omit({
  id: true,
  createdAt: true,
  matchDate: true,
}).extend({
  team1Score: z.number().min(0),
  team2Score: z.number().min(0),
});

export const insertGroupConfigurationSchema = createInsertSchema(groupConfiguration).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGroupStandingsSchema = createInsertSchema(groupStandings).omit({
  id: true,
  lastUpdated: true,
});

export type InsertScheduledMatch = z.infer<typeof insertScheduledMatchSchema>;
export type ScheduledMatch = typeof scheduledMatches.$inferSelect;

export type InsertMatchResult = z.infer<typeof insertMatchResultSchema>;
export type MatchResult = typeof matchResults.$inferSelect;

export type InsertGroupConfiguration = z.infer<typeof insertGroupConfigurationSchema>;
export type GroupConfiguration = typeof groupConfiguration.$inferSelect;

export type InsertGroupStandings = z.infer<typeof insertGroupStandingsSchema>;
export type GroupStandings = typeof groupStandings.$inferSelect;

// Stage 2 Bracket - Plasa Stage 2 cu 10 echipe
export const stage2Bracket = pgTable("stage2_bracket", {
  id: serial("id").primaryKey(),
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  team1Score: integer("team1_score"), // null dacă meciul nu a fost jucat
  team2Score: integer("team2_score"), // null dacă meciul nu a fost jucat
  winnerName: text("winner_name"), // numele echipei câștigătoare
  bracketPosition: integer("bracket_position").notNull(), // poziția în plasă (1-5 pentru 5 meciuri)
  isPlayed: boolean("is_played").notNull().default(false),
  streamUrl: text("stream_url"), // link către stream/faceit
  technicalWin: boolean("technical_win").notNull().default(false),
  technicalWinner: text("technical_winner"),
  tournamentId: text("tournament_id").notNull().default("hator-cs-league"),
  matchDate: timestamp("match_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStage2BracketSchema = createInsertSchema(stage2Bracket).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStage2Bracket = z.infer<typeof insertStage2BracketSchema>;
export type Stage2Bracket = typeof stage2Bracket.$inferSelect;

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
